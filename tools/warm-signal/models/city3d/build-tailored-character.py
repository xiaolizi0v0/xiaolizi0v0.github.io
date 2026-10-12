"""Rebuild Tang Li's clothing and limbs as native, separately editable meshes.

The accepted v4 head/face is retained and capped after a horizontal cut. Source
PNGs are never painted or rewritten. Run only in a fresh headless Blender scene.
"""
import argparse, bpy, bmesh, hashlib, json, math, struct, sys
from pathlib import Path
from mathutils import Vector

p=argparse.ArgumentParser()
p.add_argument('--source-blend',type=Path,required=True)
p.add_argument('--front',type=Path,required=True)
p.add_argument('--output',type=Path,required=True)
a=p.parse_args(sys.argv[sys.argv.index('--')+1:])
a.output.mkdir(parents=True,exist_ok=False)
source_sha=hashlib.sha256(a.front.read_bytes()).hexdigest()
bpy.ops.wm.read_factory_settings(use_empty=True)
with bpy.data.libraries.load(str(a.source_blend.resolve()),link=False) as (available,requested):
    requested.objects=[n for n in available.objects if n=='TangLi_Toon_Material_Prototype']
assert len(requested.objects)==1
head=requested.objects[0];bpy.context.collection.objects.link(head)
bpy.context.view_layer.objects.active=head;head.select_set(True)
bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
head.name='TangLi / retained sculpted head'
bm=bmesh.new();bm.from_mesh(head.data)
def head_edge(co):
    rear=max(0,min(1,(co.y+.30)/.20))
    return .030+.050*rear+.140*(abs(co.x)/.60)**4
for vertex in bm.verts:vertex.co.z-=head_edge(vertex.co)
bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=1e-6,
                      plane_co=(0,0,0),plane_no=(0,0,1),clear_inner=True)
for vertex in bm.verts:vertex.co.z+=head_edge(vertex.co)
bmesh.ops.holes_fill(bm,edges=[e for e in bm.edges if e.is_boundary],sides=0)
bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(head.data);bm.free()
head.data.update()
# Light Taubin smoothing on the side/back only; the original face stays fixed.
neighbors=[set() for _ in head.data.vertices]
for edge in head.data.edges:
    i,j=edge.vertices;neighbors[i].add(j);neighbors[j].add(i)
weights=[max(0,min(1,(v.normal.y+.70)/.60)) for v in head.data.vertices]
for i,v in enumerate(head.data.vertices):
    if v.co.z<.19 and v.co.y<-.18 and abs(v.co.x)<.30:weights[i]=.65
positions=[v.co.copy() for v in head.data.vertices]
for _ in range(2):
    for factor in [.25,-.265]:
        updated=[]
        for i,co in enumerate(positions):
            adjacent=neighbors[i]
            average=sum((positions[j] for j in adjacent),Vector())/len(adjacent) if adjacent else co
            updated.append(co+(average-co)*factor*weights[i])
        positions=updated
for vertex,co in zip(head.data.vertices,positions):vertex.co=co
head.data.update()

def linear(c):return c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4
def material(name,color,roughness=.85,metallic=0):
    m=bpy.data.materials.new(name);m.use_nodes=True
    shader=m.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value=tuple(linear(c) for c in color)+(1,)
    shader.inputs['Roughness'].default_value=roughness
    shader.inputs['Metallic'].default_value=metallic
    shader.inputs['Specular IOR Level'].default_value=.18
    return m
