/**
 * 百度百科同名词条搜索代理（完整版）
 *
 * 用途：百度百科的 searchui/suggest 接口（返回同名词条全列表）无 CORS 头，
 *      纯静态前端无法跨域调用。本 Worker 作为转发代理，加上 CORS 头返回给前端。
 *
 * 增强：searchui/suggest 接口本身返回不全（"迷墙"页面有 6 个同名词条，接口只返回几个），
 *      因此额外抓取词条页 HTML，用正则提取完整的 lemmas 数组（含 classify 分类），合并返回。
 *
 * 部署方式：
 *   1. 打开 https://dash.cloudflare.com/?to=/:account/workers/new
 *   2. 新建 Worker，粘贴本代码，点 Deploy
 *   3. 得到域名 https://xxxx.workers.dev
 *   4. 在工具页面的"开启代理"弹窗中输入框粘贴该域名，点"保存并启用"
 */

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
  'Referer': 'https://baike.baidu.com/',
  'Accept': 'application/json, text/plain, */*'
};

export default {
  async fetch(request) {
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }
    const url = new URL(request.url);
    const target = url.searchParams.get('url');
    if (!target) {
      return jsonResponse({ error: '缺少 url 参数' }, 400);
    }
    const allowList = [
      'https://baike.baidu.com/api/',
      'https://suggestion.baidu.com/su'
    ];
    if (!allowList.some(p => target.startsWith(p))) {
      return jsonResponse({ error: '目标地址不在白名单内' }, 403);
    }
    try {
      // suggest 请求 → 合并完整同名词条列表
      if (target.includes('/api/searchui/suggest')) {
        return await handleSuggest(target);
      }
      // 其他白名单接口直接透传
      const resp = await fetch(target, { headers: HEADERS });
      const body = await resp.text();
      return new Response(body, {
        status: resp.status,
        headers: {
          'Content-Type': resp.headers.get('Content-Type') || 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store'
        }
      });
    } catch (e) {
      return jsonResponse({ error: '代理请求失败: ' + e.message }, 502);
    }
  }
};

// 合并 suggest 结果与词条页 HTML 里的完整同名词条列表
async function handleSuggest(target) {
  const wd = new URL(target).searchParams.get('wd') || '';

  // URL 规范化：解码 search 参数让 fetch 重新编码，避免双重编码
  const normalized = new URL(target);
  for (const [k, v] of [...normalized.searchParams]) {
    try { normalized.searchParams.set(k, decodeURIComponent(v)); } catch (e) {}
  }

  let suggestList = [];
  try {
    const s = await fetch(normalized.toString(), { headers: HEADERS });
    if (s.ok) {
      const data = await s.json();
      suggestList = data.list || [];
    }
  } catch (e) {}

  let lemmas = [];
  try {
    const pageUrl = 'https://baike.baidu.com/item/' + encodeURIComponent(wd);
    const p = await fetch(pageUrl, { headers: HEADERS });
    if (p.ok) {
      const html = await p.text();
      const patterns = [
        /"lemmas":(\[.*?\]),"categoryList"/,
        /"lemmas":(\[.*?\]),"navigation"/
      ];
      for (const p2 of patterns) {
        const m = html.match(p2);
        if (m) {
          try { lemmas = JSON.parse(m[1]); break; } catch (e) {}
        }
      }
    }
  } catch (e) {}

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

  const list = [...map.values()];
  return jsonResponse({
    word: wd,
    list: list,
    debug: { suggestCount: suggestList.length, lemmasCount: lemmas.length, mergedCount: list.length }
  });
}

function jsonResponse(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' }
  });
}