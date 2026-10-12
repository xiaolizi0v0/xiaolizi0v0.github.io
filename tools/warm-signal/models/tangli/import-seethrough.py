"""Package actual See-through PSD output for art review, preserving layer coordinates.

This is format conversion and provenance checking, not a rig or an art generator.
Run in the dedicated See-through environment. Never overwrite another experiment.
"""
import argparse
import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image
from psd_tools import PSDImage
from psd_tools.constants import ColorMode


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def package(psd_path, source_png, destination, provenance_path):
    if destination.exists():
        raise ValueError("Choose a new versioned output directory; this experiment already exists.")
    psd = PSDImage.open(psd_path)
    source = Image.open(source_png)
    if source.size != psd.size:
        raise ValueError("Reference and PSD must use exactly the same canvas.")
    if not len(psd):
        raise ValueError("Empty PSD output.")
    if psd.depth != 8 or psd.color_mode != ColorMode.RGB:
        raise ValueError("Expected the 8-bit RGB art PSD, not the depth-map PSD.")
    if any(layer.is_group() for layer in psd):
        raise ValueError("Nested groups need explicit handling; do not silently flatten.")
    if any(layer.clipping or layer.has_vector_mask() for layer in psd):
        raise ValueError("Clipping and vector masks need explicit handling; do not discard them.")
    if any(layer.blend_mode.value != b"norm" for layer in psd):
        raise ValueError("Non-normal blending needs explicit handling in the review stack.")
    provenance = json.loads(provenance_path.read_text(encoding="utf-8"))
    if provenance.get("status") != "inference-finished-awaiting-art-review" or provenance.get("exitCode") != 0:
        raise ValueError("Only a successfully finished inference run can be packaged for review.")
    original = Path(provenance["sourceImage"])
    if digest(original) != provenance.get("sourceSha256"):
        raise ValueError("The original input no longer matches the recorded inference source.")
    destination.mkdir(parents=True)
    layers_dir = destination / "parts"
    layers_dir.mkdir()
    manifest = {
        "version": 1,
        "name": "唐梨",
        "status": "pending-art-review",
        "rigged": False,
        "width": psd.width,
        "height": psd.height,
        "reference": "source.png",
        "composite": "composite.png",
        "psd": "source.psd",
        "sourceSha256": provenance["sourceSha256"],
        "referenceSha256": digest(source_png),
        "original": "original.png",
        "psdSha256": digest(psd_path),
        "provenance": provenance,
        "parts": [],
    }
    # psd-tools iteration is the actual PSD stack, bottom to top. Keep that order.
    for order, layer in enumerate(psd):
        # psd-tools frompil stores See-through's alpha in a raster layer mask.
        # Render each isolated layer with that mask and opacity, rather than
        # losing transparency through topil(). Preserve its original bounds.
        image = layer.composite(
            viewport=layer.bbox, force=True, color=0.0, alpha=0.0,
            layer_filter=lambda item: True, apply_icc=False,
        )
        if image is None:
            raise ValueError("Missing pixel data in " + layer.name)
        image = image.convert("RGBA")
        if image.size != (layer.width, layer.height):
            raise ValueError("Unexpected layer bounds in " + layer.name)
        filename = "parts/" + str(order).zfill(2) + ".png"
        image.save(destination / filename)
        manifest["parts"].append({
            "id": "part-" + str(order),
            "name": layer.name,
            "order": order,
            "left": layer.left,
            "top": layer.top,
            "width": layer.width,
            "height": layer.height,
            "opacity": 1,
            "sourceOpacity": layer.opacity / 255,
            "rasterMaskApplied": layer.has_mask(),
            "visible": layer.visible,
            "blendMode": layer.blend_mode.value.decode("ascii"),
            "file": filename,
        })
    shutil.copy2(source_png, destination / "source.png")
    shutil.copy2(original, destination / "original.png")
    shutil.copy2(psd_path, destination / "source.psd")
    psd.composite(force=True, apply_icc=False).save(destination / "composite.png")
    (destination / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({
        "directory": str(destination), "layers": len(psd), "canvas": psd.size,
        "status": manifest["status"], "rigged": False,
    }, ensure_ascii=False))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--psd", required=True, type=Path)
    parser.add_argument("--reference", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--provenance", required=True, type=Path)
    args = parser.parse_args()
    package(args.psd, args.reference, args.output, args.provenance)
