-- Lead outbox — durable hand-off from website lead tables to HubSpot.
--
-- Each lead insert writes one row here in the same SQL statement, so a lead
-- can never be stored without its hand-off (and vice versa). The dispatcher
-- (src/lib/outbox/dispatcher.ts) claims due rows with a lease, delivers them,
-- and records each HubSpot object id as soon as it exists so a retry never
-- recreates it.
--
-- Additive and idempotent: creates one table and one index; touches nothing
-- that already exists. Safe to re-run.

CREATE TABLE IF NOT EXISTS lead_outbox (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- `<source>:<lead id>`; the unique constraint makes a duplicate hand-off
  -- for the same lead impossible.
  event_key           TEXT NOT NULL UNIQUE,
  source              TEXT NOT NULL
    CHECK (source IN ('apply', 'founder_intelligence', 'founder_gravity_audit', 'roi_calculator')),
  lead_id             TEXT NOT NULL,
  -- Versioned hand-off payload built at insert time (contact fields, note
  -- lines, optional task). See LeadHandoff in src/lib/outbox/handoff.ts.
  payload             JSONB NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'delivered', 'failed')),
  attempts            INTEGER NOT NULL DEFAULT 0,
  next_attempt_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_until        TIMESTAMPTZ,
  last_error          TEXT,
  hubspot_contact_id  TEXT,
  hubspot_note_id     TEXT,
  hubspot_task_id     TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_lead_outbox_due
  ON lead_outbox (next_attempt_at)
  WHERE status IN ('pending', 'processing');
