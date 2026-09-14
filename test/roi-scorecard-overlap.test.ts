import assert from "node:assert/strict";
import test from "node:test";

import { OPPORTUNITY_RANGE_HIGH_FACTOR, OPPORTUNITY_RANGE_LOW_FACTOR } from "../src/lib/roi-calculator/assumptions";
import { staticLaborBenchmarkProvider } from "../src/lib/roi-calculator/labor/benchmark-provider";
import { parseRoiLead, revenueLeakScorecardInputSchema, roiLeadSchema } from "../src/lib/roi-calculator/roi-calculator-schema";
import { calculateRoiResult } from "../src/lib/roi-calculator/calculations";
import {
  allocateOpportunityPool,
  calculateRevenueLeakScorecard,
  resolveScorecardContext,
  resolveScorecardContextSync,
} from "../src/lib/roi-calculator/scorecard";
import type { RevenueLeakScorecardInput, RoiCalculatorInput } from "../src/lib/roi-calculator/types";

const baseInput: RevenueLeakScorecardInput = {
  calculationVersion: "v2-geo-economic",
  zipCode: "33131",
  industry: "home-services",
  companySize: "6-20",
  monthlyRevenue: "100k-500k",
  laborScopes: [{ scope: "calls", hoursPerWeek: 10, workerType: "employee" }],
  burdenMultiplier: 1.35,
  service: { name: "HVAC replacement", averageSaleValue: 10000, grossProfitPerSale: 4000 },
  leakage: {
    monthlyInboundOpportunities: 100,
    currentCloseRate: 30,
    missedCallsPerMonth: 10,
    afterHoursCallsPerMonth: 5,
    unfollowedQuotesPerMonth: 5,
    leadsAffectedPerMonth: 20,
    inputBasis: "measured",
  },
  errorsPerMonth: 0,
  costPerError: 0,
  preventableErrorRate: 0,
  avoidedHireMonthlyCost: 0,
  headcountAvoidanceRate: 0,
  implementationBudget: 12000,
  timelineExpectation: "quarter",
  internalOwner: "founder-led",
  processClarity: 4,
  dataQuality: 4,
  sopMaturity: 3,
  toolFragmentation: 2,
  teamAdoption: 4,
  name: "Test",
  email: "test@example.com",
  company: "Test Co",
};

function score(input: RevenueLeakScorecardInput) {
  return calculateRevenueLeakScorecard(input, resolveScorecardContextSync(input, staticLaborBenchmarkProvider));
}

test("owner hours are priced in owner capacity and excluded from labor capacity", () => {
  const teamOnly = score(baseInput);
  const withOwner = score({
    ...baseInput,
    laborScopes: [...baseInput.laborScopes, { scope: "quote_followup", hoursPerWeek: 6, workerType: "owner" }],
  });

  assert.equal(withOwner.laborCapacity.hoursPerWeek, teamOnly.laborCapacity.hoursPerWeek);
  assert.equal(withOwner.laborCapacity.annualAddressableLaborValue, teamOnly.laborCapacity.annualAddressableLaborValue);
  assert.equal(withOwner.ownerCapacity.hoursPerWeek, 6);
  assert.ok(withOwner.ownerCapacity.replacementCostValue > 0);
  assert.ok(withOwner.overlapControls.some((note) => /Owner-performed hours/.test(note)));
});

test("founder-capacity value is reported but never added to the combined figure", () => {
  const ownerInput: RevenueLeakScorecardInput = {
    ...baseInput,
    laborScopes: [{ scope: "quote_followup", hoursPerWeek: 6, workerType: "owner" }],
  };
  const withoutRate = score(ownerInput);
  const withRate = score({ ...ownerInput, ownerHourlyValue: 500 });

  assert.equal(withoutRate.ownerCapacity.founderCapacityValue, undefined);
  assert.ok((withRate.ownerCapacity.founderCapacityValue ?? 0) > withRate.ownerCapacity.replacementCostValue);
  assert.equal(withRate.modeledOpportunityRange.base, withoutRate.modeledOpportunityRange.base);
});

