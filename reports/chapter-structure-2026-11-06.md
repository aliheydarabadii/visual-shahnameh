# Shahnameh chapter structure and source audit

Investigated on 2026-11-06. This is a source and navigation investigation,
not a new edition or a correction of the poem text.

## Recommendation

Use Ganjoor's 61 top-level entries as the reference for a future reader
contents page. Preserve our existing section IDs, painting paths and saved
reading positions. First audit the verse boundaries and resolve the known
extraction anomalies. Add a separate navigation mapping rather than
renumbering every section or rebuilding finished paintings.

The evidence supports a commonly used 61-part organization. It does not
establish that every printed Shahnameh edition has exactly 61 chapters.
Our 50 groups reflect PDF typography and extraction rules. The difference
does not mean that eleven stories are missing.

This change adds the expandable README inventory and colocates the original
PDF with the extracted text. It does not change the app's chapter navigation,
source verses, section IDs, or completion status.

## Sources and what they establish

| Source | Finding |
| --- | --- |
| [Ganjoor contents](https://ganjoor.net/ferdousi/shahname) | 61 top-level entries; its live statistics report 49,610 couplets and 857 poems. |
| [Divansara contents](https://divansara.ir/poets/ferdousi/shahname) | 61 top-level entries and 777 published items. Its lower-level divisions differ from Ganjoor's. Agreement on 61 does not prove these sites are independent textual witnesses. |
| [Our original PDF, physical page 4](../text/shahnameh-ferdowsi.pdf#page=4) | Pejman Pourhossein's compilation, dated Shahrivar 1391 SH, consulting several sources. |
| [Extractor](../scripts/build_text.py) and [extracted JSON](../text/shahnameh.json) | Font thresholds produce 50 groups, 646 sections and 49,615 verse rows. |

Counts describe these sources as inspected on this date. They do not prove
line-by-line equivalence. A complete textual collation has not been done.

## Corrected PDF attribution

The preface credits Fereydoun Joneydi's first edition of **1387 SH**,
Mohammad Ramazani's second edition of **1354 SH**, and data from RiRa and
Ganjoor. The compiler signs as پژمان پورحسین. The PDF has takbook.com branding
and identifies itself as an iPad-compatible version I.1.0.0.

The old repository description, "Joneydi's 1354 edition", combined the
wrong editor and date. README and text documentation now identify the
compilation rather than attributing it to one critical edition.

The original PDF was moved from `source/` to `text/` without changing its
contents. It has 1,973 physical pages and occupies 6,108,456 bytes.

```text
SHA-256: 0da03466e8192f2c3cb43a95156fd1000267ceb9004c42699147e0c3b30ac9e1
```

## Why the grouping differs

`build_text.py` promotes headings at least 25 points to chapters and treats
headings from 18 to below 25 points as sections. The result follows font size,
not an independently curated literary contents list.

The PDF's Homay divider on physical page 1147, Darab divider on page 1161,
and Dara divider on page 1169 use 24-point text. They become local sections
31.05, 31.12 and 31.18 under Bahman, although each is a separate top-level
entry in Ganjoor. Smaller royal headings also remain inside local group 35.
Those three local divider sections contain no couplets.

Conversely, the PDF gives some stories their own large divider pages where
Ganjoor groups them together. Ganjoor's [Manuchehr group](https://ganjoor.net/ferdousi/shahname/manoochehr)
has 1,654 couplets; local groups 08 and 09 have 42 and 1,612 rows, also
1,654. Ganjoor's [Yazdgerd II group](https://ganjoor.net/ferdousi/shahname/yazdgerd)
includes Hormoz, Piruz and Balash. Local groups 38, 39 and 40 total 373 rows,
matching its reported count. These are grouping examples, not proof that
every verse or boundary matches.

An easy trap is assuming that everything about Ardeshir belongs in Ganjoor's
Ardeshir chapter. Its [Ashkanian group](https://ganjoor.net/ferdousi/shahname/ashkanian)
also contains Ardeshir's early life and Haftvad. Its separate
[Ardeshir group](https://ganjoor.net/ferdousi/shahname/ardeshir)
starts at his accession. Local 35.01 through 35.07 total 689 rows, the same
as that latter group's reported count.

## Text issues to resolve before migration

The extraction has ten rows with one empty hemistich, already recorded in
[anomalies.txt](../text/anomalies.txt). The affected, currently unbuilt
sections are 18.38, 18.55, 25.26, 25.34, 37.20, 42.02, 43.04 and 43.13.
Sections 25.26 and 25.34 each have two such rows. These need visual checking
against the PDF and a reviewed correction, not automatic deletion.

There are also boundary differences. For example:

- The first hemistich of the last row of local 37.21 opens
  [Ganjoor's Yazdgerd II section](https://ganjoor.net/ferdousi/shahname/yazdgerd/sh1),
  but its second hemistich differs. Ganjoor's corresponding second hemistich
  is in the first row of local 38.01, paired with a different first hemistich.
- The first hemistich of the last row of local 40.01 opens
  [Ganjoor's Qobad section](https://ganjoor.net/ferdousi/shahname/qobad/sh1),
  again paired with a different second hemistich.
- The first row of local 16.21 matches the opening of
  [Ganjoor's Hamavaran section](https://ganjoor.net/ferdousi/shahname/hamavaran/sh1).
  The chapter boundary therefore falls inside local group 16.
- The first row of local 19.07 matches the opening of
  [Ganjoor's Forud section](https://ganjoor.net/ferdousi/shahname/forood/sh1).

Visual inspection of physical PDF page 1480 confirms that it already prints
the mismatched pairing found in local 38.01. This difference predates our
extractor. It is not safe to fix it just by moving the section boundary.
The PDF's text pairings, heading placement and our top-to-bottom event
assignment all need checking against an editorial reference. Count comparisons
alone miss this problem.
The five-row difference between our 49,615 rows and Ganjoor's 49,610
couplets is **unreconciled**. The ten incomplete rows do not by themselves
explain it. Neither source should silently replace the other.

## Proposed implementation order

1. Keep the 50-group README inventory aligned with the current checkout.
   Its 646 subsection entries distinguish built sections from source-only text.
2. Audit the ten incomplete rows and chapter boundaries against PDF pages
   and the external text. Record actual differences, including edition variants.
3. Add explicit navigation metadata for 61 entries, with stable identifiers
   separate from local section IDs. Allow entries to span section ranges and,
   where necessary, couplet ranges. Validate that every intended verse appears
   exactly once and in order. Keep existing reader URLs and stored progress valid.
4. Update the reader's contents, labels, planning script and documentation
   together. "Next X chapters" must use the same chapter definition everywhere.
   Do not apply this table directly as a replacement chapter registry.

Chapters 01 through 07 already correspond to the same first seven top-level
entries in both online contents lists. There is no chapter-count reason to
discard their completed artwork. Their finer section divisions still differ
from the online editions.

## 61-entry navigation crosswalk

This is a **story-level location guide**, not an exact verse migration map.
The ranges identify where the material chiefly sits in our extraction.
Opening verses can be in a preceding section, as shown above. Every proposed
boundary still needs a verse-level audit. Names are shortened for readability;
each links to its reference contents page.

| Reference entry | Title | Local location, approximate boundaries |
| --- | --- | --- |
| 01 | [آغاز کتاب](https://ganjoor.net/ferdousi/shahname/aghaz) | 01 |
| 02 | [کیومرث](https://ganjoor.net/ferdousi/shahname/qmars) | 02 |
| 03 | [هوشنگ](https://ganjoor.net/ferdousi/shahname/hushang) | 03 |
| 04 | [طهمورث](https://ganjoor.net/ferdousi/shahname/tahmoores) | 04 |
| 05 | [جمشید](https://ganjoor.net/ferdousi/shahname/jamshid) | 05 |
| 06 | [ضحاک](https://ganjoor.net/ferdousi/shahname/zahak) | 06 |
| 07 | [فریدون](https://ganjoor.net/ferdousi/shahname/fereydoon) | 07 |
| 08 | [منوچهر](https://ganjoor.net/ferdousi/shahname/manoochehr) | 08 + 09 |
| 09 | [نوذر](https://ganjoor.net/ferdousi/shahname/nozar) | 10 + 11 |
| 10 | [زوطهماسپ](https://ganjoor.net/ferdousi/shahname/zutahmasb) | 12 |
| 11 | [گرشاسپ](https://ganjoor.net/ferdousi/shahname/garshasp) | 13 |
| 12 | [کیقباد](https://ganjoor.net/ferdousi/shahname/kqobad) | 14 |
| 13 | [کی‌کاووس](https://ganjoor.net/ferdousi/shahname/kkavoos) | 15 + 16.01–16.20 |
| 14 | [هاماوران](https://ganjoor.net/ferdousi/shahname/hamavaran) | 16.21–16.34 |
| 15 | [سهراب](https://ganjoor.net/ferdousi/shahname/sohrab) | 17 |
| 16 | [سیاوش](https://ganjoor.net/ferdousi/shahname/siavosh) | 18 |
| 17 | [کیخسرو](https://ganjoor.net/ferdousi/shahname/kkhosro) | 19.01–19.06 |
| 18 | [فرود](https://ganjoor.net/ferdousi/shahname/forood) | 19.07–19.19 |
| 19 | [کاموس کشانی](https://ganjoor.net/ferdousi/shahname/kamoos) | 20 |
| 20 | [خاقان چین](https://ganjoor.net/ferdousi/shahname/khaghan) | 21 |
| 21 | [اکوان دیو](https://ganjoor.net/ferdousi/shahname/akvan) | 22 |
| 22 | [بیژن و منیژه](https://ganjoor.net/ferdousi/shahname/bizhan) | 23 |
| 23 | [دوازده رخ](https://ganjoor.net/ferdousi/shahname/12rokh) | 24 |
| 24 | [جنگ بزرگ](https://ganjoor.net/ferdousi/shahname/mahmood) | 25 |
| 25 | [لهراسپ](https://ganjoor.net/ferdousi/shahname/lohrasp) | 26 |
| 26 | [گشتاسپ](https://ganjoor.net/ferdousi/shahname/goshtasp) | 27 |
| 27 | [هفتخوان اسفندیار](https://ganjoor.net/ferdousi/shahname/7esfandyar) | 28 |
| 28 | [رستم و اسفندیار](https://ganjoor.net/ferdousi/shahname/esfandyar) | 29 |
| 29 | [رستم و شغاد](https://ganjoor.net/ferdousi/shahname/shqad) | 30 |
| 30 | [بهمن](https://ganjoor.net/ferdousi/shahname/bahman) | 31.01–31.04 |
| 31 | [همای](https://ganjoor.net/ferdousi/shahname/homa) | 31.05–31.11 |
| 32 | [داراب](https://ganjoor.net/ferdousi/shahname/darab) | 31.12–31.17 |
| 33 | [دارا](https://ganjoor.net/ferdousi/shahname/dara) | 31.18–31.26 |
| 34 | [اسکندر](https://ganjoor.net/ferdousi/shahname/eskandar) | 32 |
| 35 | [اشکانیان](https://ganjoor.net/ferdousi/shahname/ashkanian) | 33 + 34 |
| 36 | [اردشیر](https://ganjoor.net/ferdousi/shahname/ardeshir) | 35.01–35.07 |
| 37 | [شاپور اردشیر](https://ganjoor.net/ferdousi/shahname/shapoor) | 35.08–35.09 |
| 38 | [اورمزد](https://ganjoor.net/ferdousi/shahname/oormazd) | 35.10 |
| 39 | [بهرام اورمزد](https://ganjoor.net/ferdousi/shahname/bahram) | 35.11 |
| 40 | [بهرام دوم](https://ganjoor.net/ferdousi/shahname/bahram19) | 35.12 |
| 41 | [بهرام بهرامیان](https://ganjoor.net/ferdousi/shahname/bahramian) | 35.13 |
| 42 | [نرسی](https://ganjoor.net/ferdousi/shahname/nrsi) | 35.14 |
| 43 | [اورمزد نرسی](https://ganjoor.net/ferdousi/shahname/oorner) | 35.15 |
| 44 | [شاپور ذوالاکتاف](https://ganjoor.net/ferdousi/shahname/zolaktaf) | 35.16–35.19 |
| 45 | [اردشیر نکوکار](https://ganjoor.net/ferdousi/shahname/nekookar) | 35.20 |
| 46 | [شاپور سوم](https://ganjoor.net/ferdousi/shahname/shapoor3) | 35.21 |
| 47 | [بهرام شاپور](https://ganjoor.net/ferdousi/shahname/bahpoor) | 35.22 |
| 48 | [یزدگرد بزه‌گر](https://ganjoor.net/ferdousi/shahname/bezehgar) | 36 |
| 49 | [بهرام گور](https://ganjoor.net/ferdousi/shahname/bahgoor) | 37 |
| 50 | [یزدگرد دوم](https://ganjoor.net/ferdousi/shahname/yazdgerd) | 38 + 39 + 40 |
| 51 | [قباد](https://ganjoor.net/ferdousi/shahname/qobad) | 41 |
| 52 | [نوشین‌روان](https://ganjoor.net/ferdousi/shahname/anooshirvan) | 42 |
| 53 | [هرمزد](https://ganjoor.net/ferdousi/shahname/hormozd) | 43 |
| 54 | [خسرو پرویز](https://ganjoor.net/ferdousi/shahname/parviz) | 44 + 45 |
| 55 | [شیرویه](https://ganjoor.net/ferdousi/shahname/shirooye) | 46 |
| 56 | [اردشیر شیروی](https://ganjoor.net/ferdousi/shahname/ardeshiroo) | 47.01–47.02 |
| 57 | [فرایین](https://ganjoor.net/ferdousi/shahname/farayeen) | 47.03 |
| 58 | [پوراندخت](https://ganjoor.net/ferdousi/shahname/pooran) | 48 |
| 59 | [آزرمدخت](https://ganjoor.net/ferdousi/shahname/azarmdokht) | 49.01 |
| 60 | [فرخ‌زاد](https://ganjoor.net/ferdousi/shahname/farrokh) | 49.02 |
| 61 | [یزدگرد سوم](https://ganjoor.net/ferdousi/shahname/yazdgerd3) | 50 |

## Verification of this documentation change

- README contains 50 expandable groups and all 646 unique subsection IDs.
  Its 40 checked subsection entries correspond to existing section files.
- The moved PDF's SHA-256 matches the original; no second copy was added.
- Re-extracting the moved PDF into an ignored scratch directory reproduces
  the existing Markdown, JSON and anomaly file byte for byte.
- Original Markdown, JSON, anomaly records, section files and paintings are unchanged.
- PDF links and extraction commands point to the new location.
- No app runtime code changed. Reader rendering and audio were not retested
  for this documentation-only change.
