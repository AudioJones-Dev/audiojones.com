import assert from "node:assert/strict";
import test from "node:test";

import {
  adminOccupationIndex,
  bumpBenchmarkVersion,
  computeBenchmarkValues,
  describeChanges,
  parseArgs,
  renderBenchmarkDataFile,
  type AreaExtract,
  type MetroConfig,
  type OewsExtract,
} from "../src/lib/roi-calculator/labor/oews-refresh";
import { OCCUPATION_SOC_CODES } from "../src/lib/roi-calculator/labor/occupations";

const SOC = Object.values(OCCUPATION_SOC_CODES);

function area(areaCode: string, areaName: string, ratio: number, employment: number, overrides: Record<string, number | null> = {}): AreaExtract {
  const occupations: AreaExtract["occupations"] = { "00-0000": { employment, hourlyMedian: 25 * ratio } };
  SOC.forEach((code, i) => {
    const base = 20 + i;
    occupations[code] = { employment: 1000, hourlyMedian: code in overrides ? overrides[code] : base * ratio };
  });
  return { areaCode, areaName, occupations };
}

const national = area("0000000", "National", 1, 100_000);
const metros: MetroConfig[] = [{ key: "miami", state: "FL", oewsAreaCode: "0033100", zip3Ranges: [[330, 334]] }];
const extract: OewsExtract = {
  surveyYear: 2026,
  national,
  states: {
    FL: area("1200000", "Florida", 0.94, 9_000),
    MA: area("2500000", "Massachusetts", 1.16, 3_000),
    NY: area("3600000", "New York", 1.1, 9_000),
    PR: area("7200000", "Puerto Rico", 0.55, 900),
  },
  metros: { miami: area("0033100", "Miami-Fort Lauderdale-West Palm Beach, FL", 0.95, 2_500, { "43-5032": null }) },
};

test("national medians are the published hourly medians, rounded to cents", () => {
  const values = computeBenchmarkValues(extract, metros);
  assert.equal(values.national.receptionist, 20);
  assert.equal(values.national.admin_supervisor, 28);
});

test("an area index is the mean of per-occupation median ratios, skipping suppressed cells", () => {
  const values = computeBenchmarkValues(extract, metros);
  assert.equal(values.states.FL, 0.94);
  assert.equal(values.states.PR, 0.55);
  const miami = adminOccupationIndex(extract.metros.miami, national);
  assert.equal(miami.used, SOC.length - 1, "the suppressed dispatcher cell is skipped, not counted as zero");
  assert.equal(miami.index, 0.95);
  assert.equal(values.metros.miami.label, "Miami-Fort Lauderdale-West Palm Beach, FL");
  assert.equal(values.metros.miami.areaCode, "0033100");
});

test("region indexes are employment-weighted means of their states", () => {
  const values = computeBenchmarkValues(extract, metros);
  // Northeast: MA (1.16, weight 3000) and NY (1.10, weight 9000) → 1.115
  assert.equal(values.regions.Northeast, 1.115);
  assert.equal(values.regions.South, 0.94, "Florida is the only southern state in the fixture");
  assert.equal(values.regions.West, undefined, "no western states means no western index");
});

test("a region state with missing or zero employment fails instead of weighting to zero", () => {
  const noEmployment = area("2500000", "Massachusetts", 1.16, 3_000);
  noEmployment.occupations["00-0000"] = { employment: null, hourlyMedian: 25 };
  assert.throws(
    () => computeBenchmarkValues({ ...extract, states: { ...extract.states, MA: noEmployment } }, metros),
    /MA: all-occupations employment is missing or non-positive/,
  );
  const zeroEmployment = area("3600000", "New York", 1.1, 0);
  assert.throws(() => computeBenchmarkValues({ ...extract, states: { ...extract.states, NY: zeroEmployment } }, metros), /NY: all-occupations employment/);
});

test("a region state with no usable medians fails even when its employment is also missing", () => {
  const noMedians: AreaExtract = { areaCode: "2500000", areaName: "Massachusetts", occupations: { "00-0000": { employment: null, hourlyMedian: null } } };
  assert.throws(
    () => computeBenchmarkValues({ ...extract, states: { ...extract.states, MA: noMedians } }, metros),
    /MA: no usable occupation medians/,
  );
  const noMediansWithEmployment: AreaExtract = { ...noMedians, occupations: { "00-0000": { employment: 3_000, hourlyMedian: null } } };
  assert.throws(() => computeBenchmarkValues({ ...extract, states: { ...extract.states, MA: noMediansWithEmployment } }, metros), /MA: no usable occupation medians/);
});

