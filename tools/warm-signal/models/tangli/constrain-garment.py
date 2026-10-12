"""Constrain an inferred hidden garment region for this model's art review.

Changes only the bottomwear raster mask above an explicitly reviewed waist line.
Does not repaint pixels, move parts, or overwrite the raw/order-only candidates.
"""
import argparse
import hashlib
import json
from pathlib import Path

from psd_tools import PSDImage


def identity(layer):
    return (layer.bbox, layer.opacity, layer.visible, layer.blend_mode.value,
            hashlib.sha256(layer.topil(apply_icc=False).tobytes()).hexdigest())


def constrain(source, output, provenance_path, record_path, waist_y):
    if output.exists() or record_path.exists():
        raise ValueError("Use new output paths.")
    provenance = json.loads(provenance_path.read_text(encoding="utf-8"))
    if provenance.get("exitCode") != 0:
        raise ValueError("Incomplete inference run.")
    psd = PSDImage.open(source)
    layers = list(psd)
    targets = [layer for layer in layers if layer.name == "bottomwear"]
    if len(targets) != 1 or not targets[0].has_mask():
        raise ValueError("Expected one masked bottomwear layer.")
    target = targets[0]
    mask = target.mask.topil().convert("L")
    cut = waist_y - target.mask.top
    if not 0 < cut < mask.height:
        raise ValueError("The reviewed waist line must lie inside the mask canvas.")
    before = {layer.name: identity(layer) for layer in layers}
    masks = {layer.name: layer.mask.topil().tobytes() if layer.has_mask() else None for layer in layers}
    # This is a model visibility mask, with the RGB artwork left intact.
    mask.paste(0, (0, 0, mask.width, cut))
    target.update_mask(mask)
    output.parent.mkdir(parents=True, exist_ok=True)
    psd.save(output)
    reread = PSDImage.open(output)
    after = {layer.name: identity(layer) for layer in reread}
    if before != after or list(before) != list(after):
        raise ValueError("Raster pixels, coordinates, opacity or layer order changed unexpectedly.")
    for layer in reread:
        decoded = layer.mask.topil().tobytes() if layer.has_mask() else None
        expected = mask.tobytes() if layer.name == target.name else masks[layer.name]
        if decoded != expected:
            raise ValueError("Unexpected mask change in " + layer.name)
    postprocess = provenance.setdefault("postprocess", {})
    postprocess.update({
        "operation": "semantic-order-and-garment-mask-review-v2",
        "rastersMasksAndBoundsUnchanged": False,
        "rasterPixelsAndBoundsUnchanged": True,
        "maskConstraints": [{"layer": "bottomwear", "hideAboveCanvasY": waist_y,
                             "reason": "Remove inferred hidden dress fabric above the original blue skirt waist."}],
        "artStatus": "pending-art-review", "rigged": False,
    })
    record_path.write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"layers": len(layers), "waistY": waist_y,
                      "rasterPixelsAndBoundsUnchanged": True, "onlyChangedMask": target.name}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    for name in ("source", "output", "provenance", "record"):
        parser.add_argument("--" + name, required=True, type=Path)
    parser.add_argument("--waist-y", type=int, required=True)
    args = parser.parse_args()
    constrain(args.source, args.output, args.provenance, args.record, args.waist_y)