mats={
    'hair':material('Chestnut / matte hair',(.60,.39,.29)),
    'skin':material('Peach / skin',(.99,.86,.77)),
    'coat':material('Camel / tailored coat',(.82,.64,.44)),
    'seam':material('Camel / soft seams',(.72,.54,.36)),
    'ivory':material('Ivory / blouse and socks',(.97,.92,.83)),
    'skirt':material('Teal / pleated skirt',(.30,.46,.45)),
    'shoe':material('Chestnut / shoes and strap',(.40,.25,.19)),
    'sole':material('Cocoa / soles',(.28,.19,.15)),
    'camera':material('Camera / brown leather',(.40,.29,.23)),
    'silver':material('Camera / satin silver',(.75,.75,.70),.55,.25),
    'glass':material('Camera / lens',(.09,.14,.16),.3),
    'gold':material('Buttons / warm brass',(.82,.64,.39),.65,.1),
}
# Replace grazing-view projection residues with native hair shading. Painted
# front hair and the separate original face material remain available.
body=head.data.materials[0].copy();body.name='Retained hair / clean side blend'
shader=body.node_tree.nodes.get('Principled BSDF');base=shader.inputs['Base Color']
original=base.links[0].from_socket
mix=body.node_tree.nodes.new('ShaderNodeMixRGB');mix.blend_type='MIX'
mix.inputs[2].default_value=tuple(linear(c) for c in (.60,.39,.29))+(1,)
attribute=body.node_tree.nodes.new('ShaderNodeVertexColor');attribute.layer_name='Hair side cleanup'
body.node_tree.links.new(attribute.outputs['Color'],mix.inputs[0])
body.node_tree.links.new(original,mix.inputs[1]);body.node_tree.links.new(mix.outputs[0],base)
head.data.materials[0]=body
head.data.materials.append(mats['skin'])
attr=head.data.color_attributes.new(name='Hair side cleanup',type='FLOAT_COLOR',domain='CORNER')
for poly in head.data.polygons:
    poly.use_smooth=True
    co=poly.center
    if poly.material_index==0 and co.z<.14 and abs(co.x)<.11 and co.y<-.13:poly.material_index=2
    if poly.material_index==1 and co.z<.13:poly.material_index=2
    for i in poly.loop_indices:
        vertex=head.data.vertices[head.data.loops[i].vertex_index]
        # Front is -Y. Blend over the quarter view, completely clean the side.
        amount=max(0,min(1,(vertex.co.y+.27)/.17))
        flower=((vertex.co.x-.43)/.15)**2+((vertex.co.y+.25)/.20)**2+((vertex.co.z-.66)/.15)**2<1
        if flower:amount=0
        if vertex.co.z<.14:amount=1
        attr.data[i].color=(amount,amount,amount,1)

def finish(obj,name,mat,smooth=True):
    obj.name='TangLi / '+name;obj.data.materials.clear();obj.data.materials.append(mat)
    for poly in obj.data.polygons:poly.use_smooth=smooth
    return obj
def mesh(name,vertices,faces,mat,smooth=True):
    data=bpy.data.meshes.new(name);data.from_pydata(vertices,[],faces);data.update()
    obj=bpy.data.objects.new('TangLi / '+name,data);bpy.context.collection.objects.link(obj)
    return finish(obj,name,mat,smooth)
def ellipsoid(name,center,scale,mat,segments=24,rings=12):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=center)
    obj=bpy.context.object;obj.scale=scale;return finish(obj,name,mat)
def rounded_box(name,center,size,mat,bevel=.02):
    bpy.ops.mesh.primitive_cube_add(size=1,location=center);obj=bpy.context.object;obj.scale=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    modifier=obj.modifiers.new('Rounded edges','BEVEL');modifier.width=bevel;modifier.segments=3
    bpy.context.view_layer.objects.active=obj;bpy.ops.object.modifier_apply(modifier=modifier.name)
    modifier=obj.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    return finish(obj,name,mat)
def limb(name,start,end,radii,mat):
    start,end=Vector(start),Vector(end);obj=ellipsoid(name,(start+end)/2,(radii[0],radii[1],(end-start).length/2+radii[0]*.45),mat)
    obj.rotation_euler=(end-start).to_track_quat('Z','Y').to_euler();return obj
def tube(name,points,radius,mat):
    curve=bpy.data.curves.new(name,'CURVE');curve.dimensions='3D';curve.resolution_u=12
    spline=curve.splines.new('BEZIER');spline.bezier_points.add(len(points)-1)
    for point,co in zip(spline.bezier_points,points):
        point.co=co;point.handle_left_type='AUTO';point.handle_right_type='AUTO'
    curve.bevel_depth=radius;curve.bevel_resolution=3;curve.use_fill_caps=True
    obj=bpy.data.objects.new('TangLi / '+name,curve);bpy.context.collection.objects.link(obj)
    bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
    bpy.ops.object.convert(target='MESH');return finish(bpy.context.object,name,mat)

