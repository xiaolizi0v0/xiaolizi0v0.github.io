/**
 * 百度百科同名词条搜索 - 浏览器代理（Node.js，无需 npm 依赖）
 *
 * 原理：百度对脚本/服务器请求（curl、Node fetch、数据中心 IP）实施安全验证，
 *      但真实浏览器指纹能通过。本脚本用系统已安装的 Chrome/Edge 无头模式
 *      （--headless --dump-dom）渲染百度词条页，执行 JS 后输出完整 DOM，
 *      再提取 lemmas 数组（完整同名词条列表），加 CORS 头返回给前端。
 *
 * 使用方式：
 *   1. 电脑需安装 Node.js + Chrome 或 Edge（Windows 自带 Edge）
 *   2. 双击 start-proxy.bat（或 node local-proxy.js）
 *   3. 页面填代理地址：http://127.0.0.1:25100
 *
 * 注意：每请求一次会启动一次无头浏览器（约 2-5 秒），适合低频使用。
 */

const http = require('http');
const { execFile } = require('child_process');
const { URL } = require('url');

const PORT = 25100;

// 自动探测 Chrome / Edge 路径
function findBrowser() {
  const path = require('path');
  const candidates = [
    path.join(process.env.PROGRAMFILES || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env['PROGRAMFILES(X86)'] || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env['PROGRAMFILES(X86)'] || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    path.join(process.env.PROGRAMFILES || '', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/microsoft-edge'
  ];
  const fs = require('fs');
  for (const p of candidates) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}
const BROWSER = findBrowser();

// 用无头浏览器渲染 URL（失败自动重试 2 次，Chrome 偶发启动异常）
async function browserDump(urlStr) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const out = await browserDumpOnce(urlStr);
      if (out && out.length > 1000) return out;
    } catch (e) {}
    // 短延迟后重试
    await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
  }
  throw new Error('浏览器抓取失败（已重试 3 次）');
}

