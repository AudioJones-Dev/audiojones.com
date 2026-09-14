import type { GeographyResolution } from "../types";

/**
 * ZIP → state via the first three digits (USPS sectional-center prefixes).
 * Ranges are inclusive. Metro resolution lives in the benchmark dataset; this
 * file only answers "which state and Census region is this ZIP in", which is
 * all the fallback hierarchy needs when metro data is missing.
 */
const ZIP3_STATE_RANGES: [number, number, string][] = [
  [5, 5, "NY"],
  [6, 7, "PR"],
  [8, 8, "VI"],
  [9, 9, "PR"],
  [10, 27, "MA"],
  [28, 29, "RI"],
  [30, 38, "NH"],
  [39, 49, "ME"],
  [50, 59, "VT"],
  [60, 69, "CT"],
  [70, 89, "NJ"],
  [100, 149, "NY"],
  [150, 196, "PA"],
  [197, 199, "DE"],
  [200, 205, "DC"],
  [206, 219, "MD"],
  [220, 246, "VA"],
  [247, 268, "WV"],
  [270, 289, "NC"],
  [290, 299, "SC"],
  [300, 319, "GA"],
  [320, 339, "FL"],
  [341, 349, "FL"],
  [350, 369, "AL"],
  [370, 385, "TN"],
  [386, 397, "MS"],
  [398, 399, "GA"],
  [400, 427, "KY"],
  [430, 459, "OH"],
  [460, 479, "IN"],
  [480, 499, "MI"],
  [500, 528, "IA"],
  [530, 549, "WI"],
  [550, 567, "MN"],
  [569, 569, "DC"],
  [570, 577, "SD"],
  [580, 588, "ND"],
  [590, 599, "MT"],
  [600, 629, "IL"],
  [630, 658, "MO"],
  [660, 679, "KS"],
  [680, 693, "NE"],
  [700, 714, "LA"],
  [716, 729, "AR"],
  [730, 749, "OK"],
  [750, 799, "TX"],
  [800, 816, "CO"],
  [820, 831, "WY"],
  [832, 838, "ID"],
  [840, 847, "UT"],
  [850, 865, "AZ"],
  [870, 884, "NM"],
  [885, 885, "TX"],
  [889, 898, "NV"],
  [900, 961, "CA"],
  [967, 968, "HI"],
  [969, 969, "GU"],
  [970, 979, "OR"],
  [980, 994, "WA"],
  [995, 999, "AK"],
];

export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado",
  CT: "Connecticut", DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia",
  GU: "Guam", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky",
  LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota",
  OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", PR: "Puerto Rico", RI: "Rhode Island",
  SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", VI: "U.S. Virgin Islands", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

const CENSUS_REGIONS: Record<string, string[]> = {
  Northeast: ["CT", "ME", "MA", "NH", "RI", "VT", "NJ", "NY", "PA"],
  Midwest: ["IL", "IN", "MI", "OH", "WI", "IA", "KS", "MN", "MO", "NE", "ND", "SD"],
  South: ["DE", "DC", "FL", "GA", "MD", "NC", "SC", "VA", "WV", "AL", "KY", "MS", "TN", "AR", "LA", "OK", "TX"],
  West: ["AZ", "CO", "ID", "MT", "NV", "NM", "UT", "WY", "AK", "CA", "HI", "OR", "WA"],
};

export function regionForState(state: string | undefined): string | undefined {
  if (!state) return undefined;
  for (const [region, states] of Object.entries(CENSUS_REGIONS)) {
    if (states.includes(state)) return region;
  }
  return undefined;
}

export function normalizeZip(zipCode: string): string | null {
  const digits = zipCode.trim().slice(0, 5);
  return /^\d{5}$/.test(digits) ? digits : null;
}

export function stateForZip(zipCode: string): string | undefined {
  const zip = normalizeZip(zipCode);
  if (!zip) return undefined;
  const prefix = Number(zip.slice(0, 3));
  const hit = ZIP3_STATE_RANGES.find(([from, to]) => prefix >= from && prefix <= to);
  return hit?.[2];
}

/**
 * The base resolution: ZIP → state → region. The benchmark provider upgrades
 * `tier`, `msaKey` and `label` when it finds metro data for the ZIP.
 */
export function resolveGeography(zipCode: string): GeographyResolution {
  const zip = normalizeZip(zipCode) ?? zipCode.trim();
  const state = stateForZip(zip);
  const region = regionForState(state);
  if (!state) {
    return {
      zipCode: zip,
      resolved: false,
      tier: "national",
      label: "United States (ZIP not recognised)",
    };
  }
  return {
    zipCode: zip,
    resolved: true,
    state,
    stateName: STATE_NAMES[state] ?? state,
    region,
    tier: "state",
    label: STATE_NAMES[state] ?? state,
  };
}
