/**
 * Reproduces the 2026-08-31 rejection finding for this QuestionFinder batch.
 *
 *   node verify-rejection.cjs
 *
 * Reads the nine CSVs in this directory and runs the acquisition-QA tests from
 * SEARCH_IMPLEMENTATION_SPEC §9A. Exits 1 if the batch fails (expected).
 */

const fs = require("fs");
const path = require("path");

const DIR = __dirname;

// Seed phrase actually submitted for each export, needed to strip it back out.
const SEEDS = {
  "questionfinder-ai-receptionist.csv": "ai receptionist",
  "questionfinder-ai-automation-for-service-businesses.csv": "AI automation for service businesses",
  "questionfinder-business-automation-miami.csv": "business automation Miami",
  "questionfinder-ai-consultant-miami.csv": "AI consultant Miami",
  "questionfinder-google-business-profile-optimization-mia.csv": "Google Business Profile optimization Miami",
  "questionfinder-ai-search-optimization-for-small-busines.csv": "AI search optimization for small business",
};

const ZERO_VOLUME_FILES = [
  "questionfinder-seo-for-contractors-miami.csv",
  "questionfinder-website-optimization-miami.csv",
  "questionfinder-seo-consultant-miami.csv",
];

// Categories that cannot plausibly apply to a B2B software or services seed.
const ALIEN_TERMS = [
  "insurance", "medicare", "permit", "building code", "warranty",
  "equipment", "for seniors", "for landlords", "eco-friendly", "energy-efficient",
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Parse `#,Question,Volume,Signal,Intent,Reason` — Question is never quoted in these files. */
function parse(file) {
  return fs
    .readFileSync(path.join(DIR, file), "utf8")
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(\d+),(.*?),(\d+),(\d+),(\d+),/);
      return m ? { row: +m[1], question: m[2], volume: +m[3] } : null;
    })
    .filter(Boolean);
}

let failures = 0;
const fail = (test, detail) => { failures++; console.log(`FAIL  ${test}\n      ${detail}`); };
const pass = (test, detail) => console.log(`pass  ${test}\n      ${detail}`);

console.log("QuestionFinder batch 2026-08-31 — acquisition QA (spec §9A)\n");

// ── Test 1: template collision ────────────────────────────────────────────────
const names = Object.keys(SEEDS);
const templates = {};
for (const f of names) {
  templates[f] = parse(f).map((r) =>
    r.question.replace(new RegExp(esc(SEEDS[f]), "ig"), "{SEED}")
  );
}
const base = names[0];
const collisions = [];
for (const f of names.slice(1)) {
  let same = 0;
  for (let i = 0; i < templates[base].length; i++) {
    if (templates[base][i] === templates[f][i]) same++;
  }
  const pct = Math.round((same / templates[f].length) * 100);
  collisions.push(`${same}/${templates[f].length} (${pct}%) ${f}`);
}
const worst = Math.max(...collisions.map((c) => +c.match(/\((\d+)%\)/)[1]));
if (worst > 60) {
  fail("1. template collision (>60% positional identity fails)",
    `baseline ${base}\n      ` + collisions.join("\n      "));
} else {
  pass("1. template collision", collisions.join("\n      "));
}

// ── Test 2: domain plausibility ───────────────────────────────────────────────
const alienHits = [];
for (const f of names) {
  for (const r of parse(f)) {
    const t = ALIEN_TERMS.find((x) => r.question.toLowerCase().includes(x));
    if (t) alienHits.push(`r${r.row} "${r.question}" (${r.volume}/mo) [${t}]`);
  }
}
if (alienHits.length) {
  fail(`2. domain plausibility (${alienHits.length} category-alien questions)`,
    alienHits.slice(0, 5).join("\n      ") + `\n      ...and ${alienHits.length - 5} more`);
} else {
  pass("2. domain plausibility", "no category-alien questions");
}

// ── Test 3: volume distribution ───────────────────────────────────────────────
const spreads = [];
for (let i = 0; i < 6; i++) {
  const v = names.map((f) => parse(f)[i].volume);
  const spread = Math.round(((Math.max(...v) - Math.min(...v)) / Math.max(...v)) * 100);
  spreads.push(`r${i + 1} ${JSON.stringify(templates[base][i]).padEnd(34)} [${v.join(", ")}] spread ${spread}%`);
}
const maxSpread = Math.max(...spreads.map((s) => +s.match(/spread (\d+)%/)[1]));
if (maxSpread < 30) {
  fail("3. volume distribution (<30% cross-seed spread fails)", spreads.join("\n      "));
} else {
  pass("3. volume distribution", spreads.join("\n      "));
}

for (const f of ZERO_VOLUME_FILES) {
  const rows = parse(f);
  if (rows.every((r) => r.volume === 0)) {
    fail("3b. all-zero volume batch", `${f} — ${rows.length}/${rows.length} rows at volume 0`);
  }
}

// ── Test 4: seed fidelity ─────────────────────────────────────────────────────
const fidelity = [];
for (const f of ZERO_VOLUME_FILES) {
  const rows = parse(f);
  const local = rows.filter((r) => /miami/i.test(r.question)).length;
  fidelity.push(`${f}: ${local}/${rows.length} rows retain the "Miami" qualifier`);
}
if (fidelity.some((l) => +l.match(/: (\d+)\//)[1] / +l.match(/\/(\d+) rows/)[1] < 0.5)) {
  fail("4. seed fidelity (seed qualifiers absent from returned questions)", fidelity.join("\n      "));
} else {
  pass("4. seed fidelity", fidelity.join("\n      "));
}

// ── Verdict ───────────────────────────────────────────────────────────────────
console.log(`\nVERDICT: ${failures === 0 ? "PASS" : `REJECT — ${failures} test(s) failed`}`);
console.log("Admissible Query Opportunity Register rows from this batch: 0");
process.exit(failures === 0 ? 0 : 1);
