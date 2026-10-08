'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('./content.js'),E=require('./engine.js');
const s=E.create(),milestones=[],choices=[];
const priorities=['attack','vitality','haste','capacity','amplify','recovery','shielding','intercept','source','damping','focus','recycling'];
E.setPolicy(s,'commandeer');
let t=0;
while(s.highest<48&&t<86400){
  E.run(s,10);t+=10;
  // Normal, legal purchases using only combat-earned currency.
  for(let j=0;j<5;j++){const options=priorities.filter(id=>{const r=C.research.find(x=>x.id===id);return s.highest>=r.unlock&&s.research[id]<r.max&&s.credits>=E.cost(s,id);});options.sort((a,b)=>E.cost(s,a)-E.cost(s,b));if(!options.length)break;E.upgrade(s,options[0]);}
  for(const id of ['lens','buckler','prism']){if(E.buy(s,id))E.equip(s,id);}
  if(s.stats.losses>0&&s.highest%8>=6)E.setPolicy(s,'shelter');else E.setPolicy(s,'commandeer');
  if(s.highest>=8*(milestones.length+1))milestones.push({highest:s.highest,seconds:t,losses:s.stats.losses,research:{...s.research}});
}
assert.equal(s.highest,48,'campaign must be reachable with real rewards and legal purchases');
const trials=[];
for(const trial of C.trials){let success=null;for(const p of C.policies){const x=E.create();x.highest=8;E.setPolicy(x,p.id);E.launch(x,0,'trial',trial.id);for(let j=0;j<1600&&!x.battle.result;j++)E.run(x,.25);if(x.battle.result==='won'&&E.trialSuccess(x.battle,trial.id)){success={id:trial.id,name:trial.name,policy:p.id,time:x.battle.elapsed};break;}}assert(success,'trial must have a valid fixed-stat strategy: '+trial.name);trials.push(success);}
const away=E.restore(JSON.stringify(s)),before=away.credits;E.run(away,86400);assert(away.stats.wins>s.stats.wins);assert(away.credits>before);E.restore(JSON.stringify(away));
const report={campaign:{seconds:t,wins:s.stats.wins,losses:s.stats.losses,research:s.research},milestones,trials,away24h:{wins:away.stats.wins-s.stats.wins,credits:away.credits-before,validSave:true}};
fs.writeFileSync(__dirname+'/progression-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
