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

  received_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_type
  ON stripe_webhook_events(type);

CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_received_at
  ON stripe_webhook_events(received_at DESC);

CREATE TABLE IF NOT EXISTS stripe_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  amount INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stripe_payments_customer
  ON stripe_payments(stripe_customer_id);

CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  price_id TEXT,
  status TEXT NOT NULL,
  cancelled_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
