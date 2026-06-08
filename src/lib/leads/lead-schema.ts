import { z } from "zod";

export const REVENUE_RANGES = [
  "Under $250K",
  "$250K–$500K",
  "$500K–$1M",
  "$1M–$2M",
  "$2M–$5M",
  "$5M+",
] as const;

export const PRIMARY_CONSTRAINTS = [
  "Marketing unclear",
  "Sales inconsistent",
  "Operations noisy",
  "Team/process bottleneck",
  "AI/tool chaos",
  "Attribution problem",
  "Founder bottleneck",
  "Other",
] as const;

export const AI_USAGE_LEVELS = [
  "Not using AI yet",
  "Experimenting casually",
  "Using tools but no system",
  "Using AI in workflows",
  "Have AI automations but unclear ROI",
] as const;

export const TIMELINE_OPTIONS = [
  "Immediately",
  "30 days",
  "60 days",
  "90 days",
  "Exploring only",
] as const;

export const founderIntelligenceLeadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  role: z.string().optional(),

  annualRevenueRange: z.string().optional(),
  primaryConstraint: z.string().optional(),
  currentGrowthStage: z.string().optional(),
  biggestPain: z.string().optional(),
  whatHaveYouTried: z.string().optional(),

  crmUsed: z.string().optional(),
  analyticsUsed: z.string().optional(),
  projectManagementUsed: z.string().optional(),
  automationToolsUsed: z.string().optional(),
  contentSystemStatus: z.string().optional(),
  documentedSops: z.boolean().optional(),

  currentAiTools: z.string().optional(),
  aiUsageLevel: z.string().optional(),
  aiMainGoal: z.string().optional(),
  aiConcern: z.string().optional(),

  canIdentifyBestLeadSource: z.boolean().optional(),
  knowsCAC: z.boolean().optional(),
  knowsLTV: z.boolean().optional(),
  tracksConversionSource: z.boolean().optional(),
  attributionConfidence: z.number().min(1).max(10).optional(),
  desiredOutcome: z.string().optional(),

  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  preferredContactMethod: z.string().optional(),
  consentToContact: z.boolean().refine((v) => v === true, {
    message: "Consent is required.",
  }),

  // Honeypot
  website_url: z.string().max(0).optional(),

  sourcePage: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
});

export type FounderIntelligenceLeadInput = z.infer<
  typeof founderIntelligenceLeadSchema
>;
