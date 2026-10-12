"""Headless Blender geometry cleanup and original-image UV projection.

Images are read as textures and remain unchanged. No bitmap painting, cropping or
rewriting is performed. Guarded front/back projection uses solid materials on
grazing angles and transparent pixels. This remains an unrigged prototype.
"""
import argparse, bpy, bmesh, hashlib, json, math, sys
from pathlib import Path
from mathutils import Vector
import numpy as np

parser=argparse.ArgumentParser()
parser.add_argument('--mesh',type=Path,required=True)
parser.add_argument('--front',type=Path,required=True)
parser.add_argument('--back',type=Path)
parser.add_argument('--output',type=Path,required=True)
parser.add_argument('--voxel',type=float,default=.024)
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:])
args.output.mkdir(parents=True,exist_ok=False)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(args.mesh.resolve()))
objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
assert objects
bpy.ops.object.select_all(action='DESELECT')
for o in objects:o.select_set(True)
bpy.context.view_layer.objects.active=objects[0]
bpy.ops.object.join()
obj=bpy.context.object
bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
obj.name='TangLi_Compact_Prototype'
report={'sourceMesh':str(args.mesh),'sourceSHA256':hashlib.sha256(args.mesh.read_bytes()).hexdigest(),
        'originalVertices':len(obj.data.vertices),'originalFaces':len(obj.data.polygons),
        'voxel':args.voxel,'rigged':False,'productionReady':False}
mod=obj.modifiers.new('Seal fine gaps','REMESH');mod.mode='VOXEL';mod.voxel_size=args.voxel;mod.use_smooth_shade=True
bpy.ops.object.modifier_apply(modifier=mod.name)
mod=obj.modifiers.new('Relax voxel surface','SMOOTH');mod.factor=.6;mod.iterations=3
bpy.ops.object.modifier_apply(modifier=mod.name)
mod=obj.modifiers.new('Reduce prototype budget','DECIMATE');mod.ratio=min(1,24000/max(1,len(obj.data.polygons)*2))
bpy.ops.object.modifier_apply(modifier=mod.name)
mod=obj.modifiers.new('Explicit triangles','TRIANGULATE')
bpy.ops.object.modifier_apply(modifier=mod.name)
for polygon in obj.data.polygons:polygon.use_smooth=True
bm=bmesh.new();bm.from_mesh(obj.data)
report.update(vertices=len(bm.verts),triangles=len(bm.faces),boundaryEdges=sum(e.is_boundary for e in bm.edges),nonManifoldEdges=sum(not e.is_manifold for e in bm.edges))
bm.free()
points=[v.co for v in obj.data.vertices]
low=Vector(tuple(min(p[i] for p in points) for i in range(3)))
high=Vector(tuple(max(p[i] for p in points) for i in range(3)))
height=high.z-low.z;center=(low+high)/2
report['bounds']=[list(low),list(high)]
images=[]
def texture(path,name):
    image=bpy.data.images.load(str(path.resolve()),check_existing=True)
    image.colorspace_settings.name='sRGB'
    pixels=np.empty(len(image.pixels),dtype=np.float32);image.pixels.foreach_get(pixels)
    alpha=pixels.reshape(image.size[1],image.size[0],4)[:,:,3]
    yy,xx=np.where(alpha>.5)
    bounds=(int(xx.min()),int(yy.min()),int(xx.max())+1,int(yy.max())+1)
    assert bounds[2]>bounds[0] and bounds[3]>bounds[1]
    material=bpy.data.materials.new(name);material.use_nodes=True
    shader=material.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Roughness'].default_value=.82
    node=material.node_tree.nodes.new('ShaderNodeTexImage');node.image=image;node.extension='EXTEND'
    material.node_tree.links.new(node.outputs['Color'],shader.inputs['Base Color'])
    obj.data.materials.append(material)
    images.append((image,bounds,path,hashlib.sha256(path.read_bytes()).hexdigest(),pixels.reshape(image.size[1],image.size[0],4)))
    return len(obj.data.materials)-1
