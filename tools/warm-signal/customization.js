(function(root){
'use strict';
const D=typeof module!=='undefined'&&module.exports?require('./content.js'):root.WarmData;
const copy=v=>JSON.parse(JSON.stringify(v)),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const boards=[{name:'晴日信笺',note:'基础展示板',need:()=>true},{name:'原木窗边',note:'完成主线第一章解锁',need:s=>s.main>=D.gates.firstChapter},{name:'潮声留白',note:'唐梨直播粉丝达到 200 解锁',need:s=>s.live.fans>=200}];
const frames=['温柔相框','拍立得','圆形回忆','拱门时光'];
const lights=['窗边暖光','细雨玻璃','流动水光','彩虹棱镜'];
const decorations=[{icon:'✿',name:'小雏菊'},{icon:'♡',name:'手写心意'},{icon:'✦',name:'小星光'},{icon:'☾',name:'月亮'},{icon:'✉',name:'来信'},{icon:'leaf',name:'银杏叶'},{icon:'bow',name:'丝带结'},{icon:'camera',name:'小相机'}];
const frame=(cardId=0)=>({cardId,style:0,x:50,y:45,scale:1,angle:0,flip:false,layer:0,crop:{x:0,y:0,zoom:1}});
const fresh=()=>({p:0,theme:0,board:0,frames:[frame()],lights:[],decor:[],plans:[],published:null});
const snapshot=s=>copy({p:s.p,theme:s.theme,board:s.board,frames:s.frames,lights:s.lights,decor:s.decor});
const objects=s=>['frames','lights','decor'].flatMap(kind=>s[kind].map((item,index)=>({kind,index,item}))).sort((a,b)=>a.item.layer-b.item.layer);
function normalizeLayers(s){objects(s).forEach(({item},i)=>item.layer=i);}
function migrate(s,owned){
 const n=copy(s);
 if(!n.frames){const card=owned.find(c=>D.cards[c.id].p===n.p)||owned[0];n.board=0;n.frames=card?[frame(card.id)]:[];n.lights=[];n.plans=[];n.published=null;}
 n.decor=n.decor.map((d,i)=>({scale:1,angle:0,flip:false,layer:n.frames.length+n.lights.length+i,...d}));
 normalizeLayers(n);return n;
}
const integer=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
const number=(v,a,b)=>Number.isFinite(v)&&v>=a&&v<=b;
const objectValid=o=>o&&number(o.x,0,100)&&number(o.y,0,100)&&number(o.scale,.35,1.8)&&number(o.angle,-180,180)&&typeof o.flip==='boolean'&&integer(o.layer,0,39);
function designValid(s,owned){
 if(!s||!integer(s.p,0,D.characters.length-1)||!integer(s.theme,0,2)||!integer(s.board,0,2))return false;
 if(!Array.isArray(s.frames)||s.frames.length>5||!Array.isArray(s.lights)||s.lights.length>5||!Array.isArray(s.decor)||s.decor.length>30)return false;
 if(!s.frames.every(f=>objectValid(f)&&owned.some(c=>c.id===f.cardId)&&integer(f.style,0,3)&&f.crop&&number(f.crop.x,-50,50)&&number(f.crop.y,-50,50)&&number(f.crop.zoom,1,3)))return false;
 if(!s.lights.every(l=>objectValid(l)&&integer(l.type,0,3)&&number(l.opacity,.1,1)))return false;
 if(!s.decor.every(d=>objectValid(d)&&decorations.some(v=>v.icon===d.icon)))return false;
 const layers=objects(s).map(o=>o.item.layer);return new Set(layers).size===layers.length;
}
function valid(s,owned){
 // Accept the first release's small display schema without discarding its player progress.
 if(s&&s.frames===undefined)return integer(s.p,0,5)&&integer(s.theme,0,2)&&Array.isArray(s.decor)&&s.decor.length<=10&&s.decor.every(d=>decorations.slice(0,5).some(v=>v.icon===d.icon)&&number(d.x,0,100)&&number(d.y,0,100))&&s.plans===undefined&&s.published===undefined;
 return designValid(s,owned)&&Array.isArray(s.plans)&&s.plans.length<=6&&s.plans.every(p=>p&&typeof p.name==='string'&&p.name.trim().length>0&&p.name.length<=20&&designValid(p.design,owned))&&(s.published===null||designValid(s.published,owned));
}
function install(Game){
 Game.prototype.spaceSnapshot=function(){return snapshot(this.s.space);};
 Game.prototype.spaceReplace=function(design){if(!designValid(design,this.s.cards)||!boards[design.board].need(this.s))return this.fail('展示方案无效或展示板尚未解锁');Object.assign(this.s.space,copy(design));return{ok:true};};
 Game.prototype.spaceBoard=function(id){if(!integer(id,0,2)||!boards[id].need(this.s))return this.fail(boards[id]?.note||'无效展示板');this.s.space.board=id;return{ok:true};};
 Game.prototype.spaceAdd=function(kind,value){
  const s=this.s.space;let item;
  if(kind==='frames'){if(s.frames.length>=5)return this.fail('最多放置 5 个展示框');if(!integer(value,0,D.cards.length-1)||!this.own(value))return this.fail('只能展示已拥有的羁绊');item=frame(value);s.p=D.cards[value].p;}
  else if(kind==='lights'){if(s.lights.length>=5)return this.fail('最多叠加 5 个光影');if(!integer(value,0,3))return this.fail('无效光影');item={type:value,x:50,y:40,scale:1,angle:0,flip:false,opacity:.65};}
  else if(kind==='decor'){if(s.decor.length>=30)return this.fail('最多放置 30 件饰品');if(!decorations.some(d=>d.icon===value))return this.fail('无效饰品');item={icon:value,x:50,y:65,scale:1,angle:0,flip:false};}
  else return this.fail('无效素材');
  item.layer=objects(s).length;s[kind].push(item);return{ok:true,selection:{kind,index:s[kind].length-1}};
 };
 Game.prototype.spaceObject=function(kind,index,patch){
  const s=this.s.space,item=s[kind]?.[index];if(!['frames','lights','decor'].includes(kind)||!item||!patch||typeof patch!=='object'||Array.isArray(patch))return this.fail('请先选择一个素材');
  const allowed=['x','y','scale','angle','flip',...(kind==='frames'?['cardId','style','crop']:kind==='lights'?['type','opacity']:[])];
  if(!Object.keys(patch).every(k=>allowed.includes(k)))return this.fail('无效编辑参数');
  const next=snapshot(s);Object.assign(next[kind][index],copy(patch));if(!designValid(next,this.s.cards))return this.fail('调整范围无效');if(kind==='frames'&&patch.cardId!==undefined)next.p=D.cards[patch.cardId].p;Object.assign(s,next);return{ok:true};
 };
 Game.prototype.spaceAction=function(kind,index,action){
  const s=this.s.space,item=s[kind]?.[index];if(!['frames','lights','decor'].includes(kind)||!item)return this.fail('请先选择一个素材');
  if(action==='delete'){s[kind].splice(index,1);normalizeLayers(s);return{ok:true,selection:null};}
  if(action==='duplicate'){if(s[kind].length>=(kind==='decor'?30:5))return this.fail('这一类素材已经达到数量上限');const n=copy(item);n.x=clamp(n.x+6,0,100);n.y=clamp(n.y+6,0,100);n.layer=objects(s).length;s[kind].push(n);return{ok:true,selection:{kind,index:s[kind].length-1}};}
  if(action==='flip'){item.flip=!item.flip;return{ok:true};}
  if(action==='front'||action==='back'){const order=objects(s),at=order.findIndex(o=>o.kind===kind&&o.index===index),to=action==='front'?at+1:at-1;if(to<0||to>=order.length)return this.fail(action==='front'?'已在最上层':'已在最下层');[order[at],order[to]]=[order[to],order[at]];order.forEach(({item},i)=>item.layer=i);return{ok:true};}
  return this.fail('无效编辑操作');
 };
 Game.prototype.spaceTemplate=function(id){
  if(!integer(id,0,2)||!boards[id].need(this.s))return this.fail(boards[id]?.note||'无效灵感方案');
  const s=this.s.space,n=snapshot(fresh()),card=this.own(s.frames[0]?.cardId)||this.s.cards[0];n.board=id;
  if(!card)return this.fail('先获得一张羁绊');n.frames[0].cardId=card.id;n.p=D.cards[card.id].p;n.frames[0].style=id===0?1:id===1?3:2;n.frames[0].scale=.9;n.frames[0].angle=id===0?-6:0;
  n.decor=[{icon:id===2?'☾':'leaf',x:20,y:72,scale:1,angle:-20,flip:false,layer:1},{icon:'✉',x:77,y:82,scale:.8,angle:12,flip:false,layer:2},{icon:'♡',x:78,y:20,scale:.7,angle:0,flip:false,layer:3}];
  n.lights=[{type:id===2?2:0,x:65,y:30,scale:1,angle:0,flip:false,layer:4,opacity:.5}];Object.assign(s,n);return{ok:true,selection:{kind:'frames',index:0}};
 };
 Game.prototype.spaceSavePlan=function(slot,name){
  const s=this.s.space;name=String(name||'').trim();if(!name||name.length>20)return this.fail('方案名需要 1～20 个字');
  if(slot===null){if(s.plans.length>=6)return this.fail('已有 6 个方案，请选择一个方案覆盖保存');slot=s.plans.length;}else if(!integer(slot,0,s.plans.length-1))return this.fail('无效方案位置');
  s.plans[slot]={name,design:snapshot(s)};return{ok:true,slot};
 };
 Game.prototype.spaceLoadPlan=function(slot){const plan=this.s.space.plans[slot];if(!integer(slot,0,5)||!plan)return this.fail('方案不存在');return this.spaceReplace(plan.design);};
 Game.prototype.spacePublish=function(home=true){this.s.space.published=snapshot(this.s.space);if(home)this.s.settings.home='space';return{ok:true};};
}
const C={boards,frames,lights,decorations,fresh,migrate,valid,designValid,snapshot,objects,install};
if(typeof module!=='undefined'&&module.exports)module.exports=C;else root.WarmSpace=C;
})(typeof window==='undefined'?globalThis:window);
