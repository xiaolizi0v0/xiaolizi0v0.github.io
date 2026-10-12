import os, sys, zlib, lzma, json
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

def decompress_swf(swf_path):
    with open(swf_path, 'rb') as f:
        sig = f.read(3)
        ver = f.read(1)[0]
        uncomp_len = int.from_bytes(f.read(4), 'little')
        if sig == b'CWS':
            return zlib.decompressobj(15).decompress(f.read())
        elif sig == b'ZWS':
            comp_len = int.from_bytes(f.read(4), 'little')
            props = f.read(5)
            d = props[0]
            filters = [{
                'id': lzma.FILTER_LZMA1,
                'dict_size': int.from_bytes(props[1:5], 'little'),
                'lc': d % 9,
                'lp': (d // 9) % 5,
                'pb': (d // 9) // 5
            }]
            return lzma.LZMADecompressor(format=lzma.FORMAT_RAW, filters=filters).decompress(f.read())
        elif sig == b'FWS':
            return f.read()
        raise ValueError(f"Unknown signature: {sig}")

def extract_swf_assets(swf_path, target_sid):
    data = decompress_swf(swf_path)
    nbits = data[0] >> 3
    idx = ((5 + nbits * 4 + 7) // 8) + 4
    
    shapes = {}    # shape_id -> [bitmap_ids]
    sprites = {}   # sprite_id -> raw tag data
    bitmaps = {}   # bitmap_id -> PIL Image
    
    while idx < len(data):
        tag_hdr = int.from_bytes(data[idx:idx+2], 'little')
        idx += 2
        tag_type = tag_hdr >> 6
        tag_len = tag_hdr & 0x3f
        if tag_len == 0x3f:
            tag_len = int.from_bytes(data[idx:idx+4], 'little')
            idx += 4
        tag_data = data[idx:idx+tag_len]
        idx += tag_len
        
        if tag_type in (2, 22, 32): # DefineShape
            sid = int.from_bytes(tag_data[0:2], 'little')
            bmps = []
            for i in range(4, min(100, len(tag_data)-2)):
                if tag_data[i] in (0x40, 0x41, 0x42, 0x43):
                    bid = int.from_bytes(tag_data[i+1:i+3], 'little')
                    bmps.append(bid)
            shapes[sid] = bmps
        elif tag_type == 39: # DefineSprite
            sid = int.from_bytes(tag_data[0:2], 'little')
            sprites[sid] = tag_data
        elif tag_type == 36: # DefineBitsLossless2
            bid = int.from_bytes(tag_data[0:2], 'little')
            fmt = tag_data[2]
            w = int.from_bytes(tag_data[3:5], 'little')
            h = int.from_bytes(tag_data[5:7], 'little')
            try:
                if fmt == 5:
                    decomp = zlib.decompress(tag_data[7:])
                    img = Image.frombytes('RGBA', (w, h), decomp, 'raw', 'ARGB')
                    bitmaps[bid] = img
                elif fmt == 3:
                    pal_size = tag_data[7] + 1
                    decomp = zlib.decompress(tag_data[8:])
                    pal_bytes = decomp[:pal_size*4]
                    idx_bytes = decomp[pal_size*4:]
                    row_padded = (w + 3) & ~3
                    rgba_data = bytearray(w * h * 4)
                    for y in range(h):
                        for x in range(w):
                            c_idx = idx_bytes[y * row_padded + x]
                            if c_idx < pal_size:
                                rgba_data[(y * w + x)*4 : (y * w + x)*4 + 4] = pal_bytes[c_idx*4 : c_idx*4 + 4]
                    img = Image.frombytes('RGBA', (w, h), bytes(rgba_data))
                    bitmaps[bid] = img
            except:
                pass

    print(f"[{os.path.basename(swf_path)}] Extracted {len(bitmaps)} bitmaps, {len(shapes)} shapes, {len(sprites)} sprites")

    def get_child_bitmaps(cid, visited=None):
        if visited is None: visited = set()
        if cid in visited: return []
        visited.add(cid)
        if cid in bitmaps:
            return [cid]
        res = []
        if cid in shapes:
            for b in shapes[cid]:
                if b in bitmaps: res.append(b)
        if cid in sprites:
            s_data = sprites[cid]
            s_idx = 4
            while s_idx < len(s_data):
                in_hdr = int.from_bytes(s_data[s_idx:s_idx+2], 'little')
                s_idx += 2
                in_type = in_hdr >> 6
                in_len = in_hdr & 0x3f
                if in_len == 0x3f:
                    in_len = int.from_bytes(s_data[s_idx:s_idx+4], 'little')
                    s_idx += 4
                in_data = s_data[s_idx:s_idx+in_len]
                s_idx += in_len
                if in_type == 26 and (in_data[0] & 0x02):
                    sub_cid = int.from_bytes(in_data[3:5], 'little')
                    res.extend(get_child_bitmaps(sub_cid, visited))
                elif in_type == 0: break
        return res

    tag_data = sprites[target_sid]
    s_idx = 4
    cur_label = 'init'
    label_bmps = {}
    while s_idx < len(tag_data):
        in_hdr = int.from_bytes(tag_data[s_idx:s_idx+2], 'little')
        s_idx += 2
        in_type = in_hdr >> 6
        in_len = in_hdr & 0x3f
        if in_len == 0x3f:
            in_len = int.from_bytes(tag_data[s_idx:s_idx+4], 'little')
            s_idx += 4
        in_data = tag_data[s_idx:s_idx+in_len]
        s_idx += in_len
        if in_type == 43:
            null_pos = in_data.find(b'\x00')
            cur_label = in_data[:null_pos].decode('utf-8', errors='replace')
            if cur_label not in label_bmps: label_bmps[cur_label] = []
        elif in_type == 26 and (in_data[0] & 0x02):
            cid = int.from_bytes(in_data[3:5], 'little')
            bmps = get_child_bitmaps(cid)
            if cur_label not in label_bmps: label_bmps[cur_label] = []
            for b in bmps:
                if b not in label_bmps[cur_label]:
                    label_bmps[cur_label].append(b)
        elif in_type == 0: break

    return bitmaps, label_bmps

def upscale_image(img, scale=2):
    w, h = img.size
    # Lanczos super-resolution
    up = img.resize((w * scale, h * scale), Image.Resampling.LANCZOS)
    return up

def process_character(char_id, swf_path, target_sid):
    print(f"\nProcessing {char_id} from {swf_path} (Sprite {target_sid})...")
    bitmaps, label_bmps = extract_swf_assets(swf_path, target_sid)
    
    # Exact UTF-8 Action mappings
    action_matchers = {
        'idle': ['站立'],
        'walk': ['走'],
        'run': ['瞬步', '跑'],
        'jump': ['跳中', '起跳', '跳'],
        'air_attack': ['跳砍'],
        'attack1': ['砍1'],
        'attack2': ['砍2'],
        'attack3': ['砍3'],
        'skill_u': ['砍技1', '招1'],
        'skill_i': ['砍技2', '招2'],
        'skill_o': ['超必杀', '必杀'],
        'hurt': ['被打', '受击'],
        'knockdown': ['击飞_倒', '击飞', '倒地'],
        'win': ['胜利', '万解']
    }
    
    out_orig_dir = f"tools/bvn-hd/assets/sprites/{char_id}"
    out_hd_dir = f"tools/bvn-hd/assets/sprites_hd/{char_id}"
    os.makedirs(out_orig_dir, exist_ok=True)
    os.makedirs(out_hd_dir, exist_ok=True)
    
    char_manifest = {}
    
    # Collect all valid character-sized bitmaps for fallback
    valid_char_bids = [
        bid for bid, img in bitmaps.items()
        if 25 <= img.width <= 250 and 30 <= img.height <= 200
    ]
    
    for action_key, labels in action_matchers.items():
        found_bids = []
        for lbl in labels:
            for l_key, bids in label_bmps.items():
                if lbl == l_key or (lbl in l_key and len(lbl) >= 2):
                    for b in bids:
                        if b in bitmaps:
                            img = bitmaps[b]
                            # Filter character body sprite dimensions (reject fullscreens and 1x1 markers)
                            if 20 <= img.width <= 260 and 25 <= img.height <= 220:
                                if b not in found_bids:
                                    found_bids.append(b)
        
        # If no bids found for this label, take from first matching bitmap or fallback
        if not found_bids:
            found_bids = valid_char_bids[:4]
        
        # Keep 4-6 frames for crisp gameplay animation
        selected_bids = found_bids[:6]
        
        frame_files_orig = []
        frame_files_hd = []
        
        for f_idx, bid in enumerate(selected_bids):
            img = bitmaps.get(bid)
            if img is None: continue
            
            orig_fn = f"{action_key}_{f_idx}.png"
            orig_path = os.path.join(out_orig_dir, orig_fn)
            img.save(orig_path)
            
            hd_img = upscale_image(img, 2)
            hd_path = os.path.join(out_hd_dir, orig_fn)
            hd_img.save(hd_path)
            
            frame_files_orig.append(f"bvn-hd/assets/sprites/{char_id}/{orig_fn}")
            frame_files_hd.append(f"bvn-hd/assets/sprites_hd/{char_id}/{orig_fn}")
        
        char_manifest[action_key] = {
            'frames_orig': frame_files_orig,
            'frames_hd': frame_files_hd,
            'frame_count': len(frame_files_orig)
        }
        print(f"  {action_key}: {len(frame_files_orig)} frames")
    
    return char_manifest

def main():
    characters = [
        ('ichigo', 'tools/bvn-hd/assets/orig/ichigo.swf', 642),
        ('naruto', 'tools/bvn-hd/assets/orig/fighter/naruto.swf', 737),
        ('sasuke', 'tools/bvn-hd/assets/orig/fighter/sasuke.swf', 2),
        ('hitsugaya', 'tools/bvn-hd/assets/orig/fighter/toushirou.swf', 522)
    ]
    
    manifest = {}
    for char_id, swf_path, target_sid in characters:
        manifest[char_id] = process_character(char_id, swf_path, target_sid)
    
    out_manifest = "tools/bvn-hd/assets/sprites_manifest.json"
    with open(out_manifest, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    
    print(f"\nManifest successfully written to {out_manifest}!")

if __name__ == '__main__':
    main()
