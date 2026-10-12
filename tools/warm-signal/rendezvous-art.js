(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.WarmRendezvousArt=api;})(typeof window==='object'?window:globalThis,function(){'use strict';
const path='warm-signal/assets/';
function descriptor(p,context='daily'){
if(!Number.isInteger(p)||p<0||p>5||!['daily','event','secret'].includes(context))throw new Error('Unknown rendezvous scene');
if(context==='event')return{src:path+'rendezvous-postoffice-v1.webp',width:1024,height:1536,x:0,y:0,w:1024,h:1536};
if(context==='secret')return{src:path+'date-scenes-v1.webp',width:1024,height:1536,x:p%2*512,y:Math.floor(p/2)*512,w:512,h:512};
if(p<3)return{src:path+(p===2?'main-story-music-v1.webp':'main-story-scenes-v1.webp'),width:1536,height:1024,x:p===0?768:0,y:p===0?0:512,w:768,h:512};
return{src:path+'rendezvous-'+['books','lake','hill'][p-3]+'-v1.webp',width:1024,height:1536,x:0,y:0,w:1024,h:1536};
}
function markup(p,context){const a=descriptor(p,context);return `<svg class="date-scene" viewBox="${a.x} ${a.y} ${a.w} ${a.h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${a.src}" width="${a.width}" height="${a.height}"/></svg>`;}
return{descriptor,markup};
});
