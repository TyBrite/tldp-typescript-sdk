#!/usr/bin/env node
/**
 * Post-generation script for the TLDP SDK. Runs after `openapi-typescript-codegen`
 * to apply two developer-experience tweaks to the generated client:
 *   1) Renames the generated TOKEN config field -> apiKey.
 *   2) Injects idempotency-aware retry/backoff (from scripts/retry-snippet.ts) into
 *      the generated core/request.ts and core/OpenAPI.ts.
 * Idempotent — safe to re-run after every codegen.
 *
 * The version bump is NON-INTERACTIVE (no prompt) so it never hangs in headless/CI
 * runs: pass `--bump=patch|minor|major` to bump, otherwise the version is unchanged.
 */

const fs = require("fs");
const path = require("path");

const filesToUpdate = ["src/TLDP.ts", "src/core/OpenAPI.ts", "src/core/request.ts"];

console.log("🔧 Post-processing generated SDK...");

for (const filePath of filesToUpdate) {
  const fullPath = path.join(__dirname, "..", filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${filePath} (not found)`);
    continue;
  }
  let content = fs.readFileSync(fullPath, "utf-8");
  content = content
    .replace(/TOKEN\?:/g, "apiKey?:")
    .replace(/TOKEN:/g, "apiKey:")
    .replace(/config\.TOKEN/g, "config.apiKey")
    .replace(/this\.TOKEN/g, "this.apiKey")
    .replace(/TOKEN\s*=/g, "apiKey =")
    .replace(/TOKEN,/g, "apiKey,");
  fs.writeFileSync(fullPath, content, "utf-8");
  console.log(`✅ Updated ${filePath}`);
}
console.log("✨ TOKEN→apiKey rename complete.\n");

function injectRetryLogic() {
  console.log("🔁 Injecting automatic-retry logic...");

  const openApiPath = path.join(__dirname, "..", "src/core/OpenAPI.ts");
  if (fs.existsSync(openApiPath)) {
    let oa = fs.readFileSync(openApiPath, "utf-8");
    if (!oa.includes("MAX_RETRIES")) {
      oa = oa.replace(
        /(\n {4}ENCODE_PATH\?: \(\(path: string\) => string\) \| undefined;\n)/,
        "$1    MAX_RETRIES?: number | undefined;\n    RETRY_DELAY_MS?: number | undefined;\n",
      );
      oa = oa.replace(
        /(\n {4}ENCODE_PATH: undefined,\n)/,
        "$1    MAX_RETRIES: 2,\n    RETRY_DELAY_MS: 500,\n",
      );
      fs.writeFileSync(openApiPath, oa, "utf-8");
      console.log("✅ Added MAX_RETRIES/RETRY_DELAY_MS to OpenAPI.ts");
    } else {
      console.log("⏭️  OpenAPI.ts already has retry config");
    }
  }

  const requestPath = path.join(__dirname, "..", "src/core/request.ts");
  const snippetPath = path.join(__dirname, "retry-snippet.ts");
  if (!fs.existsSync(requestPath) || !fs.existsSync(snippetPath)) {
    console.log("⚠️  request.ts or retry-snippet.ts missing — skipping retry injection");
    return;
  }
  let req = fs.readFileSync(requestPath, "utf-8");
  const snippet = fs.readFileSync(snippetPath, "utf-8");
  const startMarker = "// ===== TLDP-RETRY-BLOCK-START";
  const endMarker = "// ===== TLDP-RETRY-BLOCK-END";
  const startIdx = snippet.indexOf(startMarker);
  const endLineEnd = snippet.indexOf("\n", snippet.indexOf(endMarker));
  if (startIdx === -1 || endLineEnd === -1) {
    console.log("⚠️  Retry markers not found in retry-snippet.ts — skipping");
    return;
  }
  const block = snippet.slice(startIdx, endLineEnd + 1);

  if (!req.includes("TLDP-RETRY-BLOCK-START")) {
    const anchor = "export const request = <T>";
    if (req.includes(anchor)) {
      req = req.replace(anchor, `${block}\nexport const request = <T>`);
      console.log("✅ Spliced retry block into request.ts");
    } else {
      console.log("⚠️  Could not find request() anchor — skipping");
      return;
    }
  } else {
    console.log("⏭️  request.ts already has retry block");
  }

  // Route ONLY the LAST sendRequest call site (the genuine one) through the wrapper.
  const callSite = "const response = await sendRequest(config, options, url, body, formData, headers, onCancel);";
  const routed = "const response = await sendRequestWithRetry(config, options, url, body, formData, headers, onCancel);";
  const lastIdx = req.lastIndexOf(callSite);
  if (lastIdx !== -1) {
    req = req.slice(0, lastIdx) + routed + req.slice(lastIdx + callSite.length);
    console.log("✅ Routed request() through sendRequestWithRetry (last occurrence)");
  } else {
    console.log("⏭️  request() call site already routed");
  }
  fs.writeFileSync(requestPath, req, "utf-8");
}

injectRetryLogic();

// Non-interactive version bump (only when --bump is passed).
const bumpArg = process.argv.find((a) => a.startsWith("--bump="));
if (bumpArg) {
  const kind = bumpArg.split("=")[1];
  const pkgPath = path.join(__dirname, "..", "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const [maj, min, pat] = pkg.version.split(".").map(Number);
  const next = kind === "major" ? `${maj + 1}.0.0` : kind === "minor" ? `${maj}.${min + 1}.0` : `${maj}.${min}.${pat + 1}`;
  pkg.version = next;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  console.log(`📦 Version bumped to ${next}`);
}

console.log("\n✨ Post-processing complete!");
