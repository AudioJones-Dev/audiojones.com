import { z } from "zod";
import { DEFAULT_AUTOMATION_CAPTURE_RATE } from "./calculations";
import { MAX_BURDEN_MULTIPLIER, MIN_BURDEN_MULTIPLIER } from "./assumptions";

const text = (label: string, max = 160) =>
  z.string({ required_error: `${label} is required.` }).trim().min(1, `${label} is required.`).max(max, `${label} is too long.`);

const dollars = (label: string, max = 10000000) =>
  z.coerce.number().min(0, `${label} cannot be negative.`).max(max, `${label} is too high.`);

const percent = (label: string) =>
  z.coerce.number().min(0, `${label} cannot be negative.`).max(100, `${label} cannot exceed 100%.`);

const count = (label: string, max = 1000000) =>
  z.coerce.number().min(0, `${label} cannot be negative.`).max(max, `${label} is too high.`);

const rating = z.coerce.number().int().min(1).max(5);

export const roiInputSchema = z.object({
  industry: text("Industry"),
  companySize: text("Company size"),
  monthlyRevenue: text("Monthly revenue range"),
  workflowType: text("Workflow bottleneck"),
  taskFrequency: text("Task frequency"),
  // Optional with a default so payloads persisted before this field existed
  // still validate, and so the server's recalculation lands on the same
  // number the client showed when the field is absent.
  automationCaptureRate: percent("Automation capture rate")
    .optional()
    .default(DEFAULT_AUTOMATION_CAPTURE_RATE),
  hoursPerWeek: z.coerce.number().min(1, "Hours per week must be at least 1.").max(168, "Hours per week must be 168 or less."),
  hourlyCost: z.coerce.number().min(1, "Hourly cost must be at least 1.").max(2000, "Hourly cost is too high."),
  leadsPerMonth: z.coerce.number().min(0, "Leads per month cannot be negative.").max(1000000, "Leads per month is too high."),
  averageDealValue: dollars("Average deal value"),
  currentCloseRate: percent("Current close rate"),
  speedToLeadLift: percent("Speed-to-lead close rate lift"),
  errorsPerMonth: z.coerce.number().min(0, "Errors per month cannot be negative.").max(1000000, "Errors per month is too high."),
  costPerError: dollars("Cost per error"),
  preventableErrorRate: percent("Preventable error rate"),
  ownerHoursPerWeek: z.coerce.number().min(0, "Owner hours per week cannot be negative.").max(168, "Owner hours per week must be 168 or less."),
  ownerHourlyValue: dollars("Owner hourly value", 5000),
  ownerRecoverableRate: percent("Owner recoverable rate"),
  avoidedHireMonthlyCost: dollars("Avoided hire monthly cost"),
  headcountAvoidanceRate: percent("Headcount avoidance rate"),
  implementationBudget: dollars("Implementation budget"),
  timelineExpectation: text("Timeline expectation"),
  internalOwner: text("Internal owner/readiness"),
  processClarity: rating,
  dataQuality: rating,
  sopMaturity: rating,
  toolFragmentation: rating,
  teamAdoption: rating,
  name: text("Name", 120),
  email: z.string({ required_error: "Email is required." }).trim().email("Enter a valid email address.").max(254),
  company: text("Company", 160),
  phone: z.string().trim().max(60, "Phone is too long.").optional().or(z.literal("")),
  message: z.string().trim().max(1000, "Context is too long.").optional().or(z.literal("")),
});

export const roiResultSchema = z.object({
  monthlySavings: z.number().nonnegative().max(100000000),
  annualSavings: z.number().nonnegative().max(1000000000),
  paybackMonths: z.number().positive().max(240).nullable(),
  readinessScore: z.number().int().min(0).max(100),
  priorityScore: z.number().int().min(0).max(100),
  confidenceTier: z.enum(["High", "Medium", "Low"]),
  recommendation: z.enum(["Automate Now", "Pilot First", "Diagnose the Workflow"]),
  recommendedNextAction: z.string().trim().min(1).max(400),
  savingsBreakdown: z.object({
    manualLaborRecovery: z.number().nonnegative().max(100000000),
    revenueRecovery: z.number().nonnegative().max(100000000),
    errorReduction: z.number().nonnegative().max(100000000),
    ownerCapacityUnlocked: z.number().nonnegative().max(100000000),
    headcountAvoidance: z.number().nonnegative().max(100000000),
  }),
});

const utmSchema = z
  .object({
    utm_source: z.string().trim().max(120).optional(),
    utm_medium: z.string().trim().max(120).optional(),
    utm_campaign: z.string().trim().max(120).optional(),
    utm_term: z.string().trim().max(120).optional(),
    utm_content: z.string().trim().max(120).optional(),
  })
  .optional();

const leadEnvelope = {
  email: z.string().trim().email("Enter a valid email address.").max(254),
  source: z.string().trim().max(120).optional().default("roi-calculator-page"),
  utm: utmSchema,
  hp: z.string().max(200).optional().default(""),
};

/**
 * V1 envelope. `calculationVersion` is optional here so every payload that
 * validated before V2 existed still validates unchanged.
 */
export const roiLeadSchema = z.object({
  ...leadEnvelope,
  calculationVersion: z.literal("v1").optional(),
  input: roiInputSchema,
  result: roiResultSchema,
});

export type RoiLeadInput = z.infer<typeof roiLeadSchema>;

/* ------------------------------------------------------------------------ */
/* V2 — geo-economic scorecard                                               */
/* ------------------------------------------------------------------------ */

export const laborScopeKeySchema = z.enum([
  "calls",
  "customer_communication",
  "scheduling",
  "dispatch",
  "crm_admin",
  "quote_followup",
  "billing",
  "operations_admin",
  "custom",
]);

