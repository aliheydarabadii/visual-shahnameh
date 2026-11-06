"""Build the reader's Persian contents from the organized source text.

Usage: python3 -I scripts/build_toc.py text/shahnameh.json src/content/toc.json
Chapter titles, ages and section membership come from the 61-chapter source.
Section IDs remain stable when a chapter changes.
"""

import json
import sys

ERAS = [
    {"id": "prologue", "title": "دیباچه"},
    {"id": "myth", "title": "روزگار اسطوره"},
    {"id": "heroes", "title": "روزگار پهلوانان"},
    {"id": "history", "title": "روزگار تاریخ"},
]


def main(src: str, out: str) -> None:
    with open(src, encoding="utf-8") as f:
        book = json.load(f)
    chapters = [
        {
            "id": ch["id"],
            "title": ch["title"],
            "era": ch["era"],
            "sections": [[s["id"], s["title"], len(s["couplets"])] for s in ch["sections"]],
        }
        for ch in book["chapters"]
    ]
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"eras": ERAS, "sectionAliases": book["sectionAliases"], "chapters": chapters}, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")
    print(f"{out}: {len(chapters)} chapters, {sum(len(c['sections']) for c in chapters)} sections")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
