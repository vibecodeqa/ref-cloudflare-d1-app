# Runbook

## Local migration gate

```bash
pnpm migrations:check
pnpm drift:check
```

`migrations:check` applies every SQL migration to a clean in-memory SQLite database with
foreign keys enabled. `drift:check` verifies the migration checksum manifest.

## Production promotion

Production promotion must run:

```bash
pnpm run ci
pnpm exec wrangler d1 migrations apply DB --env production --remote
pnpm exec wrangler deploy --env production
```

Remote migration output should be retained in GitHub Actions logs. Destructive migrations
require a forward-compatible rollout note and D1 Time Travel/export recovery check before
promotion.

