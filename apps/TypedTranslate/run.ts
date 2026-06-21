#!/usr/bin/env bun
/**
 * run.ts — launch TypedTranslate from this repo checkout.
 *
 * A Bun Shell script (https://bun.sh/docs/runtime/shell) — the project's
 * cross-platform replacement for ad-hoc bash. TypedTranslate is a dev tool: it
 * runs against the typed-japanese repo it lives in. This points the app at the
 * repo + bridge, sanity-checks that the CLIs the bridge shells out to are
 * reachable, then `swift run`s the app.
 *
 *   ./run.ts            # executable (bun shebang)
 *   bun run.ts [args…]  # extra args are passed through to `swift run`
 */
import { $ } from "bun";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const APP_DIR = dirname(fileURLToPath(import.meta.url)); // apps/TypedTranslate
const REPO_DIR = resolve(APP_DIR, "..", ".."); // apps/TypedTranslate -> apps -> repo

// The Swift app reads these to find the bridge and the repo cwd. Honor any
// values already exported by the caller; otherwise default to this checkout.
const repo = process.env.TYPEDTRANSLATE_REPO ?? REPO_DIR;
const bridge = process.env.TYPEDTRANSLATE_BRIDGE ?? `${APP_DIR}/bridge/tt-bridge.ts`;
process.env.TYPEDTRANSLATE_REPO = repo;
process.env.TYPEDTRANSLATE_BRIDGE = bridge;

// --- preflight: the bridge shells out to bun, codex and claude ---------------
// GUI apps don't inherit the interactive shell PATH, so the app launches these
// through `/bin/zsh -lc`. Check them the same way so this matches runtime.
const missing: string[] = [];
for (const tool of ["bun", "codex", "claude"]) {
  const { exitCode } = await $`/bin/zsh -lc ${`command -v ${tool}`}`.quiet().nothrow();
  if (exitCode !== 0) missing.push(tool);
}

if (missing.length > 0) {
  console.error(`TypedTranslate: required CLI(s) not found on the login-shell PATH: ${missing.join(", ")}`);
  console.error("");
  console.error("The bridge shells out to these tools. Install / expose them, e.g.:");
  console.error("  bun     -> https://bun.sh           (expects ~/.bun/bin on PATH)");
  console.error("  codex   -> codex-cli (npm i -g @openai/codex or your install)");
  console.error("  claude  -> Claude Code CLI");
  console.error("");
  console.error("Make sure they're on the PATH set in your ~/.zprofile / ~/.zshrc");
  console.error("(the app and this script both resolve them via '/bin/zsh -lc').");
  process.exit(1);
}

if (!existsSync(bridge)) {
  console.error(`TypedTranslate: bridge not found at: ${bridge}`);
  console.error("Set TYPEDTRANSLATE_BRIDGE to the tt-bridge.ts path, or check out the repo fully.");
  process.exit(1);
}

console.log(`TypedTranslate: TYPEDTRANSLATE_REPO=${repo}`);
console.log(`TypedTranslate: TYPEDTRANSLATE_BRIDGE=${bridge}`);
console.log("TypedTranslate: building + launching via 'swift run'...");

// Pass through any extra args to `swift run`; inherit stdio so the build log
// streams and the app window comes up.
const passthrough = process.argv.slice(2);
await $`swift run ${passthrough}`.cwd(APP_DIR);