function browserDumpOnce(urlStr) {
  return new Promise((resolve, reject) => {
    if (!BROWSER) {
      return reject(new Error('未找到 Chrome/Edge，请安装浏览器后重试'));
    }
    // --user-data-dir 独立实例：避免 Chrome 已运行时 --dump-dom 被交给现有进程导致无输出
    const path = require('path');
    const tmpDir = path.join(require('os').tmpdir(), 'baike-proxy-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8));
    const args = [
      '--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
      '--user-data-dir=' + tmpDir,
      '--virtual-time-budget=6000',
      '--dump-dom',
      urlStr
    ];
    execFile(BROWSER, args, { maxBuffer: 20 * 1024 * 1024, encoding: 'utf8', timeout: 30000 }, (err, stdout, stderr) => {
      // 清理临时目录
      try { require('fs').rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
      if (err) {
        // 部分版本 --dump-dom 会返回非零退出码但仍输出内容
        if (stdout && stdout.length > 1000) return resolve(stdout);
        return reject(new Error('浏览器抓取失败: ' + (err.message || '') + (stderr || '').slice(0, 200)));
      }
      resolve(stdout);
    });
  });
}

// 从详情页 HTML 提取基本信息卡，首选 window.PAGE_DATA 结构化 JSON（最稳定），
// 兜底用 HTML 版(itemName_igbyC) 或 JSON 版 DOM 正则
function extractBasicInfo(html) {
  const card = [];

  // 1) 首选：PAGE_DATA 里的 card 结构 {"type":3,"content":[{"key":"...","title":"字段名","data":[{"dataType":"text","text":[{"tag":"text","text":"值"}]}]}]}
  const start = html.indexOf('PAGE_DATA=');
  if (start > -1) {
    let s = html.slice(start + 'PAGE_DATA='.length);
    let depth = 0, inStr = false, end = -1;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (inStr) {
        if (c === '\\') i++;
        else if (c === '"') inStr = false;
      } else if (c === '"') inStr = true;
      else if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end > -1) {
      try {
        const obj = JSON.parse(s.slice(0, end + 1));
        const cardObj = obj.card || {};
        // 兼容两种结构：content（旧版单栏） 和 left/right（新版分栏）
        const groups = [];
        if (Array.isArray(cardObj.content)) groups.push(cardObj.content);
        if (Array.isArray(cardObj.left)) groups.push(cardObj.left);
        if (Array.isArray(cardObj.right)) groups.push(cardObj.right);
        for (const content of groups) {
          for (const c of content) {
            const name = (c.title || '').replace(/\s+/g, ' ').trim();
            if (!name || !Array.isArray(c.data)) continue;
            const vals = [];
            for (const d of c.data) {
              const text = d.text || [];
              for (const t of text) {
                if (t && t.text) vals.push(t.text);
              }
            }
            if (vals.length) card.push({ name, value: [vals.join(' ').replace(/\s+/g, ' ').trim()] });
          }
        }
        if (card.length) return card;
      } catch (e) {}
    }
  }

  // 2) HTML 版
  if (html.includes('itemName_igbyC')) {
    const blocks = [...html.matchAll(/itemName_igbyC">([^<]*)<\/dt><dd[^>]*>([\s\S]*?)<\/dd>/g)];
    for (const m of blocks) {
      const name = m[1].replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
      const spans = [...m[2].matchAll(/J-lemma-content-lemma-text"[^>]*>([\s\S]*?)<\/span>/g)].map(x => x[1]);
      const val = spans.map(s => s.replace(/<[^>]*>/g, '')).join(' ').replace(/\s+/g, ' ').trim();
      if (name && val) card.push({ name, value: [val] });
    }
    return card;
  }

  // 3) JSON 版 DOM
  const blocks = [...html.matchAll(/"title":"([^"]+)"[\s\S]{0,150}?"data":\[([\s\S]*?)\](?=,"[a-z]"|\}\})/g)];
  for (const m of blocks) {
    const name = m[1].replace(/\s+/g, ' ').trim();
    // text 和 innerlink 两种标签都提取（innerlink 是链接文本）
    const vals = [...m[2].matchAll(/"(?:tag":"text|lemmaId":\d+,"tag":"innerlink)","text":"([^"]+)"/g)].map(x => x[1]);
    if (name && vals.length) card.push({ name, value: [vals.join(' ').replace(/\s+/g, ' ').trim()] });
  }
  return card;
}

// 合并 suggest 结果与词条页 DOM 的完整同名词条列表
async function handleSuggest(wd) {
  let suggestList = [];
  try {
    // suggest 接口用普通 fetch（无头浏览器抓 JSON 太重，curl 能过 suggest 的风控）
    const out = await fetch('https://baike.baidu.com/api/searchui/suggest?wd=' + encodeURIComponent(wd), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://baike.baidu.com/'
      }
    });
    if (out.ok) {
      const d = await out.json();
      suggestList = (d && d.list) || [];
    }
  } catch (e) {}

  let lemmas = [];
  let pageInfo = { status: 'ok', size: 0, hasLemmas: false };
  try {
    const html = await browserDump('https://baike.baidu.com/item/' + encodeURIComponent(wd));
    pageInfo.size = html.length;
    pageInfo.hasLemmas = html.includes('lemmas');
    pageInfo.verify = html.includes('百度安全验证');
    const patterns = [
      /"lemmas":(\[.*?\]),"categoryList"/,
      /"lemmas":(\[.*?\]),"navigation"/
    ];
    for (const p of patterns) {
      const m = html.match(p);
      if (m) { try { lemmas = JSON.parse(m[1]); break; } catch (e) {} }
    }
  } catch (e) { pageInfo.status = 'error: ' + e.message; }

  // 以 DOM lemmas 为准（完整），suggest 补充封面图
  const map = new Map();
  lemmas.forEach(l => {
    if (!l || !l.lemmaId) return;
    map.set(String(l.lemmaId), {
      lemmaId: l.lemmaId,
      lemmaTitle: l.lemmaTitle || wd,
      lemmaDesc: l.lemmaDesc || '',
      classify: Array.isArray(l.classify) ? l.classify : [],
      abstractPic: ''
    });
  });
  suggestList.forEach(s => {
    if (!s || !s.lemmaId) return;
    const key = String(s.lemmaId);
    const ex = map.get(key);
    if (ex) {
      if (!ex.abstractPic && s.abstractPic) ex.abstractPic = s.abstractPic;
    } else {
      map.set(key, {
        lemmaId: s.lemmaId,
        lemmaTitle: s.lemmaTitle || wd,
        lemmaDesc: s.lemmaDesc || '',
        classify: [],
        abstractPic: s.abstractPic || ''
      });
    }
  });

  // 补全：对每个影视条目用无头浏览器抓详情页，提取封面/完整简介/完整词条名/基本信息卡
  // 串行 + 限制最多 MAX_FILL 个（避免开多个 chrome 实例卡死）
  const VIDEO_CLASS = /影视作品|电影|电视剧|动漫|动画|综艺|纪录片/;
  const MAX_FILL = 4;
  const items = [...map.values()];
  // 影视类条目全部补全（拿 card/genre/region/封面），无论 suggest 是否已带封面
  const toFill = items.filter(it => (VIDEO_CLASS.test((it.classify || []).join(' ')) || /电影|剧|动画|综艺|纪录片/.test(it.lemmaDesc)) && !it.card).slice(0, MAX_FILL);
  for (const it of toFill) {
    try {
      // 保存原始短描述（补全后会被完整简介覆盖，genre 兜底要用短描述避免误判）
      it.origDesc = it.lemmaDesc || '';
      const html = await browserDump('https://baike.baidu.com/item/' + encodeURIComponent(it.lemmaTitle) + '/' + it.lemmaId);
      const ogM = html.match(/<meta property="og:image" content="([^"]+)"/);
      const imgM = html.match(/"image":"([^"]+)"/);
      const descM = html.match(/<meta name="description" content="([^"]+)"/);
      const titleM = html.match(/<title>([^<]*)_百度百科<\/title>/);
      const img = ogM ? ogM[1] : (imgM ? imgM[1] : '');
      if (img) it.abstractPic = img;
      if (descM && descM[1]) it.lemmaDesc = descM[1];
      if (titleM && titleM[1]) it.fullTitle = titleM[1].trim();
      // 基本信息卡：兼容 HTML 版(itemName_igbyC) 和 JSON 版("name":"...","data":[{"text":[{"tag":"text","text":"值"}]}])
      it.card = extractBasicInfo(html);
    } catch (e) {}
  }

  // 组装成 card API 格式 + 补充解析字段（题材/地区/年份/平台），前端直接展示
  const list = items.map(it => {
    // 从 card 数组解析补充字段
    const card = it.card || [];
    // 匹配时字段名去空格（百度常见"类 型""导 演"）
    const findVal = (names) => {
      for (const c of card) {
        const cName = (c.name || '').replace(/\s+/g, '');
        for (const n of names) {
          if (cName.includes(n) && c.value && c.value[0]) return c.value[0];
        }
      }
      return '';
    };
    // 题材：只取 card"类型/题材"字段（不兜底猜，避免误判）
    let genre = findVal(['类型', '题材', '作品类型', '影片类型', '节目类型']);
    const regionRaw = findVal(['制片地区', '地区', '拍摄地点']);
    const yearRaw = findVal(['上映时间', '首播时间', '播出时间', '发行时间']);

    // 地区映射
    const REGION_MAP = { '中国内地':'国产', '中国大陆':'国产', '内地':'国产', '中国香港':'港台', '香港':'港台', '中国台湾':'港台', '台湾':'港台', '澳门':'港台', '日本':'日韩', '韩国':'日韩', '美国':'欧美', '英国':'欧美', '法国':'欧美', '德国':'欧美', '加拿大':'欧美', '澳大利亚':'欧美', '意大利':'欧美', '西班牙':'欧美', '俄罗斯':'欧美', '印度':'其他', '泰国':'其他', '其他':'其他' };
    let region = '';
    const regionNames = (regionRaw || '').split(/[、，,]/).map(s => s.trim()).filter(Boolean);
    for (const n of regionNames) {
      if (REGION_MAP[n]) { region = REGION_MAP[n]; break; }
      for (const [k, v] of Object.entries(REGION_MAP)) {
        if (n.includes(k)) { region = v; break; }
      }
      if (region) break;
    }
    if (!region && regionNames.length) region = '其他';

    // 年份：只取 card"上映时间/首播时间"（不兜底从简介猜，避免误取简介里的年份）
    let year = '';
    const ym = (yearRaw || '').match(/(19|20)\d{2}/);
    if (ym) year = ym[0];

    // 平台：从"网络播放平台"字段提取平台名，映射成前端 PLATFORM_MAP 标准 key（用于平台徽章颜色）
    let platform = '';
    const PLATFORM_KEY = {
      '爱奇艺':'爱奇艺', 'iqiyi':'爱奇艺', 'iq':'爱奇艺',
      '腾讯视频':'腾讯', '腾讯':'腾讯', 'tencent':'腾讯',
      '优酷':'优酷', '优酷网':'优酷', 'youku':'优酷',
      '哔哩哔哩':'B站', 'bilibili':'B站', 'b站':'B站', '哔哩':'B站',
      '芒果tv':'芒果TV', '芒果TV':'芒果TV', '芒果':'芒果TV',
      '央视':'央视', 'cctv':'央视', '央视八套':'央视', '央视一套':'央视',
      '卫视':'卫视',
      '搜狐':'其他', '乐视':'其他', '西瓜视频':'其他', '抖音':'其他', '快手':'其他'
    };
    const platformRaw = findVal(['网络播放平台', '播出平台', '播放平台']);
    if (platformRaw) {
      const names = platformRaw.split(/[、，,;；]/).map(s => s.trim()).filter(Boolean);
      const stdKeys = [];
      for (const n of names) {
        // 精确匹配或按常见别名识别
        if (PLATFORM_KEY[n]) { stdKeys.push(PLATFORM_KEY[n]); continue; }
        if (/爱奇艺|iqiyi/i.test(n)) stdKeys.push('爱奇艺');
        else if (/腾讯|tencent/i.test(n)) stdKeys.push('腾讯');
        else if (/优酷|youku/i.test(n)) stdKeys.push('优酷');
        else if (/哔哩|bilibili|b站/i.test(n)) stdKeys.push('B站');
        else if (/芒果/i.test(n)) stdKeys.push('芒果TV');
        else if (/央视|cctv/i.test(n)) stdKeys.push('央视');
        else if (/卫视/i.test(n)) stdKeys.push('卫视');
      }
      platform = [...new Set(stdKeys)].join('、');
    }

    // 完整词条名：详情页 title 优先，否则用"基础名（短描述）"构造，确保同名词条能区分
    const shortDesc = (it.origDesc || it.lemmaDesc || '').trim();
    const fullTitle = it.fullTitle || (it.lemmaTitle + (shortDesc ? '（' + shortDesc + '）' : ''));

    const d = {
      id: it.lemmaId,
      title: it.lemmaTitle,
      desc: it.lemmaDesc || '',
      image: it.abstractPic,
      abstract: it.lemmaDesc || '',
      url: 'https://baike.baidu.com/item/' + encodeURIComponent(it.lemmaTitle) + '/' + it.lemmaId,
      card: card,
      classify: it.classify || [],
      fullTitle: fullTitle,
      // 补充解析字段
      genre: genre,
      region: region,
      year: year,
      platform: platform
    };
    return d;
  });

  return {
    word: wd,
    list: list,
    debug: { suggestCount: suggestList.length, lemmasCount: lemmas.length, mergedCount: map.size, filledCount: toFill.length, page: pageInfo }
  };
}

