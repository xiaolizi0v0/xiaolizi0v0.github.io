'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {refresh}=require('./refresh-feed.cjs');
let pending=null,lastAttempt=0,lastError='',cache=JSON.parse(fs.readFileSync(path.join(__dirname,'feed.json'),'utf8'));
http.createServer(async(req,res)=>{
  const origin=req.headers.origin||'';
  if(origin&&!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)){res.writeHead(403);res.end('Local origins only');return;}
  res.setHeader('Access-Control-Allow-Origin',origin||'http://127.0.0.1:8765');res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
  if(req.method!=='GET'||!['/feed','/health'].includes(req.url.split('?')[0])){res.writeHead(404);res.end(JSON.stringify({error:'Not found'}));return;}
  if(req.url.startsWith('/health')){res.end(JSON.stringify({ok:true,service:'hotsearch-readonly'}));return;}
  if(!pending&&Date.now()-lastAttempt>(req.url.includes('refresh=1')?15000:120000)){lastAttempt=Date.now();pending=refresh().then(f=>{cache=f;lastError='';}).catch(e=>{lastError=e.message;}).finally(()=>pending=null);}
  if(pending)await pending;
  res.end(JSON.stringify({...cache,status:lastError?'snapshot':cache.status,error:lastError}));
}).listen(8767,'127.0.0.1',()=>console.log('Read-only hot search feed: http://127.0.0.1:8767/feed'));
