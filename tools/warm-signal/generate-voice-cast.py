"""Generate original synthetic reference voices for every in-game speaking role.
The existing official model cache is read-only. Outputs belong to Warm Signal.
"""
import os
os.environ['USE_TF']='0'
os.environ['USE_TORCH']='1'
os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'
os.environ['TOKENIZERS_PARALLELISM']='false'
import argparse,hashlib,json,time,subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parent
DEFAULT_MODEL=Path.home()/'.codex/cache/after-rain-voices/models/Qwen3-TTS-12Hz-1.7B-VoiceDesign'

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--model',default=str(DEFAULT_MODEL));ap.add_argument('--only');ap.add_argument('--device',default='cuda:0');args=ap.parse_args()
 script=json.loads((ROOT/'voice-script.json').read_text(encoding='utf-8'));out=ROOT/'assets/voice-cast';out.mkdir(parents=True,exist_ok=True)
 manifest_path=ROOT/'voice-cast-manifest.json';manifest=json.loads(manifest_path.read_text(encoding='utf-8')) if manifest_path.exists() else {'version':1,'model':script['model'],'license':script['license'],'characters':{}}
 pending=[c for c in script['characters'] if (not args.only or args.only==c['id']) and not (out/(c['id']+'.wav')).exists()]
 if not pending:print('All requested references already exist.',flush=True);return
 print(json.dumps({'phase':'import','roles':len(pending)}),flush=True)
 import numpy as np
 import torch
 import soundfile as sf
 from qwen_tts import Qwen3TTSModel
 torch.set_num_threads(4)
 print(json.dumps({'phase':'loading','device':args.device,'freeGiB':round(torch.cuda.mem_get_info()[0]/2**30,2) if args.device.startswith('cuda') else None}),flush=True)
 model=Qwen3TTSModel.from_pretrained(args.model,device_map=args.device,dtype=torch.bfloat16 if args.device.startswith('cuda') else torch.float32,attn_implementation='sdpa',local_files_only=True)
 print('MODEL_READY',flush=True)
 for c in pending:
  torch.manual_seed(c['seed']);started=time.monotonic();print('GENERATING '+c['id'],flush=True)
  with torch.inference_mode():wavs,sr=model.generate_voice_design(text=c['referenceText'],language='Chinese',instruct=c['direction'],max_new_tokens=512)
  wave=np.asarray(wavs[0],dtype=np.float32);duration=len(wave)/sr;peak=float(np.max(np.abs(wave)));rms=float(np.sqrt(np.mean(wave**2)))
  if not np.all(np.isfinite(wave)) or rms<.0001 or duration<.5 or duration>40:raise ValueError((c['id'],'Invalid reference audio',duration,rms))
  gain=min(1,.98/peak) if peak else 1;wave*=gain;file=out/(c['id']+'.wav');sf.write(str(file),wave,sr,subtype='PCM_16')
  ffmpeg=os.environ.get('WARM_FFMPEG','ffmpeg');mp3=file.with_suffix('.mp3');subprocess.run([ffmpeg,'-y','-v','error','-i',str(file),'-codec:a','libmp3lame','-b:a','128k',str(mp3)],check=True)
  item={'id':c['id'],'name':c['name'],'aliases':c['aliases'],'text':c['referenceText'],'sampleCue':c['sampleCue'],'seed':c['seed'],'direction':c['direction'],'wav':'assets/voice-cast/'+file.name,'file':'assets/voice-cast/'+mp3.name,'sampleRate':sr,'duration':round(duration,3),'rms':rms,'originalPeak':peak,'gain':gain,'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'generationSeconds':round(time.monotonic()-started,2),'status':'audition'}
  manifest['characters'][c['id']]=item;temp=manifest_path.with_suffix('.json.tmp');temp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');temp.replace(manifest_path)
  print(json.dumps({'generated':c['id'],'duration':item['duration'],'seconds':item['generationSeconds'],'rolesDone':len(manifest['characters'])}),flush=True)
 print('CAST_GENERATION_COMPLETE',flush=True)
if __name__=='__main__':main()
