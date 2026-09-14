#!/usr/bin/env -S node --loader tsx
// scripts/refresh-oews-benchmarks.ts
//
// Regenerates src/lib/roi-calculator/labor/benchmark-data.ts from the BLS
// Occupational Employment and Wage Statistics (OEWS) release for a given
// survey year, and bumps BENCHMARK_VERSION in assumptions.ts to match.
//
// Data comes from the JSON service behind the OEWS web app
// (https://data.bls.gov/oes/), which is what the app itself calls. The
// bls.gov file downloads and the public timeseries API both block or
// rate-limit non-browser clients, so this is the dependable path.
//
// Method (see docs/specs/revenue-leak-scorecard-v2-geo-economic-engine.md §3):
//   - National figures are the published hourly median per occupation.
//   - State, territory and metro indexes are the mean, across the nine
//     priced occupations, of area median ÷ national median. Suppressed
//     cells ("-" or "*") are skipped rather than treated as zero.
//   - Region indexes are the employment-weighted mean of their states.
//   - Metro ZIP ranges are curated, not published by BLS, so they are
//     carried forward from the current file; labels and indexes refresh.
//
// Usage:
//   pnpm exec tsx scripts/refresh-oews-benchmarks.ts --year 2026
//   pnpm exec tsx scripts/refresh-oews-benchmarks.ts --latest --dry-run
//
// Behind a corporate proxy, run with NODE_USE_ENV_PROXY=1 so fetch honours
// HTTPS_PROXY. No credentials are involved: the service is public.

import { promises as fs } from "node:fs";
import * as path from "node:path";

import { regionForState, STATE_NAMES } from "../src/lib/roi-calculator/geography/resolve-geography";
import {
  METRO_AREAS,
  NATIONAL_HOURLY_WAGE,
  REGION_WAGE_INDEX,
  STATE_WAGE_INDEX,
  type MetroBenchmarkArea,
} from "../src/lib/roi-calculator/labor/benchmark-data";
import { OCCUPATION_SOC_CODES, type OccupationKey } from "../src/lib/roi-calculator/labor/occupations";

/* ------------------------------------------------------------------------ */
/* Types                                                                     */
/* ------------------------------------------------------------------------ */

/** One area's relevant OEWS cells: per SOC code, employment and hourly median. */
export type AreaExtract = {
  areaCode: string;
  areaName: string;
  /** SOC code → { employment, hourlyMedian }; a missing/suppressed cell is null. */
  occupations: Record<string, { employment: number | null; hourlyMedian: number | null }>;
};

export type OewsExtract = {
  surveyYear: number;
  national: AreaExtract;
  /** Keyed by two-letter postal code (states and territories). */
  states: Record<string, AreaExtract>;
  /** Keyed by metro key from METRO_AREAS. */
  metros: Record<string, AreaExtract>;
};

export type BenchmarkValues = {
  national: Record<OccupationKey, number>;
  states: Record<string, number>;
  regions: Record<string, number>;
  metros: Record<string, { index: number; label: string; areaCode: string; occupationsUsed: number }>;
};

export type MetroConfig = Pick<MetroBenchmarkArea, "key" | "state" | "oewsAreaCode" | "zip3Ranges">;

/* ------------------------------------------------------------------------ */
/* Pure computation                                                          */
/* ------------------------------------------------------------------------ */

const OCCUPATION_KEYS = Object.keys(OCCUPATION_SOC_CODES) as OccupationKey[];
const ALL_OCCUPATIONS_SOC = "00-0000";

function round(value: number, places: number) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

/**
 * Mean of area median ÷ national median across the priced occupations.
 * Returns null when no occupation has both figures.
 */
export function adminOccupationIndex(area: AreaExtract, national: AreaExtract): { index: number | null; used: number } {
  const ratios: number[] = [];
  for (const key of OCCUPATION_KEYS) {
    const soc = OCCUPATION_SOC_CODES[key];
    const local = area.occupations[soc]?.hourlyMedian;
    const base = national.occupations[soc]?.hourlyMedian;
    if (local != null && base != null && base > 0) ratios.push(local / base);
  }
  if (ratios.length === 0) return { index: null, used: 0 };
  return { index: round(ratios.reduce((sum, r) => sum + r, 0) / ratios.length, 3), used: ratios.length };
}

