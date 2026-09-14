export type RoiCalculatorInput = {
  industry: string;
  companySize: string;
  monthlyRevenue: string;
  workflowType: string;
  taskFrequency: string;
  /**
   * Percentage of task time automation is assumed to reclaim, before
   * frequency scaling. Optional so rows persisted before this field existed
   * still replay correctly; `DEFAULT_AUTOMATION_CAPTURE_RATE` fills the gap.
   */
  automationCaptureRate?: number;
  hoursPerWeek: number;
  hourlyCost: number;
  leadsPerMonth: number;
  averageDealValue: number;
  currentCloseRate: number;
  speedToLeadLift: number;
  errorsPerMonth: number;
  costPerError: number;
  preventableErrorRate: number;
  ownerHoursPerWeek: number;
  ownerHourlyValue: number;
  ownerRecoverableRate: number;
  avoidedHireMonthlyCost: number;
  headcountAvoidanceRate: number;
  implementationBudget: number;
  timelineExpectation: string;
  internalOwner: string;
  processClarity: number;
  dataQuality: number;
  sopMaturity: number;
  toolFragmentation: number;
  teamAdoption: number;
  name: string;
  email: string;
  company: string;
  phone?: string;
  message?: string;
};

export type RoiRecommendation =
  | "Automate Now"
  | "Pilot First"
  | "Diagnose the Workflow";

export type RoiConfidenceTier = "High" | "Medium" | "Low";

export type RoiCalculatorResult = {
  monthlySavings: number;
  annualSavings: number;
  paybackMonths: number | null;
  readinessScore: number;
  priorityScore: number;
  confidenceTier: RoiConfidenceTier;
  recommendation: RoiRecommendation;
  recommendedNextAction: string;
  savingsBreakdown: {
    manualLaborRecovery: number;
    revenueRecovery: number;
    errorReduction: number;
    ownerCapacityUnlocked: number;
    headcountAvoidance: number;
  };
};

export type RoiLeadRequest = {
  email: string;
  input: RoiCalculatorInput;
  result: RoiCalculatorResult;
  source?: string;
  utm?: Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content", string>>;
  hp?: string;
};

/* ------------------------------------------------------------------------ */
/* V2 — geo-economic Revenue Leak Scorecard                                  */
/* ------------------------------------------------------------------------ */

/**
 * Which formula set produced a persisted result. `v1` rows carry the
 * `RoiCalculatorInput`/`RoiCalculatorResult` shapes above and replay through
 * `calculateRoiResult`; `v2-geo-economic` rows carry the scorecard shapes
 * below. Neither set changes the other's numbers.
 */
export type RoiCalculationVersion = "v1" | "v2-geo-economic";

export const V1_CALCULATION_VERSION: RoiCalculationVersion = "v1";
export const V2_CALCULATION_VERSION: RoiCalculationVersion = "v2-geo-economic";

export type CalculatorPreset =
  | "revenue_leak"
  | "responseos"
  | "operations"
  | "website"
  | "ai_roi";

export type LaborScopeKey =
  | "calls"
  | "customer_communication"
  | "scheduling"
  | "dispatch"
  | "crm_admin"
  | "quote_followup"
  | "billing"
  | "operations_admin"
  | "custom";

export type LaborWorkerType = "owner" | "manager" | "employee" | "contractor";

export type LaborScopeEntry = {
  scope: LaborScopeKey;
  hoursPerWeek: number;
  workerType: LaborWorkerType;
  /** 0–100. When omitted the scope's preset addressability applies. */
  recoverabilityPercent?: number;
};

export type ServiceEconomics = {
  name: string;
  averageSaleValue?: number;
  grossMarginPercent?: number;
  grossProfitPerSale?: number;
  monthlyOpportunityShare?: number;
};

/** Whether the leakage counts came from records or from the visitor's guess. */
export type LeakageInputBasis = "measured" | "estimated";

export type RevenueLeakScenarioInput = {
  monthlyInboundOpportunities: number;
  currentCloseRate: number;
  missedCallsPerMonth: number;
  afterHoursCallsPerMonth: number;
  unfollowedQuotesPerMonth: number;
  /** Historical close rate on quotes that were followed up. 0–100. */
  historicalQuoteCloseRate?: number;
  /** Leads that got a response, but a slow one. */
  leadsAffectedPerMonth: number;
  /** Percentage points added to the close rate on those leads. */
  responseCloseRateLift?: number;
  /** Share of missed/after-hours calls that are real sales opportunities. 0–100. */
  qualifiedOpportunityRate?: number;
  missedCallRecoverabilityPercent?: number;
  afterHoursCaptureRatePercent?: number;
  quoteRecoverabilityPercent?: number;
  inputBasis: LeakageInputBasis;
};

