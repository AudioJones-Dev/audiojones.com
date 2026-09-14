import { BENCHMARK_VERSION } from "../assumptions";
import { resolveGeography } from "../geography/resolve-geography";
import type { GeographyResolution, LaborBenchmark } from "../types";
import {
  BENCHMARK_SOURCE,
  BENCHMARK_SOURCE_DATE,
  METRO_AREAS,
  NATIONAL_HOURLY_WAGE,
  REGION_WAGE_INDEX,
  STATE_WAGE_INDEX,
  metroForZip,
} from "./benchmark-data";
import type { BenchmarkLookup, SyncLaborBenchmarkProvider } from "./benchmark-types";
import { OCCUPATION_LABELS, type OccupationKey } from "./occupations";

function isOccupation(key: string): key is OccupationKey {
  return key in NATIONAL_HOURLY_WAGE;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

/**
 * In-memory provider over the seeded dataset. Resolution order is metro →
 * state → region → national, and every step down is recorded on the returned
 * benchmark so the result can say which tier actually priced the work.
 */
export class StaticLaborBenchmarkProvider implements SyncLaborBenchmarkProvider {
  private readonly retrievedAt: string;

  constructor(retrievedAt: string = new Date().toISOString()) {
    this.retrievedAt = retrievedAt;
  }

  getHourlyBenchmarkSync({ zipCode, occupationKey }: BenchmarkLookup): LaborBenchmark {
    const occupation: OccupationKey = isOccupation(occupationKey) ? occupationKey : "office_admin_all";
    const occupationLabel = OCCUPATION_LABELS[occupation];
    const national = NATIONAL_HOURLY_WAGE[occupation];
    const geography = resolveGeography(zipCode);
    const common = {
      occupationKey: occupation,
      occupationLabel,
      source: BENCHMARK_SOURCE,
      sourceDate: BENCHMARK_SOURCE_DATE,
      benchmarkVersion: BENCHMARK_VERSION,
      retrievedAt: this.retrievedAt,
    };

    const metro = geography.resolved ? metroForZip(geography.zipCode) : undefined;
    if (metro) {
      return {
        ...common,
        geographyType: "msa",
        geographyLabel: metro.label,
        hourlyWage: round2(national * metro.wageIndex),
        confidence: "high",
      };
    }

    const stateIndex = geography.state ? STATE_WAGE_INDEX[geography.state] : undefined;
    if (geography.state && stateIndex) {
      return {
        ...common,
        geographyType: "state",
        geographyLabel: `${geography.stateName} statewide`,
        hourlyWage: round2(national * stateIndex),
        confidence: "medium",
        fallbackNote: `Local ${occupationLabel.toLowerCase()} data was unavailable for ZIP ${geography.zipCode}, so this estimate uses the ${geography.stateName} statewide occupational benchmark.`,
      };
    }

    const regionIndex = geography.region ? REGION_WAGE_INDEX[geography.region] : undefined;
    if (geography.region && regionIndex) {
      return {
        ...common,
        geographyType: "region",
        geographyLabel: `${geography.region} region`,
        hourlyWage: round2(national * regionIndex),
        confidence: "low",
        fallbackNote: `State-level ${occupationLabel.toLowerCase()} data was unavailable, so this estimate uses the ${geography.region} regional benchmark.`,
      };
    }

    return {
      ...common,
      geographyType: "national",
      geographyLabel: "United States",
      hourlyWage: national,
      confidence: "low",
      fallbackNote: geography.resolved
        ? `No regional ${occupationLabel.toLowerCase()} data was available, so this estimate uses the national occupational benchmark.`
        : `ZIP ${zipCode || "(blank)"} could not be resolved, so this estimate uses the national occupational benchmark.`,
    };
  }

  async getHourlyBenchmark(input: BenchmarkLookup): Promise<LaborBenchmark> {
    return this.getHourlyBenchmarkSync(input);
  }
}

export const staticLaborBenchmarkProvider = new StaticLaborBenchmarkProvider();

/**
 * The tier the provider will actually price at for this ZIP, so the result's
 * geography never claims a finer benchmark than the scopes used. A ZIP that
 * resolves to a state with no wage index (Puerto Rico, for instance) reports
 * the national tier, not "state".
 */
export function resolveBenchmarkGeography(zipCode: string): GeographyResolution {
  const geography = resolveGeography(zipCode);
  if (!geography.resolved) return geography;
  const metro = metroForZip(geography.zipCode);
  if (metro) {
    return { ...geography, tier: "msa", msaKey: metro.key, msaLabel: metro.label, label: metro.label };
  }
  if (geography.state && STATE_WAGE_INDEX[geography.state]) return { ...geography, tier: "state" };
  if (geography.region && REGION_WAGE_INDEX[geography.region]) return { ...geography, tier: "region" };
  return { ...geography, tier: "national" };
}

export const METRO_AREA_COUNT = METRO_AREAS.length;
