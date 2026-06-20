#!/usr/bin/env bun
/**
 * smoke.ts — one-click test for the TypedTranslate macOS app.
 *
 * A Bun Shell script (https://bun.sh/docs/runtime/shell). It validates the whole
 * stack — toolchain, `swift build`, the bridge's deterministic parse, and one
 * live model annotation — then launches the app (unless --no-launch).
 *
 *   ./smoke.ts                 # full check, then open the app
 *   bun smoke.ts --no-launch   # checks only (CI-friendly)
 *   ./smoke.ts --skip-live     # skip the codex/claude model call
 *   ./smoke.ts --engine claude # use claude for the live annotation (default: codex)
 */
import { $ } from "bun";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const APP_DIR = dirname(fileURLToPath(import.meta.url)); // apps/TypedTranslate
const REPO_DIR = resolve(APP_DIR, "..", ".."); // repo root
const BRIDGE = `${APP_DIR}/bridge/tt-bridge.ts`;

const argv = process.argv.slice(2);
const has = (f: string) => argv.includes(f);
const noLaunch = has("--no-launch");
const skipLive = has("--skip-live");
const engineIdx = argv.indexOf("--engine");
const engine = engineIdx >= 0 ? argv[engineIdx + 1] ?? "codex" : "codex";
if (has("-h") || has("--help")) {
  console.log("Usage: ./smoke.ts [--no-launch] [--skip-live] [--engine codex|claude]");
  process.exit(0);
}

const g = (s: string) => `\x1b[32m${s}\x1b[0m`;
const r = (s: string) => `\x1b[31m${s}\x1b[0m`;
const y = (s: string) => `\x1b[33m${s}\x1b[0m`;
const d = (s: string) => `\x1b[2m${s}\x1b[0m`;
const b = (s: string) => `\x1b[1m${s}\x1b[0m`;

let hardFail = false;
function step(ok: boolean, name: string, detail = "") {
  if (!ok) hardFail = true;
  console.log(`${ok ? g("✓") : r("✗")} ${name}${detail ? d("  — " + detail) : ""}`);
}

console.log(b("\n◆ TypedTranslate smoke test"));
console.log(d(`  repo:   ${REPO_DIR}`));
console.log(d(`  bridge: ${BRIDGE}\n`));

// 1. Toolchain on the login PATH (the app resolves these the same way at runtime).
const missing: string[] = [];
for (const tool of ["bun", "swift", "codex", "claude"]) {
  const { exitCode } = await $`/bin/zsh -lc ${`command -v ${tool}`}`.quiet().nothrow();
  if (exitCode !== 0) missing.push(tool);
}
step(missing.length === 0, "toolchain (bun · swift · codex · claude on login PATH)", missing.length ? `missing: ${missing.join(", ")}` : "");
if (missing.includes("bun") || missing.includes("swift")) {
  console.log(r("\nCannot continue without bun + swift.\n"));
  process.exit(1);
}

// 2. swift build.
{
  const res = await $`swift build`.cwd(APP_DIR).quiet().nothrow();
  step(res.exitCode === 0, "swift build");
  if (res.exitCode !== 0) {
    console.log(d(res.stderr.toString().split("\n").slice(-18).join("\n")));
    console.log(r("\nBuild failed — fix the above before testing the app.\n"));
    process.exit(1);
  }
}

// 3. Bridge deterministic parse: a known snippet must resolve to a known string.
{
  const snippet =
    'import type { IchidanVerb, Sentence, VerbPart, ParticlePart } from "typed-japanese";\n' +
    'type 食べる = IchidanVerb & { stem: "食べ"; ending: "る" };\n' +
    'type X = Sentence<[VerbPart<食べる, "Ta">, ParticlePart<"よ">]>;\n';
  const req = Buffer.from(JSON.stringify({ code: snippet }));
  const res = await $`bun ${BRIDGE} parse < ${req}`.cwd(REPO_DIR).quiet().nothrow();
  let ok = false;
  let detail = "invalid JSON from bridge";
  try {
    const j = JSON.parse(res.stdout.toString());
    const root = j.tree?.resolved;
    const particle = j.tree?.children?.at(-1)?.resolved;
    ok = j.ok === true && root === "食べたよ" && particle === "よ";
    detail = `root → "${root}"`;
  } catch {
    /* keep default detail */
  }
  step(ok, "bridge parse → resolved grammar tree", detail);
  if (!ok) {
    console.log(d(res.stderr.toString().split("\n").slice(-8).join("\n")));
    process.exit(1);
  }
}

// 4. Live end-to-end: ask the model to annotate, verify, and parse a real sentence.
let liveVerified: boolean | null = null;
if (skipLive) {
  console.log(d("• live model annotation — skipped (--skip-live)"));
} else {
  console.log(d(`• asking ${engine} to annotate "食べた" (live, up to ~60s)…`));
  const req = Buffer.from(JSON.stringify({ sentence: "食べた", engine, retries: 3 }));
  const res = await $`bun ${BRIDGE} ${"annotate+parse"} < ${req}`.cwd(REPO_DIR).quiet().nothrow();
  try {
    const j = JSON.parse(res.stdout.toString());
    liveVerified = j.ok === true;
    step(j.ok === true, `live annotate+parse via ${engine}`, j.ok ? `resolved "${j.resolved}"` : `model output didn't verify: ${(j.errors ?? [])[0] ?? "unknown"}`);
    if (!j.ok) hardFail = false; // model variance is a soft failure — the plumbing answered.
  } catch {
    step(false, `live annotate+parse via ${engine}`, "no valid JSON — runner error");
    console.log(d(res.stderr.toString().split("\n").slice(-8).join("\n")));
  }
}

// Summary.
console.log("");
if (hardFail) {
  console.log(r(b("Smoke test failed — see the ✗ above.\n")));
  process.exit(1);
}
if (liveVerified === false) {
  console.log(y(b("Plumbing OK, but the live annotation didn't verify (model variance).")));
  console.log(y("Re-run, or use --skip-live to test the app without the model.\n"));
} else {
  console.log(g(b("All checks passed.\n")));
}

// 5. Launch the app (delegates env wiring + preflight to run.ts).
if (noLaunch) {
  console.log(d("--no-launch: not opening the app."));
  process.exit(0);
}
console.log(b("◆ Launching TypedTranslate — close the window to exit.\n"));
await $`bun ./run.ts`.cwd(APP_DIR);
