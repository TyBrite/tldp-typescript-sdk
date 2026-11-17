#!/usr/bin/env node
/**
 * Copy src/ into the documentation repo's reference copy of the SDK source
 * (GC-docs/tldp/sdk-source). Set TLDP_DOCS_SDK_DIR to override the target.
 *
 *   npm run sync:docs
 *   npm run sync:docs -- --check     # exit 1 when the copy differs from src/
 */
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "src");
const TARGET = process.env.TLDP_DOCS_SDK_DIR
  || path.resolve(__dirname, "..", "..", "GC-docs", "tldp", "sdk-source");
const check = process.argv.includes("--check");

function walk(dir, base = dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base, out);
    else out.push(path.relative(base, p));
  }
  return out;
}

if (!fs.existsSync(path.resolve(TARGET, "..", ".."))) {
  console.error(`Documentation repo not found beside this one: ${path.resolve(TARGET, "..", "..")}`);
  process.exit(1);
}

const files = walk(SRC);
const stale = [];
for (const rel of files) {
  const to = path.join(TARGET, rel);
  const same = fs.existsSync(to) && fs.readFileSync(to).equals(fs.readFileSync(path.join(SRC, rel)));
  if (same) continue;
  stale.push(rel);
  if (!check) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(SRC, rel), to);
  }
}
for (const rel of fs.existsSync(TARGET) ? walk(TARGET) : []) {
  if (!files.includes(rel)) {
    stale.push(rel);
    if (!check) fs.rmSync(path.join(TARGET, rel));
  }
}
if (check && stale.length) { console.error(`${stale.length} file(s) differ from ${TARGET}`); process.exit(1); }
console.log(check ? "Documentation copy is current." : `Synced ${stale.length} file(s) to ${TARGET}`);
