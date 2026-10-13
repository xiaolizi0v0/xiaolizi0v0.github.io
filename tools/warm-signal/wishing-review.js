(()=>{'use strict';
const D=WarmData,E=WarmEngine,$=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cursor=0,drawCalls=0,saves=0;const random=[.005,.1,.25,.4,.08,.8,.6,.2,.005,.9,.7,.3,.2,.7,.5,.8,.1,.5,.2,.1];
const game=new E.Game(null,()=>Date.UTC(2026,9,13,4),()=>random[cursor++%random.length]);game.s.gems=5000;
const draw=game.draw.bind(game);game.draw=(...args)=>{drawCalls++;return draw(...args);};
const btn=(label,act,attrs='',cls='soft',disabled=false)=>`<button data-act="${act}" ${attrs} class="${cls}" ${disabled?'disabled':''}>${label}</button>`,cardArt=id=>WarmCardArt.markup(D.cards[id],esc);
function details(){$('qa-summary').textContent=(E.valid(game.s)?'存档有效':'存档无效')+' · 独立许愿数据';$('qa-details').textContent=JSON.stringify({valid:E.valid(game.s),drawCalls,saves,motion:game.s.settings.motion,total:game.s.wishing.total,serial:game.s.wishing.serial,gems:game.s.gems,coins:game.s.coins,tickets:game.s.tickets,flowers:game.s.wishing.flowers,history:game.s.wishing.history.map(h=>({id:h.id,rarity:D.cards[h.id].rarity,kind:h.kind})),cards:game.s.cards.map(c=>({id:c.id,copies:c.copies}))},null,2);}
function save(){saves++;details();}
function close(){$('modal').hidden=true;}
function modal(title,body,actions='',kicker='许愿 · 独立检查'){$('modal').className='modal';$('modal-title').textContent=title;$('modal-kicker').textContent=kicker;$('modal-body').innerHTML=body;$('modal-actions').innerHTML=actions;$('modal').hidden=false;$('close-modal').focus();}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1800);}
function render(){$('screen').innerHTML=ui.screen();details();}
const ui=WarmWishingUI.create({getGame:()=>game,btn,esc,cardArt,modal,close,commit(fn,after){const r=fn();if(r.ok===false){toast(r.reason);return false;}save();render();after?.(r);return r;},toast,redraw:render,save});
document.addEventListener('click',e=>{const el=e.target.closest('button');if(!el||el.disabled)return;if(el.dataset.qa==='motion'){game.s.settings.motion=!game.s.settings.motion;el.textContent=game.s.settings.motion?'关闭动效':'开启动效';details();return;}if(el.dataset.go){ui.pause();location.href='WarmSignal.html#home';return;}if(el.id==='close-modal'||el.dataset.act==='close'){close();return;}if(el.dataset.act?.startsWith('wish-'))ui.act(el.dataset.act,el);});
render();
})();