export function computeBenchmarkValues(extract: OewsExtract, metros: MetroConfig[]): BenchmarkValues {
  const national = {} as Record<OccupationKey, number>;
  for (const key of OCCUPATION_KEYS) {
    const median = extract.national.occupations[OCCUPATION_SOC_CODES[key]]?.hourlyMedian;
    if (median == null) throw new Error(`National hourly median missing for ${key} (${OCCUPATION_SOC_CODES[key]}).`);
    national[key] = round(median, 2);
  }

  const states: Record<string, number> = {};
  const employment: Record<string, number> = {};
  for (const [postal, area] of Object.entries(extract.states)) {
    const { index } = adminOccupationIndex(area, extract.national);
    if (index == null) {
      console.warn(`[oews] ${postal}: no usable occupation medians; skipped.`);
      continue;
    }
    states[postal] = index;
    employment[postal] = area.occupations[ALL_OCCUPATIONS_SOC]?.employment ?? 0;
  }

  const regionTotals: Record<string, { weighted: number; weight: number }> = {};
  for (const [postal, index] of Object.entries(states)) {
    const region = regionForState(postal);
    if (!region) continue;
    const weight = employment[postal];
    const bucket = (regionTotals[region] ??= { weighted: 0, weight: 0 });
    bucket.weighted += index * weight;
    bucket.weight += weight;
  }
  const regions: Record<string, number> = {};
  for (const [region, { weighted, weight }] of Object.entries(regionTotals)) {
    if (weight > 0) regions[region] = round(weighted / weight, 3);
  }

  const metroValues: BenchmarkValues["metros"] = {};
  for (const metro of metros) {
    const area = extract.metros[metro.key];
    if (!area) throw new Error(`Metro "${metro.key}" (${metro.oewsAreaCode}) missing from the extract.`);
    const { index, used } = adminOccupationIndex(area, extract.national);
    if (index == null) throw new Error(`Metro "${metro.key}" has no usable occupation medians.`);
    metroValues[metro.key] = { index, label: area.areaName, areaCode: metro.oewsAreaCode, occupationsUsed: used };
  }

  return { national, states, regions, metros: metroValues };
}

/* ------------------------------------------------------------------------ */
/* Rendering                                                                 */
/* ------------------------------------------------------------------------ */

const STATE_ORDER = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY",
  "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
  "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "PR", "VI", "GU",
];

function num(value: number) {
  return String(value);
}

