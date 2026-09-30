(function(root,factory){const data=typeof module==='object'&&module.exports?require('./data.js'):root.CIRCUIT_DATA;const api=factory(data);if(typeof module==='object'&&module.exports)module.exports=api;else root.CircuitCore=api})(typeof window!=='undefined'?window:globalThis,D=>{
  'use strict';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y), clone=o=>JSON.parse(JSON.stringify(o));
  function segmentDistance(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy,t=l?clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/l,0,1):0;return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)}
  function inside(p,poly){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)hit=!hit}return hit}
  function area(poly){
    if(poly.length<3)return 0;
    let signed=0;const critical=poly.map(p=>p.y);let crossed=false;
    for(let i=0;i<poly.length;i++){
      const a=poly[i],b=poly[(i+1)%poly.length],rx=b.x-a.x,ry=b.y-a.y;signed+=a.x*b.y-b.x*a.y;
      for(let j=i+2;j<poly.length;j++){
        if(i===0&&j===poly.length-1)continue;
        const c=poly[j],d=poly[(j+1)%poly.length],sx=d.x-c.x,sy=d.y-c.y,den=rx*sy-ry*sx;if(Math.abs(den)<1e-9)continue;
        const qx=c.x-a.x,qy=c.y-a.y,t=(qx*sy-qy*sx)/den,u=(qx*ry-qy*rx)/den;
        if(t>1e-9&&t<1-1e-9&&u>1e-9&&u<1-1e-9){critical.push(a.y+t*ry);crossed=true}
      }
    }
    if(!crossed)return Math.abs(signed)/2;
    // Even-odd fill: between vertices and crossings, paired scanline widths
    // are affine in y, so their midpoint integral gives the exact filled area.
    critical.sort((a,b)=>a-b);let result=0;
    for(let k=1;k<critical.length;k++){
      const dy=critical[k]-critical[k-1];if(dy<1e-8)continue;const y=(critical[k]+critical[k-1])/2,xs=[];
      for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];if((a.y>y)!==(b.y>y))xs.push(a.x+(y-a.y)*(b.x-a.x)/(b.y-a.y))}
      xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)result+=(xs[i+1]-xs[i])*dy;
    }
    return Math.max(0,result);
  }
  function centroid(poly){if(!poly.length)return{x:0,y:0};return{x:poly.reduce((s,p)=>s+p.x,0)/poly.length,y:poly.reduce((s,p)=>s+p.y,0)/poly.length}}
  function edgeDistance(p,poly,closed=true){let d=Infinity;for(let i=1;i<poly.length;i++)if(!poly[i].cut)d=Math.min(d,segmentDistance(p,poly[i-1],poly[i]));if(closed&&poly.length>1)d=Math.min(d,segmentDistance(p,poly[poly.length-1],poly[0]));return d}
  function seedNumber(value){if(typeof value==='number')return value>>>0;let h=2166136261;for(const c of String(value||'RIOT'))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
  class Game{
    constructor(options={}){
      this.hero=clamp(options.hero||0,0,2);this.map=clamp(options.map||0,0,2);this.difficulty=clamp(options.difficulty||0,0,2);this.endless=!!options.endless;this.training=!!options.training;this.seed=String(options.seed||Date.now().toString(36));this.rng=seedNumber(this.seed)||1;this.id=options.id||`${Date.now().toString(36)}-${this.rng}`;this.version=1;this.meta={power:0,hp:0,spool:0,pickup:0,energy:0,...options.meta};this.phase='playing';this.wave=1;this.time=0;this.waveTime=0;this.kills=0;this.waveKills=0;this.coins=0;this.xp=0;this.level=1;this.xpNeed=38;this.build={};this.pending=0;this.rerolls=3;this.options=[];this.afterUpgrade='';this.events=[];this.lastLoop=null;this.lastPath=null;this.history=[];this.path=[];this.pathLength=0;this.enemies=[];this.bullets=[];this.drops=[];this.fields=[];this.tasks=[];this.warnings=[];this.nodes=[];this.obstacles=[];this.signals=[];this.nextId=1;this.spawnTimer=.5;this.importantSpawned=false;this.shopUsed=[];this.eventChoices=[];this.mutations={echo:0,regen:0,refund:0,health:1,reward:1,rushUntil:0,dangerUntil:0};this.stats={seals:0,captures:0,echoes:0,rewinds:0,dashes:0,burst:0,advanced:0,marks:0,damage:{circuit:0,echo:0,returned:0,other:0}};this.p={x:900,y:650,hp:D.heroes[this.hero].hp+this.meta.hp*8,energy:100,inv:1,dirX:1,dirY:0,dash:0,dashCd:0,echoCd:0,rewindCd:0,sealCd:0,charge:0,overload:0,stored:0,heals:2};this.layout();this.resetPath();if(this.training)this.initTraining();
    }
    random(){this.rng=(Math.imul(this.rng,1664525)+1013904223)>>>0;return this.rng/4294967296}
    range(a,b){return a+(b-a)*this.random()}
    pick(a){return a[Math.floor(this.random()*a.length)]}
    shuffle(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r}
    emit(type,data={}){this.signals.push({type,...data});if(this.signals.length>100)this.signals.shift()}
    drain(){return this.signals.splice(0)}
    up(id){return this.build[id]||0}
    get heroData(){return D.heroes[this.hero]}
    get maxHp(){return this.heroData.hp+this.meta.hp*8+this.up('hp')*22}
    get maxLength(){return 1250+this.meta.spool*90+this.up('spool')*250}
    get capacity(){return this.heroData.capture+this.up('capacity')*4}
    get lineWidth(){return 13+this.up('edge')*5}
    get damageFactor(){return (1+this.up('power')*.12)*(1+this.meta.power*.04)}
    get scale(){return D.maps[this.map].scale*D.difficulties[this.difficulty].scale*(1+Math.floor((this.wave-1)/8)*.28)}
    get quota(){return 16+((this.wave-1)%8)*4}
    get duration(){return 24+((this.wave-1)%8)*4}
    resetPath(){this.path=[{x:this.p.x,y:this.p.y,cut:false}];this.pathLength=0}
    layout(){
      this.obstacles=[];const placements=[{x:330,y:285},{x:1370,y:285},{x:330,y:905},{x:1370,y:905}];for(const p of placements)this.obstacles.push({x:p.x+this.range(-60,60),y:p.y+this.range(-40,40),w:this.range(90,160),h:this.range(60,100)});
      const nodeSeed=seedNumber(this.seed+'-nodes-'+this.map);this.nodes=[{x:900,y:320,type:'energy',cd:0},{x:560,y:750,type:'heal',cd:0},{x:1240,y:750,type:'data',cd:0}].map((n,i)=>({...n,x:n.x+((nodeSeed>>>(i*5))%65)-32,y:n.y+((nodeSeed>>>(i*5+3))%65)-32}));
    }
    collide(x,y,r=17){if(x<r+25||x>1775-r||y<r+25||y>1275-r)return true;return this.obstacles.some(o=>x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h)}
    moveEntity(e,dx,dy,r=17){const x=clamp(e.x+dx,30+r,1770-r),y=clamp(e.y+dy,30+r,1270-r);if(!this.collide(x,e.y,r))e.x=x;if(!this.collide(e.x,y,r))e.y=y}
    samplePath(force=false){const last=this.path[this.path.length-1],d=dist(last,this.p);if(d<18&&!force)return;if(d<.1)return;this.pathLength+=d;this.path.push({x:this.p.x,y:this.p.y,cut:false});if(this.path.length>160)this.path.splice(1,1);if(this.pathLength>=this.maxLength){if(!this.seal(true)){this.resetPath();this.emit('notice',{text:'线卷已满，已自动换卷'})}}}
    loopData(points=this.path,stored=this.p.stored){const poly=points.map(p=>({x:p.x,y:p.y,cut:!!p.cut})),a=area(poly),c=centroid(poly),seam=poly.length>1?dist(poly[0],poly[poly.length-1]):0;return{poly,area:a,center:c,stored,seam,width:this.lineWidth,base:70*(1+Math.min(1.25,a/90000)*(1+this.up('area')*.2))*(1+stored*.07),time:this.time}}
    preview(){const last=this.path[this.path.length-1],points=dist(last,this.p)>1?[...this.path,{x:this.p.x,y:this.p.y,cut:false}]:this.path,l=this.loopData(points),insideCount=this.enemies.filter(e=>!e.dead&&(l.area>700&&inside(e,l.poly)||edgeDistance(e,l.poly)<=this.lineWidth+e.r)).length,marked=this.enemies.filter(e=>!e.dead&&e.mark>0).length;return{area:Math.round(l.area),inside:insideCount,marked,length:this.pathLength+dist(last,this.p),stored:this.p.stored,cost:this.sealCost()}}
    sealCost(){return this.p.overload>0?0:Math.max(9,22-this.up('energy'))}
    seal(automatic=false){
      if(this.phase!=='playing')return false;this.sampleEnd();if(this.p.sealCd>0)return false;
      if(this.pathLength<55||this.path.length<3){if(!automatic)this.emit('notice',{text:'先移动织线，再收线'});return false}
      if(this.p.energy<this.sealCost()){if(!automatic)this.emit('notice',{text:'线能不足，捕弹或稍作迂回即可恢复'});return false}
      const loop=this.loopData();this.p.energy-=this.sealCost();this.p.sealCd=.48;this.stats.seals++;this.lastLoop=clone(loop);this.lastPath=clone(loop.poly);this.applyLoop(loop,1,'circuit');this.returnBullets(loop);this.p.stored=0;
      if(this.up('double')){const c=loop.center,mirror={...clone(loop),poly:loop.poly.map(p=>({x:2*c.x-p.x,y:2*c.y-p.y,cut:p.cut}))};this.tasks.push({delay:.25,type:'loop',loop:mirror,mult:.65,source:'circuit'})}
      if(this.up('bloom')&&loop.area>1000)this.fields.push({loop:clone(loop),life:3,tick:.6,mult:.18,source:'circuit'});
      this.resetPath();this.emit('seal',{loop,training:this.training});return true;
    }
    sampleEnd(){const last=this.path[this.path.length-1];if(dist(last,this.p)>1){this.pathLength+=dist(last,this.p);this.path.push({x:this.p.x,y:this.p.y,cut:false})}}
    applyLoop(loop,mult=1,source='circuit',includeMarked=true){
      const before=this.kills;const poly=loop.poly,last=poly[poly.length-1],first=poly[0];
      for(const e of this.enemies){if(e.dead)continue;const d=edgeDistance(e,poly),inLoop=loop.area>700&&inside(e,poly),onEdge=d<=loop.width+e.r,onSeam=first&&last&&segmentDistance(e,last,first)<=loop.width+e.r;
        if(!inLoop&&!onEdge&&(source==='echo'||!includeMarked||e.mark<=0))continue;
        let rate=inLoop?1:onEdge?.9:.45;rate*=onEdge?this.heroData.edge*(1+this.up('edge')*.12):1;if(onSeam)rate*=1+this.up('seam')*.25;
        this.hit(e,loop.base*rate*(1+e.mark*.1)*mult,source);e.mark=0;if(source==='echo'&&this.up('freeze'))e.freeze=Math.max(e.freeze,this.up('freeze')*.5*(e.boss?.3:1));if(onSeam&&this.up('seam'))this.p.energy=clamp(this.p.energy+2*this.up('seam'),0,100);
      }
      this.stats.burst=Math.max(this.stats.burst,this.kills-before);this.emit('loop',{loop:clone(loop),source,kills:this.kills-before,mult});
    }
    returnBullets(loop){if(loop.stored<=0)return;const count=loop.stored*(this.up('storm')?2:1);for(let i=0;i<count;i++){const a=(i/count)*Math.PI*2;this.bullets.push({id:this.nextId++,x:loop.center.x,y:loop.center.y,vx:Math.cos(a)*540,vy:Math.sin(a)*540,r:5,friendly:true,damage:34*(1+this.up('reflect')*.2),pierce:1+this.up('reflect'),hits:[],home:!!this.up('storm'),prism:this.up('prism')?2:0,life:2.8})}}
    echo(){if(this.phase!=='playing'||this.p.echoCd>0)return false;if(!this.lastLoop){this.emit('notice',{text:'先完成一次收线，留下可重放的回路'});return false}const mult=this.heroData.echo+this.up('echo')*.18+this.mutations.echo;this.p.echoCd=10*Math.max(.35,1-this.up('memory')*.13);this.stats.echoes++;this.applyLoop(this.lastLoop,mult,'echo');this.returnBullets({...clone(this.lastLoop),stored:Math.floor(this.lastLoop.stored*.5)});this.p.energy=clamp(this.p.energy+this.up('memory')*3+this.mutations.refund,0,100);if(this.up('repeat'))this.tasks.push({delay:.8,type:'loop',loop:clone(this.lastLoop),mult:mult*.8,source:'echo'});this.emit('echo',{loop:clone(this.lastLoop)});return true}
    dash(){if(this.phase!=='playing'||this.p.dashCd>0)return false;this.p.dash=.22+this.up('dash')*.05;this.p.inv=Math.max(this.p.inv,this.p.dash+.05);this.p.dashCd=2.5*Math.max(.5,1-this.up('dash')*.12);this.stats.dashes++;this.emit('dash');return true}
    rewind(){if(this.phase!=='playing'||this.p.rewindCd>0||this.pathLength<80)return false;this.sampleEnd();const saved=this.loopData(),start=this.path[0];this.emit('rewind',{path:clone(this.path)});if(this.up('temporal'))this.applyLoop(saved,.7+this.up('echo')*.1,'echo');this.p.x=start.x;this.p.y=start.y;this.p.energy=clamp(this.p.energy+18+this.up('rewind')*6,0,100);this.p.inv=Math.max(this.p.inv,.8);this.p.rewindCd=9*Math.max(.4,1-this.up('rewind')*.15);this.stats.rewinds++;this.resetPath();return true}
    overload(){if(this.phase!=='playing'||this.p.charge<100)return false;this.p.charge=0;this.p.overload=7;this.p.energy=100;this.p.inv=1.4;for(const e of this.enemies)if(!e.dead&&e.mark>0)this.hit(e,160+e.mark*20,'circuit');this.emit('overload');return true}
    heal(){if(this.phase!=='playing'||this.p.heals<=0||this.p.hp>=this.maxHp)return false;this.p.heals--;this.p.hp=Math.min(this.maxHp,this.p.hp+this.maxHp*.42);this.emit('heal');return true}
    hit(e,base,source='circuit'){if(e.dead)return;const value=base*this.damageFactor*(e.boss?.85:1);e.hp-=value;e.flash=.13;this.stats.damage[source]=(this.stats.damage[source]||0)+Math.min(value,e.hp+value);this.emit('hit',{x:e.x,y:e.y,value:Math.ceil(value),source});if(e.hp<=0)this.kill(e,source)}
    kill(e,source){if(e.dead)return;e.dead=true;this.kills++;this.waveKills++;this.coins+=e.boss?100:e.elite?18:2;this.p.energy=clamp(this.p.energy+1+this.up('harvest'),0,100);this.p.charge=clamp(this.p.charge+(e.boss?30:e.elite?9:1.5)*(1+this.up('charge')*.25),0,100);this.drops.push({x:e.x,y:e.y,value:e.boss?120:e.elite?35:8,type:'data',life:45});if(e.boss||this.random()<.02)this.drops.push({x:e.x+12,y:e.y,value:15,type:'heal',life:45});this.emit('kill',{x:e.x,y:e.y,boss:e.boss,source})}
    hurt(amount,x=this.p.x,y=this.p.y,r=20){if(this.phase!=='playing'||this.p.inv>0||Math.hypot(this.p.x-x,this.p.y-y)>r+17)return false;const value=amount*(this.wave<=this.mutations.dangerUntil?1.3:1);this.p.hp=Math.max(this.training?1:0,this.p.hp-value);this.p.inv=.75;this.emit('hurt',{value,x:this.p.x,y:this.p.y});if(this.p.hp<=0)this.finish(false);return true}
    spawn(type='runner',important=false){
      const table={runner:[42,106,8,18],fast:[32,170,7,15],tank:[140,60,16,28],gunner:[55,80,9,20],cutter:[70,98,10,22],mine:[38,110,18,18],bossCutter:[2600,75,22,55],bossPrism:[3000,64,19,55],bossClock:[3200,68,20,52]};const t=table[type],boss=type.startsWith('boss'),elite=important&&!boss;
      let a=this.range(0,Math.PI*2),x=clamp(this.p.x+Math.cos(a)*this.range(450,620),70,1730),y=clamp(this.p.y+Math.sin(a)*this.range(450,620),70,1230);for(let n=0;n<12&&(this.collide(x,y,t[3])||Math.hypot(x-this.p.x,y-this.p.y)<240);n++){a=this.range(0,Math.PI*2);x=this.range(80,1720);y=this.range(80,1220)}
      const hp=(t[0]+(boss?0:((this.wave-1)%8)*7))*this.scale*this.mutations.health*(elite?3.4:1),e={id:this.nextId++,type,x,y,hp,maxHp:hp,r:t[3]*(elite?1.3:1),speed:t[1],damage:t[2]*Math.sqrt(this.scale),boss,elite,mark:0,markCd:0,flash:0,freeze:0,cd:this.range(.4,1.4),wind:0,mode:'',phase:1,dead:false,age:0};this.enemies.push(e);return e;
    }
    markEnemies(dt){for(const e of this.enemies){e.markCd=Math.max(0,e.markCd-dt);if(e.dead||e.markCd>0)continue;if(edgeDistance(e,this.path,false)<this.lineWidth+e.r){e.mark=Math.min(5,e.mark+1);e.markCd=.9;this.stats.marks++;this.emit('mark',{x:e.x,y:e.y})}}}
    cutPath(x,y,r){let cuts=0;for(let i=1;i<this.path.length;i++)if(!this.path[i].cut&&segmentDistance({x,y},this.path[i-1],this.path[i])<r){this.path[i].cut=true;cuts++}if(cuts)this.emit('cut',{x,y,r,cuts});return cuts}
    shoot(e,angle,speed=260){this.bullets.push({id:this.nextId++,x:e.x,y:e.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,r:6,damage:e.damage,friendly:false,life:6})}
    enemyStrike(e){
      if(e.mode==='shoot'){this.shoot(e,Math.atan2(e.ty-e.y,e.tx-e.x));}
      else if(e.mode==='melee'||e.mode==='explode'){const r=e.mode==='explode'?115:e.r+28;this.hurt(e.damage,e.x,e.y,r);if(e.mode==='explode'){this.emit('blast',{x:e.x,y:e.y,r});e.dead=true;this.drops.push({x:e.x,y:e.y,value:5,type:'data',life:30});this.waveKills++;this.kills++;}}
      else if(e.mode==='cut'){this.cutPath(e.tx,e.ty,150);this.hurt(e.damage,e.tx,e.ty,150);}
      else if(e.mode==='bossCut'){this.warnings.push({x:e.tx,y:e.ty,r:210,delay:.25,life:.5,damage:e.damage*1.3,cut:true});e.cd=e.phase===2?1.9:3;}
      else if(e.mode==='barrage'){const a=Math.atan2(e.ty-e.y,e.tx-e.x);for(let i=-3;i<=3;i++)this.shoot(e,a+i*.23,e.phase===2?320:260);if(e.phase===2)for(let i=0;i<10;i++)this.shoot(e,i*Math.PI/5,210);e.cd=e.phase===2?1.7:2.6;}
      else if(e.mode==='clock'){for(let i=0;i<(e.phase===2?3:2);i++)this.warnings.push({x:e.tx+Math.cos(i*2.1)*110,y:e.ty+Math.sin(i*2.1)*110,r:90,delay:.8+i*.25,life:1.7,damage:e.damage});if(this.enemies.length<70)for(let i=0;i<2;i++)this.spawn(this.pick(['runner','fast']));e.cd=e.phase===2?2:3;}
      e.mode='';
    }
    updateEnemies(dt){
      for(const e of this.enemies){if(e.dead)continue;e.age+=dt;e.flash=Math.max(0,e.flash-dt);e.freeze=Math.max(0,e.freeze-dt);if(e.freeze>0)continue;e.cd-=dt;
        if(e.boss&&e.hp<e.maxHp*.5&&e.phase===1){e.phase=2;this.emit('bossPhase',{name:D.maps[this.map].boss});}
        if(e.wind>0){e.wind-=dt;if(e.wind<=0)this.enemyStrike(e);continue}
        let target=this.p;const c=this.lastLoop?.center;if(c&&this.up('lure')&&this.time-this.lastLoop.time<3+this.up('lure')*2&&dist(e,c)<360)target=c;
        const dx=target.x-e.x,dy=target.y-e.y,d=Math.hypot(dx,dy)||1,s=e.speed*(this.wave<=this.mutations.rushUntil?1.3:1)*(e.phase===2?1.15:1);
        if(e.boss){if(e.cd<=0){e.tx=this.p.x;e.ty=this.p.y;e.wind=e.phase===2?.65:.95;e.mode=e.type==='bossCutter'?'bossCut':e.type==='bossPrism'?'barrage':'clock';e.cd=3}else if(d>260)this.moveEntity(e,dx/d*s*dt,dy/d*s*dt,e.r);continue}
        if(e.type==='gunner'){if(d>380)this.moveEntity(e,dx/d*s*dt,dy/d*s*dt,e.r);else if(d<200)this.moveEntity(e,-dx/d*s*.5*dt,-dy/d*s*.5*dt,e.r);if(e.cd<=0&&d<650){e.wind=.55;e.mode='shoot';e.tx=this.p.x;e.ty=this.p.y;e.cd=2.1}continue}
        if(e.type==='cutter'&&e.cd<=0&&this.path.length>4){const targetPoint=this.path[Math.floor(this.path.length*.45)];if(dist(e,targetPoint)<250){e.tx=targetPoint.x;e.ty=targetPoint.y;e.wind=.75;e.mode='cut';e.cd=3.5;continue}}
        if(d>e.r+12)this.moveEntity(e,dx/d*s*dt,dy/d*s*dt,e.r);
        if(dist(e,this.p)<e.r+35&&e.cd<=0){e.wind=e.type==='mine'?.65:e.type==='tank'?.6:.32;e.mode=e.type==='mine'?'explode':'melee';e.cd=1.4}
      }
    }
    capture(b){if(this.p.stored>=this.capacity)return false;b.life=0;this.p.stored++;this.stats.captures++;this.p.energy=clamp(this.p.energy+3+this.up('capacity'),0,100);this.p.charge=clamp(this.p.charge+2*(1+this.up('charge')*.25),0,100);if(this.up('harvest')&&this.stats.captures%4===0)this.p.hp=Math.min(this.maxHp,this.p.hp+this.up('harvest')*2);this.emit('capture',{x:b.x,y:b.y});return true}
    updateBullets(dt){for(const b of this.bullets){b.life-=dt;if(b.life<=0)continue;if(b.friendly&&b.home){let target=null,best=700;for(const e of this.enemies)if(!e.dead&&!b.hits.includes(e.id)&&dist(e,b)<best){target=e;best=dist(e,b)}if(target){const a=Math.atan2(target.y-b.y,target.x-b.x);b.vx+=(Math.cos(a)*540-b.vx)*dt*6;b.vy+=(Math.sin(a)*540-b.vy)*dt*6}}
        b.x+=b.vx*dt;b.y+=b.vy*dt;
        if(b.friendly){for(const e of this.enemies){if(e.dead||b.hits.includes(e.id)||dist(b,e)>b.r+e.r)continue;b.hits.push(e.id);this.hit(e,b.damage,'returned');if(b.prism>0){const targets=this.enemies.filter(n=>!n.dead&&n.id!==e.id&&dist(n,e)<240).sort((a,c)=>dist(a,e)-dist(c,e)).slice(0,2);for(const n of targets){this.hit(n,b.damage*.7,'returned');this.emit('ray',{from:{x:e.x,y:e.y},to:{x:n.x,y:n.y}})}b.prism--;}if(--b.pierce<=0){b.life=0;break}}}
        else {if(edgeDistance(b,this.path,false)<this.lineWidth+b.r&&this.capture(b))continue;if(dist(b,this.p)<b.r+17){if(this.hurt(b.damage,b.x,b.y,b.r))b.life=0}}
        if(b.x<0||b.x>1800||b.y<0||b.y>1300)b.life=0;
      }this.bullets=this.bullets.filter(b=>b.life>0)}
    addXp(value){if(this.training)return;this.xp+=value*(1+this.up('magnet')*.06);while(this.xp>=this.xpNeed){this.xp-=this.xpNeed;this.level++;this.pending++;this.xpNeed=Math.round(38+this.level*13+this.level**1.3*2)}}
    updateDrops(dt){for(const d of this.drops){d.life-=dt;const n=dist(d,this.p),radius=100+this.meta.pickup*25+this.up('magnet')*60;if(n<radius){d.x+=(this.p.x-d.x)*Math.min(1,dt*10);d.y+=(this.p.y-d.y)*Math.min(1,dt*10);if(n<25){if(d.type==='data')this.addXp(d.value);else this.p.hp=Math.min(this.maxHp,this.p.hp+d.value);d.life=0}}}this.drops=this.drops.filter(d=>d.life>0)}
    updateNodes(dt){for(const n of this.nodes){n.cd=Math.max(0,n.cd-dt);if(n.cd===0&&dist(n,this.p)<48){n.cd=20;if(n.type==='energy')this.p.energy=clamp(this.p.energy+35,0,100);if(n.type==='heal')this.p.hp=Math.min(this.maxHp,this.p.hp+18);if(n.type==='data')this.addXp(24);this.emit('node',{node:clone(n)})}}}
    updateDelayed(dt){for(const t of this.tasks){t.delay-=dt;if(t.delay<=0){this.applyLoop(t.loop,t.mult,t.source);t.done=true}}this.tasks=this.tasks.filter(t=>!t.done);for(const f of this.fields){f.life-=dt;f.tick-=dt;if(f.tick<=0){f.tick=.6;this.applyLoop(f.loop,f.mult,f.source,false)}}this.fields=this.fields.filter(f=>f.life>0);
      for(const w of this.warnings){w.delay-=dt;w.life-=dt;if(w.delay<=0&&!w.done){w.done=true;this.hurt(w.damage,w.x,w.y,w.r);if(w.cut)this.cutPath(w.x,w.y,w.r);this.emit('blast',w)}}this.warnings=this.warnings.filter(w=>w.life>0)}
    update(dt,input={x:0,y:0},auto=false){
      if(this.phase!=='playing')return;dt=clamp(dt,0,.04);this.time+=dt;this.waveTime+=dt;for(const k of ['inv','dash','dashCd','echoCd','rewindCd','sealCd','overload'])this.p[k]=Math.max(0,this.p[k]-dt);this.p.energy=Math.min(100,this.p.energy+(this.p.overload>0?35:7+this.up('energy')*1.5+this.meta.energy*.4+this.mutations.regen)*dt);
      const m=Math.hypot(input.x||0,input.y||0),dx=m?input.x/Math.max(1,m):0,dy=m?input.y/Math.max(1,m):0;if(m>.1){this.p.dirX=dx/Math.hypot(dx,dy);this.p.dirY=dy/Math.hypot(dx,dy)}const speed=this.p.dash>0?870:this.heroData.speed;this.moveEntity(this.p,(this.p.dash>0?this.p.dirX:dx)*speed*dt,(this.p.dash>0?this.p.dirY:dy)*speed*dt);this.samplePath();
      this.updateEnemies(dt);if(this.phase!=='playing')return;this.markEnemies(dt);this.updateBullets(dt);if(this.phase!=='playing')return;this.updateDelayed(dt);if(this.phase!=='playing')return;this.updateDrops(dt);this.updateNodes(dt);this.enemies=this.enemies.filter(e=>!e.dead);
      if(this.training){this.updateTraining();return}
      if(auto&&this.pathLength>180&&this.p.sealCd<=0){const preview=this.preview();if(preview.inside+preview.marked>=3||this.pathLength>this.maxLength*.8)this.seal(true)}
      if(this.pending>0){this.offerUpgrades();return}
      this.spawnTimer-=dt;const local=(this.wave-1)%8;
      if((local===3||local===7)&&!this.importantSpawned){this.importantSpawned=true;const type=local===7?['bossCutter','bossPrism','bossClock'][this.map]:'tank';this.spawn(type,true);this.emit('boss',{name:local===7?D.maps[this.map].boss:'精英 · 断层守卫'})}
      if(this.spawnTimer<=0&&this.enemies.length<75&&(this.waveTime<this.duration||this.waveKills<this.quota||this.enemies.some(e=>e.boss||e.elite))){const pool=['runner','runner','fast'];if(local>=1||this.map===1)pool.push('gunner');if(local>=2)pool.push('tank');if(local>=3)pool.push('cutter');if(local>=4)pool.push('mine');for(let i=0;i<2+Math.floor(local/3)+Math.min(2,Math.floor(this.wave/16));i++)this.spawn(this.pick(pool));this.spawnTimer=Math.max(.55,1.3-local*.065-this.wave*.009)}
      if(this.waveTime>=this.duration&&this.waveKills>=this.quota&&!this.enemies.some(e=>e.boss||e.elite))this.clearWave();
    }
    available(){return D.upgrades.filter(i=>this.up(i.id)<i.max&&(!i.requires||Object.entries(i.requires).every(([id,lv])=>this.up(id)>=lv)))}
    offerUpgrades(refresh=false){if(this.phase==='result')return;this.phase='upgrade';if(refresh||!this.options.length){const pool=this.available(),advanced=pool.filter(i=>i.requires),related=pool.filter(i=>this.up(i.id)>0||i.group===this.heroData.group);const first=advanced.length?this.pick(advanced):related.length?this.pick(related):this.pick(pool);this.options=[...(first?[first.id]:[]),...this.shuffle(pool.filter(i=>i!==first)).slice(0,2).map(i=>i.id)];if(!this.options.length){this.coins+=40;this.p.hp=Math.min(this.maxHp,this.p.hp+20);this.pending=Math.max(0,this.pending-1);this.finishUpgrade();return}}this.emit('menu',{phase:'upgrade'})}
    selectUpgrade(id){if(this.phase!=='upgrade'||!this.options.includes(id))return false;const i=D.upgrades.find(i=>i.id===id);if(!i||!this.available().includes(i))return false;this.build[id]=this.up(id)+1;if(id==='hp')this.p.hp+=22;if(i.requires)this.stats.advanced++;this.pending=Math.max(0,this.pending-1);this.options=[];this.emit('upgrade',{item:clone(i)});this.finishUpgrade();return true}
    reroll(){if(this.phase!=='upgrade'||this.rerolls<=0)return false;this.rerolls--;this.offerUpgrades(true);return true}
    finishUpgrade(){if(this.pending>0){this.offerUpgrades();return}const after=this.afterUpgrade;this.afterUpgrade='';if(after==='wave')this.afterWave();else if(after==='shop')this.showShop();else if(after==='event')this.showShop();else{this.phase='playing';this.p.inv=Math.max(this.p.inv,.8)}this.emit('menu',{phase:this.phase})}
    clearWave(){for(const d of this.drops)if(d.type==='data')this.addXp(d.value);else this.p.hp=Math.min(this.maxHp,this.p.hp+d.value);this.drops=[];this.enemies=[];this.bullets=[];this.warnings=[];this.tasks=[];this.fields=[];this.emit('waveClear',{wave:this.wave});if(this.pending>0){this.afterUpgrade='wave';this.offerUpgrades()}else this.afterWave()}
    afterWave(){if(!this.endless&&this.wave>=8){this.finish(true);return}if([2,5,7].includes((this.wave-1)%8+1))this.offerEvent();else this.showShop()}
    showShop(){this.phase='shop';this.emit('menu',{phase:'shop'})}
    buy(id){if(this.phase!=='shop'||this.shopUsed.includes(id))return false;const cost={free:0,heal:40,kit:50,upgrade:75,energy:25,reroll:35}[id];if(cost===undefined||this.coins<cost||id==='kit'&&this.p.heals>=5)return false;this.coins-=cost;this.shopUsed.push(id);if(id==='free'||id==='heal')this.p.hp=Math.min(this.maxHp,this.p.hp+this.maxHp*(id==='free'?.2:.45));if(id==='kit')this.p.heals++;if(id==='energy'){this.p.energy=100;this.p.charge=clamp(this.p.charge+25,0,100);}if(id==='reroll')this.rerolls+=2;if(id==='upgrade'){this.pending++;this.afterUpgrade='shop';this.offerUpgrades()}else this.emit('menu',{phase:'shop'});return true}
    offerEvent(){this.phase='event';this.eventChoices=[...this.shuffle(D.events.filter(e=>e.id!=='refuse')).slice(0,2).map(e=>e.id),'refuse'];this.emit('menu',{phase:'event'})}
    selectEvent(id){if(this.phase!=='event'||!this.eventChoices.includes(id))return false;this.events.push(id);if(id==='rush'){this.pending+=2;this.mutations.rushUntil=this.wave+2;this.afterUpgrade='event';this.offerUpgrades();return true}if(id==='blood'){this.p.hp=Math.max(1,this.p.hp-this.maxHp*.25);this.mutations.echo+=.35}if(id==='battery'){this.mutations.regen+=3;this.mutations.dangerUntil=this.wave+2}if(id==='repair'){this.p.hp=this.maxHp;this.p.heals=Math.min(5,this.p.heals+1);this.mutations.reward*=.88}if(id==='archive'){this.mutations.refund+=12;this.mutations.health*=1.12}if(id==='refuse')this.coins+=25;this.showShop();return true}
    nextWave(){if(this.phase!=='shop')return false;this.wave++;if(this.endless&&this.wave%8===1){this.map=(this.map+1)%3;this.layout()}this.phase='playing';this.waveTime=0;this.waveKills=0;this.importantSpawned=false;this.spawnTimer=.5;this.shopUsed=[];this.p.energy=100;this.p.inv=1;this.resetPath();this.emit('wave',{wave:this.wave});return true}
    finish(win){if(this.phase==='result')return;this.phase=this.training?'trainingDone':'result';this.won=win;this.reward=this.training?0:Math.round((this.kills*.55+this.stats.captures*.45+this.wave*12+(win?150:15))*D.difficulties[this.difficulty].reward*this.mutations.reward);this.emit('result',{won:win,reward:this.reward})}
    pause(){if(this.phase!=='playing')return false;this.phase='paused';return true}
    resume(){if(this.phase!=='paused')return false;this.phase='playing';this.p.inv=Math.max(this.p.inv,.4);return true}
    serialize(){const v=clone(this);delete v.signals;return v}
    static restore(data){
      try{
        if(!data||data.version!==1||!['playing','paused','upgrade','shop','event'].includes(data.phase)||data.training||!data.p||typeof data.id!=='string'||typeof data.seed!=='string')return null;
        for(const key of ['hero','map','difficulty'])if(!Number.isInteger(data[key])||data[key]<0||data[key]>2)return null;
        for(const key of ['x','y','hp','energy','inv','dirX','dirY','dash','dashCd','echoCd','rewindCd','sealCd','charge','overload','stored','heals'])if(!Number.isFinite(data.p[key]))return null;
        if(data.p.hp<=0||data.p.x<0||data.p.x>1800||data.p.y<0||data.p.y>1300)return null;
        for(const key of ['wave','time','waveTime','kills','waveKills','coins','xp','level','xpNeed','pending','rng','nextId','pathLength','rerolls','spawnTimer'])if(!Number.isFinite(data[key])||key!=='spawnTimer'&&data[key]<0)return null;
        if(!Number.isInteger(data.wave)||data.wave<1||data.xpNeed<1||!data.build||!data.meta||!data.stats?.damage||!data.mutations)return null;
        for(const key of ['path','enemies','bullets','drops','fields','tasks','warnings','nodes','obstacles','options','eventChoices','events','shopUsed'])if(!Array.isArray(data[key]))return null;
        if(!data.path.length||data.path.length>160||!data.path.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)))return null;
        for(const key of ['enemies','bullets','drops','nodes','obstacles'])if(!data[key].every(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)))return null;
        if(data.phase==='upgrade'&&(!data.options.length||data.options.some(id=>!D.upgrades.some(u=>u.id===id))))return null;
        if(data.phase==='event'&&(!data.eventChoices.length||data.eventChoices.some(id=>!D.events.some(e=>e.id===id))))return null;
        for(const [id,lv]of Object.entries(data.build)){const u=D.upgrades.find(u=>u.id===id);if(!u||!Number.isInteger(lv)||lv<0||lv>u.max)return null;}
        const g=Object.create(Game.prototype);Object.assign(g,clone(data));g.signals=[];if(g.phase==='paused')g.phase='playing';return g;
      }catch{return null}
    }
    initTraining(){this.tutorialStep=0;this.tutorialBaseline={seals:0,captures:0,echoes:0,dashes:0,rewinds:0,marks:0};this.obstacles=[];this.nodes=[];this.emit('tutorial',{step:0});}
    updateTraining(){
      this.p.hp=Math.max(this.p.hp,50);this.p.energy=Math.max(this.p.energy,80);this.p.charge=Math.max(this.p.charge,0);this.spawnTimer-=.02;
      if(!this.enemies.length){const e=this.spawn(this.tutorialStep===2?'gunner':'runner');e.x=clamp(this.p.x+(this.p.x>1550?-130:130),60,1740);e.y=this.p.y;e.speed=35;e.damage=2;e.hp=e.maxHp=25;}
      if(this.tutorialStep===2&&this.bullets.filter(b=>!b.friendly).length<5){const anchor=this.path[Math.floor(this.path.length/2)]||this.p;this.bullets.push({id:this.nextId++,x:anchor.x+140,y:anchor.y,vx:-120,vy:0,r:6,damage:1,friendly:false,life:3})}
      const counter=['marks','seals','captures','echoes','dashes','rewinds'][this.tutorialStep];if(counter&&this.stats[counter]>this.tutorialBaseline[counter]){this.tutorialStep++;this.tutorialBaseline={...this.stats};this.emit('tutorial',{step:this.tutorialStep});if(this.tutorialStep>=6)this.finish(true)}
    }
  }
  return{Game,geometry:{inside,area,centroid,segmentDistance,edgeDistance},data:D,seedNumber};
});
