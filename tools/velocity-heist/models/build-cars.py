"""Original editable cars. Run: blender --background --factory-startup --python build-cars.py"""
import bpy, math, os, json
from mathutils import Vector

OUT = os.path.dirname(os.path.abspath(__file__))
# This script runs in a fresh background Blender process. It never touches the user's open scene.
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.name = 'Velocity Heist - Original Garage'
scene.unit_settings.system = 'METRIC'
scene.render.engine = 'CYCLES'
scene.cycles.samples = 32
scene.cycles.use_denoising = True
scene.render.resolution_x = 1400
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.world.color = (.1,.1,.14)

def material(name, color, metal=0, rough=.4, emission=0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    n = m.node_tree.nodes.get('Principled BSDF')
    n.inputs['Base Color'].default_value = (*color,1)
    n.inputs['Metallic'].default_value = metal
    n.inputs['Roughness'].default_value = rough
    if emission:
        n.inputs['Emission Color'].default_value = (*color,1)
        n.inputs['Emission Strength'].default_value = emission
    return m
carbon = material('Carbon - satin graphite',(.018,.025,.04),.3,.3)
rubber = material('Tyre rubber',(.009,.014,.02),0,.86)
alloy = material('Forged alloy',(.36,.44,.52),.8,.26)
glass = material('Smoked blue glass',(.025,.095,.14),.55,.17)
white = material('LED headlamp',(.7,.9,1),0,.24,3)
red = material('LED tail light',(1,.035,.12),0,.3,2)
stripe = material('Racing stripe',(.015,.02,.033),.2,.4)
models = []
collection = None

def register(o,mat):
    for c in list(o.users_collection): c.objects.unlink(o)
    collection.objects.link(o)
    if mat: o.data.materials.append(mat)
    return o

def cube(name,loc,size,mat,bevel=.03):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = register(bpy.context.object,mat);o.name=name;o.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bevel:
        m=o.modifiers.new('Editable bevel','BEVEL');m.width=bevel;m.segments=3
        o.modifiers.new('Weighted surface normals','WEIGHTED_NORMAL')
    return o

def loft(name,rings,mat):
    # x longitudinal, y lateral, z height; distinct closed cross sections.
    verts=[]
    for x,w,z,h in rings:
        verts.extend([(x,-w,z),(x,w,z),(x,w*.87,z+h),(x,-w*.87,z+h)])
    faces=[(3,2,1,0)]
    for i in range(len(rings)-1):
        for j in range(4):
            a=i*4+j;b=i*4+(j+1)%4;faces.append((a,b,b+4,a+4))
    n=len(verts);faces.append((n-4,n-3,n-2,n-1))
    mesh=bpy.data.meshes.new(name+' mesh');mesh.from_pydata(verts,[],faces);mesh.update()
    o=bpy.data.objects.new(name,mesh);collection.objects.link(o);o.data.materials.append(mat)
    m=o.modifiers.new('Panel bevel','BEVEL');m.width=.06;m.segments=3
    o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    return o

def wheel(x,y,carname):
    bpy.ops.mesh.primitive_cylinder_add(vertices=20,radius=.4,depth=.27,location=(x,y,.43),rotation=(math.pi/2,0,0))
    w=register(bpy.context.object,rubber);w.name=f'{carname}_Wheel_{"F" if x>0 else "R"}_{"L" if y<0 else "R"}'
    bevel=w.modifiers.new('Tyre shoulder','BEVEL');bevel.width=.035;bevel.segments=2
    bpy.ops.mesh.primitive_cylinder_add(vertices=16,radius=.27,depth=.285,location=(x,y,.43),rotation=(math.pi/2,0,0))
    register(bpy.context.object,alloy).name=carname+'_WheelHub'
    for side in [-1,1]:
        for i in range(5):
            a=i*math.tau/5
            o=cube('Wheel spoke',(x+math.sin(a)*.1,y+side*.145,.43+math.cos(a)*.1),(.035,.025,.22),carbon,.005)
            o.rotation_euler[1]=a

specs=[('needle','NEEDLE - Aero coupe',(.57,.95,.035),0),('iron','IRONCLAD - Widebody muscle',(.42,.06,.8),1),('crosswind','CROSSWIND - Open cockpit',(.015,.8,.92),2)]
for cid,name,color,kind in specs:
    collection=bpy.data.collections.new(name);scene.collection.children.link(collection)
    paint=material(cid+'_Paint',color,.55,.25)
    accents=material(cid+'_Accent',color,0,.3,1.1)
    if kind==1:
        loft('Widebody chassis',[(-2.35,.91,.35,.42),(-1.6,1.02,.32,.5),(.2,1.02,.32,.55),(1.8,.93,.35,.45),(2.25,.85,.35,.4)],paint)
        loft('Muscle cabin',[(-1.25,.73,.75,.06),(-.85,.72,.76,.65),(.5,.72,.75,.65),(1,.68,.72,.06)],glass)
        cube('Cabin roof',(-.15,0,1.38),(1.32,1.36,.07),paint)
        cube('Engine scoop',(1.18,0,.89),(.75,.48,.15),carbon)
    elif kind==2:
        loft('Open cockpit body',[(-2.2,.68,.33,.4),(-1.3,.76,.3,.5),(-.25,.65,.3,.5),(1.35,.82,.3,.44),(2.4,.44,.32,.26)],paint)
        cube('Cockpit well',(-.4,0,.88),(1.2,.86,.12),carbon)
        cube('Seat',(-.7,0,1.02),(.5,.6,.35),carbon)
        loft('Wind deflector',[(.25,.47,.82,.25),(.55,.44,.76,.04)],glass)
        for y in [-.45,.45]: cube('Roll hoop',(-1.04,y,1.05),(.12,.1,.53),alloy)
        cube('Roll hoop upper',(-1.04,0,1.32),(.12,1,.1),alloy)
        cube('Front aero wing',(2.03,0,.32),(.43,2.04,.09),carbon)
    else:
        loft('Aero coupe body',[(-2.25,.8,.34,.3),(-1.4,.96,.3,.5),(.2,.93,.3,.52),(1.5,.83,.31,.37),(2.35,.65,.34,.18)],paint)
        loft('Canopy',[(-1.2,.71,.8,.02),(-.72,.67,.8,.55),(.3,.65,.8,.51),(.9,.7,.73,.02)],glass)
        cube('Roof',(-.25,0,1.32),(.95,1.16,.06),paint)
    for x in [-1.45,1.43]:
        for y in [-.92,.92]: wheel(x,y,cid)
    for y in [-.69,.69]:
        cube('Side skirt',(-.05,y*1.4,.29),(3.25,.08,.14),carbon)
        cube('LED running light',(2.18,y*.8,.61),(.1,.31,.085),white)
        cube('LED tail light',(-2.23,y,.67),(.07,.3,.08),red)
        cube('Wing strut',(-1.95,y*.75,.93),(.12,.08,.57),carbon)
        cube('Wing endplate',(-1.96,y*1.56,1.18),(.55,.07,.27),paint)
    cube('Rear aero wing',(-1.97,0,1.17),(.55,2.15,.09),carbon)
    cube('Wing colour strip',(-1.74,0,1.23),(.035,2.1,.026),accents)
    cube('Front splitter',(2.16,0,.32),(.45,1.75,.07),carbon)
    cube('Rear diffuser',(-2.18,0,.33),(.4,1.72,.12),carbon)
    for y in [-.16,.16]: cube('Hood racing stripe',(1.45,y,.794 if kind==1 else .744),(.92,.12,.016),stripe,.005)
    for x in [-1.1,-.82,-.54]:
        for y in [-.82,.82]: cube('Cooling louvre',(x,y,.85),(.09,.22,.025),carbon,.008)
    # Export the actual meshes, preserving names and materials. No Draco / decoder dependency.
    bpy.ops.object.select_all(action='DESELECT')
    for o in collection.objects:o.select_set(True)
    bpy.context.view_layer.objects.active=next(iter(collection.objects))
    path=os.path.join(OUT,cid+'.glb')
    bpy.ops.export_scene.gltf(filepath=path,export_format='GLB',use_selection=True,export_apply=True,export_cameras=False,export_lights=False)
    models.append({'id':cid,'objects':len(collection.objects),'glb':os.path.basename(path),'parts':[o.name for o in collection.objects]})
    # Arrange the editable garage for visual review after exporting at local origin.
    for o in collection.objects:o.location.y+= (kind-1)*4

collection=bpy.data.collections.new('Studio - lights camera floor');scene.collection.children.link(collection)
floor=material('Garage floor',(.018,.022,.033),.1,.42)
cube('Studio ground',(0,0,-.06),(20,20,.1),floor)
for name,loc,power,col,size in [('Key',(1,-5,10),2200,(.7,.88,1),8),('Lime rim',(-5,2,5),1800,(.65,1,.16),6),('Violet rim',(3,6,5),1500,(.55,.16,1),5)]:
    ld=bpy.data.lights.new(name,'AREA');ld.energy=power;ld.color=col;ld.shape='DISK';ld.size=size
    o=bpy.data.objects.new(name,ld);collection.objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,0))-o.location).to_track_quat('-Z','Y').to_euler()
camd=bpy.data.cameras.new('Garage camera');cam=bpy.data.objects.new('Garage camera',camd);collection.objects.link(cam);cam.location=(11,-12,12);cam.rotation_euler=(Vector((0,0,.6))-cam.location).to_track_quat('-Z','Y').to_euler();camd.type='ORTHO';camd.ortho_scale=15;scene.camera=cam
scene.view_settings.view_transform='AgX'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'velocity-garage.blend'))
with open(os.path.join(OUT,'manifest.json'),'w',encoding='utf8') as f:json.dump({'blender':bpy.app.version_string,'front_axis':'+X','source':'build-cars.py','models':models},f,ensure_ascii=False,indent=2)
scene.render.filepath=os.path.join(OUT,'garage-preview.png')
bpy.ops.render.render(write_still=True)
print('VELOCITY_MODELS_COMPLETE',json.dumps([{k:v for k,v in m.items() if k!='parts'} for m in models]))
