// Mechanism research only. Deterministic spatial recordings; no product save or economy.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const dt=.1;
function record(){
 const frames=[];let x=-4;
 for(let t=0;t<40;t++){x=Math.min(4,x+.2);frames.push({t:t*dt,x,y:0,attack:t%5===0,power:6,radius:1.35});}
 return frames;
}
function run({layout='left',delay=0,mirror=false,clip=record(),duration=12}){
 const enemies=Array.from({length:6},(_,i)=>({x:(layout==='left'?-1:1)*(2.8+(i%2)*.3),y:(Math.floor(i/2)-1)*.5,hp:18,max:18,armored:layout==='right'}));
 let damage=0,miss=0,hits=0,pressure=0;const events=[];
 for(let step=0;step<Math.round(duration/dt);step++){
  const time=step*dt;
  // Armor opens at 3.0s. Arrival/formation is fixed and does not inspect chosen echo.
  for(const e of enemies)if(e.hp>0){e.x+=Math.sign(-e.x)*.005;pressure+=dt;}
  const frame=clip[Math.round((time-delay)/dt)];if(!frame||!frame.attack)continue;
  const x=mirror?-frame.x:frame.x;
  let n=0;for(const e of enemies){if(e.hp<=0||Math.hypot(e.x-x,e.y-frame.y)>frame.radius)continue;
   const q=Math.min(e.hp,frame.power*(e.armored&&time<3?.1:1));e.hp-=q;damage+=q;hits++;n++;
   events.push({time:Number(time.toFixed(1)),x:Number(x.toFixed(1)),damage:q});
  }
  if(!n)miss++;
 }
 return{layout,delay,mirror,damage:Number(damage.toFixed(3)),kills:enemies.filter(e=>e.hp<=1e-8).length,pressure:Number(pressure.toFixed(2)),hits,miss,events};
}
const clip=record(),variants={original:{delay:0,mirror:false},mirrored:{delay:0,mirror:true},delayed:{delay:3,mirror:false}};
const results={scope:'Recorded movement and attacks only; not evidence of fun or product completion',recordedFrames:clip.length,recordedAttacks:clip.filter(f=>f.attack).length,scenarios:{}};
for(const layout of ['left','right','rightOpen']){results.scenarios[layout]={};for(const[n,v]of Object.entries(variants))results.scenarios[layout][n]=run({layout,...v,clip});}
assert.ok(results.scenarios.left.original.damage>results.scenarios.left.delayed.damage*.9);
assert.ok(results.scenarios.right.delayed.damage>results.scenarios.right.mirrored.damage*2);
assert.ok(results.scenarios.left.original.damage>results.scenarios.right.original.damage);
assert.ok(results.scenarios.rightOpen.mirrored.damage>results.scenarios.rightOpen.original.damage);
assert.ok(results.scenarios.left.original.pressure<results.scenarios.left.delayed.pressure);
assert.deepEqual(run({clip}),run({clip:JSON.parse(JSON.stringify(clip))}));
results.boundaries=['One synthetic recorded path and two fixtures, not long-term balance','No realtime player action required','Echo uses recorded positions and hit ranges; misses are possible','Retiming changes armor interaction, not attack count or power','Time echoes already exist in published games; no global originality claim'];
fs.writeFileSync(__dirname+'/echo-combat-lab-results.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({frames:clip.length,attacks:results.recordedAttacks,scenarios:Object.fromEntries(Object.entries(results.scenarios).map(([k,v])=>[k,Object.fromEntries(Object.entries(v).map(([n,r])=>[n,{damage:r.damage,kills:r.kills,miss:r.miss}]))])),boundaries:results.boundaries},null,2));
