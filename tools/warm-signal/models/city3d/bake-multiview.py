"""Bake original orthographic views onto a closed mesh in fresh headless Blender.

Only UVs/materials change: the topology-preserving low-poly input is not remeshed.
Source PNG files remain byte-for-byte unchanged. This is native 3D shader baking,
not bitmap painting, nor the Hunyuan texture-generation model.
"""
import argparse, bpy, bmesh, hashlib, json, math, struct, sys
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import numpy as np

p=argparse.ArgumentParser()
for name in ['mesh','front','back','output']:p.add_argument('--'+name,type=Path,required=True)
for name in ['left','right']:p.add_argument('--'+name,type=Path)
a=p.parse_args(sys.argv[sys.argv.index('--')+1:]);a.output.mkdir(parents=True,exist_ok=False)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(a.mesh.resolve()))
objects=[o for o in bpy.context.scene.objects if o.type=='MESH'];assert len(objects)==1
obj=objects[0];bpy.context.view_layer.objects.active=obj
bpy.ops.object.select_all(action='DESELECT');obj.select_set(True)
bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
obj.name='TangLi_ReferenceStyle_Prototype'
for poly in obj.data.polygons:poly.use_smooth=True
bm=bmesh.new();bm.from_mesh(obj.data)
report={'sourceMesh':str(a.mesh),'sourceSHA256':hashlib.sha256(a.mesh.read_bytes()).hexdigest(),
        'vertices':len(bm.verts),'triangles':len(bm.faces),
        'boundaryEdges':sum(e.is_boundary for e in bm.edges),
        'nonManifoldEdges':sum(not e.is_manifold for e in bm.edges),
        'rigged':False,'productionReady':False}
bm.free()
assert report['boundaryEdges']==0 and report['nonManifoldEdges']==0,'Do not silently bake an open mesh.'
coords=[v.co for v in obj.data.vertices]
low=Vector(tuple(min(co[i] for co in coords) for i in range(3)))
high=Vector(tuple(max(co[i] for co in coords) for i in range(3)))
center=(low+high)/2;height=high.z-low.z
report['bounds']=[list(low),list(high)]
tree=BVHTree.FromPolygons(coords,[list(poly.vertices) for poly in obj.data.polygons],all_triangles=True)

# Camera-right axes match orthographic camera coordinates in Blender Z-up space.
views=[('front',a.front,Vector((0,-1,0)),0,1),('back',a.back,Vector((0,1,0)),0,-1)]
if a.left:views.append(('left',a.left,Vector((1,0,0)),1,1))
if a.right:views.append(('right',a.right,Vector((-1,0,0)),1,-1))
sources=[]
for name,path,direction,horizontal,sign in views:
    image=bpy.data.images.load(str(path.resolve()),check_existing=True);image.colorspace_settings.name='sRGB'
    pixels=np.empty(len(image.pixels),dtype=np.float32);image.pixels.foreach_get(pixels)
    alpha=pixels.reshape(image.size[1],image.size[0],4)[:,:,3]
    yy,xx=np.where(alpha>.5);bounds=(int(xx.min()),int(yy.min()),int(xx.max())+1,int(yy.max())+1)
    uv=obj.data.uv_layers.new(name=name+' projection')
    for loop in obj.data.loops:
        co=obj.data.vertices[loop.vertex_index].co
        u=(co[horizontal]-low[horizontal])/(high[horizontal]-low[horizontal])
        if sign<0:u=1-u
        v=(co.z-low.z)/height
        uv.data[loop.index].uv=((bounds[0]+u*(bounds[2]-bounds[0]))/image.size[0],(bounds[1]+v*(bounds[3]-bounds[1]))/image.size[1])
    visibility=obj.data.attributes.new(name=name+' visibility',type='FLOAT',domain='POINT')
    axis=0 if direction.x else 1;outward=direction[axis]
    for vertex in obj.data.vertices:
        co=vertex.co;origin=co.copy();origin[axis]=(high[axis]+height) if outward>0 else (low[axis]-height)
        hit,_,_,_=tree.ray_cast(origin,-direction)
        visibility.data[vertex.index].value=1 if hit is not None and abs(hit[axis]-co[axis])<height*.008 else 0
    sources.append({'name':name,'image':image,'path':path,'SHA256':hashlib.sha256(path.read_bytes()).hexdigest(),
                    'bounds':bounds,'direction':direction,'axis':axis,'sign':outward})

