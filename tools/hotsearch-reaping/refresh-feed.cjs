'use strict';
const fs=require('node:fs'),path=require('node:path');
const SOURCE='https://weibo.com/ajax/side/hotSearch';
async function refresh(){
  const response=await fetch(SOURCE,{headers:{'User-Agent':'Mozilla/5.0','Accept':'application/json','Referer':'https://s.weibo.com/'},signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw Error('微博接口返回 '+response.status);
  const json=await response.json();const rows=json?.data?.realtime;
  if(!Array.isArray(rows)||rows.length<5)throw Error('接口未提供可用榜单');
  const items=rows.filter(x=>x.word&&!x.is_ad).slice(0,50).map((x,i)=>({rank:i+1,title:String(x.word).slice(0,100),heat:Number(x.num)||0,tag:x.is_boom?'爆':x.is_hot?'热':x.is_new?'新':x.icon_desc||'',url:'https://s.weibo.com/weibo?q='+encodeURIComponent(x.word)}));
  const feed={version:1,status:'live',source:'微博公开热搜接口',sourceUrl:SOURCE,obtainedAt:new Date().toISOString(),items};
  fs.writeFileSync(path.join(__dirname,'feed.json'),JSON.stringify(feed,null,2));return feed;
}
if(require.main===module)refresh().then(f=>console.log(JSON.stringify({ok:true,count:f.items.length,obtainedAt:f.obtainedAt,first:f.items[0].title}))).catch(e=>{console.log(JSON.stringify({ok:false,message:e.message}));process.exitCode=1;});
module.exports={refresh};
