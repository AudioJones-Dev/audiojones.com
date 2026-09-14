import type { OccupationKey } from "./occupations";

/**
 * Seeded labor benchmark dataset.
 *
 * National medians are BLS Occupational Employment and Wage Statistics (OEWS)
 * May 2023 national estimates, rounded to the nearest ten cents. State and
 * metro figures are expressed as an index against the national figure rather
 * than as separate wage tables, which keeps the dataset small enough to ship
 * to the browser for the live preview. The indexes are seeded from the OEWS
 * all-occupations mean-wage relativities and must be refreshed by replacing
 * this file (and bumping BENCHMARK_VERSION) — nothing here is live.
 */
export const BENCHMARK_SOURCE = "BLS OEWS (seeded national medians with state and metro wage indexes)";
export const BENCHMARK_SOURCE_DATE = "May 2023";

export const NATIONAL_HOURLY_WAGE: Record<OccupationKey, number> = {
  receptionist: 17.1,
  customer_service: 19.1,
  admin_support: 21.3,
  dispatcher: 22.5,
  office_clerk: 19.7,
  inside_sales: 31.0,
  billing_clerk: 21.5,
  office_admin_all: 21.1,
  admin_supervisor: 30.3,
};

/** Wage level relative to the national figure, by Census region. */
export const REGION_WAGE_INDEX: Record<string, number> = {
  Northeast: 1.09,
  Midwest: 0.96,
  South: 0.94,
  West: 1.07,
};

/** Wage level relative to the national figure, by state. */
export const STATE_WAGE_INDEX: Record<string, number> = {
  AL: 0.9, AK: 1.07, AZ: 0.99, AR: 0.87, CA: 1.15, CO: 1.08, CT: 1.1, DE: 1.03, DC: 1.35,
  FL: 0.93, GA: 0.97, HI: 1.03, ID: 0.91, IL: 1.03, IN: 0.92, IA: 0.94, KS: 0.93, KY: 0.91,
  LA: 0.9, ME: 0.97, MD: 1.08, MA: 1.17, MI: 0.97, MN: 1.05, MS: 0.84, MO: 0.93, MT: 0.92,
  NE: 0.95, NV: 0.96, NH: 1.05, NJ: 1.12, NM: 0.92, NY: 1.14, NC: 0.95, ND: 0.98, OH: 0.95,
  OK: 0.9, OR: 1.04, PA: 0.99, RI: 1.04, SC: 0.91, SD: 0.88, TN: 0.92, TX: 0.97, UT: 0.98,
  VT: 1.0, VA: 1.06, WA: 1.15, WV: 0.87, WI: 0.96, WY: 0.95,
};

export type MetroBenchmarkArea = {
  key: string;
  label: string;
  state: string;
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
  { key: "miami", label: "Miami-Fort Lauderdale-West Palm Beach, FL", state: "FL", zip3Ranges: [[330, 334]], wageIndex: 0.97 },
  { key: "tampa", label: "Tampa-St. Petersburg-Clearwater, FL", state: "FL", zip3Ranges: [[335, 337]], wageIndex: 0.94 },
  { key: "orlando", label: "Orlando-Kissimmee-Sanford, FL", state: "FL", zip3Ranges: [[327, 328]], wageIndex: 0.93 },
  { key: "atlanta", label: "Atlanta-Sandy Springs-Roswell, GA", state: "GA", zip3Ranges: [[300, 303]], wageIndex: 1.02 },
  { key: "nyc", label: "New York-Newark-Jersey City, NY-NJ-PA", state: "NY", zip3Ranges: [[100, 104], [110, 119], [70, 76]], wageIndex: 1.22 },
  { key: "boston", label: "Boston-Cambridge-Nashua, MA-NH", state: "MA", zip3Ranges: [[17, 24]], wageIndex: 1.2 },
  { key: "philadelphia", label: "Philadelphia-Camden-Wilmington, PA-NJ-DE-MD", state: "PA", zip3Ranges: [[190, 191]], wageIndex: 1.06 },
  { key: "dc", label: "Washington-Arlington-Alexandria, DC-VA-MD-WV", state: "DC", zip3Ranges: [[200, 205], [220, 223]], wageIndex: 1.24 },
  { key: "chicago", label: "Chicago-Naperville-Elgin, IL-IN-WI", state: "IL", zip3Ranges: [[600, 608]], wageIndex: 1.07 },
  { key: "dallas", label: "Dallas-Fort Worth-Arlington, TX", state: "TX", zip3Ranges: [[750, 753], [760, 762]], wageIndex: 1.02 },
  { key: "houston", label: "Houston-The Woodlands-Sugar Land, TX", state: "TX", zip3Ranges: [[770, 775]], wageIndex: 1.01 },
  { key: "phoenix", label: "Phoenix-Mesa-Scottsdale, AZ", state: "AZ", zip3Ranges: [[850, 853]], wageIndex: 1.0 },
  { key: "denver", label: "Denver-Aurora-Lakewood, CO", state: "CO", zip3Ranges: [[800, 802]], wageIndex: 1.1 },
  { key: "la", label: "Los Angeles-Long Beach-Anaheim, CA", state: "CA", zip3Ranges: [[900, 918], [926, 928]], wageIndex: 1.14 },
  { key: "sf", label: "San Francisco-Oakland-Hayward, CA", state: "CA", zip3Ranges: [[940, 941], [943, 949]], wageIndex: 1.38 },
  { key: "seattle", label: "Seattle-Tacoma-Bellevue, WA", state: "WA", zip3Ranges: [[980, 984]], wageIndex: 1.2 },
];

export function metroForZip(zip: string): MetroBenchmarkArea | undefined {
  const prefix = Number(zip.slice(0, 3));
  if (!Number.isFinite(prefix)) return undefined;
  return METRO_AREAS.find((area) => area.zip3Ranges.some(([from, to]) => prefix >= from && prefix <= to));
}
