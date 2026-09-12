-- ROI calculator lead capture.
--
-- src/lib/roi-calculator/roi-calculator-storage.ts has inserted into
-- roi_calculator_leads since the calculator shipped, but no migration ever
-- created the table: its only DDL lived in
-- docs/codex/roi-calculator-v1-brief.md §9.1. Migrations here are applied by
-- hand (docs/DEPLOYMENT.md), so production may already have the table from a
-- manual run of that brief — or the path may be returning 503. This file makes
-- the repo able to rebuild it either way.
--
-- Idempotent throughout: IF NOT EXISTS on the extension, table and indexes, and
-- CREATE OR REPLACE on the trigger function. If the table already exists it is
-- left untouched — this migration does not alter, retype or backfill an
-- existing table, so a hand-created schema that differs from this one is not
-- reconciled by running it. Check that separately before relying on it.
--
-- Columns match the insert in roi-calculator-storage.ts exactly.

CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS roi_calculator_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  email CITEXT NOT NULL,
  -- SHA-256 of the lowercased email with IP_HASH_SALT, used for dedupe.
  email_hash TEXT NOT NULL,
  -- SHA-256 of the IP with IP_HASH_SALT. Null when the salt is unset.
  ip_hash TEXT,
  user_agent TEXT,

  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,

  input JSONB NOT NULL,
  result JSONB NOT NULL,

  -- 'pending' | 'sent' | 'failed'. The lead is persisted before either email
  -- is attempted, so a failed send never loses the lead.
  agency_email_status TEXT DEFAULT 'pending',
  client_email_status TEXT DEFAULT 'pending',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS roi_calculator_leads_email_idx
  ON roi_calculator_leads (email_hash);

CREATE INDEX IF NOT EXISTS roi_calculator_leads_created_at_idx
  ON roi_calculator_leads (created_at DESC);

-- Same helper 002 defines; CREATE OR REPLACE keeps this file runnable on its own.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_roi_calculator_leads_updated_at
  ON roi_calculator_leads;

CREATE TRIGGER trg_roi_calculator_leads_updated_at
BEFORE UPDATE ON roi_calculator_leads
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
