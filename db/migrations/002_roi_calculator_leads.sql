CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS roi_calculator_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT NOT NULL,
  email_hash TEXT NOT NULL,
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
  agency_email_status TEXT DEFAULT 'pending',
  client_email_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS roi_calculator_leads_email_idx ON roi_calculator_leads (email_hash);
CREATE INDEX IF NOT EXISTS roi_calculator_leads_created_at_idx ON roi_calculator_leads (created_at DESC);
