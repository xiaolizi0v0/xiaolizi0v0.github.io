(()=>{'use strict';
const E=WarmEngine,S=WarmSunJournal,C=S.C,$=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let clock=Date.parse('2026-10-12T04:00:00Z'),game,page='sun',fixture='fresh',toastTimer;
const fmt=n=>n.toLocaleString('zh-CN'),btn=(label,act,attrs='',cls='soft',disabled=false)=>`<button data-act="${act}" ${attrs} class="${cls}" ${disabled?'disabled':''}>${label}</button>`,cardArt=id=>WarmCardArt.markup(WarmData.cards[id],esc);
function close(){rechargeUI.onClose();$('modal').hidden=true;}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3000);}
function modal(title,body,actions='',kicker='SUNLIGHT · ISOLATED REVIEW'){$('modal').className='modal';$('modal-title').textContent=title;$('modal-kicker').textContent=kicker;$('modal-body').innerHTML=body;$('modal-actions').innerHTML=actions;$('modal').hidden=false;}
function save(){}
function route(p){close();if(p==='events')p='sun';if(p==='sun'||p==='recharge')page=p;else toast('检查页仅包含手札与模拟付款；其他玩法请返回正式游戏。');render();}
function commit(fn){const r=fn();if(r?.ok===false){toast(r.reason);return false;}render();return r;}
const rechargeUI=WarmRechargeUI.create({getGame:()=>game,btn,esc,cardArt,fmt,modal,close,commit,toast,route,save});
const sunUI=WarmSunJournalUI.create({getGame:()=>game,btn,esc,cardArt,fmt,modal,close,commit,toast,route,redraw:render,buy:id=>rechargeUI.buy(id)});
function pay(id){const q=game.rechargeBegin(id);if(!q.ok)throw Error(q.reason);game.rechargeConfirm(q.order.id,'wechat');const r=game.rechargePay(q.order.id,'0000');if(!r.ok)throw Error(r.reason);}
function setFixture(name){fixture=name;clock=Date.parse('2026-10-12T04:00:00Z');game=new E.Game(null,()=>clock,()=>0);game.s.gems=20000;if(name==='hundred'){pay(12);game.sunBuyLevels(79,game.s.sunJournal.current,game.s.sunJournal.serial);}if(name==='expired'){game.sunBuyLevels(49,game.s.sunJournal.current,game.s.sunJournal.serial);game.sunClaim('free','all',game.s.sunJournal.current,game.s.sunJournal.serial);pay(13);clock=S.info(game.s.sunJournal.current).end;game.refresh();}page='sun';sunUI.reset();rechargeUI.reset();close();render();}
function render(){game.refresh();$('screen').innerHTML=page==='sun'?sunUI.screen():rechargeUI.screen();$('qa-summary').textContent=(E.valid(game.s)?'存档有效':'存档无效')+' · '+fixture+' · '+S.level(S.getBook(game))+'级';$('qa-details').textContent=JSON.stringify({clock:new Date(clock).toISOString(),gems:game.s.gems,coins:game.s.coins,tickets:game.s.tickets,glow:game.s.sp.glow,season:game.s.sunJournal.current,light:S.points(S.getBook(game)),sunCoins:game.s.sunJournal.coins,keys:game.s.sunJournal.keys,free:S.getBook(game).free.length,paid:S.getBook(game).paid.length,cards:game.s.cards.map(c=>c.id),scenes:game.s.companion.meet.ownedScenes,orders:game.s.recharge.total,equipped:game.s.sunJournal.equipped},null,2);}
document.addEventListener('click',e=>{const el=e.target.closest('button');if(!el||el.disabled)return;if(el.dataset.fixture){setFixture(el.dataset.fixture);return;}if(el.dataset.go){route(el.dataset.go);return;}const a=el.dataset.act;if(a==='close'){close();return;}if(a?.startsWith('sun-'))sunUI.act(a,el);else if(a?.startsWith('recharge-'))rechargeUI.act(a,el);});
setFixture('fresh');
})();
