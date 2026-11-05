"""Build src/content/toc.json: every chapter and section title, and the book's ages, for the contents.

Usage: python3 -I scripts/build_toc.py text/shahnameh.json src/content/toc.json

Titles come verbatim from the text. English chapter names are below. They
follow the usual English spellings (as in Dick Davis's translation), and
"پادشاهی X" becomes "The Reign of X".
"""

import json
import sys

ENGLISH = {
    "01": "The Opening of the Book",
    "02": "Kayumars",
    "03": "Hushang",
    "04": "Tahmures",
    "05": "Jamshid",
    "06": "Zahhak",
    "07": "Fereydun",
    "08": "Manuchehr",
    "09": "Zal and Rudabeh",
    "10": "Nowzar",
    "11": "Afrasiyab",
    "12": "Zav, Son of Tahmasp",
    "13": "Garshasp",
    "14": "Kay Qobad",
    "15": "Kay Kavus",
    "16": "The Seven Trials of Rostam",
    "17": "Rostam and Sohrab",
    "18": "Siyavash",
    "19": "The Reign of Kay Khosrow",
    "20": "Kamus of Kashan",
    "21": "The Khaqan of Chin",
    "22": "Akvan the Div",
    "23": "Bizhan and Manizheh",
    "24": "The Twelve Champions",
    "25": "Kay Khosrow's Great War with Afrasiyab",
    "26": "The Reign of Lohrasp",
    "27": "The Reign of Goshtasp",
    "28": "The Seven Trials of Esfandiyar",
    "29": "Rostam and Esfandiyar",
    "30": "Rostam and Shaghad",
    "31": "The Reign of Bahman, Son of Esfandiyar",
    "32": "The Reign of Alexander",
    "33": "The Parthian Kings",
    "34": "Haftvad and the Worm",
    "35": "The Sasanian Kings",
    "36": "The Reign of Yazdegerd the Sinner",
    "37": "The Reign of Bahram Gur",
    "38": "The Reign of Yazdegerd, Son of Bahram Gur",
    "39": "The Reign of Piruz",
    "40": "The Reign of Balash",
    "41": "The Reign of Qobad",
    "42": "The Reign of Anushirvan",
    "43": "The Reign of Hormozd",
    "44": "The Reign of Khosrow Parviz",
    "45": "Khosrow and Shirin",
    "46": "The Reign of Qobad, Called Shiruy",
    "47": "The Reign of Ardashir, Son of Shiruy",
    "48": "The Reign of Purandokht",
    "49": "The Reign of Azarmdokht",
    "50": "The Reign of Yazdegerd",
}


# The book's traditional ages. Chapter 01 is the prologue.
ERAS = [
    ("prologue", "دیباچه", "Prologue", ["01"]),
    ("myth", "روزگار اسطوره", "The Age of Myth", [f"{i:02d}" for i in range(2, 8)]),
    ("heroes", "روزگار پهلوانان", "The Age of Heroes", [f"{i:02d}" for i in range(8, 32)]),
    ("history", "روزگار تاریخ", "The Age of History", [f"{i:02d}" for i in range(32, 51)]),
]


def main(src: str, out: str) -> None:
    book = json.load(open(src, encoding="utf-8"))
    chapters = []
    for ch in book["chapters"]:
        chapters.append(
            {
                "id": ch["id"],
                "title": ch["title"],
                "en": ENGLISH[ch["id"]],
                "era": next(key for key, _, _, ids in ERAS if ch["id"] in ids),
                "sections": [[s["id"], s["title"], len(s["couplets"])] for s in ch["sections"]],
            }
        )
    with open(out, "w", encoding="utf-8") as f:
        eras = [{"id": key, "title": fa, "en": en} for key, fa, en, _ in ERAS]
        json.dump({"eras": eras, "chapters": chapters}, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")
    print(f"{out}: {len(chapters)} chapters, {sum(len(c['sections']) for c in chapters)} sections")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
