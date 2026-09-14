import { regionForState } from "../geography/resolve-geography";
import type { MetroBenchmarkArea } from "./benchmark-data";
import { OCCUPATION_SOC_CODES, type OccupationKey } from "./occupations";

/**
 * Pure half of the OEWS benchmark refresh: index math, file rendering and
 * argument parsing, with no network or filesystem access. The CLI that
 * fetches from BLS and writes files lives in scripts/refresh-oews-benchmarks.ts;
 * this module sits under src so the unit tests (and the deploy build's type
 * check, which never sees scripts/) can import it.
 */

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
    const totalEmployment = area.occupations[ALL_OCCUPATIONS_SOC]?.employment;
    if (regionForState(postal) && !(totalEmployment != null && totalEmployment > 0)) {
      throw new Error(`${postal}: all-occupations employment is missing or non-positive, so it cannot weight its region.`);
    }
    employment[postal] = totalEmployment ?? 0;
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

export function parseArgs(argv: string[]) {
  const args = { year: undefined as number | undefined, latest: false, dryRun: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--year") {
      args.year = parseYear(argv[i + 1]);
      i += 1;
    } else if (arg.startsWith("--year=")) args.year = parseYear(arg.slice("--year=".length));
    else if (arg === "--latest") args.latest = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (args.year !== undefined && args.latest) throw new Error("Use either --year YYYY or --latest, not both.");
  return args;
}

function parseYear(value: string | undefined): number {
  if (value === undefined || !/^\d{4}$/.test(value)) {
    throw new Error(`--year requires a four-digit survey year, got ${value === undefined ? "nothing" : JSON.stringify(value)}.`);
  }
  return Number(value);
}
