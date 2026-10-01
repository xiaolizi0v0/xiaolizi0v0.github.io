(function(root,factory){const D=typeof module==='object'&&module.exports?require('./data.js'):root.VELOCITY_DATA;const api=factory(D);if(typeof module==='object'&&module.exports)module.exports=api;else root.VelocityCore=api})(typeof window==='undefined'?globalThis:window,D=>{
'use strict';if(typeof module==='object'&&module.exports)D.tracks=require('./tracks.js');const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),mod=(x,n)=>(x%n+n)%n,copy=o=>JSON.parse(JSON.stringify(o));
function hash(s){let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
function angleDiff(a,b){return Math.atan2(Math.sin(a-b),Math.cos(a-b))}
class Track{
 constructor(seed,city=0,route='safe',training=false,layout=null){
  let state=hash(seed)||1;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};const r=D.routes.find(r=>r.id===route)||D.routes[2],theme=D.cities[city];const available=D.tracks.filter(t=>t.city===city),map=D.tracks.find(t=>t.id===layout)||available[hash(seed)%available.length];this.layout=map.id;this.city=city;this.route=route;this.width=training?170:theme.width+r.width+map.width;this.points=[];
  const controls=[],scale=r.length;if(training){for(let i=0;i<12;i++){const a=i*Math.PI/6;controls.push({x:1300+Math.sin(a)*880*scale,y:1050-Math.cos(a)*650*scale})}}else for(const p of map.points){const f=1+(random()-.5)*.025*r.curve;controls.push({x:1300+(p[0]-50)*20*scale*f,y:1050+(p[1]-50)*15.2*scale*f})}
  const count=controls.length;for(let i=0;i<count;i++)for(let j=0;j<28;j++){const t=j/28,a=controls[mod(i-1,count)],b=controls[i],c=controls[(i+1)%count],d=controls[(i+2)%count],coord=k=>.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t*t+(-a[k]+3*b[k]-3*c[k]+d[k])*t*t*t);this.points.push({x:coord('x'),y:coord('y')})}
  this.rebuild();if(!training)this.smoothCorners();
 }
 smoothCorners(){
  // Round authored corners until the inner road edge cannot fold over itself.
  const length=this.length,n=Math.ceil(length/24),samples=[];for(let i=0;i<n;i++){const p=this.at(length*i/n);samples.push({x:p.x,y:p.y})}this.points=samples;this.rebuild();this.smoothingPasses=0;
  for(let pass=0;pass<600;pass++){if(pass%4===0){let maxCurve=0;for(const p of this.points)for(const d of [-35,0,35])maxCurve=Math.max(maxCurve,Math.abs(this.curvature(p.s+d+.001)));if(maxCurve*this.width<.82)break}const points=this.points;this.points=points.map((p,i)=>{const a=points[mod(i-2,n)],b=points[(i+2)%n];return{x:p.x*.5+(a.x+b.x)*.25,y:p.y*.5+(a.y+b.y)*.25}});this.rebuild();this.smoothingPasses++}
 }
 rebuild(){this.length=0;for(let i=0;i<this.points.length;i++){const p=this.points[i],n=this.points[(i+1)%this.points.length];p.s=this.length;p.distance=Math.hypot(n.x-p.x,n.y-p.y);this.length+=p.distance}}
 at(s,lane=0){const n=mod(s,this.length);let lo=0,hi=this.points.length-1;while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(this.points[mid].s<=n)lo=mid;else hi=mid-1}const p=this.points[lo],q=this.points[(lo+1)%this.points.length],t=(n-p.s)/p.distance,dx=(q.x-p.x)/p.distance,dy=(q.y-p.y)/p.distance;return{x:p.x+(q.x-p.x)*t-dy*lane,y:p.y+(q.y-p.y)*t+dx*lane,angle:Math.atan2(dy,dx),nx:-dy,ny:dx}}
 curvature(s){return angleDiff(this.at(s+35).angle,this.at(s-35).angle)/70}
 delta(a,b){return mod(a-b+this.length/2,this.length)-this.length/2}
 static restore(v){if(!v||!Array.isArray(v.points)||v.points.length<12||!v.points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)))return null;const t=Object.assign(Object.create(Track.prototype),copy(v));t.rebuild();return t}
}
class Game{
 constructor(o={}){
  this.version=1;this.seed=String(o.seed||Date.now().toString(36));this.id=o.id||Date.now().toString(36)+'-'+hash(this.seed)+'-'+Math.random().toString(36).slice(2,8);this.rng=hash(this.seed)||1;this.car=clamp(o.car||0,0,2);this.startCity=clamp(o.city||0,0,2);this.city=this.startCity;this.difficulty=clamp(o.difficulty||0,0,2);this.endless=!!o.endless;this.training=!!o.training;this.meta={motor:0,body:0,battery:0,grip:0,cargo:0,...o.meta};this.firstMap=D.tracks.some(t=>t.id===o.map)?o.map:null;if(this.firstMap){this.startCity=D.tracks.find(t=>t.id===this.firstMap).city;this.city=this.startCity}this.mapHistory=[];this.stage=1;this.route='safe';this.build={};this.level=1;this.xp=0;this.xpNeed=42;this.pending=0;this.options=[];this.afterUpgrade='';this.rerolls=3;this.coins=0;this.signals=[];this.totalTime=0;this.records=[];this.events=[];this.eventChoices=[];this.routeChoices=[];this.shopUsed=[];this.mutations={speed:0,cooling:0,regen:0,railCost:0,rivalRail:0,reward:1,rushUntil:0};this.stats={swaps:0,drift:0,rails:0,ownRails:0,otherRails:0,overtakes:0,nitros:0,shields:0,advanced:0,collisions:0,draftSeconds:0,bestLap:0};this.p={id:'player',s:-432,lane:0,latV:0,v:0,hp:this.maxHp,energy:40,heat:0,shield:0,swapCd:0,railCd:0,nitroCd:0,shieldCd:0,boost:0,railBoost:0,railPower:0,swapBurst:0,heals:2,lastDamage:0,hitCd:0,driftCharge:0,comboDistance:0,drifting:false,lap:0,lastLapTime:0,finishTime:null,phoenixUsed:false};this.link={id:null,charge:0,grace:0};this.rapid=0;this.beginStage();if(this.training){this.phase='playing';this.initTraining()}
 }
 random(){this.rng=(Math.imul(this.rng,1664525)+1013904223)>>>0;return this.rng/4294967296}
 pick(a){return a[Math.floor(this.random()*a.length)]}
 shuffle(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r}
 emit(type,data={}){this.signals.push({type,...data});if(this.signals.length>120)this.signals.shift()}
 drain(){return this.signals.splice(0)}
 up(id){return this.build[id]||0}
 get carData(){return D.cars[this.car]}
 get maxHp(){return this.carData.hp+this.meta.body*8+this.up('armour')*22}
 get maxSpeed(){return this.carData.speed+this.up('motor')*12+this.meta.motor*3+this.mutations.speed}
 get grip(){return this.carData.grip+this.up('tires')*.14+this.meta.grip*.025}
 get laps(){return (this.stage-1)%6===5?3:2}
 get goal(){return this.track.length*this.laps}
 get localStage(){return(this.stage-1)%6+1}
 get bossRace(){return this.stage%2===0&&!this.training}
 beginStage(){
  this.city=(this.startCity+Math.floor((this.stage-1)/2))%3;const maps=D.tracks.filter(t=>t.city===this.city),unused=maps.filter(t=>!this.mapHistory.includes(t.id)),map=this.stage===1&&this.firstMap?this.firstMap:this.pick(unused.length?unused:maps).id;this.layout=map;this.mapHistory.push(map);this.track=new Track(this.seed+'-'+this.stage,this.city,this.route,this.training,map);this.phase='countdown';this.countdown=3;this.raceTime=0;this.p.s=-432;this.p.lane=0;this.p.latV=0;this.p.v=0;this.p.finishTime=null;this.p.lap=0;this.p.lastLapTime=0;this.p.driftCharge=0;this.p.drifting=false;this.p.hitCd=0;this.link={id:null,charge:0,grace:0};this.rails=[];this.warnings=[];this.hazards=[];this.pickups=[];this.shopUsed=[];this.bossTimer=6;this.lastRank=7;
  this.rivals=[];for(let i=0;i<6;i++){const type=i===0&&this.bossRace?'boss':['blocker','sprinter','drifter','heavy'][i%4];this.rivals.push({id:'r'+i,name:type==='boss'?D.cities[this.city].boss:['铬影','赤线','夜航','重锤','闪频','镭车'][i],type,s:-i*72,lane:[-70,0,70][i%3],latV:0,v:0,targetLane:[-70,0,70][i%3],cruise:(type==='boss'?304:267+i*4)+this.stage*3+D.difficulties[this.difficulty].ai+Math.floor((this.stage-1)/6)*8,boost:0,railBoost:0,railPower:0,hitCd:0,slow:0,change:2+this.random()*2,wind:0,finishTime:null,color:['#ff568d','#ffb24c','#aa55ff','#7b89aa','#47e6f2','#ee7eff'][i],boss:type==='boss'})}
  if(!this.training){const route=D.routes.find(r=>r.id===this.route),count=8+this.stage+route.hazards;for(let i=0;i<count;i++)this.hazards.push({s:500+this.random()*(this.track.length-700),lane:this.pick([-85,-40,40,85]),r:21,type:this.city===2&&i%3===0?'oil':'barrier'});for(let i=0;i<14;i++)this.pickups.push({id:i,s:(i+.5)*this.track.length/14,lane:this.pick([-75,0,75]),type:['data','coin','energy','data','coin','heal'][i%6],used:[]})}
  if(this.route==='safe'&&!this.training)this.p.hp=Math.min(this.maxHp,this.p.hp+this.maxHp*.3);
  if(this.route==='tech'&&this.stage>1){this.pending++;this.afterUpgrade='countdown';this.offerUpgrades(false,'drift')}
  this.emit('stage',{stage:this.stage,city:this.city});
 }
 rank(){const entries=[this.p,...this.rivals];entries.sort((a,b)=>{if(a.finishTime!==null&&b.finishTime!==null)return a.finishTime-b.finishTime;if(a.finishTime!==null)return-1;if(b.finishTime!==null)return 1;return b.s-a.s});return entries.findIndex(e=>e.id==='player')+1}
 standings(){return[this.p,...this.rivals].sort((a,b)=>a.finishTime!==null&&b.finishTime!==null?a.finishTime-b.finishTime:a.finishTime!==null?-1:b.finishTime!==null?1:b.s-a.s)}
 updateLink(dt){
  const p=this.p,range=230+this.up('antenna')*35;let candidate=null,gap=Infinity;
  for(const e of this.rivals){const d=e.s-p.s;if(e.finishTime!==null||d<20||d>range||Math.abs(e.lane-p.lane)>44)continue;if(d<gap){candidate=e;gap=d}}
  if(candidate){if(this.link.id!==candidate.id){this.link={id:candidate.id,charge:0,grace:1.4}}this.link.grace=1.4;const duration=this.rapid>0?.35:Math.max(.45,(1.2-this.up('antenna')*.14)*this.carData.lock);this.link.charge=Math.min(1,this.link.charge+dt/duration);p.energy=clamp(p.energy+dt*(9+this.up('bank')*1.4),0,100);this.stats.draftSeconds+=dt}
  else{this.link.grace-=dt;if(this.link.grace<=0)this.link={id:null,charge:0,grace:0}}
 }
 swap(){
  if(this.phase!=='playing'||this.p.swapCd>0||this.link.charge<1)return false;const e=this.rivals.find(e=>e.id===this.link.id);if(!e||e.finishTime!==null||this.link.grace<=0)return false;
  const old=this.p.v;this.p.v=e.v;e.v=old;this.p.swapCd=Math.max(1.8,5-this.up('clutch')*.6);this.p.swapBurst=.8+this.up('clutch')*.15;this.p.energy=clamp(this.p.energy+12+this.up('bank')*8,0,100);this.stats.swaps++;
  if(this.up('relay')){this.p.shield=Math.max(this.p.shield,1.2);this.rapid=3}this.emit('swap',{rival:e.id,gain:this.p.v-old});this.link={id:null,charge:0,grace:0};return true;
 }
 railCost(){return Math.max(12,45-this.up('width')*3-this.mutations.railCost)}
 rail(){if(this.phase!=='playing'||this.p.railCd>0||this.p.energy<this.railCost())return false;this.p.energy-=this.railCost();this.p.railCd=3.5;const rail={id:'rail-'+this.totalTime,owner:'player',s:mod(this.p.s+35,this.track.length),lane:this.p.lane,length:240+this.up('length')*75,width:75+this.up('width')*14,life:12+this.up('length')*2,hits:[],power:75+this.up('launch')*18};this.rails.push(rail);this.stats.rails++;this.emit('rail',{rail:copy(rail)});return true}
 nitro(){const cost=this.up('coldFire')&&this.p.heat>55?10:25;if(this.phase!=='playing'||this.p.nitroCd>0||this.p.energy<cost)return false;this.p.energy-=cost;this.p.heat=clamp(this.p.heat+22,0,110);this.p.boost=Math.max(this.p.boost,2);this.p.nitroCd=1;this.stats.nitros++;this.emit('nitro');return true}
 shield(){if(this.phase!=='playing'||this.p.shieldCd>0||this.p.energy<35)return false;this.p.energy-=35;this.p.shield=2.5+this.up('supply')*.4;this.p.shieldCd=12-this.up('supply')*1.5;this.stats.shields++;this.emit('shield');return true}
 repair(){if(this.phase!=='playing'||this.p.heals<=0||this.p.hp>=this.maxHp)return false;this.p.heals--;this.p.hp=Math.min(this.maxHp,this.p.hp+this.maxHp*.45);this.emit('repair');return true}
 hurt(value,reason='撞击'){if(this.p.shield>0||this.p.hitCd>0)return false;this.p.hitCd=.65;this.p.lastDamage=this.totalTime;this.p.hp=Math.max(this.training?1:0,this.p.hp-value*this.carData.armour*Math.max(.55,1-this.up('armour')*.08)*D.difficulties[this.difficulty].damage);this.stats.collisions++;this.emit('hurt',{reason});if(this.p.hp<=0){if(this.up('phoenix')&&!this.p.phoenixUsed){this.p.phoenixUsed=true;this.p.hp=this.maxHp*.35;this.p.shield=4;this.emit('phoenix')}else this.finish(false,'车体损毁')}return true}
 cross(e,old,dt){if(e.finishTime!==null)return;const length=this.track.length,lap=Math.max(0,Math.floor(e.s/length));if(e.id==='player'&&lap>this.p.lap){const crossing=this.raceTime-dt+dt*(lap*length-old)/Math.max(.001,e.s-old),time=crossing-this.p.lastLapTime;this.p.lastLapTime=crossing;this.p.lap=lap;if(!this.stats.bestLap||time<this.stats.bestLap)this.stats.bestLap=time;this.emit('lap',{lap,time})}if(e.s>=this.goal){e.finishTime=this.raceTime-dt+dt*(this.goal-old)/Math.max(.001,e.s-old);e.s=this.goal;e.v=0;this.emit('cross',{id:e.id,time:e.finishTime})}}
 updatePlayer(dt,input){
  const p=this.p;for(const key of ['shield','swapCd','railCd','nitroCd','shieldCd','boost','railBoost','swapBurst','hitCd'])p[key]=Math.max(0,p[key]-dt);this.rapid=Math.max(0,this.rapid-dt);
  const steer=clamp(input.steer||0,-1,1),brake=!!input.brake,drift=!!input.drift&&Math.abs(steer)>.12&&p.v>150,curve=this.track.curvature(p.s),wet=D.cities[this.city].rain?.88:1,grip=this.grip*wet;
  if(this.training&&Math.abs(steer)>.2)this.tutorialSteer+=Math.abs(steer)*dt;
  p.energy=Math.min(100,p.energy+Math.max(.5,3+this.meta.battery*.3+this.mutations.regen)*dt);p.heat=Math.max(0,p.heat-(5+this.up('cooling')*3+this.mutations.cooling)*dt);
  let target=input.throttle===false?0:this.maxSpeed;target-=Math.min(40,Math.abs(curve)*7000)/grip;target+=p.boost>0?90:0;target+=p.railBoost>0?p.railPower:0;target+=p.swapBurst>0?25+this.up('clutch')*5:0;if(brake)target=0;target=Math.max(0,target);if(drift)target*=.94;if(p.heat>95){target*=.72;this.hurt(3*dt,'过热')}
  const rate=target>p.v?(95*(1+this.up('torque')*.12)):(brake?240:75);p.v+=clamp(target-p.v,-rate*dt,rate*dt);
  p.latV+=(steer*(drift?220:180)-curve*p.v*p.v*.1-p.lane*(input.assist===0?0:drift?.3:1.25))*dt;p.latV*=Math.exp(-dt*(drift?1.7:5)*grip);p.lane+=p.latV*dt;
  if(Math.abs(p.lane)>this.track.width-15){p.lane=clamp(p.lane,-this.track.width+15,this.track.width-15);p.latV*=-.3;p.v*=.96;this.hurt(9,'护栏擦碰');this.link={id:null,charge:0,grace:0}}
  if(drift){const distance=p.v*dt;p.driftCharge+=distance;p.comboDistance+=distance;this.stats.drift+=distance;p.energy=Math.min(100,p.energy+dt*10*this.carData.drift*(1+this.up('reclaim')*.25)*(this.route==='tech'?1.2:1));p.heat=clamp(p.heat+dt*12,0,110);if(p.comboDistance>=45){p.comboDistance-=45;this.coins+=this.up('combo')*3;this.addXp(1+this.up('combo')*3)} }
  else if(p.drifting){if(p.driftCharge>25&&this.up('slingshot')){p.boost=Math.max(p.boost,1.4);p.energy=Math.min(100,p.energy+8);this.emit('slingshot')}p.driftCharge=0}p.drifting=drift;
  if(this.up('regen')&&this.totalTime-p.lastDamage>8)p.hp=Math.min(this.maxHp,p.hp+this.up('regen')*1.5*dt);
  const old=p.s;p.s+=p.v*dt;this.cross(p,old,dt);
 }
 updateRivals(dt){for(const e of this.rivals){if(e.finishTime!==null)continue;for(const k of ['boost','railBoost','hitCd','slow','wind'])e[k]=Math.max(0,e[k]-dt);e.change-=dt;
  if(this.training&&e.type==='guide'){e.targetLane=clamp(this.p.lane,-85,85);e.change=20;e.cruise=Math.max(180,this.p.v+(110-(e.s-this.p.s))*.6)}
  if(e.change<=0){e.change=2+this.random()*3;const ahead=e.s-this.p.s;if(e.type==='blocker'&&ahead>20&&ahead<260){e.targetLane=clamp(this.p.lane,-85,85);e.wind=.5}else e.targetLane=this.pick([-75,-35,0,35,75]);}
  if(e.wind<=0){e.latV+=(e.targetLane-e.lane)*dt*3;e.latV*=Math.exp(-dt*4);e.lane=clamp(e.lane+e.latV*dt,-this.track.width+20,this.track.width-20)}
  const curve=Math.abs(this.track.curvature(e.s));let target=e.cruise+(this.stage<=this.mutations.rushUntil?12:0)-Math.min(42,curve*8000)/(e.type==='drifter'?1.4:1);if(e.type==='sprinter'&&Math.floor(this.raceTime)%9<2&&curve<.002)target+=28;if(e.boost>0)target+=40;if(e.railBoost>0)target+=e.railPower;if(e.slow>0)target*=.6;e.v+=clamp(target-e.v,-100*dt,88*dt);
  const old=e.s;e.s+=e.v*dt;this.cross(e,old,dt);
 }}
 useRails(dt){for(const r of this.rails){r.life-=dt;for(const e of [this.p,...this.rivals]){if(e.finishTime!==null)continue;const d=mod(e.s-r.s,this.track.length),lap=Math.floor(e.s/this.track.length),key=e.id+':'+lap;if(d>r.length||Math.abs(e.lane-r.lane)>r.width/2||r.hits.includes(key))continue;r.hits.push(key);e.railBoost=Math.max(e.railBoost,1.6);e.railPower=r.power;
   if(e.id==='player'){if(this.up('private')&&r.owner==='player'){e.railPower*=1.5;e.shield=Math.max(e.shield,.6)}this.stats.ownRails++;this.emit('railHit',{owner:r.owner})}
   else{e.railPower+=this.mutations.rivalRail;if(r.owner==='player'){this.stats.otherRails++;this.coins+=this.up('payout')*8;if(this.up('toll')){this.p.energy=clamp(this.p.energy+15,0,100);this.coins+=12}this.emit('rivalRail',{id:e.id})}}
  }}this.rails=this.rails.filter(r=>r.life>0)}
 obstacles(){const p=this.p;for(const h of this.hazards){for(const e of [p,...this.rivals]){if(e.finishTime!==null||e.hitCd>0||Math.abs(this.track.delta(e.s,h.s))>35||Math.abs(e.lane-h.lane)>h.r+14)continue;if(e.id==='player'&&p.shield>0){p.hitCd=.35;this.emit('collision',{s:e.s,lane:e.lane});continue}e.v*=h.type==='oil'?.85:.7;if(e.id==='player'){if(h.type==='oil'){p.latV+=(p.lane>=0?1:-1)*45;this.hurt(4,'湿滑路面')}else this.hurt(13,'路障撞击')}else{e.hitCd=.65;e.slow=.5}this.emit('collision',{s:e.s,lane:e.lane})}}
  for(const e of this.rivals){if(e.finishTime!==null||p.finishTime!==null||p.hitCd>0||Math.abs(this.track.delta(e.s,p.s))>40||Math.abs(e.lane-p.lane)>27)continue;const sign=p.lane>=e.lane?1:-1;p.latV+=sign*30;if(p.shield<=0)p.v*=this.car===1?.84:.77;e.v*=.85;e.lane-=sign*6;e.hitCd=.5;this.hurt(7+Math.abs(e.v-p.v)*.035,'车辆碰撞');p.hitCd=.65;this.link={id:null,charge:0,grace:0};this.emit('collision',{s:p.s,lane:p.lane})}
 }
 boss(dt){if(!this.bossRace)return;const e=this.rivals.find(e=>e.boss);if(!e||e.finishTime!==null)return;this.bossTimer-=dt;if(this.bossTimer>0)return;this.bossTimer=7.5;const s=mod(this.p.s+260,this.track.length),type=D.cities[this.city].bossType;
  if(type==='rail'){this.rails.push({id:'boss-'+this.raceTime,owner:'boss',s,lane:this.pick([-65,0,65]),length:300,width:80,life:10,power:95,hits:[]});this.emit('bossSkill',{text:'磁轨女王铺下了共享快线'})}
  else{this.warnings.push({type,s,lane:type==='tax'?0:this.p.lane,width:type==='tax'?this.track.width*2:72,delay:1.2,life:6,active:false,hits:[]});this.emit('bossSkill',{text:type==='tax'?'高速收费区：减速至 330 以下或开盾':'换道封锁：拉出红色车道'})}
 }
 updateWarnings(dt){for(const w of this.warnings){w.delay-=dt;w.life-=dt;if(w.delay<=0)w.active=true;if(!w.active)continue;for(const e of [this.p,...this.rivals]){const key=e.id+':'+Math.floor(e.s/this.track.length);if(e.finishTime!==null||w.hits.includes(key)||Math.abs(this.track.delta(e.s,w.s))>60||Math.abs(e.lane-w.lane)>w.width/2)continue;w.hits.push(key);if(w.type==='tax'&&e.v<=330)continue;if(e.id==='player'){if(e.shield<=0){e.v*=.65;e.energy=Math.max(0,e.energy-20);this.hurt(12,'首领封锁')}}else{e.v*=.68;e.slow=1}}}this.warnings=this.warnings.filter(w=>w.life>0)}
 collectPickups(){const p=this.p;for(const item of this.pickups){const lap=Math.floor(p.s/this.track.length);if(item.used.includes(lap)||Math.abs(this.track.delta(p.s,item.s))>32||Math.abs(p.lane-item.lane)>36+this.up('magnet')*20)continue;item.used.push(lap);if(item.type==='data')this.addXp(14*(1+this.up('magnet')*.1));if(item.type==='coin')this.coins+=12;if(item.type==='energy')p.energy=Math.min(100,p.energy+25);if(item.type==='heal')p.hp=Math.min(this.maxHp,p.hp+15);this.emit('pickup',{item:copy(item)})}}
 update(dt,input={}){
  if(this.phase==='countdown'){this.countdown=Math.max(0,this.countdown-dt);if(this.countdown===0){this.phase='playing';this.emit('go')}return}if(this.phase!=='playing')return;dt=clamp(dt,0,.04);this.totalTime+=dt;this.raceTime+=dt;this.updatePlayer(dt,input);if(this.phase!=='playing')return;this.updateRivals(dt);this.updateLink(dt);this.useRails(dt);this.obstacles();if(this.phase!=='playing')return;this.boss(dt);this.updateWarnings(dt);if(this.phase!=='playing')return;this.collectPickups();
  const rank=this.rank();if(rank<this.lastRank){this.stats.overtakes+=this.lastRank-rank;this.addXp((this.lastRank-rank)*4);this.emit('overtake',{rank})}this.lastRank=rank;
  if(this.training){this.updateTraining();return}
  if(this.p.finishTime!==null){this.endRace();return}
  if(this.localStage===6&&this.rivals.some(e=>e.boss&&e.finishTime!==null)){this.finish(false,'首领抢先冲线');return}
  if(this.rivals.filter(e=>e.finishTime!==null).length>=(this.localStage===6?2:3)){this.finish(false,'未能进入晋级名次');return}
  if(this.pending>0)this.offerUpgrades();
 }
 addXp(value){if(this.training)return;this.xp+=value;while(this.xp>=this.xpNeed){this.xp-=this.xpNeed;this.level++;this.pending++;this.xpNeed=42+this.level*14}}
 available(){return D.upgrades.filter(u=>this.up(u.id)<u.max&&(!u.requires||Object.entries(u.requires).every(([id,lv])=>this.up(id)>=lv)))}
 offerUpgrades(refresh=false,group=null){this.phase='upgrade';if(refresh||!this.options.length){const pool=this.available(),advanced=pool.filter(u=>u.requires),related=pool.filter(u=>u.group===(group||this.carData.group)||this.up(u.id)>0),first=group?this.pick(pool.filter(u=>u.group===group)):advanced.length?this.pick(advanced):this.pick(related.length?related:pool);this.options=[...(first?[first.id]:[]),...this.shuffle(pool.filter(u=>u!==first)).slice(0,2).map(u=>u.id)];if(!this.options.length){this.pending=Math.max(0,this.pending-1);this.coins+=50;this.finishUpgrade();return}}this.emit('menu',{phase:'upgrade'})}
 selectUpgrade(id){if(this.phase!=='upgrade'||!this.options.includes(id)||!this.available().some(u=>u.id===id))return false;const u=D.upgrades.find(u=>u.id===id);this.build[id]=this.up(id)+1;if(id==='armour')this.p.hp+=22;if(id==='repair'){this.p.heals=Math.min(5,this.p.heals+1);this.p.hp=Math.min(this.maxHp,this.p.hp+20)}if(u.requires)this.stats.advanced++;this.pending=Math.max(0,this.pending-1);this.options=[];this.emit('upgrade',{id});this.finishUpgrade();return true}
 reroll(){if(this.phase!=='upgrade'||this.rerolls<=0)return false;this.rerolls--;this.offerUpgrades(true);return true}
 finishUpgrade(){if(this.pending>0){this.offerUpgrades();return}const next=this.afterUpgrade;this.afterUpgrade='';if(next==='race')this.afterRace();else if(next==='garage'||next==='event')this.garage();else if(next==='countdown')this.phase='countdown';else{this.phase='playing';this.p.shield=Math.max(this.p.shield,.8)}this.emit('menu',{phase:this.phase})}
 endRace(){const place=this.rank(),boss=this.rivals.find(e=>e.boss),qualified=place<=(this.localStage===6?2:3)&&(!boss||this.localStage!==6||boss.finishTime===null||this.p.finishTime<boss.finishTime);this.records.push({stage:this.stage,city:this.city,place,time:this.p.finishTime,laps:this.laps,route:this.route,map:this.layout});if(!qualified){this.finish(false,'未能晋级');return}this.coins+=100+(4-place)*25+this.meta.cargo*8+(this.route==='fast'?40:this.route==='safe'?-15:0);this.p.hp=Math.min(this.maxHp,this.p.hp+this.maxHp*.12);this.pending++;this.afterUpgrade='race';this.emit('raceClear',{place});this.offerUpgrades()}
 afterRace(){if(this.stage>=6&&!this.endless){this.finish(true,'城市冠军');return}if(this.stage%6===2||this.stage%6===4){this.phase='event';this.eventChoices=[...this.shuffle(D.events.filter(e=>e.id!=='refuse')).slice(0,2).map(e=>e.id),'refuse']}else this.garage();this.emit('menu',{phase:this.phase})}
 garage(){this.phase='garage';this.emit('menu',{phase:'garage'})}
 buy(id){if(this.phase!=='garage'||this.shopUsed.includes(id))return false;const cost={free:0,repair:40,kit:50,upgrade:100,battery:35,coolant:25,reroll:40}[id];if(cost===undefined||this.coins<cost||id==='kit'&&this.p.heals>=5)return false;this.coins-=cost;this.shopUsed.push(id);if(id==='free'||id==='repair')this.p.hp=Math.min(this.maxHp,this.p.hp+this.maxHp*(id==='free'?.18:.45));if(id==='kit')this.p.heals++;if(id==='battery')this.p.energy=Math.min(100,this.p.energy+60);if(id==='coolant'){this.p.heat=0;this.p.shield=Math.max(this.p.shield,2)}if(id==='reroll')this.rerolls+=2;if(id==='upgrade'){this.pending++;this.afterUpgrade='garage';this.offerUpgrades()}else this.emit('menu',{phase:'garage'});return true}
 chooseEvent(id){if(this.phase!=='event'||!this.eventChoices.includes(id))return false;this.events.push(id);if(id==='rush'){this.pending+=2;this.mutations.rushUntil=this.stage+2;this.afterUpgrade='event';this.offerUpgrades();return true}if(id==='leak'){this.mutations.speed+=18;this.p.hp=Math.max(1,this.p.hp-this.maxHp*.25)}if(id==='cool'){this.mutations.cooling+=4;this.mutations.regen-=1.5}if(id==='repair'){this.p.hp=this.maxHp;this.p.heals=Math.min(5,this.p.heals+1);this.mutations.reward*=.85}if(id==='rail'){this.mutations.railCost+=10;this.mutations.rivalRail+=20}if(id==='refuse')this.coins+=25;this.garage();return true}
 offerRoutes(){if(this.phase!=='garage')return false;this.routeChoices=this.shuffle(D.routes).map(r=>r.id);this.phase='route';this.emit('menu',{phase:'route'});return true}
 chooseRoute(id){if(this.phase!=='route'||!this.routeChoices.includes(id))return false;this.route=id;this.stage++;this.beginStage();return true}
 pause(){if(!['playing','countdown'].includes(this.phase))return false;this.pausedFrom=this.phase;this.phase='paused';return true}
 resume(){if(this.phase!=='paused')return false;this.phase=this.pausedFrom||'playing';return true}
 finish(won,reason='主动封存'){if(this.phase==='result'||this.phase==='trainingDone')return;this.won=won;this.reason=reason;this.phase=this.training?'trainingDone':'result';this.reward=this.training?0:Math.round((this.stats.overtakes*3+this.stats.swaps*5+this.stats.otherRails*2+this.records.length*55+(won?220:20))*D.difficulties[this.difficulty].reward*this.mutations.reward);this.emit('result',{won,reason,reward:this.reward})}
 serialize(){const v=copy(this);delete v.signals;return v}
 static restore(v){try{
  if(!v||v.version!==1||v.training||!['playing','countdown','paused','upgrade','garage','route','event'].includes(v.phase)||!v.p||v.p.hp<=0||typeof v.seed!=='string'||typeof v.id!=='string'||!Array.isArray(v.mapHistory)||!D.tracks.some(t=>t.id===v.layout)||v.track?.layout!==v.layout)return null;
  for(const k of ['car','city','startCity','difficulty'])if(!Number.isInteger(v[k])||v[k]<0||v[k]>2)return null;
  for(const k of ['s','lane','latV','v','hp','energy','heat','shield','swapCd','railCd','nitroCd','shieldCd','boost','railBoost','railPower','swapBurst','heals','lastDamage','hitCd','driftCharge','comboDistance','lap','lastLapTime'])if(!Number.isFinite(v.p[k]))return null;
  for(const k of ['rivals','rails','warnings','hazards','pickups','options','records','routeChoices','eventChoices','shopUsed'])if(!Array.isArray(v[k]))return null;
  if(v.rivals.length!==6||!v.rivals.every(e=>typeof e.id==='string'&&['s','lane','latV','v','targetLane','cruise','boost','railBoost','railPower','hitCd','slow','change','wind'].every(k=>Number.isFinite(e[k]))&&(e.finishTime===null||Number.isFinite(e.finishTime))))return null;
  if(!v.build||!v.meta||!v.stats||!v.mutations||!Number.isInteger(v.stage)||v.stage<1||!Number.isInteger(v.pending)||v.pending<0)return null;
  for(const k of ['rng','raceTime','totalTime','level','xp','xpNeed','rerolls','coins','countdown','bossTimer','lastRank','rapid'])if(!Number.isFinite(v[k]))return null;
  for(const m of D.meta)if(!Number.isInteger(v.meta[m.id])||v.meta[m.id]<0||v.meta[m.id]>m.max)return null;
  for(const [id,lv]of Object.entries(v.build)){const u=D.upgrades.find(u=>u.id===id);if(!u||!Number.isInteger(lv)||lv<1||lv>u.max||u.requires&&!Object.entries(u.requires).every(([id,n])=>v.build[id]>=n))return null}
  for(const k of ['swaps','drift','rails','ownRails','otherRails','overtakes','nitros','shields','advanced','collisions','draftSeconds','bestLap'])if(!Number.isFinite(v.stats[k])||v.stats[k]<0)return null;
  for(const k of ['speed','cooling','regen','railCost','rivalRail','reward','rushUntil'])if(!Number.isFinite(v.mutations[k]))return null;
  if(!v.link||typeof v.link.charge!=='number'||!Number.isFinite(v.link.grace)||v.link.id!==null&&!v.rivals.some(e=>e.id===v.link.id))return null;
  if(!D.routes.some(r=>r.id===v.route)||v.phase==='paused'&&!['playing','countdown'].includes(v.pausedFrom))return null;
  if(v.phase==='upgrade'&&(v.pending===0||!v.options.length)||v.phase==='route'&&!v.routeChoices.length||v.phase==='event'&&!v.eventChoices.length)return null;
  if(v.routeChoices.some(id=>!D.routes.some(r=>r.id===id))||v.eventChoices.some(id=>!D.events.some(e=>e.id===id)))return null;
  if(!v.rails.every(r=>['s','lane','length','width','life','power'].every(k=>Number.isFinite(r[k]))&&Array.isArray(r.hits))||!v.warnings.every(w=>['s','lane','width','delay','life'].every(k=>Number.isFinite(w[k]))&&Array.isArray(w.hits)))return null;
  if(!v.hazards.every(h=>['s','lane','r'].every(k=>Number.isFinite(h[k])))||!v.pickups.every(p=>['s','lane'].every(k=>Number.isFinite(p[k]))&&Array.isArray(p.used)))return null;
  const track=Track.restore(v.track);if(!track||!Number.isFinite(track.width)||track.width<50||track.length<100)return null;
  const g=Object.assign(Object.create(Game.prototype),copy(v));g.track=track;g.signals=[];if(g.phase==='paused')g.phase=g.pausedFrom;
  if(g.phase==='upgrade'&&g.options.some(id=>!g.available().some(u=>u.id===id)))return null;return g;
 }catch{return null}}
 initTraining(){this.rivals=this.rivals.slice(0,1);Object.assign(this.rivals[0],{s:this.p.s+100,lane:0,targetLane:0,v:200,type:'guide',name:'领航员',cruise:this.maxSpeed-4});this.hazards=[];this.pickups=[];this.tutorialStep=0;this.tutorialBaseline=copy(this.stats);this.p.energy=90;this.p.v=200;this.tutorialSteer=0;this.emit('tutorial',{step:0})}
 updateTraining(){this.p.hp=Math.max(80,this.p.hp);this.p.energy=Math.max(80,this.p.energy);const step=this.tutorialStep,b=this.tutorialBaseline,checks=[this.tutorialSteer>.18&&Math.abs(this.p.lane)>3,this.stats.drift-b.drift>35,this.link.charge>=1,this.stats.swaps>b.swaps,this.stats.ownRails>b.ownRails,this.stats.nitros>b.nitros];if(checks[step]){this.tutorialStep++;this.tutorialBaseline=copy(this.stats);if(this.tutorialStep===2){Object.assign(this.rivals[0],{s:this.p.s+95,lane:this.p.lane,targetLane:this.p.lane,v:this.p.v,change:20,cruise:this.maxSpeed-4});this.link={id:null,charge:0,grace:0}}this.emit('tutorial',{step:this.tutorialStep});if(this.tutorialStep>=6)this.finish(true,'训练完成')}if(this.p.s>this.goal-500){this.p.s-=this.track.length;this.rivals[0].s-=this.track.length;this.p.lap=Math.max(0,this.p.lap-1)}}
}
return{Game,Track,data:D,hash,mod,angleDiff};
});
