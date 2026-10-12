"""Download and hash-check only the three official Wan2.2 5B ComfyUI files.
Usage: python download-video-models.py --comfy PATH
Public model files; no credentials or login. Downloads resume after interruption.
"""
import argparse, hashlib, json, time
from pathlib import Path
import requests

REPO='Comfy-Org/Wan_2.2_ComfyUI_Repackaged'
FILES={
    'split_files/diffusion_models/wan2.2_ti2v_5B_fp16.safetensors':'diffusion_models',
    'split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors':'text_encoders',
    'split_files/vae/wan2.2_vae.safetensors':'vae',
}
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--comfy',required=True);ap.add_argument('--only',choices=list(FILES.values()));args=ap.parse_args()
    base=Path(args.comfy).resolve();out=Path(__file__).resolve().parent/('video-model-status-'+args.only+'.json' if args.only else 'video-model-status.json')
    metadata=requests.get(f'https://huggingface.co/api/models/{REPO}?blobs=true',timeout=30);metadata.raise_for_status();meta=metadata.json()
    revision=meta['sha'];siblings={f['rfilename']:f for f in meta['siblings']};status={'repo':REPO,'revision':revision,'files':[]}
    for name,folder in FILES.items():
        if args.only and folder!=args.only:continue
        info=siblings[name];size=info.get('lfs',{}).get('size',info.get('size'));sha=info.get('lfs',{}).get('sha256')
        target=base/'models'/folder/Path(name).name;target.parent.mkdir(parents=True,exist_ok=True)
        entry={'file':str(target),'bytes':size,'sha256':sha,'status':'downloading'};status['files'].append(entry)
        def save():out.write_text(json.dumps(status,indent=2),encoding='utf8')
        save();tmp=target.with_suffix('.safetensors.part')
        if not target.exists():
            offset=tmp.stat().st_size if tmp.exists() else 0
            url=f'https://huggingface.co/{REPO}/resolve/{revision}/{name}'
            with requests.get(url,headers={'Range':f'bytes={offset}-'} if offset else {},stream=True,timeout=(30,90)) as resp:
                resp.raise_for_status()
                if offset and resp.status_code!=206:offset=0
                with tmp.open('ab' if offset else 'wb') as f:
                    stamp=0
                    for chunk in resp.iter_content(8*1024*1024):
                        if not chunk:continue
                        f.write(chunk);offset+=len(chunk)
                        if time.monotonic()-stamp>25:
                            print(f'{target.name} {offset/1e9:.2f}/{size/1e9:.2f} GB',flush=True);stamp=time.monotonic();entry['downloadedBytes']=offset;save()
            if tmp.stat().st_size!=size:raise ValueError('download size mismatch')
            tmp.replace(target)
        if target.stat().st_size!=size:raise ValueError('model size mismatch')
        digest=hashlib.sha256()
        with target.open('rb') as f:
            for chunk in iter(lambda:f.read(8*1024*1024),b''):digest.update(chunk)
        if sha and digest.hexdigest()!=sha:raise ValueError('model SHA256 mismatch')
        entry['status']='verified';entry['downloadedBytes']=size;save();print(f'VERIFIED {target.name}',flush=True)
    print('All three official video model files verified.',flush=True)
if __name__=='__main__':main()
