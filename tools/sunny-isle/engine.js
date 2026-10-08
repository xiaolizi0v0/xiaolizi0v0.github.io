(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./content.js'):root.SunnyContent);if(typeof module==='object'&&module.exports)module.exports=api;else root.SunnyEngine=api;})(typeof globalThis!=='undefined'?globalThis:this,function(C){
  'use strict';
  const DT=.25,VERSION=1;
  const copy=x=>JSON.parse(JSON.stringify(x));
  const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
  const alive=n=>n.owner!=='dead';
  function emit(s,kind,text,nid=-1,to=-1,amount=0){const e={id:++s.eventSeq,kind,text,nid,to,amount};s.events.push(e);if(s.events.length>32)s.events.shift();if(text){s.journal.unshift(text);s.journal.length=Math.min(12,s.journal.length);}}
  function stats(s){
    if(s.mode==='trial')return {attack:16,health:270,interval:.85,capacity:s.trial===3?2:5,gun:1,heal:1,shield:0,source:1,focus:.7,intercept:1,damping:0,clamp:0,reward:1,regen:0};
    const h=C.heroes.find(x=>x.id===s.hero)||C.heroes[0],r=s.research,m=new Set(s.equipped);
    return {attack:13*(1+r.attack*.12)*h.attack*(m.has('lens')?1.1:1)*(m.has('recycler')?.95:1),health:170*(1+r.vitality*.15)*h.health*(m.has('buckler')?1.2:1)*(m.has('prism')?.9:1),interval:1.05*h.interval/(1+r.haste*.05)/(m.has('metronome')?1.12:1),capacity:3+r.capacity+(m.has('prism')?1:0),gun:(1+r.amplify*.12)*(m.has('lens')?1.2:1),heal:(1+r.recovery*.1)*(m.has('tonic')?1.45:1),shield:r.shielding*.02,source:(1+r.source*.08)*(m.has('wire')?1.3:1),focus:.65+r.focus*.03,intercept:1-r.intercept*.04,damping:r.damping*.2,clamp:m.has('clamp')?8:0,reward:(1+r.recycling*.08)*(m.has('recycler')?1.25:1),regen:h.heal};
  }
  function used(s){return s.battle.nodes.filter(n=>n.owner==='ally').reduce((a,n)=>a+C.kinds[n.kind].slot,0);}
  function makeBattle(s,stage=s.stage,mode=s.mode){
    const spec=mode==='trial'?{layout:C.trials[s.trial].layout,island:0,local:0,boss:false}:C.stages[stage];
    const layout=C.layouts[spec.layout],scale=mode==='trial'?1.05:1+stage*.065;
    const nodes=layout.nodes.map(([kind,x,y],id)=>{const hp=C.kinds[kind].hp*scale*(spec.boss?1.22:1);return {id,kind,x,y,hp,max:hp,owner:'enemy',cooldown:kind==='core'?2.75:1.25+(id%3)*.5,deadAt:null,power:0};});
    const hp=stats(s).health;
    return {stage,mode,layout:spec.layout,island:spec.island,boss:spec.boss,nodes,edges:copy(layout.edges),elapsed:0,heroHP:hp,heroMax:hp,attackCD:.5,coreOverwrite:22,regenCD:18,stun:0,target:null,intent:null,result:null,wait:0,next:null,captures:0,destroyed:0,destroyedSources:0,sheltered:0,pulseHandled:0,damage:0};
  }
  function create(){const s={version:VERSION,credits:0,shards:0,highest:0,stage:0,mode:'campaign',trial:0,hero:'bell',policy:'balanced',research:Object.fromEntries(C.research.map(r=>[r.id,0])),owned:[],equipped:[],playing:true,advance:true,speed:1,carry:0,settings:{sound:false,haptics:false,motion:true},presets:[],trialRecords:{},stageRecords:{},badges:[],stats:{wins:0,losses:0,captures:0,destroyed:0,studies:0,challenges:0,offlineSeconds:0,damage:0,seconds:0},eventSeq:0,events:[],journal:[],farmWins:0,frontier:0,lastSeen:Date.now(),tutorial:0,battle:null};s.battle=makeBattle(s);return s;}
  // Each producer shares its finite output across reachable consumers. Dead parts break paths.
  function power(s){
    const b=s.battle,st=stats(s),nodes=b.nodes;for(const n of nodes)n.power=n.kind==='armor'&&alive(n)?1:0;
    for(const src of nodes){if(src.kind!=='source'||!alive(src))continue;const seen=new Set([src.id]),queue=[src.id];for(let i=0;i<queue.length;i++)for(const [a,z]of b.edges)if(a===queue[i]&&!seen.has(z)&&alive(nodes[z])){seen.add(z);queue.push(z);}
      const consumers=nodes.filter(n=>seen.has(n.id)&&alive(n)&&C.kinds[n.kind].demand>0&&(src.owner==='enemy'||n.owner==='ally'));
      const demand=consumers.reduce((v,n)=>v+C.kinds[n.kind].demand,0);let output=6*(src.owner==='ally'?st.source:1);
      if(b.island===5)output*=Math.floor(b.elapsed/10)%2?1.25:.65;
      const ratio=demand?output/demand:0;for(const n of consumers)n.power+=ratio;
    }
    for(const n of nodes)n.power=clamp(n.power,0,1);
    return nodes.map(n=>n.power);
  }
  function policy(s){return C.policies.find(p=>p.id===s.policy)||C.policies[0];}
  function automaticTarget(s){const b=s.battle,p=policy(s);let candidates=b.nodes.filter(n=>n.owner==='enemy');if(!candidates.length)return null;
    const core=b.nodes[0];const supports=b.nodes.filter(n=>n.owner==='enemy'&&n.kind==='shield'&&n.power>0);
    candidates.sort((a,z)=>{let ra=p.order.indexOf(a.kind),rz=p.order.indexOf(z.kind);if(s.policy==='balanced'){if(a.kind==='core'&&!supports.length)ra=1.4;if(z.kind==='core'&&!supports.length)rz=1.4;if(s.battle.heroHP<s.battle.heroMax*.4){if(a.kind==='repair')ra=-1;if(z.kind==='repair')rz=-1;}}return ra-rz||a.hp/a.max-z.hp/z.max||a.id-z.id;});
    return candidates[0]||core;
  }
  function target(s){const b=s.battle,n=b.nodes[b.target];return n&&n.owner==='enemy'?n:automaticTarget(s);}
  function wantCapture(s,n){if(n.kind==='core')return false;return s.battle.target===n.id&&s.battle.intent?s.battle.intent==='capture':policy(s).capture.includes(n.kind);}
  function armorFactor(s,n){const b=s.battle;let f=1;if(n.kind==='core')for(const x of b.nodes)if(x.owner==='enemy'&&x.kind==='shield')f*=1-.38*x.power;
    for(const x of b.nodes)if(x.owner==='enemy'&&x.kind==='armor'&&b.edges.some(([a,z])=>a===x.id&&z===n.id))f*=.6;
    return Math.max(.18,f);
  }
  function hit(s,n,amount,from=-1,canCapture=false){if(!n||n.owner!=='enemy'||s.battle.result)return;const b=s.battle,actual=Math.min(n.hp,amount*armorFactor(s,n));n.hp-=actual;b.damage+=actual;s.stats.damage+=actual;emit(s,'hit','',from,n.id,actual);
    if(n.hp>.00001)return;
    const cost=C.kinds[n.kind].slot;
    if(canCapture&&wantCapture(s,n)&&used(s)+cost<=stats(s).capacity){n.owner='ally';n.hp=n.max*stats(s).focus;n.cooldown=.5;b.captures++;s.stats.captures++;if(n.kind==='shield'||n.kind==='repair')b.sheltered++;if(n.kind==='pulse')b.pulseHandled++;emit(s,'capture',C.kinds[n.kind].name+'已接管：'+C.kinds[n.kind].ally,n.id);}
    else{n.owner='dead';n.hp=0;n.deadAt=b.elapsed;b.destroyed++;s.stats.destroyed++;if(n.kind==='source')b.destroyedSources++;if(n.kind==='pulse')b.pulseHandled++;emit(s,'break',C.kinds[n.kind].name+'已拆解',n.id);if(canCapture&&wantCapture(s,n)&&n.kind!=='core')emit(s,'capacity','容量不足，已改为拆解',n.id);}
    if(b.target===n.id){b.target=null;b.intent=null;}
  }
  function hurt(s,amount,from){const b=s.battle,st=stats(s);let reduction=0;for(const n of b.nodes)if(n.owner==='ally'){if(n.kind==='shield')reduction+=(.15+st.shield)*n.power;if(n.kind==='armor')reduction+=.08;}amount*=1-clamp(reduction,0,.72);b.heroHP=Math.max(0,b.heroHP-amount);emit(s,'hurt','',from,-1,amount);}
  function overwrite(s,source){const b=s.battle,ids=source===0?b.nodes.map(n=>n.id):b.edges.filter(([a])=>a===source).map(([,z])=>z);const n=b.nodes.filter(n=>n.owner==='ally'&&ids.includes(n.id)).sort((a,z)=>a.hp-z.hp)[0];if(n){n.owner='enemy';n.hp=n.max*.55;n.cooldown=1;emit(s,'overwrite',C.kinds[n.kind].name+'被雾潮夺回',n.id);}}
  function checkBadges(s){for(const a of C.achievements){const val=a.key==='highest'?s.highest:s.stats[a.key];if(val>=a.goal&&!s.badges.includes(a.id)){s.badges.push(a.id);s.shards+=a.reward;emit(s,'badge','成就：'+a.name+'，潮晶 +'+a.reward);}}}
  function trialSuccess(b,id){switch(C.trials[id].rule){case'capture':return b.captures>=2;case'sever':return b.captures===0&&b.destroyedSources>=1;case'shelter':return b.sheltered>=1;case'pulse':return b.pulseHandled>=1;case'mixed':return b.captures>=1&&b.destroyed>=1;default:return true;}}
  function finish(s,won){const b=s.battle;if(b.result)return;b.result=won?'won':'lost';b.wait=2;s.stats[won?'wins':'losses']++;let nextStage=s.stage,nextMode=s.mode;
    if(won){if(s.mode==='trial'){const valid=trialSuccess(b,s.trial);if(valid){const key=String(s.trial),old=s.trialRecords[key];if(!old){s.shards+=5;s.stats.challenges++;}if(!old||b.elapsed<old.time)s.trialRecords[key]={time:b.elapsed,captures:b.captures,destroyed:b.destroyed};emit(s,'win','试炼完成：'+C.trials[s.trial].name);}else emit(s,'trial','击破雾核，但尚未满足试炼条件');nextMode='campaign';nextStage=Math.min(47,s.highest);}
      else{const first=s.stage>=s.highest;s.credits+=Math.round(C.stages[s.stage].reward*stats(s).reward);if(first){s.highest=s.stage+1;s.shards+=C.stages[s.stage].shards;emit(s,'unlock',s.highest===48?'群岛全部复明，仍可训练与挑战':'前线推进：'+s.highest+'/48');}const record=s.stageRecords[s.stage];if(!record||b.elapsed<record.time)s.stageRecords[s.stage]={time:b.elapsed,captures:b.captures,destroyed:b.destroyed};if(s.mode==='farm'){s.farmWins++;if(s.advance&&s.farmWins>=3){nextMode='campaign';nextStage=Math.min(47,s.highest);s.farmWins=0;}}else if(s.advance)nextStage=Math.min(47,s.highest);emit(s,'win','交战胜利，暖光 +'+Math.round(C.stages[s.stage].reward*stats(s).reward));}}
    else{emit(s,'lose',s.mode==='trial'?'试炼未完成，返回前线':'暂时退回训练，成长后自动再挑战');nextMode=s.mode==='trial'?'campaign':'farm';nextStage=Math.max(0,Math.min(47,s.highest-1));s.frontier=s.highest;s.farmWins=0;}
    b.next={stage:nextStage,mode:nextMode};checkBadges(s);
  }
  function tick(s){if(!s.playing)return;const b=s.battle,st=stats(s);s.stats.seconds+=DT;
    if(b.result){b.wait-=DT;if(b.wait<=0){s.stage=b.next.stage;s.mode=b.next.mode;s.battle=makeBattle(s);}return;}
    b.elapsed+=DT;b.stun=Math.max(0,b.stun-DT);if(st.health!==b.heroMax){b.heroHP=clamp(b.heroHP+st.health-b.heroMax,1,st.health);b.heroMax=st.health;}
    if(st.regen)b.heroHP=Math.min(b.heroMax,b.heroHP+st.regen*DT*st.heal);power(s);b.attackCD-=DT;
    if(b.attackCD<=0){const n=target(s);if(n)hit(s,n,st.attack,-1,true);b.attackCD+=st.interval;}
    power(s);
    for(const n of b.nodes){if(!alive(n))continue;n.cooldown-=DT;if(n.cooldown>0)continue;let interval=2.4;
      if(n.kind==='core'){interval=3;if(b.stun<=0){const danger=1+b.stage*.035;const rage=1+Math.max(0,b.elapsed-90)/70;hurt(s,2.8*danger*rage*(b.island===1?1.3:1)*st.intercept,n.id);}}
      else if(n.kind==='gun'||n.kind==='bud'){interval=n.kind==='bud'?3.2:2.2;if(n.power>0){if(n.owner==='enemy')hurt(s,(n.kind==='bud'?6:7)*(1+b.stage*.027)*n.power,n.id);else hit(s,target(s),11*n.power*st.gun,n.id,false);}}
      else if(n.kind==='repair'){interval=2;if(n.power>0){if(n.owner==='enemy'){const injured=b.nodes.filter(x=>x.owner==='enemy'&&x.hp<x.max).sort((a,z)=>a.hp/a.max-z.hp/z.max)[0];if(injured){const heal=Math.min(injured.max-injured.hp,8*n.power);injured.hp+=heal;emit(s,'heal','',n.id,injured.id,heal);}}else{const heal=Math.min(b.heroMax-b.heroHP,10*n.power*st.heal);b.heroHP+=heal;if(heal>0)emit(s,'heal','',n.id,-1,heal);}}}
      else if(n.kind==='pulse'){interval=9;if(n.power>0){if(n.owner==='enemy')overwrite(s,n.id);else{b.stun=2*n.power+st.damping;emit(s,'suppress','蓝色潮铃压制雾核',n.id);}}}
      n.cooldown+=interval;
    }
    if(b.island===3){b.regenCD-=DT;if(b.regenCD<=0){const healer=b.nodes.find(n=>n.owner==='enemy'&&n.kind==='repair'&&n.power>0);const dead=b.nodes.find(n=>n.owner==='dead'&&n.kind!=='core'&&n.kind!=='source'&&n.kind!=='repair');if(healer&&dead){dead.owner='enemy';dead.hp=dead.max*.45;dead.cooldown=2;dead.deadAt=null;emit(s,'regrow','绒雨使'+C.kinds[dead.kind].name+'再生',dead.id);}b.regenCD=18;}}
    if(b.island===4){b.coreOverwrite-=DT;if(b.coreOverwrite<=0){overwrite(s,0);b.coreOverwrite=22+st.clamp;}}
    if(b.nodes[0].owner==='dead')finish(s,true);else if(b.heroHP<=0)finish(s,false);
  }
  function run(s,wallSeconds){if(!Number.isFinite(wallSeconds)||wallSeconds<0)throw Error('无效时间');if(!s.playing)return 0;const total=s.carry+wallSeconds*s.speed,steps=Math.floor((total+1e-9)/DT);s.carry=Math.max(0,total-steps*DT);for(let i=0;i<steps;i++)tick(s);return steps;}
  function cost(s,id){const r=C.research.find(x=>x.id===id);return r?Math.round(r.base*Math.pow(1.48,s.research[id])):Infinity;}
  function upgrade(s,id){const r=C.research.find(x=>x.id===id);if(!r||s.highest<r.unlock||s.research[id]>=r.max||s.credits<cost(s,id))return false;s.credits-=cost(s,id);s.research[id]++;s.stats.studies++;emit(s,'study',r.name+'提升到 '+s.research[id]+' 级');checkBadges(s);return true;}
  function buy(s,id){const m=C.modules.find(x=>x.id===id);if(!m||s.owned.includes(id)||s.highest<m.unlock||s.shards<m.cost)return false;s.shards-=m.cost;s.owned.push(id);emit(s,'module','获得器具：'+m.name);return true;}
  function equip(s,id){if(!s.owned.includes(id))return false;if(s.equipped.includes(id))s.equipped=s.equipped.filter(x=>x!==id);else{if(s.equipped.length>=(s.highest>=16?3:2))return false;s.equipped.push(id);}while(used(s)>stats(s).capacity){const n=s.battle.nodes.filter(x=>x.owner==='ally').at(-1);if(!n)break;release(s,n.id);}return true;}
  function setPolicy(s,id){if(!C.policies.some(p=>p.id===id))return false;s.policy=id;s.battle.target=null;s.battle.intent=null;emit(s,'policy','持久策略：'+policy(s).name);return true;}
  function select(s,id,intent){const n=s.battle.nodes[id];if(s.battle.result||!n||n.owner!=='enemy'||!['capture','destroy'].includes(intent)||n.kind==='core'&&intent==='capture')return false;s.battle.target=id;s.battle.intent=intent;emit(s,'order','指定'+(intent==='capture'?'接管':'拆解')+'：'+C.kinds[n.kind].name,id);return true;}
  function release(s,id){const n=s.battle.nodes[id];if(!n||n.owner!=='ally'||s.battle.result)return false;n.owner='dead';n.hp=0;n.deadAt=s.battle.elapsed;emit(s,'release',C.kinds[n.kind].name+'已释放，容量腾出',id);power(s);return true;}
  function launch(s,stage,mode='campaign',trial=0){if(!Number.isInteger(stage)||stage<0||stage>47||!['campaign','trial','farm'].includes(mode))return false;if(mode!=='trial'&&stage>Math.min(47,s.highest))return false;if(mode==='trial'&&(!C.trials[trial]||s.highest<8))return false;s.stage=stage;s.mode=mode;s.trial=trial;s.battle=makeBattle(s);s.carry=0;return true;}
  function setHero(s,id){if(!C.heroes.some(h=>h.id===id))return false;s.hero=id;return true;}
  function snapshot(s){return copy(s);}
  function restore(raw){if(typeof raw==='string'){if(raw.length>1000000)throw Error('存档过大');raw=JSON.parse(raw);}if(!raw||typeof raw!=='object'||raw.version!==VERSION)throw Error('不支持的存档版本');
    const s=copy(raw),number=(x,lo,hi,integer=false)=>{if(typeof x!=='number'||!Number.isFinite(x)||x<lo||x>hi||integer&&!Number.isInteger(x))throw Error('存档数值不合法');};
    number(s.highest,0,48,true);number(s.stage,0,47,true);number(s.credits,0,1e12);number(s.shards,0,1e9);number(s.carry,0,DT+.00001);number(s.lastSeen,0,1e15);number(s.speed,1,4,true);if(![1,2,4].includes(s.speed))throw Error('倍率不合法');
    if(!C.heroes.some(x=>x.id===s.hero)||!C.policies.some(x=>x.id===s.policy)||!['campaign','farm','trial'].includes(s.mode))throw Error('存档配置不合法');
    if(s.mode==='trial'&&!C.trials[s.trial])throw Error('试炼不合法');for(const r of C.research)number(s.research?.[r.id],0,r.max,true);
    if(!Array.isArray(s.owned)||!Array.isArray(s.equipped)||s.equipped.length>3||new Set(s.owned).size!==s.owned.length||new Set(s.equipped).size!==s.equipped.length||s.owned.some(id=>!C.modules.some(m=>m.id===id))||s.equipped.some(id=>!s.owned.includes(id)))throw Error('器具不合法');
    for(const key of ['wins','losses','captures','destroyed','studies','challenges','offlineSeconds','damage','seconds'])number(s.stats?.[key],0,1e12);for(const key of ['playing','advance'])if(typeof s[key]!=='boolean')throw Error('运行状态不合法');
    if(!s.settings||['sound','haptics','motion'].some(k=>typeof s.settings[k]!=='boolean'))throw Error('设置不合法');number(s.tutorial,0,20,true);number(s.eventSeq,0,1e12,true);number(s.farmWins,0,3,true);number(s.frontier,0,48,true);
    if(!Array.isArray(s.badges)||s.badges.some(id=>!C.achievements.some(a=>a.id===id))||!Array.isArray(s.presets)||s.presets.length>3)throw Error('收藏不合法');
    for(const p of s.presets)if(typeof p.name!=='string'||p.name.length>20||!C.policies.some(x=>x.id===p.policy)||!C.heroes.some(x=>x.id===p.hero)||!Array.isArray(p.equipped)||p.equipped.some(id=>!s.owned.includes(id)))throw Error('策略预设不合法');
    const b=s.battle,expected=makeBattle(s);if(!b||b.stage!==s.stage||b.mode!==s.mode||b.layout!==expected.layout||!Array.isArray(b.nodes)||b.nodes.length!==expected.nodes.length||JSON.stringify(b.edges)!==JSON.stringify(expected.edges))throw Error('战斗结构不合法');
    number(b.heroMax,1,1e6);number(b.heroHP,0,b.heroMax);number(b.elapsed,0,1e9);for(const key of ['attackCD','coreOverwrite','regenCD','stun','wait'])number(b[key],-DT,1e6);for(const key of ['captures','destroyed','destroyedSources','sheltered','pulseHandled','damage'])number(b[key],0,1e12);
    if(![null,'won','lost'].includes(b.result)||b.result&&(!b.next||!['campaign','farm','trial'].includes(b.next.mode)||!Number.isInteger(b.next.stage)||b.next.stage<0||b.next.stage>47))throw Error('结算不合法');
    if(b.target!==null&&(!Number.isInteger(b.target)||!b.nodes[b.target]))throw Error('目标不合法');if(![null,'capture','destroy'].includes(b.intent))throw Error('指令不合法');
    b.nodes.forEach((n,i)=>{const e=expected.nodes[i];if(n.id!==i||n.kind!==e.kind||n.x!==e.x||n.y!==e.y||n.max!==e.max||!['enemy','ally','dead'].includes(n.owner)||n.kind==='core'&&n.owner==='ally')throw Error('部件不合法');number(n.hp,0,n.max);number(n.cooldown,-DT,1e6);number(n.power,0,1);if(n.owner==='dead'&&n.hp!==0||n.owner!=='dead'&&n.hp<=0)throw Error('部件生命不合法');if(n.deadAt!==null)number(n.deadAt,0,b.elapsed);});
    if(used(s)>stats(s).capacity)throw Error('接管容量不合法');
    for(const [key,val]of Object.entries(s.stageRecords||{})){number(Number(key),0,47,true);number(val.time,0,1e9);number(val.captures,0,1e6);number(val.destroyed,0,1e6);}for(const [key,val]of Object.entries(s.trialRecords||{})){number(Number(key),0,5,true);number(val.time,0,1e9);number(val.captures,0,1e6);number(val.destroyed,0,1e6);}
    if(!Array.isArray(s.events)||s.events.length>32||!Array.isArray(s.journal)||s.journal.length>12||s.journal.some(t=>typeof t!=='string'||t.length>200))throw Error('日志不合法');
    s.events=s.events.filter(e=>e&&typeof e.kind==='string'&&Number.isFinite(e.id));return s;
  }
  return {DT,VERSION,create,stats,used,power,target,run,tick,cost,upgrade,buy,equip,setPolicy,select,release,launch,setHero,snapshot,restore,checkBadges,makeBattle,trialSuccess};
});
