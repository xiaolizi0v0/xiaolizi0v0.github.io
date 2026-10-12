"""Submit the official native Wan2.2 5B graph to this task's local ComfyUI.
Usage: python queue-wan-shot.py --image assets/street-portrait.png --tag street-test
This submits ONE finite render. No indefinite unattended queue.
"""
import argparse,json,time,uuid
from pathlib import Path
import requests
ROOT=Path(__file__).resolve().parent
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--image',default='assets/street-portrait.png');ap.add_argument('--tag',default='street-test');ap.add_argument('--width',type=int,default=384);ap.add_argument('--height',type=int,default=704);ap.add_argument('--frames',type=int,default=49);ap.add_argument('--steps',type=int,default=20);ap.add_argument('--prompt',default='A refined hand-drawn anime film shot of a coastal city after rain at blue hour. Gentle breeze moves foliage and flowering vines, small rain droplets fall from the cinema awning, warm reflected lights ripple naturally in shallow puddles. A tram moves slowly through the far background. Slow subtle cinematic push-in. Preserve the detailed painted anime style and architecture, calm intimate mood, continuous natural movement. No people appear in the foreground.');args=ap.parse_args()
    if args.width%32 or args.height%32 or (args.frames-1)%4:raise ValueError('Wan size/frame alignment invalid')
    if not args.tag.replace('-','').replace('_','').isalnum():raise ValueError('unsafe tag')
    host='http://127.0.0.1:8188';info=requests.get(host+'/object_info',timeout=20).json()
    for cls,field,file in [('UNETLoader','unet_name','wan2.2_ti2v_5B_fp16.safetensors'),('CLIPLoader','clip_name','umt5_xxl_fp8_e4m3fn_scaled.safetensors'),('VAELoader','vae_name','wan2.2_vae.safetensors')]:
        if file not in info[cls]['input']['required'][field][0]:raise RuntimeError('Model not ready: '+file)
    with (ROOT/args.image).open('rb')as f:
        r=requests.post(host+'/upload/image',files={'image':f},data={'type':'input','overwrite':'false'},timeout=30);r.raise_for_status();image=r.json()['name']
    def n(kind,**inputs):return{'class_type':kind,'inputs':inputs}
    neg='Low quality, blurry, flickering, distortion, melting architecture, moving buildings, new objects appearing, extra people, changing art style, photorealistic, subtitles, text, logos, watermark, oversaturated, shaky camera, abrupt camera cuts.'
    graph={
        '37':n('UNETLoader',unet_name='wan2.2_ti2v_5B_fp16.safetensors',weight_dtype='default'),
        '38':n('CLIPLoader',clip_name='umt5_xxl_fp8_e4m3fn_scaled.safetensors',type='wan',device='default'),
        '39':n('VAELoader',vae_name='wan2.2_vae.safetensors'),
        '48':n('ModelSamplingSD3',model=['37',0],shift=8),
        '6':n('CLIPTextEncode',clip=['38',0],text=args.prompt),
        '7':n('CLIPTextEncode',clip=['38',0],text=neg),
        '56':n('LoadImage',image=image),
        '55':n('Wan22ImageToVideoLatent',vae=['39',0],width=args.width,height=args.height,length=args.frames,batch_size=1,start_image=['56',0]),
        '3':n('KSampler',model=['48',0],seed=20261008,steps=args.steps,cfg=5,sampler_name='uni_pc',scheduler='simple',positive=['6',0],negative=['7',0],latent_image=['55',0],denoise=1),
        '8':n('VAEDecode',samples=['3',0],vae=['39',0]),
        '57':n('CreateVideo',images=['8',0],fps=24),
        '58':n('SaveVideo',video=['57',0],filename_prefix='after-rain/'+args.tag,format='mp4',codec='h264'),
    }
    response=requests.post(host+'/prompt',json={'prompt':graph,'client_id':str(uuid.uuid4())},timeout=30)
    if not response.ok:print(response.text);response.raise_for_status()
    payload=response.json();report={'prompt_id':payload['prompt_id'],'graph':graph,'status':'queued','note':'Low resolution connectivity test; not final quality' if args.width<704 else 'Production resolution candidate, needs visual review'}
    (ROOT/('wan-job-'+args.tag+'.json')).write_text(json.dumps(report,indent=2),encoding='utf8');print(json.dumps({'prompt_id':payload['prompt_id'],'status':'queued'}),flush=True)
if __name__=='__main__':main()
