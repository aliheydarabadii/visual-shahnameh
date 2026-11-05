# Home, reading progress and frosted verse panel

Implemented on 2026-11-05. The original Noto Nastaliq Urdu font and verse size remain unchanged.

## Home and saved reading

Ferdowsi's name now sits directly beneath the Persian and English book title. The home page groups the title, author and reading actions in the central column. A soft, feathered shade protects the small lettering where the painting's light passes behind it.

The primary action is «آغاز خواندن» on a first visit. After reading, it becomes «ادامه‌ی خواندن», with the last chapter, section title, verse count and progress line above it. It opens that section at the saved beat. The page does not redirect automatically.

`src/engine/reading-progress.ts` owns a versioned local bookmark under `shahnameh.reading.v1`. It records the section id, beat, couplet number and update time. The reader saves a settled reading position, throttles writes, and flushes on departure, page hide and backgrounding. Opening a threshold, the empty 07.13 heading, or a frozen review URL does not replace actual reading progress. Reloads use the persistent record even when session storage is empty. Invalid records and unavailable storage fall back safely; unavailable storage retains an in-memory bookmark for the current page lifetime.

The bookmark is local to this browser and origin. Clearing site data clears it. There is no account, server or cookie involved.

English remains only in the main book title on home. English chapter names, era labels, contents subtitle, action captions and reader kicker were removed from rendered UI. The source table of contents retains its existing metadata.

## Verse panel

The reading anchor aims at 60% of viewport height, then moves up as necessary to clear the lower controls. The horizontal centre and reading width are unchanged. The panel fits the maximum upper and lower hemistich extents in each scene separately, so unequal wrapped lines remain inside it without hitting navigation.

The panel uses a translucent lapis tint, a subtle specular highlight and a modest backdrop blur. Painting colours show through while ivory text stays legible. No library or refraction shader was added. The panel and verses now occupy a separate fixed layer outside the clipped painting stage. The portal mask remains fixed to the viewport. Unsupported backdrop filtering and reduced transparency use the solid tinted fallback.

The approach follows [Apple's materials guidance](https://developer.apple.com/design/human-interface-guidelines/materials), which prioritizes legibility over underlying content, and [MDN's backdrop-root explanation](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter). This is a frosted web material, not Apple's native Liquid Glass implementation.

## Validation

- `pnpm typecheck` passed. The Impeccable layout scan returned no findings for the changed home and reader surfaces.
- All 28 checks in `work/reading-home-2026-11-05/audit.json` passed. These cover first/returning visits, saved titles and counts, exact resume, reload without session storage, a fresh browser context initialized with persisted local storage, heading/review exclusions, Persian-only UI, invalid records and disabled storage.
- The layout sweep covered all 40 sections, all 1,941 couplets, and 419 scenes with verses at each of 320×568, 390×844, 1280×600 and 1440×900. All 160 section/viewport combinations passed. Two long verses initially approached the controls on a short laptop viewport; fitting upper/lower extents separately resolved them.
- Six extra checks in `extra-audit.json` passed, including automatic saving during ordinary keyboard reading before departure, long saved titles at all four sizes and the solid background fallback.
- All 21 keyboard, wheel, touch-emulated button, reduced-motion and portal-frame checks passed again against the updated engine. Results: `motion-audit.json` in the same directory. No page errors were recorded.
- The main visual captures are in `output/playwright/reading-home/`. Returning-reader captures use a test bookmark for a long section title. Motion captures are in `output/playwright/reading-home-motion/`. Captures are JPEGs to limit scratch storage.

Re-run with the existing port 5199 server:

```sh
node work/reading-home-2026-11-05/verify.mjs
node work/reading-home-2026-11-05/verify-progress-extra.mjs
node work/reading-home-2026-11-05/verify-motion.mjs
```

Shared preview capture timed out twice, so rendered-frame checks used installed Playwright Chromium. Physical Safari/WebKit and a physical touch device were not tested. The earlier browser/GPU tearing could not be reproduced here; inspected portal frames remained intact with the new separate frosted layer.

No public painting, section text or score was changed. No dependency, build, commit, upload or deployment was made.
