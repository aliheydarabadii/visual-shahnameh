# UI and storage refinement, 2026-11-05

The UI now keeps the main reading and navigation path in the middle third of a desktop screen. Phones use the available width with side insets. Existing paintings, Persian arches, typography, era navigation and the miniature palette remain.

## Reading

Both hemistichs stack around the centre on every screen. The words use solid warm ivory instead of a gold gradient. A single translucent lapis panel has a fine border, soft corners and a shadow. Its height is measured from the tallest actual couplet in each scene, including wrapped lines and padding. The panel keeps a steady size and opacity while the words change. This replaces the two oversized shade layers and their visible join. Title panels also fit their content instead of covering a fixed region of the painting. The scene's painting remains full-screen.

Automatic background-driven colour changes were not added. A stable light foreground and controlled dark background avoid colour switching while the camera moves.

## Navigation and contents

- One centred navigation group provides Home and Contents. Sections also have an explicit chapter-back link. Chapter pages omit the redundant second contents link.
- Previous, the couplet count and Next form one centred reading control. The start and ending states name their actions. Sound is centred beneath it, with a gap. The era bar also sits above Sound without an overlap.
- Contents scrolls vertically with the native trackpad. Arches form two columns within the central reading column, grouped by era. The one-story prologue is compact.
- A chapter introduction sits above a single section list. There are no nested vertical scroll areas.
- Browser Back restores the reading beat and the collection position. The explicit collection-back link returns to the selected chapter.
- Async route requests are versioned so a slower old load cannot replace the newest destination. Section fonts and initial paintings are decoded before mounting. The delayed home redirect, arrival flash and arch view transitions were removed.
- A new wheel gesture keeps the actual scroll position instead of teleporting to a pending spring target. The desktop camera no longer eases a second time after the controller has already smoothed the position. Horizontal trackpad gestures and pinch zoom are not intercepted. Keyboard steps are immediate.
- The era marker follows the group at the navigation edge and its scroll listener is removed when the page closes.

## Verification

`pnpm exec tsc --noEmit` passes. Impeccable's layout scan reports no findings.

The DOM sweep covers all 40 built section titles and all their couplet layouts at 320×568, 390×844, 768×1024, 1280×600 and 1440×900. All 200 section/viewport cases pass the bounds checks, including the measured verse-panel bounds. It checks title spacing, hint and control bounds, and verse placement. It is layout evidence, not a visual inspection of every individual frame during a dive.

The Playwright interaction run passes 18 checks: actual wheel advance and reverse, bounded follow-up gesture, immediate left/right keyboard steps, Start, chapter-back, browser Back with reading and collection restoration, native vertical contents scrolling, era jump, rapid routing, small-phone controls, the zero-couplet heading and next-section link, Home, and an immediate reduced-motion touch button. It recorded no page errors or failed HTTP responses. A focused five-check run also verifies every era marker and the separation and centring of the footer controls.

The shared preview browser was used for the initial desktop/mobile pass. Its final contents screenshot failed twice with `Preview automation snapshot timed out after 15000ms`, so final captures and genuine wheel inputs used the repository's installed Playwright Chromium. The skill CLI wrapper was unavailable (`playwright-cli: command not found`); no package was installed. Actual laptop trackpad hardware and Safari were not available to this check. The wheel-event behaviour is verified in Chromium; the owner should still judge the physical gesture feel.

The first diagnostic script used a fixed 1.3-second settling wait. A later run was 0.013 beats short of zero when that timer expired. The final test waits for the spring to settle instead. Earlier zero-heading test timeouts came from reusing an intentionally frozen review instance on a same-URL navigation. The test now reloads identical URLs before beginning a fresh interaction. Neither issue was recorded as a passing test until the corrected run completed.

No score or section content changed. Full offline audio renders were not repeated for these UI changes. The previous batch checks remain in `work/checks/`.

## Storage

The completed cleanup reclaimed **646,751,612 bytes**, about 647 MB. The file-size audit measured the tree at 1,413,210,485 bytes before and 766,859,064 bytes after cleanup, before the small UI verification artifacts were added. It was about 1.4 GB at this audit, not 10 GB.

All 460 published AVIF files remain byte-identical. They were already the high-quality q70 4:4:4 web encodes and were not recompressed. The cleanup removed 78 completed, rejected and duplicate source PNGs. Four truncated M4A check previews were replaced with complete AAC versions before their WAV originals were deleted. Text, manifests, prompts, reports and check contact sheets remain. See [storage-cleanup-2026-11-05.md](storage-cleanup-2026-11-05.md) for exact inventories and audio durations.

## Files and evidence

Changed application files are `src/main.ts`, `src/engine/journey.ts`, `src/engine/detents.ts`, the new `src/engine/navigation.ts`, `src/home/home.ts`, `src/home/contents.ts`, the four stylesheets, and `DESIGN.md`. The design guide records the central-column rule and current reading treatment.

- `work/ui-refinement-2026-11-05/final-layout-audit.json`
- `work/ui-refinement-2026-11-05/playwright-audit.json`
- `work/ui-refinement-2026-11-05/final-contents-audit.json`
- `work/ui-refinement-2026-11-05/final-art-integrity.json`
- `output/playwright/reader-desktop.png`, `reader-phone.png`
- `output/playwright/contents-desktop.png`, `contents-phone.png`
- `output/playwright/chapter-desktop.png`, `chapter-phone.png`
- `output/playwright/home-phone.png`, `long-heading-small-phone.png`, `ending-small-phone.png`

The pre-edit source copies are in `work/ui-refinement-2026-11-05/before/`. No commit, build, deployment or R2 upload was performed.
