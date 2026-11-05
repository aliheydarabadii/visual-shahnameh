"""Convert generated paintings (PNG) into the web format the site ships: AVIF.

Usage:
  .venv/bin/python -I scripts/optimize_art.py art/incoming/01-04 public/art/01-04 [--delete-source]

Settings, chosen by measurement (SSIM against the 1536x1024 originals):
  AVIF q70, 4:4:4 chroma  -> ~500 KB per detailed painting, SSIM ~0.958
  (the old WebP q82 was ~560 KB at SSIM ~0.92, so this is smaller and sharper).
Paintings keep their full 1536 px width: phones in portrait show them about
3x zoomed on high-density screens, so a smaller variant would look soft.

Originals are NOT kept (the book would need tens of GB). Generate into
art/incoming/<id>/ (gitignored), convert, then pass --delete-source.
"""
import pathlib
import sys

from PIL import Image

PAINTING_QUALITY = 70
# Light layers are mostly black and composite with `screen`; they compress hard.
LAYER_QUALITY = 60

args = [a for a in sys.argv[1:] if not a.startswith("--")]
delete = "--delete-source" in sys.argv
src, out = pathlib.Path(args[0]), pathlib.Path(args[1])
out.mkdir(parents=True, exist_ok=True)

files = sorted(p for p in src.iterdir() if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"})
if not files:
    sys.exit(f"no images in {src}")
for f in files:
    im = Image.open(f).convert("RGB")
    if im.size != (1536, 1024):
        print(f"warning: {f.name} is {im.size[0]}x{im.size[1]}, expected 1536x1024")
    target = out / (f.stem + ".avif")
    quality = LAYER_QUALITY if f.stem.startswith("layer-") else PAINTING_QUALITY
    im.save(target, "AVIF", quality=quality, speed=4, subsampling="4:4:4")
    print(f"{target}  {target.stat().st_size // 1024} KB")
    if delete:
        f.unlink()
if delete and not any(src.iterdir()):
    src.rmdir()