ellipsoid('neck',(0,.005,.061),(.071,.070,.115),mats['skin'])
ellipsoid('blouse',(0,.018,-.144),(.177,.131,.215),mats['ivory'])
# An open-front coat with a real, closed thickness rather than color projection.
profiles=[(-.327,.216,.150),(-.285,.198,.145),(-.100,.219,.155),(.020,.170,.115)]
steps=48;vertices=[]
for inner in [False,True]:
    for z,rx,ry in profiles:
        for i in range(steps+1):
            theta=.36+(2*math.pi-.72)*i/steps;thickness=.009 if inner else 0
            vertices.append(((rx-thickness)*math.sin(theta),-(ry-thickness)*math.cos(theta),z))
layer=len(profiles)*(steps+1);faces=[]
for side in range(2):
    offset=side*layer
    for row in range(len(profiles)-1):
        for i in range(steps):
            q=(offset+row*(steps+1)+i,offset+row*(steps+1)+i+1,offset+(row+1)*(steps+1)+i+1,offset+(row+1)*(steps+1)+i)
            faces.append(q if side==0 else q[::-1])
for row in [0,len(profiles)-1]:
    for i in range(steps):
        j=row*(steps+1)+i;faces.append((j,j+layer,j+1+layer,j+1))
for i in [0,steps]:
    for row in range(len(profiles)-1):
        j=row*(steps+1)+i;k=j+steps+1;faces.append((j,k,k+layer,j+layer))
coat=mesh('open coat shell',vertices,faces,mats['coat'])
# Closed pleated cloth with a small hem thickness and a smooth waistband.
segments=112;profiles=[(-.321,.190,.137,0),(-.350,.204,.147,.005),(-.448,.263,.183,.012),(-.610,.344,.235,.019),(-.626,.348,.238,.019)]
vertices=[]
for inner in [False,True]:
    for z,rx,ry,fold in profiles:
        for i in range(segments):
            theta=2*math.pi*i/segments;wave=fold*math.cos(theta*14);thickness=.009 if inner else 0
            vertices.append(((rx+wave-thickness)*math.sin(theta),-(ry+wave*.72-thickness)*math.cos(theta),z))
layer=len(profiles)*segments;faces=[]
for side in range(2):
    offset=side*layer
    for row in range(len(profiles)-1):
        for i in range(segments):
            j=offset+row*segments+i;k=offset+row*segments+(i+1)%segments
            q=(j,k,k+segments,j+segments);faces.append(q if side==0 else q[::-1])
for row in [0,len(profiles)-1]:
    for i in range(segments):
        j=row*segments+i;k=row*segments+(i+1)%segments;faces.append((j,j+layer,k+layer,k))
mesh('fourteen pleat skirt',vertices,faces,mats['skirt'])
for s,label in [(-1,'right'),(1,'left')]:
    limb(label+' coat sleeve',(s*.185,.003,-.012),(s*.343,-.030,-.227),(.075,.080),mats['coat'])
    limb(label+' ivory cuff',(s*.338,-.029,-.217),(s*.374,-.040,-.265),(.064,.066),mats['ivory'])
    ellipsoid(label+' mitten',(s*.403,-.045,-.290),(.065,.050,.071),mats['skin'])
    ellipsoid(label+' thumb',(s*.358,-.072,-.297),(.027,.028,.039),mats['skin'],16,8)
    ellipsoid(label+' leg',(s*.128,.008,-.658),(.075,.076,.128),mats['skin'])
    ellipsoid(label+' sock',(s*.128,.006,-.816),(.078,.078,.109),mats['ivory'])
    limb(label+' sock cuff',(s*.128,.006,-.739),(s*.128,.006,-.765),(.083,.083),mats['ivory'])
    rounded_box(label+' sole',(s*.128,-.042,-.983),(.205,.303,.039),mats['sole'],.017)
    ellipsoid(label+' round shoe',(s*.128,-.049,-.933),(.102,.150,.069),mats['shoe'])
    rounded_box(label+' shoe strap',(s*.128,-.030,-.878),(.172,.041,.025),mats['shoe'],.010)
    ellipsoid(label+' brass buckle',(s*.214,-.029,-.874),(.015,.018,.009),mats['gold'],16,8)
    # Subtle raised coat details remain real geometry in side views.
    tube(label+' front piping',[(s*.069,-.109,.007),(s*.079,-.147,-.13),(s*.080,-.143,-.30)],.0035,mats['seam'])
    tube(label+' pocket welt',[(s*.113,-.137,-.241),(s*.166,-.114,-.236)],.006,mats['coat'])
    for z in [-.10,-.20]:ellipsoid(label+' coat button',(s*.105,-.148,z),(.013,.006,.013),mats['gold'],16,8)

