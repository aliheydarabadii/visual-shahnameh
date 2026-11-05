# Deploying to Cloudflare

Production URL: **https://shahnameh.world**. The registrar remains Vercel;
Cloudflare hosts DNS, HTTPS, the app and its CDN assets. HTTP redirects to HTTPS.

## Current deployment

Cloudflare fallback URL: https://visual-shahnameh.farzin-nasiri.workers.dev.
This stays enabled during DNS propagation and certificate provisioning.

The `visual-shahnameh` Worker serves the static Vite build, including all
460 optimized AVIF paintings, from Cloudflare Workers Static Assets. There is
no application server or database. Music is synthesized in the reader's browser.

R2 is not enabled on this account. The current 218 MB painting collection fits
comfortably within Workers' static asset limits: 20,000 files on the free plan,
with a 25 MiB maximum per file. All current paintings are below 1 MB. See
[Cloudflare's limits](https://developers.cloudflare.com/workers/platform/limits/#static-assets).

`VITE_ART_BASE` stays empty for this deployment, so paintings use the same
origin at `/art/…`. Existing year-long immutable caching in `public/_headers`
applies to paintings and hashed build assets. HTML revalidates on each visit.

Deployment configuration lives in `cloudflare.config.ts`. The Cloudflare Vite
plugin runs only for builds, so local Vite and section-check servers retain
their existing behavior. CLI and plugin versions are pinned in `package.json`
and `pnpm-lock.yaml`; required `workerd` install scripts are allowed in
`pnpm-workspace.yaml`.

## Deploy

```sh
make install                              # pnpm install --frozen-lockfile
pnpm typecheck
pnpm build                                # .cloudflare/output/v0/
pnpm exec cf deploy --prebuilt --mode production --dry-run
pnpm exec cf deploy --prebuilt --mode production
```

Or run `pnpm deploy` to typecheck, build and deploy in one command. Use the
existing Cloudflare CLI login (`pnpm exec cf auth whoami`); credentials do not
belong in the repository. Do not run concurrent builds because they share
`dist/` and `.cloudflare/output/`.

Before publishing, verify that every image referenced by the built sections
is present in the output. After publishing, check the home page, contents,
first and last built sections, painting responses and cache headers. No git
commit or Git integration is required for a direct deployment.

## DNS

The Cloudflare zone for `shahnameh.world` uses:

- `asa.ns.cloudflare.com`
- `javon.ns.cloudflare.com`

These nameservers belong in the domain's Vercel registrar settings. Keep
registration and renewal at Vercel. The Worker custom domain creates the DNS
record and certificate for the site; do not point the apex back at a Vercel
project. DNS propagation and certificate activation are separate from uploading
a Worker version.

## Optional R2 migration as the book grows

The repository retains its immutable R2 uploader and `VITE_ART_BASE` support.
When R2 is enabled, a separate artwork origin can keep future site uploads small:

1. Create an R2 bucket and connect `art.shahnameh.world` to it.
2. Store bucket-scoped S3 credentials only in gitignored `.env.local`:
   `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`.
3. Run `pnpm art:upload --dry-run`, then `pnpm art:upload`. Existing keys are
   never overwritten. Verify remote hashes/bytes before removing any local copy.
4. Add a cache rule for the artwork hostname that respects origin Cache-Control.
5. Set `VITE_ART_BASE=https://art.shahnameh.world` in `.env.production` and
   redeploy. The Vite build then omits `dist/art/`.

Do not use the rate-limited `r2.dev` endpoint in production. Paintings are
immutable: replacements always get new filenames. Keep the local paintings
and the owner's backup until remote delivery has been verified.
