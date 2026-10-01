(function(root,factory){const d=typeof module==='object'&&module.exports?require('./data.js'):root.VELOCITY_DATA;const a=factory(d);if(typeof module==='object'&&module.exports)module.exports=a;else root.VelocitySave=a})(typeof window==='undefined'?globalThis:window,D=>{
'use strict';const PROFILE='velocity-heist-profile-v1',RUN='velocity-heist-run-v1';
const fresh=()=>({version:1,wallet:0,seed:'',selection:{car:0,city:0,difficulty:0,endless:false,map:null},meta:{motor:0,body:0,battery:0,grip:0,cargo:0},stats:{runs:0,wins:0,swaps:0,drift:0,otherRails:0,overtakes:0,advanced:0,cities:0,endless:0},cities:[],cars:{},bestLap:0,claimed:[],settled:[],tutorial:false,settings:{sound:true,music:true,vibrate:true,quality:'high',auto:true,assist:true,motion:true}});
class Store{
 constructor(storage,fail=()=>{}){this.storage=storage;this.memory={};this.failed=false;this.fail=fail;const old=this.read(PROFILE);this.profile=fresh();if(old?.version===1){for(const k of ['meta','stats','cars','settings','selection'])this.profile[k]={...this.profile[k],...old[k]};for(const k of ['cities','claimed','settled'])if(Array.isArray(old[k]))this.profile[k]=old[k];this.profile.wallet=Math.max(0,Number(old.wallet)||0);this.profile.bestLap=Math.max(0,Number(old.bestLap)||0);this.profile.seed=typeof old.seed==='string'?old.seed.slice(0,32):'';this.profile.tutorial=!!old.tutorial}this.validateSelection();for(const m of D.meta)this.profile.meta[m.id]=Math.max(0,Math.min(m.max,Math.floor(this.profile.meta[m.id]||0)))}
 failure(){if(!this.failed){this.failed=true;this.fail()}}
 validateSelection(){const s=this.profile.selection;for(const k of ['car','city','difficulty'])s[k]=Number.isInteger(s[k])&&s[k]>=0&&s[k]<=2?s[k]:0;s.endless=!!s.endless;s.map=typeof s.map==='string'?s.map:null}
 read(k){try{const s=this.storage.getItem(k);return s?JSON.parse(s):this.memory[k]||null}catch{this.failure();return this.memory[k]||null}}
 write(k,v){this.memory[k]=v;try{this.storage.setItem(k,JSON.stringify(v));return true}catch{this.failure();return false}}
 remove(k){delete this.memory[k];try{this.storage.removeItem(k)}catch{this.failure()}}
 save(){this.write(PROFILE,this.profile)}
 run(){return this.read(RUN)}
 checkpoint(g){if(!g||g.training)return;if(g.phase==='result'){this.settle(g);this.remove(RUN)}else this.write(RUN,g.serialize())}
 settle(g){if(g.training||g.phase!=='result'||this.profile.settled.includes(g.id))return false;const p=this.profile,s=p.stats;s.runs++;for(const k of ['swaps','drift','otherRails','overtakes','advanced'])s[k]+=g.stats[k];if(g.endless)s.endless=Math.max(s.endless,...g.records.map(r=>r.stage),0);if(g.won){s.wins++;for(const r of g.records)if(!p.cities.includes(r.city))p.cities.push(r.city)}s.cities=p.cities.length;const car=D.cars[g.car].id;p.cars[car]=(p.cars[car]||0)+(g.won?1:0);if(g.stats.bestLap>0)p.bestLap=p.bestLap?Math.min(p.bestLap,g.stats.bestLap):g.stats.bestLap;p.wallet+=g.reward;p.settled.push(g.id);this.save();return true}
 claim(id){const a=D.achievements.find(a=>a.id===id);if(!a||this.profile.claimed.includes(id)||this.profile.stats[a.stat]<a.target)return false;this.profile.claimed.push(id);this.profile.wallet+=a.reward;this.save();return true}
 upgrade(id){const m=D.meta.find(m=>m.id===id);if(!m)return false;const lv=this.profile.meta[id],cost=Math.round(m.cost*(1+lv*.65));if(lv>=m.max||this.profile.wallet<cost)return false;this.profile.wallet-=cost;this.profile.meta[id]++;this.save();return true}
}return{Store,keys:{PROFILE,RUN},fresh};
});
