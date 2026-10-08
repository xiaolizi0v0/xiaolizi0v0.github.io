// Research model only. No art, theme, product save, or production-game code.
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const BUDGET=10,CAP=20;
const allocations={balanced:[2,2,2,2,2],targetA:[2,1,3,2,2],targetB:[1,2,2,3,2],sourceOnly:[5,5,0,0,0]};
function simulate({seconds,goal,policy}){
 const stock=[0,0,0,0];let output=0,waste=0;const checkpoints=[];
 for(let t=0;t<seconds;t++){
  const needs=goal(t),a=policy({t,needs,stock:[...stock]});
  assert.equal(a.reduce((x,y)=>x+y,0),BUDGET);assert.ok(a.every(x=>Number.isInteger(x)&&x>=0));
  for(let i=0;i<2;i++){const incoming=a[i],accepted=Math.min(incoming,CAP-stock[i]);stock[i]+=accepted;waste+=incoming-accepted}
  for(let i=0;i<2;i++){const n=Math.min(a[i+2]*.7,stock[i],CAP-stock[i+2]);stock[i]-=n;stock[i+2]+=n}
  const n=Math.min(a[4]*.5,stock[2]/needs[0],stock[3]/needs[1]);stock[2]-=n*needs[0];stock[3]-=n*needs[1];output+=n;
  if((t+1)%300===0)checkpoints.push({second:t+1,output:+output.toFixed(4),stock:stock.map(x=>+x.toFixed(4))});
 }
 return{output:+output.toFixed(4),unusedIncoming:+waste.toFixed(4),stock:stock.map(x=>+x.toFixed(4)),checkpoints};
}
const fixedA=()=>[2,1],fixedB=()=>[1,2],changing=t=>Math.floor(t/300)%2===0?[2,1]:[1,2];
const results={scope:'Neutral mechanism research; not implemented product or proof of fun',budget:BUDGET,storageLimit:CAP,processes:['sourceA','sourceB','prepareA','prepareB','finish'],allocations,fixedA:{},fixedB:{},changing:{}};
for(const[n,a]of Object.entries(allocations)){results.fixedA[n]=simulate({seconds:600,goal:fixedA,policy:()=>a});results.fixedB[n]=simulate({seconds:600,goal:fixedB,policy:()=>a});results.changing[n]=simulate({seconds:1200,goal:changing,policy:()=>a})}
results.changing.adaptive=simulate({seconds:1200,goal:changing,policy:({needs})=>needs[0]===2?allocations.targetA:allocations.targetB});
results.waitCannotFixMissingStages=simulate({seconds:7200,goal:fixedA,policy:()=>allocations.sourceOnly});
assert.ok(results.fixedA.targetA.output>results.fixedA.targetB.output*1.25);
assert.ok(results.fixedB.targetB.output>results.fixedB.targetA.output*1.25);
assert.equal(results.waitCannotFixMissingStages.output,0);
assert.ok(results.changing.adaptive.output>Math.max(...Object.values(results.changing).filter(x=>x!==results.changing.adaptive).map(x=>x.output))*1.1);
results.conclusions={equalBudgetDifferentOutcomes:true,targetChangesBestAllocation:true,waitingCannotRepairMissingStage:true,conditionalAllocationHasMeasuredBenefit:true,unproven:['meaningful collaboration','originality beyond supply-chain mechanics','progression layers','attention frequency','fun','actual game online/offline consistency']};
fs.writeFileSync(__dirname+'/pine-strategy-lab-results.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({fixedA:Object.fromEntries(Object.entries(results.fixedA).map(([k,v])=>[k,v.output])),fixedB:Object.fromEntries(Object.entries(results.fixedB).map(([k,v])=>[k,v.output])),changing:Object.fromEntries(Object.entries(results.changing).map(([k,v])=>[k,v.output])),waitOutput:results.waitCannotFixMissingStages.output,unproven:results.conclusions.unproven},null,2));
