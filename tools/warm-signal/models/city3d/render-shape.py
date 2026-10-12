"""Run in a new headless Blender process; never changes the user's open scene."""
import bpy, math, sys, json
from pathlib import Path
from mathutils import Vector
folder = Path(sys.argv[sys.argv.index('--')+1])
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(folder/'shape.glb'))
meshes = [o for o in bpy.context.scene.objects if o.type=='MESH']
points = [o.matrix_world@Vector(c) for o in meshes for c in o.bound_box]
low = Vector(tuple(min(p[i] for p in points) for i in range(3)))
high = Vector(tuple(max(p[i] for p in points) for i in range(3)))
center = (low+high)/2
height = high.z-low.z
clay = bpy.data.materials.new('Neutral clay geometry inspection')
clay.diffuse_color=(.63,.54,.46,1)
clay.use_nodes=True
shader=clay.node_tree.nodes.get('Principled BSDF')
shader.inputs['Base Color'].default_value=(.63,.54,.46,1)
shader.inputs['Roughness'].default_value=.8
for obj in meshes:
    obj.data.materials.clear();obj.data.materials.append(clay)
    for p in obj.data.polygons:p.use_smooth=True
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.device='CPU'
scene.cycles.samples=24
scene.render.resolution_x=512;scene.render.resolution_y=768;scene.render.resolution_percentage=100
scene.world=bpy.data.worlds.new('Warm inspection')
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.6,.55,.5,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.45
for pos,power,size in [((3,-4,5),500,4),((-3,-1,3),250,3),((0,3,4),350,3)]:
    bpy.ops.object.light_add(type='AREA',location=center+Vector(pos)*height/2)
    light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=size
    light.rotation_euler=(center-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add()
camera=bpy.context.object;scene.camera=camera;camera.data.type='ORTHO';camera.data.ortho_scale=height*1.15
for name,angle in [('front',0),('side',math.pi/2),('back',math.pi),('three-quarter',math.pi/4)]:
    camera.location=center+Vector((math.sin(angle)*3,-math.cos(angle)*3,.08))*height
    camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(folder/(name+'.png'))
    bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(folder/'geometry-review.blend'))
