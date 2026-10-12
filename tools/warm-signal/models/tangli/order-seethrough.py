"""Correct Tang Li's inferred layer stack without changing any raster or bounds.

Keep the raw inference PSD. This ordering is an art-review candidate, not a rig.
"""
import argparse
import hashlib
import json
from pathlib import Path

from psd_tools import PSDImage


ORDER = [
    "back hair", "legwear", "footwear", "neck", "handwear-r", "handwear-l",
    "topwear", "bottomwear", "neckwear", "ears-r", "ears-l", "face",
    "eyebrow-r", "eyebrow-l", "eyewhite-r", "eyewhite-l", "irides-r",
    "irides-l", "eyelash-r", "eyelash-l", "nose", "mouth", "earwear",
    "front hair", "headwear",
]


def raster_identity(layer):
    pixels = layer.topil(apply_icc=False)
    mask = layer.mask.topil() if layer.has_mask() else None
    return {
        "bounds": layer.bbox,
        "opacity": layer.opacity,
        "visible": layer.visible,
        "blendMode": layer.blend_mode.value,
        "pixels": hashlib.sha256(pixels.tobytes()).hexdigest(),
        "mask": None if mask is None else hashlib.sha256(mask.tobytes()).hexdigest(),
    }


def reorder(source, output, provenance_path, record_path):
    if output.exists() or record_path.exists():
        raise ValueError("Use new output paths; never overwrite the raw experiment.")
    provenance = json.loads(provenance_path.read_text(encoding="utf-8"))
    if provenance.get("exitCode") != 0:
        raise ValueError("The inference run did not finish successfully.")
    psd = PSDImage.open(source)
    layers = list(psd)
    names = [layer.name for layer in layers]
    if len(set(names)) != len(names) or set(names) - set(ORDER):
        raise ValueError("Unknown or repeated layer names require an explicit order review.")
    before = {layer.name: raster_identity(layer) for layer in layers}
    ordered = sorted(layers, key=lambda layer: ORDER.index(layer.name))
    psd.clear()
    psd.extend(ordered)
    output.parent.mkdir(parents=True, exist_ok=True)
    psd.save(output)
    reread = PSDImage.open(output)
    after = {layer.name: raster_identity(layer) for layer in reread}
    if before != after or list(after) != [layer.name for layer in ordered]:
        raise ValueError("Pixel, mask, bounds or order verification failed; do not publish.")
    provenance["postprocess"] = {
        "operation": "semantic-layer-order-review-v1",
        "rawPsdSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "layerOrder": list(after),
        "rastersMasksAndBoundsUnchanged": True,
        "artStatus": "pending-art-review",
        "rigged": False,
        "reason": "Keep legs behind the skirt, skirt above the filled clothing area, and neck behind the neckline.",
    }
    record_path.write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"layers": len(layers), "output": str(output), "rastersMasksAndBoundsUnchanged": True}, ensure_ascii=False))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    for name in ("source", "output", "provenance", "record"):
        parser.add_argument("--" + name, required=True, type=Path)
    args = parser.parse_args()
    reorder(args.source, args.output, args.provenance, args.record)