test("missed, after-hours, quote and delayed-response leads share one monthly pool", () => {
  const pool = allocateOpportunityPool({
    monthlyInboundOpportunities: 20,
    currentCloseRate: 30,
    missedCallsPerMonth: 10,
    afterHoursCallsPerMonth: 5,
    unfollowedQuotesPerMonth: 5,
    leadsAffectedPerMonth: 20,
    inputBasis: "estimated",
  });
  assert.equal(pool.missedCalls, 10);
  assert.equal(pool.afterHoursCalls, 5);
  assert.equal(pool.unfollowedQuotes, 5);
  assert.equal(pool.leadsAffected, 0, "nothing is left for the delayed-response scenario");
  assert.equal(pool.notes.length, 1);
  assert.match(pool.notes[0], /Slow-response leads was capped at 0/);
});

test("delayed-response leads that overlap missed calls are not counted twice", () => {
  const unconstrained = score({ ...baseInput, leakage: { ...baseInput.leakage, monthlyInboundOpportunities: 1000 } });
  const constrained = score({ ...baseInput, leakage: { ...baseInput.leakage, monthlyInboundOpportunities: 20 } });

  assert.ok(unconstrained.conversionOpportunity.speedToLead > 0);
  assert.equal(constrained.conversionOpportunity.speedToLead, 0);
  assert.equal(constrained.revenueLeakage.missedCalls, unconstrained.revenueLeakage.missedCalls);
  assert.ok(constrained.modeledOpportunityRange.base < unconstrained.modeledOpportunityRange.base);
});

test("quote recovery and conversion lift never apply to the same lead", () => {
  // With a 30-lead pool: 10 missed + 5 after-hours + 5 quotes leaves 10 for
  // delayed response, not the 20 entered.
  const result = score({ ...baseInput, leakage: { ...baseInput.leakage, monthlyInboundOpportunities: 30 } });
  const tenLeads = score({ ...baseInput, leakage: { ...baseInput.leakage, monthlyInboundOpportunities: 1000, leadsAffectedPerMonth: 10 } });
  assert.equal(result.conversionOpportunity.speedToLead, tenLeads.conversionOpportunity.speedToLead);
  assert.equal(result.revenueLeakage.quoteFollowup, tenLeads.revenueLeakage.quoteFollowup);
});

test("avoided hire is netted against addressable labor instead of summed", () => {
  const withoutHire = score(baseInput);
  // A hire cheaper than the addressable labor value adds nothing new.
  const smallHire = score({ ...baseInput, avoidedHireMonthlyCost: 500, headcountAvoidanceRate: 100 });
  assert.equal(smallHire.costAvoidance.avoidedHire, 6000);
  assert.equal(smallHire.costAvoidance.avoidedHireCounted, 0);
  assert.equal(smallHire.modeledOpportunityRange.base, withoutHire.modeledOpportunityRange.base);

  // A hire more expensive than the freed hours counts only for the excess.
  const bigHire = score({ ...baseInput, avoidedHireMonthlyCost: 6000, headcountAvoidanceRate: 100 });
  const expectedExcess = Math.round((72000 - bigHire.laborCapacity.annualAddressableLaborValue) / 100) * 100;
  assert.equal(bigHire.costAvoidance.avoidedHireCounted, expectedExcess);
  assert.ok(bigHire.overlapControls.some((note) => /netted against addressable labor/.test(note)));
});

test("the combined base is the sum of the separately reported layers after controls", () => {
  const result = score({
    ...baseInput,
    laborScopes: [...baseInput.laborScopes, { scope: "scheduling", hoursPerWeek: 4, workerType: "owner" }],
    errorsPerMonth: 5,
    costPerError: 100,
    preventableErrorRate: 50,
    avoidedHireMonthlyCost: 6000,
    headcountAvoidanceRate: 50,
  });
  const summed =
    result.laborCapacity.annualAddressableLaborValue +
    result.ownerCapacity.replacementCostValue +
    result.revenueLeakage.total +
    result.conversionOpportunity.total +
    result.costAvoidance.errors +
    result.costAvoidance.avoidedHireCounted;
  // Layers are individually rounded to $100, so allow rounding drift.
  assert.ok(Math.abs(summed - result.modeledOpportunityRange.base) <= 600, `${summed} vs ${result.modeledOpportunityRange.base}`);
  assert.equal(result.modeledOpportunityRange.low, Math.round((result.modeledOpportunityRange.base * OPPORTUNITY_RANGE_LOW_FACTOR) / 100) * 100);
  assert.ok(result.modeledOpportunityRange.high >= result.modeledOpportunityRange.base * OPPORTUNITY_RANGE_HIGH_FACTOR - 100);
});

