(function(root){'use strict';
// Finished illustrations remain intact. Motion is applied to the whole image in CSS.
const names=['林栀','顾清禾','许知夏','苏晚','江月','唐梨'];
let serial=0;
function descriptor(p,outfit){
 if(!Number.isInteger(p)||p<0||p>=6||![0,1,2].includes(outfit))return null;
 if(outfit===2)return{file:'birthday-outfit-'+['lin-zhi','gu-qinghe','xu-zhixia','su-wan','jiang-yue','tang-li'][p]+'-v1.webp',width:1024,height:1536,x:0,y:0,cropX:0,cropWidth:1024,viewWidth:1024,viewHeight:1536,name:names[p]};
 if(p===5)return{file:`tangli-${outfit?'home':'daily'}-still-v1.webp`,width:1024,height:1536,x:0,y:0,cropX:0,cropWidth:1024,viewWidth:1024,viewHeight:1536,name:names[p]};
 const x=p%3*418,bounds=p===1?[430,404]:p===4?[442,413]:[x,418];
 return{file:p<3?'companion-abc-v1.webp':'companion-def-v1.webp',width:1254,height:1254,x,y:outfit*627,cropX:bounds[0],cropWidth:bounds[1],viewWidth:418,viewHeight:627,name:names[p]};
}
function markup(p,outfit,esc,base='warm-signal/assets/'){const a=descriptor(p,outfit);if(!a)return'';const clip='still-portrait-'+(++serial);return `<span class="meet-art-motion"><span class="meet-art-presence"><svg class="meet-still-art" viewBox="${a.x} ${a.y} ${a.viewWidth} ${a.viewHeight}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(a.name)} · ${outfit===2?'生日盛装':outfit?'居家时光':'日常相见'}静态立绘"><defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><rect x="${a.cropX}" y="${a.y}" width="${a.cropWidth}" height="${a.viewHeight}"/></clipPath></defs><image href="${base}${a.file}" width="${a.width}" height="${a.height}" clip-path="url(#${clip})"/></svg></span></span>`;}
function create(){let element=null,stage=null,reactionTimer=0,speechTimer=0;
 const pause=()=>stage?.classList.toggle('meet-motion-paused',document.hidden);
 function dispose(){clearTimeout(reactionTimer);clearTimeout(speechTimer);document.removeEventListener('visibilitychange',pause);element?.classList.remove('reacting');stage?.classList.remove('meet-speaking');element=null;stage=null;}
 function mount(el,p,outfit,options={}){dispose();if(!el||!descriptor(p,outfit))return;element=el;stage=el.closest('.meet-page');el.dataset.presentation='static';el.dataset.motion=String(options.motion!==false);document.addEventListener('visibilitychange',pause);pause();}
 function react(){if(!element)return;clearTimeout(reactionTimer);element.classList.add('reacting');reactionTimer=setTimeout(()=>element?.classList.remove('reacting'),900);}
 function talk(ms=0){clearTimeout(speechTimer);stage?.classList.toggle('meet-speaking',ms>0);if(ms>0)speechTimer=setTimeout(()=>stage?.classList.remove('meet-speaking'),Math.min(ms,60000));}
 return{mount,dispose,react,talk};
}
const api={names,descriptor,markup,create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WarmCharacterArt=api;
})(typeof window==='undefined'?globalThis:window);