export type WebsiteConversionInput = {
  monthlyWebsiteVisitors: number;
  currentConversionRate: number;
  modeledConversionRate: number;
  qualifiedLeadRate: number;
};

export type RevenueLeakScorecardInput = {
  calculationVersion: "v2-geo-economic";
  preset?: CalculatorPreset;
  zipCode: string;
  city?: string;
  state?: string;
  industry: string;
  companySize: string;
  monthlyRevenue: string;
  laborScopes: LaborScopeEntry[];
  /** Employer burden on top of market wage, e.g. 1.35. */
  burdenMultiplier?: number;
  /** What an owner hour is worth redirected to revenue work. Optional. */
  ownerHourlyValue?: number;
  service: ServiceEconomics;
  leakage: RevenueLeakScenarioInput;
  website?: WebsiteConversionInput;
  errorsPerMonth: number;
  costPerError: number;
  preventableErrorRate: number;
  avoidedHireMonthlyCost: number;
  headcountAvoidanceRate: number;
  implementationBudget: number;
  timelineExpectation: string;
  internalOwner: string;
  processClarity: number;
  dataQuality: number;
  sopMaturity: number;
  toolFragmentation: number;
  teamAdoption: number;
  name: string;
  email: string;
  company: string;
  phone?: string;
  message?: string;
};

export type GeographyTier = "msa" | "state" | "region" | "national";

export type GeographyResolution = {
  zipCode: string;
  resolved: boolean;
  state?: string;
  stateName?: string;
  region?: string;
  msaKey?: string;
  msaLabel?: string;
  /** The most specific tier a labor benchmark could be resolved at. */
  tier: GeographyTier;
  label: string;
};

export type LaborBenchmark = {
  occupationKey: string;
  occupationLabel: string;
  geographyType: GeographyTier;
  geographyLabel: string;
  hourlyWage: number;
  loadedHourlyCost?: number;
  source: string;
  sourceDate: string;
  benchmarkVersion: string;
  retrievedAt: string;
  confidence: "high" | "medium" | "low";
  /** Set when a more specific tier was requested but unavailable. */
  fallbackNote?: string;
};

export type EconomicImpactCategory =
  | "labor_capacity"
  | "revenue_leakage"
  | "conversion_upside"
  | "owner_capacity"
  | "cost_avoidance";

export type CalculationAssumption = {
  id: string;
  label: string;
  value: number | string;
  description: string;
  source?: string;
  sourceDate?: string;
  userOverridable: boolean;
};

export type LaborScopeResult = {
  scope: LaborScopeKey;
  scopeLabel: string;
  workerType: LaborWorkerType;
  hoursPerWeek: number;
  recoverabilityPercent: number;
  addressableHoursPerWeek: number;
  benchmark: LaborBenchmark;
  loadedHourlyCost: number;
  annualCurrentValue: number;
  annualAddressableValue: number;
};

export type GrossProfitBasis = "entered" | "derived" | "revenue_only" | "missing";

export type RevenueLeakScorecardResult = {
  calculationVersion: "v2-geo-economic";
  preset: CalculatorPreset;
  geography: GeographyResolution;
  economics: {
    averageSaleValue: number;
    grossProfitPerSale: number;
    grossProfitBasis: GrossProfitBasis;
    expectedGrossProfitPerQualifiedLead: number;
  };
  laborCapacity: {
    hoursPerWeek: number;
    addressableHoursPerWeek: number;
    annualCurrentLaborValue: number;
    annualAddressableLaborValue: number;
    scopes: LaborScopeResult[];
  };
  revenueLeakage: {
    missedCalls: number;
    afterHours: number;
    quoteFollowup: number;
    total: number;
  };
  conversionOpportunity: {
    speedToLead: number;
    websiteConversion?: number;
    total: number;
  };
  ownerCapacity: {
    hoursPerWeek: number;
    addressableHoursPerWeek: number;
    replacementCostValue: number;
    founderCapacityValue?: number;
  };
  costAvoidance: {
    errors: number;
    avoidedHire: number;
    /** Avoided-hire value that survives the labor-overlap control. */
    avoidedHireCounted: number;
  };
  overlapControls: string[];
  modeledOpportunityRange: {
    low: number;
    base: number;
    high: number;
  };
  primaryLeakageScenario: string;
  paybackMonths: number | null;
  readinessScore: number;
  priorityScore: number;
  confidenceTier: RoiConfidenceTier;
  confidenceReasons: string[];
  recommendation: RoiRecommendation;
  recommendedNextAction: string;
  assumptions: CalculationAssumption[];
  benchmarkVersion: string;
};
