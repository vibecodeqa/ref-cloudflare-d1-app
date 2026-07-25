import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith(".ts")) out.push(full);
  }
  return out;
}

const failures = [];
for (const file of walk("src")) {
  const text = readFileSync(file, "utf8");
  if (/DB\.exec\(/.test(text)) failures.push(`${file}: request code must not use DB.exec()`);
  if (/prepare\(`/.test(text)) failures.push(`${file}: SQL templates are not allowed in request code`);
}

if (failures.length) {
  console.error("Query safety check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Query safety check passed");

