# Shahnameh text

The Shahnameh source PDF and its structured extraction live together here.
The [PDF preface](shahnameh-ferdowsi.pdf#page=4), on physical page 4, credits
Pejman Pourhossein (پژمان پورحسین), dated Shahrivar 1391 SH. It describes a
compilation consulting Fereydoun Joneydi's first edition of 1387 SH,
Mohammad Ramazani's second edition of 1354 SH, and data from RiRa and Ganjoor.
The PDF carries takbook.com branding. It is not a facsimile of a single
Joneydi edition; our earlier attribution to "Joneydi's 1354 edition" was wrong.

| File | Use it for |
| --- | --- |
| [shahnameh-ferdowsi.pdf](shahnameh-ferdowsi.pdf) | Original 1,973-page PDF, including its preface and contents. `pdfPage` values refer to physical PDF pages, starting at 1. |
| `shahnameh.md` | Reading and grepping. `#` = chapter, `##` = section (sub-chapter), one numbered couplet per line: `first hemistich / second hemistich`. |
| `shahnameh.json` | Code. `chapters[].sections[].couplets[]`, where each couplet is `[first, second]`. Chapters and sections have stable ids (`"01"`, `"01.01"`) and `pdfPage`. |
| `anomalies.txt` | The 10 rows where a hemistich had no partner in the PDF. Check these by eye against the PDF before using those passages. |

Extraction totals: 50 heading groups, 646 sections, 49,615 verse rows.
Ten rows lack one hemistich, so this is not a fully proofread couplet count.
The 50 groups follow the PDF's typography and our extractor's thresholds.
Ganjoor and Divansara use 61 top-level entries; subsection divisions also
differ. See the [comparison and proposed migration](../reports/chapter-structure-2026-11-06.md).
Do not infer missing stories from the chapter count alone.

The first sub-chapter, آغاز کتاب → آغاز کتاب, is section `01.01` (15 couplets).

## How it was made

```sh
python3 -m venv .venv && .venv/bin/pip install pymupdf
.venv/bin/python -I scripts/build_text.py text/shahnameh-ferdowsi.pdf text/
mkdir -p work/text-crosscheck
.venv/bin/pip install pypdf && .venv/bin/python -I scripts/extract_pdf.py text/shahnameh-ferdowsi.pdf work/text-crosscheck/raw.txt   # optional check:
python3 -I scripts/crosscheck.py text/shahnameh.md work/text-crosscheck/raw.txt
```

The PDF prints each couplet as two columns. The script uses PyMuPDF glyph
positions to pair them and to place section headings between rows. See the
docstring in `scripts/build_text.py` for the layout rules and fixes, which are:

- The لا ligature is decoded backwards by PyMuPDF. Those pairs are detected by
  their zero-width glyph box and swapped back.
- Arabic ي and ك are normalised to Persian ی and ک.
- ZWNJ (نیم‌فاصله) from the PDF is kept, for example `نگارنده‌ی`.

The original extraction check found every word except 4 in pypdf's independent
extraction. That word-presence check does not establish correct verse order,
pairing, boundaries, or equivalence to another edition.

The spelling follows the source edition (for example `برترست`, `بی‌کار`).
Don't modernise it silently. Section checks compare content with this source;
correct extraction errors through an explicit, reviewed source correction.

Some opening hemistichs land in the preceding local section. For example,
`37.21` ends with Ganjoor's first hemistich for Yazdgerd II, and `40.01` ends
with its first hemistich for Qobad, paired with different second hemistichs.
Physical PDF page 1480 itself prints a pairing that differs from Ganjoor.
Review the PDF's pairings as well as extraction boundaries and the ten
hemistich anomalies before building the affected passages. The research
report records these examples; it does not change the extracted text or IDs.
