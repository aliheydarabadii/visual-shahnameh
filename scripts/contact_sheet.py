"""Tile the paintings in a folder (png/avif/webp) into one image for review. Usage: contact_sheet.py <dir> <out.jpg>"""
import sys, pathlib
from PIL import Image, ImageDraw
files = sorted(f for f in pathlib.Path(sys.argv[1]).iterdir() if f.suffix in {".png", ".avif", ".webp"})
tw, th, cols = 600, 400, 3
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * tw, rows * (th + 24)), "#111")
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((tw, th))
    x, y = (i % cols) * tw, (i // cols) * (th + 24)
    sheet.paste(im, (x, y + 24))
    d.text((x + 6, y + 6), f.name, fill="#eee")
sheet.save(sys.argv[2], quality=88)
