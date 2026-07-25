# Cloudflare D1 App Reference

Reference implementation for the VibeCode QA Cloudflare D1 App rubric.

This repo demonstrates a small Worker API backed by D1:

- `src/`: Worker request handling and D1 query helpers
- `migrations/`: ordered append-only SQL migrations
- `migrations/manifest.json`: checksum drift guard for migration identity
- `scripts/`: clean migration apply, drift, query-safety, and deploy-shape checks
- `wrangler.toml`: local, preview, and production D1 binding separation

## Local workflow

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm migrations:check
pnpm build
```

Run the full CI gate:

```bash
pnpm run ci
```

## D1 safety posture

Migrations are append-only after shared apply. Request data enters SQL through prepared
statement bindings, and tenant-owned queries include indexed `tenant_id` predicates.

Production deploys must apply D1 migrations before deploying Worker code that depends on
the schema.

See [docs/vcqa-report.md](docs/vcqa-report.md).

