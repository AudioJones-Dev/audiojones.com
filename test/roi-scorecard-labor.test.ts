import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_BURDEN_MULTIPLIER, SCOPE_RECOVERABILITY_PRESETS, WEEKS_PER_YEAR } from "../src/lib/roi-calculator/assumptions";
import { resolveGeography, stateForZip } from "../src/lib/roi-calculator/geography/resolve-geography";
import { NATIONAL_HOURLY_WAGE, STATE_WAGE_INDEX } from "../src/lib/roi-calculator/labor/benchmark-data";
import { StaticLaborBenchmarkProvider, resolveBenchmarkGeography } from "../src/lib/roi-calculator/labor/benchmark-provider";
import {
  addressableHours,
  calculateLaborScope,
  calculateOwnerCapacity,
  loadedHourlyCost,
} from "../src/lib/roi-calculator/labor/labor-calculations";
import { SCOPE_OCCUPATIONS } from "../src/lib/roi-calculator/labor/occupations";

const provider = new StaticLaborBenchmarkProvider("2026-09-14T00:00:00.000Z");

test("ZIP codes resolve to state and Census region", () => {
  assert.equal(stateForZip("33131"), "FL");
  assert.equal(stateForZip("10001"), "NY");
  assert.equal(stateForZip("98101"), "WA");
  assert.equal(resolveGeography("33131").region, "South");
  assert.equal(resolveGeography("abcde").resolved, false);
  assert.equal(resolveGeography("").tier, "national");
});

test("a metro ZIP prices at the metro tier with provenance attached", () => {
  const benchmark = provider.getHourlyBenchmarkSync({ zipCode: "33131", occupationKey: "receptionist" });
  assert.equal(benchmark.geographyType, "msa");
  assert.match(benchmark.geographyLabel, /Miami/);
  assert.equal(benchmark.confidence, "high");
  assert.equal(benchmark.fallbackNote, undefined);
  assert.ok(benchmark.source.length > 0);
  assert.ok(benchmark.sourceDate.length > 0);
  assert.ok(benchmark.benchmarkVersion.length > 0);
  assert.equal(benchmark.retrievedAt, "2026-09-14T00:00:00.000Z");
  assert.equal(resolveBenchmarkGeography("33131").tier, "msa");
});

test("a non-metro ZIP falls back to the statewide benchmark and discloses it", () => {
  // Tallahassee: Florida, no metro entry in the seeded dataset.
  const benchmark = provider.getHourlyBenchmarkSync({ zipCode: "32301", occupationKey: "dispatcher" });
  assert.equal(benchmark.geographyType, "state");
  assert.equal(benchmark.confidence, "medium");
  assert.match(benchmark.fallbackNote ?? "", /Florida statewide/);
  assert.equal(benchmark.hourlyWage, Math.round(NATIONAL_HOURLY_WAGE.dispatcher * STATE_WAGE_INDEX.FL * 100) / 100);
});

test("an unresolvable ZIP falls back to the national benchmark instead of failing", () => {
  const benchmark = provider.getHourlyBenchmarkSync({ zipCode: "00000", occupationKey: "office_clerk" });
  assert.equal(benchmark.geographyType, "national");
  assert.equal(benchmark.hourlyWage, NATIONAL_HOURLY_WAGE.office_clerk);
  assert.equal(benchmark.confidence, "low");
  assert.match(benchmark.fallbackNote ?? "", /national/);
});

test("location changes the labor economics", () => {
  const sf = provider.getHourlyBenchmarkSync({ zipCode: "94103", occupationKey: "receptionist" });
  const ms = provider.getHourlyBenchmarkSync({ zipCode: "39201", occupationKey: "receptionist" });
  assert.ok(sf.hourlyWage > ms.hourlyWage);
});

test("an unknown occupation key degrades to the all-admin benchmark", () => {
  const benchmark = provider.getHourlyBenchmarkSync({ zipCode: "33131", occupationKey: "not-a-job" });
  assert.equal(benchmark.occupationKey, "office_admin_all");
});

test("the async provider contract returns the same benchmark as the sync path", async () => {
  const sync = provider.getHourlyBenchmarkSync({ zipCode: "60601", occupationKey: "billing_clerk" });
  const async = await provider.getHourlyBenchmark({ zipCode: "60601", occupationKey: "billing_clerk" });
  assert.deepEqual(async, sync);
});

