const {Game,data}=require('../tools/circuit-riot/engine.js');
const priorities={geometry:['bloom','double','power','edge','area','spool','seam','energy','hp','magnet','dash','memory','echo','capacity','charge','reflect','harvest','rewind','lure','freeze'],capture:['storm','prism','capacity','charge','reflect','seam','power','harvest','energy','hp','magnet','dash','echo','memory','area','spool','edge','lure','rewind','freeze'],echo:['repeat','temporal','echo','memory','rewind','lure','freeze','power','energy','hp','magnet','dash','capacity','charge','area','edge','spool','reflect','seam','harvest'],motion:['temporal','rewind','lure','dash','energy','hp','power','magnet','echo','memory','bloom','edge','area','spool','capacity','charge','reflect','harvest','seam','freeze']};
function runBot(style,options={}){const g=new Game({hero:style==='capture'?1:style==='echo'?2:0,map:0,seed:'build-'+style,...options});const targetWave=options.targetWave||8;const priority=priorities[style];let frames=0,lastSeal=0,lastEcho=0,angle=0,center={x:900,y:650},replays=0;
 while(g.phase!=='result'&&frames++<120000){
  if(g.phase==='upgrade'){
   const milestones={geometry:['power','edge'],capture:['capacity','charge'],echo:['echo','memory'],motion:['rewind','lure']}[style];
   const score=id=>{const u=data.upgrades.find(u=>u.id===id);if(u.requires)return -100;if(id==='hp'&&g.up('hp')<3&&(g.wave>=4||g.p.hp<g.maxHp*.65))return -80;if(milestones.includes(id)&&g.up(id)<2)return -50+milestones.indexOf(id);return priority.indexOf(id)<0?100:priority.indexOf(id)};
   let ranked=[...g.options].sort((a,b)=>score(a)-score(b));if(score(ranked[0])>9&&g.rerolls>0&&g.level<14){g.reroll();continue}g.selectUpgrade(ranked[0]);continue}
  if(g.phase==='event'){g.selectEvent(g.eventChoices.includes('battery')?'battery':g.eventChoices.includes('rush')?'rush':'refuse');continue}
  if(g.phase==='shop'){g.buy('free');if(g.p.hp<g.maxHp*.65)g.buy('heal');if(g.p.heals<2)g.buy('kit');if(g.coins>=75&&!g.shopUsed.includes('upgrade')){g.buy('upgrade');continue}g.nextWave();if(g.wave>targetWave&&g.endless){g.finish(false);break}lastSeal=g.time;continue}
  const boss=g.enemies.find(e=>e.boss||e.elite);if(boss){center.x+=(boss.x-center.x)*.012;center.y+=(boss.y-center.y)*.012}else{center.x+=(900-center.x)*.004;center.y+=(650-center.y)*.004}
  center.x=Math.max(620,Math.min(1180,center.x));center.y=Math.max(400,Math.min(900,center.y));angle+=.025;const radius=boss?150:185,tx=center.x+Math.cos(angle)*radius,ty=center.y+Math.sin(angle)*radius,dx=tx-g.p.x,dy=ty-g.p.y,n=Math.hypot(dx,dy)||1;
  g.update(.02,{x:dx/n,y:dy/n});
  if(g.phase!=='playing')continue;
  const p=g.preview(),danger=g.enemies.some(e=>!e.dead&&e.wind>0&&(Math.hypot(e.x-g.p.x,e.y-g.p.y)<85||e.type==='bossCutter'&&e.wind<.35&&Math.hypot(e.tx-g.p.x,e.ty-g.p.y)<230))||g.warnings.some(w=>!w.done&&w.delay<.3&&Math.hypot(w.x-g.p.x,w.y-g.p.y)<w.r+25);
  if(danger)g.dash();if(g.p.hp<g.maxHp*.5)g.heal();if(g.p.charge>=100)g.overload();
  if(g.pathLength>230&&g.time-lastSeal>1&&(p.inside>=3||p.marked>=4||boss&&g.pathLength>600||g.pathLength>950)){if(g.seal()){lastSeal=g.time}}
  if(g.lastLoop&&g.p.echoCd===0&&g.time-lastSeal>.7){const hits=g.enemies.filter(e=>!e.dead&&(require('../tools/circuit-riot/engine.js').geometry.inside(e,g.lastLoop.poly)||require('../tools/circuit-riot/engine.js').geometry.edgeDistance(e,g.lastLoop.poly)<g.lineWidth+e.r)).length;if(hits>=2||boss&&hits>=1){if(g.echo()){lastEcho=g.time;replays++}}}
  if(style==='motion'&&danger&&g.p.dashCd>0&&g.pathLength>120)g.rewind();
  g.drain();
 }
 return{game:g,report:{style,map:g.map,difficulty:g.difficulty,won:g.won,wave:g.wave,time:+g.time.toFixed(1),kills:g.kills,hp:+g.p.hp.toFixed(1),captures:g.stats.captures,seals:g.stats.seals,echoes:g.stats.echoes,advanced:g.stats.advanced,build:g.build,damage:g.stats.damage,frames}};
}
module.exports={runBot};if(require.main===module){for(const style of Object.keys(priorities))console.log(JSON.stringify(runBot(style).report));}
