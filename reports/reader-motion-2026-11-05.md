# Reader motion and dark endings

Implemented on 2026-11-05. The original Noto Nastaliq Urdu font and verse sizing stay unchanged.

## Changes

- Endings retain the final painting beneath a dark lapis veil. Gold ornament and ivory text replace the ivory page and ending light burst. The closing text stays in the central reading column, with room reserved for navigation. Short screens omit the decorative ornament and use a smaller closing title.
- Portal masks now occupy a stationary viewport-sized wrapper. The painting moves inside it. Previously, one large layer was both scaled and clipped. Reading and threshold panels no longer backdrop-filter those moving layers. The circular reveal, focus drift, gold rim and light band remain.
- Reading keys and buttons use the same spring, beat stops and scene choreography in both directions. Touch buttons also use this path; native snapping is suspended during their animation and restored at rest. Finger scrolling retains native behavior. Reduced motion makes the step immediate. Home and End remain direct jumps.
- The spring uses the exact critically damped solution, avoiding the old integration's reversal after a long frame. Arrow navigation works while a reading button has focus, and held keys cannot fall through to native scrolling. Wheel or touch input can interrupt a button animation.

## Evidence

Before the fix, dispatching ArrowDown at the threshold immediately wrote beat 3.3. All sampled positions were 3.3, with no intermediate beats. Afterward, the same path sampled 0, 0.67, 1.64, 2.35, 2.79, 3.04, 3.17 and converged to 3.3.

- `pnpm typecheck` passed.
- Fourteen deterministic checks passed in `work/reader-motion-2026-11-05/motion-audit.json`, covering trajectory parity, reverse travel, 100ms frames, interruption, focus, touch controller behavior, reduced motion, portal bounds, panel filtering and the original font.
- Twenty-one browser checks passed with no page errors or failed HTTP responses. Real keyboard input, wheel input and touch-emulated taps were exercised. Touch snapping was verified both during travel and at rest. Command: `node work/reader-motion-2026-11-05/verify-browser.mjs`, using the existing server on port 5199. Results: `browser-audit.json` in the same directory.
- All 40 closing views fit between the top and lower controls at 320×568, 1280×600 and 1440×900. All 120 cases passed. Results: `ending-layout-audit.json` in the same directory.
- Eight rendered frames were visually inspected: early portal, late portal, verse and ending at desktop and phone sizes. JPEG captures are in `output/playwright/reader-motion/`.

## Rendering limitation

The exact rectangular tearing in the owner's screenshots did not reproduce in the available Chromium browsers. The portal layer change removes the suspected compositing combination, and all inspected frames were intact, but this is not proof that the owner's browser/GPU issue is eliminated. WebKit and a physical touch device were not tested. The motion audit deliberately records this distinction.

Shared preview capture timed out twice with `Preview automation snapshot timed out after 15000ms`; rendered-frame and real-input checks then used the installed Playwright Chromium. No dependency or browser installation was needed.

No painting, section text, score, deployment or commit was changed. New review screenshots were stored as JPEGs to keep their combined size to 1,351,646 bytes.