// ========== HTTP 服务 ==========
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, 'http://localhost');
  const target = url.searchParams.get('url');
  if (!target) {
    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: '缺少 url 参数' }));
    return;
  }
  const allowList = ['https://baike.baidu.com/api/', 'https://suggestion.baidu.com/su'];
  if (!allowList.some(p => target.startsWith(p))) {
    res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: '目标地址不在白名单内' }));
    return;
  }

  try {
    // 支持 JSONP：有 callback 参数则包装成 cb({...})，无则返回纯 JSON
    const cb = url.searchParams.get('callback');
    const sendJson = (obj, status) => {
      res.writeHead(status || 200, { 'Content-Type': cb ? 'application/javascript; charset=utf-8' : 'application/json; charset=utf-8' });
      const body = JSON.stringify(obj);
      res.end(cb ? cb + '(' + body + ');' : body);
    };

    if (target.includes('/api/searchui/suggest')) {
      const wd = new URL(target).searchParams.get('wd') || '';
      const result = await handleSuggest(wd);
      // 兼容百度 JSONP 结构：result_code/message 外层包装
      sendJson({ result_code: '1', message: '', ...result });
    } else {
      const body = await browserDump(target);
      if (cb) {
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
        res.end(cb + '(' + JSON.stringify(body) + ');');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(body);
      }
    }
  } catch (e) {
    const cb = url.searchParams.get('callback');
    res.writeHead(502, { 'Content-Type': cb ? 'application/javascript; charset=utf-8' : 'application/json; charset=utf-8' });
    const err = JSON.stringify({ error: '代理请求失败: ' + e.message });
    res.end(cb ? cb + '(' + err + ');' : err);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('========================================');
  console.log('  浏览器代理已启动 (无头 Chrome/Edge)');
  console.log('  浏览器: ' + (BROWSER ? BROWSER : '未找到（请安装 Chrome/Edge）'));
  console.log('  代理地址: http://127.0.0.1:' + PORT);
  console.log('========================================');
  console.log('  在博客页面输入框粘贴上述地址并保存启用');
  console.log('  提示：保持本窗口开着，Ctrl+C 停止');
});
// 端口被占用时给出友好提示，而不是直接崩溃
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('\n[错误] 端口 ' + PORT + ' 已被占用！');
    console.error('可能是之前的代理进程还在运行。解决办法：');
    console.error('  1. 关闭旧的代理窗口');
    console.error('  2. 或在命令行执行：  taskkill /F /PID ' + (process.pid));
    console.error('  3. 或重启电脑后重新双击 start-proxy.bat');
    console.error('也可直接使用当前已运行的代理（无需重复启动）。');
    process.exit(1);
  }
  throw e;
});
