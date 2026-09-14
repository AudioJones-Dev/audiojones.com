import {
  BENCHMARK_VERSION,
  DEFAULT_AFTER_HOURS_CAPTURE_RATE,
  DEFAULT_MISSED_CALL_RECOVERABILITY,
  DEFAULT_QUALIFIED_OPPORTUNITY_RATE,
  DEFAULT_QUOTE_RECOVERABILITY,
  DEFAULT_RESPONSE_CLOSE_RATE_LIFT,
  OPPORTUNITY_RANGE_HIGH_FACTOR,
  OPPORTUNITY_RANGE_LOW_FACTOR,
  baseAssumptions,
} from "./assumptions";
import { resolveBenchmarkGeography } from "./labor/benchmark-provider";
import type { LaborBenchmarkProvider, SyncLaborBenchmarkProvider } from "./labor/benchmark-types";
import {
  calculateLaborScope,
  calculateOwnerCapacity,
  clampBurden,
  clampPercent,
  occupationForScope,
} from "./labor/labor-calculations";
import { getPreset, type PresetModules } from "./presets";
import { calculateAfterHoursScenario } from "./scenarios/after-hours";
import { calculateDelayedResponseScenario } from "./scenarios/delayed-response";
import { calculateMissedCallsScenario } from "./scenarios/missed-calls";
import { calculateQuoteFollowupScenario } from "./scenarios/quote-followup";
import { calculateWebsiteConversionScenario } from "./scenarios/website-conversion";
import type {
  CalculationAssumption,
  GeographyResolution,
  GrossProfitBasis,
  LaborBenchmark,
  LaborScopeKey,
  RevenueLeakScorecardInput,
  RevenueLeakScorecardResult,
  RoiConfidenceTier,
  RoiRecommendation,
} from "./types";

export type ScorecardContext = {
  geography: GeographyResolution;
  benchmarksByScope: Partial<Record<LaborScopeKey, LaborBenchmark>>;
};

function uniqueScopes(input: RevenueLeakScorecardInput) {
  return [...new Set(input.laborScopes.map((entry) => entry.scope))];
}

/** Server path: any provider, including a future networked one. */
export async function resolveScorecardContext(
  input: RevenueLeakScorecardInput,
  provider: LaborBenchmarkProvider,
): Promise<ScorecardContext> {
  const benchmarksByScope: ScorecardContext["benchmarksByScope"] = {};
  for (const scope of uniqueScopes(input)) {
    const entry = input.laborScopes.find((item) => item.scope === scope)!;
    benchmarksByScope[scope] = await provider.getHourlyBenchmark({
      zipCode: input.zipCode,
      occupationKey: occupationForScope(entry),
    });
  }
  return { geography: resolveBenchmarkGeography(input.zipCode), benchmarksByScope };
}

