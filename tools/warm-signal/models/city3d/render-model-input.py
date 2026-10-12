"""Render transparent orthographic mesh views for geometry-conditioned painting."""
import argparse,bpy,json,math,sys
from pathlib import Path
from mathutils import Vector
p=argparse.ArgumentParser();p.add_argument('--mesh',type=Path,required=True);p.add_argument('--output',type=Path,required=True)
a=p.parse_args(sys.argv[sys.argv.index('--')+1:]);a.output.mkdir(parents=True,exist_ok=False)
bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(a.mesh.resolve()))
objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
points=[o.matrix_world@v.co for o in objects for v in o.data.vertices]
low=Vector(tuple(min(p[i] for p in points) for i in range(3)));high=Vector(tuple(max(p[i] for p in points) for i in range(3)))
center=(low+high)/2;height=high.z-low.z
mat=bpy.data.materials.new('Neutral clay');mat.use_nodes=True
shader=mat.node_tree.nodes.get('Principled BSDF');shader.inputs['Base Color'].default_value=(.63,.57,.49,1)
shader.inputs['Roughness'].default_value=1
for o in objects:
    o.data.materials.clear();o.data.materials.append(mat)
    for poly in o.data.polygons:poly.use_smooth=True
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.device='CPU';scene.cycles.samples=24
scene.render.resolution_x=512;scene.render.resolution_y=768;scene.render.resolution_percentage=100
scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA'
scene.world=bpy.data.worlds.new('Studio');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[1].default_value=.6
for pos,power in [((3,-4,5),400),((-3,-1,3),180),((0,3,4),220)]:
    bpy.ops.object.light_add(type='AREA',location=center+Vector(pos)*height/2)
    light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=4
    light.rotation_euler=(center-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add();camera=bpy.context.object;scene.camera=camera
camera.data.type='ORTHO';camera.data.ortho_scale=height*1.22
for name,angle in [('front',0),('left',math.pi/2),('back',math.pi),('right',-math.pi/2)]:
    camera.location=center+Vector((math.sin(angle)*3,-math.cos(angle)*3,0))*height
    camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(a.output/(name+'.png'));bpy.ops.render.render(write_still=True)
(a.output/'projection.json').write_text(json.dumps({'resolution':[512,768],'orthographicScale':camera.data.ortho_scale,'center':list(center),'bounds':[list(low),list(high)],'elevation':0},indent=2),encoding='utf-8')
