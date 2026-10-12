'use strict';
// Rejected art experiment: retain reproducibility, but do not use as production input.
if (!process.argv.includes('--rebuild-rejected')) throw new Error('旧五官拼接方案未通过美术检查，已停用。仅调试失败案例可传 --rebuild-rejected。');
// Format packaging only: generated artwork is not repainted by this script.
// Set NODE_PATH to directories containing sharp, pngjs and ag-psd.
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp'),{PNG}=require('pngjs'),{writePsdBuffer,readPsd}=require('ag-psd');
const dir=__dirname,W=1024,H=1536;
const definitions=[
 ['ArtBody','身体与颈部',[0,0,319,420],152,404,720,1],
 ['ArtHairBack','后发',[320,0,310,422],190,78,644,0],
 ['ArtFace','脸底',[637,0,287,414],389,204,246,2],
 ['ArtHairCrown','前发与花夹',[924,0,330,424],317,76,398,14],
 ['ArtHairFrontL','左侧发束',[0,424,312,395],257,413,205,12],
 ['ArtHairFrontR','右侧发束',[315,424,314,395],618,413,205,13],
 ['ArtEyeWhiteL','左眼白',[630,515,294,176],420,303,78,3],
 ['ArtEyeWhiteR','右眼白',[944,515,310,176],533,292,78,4],
 ['ArtEyeBallL','左虹膜',[50,822,225,187],445,303,31,5],
 ['ArtEyeBallR','右虹膜',[363,822,226,187],557,292,31,6],
 ['ArtEyeLashL','左睫毛',[631,831,293,174],421,300,79,7],
 ['ArtEyeLashR','右睫毛',[945,831,309,174],533,289,79,8],
 ['ArtBrowL','左眉',[0,1026,311,153],421,274,79,9],
 ['ArtBrowR','右眉',[314,1026,314,153],532,262,79,10],
 ['ArtMouthInside','口腔',[651,1026,262,216],479,411,66,11,true],
 ['ArtMouth','嘴唇',[936,1026,318,228],471,401,81,15]
];
function trim(buffer,rect){const png=PNG.sync.read(buffer),[left,top,width,height]=rect;let x1=width,y1=height,x2=-1,y2=-1;for(let y=0;y<height;y++)for(let x=0;x<width;x++){const a=png.data[((top+y)*png.width+left+x)*4+3];if(a>=16){x1=Math.min(x1,x);x2=Math.max(x2,x);y1=Math.min(y1,y);y2=Math.max(y2,y);}}if(x2<0)throw Error('Empty material');x1=Math.max(0,x1-2);y1=Math.max(0,y1-2);x2=Math.min(width-1,x2+2);y2=Math.min(height-1,y2+2);const out=new PNG({width:x2-x1+1,height:y2-y1+1});for(let y=0;y<out.height;y++)for(let x=0;x<out.width;x++){const src=((top+y1+y)*png.width+left+x1+x)*4,dst=(y*out.width+x)*4;out.data.set(png.data.subarray(src,src+4),dst);if(out.data[dst+3]<8)out.data[dst+3]=0;}return{buffer:PNG.sync.write(out),region:[left+x1,top+y1,out.width,out.height]};}
function addSrgb(buffer){const profile=fs.readFileSync('C:/Windows/System32/spool/drivers/color/sRGB Color Space Profile.icm'),colorLength=buffer.readUInt32BE(26),resourceOffset=30+colorLength,resourceLength=buffer.readUInt32BE(resourceOffset),resourceEnd=resourceOffset+4+resourceLength,header=Buffer.alloc(12);header.write('8BIM',0);header.writeUInt16BE(1039,4);header.writeUInt32BE(profile.length,8);const added=Buffer.concat([header,profile,profile.length%2?Buffer.alloc(1):Buffer.alloc(0)]),length=Buffer.alloc(4);length.writeUInt32BE(resourceLength+added.length);return Buffer.concat([buffer.subarray(0,resourceOffset),length,buffer.subarray(resourceOffset+4,resourceEnd),added,buffer.subarray(resourceEnd)]);}
async function main(){const atlas=fs.readFileSync(path.join(dir,'tangli-materials-v1.png')),meta={version:2,name:'唐梨',status:'rejected-art-quality',width:W,height:H,source:'tangli-materials-v1.png',parameters:[['ParamAngleX',-30,0,30],['ParamAngleY',-30,0,30],['ParamAngleZ',-30,0,30],['ParamEyeLOpen',0,1,1],['ParamEyeROpen',0,1,1],['ParamEyeBallX',-1,0,1],['ParamEyeBallY',-1,0,1],['ParamMouthOpenY',0,0,1],['ParamMouthForm',-1,0,1],['ParamBodyAngleX',-10,0,10],['ParamBreath',0,0,1],['ParamHairFront',-1,0,1],['ParamHairBack',-1,0,1]],parts:[]},layers=[];fs.mkdirSync(path.join(dir,'parts'),{recursive:true});
 for(const [id,name,crop,left,top,width,order,hidden=false]of definitions){const t=trim(atlas,crop),scaled=await sharp(t.buffer).resize({width}).png().toBuffer(),png=PNG.sync.read(scaled);fs.writeFileSync(path.join(dir,'parts',id+'.png'),scaled);meta.parts.push({id,name,sourceRegion:t.region,left,top,width:png.width,height:png.height,order,hidden,file:'parts/'+id+'.png'});layers.push({name:id+'_'+name,left,top,hidden,opacity:1,blendMode:'normal',imageData:{width:png.width,height:png.height,data:new Uint8ClampedArray(png.data)},order});}
 layers.sort((a,b)=>a.order-b.order);const composites=meta.parts.filter(p=>!p.hidden).sort((a,b)=>a.order-b.order).map(p=>({input:fs.readFileSync(path.join(dir,p.file)),left:p.left,top:p.top})),composite=await sharp({create:{width:W,height:H,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(composites).png().toBuffer(),png=PNG.sync.read(composite);fs.writeFileSync(path.join(dir,'tangli-assembled-v1.png'),composite);
 const psd={width:W,height:H,children:layers.map(({order,...layer})=>layer),imageData:{width:W,height:H,data:new Uint8ClampedArray(png.data)}};const output=addSrgb(writePsdBuffer(psd,{generateThumbnail:false}));fs.writeFileSync(path.join(dir,'tangli-import-t002.psd'),output);fs.writeFileSync(path.join(dir,'tangli-material-manifest.json'),JSON.stringify(meta,null,2)+'\n');const read=readPsd(output,{skipLayerImageData:true,skipCompositeImageData:true,skipThumbnail:true});if(read.children.length!==16||read.width!==W||read.height!==H||new Set(read.children.map(l=>l.name)).size!==16)throw Error('PSD verification failed');console.log(JSON.stringify({width:read.width,height:read.height,layers:read.children.length,bytes:output.length,parts:meta.parts.map(p=>({id:p.id,bounds:[p.left,p.top,p.width,p.height]}))}));}
main().catch(e=>{console.error(e);process.exitCode=1;});
