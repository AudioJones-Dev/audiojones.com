-- Incident store for the public /status page and admin incident tooling.
--
-- Replaces the legacy Firestore `incidents`, `runbooks`, and
-- `incident_subscriptions` collections. Timeline entries are embedded as a
-- JSONB array of { ts, type, message, meta? } objects — the exact shape the
-- /status page and admin incident views render.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE incident_status AS ENUM (
    'open',
    'investigating',
    'monitoring',
    'resolved'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE incident_severity AS ENUM (
    'info',
    'warning',
    'critical'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  title TEXT NOT NULL,
  status incident_status NOT NULL DEFAULT 'open',
  severity incident_severity NOT NULL DEFAULT 'info',
  priority TEXT,
  source TEXT NOT NULL DEFAULT 'system',
  description TEXT,

  affected_components JSONB NOT NULL DEFAULT '[]'::jsonb,
  related_alert_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  timeline JSONB NOT NULL DEFAULT '[]'::jsonb,

  runbook_id UUID,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_incidents_updated_at
  ON incidents(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_incidents_status
  ON incidents(status);

CREATE INDEX IF NOT EXISTS idx_incidents_source
  ON incidents(source);

CREATE TABLE IF NOT EXISTS runbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name TEXT NOT NULL,
  source TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_runbooks_source_active
  ON runbooks(source) WHERE active;

CREATE TABLE IF NOT EXISTS incident_subscriptions (
  -- Composite key "<incident_id>_<sanitized subscriber>" carried over from
  -- the legacy store so re-subscribes stay idempotent.
  id TEXT PRIMARY KEY,

  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  subscriber TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'slack',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_incident_subscriptions_incident
  ON incident_subscriptions(incident_id) WHERE active;

CREATE INDEX IF NOT EXISTS idx_incident_subscriptions_subscriber
  ON incident_subscriptions(subscriber) WHERE active;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_incidents_updated_at ON incidents;

CREATE TRIGGER trg_incidents_updated_at
BEFORE UPDATE ON incidents
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_runbooks_updated_at ON runbooks;

CREATE TRIGGER trg_runbooks_updated_at
BEFORE UPDATE ON runbooks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
