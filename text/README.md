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
| `shahnameh.json` | Code. `chapters[].sections[].couplets[]`, where each couplet is `[first, second]`. Chapters have IDs `01` through `61`; sections keep their original IDs and `pdfPage`. A section's prefix does not identify its current chapter. |
| [chapter-map.json](chapter-map.json) | The 61 chapter titles, reference links, eras and contiguous ranges of permanent section IDs, plus the pre-migration section-content checksum. |
| `anomalies.txt` | The 10 rows where a hemistich had no partner in the PDF. Check these by eye against the PDF before using those passages. |

Current organization: 61 chapters, 646 sections, 49,615 verse rows.
Ten rows lack one hemistich, so this is not a fully proofread couplet count.
The extractor first assigns permanent section IDs from the PDF's original
50 font-based groups, then applies `chapter-map.json` to organize them into
61 chapters following Ganjoor. Sections stay intact, in order, and keep their
text, titles and IDs. For example, chapter `08` contains sections `08.01`
through `09.31`; chapter `61` contains `50.01` through `50.14`.
The chapter organization matches the reference; the finer subsection divisions
and existing PDF verse pairings have not been replaced with Ganjoor's text.

The first sub-chapter, آغاز کتاب → آغاز کتاب, is section `01.01` (15 couplets).

Sections `07.13` and `07.14` expose an extraction bug. On physical PDF page
106, one heading wraps onto a second line ending in «فریدون». The extractor
mistook the two lines for separate section headings, creating an empty
`07.13` and placing all 128 couplets under `07.14`, titled only «فریدون».
This is not an intentional empty section in the book. Correcting these
section boundaries and their reader links remains a separate source correction.

## How it was made

```sh
python3 -m venv .venv && .venv/bin/pip install pymupdf
.venv/bin/python -I scripts/build_text.py text/shahnameh-ferdowsi.pdf text/
python3 -I scripts/build_toc.py text/shahnameh.json src/content/toc.json
node scripts/update_readme_contents.mjs
pnpm check:chapters

# Optional independent extraction check:
mkdir -p work/text-crosscheck
.venv/bin/pip install pypdf && .venv/bin/python -I scripts/extract_pdf.py text/shahnameh-ferdowsi.pdf work/text-crosscheck/raw.txt   # optional check:
python3 -I scripts/crosscheck.py text/shahnameh.md work/text-crosscheck/raw.txt
```

After installing PyMuPDF in `.venv`, `pnpm text:build` runs the first four
generation and validation commands together. Rebuilding retains the 61-chapter
organization. The recorded checksum rejects changes to the section content;
any future source correction must be reviewed before updating that checksum.

The PDF prints the verse in two columns. The script uses PyMuPDF glyph
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
hemistich anomalies before building the affected passages. Regrouping preserves
the existing text and section boundaries; these editorial issues still need a
separate source review.
