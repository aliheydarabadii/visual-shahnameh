# Public repository and deployment setup

README: existing emblem, home and reader screenshots, two smaller painting
previews, Persian couplets verified against the source, project purpose,
local setup, copyable next-X-chapters prompt and the retained 50-chapter checklist.
The new contribution guide and PR template record exact section IDs, automated
checks, human image/contact-sheet/listening review, audio limits and exceptions.

GitHub controls configured:

- Only the individual account `farzinnasiri` bypasses restrictions on updates
  to `main` and `develop`. The owner can make direct pushes; other contributors
  use forks and PRs. CODEOWNERS requests the owner's review for all files.
- Separate protection disallows deletion and force pushes without a bypass.
- PR gate includes owner review, resolved conversations and `Quality checks`.
- `production` accepts the `main` branch only. There are no repository-wide
  Cloudflare secrets. The account ID is an environment variable, not a secret.
- Actions use read-only GitHub permissions, full-SHA pinning, GitHub-hosted
  runners, approved action publishers and approval for all external contributors.
- Secret scanning, secret push protection, dependency alerts and private
  vulnerability reporting are enabled. Dependabot monitors packages and Actions.

CI runs on PRs and pushes to main/develop. It audits dependencies, builds,
checks changed sections in full, samples built sections for shared reader/sound
changes, and otherwise smoke-tests 01.01. It rejects modified/deleted existing
paintings. Check results and contact sheets are review artifacts.

Deployment is a separate job, only for owner pushes to this repository's main.
It downloads the same run's successful build, installs a pinned cf CLI without
lifecycle scripts, and injects the environment token into the deploy step only.
There is no application checkout, application build, shared cache, PR artifact,
pull_request_target or workflow_run in that job. Owner review is still required
for executable changes before trusting a main commit.

Validation performed locally:

- README image/link paths, all 50 checklist entries and 1,941 couplet count pass.
- GitHub Actions workflow passes actionlint 1.7.12.
- Frozen dependency install, TypeScript and production build pass.
- Initial audit found nine transitive tooling advisories. Compatible overrides
  for undici 7.30.1 and zod 4.6.6 leave zero known dependency advisories.
- CI section selector smoke check passes. Section 01.01 reports eight paintings,
  15 couplets, 20 renders, peak −5.4 dBFS and −23.9 LUFS.
- Audio measurement now suppresses per-frame loudness logs and fails on real
  ffmpeg errors in CI. The existing 864-second 05.02 score measures −22.6 LUFS
  with only 1,392 stderr bytes, avoiding the previous 1 MB buffer overflow.
- Screenshot checking waits for decoded canvas paintings, not document images.
- An isolated, application-free cf deployment dry run accepts the build.

The Cloudflare OAuth connection cannot create deployment API tokens (403 on
token management). A dedicated environment token is requested through a private
card. The first authenticated Actions deployment must pass before claiming the
automatic publication setup is fully verified. No check guarantees the absence
of all vulnerabilities; workflow/build/dependency changes need owner review.