export const laborScopeEntrySchema = z.object({
  scope: laborScopeKeySchema,
  hoursPerWeek: z.coerce.number().min(0, "Hours per week cannot be negative.").max(168, "Hours per week must be 168 or less."),
  workerType: z.enum(["owner", "manager", "employee", "contractor"]),
  recoverabilityPercent: percent("Addressability").optional(),
});

export const serviceEconomicsSchema = z.object({
  name: text("Primary product or service", 120),
  averageSaleValue: dollars("Average sale value").optional(),
  grossMarginPercent: percent("Gross margin").optional(),
  grossProfitPerSale: dollars("Gross profit per sale").optional(),
  monthlyOpportunityShare: percent("Opportunity share").optional(),
});

export const revenueLeakScenarioSchema = z.object({
  monthlyInboundOpportunities: count("Monthly inbound opportunities"),
  currentCloseRate: percent("Current close rate"),
  missedCallsPerMonth: count("Missed calls per month"),
  afterHoursCallsPerMonth: count("After-hours calls per month"),
  unfollowedQuotesPerMonth: count("Unworked quotes per month"),
  historicalQuoteCloseRate: percent("Historical quote close rate").optional(),
  leadsAffectedPerMonth: count("Slow-response leads per month"),
  responseCloseRateLift: percent("Speed-to-lead lift").optional(),
  qualifiedOpportunityRate: percent("Qualified opportunity rate").optional(),
  missedCallRecoverabilityPercent: percent("Missed-call recoverability").optional(),
  afterHoursCaptureRatePercent: percent("After-hours capture rate").optional(),
  quoteRecoverabilityPercent: percent("Quote recoverability").optional(),
  inputBasis: z.enum(["measured", "estimated"]).default("estimated"),
});

export const websiteConversionSchema = z.object({
  monthlyWebsiteVisitors: count("Monthly website visitors", 100000000),
  currentConversionRate: percent("Current conversion rate"),
  modeledConversionRate: percent("Modeled conversion rate"),
  qualifiedLeadRate: percent("Qualified lead rate"),
});

export const calculatorPresetSchema = z.enum(["revenue_leak", "responseos", "operations", "website", "ai_roi"]);

export const revenueLeakScorecardInputSchema = z.object({
  calculationVersion: z.literal("v2-geo-economic"),
  preset: calculatorPresetSchema.optional(),
  zipCode: z
    .string({ required_error: "ZIP code is required." })
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, "Enter a 5-digit US ZIP code."),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  state: z.string().trim().max(2).optional().or(z.literal("")),
  industry: text("Industry"),
  companySize: text("Company size"),
  monthlyRevenue: text("Monthly revenue range"),
  laborScopes: z.array(laborScopeEntrySchema).max(20, "Too many labor scopes."),
  burdenMultiplier: z.coerce
    .number()
    .min(MIN_BURDEN_MULTIPLIER, "Burden multiplier cannot be below 1.")
    .max(MAX_BURDEN_MULTIPLIER, "Burden multiplier is too high.")
    .optional(),
  ownerHourlyValue: dollars("Owner hourly value", 5000).optional(),
  service: serviceEconomicsSchema,
  leakage: revenueLeakScenarioSchema,
  website: websiteConversionSchema.optional(),
  errorsPerMonth: count("Errors per month"),
  costPerError: dollars("Cost per error"),
  preventableErrorRate: percent("Preventable error rate"),
  avoidedHireMonthlyCost: dollars("Avoided hire monthly cost"),
  headcountAvoidanceRate: percent("Headcount avoidance rate"),
  implementationBudget: dollars("Implementation budget"),
  timelineExpectation: text("Timeline expectation"),
  internalOwner: text("Internal owner/readiness"),
  processClarity: rating,
  dataQuality: rating,
  sopMaturity: rating,
  toolFragmentation: rating,
  teamAdoption: rating,
  name: text("Name", 120),
  email: z.string({ required_error: "Email is required." }).trim().email("Enter a valid email address.").max(254),
  company: text("Company", 160),
  phone: z.string().trim().max(60, "Phone is too long.").optional().or(z.literal("")),
  message: z.string().trim().max(1000, "Context is too long.").optional().or(z.literal("")),
});

/**
 * V2 envelope carries inputs only. The server resolves geography and
 * benchmarks, calculates, and returns the authoritative result; nothing the
 * browser computed is trusted or even accepted.
 */
export const revenueLeakScorecardLeadSchema = z.object({
  ...leadEnvelope,
  calculationVersion: z.literal("v2-geo-economic"),
  input: revenueLeakScorecardInputSchema,
});

export type RevenueLeakScorecardLeadInput = z.infer<typeof revenueLeakScorecardLeadSchema>;

export const anyRoiLeadSchema = z.discriminatedUnion("calculationVersion", [
  revenueLeakScorecardLeadSchema,
  // V1 payloads predate the discriminator; `parseRoiLead` fills it in.
  roiLeadSchema.extend({ calculationVersion: z.literal("v1") }),
]);

export type AnyRoiLead = z.infer<typeof anyRoiLeadSchema>;

/** Routes a raw body to the right schema without breaking V1 payloads that carry no version. */
export function parseRoiLead(json: unknown) {
  const version =
    json && typeof json === "object" && "calculationVersion" in json
      ? (json as { calculationVersion?: unknown }).calculationVersion
      : undefined;
  const body = version == null && json && typeof json === "object" ? { ...(json as object), calculationVersion: "v1" } : json;
  return anyRoiLeadSchema.safeParse(body);
}
