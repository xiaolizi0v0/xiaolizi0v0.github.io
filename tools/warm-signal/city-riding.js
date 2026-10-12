(function(root){'use strict';
const sheets=WarmCityRidingFrames,base=new URL('assets/',document.currentScript.src),cache=new Map();
function key(p,mode){return mode===1?'solo':p===5&&mode===2?'boy':p===5&&mode===3?'girl':null;}
function pick(p,mode,outfit,screenX){const id=key(p,mode);return id&&Number.isInteger(outfit)&&outfit>=0&&outfit<=2?{id,frame:outfit*2+(screenX>=0?1:0)}:null;}
function load(id){if(!cache.has(id)){const pending=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{if(img.naturalWidth!==sheets[id].size[0]||img.naturalHeight!==sheets[id].size[1])reject(Error('骑行图片尺寸不符'));else resolve(img);};img.onerror=()=>reject(Error('骑行图片无法加载'));img.src=new URL(sheets[id].file,base).href;});cache.set(id,pending);pending.catch(()=>cache.delete(id));}return cache.get(id);}
async function preload(p,mode){const id=key(p,mode);return id?new Map([[id,await load(id)]]):new Map();}
function paint(ctx,images,choice,x,y,unit){const img=images.get(choice?.id);if(!img)return false;const sheet=sheets[choice.id],[sx,sy,w,h]=sheet.frames[choice.frame],scale=unit*2.55/sheet.frames[0][3];ctx.drawImage(img,sx,sy,w,h,x-w*scale/2,y-h*scale,w*scale,h*scale);return true;}
root.WarmCityRiding={sheets,key,pick,preload,paint};
})(window);
