# Downloaded font comparison, 2026-11-05

Recommendation: **IranNastaliq-Web** for a further local reading trial. Its Persian calligraphy is fuller and more connected than the current Noto specimen. Both downloads are versions of IranNastaliq and look almost identical in the captured samples. The Web file is 753,868 bytes, compared with 2,433,268 bytes for Regular, about 69% smaller as downloaded.

## What was tested

The archives in Downloads are `irannastaliq-web-regular.zip` and `irannastaliq-regular.zip`. Their font binaries were extracted into `work/font-comparison-2026-11-05/` for local testing. The original Downloads were left intact. No font was installed system-wide or added to `public/`, and the default font is unchanged.

Both fonts load in Chromium. The Unicode character map of each covers the characters in the full source poem, excluding whitespace and the nonprinting ZWNJ control. Both have OpenType substitution and positioning tables. Their embedded family names are IranNastaliq-Web and IranNastaliq; the versions are 1 and 2.001 respectively. Their advance widths match for the tested words, digits and couplets. This does not establish that every outline or shaping rule is identical.

The comparison uses the same poem, painting, central column and panel. IranNastaliq was tested at 1.35 times the current CSS size, with line-height 1.55 instead of 2.1 and proportional vertical padding. This brings its visible ink and line boxes close to the current Noto specimen. Using an equal numeric font-size would make IranNastaliq look smaller and would be an unfair visual comparison. Titles use their actual Regular face rather than synthetic bold.

The main sample is 01.09, couplet 14. The shaping specimen includes the opening couplet, a title, and `نگارنده‌ی بر شده پیکرست` with ZWNJ. Browser measurements also cover Persian digits and words containing Persian letters and joining controls.

Layout checks cover 01.01, 01.09, 06.06 and the long empty heading 07.13 at 320×568, 390×844 and 1440×900, for both downloaded fonts. All 24 section/font/viewport cases pass the checks for title, verse and panel bounds. No browser errors were recorded. This is a local Chromium comparison; Safari and physical-device rendering were not tested.

## Files

- `output/playwright/font-comparison/specimen.png` compares the same phrases in all three faces.
- `output/playwright/font-comparison/noto-desktop.png` and `noto-phone.png` show the current font.
- `output/playwright/font-comparison/web-desktop.png` and `web-phone.png` show IranNastaliq-Web.
- `output/playwright/font-comparison/regular-desktop.png` and `regular-phone.png` show IranNastaliq Regular.
- `output/playwright/font-comparison/*-long-title-*.png` capture the long heading.
- `work/font-comparison-2026-11-05/font-metadata.json`, `browser-results.json`, and `layout-results.json` preserve metadata and measurements.

The shared preview screenshot failed twice with `Preview automation snapshot timed out after 15000ms`; the final comparison used the repository's installed Playwright Chromium against the existing local server. No new server was started.

## Publication constraint

Both font files contain an embedded license notice limiting use to a workstation and restricting copying/distribution. A public web-embedding licence has not been established by this test. The current test stays local, and the font binaries are not embedded in the review shared in chat. Confirm the applicable licence before adding them to the published site. No deployment or upload was performed.

## Title rule correction

The trial exposed a horizontal line through title cards. A scene without verses was still contributing opacity to its zero-height reading panel, leaving its border visible. `src/engine/journey.ts` now excludes scenes whose couplet list is empty from the reading-panel opacity calculation. This small correction changes no font or text. Typechecking passes.

## Owner decision and lettering correction

the owner rejected both downloaded faces and chose the existing Noto font. The application remains on Noto Nastaliq Urdu. The unused IranNastaliq fallback was removed to make that choice explicit. The UI pass had also added a dark text stroke and text shadow to poem letters. Both were removed after the owner reported the changed appearance. The browser on port 5173 now reports Noto Nastaliq Urdu, weight 400, a zero-width stroke, no shadow, no trial stylesheet, and no downloaded font faces. Typechecking passes.