def linear(value):return value/12.92 if value<=.04045 else ((value+.055)/1.055)**2.4
palette={'hair':(.60,.41,.34),'skin':(.98,.79,.69),'coat':(.84,.65,.45),
         'skirt':(.36,.48,.47),'cream':(.96,.90,.80),'shoe':(.43,.28,.23)}
colors=obj.data.color_attributes.new(name='Hidden surface palette',type='FLOAT_COLOR',domain='POINT')
for vertex in obj.data.vertices:
    co=vertex.co;v=(co.z-low.z)/height
    if v>.51:name='hair'
    elif co.x>center.x+height*.16 and co.y>center.y+height*.05 and v>.25:name='hair'
    elif v>.26 and v<.35 and abs(co.x-center.x)>height*.18:name='skin'
    elif v>.33:name='coat'
    elif v>.18:name='skirt'
    elif v>.125:name='skin'
    elif v>.07:name='cream'
    else:name='shoe'
    colors.data[vertex.index].color=tuple(linear(c) for c in palette[name])+(1,)

mat=bpy.data.materials.new('Four-view projection bake');mat.use_nodes=True
nodes=mat.node_tree.nodes;links=mat.node_tree.links;nodes.clear()
def mathnode(operation,*values):
    n=nodes.new('ShaderNodeMath');n.operation=operation
    for i,value in enumerate(values):
        if isinstance(value,(int,float)):n.inputs[i].default_value=value
        else:links.new(value,n.inputs[i])
    return n.outputs[0]
def vectornode(operation,*values):
    n=nodes.new('ShaderNodeVectorMath');n.operation=operation
    for i,value in enumerate(values):links.new(value,n.inputs[3 if operation=='SCALE' and i==1 else i])
    return n.outputs[0]
base=nodes.new('ShaderNodeVertexColor');base.layer_name='Hidden surface palette'
epsilon=nodes.new('ShaderNodeValue');epsilon.outputs[0].default_value=.001
sum_color=vectornode('SCALE',base.outputs['Color'],epsilon.outputs[0]);sum_weight=epsilon.outputs[0]
geometry=nodes.new('ShaderNodeNewGeometry');xyz=nodes.new('ShaderNodeSeparateXYZ')
links.new(geometry.outputs['Normal'],xyz.inputs[0])
for source in sources:
    name=source['name'];uv=nodes.new('ShaderNodeUVMap');uv.uv_map=name+' projection'
    tex=nodes.new('ShaderNodeTexImage');tex.image=source['image'];links.new(uv.outputs[0],tex.inputs['Vector'])
    visibility=nodes.new('ShaderNodeAttribute');visibility.attribute_name=name+' visibility'
    cosine=mathnode('MAXIMUM',mathnode('MULTIPLY',xyz.outputs[source['axis']],source['sign']),0)
    weight=mathnode('MULTIPLY',mathnode('POWER',cosine,6),mathnode('MULTIPLY',visibility.outputs['Fac'],tex.outputs['Alpha']))
    sum_weight=mathnode('ADD',sum_weight,weight)
    sum_color=vectornode('ADD',sum_color,vectornode('SCALE',tex.outputs['Color'],weight))
