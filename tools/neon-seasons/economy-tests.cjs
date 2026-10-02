'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),C=require('./reference-activities.js'),D=require('./reference-content.js');
const copy=v=>JSON.parse(JSON.stringify(v)),passed=[];let transactions=0;
function fresh(seed='economy'){let now=new Date(2026,9,1,8).getTime();const g=new C.Game({seed,clock:()=>now});g.dismissScene();return{g,clock:()=>now,wait(ms){now+=ms;g.tick()}}}
function test(name,fn){fn();passed.push(name);console.log('PASS '+name)}
function put(g,n,chain,level){g.s.board[n]=g.make(chain,level);g.discover(g.s.board[n]);return g.s.board[n]}
function restored(g,clock){const r=C.Game.restore(g.serialize(),{clock});assert.ok(r,'valid economic checkpoint');return r}
test('six daily meals charge exact offers, reject seventh atomically and reset by local day',()=>{
 const {g,wait,clock}=fresh();g.s.coins=2000;let spent=0;
 for(const price of [60,80,120,180,260,360]){assert.equal(g.energyOffer.price,price);const before=g.s.energy;assert.ok(g.buy('energy'));assert.equal(g.s.energy,before+100);spent+=price;assert.equal(g.s.coins,2000-spent);restored(g,clock)}
 const before=copy(g.s);assert.equal(g.energyOffer.remaining,0);assert.equal(g.energyOffer.price,null);assert.equal(g.buy('energy'),false);assert.deepEqual(g.s,before);
 wait(86400000);assert.equal(g.s.energyBuys,0);assert.equal(g.energyOffer.remaining,6);assert.ok(g.buy('energy'));assert.equal(g.s.coins,before.coins-60);restored(g,clock);
});
test('insufficient coins and inherited property shop IDs cannot change state',()=>{
 const {g}=fresh();g.s.coins=59;const before=copy(g.s);for(const id of ['energy','constructor','toString','__proto__','free-money']){assert.equal(g.buy(id),false);assert.deepEqual(g.s,before)}
});
test('old same-day unlimited meal count remains loadable, does not grant six additional meals',()=>{
 const {g,clock,wait}=fresh();g.s.energyBuys=2471;let r=restored(g,clock);assert.equal(r.s.energyBuys,2471);assert.equal(r.buy('energy'),false);g.s=r.s;wait(86400000);assert.equal(g.energyOffer.remaining,6);restored(g,clock);
});
test('actual purchased joker and scissors transactions cannot exceed selling the original goods',()=>{
 for(const chain of [...D.chains,...D.extraChains])for(let level=1;level<=chain.names.length;level++){
  const {g,clock}=fresh(chain.id+level);g.s.coins=10000;const i=put(g,3,chain.id,level),baseline=g.saleValue(i),coins=g.s.coins;
  if(level<chain.names.length){assert.ok(g.buy('joker'));if(g.tool('joker',3)){assert.ok(g.sell(3,true));assert.ok(g.s.coins-coins<baseline,'joker arbitrage '+chain.id+level);transactions++;restored(g,clock)}}
  const f=fresh('scissors'+chain.id+level),h=f.g;h.s.coins=10000;put(h,3,chain.id,level);const sellOriginal=h.saleValue(h.s.board[3]),start=h.s.coins;assert.ok(h.buy('scissors'));
  if(h.tool('scissors',3)){const ids=h.s.board.filter(x=>x?.chain===chain.id&&x.level===level-1&&x.uid>=h.s.board[3].uid).map(x=>x.uid);assert.equal(ids.length,2);for(const uid of ids){assert.ok(h.sell(h.s.board.findIndex(x=>x?.uid===uid),true))}assert.ok(h.s.coins-start<sellOriginal,'scissors arbitrage '+chain.id+level);transactions++;restored(h,f.clock)}
 }
});
test('new resale and original-price legacy buyback survive saves without minting coins',()=>{
 const {g,clock}=fresh();put(g,3,'tool',12);let coins=g.s.coins;assert.ok(g.sell(3,true));assert.equal(g.s.coins-coins,152);const uid=g.s.sold.item.uid;let r=restored(g,clock);assert.ok(r.buyback());assert.equal(r.s.coins,coins);assert.equal(r.s.board.find(i=>i?.uid===uid).level,12);
 assert.ok(r.sell(r.s.board.findIndex(i=>i?.uid===uid),true));r.s.sold.price=4096;r.s.coins=5000;let old=restored(r,clock);assert.ok(old.buyback());assert.equal(old.s.coins,904);assert.ok(old.sell(old.s.board.findIndex(i=>i?.uid===uid),true));assert.equal(old.s.coins,1056);
 const bad=old.serialize();bad.sold.price=999;assert.equal(C.Game.restore(bad,{clock}),null);
});
test('max producers fill board and max warehouse: free parking restores play without deleting or duplicating items',()=>{
 const {g,clock}=fresh();g.s.coins=0;g.s.capacity=48;g.s.board.fill(null);g.s.inventory=[];
 for(let n=0;n<g.unlocked;n++)put(g,n,'producer0',7);for(let n=0;n<48;n++){const i=g.make('producer0',7);g.discover(i);g.s.inventory.push(i)}
 assert.equal(g.empty(),-1);assert.equal(g.store(0),false);assert.equal(g.sell(0,true),false);assert.equal(g.move(0,1).type,'swap');assert.equal(g.empty(),-1);assert.equal(g.produce(1).ok,false);
 const all=()=>[...g.s.board,...g.s.inventory,...g.s.inbox].filter(Boolean).map(i=>copy(i)).sort((a,b)=>a.uid-b.uid),before=all(),stock=copy(g.s.board[0]),rng=g.s.rng,energy=g.s.energy;
 assert.ok(g.parkProducer(0));assert.equal(g.empty(),0);assert.equal(g.s.coins,0);assert.equal(g.s.rng,rng);assert.equal(g.s.energy,energy);assert.deepEqual(all(),before);restored(g,clock);
 assert.ok(g.parkProducer(0,'inventory'));assert.equal(g.s.inventory.length,47);assert.deepEqual(all(),before);restored(g,clock);
 assert.ok(g.claimInbox(g.s.inbox.findIndex(i=>i.uid===stock.uid)));assert.deepEqual(g.s.board[0],stock);assert.ok(g.parkProducer(0));assert.ok(g.produce(1).ok);restored(g,clock);
});
test('parking is limited to unblocked producer parts and instances, invalid requests are inert',()=>{
 const {g,clock}=fresh();const part=copy(g.s.board[1]);assert.ok(g.parkProducer(1));assert.ok(g.s.inbox.some(i=>i.uid===part.uid));assert.equal(g.s.discovered.filter(id=>id==='producer0:1').length,1);restored(g,clock);
 for(const args of [[7],[-1],[999],[1,'unknown'],[1.5]]){const before=copy(g.s);assert.equal(g.parkProducer(...args),false);assert.deepEqual(g.s,before)}
 put(g,3,'producer0',7).web=true;const before=copy(g.s);assert.equal(g.parkProducer(3),false);assert.deepEqual(g.s,before);
});
const result={checked:new Date().toISOString(),checks:passed.length,transactions,passed,scope:'Fixtures cover limits, transactions and all-max-producer deadlock. Normal 72 renovations and 528-item runs are separate.'};
fs.writeFileSync(__dirname+'/economy-test-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
