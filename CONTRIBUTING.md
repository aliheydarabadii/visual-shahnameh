# Contributing

Fork the repository, work on a branch, and open a PR to `main`. Only
[@farzinnasiri](https://github.com/farzinnasiri) can update the protected book
branches or merge a PR. `develop` is optional and never deploys.

## Build more of the book

Copy the [chapter-building prompt in the README](README.md#contribute) into
your coding agent and replace X with any positive integer. Read [AGENTS.md](AGENTS.md)
and the full [builder brief](docs/BUILDER_BRIEF.md). Chapter sizes vary greatly;
plan by couplet count and keep consecutive story sections together.

Use your own image-generation account. The account names in the guide are
the owner's local setup, not shared credentials. Coordinate your proposed
chapter range in an issue or draft PR before a large run. Claims in `work/`
coordinate agents in one checkout; they do not reserve sections across forks.

Each section contribution includes:

- `src/content/sections/NN-NN.ts`, with verbatim source couplets and a score.
- Optimized paintings in `public/art/NN-NN/`, prompts, a manifest and any new
  recurring-character sheets. Existing painting filenames are immutable.
- `reports/NN-NN.md`, recording the checker output, redos and known problems.
- A batch report for several sections, with the exact completed range and
  unfinished sections. Update the README checklist to match the delivered work.

Do not commit original generated PNGs, `work/`, credentials or build output.

## Quality gates

Run `pnpm setup`, install Chromium with `pnpm exec playwright-core install chromium`,
and install `ffmpeg`. Then run the full checker for every added or changed section:

```sh
pnpm check 08.01
pnpm typecheck
pnpm build
pnpm audit
```

The section check verifies verbatim text and ordered couplet coverage, scene
structure and scores, required prompts/manifests/reports, AVIF decoding and
1536×1024 dimensions, browser errors, desktop and phone renders, and full-score
audio. Peak must stay below −1 dBFS and integrated loudness within −26 to
−20 LUFS. Painting count and size warnings still need review.

Open both contact sheets and listen to the score. Automated checks cannot
judge miniature style, character continuity, historical details, religious
constraints, the focal light, musical fit or whether a poem obscures an
important figure. Check [art/STYLE.md](art/STYLE.md), [DESIGN.md](DESIGN.md) and
[sound/SOUND.md](sound/SOUND.md). Test slow scrolling and reversal through
portals, buttons and arrow keys, phone layouts and reduced motion for UI changes.

Use the PR template to say **passed**, **failed** or **not checked**. Name every
warning and exception. Do not mark a section complete because its files exist.

## What CI does

Pull requests and pushes to `main` or `develop` run a frozen install, dependency
audit, typecheck, build and section checks. Changed section assets, prompts,
manifests and reports select their section checks. Shared reader, style and
sound changes sample all built sections; other changes smoke-test 01.01.
New or changed sections always receive the full check. Contact sheets and
checker results are attached to the run for review.

CI rejects changes or deletions of existing paintings. A replacement must use
a new filename. CI never generates images or deploys a PR.

## Changes to infrastructure

Cloudflare credentials are unavailable to PR checks, forks and `develop`.
Production deployment uses a separate GitHub-hosted job and only the build
from the same owner-pushed `main` run. Workflow, dependency, configuration and
build-script changes need especially careful owner review before merging.
Once merged to `main`, code is trusted for publication. Never merge code that
prints secrets or sends them elsewhere. See [DEPLOY.md](DEPLOY.md).