color=vectornode('SCALE',sum_color,mathnode('DIVIDE',1,sum_weight))
emission=nodes.new('ShaderNodeEmission');output=nodes.new('ShaderNodeOutputMaterial')
links.new(color,emission.inputs['Color']);links.new(emission.outputs[0],output.inputs['Surface'])
obj.data.materials.clear();obj.data.materials.append(mat)
for poly in obj.data.polygons:poly.material_index=0
uv=obj.data.uv_layers.new(name='Baked atlas UV');obj.data.uv_layers.active=uv
bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=math.radians(66),island_margin=.018)
bpy.ops.object.mode_set(mode='OBJECT')
image=bpy.data.images.new('TangLi four-view albedo',width=2048,height=2048,alpha=True)
image.colorspace_settings.name='sRGB'
target=nodes.new('ShaderNodeTexImage');target.image=image;nodes.active=target
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=1
scene.render.bake.margin=12;bpy.ops.object.bake(type='EMIT')
image.filepath_raw=str(a.output/'albedo-baked.png');image.file_format='PNG';image.save();image.pack()
for source in sources:
    obj.data.uv_layers.remove(obj.data.uv_layers[source['name']+' projection'])
    obj.data.attributes.remove(obj.data.attributes[source['name']+' visibility'])
obj.data.color_attributes.remove(obj.data.color_attributes['Hidden surface palette'])
final=bpy.data.materials.new('TangLi reference matte');final.use_nodes=True
shader=final.node_tree.nodes.get('Principled BSDF');shader.inputs['Roughness'].default_value=.95
shader.inputs['Specular IOR Level'].default_value=.18
tex=final.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image
final.node_tree.links.new(tex.outputs['Color'],shader.inputs['Base Color'])
obj.data.materials.clear();obj.data.materials.append(final)
scene.cycles.samples=32;scene.render.resolution_x=512;scene.render.resolution_y=768
scene.render.resolution_percentage=100;scene.world=bpy.data.worlds.new('Cream studio');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.65,.61,.55,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.65
for position,power in [((3,-4,5),350),((-3,-1,3),180),((0,3,4),250)]:
    bpy.ops.object.light_add(type='AREA',location=center+Vector(position)*height/2)
    light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=4
    light.rotation_euler=(center-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add();camera=bpy.context.object;scene.camera=camera
camera.data.type='ORTHO';camera.data.ortho_scale=height*1.18
for name,angle in [('front',0),('left',math.pi/2),('back',math.pi),('right',-math.pi/2),('three-quarter-left',math.pi/4),('three-quarter-right',-math.pi/4)]:
    camera.location=center+Vector((math.sin(angle)*3,-math.cos(angle)*3,0))*height
    camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(a.output/(name+'.png'));bpy.ops.render.render(write_still=True)
bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
bpy.ops.export_scene.gltf(filepath=str(a.output/'character.glb'),export_format='GLB',use_selection=True,export_animations=False)
data=(a.output/'character.glb').read_bytes();length=struct.unpack_from('<I',data,12)[0]
gltf=json.loads(data[20:20+length]);report['exportedTriangles']=sum(gltf['accessors'][prim['indices']]['count']//3 for mesh in gltf['meshes'] for prim in mesh['primitives'])
assert report['triangles']==report['exportedTriangles'],'Report actual exported geometry, not an estimated budget.'
for source in sources:source['image'].pack()
bpy.ops.wm.save_as_mainfile(filepath=str(a.output/'character-review.blend'))
report['textureProjection']=f'normalized cosine^6, visibility-tested {len(sources)}-view Blender EMIT shader bake'
report['bakedTexture']={'size':[2048,2048],'path':str(a.output/'albedo-baked.png')}
report['textures']=[{'name':s['name'],'path':str(s['path']),'SHA256':s['SHA256'],'bounds':s['bounds'],
                     'unchanged':s['SHA256']==hashlib.sha256(s['path'].read_bytes()).hexdigest()} for s in sources]
report['sourceUnchanged']=report['sourceSHA256']==hashlib.sha256(a.mesh.read_bytes()).hexdigest()
(a.output/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report),flush=True)
