import sys
from pypdf import PdfReader
src, out = sys.argv[1], sys.argv[2]
r = PdfReader(src)
print("pages", len(r.pages))
with open(out, "w", encoding="utf-8") as f:
    for i, p in enumerate(r.pages):
        f.write(f"\n=====PAGE {i+1}=====\n")
        f.write(p.extract_text() or "")