test("a territory outside every Census region may lack employment without failing", () => {
  const territory = area("7200000", "Puerto Rico", 0.55, 900);
  territory.occupations["00-0000"] = { employment: null, hourlyMedian: 14 };
  const values = computeBenchmarkValues({ ...extract, states: { ...extract.states, PR: territory } }, metros);
  assert.equal(values.states.PR, 0.55);
});

test("an area with no usable medians is skipped instead of poisoning the table", () => {
  const empty: AreaExtract = { areaCode: "6600000", areaName: "Guam", occupations: { "00-0000": { employment: 10, hourlyMedian: null } } };
  const values = computeBenchmarkValues({ ...extract, states: { ...extract.states, GU: empty } }, metros);
  assert.equal(values.states.GU, undefined);
  assert.equal(values.states.FL, 0.94);
});

test("a missing national median fails loudly rather than producing a partial file", () => {
  const broken: OewsExtract = { ...extract, national: { ...national, occupations: { ...national.occupations, "43-4171": { employment: 1, hourlyMedian: null } } } };
  assert.throws(() => computeBenchmarkValues(broken, metros), /National hourly median missing for receptionist/);
});

test("the rendered file carries the survey date, version inputs, and every table", () => {
  const values = computeBenchmarkValues(extract, metros);
  const file = renderBenchmarkDataFile(values, metros, { surveyYear: 2026, retrievedOn: "2027-04-01" });
  assert.match(file, /BENCHMARK_SOURCE_DATE = "May 2026"/);
  assert.match(file, /retrieved 2027-04-01/);
  assert.match(file, /receptionist: 20\.00,/);
  assert.match(file, /FL: 0\.94/);
  assert.match(file, /PR: 0\.55/);
  assert.match(file, /Northeast: 1\.115/);
  assert.match(file, /key: "miami", label: "Miami-Fort Lauderdale-West Palm Beach, FL", state: "FL", oewsAreaCode: "0033100", zip3Ranges: \[\[330, 334\]\], wageIndex: 0\.95/);
  assert.match(file, /export function metroForZip/);
});

test("the change report flags moves above the threshold and new areas", () => {
  const values = computeBenchmarkValues(extract, metros);
  const lines = describeChanges(values, { national: { receptionist: 18.27 }, states: { FL: 0.938, MA: 1.25 }, regions: {}, metros: { miami: 0.952 } });
  assert.ok(lines.some((l) => l.includes("MA") && l.includes("moved more than")));
  assert.ok(lines.some((l) => l.includes("FL") && !l.includes("moved more than")));
  assert.ok(lines.some((l) => l.includes("PR") && l.includes("(new)")));
});

test("argument parsing accepts the documented forms and rejects unknown flags", () => {
  assert.deepEqual(parseArgs(["--year", "2026", "--dry-run"]), { year: 2026, latest: false, dryRun: true, help: false });
  assert.deepEqual(parseArgs(["--year=2027"]).year, 2027);
  assert.equal(parseArgs(["--latest"]).latest, true);
  assert.throws(() => parseArgs(["--bogus"]), /Unknown argument/);
});

test("argument parsing rejects a missing, malformed or option-shaped --year value", () => {
  assert.throws(() => parseArgs(["--year"]), /four-digit survey year, got nothing/);
  assert.throws(() => parseArgs(["--year="]), /four-digit survey year/);
  assert.throws(() => parseArgs(["--year", "--dry-run"]), /four-digit survey year, got "--dry-run"/);
  assert.throws(() => parseArgs(["--year", "26"]), /four-digit survey year/);
});

test("argument parsing rejects --year combined with --latest", () => {
  assert.throws(() => parseArgs(["--year", "2026", "--latest"]), /either --year YYYY or --latest/);
  assert.throws(() => parseArgs(["--latest", "--year=2026"]), /either --year YYYY or --latest/);
});

test("the version bump rewrites the declaration, tolerates a same-version rerun and rejects a missing one", () => {
  const source = 'export const FOO = 1;\nexport const BENCHMARK_VERSION = "2026-09-14-oews-may-2025";\n';
  assert.equal(bumpBenchmarkVersion(source, "2027-04-01-oews-may-2026"), source.replace("2026-09-14-oews-may-2025", "2027-04-01-oews-may-2026"));
  assert.equal(bumpBenchmarkVersion(source, "2026-09-14-oews-may-2025"), source, "same-day rerun is a no-op, not an error");
  assert.throws(() => bumpBenchmarkVersion('export const FOO = 1;\n', "2027-04-01-oews-may-2026"), /Could not find BENCHMARK_VERSION/);
});
