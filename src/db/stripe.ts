// Stripe payment persistence — webhook events, payments, subscriptions.
//
// Writes to the stripe_* tables on NeonDB. Schema lives in
// db/migrations/004_stripe_payments.sql.
//
// Idempotency is a two-step claim: claimStripeWebhookEvent() records the
// event and reports whether its projection already committed, and
// markStripeWebhookEventProcessed() closes it out afterwards. Recording an
// event is not the same as having handled it — treating the two as one
// would strand any event whose projection failed midway, because Stripe's
// retry would see the row and skip the work.

import "server-only";
import { getSql } from "./neon";

export type ClaimedWebhookEvent = {
  id: string;
  /** True when a previous delivery already completed its projection. */
  alreadyProcessed: boolean;
};

/**
 * Records the event and reports whether it still needs projecting.
 *
 * Always returns a row: on conflict it touches `type` purely so RETURNING
 * yields the existing record (and takes a row lock, which serialises
 * concurrent deliveries of the same event).
 */
export async function claimStripeWebhookEvent(input: {
  stripeEventId: string;
  type: string;
  payload: unknown;
}): Promise<ClaimedWebhookEvent> {
  const sql = getSql();

  const rows = (await sql`
    INSERT INTO stripe_webhook_events (stripe_event_id, type, payload)
    VALUES (${input.stripeEventId}, ${input.type}, ${JSON.stringify(input.payload)}::jsonb)
    ON CONFLICT (stripe_event_id) DO UPDATE SET
      type = EXCLUDED.type
    RETURNING id::text AS id, (processed_at IS NOT NULL) AS already_processed
  `) as Array<{ id: string; already_processed: boolean }>;

  const row = rows[0];
  if (!row) {
    throw new Error(
      `Failed to claim Stripe webhook event ${input.stripeEventId}`,
    );
  }

  return { id: row.id, alreadyProcessed: row.already_processed };
}

/** Marks the event handled. Only call once the projection has committed. */
export async function markStripeWebhookEventProcessed(id: string): Promise<void> {
  const sql = getSql();

  await sql`
    UPDATE stripe_webhook_events
    SET processed_at = NOW()
    WHERE id = ${id}::uuid
  `;
}

export async function upsertStripePayment(input: {
  stripePaymentIntentId: string;
  stripeCustomerId: string | null;
  amount: number;
  currency: string;
  status: string;
  product: string | null;
  eventCreatedAt: Date;
}): Promise<void> {
  const sql = getSql();

  await sql`
    INSERT INTO stripe_payments (
      stripe_payment_intent_id, stripe_customer_id, amount, currency, status,
      product, last_event_at
    ) VALUES (
      ${input.stripePaymentIntentId}, ${input.stripeCustomerId},
      ${input.amount}, ${input.currency}, ${input.status},
      ${input.product}, ${input.eventCreatedAt.toISOString()}::timestamptz
    )
    ON CONFLICT (stripe_payment_intent_id) DO UPDATE SET
      stripe_customer_id = EXCLUDED.stripe_customer_id,
      amount = EXCLUDED.amount,
      currency = EXCLUDED.currency,
      status = EXCLUDED.status,
      product = COALESCE(EXCLUDED.product, stripe_payments.product),
      last_event_at = EXCLUDED.last_event_at
    WHERE stripe_payments.last_event_at IS NULL
       OR EXCLUDED.last_event_at >= stripe_payments.last_event_at
  `;
}

export async function upsertStripeSubscription(input: {
  stripeSubscriptionId: string;
  stripeCustomerId: string | null;
  priceId: string | null;
  status: string;
  cancelledAt: Date | null;
  product: string | null;
  eventCreatedAt: Date;
}): Promise<void> {
  const sql = getSql();

  await sql`
    INSERT INTO stripe_subscriptions (
      stripe_subscription_id, stripe_customer_id, price_id, status, cancelled_at,
      product, last_event_at
    ) VALUES (
      ${input.stripeSubscriptionId}, ${input.stripeCustomerId},
      ${input.priceId}, ${input.status},
      ${input.cancelledAt?.toISOString() ?? null}::timestamptz,
      ${input.product}, ${input.eventCreatedAt.toISOString()}::timestamptz
    )
    ON CONFLICT (stripe_subscription_id) DO UPDATE SET
      stripe_customer_id = EXCLUDED.stripe_customer_id,
      price_id = EXCLUDED.price_id,
      status = EXCLUDED.status,
      cancelled_at = EXCLUDED.cancelled_at,
      product = COALESCE(EXCLUDED.product, stripe_subscriptions.product),
      last_event_at = EXCLUDED.last_event_at
    WHERE stripe_subscriptions.last_event_at IS NULL
       OR EXCLUDED.last_event_at >= stripe_subscriptions.last_event_at
  `;
}
