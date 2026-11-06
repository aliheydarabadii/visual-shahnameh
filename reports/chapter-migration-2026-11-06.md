# Migration to 61 chapters

Completed 2026-11-06 at the owner's request. The Markdown source, JSON source,
reader contents, chapter planner and README now use the same 61-chapter
organization, following [Ganjoor's top-level contents](https://ganjoor.net/ferdousi/shahname).
The [earlier source investigation](chapter-structure-2026-11-06.md) explains
the differences from the PDF's 50 font-based groups.

## What changed

| Item | Before | After |
| --- | --- | --- |
| Top-level chapters | 50 PDF groups | 61 reference chapters |
| Sections | 646 | 646, identical objects in identical order |
| Extracted verse rows | 49,615 | 49,615, unchanged |
| Built sections | 40 | 40, unchanged |
| Built couplets | 1,941 | 1,941, unchanged |
| Section URLs, painting paths, saved section IDs | Original IDs | Original IDs |

`text/chapter-map.json` records the title, reference URL, era, PDF page and
first/last permanent section IDs for each chapter. It is the reviewed mapping
used by the extractor. The full 61-row crosswalk remains in the source
investigation. The first seven chapter titles retain our existing spellings;
subsequent chapter titles follow the reference contents.

Examples of the new grouping:

| Chapter | Existing sections assigned to it |
| --- | --- |
| 08 · منوچهر | 08.01 through 09.31, including Zal and Rudabeh |
| 09 · پادشاهی نوذر | All of old groups 10 and 11 |
| 14 · رزم کاووس با شاه هاماوران | 16.21 through 16.34 |
| 31 · پادشاهی همای | 31.05 through 31.11 |
| 32 · پادشاهی داراب | 31.12 through 31.17 |
| 33 · پادشاهی دارا | 31.18 through 31.26 |
| 35 · پادشاهی اشکانیان | Old groups 33 and 34, including Ardeshir's early life and Haftvad |
| 36 · پادشاهی اردشیر | 35.01 through 35.07 |
| 50 · پادشاهی یزدگرد دوم | Old groups 38, 39 and 40 |
| 61 · پادشاهی یزدگرد | 50.01 through 50.14 |

These ranges regroup intact sections. They do not claim that every verse
boundary or subsection matches Ganjoor. The PDF's known pairing differences
and ten incomplete rows remain unchanged, pending a separate editorial review.
No poem text was downloaded to replace our source.

## Compatibility and generation

Chapter IDs identify the new organization. Section IDs are permanent IDs
from the original extraction and no longer imply their parent chapter.
Builders must look up the enclosing chapter in `text/shahnameh.json`.
The section checker now verifies that metadata explicitly, so a new builder
cannot silently assign section 09.01 to chapter 09 instead of chapter 08.

All 40 built sections are in chapters 01 through 07. Their chapter IDs and
titles remain identical, as do the section files and painting files. Saved
reading positions use section IDs and require no migration. Numeric contents
URLs now address the new chapter numbers; chapter numbers after 07 can refer
to different groups than before.

`build_text.py` still extracts and assigns section IDs using the original PDF
structure, then applies the chapter map. It rejects overlapping, skipped or
reordered ranges. A SHA-256 checksum recorded before regrouping covers every
section's ID, title, physical PDF page and all paired verse text in sequence.
Content differences stop generation before it writes the source files.

After installing PyMuPDF in `.venv`, run:

```sh
pnpm text:build
```

This rebuilds the Markdown and JSON, the reader contents and the expandable
README checklist, then runs `pnpm check:chapters`. The check also runs in CI.
The app's chapter count is generated from the contents rather than hardcoded
as fifty. Existing English navigation metadata was omitted from the rebuilt
Persian contents; the bilingual book title remains.

## Verification performed

- Compared the complete ordered list of section objects with the pre-migration
  JSON using deep equality. All 646 match, including titles, IDs, PDF page
  references, ZWNJ spelling, empty hemistichs and the heading-only sections.
- Regenerated from the PDF into a separate directory. Markdown, JSON and
  the anomaly file reproduce byte for byte. The PDF itself was not changed.
- Confirmed regrouping is idempotent. Negative checks reject an altered
  verse, reordered sections, overlapping chapter ranges, out-of-order chapter
  entries and an unassigned final section.
- `pnpm check:chapters` passes. It checks the recorded content checksum,
  chapter membership, Markdown verse text, generated reader contents and
  all 61 expandable README groups with their built/unbuilt subsection states.
- Confirmed all 40 built sections retain the same parent IDs and titles.
- Confirmed `next_sections.mjs --chapters 1` selects all 32 Manuchehr sections,
  beginning at 08.01 and ending at 09.31 under chapter 08.
- `pnpm build` passes TypeScript and the production Vite build.
- `node scripts/check_section.mjs 01.01 07.18 --quick` passes. The checker
  loads the real reader modules, checks text and chapter metadata, verifies
  paintings and produces desktop/phone render samples. It also renders and
  measures the complete scores: 01.01 is 128 seconds at -23.9 LUFS;
  07.18 is 97 seconds at -23.3 LUFS.
- No fonts, poem typography, animation logic, sound composition, paintings
  or built section files changed. This does not certify the PDF's editorial
  accuracy or repeat a live-GPU transition audit.
