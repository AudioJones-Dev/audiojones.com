import {
  DEFAULT_BURDEN_MULTIPLIER,
  MAX_BURDEN_MULTIPLIER,
  MIN_BURDEN_MULTIPLIER,
  SCOPE_LABELS,
  SCOPE_RECOVERABILITY_PRESETS,
  WEEKS_PER_YEAR,
} from "../assumptions";
import type { LaborBenchmark, LaborScopeEntry, LaborScopeResult } from "../types";
import { SCOPE_OCCUPATIONS } from "./occupations";

export function clampPercent(value: number | undefined, fallback: number) {
  const candidate = value == null || !Number.isFinite(value) ? fallback : value;
  return Math.min(100, Math.max(0, candidate));
}

export function clampBurden(multiplier: number | undefined) {
  const candidate = multiplier == null || !Number.isFinite(multiplier) ? DEFAULT_BURDEN_MULTIPLIER : multiplier;
  return Math.min(MAX_BURDEN_MULTIPLIER, Math.max(MIN_BURDEN_MULTIPLIER, candidate));
}

export function loadedHourlyCost(hourlyWage: number, burdenMultiplier: number) {
  return Math.round(hourlyWage * clampBurden(burdenMultiplier) * 100) / 100;
}

export function addressableHours(hoursPerWeek: number, recoverabilityPercent: number) {
  return Math.max(0, hoursPerWeek) * (clampPercent(recoverabilityPercent, 0) / 100);
}

export function occupationForScope(entry: LaborScopeEntry) {
  return SCOPE_OCCUPATIONS[entry.scope] ?? SCOPE_OCCUPATIONS.custom;
}

/**
 * Prices one scope entry: current annual value of the hours, and the share a
 * system could take over. Pure — the benchmark is looked up by the caller so
 * the same function serves the sync client preview and the async server path.
 */
export function calculateLaborScope(
  entry: LaborScopeEntry,
  benchmark: LaborBenchmark,
  burdenMultiplier: number,
): LaborScopeResult {
  const recoverabilityPercent = clampPercent(
    entry.recoverabilityPercent,
    SCOPE_RECOVERABILITY_PRESETS[entry.scope] ?? SCOPE_RECOVERABILITY_PRESETS.custom,
  );
  const hoursPerWeek = Math.max(0, entry.hoursPerWeek);
  const cost = loadedHourlyCost(benchmark.hourlyWage, burdenMultiplier);
  const addressable = addressableHours(hoursPerWeek, recoverabilityPercent);
  return {
    scope: entry.scope,
    scopeLabel: SCOPE_LABELS[entry.scope] ?? SCOPE_LABELS.custom,
    workerType: entry.workerType,
    hoursPerWeek,
    recoverabilityPercent,
    addressableHoursPerWeek: addressable,
    benchmark: { ...benchmark, loadedHourlyCost: cost },
    loadedHourlyCost: cost,
    annualCurrentValue: hoursPerWeek * cost * WEEKS_PER_YEAR,
    annualAddressableValue: addressable * cost * WEEKS_PER_YEAR,
  };
}

/**
 * Owner hours are priced two ways. Replacement cost is what the local market
 * charges for an employee to do the same work; founder capacity is what the
 * owner says an hour is worth at revenue work. Only replacement cost enters
 * the combined figure — founder capacity is a reading, not a saving.
 */
export function calculateOwnerCapacity(
  ownerScopes: LaborScopeResult[],
  ownerHourlyValue: number | undefined,
) {
  const hoursPerWeek = ownerScopes.reduce((sum, scope) => sum + scope.hoursPerWeek, 0);
  const addressableHoursPerWeek = ownerScopes.reduce((sum, scope) => sum + scope.addressableHoursPerWeek, 0);
  const replacementCostValue = ownerScopes.reduce((sum, scope) => sum + scope.annualAddressableValue, 0);
  const founderCapacityValue =
    ownerHourlyValue != null && ownerHourlyValue > 0
      ? addressableHoursPerWeek * ownerHourlyValue * WEEKS_PER_YEAR
      : undefined;
  return { hoursPerWeek, addressableHoursPerWeek, replacementCostValue, founderCapacityValue };
}