export function renderBenchmarkDataFile(
  values: BenchmarkValues,
  metros: MetroConfig[],
  meta: { surveyYear: number; retrievedOn: string },
): string {
  const sourceDate = `May ${meta.surveyYear}`;
  const ordered = [...STATE_ORDER.filter((s) => s in values.states), ...Object.keys(values.states).filter((s) => !STATE_ORDER.includes(s)).sort()];
  const stateLines: string[] = [];
  for (let i = 0; i < ordered.length; i += 8) {
    stateLines.push("  " + ordered.slice(i, i + 8).map((s) => `${s}: ${num(values.states[s])}`).join(", ") + ",");
  }
  const regionLines = ["Northeast", "Midwest", "South", "West"]
    .filter((r) => r in values.regions)
    .map((r) => `  ${r}: ${num(values.regions[r])},`);
  const nationalLines = OCCUPATION_KEYS.map((k) => `  ${k}: ${values.national[k].toFixed(2)},`);
  const metroLines = metros.map((m) => {
    const v = values.metros[m.key];
    const ranges = `[${m.zip3Ranges.map(([from, to]) => `[${from}, ${to}]`).join(", ")}]`;
    return `  { key: "${m.key}", label: ${JSON.stringify(v.label)}, state: "${m.state}", oewsAreaCode: "${m.oewsAreaCode}", zip3Ranges: ${ranges}, wageIndex: ${num(v.index)} },`;
  });

  return `import type { OccupationKey } from "./occupations";

/**
 * Labor benchmark dataset — BLS Occupational Employment and Wage Statistics
 * (OEWS), ${sourceDate} estimates, retrieved ${meta.retrievedOn} from the OEWS data
 * service behind data.bls.gov (cross-industry, all ownerships).
 *
 * Generated by scripts/refresh-oews-benchmarks.ts — do not edit by hand.
 *
 * National figures are the published hourly *median* for each occupation.
 * State, region and metro figures are indexes against national so the
 * dataset stays small enough to ship to the browser for the live preview.
 * Each index is the mean, across the nine occupations priced below, of that
 * area's hourly median divided by the national hourly median for the same
 * occupation. That is deliberately not the all-occupations relativity: in
 * high-wage markets (DC, San Francisco, New York) administrative and
 * customer-service wages sit well below the all-occupations ratio, and the
 * calculator prices administrative work. Region indexes are the
 * employment-weighted mean of their states' indexes.
 *
 * Refreshing means re-running the script for the new survey year, which
 * rewrites this file and bumps BENCHMARK_VERSION in assumptions.ts —
 * nothing here is fetched at runtime.
 */
export const BENCHMARK_SOURCE = "BLS OEWS ${sourceDate} (hourly medians; state and metro indexes from the nine priced occupations)";
export const BENCHMARK_SOURCE_DATE = "${sourceDate}";

export const NATIONAL_HOURLY_WAGE: Record<OccupationKey, number> = {
${nationalLines.join("\n")}
};

/** Wage level relative to national, by Census region (employment-weighted). */
export const REGION_WAGE_INDEX: Record<string, number> = {
${regionLines.join("\n")}
};

/** Wage level relative to national, by state or territory. */
export const STATE_WAGE_INDEX: Record<string, number> = {
${stateLines.join("\n")}
};

export type MetroBenchmarkArea = {
  key: string;
  label: string;
  state: string;
  /** OEWS area code, for tracing an index back to its source table. */
  oewsAreaCode: string;
  /** Inclusive three-digit ZIP prefix ranges that fall inside the metro. */
  zip3Ranges: [number, number][];
  wageIndex: number;
};

/**
 * Metro coverage is deliberately partial: the fallback hierarchy exists so a
 * ZIP outside these areas prices at the state index and says so. Add areas
 * here (key, state, OEWS area code, ZIP ranges) and re-run the refresh
 * script to fill in the label and index.
 */
export const METRO_AREAS: MetroBenchmarkArea[] = [
${metroLines.join("\n")}
];

export function metroForZip(zip: string): MetroBenchmarkArea | undefined {
  const prefix = Number(zip.slice(0, 3));
  if (!Number.isFinite(prefix)) return undefined;
  return METRO_AREAS.find((area) => area.zip3Ranges.some(([from, to]) => prefix >= from && prefix <= to));
}
`;
}

/** Human-readable drift report against whatever the repo currently ships. */
export function describeChanges(
  values: BenchmarkValues,
  previous: { national: Record<string, number>; states: Record<string, number>; regions: Record<string, number>; metros: Record<string, number> },
  threshold = 0.05,
): string[] {
  const lines: string[] = [];
  for (const key of OCCUPATION_KEYS) {
    const before = previous.national[key];
    const after = values.national[key];
    const pct = before ? ((after / before - 1) * 100).toFixed(1) : "n/a";
    lines.push(`national ${key.padEnd(18)} ${String(before).padStart(7)} → ${String(after).padStart(7)}  (${pct}%)`);
  }
  const compare = (label: string, prev: Record<string, number>, next: Record<string, number>) => {
    for (const [name, after] of Object.entries(next)) {
      const before = prev[name];
      const delta = before == null ? null : after - before;
      const flag = delta != null && Math.abs(delta) > threshold ? "  <-- moved more than " + threshold : before == null ? "  (new)" : "";
      lines.push(`${label} ${name.padEnd(14)} ${String(before ?? "-").padStart(6)} → ${String(after).padStart(6)}${flag}`);
    }
    for (const name of Object.keys(prev)) if (!(name in next)) lines.push(`${label} ${name.padEnd(14)} ${String(prev[name]).padStart(6)} → (dropped)`);
  };
  compare("state   ", previous.states, values.states);
  compare("region  ", previous.regions, values.regions);
  compare("metro   ", previous.metros, Object.fromEntries(Object.entries(values.metros).map(([k, v]) => [k, v.index])));
  return lines;
}

