// Only normal controls, choices and garage purchases. Never inject speed / health / upgrades.
const {Game,data:D}=require('./engine.js');
const plans={draft:['relay','motor','antenna','clutch','torque','bank','combo','magnet','regen'],rail:['private','toll','width','length','payout','bank','motor','launch','combo'],drift:['slingshot','coldFire','tires','motor','cooling','reclaim','combo','magnet','regen'],survive:['phoenix','armour','regen','motor','supply','repair','combo','torque']};
function choose(g,style){const plan=plans[style],milestone={antenna:2,clutch:2,width:2,length:2,payout:2,bank:2,tires:2,motor:style==='survive'?3:2,cooling:2,reclaim:2,armour:2,regen:2};const score=id=>{let i=plan.indexOf(id);if(i<0)return-20;const u=D.upgrades.find(v=>v.id===id);return (u.requires?100:60-i*3)-(g.up(id)>=(milestone[id]||2)?50:0)+(id==='motor'&&g.up('motor')<2?15:0)};return [...g.options].sort((a,b)=>score(b)-score(a))[0]}
function drive(g,style){const p=g.p,curv=g.track.curvature(p.s),mod=(s,n)=>(s%n+n)%n;let lane=0;
 const obstacles=g.hazards.filter(h=>{const gap=mod(h.s-p.s,g.track.length);return gap<220&&gap>0});
 const rival=g.rivals.filter(e=>e.finishTime===null&&e.s-p.s>55&&e.s-p.s<320).sort((a,b)=>(a.s-p.s)-(b.s-p.s))[0];
 if(rival)lane=rival.lane;
 if(g.link.charge>=1&&rival){lane=rival.lane+(rival.lane>0?-56:56);if(Math.abs(p.lane-rival.lane)>30||g.link.grace<.4)g.swap()}
 for(const e of g.rivals){const gap=Math.abs(g.track.delta(e.s,p.s));if(gap<85&&Math.abs(lane-e.lane)<32)lane=e.lane+(e.lane>0?-62:62)}
 for(const h of obstacles)if(Math.abs(lane-h.lane)<45)lane=h.lane+(h.lane>0?-60:60);
 const warning=g.warnings.find(w=>mod(w.s-p.s,g.track.length)<180);if(warning){if(warning.type==='tax'&&p.v>320)g.shield();else if(warning.type!=='tax')lane=warning.lane+(warning.lane>0?-80:80)}
 lane=Math.max(-90,Math.min(90,lane));
 // Oscillating drift around a safe line provides real energy and XP without touching state.
 const doDrift=p.v>180&&p.heat<80&&!warning&&obstacles.length===0&&(!rival||rival.s-p.s>180);
 if(doDrift)lane+=Math.sin(g.raceTime*2.8)*26;
 const drift=doDrift&&Math.abs(p.lane-lane)>6;
 const strength=drift?220:180,damp=(drift?1.7:5)*g.grip*(D.cities[g.city].rain?.88:1);
 const steer=Math.max(-1,Math.min(1,((lane-p.lane)*5-p.latV*1.5-Math.sin(p.yaw)*p.v*.16+curv*p.v*p.v*.1+p.lane*(drift?.3:1.25))/strength));
 if(p.smallCharges>0&&p.smallWindow>0&&!p.drifting){if(p.nitroCards>0&&!p.boostSequence.endsWith('C')&&!p.boostSequence.endsWith('CW')&&p.boost===0)g.nitro();g.smallBurst()}
 if(p.hp<g.maxHp*.5)g.repair();
 if(style==='survive'&&p.energy>60&&g.rivals.some(e=>Math.abs(g.track.delta(e.s,p.s))<80&&Math.abs(e.lane-p.lane)<40))g.shield();
 if(p.heat<85&&p.energy>28&&!warning){if(style==='rail'&&p.energy>=g.railCost()&&p.railCd===0)g.rail();else if(p.nitroCd===0&&p.smallWindow===0)g.nitro()}
 if(p.energy>90&&p.railCd===0)g.rail();
 return {steer,drift,throttle:true,assist:1};
}
function run(style,seed='audit-'+style,city=0,endless=false,maxStage=6,map=null){const g=new Game({seed,car:style==='survive'?1:style==='drift'?2:0,city,endless,map});let ticks=0;while(!['result','trainingDone'].includes(g.phase)&&ticks++<120000){if(g.phase==='upgrade'){const choice=choose(g,style);if(!plans[style].includes(choice)&&g.rerolls>0){g.reroll();continue}g.selectUpgrade(choice)}else if(g.phase==='garage'){g.buy('free');if(g.p.hp<g.maxHp*.7)g.buy('repair');g.buy('upgrade');if(g.phase==='garage'){if(g.p.heals<2)g.buy('kit');g.buy('battery');g.buy('coolant');g.offerRoutes()}}else if(g.phase==='event'){g.chooseEvent(g.eventChoices.includes('leak')?'leak':g.eventChoices.includes('rush')?'rush':'refuse')}else if(g.phase==='route'){g.chooseRoute(style==='drift'?'tech':g.p.hp<g.maxHp*.75?'safe':style==='rail'?'fast':'safe')}else{if(g.phase==='countdown'&&g.countdown<.4)g.startBoost();g.update(.04,g.phase==='playing'?drive(g,style):{});g.drain()}if(endless&&g.stage>=maxStage&&g.phase==='garage')g.finish(false,'模拟主动封存')}
 return {g,summary:{style,seed,city,stage:g.stage,won:!!g.won,reason:g.reason,time:Math.round(g.totalTime),records:g.records.map(r=>[r.stage,r.place,Math.round(r.time)]),hp:Math.round(g.p.hp),build:g.build,stats:g.stats,ticks}}}
if(require.main===module){for(const s of Object.keys(plans))console.log(JSON.stringify(run(s).summary))}
module.exports={run,drive,choose};
