-- Stripe payment state — webhook events, payments, subscriptions.
--
-- Persistence target for /api/webhooks/stripe-enhanced. The webhook
-- inserts every verified event into stripe_webhook_events (idempotent on
-- stripe_event_id) and projects payment/subscription state into the two
-- state tables. No secret values are ever stored here.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  stripe_event_id TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- NULL until the state projection for this event has committed.
  -- Recording the event and projecting it are separate writes, so
  -- "row exists" must not be read as "already handled" — a retry of a
  -- half-finished event has to be allowed through.
  processed_at TIMESTAMPTZ,

  received_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE stripe_webhook_events
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_type
  ON stripe_webhook_events(type);

CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_received_at
  ON stripe_webhook_events(received_at DESC);

-- Ops: surfaces events Stripe stopped retrying while still unprojected.
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_unprocessed
  ON stripe_webhook_events(received_at DESC)
  WHERE processed_at IS NULL;

CREATE TABLE IF NOT EXISTS stripe_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  amount INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL,

  -- Catalog slug from the checkout session, carried through
  -- payment_intent_data.metadata. Without it a one-time payment is only
  -- identifiable by amount.
  product TEXT,

  -- Stripe.Event.created for the event that last wrote this row. Stripe
  -- does not guarantee delivery order, so writes are rejected when they
  -- carry an older timestamp than what is already stored.
  last_event_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE stripe_payments
  ADD COLUMN IF NOT EXISTS product TEXT,
  ADD COLUMN IF NOT EXISTS last_event_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_stripe_payments_customer
  ON stripe_payments(stripe_customer_id);

CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  price_id TEXT,
  status TEXT NOT NULL,
  cancelled_at TIMESTAMPTZ,

  -- Catalog slug from the checkout session, carried through
  -- subscription_data.metadata.
  product TEXT,

  -- Stripe.Event.created for the event that last wrote this row. Guards
  -- against a delayed subscription.updated overwriting a later
  -- subscription.deleted and resurrecting a cancelled subscription.
  last_event_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE stripe_subscriptions
  ADD COLUMN IF NOT EXISTS product TEXT,
  ADD COLUMN IF NOT EXISTS last_event_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer
  ON stripe_subscriptions(stripe_customer_id);

-- set_updated_at() is defined in 001; redefined here so this migration
-- can run standalone against a fresh database.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_stripe_payments_updated_at ON stripe_payments;

CREATE TRIGGER trg_stripe_payments_updated_at
BEFORE UPDATE ON stripe_payments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_stripe_subscriptions_updated_at ON stripe_subscriptions;

CREATE TRIGGER trg_stripe_subscriptions_updated_at
BEFORE UPDATE ON stripe_subscriptions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
