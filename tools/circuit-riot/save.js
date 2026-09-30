(function(root,factory){const D=typeof module==='object'&&module.exports?require('./data.js'):root.CIRCUIT_DATA;const api=factory(D);if(typeof module==='object'&&module.exports)module.exports=api;else root.CircuitSave=api})(typeof window==='undefined'?globalThis:window,D=>{
 'use strict';const META='circuit-riot-profile-v1',RUN='circuit-riot-run-v1';
 const fresh=()=>({version:1,wallet:0,seed:'',meta:{power:0,hp:0,spool:0,pickup:0,energy:0},stats:{kills:0,captures:0,seals:0,burst:0,wins:0,maps:0,advanced:0,endless:0,runs:0},maps:[],heroes:{},records:{},claimed:[],settled:[],settings:{sound:true,music:true,vibrate:true,numbers:true,quality:'high',auto:false},tutorial:false});
 class Store{
  constructor(storage,onFailure=()=>{}){
   this.storage=storage;this.memory={};this.failed=false;this.onFailure=onFailure;
   const value=this.read(META);this.profile=fresh();
   if(value?.version===1){
    for(const key of ['meta','stats','settings','heroes','records'])this.profile[key]={...this.profile[key],...value[key]};
    for(const key of ['maps','claimed','settled'])if(Array.isArray(value[key]))this.profile[key]=value[key];
    this.profile.wallet=Math.max(0,Number(value.wallet)||0);this.profile.tutorial=!!value.tutorial;this.profile.seed=typeof value.seed==='string'?value.seed.slice(0,32):'';
   }
   for(const m of D.meta)this.profile.meta[m.id]=Math.max(0,Math.min(m.max,Math.floor(Number(this.profile.meta[m.id])||0)));
  }
  read(key){try{const value=this.storage.getItem(key);return value?JSON.parse(value):this.memory[key]||null}catch{this.failure();return this.memory[key]||null}}
  write(key,value){this.memory[key]=value;try{this.storage.setItem(key,JSON.stringify(value));return true}catch{this.failure();return false}}
  remove(key){delete this.memory[key];try{this.storage.removeItem(key)}catch{this.failure()}}
  failure(){if(!this.failed){this.failed=true;this.onFailure()}}
  save(){this.write(META,this.profile)}
  checkpoint(g){if(!g||g.training||g.phase==='trainingDone')return;if(g.phase==='result'){this.settle(g);this.remove(RUN);return}this.write(RUN,g.serialize())}
  run(){return this.read(RUN)}
  settle(g){if(g.training||g.phase!=='result'||this.profile.settled.includes(g.id))return false;const p=this.profile,s=p.stats;s.runs++;s.kills+=g.kills;s.captures+=g.stats.captures;s.seals+=g.stats.seals;s.advanced+=g.stats.advanced;s.burst=Math.max(s.burst,g.stats.burst);if(g.endless)s.endless=Math.max(s.endless,g.wave);if(g.won){s.wins++;if(!p.maps.includes(g.map))p.maps.push(g.map)}s.maps=p.maps.length;p.wallet+=g.reward;p.settled.push(g.id);const hero=D.heroes[g.hero].id;p.heroes[hero]=(p.heroes[hero]||0)+(g.won?1:0);const map=String(g.map);p.records[map]=Math.max(p.records[map]||0,g.kills);this.save();return true}
  claim(id){const a=D.achievements.find(a=>a.id===id);if(!a||this.profile.claimed.includes(id)||(this.profile.stats[a.stat]||0)<a.target)return false;this.profile.claimed.push(id);this.profile.wallet+=a.reward;this.save();return true}
  upgrade(id){const m=D.meta.find(m=>m.id===id);if(!m)return false;const lv=this.profile.meta[id],cost=Math.round(m.cost*(1+lv*.65));if(lv>=m.max||this.profile.wallet<cost)return false;this.profile.wallet-=cost;this.profile.meta[id]++;this.save();return true}
 }
 return{Store,fresh,keys:{META,RUN}};
});
