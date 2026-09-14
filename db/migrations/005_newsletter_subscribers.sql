-- Newsletter subscribers: every form that posts to /api/newsletter.
--
-- Written by src/db/newsletter.ts when NEWSLETTER_PROVIDER=neon. The row is
-- saved before MailerLite is called, so a MailerLite outage or a revoked token
-- leaves the address here, marked 'failed', instead of losing it
-- (docs/DECISIONS.md, 2026-04-29: persist to Neon before optional
-- integrations).
--
-- Migrations here are applied by hand. Apply this one to the target database
-- BEFORE setting NEWSLETTER_PROVIDER=neon. In the other order every signup
-- fails its insert and the visitor gets a retry message.
--
-- Safe to re-run.

CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- One row per address, case-insensitively. A repeat signup updates it.
  email CITEXT NOT NULL UNIQUE,

  -- NULL when the form did not ask, which is not the same as declined.
  consent_to_contact BOOLEAN,

  -- First touch: set by the first signup and kept on later ones.
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,

  user_agent TEXT,
  ip_hash TEXT,

  submission_count INTEGER NOT NULL DEFAULT 1,
  last_submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- MailerLite sync, attempted after the row is saved and the visitor has
  -- their answer:
  --   pending  saved; the sync has not reported back, or never ran
  --   synced   MailerLite accepted the address at least once
  --   failed   MailerLite refused it or could not be reached; see
  --            mailerlite_last_error
  --   skipped  MAILERLITE_TOKEN was unset, so no sync was attempted
  mailerlite_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (mailerlite_status IN ('pending', 'synced', 'failed', 'skipped')),
  mailerlite_subscriber_id TEXT,
  mailerlite_last_error TEXT,
  mailerlite_synced_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Finding rows MailerLite has not accepted, for replay.
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_mailerlite_status
  ON newsletter_subscribers(mailerlite_status);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at
  ON newsletter_subscribers(created_at DESC);

-- Same definition as db/migrations/001_applied_intelligence_leads.sql,
-- repeated so this file does not depend on 001 having been applied.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_newsletter_subscribers_updated_at
  ON newsletter_subscribers;

CREATE TRIGGER trg_newsletter_subscribers_updated_at
BEFORE UPDATE ON newsletter_subscribers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
