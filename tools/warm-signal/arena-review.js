(()=>{'use strict';
const D=WarmData,E=WarmEngine,$=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const game=new E.Game(null,()=>Date.UTC(2026,9,13,4),()=>.5);
for(let p=0;p<6;p++)for(const n of [0,4,8]){const id=p*12+n;game.addCard(id);Object.assign(game.own(id),{level:1+(p*7+n*3)%38,stars:1+(p+n)%4});}
game.arenaFormation([0,12,24]);
const btn=(label,act,attrs='',cls='soft',disabled=false)=>`<button data-act="${act}" ${attrs} class="${cls}" ${disabled?'disabled':''}>${label}</button>`;
function details(){const a=game.s.arena;$('qa-summary').textContent=(E.valid(game.s)?'存档有效':'存档无效')+' · 独立内存数据';$('qa-details').textContent=JSON.stringify({valid:E.valid(game.s),formation:a.formation,mainFormation:game.s.formation,coins:game.s.coins,gems:game.s.gems,cards:game.s.cards.map(c=>({id:c.id,p:D.cards[c.id].p,total:game.cardStats(c).reduce((a,b)=>a+b,0)}))},null,2);}
function modal(title,body,actions='',kicker='票房 · 独立检查'){$('modal').className='modal';$('modal-title').textContent=title;$('modal-kicker').textContent=kicker;$('modal-body').innerHTML=body;$('modal-actions').innerHTML=actions;$('modal').hidden=false;}
function close(){$('modal').hidden=true;}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1800);}
function render(){$('screen').innerHTML=ui.screen();details();}
const ui=WarmArenaUI.create({getGame:()=>game,btn,esc,avatar:p=>`<div class="portrait avatar p${p}" style="--p:${p}"></div>`,cardArt:id=>WarmCardArt.markup(D.cards[id],esc),modal,close,commit(fn){const r=fn();if(!r.ok){toast(r.reason);return false;}render();return r;},toast,route(){location.href='WarmSignal.html#home';},redraw:render,save:details});
document.addEventListener('click',e=>{const el=e.target.closest('button');if(!el||el.disabled)return;if(el.dataset.go){location.href='WarmSignal.html#home';return;}if(el.id==='close-modal'||el.dataset.act==='close'){close();return;}if(['box-formation','box-filter','box-sort','box-pin','box-pick','box-save'].includes(el.dataset.act)){ui.act(el.dataset.act,el);details();}});
render();ui.act('box-formation',{dataset:{}});
})();
