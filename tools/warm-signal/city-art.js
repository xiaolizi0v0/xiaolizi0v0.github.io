(function(root){'use strict';
 // Original alpha atlases: eight daily frames or two outfits with eight frames each.
 const base=new URL('assets/',document.currentScript.src),cache=new Map();
 const girls=['lin-zhi','gu-qinghe','xu-zhixia','su-wan','jiang-yue','tang-li'];
 const file=id=>'city-'+id+(id.endsWith('-outfits')?'-v1.png':'-atlas-v1.png');
 function image(id){if(!cache.has(id)){const pending=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('角色图片无法加载：'+file(id)));img.src=new URL(file(id),base).href;});cache.set(id,pending);pending.catch(()=>cache.delete(id));}return cache.get(id);}
 async function preload(people,outfit=0,p=people[0]){const ids=[...new Set(['shen-yu',...people.map(p=>girls[p]),...(outfit?['shen-yu-outfits',girls[p]+'-outfits']:[])])];return new Map(await Promise.all(ids.map(async id=>[id,await image(id)])));}
 function facing(yaw,angle){const relative=Math.atan2(Math.sin(yaw-angle),Math.cos(yaw-angle));return Math.abs(relative)>Math.PI*.72?5:relative<-.42?6:relative>.42?7:0;}
 root.WarmCityArt={girls,file,preload,facing,frames:WarmCityArtFrames,sizes:WarmCityArtSizes};
})(window);
