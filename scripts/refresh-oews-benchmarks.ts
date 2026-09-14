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
// Method (index math lives in src/lib/roi-calculator/labor/oews-refresh.ts;
// see docs/specs/revenue-leak-scorecard-v2-geo-economic-engine.md §3):
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

import { STATE_NAMES } from "../src/lib/roi-calculator/geography/resolve-geography";
import {
  METRO_AREAS,
  NATIONAL_HOURLY_WAGE,
  REGION_WAGE_INDEX,
  STATE_WAGE_INDEX,
} from "../src/lib/roi-calculator/labor/benchmark-data";
import { OCCUPATION_SOC_CODES } from "../src/lib/roi-calculator/labor/occupations";
import {
  bumpBenchmarkVersion,
  computeBenchmarkValues,
  describeChanges,
  parseArgs,
  renderBenchmarkDataFile,
  type AreaExtract,
  type MetroConfig,
  type OewsExtract,
} from "../src/lib/roi-calculator/labor/oews-refresh";

/* ------------------------------------------------------------------------ */
/* Fetching                                                                  */
/* ------------------------------------------------------------------------ */

const ALL_OCCUPATIONS_SOC = "00-0000";
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

  // Validate the version bump before touching either file so a failure here
  // never leaves new benchmark data paired with the old BENCHMARK_VERSION.
  const bumped = bumpBenchmarkVersion(await fs.readFile(assumptionsPath, "utf8"), version);

  await fs.writeFile(dataPath, renderBenchmarkDataFile(values, metros, { surveyYear: year, retrievedOn }));
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
