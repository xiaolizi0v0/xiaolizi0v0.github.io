(()=>{'use strict';const $=id=>document.getElementById(id);let game,ui,next=()=>{},bind=()=>{};
const voice=WarmVoice.create({storage:{getItem(){return null;},setItem(){}},onState:s=>{$('voice-state').textContent=JSON.stringify(s);}});
function modal(title,body,actions=''){voice.reset();$('modal-title').textContent=title;$('modal-body').innerHTML=body;$('modal-actions').innerHTML=actions;$('modal').hidden=false;}
function close(){voice.stop();$('modal').hidden=true;}
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const ctx={voicePlayer:voice,getGame:()=>game,esc,fmt:String,btn:(s,a,attrs='',cls='soft small',off=false)=>`<button class="${cls}" data-act="${a}" ${attrs} ${off?'disabled':''}>${s}</button>`,cardArt:id=>WarmCardArt.markup(WarmData.cards[id],esc),avatar:p=>`<span>${WarmData.characters[p].name}</span>`,modal,close,toast(){},save(){},route(){},redraw(){if(ui){$('screen').innerHTML=ui.screen();bind();}},commit(fn,after){const r=fn();if(r?.ok===false)throw Error(r.reason);ctx.redraw();after?.(r);return r;}};
const cases={
 birthday(){const event=WarmBirthday.freshEvent();event.stories[0].done=true;game.s.birthday.events['2026-5']=event;ui=WarmBirthdayUI.create(ctx);ui.act('bday-story',{dataset:{index:'0'}});next=()=>ui.act('bday-read-next',{dataset:{type:'story',index:'0'}});},
 cottage(){ui=WarmCottageUI.create(ctx);game.s.cottage.reading={id:1,key:'home-0-0',step:0};const show=()=>ui.act('house-resume',{dataset:{}});show();next=()=>{game.s.cottage.reading.step=(game.s.cottage.reading.step+1)%WarmCottageContent.byKey['home-0-0'].lines.length;show();};},
 city(){ui=WarmCityUI.create(ctx);game.s.city.started=true;game.s.city.routes[0].hearts[0]=[2];ui.act('city-read',{dataset:{map:'0',id:'0'}});next=()=>ui.act('city-next',{dataset:{}});},
 labyrinth(){ui=WarmLabyrinthUI.create(ctx);bind=()=>ui.bind();ui.act('lab-story',{dataset:{id:'0'}});ctx.redraw();next=()=>{WarmLabyrinth.view(game).stories[0].cursor++;ctx.redraw();};},
 company(){game.addCard(84);ui=WarmCompanyUI.create(ctx);ui.act('studio-date',{dataset:{id:'0'}});next=()=>ui.act('studio-date-next',{dataset:{}});},
 footage(){game.footageStory(0,0);ui=WarmFootageUI.create(ctx);bind=()=>ui.bind();ui.act('film-resume',{dataset:{}});ctx.redraw();next=()=>{game.footageNext(game.s.footage.session.id);ctx.redraw();};},
 sleep(){ui=WarmSleepUI.create(ctx);bind=()=>ui.bind();ui.enter();ctx.redraw();next=()=>ui.act('sleep-touch',{dataset:{kind:'hand'}});},
 ur(){game.addCard(10);ui=WarmURUI.create(ctx);bind=()=>ui.bind();ui.act('ur-card',{dataset:{id:'10'}});ui.act('ur-tab',{dataset:{tab:'interact'}});next=()=>ui.act('ur-interact',{dataset:{mode:'touch',serial:String(game.s.ur.serial)}});next();},
 walk(){ui=WarmWalkUI.create(ctx);bind=()=>ui.bind();ui.act('stroll-enter',{dataset:{person:'0'}});next=()=>{const r=game.s.walks.routes[0];ui.act('stroll-choice',{dataset:{person:'0',choice:'0',round:String(r.round),step:String(r.step),week:String(game.s.walks.week)}});};},
 pet(){game.petHome().adopted=true;ui=WarmPetUI.create(ctx);bind=()=>ui.bind();ctx.redraw();next=()=>ui.act('pet-invite',{dataset:{}});},
 live(){const text=WarmEngine.liveEvents[0].response;$('screen').innerHTML='<p>唐梨：'+esc(text)+'</p>';voice.speak('唐梨',text);next=()=>voice.speak('唐梨',WarmVoiceDialogue.liveEnd);}
};
const labels={birthday:'生日剧情',cottage:'小屋回忆',city:'城市故事',labyrinth:'迷宫剧情',company:'公司约会',footage:'拍摄副本',sleep:'睡眠陪伴',ur:'UR互动',walk:'城市漫步',pet:'宠物家庭',live:'直播回应'};
$('audit-scenes').innerHTML=Object.entries(labels).map(([key,label])=>`<button data-scene="${key}" class="soft small" disabled>${label}</button>`).join('');
voice.ready.then(()=>document.querySelectorAll('[data-scene]').forEach(b=>b.disabled=false));
$('audit-scenes').onclick=e=>{const key=e.target.closest('[data-scene]')?.dataset.scene;if(!key)return;voice.reset();close();$('screen').innerHTML='';game=new WarmEngine.Game(null,()=>Date.parse('2026-10-13T12:00:00+08:00'));game.s.main=108;ui=null;next=()=>{};bind=()=>{};$('audit-title').textContent='配音复查 · '+labels[key];cases[key]();};
$('audit-next').onclick=()=>next();$('close-modal').onclick=close;
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(b&&ui&&!b.dataset.act.startsWith('voice-'))ui.act(b.dataset.act,b);});
})();
