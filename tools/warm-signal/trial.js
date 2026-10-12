(function(root){'use strict';
const D=typeof module!=='undefined'&&module.exports?require('./content.js'):root.WarmData;
const int=(n,a=0,b=1e14)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const cycle=t=>new Date(t+3*3600000).toISOString().slice(0,10);
const week=t=>Math.floor((t+3*3600000-4*86400000)/(7*86400000));
const theme=n=>[n%4,(n+1)%4];
const shoots=[{name:'晨光的第一帧',gate:6,seconds:60,target:600},{name:'午后的街角',gate:12,seconds:120,target:900},{name:'暮色里的约定',gate:18,seconds:180,target:1200},{name:'下一次日出',gate:24,seconds:240,target:1500}];
function fresh(t){return{version:2,stage:0,wear:{},claimed:false,date:cycle(t),best:0,medals:0,guardians:[],guardianWeek:week(t),locked:false,formation:[],power:null,damage:0,shoots:[null,null,null,null],purchases:{},history:[],legacyAccess:false};}
function migrate(s,t){if(s.trial.version===2)return;const old=s.trial;s.trial={...fresh(t),stage:old.stage,wear:{...old.wear},claimed:old.claimed,best:old.stage,legacyAccess:true};}
function valid(t,cards){const owns=id=>int(id,0,D.cards.length-1)&&cards.some(c=>c.id===id),ids=(a,max)=>Array.isArray(a)&&a.length<=max&&new Set(a).size===a.length&&a.every(owns);
 if(!int(t.stage,0,24)||typeof t.claimed!=='boolean'||!t.wear||Array.isArray(t.wear)||!Object.entries(t.wear).every(([id,n])=>/^(0|[1-9]\d*)$/.test(id)&&owns(Number(id))&&Number.isFinite(n)&&n>=0&&n<=1))return false;
 if(t.version===undefined)return true;
 if(t.version!==2||typeof t.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(t.date)||!int(t.best,t.stage,24)||!int(t.medals)||!ids(t.guardians,2)||!ids(t.formation,D.cards.length)||!int(t.guardianWeek)||typeof t.locked!=='boolean'||typeof t.legacyAccess!=='boolean'||t.power!==null&&!int(t.power,500,1e9)||!int(t.damage,0,1e9))return false;
 if(t.power===null&&(t.damage!==0||t.locked)||t.power!==null&&t.damage>=Math.floor(t.power*(1+t.stage*.055))||t.stage===24&&t.damage!==0)return false;
 if(!Array.isArray(t.shoots)||t.shoots.length!==4||!t.shoots.every((s,i)=>s===null||s&&t.stage>=shoots[i].gate&&ids(s.ids,3)&&s.ids.length>0&&s.ids.every(id=>cards.find(c=>c.id===id).level>=20)&&int(s.start)&&s.end===s.start+shoots[i].seconds*1000&&typeof s.claimed==='boolean'))return false;
 const busy=t.shoots.filter(s=>s&&!s.claimed).flatMap(s=>s.ids);if(new Set(busy).size!==busy.length)return false;
 if(!t.purchases||Array.isArray(t.purchases)||!Object.entries(t.purchases).every(([k,n])=>['wish','dust'].includes(k)&&int(n,0,k==='wish'?3:2)))return false;
 if(!Array.isArray(t.history)||t.history.length>30||!t.history.every(h=>h&&int(h.at)&&int(h.stage,1,24)&&int(h.score,0,1e9)&&int(h.target,1,1e9)&&typeof h.win==='boolean'&&typeof h.fast==='boolean'))return false;
 return true;
}
function unlocked(g){return g.s.main>=D.gates.trial||g.s.trial.legacyAccess;}
function guardBonus(g){const t=g.s.trial,a=t.guardianWeek%4;return t.guardians.reduce((n,id)=>n+(D.characters[D.cards[id].p].special===a?.25:.1),0);}
function eligible(g,id){const c=g.own(id);return Number.isInteger(id)&&c&&c.level>=20&&(g.s.trial.wear[id]||0)<1;}
function score(g,ids,attrs=theme(g.s.trial.stage),wear=true){if(!Array.isArray(ids)||!ids.length||ids.length>D.cards.length||new Set(ids).size!==ids.length||!ids.every(id=>wear?eligible(g,id):Number.isInteger(id)&&g.own(id)?.level>=20))return 0;let totals=g.s.company.attrs.map(n=>n*(1+guardBonus(g)));for(const id of ids){const st=g.cardStats(g.own(id),wear?(g.s.trial.wear[id]||0):0);totals=totals.map((v,i)=>v+st[i]);}return Math.floor(totals.reduce((n,v,i)=>n+v*(attrs.includes(i)?1:.2),0));}
function power(g){return Math.max(500,Math.floor(g.s.cards.filter(c=>c.level>=20).map(c=>g.cardStats(c).reduce((n,v)=>n+v*.6,0)).sort((a,b)=>b-a).slice(0,3).reduce((a,b)=>a+b,0)*.45));}
function target(g,n=g.s.trial.stage){return Math.floor((g.s.trial.power??power(g))*(1+n*.055));}
function canReset(g){return cycle(g.now())>g.s.trial.date;}
function reward(g,n,fast=false){const t=g.s.trial,r={coins:300,gems:n%6===0?50:0},roll=Math.max(0,Math.min(.999999,g.rng()));let extra;
 if(roll<.4){const a=Math.floor(roll/.1);g.s.materials[a]++;extra=D.attrs[a]+'材料 ×1';}else if(roll<.75){r.wish=1;extra='心愿 ×1';}else{r.coins+=200;extra='金币 ×200';}
 g.reward(r);const medals=20+n*2;t.medals+=medals;t.best=Math.max(t.best,n);return{...r,medals,extra,fast};}
function install(Game){
 Game.prototype.trialGuard=function(ids){const t=this.s.trial;if(t.locked)return this.fail('本轮守护已锁定，重置后可调整');if(!Array.isArray(ids)||ids.length>2||new Set(ids).size!==ids.length||!ids.every(id=>Number.isInteger(id)&&this.own(id)))return this.fail('请选择最多两张不同的已拥有羁绊');t.guardians=[...ids];t.guardianWeek=week(this.now());return{ok:true};};
 Game.prototype.trialFormation=function(ids){if(!Array.isArray(ids)||ids.length>D.cards.length||new Set(ids).size!==ids.length||!ids.every(id=>eligible(this,id)))return this.fail('上阵羁绊需达到 20 级且仍有实力');this.s.trial.formation=[...ids];return{ok:true};};
 Game.prototype.trial=function(ids,expected=this.s.trial.stage){this.refresh();const t=this.s.trial;if(!unlocked(this))return this.fail('通过主线 5-1 后开启');if(expected!==t.stage)return this.fail('关卡已变化，请重新准备');if(t.stage>=24)return this.fail('本轮 24 关已完成');const value=score(this,ids);if(!value)return this.fail('请选择 20 级以上且未耗尽的不同羁绊');t.power??=power(this);const full=target(this),remaining=full-t.damage;t.locked=true;t.formation=[...ids];const win=value>=remaining;
 for(const id of ids)t.wear[id]=Math.min(1,Math.round(((t.wear[id]||0)+.12)*100)/100);
 t.history.unshift({at:this.now(),stage:t.stage+1,score:value,target:remaining,win,fast:false});t.history=t.history.slice(0,30);
 let rewards=null;if(win){t.stage++;t.damage=0;rewards=reward(this,t.stage);}else t.damage+=value;
 return{ok:true,win,score:value,target:remaining,rewards,stage:t.stage};};
 Game.prototype.trialReset=function(){const t=this.s.trial;if(!canReset(this))return this.fail('每日 5 点后可重置一次');if(t.shoots.some(s=>s&&!s.claimed))return this.fail('请先领取全部拍摄成果再重置');this.s.trial={...fresh(this.now()),best:t.best,medals:t.medals,guardians:[...t.guardians],legacyAccess:t.legacyAccess};return{ok:true};};
 Game.prototype.trialSweep=function(){this.refresh();const t=this.s.trial,limit=Math.max(0,t.best-(this.passActive()?1:3));if(!unlocked(this)||limit<=t.stage)return this.fail('历史最高进度提高后可快速通关更多关卡');t.power??=power(this);t.locked=true;const from=t.stage,items=[];while(t.stage<limit){const n=++t.stage;items.push(reward(this,n,true));t.history.unshift({at:this.now(),stage:n,score:0,target:target(this,n-1),win:true,fast:true});}t.history=t.history.slice(0,30);t.damage=0;return{ok:true,from,to:t.stage,items};};
 Game.prototype.trialDispatch=function(i,ids){const t=this.s.trial,a=shoots[i];if(!int(i,0,3)||!a||t.stage<a.gate)return this.fail('先完成对应挑战关卡');if(t.shoots[i])return this.fail('本轮已派遣');if(!Array.isArray(ids)||!ids.length||ids.length>3||!score(this,ids,theme(i),false))return this.fail('请选择 1～3 张 20 级以上羁绊');const busy=t.shoots.filter(s=>s&&!s.claimed).flatMap(s=>s.ids);if(ids.some(id=>busy.includes(id)))return this.fail('该羁绊正在另一场拍摄');if(score(this,ids,theme(i),false)<a.target)return this.fail('派遣实力未达到目标');const start=this.now();t.shoots[i]={ids:[...ids],start,end:start+a.seconds*1000,claimed:false};return{ok:true};};
 Game.prototype.trialCollect=function(i){const a=shoots[i],s=this.s.trial.shoots[i];if(!int(i,0,3)||!a||!s||s.claimed)return this.fail('没有可领取的成果');if(this.now()<s.end)return this.fail('拍摄还未结束');s.claimed=true;const r={coins:800+i*300,wish:2+i};this.reward(r);this.s.trial.medals+=60+i*20;return{ok:true,rewards:{...r,medals:60+i*20}};};
 Game.prototype.trialBuy=function(kind,p=0){const t=this.s.trial;let price,id,cap;if(['sr','ssr'].includes(kind)){if(!int(p,0,5))return this.fail('无效角色');price=kind==='ssr'?150:60;id=p*12+(kind==='ssr'?8:6);}else if(['wish','dust'].includes(kind)){price=kind==='wish'?40:50;cap=kind==='wish'?3:2;if((t.purchases[kind]||0)>=cap)return this.fail('本轮兑换次数已用完');}else return this.fail('无效商品');if(t.medals<price)return this.fail('挑战奖章不足');t.medals-=price;if(id!==undefined)this.s.fragments[id]=(this.s.fragments[id]||0)+5;else{t.purchases[kind]=(t.purchases[kind]||0)+1;this.reward({[kind]:5});}return{ok:true,id,price};};
}
const api={fresh,migrate,valid,install,cycle,week,theme,shoots,unlocked,eligible,score,power,target,guardBonus,canReset};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WarmTrial=api;
})(typeof window==='undefined'?globalThis:window);
