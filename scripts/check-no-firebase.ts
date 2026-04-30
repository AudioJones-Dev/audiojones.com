#!/usr/bin/env -S node --loader tsx
// scripts/check-no-firebase.ts
//
// Repo guardrail: fail the build if Firebase has been reintroduced. Checks for
// (a) Firebase package imports in source/config, (b) firebase / firebase-admin
// in package.json dependency lists, and (c) FIREBASE_/NEXT_PUBLIC_FIREBASE_
// keys in env templates.
//
// Why: see docs/architecture/stack-decision.md. Firebase is intentionally
// excluded; lead capture is on NeonDB, email on Resend, content on Sanity,
// hosting on Vercel + Cloudflare, automations on n8n.
//
// Run via `pnpm check:no-firebase`.

import { promises as fs } from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "..");

// Files / directories the scanner will not descend into.
const SKIP_DIRS = new Set<string>([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "out",
  "coverage",
  ".vercel",
  ".turbo",
  ".claude",
  "packages/config/dist",
  "src/dataconnect-generated",
  "dataconnect",
]);

// Files that are allowed to mention firebase: the docs explaining why we
// removed it, the legacy stub, and this guard script itself.
const ALLOWED_FILES = new Set<string>(
  [
    "scripts/check-no-firebase.ts",
    "src/lib/legacy-stubs.ts",
    "docs/architecture/stack-decision.md",
    "docs/architecture/backend-stack.md",
    "docs/env/env-template.md",
    "secrets.md",
    "vercel.env",
  ].map((p) => path.normalize(p)),
);

const SCAN_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".cjs",
  ".mjs",
  ".jsx",
  ".json",
  ".env",
]);

const ENV_FILE_NAMES = new Set([
  ".env",
  ".env.example",
  ".env.local.example",
  ".env.template",
  ".env.schema.json",
  "vercel.env",
]);

// Firebase package import patterns. Match `from "firebase..."`,
// `from 'firebase-admin'`, `require("firebase/...")`, etc.
const IMPORT_PATTERNS: RegExp[] = [
  /from\s+['"](firebase|firebase-admin|@firebase\/[^'"]+|firebase\/[^'"]+|firebase-admin\/[^'"]+)['"]/g,
  /require\(\s*['"](firebase|firebase-admin|@firebase\/[^'"]+|firebase\/[^'"]+|firebase-admin\/[^'"]+)['"]\s*\)/g,
  /import\s*\(\s*['"](firebase|firebase-admin|@firebase\/[^'"]+|firebase\/[^'"]+|firebase-admin\/[^'"]+)['"]\s*\)/g,
];

// Forbidden Firebase env keys that must not appear in env templates / docs
// that are scanned.
const FORBIDDEN_ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_PRIVATE_KEY_BASE64",
  "FIREBASE_DATABASE_URL",
  "FIREBASE_ADMIN_PRIVATE_KEY",
  "FIREBASE_ADMIN_CLIENT_EMAIL",
  "FIREBASE_ADMIN_PROJECT_ID",
];

const violations: string[] = [];

function record(violation: string) {
  violations.push(violation);
}

function relative(absPath: string): string {
  return path.relative(ROOT, absPath);
}

function isAllowed(rel: string): boolean {
  return ALLOWED_FILES.has(path.normalize(rel));
}

async function walk(dir: string): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    const rel = relative(abs);
    const normalizedRel = path.normalize(rel);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || SKIP_DIRS.has(normalizedRel)) continue;
      await walk(abs);
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name);
    const isEnv = ENV_FILE_NAMES.has(entry.name);
    if (!SCAN_EXTENSIONS.has(ext) && !isEnv) continue;
    if (isAllowed(normalizedRel)) continue;
    await scanFile(abs, isEnv);
  }
}

async function scanFile(file: string, isEnv: boolean): Promise<void> {
  let text: string;
  try {
    text = await fs.readFile(file, "utf8");
  } catch {
    return;
  }
  const rel = relative(file);

  for (const pattern of IMPORT_PATTERNS) {
    pattern.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(text)) !== null) {
      record(`${rel}: imports "${m[1]}" — Firebase has been removed`);
    }
  }

  if (isEnv) {
    for (const key of FORBIDDEN_ENV_KEYS) {
      const re = new RegExp(`(^|\\b)${key}\\b`, "m");
      if (re.test(text)) {
        record(`${rel}: declares forbidden env key ${key}`);
      }
    }
  }
}

async function checkPackageJson(): Promise<void> {
  const targets = [
    path.join(ROOT, "package.json"),
    ...(await findWorkspacePackageJsons()),
  ];
  for (const target of targets) {
    let raw: string;
    try {
      raw = await fs.readFile(target, "utf8");
    } catch {
      continue;
    }
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
      optionalDependencies?: Record<string, string>;
    };
    const buckets: Array<[string, Record<string, string> | undefined]> = [
      ["dependencies", pkg.dependencies],
      ["devDependencies", pkg.devDependencies],
      ["peerDependencies", pkg.peerDependencies],
      ["optionalDependencies", pkg.optionalDependencies],
    ];
    for (const [bucket, deps] of buckets) {
      if (!deps) continue;
      for (const name of Object.keys(deps)) {
        if (
          name === "firebase" ||
          name === "firebase-admin" ||
          name.startsWith("@firebase/") ||
          name === "firebase-functions"
        ) {
          record(
            `${relative(target)}: ${bucket} contains forbidden package "${name}"`,
          );
        }
      }
    }
  }
}

async function findWorkspacePackageJsons(): Promise<string[]> {
  const out: string[] = [];
  for (const root of ["packages", "apps"]) {
    const dir = path.join(ROOT, root);
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const sub = path.join(dir, entry.name);
        const candidate = path.join(sub, "package.json");
        try {
          await fs.access(candidate);
          out.push(candidate);
        } catch {
          // walk one level deeper for nested workspaces (e.g. packages/adapters/*)
          const nested = await fs.readdir(sub, { withFileTypes: true });
          for (const n of nested) {
            if (!n.isDirectory()) continue;
            const nestedCandidate = path.join(sub, n.name, "package.json");
            try {
              await fs.access(nestedCandidate);
              out.push(nestedCandidate);
            } catch {
              /* ignore */
            }
          }
        }
      }
    } catch {
      /* ignore */
    }
  }
  return out;
}

async function main() {
  await walk(ROOT);
  await checkPackageJson();

  if (violations.length === 0) {
    console.log(
      "check-no-firebase: clean — no Firebase imports, packages, or env keys found.",
    );
    return;
  }

  console.error("check-no-firebase: violations found:");
  for (const v of violations) {
    console.error(`  - ${v}`);
  }
  console.error(
    "\nFirebase has been intentionally removed from audiojones.com.\n" +
      "See docs/architecture/stack-decision.md for the approved replacement stack.",
  );
  process.exit(1);
}

main().catch((err) => {
  console.error("check-no-firebase: unexpected error", err);
  process.exit(2);
});
