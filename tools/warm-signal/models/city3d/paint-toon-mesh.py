"""Native mesh materials or a baked body with an original face/camera decal.

Closed low-poly geometry stays unchanged. Solid colors cover the hair/clothes,
eliminating cross-view texture projection. PNG input is never rewritten.
"""
import argparse,bpy,bmesh,hashlib,json,math,struct,sys
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
import numpy as np
p=argparse.ArgumentParser()
for name in ['mesh','front','analysis','output']:p.add_argument('--'+name,type=Path,required=True)
p.add_argument('--base-blend',type=Path)
a=p.parse_args(sys.argv[sys.argv.index('--')+1:]);a.output.mkdir(parents=True,exist_ok=False)
data=json.loads(a.analysis.read_text(encoding='utf-8'));sha=hashlib.sha256(a.front.read_bytes()).hexdigest();assert sha==data['SHA256']
bpy.ops.wm.read_factory_settings(use_empty=True)
if a.base_blend:
    with bpy.data.libraries.load(str(a.base_blend.resolve()),link=False) as (available,requested):
        requested.objects=[name for name in available.objects if name=='TangLi_ReferenceStyle_Prototype']
    for imported in requested.objects:bpy.context.collection.objects.link(imported)
else:bpy.ops.import_scene.gltf(filepath=str(a.mesh.resolve()))
objects=[o for o in bpy.context.scene.objects if o.type=='MESH'];assert len(objects)==1
obj=objects[0];bpy.context.view_layer.objects.active=obj;bpy.ops.object.select_all(action='DESELECT');obj.select_set(True)
bpy.ops.object.transform_apply(location=False,rotation=True,scale=True);obj.name='TangLi_Toon_Material_Prototype'
for poly in obj.data.polygons:poly.use_smooth=True
bm=bmesh.new();bm.from_mesh(obj.data)
report={'sourceMesh':str(a.mesh),'vertices':len(bm.verts),'triangles':len(bm.faces),
        'boundaryEdges':sum(e.is_boundary for e in bm.edges),'nonManifoldEdges':sum(not e.is_manifold for e in bm.edges),
        'rigged':False,'productionReady':False}
bm.free();assert report['boundaryEdges']==0 and report['nonManifoldEdges']==0
coords=[v.co for v in obj.data.vertices]
low=Vector(tuple(min(c[i] for c in coords) for i in range(3)));high=Vector(tuple(max(c[i] for c in coords) for i in range(3)))
center=(low+high)/2;height=high.z-low.z;report['bounds']=[list(low),list(high)]
tree=BVHTree.FromPolygons(coords,[list(poly.vertices) for poly in obj.data.polygons],all_triangles=True)
image=bpy.data.images.load(str(a.front.resolve()),check_existing=True);image.colorspace_settings.name='sRGB'
pixels=np.empty(len(image.pixels),dtype=np.float32);image.pixels.foreach_get(pixels);pixels=pixels.reshape(image.size[1],image.size[0],4)
mask=np.zeros((data['size'][1],data['size'][0]),dtype=bool)
for y,start,end in data['faceRuns']:mask[y,start:end]=True
left,top,right,bottom=data['boundsTopLeft']
def project(co):
    u=(left+(co.x-low.x)/(high.x-low.x)*(right-left))/image.size[0]
    v=1-(bottom-(co.z-low.z)/height*(bottom-top))/image.size[1]
    return u,v
def sample(co):
    u,v=project(co);x=min(image.size[0]-1,max(0,int(u*image.size[0])));y=min(image.size[1]-1,max(0,int(v*image.size[1])))
    return pixels[y,x],bool(mask[image.size[1]-1-y,x])
def visible(co):
    hit,_,_,_=tree.ray_cast(Vector((co.x,low.y-height,co.z)),Vector((0,1,0)))
    return hit is not None and abs(hit.y-co.y)<height*.008
palette={'hair':(.59,.38,.28),'skin':(.98,.78,.66),'coat':(.80,.61,.40),'ivory':(.95,.88,.76),
         'skirt':(.31,.46,.45),'shoe':(.40,.24,.17),'flower':(.99,.76,.65),'gold':(.92,.68,.24),'leaf':(.40,.48,.24)}
def linear(c):return c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4
colors={name:tuple(linear(c) for c in color)+(1,) for name,color in palette.items()}
def region(co):
    v=(co.z-low.z)/height;rgb,face=sample(co);r,g,b,alpha=rgb
    if v>.54:
        if co.x>center.x+height*.15 and v>.71 and co.y<center.y and visible(co):
            if r>.85 and g>.62:return 'gold' if b<.43 else 'flower'
            if g>r*.95 and g>b*1.15:return 'leaf'
        return 'skin' if face and co.y<center.y else 'hair'
    if co.x>center.x+height*.16 and co.y>center.y+height*.04 and v>.265:return 'hair'
    if v>.505 and abs(co.x-center.x)<height*.065:return 'skin'
    if .34<v<.39 and abs(co.x-center.x)>height*.18:return 'ivory'
    if .255<v<.34 and abs(co.x-center.x)>height*.18 and co.y<center.y+height*.035:return 'skin'
    if v>.34:return 'ivory' if abs(co.x-center.x)<height*.085 and co.y<center.y else 'coat'
    if v>.205:return 'skirt'
    if v>.135:return 'skin'
    if v>.078:return 'ivory'
    return 'shoe'

