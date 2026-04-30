// One-shot codemod: add `: any` to every TS7006 implicit-any parameter
// reported by `tsc --noEmit`. Used to clean up the legacy admin/portal
// callbacks that lost contextual typing when Firebase was removed.
//
// Handles both styles:
//   .map((doc) => ...)        -> .map((doc: any) => ...)
//   .map(doc => ...)          -> .map((doc: any) => ...)
//   .reduce((sum, doc) => ...) -> .reduce((sum: any, doc: any) => ...)
//
// Usage: pnpm tsx scripts/fix-implicit-any.ts
//
// Idempotent: re-running on already-annotated parameters is a noop because
// `name: any` no longer triggers TS7006.

import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import * as path from "node:path";

type Edit = { file: string; line: number; col: number; name: string };

const ROOT = path.resolve(__dirname, "..");

function runTsc(): string {
  try {
    return execSync("pnpm exec tsc --noEmit", {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
    });
  } catch (err) {
    const e = err as { stdout?: string };
    return e.stdout ?? "";
  }
}

function parseEdits(output: string): Edit[] {
  const edits: Edit[] = [];
  const re =
    /^(.+?)\((\d+),(\d+)\): error TS7006: Parameter '([^']+)' implicitly has an 'any' type\./;
  for (const line of output.split("\n")) {
    const m = re.exec(line);
    if (!m) continue;
    edits.push({
      file: m[1],
      line: Number(m[2]),
      col: Number(m[3]),
      name: m[4],
    });
  }
  return edits;
}

function applyEditToLine(lineText: string, edit: Edit): string | null {
  const start = edit.col - 1;
  if (lineText.slice(start, start + edit.name.length) !== edit.name) {
    return null;
  }
  const before = lineText.slice(0, start);
  const after = lineText.slice(start + edit.name.length);
  // Already annotated.
  if (/^\s*:/.test(after)) return null;

  // Decide whether the parameter is part of a parenthesized parameter list
  // (e.g. `.map((doc) => ...)`, `.reduce((sum, doc) => ...)`) or a
  // paren-less arrow (`.map(doc => ...)`). Scan `after` until we see one of
  // `=>`, `,`, `)`. Hitting `=>` first means the parameter is a paren-less
  // arrow that needs to be wrapped.
  let parenlessArrow = false;
  for (let i = 0; i < after.length; i += 1) {
    const ch = after[i];
    if (ch === "=" && after[i + 1] === ">") {
      parenlessArrow = true;
      break;
    }
    if (ch === "," || ch === ")" || ch === "(" || ch === ":") {
      break;
    }
  }

  if (!parenlessArrow) {
    return before + edit.name + ": any" + after;
  }

  // Paren-less arrow: wrap the parameter in parens with type annotation.
  return before + "(" + edit.name + ": any)" + after;
}

async function applyEdits(edits: Edit[]): Promise<number> {
  const byFile = new Map<string, Edit[]>();
  for (const edit of edits) {
    const list = byFile.get(edit.file) ?? [];
    list.push(edit);
    byFile.set(edit.file, list);
  }

  let applied = 0;
  for (const [file, list] of byFile) {
    list.sort((a, b) => b.line - a.line || b.col - a.col);
    const abs = path.resolve(ROOT, file);
    const text = await fs.readFile(abs, "utf8");
    const lines = text.split("\n");

    for (const edit of list) {
      const idx = edit.line - 1;
      const lineText = lines[idx];
      if (lineText == null) continue;
      const updated = applyEditToLine(lineText, edit);
      if (updated == null) continue;
      lines[idx] = updated;
      applied += 1;
    }

    await fs.writeFile(abs, lines.join("\n"), "utf8");
  }
  return applied;
}

async function main() {
  const MAX_PASSES = 5;
  let total = 0;
  for (let pass = 0; pass < MAX_PASSES; pass += 1) {
    const output = runTsc();
    const edits = parseEdits(output);
    if (edits.length === 0) break;
    const applied = await applyEdits(edits);
    total += applied;
    if (applied === 0) break;
  }
  console.log(`fix-implicit-any: annotated ${total} parameter(s) total.`);
}

main().catch((err) => {
  console.error("fix-implicit-any: failed", err);
  process.exit(1);
});
