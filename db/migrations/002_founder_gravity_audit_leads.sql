-- Audio Jones Founder Gravity Audit diagnostic lead capture.
--
-- Applies the canonical diagnostic asset as a site-runtime funnel. This stores
-- submitted reports and routing metadata only; it does not introduce Firebase,
-- payment state, or live CRM credentials.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM (
    'new',
    'reviewed',
    'qualified',
    'contacted',
    'booked',
    'closed_won',
    'closed_lost',
    'spam'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS founder_gravity_audit_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  consent_to_contact BOOLEAN DEFAULT FALSE,
  session_id TEXT NOT NULL,

  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  segment TEXT NOT NULL,
  gravity_load INTEGER NOT NULL DEFAULT 0,
  confidence_score INTEGER NOT NULL DEFAULT 0,
  top_fragility_zone TEXT,
  strongest_contradiction_signal TEXT,
  resonance_zone TEXT,

  suppressed BOOLEAN DEFAULT FALSE,
  suppression_reason TEXT,
  cta_label TEXT,
  cta_event TEXT,
  cta_href TEXT,

  attribution JSONB NOT NULL DEFAULT '{}'::jsonb,
  events JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration_seconds INTEGER,

  status lead_status DEFAULT 'new',
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,

  user_agent TEXT,
  ip_hash TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_founder_gravity_audit_leads_email
  ON founder_gravity_audit_leads(email);

CREATE INDEX IF NOT EXISTS idx_founder_gravity_audit_leads_segment
  ON founder_gravity_audit_leads(segment);

CREATE INDEX IF NOT EXISTS idx_founder_gravity_audit_leads_gravity_load
  ON founder_gravity_audit_leads(gravity_load DESC);

CREATE INDEX IF NOT EXISTS idx_founder_gravity_audit_leads_created_at
  ON founder_gravity_audit_leads(created_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_founder_gravity_audit_leads_updated_at
  ON founder_gravity_audit_leads;

CREATE TRIGGER trg_founder_gravity_audit_leads_updated_at
BEFORE UPDATE ON founder_gravity_audit_leads
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
