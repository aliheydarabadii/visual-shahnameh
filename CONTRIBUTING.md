# Contributing

Fork the repository, work on a branch, and open a pull request to `main`.

## Add chapters

> **Codex is required for image generation.** Install the Codex app and sign
> in with your own account. If you do not have Codex, do not use the
> chapter-building prompt.

You can use Codex, Claude or Grok as your coding agent, with Codex generating
images. Copy the [prompt in the README](README.md#contribute) and replace X
with the number of chapters to build. The agent follows [AGENTS.md](AGENTS.md)
and the [builder brief](docs/BUILDER_BRIEF.md) for the text, paintings, music
and section checks.

1. Set up the checkout with `pnpm setup`, install `ffmpeg`, and run
   `pnpm exec playwright-core install chromium`.
2. Run the chapter-building prompt. The agent completes each section and its
   checks, then records the results in `reports/`.
3. Refresh the chapter checklist and run the project checks:

   ```sh
   node scripts/update_readme_contents.mjs
   pnpm check:chapters
   pnpm build
   ```

4. Open a PR listing the chapters and sections added, their reports, and any
   remaining problems. CI runs the checks before merging.

The full section check, `pnpm check <id>`, covers source text, paintings,
desktop and phone renders, and audio levels. The [builder brief](docs/BUILDER_BRIEF.md)
contains the detailed criteria. Keep the optimized AVIF paintings, prompts,
manifests and reports; leave original PNGs and temporary output out of Git.
Existing paintings keep their filenames; replacements get new names.

Before starting sections, follow the [shared-claim workflow](README.md#reserve-work-before-starting).
Open a claim issue in the upstream repository so contributors across forks
can see which sections are reserved.

## Other changes

UI, accessibility, sound and engine improvements are welcome. Describe the
result and how you checked it in your PR.

PRs need no Cloudflare credentials. Only pushes to `main` deploy; forks,
PR checks and `develop` have no access to production secrets. See
[DEPLOY.md](DEPLOY.md) for deployment details.
