(function(root){'use strict';
const node=typeof module!=='undefined'&&module.exports,D=node?require('./content.js'):root.WarmData,C=node?require('./main-story-content.js'):root.WarmMainStoryContent,stories=C.build(D),originals=C.build(D,1);
const int=(n,a=0,b=1e9)=>Number.isSafeInteger(n)&&n>=a&&n<=b,obj=v=>!!v&&typeof v==='object'&&!Array.isArray(v),copy=v=>JSON.parse(JSON.stringify(v)),keys=(v,list)=>obj(v)&&Object.keys(v).length===list.length&&list.every(k=>Object.hasOwn(v,k));
function story(id,edition){const latest=stories.find(s=>s.id===id);if(edition===undefined||edition===latest?.edition)return latest;return edition===1?originals.find(s=>s.id===id):undefined;}
const fresh=()=>({version:2,bookmarks:{},records:{},nextSession:1,session:null,auto:false,font:1});
function migrate(s){
 if(!s.novel){s.novel=fresh();for(const d of originals)if(d.id<s.main)s.novel.records[d.id]={legacy:true,choices:{},edition:1};return;}
 const v=s.novel;if(v.version===1){for(const b of Object.values(v.bookmarks))b.edition=1;for(const r of Object.values(v.records))r.edition=1;if(v.session)v.session.edition=1;v.version=2;}
}
function choicesValid(v,d,before=d.beats.length){return obj(v)&&Object.entries(v).every(([k,c])=>String(Number(k))===k&&int(Number(k),0,before-1)&&!!d.beats[k]?.options&&int(c,0,1));}
function markValid(v,d,version){return keys(v,version===1?['line','choices']:['line','choices','edition'])&&int(v.line,0,d.beats.length-1)&&choicesValid(v.choices,d,v.line)&&d.beats.slice(0,v.line).every((b,i)=>!b.options||Object.hasOwn(v.choices,i));}
function valid(v,s){if(v===undefined)return true;if(!keys(v,['version','bookmarks','records','nextSession','session','auto','font'])||![1,2].includes(v.version)||!obj(v.bookmarks)||!obj(v.records)||!int(v.nextSession,1)||typeof v.auto!=='boolean'||!int(v.font,0,2))return false;
 const resolve=(id,value)=>v.version===1?story(id,1):int(value?.edition,1,2)?story(id,value.edition):undefined;
 for(const[k,b]of Object.entries(v.bookmarks)){const d=resolve(Number(k),b);if(String(Number(k))!==k||!d||d.id>s.main||!markValid(b,d,v.version))return false;}
 for(const[k,r]of Object.entries(v.records)){const d=resolve(Number(k),r);if(String(Number(k))!==k||!d||d.id>=s.main||!keys(r,v.version===1?['legacy','choices']:['legacy','choices','edition'])||typeof r.legacy!=='boolean'||!choicesValid(r.choices,d)||!r.legacy&&!d.beats.every((b,i)=>!b.options||Object.hasOwn(r.choices,i)))return false;}
 const q=v.session;if(q===null)return true;const d=resolve(q?.stage,q),b=v.bookmarks[q?.stage],mark=q&&{line:q.line,choices:q.choices,...(v.version===2?{edition:q.edition}:{})};return keys(q,v.version===1?['id','stage','line','choices']:['id','stage','line','choices','edition'])&&int(q.id,1)&&q.id===v.nextSession-1&&!!d&&d.id<=s.main&&!!b&&markValid(mark,d,v.version)&&b.line===q.line&&(v.version===1||b.edition===q.edition)&&JSON.stringify(b.choices)===JSON.stringify(q.choices);
}
function line(q){if(!q)return null;const b=story(q.stage,q.edition??1)?.beats[q.line];if(!b)return null;return{...b,text:b.text??b.texts[q.choices[b.replyTo]],selected:b.options?q.choices[q.line]:undefined};}
function history(q){const d=story(q.stage,q.edition??1);return d.beats.slice(0,q.line+1).map((b,i)=>({...b,text:b.text??b.texts[q.choices[b.replyTo]],selected:b.options?q.choices[i]:undefined,index:i}));}
function bookmark(v){const q=v.session;v.bookmarks[q.stage]={line:q.line,choices:copy(q.choices),edition:q.edition};}
function install(Game){
 Game.prototype.novelOpen=function(id,restart=false){const d=story(id),v=this.s.novel;if(!d||id>this.s.main||typeof restart!=='boolean')return this.fail('请先完成前面的主线');if(v.session?.stage===id&&!restart)return{ok:true,resumed:true};if(v.nextSession>=1e9)return this.fail('阅读次数已达上限');const b=!restart&&v.bookmarks[id]||{line:0,choices:{},edition:d.edition};v.session={id:v.nextSession++,stage:id,line:b.line,choices:copy(b.choices),edition:b.edition};bookmark(v);return{ok:true,resumed:b.line>0};};
 Game.prototype.novelChoose=function(id,index,choice){const v=this.s.novel,q=v.session;if(!q||q.id!==id||q.line!==index||!story(q.stage,q.edition).beats[index]?.options||!int(choice,0,1))return this.fail('这次回应已变化，请重新查看');q.choices[index]=choice;q.line++;bookmark(v);return{ok:true};};
 Game.prototype.novelNext=function(id,index){const v=this.s.novel,q=v.session;if(!q||q.id!==id||q.line!==index)return this.fail('阅读位置已变化');const d=story(q.stage,q.edition),b=d.beats[q.line];if(b.options)return this.fail('请先选择你的回应');if(q.line<d.beats.length-1){q.line++;bookmark(v);return{ok:true};}const xp=this.passActive()?30:20;if(q.stage===this.s.main&&(this.s.gems+20>1e14||this.s.xp+xp>1e14))return this.fail('奖励数值已达上限');const r=this.stage(q.stage);if(!r.ok)return r;v.records[q.stage]??={legacy:false,choices:copy(q.choices),edition:q.edition};delete v.bookmarks[q.stage];v.session=null;return{...r,completed:true};};
 Game.prototype.novelSkip=function(id){const v=this.s.novel,q=v.session;if(!q||q.id!==id||q.stage>=this.s.main||!v.records[q.stage])return this.fail('首次阅读请逐句完成，已读剧情可跳过');delete v.bookmarks[q.stage];v.session=null;return{ok:true,completed:true,first:false,skipped:true};};
 Game.prototype.novelSetting=function(key,value){if(key==='auto'&&typeof value==='boolean'||key==='font'&&int(value,0,2)){this.s.novel[key]=value;return{ok:true};}return this.fail('阅读设置不正确');};
}
const api={stories,story,line,history,fresh,migrate,valid,install};if(node)module.exports=api;else root.WarmMainStory=api;
})(typeof window==='undefined'?globalThis:window);
