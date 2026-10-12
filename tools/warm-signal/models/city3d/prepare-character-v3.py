"""Headless Blender geometry cleanup and original-image UV projection.

Original images remain unchanged. A Blender shader smoothly blends front/back
projections with side materials, then renders that shader into a new UV atlas.
This is a 3D material bake, not hand painting or editing the source PNGs.
"""
import argparse, bpy, bmesh, hashlib, json, math, sys
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import numpy as np

parser=argparse.ArgumentParser()
parser.add_argument('--mesh',type=Path,required=True)
parser.add_argument('--front',type=Path,required=True)
parser.add_argument('--back',type=Path,required=True)
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
boundary=[e for e in bm.edges if e.is_boundary]
if boundary:bmesh.ops.holes_fill(bm,edges=boundary,sides=6)
bmesh.ops.triangulate(bm,faces=[f for f in bm.faces if len(f.verts)>3])
bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
bm.to_mesh(obj.data);obj.data.update()
bm.clear();bm.from_mesh(obj.data)
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
    images.append((image,bounds,path,hashlib.sha256(path.read_bytes()).hexdigest()))
    return len(obj.data.materials)-1
obj.data.materials.clear()
texture(args.front,'Original front texture')
if args.back:texture(args.back,'Original back texture')
for index,name in enumerate(['Front projection','Back projection']):
    uv=obj.data.uv_layers.new(name=name)
    image,bounds,_,_=images[index];left,bottom,right,top=bounds
    for loop in obj.data.loops:
        co=obj.data.vertices[loop.vertex_index].co
        u=(co.x-low.x)/(high.x-low.x)
        if index==1:u=1-u
        v=(co.z-low.z)/height
        uv.data[loop.index].uv=((left+u*(right-left))/image.size[0],(bottom+v*(top-bottom))/image.size[1])

def linear(value):return value/12.92 if value<=.04045 else ((value+.055)/1.055)**2.4
palette={'hair':(.62,.40,.30),'skin':(.98,.76,.63),'coat':(.80,.61,.40),
         'skirt':(.34,.49,.49),'cream':(.95,.88,.76),'shoe':(.42,.25,.18)}
colors=obj.data.color_attributes.new(name='Side palette',type='FLOAT_COLOR',domain='POINT')
front_visibility=obj.data.attributes.new(name='Front visibility',type='FLOAT',domain='POINT')
back_visibility=obj.data.attributes.new(name='Back visibility',type='FLOAT',domain='POINT')
tree=BVHTree.FromPolygons([v.co for v in obj.data.vertices],[list(p.vertices) for p in obj.data.polygons],all_triangles=True)
for vertex in obj.data.vertices:
    co=vertex.co;v=(co.z-low.z)/height
    for attribute,direction in [(front_visibility,1),(back_visibility,-1)]:
        origin=Vector((co.x,low.y-height if direction==1 else high.y+height,co.z))
        hit,_,_,_=tree.ray_cast(origin,Vector((0,direction,0)))
        attribute.data[vertex.index].value=1 if hit is not None and abs(hit.y-co.y)<height*.012 else 0
    if v>.54:
        name='skin' if co.y<center.y-height*.10 and v<.71 else 'hair'
    elif co.x>center.x+height*.16 and co.y>center.y+height*.05 and v>.26:name='hair'
    elif v>.27 and v<.395 and abs(co.x-center.x)>height*.19:name='skin'
    elif v>.345:name='coat'
    elif v>.205:name='skirt'
    elif v>.135:name='skin'
    elif v>.078:name='cream'
    else:name='shoe'
    colors.data[vertex.index].color=tuple(linear(c) for c in palette[name])+(1,)

