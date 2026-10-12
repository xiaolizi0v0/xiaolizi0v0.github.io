(function(root){'use strict';
const D=typeof module!=='undefined'&&module.exports?require('./content.js'):root.WarmData;
const week=t=>Math.floor((t+3*3600000-4*86400000)/(7*86400000));
const route=()=>({round:0,step:0,claimed:false,history:[],seen:[]});
const fresh=t=>({version:1,week:week(t),routes:D.characters.map(route)});
const integer=(v,a,b)=>Number.isSafeInteger(v)&&v>=a&&v<=b;
function valid(w){if(w===undefined)return true;if(!w||w.version!==1||!integer(w.week,0,1e6)||!Array.isArray(w.routes)||w.routes.length!==6)return false;return w.routes.every(r=>r&&integer(r.round,0,2)&&integer(r.step,0,50)&&typeof r.claimed==='boolean'&&(!r.claimed||r.step===50)&&Array.isArray(r.seen)&&new Set(r.seen).size===r.seen.length&&r.seen.every(n=>integer(n,0,5))&&Array.isArray(r.history)&&r.history.length<=30&&r.history.every((h,i)=>h&&integer(h.round,0,r.round)&&integer(h.step,1,50)&&integer(h.choice,0,1)&&integer(h.at,0,1e14)&&(h.round<r.round||h.step<=r.step)&&(i===0||h.round*50+h.step<r.history[i-1].round*50+r.history[i-1].step)));}
function migrate(s,t){if(s.walks)return;s.walks=fresh(t);const date=new Date(t+8*3600000).toISOString().slice(0,10);if(s.daily.date===date)s.daily.walk.forEach((n,p)=>s.walks.routes[p].step=n);}
function refresh(s,t){if(week(t)===s.walks.week)return false;const seen=s.walks.routes.map(r=>r.seen);s.walks=fresh(t);s.walks.routes.forEach((r,p)=>r.seen=[...seen[p]]);return true;}
const total=r=>r.round*50+r.step;
const eventIndex=(round,step)=>(round*2+step)%6;
function install(Game){
 Game.prototype.walk=function(p,choice=0,expected=null){this.refresh();if(!integer(p,0,5)||!integer(choice,0,1))return this.fail('无效漫步选择');const w=this.s.walks,r=w.routes[p];if(expected&&(expected.week!==w.week||expected.round!==r.round||expected.step!==r.step))return this.fail('漫步进度已变化，请重新查看');if(r.step===50)return this.fail(r.round===2?'本周路线已走完':'请领取本轮心意，再开启下一轮');const index=eventIndex(r.round,r.step),step=++r.step,rewards={coins:200};if(step%10===0){rewards.wish=r.round+1;rewards.energy=5*(r.round+1);}if(step%25===0)rewards.material=(p+r.round)%4;if(r.round===2&&step===50)rewards.gems=100;this.reward(rewards);if(!r.seen.includes(index))r.seen.push(index);r.history.unshift({round:r.round,step,choice,at:this.now()});r.history=r.history.slice(0,30);this.bump('walk');return{ok:true,p,round:r.round,step,index,choice,rewards,complete:step===50};};
 Game.prototype.walkClaim=function(p,round,expectedWeek=this.s.walks.week){this.refresh();if(!integer(p,0,5)||!integer(round,0,2))return this.fail('无效漫步奖励');const r=this.s.walks.routes[p];if(expectedWeek!==this.s.walks.week||round!==r.round||r.step!==50||r.claimed)return this.fail('本轮心意尚未达成或已领取');r.claimed=true;this.s.heart[p]+=100;return{ok:true,heart:100};};
 Game.prototype.walkReset=function(p,expectedRound,expectedWeek=this.s.walks.week){this.refresh();if(!integer(p,0,5))return this.fail('无效路线');const r=this.s.walks.routes[p];if(expectedWeek!==this.s.walks.week||expectedRound!==r.round||r.round>=2||r.step!==50||!r.claimed)return this.fail('领取本轮心意后可开启下一轮，每周最多三轮');if(!this.pay({coins:5000}))return this.fail('开启下一轮需要金币 5000');r.round++;r.step=0;r.claimed=false;return{ok:true};};
}
const W={week,fresh,valid,migrate,refresh,total,eventIndex,install};if(typeof module!=='undefined'&&module.exports)module.exports=W;else root.WarmWalk=W;
})(typeof window==='undefined'?globalThis:window);
