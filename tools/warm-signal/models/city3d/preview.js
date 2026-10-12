import * as THREE from 'three';
import { GLTFLoader } from '../../vendor/addons/loaders/GLTFLoader.js';

const stage=document.querySelector('#stage'),loading=document.querySelector('#loading');
const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,.01,100);
camera.position.set(0,1.03,4);camera.lookAt(0,1.03,0);
const pivot=new THREE.Group();scene.add(pivot);
scene.add(new THREE.HemisphereLight(0xfff6e8,0x8c7866,2.5));
const key=new THREE.DirectionalLight(0xfff4e5,2.1);key.position.set(-3,4,5);scene.add(key);
const fill=new THREE.DirectionalLight(0xe5ebf2,.8);fill.position.set(3,2,-3);scene.add(fill);
const clay=new THREE.MeshStandardMaterial({color:0xd0baa5,roughness:.9});
let renderer,model,frame=0,previous=0,dragging=false,lastX=0,fitWidth=1.5,request=0,activeVariant='';
let originals=new Map();
const angles=[...document.querySelectorAll('[data-angle]')],cache=new Map();
const variants={
  toon:{file:'tangli-toon-prototype-v4.glb',label:'小眼造型试作',texture:'身体使用 2048 × 2048 烘焙贴图，脸部与相机保留原图精度。',quality:'侧面仍有颜色串位，骨骼与动作尚未制作。',backLabel:'背面配色参考',views:{front:'tangli-toon-source-v4.png',back:'tangli-toon-back-v2.png'}},
  compact:{file:'tangli-compact-prototype-v2.glb',label:'上一版大眼造型',texture:'2048 × 2048 正背投影烘焙贴图。',quality:'上一版大眼与正背投影试作，尚未达到正式角色接入标准。',backLabel:'背面设计',views:{front:'tangli-toon-source-v2.png',back:'tangli-toon-back-v2.png'}}
};
const rotate=document.querySelector('#rotate'),zoom=document.querySelector('#zoom');

function render(){if(renderer)renderer.render(scene,camera);}
function resize(){
  if(!renderer)return;
  const w=stage.clientWidth,h=stage.clientHeight,aspect=w/h,half=Math.max(1.19,fitWidth*.53/aspect)*100/Number(zoom.value);
  camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;
  camera.updateProjectionMatrix();renderer.setSize(w,h,false);render();
}
function clearAngles(){angles.forEach(b=>b.setAttribute('aria-pressed','false'));}
function tick(time){
  frame=0;
  if(!rotate.checked||document.hidden){previous=0;return;}
  if(previous&&!dragging)pivot.rotation.y+=(Math.min(time-previous,50)/1000)*.32;
  previous=time;render();frame=requestAnimationFrame(tick);
}
function restartRotation(){cancelAnimationFrame(frame);frame=0;previous=0;if(rotate.checked&&!document.hidden)frame=requestAnimationFrame(tick);}
for(const button of angles)button.addEventListener('click',()=>{
  pivot.rotation.y=Number(button.dataset.angle)*Math.PI/180;clearAngles();button.setAttribute('aria-pressed','true');
  rotate.checked=false;restartRotation();render();
});
function appearance(){
  if(!model)return;
  model.traverse(o=>{if(!o.isMesh)return;o.material=document.querySelector('#clay').checked?clay:originals.get(o);});
  const wire=document.querySelector('#wire').checked;
  clay.wireframe=wire;
  for(const material of new Set(originals.values()))for(const m of Array.isArray(material)?material:[material])m.wireframe=wire;
  render();
}
document.querySelector('#clay').addEventListener('change',appearance);
document.querySelector('#wire').addEventListener('change',appearance);
rotate.addEventListener('change',()=>{if(rotate.checked)clearAngles();restartRotation();});
zoom.addEventListener('input',resize);
document.addEventListener('visibilitychange',restartRotation);
async function loadVariant(id){
  const ticket=++request,variant=variants[id];if(!variant)return;
  loading.className='';loading.textContent='正在载入模型…';loading.hidden=false;stage.dataset.status='loading';
  try{
    if(!cache.has(id))cache.set(id,new GLTFLoader().loadAsync(variant.file).then(gltf=>{
      const object=gltf.scene,box=new THREE.Box3().setFromObject(object),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
      object.scale.setScalar(2/size.y);object.position.set(-center.x*object.scale.x,-box.min.y*object.scale.y,-center.z*object.scale.z);
      let triangles=0;const materials=new Map();
      object.traverse(o=>{if(!o.isMesh)return;materials.set(o,o.material);triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3;});
      return {object,materials,triangles,width:Math.hypot(size.x,size.z)*object.scale.x};
    }).catch(error=>{cache.delete(id);throw error;}));
    const result=await cache.get(id);if(ticket!==request)return;
    pivot.clear();model=result.object;originals=result.materials;fitWidth=result.width;pivot.add(model);activeVariant=id;
    stage.dataset.status='loaded';stage.dataset.variant=id;stage.dataset.triangles=String(result.triangles);loading.hidden=true;
    document.querySelector('#model-heading').textContent='立体模型 · '+variant.label;
    document.querySelector('#model-info').textContent=`实际 GLB：${result.triangles.toLocaleString('zh-CN')} 个三角面。${variant.texture}`;
    document.querySelector('#quality').textContent=variant.quality;
    document.querySelector('#model-download').href=variant.file;
    const references=document.querySelector('.references');references.dataset.views=String(Object.keys(variant.views).length);
    for(const figure of references.querySelectorAll('figure')){const src=variant.views[figure.dataset.view];figure.hidden=!src;if(src)figure.querySelector('img').src=src;if(figure.dataset.view==='back')figure.querySelector('figcaption').textContent=variant.backLabel;}
    appearance();resize();
  }catch(error){
    if(ticket!==request)return;
    loading.hidden=false;loading.className='error';loading.textContent=model?'载入失败，仍显示上一造型。':'模型载入失败，请使用本地 HTTP 服务打开此页。';
    if(activeVariant)document.querySelector('#variant').value=activeVariant;
    stage.dataset.status='error';console.error('City character prototype:',error);
  }
}
document.querySelector('#variant').addEventListener('change',e=>loadVariant(e.target.value));

try{
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label','唐梨三维模型，可拖动旋转，也可用角度按钮查看');stage.append(canvas);
  canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;pivot.rotation.y+=(e.clientX-lastX)*.01;lastX=e.clientX;clearAngles();render();});
  const release=()=>{dragging=false;};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;e.preventDefault();pivot.rotation.y+=(e.key==='ArrowLeft'?-1:1)*Math.PI/12;clearAngles();render();});
  new ResizeObserver(resize).observe(stage);resize();
  await loadVariant(document.querySelector('#variant').value);
}catch(error){
  loading.hidden=false;loading.className='error';loading.textContent='模型载入失败，请使用本地 HTTP 服务打开此页。';
  stage.dataset.status='error';console.error('City character prototype:',error);
}
