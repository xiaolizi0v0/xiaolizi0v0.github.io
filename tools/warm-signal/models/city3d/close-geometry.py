"""Conservative solid-volume closing of an experimental mesh, never images.

Use the isolated shape runtime. Source/output are explicit and the destination
must not exist, so every geometry experiment remains recoverable.
"""
import argparse, hashlib, json, time
from pathlib import Path
import numpy as np
from scipy import ndimage
import trimesh

p=argparse.ArgumentParser()
p.add_argument('--source',type=Path,required=True)
p.add_argument('--output',type=Path,required=True)
p.add_argument('--pitch',type=float,default=.012)
p.add_argument('--iterations',type=int,default=2)
a=p.parse_args();a.output.mkdir(parents=True,exist_ok=False)
assert a.pitch>0 and 0<a.iterations<=4
start=time.monotonic();sha=hashlib.sha256(a.source.read_bytes()).hexdigest()
mesh=trimesh.load(a.source,force='mesh',process=False)
voxel=mesh.voxelized(a.pitch).fill()
volume=np.pad(voxel.matrix,4)
closed=ndimage.binary_closing(volume,iterations=a.iterations)
closed=ndimage.binary_fill_holes(closed)
result=trimesh.voxel.ops.matrix_to_marching_cubes(closed,pitch=a.pitch)
result.apply_translation(voxel.transform[:3,3]-a.pitch*4)
result.export(a.output/'shape.glb')
report={'source':str(a.source),'sourceSHA256':sha,'pitch':a.pitch,'closingIterations':a.iterations,
        'grid':list(volume.shape),'vertices':len(result.vertices),'faces':len(result.faces),
        'watertight':result.is_watertight,'bounds':result.bounds.tolist(),
        'sourceUnchanged':sha==hashlib.sha256(a.source.read_bytes()).hexdigest(),
        'seconds':round(time.monotonic()-start,2),'productionReady':False}
(a.output/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report),flush=True)
