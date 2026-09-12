// Field mapping from a newsletter signup to a `newsletter_subscribers` row,
// and the shape of the MailerLite sync result recorded on it.
//
// Kept out of src/db/newsletter.ts, and therefore out of "server-only", so it
// can be unit-tested without a database or a server bundle. The SQL that
// consumes this lives in src/db/newsletter.ts; columns are defined in
// db/migrations/005_newsletter_subscribers.sql.

import type { NewsletterInput } from "./newsletter-schema";

export type NewsletterRowContext = {
  ipHash: string | null;
  userAgent: string | null;
};

// What happened when a saved address was sent to MailerLite. Each status is a
// value of the mailerlite_status column.
export type MailerLiteSyncOutcome =
  | { status: "synced"; subscriberId: string | null }
  | { status: "failed"; error: string }
  | { status: "skipped" };

const orNull = (value: string | undefined) =>
  value && value.trim() !== "" ? value : null;

export function toNewsletterRow(input: NewsletterInput, ctx: NewsletterRowContext) {
  return {
    email: input.email,
    // NewsletterForm sends no consent field today, so this is normally NULL:
    // not asked, which is not the same as declined.
    consentToContact: input.consent ?? null,

    source: orNull(input.source),
    utmSource: orNull(input.utmSource),
    utmMedium: orNull(input.utmMedium),
    utmCampaign: orNull(input.utmCampaign),
    utmTerm: orNull(input.utmTerm),
    utmContent: orNull(input.utmContent),

    userAgent: ctx.userAgent,
    ipHash: ctx.ipHash,
  };
}
