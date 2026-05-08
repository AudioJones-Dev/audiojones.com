import { z } from "zod";
import { COMPANY_SIZE_OPTIONS, FREQUENCY_OPTIONS, IMPLEMENTATION_BUDGET_OPTIONS, INDUSTRY_OPTIONS, MATURITY_OPTIONS, REVENUE_OPTIONS, WORKFLOW_OPTIONS } from "@/lib/ai-roi-diagnostic/constants";
import type { DiagnosticInput, DiagnosticResult } from "@/lib/ai-roi-diagnostic/types";

const maturity = z.enum(MATURITY_OPTIONS, { errorMap: () => ({ message: "Choose Strong, Partial, or Weak" }) });
const optionalText = z.string().max(120, "Must be 120 characters or fewer").optional();
const nonNegative = z.number({ invalid_type_error: "Enter a number" }).min(0, "Must be zero or greater");

export const diagnosticInputSchema = z.object({
  industry: z.enum(INDUSTRY_OPTIONS, { errorMap: () => ({ message: "Choose an industry" }) }),
  companySize: z.enum(COMPANY_SIZE_OPTIONS, { errorMap: () => ({ message: "Choose a company size" }) }),
  monthlyRevenueRange: z.enum(REVENUE_OPTIONS, { errorMap: () => ({ message: "Choose a monthly revenue range" }) }),
  grossMarginRange: optionalText,
  businessModel: optionalText,
  workflowType: z.enum(WORKFLOW_OPTIONS, { errorMap: () => ({ message: "Choose a workflow" }) }),
  taskFrequency: z.enum(FREQUENCY_OPTIONS, { errorMap: () => ({ message: "Choose a task frequency" }) }),
  timePerTaskMinutes: z.number({ invalid_type_error: "Enter minutes per task" }).min(1, "Minutes must be at least 1"),
  peopleInvolved: z.number({ invalid_type_error: "Enter people involved" }).min(1, "People involved must be at least 1"),
  hourlyLaborCost: z.number({ invalid_type_error: "Enter hourly labor cost" }).min(1, "Hourly labor cost must be at least 1"),
  manualHandoffs: nonNegative.optional(),
  errorRatePercent: nonNegative.max(100, "Error rate cannot exceed 100").optional(),
  reworkTimeHours: nonNegative.optional(),
  customerWaitTimeHours: nonNegative.optional(),
  toolCount: nonNegative.optional(),
  approvalBottleneck: z.boolean().optional(),
  implementationBudgetRange: z.enum(IMPLEMENTATION_BUDGET_OPTIONS, { errorMap: () => ({ message: "Choose an implementation budget" }) }).optional(),
  monthlySoftwareBudget: nonNegative.optional(),
  internalTrainingHours: nonNegative.optional(),
  humanQaHoursPerWeek: nonNegative.optional(),
  adoptionTimelineMonths: nonNegative.optional(),
  sopMaturity: maturity,
  dataQuality: maturity,
  processClarity: maturity,
  kpiTracking: maturity.optional(),
  leadershipBuyIn: maturity.optional(),
  teamAdoptionRisk: maturity.optional(),
  existingAutomation: maturity.optional(),
  securityConstraints: maturity.optional(),
}) satisfies z.ZodType<DiagnosticInput>;

export const recommendationSchema = z.enum(["automate-now", "pilot-first", "fix-foundation", "measure-first", "take-signal-diagnostic", "not-yet"], { errorMap: () => ({ message: "Unknown recommendation state" }) });

export const diagnosticResultSchema = z.object({
  roiScore: z.number().min(0, "ROI score must be at least 0").max(100, "ROI score cannot exceed 100"),
  readinessScore: z.number().min(0, "Readiness score must be at least 0").max(100, "Readiness score cannot exceed 100"),
  priorityScore: z.number().min(0, "Priority score must be at least 0").max(100, "Priority score cannot exceed 100"),
  recommendation: recommendationSchema,
  conservativeAnnualImpact: z.number({ invalid_type_error: "Conservative impact must be a number" }),
  expectedAnnualImpact: z.number({ invalid_type_error: "Expected impact must be a number" }),
  aggressiveAnnualImpact: z.number({ invalid_type_error: "Aggressive impact must be a number" }),
  paybackMonths: z.number().min(0, "Payback cannot be negative"),
  bottleneck: z.object({
    label: z.string().min(1, "Bottleneck label is required"),
    annualLaborCost: z.number({ invalid_type_error: "Annual labor cost must be a number" }),
    annualFrictionCost: z.number({ invalid_type_error: "Annual friction cost must be a number" }),
    confidence: z.enum(["High", "Medium", "Low"], { errorMap: () => ({ message: "Choose a confidence value" }) }),
  }),
}) satisfies z.ZodType<DiagnosticResult>;

export const roiLeadSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  input: diagnosticInputSchema,
  result: diagnosticResultSchema,
  source: z.string().max(120, "Source must be 120 characters or fewer").optional().default("roi-calculator-page"),
  utm: z.object({
    utm_source: z.string().max(120, "UTM source must be 120 characters or fewer").optional(),
    utm_medium: z.string().max(120, "UTM medium must be 120 characters or fewer").optional(),
    utm_campaign: z.string().max(120, "UTM campaign must be 120 characters or fewer").optional(),
    utm_term: z.string().max(120, "UTM term must be 120 characters or fewer").optional(),
    utm_content: z.string().max(120, "UTM content must be 120 characters or fewer").optional(),
  }).optional(),
  hp: z.string().max(0, "Leave this field empty").optional(),
});

export type RoiLeadInput = z.infer<typeof roiLeadSchema>;