test("revenue substituted for profit caps confidence at low and is disclosed", () => {
  const result = score({ ...baseInput, service: { name: "Job", averageSaleValue: 10000 } });
  assert.equal(result.economics.grossProfitBasis, "revenue_only");
  assert.equal(result.confidenceTier, "Low");
  assert.ok(result.confidenceReasons.some((reason) => /Revenue-based estimate/.test(reason)));
});

test("confidence tracks data quality: metro + entered profit + measured counts is high", () => {
  const high = score(baseInput);
  assert.equal(high.confidenceTier, "High");

  const stateFallback = score({ ...baseInput, zipCode: "32301" });
  assert.notEqual(stateFallback.confidenceTier, "Low");
  assert.ok(stateFallback.confidenceReasons.some((reason) => /statewide/.test(reason)));

  const national = score({ ...baseInput, zipCode: "00000" });
  assert.notEqual(national.confidenceTier, "High");

  const estimated = score({ ...baseInput, leakage: { ...baseInput.leakage, inputBasis: "estimated" }, service: { name: "Job", averageSaleValue: 10000, grossMarginPercent: 40 } });
  assert.equal(estimated.confidenceTier, "Medium");
});

test("missing optional data degrades gracefully instead of throwing", () => {
  const result = score({
    ...baseInput,
    laborScopes: [],
    service: { name: "Job" },
    leakage: { ...baseInput.leakage, missedCallsPerMonth: 0, afterHoursCallsPerMonth: 0, unfollowedQuotesPerMonth: 0, leadsAffectedPerMonth: 0 },
  });
  assert.equal(result.modeledOpportunityRange.base, 0);
  assert.equal(result.primaryLeakageScenario, "None identified");
  assert.equal(result.paybackMonths, null);
  assert.equal(result.confidenceTier, "Low");
});

test("the assumption registry lists benchmarks with provenance and every adjustable rate", () => {
  const result = score(baseInput);
  const ids = result.assumptions.map((assumption) => assumption.id);
  for (const id of ["burden_multiplier", "qualified_opportunity_rate", "missed_call_recoverability", "after_hours_capture_rate", "quote_recoverability", "response_close_rate_lift", "opportunity_range", "gross_profit_basis", "recoverability_calls", "benchmark_receptionist"]) {
    assert.ok(ids.includes(id), `missing assumption ${id}`);
  }
  const benchmark = result.assumptions.find((assumption) => assumption.id === "benchmark_receptionist")!;
  assert.ok(benchmark.source);
  assert.ok(benchmark.sourceDate);
  assert.match(benchmark.description, /Miami/);
});

test("the preset controls which modules run without changing formulas", () => {
  const withWebsite = score({ ...baseInput, website: { monthlyWebsiteVisitors: 10000, currentConversionRate: 2, modeledConversionRate: 3, qualifiedLeadRate: 50 } });
  assert.ok((withWebsite.conversionOpportunity.websiteConversion ?? 0) > 0);

  const responseOs = score({ ...baseInput, preset: "responseos", website: { monthlyWebsiteVisitors: 10000, currentConversionRate: 2, modeledConversionRate: 3, qualifiedLeadRate: 50 } });
  assert.equal(responseOs.conversionOpportunity.websiteConversion, undefined);
  assert.equal(responseOs.revenueLeakage.missedCalls, withWebsite.revenueLeakage.missedCalls);
});

test("the async server path resolves the same context as the sync preview path", async () => {
  const sync = resolveScorecardContextSync(baseInput, staticLaborBenchmarkProvider);
  const async = await resolveScorecardContext(baseInput, staticLaborBenchmarkProvider);
  assert.deepEqual(async.geography, sync.geography);
  assert.deepEqual(async.benchmarksByScope, sync.benchmarksByScope);
});