obj.data.materials.clear()
texture(args.front,'Original front texture')
if args.back:texture(args.back,'Original back texture')
palette={
    'hair':(.32,.14,.075,1),'skin':(.92,.61,.43,1),
    'coat':(.67,.39,.19,1),'skirt':(.13,.27,.28,1),
    'cream':(.91,.81,.65,1),'shoe':(.23,.105,.055,1),
}
indices={}
for name,color in palette.items():
    material=bpy.data.materials.new('Side '+name);material.use_nodes=True
    shader=material.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value=color;shader.inputs['Roughness'].default_value=.88
    indices[name]=len(obj.data.materials);obj.data.materials.append(material)

def projection(co,index):
    image,bounds,_,_,pixels=images[index];left,bottom,right,top=bounds
    u=(co.x-low.x)/(high.x-low.x)
    if index==1:u=1-u
    v=(co.z-low.z)/height
    return ((left+u*(right-left))/image.size[0],(bottom+v*(top-bottom))/image.size[1])

def sample(co,index):
    u,v=projection(co,index);image,_,_,_,pixels=images[index]
    return pixels[min(image.size[1]-1,max(0,int(v*image.size[1]))),min(image.size[0]-1,max(0,int(u*image.size[0])))]

def side_material(co,index):
    v=(co.z-low.z)/height;r,g,b,a=sample(co,index)
    if v>.54:
        name='skin' if co.y<center.y and v<.7 and a>.8 and r>g*1.2 and g>b*1.2 and r>.65 else 'hair'
    elif a>.8 and r>g*1.4 and g>b*1.2 and r<.72 and abs(co.x-center.x)>height*.14:
        name='hair' # Low ponytail, rather than an extension of the coat.
    elif v>.345:name='coat'
    elif v>.205:name='skirt'
    elif v>.135:name='skin'
    elif v>.078:name='cream'
    else:name='shoe'
    return indices[name]

uv=obj.data.uv_layers.new(name='Projected prototype UV')
guarded=0
for poly in obj.data.polygons:
    index=1 if args.back and poly.normal.y>0 else 0
    center_co=sum((obj.data.vertices[i].co for i in poly.vertices),Vector())/len(poly.vertices)
    probes=[sample(obj.data.vertices[i].co,index)[3] for i in poly.vertices]+[sample(center_co,index)[3]]
    if abs(poly.normal.y)<.6 or min(probes)<.95:
        poly.material_index=side_material(center_co,index);guarded+=1
    else:poly.material_index=index
    for loopindex in poly.loop_indices:
        co=obj.data.vertices[obj.data.loops[loopindex].vertex_index].co
        uv.data[loopindex].uv=projection(co,index)
report['guardedTriangles']=guarded
report['textureProjection']='guarded front/back planar; solid side materials; visible seams remain prototype limitations'
report['textures']=[{'path':str(p),'SHA256':sha,'bounds':bounds,'unchanged':sha==hashlib.sha256(p.read_bytes()).hexdigest()} for image,bounds,p,sha,_ in images]
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=32
scene.render.resolution_x=512;scene.render.resolution_y=768;scene.render.resolution_percentage=100
scene.world=bpy.data.worlds.new('Cream studio');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.65,.61,.55,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.65
for pos,power in [((3,-4,5),350),((-3,-1,3),180),((0,3,4),250)]:
    bpy.ops.object.light_add(type='AREA',location=center+Vector(pos)*height/2)
    light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=4
    light.rotation_euler=(center-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add();camera=bpy.context.object;scene.camera=camera
camera.data.type='ORTHO';camera.data.ortho_scale=height*1.18
for name,angle in [('front',0),('side',math.pi/2),('back',math.pi),('three-quarter',math.pi/4)]:
    camera.location=center+Vector((math.sin(angle)*3,-math.cos(angle)*3,.04))*height
    camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(args.output/(name+'.png'));bpy.ops.render.render(write_still=True)
bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
bpy.ops.export_scene.gltf(filepath=str(args.output/'character.glb'),export_format='GLB',use_selection=True,export_animations=False)
for image,_,_,_,_ in images:image.pack()
bpy.ops.wm.save_as_mainfile(filepath=str(args.output/'character-review.blend'))
(args.output/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report),flush=True)