test("loaded labor cost is wage times the burden multiplier, bounded", () => {
  assert.equal(loadedHourlyCost(20, 1.35), 27);
  assert.equal(loadedHourlyCost(20, 0.5), 20, "a multiplier below 1 is clamped to 1");
  assert.equal(loadedHourlyCost(20, 9), 40, "a multiplier above 2 is clamped to 2");
  assert.equal(loadedHourlyCost(20, Number.NaN), 20 * DEFAULT_BURDEN_MULTIPLIER);
});

test("recoverability turns hours spent into addressable hours, never more", () => {
  assert.ok(Math.abs(addressableHours(12, 70) - 8.4) < 1e-9);
  assert.equal(addressableHours(12, 0), 0);
  assert.equal(addressableHours(12, 250), 12, "recoverability is capped at 100%");
  assert.equal(addressableHours(-5, 50), 0, "negative hours contribute nothing");
});

test("every scope maps to an occupational proxy the provider can price", () => {
  for (const occupation of Object.values(SCOPE_OCCUPATIONS)) {
    assert.ok(occupation in NATIONAL_HOURLY_WAGE, `${occupation} has no national wage`);
  }
});

test("a scope entry uses its preset addressability unless overridden", () => {
  const benchmark = provider.getHourlyBenchmarkSync({ zipCode: "33131", occupationKey: "receptionist" });
  const preset = calculateLaborScope({ scope: "calls", hoursPerWeek: 10, workerType: "employee" }, benchmark, 1.35);
  assert.equal(preset.recoverabilityPercent, SCOPE_RECOVERABILITY_PRESETS.calls);
  assert.equal(preset.annualCurrentValue, 10 * preset.loadedHourlyCost * WEEKS_PER_YEAR);
  assert.equal(preset.annualAddressableValue, 7 * preset.loadedHourlyCost * WEEKS_PER_YEAR);

  const overridden = calculateLaborScope(
    { scope: "calls", hoursPerWeek: 10, workerType: "employee", recoverabilityPercent: 20 },
    benchmark,
    1.35,
  );
  assert.equal(overridden.recoverabilityPercent, 20);
  assert.equal(overridden.addressableHoursPerWeek, 2);
});

test("owner capacity reports replacement cost and founder value separately", () => {
  const benchmark = provider.getHourlyBenchmarkSync({ zipCode: "33131", occupationKey: "inside_sales" });
  const scope = calculateLaborScope({ scope: "quote_followup", hoursPerWeek: 5, workerType: "owner" }, benchmark, 1.35);
  const owner = calculateOwnerCapacity([scope], 200);

  assert.equal(owner.hoursPerWeek, 5);
  assert.equal(owner.replacementCostValue, scope.annualAddressableValue);
  assert.equal(owner.founderCapacityValue, scope.addressableHoursPerWeek * 200 * WEEKS_PER_YEAR);
  assert.ok((owner.founderCapacityValue ?? 0) > owner.replacementCostValue, "founder value uses the owner's rate, not the market's");
});

test("owner capacity with no founder rate omits the founder reading", () => {
  const benchmark = provider.getHourlyBenchmarkSync({ zipCode: "33131", occupationKey: "inside_sales" });
  const scope = calculateLaborScope({ scope: "quote_followup", hoursPerWeek: 5, workerType: "owner" }, benchmark, 1.35);
  assert.equal(calculateOwnerCapacity([scope], undefined).founderCapacityValue, undefined);
  assert.equal(calculateOwnerCapacity([scope], 0).founderCapacityValue, undefined);
});

test("zero addressability yields zero owner recovery", () => {
  const benchmark = provider.getHourlyBenchmarkSync({ zipCode: "33131", occupationKey: "inside_sales" });
  const scope = calculateLaborScope(
    { scope: "quote_followup", hoursPerWeek: 5, workerType: "owner", recoverabilityPercent: 0 },
    benchmark,
    1.35,
  );
  const owner = calculateOwnerCapacity([scope], 200);
  assert.equal(owner.replacementCostValue, 0);
  assert.equal(owner.founderCapacityValue, 0);
  assert.equal(owner.hoursPerWeek, 5, "the hours are still reported even when none are addressable");
});
