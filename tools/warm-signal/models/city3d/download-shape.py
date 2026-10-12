"""Download pinned official geometry weights to the local tool runtime, outside the game repository."""
import os
from pathlib import Path

runtime = Path.home()/'.codex'/'warm-signal-model-runtime'
os.environ['HF_HUB_DISABLE_IMPLICIT_TOKEN'] = '1'
os.environ['HF_HUB_DISABLE_XET'] = '1'
os.environ['HF_HUB_DOWNLOAD_TIMEOUT'] = '90'
from huggingface_hub import snapshot_download

repo = 'tencent/Hunyuan3D-2mini'
revision = 'f90a0f7df7d5e6f71109cf333f6a95a0ae3194a6'
folder = runtime/'hunyuan-weights'/'mini-turbo'
folder.mkdir(parents=True,exist_ok=True)
print(f'Downloading {repo}@{revision} to {folder}',flush=True)
path = snapshot_download(repo_id=repo,revision=revision,local_dir=folder,
    allow_patterns=['LICENSE','NOTICE','config.json','hunyuan3d-dit-v2-mini-turbo/config.yaml',
                    'hunyuan3d-dit-v2-mini-turbo/model.fp16.safetensors'],max_workers=2,token=False)
print('DOWNLOAD_COMPLETE '+str(path),flush=True)
