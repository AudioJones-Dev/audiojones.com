// Zod schema + reference enums for the deeper qualification form at /apply.
// /apply is the deeper-intent path that follows the diagnostic — it captures
// the specifics needed to scope an actual engagement.
//
// This schema is independent from `lead-schema.ts` (the 6-step diagnostic
// at /founder-intelligence/diagnostic). Both eventually feed the same Neon
// `applied_intelligence_leads` table, but apply payloads use a different
// shape and downstream router logic.

import { z } from "zod";

export const REVENUE_RANGES = [
  "Under $250K",
  "$250K–$500K",
  "$500K–$1M",
  "$1M–$2M",
  "$2M–$5M",
  "$5M+",
] as const;

export const GROWTH_STAGES = [
  "Pre-revenue / launching",
  "Early traction (<$250K)",
  "Scaling ($250K–$1M)",
  "Compounding ($1M–$5M)",
  "Past $5M",
] as const;

export const TEAM_SIZES = [
  "Just me",
  "2–5",
  "6–15",
  "16–50",
  "50+",
] as const;

export const TIMELINE_OPTIONS = [
  "Within 30 days",
  "Within 60 days",
  "Within 90 days",
  "Exploratory — no fixed timeline",
] as const;

export const BUDGET_RANGES = [
  "Under $5K",
  "$5K–$15K",
  "$15K–$35K",
  "$35K–$75K",
  "$75K+",
  "Not sure yet",
] as const;

export const APPLY_SOURCES = [
  "diagnostic",
  "homepage-cta",
  "pricing",
  "direct",
  "other",
] as const;

// Engagements the pricing ladder hands off to /apply. Ids and labels mirror
// `pricingOffers` in `src/content/pricing.ts`; the pairing is asserted in
// `test/pricing-offers.test.ts` so the two cannot drift. Offers that convert
// somewhere else (AI Readiness Score, Team AI Readiness Workshop) are absent
// on purpose.
export const APPLY_OFFERS = [
  { id: "revenue-leak-assessment", label: "Revenue Leak Assessment" },
  { id: "rekonr-revenue-recovery-diagnostic", label: "ReKonr Revenue Recovery Diagnostic" },
  { id: "responseos-managed-pilot", label: "ResponseOS Managed Pilot" },
  { id: "responseos-core", label: "ResponseOS Core" },
  { id: "founder-intelligence-system", label: "Founder Intelligence System" },
  { id: "managed-intelligence", label: "Managed Intelligence" },
  { id: "worksie-reference-pilot", label: "Worksie Reference Pilot" },
  { id: "strategic-partnership", label: "Strategic Partnership" },
] as const;

export type ApplyOfferId = (typeof APPLY_OFFERS)[number]["id"];

const APPLY_OFFER_IDS = APPLY_OFFERS.map((offer) => offer.id) as [
  ApplyOfferId,
  ...ApplyOfferId[],
];

export const applySchema = z.object({
  // About you
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  role: z.string().optional(),
  companyName: z.string().min(1, "Company name is required"),
  website: z
    .string()
    .url("Enter a valid URL (https://…)")
    .optional()
    .or(z.literal("")),

  // Business context
  annualRevenueRange: z.enum(REVENUE_RANGES, {
    errorMap: () => ({ message: "Pick a revenue range" }),
  }),
  currentGrowthStage: z.enum(GROWTH_STAGES).optional(),
  primaryConstraint: z.string().optional(),
  teamSize: z.enum(TEAM_SIZES).optional(),

  // Engagement scope
  offer: z.enum(APPLY_OFFER_IDS).optional(),
  desiredOutcome: z.string().min(1, "Tell me what outcome you want"),
  timeline: z.enum(TIMELINE_OPTIONS, {
    errorMap: () => ({ message: "Pick a timeline" }),
  }),
  budgetRange: z.enum(BUDGET_RANGES).optional(),

  // Anything else
  notes: z.string().optional(),

  // Source attribution (hidden — populated client-side from URL params)
  source: z.enum(APPLY_SOURCES).optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),

  // Consent
  consentToContact: z.boolean().refine((v) => v === true, {
    message: "Consent is required",
  }),

  // Honeypot — bots fill this; humans don't see it
  hp: z.string().max(0).optional(),
});

export type ApplyInput = z.infer<typeof applySchema>;
