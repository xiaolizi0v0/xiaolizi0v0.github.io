(async function(){
'use strict';
const S=window.AfterRainStory,E=window.AfterRainEngine,$=id=>document.getElementById(id),base='after-rain/';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storage=new URLSearchParams(location.search).has('review')?'after-rain-review-v1':'after-rain-v1';
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(storage+'-'+key))??fallback;}catch{return fallback;}};
let diskError=false;
function write(key,value){try{localStorage.setItem(storage+'-'+key,JSON.stringify(value));return true;}catch{if(!diskError){diskError=true;toast('浏览器无法保存进度。请在存档页导出备份。');}return false;}}
let state=null;try{const saved=read('auto',null);if(saved)state=E.validate(saved);}catch{toast('自动存档暂时无法读取，手动存档仍保留。');}
let meta=read('memories',{});if(!meta||typeof meta!=='object'||Array.isArray(meta))meta={};
meta={read:[...new Set((Array.isArray(meta.read)?meta.read:[]).filter(id=>Object.values(S.scenes).some(s=>s.beats.some(b=>b.id===id))))],scenes:[...new Set((Array.isArray(meta.scenes)?meta.scenes:[]).filter(id=>S.scenes[id]))],endings:Array.isArray(meta.endings)?meta.endings.filter(id=>typeof id==='string'):[]};
let settings=read('settings',{});if(!settings||typeof settings!=='object')settings={};settings={voice:Math.max(0,Math.min(1,Number.isFinite(settings.voice)?settings.voice:.85)),textSpeed:['slow','normal','instant'].includes(settings.textSpeed)?settings.textSpeed:'normal',reduced:!!settings.reduced,large:!!settings.large};
let slots=read('slots',[null,null,null]);if(!Array.isArray(slots)||slots.length!==3)slots=[null,null,null];
let voices={},videos={},playing=false,auto=false,skip=false,revealed=0,elapsed=0,voiceFinished=true,videoFinished=true,readAtEntry=false,voice=null,token=0,panelType='',toastTimer=0,lastFrame=performance.now();
const panel=$('panel');const beat=()=>state&&S.scenes[state.scene].beats[state.beat];const scene=()=>state&&S.scenes[state.scene];
function toast(text){$('toast').textContent=text;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3500);}
function stopMedia(){token++;if(voice){voice.pause();voice.onended=null;voice=null;}$('shot').pause();$('shot').removeAttribute('src');$('shot').load();}
function autosave(){if(state)write('auto',state);write('memories',meta);}
function configure(){document.documentElement.classList.toggle('reduced',settings.reduced);$('subtitle').style.fontSize=settings.large?'17px':'';write('settings',settings);if(voice)voice.volume=settings.voice;$('shot').volume=settings.voice;}
function remember(markRead=false){if(!beat())return;const b=beat();if(markRead&&!meta.read.includes(b.id))meta.read.push(b.id);if(!meta.scenes.includes(state.scene))meta.scenes.push(state.scene);}
function showHome(){playing=false;stopMedia();autosave();$('home').hidden=false;$('player').hidden=true;$('continue').disabled=false;$('continue').innerHTML=(state?'继续这段故事':'开始这段故事')+' <span>→</span>';}
function showPlayer(){playing=true;$('home').hidden=true;$('player').hidden=false;renderBeat();}
function newStory(){if(state)write('previous',state);state=E.start();auto=false;skip=false;showPlayer();autosave();}
function renderBeat(){
  stopMedia();const sc=scene(),b=beat();if(!sc||!b)return;readAtEntry=meta.read.includes(b.id);
  const ch=S.chapters.find(c=>c.id===sc.chapter);$('chapter-label').textContent='第 '+sc.chapter+' 章 · '+ch.title;$('scene-title').textContent=sc.title;$('location').textContent=sc.place;
  $('background').src=base+'assets/'+sc.background+'-portrait.png';$('background').alt=sc.place;
  $('speaker').textContent=S.characters[b.speaker].name||'心里的声音';$('speaker').style.color=S.characters[b.speaker].color;
  const actorKey=['duan','su','gu','zhou','xi','lin'].includes(b.speaker)?b.speaker:(sc.actors||[]).find(k=>['duan','su','gu','zhou','xi','lin'].includes(k));
  $('actor').hidden=!actorKey;if(actorKey){$('actor').src=base+'assets/'+actorKey+'.png';$('actor').alt=S.characters[actorKey].name;}
  $('choices').hidden=true;$('choices').replaceChildren();$('advance').disabled=false;revealed=settings.textSpeed==='instant'?b.text.length:0;elapsed=0;voiceFinished=false;$('subtitle').textContent=b.text.slice(0,revealed);$('advance-hint').textContent='轻触继续 ◇';$('beat-progress').style.width=(state.beat+1)/sc.beats.length*100+'%';
  $('auto').setAttribute('aria-pressed',String(auto));$('skip').setAttribute('aria-pressed',String(skip));
  const current=token,approved=videos[b.id]?.approved&&videos[b.id].clips?.[0],v=voices[b.id];
  videoFinished=!approved;$('shot').hidden=!approved;$('background').hidden=!!approved;if(approved){$('actor').hidden=true;$('shot').src=base+approved.file;$('shot').volume=settings.voice;$('shot').onended=()=>{if(token===current){videoFinished=true;if(approved.audio)voiceFinished=true;}};$('shot').onerror=()=>{if(token===current){$('shot').hidden=true;$('background').hidden=false;toast('这段视频未能载入，已保留字幕进度。');voiceFinished=true;videoFinished=true;}};const result=$('shot').play();result?.catch(()=>{if(current===token)toast('轻触画面开始播放视频。');});}
  $('media-status').textContent=approved?'':(v?'视频演出制作中':'配音与视频制作中');
  if(v&&!approved?.audio){voice=new Audio(base+v.file);voice.volume=settings.voice;voice.onended=()=>{if(current===token)voiceFinished=true;};voice.onerror=()=>{if(current===token){voiceFinished=true;toast('配音未能载入，可以继续阅读。');}};voice.play().catch(()=>{if(current===token){voiceFinished=true;toast('轻触画面可继续，或在设置中调整音量。');}});}else if(!approved){voiceFinished=true;}
  remember();autosave();
}
function next(){
  if(!playing||panel.open)return;const b=beat();
  if(revealed<b.text.length){revealed=b.text.length;$('subtitle').textContent=b.text;remember(true);return;}remember(true);
  const result=E.advance(state);if(result.choices){voice?.pause();$('shot').pause();showChoices(result.choices);return;}
  if(result.pending){auto=false;skip=false;stopMedia();openPanel('pending');return;}
  if(result.ending){if(!meta.endings.includes(result.ending))meta.endings.push(result.ending);openPanel('album');autosave();return;}
  renderBeat();
}
function showChoices(options){
  $('choices').hidden=false;$('advance').disabled=true;$('advance-hint').textContent='选择你想说的话';
  $('choices').innerHTML=options.map((c,i)=>`<button class="choice" data-choice="${esc(c.id)}" style="animation-delay:${i*70}ms"><span class="choice-label"><em>0${i+1}</em>${esc(c.text)}</span>${c.note?'<small>'+esc(c.note)+'</small>':''}</button>`).join('');
  $('choices').querySelectorAll('[data-choice]').forEach(btn=>btn.onclick=()=>{try{const r=E.choose(state,btn.dataset.choice);if(r.pending){openPanel('pending');return;}renderBeat();}catch(err){toast(err.message);}});
}
function openPanel(type){
  panelType=type;voice?.pause();$('shot').pause();const data={branches:['STORY FLOW','故事分支'],relationships:['THE PEOPLE AROUND YOU','人物关系'],history:['PREVIOUSLY','台词与回看'],phone:['YOUR LITTLE WORLD','予晴的手机'],album:['MOMENTS TO KEEP','回忆册'],saves:['SAVE YOUR STORY','存档与备份'],settings:['MAKE YOURSELF COMFORTABLE','演出设置'],pending:['TO BE CONTINUED','下一章正在制作'],new:['ANOTHER BEGINNING','开始新的旅程']};
  const [caption,title]=data[type]||data.settings;$('panel-caption').textContent=caption;$('panel-title').textContent=title;
  renderPanel(type);if(!panel.open)panel.showModal();$('panel-content').scrollTop=0;
}
function closePanel(){panel.close();panelType='';if(playing){if(voice&&!voiceFinished)voice.play().catch(()=>{});if(!$('shot').hidden)$('shot').play().catch(()=>{});}}
function button(text,attributes=''){return`<button class="action" ${attributes}>${text}</button>`;}
function renderPanel(type){
  let html='';
  if(type==='branches'){
    html='<p class="intro">已经走过的场景可以回溯。回溯会恢复当时的关系、承诺与项目进度，已读和回忆仍然保留。</p>';
    html+=S.chapters.map(ch=>{const nodes=Object.values(S.scenes).filter(s=>s.chapter===ch.id),written=nodes.length,unlocked=nodes.filter(s=>meta.scenes.includes(s.id));return`<div class="card chapter-card ${!unlocked.length?'locked':''}"><h3>${ch.id.padStart(2,'0')} · ${esc(ch.title)}</h3><p>${esc(ch.subtitle)}</p>${written?nodes.map((s,i)=>{const at=state?.history.map(h=>h.scene).lastIndexOf(s.id)??-1;return`<button class="branch-row" data-rewind="${at}" ${at<0?'disabled':''}><span class="step">${String(i+1).padStart(2,'0')}</span><div><b>${meta.scenes.includes(s.id)?esc(s.title):'尚未走到的场景'}</b><small>${meta.scenes.includes(s.id)?esc(s.place):'完成前面的故事后揭晓'}</small></div><span class="branch-arrow">${at>=0?'↶':'·'}</span></button>`;}).join(''):'<small>后续章节制作中</small>'}</div>`;}).join('');
  }else if(type==='relationships'){
    html='<p class="intro">你们如何认识、哪些约定已经发生，会随着故事更新。亲密关系需要双方选择。</p>';
    const people=['duan','su','gu','zhou','xi','qiao','lin'];html+=people.map(key=>{const c=S.characters[key],met=state?.met.includes(key),facts=[];if(key==='duan'){if(state?.vars.flags.askedDuan)facts.push('他允许你拍背影，正脸需要另行确认');if(state?.vars.flags.sharedUmbrella)facts.push('你们一起在雨棚里等雨变小');}if(key==='zhou'){if(state?.vars.flags.testedMap)facts.push('你认真测试了他的地图，也说出了想保留的部分');if(state?.vars.flags.mapTomorrow)facts.push('明天两点，约好半小时的测试');}if(key==='gu'){if(state?.vars.flags.interviewExit)facts.push('一起为参与者设计了退出方式');if(state?.vars.flags.guBoundary)facts.push('你表达了边界，他认真听完');}if(key==='xi'&&state?.vars.flags.admittedPast)facts.push('你承认了旧项目中自己的责任');return`<div class="card">${met&&['duan','su','gu','zhou','xi','lin'].includes(key)?'<img class="avatar" src="'+base+'assets/'+key+'.png" alt="">':''}<h3>${met?esc(c.name):'尚未相识'}</h3><small>${met?esc(c.age+'岁 · '+c.role):'一段还未发生的关系'}</small><p>${met?esc(c.bio):'在故事中认识这位角色。'}</p>${facts.map(f=>'<p class="facts">◇ '+esc(f)+'</p>').join('')}</div>`;}).join('');
  }else if(type==='history'){
    if(!state)html='<p class="empty">开始故事后，这里会留下已经说过的话。</p>';else html='<p class="intro">当前场景已读台词。场景回溯在故事分支页。</p>'+scene().beats.slice(0,state.beat+1).map(b=>`<div class="log-line"><b>${esc(S.characters[b.speaker].name||'旁白')}</b><p>${esc(b.text)}</p></div>`).join('');
  }else if(type==='phone'){
    const times={'c1-arrival':'19:20','c1-foyer':'19:35','c1-screening':'20:00','c1-backup':'21:05','c1-night-walk':'22:10','c1-contact':'23:18'};const clock=state?(scene().clock||times[state.scene]||'20:15'):'19:20';
    const day=state&&scene().chapter==='2'?'七月 · 返城第二天':'七月的第一个雨夜';
    html='<div class="phone-clock">'+clock+'</div><p class="phone-date">澄海 · '+day+'</p><div class="panel-tabs"><button data-phone-tab="messages" class="active">消息</button><button data-phone-tab="notes">摄影笔记</button><button data-phone-tab="calendar">通告</button></div><div id="phone-view"></div>';
  }else if(type==='album'){
    html='<p class="intro">走过的瞬间和看过的结局，会保存在这里。</p><div class="card"><img class="album-cover" src="'+base+'assets/cover-portrait.png" alt="海声影院的伙伴们"><h3>一座城市，几种去留</h3><p>予晴与海声影院的最后一个营业月。</p></div>';
    const memories=[['askedDuan','一个镜头的许可','你问了，他也给出了自己的范围。'],['sharedUmbrella','各自的一半','同一把伞下，给彼此留出位置。'],['testedMap','保留空白','地图上的第三条反馈。'],['interviewExit','可以说停的人','把结束采访的决定交还给参与者。']];
    html+=memories.filter(([flag])=>state?.vars.flags[flag]).map(([,title,text])=>`<div class="card"><h3>◇ ${title}</h3><p>${text}</p></div>`).join('');html+='<div class="card"><h3>结局收藏</h3><p>'+ (meta.endings.length?meta.endings.map(esc).join('、'):'尚未到达结局。继续走过你们的故事。')+'</p></div>';
  }else if(type==='saves'){
    html='<p class="intro">每次推进都会自动保存。手动存档可保留不同选择；导入前会检查故事版本与状态。</p>';
    html+=slots.map((slot,i)=>`<div class="card save-card"><h3>存档 ${i+1}</h3><p>${slot&&S.scenes[slot.state?.scene]?esc(S.scenes[slot.state.scene].title)+' · '+esc(slot.time):'空存档'}</p>${button(slot?'覆盖此存档':'保存当前进度','data-save="'+i+'" '+(!state?'disabled':''))}${button('读取','data-load="'+i+'" '+(!slot?'disabled':''))}</div>`).join('');
    html+=button('导出当前进度','id="export-save" '+(!state?'disabled':''))+button('选择备份文件','id="import-save"')+'<input type="file" id="save-file" accept="application/json,.json" hidden><textarea class="import-text" id="save-text" placeholder="也可以在这里粘贴备份文字" aria-label="存档备份文字"></textarea>'+button('读取备份文字','id="import-text"');
  }else if(type==='settings'){
    html=`<p class="intro">自动模式跟随实际对白时长。已读跳过只跳过看过的台词，遇到选择会停下。</p><label class="setting"><span>配音音量<small>真实音频，支持随时手动推进</small></span><input type="range" id="voice-volume" min="0" max="1" step=".05" value="${settings.voice}"></label><label class="setting"><span>字幕显示</span><select id="text-speed"><option value="slow">缓慢出现</option><option value="normal">正常出现</option><option value="instant">立即显示</option></select></label><label class="setting"><span>大字字幕</span><input type="checkbox" id="large-text" ${settings.large?'checked':''}></label><label class="setting"><span>减弱动效<small>关闭界面与装饰运动</small></span><input type="checkbox" id="reduce-motion" ${settings.reduced?'checked':''}></label><p class="intro" style="margin-top:20px">键盘：空格推进，A自动，Escape关闭页面。视频会在切换页面或离开浏览器时暂停。</p>`;
  }else if(type==='pending'){
    const next=S.chapters.find(c=>Number(c.id)===Number(scene().chapter)+1);
    html='<p class="intro">后续剧情及正式视频演出仍在制作。你刚才的选择和关系状态已经保存，这里不会将未完成的故事记为通关。</p><div class="card"><h3>'+esc(next?'第 '+next.id+' 章 · '+next.title:'后续故事')+'</h3><p>'+esc(next?.subtitle||'你的故事会继续。')+'</p></div>'+button('回到主菜单','id="back-home"')+button('回溯其他选择','data-open="branches"');
  }else if(type==='new'){
    html='<p class="intro">重新开始会开启新的自动进度，手动存档和已读回忆会保留。上一次的自动进度也会保留一份备份。</p>'+button('开始新的旅程','id="confirm-new"')+button('先保存当前进度','data-open="saves"');
  }
  $('panel-content').innerHTML=html;bindPanel(type);
}
function phoneView(tab){
  document.querySelectorAll('[data-phone-tab]').forEach(b=>b.classList.toggle('active',b.dataset.phoneTab===tab));const v=$('phone-view');
  if(tab==='messages'){const messages=(state?.messages||[]).flatMap(id=>S.scenes[id].messages);v.innerHTML=messages.length?messages.map((m,i)=>`<div class="message"><b>${esc(S.characters[m.person].name)}</b><div class="bubble">${esc(m.text)}</div>${state.vars.flags['reply'+i]?'<div class="bubble reply">'+esc(m.reply)+'</div>':button('回复','data-reply="'+i+'"')}</div>`).join(''):'<p class="empty">晚上工作结束后，会收到伙伴们的消息。</p>';v.querySelectorAll('[data-reply]').forEach(b=>b.onclick=()=>{state.vars.flags['reply'+b.dataset.reply]=true;autosave();phoneView('messages');});}
  if(tab==='notes'){const pos=state?.vars.flags.filmPosition,notes=[];if(state?.vars.flags.askedDuan)notes.push('雨棚镜头：已同意背影，正脸需要另行确认。');if(pos==='truth')notes.push('去掉预设的悲伤配乐，保留当事人的完整表达。');if(pos==='dialogue')notes.push('正式开机之前，先邀请居民讨论片子的必要性。');if(pos==='beauty')notes.push('宣传短片与独立访谈分开确认用途和授权。');if(state?.vars.flags.interviewExit)notes.push('参与者翻过空白卡片时，即刻停止采访。');v.innerHTML=notes.length?notes.map(t=>'<div class="card"><p>'+esc(t)+'</p></div>').join(''):'<p class="empty">先经历一些事情，再留下想记住的话。</p>';}
  if(tab==='calendar')v.innerHTML=state?.vars.flags.signedCommission?'<div class="card"><h3>明天 · 拍摄通告</h3><p>08:40　影院前厅：先认识参与者，不开机。<br>09:00　口述史访谈：确认每个人可以自行结束。<br>14:00　互动地图测试：半小时。<br>稍后　现场声音采集与公开讨论准备。</p></div>':'<p class="empty">项目确认以后，这里会收到第一份拍摄通告。</p>';
}
function exportSave(){if(!state)return;const file={game:'after-rain',format:1,state:E.clone(state)},text=JSON.stringify(file,null,2);$('save-text').value=text;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'application/json'}));a.download='心动在雨停之后-存档.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),10000);toast('已准备备份文件，也可复制下方备份文字。');}
function importSave(text){try{if(text.length>2000000)throw Error('备份内容过大');const data=JSON.parse(text);if(data.game!=='after-rain'||data.format!==1)throw Error('请选择本游戏的备份');const restored=E.validate(data.state);if(state)write('previous',state);state=restored;autosave();closePanel();showPlayer();toast('备份已读取。');}catch(e){toast('未读取备份：'+e.message);}}
function bindPanel(type){
  $('panel-content').querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openPanel(b.dataset.open));
  $('panel-content').querySelectorAll('[data-rewind]').forEach(b=>b.onclick=()=>{if(!state)return;try{E.rewind(state,Number(b.dataset.rewind));closePanel();showPlayer();autosave();}catch(e){toast(e.message);}});
  if(type==='phone'){phoneView('messages');$('panel-content').querySelectorAll('[data-phone-tab]').forEach(b=>b.onclick=()=>phoneView(b.dataset.phoneTab));}
  if(type==='saves'){
    $('panel-content').querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>{slots[Number(b.dataset.save)]={time:new Date().toLocaleString('zh-CN'),state:E.clone(state)};write('slots',slots);renderPanel('saves');toast('进度已保存到手动槽。');});
    $('panel-content').querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>{try{state=E.validate(slots[Number(b.dataset.load)].state);closePanel();showPlayer();autosave();toast('存档已读取。');}catch(e){toast('存档未能读取：'+e.message);}});
    $('export-save').onclick=exportSave;$('import-save').onclick=()=>$('save-file').click();$('save-file').onchange=async e=>{const file=e.target.files[0];if(file){if(file.size>2000000){toast('备份内容过大');return;}importSave(await file.text());}};$('import-text').onclick=()=>importSave($('save-text').value);
  }
  if(type==='settings'){$('text-speed').value=settings.textSpeed;$('text-speed').onchange=e=>{settings.textSpeed=e.target.value;configure();};$('voice-volume').oninput=e=>{settings.voice=+e.target.value;configure();};$('large-text').onchange=e=>{settings.large=e.target.checked;configure();};$('reduce-motion').onchange=e=>{settings.reduced=e.target.checked;configure();};}
  if(type==='pending')$('back-home').onclick=()=>{closePanel();showHome();};if(type==='new')$('confirm-new').onclick=()=>{closePanel();newStory();};
}
$('continue').onclick=()=>state?showPlayer():newStory();$('new').onclick=()=>state?openPanel('new'):newStory();$('advance').onclick=next;$('exit').onclick=showHome;$('close-panel').onclick=closePanel;
document.querySelectorAll('#home [data-open],#player [data-open]').forEach(b=>b.onclick=()=>openPanel(b.dataset.open));
panel.addEventListener('cancel',e=>{e.preventDefault();closePanel();});
$('auto').onclick=()=>{auto=!auto;skip=false;$('auto').setAttribute('aria-pressed',String(auto));$('skip').setAttribute('aria-pressed','false');};$('skip').onclick=()=>{skip=!skip;auto=false;$('skip').setAttribute('aria-pressed',String(skip));$('auto').setAttribute('aria-pressed','false');};
document.addEventListener('keydown',e=>{if(panel.open||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();next();}if(e.key.toLowerCase()==='a')$('auto').click();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){voice?.pause();$('shot').pause();autosave();}else if(playing&&!panel.open){if(voice&&!voiceFinished)voice.play().catch(()=>{});if(!$('shot').hidden)$('shot').play().catch(()=>{});}});
window.addEventListener('pagehide',autosave);
function tick(now){const dt=Math.min(.1,(now-lastFrame)/1000);lastFrame=now;if(playing&&!panel.open&&!document.hidden){elapsed+=dt;state.minutes+=dt/60;const b=beat(),speed=settings.textSpeed==='slow'?15:30;revealed=settings.textSpeed==='instant'?b.text.length:Math.min(b.text.length,revealed+speed*dt);$('subtitle').textContent=b.text.slice(0,Math.floor(revealed));if(revealed>=b.text.length&&!meta.read.includes(b.id)){remember(true);write('memories',meta);}const duration=voices[b.id]?.duration||b.text.length/4;if(!$('choices').hidden){}else if(skip&&readAtEntry&&elapsed>.16){revealed=b.text.length;next();}else if(auto&&elapsed>duration+.75&&voiceFinished&&videoFinished&&revealed>=b.text.length)next();}requestAnimationFrame(tick);}
configure();showHome();requestAnimationFrame(tick);
const results=await Promise.allSettled([fetch(base+'voice-manifest.json').then(r=>{if(!r.ok)throw Error('voice');return r.json();}),fetch(base+'video-manifest.json').then(r=>{if(!r.ok)throw Error('video');return r.json();})]);if(results[0].status==='fulfilled')voices=results[0].value;if(results[1].status==='fulfilled')videos=results[1].value;
})();
