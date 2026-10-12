// Asset inspection only; does not load the game, modify a save, or exercise payments.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const id=process.argv[2]||'tangli-compact-prototype-v2',evidence=process.argv[3]||'city3d-compact-v2';
if(!/^tangli-[a-z0-9-]+$/.test(id)||!/^city3d-[a-z0-9-]+$/.test(evidence))throw Error('Invalid local asset name');
const file=path.join(__dirname,id+'.glb'),bytes=fs.readFileSync(file),errors=[];
const report=JSON.parse(fs.readFileSync(path.join(__dirname,id+'-report.json'),'utf8'));
function requireThat(test,message){if(!test)errors.push(message);}
requireThat(bytes.toString('ascii',0,4)==='glTF','GLB magic');
requireThat(bytes.readUInt32LE(4)===2,'GLB version');
requireThat(bytes.readUInt32LE(8)===bytes.length,'GLB declared length');
const jsonLength=bytes.readUInt32LE(12),gltf=JSON.parse(bytes.toString('utf8',20,20+jsonLength));
const binHeader=20+jsonLength,bin=bytes.subarray(binHeader+8);
requireThat(bytes.readUInt32LE(binHeader+4)===0x004e4942,'GLB BIN chunk');
requireThat(gltf.buffers.length===1&&!gltf.buffers[0].uri,'self contained buffer');
requireThat(bin.length>=gltf.buffers[0].byteLength,'buffer length');
for(const view of gltf.bufferViews)requireThat((view.byteOffset||0)+view.byteLength<=bin.length,'buffer view bounds');
let triangles=0,vertices=0;
for(const mesh of gltf.meshes)for(const primitive of mesh.primitives){
  const material=gltf.materials[primitive.material],texture=material?.pbrMetallicRoughness?.baseColorTexture;
  const coord=texture?.texCoord||0;
  const position=gltf.accessors[primitive.attributes.POSITION],uv=gltf.accessors[primitive.attributes['TEXCOORD_'+coord]];
  vertices+=position.count;triangles+=gltf.accessors[primitive.indices].count/3;
  requireThat(position.componentType===5126&&position.type==='VEC3','position type');
  const positions=gltf.bufferViews[position.bufferView],start=(positions.byteOffset||0)+(position.byteOffset||0),step=positions.byteStride||12;
  for(let i=0;i<position.count;i++)for(let axis=0;axis<3;axis++)requireThat(Number.isFinite(bin.readFloatLE(start+i*step+axis*4)),'finite geometry');
  requireThat(Boolean(material?.pbrMetallicRoughness),'declared PBR material');
  if(!texture)continue; // Native solid-color geometry does not require UVs.
  requireThat(uv&&uv.count===position.count&&uv.componentType===5126,'UV count/type');
  if(!uv)continue;
  const view=gltf.bufferViews[uv.bufferView],offset=(view.byteOffset||0)+(uv.byteOffset||0),stride=view.byteStride||8;
  for(let i=0;i<uv.count;i++)for(let axis=0;axis<2;axis++){
    const value=bin.readFloatLE(offset+i*stride+axis*4);
    requireThat(Number.isFinite(value)&&value>=-1e-5&&value<=1.00001,'UV finite/in atlas');
  }
}
const textures=gltf.images.map(image=>{
  requireThat(!image.uri&&image.mimeType==='image/png','embedded PNG');
  const view=gltf.bufferViews[image.bufferView],png=bin.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);
  requireThat(png.toString('hex',0,8)==='89504e470d0a1a0a','PNG signature');
  const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
  const declared=report.textures.map(t=>t.size).filter(Boolean);
  const allowed=declared.length?[...declared,...(report.bodyMaterialSource?[[2048,2048]]:[])]:[[2048,2048]];
  requireThat(allowed.some(size=>size&&width===size[0]&&height===size[1]),'declared texture resolution');
  return {width,height,bytes:png.length};
});
const hashes=report.textures.map(t=>path.basename(t.path)).map(name=>({file:name,SHA256:crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,name))).digest('hex')}));
requireThat(hashes.every((h,i)=>h.SHA256===report.textures[i].SHA256),'original image hashes unchanged');
requireThat(triangles===report.triangles,'actual GLB triangles match geometry report');
requireThat(!gltf.skins&&!gltf.animations,'unrigged prototype label');
const html=fs.readFileSync(path.join(__dirname,'preview.html'),'utf8');
for(const ref of [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(r=>!/^https?:|^#/.test(r)))requireThat(fs.existsSync(path.resolve(__dirname,ref.split('?')[0])),'preview reference '+ref);
const result={date:'2026-10-12',file:path.basename(file),bytes:bytes.length,triangles,exportedVertices:vertices,textures,hashes,productionReady:false,errors};
const out=path.resolve(__dirname,'../../../../docs/warm-signal-screenshots',evidence);fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'glb-inspection.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));process.exitCode=errors.length?1:0;
