"""Local, reproducible geometry experiment; never replaces a shipped character asset."""
import argparse, hashlib, json, os, sys, time, traceback
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, default=Path(__file__).with_name('tangli-toon-source-v1.png'))
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--resolution', type=int, default=256)
args = parser.parse_args()
runtime = Path.home()/'.codex'/'warm-signal-model-runtime'
sys.path.insert(0, str(runtime/'hunyuan3d-2'))
os.environ['HF_HUB_OFFLINE'] = '1'
os.environ['HF_HUB_DISABLE_IMPLICIT_TOKEN'] = '1'
args.output.mkdir(parents=True, exist_ok=False)
started = time.time()
report = dict(status='loading', source=str(args.source.resolve()), sourceSHA256=hashlib.sha256(args.source.read_bytes()).hexdigest(),
              codeCommit='f8db63096c8282cb27354314d896feba5ba6ff8a', model='tencent/Hunyuan3D-2mini',
              modelRevision='f90a0f7df7d5e6f71109cf333f6a95a0ae3194a6', subfolder='hunyuan3d-dit-v2-mini-turbo',
              seed=42, steps=5, resolution=args.resolution, textured=False, rigged=False)
def save(status):
    report.update(status=status, seconds=round(time.time()-started, 2))
    (args.output/'report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(status, flush=True)
save('loading')
try:
    import torch
    from PIL import Image
    from hy3dgen.shapegen import Hunyuan3DDiTFlowMatchingPipeline
    image = Image.open(args.source).convert('RGBA')
    assert image.getchannel('A').getextrema()[0] == 0, 'Source needs transparent background'
    report['gpu'] = torch.cuda.get_device_name()
    report['torch'] = torch.__version__
    pipeline = Hunyuan3DDiTFlowMatchingPipeline.from_pretrained(str(runtime/'hunyuan-weights'/'mini-turbo'),
        subfolder=report['subfolder'], device='cpu', dtype=torch.float16)
    # Upstream's offload helper expects Diffusers-style components, but this
    # pinned plain Python pipeline doesn't expose them. Provide the four it owns.
    pipeline.components = {name:getattr(pipeline,name) for name in ('conditioner','model','vae','scheduler')}
    pipeline.enable_model_cpu_offload(device='cuda')
    # The upstream helper installs hooks but leaves the execution-device field on CPU.
    pipeline.device = torch.device('cuda')
    save('generating')
    mesh = pipeline(image=image, num_inference_steps=5, guidance_scale=0,
        generator=torch.Generator(device='cuda').manual_seed(42), octree_resolution=args.resolution,
        num_chunks=4096, mc_algo='mc')[0]
    assert len(mesh.vertices)>0 and len(mesh.faces)>0, 'Empty mesh'
    mesh.export(args.output/'shape.glb')
    report.update(vertices=len(mesh.vertices), faces=len(mesh.faces), bounds=mesh.bounds.tolist(),
                  watertight=bool(mesh.is_watertight), sourceUnchanged=report['sourceSHA256']==hashlib.sha256(args.source.read_bytes()).hexdigest())
    save('geometry_complete_needs_visual_review')
except Exception:
    report['error'] = traceback.format_exc()
    save('failed')
    raise
