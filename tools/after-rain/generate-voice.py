"""Generate actual, hashed, resumable dialogue assets. Requires edge-tts==7.2.8.
Usage: python generate-voice.py [--limit N] [--scene c1-arrival]
Voice files and measured durations are local; only original script text is sent to the TTS service.
"""
import argparse, asyncio, json, os, subprocess, tempfile
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parent
VOICES = {
    'n': ('zh-CN-XiaoxiaoNeural', '-5%', '+0Hz'),
    'me': ('zh-CN-XiaoyiNeural', '-4%', '+0Hz'),
    'duan': ('zh-CN-YunjianNeural', '-7%', '-2Hz'),
    'su': ('zh-CN-YunxiNeural', '-3%', '+0Hz'),
    'gu': ('zh-CN-YunjianNeural', '-12%', '-6Hz'),
    'zhou': ('zh-CN-YunxiaNeural', '+0%', '+0Hz'),
    'xi': ('zh-CN-XiaoxiaoNeural', '-2%', '-5Hz'),
    'qiao': ('zh-CN-XiaoyiNeural', '+1%', '+3Hz'),
    'lin': ('zh-CN-XiaoxiaoNeural', '-14%', '-8Hz'),
}
def probe(file):
    p = subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(file)], capture_output=True, text=True, check=True)
    return round(float(p.stdout.strip()), 3)

async def main():
    ap=argparse.ArgumentParser();ap.add_argument('--limit',type=int,default=0);ap.add_argument('--scene');args=ap.parse_args()
    beats=json.loads((ROOT/'script-manifest.json').read_text(encoding='utf8'))['beats']
    if args.scene: beats=[b for b in beats if b['scene']==args.scene]
    folder=ROOT/'assets'/'voice';folder.mkdir(parents=True,exist_ok=True)
    manifest_path=ROOT/'voice-manifest.json'
    manifest=json.loads(manifest_path.read_text(encoding='utf8')) if manifest_path.exists() else {}
    pending=[b for b in beats if not (folder/b['file']).exists() or manifest.get(b['id'],{}).get('hash')!=b['hash']]
    if args.limit: pending=pending[:args.limit]
    sem=asyncio.Semaphore(3);done=0
    async def generate(b):
        nonlocal done
        async with sem:
            voice,rate,pitch=VOICES[b['speaker']];file=folder/b['file'];tmp=folder/(b['file']+'.part')
            for attempt in range(3):
                try:
                    await asyncio.wait_for(edge_tts.Communicate(b['text'],voice,rate=rate,pitch=pitch).save(str(tmp)),timeout=50)
                    duration=probe(tmp)
                    if duration<=0:raise ValueError('empty audio')
                    tmp.replace(file)
                    manifest[b['id']]={'file':'assets/voice/'+file.name,'hash':b['hash'],'duration':duration,'voice':voice}
                    # Synchronous atomic write; other coroutine tasks cannot interleave this section.
                    manifest_path.with_suffix('.json.tmp').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
                    manifest_path.with_suffix('.json.tmp').replace(manifest_path)
                    done+=1;print(f'{done}/{len(pending)} {b["id"]} {duration:.1f}s',flush=True);return
                except Exception as e:
                    if attempt==2: print(f'FAILED {b["id"]}: {type(e).__name__}: {e}',flush=True)
                    else:await asyncio.sleep(1+attempt)
    await asyncio.gather(*(generate(b) for b in pending))
    print(json.dumps({'generated':done,'requested':len(pending)}),flush=True)
    if done<len(pending):raise SystemExit(1)
if __name__=='__main__':asyncio.run(main())
