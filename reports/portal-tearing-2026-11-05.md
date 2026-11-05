# Portal tearing repair

The owner reported rectangular painting bands and missing tiles during slow
trackpad reversals. Grok independently identified the composited CSS clip over
a transformed image as the leading cause. Its browser-engine diagnosis was an
inference from the screenshots and renderer, not a reproduced GPU trace.

Removing layer-promotion hints alone was insufficient: browser inspection
still caught a decoded, visible painting failing to appear after reversal.
The final renderer draws the visible paintings and their circular reveal into
one viewport canvas on every frame. There is no CSS image mask or separately
transformed painting layer. The same camera, focus, portal timing, gold rim,
light, dust and typography remain. Canvas resolution is capped at 1.5 device
pixels per CSS pixel. The reading panel temporarily uses its opaque fallback
during the portal and for 0.4 beats after reveal.

Validation:

- TypeScript and production build pass.
- `scripts/probe_portal.mjs` dispatches wheel events through the real reader
  controller, reverses repeatedly through the opening portal, crosses reveal,
  and samples the painting bitmap for transparent gaps without freezing it.
- Desktop 1280×800: 180 samples pass, spanning beats 1.6275–3.241875.
- Narrow viewport 390×844: 180 samples pass; no horizontal overflow.
- Browser screenshot after scrubbing shows the complete first painting and
  readable verses. The test checks bitmap gaps; it cannot prove every physical
  GPU/browser combination is free of display-compositor faults.
- Production deployment: `18ddaf63-9703-4a0b-8d15-17c0616166f7`.

The public repository includes optimized AVIFs for a runnable clone. Generated
sources, check output, review screenshots, dependencies, build output and local
credentials are excluded. A pattern scan of the publishing inventory found
no private keys, GitHub tokens, AWS access keys or OpenAI keys.
