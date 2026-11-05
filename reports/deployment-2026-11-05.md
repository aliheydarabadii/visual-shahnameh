# Cloudflare production deployment

Live: **https://shahnameh.world**

Fallback: https://visual-shahnameh.farzin-nasiri.workers.dev

## Published

The complete current app is deployed to Cloudflare Workers Static Assets,
including chapters 01–07, all 40 sections, 1,941 couplets, browser-generated
music and all 460 optimized AVIF files. The final asset tree contains 547 files
and 219,855,791 bytes; its largest file is 609,043 bytes. No application backend
or database is required.

R2 was not enabled on this account and returned Cloudflare error 10042. The
current collection fits Workers Static Assets comfortably, so the app and
paintings are served together through Cloudflare's CDN. No R2 subscription or
paid plan was enabled. `DEPLOY.md` documents this arrangement and a future R2
migration if needed. Paintings and hashed JS/CSS/fonts have a one-year immutable
cache policy; the HTML revalidates on each visit.

## Domain and deployment

- Vercel's domain inventory confirmed the purchased name was `shahnameh.world`.
  Registration remains at Vercel.
- Created Cloudflare zone `13a675ff1c2496e72fab505db763b9a1` on the free plan.
- Updated the registrar nameservers to `asa.ns.cloudflare.com` and
  `javon.ns.cloudflare.com`. The registry confirmed the change at
  2026-11-05T16:35:28Z.
- Cloudflare activated the zone at 2026-11-05T16:44:17Z. Certificate verification
  subsequently reached `active`. HTTP-to-HTTPS redirects are enabled.
- Worker: `visual-shahnameh`, account `749525dc896fae3c8a92391c481ee4e3`.
- Final version: `dc3ffe05-c362-464c-a6a8-7bb4424aa0cd`, serving 100% of traffic.
- Deployment: `66e147bb-4ac1-4242-bc50-c9c70ef080f7`.

`cloudflare.config.ts` records the account, Worker, domain and explicit
workers.dev fallback setting. The deployment dependencies are pinned. The
Cloudflare Vite plugin runs only for builds, leaving existing plain Vite
development/check servers unchanged. Required `workerd` postinstall scripts are
approved in the repository's pnpm workspace settings. No credentials were added
to project files.

## Checks

- `pnpm install --frozen-lockfile`, `pnpm typecheck`, the production build and
  `cf deploy --prebuilt --mode production --dry-run` passed.
- All 460 local AVIFs matched the production build by SHA-256. No local
  paintings were changed or removed.
- All 460 AVIFs were fetched through **https://shahnameh.world**, with status
  200, `image/avif`, immutable caching, and exact local SHA-256 matches.
  Total verified painting bytes: 217,945,163. CDN cache hits were observed.
- The domain's HTML matched the built HTML byte-for-byte.
- Nine live browser checks passed with no page errors or failed responses:
  custom-domain home, exact deployed HTML, reading progress, home resume,
  all 18 chapter-7 sections, final ending, decoded final painting, phone width,
  and HTTP-to-HTTPS redirect.
- README checklist was checked against `text/shahnameh.json` and section files:
  all 50 chapters listed, 7 complete and 43 remaining. Next is 08.01.

Evidence is in `work/deployment-2026-11-05/`: deployment logs,
`build-integrity.json`, `live-assets.json`, `live-assets-summary.json` and
`live-browser.json`. Re-run live verification with:

```sh
node work/deployment-2026-11-05/verify-assets.mjs https://shahnameh.world
node work/deployment-2026-11-05/verify-browser.mjs
```

The shared browser retained old Vercel DNS and showed `404: NOT_FOUND` after the
nameserver change. A fresh Playwright browser then loaded the actual custom
domain successfully. Some visitors with cached old DNS may temporarily see
that old response; the Cloudflare fallback remains available.

Adding the custom domain initially caused the CLI to disable workers.dev by
default. The configuration now explicitly enables it, and the final verification
was run after redeployment. The first final-painting browser assertion ran before
that image finished loading; after waiting for decoding, it passed. No painting
was regenerated.

No git commit was made. All deployment and DNS changes were authorized by the
owner's request to publish the site on Cloudflare.
