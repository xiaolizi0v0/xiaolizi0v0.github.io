/**
 * 百度百科同名词条搜索 - 本地代理（Node.js，无需安装依赖）
 *
 * 为什么用 curl：百度对 Node.js 的 TLS 指纹（https.get / fetch）触发"百度安全验证"(403)，
 * 但 curl 的指纹能通过，且你的家庭宽带 IP 访问百度正常。
 * 本脚本通过 child_process 调 curl 抓取百度数据，加上 CORS 头返回给前端。
 *
 * 使用方式：
 *   1. 电脑需安装 Node.js（https://nodejs.org）—— Windows/Mac 自带 curl
 *   2. 在本目录打开终端，运行：node local-proxy.js
 *   3. 看到 "本地代理已启动" 后，保持窗口开着
 *   4. 在博客页面的"同名词条搜索"弹窗输入框粘贴：http://127.0.0.1:8080
 *   5. 点"保存并启用"，之后搜索即可列出全部同名词条
 */

const http = require('http');
const { execFile } = require('child_process');
const { URL } = require('url');

const PORT = 25100;

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// 调系统 curl 抓取（curl 指纹能通过百度反爬）
function curlGet(urlStr) {
  return new Promise((resolve, reject) => {
    const args = [
      '-sSL', '--max-time', '25',
      '-H', 'User-Agent: ' + UA,
      '-H', 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8',
      '-H', 'Referer: https://baike.baidu.com/',
      urlStr
    ];
    execFile('curl', args, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' }, (err, stdout, stderr) => {
      if (err) return reject(new Error(err.message || 'curl 失败'));
      resolve(stdout);
    });
  });
}

// 合并 suggest 结果与词条页 HTML 的完整同名词条列表
async function handleSuggest(wd) {
  let suggestList = [];
  try {
    const out = await curlGet('https://baike.baidu.com/api/searchui/suggest?wd=' + encodeURIComponent(wd));
    const d = JSON.parse(out);
    suggestList = (d && d.list) || [];
  } catch (e) {}

  let lemmas = [];
  let pageInfo = { status: 'ok', size: 0, hasLemmas: false };
  try {
    const html = await curlGet('https://baike.baidu.com/item/' + encodeURIComponent(wd));
    pageInfo.size = html.length;
    pageInfo.hasLemmas = html.includes('lemmas');
    const patterns = [
      /"lemmas":(\[.*?\]),"categoryList"/,
      /"lemmas":(\[.*?\]),"navigation"/
    ];
    for (const p of patterns) {
      const m = html.match(p);
      if (m) { try { lemmas = JSON.parse(m[1]); break; } catch (e) {} }
    }
  } catch (e) { pageInfo.status = 'error: ' + e.message; }

  // 以 HTML lemmas 为准（完整），suggest 补充封面图
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
      const body = await curlGet(target);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(body);
    }
  } catch (e) {
    res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: '代理请求失败: ' + e.message }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('========================================');
  console.log('  本地代理已启动 (curl 模式)');
  console.log('  在博客页面"同名词条搜索"弹窗输入框粘贴：');
  console.log('  http://127.0.0.1:' + PORT);
  console.log('  然后点"保存并启用"');
  console.log('========================================');
  console.log('  提示：保持本窗口开着即可。Ctrl+C 停止。');
});
