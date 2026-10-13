"""Download the three credited music assets from their composer's own library."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib
import html
import json
import re
import urllib.request

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'assets' / 'music'
TRACKS = [('childhood', 'Childhood'), ('elementary', 'Elementary'), ('reverie', 'Reverie')]

def request(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9', 'Accept-Encoding': 'identity'
    }), timeout=35)

def fetch(item):
    key, title = item
    page = 'https://www.scottbuckley.com.au/library/' + key + '/'
    with request(page) as response:
        source = response.read().decode('utf-8')
    assert 'creativecommons.org/licenses/by/4.0' in source, (title, 'CC BY 4.0 declaration missing')
    urls = [html.unescape(u) for u in re.findall(r'(?:href|src)=[\'\"]([^\'\"]+\.mp3)[\'\"]', source)]
    url = next(u for u in urls if 'scottbuckley.com.au/' in u and key in u.lower())
    with request(url) as response:
        data = response.read()
        mime = response.headers.get_content_type()
    assert mime in ('audio/mpeg', 'application/octet-stream') and len(data) > 100000, (title, mime, len(data))
    assert data[:3] == b'ID3' or data[0] == 255, (title, 'Not an MP3')
    path = OUT / (key + '-scott-buckley.mp3')
    path.write_bytes(data)
    return {'id': key, 'title': title, 'artist': 'Scott Buckley', 'page': page, 'download': url,
            'license': 'CC BY 4.0', 'licenseUrl': 'https://creativecommons.org/licenses/by/4.0/',
            'file': path.name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(),
            'downloadedOn': '2026-10-13', 'changes': 'Original MP3, unmodified; runtime volume/fades/looping only.'}

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=3) as pool:
        tracks = list(pool.map(fetch, TRACKS))
    (OUT / 'sources.json').write_text(json.dumps(tracks, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(tracks, ensure_ascii=False))
