#!/usr/bin/env -S node --loader tsx
/**
 * Visual QA review — generates a markdown report for the most recent
 * capture directory under artifacts/visual-qa/. The report applies the
 * rubric defined in docs/visual-qa-rubric.md.
 *
 * If no AI review key is configured (ANTHROPIC_API_KEY / OPENAI_API_KEY),
 * a placeholder per-route checklist is written instead of failing. This
 * keeps the harness advisory until AI review is wired in.
 *
 * Output: <latest-capture-dir>/review.md
 */

import dotenv from "dotenv";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import * as path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const ROOT = process.cwd();
const ARTIFACTS_DIR = path.join(ROOT, "artifacts", "visual-qa");
const RUBRIC_PATH = path.join(ROOT, "docs", "visual-qa-rubric.md");

type RouteResult = {
  path: string;
  file: string;
  status: string;
  bytes?: number;
  error?: string;
};

type Manifest = {
  generatedAt: string;
  baseUrl: string;
  captureParams?: Record<string, string>;
  routes: RouteResult[];
};

async function findLatestCaptureDir(): Promise<string | null> {
  let entries;
  try {
    entries = await readdir(ARTIFACTS_DIR, { withFileTypes: true });
  } catch {
    return null;
  }
  const dirs = entries
    .filter((e) => e.isDirectory())
    .map((e) => path.join(ARTIFACTS_DIR, e.name));
  if (dirs.length === 0) return null;
  const dated = await Promise.all(
    dirs.map(async (d) => ({ dir: d, mtime: (await stat(d)).mtimeMs })),
  );
  dated.sort((a, b) => b.mtime - a.mtime);
  return dated[0].dir;
}

async function loadManifest(dir: string): Promise<Manifest | null> {
  try {
    const raw = await readFile(path.join(dir, "manifest.json"), "utf8");
    return JSON.parse(raw) as Manifest;
  } catch {
    return null;
  }
}

async function loadRubric(): Promise<string> {
  try {
    return await readFile(RUBRIC_PATH, "utf8");
  } catch {
    return "_Rubric file missing at docs/visual-qa-rubric.md._";
  }
}

function checklistFor(route: RouteResult): string[] {
  const lines: string[] = [];
  lines.push(`### ${route.path}`);
  lines.push("");
  if (route.status === "ok") {
    lines.push(
      `- Screenshot: \`${route.file}\` (${route.bytes ?? "unknown"} bytes)`,
    );
  } else {
    lines.push(`- **Capture failed:** ${route.error ?? "unknown error"}`);
  }
  lines.push("- [ ] Brand alignment: dark-first surface, signal-yellow accent");
  lines.push("- [ ] Typography consistency (font-accent + t-h1/t-body usage)");
  lines.push("- [ ] CTA visibility (primary button reachable above the fold)");
  lines.push("- [ ] Header / nav contrast against bg-0");
  lines.push("- [ ] Section spacing matches DESIGN.md rhythm");
  lines.push("- [ ] No unexpected legacy `text-aj-orange` or amber warning hue");
  lines.push("- [ ] No chat widget obstruction");
  lines.push("- [ ] No cookie banner obstruction");
  lines.push("- [ ] Visual hierarchy intact (eyebrow → headline → body → CTA)");
  lines.push("");
  return lines;
}

function buildReport(args: {
  captureDir: string;
  manifest: Manifest | null;
  rubric: string;
  aiEnabled: boolean;
}): string {
  const rel = path.relative(ROOT, args.captureDir).replace(/\\/g, "/");
  const lines: string[] = [];

  lines.push("# Visual QA Review");
  lines.push("");
  lines.push(`- **Capture directory:** \`${rel}\``);
  if (args.manifest) {
    lines.push(`- **Base URL:** ${args.manifest.baseUrl}`);
    lines.push(`- **Captured at:** ${args.manifest.generatedAt}`);
    lines.push(`- **Routes:** ${args.manifest.routes.length}`);
    const failed = args.manifest.routes.filter((r) => r.status === "error");
    if (failed.length > 0) {
      lines.push(`- **Capture failures:** ${failed.length}`);
    }
  } else {
    lines.push("- **Manifest:** _missing_");
  }
  lines.push(
    `- **AI review:** ${args.aiEnabled ? "key detected (wiring TBD)" : "placeholder checklist (no AI key configured)"}`,
  );
  lines.push("");

  lines.push("## Decision");
  lines.push("");
  lines.push(
    "`NEEDS_HUMAN_REVIEW` — this harness is advisory. Pass / fail is owned by the reviewer until AI review is wired in.",
  );
  lines.push("");

  lines.push("## Per-route checklist");
  lines.push("");
  if (args.manifest) {
    for (const route of args.manifest.routes) {
      for (const line of checklistFor(route)) lines.push(line);
    }
  } else {
    lines.push("_No manifest found — capture step likely did not run._");
    lines.push("");
  }

  lines.push("## Rubric reference");
  lines.push("");
  lines.push(args.rubric.trim());
  lines.push("");

  return lines.join("\n");
}

async function main() {
  const captureDir = await findLatestCaptureDir();
  if (!captureDir) {
    console.error(
      "visual-qa: no capture directory under artifacts/visual-qa/. Run pnpm visual:qa:capture first.",
    );
    process.exit(1);
  }
  const manifest = await loadManifest(captureDir);
  const rubric = await loadRubric();
  const aiEnabled = Boolean(
    process.env.ANTHROPIC_API_KEY ?? process.env.OPENAI_API_KEY,
  );

  const report = buildReport({ captureDir, manifest, rubric, aiEnabled });
  const reportPath = path.join(captureDir, "review.md");
  await writeFile(reportPath, report);

  console.log(`visual-qa: review → ${path.relative(ROOT, reportPath)}`);
  if (!aiEnabled) {
    console.log(
      "visual-qa: AI review not enabled — placeholder checklist written. Set ANTHROPIC_API_KEY to enable.",
    );
  }
}

main().catch((err) => {
  console.error("visual-qa: review failed", err);
  process.exit(2);
});
