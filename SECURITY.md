# Security

Report vulnerabilities through the repository's **Security → Report a
vulnerability** page. Do not post credentials or an exploit containing secrets
in a public issue or pull request.

The app is static. It has no user accounts or server database. Reading progress
is stored in the reader's browser. Cloudflare deployment credentials must stay
in the GitHub `production` environment or an untracked local secret file.
Anything named `VITE_*` can be embedded in the public browser build and must
never contain a secret.

PR checks run with a read-only GitHub token, no Cloudflare credentials, and
ephemeral GitHub-hosted runners. Deployment is restricted to owner pushes to
`main`, with a separate job that does not check out or run application build
scripts. The production environment permits the `main` branch only.

Dependency audits and pinned Actions reduce known risks; they are not a
guarantee that code is vulnerability-free. Review executable changes before
merging, especially `.github/`, package manifests, lockfiles, build scripts and
Cloudflare configuration. A PR must never be run with production secrets using
`pull_request_target`, `workflow_run` or a reusable privileged workflow.
