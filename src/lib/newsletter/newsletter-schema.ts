// Zod schema for newsletter subscriptions.
// Independent from the lead pipeline (`lead-schema.ts`) and the apply
// pipeline (`apply-schema.ts`). Purposefully lightweight — newsletter
// is the lowest-friction surface in the funnel.
//
// The live Resend path goes through the server-only adapter in
// `newsletter-storage.ts`; browser code never receives provider credentials.

import { z } from "zod";

export const NEWSLETTER_SOURCES = [
  "homepage-final-cta",
  "footer",
  "inline-blog",
  "direct",
] as const;

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email"),
  // Sent by legacy `/api/newsletter/subscribe` callers; the site form omits it.
  name: z.string().trim().max(100).optional(),

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