/* ------------------------------------------------------------------------ */
/* Fetching                                                                  */
/* ------------------------------------------------------------------------ */

const SERVICE = "https://data.bls.gov/OESServices";
const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  // The service sits behind bot filtering that rejects bare clients.
  "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
};

type OewsRow = {
  areaCode: string;
  areaName: string;
  formattedOccupationCode: string;
  datatypeCode: string;
  value: string;
};

const DATATYPE_EMPLOYMENT = "01";
const DATATYPE_HOURLY_MEDIAN = "08";

function parseCell(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "-" || trimmed === "*" || trimmed === "#") return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

async function requestJson<T>(url: string, init: RequestInit, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { ...init, headers: HEADERS, signal: AbortSignal.timeout(240_000) });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 5_000 * attempt));
    }
  }
  throw new Error(`OEWS request failed after ${attempts} attempts: ${url} — ${String(lastError)}`);
}

export async function listAvailableYears(): Promise<{ releaseDate: string; description: string }[]> {
  return requestJson(`${SERVICE}/prefilter/year`, { method: "GET" });
}

async function fetchAreaTable(areaCode: string, year: number): Promise<OewsRow[]> {
  return requestJson(`${SERVICE}/prefilter/table`, {
    method: "POST",
    body: JSON.stringify({ areaCode, industryCode: "000000", year: String(year), tableSuffix: "pub", userId: "", pwd: "" }),
  });
}

function toAreaExtract(areaCode: string, rows: OewsRow[]): AreaExtract {
  const wanted = new Set([ALL_OCCUPATIONS_SOC, ...Object.values(OCCUPATION_SOC_CODES)]);
  const occupations: AreaExtract["occupations"] = {};
  for (const row of rows) {
    if (!wanted.has(row.formattedOccupationCode)) continue;
    const cell = (occupations[row.formattedOccupationCode] ??= { employment: null, hourlyMedian: null });
    if (row.datatypeCode === DATATYPE_EMPLOYMENT) cell.employment = parseCell(row.value);
    if (row.datatypeCode === DATATYPE_HOURLY_MEDIAN) cell.hourlyMedian = parseCell(row.value);
  }
  return { areaCode, areaName: rows[0]?.areaName ?? areaCode, occupations };
}

/** OEWS area names that differ from STATE_NAMES. */
const AREA_NAME_ALIASES: Record<string, string> = {
  "Virgin Islands": "VI",
  "U.S. Virgin Islands": "VI",
};

function postalForAreaName(areaName: string): string | undefined {
  if (AREA_NAME_ALIASES[areaName]) return AREA_NAME_ALIASES[areaName];
  return Object.entries(STATE_NAMES).find(([, name]) => name === areaName)?.[0];
}

export async function fetchOewsExtract(
  year: number,
  metros: MetroConfig[],
  log: (message: string) => void = () => {},
): Promise<OewsExtract> {
  const stateList = await requestJson<{ areaCode: string; areaName: string }[]>(`${SERVICE}/combo/state`, { method: "GET" });
  const national = toAreaExtract("0000000", await fetchAreaTable("0000000", year));
  if (Object.keys(national.occupations).length === 0) {
    throw new Error(`No national rows for ${year}. Is May ${year} published? Run with --latest to see available years.`);
  }
  log(`national: ${Object.keys(national.occupations).length} occupations`);

  const states: OewsExtract["states"] = {};
  for (const entry of stateList) {
    if (entry.areaCode === "0000000") continue;
    const postal = postalForAreaName(entry.areaName);
    if (!postal) {
      log(`skip ${entry.areaName}: no postal code mapping`);
      continue;
    }
    states[postal] = toAreaExtract(entry.areaCode, await fetchAreaTable(entry.areaCode, year));
    log(`${postal} ${entry.areaName}`);
    await new Promise((resolve) => setTimeout(resolve, 750));
  }

  const metroExtracts: OewsExtract["metros"] = {};
  for (const metro of metros) {
    metroExtracts[metro.key] = toAreaExtract(metro.oewsAreaCode, await fetchAreaTable(metro.oewsAreaCode, year));
    log(`metro ${metro.key}: ${metroExtracts[metro.key].areaName}`);
    await new Promise((resolve) => setTimeout(resolve, 750));
  }

  return { surveyYear: year, national, states, metros: metroExtracts };
}

