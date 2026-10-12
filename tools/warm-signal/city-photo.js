(function(root){'use strict';
const singles=['自然站立','挥手','比个心','托腮','舒展双臂'],pairs=['并肩','一起挥手','一起比心','靠近一点'];
const stickers=[{name:'心意',symbol:'♡'},{name:'小花',symbol:'✿'},{name:'星光',symbol:'✧'},{name:'晴川邮戳',symbol:'晴川'},{name:'今日约定',symbol:'WITH YOU'},{name:'奶油相框',symbol:'▣'}];
const fresh=()=>({frame:'portrait',zoom:1,boy:0,girl:0,pair:0,npc:false,hearts:false,stickers:[]});
const clone=o=>JSON.parse(JSON.stringify(o)),number=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max,int=(v,max)=>Number.isInteger(v)&&v>=0&&v<=max;
function valid(o){return !!o&&Object.keys(o).length===8&&['portrait','landscape'].includes(o.frame)&&[.8,1,1.2].includes(o.zoom)&&int(o.boy,4)&&int(o.girl,4)&&int(o.pair,3)&&typeof o.npc==='boolean'&&typeof o.hearts==='boolean'&&Array.isArray(o.stickers)&&o.stickers.length<=8&&o.stickers.every(s=>s&&Object.keys(s).length===5&&int(s.type,5)&&number(s.x,.05,.95)&&number(s.y,.05,.95)&&number(s.scale,.5,1.8)&&number(s.angle,-Math.PI,Math.PI));}
function paint(ctx,w,h,list){for(const s of list){ctx.save();ctx.translate(s.x*w,s.y*h);ctx.rotate(s.angle);const size=Math.min(w,h)*.16*s.scale;ctx.scale(size,size);ctx.lineJoin='round';ctx.strokeStyle='#fff9ed';ctx.lineWidth=.065;ctx.fillStyle='#cc969f';
 if(s.type===0){ctx.beginPath();ctx.moveTo(0,.4);ctx.bezierCurveTo(-.9,-.1,-.3,-.85,0,-.35);ctx.bezierCurveTo(.3,-.85,.9,-.1,0,.4);ctx.closePath();ctx.stroke();ctx.fill();}
 else if(s.type===1){for(let i=0;i<5;i++){ctx.save();ctx.rotate(i*Math.PI*2/5);ctx.beginPath();ctx.ellipse(0,-.26,.18,.28,0,0,Math.PI*2);ctx.stroke();ctx.fill();ctx.restore();}ctx.fillStyle='#e9c98a';ctx.beginPath();ctx.arc(0,0,.15,0,7);ctx.fill();}
 else if(s.type===2){ctx.fillStyle='#d7b36e';ctx.beginPath();for(let i=0;i<8;i++){const r=i%2?.13:.5,a=i*Math.PI/4;ctx.lineTo(Math.sin(a)*r,-Math.cos(a)*r);}ctx.closePath();ctx.stroke();ctx.fill();}
 else if(s.type===3){ctx.fillStyle='#fff5e4';ctx.beginPath();ctx.arc(0,0,.5,0,7);ctx.fill();ctx.strokeStyle='#bd8e83';ctx.lineWidth=.025;ctx.beginPath();ctx.arc(0,0,.43,0,7);ctx.stroke();ctx.fillStyle='#aa786e';ctx.textAlign='center';ctx.font='bold .25px Microsoft YaHei';ctx.fillText('晴 川',0,-.04);ctx.font='.14px Georgia';ctx.fillText('WITH YOU',0,.2);}
 else if(s.type===4){ctx.fillStyle='#fff6e6';ctx.fillRect(-.8,-.28,1.6,.56);ctx.strokeStyle='#d4ad8e';ctx.lineWidth=.03;ctx.strokeRect(-.8,-.28,1.6,.56);ctx.fillStyle='#ae7c78';ctx.textAlign='center';ctx.font='bold .2px Georgia';ctx.fillText('WITH YOU',0,.03);ctx.fillStyle='#c7a77d';ctx.font='.14px Microsoft YaHei';ctx.fillText('把今天留给我们',0,.21);}
 else{ctx.strokeStyle='#fff8e8';ctx.lineWidth=.1;ctx.strokeRect(-.48,-.58,.96,1.16);ctx.strokeStyle='#d2ad8e';ctx.lineWidth=.025;ctx.strokeRect(-.44,-.54,.88,1.08);}
 ctx.restore();}}
const api={fresh,valid,clone,singles,pairs,stickers,paint};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WarmCityPhotography=api;
})(typeof window==='undefined'?globalThis:window);
