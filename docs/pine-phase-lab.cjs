// Independent neutral research model. No chosen theme or game save.
'use strict';const assert=require('node:assert/strict'),fs=require('node:fs');
function simulate({offsets,routes,mode,buffer=0,steps=600}){
 const charge=[0,0,0];let stored=0,delivered=0,unused=0,support=0;const samples=[];
 for(let t=0;t<steps;t++){
  const phase=offsets.map(o=>(t+o)%6),incoming=[0,0,0];
  for(let i=0;i<3;i++)if(phase[i]>=4&&routes[i]>=0&&phase[routes[i]]<2){incoming[routes[i]]++;support++}
  let produced=0;for(let i=0;i<3;i++){
   if(phase[i]<2)charge[i]=Math.min(4,charge[i]+1+incoming[i]);
   else if(phase[i]<4){const q=Math.min(2,charge[i]);charge[i]-=q;produced+=q}
  }
  const cap=mode==='continuous'?2:(t%6===2||t%6===3?6:0);
  if(buffer){const accepted=Math.min(produced,buffer-stored);stored+=accepted;unused+=produced-accepted;const q=Math.min(cap,stored);stored-=q;delivered+=q}
  else{const q=Math.min(cap,produced);delivered+=q;unused+=produced-q}
  if(t%60===59)samples.push({step:t+1,delivered,stored});
 }
 return{offsets,routes,mode,buffer,steps,delivered,unused,support,samples};
}
const aligned={offsets:[0,0,0],routes:[-1,-1,-1]},staggered={offsets:[0,2,4],routes:[-1,-1,-1]},feedback={offsets:[0,2,4],routes:[1,2,0]};
const results={scope:'Automatic phase cooperation research, not implemented gameplay or human fun evidence',phaseCycle:['charge','charge','release','release','recover','recover'],unitBudget:3,continuous:{},pulse:{}};
for(const[n,c]of Object.entries({aligned,staggered,feedback})){results.continuous[n]=simulate({...c,mode:'continuous'});results.pulse[n]=simulate({...c,mode:'pulse'})}
results.pulseBufferedFeedback=simulate({...feedback,mode:'pulse',buffer:8});
assert.ok(results.continuous.feedback.delivered>results.continuous.staggered.delivered*1.5);
assert.ok(results.continuous.staggered.delivered>results.continuous.aligned.delivered*1.5);
assert.ok(results.pulse.aligned.delivered>results.pulse.feedback.delivered*1.25);
assert.ok(results.pulseBufferedFeedback.delivered>results.pulse.aligned.delivered*1.5);
results.conclusions={phaseAndCooperationChangeOutcome:true,steadyAndPulseNeedDifferentStrategy:true,newBufferChangesAvailableBestStrategy:true,noHumanTimingInput:true,unproven:['learnability','originality across entire market','long-term content','resource economy','online-offline consistency of future product','fun']};
fs.writeFileSync(__dirname+'/pine-phase-lab-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify({continuous:Object.fromEntries(Object.entries(results.continuous).map(([k,v])=>[k,v.delivered])),pulse:Object.fromEntries(Object.entries(results.pulse).map(([k,v])=>[k,v.delivered])),pulseBufferedFeedback:results.pulseBufferedFeedback.delivered,steps:600,unproven:results.conclusions.unproven},null,2));
