// Zod schema for the Founder Intelligence Systems Pilot Program
// application at /founder-intelligence-systems-pilot.
//
// Fields mirror the spec handoff. Persistence lives in
// db/migrations/002_pilot_applications.sql.

import { z } from "zod";

export const INDUSTRY_OPTIONS = [
  "Accessibility contractor",
  "Mobility equipment installer",
  "HVAC",
  "Roofing",
  "Plumbing",
  "Electrical contractor",
  "Field service business",
  "Other contractor / service business",
] as const;

export const REVENUE_RANGES = [
  "Under $250K",
  "$250K–$500K",
  "$500K–$1M",
  "$1M–$2M",
  "$2M–$5M",
  "$5M+",
] as const;

export const TEAM_SIZES = [
  "Just me",
  "2–5",
  "6–15",
  "16–50",
  "50+",
] as const;

export const INTEREST_LEVELS = [
  "Curious — exploring",
  "Ready soon — within 30–60 days",
  "Ready now — within 14 days",
] as const;

export const pilotApplicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  businessName: z.string().min(1, "Business name is required"),
  website: z
    .string()
    .url("Enter a valid URL (https://…)")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(1, "Phone is required"),

  industry: z.enum(INDUSTRY_OPTIONS, {
    errorMap: () => ({ message: "Pick an industry" }),
  }),
  annualRevenueRange: z.enum(REVENUE_RANGES, {
    errorMap: () => ({ message: "Pick a revenue range" }),
  }),
  teamSize: z.enum(TEAM_SIZES, {
    errorMap: () => ({ message: "Pick a team size" }),
  }),

  currentCrm: z.string().optional(),
  biggestBottleneck: z
    .string()
    .min(1, "Tell us what's blocking operations"),
  communicationChannels: z.string().optional(),

  interestLevel: z.enum(INTEREST_LEVELS, {
    errorMap: () => ({ message: "Pick an interest level" }),
  }),

  consentToContact: z.boolean().refine((v) => v === true, {
    message: "Consent is required",
  }),

  // Hidden / attribution
  sourcePage: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),

  // Honeypot — bots fill this; humans don't see it.
  website_url: z.string().max(0).optional(),
});

export type PilotApplicationInput = z.infer<typeof pilotApplicationSchema>;
