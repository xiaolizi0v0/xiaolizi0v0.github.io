"""Offline batched voice production. The mobile game only reads its emitted MP3s."""
import os
for key,value in {'USE_TF':'0','USE_TORCH':'1','HF_HUB_OFFLINE':'1','TRANSFORMERS_OFFLINE':'1','TOKENIZERS_PARALLELISM':'false'}.items():os.environ[key]=value
import argparse,hashlib,json,subprocess,time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
ROOT=Path(__file__).resolve().parent
def atomic(path,data):
    tmp=path.with_suffix(path.suffix+'.tmp');tmp.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');tmp.replace(path)
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--batch',type=int,default=8);ap.add_argument('--limit',type=int,default=0);ap.add_argument('--scope',choices=['main','extra','all'],default='main');ap.add_argument('--model',default=str(Path.home()/'.codex/cache/after-rain-voices/models/Qwen3-TTS-12Hz-1.7B-Base'));args=ap.parse_args()
    import torch,numpy as np,soundfile as sf
    from qwen_tts import Qwen3TTSModel
    torch.set_num_threads(4)
    refs=json.loads((ROOT/'voice-cast-manifest.json').read_text(encoding='utf-8'))['characters']
    script=json.loads((ROOT/'voice-script.json').read_text(encoding='utf-8'))
    bankfile=ROOT/'voice-lines.json';bank=json.loads(bankfile.read_text(encoding='utf-8'))
    reportfile=ROOT/'voice-production.json';report=json.loads(reportfile.read_text(encoding='utf-8')) if reportfile.exists() else {'model':'Qwen/Qwen3-TTS-12Hz-1.7B-Base','files':{}}
    for role,ref in refs.items():bank[role+'\n'+ref['text']]=ref['file']
    mainUnique={c['speaker']+'\n'+c['text']:c for c in script['main']}
    extras=json.loads((ROOT/'voice-extra-script.json').read_text(encoding='utf-8'))['lines'] if args.scope!='main' else []
    allLines=(script['main'] if args.scope!='extra' else [])+extras
    unique={c['speaker']+'\n'+c['text']:c for c in allLines}
    pending=[(key,c) for key,c in unique.items() if key not in bank or not (ROOT/bank[key]).exists()]
    # Similar lengths reduce wasted padding and early-finished batch members.
    pending.sort(key=lambda entry:(len(entry[1]['text'])//8,entry[1]['speaker'],str(entry[1]['scene'])))
    if args.limit:pending=pending[:args.limit]
    atomic(bankfile,bank)
    print(json.dumps({'phase':'loading','pending':len(pending),'uniqueMain':len(unique),'batch':args.batch}),flush=True)
    model=Qwen3TTSModel.from_pretrained(args.model,device_map='cuda:0',dtype=torch.bfloat16,attn_implementation='sdpa',local_files_only=True)
    # Waveform decoding uses much more activation memory than the text/code model.
    # Keep efficient code-generation batches while decoding four independent clips
    # at a time. This changes no weights, voice prompts or generated codec tokens.
    original_decode=model.model.speech_tokenizer.decode
    def decode_small_batches(encoded):
        if not isinstance(encoded,list) or len(encoded)<=4:return original_decode(encoded)
        audio=[];sample_rate=None
        for offset in range(0,len(encoded),4):
            waves,rate=original_decode(encoded[offset:offset+4]);audio.extend(waves)
            if sample_rate is not None and sample_rate!=rate:raise RuntimeError('Mixed sample rates')
            sample_rate=rate
        return audio,sample_rate
    model.model.speech_tokenizer.decode=decode_small_batches
    prompts={}
    for role,ref in refs.items():
        if hashlib.sha256((ROOT/ref['wav']).read_bytes()).hexdigest()!=ref['sha256']:raise RuntimeError('Reference checksum: '+role)
        prompts[role]=model.create_voice_clone_prompt(ref_audio=str(ROOT/ref['wav']),ref_text=ref['text'],x_vector_only_mode=False)[0]
    out=ROOT/'assets/voice-lines';out.mkdir(parents=True,exist_ok=True)
    index=0;size=args.batch;started=time.monotonic()
    while index<len(pending):
        entries=pending[index:index+size];batchstart=time.monotonic()
        torch.cuda.reset_peak_memory_stats()
        try:
            torch.manual_seed(20261013+index)
            with torch.inference_mode():wavs,sr=model.generate_voice_clone(text=[c['text'] for _,c in entries],language=['Chinese']*len(entries),voice_clone_prompt=[prompts[c['speaker']] for _,c in entries],non_streaming_mode=True,max_new_tokens=512)
        except torch.OutOfMemoryError:
            if size==1:raise
            torch.cuda.empty_cache();size=max(1,size//2);print('REDUCED_BATCH '+str(size),flush=True);continue
        def write_clip(item):
            (key,c),wave=item
            wave=np.asarray(wave,dtype=np.float32);duration=len(wave)/sr;peak=float(np.max(np.abs(wave)));rms=float(np.sqrt(np.mean(wave**2)))
            if not np.all(np.isfinite(wave)) or rms<.0001 or duration<.2 or duration>45:raise RuntimeError(('Invalid audio',c['key'],duration,rms))
            wave*=min(1,.98/peak) if peak else 1
            stem=hashlib.sha256(key.encode()).hexdigest()[:20];wav=out/(stem+'.tmp.wav');mp3=out/(stem+'.mp3');sf.write(str(wav),wave,sr,subtype='PCM_16')
            subprocess.run(['ffmpeg','-y','-v','error','-i',str(wav),'-codec:a','libmp3lame','-b:a','96k',str(mp3)],check=True);wav.unlink()
            file='assets/voice-lines/'+mp3.name
            meta={'speaker':c['speaker'],'text':c['text'],'duration':round(duration,3),'rms':rms,'reference':refs[c['speaker']]['sha256'],'sha256':hashlib.sha256(mp3.read_bytes()).hexdigest()}
            return key,file,meta
        with ThreadPoolExecutor(max_workers=4) as pool:
            for key,file,meta in pool.map(write_clip,zip(entries,wavs)):
                bank[key]=file;report['files'][file]=meta
        index+=len(entries);report['mainCovered']=sum(key in bank for key in mainUnique);report['mainUnique']=len(mainUnique);report['scope']=args.scope;report['scopeCovered']=sum(key in bank for key in unique);report['scopeUnique']=len(unique);report['status']='complete' if report['scopeCovered']==len(unique) else 'generating';atomic(bankfile,bank);atomic(reportfile,report)
        print(json.dumps({'done':index,'requested':len(pending),'mainCovered':report['mainCovered'],'mainUnique':len(unique),'batchSeconds':round(time.monotonic()-batchstart,2),'elapsedSeconds':round(time.monotonic()-started,2),'peakGiB':round(torch.cuda.max_memory_allocated()/2**30,2)}),flush=True)
        if torch.cuda.max_memory_allocated()>10.5*2**30 and size>8:
            size=max(8,size//2);torch.cuda.empty_cache();print('REDUCED_BATCH_TO_AVOID_VRAM_PAGING '+str(size),flush=True)
        # Windows WDDM can page a fragmented reserved pool despite a modest live
        # allocation peak. Release unused waveform workspaces between batches.
        torch.cuda.empty_cache()
    print('OFFLINE_PRODUCTION_COMPLETE',flush=True)
if __name__=='__main__':main()
