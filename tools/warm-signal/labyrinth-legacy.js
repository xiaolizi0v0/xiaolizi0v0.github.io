(function(root){'use strict';
const C=typeof module!=='undefined'&&module.exports?require('./labyrinth-content.js'):root.WarmLabyrinthContent;
const D=typeof module!=='undefined'&&module.exports?require('./content.js'):root.WarmData;
const CAP=1e7,int=(n,max=CAP)=>Number.isSafeInteger(n)&&n>=0&&n<=max,person=p=>Number.isInteger(p)&&p>=0&&p<6;
const DURATION=10*86400000,DICE_COST=500;
const openingFresh=()=>({rounds:0,started:0,ends:0,kind:null,closed:false,dice:0,bought:0,spent:0,months:[]});
const month=t=>{const d=new Date(t+3*3600000);return d.getUTCFullYear()*12+d.getUTCMonth();};
const fresh=()=>({version:2,serial:0,last:0,admission:null,opening:openingFresh(),mail:false,crystals:0,crystalsBought:0,draws:0,photos:0,photoEarned:0,photoSpent:0,earnedFragments:Array(6).fill(0),boughtFragments:Array(6).fill(0),invites:0,invitesFromShop:0,invitesUsed:0,gemRefills:0,refills:Array(5).fill(0),runs:Array(5).fill(0),stars:Array(5).fill(0),progress:0,coins:0,coinEarned:0,coinSpent:0,shop:C.goods.map(()=>0),history:[],stories:C.stories.map(()=>({cursor:0,done:false})),milestones:[]});
const card=p=>D.cards[120+p],fragmentCost=p=>card(p).rarity==='SSR'?32:9;
function pattern(values){const counts=[0,0,0,0];values.forEach(v=>counts[v]++);const sorted=counts.filter(Boolean).sort((a,b)=>b-a),kind=sorted[0]===4?'four':sorted[0]===3?'three':sorted[0]===2?(sorted[1]===2?'two-pairs':'pair'):'different';return{kind,extra:{four:60,three:25,'two-pairs':15,pair:10,different:0}[kind],own:counts[0]};}
function outcome(p,values){const r=pattern(values),ssr=card(p).rarity==='SSR';return{...r,photos:20+r.extra,fragments:r.own<2?0:r.own===2?1:r.own===3?(ssr?2:3):(ssr?5:6)};}
const unlocked=g=>g.s.main>=30,remaining=(s,i)=>5+s.refills[i]-s.runs[i];
function boost(g){let ssr=0,sr=0;for(let p=0;p<6;p++)if(g.own(120+p))card(p).rarity==='SSR'?ssr++:sr++;return{percent:135*ssr+35*sr,coins:2*ssr+sr,ssr,sr};}
const income=(g,i,n=1)=>{const b=boost(g),base=C.stages[i].base;return{progress:Math.floor(base*(100+b.percent)/100)*n,coins:(base+b.coins)*n};};
const sum=a=>a.reduce((n,v)=>n+v,0),array=(a,n,max=CAP)=>Array.isArray(a)&&a.length===n&&a.every(v=>int(v,max));
function active(g){const s=g.s.labyrinth,o=s.opening,t=g.now();return !!s.admission&&!o.closed&&t>=s.last&&t>=o.started&&t<o.ends;}
const exploring=g=>active(g)&&g.s.labyrinth.opening.kind==='premiere';
function diceAvailable(g){const s=g.s.labyrinth;return unlocked(g)&&g.now()>=s.last&&s.opening.months.at(-1)!==month(g.now())&&s.opening.months.length<1200&&s.serial<1e12;}
function openingValid(s){const o=s.opening;if(!o||!int(o.rounds)||!int(o.started,1e14)||!int(o.ends,1e14)||typeof o.closed!=='boolean'||!int(o.dice)||!int(o.bought)||!int(o.spent)||!Array.isArray(o.months)||o.months.length>1200||o.bought!==o.months.length||o.dice!==o.bought-o.spent||!o.months.every((m,i)=>int(m,1e6)&&m<=month(s.last)&&(!i||m>o.months[i-1])))return false;
 if(!s.admission)return o.rounds===0&&o.started===0&&o.ends===0&&o.kind===null&&!o.closed&&o.spent===0;
 return o.rounds>=1&&o.spent===o.rounds-1&&o.started>0&&o.started<=s.last&&o.ends-o.started===DURATION&&(o.rounds===1?o.kind==='premiere':o.kind==='rerun')&&(!o.closed||s.last>=o.ends);
}
function valid(s,state){
 if(s===undefined)return true;if(!s||![1,2].includes(s.version)||!int(s.serial,1e12)||!int(s.last,1e14)||!(s.version===1?[null,'medals','gems']:[null,'medals','gems','story']).includes(s.admission)||typeof s.mail!=='boolean'||s.version===1&&s.admission&&s.last+DURATION>1e14||s.version===2&&!openingValid(s))return false;
 for(const k of ['crystals','crystalsBought','draws','photos','photoEarned','photoSpent','invites','invitesFromShop','invitesUsed','gemRefills','progress','coins','coinEarned','coinSpent'])if(!int(s[k]))return false;
 if(!array(s.earnedFragments,6)||!array(s.boughtFragments,6)||!array(s.refills,5)||!array(s.runs,5)||!array(s.stars,5,3)||!array(s.shop,C.goods.length))return false;
 if(s.crystals!==s.crystalsBought-s.draws||s.photos!==s.photoEarned-s.photoSpent||s.coins!==s.coinEarned-s.coinSpent||s.invites!==(s.mail?180:0)+s.invitesFromShop-s.invitesUsed||sum(s.refills)!==s.invitesUsed+s.gemRefills)return false;
 if(s.photoEarned<20*s.draws||s.photoEarned>80*s.draws||sum(s.earnedFragments)>6*s.draws||s.photoSpent!==s.invitesFromShop*5+s.boughtFragments.reduce((v,n,p)=>v+n*fragmentCost(p),0)||s.coinSpent!==s.shop.reduce((v,n,i)=>v+n*C.goods[i].cost,0)||s.shop.some((n,i)=>n>C.goods[i].limit))return false;
 if(s.runs.some((n,i)=>n>5+s.refills[i]||Boolean(n)!==Boolean(s.stars[i])||i&&n&&!s.runs[i-1]))return false;
 const base=s.runs.reduce((v,n,i)=>v+n*C.stages[i].base,0),maxProgress=s.runs.reduce((v,n,i)=>v+n*Math.floor(C.stages[i].base*6.1),0);
 if(s.progress<base||s.progress>maxProgress||s.coinEarned<base||s.coinEarned>base+9*sum(s.runs))return false;
 if(!Array.isArray(s.history)||s.history.length!==Math.min(50,s.draws)||!s.history.every((h,i)=>h&&int(h.n)&&h.n===s.draws-i&&person(h.p)&&array(h.values,4,3)&&int(h.at,1e14)&&h.at<=s.last&&int(h.fragments,6)&&h.photos===outcome(h.p,h.values).photos&&h.fragments<=outcome(h.p,h.values).fragments&&(!i||h.at<=s.history[i-1].at)))return false;
 if(!Array.isArray(s.stories)||s.stories.length!==C.stories.length||!s.stories.every((r,i)=>r&&typeof r.done==='boolean'&&int(r.cursor,C.stories[i].lines.length-1)&&(!r.done||r.cursor===C.stories[i].lines.length-1)&&(!r.cursor&&!r.done||s.progress>=C.stories[i].need)))return false;
 if(!Array.isArray(s.milestones)||new Set(s.milestones).size!==s.milestones.length||!s.milestones.every(i=>Number.isInteger(i)&&C.milestones[i]&&s.progress>=C.milestones[i].need))return false;
 for(let p=0;p<6;p++){const source=s.earnedFragments[p]+s.boughtFragments[p],left=state.fragments[120+p]||0,used=source-left;if(used<0||used%card(p).fragmentNeed||used>0&&!(state.cards.find(c=>c.id===120+p)?.copies>=used/card(p).fragmentNeed)||source>card(p).fragmentNeed)return false;}
 if(!s.admission){const empty=fresh();if(Object.keys(empty).filter(k=>!['version','opening','serial','last'].includes(k)).some(k=>JSON.stringify(s[k])!==JSON.stringify(empty[k])))return false;if(s.version===1&&(s.serial||s.last)||s.version===2&&(s.opening.bought?(!s.serial||!s.last||state.main<30):(s.serial||s.last)))return false;}else if(!s.serial||!s.last||state.main<30)return false;
 return true;
}
const api={valid};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WarmLabyrinthLegacy=api;
})(typeof window==='undefined'?globalThis:window);