# One continuous low side ponytail, with broad sculpted waves instead of stray
# front/back texture fragments. Its base disappears beneath the retained head.
points=[(.345,.130,.192),(.425,.165,.135),(.481,.185,.078),(.465,.185,.025),(.405,.185,-.030),(.402,.185,-.085),(.470,.185,-.140),(.505,.185,-.195),(.480,.185,-.250),(.409,.185,-.305),(.398,.180,-.360),(.433,.177,-.405),(.400,.175,-.448)]
radii=[.092,.115,.128,.122,.115,.117,.123,.117,.109,.101,.082,.054,.010];segments=32;vertices=[]
for row,(co,radius) in enumerate(zip(points,radii)):
    for i in range(segments):
        theta=2*math.pi*i/segments;groove=1+.145*math.cos(theta*5+row*.38)
        vertices.append((co[0]+radius*groove*math.cos(theta),co[1]+radius*.77*groove*math.sin(theta),co[2]))
faces=[]
for row in range(len(points)-1):
    for i in range(segments):faces.append((row*segments+i,row*segments+(i+1)%segments,(row+1)*segments+(i+1)%segments,(row+1)*segments+i))
faces.extend([tuple(range(segments-1,-1,-1)),tuple((len(points)-1)*segments+i for i in range(segments))])
pony=mesh('sculpted side ponytail',vertices,faces,mats['hair'])
modifier=pony.modifiers.new('Broad smooth waves','SUBSURF');modifier.levels=2
bpy.context.view_layer.objects.active=pony;bpy.ops.object.modifier_apply(modifier=modifier.name)

rounded_box('camera leather body',(0,-.194,-.159),(.233,.074,.137),mats['camera'],.015)
rounded_box('camera satin top',(0,-.194,-.105),(.237,.078,.031),mats['silver'],.008)
rounded_box('camera viewfinder',(-.071,-.236,-.130),(.035,.006,.025),mats['glass'],.004)
def cylinder(name,center,radius,depth,mat):
    bpy.ops.mesh.primitive_cylinder_add(vertices=40,radius=radius,depth=depth,location=center,rotation=(math.pi/2,0,0))
    return finish(bpy.context.object,name,mat)
cylinder('camera lens silver rim',(0,-.244,-.163),.051,.022,mats['silver'])
cylinder('camera lens dark ring',(0,-.258,-.163),.043,.013,mats['sole'])
cylinder('camera lens glass',(0,-.267,-.163),.032,.009,mats['glass'])
for s,label in [(-1,'right'),(1,'left')]:
    tube(label+' camera strap',[(s*.104,-.188,-.144),(s*.105,-.151,-.020),(s*.083,-.080,.068),(s*.065,.061,.062)],.006,mats['shoe'])

objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
topology=[]
for obj in objects:
    bm=bmesh.new();bm.from_mesh(obj.data)
    # Curve conversion creates duplicate cap vertices; weld the exact joins.
    bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=1e-6)
    bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
    topology.append({'name':obj.name,'boundaryEdges':sum(e.is_boundary for e in bm.edges),'nonManifoldEdges':sum(not e.is_manifold for e in bm.edges)})
    bm.to_mesh(obj.data);bm.free()
