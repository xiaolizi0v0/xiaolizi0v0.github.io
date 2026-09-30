/* Rift / Riot — standalone Canvas action game, original procedural artwork. */
(() => {
  'use strict';
  const D = window.RIFT_DATA, $ = id => document.getElementById(id);
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v)), rand=(a,b)=>a+Math.random()*(b-a);
  const choose=a=>a[Math.floor(Math.random()*a.length)], num=n=>Math.floor(n).toLocaleString('zh-CN');
  const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r};
  const KEY='rift-riot-save-v1', RUNKEY='rift-riot-run-v1';
  const defaultSave=()=>({version:1,coins:0,heroes:['blade'],meta:{},settings:{sound:true,volume:.45,vibration:true,shake:true,quality:'high',numbers:true,auto:true},stats:{kills:0,combo:0,wins:0,chapter:0,evolutions:0,endless:0,runs:0},claimed:[],daily:{date:'',kills:0,waves:0,runs:0,claimed:[]},lastHero:0,lastChapter:0,lastDifficulty:0});
  let storageOK=true;
  function read(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
  function write(key,v){try{localStorage.setItem(key,JSON.stringify(v));return true}catch{storageOK=false;return false}}
  function remove(key){try{localStorage.removeItem(key)}catch{storageOK=false}}
  let save=defaultSave();const loaded=read(KEY);
  if(loaded?.version===1){save={...save,...loaded,settings:{...save.settings,...loaded.settings},stats:{...save.stats,...loaded.stats}};save.meta=loaded.meta||{};save.heroes=Array.isArray(loaded.heroes)?loaded.heroes:['blade'];save.claimed=Array.isArray(loaded.claimed)?loaded.claimed:[]}
  // Sanitize durable values so older or damaged saves cannot poison gameplay.
  save.coins=Math.max(0,Number(save.coins)||0);D.meta.forEach(m=>save.meta[m.id]=clamp(Number(save.meta[m.id])||0,0,m.max));
  Object.keys(save.stats).forEach(k=>save.stats[k]=Math.max(0,Number(save.stats[k])||0));
  save.settings.volume=clamp(Number(save.settings.volume)||0,0,1);
  const localDate=()=>{const t=new Date();return `${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()}`};
  function resetDaily(){if(save.daily?.date!==localDate())save.daily={date:localDate(),kills:0,waves:0,runs:0,claimed:[]}}
  resetDaily();write(KEY,save);
  let toastTimer;
  function toast(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2600)}
  class AudioBus{
    constructor(){this.ctx=null;this.musicTime=0;this.step=0}
    unlock(){if(!this.ctx){try{this.ctx=new (window.AudioContext||window.webkitAudioContext)()}catch{}}if(this.ctx?.state==='suspended')this.ctx.resume().catch(()=>{})}
    tone(f,d=.08,type='square',gain=.07,end){if(!save.settings.sound||!this.ctx||this.ctx.state!=='running')return;try{const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;if(end)o.frequency.exponentialRampToValueAtTime(Math.max(20,end),c.currentTime+d);g.gain.setValueAtTime(gain*save.settings.volume,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+d)}catch{}}
    sfx(s){const sounds={hit:[170,.055,'sawtooth',.045,60],slash:[420,.1,'triangle',.08,70],shot:[660,.075,'square',.045,180],dash:[220,.18,'sawtooth',.04,900],hurt:[110,.18,'sawtooth',.1,38],kill:[780,.06,'triangle',.04,1100],level:[520,.3,'sine',.13,1040],ult:[75,.7,'sawtooth',.14,650],heal:[440,.3,'sine',.08,880],click:[400,.05,'triangle',.035,500]};this.tone(...(sounds[s]||sounds.click))}
    tick(dt){this.musicTime-=dt;if(this.musicTime>0)return;this.musicTime=.32;const notes=[65.4,65.4,98,65.4,77.8,77.8,116.5,98];this.tone(notes[this.step++%8],.19,'triangle',.055);if(this.step%4===0)this.tone(130,.08,'sine',.06,35)}
  }
  const audio=new AudioBus();
  const canvas=$('world'),ctx=canvas.getContext('2d',{alpha:false});
  let lobbyDirty=true;
  const lobbyArt=typeof Image==='function'?new Image():null;
  if(lobbyArt){lobbyArt.onload=()=>{lobbyDirty=true};lobbyArt.src='neon-reaping/lobby-art.png';}
  let W=1280,H=720,scale=1,ground=535;
  function resize(){lobbyDirty=true;const w=window.innerWidth,h=window.innerHeight;scale=w/(w/h<1?760:1280);W=w/scale;H=h/scale;ground=H*(w/h<1?.64:.73);const dpr=Math.min(window.devicePixelRatio||1,save.settings.quality==='high'?2:1);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr*scale,0,0,dpr*scale,0,0);if(game)game.camera=clamp(game.p?.x-W*.43||0,0,3600-W)}
  const input={move:0,attack:false,keys:new Set(),stickId:null,attackIds:new Set()};
  let game=null,selectedHero=clamp(save.lastHero||0,0,2),selectedChapter=clamp(save.lastChapter||0,0,3),selectedDifficulty=clamp(save.lastDifficulty||0,0,2);
  let state='lobby',menuReturn='lobby',bannerTimer=0,hitStop=0,shake=0,last=0,saveTimer=0,hudTimer=0,bgTime=0;
  const transient={particles:[],texts:[],slashes:[],flashes:[],ghosts:[]};
  function clearInput(){input.move=0;input.attack=false;input.keys.clear();input.stickId=null;input.attackIds.clear();$('stick').style.transform='translateX(0)'}
  function banner(title,sub=''){ $('banner').innerHTML=`${title}<small>${sub}</small>`;$('banner').style.opacity=1;bannerTimer=2.8; }
  function burst(x,y,color,count=12,power=150){const cap=save.settings.quality==='high'?450:130;for(let i=0;i<count&&transient.particles.length<cap;i++)transient.particles.push({x,y,vx:rand(-power,power),vy:rand(-power,power),life:rand(.18,.55),max:.55,color,size:rand(2,5)})}
  function floating(x,y,t,color='#fff',big=false){if(!save.settings.numbers&&!big)return;if(transient.texts.length<100)transient.texts.push({x,y,t,color,big,life:.7})}
  function vibrate(ms){if(save.settings.vibration&&navigator.vibrate)navigator.vibrate(ms)}
  const up=id=>game?.build[id]||0;
  function damageScale(){return (1+up('damage')*.15)*(1+save.meta.power*.05)}
  function maxHp(){return D.heroes[game.hero].hp+save.meta.vital*12+up('hp')*25}
  function haste(){return Math.max(.55,1-up('haste')*.08)}
  function areaScale(){return 1+up('range')*.15}
  function difficultyScale(){return D.chapters[game.chapter].scale*D.difficulties[game.difficulty].scale*(game.chapter===3?1+Math.floor((game.wave-1)/6)*.32:1)}
  function waveQuota(){return D.chapters[game.chapter].quota+(game.wave-1)%6*5}
  function waveDuration(){return 28+(game.wave-1)%6*4}
  function platforms(){return[{x:620,w:210,y:-105},{x:1240,w:240,y:-150},{x:2010,w:220,y:-115},{x:2790,w:250,y:-165}]}
  function newGame(trial=false){
    clearInput();Object.values(transient).forEach(a=>a.length=0);hitStop=0;shake=0;
    game={version:1,id:Date.now().toString(36),hero:selectedHero,chapter:selectedChapter,difficulty:selectedDifficulty,trial,wave:1,waveKills:0,kills:0,totalTime:0,waveTime:0,coins:save.meta.supply*15,level:1,xp:0,xpNeed:32,build:{},evolved:[],evolutions:0,p:{x:1800,y:0,vy:0,face:1,hp:0,jumps:0,inv:1,attackCd:0,attackStep:0,attackChain:0,skillCd:0,dashCd:0,dashTime:0,dashHits:[],ult:0,heals:2,shield:0,shieldTimer:0},enemies:[],bullets:[],drops:[],zones:[],weaponTimers:{},nextId:1,spawnTimer:.7,combo:0,comboTimer:0,bestCombo:0,bossSpawned:false,eliteSpawned:false,rerolls:3,pendingLevels:0,shopUsed:[],phase:'playing',tutorial:!save.stats.runs};
    game.p.hp=maxHp();state='playing';closeOverlay();$('lobby').classList.add('hidden');$('hud').classList.remove('hidden');game.camera=game.p.x-W*.43;audio.unlock();banner('街区接管',`${D.chapters[game.chapter].name} / WAVE 01`);if(game.tutorial)toast('左侧移动，右侧跳跃与出招。AUTO 默认帮你攻击。');persistRun();updateHud();
  }
  function snapshot(){if(!game)return null;const s=JSON.parse(JSON.stringify(game));delete s.camera;return s}
  function persistRun(){if(game&&!game.trial&&state!=='result'){game.phase=['playing','pause','bag','settings','help'].includes(state)?'playing':state;write(RUNKEY,snapshot())}}
  function validRun(r){return r?.version===1&&r.p&&Array.isArray(r.enemies)&&Array.isArray(r.bullets)&&Array.isArray(r.drops)&&Array.isArray(r.zones)&&r.hero>=0&&r.hero<3&&r.chapter>=0&&r.chapter<4&&Number.isFinite(r.p.hp)&&Number.isFinite(r.p.x)&&r.wave>0&&r.p.hp>0&&r.phase!=='result'}
  function resumeRun(){const r=read(RUNKEY);if(!validRun(r)){toast('没有可继续的行动存档');remove(RUNKEY);renderLobby();return}game=r;game.camera=clamp(game.p.x-W*.43,0,Math.max(0,3600-W));clearInput();Object.values(transient).forEach(a=>a.length=0);$('lobby').classList.add('hidden');$('hud').classList.remove('hidden');audio.unlock();if(r.phase==='upgrade'||r.pendingLevels>0)showUpgrade(false);else if(r.phase==='shop')showShop();else{state='playing';closeOverlay();banner('行动恢复',`WAVE ${game.wave} / 已恢复本地存档`)}updateHud()}
  function startWave(){game.waveKills=0;game.waveTime=0;game.bossSpawned=false;game.eliteSpawned=false;game.enemies=[];game.bullets=[];game.zones=[];game.spawnTimer=.5;game.shopUsed=[];game.p.inv=1.3;state='playing';closeOverlay();clearInput();banner(game.wave%6===0?'首领接战':'清场继续',`WAVE ${String(game.wave).padStart(2,'0')} / ${game.chapter===3?'无尽暴走':D.chapters[game.chapter].name}`);persistRun()}
  function spawnEnemy(type,boss=false,elite=false){
    const p=game.p,s=difficultyScale(),local=(game.wave-1)%6;
    let x=clamp(p.x+choose([-1,1])*rand(W*.5,W*.68),55,3545);if(Math.abs(x-p.x)<220)x=clamp(p.x+(p.x<1800?1:-1)*rand(370,600),50,3550);
    const templates={runner:[38,145,9,18],fast:[28,215,8,16],tank:[115,65,17,29],gunner:[48,95,10,20],fly:[35,145,9,17],bomb:[32,170,20,18],charger:[4200,100,22,62],bossGunner:[4800,85,19,57],summoner:[5500,75,18,55]};
    const t=templates[type]||templates.runner,hp=(t[0]+(boss?0:local*9))*s*(elite?3.5:1);
    const e={id:game.nextId++,type,x,y:type==='fly'?-rand(80,170):0,hp,maxHp:hp,speed:t[1]*(1+local*.04)*(elite?1.05:1),damage:t[2]*Math.sqrt(s),r:t[3]*(elite?1.3:1),boss,elite,cd:rand(.5,1.5),wind:0,mode:'',face:x>p.x?-1:1,flash:0,slow:0,freeze:0,vx:0,phase:1,phaseNotified:false,dead:false,age:rand(0,6)};
    if(boss)e.x=clamp(p.x+500,300,3300);game.enemies.push(e);return e;
  }
  function nearest(x=game.p.x,y=game.p.y,limit=800){let best=null,dist=limit;for(const e of game.enemies){if(e.dead)continue;const d=Math.hypot(e.x-x,(e.y-y)*.6);if(d<dist){dist=d;best=e}}return best}
  function hurtEnemy(e,base,opts={}){
    if(e.dead)return;const crit=!opts.noCrit&&Math.random()<.05+save.meta.fortune*.02+up('crit')*.08;
    const damage=base*damageScale()*(e.boss||e.elite?1+up('knock')*.1:1)*(crit?2:1);e.hp-=damage;e.flash=.1;
    if(opts.knock)e.vx+=(opts.dir||Math.sign(e.x-game.p.x)||1)*opts.knock*(1+up('knock')*.25)*(e.boss?.2:1);
    if(opts.freeze)e.freeze=Math.max(e.freeze,opts.freeze*(e.boss?.3:1));if(opts.slow)e.slow=Math.max(e.slow,opts.slow);
    floating(e.x+rand(-14,14),e.y-e.r-20,Math.ceil(damage),crit?'#ffcd59':opts.color||'#fff',crit);
    burst(e.x,e.y-e.r,opts.color||'#c1ff35',crit?6:3,110);if(e.hp<=0)kill(e);
  }
  function kill(e){
    if(e.dead)return;e.dead=true;game.kills++;game.waveKills++;game.combo++;game.comboTimer=4;game.bestCombo=Math.max(game.bestCombo,game.combo);game.p.ult=clamp(game.p.ult+(e.boss?30:e.elite?12:2.5)*(1+up('charge')*.25),0,100);
    game.coins+=Math.round((e.boss?80:e.elite?15:2)*(1+up('gold')*.25));
    const xp=e.boss?100:e.elite?38:8;game.drops.push({x:e.x,y:e.y-20,vx:rand(-70,70),vy:-140,type:'xp',value:xp,life:35});
    if(e.boss||e.elite||Math.random()<.035)game.drops.push({x:e.x+20,y:e.y-30,vx:70,vy:-160,type:'heal',value:e.boss?35:12,life:35});
    if(up('leech')&&game.kills%8===0)game.p.hp=Math.min(maxHp(),game.p.hp+up('leech')*3);
    burst(e.x,e.y-e.r,e.boss?'#ff459a':'#b353ff',e.boss?50:12,e.boss?400:200);audio.sfx('kill');
    if(e.boss){shake=13;hitStop=.16;banner('首领击破','BOSS ELIMINATED')}else if(game.combo%25===0){floating(game.p.x,game.p.y-130,`${game.combo} 连击！`,'#c1ff35',true);audio.sfx('level')}
  }
  function hurtPlayer(amount,x,y,r=45){
    const p=game.p;if(p.inv>0||Math.abs(p.x-x)>r+18||Math.abs(p.y-28-y)>r+28)return false;
    if(p.shield>0){p.shield--;p.inv=.5;burst(p.x,p.y-30,'#47e6f2',15);floating(p.x,p.y-70,'护盾抵挡','#47e6f2');return false}
    const damage=amount*Math.max(.5,1-up('armor')*.1);p.hp=Math.max(0,p.hp-damage);p.inv=.7;game.combo=0;game.comboTimer=0;shake=7;audio.sfx('hurt');vibrate(35);floating(p.x,p.y-85,`−${Math.ceil(damage)}`,'#ff459a',true);burst(p.x,p.y-35,'#ff459a',15);
    if(p.hp<=0)finish(false);return true;
  }
  function melee(base,range,dir=game.p.face,knock=170){const p=game.p;for(const e of game.enemies){if(!e.dead&&Math.abs(e.y-p.y)<100&&Math.abs(e.x-p.x)<range+e.r&&(e.x-p.x)*dir>-30)hurtEnemy(e,base,{knock,dir})}}
  function playerBullet(x,y,vx,vy,damage,color,extra={}){game.bullets.push({x,y,vx,vy,damage,color,life:1.6,r:6,friendly:true,hits:[],pierce:1,...extra})}
  function attack(){
    if(state!=='playing'||game.p.attackCd>0)return;const p=game.p,h=D.heroes[game.hero];p.attackCd=h.interval*haste();p.attackStep=p.attackChain>0?(p.attackStep+1)%3:0;p.attackChain=.85;
    const target=nearest(p.x,p.y,650);if(target&&!Math.abs(input.move)&&!input.keys.has('KeyA')&&!input.keys.has('KeyD'))p.face=Math.sign(target.x-p.x)||p.face;
    if(game.hero===0){const final=p.attackStep===2;const reach=(final?170:125)*areaScale();melee(h.damage*(final?1.65:1),reach,p.face,final?400:180);transient.slashes.push({x:p.x,y:p.y-38,dir:p.face,r:reach,life:.16,max:.16,color:final?'#fff':'#c1ff35',step:p.attackStep});for(let i=0;i<up('multi');i++)playerBullet(p.x,p.y-35,p.face*720,0,h.damage*.35,'#c1ff35',{life:.25,r:14,pierce:3});audio.sfx('slash');if(target&&Math.abs(target.x-p.x)<reach){hitStop=.035;shake=final?4:1;vibrate(8)}}
    else if(game.hero===1){for(let i=0;i<=up('multi');i++)playerBullet(p.x+p.face*30,p.y-38,p.face*870,(i-up('multi')*.5)*95,h.damage,'#ffdd76',{pierce:2+Math.floor(up('multi')/2),r:4});audio.sfx('shot')}
    else {for(let i=0;i<=up('multi');i++)playerBullet(p.x+p.face*25,p.y-45,p.face*570,(i-up('multi')*.5)*90,h.damage,'#47e6f2',{pierce:1,r:10,explode:80*areaScale(),slow:2});audio.sfx('shot')}
  }
  function action(kind){
    audio.unlock();if(state!=='playing'||!game)return;const p=game.p,h=D.heroes[game.hero];
    if(kind==='attack'){attack();return}
    if(kind==='jump'){if(p.jumps>=2)return;p.vy=p.jumps===0?-570:-480;p.jumps++;burst(p.x,p.y,'#eee',8,80);audio.tone(220,.1,'triangle',.035,400)}
    if(kind==='drop'&&p.y<0){p.dropTime=.3;p.y+=4;p.vy=Math.max(p.vy,180);}
    if(kind==='dash'){if(p.dashCd>0)return;p.dashCd=2.5/(1+up('speed')*.1);p.dashTime=.24+up('dash')*.04;p.inv=Math.max(p.inv,p.dashTime+.08);p.dashHits=[];audio.sfx('dash');vibrate(12)}
    if(kind==='heal'){if(p.heals<=0){toast('治疗已用完，可在波次补给补充');return}if(p.hp>=maxHp()){toast('当前生命已满');return}p.heals--;p.hp=Math.min(maxHp(),p.hp+maxHp()*.4);burst(p.x,p.y-30,'#c1ff35',30);audio.sfx('heal');floating(p.x,p.y-90,'恢复 40%','#c1ff35',true);persistRun()}
    if(kind==='skill'){
      if(p.skillCd>0)return;p.skillCd=h.skillCd*Math.max(.4,1-up('skill')*.13);audio.sfx('slash');vibrate(20);
      if(game.hero===0){playerBullet(p.x,p.y-40,p.face*590,0,45,'#c1ff35',{r:25,pierce:99,life:1.1,returning:true,spin:0});}
      if(game.hero===1){for(let i=-4;i<=4;i++)playerBullet(p.x,p.y-40,p.face*720*Math.cos(i*.13),720*Math.sin(i*.13),36,'#ff459a',{r:7,pierce:4,life:1.4});}
      if(game.hero===2){for(const e of game.enemies)if(Math.abs(e.x-p.x)<420*areaScale())hurtEnemy(e,70,{freeze:2.5,knock:200,color:'#47e6f2'});transient.flashes.push({x:p.x,y:p.y-30,r:420*areaScale(),life:.55,max:.55,color:'#47e6f2'})}
    }
    if(kind==='ult'){
      if(p.ult<100){toast(`超载能量 ${Math.floor(p.ult)}%，击杀敌人继续充能`);return}p.ult=0;p.inv=2;audio.sfx('ult');shake=16;hitStop=.12;vibrate([30,25,50]);banner('超 载 解 放',h.name.toUpperCase()+' / LIMIT BREAK');
      if(game.hero===0){for(const e of game.enemies)if(Math.abs(e.x-p.x)<W*.75)hurtEnemy(e,270,{knock:900,color:'#c1ff35'});for(let i=0;i<6;i++)transient.slashes.push({x:p.x+rand(-300,300),y:p.y-rand(0,130),dir:choose([-1,1]),r:550,life:.6,max:.6,color:'#c1ff35',step:i%3})}
      else {game.zones.push({x:p.x,y:-35,r:game.hero===1?600:560,life:4,tick:0,damage:game.hero===1?65:45,color:h.color,freeze:game.hero===2?.6:0});transient.flashes.push({x:p.x,y:-60,r:600,life:.65,max:.65,color:h.color})}
    }
    updateHud();
  }
  function addXp(v){game.xp+=v*(1+up('xp')*.18+save.meta.learn*.05);while(game.xp>=game.xpNeed){game.xp-=game.xpNeed;game.level++;game.pendingLevels++;game.xpNeed=Math.round(32+game.level*12+Math.pow(game.level,1.35)*2.5)} }
  function updateWeapons(dt){
    const p=game.p;for(const item of D.upgrades.filter(i=>i.weapon&&up(i.id))){const id=item.id,lv=up(id),evo=game.evolved.includes(id);game.weaponTimers[id]=(game.weaponTimers[id]||0)-dt;if(game.weaponTimers[id]>0)continue;
      const target=nearest(),base=D.heroes[game.hero].damage;let interval=1;
      if(id==='bladeOrbit'){interval=.23;const n=evo?6:lv+1;for(let i=0;i<n;i++){const a=game.totalTime*3+i*Math.PI*2/n,x=p.x+Math.cos(a)*(evo?145:100)*areaScale(),y=p.y-40+Math.sin(a)*60;for(const e of game.enemies)if(!e.dead&&Math.hypot(e.x-x,e.y-e.r-y)<e.r+26)hurtEnemy(e,base*(evo?1.2:.65),{knock:60,color:'#c1ff35'})}}
      if(id==='lightning'){interval=Math.max(.7,2.5-lv*.25);const targets=game.enemies.filter(e=>!e.dead&&Math.abs(e.x-p.x)<800).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x)).slice(0,evo?8:Math.ceil(lv/2));for(const e of targets){hurtEnemy(e,base*(1+lv*.35),{color:'#b353ff'});game.zones.push({x:e.x,y:e.y-300,r:4,life:.17,tick:99,damage:0,color:'#b353ff',lightning:true,endY:e.y});}}
      if(id==='fire'){interval=.45;const radius=(evo?240:90+lv*18)*areaScale();for(const e of game.enemies)if(!e.dead&&Math.abs(e.x-p.x)<radius&&Math.abs(e.y-p.y)<100)hurtEnemy(e,base*(.35+lv*.12)*(evo?1.5:1),{noCrit:true,color:'#ff9050'});}
      if(id==='drone'){interval=Math.max(.25,1.4-lv*.2);if(target)for(let i=0;i<(evo?3:1);i++){const x=p.x-45,y=p.y-115,a=Math.atan2(target.y-target.r-y,target.x-x);playerBullet(x,y,Math.cos(a)*650,Math.sin(a)*650,base*(.55+lv*.18),'#ff459a',{r:5,pierce:evo?3:1,home:target.id,life:1.8})}}
      if(id==='ice'){interval=Math.max(.5,2-lv*.2);for(const dir of [-1,1])for(let i=0;i<(evo?3:1);i++)playerBullet(p.x,p.y-30,dir*600,-i*170,base*(.6+lv*.2),'#47e6f2',{r:8,pierce:4,slow:2,freeze:evo?1:0,life:1.5})}
      if(id==='pulse'){interval=Math.max(1,3.5-lv*.3);const radius=(evo?350:180+lv*20)*areaScale();for(const e of game.enemies)if(!e.dead&&Math.hypot(e.x-p.x,e.y-p.y)<radius)hurtEnemy(e,base*(.6+lv*.3)*(evo?1.8:1),{knock:600,color:'#ffcd59'});transient.flashes.push({x:p.x,y:p.y-30,r:radius,life:.4,max:.4,color:'#ffcd59'})}
      game.weaponTimers[id]=interval*haste();
    }
  }
  function updateEnemies(dt){
    const p=game.p;
    for(const e of game.enemies){
      if(e.dead)continue;e.age+=dt;e.flash=Math.max(0,e.flash-dt);e.slow=Math.max(0,e.slow-dt);e.freeze=Math.max(0,e.freeze-dt);e.x=clamp(e.x+e.vx*dt,35,3565);e.vx*=Math.exp(-8*dt);if(e.freeze>0)continue;
      const dx=p.x-e.x,dist=Math.abs(dx);e.face=Math.sign(dx)||e.face;const speed=e.speed*(e.slow>0?.4:1);e.cd-=dt;
      if(e.boss&&e.hp<e.maxHp*.5){e.phase=2;if(!e.phaseNotified){e.phaseNotified=true;banner('首领狂暴','PHASE 02 / 预警加速');burst(e.x,e.y-40,'#ff459a',35)}}
      if(e.wind>0){e.wind-=dt;if(e.wind<=0)enemyStrike(e);continue}
      if(e.mode==='charge'){e.x+=e.chargeDir*speed*5*dt;e.chargeLife-=dt;hurtPlayer(e.damage,e.x,e.y-30,e.r);if(e.chargeLife<=0||e.x<80||e.x>3520){e.mode='';e.cd=e.phase===2?1.8:2.8}continue}
      if(e.type==='fly'){e.y=-115+Math.sin(e.age*3)*45;if(dist>55)e.x+=e.face*speed*dt;if(dist<80&&e.cd<=0){e.wind=.4;e.mode='flyAttack';e.cd=1.6}continue}
      if(e.boss){
        if(e.cd<=0){e.wind=e.phase===2?.65:.9;e.targetX=p.x;e.targetY=p.y-30;e.mode=e.type==='charger'?'chargeWarn':e.type==='bossGunner'?'barrage':'summon';e.cd=3.5;audio.tone(110,.12,'square',.04,220)}
        else if(dist>320)e.x+=e.face*speed*dt;else if(dist<140)e.x-=e.face*speed*.5*dt;continue;
      }
      if(e.type==='gunner'){if(dist>470)e.x+=e.face*speed*dt;else if(dist<200)e.x-=e.face*speed*.8*dt;if(dist<650&&e.cd<=0){e.wind=.55;e.mode='shoot';e.targetX=p.x;e.targetY=p.y-30;e.cd=2.4}continue}
      if(dist>e.r+26)e.x+=e.face*speed*dt;
      if(dist<e.r+(e.type==='bomb'?70:45)&&e.cd<=0&&Math.abs(p.y-e.y)<95){e.wind=e.type==='bomb'?.75:e.type==='tank'?.65:.38;e.mode=e.type==='bomb'?'explode':'melee';e.cd=e.type==='tank'?1.8:1.3}
    }
  }
  function enemyBullet(e,angle,speed=290,damage=e.damage){game.bullets.push({x:e.x,y:e.y-e.r*.7,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,damage,color:'#ff516e',life:5,r:7,friendly:false})}
  function enemyStrike(e){
    const p=game.p;
    if(e.mode==='chargeWarn'){e.mode='charge';e.chargeDir=Math.sign(e.targetX-e.x)||e.face;e.chargeLife=1.1;return}
    if(e.mode==='barrage'){const a=Math.atan2(e.targetY-(e.y-e.r*.7),e.targetX-e.x);for(let i=-3;i<=3;i++)enemyBullet(e,a+i*.16,e.phase===2?390:290);if(e.phase===2)for(let i=0;i<10;i++)enemyBullet(e,i*Math.PI*2/10,220);e.cd=e.phase===2?1.5:2.8;}
    else if(e.mode==='summon'){for(let i=0;i<(e.phase===2?4:2);i++){if(game.enemies.filter(n=>!n.dead).length<48){const n=spawnEnemy(choose(['runner','fly','fast']));n.x=clamp(e.x+rand(-230,230),50,3550)}}game.zones.push({x:e.targetX,y:-10,r:140,life:.7,tick:.45,damage:e.damage*1.4,color:'#ff459a',hostile:true,oneShot:true});e.cd=e.phase===2?2.1:3.5;}
    else if(e.mode==='shoot'){enemyBullet(e,Math.atan2(e.targetY-e.y+15,e.targetX-e.x),300);}
    else if(e.mode==='explode'){hurtPlayer(e.damage,e.x,e.y-20,140);transient.flashes.push({x:e.x,y:e.y-20,r:140,life:.4,max:.4,color:'#ff516e'});hurtEnemy(e,e.maxHp*2,{noCrit:true});}
    else if(e.mode==='flyAttack'){hurtPlayer(e.damage,e.x,e.y,80);}
    else {hurtPlayer(e.damage,e.x+e.face*20,e.y-30,e.type==='tank'?90:65);transient.slashes.push({x:e.x,y:e.y-30,dir:e.face,r:e.type==='tank'?100:65,life:.13,max:.13,color:'#ff516e',step:0})}
    e.mode='';
  }
  function updateBullets(dt){
    for(const b of game.bullets){b.life-=dt;if(b.life<=0)continue;if(b.returning&&b.life<.55)b.vx=(game.p.x-b.x)*5;if(b.home){const e=game.enemies.find(e=>e.id===b.home&&!e.dead);if(e){const a=Math.atan2(e.y-e.r-b.y,e.x-b.x);b.vx+=(Math.cos(a)*650-b.vx)*dt*5;b.vy+=(Math.sin(a)*650-b.vy)*dt*5}}
      b.x+=b.vx*dt;b.y+=b.vy*dt;
      if(b.friendly){for(const e of game.enemies){if(e.dead||b.hits.includes(e.id)||Math.abs(e.x-b.x)>e.r+b.r||Math.abs(e.y-e.r*.8-b.y)>e.r+b.r+10)continue;b.hits.push(e.id);hurtEnemy(e,b.damage,{knock:b.returning?120:25,dir:Math.sign(b.vx),color:b.color,slow:b.slow,freeze:b.freeze});b.pierce--;if(b.explode){for(const n of game.enemies)if(n!==e&&!n.dead&&Math.hypot(n.x-b.x,n.y-n.r-b.y)<b.explode)hurtEnemy(n,b.damage*.55,{slow:2,color:b.color});transient.flashes.push({x:b.x,y:b.y,r:b.explode,life:.2,max:.2,color:b.color})}if(b.pierce<=0){b.life=0;break}}}
      else if(hurtPlayer(b.damage,b.x,b.y,b.r+7)){b.life=0;burst(b.x,b.y,b.color,5)}
      if(b.x<-100||b.x>3700||b.y>120||b.y<-900)b.life=0;
    }
    game.bullets=game.bullets.filter(b=>b.life>0);
  }
  function updateDrops(dt){const p=game.p,mag=(100+up('magnet')*90)*areaScale();for(const d of game.drops){d.life-=dt;const dist=Math.hypot(d.x-p.x,d.y-p.y+25);if(dist<mag){d.x+=(p.x-d.x)*Math.min(1,dt*9);d.y+=(p.y-25-d.y)*Math.min(1,dt*9);if(dist<30){if(d.type==='xp')addXp(d.value);else{p.hp=Math.min(maxHp(),p.hp+d.value);floating(p.x,p.y-75,`+${d.value}`,'#c1ff35')}d.life=0}}else {d.x+=d.vx*dt;d.vx*=Math.exp(-3*dt);d.vy+=700*dt;d.y=Math.min(-8,d.y+d.vy*dt);if(d.y>=-8)d.vy=0}}game.drops=game.drops.filter(d=>d.life>0)}
  function updateZones(dt){for(const z of game.zones){z.life-=dt;z.tick-=dt;if(z.tick<=0&&z.damage){z.tick=.45;if(z.hostile){hurtPlayer(z.damage,z.x,z.y,z.r);if(z.oneShot)z.damage=0}else {for(const e of game.enemies)if(!e.dead&&Math.hypot(e.x-z.x,e.y-z.y)<z.r)hurtEnemy(e,z.damage,{color:z.color,freeze:z.freeze});burst(z.x+rand(-z.r,z.r),z.y-50,z.color,10,170)}}}game.zones=game.zones.filter(z=>z.life>0)}
  function updateGame(dt){
    const p=game.p;game.totalTime+=dt;game.waveTime+=dt;audio.tick(dt);
    for(const k of ['inv','attackCd','attackChain','skillCd','dashCd','dashTime','dropTime'])p[k]=Math.max(0,(p[k]||0)-dt);
    let move=input.move;if(input.keys.has('KeyA')||input.keys.has('ArrowLeft'))move=-1;if(input.keys.has('KeyD')||input.keys.has('ArrowRight'))move=1;
    if(move)p.face=Math.sign(move);
    const oldY=p.y;const speed=D.heroes[game.hero].speed*(1+up('speed')*.1);p.x=clamp(p.x+(p.dashTime>0?p.face*1000:move*speed)*dt,35,3565);
    if(p.dashTime>0){transient.ghosts.push({x:p.x,y:p.y,face:p.face,life:.25});if(up('dash'))for(const e of game.enemies)if(!e.dead&&!p.dashHits.includes(e.id)&&Math.hypot(e.x-p.x,e.y-p.y)<100){p.dashHits.push(e.id);hurtEnemy(e,35*up('dash'),{knock:300})}}
    p.vy+=1450*dt;p.y+=p.vy*dt;let floor=0;for(const pl of platforms())if(p.dropTime<=0&&p.x>pl.x-12&&p.x<pl.x+pl.w+12&&oldY<=pl.y+1&&p.y>=pl.y&&p.vy>=0)floor=Math.min(floor,pl.y);
    if(p.y>=floor){p.y=floor;p.vy=0;p.jumps=0}
    p.hp=Math.min(maxHp(),p.hp+up('regen')*.6*dt);if(up('shield')){p.shieldTimer-=dt;if(p.shieldTimer<=0){p.shield=Math.min(up('shield'),p.shield+1);p.shieldTimer=12}}
    game.comboTimer-=dt;if(game.comboTimer<=0)game.combo=0;
    if(input.attack||input.keys.has('KeyJ')||save.settings.auto&&nearest(p.x,p.y,game.hero===0?180*areaScale():680))attack();
    updateEnemies(dt);if(state!=='playing')return;updateWeapons(dt);updateBullets(dt);if(state!=='playing')return;updateZones(dt);if(state!=='playing')return;updateDrops(dt);
    game.enemies=game.enemies.filter(e=>!e.dead);
    game.spawnTimer-=dt;
    const quota=waveQuota(),local=(game.wave-1)%6;
    if(game.wave%6===0&&!game.bossSpawned){const ch=game.chapter===3?Math.floor((game.wave-1)/6)%3:game.chapter;spawnEnemy(['charger','bossGunner','summoner'][ch],true);game.bossSpawned=true;banner(D.chapters[ch].boss,'BOSS ENCOUNTER / 注意红色攻击预警')}
    if(local===4&&!game.eliteSpawned){spawnEnemy('tank',false,true);game.eliteSpawned=true;banner('精英入场','HEAVY GUARD / 击退与爆发伤害')}
    const hasImportant=game.enemies.some(e=>e.boss||e.elite);
    if(game.spawnTimer<=0&&(game.waveKills<quota||hasImportant||game.waveTime<waveDuration())&&game.enemies.length<42){const choices=['runner','runner','fast'];if(local>=1||game.chapter>0)choices.push('gunner');if(local>=2)choices.push('fly','tank');if(local>=3)choices.push('bomb');for(let i=0;i<Math.min(5,2+Math.floor(local/2)+Math.floor(game.wave/12));i++)spawnEnemy(choose(choices));game.spawnTimer=Math.max(.5,1.4-local*.1-game.wave*.012)}
    if(game.pendingLevels>0){showUpgrade(false);return}
    if(game.waveKills>=quota&&!hasImportant&&game.waveTime>=waveDuration()){clearWave();return}
    game.camera+= (clamp(p.x-W*.43,0,Math.max(0,3600-W))-game.camera)*Math.min(1,dt*8);
  }
  function clearWave(){
    for(const d of game.drops)if(d.type==='xp')addXp(d.value);else game.p.hp=Math.min(maxHp(),game.p.hp+d.value);game.drops=[];game.enemies=[];game.bullets=[];game.zones=[];game.comboTimer=0;resetDaily();if(!game.trial){save.daily.waves++;save.stats.endless=Math.max(save.stats.endless,game.chapter===3?game.wave:0);write(KEY,save)}
    if(game.pendingLevels>0){game.afterUpgrade='wave';showUpgrade(false);return}afterWave();
  }
  function afterWave(){if(game.chapter!==3&&game.wave>=6)finish(true);else showShop()}
  function tickEffects(dt){for(const p of transient.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=280*dt}for(const t of transient.texts){t.life-=dt;t.y-=50*dt}for(const arr of [transient.slashes,transient.flashes,transient.ghosts])for(const v of arr)v.life-=dt;Object.keys(transient).forEach(k=>transient[k]=transient[k].filter(v=>v.life>0));shake=Math.max(0,shake-dt*40);if(bannerTimer>0){bannerTimer-=dt;if(bannerTimer<.7)$('banner').style.opacity=Math.max(0,bannerTimer/.7)}}
  function finish(win){
    if(state==='result'||!game)return;state='result';game.phase='result';clearInput();let reward=Math.round((game.kills*.8+(win?120+game.chapter*60:20)+game.wave*10)*D.difficulties[game.difficulty].reward*(1+up('gold')*.1));if(game.trial)reward=0;
    if(!game.trial){resetDaily();save.settled=Array.isArray(save.settled)?save.settled:[];if(save.settled.includes(game.id)){reward=0;remove(RUNKEY)}else{save.coins+=reward;save.stats.kills+=game.kills;save.stats.combo=Math.max(save.stats.combo,game.bestCombo);save.stats.runs++;save.stats.evolutions+=game.evolutions;save.daily.kills+=game.kills;save.daily.runs++;if(win){save.stats.wins++;save.stats.chapter=Math.max(save.stats.chapter,game.chapter+1)}if(game.chapter===3)save.stats.endless=Math.max(save.stats.endless,game.wave);save.settled.push(game.id);save.settled=save.settled.slice(-30);write(KEY,save);remove(RUNKEY)}}
    game.reward=reward;game.won=win;showResult();audio.sfx(win?'level':'hurt');
  }
  function updateHud(){if(!game)return;const p=game.p,h=D.heroes[game.hero];$('hpFill').style.width=`${clamp(p.hp/maxHp()*100,0,100)}%`;$('hpText').textContent=`${Math.ceil(p.hp)} / ${maxHp()}`;$('xpFill').style.width=`${game.xp/game.xpNeed*100}%`;$('level').textContent=`LV.${game.level}`;$('portrait').textContent=h.mark;$('portrait').style.background=h.color;$('pilotName').textContent=h.name;$('waveText').textContent=`WAVE ${String(game.wave).padStart(2,'0')} / ${game.chapter===3?'∞':'06'}`;$('objective').textContent=`清场 ${Math.min(game.waveKills,waveQuota())} / ${waveQuota()}${game.enemies.some(e=>e.boss||e.elite)?' · 击破强敌':''}`;$('clock').textContent=`${String(Math.floor(game.totalTime/60)).padStart(2,'0')}:${String(Math.floor(game.totalTime%60)).padStart(2,'0')}`;$('runCoins').textContent=num(game.coins);$('healCount').textContent=p.heals;$('ultPercent').textContent=`${Math.floor(p.ult)}%`;$('autoBtn').classList.toggle('on',save.settings.auto);$('soundBtn').style.color=save.settings.sound?'#fff':'#777';$('combo').innerHTML=game.combo>=3?`${game.combo}<small>${game.combo>=100?'SSS / UNSTOPPABLE':game.combo>=50?'SS / OVERDRIVE':game.combo>=25?'S / RAMPAGE':'COMBO'}</small>`:'';
    $('objective').textContent+=` · 裂隙 ${Math.max(0,Math.ceil(waveDuration()-game.waveTime))}s`;
    document.querySelector('[data-control="skill"] span').textContent=p.skillCd>.1?`技能 ${p.skillCd.toFixed(1)}s`:'技能 · U';
    document.querySelector('[data-control="dash"] span').textContent=p.dashCd>.1?`闪避 ${p.dashCd.toFixed(1)}s`:'闪避 · L';
    const boss=game.enemies.find(e=>e.boss&&!e.dead);$('bossHud').classList.toggle('hidden',!boss);if(boss){const ch=game.chapter===3?Math.floor((game.wave-1)/6)%3:game.chapter;$('bossName').textContent=D.chapters[ch].boss+(boss.phase===2?' / 狂暴':'');$('bossFill').style.width=`${boss.hp/boss.maxHp*100}%`}
    for(const kind of ['dash','skill','ult','heal']){const btn=document.querySelector(`[data-control="${kind}"]`);const ratio=kind==='dash'?p.dashCd/(2.5/(1+up('speed')*.1)):kind==='skill'?p.skillCd/(h.skillCd*Math.max(.4,1-up('skill')*.13)):kind==='ult'?1-p.ult/100:p.heals?0:1;btn.querySelector('i').style.height=`${clamp(ratio,0,1)*100}%`;btn.classList.toggle('cooldown',ratio>.02);if(kind==='ult')btn.classList.toggle('ready',p.ult>=100)}
  }
  function modalHTML(eyebrow,title,body,footer='',close=true){return `<div class="modal-head"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2></div>${close?'<button class="close" data-action="back" aria-label="关闭菜单">×</button>':''}</div>${body}${footer?`<div class="row-buttons">${footer}</div>`:''}`}
  function openOverlay(html,wide=false){clearInput();$('modal').innerHTML=html;$('modal').classList.toggle('wide',wide);$('overlay').classList.remove('hidden');requestAnimationFrame(()=>$('modal').querySelector('button')?.focus({preventScroll:true}))}
  function closeOverlay(){$('overlay').classList.add('hidden');$('modal').innerHTML=''}
  function renderLobby(){
    lobbyDirty=true;
    resetDaily();$('wallet').textContent=num(save.coins);$('heroName').textContent=D.heroes[selectedHero].name;$('heroIndex').textContent=`0${selectedHero+1}`;$('heroStyle').textContent=D.heroes[selectedHero].style;
    const h=D.heroes[selectedHero],owned=save.heroes.includes(h.id);$('heroNote').textContent=h.note+(owned?'':` · 解锁 ${h.cost}◈，可免费试玩`);
    $('heroSwitch').innerHTML=D.heroes.map((h,i)=>`<button data-hero="${i}" class="${i===selectedHero?'selected':''}">${h.name}${save.heroes.includes(h.id)?'':' ◇'}</button>`).join('');
    $('chapters').innerHTML=D.chapters.map((c,i)=>{const locked=i<3&&i>save.stats.chapter;return `<button data-chapter="${i}" class="chapter ${i===selectedChapter?'selected':''}" ${locked?'disabled':''}><span class="num">${i===3?'∞':`0${i+1}`}</span><div><strong>${c.name}</strong><small>${c.sub}</small></div><span class="status">${locked?'未解锁':i<save.stats.chapter?'已突破':i===selectedChapter?'已选择':'→'}</span></button>`}).join('');
    $('difficulties').innerHTML=D.difficulties.map((d,i)=>`<button data-difficulty="${i}" class="${i===selectedDifficulty?'selected':''}">${d.name}</button>`).join('');$('brief').textContent=D.chapters[selectedChapter].tip;$('start').innerHTML=`${owned?'开始清场':'免费试玩'} <span>→</span><small>${owned?'ENTER THE RIFT':'TRY THIS HERO / 不结算永久收益'}</small>`;$('resume').classList.toggle('hidden',!validRun(read(RUNKEY)));$('record').textContent=`最高连击 ${num(save.stats.combo)} / 累计击杀 ${num(save.stats.kills)}`;
  }
  function goLobby(){state='lobby';game=null;hitStop=0;clearInput();closeOverlay();$('hud').classList.add('hidden');$('lobby').classList.remove('hidden');renderLobby()}
  function availableUpgrades(){return D.upgrades.filter(i=>up(i.id)<i.max||i.weapon&&!game.evolved.includes(i.id)&&up(i.id)>=i.max&&up(i.pair)>=1)}
  function showUpgrade(refresh=false){
    state='upgrade';clearInput();if(refresh||!game.choices?.length){const pool=availableUpgrades(),evos=shuffle(pool.filter(i=>i.weapon&&up(i.id)>=i.max));let preferred=evos[0];if(!preferred&&!D.upgrades.some(i=>i.weapon&&up(i.id)))preferred=choose(pool.filter(i=>i.weapon));if(!preferred&&game.level%3===0)preferred=choose(pool.filter(i=>i.weapon&&up(i.id)>0));const others=shuffle(pool.filter(i=>i!==preferred));game.choices=[...(preferred?[preferred]:[]),...others].slice(0,3).map(i=>i.id);if(game.choices.length===0){game.p.hp=maxHp();game.coins+=50;game.pendingLevels=Math.max(0,game.pendingLevels-1);completeUpgrade();return}}
    const cards=game.choices.map(id=>{const i=D.upgrades.find(v=>v.id===id),evo=i.weapon&&up(id)>=i.max;return `<button data-upgrade="${id}" class="upgrade-card ${evo?'awaken':''}"><span class="glyph">${i.glyph}</span><span class="rarity">${evo?'AWAKEN / 觉醒':i.weapon?'WEAPON / 自动武器':'PROTOCOL / 战斗协议'} · ${evo?'MAX':`LV.${up(id)+1} / ${i.max}`}</span><strong>${evo?i.evo:i.name}</strong><small>${evo?i.evoDesc:i.desc}</small></button>`}).join('');
    openOverlay(modalHTML('LEVEL UP / BUILD YOUR POWER',`等级 ${game.level} · 选择增幅`,`<p>战场已暂停。组合自动武器与被动协议，解锁觉醒形态。${game.pendingLevels>1?`还有 ${game.pendingLevels-1} 次升级待选择。`:''}</p><div class="cards">${cards}</div>`,`<button class="secondary" data-action="reroll" ${game.rerolls<=0?'disabled':''}>↻ 刷新 · 剩余 ${game.rerolls}</button>`,false));audio.sfx('level');persistRun();
  }
  function selectUpgrade(id){if(state!=='upgrade'||!game.choices.includes(id))return;const i=D.upgrades.find(v=>v.id===id);if(i.weapon&&up(id)>=i.max){game.evolved.push(id);game.evolutions++;toast(`${i.evo} · 武器已觉醒`)}else{game.build[id]=up(id)+1;if(id==='hp')game.p.hp+=25;if(id==='shield')game.p.shield=Math.min(up('shield'),game.p.shield+1)}game.pendingLevels=Math.max(0,game.pendingLevels-1);game.choices=null;completeUpgrade()}
  function completeUpgrade(){if(game.pendingLevels>0){showUpgrade();return}if(game.afterUpgrade){const next=game.afterUpgrade;delete game.afterUpgrade;if(next==='wave')afterWave();else showShop();return}state='playing';closeOverlay();game.p.inv=Math.max(game.p.inv,1);persistRun();updateHud()}
  const shopItems=[{id:'heal',glyph:'✚',name:'生命修复',desc:'立即恢复 45% 最大生命',cost:35},{id:'kit',glyph:'⊕',name:'治疗针剂',desc:'治疗按钮次数 +1（最多 5）',cost:45},{id:'upgrade',glyph:'▣',name:'协议补给',desc:'额外获得一次三选一升级',cost:65},{id:'reroll',glyph:'↻',name:'刷新模块',desc:'升级刷新次数 +2',cost:30}];
  function showShop(){state='shop';openOverlay(modalHTML('WAVE CLEAR / SUPPLY STATION',`第 ${game.wave} 波 · 清场完成`,`<p>喘一口气，下一波会更凶。当前补给币 <b style="color:var(--lime)">${num(game.coins)} ◈</b>。每项本波限购一次。</p><div class="item-grid"><div class="item"><span class="glyph">♥</span><div><b>免费应急恢复</b><small>恢复 20% 最大生命</small></div><button data-shop="free" ${game.shopUsed.includes('free')?'disabled':''}>${game.shopUsed.includes('free')?'已领取':'领取'}</button></div>${shopItems.map(i=>`<div class="item"><span class="glyph">${i.glyph}</span><div><b>${i.name}</b><small>${i.desc}</small></div><button data-shop="${i.id}" ${game.coins<i.cost||game.shopUsed.includes(i.id)||i.id==='kit'&&game.p.heals>=5?'disabled':''}>${game.shopUsed.includes(i.id)?'已购买':`${i.cost} ◈`}</button></div>`).join('')}</div>`,`<button class="secondary" data-action="bank">结束行动并结算</button><button class="primary" data-action="nextWave">进入第 ${game.wave+1} 波 →</button>`,false));persistRun();updateHud()}
  function buyShop(id){if(state!=='shop'||game.shopUsed.includes(id))return;const i=shopItems.find(i=>i.id===id),cost=i?.cost||0;if(game.coins<cost)return;game.coins-=cost;game.shopUsed.push(id);if(id==='free'||id==='heal'){game.p.hp=Math.min(maxHp(),game.p.hp+maxHp()*(id==='free'?.2:.45));audio.sfx('heal')}if(id==='kit')game.p.heals=Math.min(5,game.p.heals+1);if(id==='reroll')game.rerolls+=2;if(id==='upgrade'){game.pendingLevels++;game.afterUpgrade='shop';showUpgrade();return}showShop()}
  function showResult(){const rank=game.won?game.bestCombo>=75?'SSS':game.bestCombo>=40?'SS':'S':game.wave>=5?'A':game.wave>=3?'B':'C';const weaponList=D.upgrades.filter(i=>up(i.id)&&i.weapon).map(i=>game.evolved.includes(i.id)?i.evo:`${i.name} ${up(i.id)}`).join(' / ')||'纯粹的基础武器';openOverlay(modalHTML('ACTION REPORT / DEBRIEF',game.won?'封锁突破':'行动结算',`<div class="result-rank">${rank}</div><p>${D.heroes[game.hero].name} / ${D.chapters[game.chapter].name} / ${D.difficulties[game.difficulty].name}${game.trial?' / 免费试玩':''}</p><div class="stat-grid"><div class="stat-cell"><b>${num(game.kills)}</b><span>击杀</span></div><div class="stat-cell"><b>${game.bestCombo}</b><span>最高连击</span></div><div class="stat-cell"><b>${game.wave}</b><span>抵达波次</span></div><div class="stat-cell"><b>+${game.reward}</b><span>永久货币</span></div></div><p>战斗 ${Math.floor(game.totalTime/60)} 分 ${Math.floor(game.totalTime%60)} 秒 / 等级 ${game.level}<br>构筑：${weaponList}</p><p>${game.won?'下一章已开放。强化角色，尝试更高难度或无尽暴走。':'强化基础属性、组合自动武器，并利用闪避的无敌时间。'}${game.trial?'<br>试玩不发放永久货币，可在强化页面解锁此英雄。':''}</p>`,`<button class="secondary" data-action="lobby">返回大厅</button><button class="primary" data-action="again">再次清场 →</button>`,false),true)}
  function openMenu(kind){menuReturn=state;if(state==='playing'){persistRun();clearInput()}state=kind;if(kind==='pause')showPause();if(kind==='bag')showBag();if(kind==='settings')showSettings();if(kind==='meta')showMeta();if(kind==='missions')showMissions();if(kind==='achievements')showAchievements();if(kind==='help')showHelp()}
  function backMenu(){const prior=menuReturn;if(prior==='pause'){state='pause';menuReturn='playing';showPause();return}state=prior==='lobby'?'lobby':'playing';closeOverlay();clearInput();if(game)game.p.inv=Math.max(game.p.inv,.4);renderLobby();updateHud()}
  function showPause(){openOverlay(modalHTML('TACTICAL PAUSE', '暂停行动',`<p>战斗、冷却与敌人均已暂停。行动已保存到本机，可以关闭页面后继续。</p><div class="stat-grid"><div class="stat-cell"><b>${game.level}</b><span>等级</span></div><div class="stat-cell"><b>${game.kills}</b><span>击杀</span></div><div class="stat-cell"><b>${game.wave}</b><span>波次</span></div><div class="stat-cell"><b>${Math.floor(game.p.hp)}</b><span>生命</span></div></div>`,`<button class="secondary" data-action="bag">查看构筑</button><button class="secondary" data-action="settings">设置</button><button class="secondary" data-action="bank">结束并结算</button><button class="primary" data-action="back">继续行动 →</button>`));persistRun()}
  function showBag(){const items=D.upgrades.filter(i=>up(i.id));openOverlay(modalHTML('LOADOUT / CURRENT BUILD','战斗构筑',`<p>武器升到 4 级并获得指定被动后，会在后续升级选项中出现觉醒。</p><div class="item-grid">${items.length?items.map(i=>`<div class="item"><span class="glyph">${i.glyph}</span><div><b>${game.evolved.includes(i.id)?i.evo:i.name} <span style="color:var(--lime)">${game.evolved.includes(i.id)?'觉醒':`Lv.${up(i.id)}/${i.max}`}</span></b><small>${game.evolved.includes(i.id)?i.evoDesc:i.desc}${i.weapon&&!game.evolved.includes(i.id)?`<br>觉醒：${i.name} Lv.4 + ${D.upgrades.find(v=>v.id===i.pair).name} Lv.1`:''}</small></div></div>`).join(''):'<p class="empty-note">收集经验升级，选择你的第一份战斗协议。</p>'}</div>`,`<button class="primary" data-action="back">返回</button>`),true)}
  function showSettings(){const toggles=[['sound','声音与电子节奏'],['vibration','触控震动'],['shake','打击震屏'],['numbers','伤害数字'],['auto','辅助自动攻击']];openOverlay(modalHTML('SYSTEM / PREFERENCES','游戏设置',`<div class="settings-grid">${toggles.map(([id,label])=>`<label class="setting">${label}<input type="checkbox" data-setting="${id}" ${save.settings[id]?'checked':''}></label>`).join('')}<label class="setting">音量<input type="range" min="0" max="1" step=".05" value="${save.settings.volume}" data-setting="volume"></label><label class="setting">画质<select data-setting="quality"><option value="high" ${save.settings.quality==='high'?'selected':''}>高 · 完整粒子</option><option value="low" ${save.settings.quality==='low'?'selected':''}>低 · 节省电量</option></select></label></div><p>声音需要先点击或触摸页面才能播放。震动取决于浏览器支持。遇到掉帧时切换低画质。</p>`,`<button class="secondary" data-action="fullscreen">⛶ 切换全屏</button><button class="primary" data-action="back">完成设置</button>`))}
  function showMeta(){openOverlay(modalHTML('WORKSHOP / PERMANENT UPGRADES','永久强化',`<p>现有货币 <b style="color:var(--lime)">${num(save.coins)} ◈</b>。行动结算、任务与成就都会给予货币；强化对所有英雄生效。</p><div class="item-grid">${D.meta.map(m=>{const lv=save.meta[m.id]||0,cost=Math.round(m.cost*(1+lv*.55));return `<div class="item"><span class="glyph">${m.glyph}</span><div><b>${m.name} · ${lv}/${m.max}</b><small>${m.desc}</small></div><button data-meta="${m.id}" ${lv>=m.max||save.coins<cost?'disabled':''}>${lv>=m.max?'已满级':`${cost} ◈`}</button></div>`}).join('')}${D.heroes.filter(h=>h.cost).map(h=>`<div class="item"><span class="glyph" style="color:${h.color}">${h.mark}</span><div><b>${h.name}</b><small>${h.style}</small></div><button data-unlock="${h.id}" ${save.heroes.includes(h.id)||save.coins<h.cost?'disabled':''}>${save.heroes.includes(h.id)?'已解锁':`${h.cost} ◈`}</button></div>`).join('')}</div>`,`<button class="primary" data-action="back">返回大厅</button>`),true)}
  function showMissions(){resetDaily();const tasks=[{id:'kills',name:'今日清场',desc:'击杀 150 个敌人并结算',target:150,reward:90},{id:'waves',name:'突破封锁',desc:'完成 6 个波次',target:6,reward:100},{id:'runs',name:'再次出发',desc:'结算 2 次行动',target:2,reward:70}];openOverlay(modalHTML('DAILY CONTRACTS','每日任务',`<p>按设备本地日期刷新。试玩不计任务；击杀与行动次数在结算时记录。</p><div class="item-grid">${tasks.map(t=>{const done=save.daily.claimed.includes(t.id),v=save.daily[t.id]||0;return `<div class="item"><span class="glyph">◇</span><div><b>${t.name}</b><small>${t.desc} · ${Math.min(v,t.target)}/${t.target}</small><div class="meter"><i style="width:${Math.min(100,v/t.target*100)}%"></i></div></div><button data-mission="${t.id}" ${done||v<t.target?'disabled':''}>${done?'已领取':`${t.reward} ◈`}</button></div>`}).join('')}</div>`,`<button class="primary" data-action="back">返回大厅</button>`))}
  function showAchievements(){openOverlay(modalHTML('ARCHIVE / ACHIEVEMENTS','行动成就',`<p>领取一次，永久保存。已领取 ${save.claimed.length} / ${D.achievements.length} 项。</p><div class="item-grid">${D.achievements.map(a=>{const v=save.stats[a.stat]||0,done=save.claimed.includes(a.id);return `<div class="item"><span class="glyph">✦</span><div><b>${a.name}</b><small>${a.desc} · ${Math.min(v,a.target)}/${a.target}</small></div><button data-achievement="${a.id}" ${done||v<a.target?'disabled':''}>${done?'已领取':`${a.reward} ◈`}</button></div>`}).join('')}</div>`,`<button class="primary" data-action="back">返回大厅</button>`),true)}
  function showHelp(){openOverlay(modalHTML('FIELD MANUAL / CONTROLS','战斗手册',`<p>击杀敌人，靠近拾取菱形经验。升级会暂停战斗，让你三选一构筑。持续压制裂隙直到计时归零，完成击杀配额并击破精英或首领后进入补给；第六波击破首领通关。</p><div class="help-keys"><p><kbd>A / D · ← / →</kbd>水平移动 / 左侧摇杆</p><p><kbd>J · 普攻</kbd>可按住连续出招</p><p><kbd>K / 空格 · 跳跃</kbd>再次按下可二段跳</p><p><kbd>S / ↓ · 下落</kbd>快速穿过脚下平台</p><p><kbd>L / Shift · 闪避</kbd>短时无敌，冲出包围</p><p><kbd>U · 专属技能</kbd>冷却后可释放</p><p><kbd>I · 超载</kbd>击杀充能，满能量释放</p><p><kbd>H · 治疗</kbd>恢复 40% 最大生命</p><p><kbd>Esc / P · 暂停</kbd>保存 / 查看构筑 / 设置</p></div><p>红色区域与连线是敌人的攻击预警；离开预警或使用闪避。平台可跳上，飞行与远程敌人仍会攻击。AUTO 只辅助普攻，技能、闪避与治疗需要主动使用。</p><p>觉醒搭配：环刃 + 空间延展；落雷 + 弱点洞察；烈焰 + 锋利增幅；无人机 + 疾走协议；冰刺 + 神经加速；震荡波 + 合金骨架。武器需要 Lv.4。</p>`,`<button class="primary" data-action="back">明白，开战</button>`),true)}
  function requestStart(){if(validRun(read(RUNKEY))&&save.heroes.includes(D.heroes[selectedHero].id)){menuReturn='lobby';state='confirm';openOverlay(modalHTML('NEW ACTION','开始新的行动',`<p>本机有未结束的行动。开始新行动会替换该战斗存档；永久强化与货币会保留。</p>`,`<button class="secondary" data-action="back">返回</button><button class="secondary" data-action="resume">继续存档</button><button class="primary" data-action="new">开始新行动</button>`));return}newGame(!save.heroes.includes(D.heroes[selectedHero].id))}
  document.addEventListener('click',ev=>{
    const b=ev.target.closest('button');if(!b||b.disabled)return;audio.unlock();const a=b.dataset.action;
    if(b.dataset.hero!==undefined){selectedHero=Number(b.dataset.hero);save.lastHero=selectedHero;write(KEY,save);renderLobby();audio.sfx('click')}
    if(b.dataset.chapter!==undefined){selectedChapter=Number(b.dataset.chapter);save.lastChapter=selectedChapter;write(KEY,save);renderLobby()}
    if(b.dataset.difficulty!==undefined){selectedDifficulty=Number(b.dataset.difficulty);save.lastDifficulty=selectedDifficulty;write(KEY,save);renderLobby()}
    if(b.dataset.upgrade)selectUpgrade(b.dataset.upgrade);
    if(b.dataset.shop)buyShop(b.dataset.shop);
    if(b.dataset.meta&&state==='meta'){const m=D.meta.find(v=>v.id===b.dataset.meta),lv=save.meta[m.id]||0,cost=Math.round(m.cost*(1+lv*.55));if(lv<m.max&&save.coins>=cost){save.coins-=cost;save.meta[m.id]=lv+1;write(KEY,save);showMeta();renderLobby();audio.sfx('level')}}
    if(b.dataset.unlock&&state==='meta'){const h=D.heroes.find(v=>v.id===b.dataset.unlock);if(!save.heroes.includes(h.id)&&save.coins>=h.cost){save.coins-=h.cost;save.heroes.push(h.id);write(KEY,save);showMeta();renderLobby();toast(`${h.name} 已解锁`)}}
    if(b.dataset.mission&&state==='missions'){resetDaily();const id=b.dataset.mission,t={kills:[150,90],waves:[6,100],runs:[2,70]}[id];if(t&&!save.daily.claimed.includes(id)&&save.daily[id]>=t[0]){save.daily.claimed.push(id);save.coins+=t[1];write(KEY,save);showMissions();renderLobby()}}
    if(b.dataset.achievement&&state==='achievements'){const t=D.achievements.find(i=>i.id===b.dataset.achievement);if(t&&!save.claimed.includes(t.id)&&save.stats[t.stat]>=t.target){save.claimed.push(t.id);save.coins+=t.reward;write(KEY,save);showAchievements();renderLobby()}}
    if(a==='back')backMenu();if(a==='lobby')goLobby();if(a==='new'||a==='again'){if(a==='again'){selectedHero=game.hero;selectedChapter=game.chapter;selectedDifficulty=game.difficulty}newGame(!save.heroes.includes(D.heroes[selectedHero].id))}if(a==='resume')resumeRun();
    if(['settings','meta','missions','achievements','help','bag'].includes(a))openMenu(a);
    if(a==='reroll'&&state==='upgrade'&&game.rerolls>0){game.rerolls--;showUpgrade(true)}
    if(a==='nextWave'&&state==='shop'){game.wave++;startWave()}
    if(a==='bank'){menuReturn=state;state='bankConfirm';openOverlay(modalHTML('END ACTION','结束并结算',`<p>将按当前击杀和难度获得永久货币，并结束本次行动。继续挑战可获得更多奖励。</p>`,`<button class="secondary" data-action="cancelBank">继续挑战</button><button class="primary" data-action="finishBank">确认结算</button>`,false))}
    if(a==='cancelBank'){state=menuReturn;if(state==='shop')showShop();else{state='pause';menuReturn='playing';showPause()}}
    if(a==='finishBank'&&state==='bankConfirm')finish(false);
    if(a==='fullscreen')toggleFullscreen();
  });
  document.addEventListener('change',ev=>{const id=ev.target.dataset.setting;if(!id)return;save.settings[id]=ev.target.type==='checkbox'?ev.target.checked:ev.target.type==='range'?Number(ev.target.value):ev.target.value;write(KEY,save);if(id==='quality')resize();audio.unlock();updateHud()});
  async function toggleFullscreen(){try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen();try{await screen.orientation?.lock('landscape')}catch{}}else await document.exitFullscreen()}catch{toast('当前浏览器不支持全屏，可使用浏览器菜单进入全屏')} }
  $('start').addEventListener('click',requestStart);$('resume').addEventListener('click',resumeRun);
  $('pauseBtn').addEventListener('click',()=>{if(state==='playing')openMenu('pause')});$('bagBtn').addEventListener('click',()=>{if(state==='playing')openMenu('bag')});
  $('autoBtn').addEventListener('click',()=>{save.settings.auto=!save.settings.auto;write(KEY,save);toast(save.settings.auto?'辅助自动攻击已开启':'辅助自动攻击已关闭');updateHud()});$('soundBtn').addEventListener('click',()=>{audio.unlock();save.settings.sound=!save.settings.sound;write(KEY,save);updateHud()});$('fullBtn').addEventListener('click',toggleFullscreen);
  const joy=$('joystick');
  function moveStick(ev){const r=joy.getBoundingClientRect(),x=clamp(ev.clientX-r.left-r.width/2,-r.width*.32,r.width*.32);input.move=Math.abs(x)<5?0:x/(r.width*.32);$('stick').style.transform=`translateX(${x}px)`}
  joy.addEventListener('pointerdown',ev=>{if(state!=='playing'||input.stickId!==null)return;input.stickId=ev.pointerId;joy.setPointerCapture(ev.pointerId);moveStick(ev);audio.unlock();ev.preventDefault()});joy.addEventListener('pointermove',ev=>{if(ev.pointerId===input.stickId)moveStick(ev)});
  function endStick(ev){if(ev.pointerId!==input.stickId)return;input.stickId=null;input.move=0;$('stick').style.transform='translateX(0)'}joy.addEventListener('pointerup',endStick);joy.addEventListener('pointercancel',endStick);joy.addEventListener('lostpointercapture',endStick);
  for(const b of document.querySelectorAll('[data-control]')){b.addEventListener('pointerdown',ev=>{ev.preventDefault();b.setPointerCapture(ev.pointerId);if(b.dataset.control==='attack'){input.attackIds.add(ev.pointerId);input.attack=true}action(b.dataset.control)});const release=ev=>{input.attackIds.delete(ev.pointerId);input.attack=input.attackIds.size>0};b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release)}
  document.addEventListener('keydown',ev=>{if(['INPUT','SELECT','TEXTAREA'].includes(ev.target.tagName))return;const relevant=['KeyA','KeyD','ArrowLeft','ArrowRight','KeyS','ArrowDown','Space','KeyJ','KeyK','KeyL','ShiftLeft','ShiftRight','KeyU','KeyI','KeyH','Escape','KeyP'];if(relevant.includes(ev.code))ev.preventDefault();if(ev.code==='Enter'&&state==='lobby'){requestStart();return}if(ev.code==='Escape'||ev.code==='KeyP'){if(ev.repeat)return;if(state==='playing')openMenu('pause');else if(['pause','bag','settings','help'].includes(state))backMenu();return}if(state!=='playing')return;input.keys.add(ev.code);if(ev.repeat)return;const mapping={Space:'jump',KeyK:'jump',KeyS:'drop',ArrowDown:'drop',KeyL:'dash',ShiftLeft:'dash',ShiftRight:'dash',KeyU:'skill',KeyI:'ult',KeyH:'heal'};if(mapping[ev.code])action(mapping[ev.code]);if(ev.code==='KeyJ')attack()});document.addEventListener('keyup',ev=>input.keys.delete(ev.code));
  window.addEventListener('blur',()=>{clearInput();if(state==='playing')openMenu('pause')});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();if(state==='playing')openMenu('pause');else persistRun();if(audio.ctx?.state==='running')audio.ctx.suspend().catch(()=>{})}});window.addEventListener('pagehide',persistRun);window.addEventListener('resize',resize);document.addEventListener('contextmenu',ev=>ev.preventDefault());
  function poly(points,color,stroke){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke()}}
  function line(x,y,x2,y2,color,width=2){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
  function circle(x,y,r,color,stroke){ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,Math.PI*2);if(color){ctx.fillStyle=color;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
  function glow(color,blur=12){if(save.settings.quality==='high'){ctx.shadowColor=color;ctx.shadowBlur=blur}}
  function noGlow(){ctx.shadowBlur=0}
  function drawCity(camera,time,ch=0){
    const color=['#c1ff35','#b353ff','#47e6f2'][ch%3];const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,ch===2?'#101f2b':'#14121f');sky.addColorStop(.65,'#282333');sky.addColorStop(1,'#111018');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    // Striated moon and hazy city silhouettes, three parallax layers.
    circle(W*.67-camera*.015,H*.22,H*.15,'#b353ff09','#b353ff18');circle(W*.67-camera*.015,H*.22,H*.10,'#b353ff08');
    for(let layer=0;layer<3;layer++){
      const unit=layer===2?150:110,par=.12+layer*.18,base=ground-(layer===0?85:layer===1?50:6),start=Math.floor(camera*par/unit)-2;
      for(let i=start;i<start+Math.ceil(W/unit)+5;i++){const seed=Math.abs(Math.sin(i*72.31+layer*37.13)),x=i*unit-camera*par,h=(90+seed*220)*(layer===0?.8:1),width=unit-12;ctx.fillStyle=['#272537','#1b1c2c','#151722'][layer];ctx.fillRect(x,base-h,width,h);
        poly([[x,base-h],[x+width*.6,base-h-12],[x+width,base-h-4],[x+width,base-h+15],[x,base-h+15]],['#363243','#292735','#20212f'][layer]);
        if(layer>0){for(let row=0;row<Math.floor(h/30)-1;row++)for(let col=0;col<3;col++){if(Math.sin(i*27+row*17+col*8)>.1){ctx.fillStyle=layer===2?(col===1?'#b353ff38':'#47e6f21a'):'#c1ff3510';ctx.fillRect(x+12+col*29,base-h+25+row*27,12,5)}}}
        if(layer===2&&i%3===0){ctx.save();ctx.translate(x+width-12,base-h+24);glow(color,9);ctx.fillStyle=color+'aa';ctx.fillRect(0,0,18,55);noGlow();ctx.fillStyle='#14151b';ctx.font='bold 10px sans-serif';ctx.fillText(i%2?'裂':'潮',3,14);ctx.fillText(i%2?'潮':'裂',3,30);ctx.restore()}
        if(layer===1){line(x+width*.5,base-h,x+width*.5,base-h-30,'#444151',1);circle(x+width*.5,base-h-30,2,'#ff459a55')}
      }
    }
    ctx.fillStyle='#0d101a';ctx.fillRect(0,ground,W,H-ground);const floorGradient=ctx.createLinearGradient(0,ground,0,H);floorGradient.addColorStop(0,'#272a34');floorGradient.addColorStop(1,'#0c0e15');ctx.fillStyle=floorGradient;ctx.fillRect(0,ground,W,H-ground);
    ctx.fillStyle='#50525c';ctx.fillRect(0,ground, W,6);glow(color,8);ctx.fillStyle=color;ctx.globalAlpha=.7;ctx.fillRect(0,ground+7,W,2);ctx.globalAlpha=1;noGlow();
    for(let i=Math.floor(camera/150)-1;i<Math.floor((camera+W)/150)+2;i++){const x=i*150-camera;line(x,ground+13,x-80,H,'#ffffff08',1);ctx.fillStyle='#ffffff04';ctx.fillRect(x+35,ground+36,60,3)}
    for(let i=Math.floor(camera/420)-1;i<Math.floor((camera+W)/420)+2;i++){const x=i*420-camera;line(x+40,ground,x+40,ground-195,'#33313e',6);line(x+40,ground-195,x+92,ground-195,'#454451',4);glow(color,14);line(x+80,ground-192,x+100,ground-192,color,3);noGlow();poly([[x+83,ground-190],[x+148,ground],[x+24,ground]],color+'04');}
    if(ch===1){for(let i=0;i<3;i++){const x=(i*450-camera*.4)%(W+400);line(x,ground-270,x+380,ground-270,'#5c466644',9);line(x+100,ground-270,x+100,ground-185,'#5c466644',4)}}
    // Slow ash and light motes are deterministic, cheap and independent of particles.
    for(let i=0;i<24;i++){const x=((i*137.17+time*(10+i%5*3)-camera*.05)%(W+40)+W+40)%(W+40),y=(i*83.7-time*12)%(ground+30);ctx.fillStyle=i%3?color+'35':'#ffffff40';ctx.fillRect(x,y,2,i%3?2:5)}
  }
  function drawHero(x,y,face,hIndex,pose=0,big=false,alpha=1){
    const h=D.heroes[hIndex],color=h.color;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.globalAlpha=alpha;
    // Feet, articulated coat, armor, stylized swept hair and scarf.
    const step=Math.sin(pose*12)*(big?3:7);poly([[-13,-27],[-5,-23],[-6,-2],[-19,-2],[-18,-6]],'#141725','#555b68');poly([[3,-27],[12,-25],[18+step,0],[3+step,0],[0,-5]],'#242737','#646577');
    poly([[-18,-62],[7,-65],[23,-34],[8,-26],[-11,-33],[-25,-14],[-32,-20]],'#292b3c','#777483');poly([[-25,-44],[-7,-59],[-12,-29],[-28,-17]],'#393349');poly([[3,-58],[14,-52],[19,-30],[7,-25]],color);line(-14,-51,-20,-27,color,2);
    poly([[-17,-61],[-11,-73],[4,-73],[14,-59],[7,-45],[-14,-46]],'#34354a','#797b8c');poly([[-10,-58],[7,-60],[7,-52],[-10,-49]],'#111723');line(-8,-55,6,-57,color,2);
    poly([[-12,-67],[-13,-83],[8,-86],[13,-69],[2,-63]],'#e1b8a0','#6f5461');poly([[-18,-80],[-10,-94],[7,-95],[20,-86],[8,-80],[4,-87],[-2,-78],[-10,-73]],hIndex===0?'#e0d7e9':hIndex===1?'#ff85b6':'#b4e3f0','#262636');poly([[-10,-89],[-28,-86],[-30,-78],[-16,-81]],hIndex===1?'#fb5092':'#a1a3bd');
    poly([[6,-74],[17,-74],[10,-67],[4,-67]],'#171d2c');glow(color,4);line(7,-72,13,-72,color,2);noGlow();
    poly([[-8,-66],[8,-65],[10,-61],[-13,-60]],color);const flutter=Math.sin(bgTime*3)*7;poly([[-11,-64],[-38,-65+flutter],[-65,-82+flutter],[-34,-78],[-14,-68]],hIndex===0?'#b353ff':hIndex===1?'#ff459a':'#47e6f2');
    poly([[11,-60],[19,-52],[33,-53],[36,-45],[15,-40],[7,-49]],'#323b50','#778695');poly([[28,-53],[38,-55],[40,-45],[29,-44]],'#292939',color);
    if(hIndex===0){ctx.save();ctx.translate(34,-48);ctx.rotate(big?-.6:game?.p.attackCd>0?-.5:-.9);poly([[-4,10],[-4,-74],[0,-92],[5,-70],[4,10]],'#d3e2e4',color);glow(color,5);line(0,-83,0,-9,color,2);noGlow();line(-11,0,11,0,'#b353ff',4);ctx.restore();line(-25,-48,-42,-83,'#8e899e',4)}
    if(hIndex===1){poly([[31,-58],[63,-58],[69,-47],[37,-45]],'#342c3c','#ff459a');line(45,-53,65,-53,'#ffdd76',2);poly([[-18,-58],[-35,-61],[-43,-52],[-19,-45]],'#343448','#ff459a')}
    if(hIndex===2){line(31,-48,42,-100,'#b5cde8',4);glow(color,8);poly([[42,-121],[53,-103],[42,-87],[31,-103]],'#47e6f288',color);noGlow();circle(42,-103,5,'#f2ffff')}
    ctx.restore();
  }
  function drawEnemy(e,time){
    const x=e.x-game.camera,y=ground+e.y;if(x<-130||x>W+130)return;
    ctx.save();ctx.translate(x,y);const s=e.boss?e.r/28:e.elite?1.45:1;ctx.scale(s*e.face,s);const color=e.freeze>0?'#47e6f2':e.boss?'#ff459a':e.type==='tank'?'#ad7aff':e.type==='bomb'?'#ff9755':e.type==='fly'?'#ff7db6':'#db759f';const body=e.flash>0?'#f9ffea':e.freeze>0?'#3b7c95':'#363143';
    if(e.type==='fly'){const bob=Math.sin(time*15)*6;poly([[-16,-12],[-28,-35],[-5,-26],[0,-35],[9,-24],[32,-30],[17,-9],[0,1]],body,color);line(-12,-13,-38,-7+bob,color,3);line(12,-13,37,-10-bob,color,3);circle(0,-16,6,color);line(-7,-4,7,-4,'#121320',3)}
    else{
      const walk=Math.sin(e.age*10)*4;poly([[-17,-20],[-5,-18],[-8+walk,0],[-24+walk,0]],'#151622','#514858');poly([[5,-21],[18,-19],[23-walk,0],[7-walk,0]],'#1c1a27','#514858');
      poly([[-18,-58],[14,-57],[28,-31],[13,-17],[-16,-19],[-28,-35]],body,'#73647a');poly([[-17,-57],[-5,-67],[15,-60],[17,-45],[-14,-44]],body,color);poly([[-16,-51],[16,-54],[12,-45],[-10,-42]],'#101422');glow(color,6);line(-8,-48,12,-50,color,3);noGlow();
      poly([[-27,-46],[-18,-40],[-27,-17],[-36,-25]],body,'#746277');poly([[17,-46],[27,-38],[36,-26],[26,-19],[12,-35]],body,'#746277');circle(2,-33,5,color);line(-12,-22,14,-22,color,2);
      if(e.type==='tank'){poly([[-38,-55],[-16,-59],[-15,-25],[-39,-17]],'#51415c',color);line(-33,-48,-22,-31,color,3);poly([[28,-40],[47,-46],[51,-11],[37,-8]],'#463653',color)}
      if(e.type==='gunner'||e.type==='bossGunner'){poly([[25,-41],[56,-43],[64,-31],[32,-29]],'#292431',color);line(40,-36,64,-36,color,3)}
      if(e.type==='bomb'){glow('#ff9755',10);circle(0,-32,11,'#a34627','#ff9755');ctx.fillStyle='#ffe5a1';ctx.font='bold 13px monospace';ctx.fillText('!',-4,-27);noGlow()}
      if(e.boss){poly([[-17,-70],[-28,-86],[-10,-79],[0,-97],[9,-80],[29,-86],[18,-65]],'#413447',color);if(e.type==='summoner'){circle(0,-80,23,null,color);line(-45,-48,-62,-100,color,3);poly([[-62,-120],[-49,-101],[-62,-84],[-74,-100]],'#b353ff44',color)}else if(e.type==='charger'){poly([[-39,-58],[-54,-42],[-48,-8],[-34,-20]],'#53354e',color);poly([[28,-48],[47,-63],[57,-14],[42,-19]],'#53354e',color)}}
    }
    ctx.restore();
    if(e.freeze>0){circle(x,y-e.r,e.r+12,'#47e6f210','#47e6f2aa')}
    if(e.hp<e.maxHp&&!e.boss){ctx.fillStyle='#211c28';ctx.fillRect(x-e.r,y-e.r*2-12,e.r*2,3);ctx.fillStyle=e.elite?'#ffcd59':'#ff709b';ctx.fillRect(x-e.r,y-e.r*2-12,e.r*2*Math.max(0,e.hp/e.maxHp),3)}
  }
  function drawWarnings(){for(const e of game.enemies){if(e.dead||e.wind<=0)continue;const x=e.x-game.camera,y=ground+e.y;const a=.15+Math.sin(bgTime*24)*.05;
    if(e.mode==='chargeWarn'){const dir=Math.sign(e.targetX-e.x)||1;ctx.fillStyle=`rgba(255,65,92,${a})`;ctx.fillRect(dir===1?x:x-850,y-65,850,65);for(let i=0;i<7;i++)poly([[x+dir*i*120,y-45],[x+dir*(i*120+30),y-25],[x+dir*i*120,y-5]],'#ff516e66');line(x,y-67,x+dir*850,y-67,'#ff516e88',2)}
    else if(e.mode==='barrage'||e.mode==='shoot'){line(x,y-e.r,e.targetX-game.camera,ground+e.targetY,'#ff516e88',2);circle(e.targetX-game.camera,ground+e.targetY,16,null,'#ff516e88')}
    else if(e.mode==='summon'){circle(e.targetX-game.camera,ground-20,140,'#ff459a18','#ff459aaa')}
    else{const r=e.mode==='explode'?140:e.type==='tank'?100:65;circle(x,y-20,r,`rgba(255,65,92,${a})`,'#ff516e66')}
  }}
  function drawPlatforms(){for(const pl of platforms()){const x=pl.x-game.camera,y=ground+pl.y;if(x+pl.w<0||x>W)continue;poly([[x,y],[x+pl.w,y],[x+pl.w-15,y+16],[x+5,y+16]],'#343143','#777482');line(x,y,x+pl.w,y,D.chapters[game.chapter===3?Math.floor((game.wave-1)/6)%3:game.chapter].color,2);for(let i=0;i<pl.w/20;i++)line(x+i*20,y+5,x+i*20+8,y+13,'#b8a18440',3);line(x+30,y+16,x+30,ground,'#252431',6);line(x+pl.w-30,y+16,x+pl.w-30,ground,'#252431',6)}}
  function drawWeapons(){const p=game.p,x=p.x-game.camera,y=ground+p.y;
    if(up('bladeOrbit')){const evo=game.evolved.includes('bladeOrbit'),n=evo?6:up('bladeOrbit')+1;for(let i=0;i<n;i++){const a=game.totalTime*3+i*Math.PI*2/n;ctx.save();ctx.translate(x+Math.cos(a)*(evo?145:100)*areaScale(),y-40+Math.sin(a)*60);ctx.rotate(a+game.totalTime*7);glow('#c1ff35',7);poly([[-15,0],[0,-6],[21,0],[0,6]],'#c1ff35aa','#d7ff89');noGlow();ctx.restore()}}
    if(up('fire')){const r=(game.evolved.includes('fire')?240:90+up('fire')*18)*areaScale();ctx.save();ctx.translate(x,y-6);ctx.scale(1,.3);circle(0,0,r,'#ff853519','#ff85355a');for(let i=0;i<8;i++){const a=i*.785+game.totalTime;poly([[Math.cos(a)*r*.8,Math.sin(a)*r*.8],[Math.cos(a)*r,Math.sin(a)*r],[Math.cos(a+.14)*r*.65,Math.sin(a+.14)*r*.65]],'#ff914344')}ctx.restore()}
    if(up('drone')){const dx=x-45,dy=y-115+Math.sin(bgTime*4)*7;poly([[dx-20,dy],[dx-7,dy-8],[dx+12,dy-8],[dx+22,dy],[dx+8,dy+8],[dx-10,dy+8]],'#333543','#ff459a');circle(dx+4,dy,4,'#ff459a');line(dx-28,dy-3,dx-12,dy-3,'#b353ff',2)}
  }
  function drawEffects(){
    const cam=game.camera;
    for(const s of transient.slashes){const x=s.x-cam,y=ground+s.y;ctx.save();ctx.translate(x,y);ctx.scale(s.dir,1);ctx.globalAlpha=s.life/s.max;glow(s.color,14);ctx.beginPath();ctx.ellipse(0,0,s.r,s.r*.4,s.step===1?.2:-.35,-1.3,1.3);ctx.strokeStyle=s.color;ctx.lineWidth=s.step===2?14:8;ctx.stroke();ctx.beginPath();ctx.ellipse(8,0,s.r*.85,s.r*.33,-.35,-1.3,1.3);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();noGlow();ctx.restore()}
    for(const f of transient.flashes){ctx.globalAlpha=f.life/f.max*.6;circle(f.x-cam,ground+f.y,f.r*(1-f.life/f.max*.7),f.color+'18',f.color);ctx.globalAlpha=1}
    for(const p of transient.particles){ctx.globalAlpha=Math.min(1,p.life*3);ctx.fillStyle=p.color;ctx.fillRect(p.x-cam,ground+p.y,p.size,p.size)}ctx.globalAlpha=1;
    for(const t of transient.texts){ctx.font=`${t.big?'italic bold 24':'bold 15'}px monospace`;ctx.textAlign='center';ctx.fillStyle='#0a0810';ctx.globalAlpha=Math.min(1,t.life*4);ctx.fillText(t.t,t.x-cam+2,ground+t.y+2);ctx.fillStyle=t.color;ctx.fillText(t.t,t.x-cam,ground+t.y)}ctx.globalAlpha=1;ctx.textAlign='left';
  }
  function drawGame(){
    const ch=game.chapter===3?Math.floor((game.wave-1)/6)%3:game.chapter;drawCity(game.camera,bgTime,ch);ctx.save();if(save.settings.shake&&shake>0)ctx.translate(rand(-shake,shake),rand(-shake*.5,shake*.5));drawPlatforms();drawWarnings();
    for(const z of game.zones){const x=z.x-game.camera,y=ground+z.y;if(z.lightning){glow(z.color,15);poly([[x,y],[x-20,y+110],[x+12,y+120],[x-8,ground+z.endY],[x+34,y+85],[x+3,y+76]],z.color);noGlow()}else{circle(x,y,z.r,z.color+(z.hostile?'18':'09'),z.color+'55');if(!z.hostile){for(let i=0;i<6;i++){const bx=x+Math.sin(bgTime*5+i*3)*z.r*.8;line(bx,y-250,bx+20,y,z.color+'36',3)}}}}
    for(const d of game.drops){const x=d.x-game.camera,y=ground+d.y;glow(d.type==='xp'?'#b353ff':'#c1ff35',6);poly([[x,y-7],[x+5,y],[x,y+7],[x-5,y]],d.type==='xp'?'#b353ff':'#c1ff35');noGlow()}
    drawWeapons();for(const e of game.enemies)drawEnemy(e,bgTime);
    for(const g of transient.ghosts)drawHero(g.x-game.camera,ground+g.y,g.face,game.hero,0,false,g.life*.7);
    const p=game.p;ctx.save();ctx.translate(p.x-game.camera,ground+Math.max(p.y,0)+1);ctx.scale(1,.22);circle(0,0,34,'#0006');ctx.restore();drawHero(p.x-game.camera,ground+p.y,p.face,game.hero,Math.abs(input.move)||input.keys.size?bgTime:0,false,p.inv>0&&Math.floor(bgTime*20)%2?.55:1);
    if(p.shield>0){glow('#47e6f2',8);ctx.save();ctx.translate(p.x-game.camera,ground+p.y-43);ctx.scale(.65,1);circle(0,0,65,null,'#47e6f2aa');ctx.restore();noGlow()}
    for(const b of game.bullets){const x=b.x-game.camera,y=ground+b.y;glow(b.color,b.friendly?9:5);if(b.returning){ctx.save();ctx.translate(x,y);ctx.rotate(bgTime*18);poly([[-24,0],[0,-8],[25,0],[0,8]],b.color);ctx.restore()}else if(b.explode){circle(x,y,b.r,b.color);circle(x-3,y-3,b.r*.5,'#fff')}else{line(x,y,x-b.vx*.018,y-b.vy*.018,b.color,b.r);circle(x,y,b.r*.7,'#fff')}noGlow()}
    drawEffects();ctx.restore();
    // Indicators point toward distant targets; important in a scrolling arena.
    const left=game.enemies.some(e=>!e.dead&&e.x<game.camera+15),right=game.enemies.some(e=>!e.dead&&e.x>game.camera+W-15);ctx.font='bold 13px monospace';ctx.fillStyle='#ff789daa';if(left){poly([[12,ground-115],[27,ground-124],[27,ground-106]],'#ff789d99');ctx.fillText('敌',31,ground-110)}if(right){poly([[W-12,ground-115],[W-27,ground-124],[W-27,ground-106]],'#ff789d99');ctx.fillText('敌',W-50,ground-110)}
  }
  function drawLobby(){
    if(lobbyArt?.complete&&lobbyArt.naturalWidth){
      const fit=Math.max(W/lobbyArt.naturalWidth,H/lobbyArt.naturalHeight),iw=lobbyArt.naturalWidth*fit,ih=lobbyArt.naturalHeight*fit;
      ctx.drawImage(lobbyArt,(W-iw)/2,(H-ih)/2,iw,ih);
      const dark=ctx.createLinearGradient(0,0,W,0);dark.addColorStop(0,'#10101555');dark.addColorStop(.42,'#10101500');dark.addColorStop(1,'#10101533');ctx.fillStyle=dark;ctx.fillRect(0,0,W,H);return;
    }
    drawCity(600,bgTime,selectedChapter===3?1:selectedChapter);ctx.save();ctx.globalAlpha=.8;
    // Acid slash ribbons echo the reference's high contrast, angular composition.
    const x=W*.48;poly([[x-100,H],[x+160,0],[x+360,0],[x+35,H]],'#b353ff37');poly([[x+5,H*.9],[x+240,H*.02],[x+285,H*.02],[x+48,H*.9]],'#c1ff3560');poly([[x-110,H*.92],[x+320,H*.18],[x+430,H*.1],[x-25,H*.97]],'#c1ff3520');poly([[x+15,H*.8],[x+300,H*.25],[x+470,H*.13],[x+65,H*.81]],'#47e6f225');
    for(let i=0;i<7;i++)line(x+rand(0,0)+i*25,H*.65-i*50,x+300+i*10,H*.08+i*7,i%2?'#c1ff3525':'#b353ff35',1);ctx.restore();
    const portrait=W/H<1,heroX=portrait?W*.83:W*.55,heroY=portrait?H*.32:H*.89,heroScale=portrait?2.75:Math.min(5.1,H/138);ctx.save();ctx.translate(heroX,heroY+Math.sin(bgTime*1.4)*5);ctx.scale(heroScale,heroScale);drawHero(0,0,-1,selectedHero,bgTime*.08,true,.96);ctx.restore();
    ctx.save();ctx.globalAlpha=.12;ctx.font=`italic 900 ${H*.14}px sans-serif`;ctx.fillStyle='#d5f7f0';ctx.translate(W*.34,H*.6);ctx.rotate(-.3);ctx.fillText('RIOT',0,0);ctx.restore();
  }
  function loop(t){
    const dt=Math.min(.034,Math.max(0,(t-last)/1000));last=t;bgTime+=dt;
    if(state==='playing'){if(hitStop>0)hitStop-=dt;else updateGame(dt);tickEffects(dt);saveTimer+=dt;if(saveTimer>5){saveTimer=0;persistRun()}hudTimer+=dt;if(hudTimer>.075){hudTimer=0;updateHud()}}
    if(game)drawGame();else if(lobbyDirty||!lobbyArt?.naturalWidth){drawLobby();lobbyDirty=false}requestAnimationFrame(loop);
  }
  resize();renderLobby();requestAnimationFrame(loop);if(!storageOK)toast('浏览器存储不可用，本次可游玩但无法保留进度');
  // Read-only diagnostics are useful for frame/performance and save validation.
  window.RiftGame={getStatus:()=>({state,hero:game?.hero,wave:game?.wave,kills:game?.kills,hp:game?.p.hp,level:game?.level,time:game?.totalTime,enemies:game?.enemies.length,build:game?{...game.build}:{},evolved:game?[...game.evolved]:[],settings:{...save.settings},storageOK}),version:D.version};
  if(window.__RIFT_TEST__)window.RiftTest={newGame,updateGame,action,attack,spawnEnemy,hurtEnemy,hurtPlayer,addXp,showUpgrade,selectUpgrade,buyShop,startWave,clearWave,finish,resumeRun,persistRun,snapshot,up,maxHp,goLobby,openMenu,backMenu,getGame:()=>game,getSave:()=>save,getState:()=>state,setState:s=>state=s};
})();



