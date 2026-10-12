(function(root){'use strict';const C=typeof module!=='undefined'&&module.exports?require('./city-content.js'):root.WarmCityContent;
const radius=a=>a.mode?1.3:1.1;
const epsilon=1e-9;
function obstacles(map){const boxes=[...C.buildings,[0,-10.5,4,.3]],circles=[[0,-2,1.1]];
 for(let i=0;i<C.buildings.length;i++){if(map===2&&i>1)continue;const[bx,bz,w,d]=C.buildings[i];for(const side of [-1,1])boxes.push([bx+side*(w/2-.65),bz+d/2+.7,1.4,.65]);}
 for(const p of[[-12,-11],[12,-11],[-12,11],[12,11],[-4,-12],[4,12]])circles.push([...p,1]);
 for(const p of[[-3,8],[3,8],[-3,-6],[3,-6],[-11,3],[11,3]])circles.push([...p,.09]);
 for(const n of C.npc)if(n.map===map)circles.push([n.x,n.z,.45]);
 if(map===1)boxes.push([-3,5.3,1.15,.6],[3,5.3,1.3,.7]);return{boxes,circles};}
function free(x,z,r=1.1,map=0){if(!Number.isFinite(x)||!Number.isFinite(z)||x<C.bounds.min+r||x>C.bounds.max-r||z<C.bounds.min+r||z>C.bounds.max-r)return false;const o=obstacles(map);return !o.boxes.some(([bx,bz,w,d])=>Math.abs(x-bx)<w/2+r-epsilon&&Math.abs(z-bz)<d/2+r-epsilon)&&!o.circles.some(([cx,cz,cr])=>Math.hypot(x-cx,z-cz)<cr+r-epsilon);}
function clear(a,b,r=radius(a),map=a.map||0){if(!free(a.x,a.z,r,map)||!free(b.x,b.z,r,map))return false;const dx=b.x-a.x,dz=b.z-a.z,length2=dx*dx+dz*dz,o=obstacles(map);
 // Sweep the entire movement segment so path smoothing and short player steps agree.
 for(const[cx,cz,cr]of o.circles){const t=length2?Math.max(0,Math.min(1,((cx-a.x)*dx+(cz-a.z)*dz)/length2)):0;if(Math.hypot(a.x+t*dx-cx,a.z+t*dz-cz)<cr+r-epsilon)return false;}
 for(const[cx,cz,w,d]of o.boxes){let lo=0,hi=1,miss=false;for(const[start,delta,center,half]of[[a.x,dx,cx,w/2+r-epsilon],[a.z,dz,cz,d/2+r-epsilon]]){if(Math.abs(delta)<epsilon){if(Math.abs(start-center)>=half){miss=true;break;}}else{const t1=(center-half-start)/delta,t2=(center+half-start)/delta;lo=Math.max(lo,Math.min(t1,t2));hi=Math.min(hi,Math.max(t1,t2));if(lo>=hi){miss=true;break;}}}if(!miss&&lo<hi)return false;}
 return true;}
function path(a,b,r=radius(a),map=a.map||0){if(!free(b.x,b.z,r,map))return[];if(clear(a,b,r,map))return[b];const key=(x,z)=>x+','+z,end={x:Math.round(b.x),z:Math.round(b.z)},queue=[],parents=new Map();for(let x=Math.floor(a.x)-1;x<=Math.ceil(a.x)+1;x++)for(let z=Math.floor(a.z)-1;z<=Math.ceil(a.z)+1;z++){const n={x,z};if(clear(a,n,r,map)){queue.push(n);parents.set(key(x,z),null);}}let found=null;
 for(let i=0;i<queue.length;i++){const n=queue[i];if(Math.hypot(n.x-end.x,n.z-end.z)<1.2&&clear(n,b,r,map)){found=n;break;}for(const[dx,dz]of[[1,0],[0,1],[-1,0],[0,-1]]){const v={x:n.x+dx,z:n.z+dz},k=key(v.x,v.z);if(!parents.has(k)&&free(v.x,v.z,r,map)&&clear(n,v,r,map)){parents.set(k,n);queue.push(v);}}}
 if(!found)return[];const out=[b];while(found){out.unshift(found);found=parents.get(key(found.x,found.z));}let anchor=a;const smooth=[];for(let i=0;i<out.length;i++){if(i+1<out.length&&clear(anchor,out[i+1],r,map))continue;smooth.push(out[i]);anchor=out[i];}return smooth;}
function approach(a,b){let best=null;const initial=Math.atan2(a.z-b.z,a.x-b.x);for(let i=0;i<16;i++){const angle=initial+i*Math.PI/8,target={x:b.x+Math.cos(angle)*1.9,z:b.z+Math.sin(angle)*1.9},way=path(a,target);if(!way.length)continue;let length=0,prev=a;for(const n of way){length+=Math.hypot(n.x-prev.x,n.z-prev.z);prev=n;}if(!best||length<best.length)best={length,way};}return best?.way||[];}
const api={free,clear,path,approach,radius};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WarmCityPath=api;})(typeof window==='undefined'?globalThis:window);
