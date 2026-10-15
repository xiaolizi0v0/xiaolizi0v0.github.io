"""Build TapTap's one-folder H5 ZIP from the existing game; no account or upload writes."""
from pathlib import Path
import argparse, fnmatch, hashlib, json, re, subprocess, zipfile
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / 'tools'
SOURCE = TOOLS / 'warm-signal'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', default='artifacts/taptap/20261014')
    parser.add_argument('--voice-bitrate', choices=['96k','48k'], default='96k')
    args = parser.parse_args()
    output = (ROOT / args.output).resolve()
    if not output.is_relative_to(ROOT):
        raise ValueError('Output must stay inside this workspace')
    game = output / 'game'
    if game.exists():
        raise ValueError('Use a new output directory; existing release files are never overwritten')
    game.mkdir(parents=True)
    html = (TOOLS / 'WarmSignal.html').read_text(encoding='utf-8')
    runtime = sorted(set(re.findall(r'(?:src|href)="(warm-signal/[^"?]+\.(?:js|css))(?:\?[^" ]*)?"', html)))
    files = {}
    text = ''
    for name in runtime:
        source = TOOLS / name
        if not source.is_file():
            raise ValueError('Missing runtime file: ' + name)
        content = source.read_text(encoding='utf-8')
        text += content + '\n'
        # Release index is at game/ rather than tools/; documentation stays inside game/.
        files[name] = content.replace('../docs/', 'docs/').encode('utf-8')
    files['index.html'] = html.replace('<html lang="zh-CN">', '<html lang="zh-CN" data-platform="taptap">').encode('utf-8')
    for name in ['voice-lines.json', 'voice-cast-manifest.json']:
        files['warm-signal/' + name] = (SOURCE / name).read_bytes()
    # Every encoded image is retained; duplicate raw PNGs only ship when used at runtime.
    literal_png = set(re.findall(r'[\w-]+\.png', text))
    png_patterns = ['city-*-atlas-v1.png', 'city-*-outfits-v1.png']
    for asset in sorted((SOURCE / 'assets').iterdir()):
        if not asset.is_file():
            continue
        if asset.suffix.lower() == '.png' and asset.name not in literal_png and not any(fnmatch.fnmatch(asset.name,p) for p in png_patterns):
            continue
        if asset.suffix.lower() not in {'.png','.webp','.jpg','.jpeg','.svg','.gif','.ico'}:
            continue
        files['warm-signal/assets/' + asset.name] = asset.read_bytes()
    bank = json.loads((SOURCE / 'voice-lines.json').read_text(encoding='utf-8'))
    cast = json.loads((SOURCE / 'voice-cast-manifest.json').read_text(encoding='utf-8'))
    audio = set(bank.values()) | {c['file'] for c in cast['characters'].values()}
    def encode(relative):
        source = (SOURCE / relative).resolve()
        if not source.is_relative_to(SOURCE) or not source.is_file():
            raise ValueError('Missing audio: ' + relative)
        if args.voice_bitrate == '48k':
            target = output / '.voice-cache' / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            subprocess.run(['ffmpeg','-y','-v','error','-i',str(source),'-ac','1','-ar','24000','-b:a','48k','-threads','1',str(target)],check=True)
            return relative, target.read_bytes()
        return relative, source.read_bytes()
    with ThreadPoolExecutor(max_workers=8) as pool:
        for count,(relative,content) in enumerate(pool.map(encode,sorted(audio)),1):
            files['warm-signal/' + relative] = content
            if count % 500 == 0:
                print(json.dumps({'encodedVoices':count,'total':len(audio)},ensure_ascii=False),flush=True)
    for source in (SOURCE / 'assets/music').iterdir():
        if source.is_file() and source.suffix.lower() in {'.mp3','.md','.txt'}:
            files['warm-signal/assets/music/' + source.name] = source.read_bytes()
    for name in set(re.findall(r'\.\./docs/([\w-]+\.md)', text)):
        source = ROOT / 'docs' / name
        if not source.is_file():
            raise ValueError('Missing linked document: ' + name)
        files['docs/' + name] = source.read_bytes()
    manifest = {'title':'心动来信','platform':'TapTap H5','orientation':'portrait',
        'entry':'game/index.html','voiceClips':len(audio),'voiceBitrate':args.voice_bitrate,'files':len(files),
        'bytes':sum(map(len,files.values())),
        'sha256':{name:hashlib.sha256(content).hexdigest() for name,content in files.items()},
        'excluded':['browser saves and AI keys','model weights','Live2D/3D experiments','raw WAV references','developer generation tools','unreferenced PNG masters']}
    for name, content in files.items():
        target = game / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(content)
    archive = output / 'warm-signal-taptap-h5.zip'
    with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for name in files:
            z.write(game/name,'game/'+name)
    manifest['archiveBytes'] = archive.stat().st_size
    manifest['archiveSha256'] = hashlib.sha256(archive.read_bytes()).hexdigest()
    (output/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({k:v for k,v in manifest.items() if k!='sha256'},ensure_ascii=False,indent=2))

if __name__ == '__main__':
    main()
