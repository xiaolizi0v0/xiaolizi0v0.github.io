/**
 * 影视剧观影存储时间胶囊 - 同名词条搜索代理
 *
 * 用途：百度百科的 searchui/suggest 接口（返回同名词条全列表）无 CORS 头，
 *      纯静态前端无法跨域调用。本 Worker 作为转发代理，加上 CORS 头返回给前端。
 *
 * 部署方式：
 *   1. 打开 https://deploy.workers.cloudflare.com/
 *   2. 用 GitHub 账号授权，选择本仓库（或手动粘贴本文件内容创建 Worker）
 *   3. 部署后得到域名 https://xxxx.workers.dev
 *   4. 在工具页面的"开启代理"输入框中粘贴该域名
 */

export default {
  async fetch(request) {
    // 仅允许 GET
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method Not Allowed' }, 405);
    }

    const url = new URL(request.url);
    const target = url.searchParams.get('url');
    if (!target) {
      return jsonResponse({ error: '缺少 url 参数' }, 400);
    }

    // 安全校验：只允许转发百度百科接口，防止被滥用为开放代理
    const allowList = [
      'https://baike.baidu.com/api/',
      'https://suggestion.baidu.com/su'
    ];
    if (!allowList.some(p => target.startsWith(p))) {
      return jsonResponse({ error: '目标地址不在白名单内' }, 403);
    }

    try {
      const resp = await fetch(target, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          'Referer': 'https://baike.baidu.com/',
          'Accept': 'application/json, text/plain, */*'
        }
      });
      const body = await resp.text();
      // 返回时带上 CORS 头，前端即可跨域读取
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

function jsonResponse(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
