(function(root){'use strict';
const MAX=1e14,tasks=[
 {key:'gift',name:'送出一份礼物',need:1,moon:5},
 {key:'explore',name:'探索三件家具',need:3,moon:5},
 {key:'plant',name:'收获一次窗边绿植',need:1,moon:10},
 {key:'call',name:'和她互动三次',need:3,moon:5},
 {key:'silver',name:'从绿植、探索或记事收集银币',need:120,moon:5},
 {key:'moon',name:'从探索或记事收集月光石',need:4,moon:5},
 {key:'job',name:'领取一项小屋记事',need:1,moon:5},
 {key:'jobSR',name:'领取两项SR小屋记事',need:2,moon:10}
],keys=tasks.map(t=>t.key),byKey=Object.fromEntries(tasks.map(t=>[t.key,t])),legacy=['gift','explore','plant'];
function choose(date){let seed=2166136261;for(const c of 'warm-cottage-memo:'+date)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;const list=[...keys];for(let i=list.length-1;i>0;i--){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;const j=(seed>>>0)%(i+1);[list[i],list[j]]=[list[j],list[i]];}return list.slice(0,3);}
const counts=()=>Object.fromEntries(keys.map(k=>[k,0]));
function migrate(d){if(d.tasks===undefined){d.tasks=[...legacy];d.memoLegacy=true;}for(const k of keys)if(d.counts[k]===undefined)d.counts[k]=0;}
function valid(d){if(d.tasks===undefined)return true;if(typeof d.memoLegacy!=='boolean'||!Array.isArray(d.tasks)||d.tasks.length!==3||!d.tasks.every((k,i)=>k===(d.memoLegacy?legacy:choose(d.date))[i]))return false;return keys.every(k=>Number.isSafeInteger(d.counts[k])&&d.counts[k]>=0&&d.counts[k]<=MAX)&&Object.keys(d.counts).length===keys.length&&d.claims.every(k=>d.tasks.includes(k)&&d.counts[k]>=byKey[k].need);}
function add(d,key,amount=1){if(Number.isSafeInteger(amount)&&amount>0)d.counts[key]=Math.min(MAX,(d.counts[key]||0)+amount);}
const api={tasks,keys,byKey,legacy,choose,counts,migrate,valid,add};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WarmCottageMemo=api;
})(typeof window==='undefined'?globalThis:window);
