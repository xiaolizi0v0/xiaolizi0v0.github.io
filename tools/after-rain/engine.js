(function(root){
  'use strict';
  const Story=root.AfterRainStory||(typeof require==='function'?require('./story.js'):null);
  const clone=v=>JSON.parse(JSON.stringify(v));
  const keys=['duan','su','gu','zhou'];
  const projectKeys=['budget','material','consent','team'];
  function vars(){return{trust:Object.fromEntries(keys.map(k=>[k,0])),boundary:Object.fromEntries(keys.map(k=>[k,0])),project:{budget:5,material:0,consent:0,team:0},flags:{}};}
  function initial(){return{version:1,scene:Story.first,beat:0,vars:vars(),history:[],decisions:[],messages:[],met:[],minutes:0};}
  function cleanVars(raw){
    if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('存档中的剧情状态损坏');
    const out=vars();
    for(const group of ['trust','boundary','project'])for(const k of group==='project'?projectKeys:keys){const v=raw[group]?.[k];if(typeof v!=='number'||!Number.isFinite(v)||Math.abs(v)>1000)throw Error('存档中的关系或项目数据无效');out[group][k]=v;}
    if(!raw.flags||typeof raw.flags!=='object'||Array.isArray(raw.flags)||Object.keys(raw.flags).length>1000)throw Error('剧情标记无效');
    for(const [k,v] of Object.entries(raw.flags)){if(!/^[a-zA-Z][a-zA-Z0-9_-]{0,60}$/.test(k)||k==='constructor'||k==='prototype')throw Error('剧情标记名称无效');if(typeof v!=='boolean'&&!(typeof v==='string'&&v.length<100)&&!(typeof v==='number'&&Number.isFinite(v)))throw Error('剧情标记内容无效');out.flags[k]=v;}
    return out;
  }
  function validate(raw){
    if(!raw||raw.version!==1||!Story.scenes[raw.scene])throw Error('不是可读取的《心动在雨停之后》存档');
    const s=initial();s.scene=raw.scene;
    if(!Number.isInteger(raw.beat)||raw.beat<0||raw.beat>=Story.scenes[raw.scene].beats.length)throw Error('剧情位置无效');s.beat=raw.beat;s.vars=cleanVars(raw.vars);
    if(!Array.isArray(raw.decisions)||raw.decisions.length>1500)throw Error('选择记录无效');
    s.decisions=raw.decisions.map(d=>{const sc=Story.scenes[d.scene];if(!sc?.choices?.some(c=>c.id===d.choice))throw Error('选择记录不匹配');return{scene:d.scene,choice:d.choice};});
    if(!Array.isArray(raw.history)||raw.history.length>500)throw Error('回溯记录无效');
    s.history=raw.history.map(h=>{if(!Story.scenes[h.scene]||!Number.isInteger(h.decisions)||h.decisions<0||h.decisions>s.decisions.length)throw Error('回溯位置无效');return{scene:h.scene,vars:cleanVars(h.vars),decisions:h.decisions,messages:Array.isArray(h.messages)?h.messages.filter(id=>Story.scenes[id]?.messages):[],met:Array.isArray(h.met)?h.met.filter(k=>Story.characters[k]):[]};});
    s.messages=Array.isArray(raw.messages)?[...new Set(raw.messages.filter(id=>Story.scenes[id]?.messages))]:[];
    s.met=Array.isArray(raw.met)?[...new Set(raw.met.filter(k=>Story.characters[k]&&k!=='n'&&k!=='me'))]:[];
    s.minutes=typeof raw.minutes==='number'&&Number.isFinite(raw.minutes)?Math.max(0,Math.min(raw.minutes,100000)):0;
    return s;
  }
  function apply(state,effects={}){
    for(const group of ['trust','boundary','project'])for(const [key,n]of Object.entries(effects[group]||{})){if(!(key in state.vars[group])||!Number.isFinite(n))throw Error('脚本中的状态修改无效');state.vars[group][key]=Math.max(-50,Math.min(100,state.vars[group][key]+n));}
    Object.assign(state.vars.flags,effects.flags||{});
  }
  function available(choice,state){return!choice.when||Object.entries(choice.when).every(([key,value])=>state.vars.flags[key]===value);}
  function enter(state,id){
    const scene=Story.scenes[id];if(!scene)return{pending:true,id};
    state.scene=id;state.beat=0;
    state.history.push({scene:id,vars:clone(state.vars),decisions:state.decisions.length,messages:[...state.messages],met:[...state.met]});
    if(state.history.length>500)state.history.shift();
    for(const person of [...scene.actors,scene.beats[0].speaker])if(person!=='me'&&person!=='n'&&!state.met.includes(person))state.met.push(person);
    Object.assign(state.vars.flags,scene.flags||{});
    return{pending:false,id};
  }
  function start(){const state=initial();enter(state,state.scene);return state;}
  function advance(state){
    const scene=Story.scenes[state.scene];
    if(state.beat<scene.beats.length-1){state.beat++;const person=scene.beats[state.beat].speaker;if(person!=='me'&&person!=='n'&&!state.met.includes(person))state.met.push(person);return{beat:true};}
    Object.assign(state.vars.flags,scene.endFlags||{});if(scene.messages&&!state.messages.includes(scene.id))state.messages.push(scene.id);
    if(scene.choices)return{choices:scene.choices.filter(c=>available(c,state))};
    if(scene.ending)return{ending:scene.ending};
    const next=(scene.nextBy||[]).find(branch=>available(branch,state))?.next||scene.next;
    return enter(state,next);
  }
  function choose(state,id){
    const sc=Story.scenes[state.scene];if(state.beat!==sc.beats.length-1)throw Error('请先观看这一段剧情');
    const choice=sc.choices?.find(c=>c.id===id&&available(c,state));if(!choice)throw Error('这个选择暂时不可用');
    if(!Story.scenes[choice.next])return{pending:true,id:choice.next};
    state.decisions.push({scene:sc.id,choice:id});apply(state,choice.effects);return enter(state,choice.next);
  }
  function rewind(state,index){
    const h=state.history[index];if(!h)throw Error('这段剧情暂时不能回溯');
    const target=clone(h);state.vars=target.vars;state.decisions=state.decisions.slice(0,target.decisions);state.messages=target.messages;state.met=target.met;state.history=state.history.slice(0,index);return enter(state,target.scene);
  }
  root.AfterRainEngine={start,advance,choose,rewind,validate,clone,available};
  if(typeof module!=='undefined')module.exports=root.AfterRainEngine;
})(typeof window==='undefined'?globalThis:window);