# Smooth normal weights remove per-triangle material switches. Explicit UV maps
# stay stable while a separate smart UV unwrap receives the rendered material.
material=bpy.data.materials.new('Smooth multiview projection bake');material.use_nodes=True
nodes=material.node_tree.nodes;links=material.node_tree.links;nodes.clear()
output=nodes.new('ShaderNodeOutputMaterial');emission=nodes.new('ShaderNodeEmission')
links.new(emission.outputs[0],output.inputs['Surface'])
base=nodes.new('ShaderNodeVertexColor');base.layer_name='Side palette'
normal=nodes.new('ShaderNodeNewGeometry');split=nodes.new('ShaderNodeSeparateXYZ')
links.new(normal.outputs['Normal'],split.inputs[0])
color=base.outputs['Color']
for index,name in enumerate(['Front projection','Back projection']):
    image_node=nodes.new('ShaderNodeTexImage');image_node.image=images[index][0]
    uv_node=nodes.new('ShaderNodeUVMap');uv_node.uv_map=name;links.new(uv_node.outputs[0],image_node.inputs['Vector'])
    weight=nodes.new('ShaderNodeMapRange');weight.clamp=True
    links.new(split.outputs['Y'],weight.inputs['Value'])
    weight.inputs['From Min'].default_value=-.12 if index==0 else .12
    weight.inputs['From Max'].default_value=-.72 if index==0 else .72
    multiply=nodes.new('ShaderNodeMath');multiply.operation='MULTIPLY'
    links.new(weight.outputs[0],multiply.inputs[0]);links.new(image_node.outputs['Alpha'],multiply.inputs[1])
    visibility=nodes.new('ShaderNodeAttribute');visibility.attribute_name='Front visibility' if index==0 else 'Back visibility'
    visible_weight=nodes.new('ShaderNodeMath');visible_weight.operation='MULTIPLY'
    links.new(multiply.outputs[0],visible_weight.inputs[0]);links.new(visibility.outputs['Fac'],visible_weight.inputs[1])
    mix=nodes.new('ShaderNodeMixRGB');mix.blend_type='MIX'
    links.new(visible_weight.outputs[0],mix.inputs[0]);links.new(color,mix.inputs[1]);links.new(image_node.outputs['Color'],mix.inputs[2])
    color=mix.outputs[0]
links.new(color,emission.inputs['Color'])
obj.data.materials.clear();obj.data.materials.append(material)
for poly in obj.data.polygons:poly.material_index=0
bake_uv=obj.data.uv_layers.new(name='Baked atlas UV');obj.data.uv_layers.active=bake_uv
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=math.radians(66),island_margin=.018)
bpy.ops.object.mode_set(mode='OBJECT')
baked=bpy.data.images.new('TangLi multiview baked albedo',width=2048,height=2048,alpha=True)
baked.colorspace_settings.name='sRGB'
target=nodes.new('ShaderNodeTexImage');target.image=baked;nodes.active=target
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=1
scene.render.bake.margin=12
bpy.ops.object.bake(type='EMIT')
baked.filepath_raw=str(args.output/'albedo-baked.png');baked.file_format='PNG';baked.save();baked.pack()
# Remove construction UV sets; export one conventional TEXCOORD_0 atlas.
obj.data.uv_layers.remove(obj.data.uv_layers['Front projection'])
obj.data.uv_layers.remove(obj.data.uv_layers['Back projection'])
obj.data.color_attributes.remove(colors)
obj.data.attributes.remove(front_visibility);obj.data.attributes.remove(back_visibility)
final=bpy.data.materials.new('TangLi baked warm matte');final.use_nodes=True
shader=final.node_tree.nodes.get('Principled BSDF');shader.inputs['Roughness'].default_value=.88
tex=final.node_tree.nodes.new('ShaderNodeTexImage');tex.image=baked
final.node_tree.links.new(tex.outputs['Color'],shader.inputs['Base Color'])
obj.data.materials.clear();obj.data.materials.append(final)
report['textureProjection']='Blender EMIT UV bake of occlusion-tested smooth normal-weighted front/back projections and solid side palette; not an AI texture model'
report['bakedTexture']={'path':str(args.output/'albedo-baked.png'),'size':[2048,2048]}
report['textures']=[{'path':str(p),'SHA256':sha,'bounds':bounds,'unchanged':sha==hashlib.sha256(p.read_bytes()).hexdigest()} for image,bounds,p,sha in images]
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
for image,_,_,_ in images:image.pack()
bpy.ops.wm.save_as_mainfile(filepath=str(args.output/'character-review.blend'))
(args.output/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report),flush=True)