if a.base_blend:
    body=obj.data.materials[0].copy()
    original_uv=obj.data.uv_layers.active.name
    for node in list(body.node_tree.nodes):
        if node.type=='TEX_IMAGE':
            mapping=body.node_tree.nodes.new('ShaderNodeUVMap');mapping.uv_map=original_uv
            body.node_tree.links.new(mapping.outputs[0],node.inputs['Vector'])
else:
    body=bpy.data.materials.new('Matte solid toon colors');body.use_nodes=True
    shader=body.node_tree.nodes.get('Principled BSDF');shader.inputs['Roughness'].default_value=.95;shader.inputs['Specular IOR Level'].default_value=.18
    attribute=body.node_tree.nodes.new('ShaderNodeVertexColor');attribute.layer_name='Toon palette'
    body.node_tree.links.new(attribute.outputs['Color'],shader.inputs['Base Color'])
obj.data.materials.clear();obj.data.materials.append(body)
decal=bpy.data.materials.new('Original face and camera paint');decal.use_nodes=True
shader=decal.node_tree.nodes.get('Principled BSDF');shader.inputs['Roughness'].default_value=.95;shader.inputs['Specular IOR Level'].default_value=.18
tex=decal.node_tree.nodes.new('ShaderNodeTexImage');tex.image=image;decal.node_tree.links.new(tex.outputs['Color'],shader.inputs['Base Color']);obj.data.materials.append(decal)
uv=obj.data.uv_layers.new(name='Original front decal UV')
mapping=decal.node_tree.nodes.new('ShaderNodeUVMap');mapping.uv_map=uv.name
decal.node_tree.links.new(mapping.outputs[0],tex.inputs['Vector'])
color=obj.data.color_attributes.new(name='Toon palette',type='FLOAT_COLOR',domain='CORNER')
counts={'face':0,'camera':0,'body':0}
for poly in obj.data.polygons:
    co=sum((obj.data.vertices[i].co for i in poly.vertices),Vector())/len(poly.vertices)
    rgba,face=sample(co);v=(co.z-low.z)/height
    facial=face and co.y<center.y and poly.normal.y<-.02 and visible(co) and rgba[3]>.95
    camera=.365<v<.455 and abs(co.x-center.x)<height*.13 and co.y<center.y-height*.12 and poly.normal.y<-.15 and rgba[3]>.95
    poly.material_index=1 if facial or camera else 0;counts['face' if facial else 'camera' if camera else 'body']+=1
    for index in poly.loop_indices:
        vertex=obj.data.vertices[obj.data.loops[index].vertex_index].co;uv.data[index].uv=project(vertex)
        color.data[index].color=(1,1,1,1) if poly.material_index or a.base_blend else colors[region(vertex)]

scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=32
scene.render.resolution_x=512;scene.render.resolution_y=768;scene.render.resolution_percentage=100
scene.world=bpy.data.worlds.new('Cream studio');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.65,.61,.55,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.65
for pos,power in [((3,-4,5),350),((-3,-1,3),180),((0,3,4),250)]:
    bpy.ops.object.light_add(type='AREA',location=center+Vector(pos)*height/2);light=bpy.context.object
    light.data.energy=power;light.data.shape='DISK';light.data.size=4;light.rotation_euler=(center-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add();camera=bpy.context.object;scene.camera=camera;camera.data.type='ORTHO';camera.data.ortho_scale=height*1.18
for name,angle in [('front',0),('left',math.pi/2),('back',math.pi),('right',-math.pi/2),('three-quarter-left',math.pi/4),('three-quarter-right',-math.pi/4)]:
    camera.location=center+Vector((math.sin(angle)*3,-math.cos(angle)*3,0))*height
    camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=str(a.output/(name+'.png'));bpy.ops.render.render(write_still=True)
bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
bpy.ops.export_scene.gltf(filepath=str(a.output/'character.glb'),export_format='GLB',use_selection=True,export_animations=False)
raw=(a.output/'character.glb').read_bytes();length=struct.unpack_from('<I',raw,12)[0];gltf=json.loads(raw[20:20+length])
report['exportedTriangles']=sum(gltf['accessors'][p['indices']]['count']//3 for m in gltf['meshes'] for p in m['primitives'])
assert report['triangles']==report['exportedTriangles']
image.pack();bpy.ops.wm.save_as_mainfile(filepath=str(a.output/'character-review.blend'))
report.update(textureProjection=('two-view baked body plus full-resolution original face/camera decal' if a.base_blend else 'native solid vertex colors; original full-resolution PNG only on visible face/camera polygons'),materialTriangles=counts,
              textures=[{'path':str(a.front),'SHA256':sha,'unchanged':sha==hashlib.sha256(a.front.read_bytes()).hexdigest(),'size':list(image.size)}])
if a.base_blend:report['bodyMaterialSource']=str(a.base_blend)
(a.output/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report),flush=True)
