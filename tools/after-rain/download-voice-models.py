"""Download the two official Qwen3-TTS models to a separate local cache.
Public original models only. Exact revisions and file hashes are recorded.
Usage: python download-voice-models.py --variant VoiceDesign|Base --cache PATH
"""
import argparse, concurrent.futures, hashlib, json, threading, time
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parent

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--variant',choices=['VoiceDesign','Base'],required=True);ap.add_argument('--cache',required=True);args=ap.parse_args()
    repo='Qwen/Qwen3-TTS-12Hz-1.7B-'+args.variant
    response=requests.get('https://huggingface.co/api/models/'+repo+'?blobs=true',timeout=30);response.raise_for_status();meta=response.json()
    destination=Path(args.cache).resolve()/repo.split('/')[-1];destination.mkdir(parents=True,exist_ok=True)
    files=[f for f in meta['siblings'] if f['rfilename']!='.gitattributes']
    status={'repo':repo,'revision':meta['sha'],'license':meta.get('cardData',{}).get('license'),'directory':str(destination),'files':[]}
    report=ROOT/('voice-model-status-'+args.variant+'.json');lock=threading.Lock()
    def write():report.with_suffix('.json.tmp').write_text(json.dumps(status,indent=2),encoding='utf8');report.with_suffix('.json.tmp').replace(report)
    for info in files:
        status['files'].append({'file':info['rfilename'],'bytes':info.get('lfs',{}).get('size',info.get('size')),'sha256':info.get('lfs',{}).get('sha256'),'status':'pending','downloadedBytes':0})
    write()
    def download(entry):
        target=destination/entry['file'];target.parent.mkdir(parents=True,exist_ok=True);part=target.with_suffix(target.suffix+'.part')
        if not target.exists():
            offset=part.stat().st_size if part.exists() else 0
            url='https://huggingface.co/'+repo+'/resolve/'+meta['sha']+'/'+entry['file']
            with requests.get(url,headers={'Range':f'bytes={offset}-'} if offset else {},stream=True,timeout=(30,90)) as r:
                r.raise_for_status()
                if offset and r.status_code!=206:offset=0
                stamp=0
                with part.open('ab' if offset else 'wb') as stream:
                    for chunk in r.iter_content(8*1024*1024):
                        if not chunk:continue
                        stream.write(chunk);offset+=len(chunk)
                        if time.monotonic()-stamp>25:
                            with lock:entry.update(status='downloading',downloadedBytes=offset);write()
                            print(f"{args.variant}/{entry['file']} {offset/1e9:.2f}/{entry['bytes']/1e9:.2f} GB",flush=True);stamp=time.monotonic()
            if part.stat().st_size!=entry['bytes']:raise ValueError('size mismatch: '+entry['file'])
            part.replace(target)
        if target.stat().st_size!=entry['bytes']:raise ValueError('size mismatch: '+entry['file'])
        if entry['sha256']:
            digest=hashlib.sha256()
            with target.open('rb') as stream:
                for chunk in iter(lambda:stream.read(8*1024*1024),b''):digest.update(chunk)
            if digest.hexdigest()!=entry['sha256']:raise ValueError('hash mismatch: '+entry['file'])
        with lock:entry.update(status='verified',downloadedBytes=entry['bytes']);write()
        print('VERIFIED '+args.variant+'/'+entry['file'],flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(download,status['files']))
    print('MODEL VERIFIED '+repo,flush=True)

if __name__=='__main__':main()
