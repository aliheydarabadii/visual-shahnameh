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

### Automatic deployment from GitHub

`.github/workflows/ci.yml` checks PRs and pushes to `main` and `develop`.
Only a push to this repository's `main` by `farzinnasiri` packages a production
artifact. After the quality job passes, a fresh job downloads that artifact
and deploys with the pinned `cf` CLI. It does not check out the application,
run application install/build scripts, restore a shared cache, or consume PR
artifacts. Actions are pinned to full commit SHAs and use a read-only token.

The `production` GitHub environment allows the `main` branch only. Store:

| Type | Name | Value |
| --- | --- | --- |
| Environment secret | `CLOUDFLARE_API_TOKEN` | A dedicated, restricted deployment token |
| Environment variable | `CLOUDFLARE_ACCOUNT_ID` | The hosting account ID |

Create the token in Cloudflare's **My Profile → API Tokens**. Grant Workers
Editor access to the `visual-shahnameh` Worker only, using the account's
resource selector. For the CLI's account lookup and the configured custom
domain, grant Account Settings Read for the hosting account and Zone Read /
Workers Routes Write for `shahnameh.world` only. Do not grant DNS Edit, R2,
database, billing or API-token-management permissions. Do not use a global
API key or copy a local OAuth login into CI. Set an expiration and rotate the
environment secret before it expires. See Cloudflare's
[CI authentication](https://developers.cloudflare.com/cf/ci/) and
[Workers permissions](https://developers.cloudflare.com/workers/authorization/workers/).

Add the token through GitHub's private environment-secret form, or use
`gh secret set CLOUDFLARE_API_TOKEN --repo farzinnasiri/visual-shahnameh --env production`
with a private prompt or file input. Never paste its value into an issue,
commit, report or chat. The Cloudflare MCP OAuth connection cannot create API
tokens; that setup requires the account owner.

The token is injected only into the final deploy step. Forks, PR checks and
`develop` receive no production secret. There are no `pull_request_target`,
`workflow_run` or reusable privileged workflow triggers. Code merged into
`main` becomes trusted publication code, so Farzin must review workflow,
dependency and build-script changes before merging. Never run unreviewed PR
code with this environment. See GitHub's
[secret handling](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets).

Repository rules restrict updates to `main` and `develop` to the individual
owner account `farzinnasiri`. A separate rule blocks force pushes and deletion
without a bypass. The owner can bypass the PR/check gate for a direct push;
others contribute through forks and PRs. Normal contribution PRs require an
owner review, resolved discussions and `Quality checks`. Keep these rules
when adding collaborators. `develop` need not exist for its protections to
apply when it is created.

To inspect a run: **Actions → CI → latest main push**. A successful run has
both **Quality checks** and **Deploy to Cloudflare** green. The deploy job's
environment link opens the production site. If the token is missing or
expired, deployment fails; quality checks still run without it.

### Manual owner deployment

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
