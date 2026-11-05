"""Tile screenshots into one review sheet. Usage: sheet.py <prefix> <out.jpg> <cols> <beat>..."""
import sys
from PIL import Image, ImageDraw
prefix, out, cols, beats = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4:]
ims = [Image.open(f"{prefix}-{b}.png").convert("RGB") for b in beats]
scale = 720 / ims[0].width if ims[0].width > ims[0].height else 300 / ims[0].width
tw, th = int(ims[0].width * scale), int(ims[0].height * scale)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (tw * cols, (th + 20) * rows), "#222")
d = ImageDraw.Draw(sheet)
for i, (b, im) in enumerate(zip(beats, ims)):
    x, y = (i % cols) * tw, (i // cols) * (th + 20)
    sheet.paste(im.resize((tw, th)), (x, y + 20))
    d.text((x + 5, y + 4), f"beat {b}", fill="#fff")
sheet.save(out, quality=85)
