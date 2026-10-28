document.documentElement.classList.add('has-js');
const menu = document.querySelector('.menu-toggle');
function closeMenu(){menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','展开导航');}
menu?.addEventListener('click',()=>{
 const open=menu.getAttribute('aria-expanded')!=='true';
 menu.setAttribute('aria-expanded',String(open));
 menu.setAttribute('aria-label',open?'收起导航':'展开导航');
});
document.querySelectorAll('#main-nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 const filter=button.dataset.filter;
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 let count=0;
 document.querySelectorAll('.game-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.category!==filter;if(!card.hidden)count++;});
 document.getElementById('filter-status').textContent=`共 ${count} 款作品`;
}));
const lightbox=document.getElementById('lightbox');
if(lightbox){
 const items=[...document.querySelectorAll('[data-image]')];let active=0,trigger=null;
 function show(index){active=(index+items.length)%items.length;const item=items[active];const image=lightbox.querySelector('img');image.src=item.dataset.image;image.alt=item.dataset.caption;document.getElementById('lightbox-caption').textContent=`${active+1} / ${items.length} · ${item.dataset.caption}`;}
 items.forEach((item,index)=>item.addEventListener('click',()=>{trigger=item;show(index);lightbox.showModal();}));
 lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
 lightbox.querySelector('.lightbox-prev').addEventListener('click',()=>show(active-1));
 lightbox.querySelector('.lightbox-next').addEventListener('click',()=>show(active+1));
 lightbox.addEventListener('click',event=>{if(event.target===lightbox){const r=lightbox.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)lightbox.close();}});
 lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();show(active-1);}if(event.key==='ArrowRight'){event.preventDefault();show(active+1);}});
 lightbox.addEventListener('close',()=>trigger?.focus());
}