/* Schema safety ---------------------------------------------------------- */

test("the schema rejects negative numbers, unbounded percentages, and impossible values", () => {
  assert.throws(() => revenueLeakScorecardInputSchema.parse({ ...baseInput, leakage: { ...baseInput.leakage, missedCallsPerMonth: -1 } }));
  assert.throws(() => revenueLeakScorecardInputSchema.parse({ ...baseInput, leakage: { ...baseInput.leakage, currentCloseRate: 140 } }));
  assert.throws(() => revenueLeakScorecardInputSchema.parse({ ...baseInput, laborScopes: [{ scope: "calls", hoursPerWeek: 200, workerType: "employee" }] }));
  assert.throws(() => revenueLeakScorecardInputSchema.parse({ ...baseInput, burdenMultiplier: 5 }));
  assert.throws(() => revenueLeakScorecardInputSchema.parse({ ...baseInput, zipCode: "1234" }));
  assert.throws(() => revenueLeakScorecardInputSchema.parse({ ...baseInput, laborScopes: [{ scope: "not-a-scope", hoursPerWeek: 2, workerType: "employee" }] }));
  assert.throws(() => revenueLeakScorecardInputSchema.parse({ ...baseInput, processClarity: 9 }));
});

test("the schema accepts a payload with only the required V2 fields", () => {
  const parsed = revenueLeakScorecardInputSchema.parse({
    ...baseInput,
    burdenMultiplier: undefined,
    ownerHourlyValue: undefined,
    website: undefined,
    leakage: { ...baseInput.leakage, inputBasis: undefined },
  });
  assert.equal(parsed.leakage.inputBasis, "estimated", "the basis defaults to the conservative reading");
  assert.equal(parsed.burdenMultiplier, undefined);
});

/* Backward compatibility ------------------------------------------------- */

const v1Input: RoiCalculatorInput = {
  industry: "Professional services",
  companySize: "2-10",
  monthlyRevenue: "$50k-$100k",
  workflowType: "reporting",
  taskFrequency: "daily",
  hoursPerWeek: 10,
  hourlyCost: 100,
  leadsPerMonth: 0,
  averageDealValue: 0,
  currentCloseRate: 0,
  speedToLeadLift: 0,
  errorsPerMonth: 0,
  costPerError: 0,
  preventableErrorRate: 0,
  ownerHoursPerWeek: 0,
  ownerHourlyValue: 0,
  ownerRecoverableRate: 0,
  avoidedHireMonthlyCost: 0,
  headcountAvoidanceRate: 0,
  implementationBudget: 0,
  timelineExpectation: "60 days",
  internalOwner: "Founder",
  processClarity: 3,
  dataQuality: 3,
  sopMaturity: 3,
  toolFragmentation: 3,
  teamAdoption: 3,
  name: "Test",
  email: "test@example.com",
  company: "Test Co",
};

test("a V1 payload with no version field still validates and routes to the V1 formula", () => {
  const result = calculateRoiResult(v1Input);
  const parsed = parseRoiLead({ email: v1Input.email, input: v1Input, result });
  assert.ok(parsed.success, parsed.success ? "" : parsed.error.message);
  if (!parsed.success) return;
  assert.equal(parsed.data.calculationVersion, "v1");
  if (parsed.data.calculationVersion !== "v1") return;
  assert.equal(parsed.data.input.automationCaptureRate, 42);
  assert.deepEqual(calculateRoiResult(parsed.data.input), result, "the V1 numbers are unchanged by the V2 work");
  assert.equal(result.monthlySavings, 1800);
});

test("the standalone V1 schema still parses exactly as before", () => {
  const result = calculateRoiResult(v1Input);
  assert.ok(roiLeadSchema.safeParse({ email: v1Input.email, input: v1Input, result }).success);
});

test("a V2 payload routes to the scorecard schema and does not require a result", () => {
  const parsed = parseRoiLead({ calculationVersion: "v2-geo-economic", email: baseInput.email, input: baseInput });
  assert.ok(parsed.success, parsed.success ? "" : parsed.error.message);
  if (!parsed.success) return;
  assert.equal(parsed.data.calculationVersion, "v2-geo-economic");
});

