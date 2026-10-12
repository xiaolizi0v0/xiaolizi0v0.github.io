"""Read alpha components to produce UV metadata; never modify the generated PNGs."""
from pathlib import Path
from PIL import Image
import json

assets = Path(__file__).parent / 'assets'
result, sizes = {}, {}
for path in sorted([*assets.glob('city-*-atlas-v1.png'),*assets.glob('city-*-outfits-v1.png')]):
    image = Image.open(path)
    width, height = image.size
    rows = 4 if '-outfits-' in path.name else 2
    expected = rows*4
    assert image.mode == 'RGBA' and width%4==0 and height%rows==0, path
    alpha = image.getchannel('A')
    mask = bytearray(1 if value > 128 else 0 for value in alpha.tobytes())
    components = []
    for index in range(len(mask)):
        if not mask[index]:
            continue
        stack, pixels = [index], []
        mask[index] = 0
        left, top, right, bottom = width, height, 0, 0
        while stack:
            current = stack.pop()
            x, y = current % width, current // width
            pixels.append((x,y))
            left, right, top, bottom = min(left,x), max(right,x), min(top,y), max(bottom,y)
            for neighbour in ((current-1 if x else -1), (current+1 if x<width-1 else -1), current-width, current+width):
                if 0 <= neighbour < len(mask) and mask[neighbour]:
                    mask[neighbour] = 0
                    stack.append(neighbour)
        if len(pixels) > 10000:
            head = [x for x,y in pixels if y < top+(bottom-top)*.23]
            center = (min(head)+max(head))/2
            components.append((left,top,right+1,bottom+1,center))
    assert len(components) == expected, (path, len(components),expected)
    # Whole-image components also retain hair/hands that cross the nominal grid edge.
    components.sort(key=lambda b:b[1])
    components = [v for row in range(rows) for v in sorted(components[row*4:row*4+4],key=lambda b:(b[0]+b[2])/2)]
    frames = []
    for left,top,right,bottom,center in components:
        left,top = max(0,left-1),max(0,top-1)
        right,bottom = min(width,right+1),min(height,bottom+1)
        frames.append([left,top,right-left,bottom-top,center-left])
    key = path.name[5:-7].replace('-atlas','')
    result[key] = frames
    sizes[key] = [width,height,rows]

target = Path(__file__).parent / 'city-art-frames.js'
target.write_text('window.WarmCityArtFrames='+json.dumps(result, separators=(',',':'))+';\nwindow.WarmCityArtSizes='+json.dumps(sizes,separators=(',',':'))+';\n',encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
