(function(root){'use strict';
// Rewards are already committed by WishingUI. This controller only reveals them.
function create({voicePlayer,cardArt,esc,motion=()=>true}){
 let host=null,timer=null,receipt=null,done=null,index=0,locked=[];
 const D=root.WarmData;
 function cancel(){voicePlayer?.stop();clearTimeout(timer);timer=null;host?.remove();host=null;receipt=null;done=null;document.body.classList.remove('wish-cinematic-active');for(const [el,inert] of locked)el.inert=inert;locked=[];document.removeEventListener('keydown',keys,true);}
 function finish(){if(!host)return;const complete=done;cancel();complete?.();}
 function keys(e){if(!host)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();finish();}else if(e.key==='Tab'){const buttons=[...host.querySelectorAll('button')];if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){e.preventDefault();buttons[0].focus();}}}
 function stars(){return Array.from({length:18},(_,i)=>`<i style="--x:${8+(i*37)%85}%;--y:${8+(i*23)%83}%;--delay:${i*-.37}s;--size:${i%3===0?8:4}px">${i%3===0?'✧':'·'}</i>`).join('');}
 function frame(body,footer){host.innerHTML=`<div class="wish-cinema-sky" aria-hidden="true">${stars()}<span class="wish-cinema-orbit"></span><span class="wish-cinema-orbit second"></span></div><header><span>WARM SIGNAL <small>心愿成笺 · 为你而来</small></span><button data-reveal="skip">跳过动画</button></header><main>${body}</main><footer>${footer}</footer>`;}
 function reveal(){if(!host)return;clearTimeout(timer);timer=null;const item=receipt.result[index],c=D.cards[item.id],high=['SSR','SP','UR'].includes(c.rarity);host.dataset.stage='card';host.dataset.rarity=c.rarity;host.classList.toggle('is-rare',high);
 frame(`<div class="wish-cinema-heading"><small>第 ${index+1} / ${receipt.result.length} 份心动</small><h2 id="wish-cinema-title">${high?'与你相遇，是特别的心愿':'有一份心意，想交给你'}</h2></div><article class="wish-cinema-card" aria-label="${esc(c.rarity+' '+D.characters[c.p].name+' '+c.name)}"><span class="wish-cinema-rarity">${c.rarity}${item.kind==='fragment'?' · 碎片':''}</span>${cardArt(item.id)}<span class="wish-cinema-card-shine" aria-hidden="true"></span></article><div class="wish-cinema-name" aria-live="polite"><small>${esc(D.characters[c.p].name)}</small><h3>${esc(c.name)}</h3><p>${item.kind==='fragment'?'羁绊碎片 ×1':item.fresh?'NEW · 初次相遇':'再次相遇 · 星尘 +'+item.dust}</p></div>`,`${receipt.result.length>1?`<div class="wish-cinema-progress" aria-label="已揭晓${index+1}张，共${receipt.result.length}张">${receipt.result.map((_,i)=>`<i class="${i<=index?'seen':''}"></i>`).join('')}</div>`:''}<button class="wish-cinema-next" data-reveal="next">${index===receipt.result.length-1?'珍藏这一刻 · 查看结果':'轻触，遇见下一份心动'} <span>›</span></button>`);
 host.querySelector('[data-reveal="next"]').focus();voicePlayer?.speak(D.characters[c.p].name,D.characters[c.p].quote);
 }
 function play(result,complete){cancel();if(!result?.result?.length||!motion()||root.matchMedia?.('(prefers-reduced-motion: reduce)').matches){complete();return;}receipt=result;done=complete;index=0;host=document.createElement('section');host.className='wish-cinematic';host.dataset.stage='invitation';host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');host.setAttribute('aria-labelledby','wish-cinema-title');for(const el of [document.getElementById('game'),document.getElementById('modal')].filter(Boolean)){locked.push([el,el.inert]);el.inert=true;}document.body.append(host);document.body.classList.add('wish-cinematic-active');document.addEventListener('keydown',keys,true);
 frame(`<div class="wish-cinema-invitation"><small>A LETTER FOR YOU</small><h2 id="wish-cinema-title">把心愿，寄给相遇</h2><div class="wish-cinema-envelope" aria-hidden="true"><span class="wish-cinema-letter">WARM SIGNAL<br><b>♡</b><small>每一份心意，都有回音</small></span><i class="wish-cinema-fold"></i><i class="wish-cinema-seal">♡</i></div><p>春风带着心意，正向你走来…</p></div>`,`<button class="wish-cinema-next" data-reveal="open">开启这封心愿 <span>›</span></button>`);
 host.addEventListener('click',e=>{const action=e.target.closest('[data-reveal]')?.dataset.reveal;if(action==='skip')finish();else if(action==='open')reveal();else if(action==='next'){if(index+1<receipt.result.length){index++;reveal();}else finish();}});
 host.querySelector('[data-reveal="open"]').focus();timer=setTimeout(reveal,1700);
 }
 root.addEventListener?.('pagehide',cancel);
 return{play,finish,cancel,isActive:()=>!!host};
}
root.WarmWishReveal={create};
})(typeof window==='undefined'?globalThis:window);
