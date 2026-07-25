# VCQA Report

Score: **92/100**

This reference repo is intentionally small, but it carries the evidence VCQA expects from
a D1-backed Cloudflare app.

## Covered by authored standards

- [Cloudflare D1 App v1](https://vibecodeqa.online/standards/cloudflare-d1-app/v1/):
  D1 bindings, migrations, clean local apply, drift guard, environment separation,
  parameterized queries, tenant isolation, and deploy ordering.
- [Security v1](https://vibecodeqa.online/standards/security/v1/): tenant boundary checks,
  safe client errors, no committed credentials, least-privilege workflows, and SQL
  injection controls.
- [Testing v1](https://vibecodeqa.online/standards/testing/v1/): unit tests for query
  helpers, HTTP boundary tests, migration apply checks, drift checks, and deploy-shape
  checks.
- [TypeScript v1](https://vibecodeqa.online/standards/typescript/v1/): strict Worker and
  D1 helper types.

## D1-specific evidence

- `wrangler.toml` declares local, preview, and production D1 bindings separately.
- `migrations/` contains ordered SQL files with tenant predicate indexes.
- `migrations/manifest.json` records migration checksums.
- `scripts/check-migrations.mjs` applies all migrations to a clean SQLite database.
- `src/db.ts` uses D1 prepared statement `.bind(...)` for request values.
- `.github/workflows/deploy.yml` runs CI, applies production migrations, then deploys code.

## Remaining standard gaps

- Dependency Hygiene is still planned, though this repo pins a package manager and lockfile.
- A real production deployment should add protected GitHub environments and retained
  migration logs for every promotion.

## Why this is not 100

The repo uses placeholder D1 database IDs and does not apply migrations to a real Cloudflare
account. A production app should add real preview/production D1 IDs, environment
protection, backup/export checks before destructive migrations, and live smoke evidence.

