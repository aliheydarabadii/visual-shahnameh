"""Compare words in text/shahnameh.md against pypdf's independent raw extraction."""
import re, sys
from collections import Counter
norm = lambda t: re.findall(r"[؀-ۿ]+", t.replace("‌", " "))
ours = Counter(norm(open(sys.argv[1], encoding="utf-8").read()))
ref = Counter(norm(open(sys.argv[2], encoding="utf-8").read()))
missing = {w: n for w, n in ours.items() if w not in ref}
print("distinct words ours", len(ours), "not found in pypdf text:", len(missing), "occurrences:", sum(missing.values()))
print(sorted(missing.items(), key=lambda x: -x[1])[:30])
