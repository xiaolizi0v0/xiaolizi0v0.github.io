(function(root){'use strict';
const DAY=86400000,day=t=>Math.floor((t+3*3600000)/DAY),week=d=>Math.floor((d+3)/7);
const offers=[
 {id:6,name:'特权卡 · 30日',kind:'pass',price:30,base:300,bonus:0,reward:{},note:'立得300钻石 · 每日30钻石 · 特权延长30日'},
 {id:7,name:'影视基金',kind:'fund',price:68,base:680,bonus:0,reward:{},note:'立得680钻石 · 完成六章累计可得4080钻石'},
 {id:8,name:'初级特权礼包',kind:'daily',price:1,base:10,bonus:0,reward:{energy:60,wish:3},note:'钻石10 · 体力60 · 心愿3'},
 {id:9,name:'中级特权礼包',kind:'daily',price:3,base:30,bonus:0,reward:{coins:10000,wish:5},note:'钻石30 · 金币10000 · 心愿5'},
 {id:10,name:'高级特权礼包',kind:'daily',price:6,base:60,bonus:0,reward:{tickets:1,wish:6},note:'钻石60 · 许愿券1 · 心愿6'}
];
const fund=[300,400,500,600,700,900];
const weeklyOffers=[{price:30,reward:{energy:100,wish:3}},{price:100,reward:{coins:20000,wish:10}},{price:300,reward:{tickets:3,dust:10}}];
const fresh=t=>({version:1,pass:{from:0,until:0,lastClaim:-1},fund:{bought:false,claims:[]},daily:{date:day(t),packs:[0,0,0],meals:[]},weekly:{date:week(day(t)),packs:[],monday:false}});
const int=(n,min=0,max=1e14)=>Number.isSafeInteger(n)&&n>=min&&n<=max,unique=a=>Array.isArray(a)&&new Set(a).size===a.length;
function valid(v,s){
 if(v===undefined)return !s.recharge||s.recharge.version===1||s.recharge.purchases.slice(6).every(n=>!n);
 if(!v||v.version!==1||!v.pass||!v.fund||!v.daily||!v.weekly)return false;
 const p=v.pass,f=v.fund,d=v.daily,w=v.weekly;
 if(!int(p.from)||!int(p.until)||p.until<p.from||!int(p.lastClaim,-1)||p.lastClaim>=p.until&&p.lastClaim!==-1||p.lastClaim!==-1&&p.lastClaim<p.from)return false;
 const counts=s.recharge?.purchases||[],purchases=counts[6]||0;
 if((p.until>0)!==!!purchases||p.until-p.from>purchases*30||(counts[7]||0)>1||f.bought!==!!counts[7]||!unique(f.claims)||!f.claims.every(i=>int(i,0,5)&&f.bought&&s.main>=(i+1)*18))return false;
 if(!int(d.date)||!Array.isArray(d.packs)||d.packs.length!==3||!d.packs.every((n,i)=>int(n,0,1)&&n<=(counts[8+i]||0))||!unique(d.meals)||!d.meals.every(i=>i===0||i===1))return false;
 return int(w.date)&&w.date===week(d.date)&&unique(w.packs)&&w.packs.every(i=>int(i,0,2))&&typeof w.monday==='boolean';
}
function migrate(s,t){s.storefront??=fresh(t);}
function refresh(s,t){const v=s.storefront,d=day(t);if(d>v.daily.date)v.daily={date:d,packs:[0,0,0],meals:[]};const w=week(v.daily.date);if(w>v.weekly.date)v.weekly={date:w,packs:[],monday:false};}
function active(g,t=g.now()){const p=g.s.storefront?.pass,d=day(t);return !!p&&d>=g.s.storefront.daily.date&&d>=p.from&&d<p.until;}
const energyCap=g=>120+(active(g)?50:0),fastLimit=g=>Math.max(0,g.s.trial.best-(active(g)?1:3));
function canBuy(g,id,cycle){const v=g.s.storefront,p=offers.find(p=>p.id===id);if(!p)return{ok:true};const d=day(g.now());if(d<v.daily.date)return g.fail('日期尚未恢复，请稍后再试');
 if(p.kind==='pass'&&Math.max(v.pass.until,d)-d>335)return g.fail('特权卡最多可续至365日');
 if(p.kind==='fund'&&v.fund.bought)return g.fail('影视基金仅可购买一次');
 if(p.kind==='daily'){if(cycle!==undefined&&cycle!==d)return g.fail('每日礼包已换日，请取消旧订单后重新选择');if(!active(g))return g.fail('开通有效特权卡后可购买');if(v.daily.packs[id-8])return g.fail('该礼包今日已购买，5点后恢复');}
 return{ok:true};
}
function grant(g,id){const v=g.s.storefront,d=day(g.now());if(id===6){if(!active(g)){v.pass.from=d;v.pass.until=d;v.pass.lastClaim=-1;}v.pass.until+=30;}else if(id===7)v.fund.bought=true;else if(id>=8&&id<=10)v.daily.packs[id-8]=1;}
function canReward(g,r){return Object.entries(r).every(([k,n])=>Number.isSafeInteger(n)&&n>=0&&typeof g.s[k]==='number'&&g.s[k]+n<=(k==='energy'?1e6:1e14));}
function mealQuote(g,index){if(!int(index,0,1))return g.fail('无效体力时段');const v=g.s.storefront,d=day(g.now()),local=new Date(g.now()+8*3600000);let minute=local.getUTCHours()*60+local.getUTCMinutes();if(minute<300)minute+=1440;const start=index?1080:720,end=start+120;if(d!==v.daily.date||minute<start)return g.fail('还未到领取时段');if(v.daily.meals.includes(index))return g.fail('本时段体力已领取');return{ok:true,date:d,index,late:minute>=end,price:minute>=end&&!active(g)?10:0};}
function install(Game){
 Game.prototype.energyCap=function(){return energyCap(this);};
 Game.prototype.passActive=function(){return active(this);};
 Game.prototype.passClaim=function(expected){this.refresh();const v=this.s.storefront,d=day(this.now());if(expected!==undefined&&expected!==d)return this.fail('领取日期已更新，请刷新页面');if(!active(this)||v.pass.lastClaim>=d)return this.fail('今日已领取或特权卡已到期');if(!canReward(this,{gems:30}))return this.fail('钻石数量已达上限');v.pass.lastClaim=d;this.reward({gems:30});return{ok:true,reward:{gems:30}};};
 Game.prototype.fundClaim=function(index){const f=this.s.storefront.fund;if(!int(index,0,5)||!f.bought||this.s.main<(index+1)*18||f.claims.includes(index))return this.fail('完成对应章节并开通基金后领取，每档限一次');const reward={gems:fund[index]};if(!canReward(this,reward))return this.fail('钻石数量已达上限');f.claims.push(index);this.reward(reward);return{ok:true,reward};};
 Game.prototype.mealClaim=function(index,expected,price){this.refresh();const q=mealQuote(this,index);if(!q.ok)return q;if(q.date!==expected||q.price!==price)return this.fail('时段或补领费用已变化，请重新打开');if(!canReward(this,{energy:30}))return this.fail('体力数量已达上限');if(!this.pay({gems:q.price}))return this.fail('补领需要10钻石');this.s.storefront.daily.meals.push(index);this.reward({energy:30});return{ok:true,reward:{energy:30},price:q.price};};
 Game.prototype.passWeekly=function(index,expected){this.refresh();const v=this.s.storefront;if(!active(this)||expected!==v.weekly.date)return this.fail('特权或周次已变化，请刷新');if(index==='monday'){if((day(this.now())+3)%7!==0||v.weekly.monday)return this.fail('周一特权礼包本周已领取或尚未到周一');if(!canReward(this,{energy:60,wish:3}))return this.fail('资源数量已达上限');if(!this.pay({gems:1}))return this.fail('需要1钻石');v.weekly.monday=true;this.reward({energy:60,wish:3});return{ok:true};}const p=weeklyOffers[index];if(!int(index,0,2)||!p||v.weekly.packs.includes(index))return this.fail('本档每周限购一次');if(!canReward(this,p.reward))return this.fail('资源数量已达上限');if(!this.pay({gems:p.price}))return this.fail('钻石不足');v.weekly.packs.push(index);this.reward(p.reward);return{ok:true};};
 const sign=Game.prototype.sign;Game.prototype.sign=function(){this.refresh();const today=new Date(this.now()+8*3600000).toISOString().slice(0,10);if(this.s.sign.last>=today)return this.fail('今日已经签到或日期尚未恢复');const previous=new Date(this.now()-16*3600000).toISOString().slice(0,10),count=this.s.sign.last===previous?this.s.sign.count%7+1:1,double=active(this),factor=double?2:1;if(!canReward(this,{gems:(50+count*10)*factor,coins:1000*factor,wish:2*factor}))return this.fail('资源数量已达上限');const r=sign.call(this);if(r.ok&&double){this.reward(r.reward);r.reward=Object.fromEntries(Object.entries(r.reward).map(([k,n])=>[k,n*2]));r.double=true;}return r;};
}
const api={DAY,day,week,offers,fund,weeklyOffers,fresh,valid,migrate,refresh,active,energyCap,fastLimit,canBuy,grant,canReward,mealQuote,install};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WarmStorefront=api;
})(typeof window==='undefined'?globalThis:window);
