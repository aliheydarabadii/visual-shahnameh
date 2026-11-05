# Shahnameh text

The full text of the Shahnameh, extracted from `source/shahnameh-ferdowsi.pdf`
(takbook.com edition, based on Fereydoun Joneydi's 1354 edition).

| File | Use it for |
| --- | --- |
| `shahnameh.md` | Reading and grepping. `#` = chapter, `##` = section (sub-chapter), one numbered couplet per line: `first hemistich / second hemistich`. |
| `shahnameh.json` | Code. `chapters[].sections[].couplets[]`, where each couplet is `[first, second]`. Chapters and sections have stable ids (`"01"`, `"01.01"`) and `pdfPage`. |
| `anomalies.txt` | The 10 rows where a hemistich had no partner in the PDF. Check these by eye against the PDF before using those passages. |

Totals: 50 chapters, 646 sections, 49,615 couplets.

The first sub-chapter, آغاز کتاب → آغاز کتاب, is section `01.01` (15 couplets).

## How it was made

```sh
python3 -m venv .venv && .venv/bin/pip install pymupdf
.venv/bin/python -I scripts/build_text.py source/shahnameh-ferdowsi.pdf text/
.venv/bin/pip install pypdf && .venv/bin/python -I scripts/extract_pdf.py source/shahnameh-ferdowsi.pdf source/raw.txt   # optional check:
python3 -I scripts/crosscheck.py text/shahnameh.md source/raw.txt
```

The PDF prints each couplet as two columns. The script uses PyMuPDF glyph
positions to pair them and to place section headings between rows. See the
docstring in `scripts/build_text.py` for the layout rules and fixes, which are:

- The لا ligature is decoded backwards by PyMuPDF. Those pairs are detected by
  their zero-width glyph box and swapped back.
- Arabic ي and ك are normalised to Persian ی and ک.
- ZWNJ (نیم‌فاصله) from the PDF is kept, for example `نگارنده‌ی`.

Check: every word in the output except 4 also appears in pypdf's independent
extraction (`source/raw.txt`), so the two extractions agree closely.

The spelling follows the source edition (for example `برترست`, `بی‌کار`).
Don't modernise it silently. If a display needs a change, make it in the
chapter's content file and note it there.
