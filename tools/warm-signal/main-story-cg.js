(function(root){'use strict';
const node=typeof module!=='undefined'&&module.exports;
const entries=[
 {id:'seed-tag',p:0,stage:16,edition:1,start:11,end:16,title:'标签上的明天'},
 {id:'window-light',p:1,stage:32,edition:2,start:15,end:18,title:'给两个人的光'},
 {id:'shared-earphone',p:2,stage:48,edition:2,start:16,end:19,title:'安静之后的歌'},
 {id:'paper-edge',p:3,stage:62,edition:2,start:18,end:19,title:'同一页的温度'},
 {id:'half-cake',p:4,stage:72,edition:2,start:11,end:18,title:'夜灯与半块蛋糕'},
 {id:'off-camera',p:5,stage:98,edition:2,start:17,end:19,title:'镜头外的两杯温暖'}
].map(e=>Object.freeze({...e,file:`main-story-cg-${e.p}-v1.webp`,chapter:Math.floor(e.stage/18)+1,node:e.stage%18+1}));
const byId=Object.fromEntries(entries.map(e=>[e.id,e]));
const fresh=()=>({version:1,unlocked:[],favorites:[]});
const has=(s,id)=>!!s.storyCG?.unlocked.includes(id);
function current(q){return q&&entries.find(e=>e.stage===q.stage&&q.edition>=e.edition&&q.line>=e.start&&q.line<=e.end)||null;}
function seen(s,e){const b=s.novel?.bookmarks[e.stage],r=s.novel?.records[e.stage];return s.main>=e.stage&&(!!b&&b.edition>=e.edition&&b.line>=e.start||s.main>e.stage&&!!r&&!r.legacy&&r.edition>=e.edition);}
function sync(s){const added=[];for(const e of entries)if(!has(s,e.id)&&seen(s,e)){s.storyCG.unlocked.push(e.id);added.push(e.id);}return added;}
function migrate(s){s.storyCG??=fresh();sync(s);}
function valid(v,s){if(v===undefined)return true;if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).length!==3||v.version!==1||!Array.isArray(v.unlocked)||!Array.isArray(v.favorites))return false;const ids=a=>new Set(a).size===a.length&&a.length<=entries.length&&a.every(id=>typeof id==='string'&&Object.hasOwn(byId,id));return ids(v.unlocked)&&ids(v.favorites)&&v.unlocked.every(id=>s.main>=byId[id].stage)&&v.favorites.every(id=>v.unlocked.includes(id));}
function install(Game){
 // Wrap successful reader actions only. Published beat indexes and first-read records stay unchanged.
 for(const method of ['novelOpen','novelNext','novelChoose']){const read=Game.prototype[method];Game.prototype[method]=function(...args){const r=read.apply(this,args);if(r.ok)sync(this.s);return r;};}
 Game.prototype.storyCGFavorite=function(id){if(!Object.hasOwn(byId,id)||!has(this.s,id))return this.fail('阅读对应剧情后才能珍藏');const a=this.s.storyCG.favorites,i=a.indexOf(id);if(i>=0)a.splice(i,1);else a.push(id);return{ok:true,favorite:i<0};};
}
const api={entries,byId,fresh,current,seen,has,sync,migrate,valid,install};if(node)module.exports=api;else root.WarmMainStoryCG=api;
})(typeof window==='undefined'?globalThis:window);
