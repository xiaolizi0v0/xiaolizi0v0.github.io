"""Read-only image geometry, independent pixel region and HTTP asset checks.
No generated image is modified or exported by this QA script.
"""
import concurrent.futures, hashlib, json, re, urllib.request
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
plan = json.loads((root / 'docs/neon-seasons-story-image-prompts.json').read_text(encoding='utf-8'))
source = (root / 'tools/neon-seasons/story-images.js').read_text(encoding='utf-8')
manifest = json.loads(re.search(r'const manifest=(.*?);\n', source).group(1))
regions, originals, entries = {}, {}, []
for job in plan['jobs']:
    file = root / 'tools/neon-seasons/assets/story' / (job['key'] + '.png')
    data = file.read_bytes()
    originals[job['key']] = hashlib.sha256(data).hexdigest()
    with Image.open(file) as image:
        image.load()
        assert image.size == (1536, 1024), job['key']
        for slot, identifier in enumerate(job['ids']):
            mapping = manifest[job['kind']][str(identifier)]
            assert mapping == [job['key'], slot], (job['kind'], identifier, mapping)
            x, y = slot % 2 * 768, slot // 2 * 512
            # Crop only in memory for pixel comparison; no altered image file is saved.
            digest = hashlib.sha256(image.crop((x, y, x + 768, y + 512)).convert('RGB').tobytes()).hexdigest()
            key = f"{job['kind']}:{identifier}"
            assert digest not in regions, (key, regions.get(digest))
            regions[digest] = key
            entries.append({'scene': key, 'atlas': job['key'], 'cell': slot, 'pixelSHA256': digest})
assert len(originals) == len(set(originals.values())) == 52
assert len(entries) == sum(len(group) for group in manifest.values()) == 208

def head(job):
    url = 'http://127.0.0.1:8765/tools/neon-seasons/assets/story/' + job['key'] + '.png'
    request = urllib.request.Request(url, method='HEAD')
    with urllib.request.urlopen(request, timeout=15) as response:
        assert response.status == 200, job['key']
        assert response.headers.get('Content-Type', '').startswith('image/png'), job['key']
        assert int(response.headers['Content-Length']) == (root / 'tools/neon-seasons/assets/story' / (job['key'] + '.png')).stat().st_size
        return {'atlas': job['key'], 'status': response.status, 'bytes': int(response.headers['Content-Length'])}

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    responses = list(pool.map(head, plan['jobs']))
result = {'atlases':52, 'sceneMappings':208, 'distinctAtlasHashes':52, 'distinctScenePixelHashes':208, 'sharedMappings':0, 'httpAssets':responses, 'scenes':entries, 'scope':'File geometry, exact planned mapping, pixel nonreuse and HTTP delivery; not an automated judgment of artistic fidelity.'}
(root / 'docs/neon-seasons-story-image-final-audit.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({k: result[k] for k in ['atlases','sceneMappings','distinctAtlasHashes','distinctScenePixelHashes','sharedMappings']}))
