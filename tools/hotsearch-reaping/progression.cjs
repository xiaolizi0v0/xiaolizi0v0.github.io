'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),C=require('./content.js'),E=require('./engine.js');
const s=E.create();E.start(s);const milestones=[];let lastHighest=0,lastWins=0;
function spend(){
  for(let pass=0;pass<12;pass++){
    const options=[...C.weapons.filter(w=>s.highest>=w.unlock&&s.levels[w.id]<5).map(w=>({id:w.id,weapon:true,priority:['paper','bell','orbit','beam'].includes(w.id)?.8:1.4})),...C.upgrades.filter(u=>s.highest>=u.unlock&&s.upgrades[u.id]<u.max).map(u=>({id:u.id,weapon:false,priority:['attack','hp','haste','armor','regen'].includes(u.id)?1:1.7}))].filter(o=>E.cost(s,o.id,o.weapon)<=s.coins).sort((a,b)=>E.cost(s,a.id,a.weapon)*a.priority-E.cost(s,b.id,b.weapon)*b.priority);
    if(!options.length)break;const o=options[0];assert(E.upgrade(s,o.id,o.weapon));
  }
  const loadout=['paper','bell',s.levels.beam?'beam':'orbit',s.levels.petal?'petal':s.levels.frost?'frost':s.levels.context?'context':null].filter(x=>x&&s.levels[x]);
  for(const id of [...s.weapons])if(!loadout.includes(id)&&s.weapons.length>1)assert(E.equip(s,id));for(const id of loadout)if(!s.weapons.includes(id))assert(E.equip(s,id));
}
let seconds=0;for(;seconds<21600&&s.highest<36;seconds+=2){E.run(s,2);if(s.stats.wins!==lastWins||seconds%10===0){spend();lastWins=s.stats.wins;}if(s.highest!==lastHighest){milestones.push({stage:s.highest,seconds:seconds+2,kills:s.stats.kills,losses:s.stats.losses,coins:s.coins});lastHighest=s.highest;}}
const result={completed:s.highest===36,seconds,highest:s.highest,wins:s.stats.wins,losses:s.stats.losses,kills:s.stats.kills,levels:s.levels,upgrades:s.upgrades,milestones};
if(s.highest===36){E.start(s,35,null,true);s.autoAdvance=false;E.run(s,360);result.endless={phase:s.battle.phase,time:s.battle.time,wave:s.battle.wave,kills:s.battle.kills,bosses:s.battle.bossesKilled};E.restore(JSON.stringify(s));fs.writeFileSync(__dirname+'/review-save.json',JSON.stringify(s));}
fs.writeFileSync(__dirname+'/progression-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));assert(result.completed,'Legal purchases must be able to clear all 36 stages');
