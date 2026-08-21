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

// 用无头浏览器渲染 URL，返回渲染后的 DOM 文本
function browserDump(urlStr) {
  return new Promise((resolve, reject) => {
    if (!BROWSER) {
      return reject(new Error('未找到 Chrome/Edge，请安装浏览器后重试'));
    }
    // --user-data-dir 独立实例：避免 Chrome 已运行时 --dump-dom 被交给现有进程导致无输出
    const path = require('path');
    const tmpDir = path.join(require('os').tmpdir(), 'baike-proxy-' + Date.now());
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

  return {
    word: wd,
    list: [...map.values()],
    debug: { suggestCount: suggestList.length, lemmasCount: lemmas.length, mergedCount: map.size, page: pageInfo }
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
    if (target.includes('/api/searchui/suggest')) {
      const wd = new URL(target).searchParams.get('wd') || '';
      const result = await handleSuggest(wd);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result));
    } else {
      const body = await browserDump(target);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(body);
    }
  } catch (e) {
    res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: '代理请求失败: ' + e.message }));
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
