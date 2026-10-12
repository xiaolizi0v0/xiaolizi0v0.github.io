"""Topology-preserving low-poly preparation of a closed experimental 3D mesh."""
import argparse, hashlib, json, time
from pathlib import Path
import pymeshlab
import trimesh

p=argparse.ArgumentParser()
p.add_argument('--source',type=Path,required=True)
p.add_argument('--output',type=Path,required=True)
p.add_argument('--faces',type=int,default=24000)
p.add_argument('--smooth-steps',type=int,default=20)
a=p.parse_args();assert a.faces>=4000
a.output.mkdir(parents=True,exist_ok=False)
start=time.monotonic();sha=hashlib.sha256(a.source.read_bytes()).hexdigest()
original=trimesh.load(a.source,force='mesh',process=False)
assert original.is_watertight,'Use a closed source; this script preserves topology rather than pretending to repair it.'
parts=original.split(only_watertight=False)
kept=[part for part in parts if len(part.faces)>=max(64,len(original.faces)*.001)]
assert kept
clean=trimesh.util.concatenate(kept)
ms=pymeshlab.MeshSet();ms.add_mesh(pymeshlab.Mesh(clean.vertices,clean.faces),'closed character')
ms.apply_filter('apply_coord_taubin_smoothing',lambda_=.5,mu=-.53,stepsmoothnum=a.smooth_steps)
ms.apply_filter('meshing_decimation_quadric_edge_collapse',targetfacenum=a.faces,
                preservetopology=True,preserveboundary=True,preservenormal=True,
                qualitythr=.3,autoclean=True)
m=ms.current_mesh()
mesh=trimesh.Trimesh(vertices=m.vertex_matrix(),faces=m.face_matrix(),process=False)
mesh.remove_unreferenced_vertices()
assert mesh.is_watertight,'Decimation opened the surface; do not export as a closed model.'
mesh.export(a.output/'shape.glb')
report={'source':str(a.source),'sourceSHA256':sha,'sourceUnchanged':sha==hashlib.sha256(a.source.read_bytes()).hexdigest(),
        'originalVertices':len(original.vertices),'originalFaces':len(original.faces),'requestedFaces':a.faces,
        'sourceComponents':len(parts),'retainedComponents':len(kept),'smoothSteps':a.smooth_steps,
        'vertices':len(mesh.vertices),'faces':len(mesh.faces),'watertight':mesh.is_watertight,
        'windingConsistent':mesh.is_winding_consistent,'bounds':mesh.bounds.tolist(),
        'seconds':round(time.monotonic()-start,2),'productionReady':False}
(a.output/'report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report),flush=True)
