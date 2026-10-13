"""Measure riding alpha components and emit source rectangles; never edit source PNGs."""
from pathlib import Path
from PIL import Image
import json
import sys

base = Path(__file__).parent
files = {'solo': 'city-ride-shen-yu-v1.png', 'boy': 'city-ride-tang-li-boy-v2.png', 'girl': 'city-ride-tang-li-girl-v3.png'}
for character in json.loads((base.parent.parent / 'docs/warm-signal-city-riding-cast-spec.json').read_text(encoding='utf-8')):
    files[character['slug']+'-boy'] = character['boyFile']
    files[character['slug']+'-girl'] = character['girlFile']
if len(sys.argv) > 1:
    files = {Path(name).stem: Path(name).name for name in sys.argv[1:]}
sheets = {}
for key, name in files.items():
    image = Image.open(base / 'assets' / name)
    assert image.mode == 'RGBA', name
    w, h = image.size
    mask = bytearray(value > 128 for value in image.getchannel('A').tobytes())
    parts = []
    for start in range(w*h):
        if not mask[start]:
            continue
        stack, count = [start], 0
        mask[start] = 0
        left, top, right, bottom = w, h, 0, 0
        while stack:
            current = stack.pop()
            x, y = current % w, current // w
            count += 1
            left, top, right, bottom = min(left, x), min(top, y), max(right, x), max(bottom, y)
            for neighbour in ((current-1 if x else -1), (current+1 if x<w-1 else -1), (current-w if y else -1), (current+w if y<h-1 else -1)):
                if 0 <= neighbour < len(mask) and mask[neighbour]:
                    mask[neighbour] = 0
                    stack.append(neighbour)
        if count > 10000:
            parts.append([left, top, right+1, bottom+1])
    assert len(parts) == 6, (name, len(parts))
    parts.sort(key=lambda b:b[1])
    parts = [p for row in range(3) for p in sorted(parts[row*2:row*2+2], key=lambda b:b[0])]
    frames = []
    for left, top, right, bottom in parts:
        assert left > 0 and top > 0 and right < w and bottom < h, (name, 'cropped silhouette')
        left, top, right, bottom = max(0,left-1), max(0,top-1), min(w,right+1), min(h,bottom+1)
        frames.append([left, top, right-left, bottom-top])
    for i, (x,y,fw,fh) in enumerate(frames):
        for a,b,c,d in frames[:i]:
            assert not (x<a+c and x+fw>a and y<b+d and y+fh>b), (name,'overlapping source rectangles')
    sheets[key] = {'file':name, 'size':[w,h], 'frames':frames}
if len(sys.argv) == 1:
    (base / 'city-riding-frames.js').write_text('(function(root){\'use strict\';root.WarmCityRidingFrames='+json.dumps(sheets,separators=(',',':'))+';})(window);\n',encoding='utf-8')
print(json.dumps(sheets,ensure_ascii=False,indent=2))
