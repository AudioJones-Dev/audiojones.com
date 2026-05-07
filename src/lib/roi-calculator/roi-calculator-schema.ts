import { z } from "zod";

const text = (label: string, max = 160) =>
  z.string({ required_error: `${label} is required.` }).trim().min(1, `${label} is required.`).max(max, `${label} is too long.`);

export const roiInputSchema = z.object({
  industry: text("Industry"),
  companySize: text("Company size"),
  monthlyRevenue: text("Monthly revenue range"),
  workflowType: text("Workflow bottleneck"),
  taskFrequency: text("Task frequency"),
  hoursPerWeek: z.coerce.number().min(1, "Hours per week must be at least 1.").max(168, "Hours per week must be 168 or less."),
  hourlyCost: z.coerce.number().min(1, "Hourly cost must be at least 1.").max(2000, "Hourly cost is too high."),
  errorFrequency: text("Error frequency"),
  monthlyReworkCost: z.coerce.number().min(0, "Monthly rework cost cannot be negative.").max(10000000, "Monthly rework cost is too high."),
  delayPain: text("Delay pain"),
  implementationBudget: z.coerce.number().min(0, "Implementation budget cannot be negative.").max(10000000, "Implementation budget is too high."),
  timelineExpectation: text("Timeline expectation"),
  internalOwner: text("Internal owner/readiness"),
  processClarity: z.coerce.number().int().min(1).max(5),
  dataQuality: z.coerce.number().int().min(1).max(5),
  sopMaturity: z.coerce.number().int().min(1).max(5),
  toolFragmentation: z.coerce.number().int().min(1).max(5),
  teamAdoption: z.coerce.number().int().min(1).max(5),
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
    laborSavings: z.number().nonnegative().max(100000000),
    reworkSavings: z.number().nonnegative().max(100000000),
    delayRecovery: z.number().nonnegative().max(100000000),
  }),
});

export const roiLeadSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(254),
  input: roiInputSchema,
  result: roiResultSchema,
  source: z.string().trim().max(120).optional().default("roi-calculator-page"),
  utm: z
    .object({
      utm_source: z.string().trim().max(120).optional(),
      utm_medium: z.string().trim().max(120).optional(),
      utm_campaign: z.string().trim().max(120).optional(),
      utm_term: z.string().trim().max(120).optional(),
      utm_content: z.string().trim().max(120).optional(),
    })
    .optional(),
  hp: z.string().max(200).optional().default(""),
});

export type RoiLeadInput = z.infer<typeof roiLeadSchema>;
