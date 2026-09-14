import type { OccupationKey } from "./occupations";

/**
 * Labor benchmark dataset — BLS Occupational Employment and Wage Statistics
 * (OEWS), May 2025 estimates, retrieved 2026-09-14 from the OEWS data
 * service behind data.bls.gov (cross-industry, all ownerships).
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
 * Refreshing means replacing this file and bumping BENCHMARK_VERSION in
 * assumptions.ts — nothing here is fetched at runtime.
 */
export const BENCHMARK_SOURCE = "BLS OEWS May 2025 (hourly medians; state and metro indexes from the nine priced occupations)";
export const BENCHMARK_SOURCE_DATE = "May 2025";

export const NATIONAL_HOURLY_WAGE: Record<OccupationKey, number> = {
  receptionist: 18.27,
  customer_service: 21.53,
  admin_support: 22.86,
  dispatcher: 24.20,
  office_clerk: 21.64,
  inside_sales: 33.65,
  billing_clerk: 23.32,
  office_admin_all: 22.81,
  admin_supervisor: 33.41,
};

/** Wage level relative to national, by Census region (employment-weighted). */
export const REGION_WAGE_INDEX: Record<string, number> = {
  Northeast: 1.075,
  Midwest: 0.985,
  South: 0.928,
  West: 1.081,
};

/** Wage level relative to national, by state or territory. */
export const STATE_WAGE_INDEX: Record<string, number> = {
  AL: 0.848, AK: 1.074, AZ: 0.997, AR: 0.834, CA: 1.126, CO: 1.096, CT: 1.089, DE: 1.03,
  DC: 1.236, FL: 0.938, GA: 0.947, HI: 1, ID: 0.942, IL: 1.018, IN: 0.963, IA: 0.961,
  KS: 0.901, KY: 0.891, LA: 0.834, ME: 1.023, MD: 1.015, MA: 1.145, MI: 0.982, MN: 1.089,
  MS: 0.81, MO: 0.943, MT: 0.951, NE: 0.948, NV: 0.952, NH: 1.041, NJ: 1.084, NM: 0.905,
  NY: 1.114, NC: 0.934, ND: 1.027, OH: 0.958, OK: 0.867, OR: 1.065, PA: 0.971, RI: 1.08,
  SC: 0.9, SD: 0.909, TN: 0.935, TX: 0.922, UT: 0.966, VT: 1.053, VA: 0.994, WA: 1.16,
  WV: 0.819, WI: 1.011, WY: 0.938, PR: 0.553, VI: 0.811, GU: 0.653,
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
 * here as they are verified; each entry needs a ZIP3 range and an index.
 */
export const METRO_AREAS: MetroBenchmarkArea[] = [
  { key: "miami", label: "Miami-Fort Lauderdale-West Palm Beach, FL", state: "FL", oewsAreaCode: "0033100", zip3Ranges: [[330, 334]], wageIndex: 0.952 },
  { key: "tampa", label: "Tampa-St. Petersburg-Clearwater, FL", state: "FL", oewsAreaCode: "0045300", zip3Ranges: [[335, 337]], wageIndex: 0.94 },
  { key: "orlando", label: "Orlando-Kissimmee-Sanford, FL", state: "FL", oewsAreaCode: "0036740", zip3Ranges: [[327, 328]], wageIndex: 0.922 },
  { key: "atlanta", label: "Atlanta-Sandy Springs-Roswell, GA", state: "GA", oewsAreaCode: "0012060", zip3Ranges: [[300, 303]], wageIndex: 0.997 },
  { key: "nyc", label: "New York-Newark-Jersey City, NY-NJ", state: "NY", oewsAreaCode: "0035620", zip3Ranges: [[100, 104], [110, 119], [70, 76]], wageIndex: 1.156 },
  { key: "boston", label: "Boston-Cambridge-Newton, MA-NH", state: "MA", oewsAreaCode: "0014460", zip3Ranges: [[17, 24]], wageIndex: 1.164 },
  { key: "philadelphia", label: "Philadelphia-Camden-Wilmington, PA-NJ-DE-MD", state: "PA", oewsAreaCode: "0037980", zip3Ranges: [[190, 191]], wageIndex: 1.03 },
  { key: "dc", label: "Washington-Arlington-Alexandria, DC-VA-MD-WV", state: "DC", oewsAreaCode: "0047900", zip3Ranges: [[200, 205], [220, 223]], wageIndex: 1.114 },
  { key: "chicago", label: "Chicago-Naperville-Elgin, IL-IN", state: "IL", oewsAreaCode: "0016980", zip3Ranges: [[600, 608]], wageIndex: 1.046 },
  { key: "dallas", label: "Dallas-Fort Worth-Arlington, TX", state: "TX", oewsAreaCode: "0019100", zip3Ranges: [[750, 753], [760, 762]], wageIndex: 0.984 },
  { key: "houston", label: "Houston-Pasadena-The Woodlands, TX", state: "TX", oewsAreaCode: "0026420", zip3Ranges: [[770, 775]], wageIndex: 0.941 },
  { key: "phoenix", label: "Phoenix-Mesa-Chandler, AZ", state: "AZ", oewsAreaCode: "0038060", zip3Ranges: [[850, 853]], wageIndex: 1.016 },
  { key: "denver", label: "Denver-Aurora-Centennial, CO", state: "CO", oewsAreaCode: "0019740", zip3Ranges: [[800, 802]], wageIndex: 1.133 },
  { key: "la", label: "Los Angeles-Long Beach-Anaheim, CA", state: "CA", oewsAreaCode: "0031080", zip3Ranges: [[900, 918], [926, 928]], wageIndex: 1.102 },
  { key: "sf", label: "San Francisco-Oakland-Fremont, CA", state: "CA", oewsAreaCode: "0041860", zip3Ranges: [[940, 941], [943, 949]], wageIndex: 1.284 },
  { key: "seattle", label: "Seattle-Tacoma-Bellevue, WA", state: "WA", oewsAreaCode: "0042660", zip3Ranges: [[980, 984]], wageIndex: 1.206 },
];

export function metroForZip(zip: string): MetroBenchmarkArea | undefined {
  const prefix = Number(zip.slice(0, 3));
  if (!Number.isFinite(prefix)) return undefined;
  return METRO_AREAS.find((area) => area.zip3Ranges.some(([from, to]) => prefix >= from && prefix <= to));
}
