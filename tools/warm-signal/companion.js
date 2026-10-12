(function(root){'use strict';
const modes={work:'工作',study:'学习',focus:'专注',sleep:'睡前陪伴'};
const scenes=[{name:'晴日窗边',price:0,room:0},{name:'安静书房',price:8,room:3},{name:'暖灯茶室',price:10,room:2},{name:'月色客厅',price:12,room:5}];
const sunlight=typeof module!=='undefined'&&module.exports?require('./sun-journal-content.js'):root.WarmSunJournalContent;
scenes.push(...sunlight.scenes.map(name=>({name,price:null,sun:true})));
const outfits=['日常相见','居家时光','生日盛装'];
const birthdayContent=typeof module!=='undefined'&&module.exports?require('./birthday-content.js'):root.WarmBirthdayContent;
const outfitName=(p,id)=>id===2?birthdayContent.outfitNames[p]:outfits[id];
const music=[{name:'窗边的信',price:0,notes:[60,64,67,71,69,67,64,62]},{name:'慢慢等花开',price:8,notes:[60,62,65,69,67,65,62,60]},{name:'夜色温柔',price:12,notes:[57,60,64,67,64,62,60,57]}];
const achievements=[{need:1,coins:1000,gems:20},{need:5,coins:2000,gems:50},{need:20,coins:4000,gems:100},{need:50,coins:8000,gems:200},{need:100,coins:15000,gems:300}];
const int=(v,a=0,b=1e14)=>Number.isSafeInteger(v)&&v>=a&&v<=b;
const date=t=>new Date(t+10800000).toISOString().slice(0,10),copy=v=>JSON.parse(JSON.stringify(v));
function fresh(t){return{outfits:[0,0,0,0,0,0],scenes:[0,0,0,0,0,0],ownedOutfits:Array.from({length:6},()=>[0]),ownedScenes:[0],music:0,ownedMusic:[0],tickets:20,completed:0,minutes:0,perPerson:[0,0,0,0,0,0],history:[],achievements:[],daily:{date:date(t),bonus:false,touches:[0,0,0,0,0,0]},lastTouch:0,random:{roles:[],outfits:false,scenes:false,last:''},light:1,weather:0,curtain:false};}
function migrate(s,t){const c=s.companion;c.meet??=fresh(t);if(c.timer&&c.timer.start===undefined){const m=c.timer.mode==='focus'?25:10;c.timer={...c.timer,start:Math.max(0,c.timer.end-m*60000),p:c.p,minutes:m,touches:0,lastTouch:0};}}
function refresh(s,t){const m=s.companion.meet;if(m&&m.daily.date!==date(t))m.daily={date:date(t),bonus:false,touches:[0,0,0,0,0,0]};}
function valid(c){if(!int(c.p,0,5)||!int(c.logs)||c.timer!==null&&(!c.timer||typeof c.timer!=='object'||Array.isArray(c.timer)))return false;const t=c.timer;if(t){if(!Object.hasOwn(modes,t.mode)||!int(t.end))return false;if(t.start!==undefined&&(!int(t.start)||!int(t.p,0,5)||t.p!==c.p||!int(t.minutes,1,t.mode==='sleep'?480:180)||t.end!==t.start+t.minutes*60000||!int(t.touches,0,10)||!int(t.lastTouch)))return false;if(t.start===undefined&&!['focus','sleep'].includes(t.mode))return false;}
 const m=c.meet;if(!m)return true;
 for(const k of ['tickets','completed','minutes','lastTouch'])if(!int(m[k]))return false;
 if(m.completed>c.logs||!int(m.music,0,2)||!int(m.light,0,2)||!int(m.weather,0,2)||typeof m.curtain!=='boolean')return false;
 const list=(v,max,required)=>Array.isArray(v)&&v.length>0&&v.length<=max+1&&new Set(v).size===v.length&&v.every(x=>int(x,0,max))&&(required===undefined||v.includes(required));
 if(!list(m.ownedScenes,9,0)||!list(m.ownedMusic,2,0)||!m.ownedMusic.includes(m.music))return false;
 if(!Array.isArray(m.outfits)||m.outfits.length!==6||!Array.isArray(m.scenes)||m.scenes.length!==6||!Array.isArray(m.ownedOutfits)||m.ownedOutfits.length!==6||!Array.isArray(m.perPerson)||m.perPerson.length!==6||!m.perPerson.every(n=>int(n))||m.perPerson.reduce((a,b)=>a+b,0)!==m.completed)return false;
 if(!m.outfits.every((n,p)=>int(n,0,2)&&list(m.ownedOutfits[p],2,0)&&m.ownedOutfits[p].includes(n))||!m.scenes.every(n=>int(n,0,9)&&m.ownedScenes.includes(n)))return false;
 if(!Array.isArray(m.achievements)||new Set(m.achievements).size!==m.achievements.length||!m.achievements.every(i=>int(i,0,4)&&m.completed>=achievements[i].need))return false;
 if(!m.daily||typeof m.daily.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(m.daily.date)||typeof m.daily.bonus!=='boolean'||!Array.isArray(m.daily.touches)||m.daily.touches.length!==6||!m.daily.touches.every(n=>int(n,0,5)))return false;
 if(!m.random||!Array.isArray(m.random.roles)||m.random.roles.length>6||new Set(m.random.roles).size!==m.random.roles.length||!m.random.roles.every(n=>int(n,0,5))||typeof m.random.outfits!=='boolean'||typeof m.random.scenes!=='boolean'||typeof m.random.last!=='string')return false;
 if(!Array.isArray(m.history)||m.history.length>30||!m.history.every(h=>int(h.p,0,5)&&modes[h.mode]&&int(h.at)&&int(h.minutes,0,480)&&typeof h.done==='boolean'))return false;return true;}
function install(Game){
 Game.prototype.companionSelect=function(p){if(!int(p,0,5))return this.fail('无效角色');if(this.s.companion.timer)return this.fail('陪伴结束后再换人吧');this.s.companion.p=p;return{ok:true};};
 Game.prototype.companionLook=function(kind,id,buy=false){const c=this.s.companion,m=c.meet,p=c.p;let owned,price;
  if(kind==='outfit'&&int(id,0,2)){owned=m.ownedOutfits[p];price=id===2?null:id?8:0;}
  else if(kind==='scene'&&int(id,0,9)){owned=m.ownedScenes;price=scenes[id].price;}
  else if(kind==='music'&&int(id,0,2)){owned=m.ownedMusic;price=music[id].price;}
  else return this.fail('无效装扮');
  if(!owned.includes(id)){if(kind==='scene'&&id>=4)return this.fail('暖光手札特权100级或往期甄选匣获取');if(kind==='outfit'&&id===2)return this.fail('生日盛装需在生日庆典累计传递爱语10次后领取');if(!buy)return this.fail('请先解锁');if(m.tickets<price)return this.fail('时光券不足');m.tickets-=price;owned.push(id);}
  if(kind==='outfit')m.outfits[p]=id;else if(kind==='scene')m.scenes[p]=id;else m.music=id;return{ok:true};};
 Game.prototype.companionAmbient=function(key,value){const m=this.s.companion.meet;if(key==='curtain'&&typeof value==='boolean')m.curtain=value;else if(['light','weather'].includes(key)&&int(value,0,2))m[key]=value;else return this.fail('无效氛围设置');return{ok:true};};
 Game.prototype.companionRandom=function(key,value){const r=this.s.companion.meet.random;if(key==='roles'&&Array.isArray(value)&&value.length<=6&&new Set(value).size===value.length&&value.every(p=>int(p,0,5)))r.roles=copy(value);else if(['outfits','scenes'].includes(key)&&typeof value==='boolean')r[key]=value;else return this.fail('无效随机设置');return{ok:true};};
 Game.prototype.companionEnter=function(){this.refresh();const c=this.s.companion,m=c.meet,r=m.random,t=this.now();if(c.timer||r.last===date(t))return{ok:true};const pick=a=>a[Math.min(a.length-1,Math.floor(this.rng()*a.length))];if(r.roles.length)c.p=pick(r.roles);if(r.outfits)m.outfits[c.p]=pick(m.ownedOutfits[c.p]);if(r.scenes)m.scenes[c.p]=pick(m.ownedScenes);r.last=date(t);return{ok:true};};
 Game.prototype.companionTouch=function(kind='tap'){if(!['tap','stroke','hand'].includes(kind))return this.fail('无效互动');this.refresh();const c=this.s.companion,m=c.meet,t=this.now();if(t-m.lastTouch<3000)return this.fail('她正在回应你');m.lastTouch=t;let heart=0;if(!c.timer&&m.daily.touches[c.p]<5){m.daily.touches[c.p]++;this.s.heart[c.p]++;heart=1;}if(c.timer){if(c.timer.touches>=10)return{ok:true,quiet:true,heart:0};c.timer.touches++;c.timer.lastTouch=t;return{ok:true,quiet:this.rng()>.6,heart:0};}return{ok:true,heart};};
 Game.prototype.timer=function(mode,minutes){if(!Object.hasOwn(modes,mode))return this.fail('无效陪伴模式');if(this.s.companion.timer)return this.fail('已有一段陪伴正在进行');minutes??=mode==='sleep'?10:25;if(!int(minutes,1,mode==='sleep'?480:180))return this.fail('时长需为 1～'+(mode==='sleep'?480:180)+' 分钟的整数');if(['work','study'].includes(mode)&&this.s.heart[this.s.companion.p]<20)return this.fail('好感达到 20 后开启工作与学习陪伴');const start=this.now();this.s.companion.timer={mode,start,end:start+minutes*60000,p:this.s.companion.p,minutes,touches:0,lastTouch:0};return{ok:true};};
 function remember(c,t,now,done){const m=c.meet;m.history.unshift({p:t.p,mode:t.mode,at:now,minutes:done?t.minutes:Math.min(t.minutes,Math.floor(Math.max(0,now-t.start)/60000)),done});m.history=m.history.slice(0,30);}
 Game.prototype.finishTimer=function(){const c=this.s.companion,t=c.timer;if(!t||this.now()<t.end)return this.fail('陪伴还没结束');this.refresh();c.timer=null;c.logs++;const m=c.meet;m.completed++;m.minutes+=t.minutes;m.perPerson[t.p]++;this.s.heart[t.p]+=3;const first=!m.daily.bonus;const reward=first?{coins:300,wish:2}:{};if(first){m.daily.bonus=true;m.tickets+=2;this.reward(reward);}remember(c,t,this.now(),true);return{ok:true,first,reward,tickets:first?2:0,heart:3,p:t.p};};
 Game.prototype.cancelTimer=function(){const c=this.s.companion,t=c.timer;if(!t)return this.fail('没有正在进行的陪伴');if(this.now()>=t.end)return this.fail('目标已完成，请珍藏这段陪伴');remember(c,t,this.now(),false);c.timer=null;return{ok:true,p:t.p};};
 Game.prototype.companionAchievement=function(id){const m=this.s.companion.meet,a=achievements[id];if(!int(id,0,4)||!a||m.completed<a.need)return this.fail('累计陪伴次数不足');if(m.achievements.includes(id))return this.fail('奖励已领取');m.achievements.push(id);this.reward({coins:a.coins,gems:a.gems});return{ok:true,reward:{coins:a.coins,gems:a.gems}};};
}
const api={modes,scenes,outfits,outfitName,music,achievements,fresh,migrate,refresh,valid,install,date};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WarmCompanion=api;
})(typeof window==='undefined'?globalThis:window);
