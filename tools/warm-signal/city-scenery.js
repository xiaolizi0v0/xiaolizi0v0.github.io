(function(root){'use strict';
// Generated alpha PNGs remain unchanged. Bounds are measured from their actual pixels.
const base=new URL('assets/',document.currentScript.src),cache=new Map();
const sheets={
 shops:{file:'city-shops-painted-v1.png',size:[1254,1254],frames:[[26,2,591,614],[654,24,579,598],[37,616,588,596],[647,640,595,571]]},
 props:{file:'city-props-painted-v1.png',size:[1254,1254],frames:[[33,27,599,636],[658,89,552,575],[10,760,621,411],[646,822,597,368]]}
};
function load(id){if(!cache.has(id)){const pending=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{const expected=sheets[id].size;if(img.naturalWidth!==expected[0]||img.naturalHeight!==expected[1])reject(Error('街区素材尺寸不符：'+sheets[id].file));else resolve(img);};img.onerror=()=>reject(Error('街区素材无法加载：'+sheets[id].file));img.src=new URL(sheets[id].file,base).href;});cache.set(id,pending);pending.catch(()=>cache.delete(id));}return cache.get(id);}
async function preload(){return new Map(await Promise.all(Object.keys(sheets).map(async id=>[id,await load(id)])));}
function paint(ctx,images,id,index,x,y,width){const image=images.get(id),frame=sheets[id]?.frames[index];if(!image||!frame)return false;const[sx,sy,sw,sh]=frame,scale=width/sw;ctx.drawImage(image,sx,sy,sw,sh,x-width/2,y-sh*scale,width,sh*scale);return true;}
root.WarmCityScenery={sheets,preload,paint};
})(window);
