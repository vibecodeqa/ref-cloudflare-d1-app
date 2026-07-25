import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const manifest = JSON.parse(readFileSync("migrations/manifest.json", "utf8"));
const failures = [];

for (const migration of manifest.migrations) {
  const sql = readFileSync(join("migrations", migration.file));
  const sha256 = createHash("sha256").update(sql).digest("hex");
  if (sha256 !== migration.sha256) failures.push(`${migration.file}: ${sha256} !== ${migration.sha256}`);
}

if (failures.length) {
  console.error("Migration manifest drift detected:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Migration manifest check passed");

