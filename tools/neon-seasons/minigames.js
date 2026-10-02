(function(root,factory){const a=factory();if(typeof module==='object'&&module.exports)module.exports=a;else root.NSMini=a})(typeof window==='undefined'?globalThis:window,()=>{
'use strict';
function random(seed){let h=2166136261;for(const c of String(seed))h=Math.imul(h^c.charCodeAt(0),16777619);return()=>{h=(Math.imul(h,1664525)+1013904223)>>>0;return h/4294967296}}
const adjacent=(i,size)=>[i-size,i+size,i%size?i-1:-1,i%size<size-1?i+1:-1].filter(v=>v>=0&&v<size*size);
function create(type,seed){const r=random(seed),base={type,seed:String(seed),done:false,score:0,grade:0,won:false,paused:false};
 if(type===0)return{...base,board:Array(9).fill(0),moves:12,mode:'plant'};
 if(type===1)return{...base,elapsed:0,index:0,hits:0,perfect:0,combo:0,maxCombo:0,feedback:'等待光点进入刻度',beats:Array.from({length:10},(_,i)=>1.2+i*.8)};
 if(type===2){const turns=Math.floor(r()*4),rotate=index=>{for(let n=0;n<turns;n++)index=(index%5)*5+4-Math.floor(index/5);return index};return{...base,position:rotate(0),exit:rotate(24),moves:18,mail:[2,4,12,20,22].map(rotate),blocked:[6,8,16].map(rotate),visited:[],path:[rotate(0)]}}
 if(type===3){const board=[1,2,3,4,5,6,7,8,0],shuffle=[];let last=-1;for(let n=0;n<24;n++){const z=board.indexOf(0),choices=adjacent(z,3).filter(i=>i!==last),i=choices[Math.floor(r()*choices.length)];[board[z],board[i]]=[board[i],board[z]];shuffle.push(z);last=z}if(board.every((v,i)=>v===(i+1)%9)){[board[7],board[8]]=[board[8],board[7]];shuffle.push(8)}return{...base,board,moves:0,shuffle}}
 throw Error('unknown mini game');
}
function finish(s,won,score,grade){s.done=true;s.won=won;s.score=score;s.grade=grade}
function act(s,index,mode=null){if(s.done||s.paused)return false;
 if(s.type===0){if(!Number.isInteger(index)||index<0||index>8)return false;const action=mode??s.mode;if(!['plant','water','harvest'].includes(action))return false;
  if(action==='plant'){if(s.board[index])return false;s.board[index]=1}
  else if(action==='water'){const targets=[index,...adjacent(index,3)].filter(i=>s.board[i]>0&&s.board[i]<3);if(!targets.length)return false;targets.forEach(i=>s.board[i]++)}
  else if(action==='harvest'){if(s.board[index]!==3)return false;const row=Math.floor(index/3)*3,col=index%3;const lines=([0,1,2].every(i=>s.board[row+i]===3)?1:0)+([0,1,2].every(i=>s.board[col+i*3]===3)?1:0);s.score+=3+lines*6;s.board[index]=0}
  s.mode=action;
  if(--s.moves===0)finish(s,s.score>=8,s.score,s.score>=24?3:s.score>=16?2:s.score>=8?1:0);return true;
 }
 if(s.type===1){if(s.index>=10)return false;const delta=Math.abs(s.elapsed-s.beats[s.index]);if(delta>.26){s.feedback='提前了，等光点到中央';return false}s.hits++;s.combo++;s.maxCombo=Math.max(s.maxCombo,s.combo);s.score+=delta<=.12?2:1;if(s.combo%3===0)s.score++;if(delta<=.12){s.perfect++;s.feedback='PERFECT'}else s.feedback='GOOD';s.index++;return true}
 if(s.type===2){if(!adjacent(s.position,5).includes(index)||s.blocked.includes(index))return false;s.position=index;s.path.push(index);if(s.mail.includes(index)&&!s.visited.includes(index))s.visited.push(index);s.moves--;if(index===s.exit||s.moves===0)finish(s,index===s.exit,s.visited.length*5+(index===s.exit?s.moves:0),index===s.exit?(s.visited.length===5?3:s.visited.length>=3?2:1):0);return true}
 if(s.type===3){const z=s.board.indexOf(0);if(!adjacent(z,3).includes(index))return false;[s.board[z],s.board[index]]=[s.board[index],s.board[z]];s.moves++;if(s.board.every((v,i)=>v===(i+1)%9))finish(s,true,Math.max(10,100-s.moves),s.moves<=35?3:s.moves<=60?2:1);return true}
 return false;
}
function update(s,dt){if(s.type!==1||s.done||s.paused)return false;const before=s.index;s.elapsed+=Math.max(0,Math.min(.1,dt));while(s.index<10&&s.elapsed>s.beats[s.index]+.26){s.index++;s.combo=0;s.feedback='MISS'}if(s.elapsed>s.beats[9]+.4)finish(s,s.hits>=5,s.score,s.hits===10?3:s.hits>=8?2:s.hits>=5?1:0);return before!==s.index||s.done}
function valid(s){
 if(!s||!Number.isInteger(s.type)||s.type<0||s.type>3||typeof s.seed!=='string'||typeof s.done!=='boolean'||typeof s.paused!=='boolean'||typeof s.won!=='boolean'||!Number.isFinite(s.score)||s.score<0||!Number.isInteger(s.grade)||s.grade<0||s.grade>3)return false;
 const range=(xs,size,unique=false)=>Array.isArray(xs)&&xs.every(v=>Number.isInteger(v)&&v>=0&&v<size)&&(!unique||new Set(xs).size===xs.length);
 if(s.type===0)return range(s.board,4)&&s.board.length===9&&Number.isInteger(s.moves)&&s.moves>=0&&s.moves<=12&&['plant','water','harvest'].includes(s.mode);
 if(s.type===1)return Number.isFinite(s.elapsed)&&s.elapsed>=0&&Number.isInteger(s.index)&&s.index>=0&&s.index<=10&&['hits','perfect','combo','maxCombo'].every(k=>Number.isInteger(s[k])&&s[k]>=0&&s[k]<=10)&&s.hits<=s.index&&s.perfect<=s.hits&&s.combo<=s.maxCombo&&s.maxCombo<=s.hits&&Array.isArray(s.beats)&&s.beats.length===10&&s.beats.every((v,i)=>v===1.2+i*.8);
 if(s.type===2)return Number.isInteger(s.position)&&s.position>=0&&s.position<25&&Number.isInteger(s.exit)&&s.exit>=0&&s.exit<25&&Number.isInteger(s.moves)&&s.moves>=0&&s.moves<=18&&range(s.mail,25,true)&&s.mail.length===5&&range(s.blocked,25,true)&&s.blocked.length===3&&range(s.visited,25,true)&&s.visited.every(v=>s.mail.includes(v))&&range(s.path,25)&&s.path.length===19-s.moves&&s.path.at(-1)===s.position&&!s.blocked.includes(s.position)&&!s.blocked.includes(s.exit)&&!s.mail.some(v=>s.blocked.includes(v));
 return range(s.board,9,true)&&s.board.length===9&&Number.isInteger(s.moves)&&s.moves>=0&&range(s.shuffle,9);
}
return{create,act,update,valid,adjacent};
});
