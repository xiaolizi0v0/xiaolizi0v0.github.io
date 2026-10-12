(function(root){'use strict';
const node=typeof module!=='undefined'&&module.exports,B=node?require('./birthday.js'):root.WarmBirthday;
const kinds=['frame','title','card','tap'],specs={frame:{name:'纪念头像框',need:5},title:{name:'纪念称号框',need:10},card:{name:'生日静态名片',need:15},tap:{name:'生日点击特效',need:20}},themes=[{name:'花间寄信',color:'#b99777',soft:'#f4e7d6',ink:'#785e47',motif:'flower'},{name:'为你留灯',color:'#929aae',soft:'#e8e7ee',ink:'#626a83',motif:'compass'},{name:'循歌而来',color:'#cd9a89',soft:'#fae5db',ink:'#926b5b',motif:'note'},{name:'晚风共读',color:'#9ca98e',soft:'#e9eddf',ink:'#64755c',motif:'leaf'},{name:'月光烘焙',color:'#c8ac77',soft:'#faf0d8',ink:'#917443',motif:'moon'},{name:'镜头之外',color:'#bf8c98',soft:'#f5e2e5',ink:'#915d6c',motif:'camera'}];
const object=v=>v&&typeof v==='object'&&!Array.isArray(v),exact=(v,keys)=>object(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k)),person=p=>Number.isInteger(p)&&p>=0&&p<6,serial=n=>Number.isSafeInteger(n)&&n>=0&&n<=1e12;
const fresh=()=>({version:1,serial:0,receipts:{},equipped:{frame:null,title:null,card:null,tap:null}});
function migrate(s){s.keepsakes??=fresh();}
function owned(g,kind,p){return kinds.includes(kind)&&person(p)&&Object.entries(g.s.keepsakes.receipts).some(([key,list])=>B.parse(key)?.p===p&&list.includes(kind));}
function claimable(g,kind,p){if(!kinds.includes(kind)||!person(p))return null;return Object.entries(g.s.birthday.events).filter(([key,q])=>B.parse(key)?.p===p&&q.room&&q.box&&q.thanks>=specs[kind].need&&!g.s.keepsakes.receipts[key]?.includes(kind)).sort(([a],[b])=>b.localeCompare(a))[0]?.[0]||null;}
function progress(g,p){return Math.max(0,...Object.entries(g.s.birthday.events).filter(([key])=>B.parse(key)?.p===p).map(([,q])=>q.thanks));}
function valid(v,s){if(v===undefined)return true;if(!exact(v,['version','serial','receipts','equipped'])||v.version!==1||!serial(v.serial)||!object(v.receipts)||Object.keys(v.receipts).length>120||!exact(v.equipped,kinds))return false;
 for(const[key,list]of Object.entries(v.receipts)){const e=B.parse(key),q=s.birthday?.events?.[key];if(!e||!q||!q.room||!q.box||!Array.isArray(list)||!list.length||list.length>4||new Set(list).size!==list.length||!list.every(kind=>kinds.includes(kind)&&q.thanks>=specs[kind].need))return false;}
 return kinds.every(kind=>v.equipped[kind]===null||person(v.equipped[kind])&&Object.entries(v.receipts).some(([key,list])=>B.parse(key)?.p===v.equipped[kind]&&list.includes(kind)));}
function install(Game){
 Game.prototype.keepsakeClaim=function(key,kind,birthdaySerial,revision){const s=this.s.keepsakes,i=B.info(this,key);if(!kinds.includes(kind)||!i||!Object.hasOwn(this.s.birthday.events,key)||birthdaySerial!==i.serial||revision!==s.serial||s.serial>=1e12||this.now()<this.s.birthday.last||i.phase!==2||i.q.thanks<specs[kind].need||s.receipts[key]?.includes(kind))return this.fail('纪念奖励条件未达成、已经领取或页面状态已变化');const isNew=!owned(this,kind,i.p);(s.receipts[key]??=[]).push(kind);s.serial++;return{ok:true,kind,p:i.p,key,isNew};};
 Game.prototype.keepsakeEquip=function(kind,p,revision){const s=this.s.keepsakes;if(!kinds.includes(kind)||revision!==s.serial||s.serial>=1e12||p!==null&&!owned(this,kind,p))return this.fail('请先领取这件纪念装扮，或重新打开页面');if(s.equipped[kind]===p)return this.fail('已经在使用这件装扮');s.equipped[kind]=p;s.serial++;return{ok:true,kind,p};};
}
const api={kinds,specs,themes,fresh,migrate,owned,claimable,progress,valid,install};if(node)module.exports=api;else root.WarmKeepsakes=api;
})(typeof window==='undefined'?globalThis:window);
