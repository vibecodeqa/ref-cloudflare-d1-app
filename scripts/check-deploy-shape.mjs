import { readFileSync } from "node:fs";

const deploy = readFileSync(".github/workflows/deploy.yml", "utf8");
const wrangler = readFileSync("wrangler.toml", "utf8");

const required = [
  "pnpm run ci",
  "wrangler d1 migrations apply DB --env production --remote",
  "wrangler deploy --env production",
  "CLOUDFLARE_API_TOKEN",
  "CLOUDFLARE_ACCOUNT_ID",
  "[[env.preview.d1_databases]]",
  "[[env.production.d1_databases]]",
  'migrations_dir = "migrations"'
];

const missing = required.filter((snippet) => !deploy.includes(snippet) && !wrangler.includes(snippet));

if (missing.length) {
  console.error("Deploy shape check failed:");
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log("Deploy shape check passed");

