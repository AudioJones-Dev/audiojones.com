-- Founder Intelligence Systems Pilot Program — application table.
--
-- Pilot applications are captured at /founder-intelligence-systems-pilot
-- and persisted here. The shape is intentionally distinct from
-- applied_intelligence_leads: the pilot funnel asks about service-business
-- operations, not diagnostic-style scoring fields.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS pilot_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  website TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  industry TEXT,
  annual_revenue_range TEXT,
  team_size TEXT,
  current_crm TEXT,
  biggest_bottleneck TEXT,
  communication_channels TEXT,
  interest_level TEXT,

  consent_to_contact BOOLEAN DEFAULT FALSE,

  status TEXT DEFAULT 'new',

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

CREATE INDEX IF NOT EXISTS idx_pilot_applications_email
  ON pilot_applications(email);

CREATE INDEX IF NOT EXISTS idx_pilot_applications_status
  ON pilot_applications(status);

CREATE INDEX IF NOT EXISTS idx_pilot_applications_created_at
  ON pilot_applications(created_at DESC);

DROP TRIGGER IF EXISTS trg_pilot_applications_updated_at
  ON pilot_applications;

CREATE TRIGGER trg_pilot_applications_updated_at
BEFORE UPDATE ON pilot_applications
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
