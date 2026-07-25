import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const migrationsDir = "migrations";
const files = readdirSync(migrationsDir).filter((file) => file.endsWith(".sql")).sort();

for (const [index, file] of files.entries()) {
  const expectedPrefix = String(index + 1).padStart(4, "0");
  if (!file.startsWith(`${expectedPrefix}_`)) {
    throw new Error(`Migration ${file} does not have expected prefix ${expectedPrefix}_`);
  }
}

const db = new DatabaseSync(":memory:");
db.exec("PRAGMA foreign_keys = ON;");

for (const file of files) {
  db.exec(readFileSync(join(migrationsDir, file), "utf8"));
}

const count = db.prepare("SELECT COUNT(*) AS count FROM projects WHERE tenant_id = ?").get("tenant_demo");
if (count.count !== 2) throw new Error("Expected seeded tenant projects after clean migration apply");

console.log("Clean migration apply passed");