assert all(r['boundaryEdges']==0 and r['nonManifoldEdges']==0 for r in topology),topology
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=24
scene.render.bake.margin=12
# glTF cannot represent an arbitrary Blender color mix. Bake the native head
# cleanup into its existing atlas, retaining the separate full-resolution face.
bpy.ops.object.select_all(action='DESELECT');head.select_set(True);bpy.context.view_layer.objects.active=head
head.data.uv_layers.active_index=0
head.data.uv_layers[0].active_render=True
baked=bpy.data.images.new('TangLi cleaned head albedo',width=2048,height=2048,alpha=True)
baked.colorspace_settings.name='sRGB'
restore=[]
for mat in head.data.materials:
    nodes=mat.node_tree.nodes;links=mat.node_tree.links
    shader=nodes.get('Principled BSDF');output=next(n for n in nodes if n.type=='OUTPUT_MATERIAL')
    emission=nodes.new('ShaderNodeEmission')
    if shader.inputs['Base Color'].links:links.new(shader.inputs['Base Color'].links[0].from_socket,emission.inputs['Color'])
    else:emission.inputs['Color'].default_value=shader.inputs['Base Color'].default_value
    links.new(emission.outputs[0],output.inputs['Surface'])
    target=nodes.new('ShaderNodeTexImage');target.image=baked;nodes.active=target
    restore.append((mat,emission,target,shader,output))
scene.cycles.samples=1;bpy.ops.object.bake(type='EMIT');scene.cycles.samples=24
for mat,emission,target,shader,output in restore:
    mat.node_tree.links.new(shader.outputs[0],output.inputs['Surface'])
    mat.node_tree.nodes.remove(emission);mat.node_tree.nodes.remove(target)
nodes=body.node_tree.nodes;links=body.node_tree.links
tex=nodes.new('ShaderNodeTexImage');tex.image=baked
uv=nodes.new('ShaderNodeUVMap');uv.uv_map=head.data.uv_layers[0].name
links.new(uv.outputs[0],tex.inputs['Vector']);links.new(tex.outputs['Color'],body.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
nodes.remove(attribute);nodes.remove(mix)
head.data.color_attributes.remove(head.data.color_attributes['Hair side cleanup'])
if head.data.color_attributes:head.data.color_attributes.active_color=head.data.color_attributes[0]
baked.filepath_raw=str(a.output/'head-albedo-baked.png');baked.file_format='PNG';baked.save();baked.pack()
scene.render.resolution_x=512;scene.render.resolution_y=768;scene.render.resolution_percentage=100
scene.world=bpy.data.worlds.new('Cream studio');scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.65,.61,.55,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.65
for pos,power in [((3,-4,5),350),((-3,-1,3),180),((0,3,4),250)]:
    bpy.ops.object.light_add(type='AREA',location=pos);light=bpy.context.object
    light.data.energy=power;light.data.shape='DISK';light.data.size=4
    light.rotation_euler=(Vector((0,0,0))-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add();camera=bpy.context.object;scene.camera=camera;camera.data.type='ORTHO';camera.data.ortho_scale=2.37
for name,angle in [('front',0),('left',math.pi/2),('back',math.pi),('right',-math.pi/2),('three-quarter-left',math.pi/4),('three-quarter-right',-math.pi/4)]:
    camera.location=(math.sin(angle)*6,-math.cos(angle)*6,0)
    camera.rotation_euler=(-camera.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(a.output/(name+'.png'));bpy.ops.render.render(write_still=True)
bpy.ops.object.select_all(action='DESELECT')
for obj in objects:obj.select_set(True)
bpy.context.view_layer.objects.active=head
bpy.ops.export_scene.gltf(filepath=str(a.output/'character.glb'),export_format='GLB',use_selection=True,export_animations=False)
raw=(a.output/'character.glb').read_bytes();length=struct.unpack_from('<I',raw,12)[0];gltf=json.loads(raw[20:20+length])
triangles=sum(gltf['accessors'][part['indices']]['count']//3 for m in gltf['meshes'] for part in m['primitives'])
for image in bpy.data.images:
    if image.source=='FILE':image.pack()
bpy.ops.wm.save_as_mainfile(filepath=str(a.output/'character-review.blend'))
report={'sourceBlend':str(a.source_blend),'triangles':triangles,'editableParts':len(objects),'partTopology':topology,
        'boundaryEdges':sum(r['boundaryEdges'] for r in topology),'nonManifoldEdges':sum(r['nonManifoldEdges'] for r in topology),
        'rigged':False,'productionReady':False,'textureProjection':'retained v4 painted head; native separate clothing, limbs, camera and ponytail',
        'bodyMaterialSource':str(a.source_blend),'textures':[{'path':str(a.front),'SHA256':source_sha,'size':[1024,1536],
        'unchanged':source_sha==hashlib.sha256(a.front.read_bytes()).hexdigest()}]}
(a.output/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report),flush=True)
