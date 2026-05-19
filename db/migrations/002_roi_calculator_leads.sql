-- Audio Jones ROI Calculator — canonical lead capture table.
--
-- Apply against any Postgres-compatible target (Neon, Supabase, RDS).
-- This is the source of truth for the columns referenced by
-- `src/lib/roi-calculator/roi-calculator-storage.ts`. Without this
-- migration the production insert fails and submissions are lost.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS roi_calculator_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  email TEXT NOT NULL,
  email_hash TEXT,
  ip_hash TEXT,
  user_agent TEXT,

  source TEXT,

  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,

  -- Full calculator input + computed result envelope. Schema-matched
  -- against `roiInputSchema` / `roiResultSchema` in
  -- `src/lib/roi-calculator/roi-calculator-schema.ts`.
  input JSONB NOT NULL,
  result JSONB NOT NULL,

  -- 'pending' | 'sent' | 'skipped' | 'failed'
  agency_email_status TEXT DEFAULT 'pending',
  client_email_status TEXT DEFAULT 'pending',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roi_calculator_leads_email
  ON roi_calculator_leads(email);

CREATE INDEX IF NOT EXISTS idx_roi_calculator_leads_created_at
  ON roi_calculator_leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_roi_calculator_leads_email_hash
  ON roi_calculator_leads(email_hash);