/** Client preview path: same resolution, no await, static data only. */
export function resolveScorecardContextSync(
  input: RevenueLeakScorecardInput,
  provider: SyncLaborBenchmarkProvider,
): ScorecardContext {
  const benchmarksByScope: ScorecardContext["benchmarksByScope"] = {};
  for (const scope of uniqueScopes(input)) {
    const entry = input.laborScopes.find((item) => item.scope === scope)!;
    benchmarksByScope[scope] = provider.getHourlyBenchmarkSync({
      zipCode: input.zipCode,
      occupationKey: occupationForScope(entry),
    });
  }
  return { geography: resolveBenchmarkGeography(input.zipCode), benchmarksByScope };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function dollars(value: number) {
  return Math.round(Math.max(0, value) / 100) * 100;
}

function hours(value: number) {
  return Math.round(Math.max(0, value) * 10) / 10;
}

export function resolveGrossProfit(service: RevenueLeakScorecardInput["service"]): {
  averageSaleValue: number;
  grossProfitPerSale: number;
  basis: GrossProfitBasis;
} {
  const sale = Math.max(0, service.averageSaleValue ?? 0);
  const entered = Math.max(0, service.grossProfitPerSale ?? 0);
  if (entered > 0) return { averageSaleValue: sale, grossProfitPerSale: entered, basis: "entered" };
  const margin = service.grossMarginPercent;
  if (sale > 0 && margin != null && margin > 0) {
    return { averageSaleValue: sale, grossProfitPerSale: sale * (clampPercent(margin, 0) / 100), basis: "derived" };
  }
  if (sale > 0) return { averageSaleValue: sale, grossProfitPerSale: sale, basis: "revenue_only" };
  return { averageSaleValue: 0, grossProfitPerSale: 0, basis: "missing" };
}

/**
 * Each inbound opportunity is assigned to at most one scenario, in this
 * order: missed (never answered) → after-hours (never answered, outside
 * hours) → unworked quote → delayed response. Later scenarios only see what
 * is left of the monthly pool, so a lead cannot be "recovered" twice.
 */
export function allocateOpportunityPool(
  leakage: RevenueLeakScorecardInput["leakage"],
  enabled: Pick<PresetModules, "missedCalls" | "afterHours" | "quoteFollowup" | "delayedResponse"> = {
    missedCalls: true,
    afterHours: true,
    quoteFollowup: true,
    delayedResponse: true,
  },
) {
  const pool = Math.max(0, leakage.monthlyInboundOpportunities);
  const notes: string[] = [];
  let remaining = pool;

  // A scenario the preset has switched off must not eat into the pool the
  // enabled ones draw from.
  const take = (requested: number, label: string, isEnabled: boolean) => {
    if (!isEnabled) return 0;
    const wanted = Math.max(0, requested);
    const granted = Math.min(wanted, remaining);
    if (granted < wanted) {
      notes.push(
        `${label} was capped at ${Math.round(granted)}/month (entered ${Math.round(wanted)}) so the scenarios together never exceed the ${Math.round(pool)} monthly inbound opportunities you reported.`,
      );
    }
    remaining -= granted;
    return granted;
  };

  const missedCalls = take(leakage.missedCallsPerMonth, "Missed calls", enabled.missedCalls);
  const afterHoursCalls = take(leakage.afterHoursCallsPerMonth, "After-hours calls", enabled.afterHours);
  const unfollowedQuotes = take(leakage.unfollowedQuotesPerMonth, "Unworked quotes", enabled.quoteFollowup);
  const leadsAffected = take(leakage.leadsAffectedPerMonth, "Slow-response leads", enabled.delayedResponse);
  return { missedCalls, afterHoursCalls, unfollowedQuotes, leadsAffected, notes };
}

export function calculateRevenueLeakScorecard(
  input: RevenueLeakScorecardInput,
  context: ScorecardContext,
): RevenueLeakScorecardResult {
  const preset = getPreset(input.preset);
  const burdenMultiplier = clampBurden(input.burdenMultiplier);
  const overlapControls: string[] = [];

  /* Labor and owner layers ------------------------------------------------ */
  const scopeResults = input.laborScopes.map((entry) => {
    const benchmark = context.benchmarksByScope[entry.scope];
    if (!benchmark) throw new Error(`No labor benchmark resolved for scope "${entry.scope}".`);
    return calculateLaborScope(entry, benchmark, burdenMultiplier);
  });
  const ownerScopes = scopeResults.filter((scope) => scope.workerType === "owner");
  const teamScopes = scopeResults.filter((scope) => scope.workerType !== "owner");

  const laborHours = teamScopes.reduce((sum, scope) => sum + scope.hoursPerWeek, 0);
  const laborAddressableHours = teamScopes.reduce((sum, scope) => sum + scope.addressableHoursPerWeek, 0);
  const annualCurrentLaborValue = teamScopes.reduce((sum, scope) => sum + scope.annualCurrentValue, 0);
  const annualAddressableLaborValue = teamScopes.reduce((sum, scope) => sum + scope.annualAddressableValue, 0);

  const owner = calculateOwnerCapacity(ownerScopes, input.ownerHourlyValue);
  if (owner.hoursPerWeek > 0) {
    overlapControls.push(
      `Owner-performed hours (${hours(owner.hoursPerWeek)} h/week) are priced in Owner capacity at replacement cost and excluded from Labor capacity.`,
    );
  }

  /* Sales economics -------------------------------------------------------- */
  const economics = resolveGrossProfit(input.service);
  const closeRate = clampPercent(input.leakage.currentCloseRate, 0);
  const expectedGrossProfitPerQualifiedLead = (closeRate / 100) * economics.grossProfitPerSale;

  const qualifiedRate = clampPercent(input.leakage.qualifiedOpportunityRate, DEFAULT_QUALIFIED_OPPORTUNITY_RATE);
  const missedRecoverability = clampPercent(input.leakage.missedCallRecoverabilityPercent, DEFAULT_MISSED_CALL_RECOVERABILITY);
  const afterHoursCapture = clampPercent(input.leakage.afterHoursCaptureRatePercent, DEFAULT_AFTER_HOURS_CAPTURE_RATE);
  const quoteRecoverability = clampPercent(input.leakage.quoteRecoverabilityPercent, DEFAULT_QUOTE_RECOVERABILITY);
  const responseLift = input.leakage.responseCloseRateLift ?? DEFAULT_RESPONSE_CLOSE_RATE_LIFT;
  const quoteCloseRate = clampPercent(input.leakage.historicalQuoteCloseRate, closeRate);

  /* Revenue leakage and conversion scenarios ------------------------------ */
  const pool = allocateOpportunityPool(input.leakage, preset.modules);
  overlapControls.push(...pool.notes);

  const missed = preset.modules.missedCalls
    ? calculateMissedCallsScenario({
        missedCallsPerMonth: pool.missedCalls,
        qualifiedOpportunityRate: qualifiedRate,
        closeRate,
        grossProfitPerSale: economics.grossProfitPerSale,
        recoverabilityRate: missedRecoverability,
      }).annualGrossProfit
    : 0;
  const afterHours = preset.modules.afterHours
    ? calculateAfterHoursScenario({
        afterHoursCallsPerMonth: pool.afterHoursCalls,
        qualifiedOpportunityRate: qualifiedRate,
        closeRate,
        grossProfitPerSale: economics.grossProfitPerSale,
        captureRate: afterHoursCapture,
      }).annualGrossProfit
    : 0;
  const quotes = preset.modules.quoteFollowup
    ? calculateQuoteFollowupScenario({
        unfollowedQuotesPerMonth: pool.unfollowedQuotes,
        historicalQuoteCloseRate: quoteCloseRate,
        grossProfitPerSale: economics.grossProfitPerSale,
        recoverabilityRate: quoteRecoverability,
      }).annualGrossProfit
    : 0;
  const speedToLead = preset.modules.delayedResponse
    ? calculateDelayedResponseScenario({
        leadsAffectedPerMonth: pool.leadsAffected,
        currentCloseRate: closeRate,
        closeRateLift: responseLift,
        grossProfitPerSale: economics.grossProfitPerSale,
      }).annualGrossProfit
    : 0;
  const websiteConversion =
    preset.modules.websiteConversion && input.website
      ? calculateWebsiteConversionScenario({
          ...input.website,
          closeRate,
          grossProfitPerSale: economics.grossProfitPerSale,
        }).annualGrossProfit
      : undefined;

  const revenueLeakageTotal = missed + afterHours + quotes;
  const conversionTotal = speedToLead + (websiteConversion ?? 0);

  /* Cost avoidance --------------------------------------------------------- */
  const errors = preset.modules.costAvoidance
    ? Math.max(0, input.errorsPerMonth) * Math.max(0, input.costPerError) * (clampPercent(input.preventableErrorRate, 0) / 100) * 12
    : 0;
  const avoidedHire = preset.modules.costAvoidance
    ? Math.max(0, input.avoidedHireMonthlyCost) * (clampPercent(input.headcountAvoidanceRate, 0) / 100) * 12
    : 0;
  // The freed hours are what make the hire avoidable, so only the part of
  // the avoided cost that exceeds the addressable labor value is new money.
  const avoidedHireCounted = Math.max(0, avoidedHire - annualAddressableLaborValue);
  if (avoidedHire > 0 && avoidedHireCounted < avoidedHire) {
    overlapControls.push(
      `Avoided-hire value was netted against addressable labor capacity: only ${dollars(avoidedHireCounted).toLocaleString("en-US")} of the ${dollars(avoidedHire).toLocaleString("en-US")} avoided cost counts toward the combined figure.`,
    );
  }

  /* Combined figure and range ---------------------------------------------- */
  const base =
    annualAddressableLaborValue +
    owner.replacementCostValue +
    revenueLeakageTotal +
    conversionTotal +
    errors +
    avoidedHireCounted;
  const modeledOpportunityRange = {
    low: dollars(base * OPPORTUNITY_RANGE_LOW_FACTOR),
    base: dollars(base),
    high: dollars(base * OPPORTUNITY_RANGE_HIGH_FACTOR),
  };

  const scenarioRanking: [string, number][] = [
    ["Missed calls", missed],
    ["After-hours demand", afterHours],
    ["Quote follow-up", quotes],
    ["Delayed response", speedToLead],
    ["Website conversion", websiteConversion ?? 0],
  ];
  const primary = scenarioRanking.reduce((best, item) => (item[1] > best[1] ? item : best), ["None identified", 0] as [string, number]);
  const primaryLeakageScenario = primary[1] > 0 ? primary[0] : "None identified";

  /* Scores ----------------------------------------------------------------- */
  const readinessScore = Math.round(
    clamp(
      ((input.processClarity + input.dataQuality + input.sopMaturity + input.teamAdoption + (6 - input.toolFragmentation)) / 25) * 100,
      0,
      100,
    ),
  );
  const monthlyBase = base / 12;
  const impactScore = clamp(monthlyBase / 500, 0, 60);
  const leverPressure =
    (revenueLeakageTotal > 0 ? 12 : 0) +
    (conversionTotal > 0 ? 8 : 0) +
    (owner.replacementCostValue > 0 ? 6 : 0) +
    (errors + avoidedHireCounted > 0 ? 4 : 0);
  const priorityScore = Math.round(clamp(impactScore + leverPressure + readinessScore * 0.25, 0, 100));
  const paybackMonths =
    input.implementationBudget > 0 && monthlyBase > 0
      ? Math.max(1, Math.round((input.implementationBudget / monthlyBase) * 10) / 10)
      : null;

  /* Confidence ------------------------------------------------------------- */
  const confidenceReasons: string[] = [];
  let points = 0;
  const tiers = new Set(Object.values(context.benchmarksByScope).map((benchmark) => benchmark.geographyType));
  if (scopeResults.length === 0) {
    confidenceReasons.push("No operational hours were entered, so the labor layers are empty.");
  } else if (tiers.has("national") || tiers.has("region")) {
    confidenceReasons.push("Labor benchmarks fell back to regional or national data.");
  } else if (tiers.has("state")) {
    points += 1;
    confidenceReasons.push("Labor benchmarks use statewide occupational data.");
  } else {
    points += 2;
    confidenceReasons.push("Labor benchmarks use metro-level occupational data.");
  }
  if (economics.basis === "entered") {
    points += 2;
    confidenceReasons.push("Gross profit per sale was entered directly.");
  } else if (economics.basis === "derived") {
    points += 1;
    confidenceReasons.push("Gross profit was derived from sale value and margin.");
  } else if (economics.basis === "revenue_only") {
    confidenceReasons.push("Revenue-based estimate. Profit impact may be materially lower.");
  } else {
    confidenceReasons.push("No sale value was entered, so revenue scenarios are zero.");
  }
  if (input.leakage.inputBasis === "measured") {
    points += 2;
    confidenceReasons.push("Leakage counts come from call logs or CRM records.");
  } else {
    confidenceReasons.push("Leakage counts are the visitor's estimates.");
  }
  if (closeRate > 0) points += 1;
  if (input.leakage.historicalQuoteCloseRate != null) points += 1;
  if (scopeResults.length > 0) points += 1;

  let confidenceTier: RoiConfidenceTier = "Low";
  if (points >= 7 && economics.basis !== "revenue_only") confidenceTier = "High";
  else if (points >= 4) confidenceTier = "Medium";
  if (economics.basis === "revenue_only" || tiers.has("national")) confidenceTier = confidenceTier === "High" ? "Medium" : "Low";

  /* Recommendation --------------------------------------------------------- */
  let recommendation: RoiRecommendation = "Diagnose the Workflow";
  if (readinessScore >= 70 && priorityScore >= 65 && (paybackMonths == null || paybackMonths <= 9)) {
    recommendation = "Automate Now";
  } else if (readinessScore >= 50 && priorityScore >= 45) {
    recommendation = "Pilot First";
  }
  const recommendedNextAction = {
    "Automate Now": `Book a Revenue Leak Diagnostic to validate these assumptions against your call logs and CRM, then scope the ${primaryLeakageScenario === "None identified" ? "highest-value" : primaryLeakageScenario.toLowerCase()} workflow first.`,
    "Pilot First": `Book a Revenue Leak Diagnostic and pilot one leak — ${primaryLeakageScenario === "None identified" ? "the largest labor scope" : primaryLeakageScenario.toLowerCase()} — before a broader build.`,
    "Diagnose the Workflow": "Book a Revenue Leak Diagnostic to establish the baseline data this scorecard is missing before investing in tooling.",
  }[recommendation];

  /* Assumption registry ---------------------------------------------------- */
  const assumptions: CalculationAssumption[] = baseAssumptions({
    burdenMultiplier,
    qualifiedOpportunityRate: qualifiedRate,
    missedCallRecoverability: missedRecoverability,
    afterHoursCaptureRate: afterHoursCapture,
    quoteRecoverability: quoteRecoverability,
    responseCloseRateLift: responseLift,
  });
  assumptions.push({
    id: "gross_profit_basis",
    label: "Gross profit basis",
    value: economics.basis,
    description: {
      entered: "Gross profit per sale as entered.",
      derived: "Average sale value × gross margin %.",
      revenue_only: "Average sale value used in place of gross profit because no margin was entered. Profit impact may be materially lower.",
      missing: "No sale economics entered.",
    }[economics.basis],
    userOverridable: true,
  });
  for (const scope of scopeResults) {
    assumptions.push({
      id: `recoverability_${scope.scope}`,
      label: `${scope.scopeLabel} addressability`,
      value: `${scope.recoverabilityPercent}%`,
      description: `Share of the ${hours(scope.hoursPerWeek)} h/week on ${scope.scopeLabel.toLowerCase()} a system could take over.`,
      userOverridable: true,
    });
  }
  const seen = new Set<string>();
  for (const benchmark of Object.values(context.benchmarksByScope)) {
    if (seen.has(benchmark.occupationKey)) continue;
    seen.add(benchmark.occupationKey);
    assumptions.push({
      id: `benchmark_${benchmark.occupationKey}`,
      label: `Labor benchmark: ${benchmark.occupationLabel}`,
      value: `$${benchmark.hourlyWage.toFixed(2)}/hr`,
      description: `${benchmark.geographyLabel}, ${benchmark.source}.${benchmark.fallbackNote ? ` ${benchmark.fallbackNote}` : ""}`,
      source: benchmark.source,
      sourceDate: benchmark.sourceDate,
      userOverridable: false,
    });
  }

  return {
    calculationVersion: "v2-geo-economic",
    preset: preset.key,
    geography: context.geography,
    economics: {
      averageSaleValue: economics.averageSaleValue,
      grossProfitPerSale: Math.round(economics.grossProfitPerSale),
      grossProfitBasis: economics.basis,
      expectedGrossProfitPerQualifiedLead: Math.round(expectedGrossProfitPerQualifiedLead),
    },
    laborCapacity: {
      hoursPerWeek: hours(laborHours),
      addressableHoursPerWeek: hours(laborAddressableHours),
      annualCurrentLaborValue: dollars(annualCurrentLaborValue),
      annualAddressableLaborValue: dollars(annualAddressableLaborValue),
      scopes: scopeResults.map((scope) => ({
        ...scope,
        hoursPerWeek: hours(scope.hoursPerWeek),
        addressableHoursPerWeek: hours(scope.addressableHoursPerWeek),
        annualCurrentValue: dollars(scope.annualCurrentValue),
        annualAddressableValue: dollars(scope.annualAddressableValue),
      })),
    },
    revenueLeakage: {
      missedCalls: dollars(missed),
      afterHours: dollars(afterHours),
      quoteFollowup: dollars(quotes),
      total: dollars(revenueLeakageTotal),
    },
    conversionOpportunity: {
      speedToLead: dollars(speedToLead),
      websiteConversion: websiteConversion == null ? undefined : dollars(websiteConversion),
      total: dollars(conversionTotal),
    },
    ownerCapacity: {
      hoursPerWeek: hours(owner.hoursPerWeek),
      addressableHoursPerWeek: hours(owner.addressableHoursPerWeek),
      replacementCostValue: dollars(owner.replacementCostValue),
      founderCapacityValue: owner.founderCapacityValue == null ? undefined : dollars(owner.founderCapacityValue),
    },
    costAvoidance: {
      errors: dollars(errors),
      avoidedHire: dollars(avoidedHire),
      avoidedHireCounted: dollars(avoidedHireCounted),
    },
    overlapControls,
    modeledOpportunityRange,
    primaryLeakageScenario,
    paybackMonths,
    readinessScore,
    priorityScore,
    confidenceTier,
    confidenceReasons,
    recommendation,
    recommendedNextAction,
    assumptions,
    benchmarkVersion: BENCHMARK_VERSION,
  };
}
