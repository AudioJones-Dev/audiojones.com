// Zod schema for newsletter subscriptions.
// Independent from the lead pipeline (`lead-schema.ts`) and the apply
// pipeline (`apply-schema.ts`). Purposefully lightweight — newsletter
// is the lowest-friction surface in the funnel.
//
// Live MailerLite path goes through `newsletter-storage.ts`'s
// `mailerliteAdapter`. Mock path is the default while the Developer
// API token re-rotation is pending.

import { z } from "zod";

export const NEWSLETTER_SOURCES = [
  "homepage-final-cta",
  "footer",
  "inline-blog",
  "diagnostic-thank-you",
  "direct",
] as const;

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email"),

  // Optional context — populated client-side from URL params on mount.
  source: z.enum(NEWSLETTER_SOURCES).optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),

  // Optional consent. UI hides the checkbox unless GDPR mode is on.
  // The schema accepts it if passed; absence is fine.
  consent: z.boolean().optional(),

  // Honeypot — bots fill this; humans never see it.
  hp: z.string().max(0).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