test("a V2 payload with a V1-shaped input is rejected rather than miscalculated", () => {
  const parsed = parseRoiLead({ calculationVersion: "v2-geo-economic", email: v1Input.email, input: v1Input });
  assert.equal(parsed.success, false);
});

/* Codex review follow-ups ------------------------------------------------ */

test("the server schema rejects gross profit above the sale value", () => {
  const parsed = revenueLeakScorecardInputSchema.safeParse({
    ...baseInput,
    service: { name: "Job", averageSaleValue: 1000, grossProfitPerSale: 1500 },
  });
  assert.equal(parsed.success, false);
  assert.ok(revenueLeakScorecardInputSchema.safeParse({ ...baseInput, service: { name: "Job", averageSaleValue: 1000, grossProfitPerSale: 1000 } }).success);
  assert.ok(revenueLeakScorecardInputSchema.safeParse({ ...baseInput, service: { name: "Job", grossProfitPerSale: 1500 } }).success, "no sale value means nothing to compare against");
});

test("the V2 envelope email must match the form email the result is sent to", () => {
  const mismatch = parseRoiLead({ calculationVersion: "v2-geo-economic", email: "someone-else@example.com", input: baseInput });
  assert.equal(mismatch.success, false);
  const caseOnly = parseRoiLead({ calculationVersion: "v2-geo-economic", email: "TEST@example.com", input: baseInput });
  assert.ok(caseOnly.success, "case differences are not a mismatch");
});

test("the reported geography tier always matches the tier the benchmarks were priced at", () => {
  // San Juan, Puerto Rico and Charlotte Amalie, USVI: territories carry
  // their own index now, so they price statewide, and the geography must
  // say exactly what the scope benchmarks say — never a finer tier.
  for (const [zip, state] of [["00901", "PR"], ["00802", "VI"], ["96910", "GU"], ["32301", "FL"], ["33131", "FL"], ["00000", undefined]] as const) {
    const result = score({ ...baseInput, zipCode: zip });
    assert.equal(result.geography.state, state);
    for (const scope of result.laborCapacity.scopes) {
      assert.equal(scope.benchmark.geographyType, result.geography.tier, `${zip}: ${scope.scope}`);
    }
  }
  const pr = score({ ...baseInput, zipCode: "00901" });
  assert.equal(pr.geography.tier, "state");
  assert.ok(pr.laborCapacity.scopes[0].loadedHourlyCost < score(baseInput).laborCapacity.scopes[0].loadedHourlyCost, "Puerto Rico prices below Miami");
  assert.equal(score({ ...baseInput, zipCode: "00000" }).geography.tier, "national");
});

test("scenarios a preset disables do not consume the opportunity pool", () => {
  const leakage = { ...baseInput.leakage, monthlyInboundOpportunities: 20, missedCallsPerMonth: 20, afterHoursCallsPerMonth: 0, unfollowedQuotesPerMonth: 0, leadsAffectedPerMonth: 20 };
  const website = score({ ...baseInput, preset: "website", leakage });
  const websiteNoMissed = score({ ...baseInput, preset: "website", leakage: { ...leakage, missedCallsPerMonth: 0 } });
  assert.ok(website.conversionOpportunity.speedToLead > 0, "missed calls are off under the website preset, so the pool is free for delayed response");
  assert.equal(website.conversionOpportunity.speedToLead, websiteNoMissed.conversionOpportunity.speedToLead);
  assert.equal(website.revenueLeakage.missedCalls, 0);

  const full = score({ ...baseInput, preset: "revenue_leak", leakage });
  assert.equal(full.conversionOpportunity.speedToLead, 0, "with missed calls enabled the same pool is exhausted first");

  const pool = allocateOpportunityPool(leakage, { missedCalls: false, afterHours: true, quoteFollowup: true, delayedResponse: true });
  assert.equal(pool.missedCalls, 0);
  assert.equal(pool.leadsAffected, 20);
  assert.equal(pool.notes.length, 0);
});