/* ------------------------------------------------------------------------ */
/* CLI                                                                       */
/* ------------------------------------------------------------------------ */

export function parseArgs(argv: string[]) {
  const args = { year: undefined as number | undefined, latest: false, dryRun: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--year") args.year = Number(argv[++i]);
    else if (arg.startsWith("--year=")) args.year = Number(arg.slice("--year=".length));
    else if (arg === "--latest") args.latest = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

const USAGE = `Usage: pnpm exec tsx scripts/refresh-oews-benchmarks.ts (--year YYYY | --latest) [--dry-run]

  --year YYYY   OEWS survey year to pull (the May YYYY release).
  --latest      Use the newest release the OEWS service lists.
  --dry-run     Fetch and report the changes without writing any file.
`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || (!args.year && !args.latest)) {
    process.stdout.write(USAGE);
    process.exit(args.help ? 0 : 1);
  }

  const years = await listAvailableYears();
  const available = years.map((y) => Number(y.releaseDate.slice(0, 4))).filter((y) => Number.isFinite(y));
  const year = args.latest ? Math.max(...available) : args.year!;
  if (!available.includes(year)) {
    throw new Error(`May ${year} is not available from the OEWS service. Available: ${available.join(", ")}.`);
  }

  const metros: MetroConfig[] = METRO_AREAS.map(({ key, state, oewsAreaCode, zip3Ranges }) => ({ key, state, oewsAreaCode, zip3Ranges }));
  console.log(`Fetching OEWS May ${year} for national, ${Object.keys(STATE_NAMES).length} states/territories, ${metros.length} metros…`);
  const extract = await fetchOewsExtract(year, metros, (message) => console.log(`  ${message}`));
  const values = computeBenchmarkValues(extract, metros);

  console.log("\nChanges against the current dataset:");
  const previous = {
    national: NATIONAL_HOURLY_WAGE,
    states: STATE_WAGE_INDEX,
    regions: REGION_WAGE_INDEX,
    metros: Object.fromEntries(METRO_AREAS.map((m) => [m.key, m.wageIndex])),
  };
  for (const line of describeChanges(values, previous)) console.log("  " + line);

  const retrievedOn = new Date().toISOString().slice(0, 10);
  const version = `${retrievedOn}-oews-may-${year}`;
  if (args.dryRun) {
    console.log(`\nDry run: no files written. Version would be ${version}.`);
    return;
  }

  const root = path.resolve(__dirname, "..");
  const dataPath = path.join(root, "src/lib/roi-calculator/labor/benchmark-data.ts");
  const assumptionsPath = path.join(root, "src/lib/roi-calculator/assumptions.ts");
  await fs.writeFile(dataPath, renderBenchmarkDataFile(values, metros, { surveyYear: year, retrievedOn }));

  const assumptions = await fs.readFile(assumptionsPath, "utf8");
  const bumped = assumptions.replace(/export const BENCHMARK_VERSION = "[^"]*";/, `export const BENCHMARK_VERSION = "${version}";`);
  if (bumped === assumptions) throw new Error("Could not find BENCHMARK_VERSION in assumptions.ts to bump.");
  await fs.writeFile(assumptionsPath, bumped);

  console.log(`\nWrote ${path.relative(root, dataPath)} and set BENCHMARK_VERSION to ${version}.`);
  console.log("Next: pnpm typecheck && pnpm exec tsx --test test/roi-scorecard-labor.test.ts test/roi-scorecard-overlap.test.ts, then update docs/CHANGELOG.md.");
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
