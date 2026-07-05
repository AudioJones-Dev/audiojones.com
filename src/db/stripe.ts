// Stripe payment persistence — webhook events, payments, subscriptions.
//
// Writes to the stripe_* tables on NeonDB. Schema lives in
// db/migrations/004_stripe_payments.sql. Event inserts are idempotent on
// stripe_event_id so Stripe retries never double-process.

import "server-only";
import { getSql } from "./neon";

export type StoredWebhookEvent = {
  id: string;
};

export async function insertStripeWebhookEvent(input: {
  stripeEventId: string;
  type: string;
  payload: unknown;
}): Promise<StoredWebhookEvent | null> {
  const sql = getSql();

  const rows = (await sql`
    INSERT INTO stripe_webhook_events (stripe_event_id, type, payload)
    VALUES (${input.stripeEventId}, ${input.type}, ${JSON.stringify(input.payload)}::jsonb)
    ON CONFLICT (stripe_event_id) DO NOTHING
    RETURNING id::text AS id
  `) as Array<{ id: string }>;

  // No row means the event was already recorded (Stripe retry).
  return rows[0] ?? null;
}

export async function upsertStripePayment(input: {
  stripePaymentIntentId: string;
  stripeCustomerId: string | null;
  amount: number;
  currency: string;
  status: string;
}): Promise<void> {
  const sql = getSql();

  await sql`
    INSERT INTO stripe_payments (
      stripe_payment_intent_id, stripe_customer_id, amount, currency, status
    ) VALUES (
      ${input.stripePaymentIntentId}, ${input.stripeCustomerId},
      ${input.amount}, ${input.currency}, ${input.status}
    )
    ON CONFLICT (stripe_payment_intent_id) DO UPDATE SET
      stripe_customer_id = EXCLUDED.stripe_customer_id,
      amount = EXCLUDED.amount,
      currency = EXCLUDED.currency,
      status = EXCLUDED.status
  `;
}

export async function upsertStripeSubscription(input: {
  stripeSubscriptionId: string;
  stripeCustomerId: string | null;
  priceId: string | null;
  status: string;
  cancelledAt: Date | null;
}): Promise<void> {
  const sql = getSql();

  await sql`
    INSERT INTO stripe_subscriptions (
      stripe_subscription_id, stripe_customer_id, price_id, status, cancelled_at
    ) VALUES (
      ${input.stripeSubscriptionId}, ${input.stripeCustomerId},
      ${input.priceId}, ${input.status}, ${input.cancelledAt}
    )
    ON CONFLICT (stripe_subscription_id) DO UPDATE SET
      stripe_customer_id = EXCLUDED.stripe_customer_id,
      price_id = EXCLUDED.price_id,
      status = EXCLUDED.status,
      cancelled_at = EXCLUDED.cancelled_at
  `;
}
