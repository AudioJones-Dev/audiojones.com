#!/usr/bin/env -S node --loader tsx
// scripts/check-design-tokens.ts
//
// Repo guardrail: keep the three design-system sources in lockstep.
//
//   1. docs/DESIGN.md           — color tokens table (§5.1)
//   2. src/app/globals.css      — :root { --signal-yellow: #E8FF5A; ... }
//   3. src/lib/applied-intelligence/tokens.ts  — aiColors export
//
// Fail the build if any of the three disagree on a tracked token's value.
//
// Why: per DESIGN.md §12 "Sync rule" — token drift between these three
// files is the most common visual bug source on this codebase.
//
// Run via `pnpm check:design-tokens`.

import { promises as fs } from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "..");

// Tokens we enforce across all three files. Keys are the CSS variable
// names; the documented value is the source of truth (from DESIGN.md
// §5.1). globals.css and tokens.ts must match.
//
// Adding a new tracked token:
//   1. Add the row to DESIGN.md §5.1.
//   2. Add the CSS var to globals.css :root.
//   3. Add the camelCase entry to tokens.ts aiColors.
//   4. Add the entry here.
const TRACKED: Array<{
  cssVar: string;        // --signal-yellow
  tokensKey: string;     // signalYellow
  expected: string;      // #E8FF5A
}> = [
  { cssVar: "--signal-yellow", tokensKey: "signalYellow", expected: "#E8FF5A" },
  { cssVar: "--signal-soft",   tokensKey: "signalSoft",   expected: "#F0FF85" },
  { cssVar: "--bg-base",       tokensKey: "bgBase",       expected: "#080808" },
  { cssVar: "--surface-1",     tokensKey: "surface1",     expected: "#0F0F0F" },
  { cssVar: "--surface-2",     tokensKey: "surface2",     expected: "#161616" },
  { cssVar: "--border-strong", tokensKey: "borderStrong", expected: "#2A2A2A" },
  { cssVar: "--border-subtle", tokensKey: "borderSubtle", expected: "#1E1E1E" },
  { cssVar: "--text-primary",  tokensKey: "textPrimary",  expected: "#E8E8E8" },
  { cssVar: "--text-muted",    tokensKey: "textMuted",    expected: "#666666" },
  { cssVar: "--accent-blue",   tokensKey: "accentBlue",   expected: "#4DACFF" },
  { cssVar: "--accent-red",    tokensKey: "accentRed",    expected: "#FF4545" },
  { cssVar: "--accent-amber",  tokensKey: "accentAmber",  expected: "#FFB340" },
  { cssVar: "--accent-green",  tokensKey: "accentGreen",  expected: "#3DFFB0" },
  { cssVar: "--paper",         tokensKey: "paper",        expected: "#F8FAFC" },
  { cssVar: "--surface",       tokensKey: "surface",      expected: "#F5F5F5" },
  { cssVar: "--surface-soft",  tokensKey: "surfaceSoft",  expected: "#EEF2F6" },
  { cssVar: "--ink",           tokensKey: "ink",          expected: "#111111" },
  { cssVar: "--ink-muted",     tokensKey: "inkMuted",     expected: "#4B5563" },
];

const violations: string[] = [];

function record(v: string) {
  violations.push(v);
}

function normalize(hex: string): string {
  return hex.trim().toLowerCase();
}

async function readText(rel: string): Promise<string> {
  return fs.readFile(path.join(ROOT, rel), "utf8");
}

// Match `--name: #VALUE;` inside :root. Tolerates whitespace and trailing
// comments. Returns the raw value string (e.g. "#E8FF5A" or
// "rgba(17,17,17,0.10)").
function extractCssVar(css: string, name: string): string | null {
  const re = new RegExp(
    `${name.replace(/[-/]/g, "\\$&")}\\s*:\\s*([^;]+?)\\s*;`,
    "m",
  );
  const m = css.match(re);
  return m ? m[1].trim() : null;
}

// Match `tokensKey: "VALUE",` in tokens.ts.
function extractTokensValue(ts: string, key: string): string | null {
  const re = new RegExp(`\\b${key}\\s*:\\s*"([^"]+)"`, "m");
  const m = ts.match(re);
  return m ? m[1] : null;
}

// Match the doc's color-tokens table row:
//   `--name`  | `value` | role
function extractDocValue(md: string, cssVar: string): string | null {
  const re = new RegExp(
    "\\|\\s*`" +
      cssVar.replace(/[-/]/g, "\\$&") +
      "`\\s*\\|\\s*`([^`]+)`",
    "m",
  );
  const m = md.match(re);
  return m ? m[1] : null;
}

async function main() {
  const [css, ts, md] = await Promise.all([
    readText("src/app/globals.css"),
    readText("src/lib/applied-intelligence/tokens.ts"),
    readText("docs/DESIGN.md"),
  ]);

  for (const t of TRACKED) {
    const cssVal = extractCssVar(css, t.cssVar);
    const tsVal = extractTokensValue(ts, t.tokensKey);
    const docVal = extractDocValue(md, t.cssVar);

    if (cssVal === null) {
      record(`globals.css :root is missing ${t.cssVar}`);
    } else if (normalize(cssVal) !== normalize(t.expected)) {
      record(
        `globals.css ${t.cssVar} = ${cssVal}, expected ${t.expected} (per DESIGN.md §5.1)`,
      );
    }

    if (tsVal === null) {
      record(`tokens.ts aiColors is missing ${t.tokensKey}`);
    } else if (normalize(tsVal) !== normalize(t.expected)) {
      record(
        `tokens.ts aiColors.${t.tokensKey} = "${tsVal}", expected "${t.expected}" (per DESIGN.md §5.1)`,
      );
    }

    if (docVal === null) {
      record(`docs/DESIGN.md §5.1 is missing ${t.cssVar} row`);
    } else if (normalize(docVal) !== normalize(t.expected)) {
      record(
        `docs/DESIGN.md §5.1 ${t.cssVar} = ${docVal}, expected ${t.expected}`,
      );
    }
  }

  if (violations.length === 0) {
    console.log(
      `check-design-tokens: clean — all ${TRACKED.length} tracked tokens agree across DESIGN.md, globals.css, and tokens.ts.`,
    );
    return;
  }

  console.error("check-design-tokens: drift detected:");
  for (const v of violations) {
    console.error(`  - ${v}`);
  }
  console.error(
    "\nFix: update all three sources in lockstep. See docs/DESIGN.md §12 (Sync rule).",
  );
  process.exit(1);
}

main().catch((err) => {
  console.error("check-design-tokens: unexpected error", err);
  process.exit(2);
});
