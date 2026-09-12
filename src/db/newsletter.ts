// Newsletter subscriber persistence for /api/newsletter when
// NEWSLETTER_PROVIDER=neon.
//
// The field mapping lives in src/lib/newsletter/newsletter-row.ts so it can be
// tested without a database. Columns are defined in
// db/migrations/005_newsletter_subscribers.sql.

import "server-only";
import type { NewsletterInput } from "@/lib/newsletter/newsletter-schema";
import {
  toNewsletterRow,
  type MailerLiteSyncOutcome,
  type NewsletterRowContext,
} from "@/lib/newsletter/newsletter-row";
import { getSql } from "./neon";

// One row per address. A repeat signup is counted and keeps the first signup's
// attribution. The adapter sends every signup to MailerLite again, so a row
// goes back to 'pending' unless MailerLite has already accepted it; an address
// whose earlier sync failed is retried whenever it is submitted again.
export async function saveNewsletterSubscriber(
  input: NewsletterInput,
  ctx: NewsletterRowContext,
): Promise<{ id: string }> {
  const sql = getSql();
  const row = toNewsletterRow(input, ctx);

  const rows = (await sql`
    INSERT INTO newsletter_subscribers (
      email, consent_to_contact,
      source, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
      user_agent, ip_hash
    ) VALUES (
      ${row.email}, ${row.consentToContact},
      ${row.source}, ${row.utmSource}, ${row.utmMedium}, ${row.utmCampaign},
      ${row.utmTerm}, ${row.utmContent},
      ${row.userAgent}, ${row.ipHash}
    )
    ON CONFLICT (email) DO UPDATE SET
      submission_count = newsletter_subscribers.submission_count + 1,
      last_submitted_at = NOW(),
      consent_to_contact = COALESCE(
        EXCLUDED.consent_to_contact,
        newsletter_subscribers.consent_to_contact
      ),
      mailerlite_status = CASE
        WHEN newsletter_subscribers.mailerlite_status = 'synced' THEN 'synced'
        ELSE 'pending'
      END
    RETURNING id::text AS id
  `) as Array<{ id: string }>;

  const saved = rows[0];
  if (!saved) {
    throw new Error("Newsletter insert returned no rows");
  }
  return saved;
}

// A later failure or skip never overwrites 'synced'. It records that MailerLite
// accepted the address, and a failed retry does not undo that.
export async function recordMailerLiteSync(
  id: string,
  outcome: MailerLiteSyncOutcome,
): Promise<void> {
  const sql = getSql();
  const subscriberId = outcome.status === "synced" ? outcome.subscriberId : null;
  const lastError = outcome.status === "failed" ? outcome.error : null;
  const syncedAt = outcome.status === "synced" ? new Date().toISOString() : null;

  await sql`
    UPDATE newsletter_subscribers SET
      mailerlite_status = ${outcome.status},
      mailerlite_subscriber_id = COALESCE(${subscriberId}, mailerlite_subscriber_id),
      mailerlite_last_error = ${lastError},
      mailerlite_synced_at = COALESCE(${syncedAt}::timestamptz, mailerlite_synced_at)
    WHERE id = ${id}::uuid
      AND (mailerlite_status <> 'synced' OR ${outcome.status}::text = 'synced')
  `;
}
