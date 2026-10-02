'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),C=require('./reference-core.js'),D=require('./reference-content.js');
require('./reference-activities.js');
const passed=[],distribution=[];
const check=(name,fn)=>{fn();passed.push(name);console.log('PASS '+name)};
const fresh=seed=>new C.Game({seed,clock:()=>Date.parse('2026-10-01T08:00:00+08:00')});
// Explicit production fixtures exercise every producer, tier boundary and mode.
// They are not campaign progress and are never written into the player's profile.
function setup(family,level,weather,double=false){const g=fresh('weather-fixture');g.s.board=Array(63).fill(null);g.s.board[0]=g.make('producer'+family,level);g.s.weather=weather;if(double){g.s.homeOwned=Array.from({length:8},()=>[0,1,2]);g.s.homeProgress=8;g.s.doubleEnergy=true}return g}
check('all 16 families keep their category weights; same-season adds exactly eight points to tier two',()=>{
 for(let family=0;family<16;family++)for(let level=5;level<=7;level++)for(const same of [false,true])for(const double of [false,true]){
  const weather=same?D.generators[family].season:(D.generators[family].season+1)%4,g=setup(family,level,weather,double),rates=C.productionRates(g.s.board[0],weather,double),p3=level===7?.12:0,p2=(level>=6?.28:0)-p3+(same?.08:0);
  assert.ok(Math.abs(rates.probabilities[1]-p2)<1e-12);assert.equal(rates.probabilities[2],p3);assert.ok(Math.abs(rates.probabilities.reduce((a,b)=>a+b,0)-1)<1e-12);
  for(const [tierRoll,expected]of [[0,p3?3:p2?2:1],[.119999,level===7?3:p2>.119999?2:1],[.12,p2+p3>.12?2:1],[.279999,p2+p3>.279999?2:1],[.28,same&&level>=6?2:1],[.359999,same&&level>=6?2:1],[.36,1],[.999999,1]]){
   const h=setup(family,level,weather,double);let rolls=[.1,tierRoll];h.random=()=>rolls.shift();const energy=h.s.energy,charge=h.s.board[0].charge,result=h.produce(0);assert.ok(result.ok);assert.equal(result.item.chain,D.generators[family].chains[0]);assert.equal(result.item.level,expected+(double?1:0));assert.equal(h.s.energy,energy-(double?2:1));assert.equal(h.s.board[0].charge,charge-1);assert.equal(rolls.length,0);
  }
 }
 assert.equal(C.productionRates({chain:'producer0',level:4},0),null);assert.equal(C.productionRates({chain:'tool',level:5},0),null);
});
check('paired genuine RNG production changes only eligible tier-one drops, never categories or tier three',()=>{
 for(const family of [0,4,15])for(const level of [5,6,7]){
  const a=setup(family,level,D.generators[family].season),b=setup(family,level,(D.generators[family].season+1)%4);a.s.rng=b.s.rng=12345;let changed=0;const tiers=[0,0,0];
  for(let n=0;n<2000;n++){for(const g of [a,b]){g.s.energy=200;g.s.board[0].charge=C.cap(g.s.board[0])}const x=a.produce(0),y=b.produce(0);assert.ok(x.ok&&y.ok);assert.equal(x.item.chain,y.item.chain);assert.equal(a.s.rng,b.s.rng);tiers[x.item.level-1]++;if(x.item.level!==y.item.level){assert.equal(y.item.level,1);assert.equal(x.item.level,2);changed++}a.s.board[x.index]=b.s.board[y.index]=null}
  assert.ok(changed>110&&changed<220,'seeded 2000 draws should show the eight-point bonus');distribution.push({family,level,draws:2000,changed,matchingWeatherTiers:tiers});
 }
});
check('weather switching preserves resources and RNG, respects story lock, survives valid save restoration',()=>{
 const g=fresh('weather-save'),before={energy:g.s.energy,coins:g.s.coins,rng:g.s.rng};assert.equal(g.setWeather(1),false);assert.ok(g.setWeather(0));assert.deepEqual({energy:g.s.energy,coins:g.s.coins,rng:g.s.rng},before);const restored=C.Game.restore(g.serialize(),{clock:g.clock});assert.ok(restored);assert.equal(restored.s.weather,0);assert.deepEqual(C.productionRates(restored.s.board[0],restored.s.weather),C.productionRates(g.s.board[0],g.s.weather));
 const full=setup(0,6,0);for(let n=1;n<full.unlocked;n++)full.s.board[n]=full.make('tool');const state=JSON.stringify(full.s);assert.equal(full.produce(0).ok,false);assert.equal(JSON.stringify(full.s),state);
});
check('free containers and independent night generation do not inherit main weather tier bonuses',()=>{
 const a=setup(0,5,0),b=setup(0,5,1);for(const g of [a,b]){g.s.board[1]=g.make('needle',4);const e=g.s.energy;const r=g.produce(1);assert.ok(r.ok);assert.equal(g.s.energy,e);assert.equal(g.s.board[r.index].level,1);assert.equal(g.s.board[r.index].chain,'cloth');g.s.homeProgress=1;assert.ok(g.startNight('drink'));g.s.rng=6789}
 for(let n=0;n<5;n++){const x=a.nightGenerate(),y=b.nightGenerate();assert.ok(x&&y);assert.deepEqual(a.s.night.board,b.s.night.board);assert.equal(a.s.rng,b.s.rng)}
});
const result={checked:new Date().toISOString(),checks:passed.length,passed,distribution,scope:'Explicit fixtures for rates, boundaries and paired 18000 draws per weather; fresh valid save round trip. Campaign reachability is separately checked by reference-tests.cjs.'};fs.writeFileSync(__dirname+'/weather-test-results.json',JSON.stringify(result,null,2));
