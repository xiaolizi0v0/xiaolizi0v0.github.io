(function(root,factory){const d=typeof module==='object'&&module.exports?require('./content.js'):root.NSContent;const a=factory(d);if(typeof module==='object'&&module.exports)module.exports=a;else root.NSCore=a})(typeof window==='undefined'?globalThis:window,D=>{
'use strict';
const Mini=typeof module==='object'&&module.exports?require('./minigames.js'):globalThis.NSMini;
const clone=v=>JSON.parse(JSON.stringify(v)),clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function hash(s){let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
function dayKey(ms){const d=new Date(ms);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function weekKey(ms){const d=new Date(ms);d.setDate(d.getDate()-(d.getDay()+6)%7);return dayKey(d.getTime())}
const itemDef=i=>D.items[i?.chain+':'+i?.level];
class Game{
 constructor(o={}){
  this.clock=o.clock||(()=>Date.now());const now=this.clock();this.signals=[];this.undoState=null;
  this.s={version:1,seed:String(o.seed||now),rng:hash(o.seed||now)||1,created:now,stamp:now,energyStamp:now,uid:1,energy:200,coins:160,gems:20,stars:0,xp:0,level:1,progress:0,ready:false,weather:0,board:Array(63).fill(null),inventory:[],capacity:16,inbox:[],tools:{scissors:2,joker:1,hourglass:3,packs:0},generators:D.generators.map(()=>({level:1,charge:16,stamp:now,focus:null})),neighbors:[],rerollAt:[0,0,0],decor:Array(16).fill(0),decorOwned:Array.from({length:16},()=>[0]),discovered:[],recipes:[],clues:[],choices:{},read:[],pendingScene:{kind:'intro'},bonds:Array(6).fill(0),bondClaims:[],ending:null,endReward:false,pass:0,passClaims:[],achievementClaims:[],album:[],dust:0,pity:0,albumClaims:[],albumFull:false,signCount:0,signedDay:'',energyBuys:0,stats:{merges:0,produced:0,orders:0,built:0,recipes:0,discovered:0,maxItems:0,games:0,cards:0,bondRewards:0,highItems:0},day:dayKey(now),week:weekKey(now),daily:{base:{merges:0,orders:0,games:0,built:0,highItems:0},claims:[]},weekly:{base:{merges:0,orders:0,games:0,built:0,highItems:0},claims:[]},arcadeRewards:{},arcadeBest:{},arcade:null,night:null,sold:null};
  for(const [idx,chain]of [[0,'tool'],[1,'tool'],[7,'wood'],[8,'wood'],[14,'cloth'],[15,'cloth'],[28,'flower'],[29,'flower']])this.s.board[idx]=this.make(chain,1,idx===28);
  this.s.npcOrders=Array(6).fill(0);for(const i of this.s.board.filter(Boolean))this.discover(i);for(let i=0;i<3;i++)this.s.neighbors.push(this.newOrder(i));
 }
 random(){this.s.rng=(Math.imul(this.s.rng,1664525)+1013904223)>>>0;return this.s.rng/4294967296}
 emit(type,data={}){this.signals.push({type,...data});if(this.signals.length>100)this.signals.shift()}
 drain(){return this.signals.splice(0)}
 make(chain,level=1,web=false){if(!D.items[chain+':'+level])throw Error('invalid item');return{uid:this.s.uid++,chain,level,web}}
 get area(){return Math.min(15,Math.floor(this.s.progress/4))}
 get season(){return Math.floor(this.area/4)}
 get unlocked(){return Math.min(63,35+this.s.progress)}
 get sourceCount(){return Math.min(16,this.area+1)}
 get project(){return D.projects[this.s.progress]||null}
 invalidate(){this.undoState=null}
 tick(){
  const now=Math.max(this.s.stamp,this.clock()),s=this.s;let energy=0;
  if(s.energy>=200)s.energyStamp=now;else{const n=Math.floor((now-s.energyStamp)/20000);if(n>0){energy=Math.min(n,200-s.energy);s.energy+=energy;s.energyStamp+=n*20000}}
  s.generators.forEach(g=>{const cap=16+(g.level-1)*6,step=(11-g.level)*1000;if(g.charge>=cap)g.stamp=now;else{const n=Math.floor((now-g.stamp)/step);if(n>0){g.charge=Math.min(cap,g.charge+n);g.stamp+=n*step}}});
  for(let i=0;i<s.board.length;i++)if(s.board[i]?.bubble&&s.board[i].until<=now){s.board[i]=null;this.invalidate();this.emit('bubbleExpired',{index:i})}
  const day=dayKey(now),week=weekKey(now),base=()=>Object.fromEntries(['merges','orders','games','built','highItems'].map(k=>[k,s.stats[k]]));
  if(day>s.day){s.day=day;s.daily={base:base(),claims:[]};s.arcadeRewards={};s.energyBuys=0;this.invalidate()}
  if(week>s.week){s.week=week;s.weekly={base:base(),claims:[]};this.invalidate()}
  if(s.night){const e=s.night;if(e.energy>=80)e.energyStamp=now;else{const n=Math.floor((now-e.energyStamp)/30000);if(n>0){e.energy=Math.min(80,e.energy+n);e.energyStamp+=n*30000}}const n=Math.floor((now-e.genStamp)/7000);if(n>0){e.stock=Math.min(30,e.stock+n);e.genStamp+=n*7000}if(now>=e.endAt)e.ended=true;for(const i of e.board.filter(Boolean))this.discoverNight(i);for(let n=0;n<e.order;n++)this.discoverNight({chain:(n%2===0)===(e.path==='drink')?'nightdrink':'nightmusic',level:Math.min(7,2+Math.floor(n/2))})}
  s.stamp=now;return{energy};
 }
 discover(i){const id=i.chain+':'+i.level;if(!this.s.discovered.includes(id)){this.s.discovered.push(id);this.s.stats.discovered++;this.addXp(2+i.level)}if(i.level===itemDef(i).max)this.s.stats.maxItems++;if(i.level>=7)this.s.stats.highItems++}
 discoverNight(i){if(!i||!D.activityChains.some(c=>c.id===i.chain)||this.s.discovered.includes(i.chain+':'+i.level))return;for(let n=1;n<=i.level;n++){const id=i.chain+':'+n;if(!this.s.discovered.includes(id)){this.s.discovered.push(id);this.s.stats.discovered++}}}
 addXp(n){const s=this.s;s.xp+=n;while(s.xp>=40+s.level*25){s.xp-=40+s.level*25;s.level++;s.energy+=20;if(s.level%3===0)s.tools.scissors++;this.emit('level',{level:s.level})}}
 award(r){const s=this.s;for(const k of ['coins','gems','energy','stars'])s[k]+=r[k]||0;if(r.xp)this.addXp(r.xp);for(const k of ['scissors','joker','hourglass','packs'])s.tools[k]+=r[k]||0;for(const i of r.items||[])if(D.items[i.chain+':'+i.level])s.inbox.push(this.make(i.chain,i.level));if(r.decor!==undefined){const a=clamp(r.decor,0,15);if(!s.decorOwned[a].includes(2))s.decorOwned[a].push(2)}this.emit('reward',{reward:clone(r)})}
 empty(context='main'){const b=context==='night'?this.s.night?.board:this.s.board,n=context==='night'?30:this.unlocked;return b?b.findIndex((v,i)=>i<n&&!v):-1}
 generate(id,focus=null){
  this.tick();if(!Number.isInteger(id)||id<0||id>=this.sourceCount)return{ok:false,reason:'此生成器尚未解锁'};
  const s=this.s,g=s.generators[id],def=D.generators[id],index=this.empty(),cost=focus?2:1;
  if(index<0)return{ok:false,reason:'棋盘已满，先合成或收进仓库'};if(g.charge<1)return{ok:false,reason:'储量恢复中，可以使用沙漏或补充'};if(s.energy<cost)return{ok:false,reason:'体力不足，工作餐、任务和商店可以补充'};
  if(focus&&!def.chains.includes(focus))return{ok:false,reason:'这个生成器不生产该物品'};
  this.invalidate();s.energy-=cost;g.charge--;const chain=focus||def.chains[Math.floor(this.random()*def.chains.length)],roll=this.random(),level=g.level>=3&&roll<.08+g.level*.05?3:roll<((g.level>=2?.12+g.level*.05:0)+(s.weather===def.season?.08:0))?2:1;
  s.board[index]=this.make(chain,level);s.stats.produced++;this.discover(s.board[index]);this.emit('spawn',{index});return{ok:true,index,item:clone(s.board[index])};
 }
 move(a,b,context='main'){
  this.tick();const board=context==='night'?this.s.night?.board:this.s.board,n=context==='night'?30:this.unlocked;
  if(!board||![a,b].every(i=>Number.isInteger(i)&&i>=0&&i<n)||a===b||!board[a]||board[a].web||board[a].bubble)return{ok:false,reason:'请选择可以移动的物品'};
  if(context==='night'&&this.s.night.ended)return{ok:false,reason:'本轮夜市已结束，可以结算后重开'};
  const x=board[a],y=board[b];if(y?.bubble)return{ok:false,reason:'先处理这个限时气泡'};
  this.undoState={state:clone(this.s),at:this.clock()};
  if(y&&x.chain===y.chain&&x.level===y.level&&x.level<itemDef(x).max){board[b]=this.make(x.chain,x.level+1);board[a]=null;if(context==='main'){this.s.stats.merges++;this.s.pass+=x.level;this.addXp(1);this.discover(board[b]);if(board[b].level>=4&&this.random()<.05){const index=this.empty();if(index>=0)board[index]={...this.make(x.chain,x.level+1),bubble:true,until:this.s.stamp+90000,price:2+x.level}}}else{this.s.night.score+=x.level*3;this.s.night.tokens+=x.level*3;this.discoverNight(board[b])}this.emit('merge',{index:b,context,level:x.level+1});return{ok:true,type:'merge',index:b}}
  if(y?.web){this.undoState=null;return{ok:false,reason:'用相同等级的物品合成，才能解开结网'};}[board[a],board[b]]=[board[b],board[a]];return{ok:true,type:y?'swap':'move',index:b};
 }
 undo(){if(!this.undoState||this.clock()-this.undoState.at>10000)return false;this.s=this.undoState.state;this.undoState=null;this.tick();this.emit('undo');return true}
 owned(req){return[...this.s.board,...this.s.inventory].filter(i=>i&&!i.web&&!i.bubble&&i.chain===req.chain&&i.level===req.level).length}
 canDeliver(reqs){const need=new Map();for(const r of reqs){const k=r.chain+':'+r.level;need.set(k,(need.get(k)||0)+(r.qty||1))}return[...need].every(([k,n])=>this.owned({chain:k.split(':')[0],level:+k.split(':')[1]})>=n)}
 consume(reqs){if(!this.canDeliver(reqs))return false;for(const r of reqs)for(let n=0;n<(r.qty||1);n++){const match=i=>i&&!i.web&&!i.bubble&&i.chain===r.chain&&i.level===r.level,index=this.s.board.findIndex(match);if(index>=0)this.s.board[index]=null;else this.s.inventory.splice(this.s.inventory.findIndex(match),1)}return true}
 newOrder(slot){const max=this.sourceCount,candidates=D.chains.filter(c=>!c.hidden&&c.generator<max),master=this.s.progress===64,secrets=D.chains.filter(c=>c.hidden&&this.s.recipes.includes(c.id)),chain=secrets.length&&this.random()<.2?secrets[Math.floor(this.random()*secrets.length)]:candidates[Math.floor(this.random()*candidates.length)],level=chain.hidden?2+Math.floor(this.random()*5):master?7+Math.floor(this.random()*6):2+Math.floor(this.random()*Math.min(5,2+this.season));const requirements=[{chain:chain.id,level,qty:1}],cost=2**(level-1);return{id:'order-'+this.s.uid++,slot,npc:1+Math.floor(this.random()*5),requirements,reward:{coins:18+cost*5,xp:15+level*4},title:master?'四季大师委托':['邻里的一点小忙','熟客的预约单','今天也有好心情'][slot]}}
 deliver(kind='main',slot=0){
  this.tick();const s=this.s,order=kind==='main'?this.project:s.neighbors[slot];if(!order||kind==='main'&&s.ready||!this.canDeliver(order.requirements))return false;
  this.invalidate();this.consume(order.requirements);this.award(order.reward);s.stats.orders++;s.pass+=kind==='main'?45:20;if(s.stats.orders%6===0)this.award({energy:40});if(s.stats.orders%3===0)s.tools.packs++;
  if(kind==='main')s.ready=true;else{s.npcOrders[order.npc]++;if(s.npcOrders[order.npc]%3===0)s.bonds[order.npc]++;s.neighbors[slot]=this.newOrder(slot)}this.emit('deliver',{kind});return true;
 }
 reroll(slot){this.tick();if(!Number.isInteger(slot)||slot<0||slot>2||this.s.stamp<this.s.rerollAt[slot])return false;this.invalidate();this.s.neighbors[slot]=this.newOrder(slot);this.s.rerollAt[slot]=this.s.stamp+30000;return true}
 build(){const s=this.s,p=this.project;if(!p||!s.ready||s.stars<1||s.pendingScene)return false;this.invalidate();s.stars--;s.ready=false;s.progress++;s.stats.built++;s.pass+=80;if(p.clue)s.clues.push(p.clue);if(p.part===3){s.tools.packs++;s.bonds[0]++}s.pendingScene={kind:'project',id:p.id};this.emit('build',{project:p.id});return true}
 sceneChoice(option){const s=this.s,p=s.pendingScene?.kind==='project'?D.projects[s.pendingScene.id]:null;if(!p||p.part!==3||![0,1].includes(option)||s.choices[p.id]!==undefined)return false;this.invalidate();s.choices[p.id]=option;s.bonds[option===0?p.npc:0]++;this.award(option===0?{energy:20}:{coins:20});return true}
 dismissScene(){const scene=this.s.pendingScene,p=scene?.kind==='project'?D.projects[scene.id]:null;if(p?.part===3&&this.s.choices[p.id]===undefined)return false;if(scene){this.invalidate();if(p&&!this.s.read.includes(p.id))this.s.read.push(p.id);this.s.pendingScene=null}return true}
 ending(id){if(this.s.progress<64||!D.endings.some(e=>e.id===id))return false;this.invalidate();this.s.ending=id;if(!this.s.endReward){this.s.endReward=true;this.award({coins:1500,gems:30,energy:200,joker:3,packs:4})}return true}
 decorate(area,style){if(!Number.isInteger(area)||area<0||area>=16||this.s.progress<(area+1)*4||![0,1,2].includes(style))return false;const s=this.s;if(!s.decorOwned[area].includes(style)){if(style!==1||s.coins<80)return false;s.coins-=80;s.decorOwned[area].push(1)}this.invalidate();s.decor[area]=style;return true}
 store(index){const s=this.s,i=s.board[index];if(!i||i.web||i.bubble||s.inventory.length>=s.capacity)return false;this.invalidate();s.inventory.push(i);s.board[index]=null;return true}
 retrieve(index){const s=this.s,target=this.empty();if(!Number.isInteger(index)||index<0||index>=s.inventory.length||target<0)return false;this.invalidate();s.board[target]=s.inventory.splice(index,1)[0];return true}
 expand(){const s=this.s,cost=80+(s.capacity-16)*10;if(s.capacity>=48||s.coins<cost)return false;this.invalidate();s.coins-=cost;s.capacity+=4;return true}
 sell(index,confirm=false){const s=this.s,i=s.board[index];if(!i||i.web||i.bubble||i.level>=4&&!confirm)return false;this.invalidate();const price=2**i.level;s.coins+=price;s.sold={item:clone(i),price};s.board[index]=null;return true}
 buyback(){const s=this.s,index=this.empty();if(!s.sold||s.coins<s.sold.price||index<0)return false;this.invalidate();s.coins-=s.sold.price;s.board[index]=s.sold.item;s.sold=null;return true}
 bubble(index,buy=false){this.tick();const s=this.s,i=s.board[index];if(!i?.bubble||buy&&s.gems<i.price)return false;this.invalidate();if(buy){s.gems-=i.price;delete i.bubble;delete i.until;delete i.price;this.discover(i)}else{s.board[index]=null;s.coins++}return true}
 upgrade(id){const s=this.s,g=s.generators[id];if(!g||id>=this.sourceCount||g.level>=5)return false;const cost=80*g.level*g.level;if(s.coins<cost)return false;this.invalidate();s.coins-=cost;g.level++;g.charge=Math.min(16+(g.level-1)*6,g.charge+6);return true}
 refill(id,useTool=false){const s=this.s,g=s.generators[id];if(!g||id>=this.sourceCount||g.charge>=16+(g.level-1)*6)return false;if(useTool?s.tools.hourglass<1:s.coins<30)return false;this.invalidate();if(useTool)s.tools.hourglass--;else s.coins-=30;g.charge=16+(g.level-1)*6;g.stamp=Math.max(s.stamp,this.clock());return true}
 tool(kind,index){const s=this.s,i=s.board[index],def=itemDef(i);if(!i||i.web||i.bubble||!['scissors','joker'].includes(kind)||s.tools[kind]<1)return false;const target=this.empty();if(kind==='scissors'&&(i.level<=1||target<0)||kind==='joker'&&i.level>=def.max)return false;this.invalidate();s.tools[kind]--;if(kind==='scissors'){s.board[index]=this.make(i.chain,i.level-1);s.board[target]=this.make(i.chain,i.level-1)}else{s.board[index]=this.make(i.chain,i.level+1);this.discover(s.board[index])}return true}
 recipe(id){const r=D.recipes.find(r=>r.id===id);if(!r||this.empty()<0||!this.canDeliver([r.a,r.b]))return false;this.invalidate();this.consume([r.a,r.b]);const index=this.empty();this.s.board[index]=this.make(id);this.discover(this.s.board[index]);if(!this.s.recipes.includes(id)){this.s.recipes.push(id);this.s.stats.recipes++;this.award({gems:3,xp:30})}return true}
 buy(id){this.tick();const prices={energy:this.s.energyBuys<3?60:80,scissors:120,joker:180,hourglass:50,pack:100};const cost=prices[id],s=this.s;if(!cost||s.coins<cost)return false;this.invalidate();s.coins-=cost;if(id==='energy'){s.energy+=100;s.energyBuys++;}else if(id==='pack')s.tools.packs++;else s.tools[id]++;return true}
 claimInbox(index){const target=this.empty();if(target<0||!this.s.inbox[index])return false;this.invalidate();this.s.board[target]=this.s.inbox.splice(index,1)[0];this.discover(this.s.board[target]);return true}
 sign(){this.tick();const s=this.s;if(s.signedDay>=s.day)return false;this.invalidate();s.signedDay=s.day;s.signCount++;this.award({energy:100,coins:30+(s.signCount%7)*10,gems:1+(s.signCount%7===0?5:0),packs:s.signCount%7===0?1:0,items:s.signCount%7===0?[{chain:'tool',level:4}]:[]});return true}
 claimPass(index){const s=this.s;if(!Number.isInteger(index)||index<0||index>=D.passThresholds.length||s.pass<D.passThresholds[index]||s.passClaims.includes(index))return false;this.invalidate();s.passClaims.push(index);this.award({coins:50+index*25,energy:30,gems:2,scissors:index%3===0?1:0,joker:index%4===3?1:0,packs:index%3===2?1:0});return true}
 claimAchievement(id){const a=D.achievements.find(a=>a.id===id),s=this.s;if(!a||s.stats[a.stat]<a.target||s.achievementClaims.includes(id))return false;this.invalidate();s.achievementClaims.push(id);this.award(a.reward);return true}
 taskInfo(weekly=false){const s=this.s,r=weekly?s.weekly:s.daily,keys=weekly?['merges','orders',s.progress>=64?'highItems':'built']:['merges','orders','games'],targets=weekly?[100,15,s.progress>=64?3:4]:[15,3,1];return keys.map((key,i)=>({key,target:targets[i],value:s.stats[key]-r.base[key],claimed:r.claims.includes(i)}))}
 claimTask(index,weekly=false){this.tick();const info=this.taskInfo(weekly)[index];if(!info||info.claimed||info.value<info.target)return false;this.invalidate();(weekly?this.s.weekly:this.s.daily).claims.push(index);this.award(weekly?{coins:300,energy:100,packs:1}:{coins:80,energy:40});return true}
 claimBond(npc,threshold){const s=this.s,id=npc+':'+threshold;if(![3,6,10].includes(threshold)||!Number.isInteger(npc)||npc<0||npc>5||s.bonds[npc]<threshold||s.bondClaims.includes(id))return false;this.invalidate();s.bondClaims.push(id);s.stats.bondRewards++;this.award({coins:100,energy:30,joker:threshold===10?1:0,packs:1,items:threshold===3?[{chain:D.generators[npc===0?0:Math.min(15,npc*2)].chains[0],level:4}]:[],decor:threshold===6?Math.min(15,npc*2):undefined});return true}
 openPack(){const s=this.s;if(s.tools.packs<1)return null;this.invalidate();s.tools.packs--;const missing=Array.from({length:24},(_,i)=>i).filter(i=>!s.album.includes(i)),cards=[];let fresh=false;for(let n=0;n<2;n++){let id=s.pity>=3&&missing.length&&n===0?missing[Math.floor(this.random()*missing.length)]:Math.floor(this.random()*24);cards.push(id);if(s.album.includes(id))s.dust+=5;else{s.album.push(id);fresh=true}}s.pity=fresh?0:s.pity+1;s.stats.cards=s.album.length;this.emit('pack',{cards});return cards}
 craftCard(id){const s=this.s;if(!Number.isInteger(id)||id<0||id>=24||s.album.includes(id)||s.dust<30)return false;this.invalidate();s.dust-=30;s.album.push(id);s.stats.cards=s.album.length;return true}
 claimAlbum(set){const s=this.s;if(!Number.isInteger(set)||set<0||set>5||s.albumClaims.includes(set)||![0,1,2,3].every(i=>s.album.includes(set*4+i)))return false;this.invalidate();s.albumClaims.push(set);this.award({coins:200,joker:1,decor:set*2});if(s.album.length===24&&!s.albumFull){s.albumFull=true;this.award({gems:40,energy:200,packs:2})}return true}
 setWeather(season){if(!Number.isInteger(season)||season<0||season>this.season)return false;this.invalidate();this.s.weather=season;return true}
 pauseArcade(paused=true){if(!this.s.arcade||this.s.arcade.done)return false;this.invalidate();this.s.arcade.paused=!!paused;return true}
 setGardenMode(mode){const a=this.s.arcade;if(!a||a.type!==0||a.done||!['plant','water','harvest'].includes(mode))return false;this.invalidate();a.mode=mode;return true}
 startArcade(type){this.tick();if(this.s.arcade?.done&&!this.s.arcade.trial&&!this.s.arcade.rewarded)return false;if((this.s.homeProgress||this.s.progress)<1||!Number.isInteger(type)||type<0||type>3)return false;this.invalidate();this.s.arcade={...Mini.create(type,this.s.day+'-'+this.s.uid),id:'arcade-'+this.s.uid++,trial:type>this.season,credited:false,rewarded:false};return true}
 arcadeAct(index,mode=null){const a=this.s.arcade;if(!a||!Mini.act(a,index,mode))return false;this.invalidate();this.creditArcade();return true}
 arcadeUpdate(dt){const a=this.s.arcade;if(!a)return false;const changed=Mini.update(a,dt);if(changed)this.creditArcade();return changed}
 creditArcade(){const a=this.s.arcade;if(!a?.done||a.credited)return;a.credited=true;this.invalidate();if(!a.trial){this.s.stats.games++;this.s.pass+=10}this.s.arcadeBest[a.type]=Math.max(this.s.arcadeBest[a.type]||0,a.score);this.emit('arcadeDone',{type:a.type,score:a.score,grade:a.grade})}
 claimArcade(){const a=this.s.arcade;if(!a?.done||a.rewarded||a.trial)return false;this.creditArcade();this.invalidate();a.rewarded=true;const count=this.s.arcadeRewards[a.type]||0;if(count>=3)return true;this.s.arcadeRewards[a.type]=count+1;this.award({coins:15+a.grade*30,energy:10+a.grade*10,scissors:a.grade>=2?1:0,decor:a.grade===3?[1,5,8,12][a.type]:undefined});return true}
 startNight(path='drink'){this.tick();if((this.s.homeProgress||this.s.progress)<1||!['drink','music'].includes(path))return false;const old=this.s.night;if(old&&!old.ended)return false;this.invalidate();const now=this.s.stamp;if(old)this.award({coins:Math.floor(old.score/5)+old.board.reduce((n,i)=>n+(i?2**(i.level-1):0),0)});this.s.night={round:(old?.round||0)+1,started:now,endAt:now+7*86400000,ended:false,path,energy:80,energyStamp:now,stock:30,genStamp:now,board:Array(30).fill(null),score:0,tokens:0,order:0,buys:0,claimed:[],best:Math.max(old?.best||0,old?.score||0)};return true}
 nightGenerate(focus=false){this.tick();const e=this.s.night,index=this.empty('night'),cost=focus?2:1;if(!e||e.ended||index<0||e.energy<cost||e.stock<1)return false;this.invalidate();e.energy-=cost;e.stock--;e.board[index]=this.make(focus?(e.path==='drink'?'nightdrink':'nightmusic'):this.random()<.5?'nightdrink':'nightmusic');this.discoverNight(e.board[index]);return true}
 get nightOrder(){const e=this.s.night;if(!e||e.order>=12)return null;return{chain:(e.order%2===0)===(e.path==='drink')?'nightdrink':'nightmusic',level:Math.min(7,2+Math.floor(e.order/2)),qty:1}}
 nightDeliver(){const e=this.s.night,r=this.nightOrder;if(!r||e.ended)return false;const index=e.board.findIndex(i=>i?.chain===r.chain&&i.level===r.level);if(index<0)return false;this.invalidate();e.board[index]=null;e.order++;e.score+=30+2**r.level*2;e.tokens+=30+2**r.level*2;return true}
 nightEnergy(){const e=this.s.night,cost=100*(1+e?.buys);if(!e||e.ended||e.tokens<cost)return false;this.invalidate();e.tokens-=cost;e.buys++;e.energy+=40;return true}
 nightRecycle(index){this.tick();const e=this.s.night,i=e?.board[index];if(!e||e.ended||!Number.isInteger(index)||index<0||index>=30||!i)return false;this.invalidate();const value=2**(i.level-1);e.board[index]=null;e.score+=value;e.tokens+=value;return true}
 claimNight(index){const e=this.s.night;if(!e||!Number.isInteger(index)||index<0||index>=8||e.score<D.eventThresholds[index]||e.claimed.includes(index))return false;this.invalidate();e.claimed.push(index);this.award({coins:80+index*40,energy:30,packs:index%2?1:0,joker:index===6?1:0,decor:index===7?(e.path==='drink'?6:5):undefined});return true}
 serialize(){this.tick();return clone(this.s)}
 static restore(raw,o={}){try{
  if(!raw||raw.version!==1||typeof raw.seed!=='string'||!Array.isArray(raw.board)||raw.board.length!==63||!Array.isArray(raw.inventory)||!Array.isArray(raw.generators)||raw.generators.length!==16)return null;
  const g=new Game({...o,seed:raw.seed}),s=clone(raw),validItem=i=>!i||Number.isInteger(i.uid)&&i.uid>0&&!!itemDef(i)&&typeof i.web==='boolean'&&(!i.bubble||Number.isFinite(i.until)&&Number.isFinite(i.price));
  if(!s.board.every(validItem)||!s.inventory.every(i=>i&&validItem(i))||!s.inbox.every(i=>i&&validItem(i)))return null;
  const seen=new Set();for(const i of [...s.board,...s.inventory,...s.inbox].filter(Boolean)){if(seen.has(i.uid))return null;seen.add(i.uid)}
  for(const k of ['created','stamp','energyStamp','rng','uid','energy','coins','gems','stars','xp','level','progress','weather','capacity','pass','dust','pity','signCount'])if(!Number.isFinite(s[k])||s[k]<0)return null;
  if(!Number.isInteger(s.progress)||s.progress>64||s.capacity<16||s.capacity>48||s.inventory.length>s.capacity||s.stats.built!==s.progress)return null;
  for(const k of ['discovered','recipes','clues','read','bonds','bondClaims','decor','decorOwned','passClaims','achievementClaims','album','albumClaims','neighbors','rerollAt'])if(!Array.isArray(s[k]))return null;
  if(s.bonds.length!==6||s.decor.length!==16||s.decorOwned.length!==16||s.neighbors.length!==3||s.rerollAt.length!==3||s.generators.some(v=>!Number.isInteger(v.level)||v.level<1||v.level>5||!Number.isFinite(v.charge)||v.charge<0||v.charge>16+(v.level-1)*6||!Number.isFinite(v.stamp)))return null;
  for(const v of Object.values(s.stats))if(!Number.isFinite(v)||v<0)return null;for(const v of Object.values(s.tools))if(!Number.isInteger(v)||v<0)return null;
  if(s.discovered.some(id=>!D.items[id])||s.recipes.some(id=>!D.recipes.some(r=>r.id===id))||s.album.some(id=>!Number.isInteger(id)||id<0||id>23)||new Set(s.album).size!==s.album.length)return null;
  if(s.neighbors.some(v=>!Array.isArray(v.requirements)||v.requirements.some(r=>!D.items[r.chain+':'+r.level]||!Number.isInteger(r.qty)||r.qty<1)))return null;
  if(s.night&&(!Array.isArray(s.night.board)||s.night.board.length!==30||!s.night.board.every(validItem)||!['drink','music'].includes(s.night.path)||!Number.isFinite(s.night.endAt)||!Number.isInteger(s.night.order)||s.night.order<0||s.night.order>12))return null;
  if(s.arcade&&(!Mini.valid(s.arcade)||typeof s.arcade.id!=='string'||['trial','credited','rewarded'].some(k=>typeof s.arcade[k]!=='boolean')||s.arcade.rewarded&&!s.arcade.done))return null;
  const ints=['uid','energy','coins','gems','stars','xp','level','weather','capacity','pass','dust','pity','signCount','energyBuys'];
  if(ints.some(k=>!Number.isSafeInteger(s[k])||s[k]<0)||s.uid<1||s.level<1||s.weather>Math.floor(Math.min(15,Math.floor(s.progress/4))/4)||s.capacity%4||s.created>s.stamp||s.energyStamp>s.stamp||typeof s.ready!=='boolean'||typeof s.endReward!=='boolean'||typeof s.albumFull!=='boolean'||typeof s.signedDay!=='string'||typeof s.day!=='string'||typeof s.week!=='string'||s.stars!==(s.ready?1:0)||s.progress===64&&s.ready)return null;
  if(!Number.isInteger(s.rng)||s.rng>4294967295||s.rng<0||s.ending!==null&&!D.endings.some(e=>e.id===s.ending)||s.endReward&&s.progress!==64)return null;
  if(s.board.some((i,n)=>i&&n>=Math.min(63,35+s.progress)))return null;
  const uniqueRange=(xs,max)=>Array.isArray(xs)&&xs.every(n=>Number.isInteger(n)&&n>=0&&n<max)&&new Set(xs).size===xs.length;
  if(!uniqueRange(s.passClaims,12)||!uniqueRange(s.albumClaims,6)||!uniqueRange(s.read,s.progress)||new Set(s.discovered).size!==s.discovered.length||new Set(s.recipes).size!==s.recipes.length||new Set(s.clues).size!==s.clues.length||s.clues.some(c=>!D.clues.includes(c)))return null;
  if(s.achievementClaims.some(id=>!D.achievements.some(a=>a.id===id))||new Set(s.achievementClaims).size!==s.achievementClaims.length||s.stats.discovered!==s.discovered.length||s.stats.cards!==s.album.length||s.stats.recipes!==s.recipes.length)return null;
  if(!s.npcOrders||s.npcOrders.length!==6||[...s.npcOrders,...s.bonds].some(n=>!Number.isInteger(n)||n<0)||s.rerollAt.some(n=>!Number.isFinite(n)||n<0))return null;
  if(s.decor.some((v,i)=>![0,1,2].includes(v)||!s.decorOwned[i].includes(v))||s.decorOwned.some(v=>!uniqueRange(v,3)||!v.includes(0)))return null;
  if(!s.choices||typeof s.choices!=='object'||Array.isArray(s.choices)||Object.entries(s.choices).some(([id,v])=>!Number.isInteger(+id)||!D.projects[+id]||D.projects[+id].part!==3||+id>=s.progress||![0,1].includes(v)))return null;
  if(s.pendingScene&&!(s.pendingScene.kind==='intro'&&s.progress===0||s.pendingScene.kind==='project'&&Number.isInteger(s.pendingScene.id)&&s.pendingScene.id===s.progress-1))return null;
  const statKeys=['merges','produced','orders','built','recipes','discovered','maxItems','games','cards','bondRewards','highItems'];
  if(statKeys.some(k=>!Number.isSafeInteger(s.stats[k])||s.stats[k]<0)||['scissors','joker','hourglass','packs'].some(k=>!Number.isSafeInteger(s.tools[k])||s.tools[k]<0))return null;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(s.day)||!/^\d{4}-\d{2}-\d{2}$/.test(s.week)||s.signedDay&&!/^\d{4}-\d{2}-\d{2}$/.test(s.signedDay))return null;
  for(const tasks of [s.daily,s.weekly])if(!tasks?.base||['merges','orders','games','built','highItems'].some(k=>!Number.isInteger(tasks.base[k])||tasks.base[k]<0||tasks.base[k]>s.stats[k])||!uniqueRange(tasks.claims,3))return null;
  if(!s.arcadeRewards||!s.arcadeBest||Object.entries(s.arcadeRewards).some(([k,v])=>!['0','1','2','3'].includes(k)||!Number.isInteger(v)||v<0||v>3)||Object.entries(s.arcadeBest).some(([k,v])=>!['0','1','2','3'].includes(k)||!Number.isFinite(v)||v<0))return null;
  if(s.neighbors.some(v=>typeof v.id!=='string'||!Number.isInteger(v.npc)||v.npc<1||v.npc>5||!v.reward||!Number.isFinite(v.reward.coins)||v.reward.coins<0||!Number.isFinite(v.reward.xp)||v.reward.xp<0))return null;
  if(s.bondClaims.some(id=>!/^([0-5]):(3|6|10)$/.test(id))||new Set(s.bondClaims).size!==s.bondClaims.length)return null;
  if(s.sold&&(!validItem(s.sold.item)||!Number.isInteger(s.sold.price)||s.sold.price!==2**s.sold.item.level))return null;
  if(s.night){const e=s.night;if(['round','started','endAt','energy','energyStamp','stock','genStamp','score','tokens','order','buys','best'].some(k=>!Number.isSafeInteger(e[k])||e[k]<0)||e.round<1||e.stock>30||e.tokens>e.score||e.endAt!==e.started+7*86400000||typeof e.ended!=='boolean'||!uniqueRange(e.claimed,8)||e.board.some(i=>i&&(!['nightdrink','nightmusic'].includes(i.chain)||i.web||i.bubble)))return null;for(const i of e.board.filter(Boolean)){if(seen.has(i.uid))return null;seen.add(i.uid)}}
  if(s.uid<=Math.max(0,...seen))return null;
  g.s=s;g.signals=[];g.undoState=null;g.tick();return g;
 }catch{return null}}
}
return{Game,hash,dayKey,weekKey,itemDef};
});
