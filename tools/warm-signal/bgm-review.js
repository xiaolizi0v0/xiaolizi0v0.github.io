(()=>{'use strict';const $=id=>document.getElementById(id),memory=new Map();
function modal(title,body,actions,kicker){$('modal').className='';$('modal-title').textContent=title;$('modal-body').innerHTML=body;$('modal-actions').innerHTML=actions;$('modal-kicker').textContent=kicker;$('modal').hidden=false;}
const player=WarmBGM.create({storage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},modal,onState:s=>{$('qa-details').textContent=JSON.stringify(s,null,2);}});
$('music-status').innerHTML=player.settings();player.setScene('home');
document.addEventListener('click',e=>{const el=e.target.closest('button');if(!el)return;if(el.dataset.scene){player.setScene(el.dataset.scene);return;}if(el.id==='close-modal'||el.dataset.act==='close')$('modal').hidden=true;});
})();
