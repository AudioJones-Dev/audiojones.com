/**
 * Stripe webhook handler.
 *
 * Verifies the signature, claims the event in stripe_webhook_events, and
 * projects payment/subscription state into NeonDB, marking the event
 * processed only once that projection commits — so a retry after a failed
 * projection redoes the work instead of acking it away.
 * Schema: db/migrations/004_stripe_payments.sql.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { env } from '@aj/config';
import {
  claimStripeWebhookEvent,
  markStripeWebhookEventProcessed,
  upsertStripePayment,
  upsertStripeSubscription,
} from '@/db/stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Stripe SDK init is deferred to request time so the build's page-data
// collection doesn't blow up when STRIPE_SECRET_KEY is unset (e.g. CI build).
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-10-29.clover',
    });
  }
  return _stripe;
}

export async function POST(request: NextRequest) {
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Webhook not configured: STRIPE_WEBHOOK_SECRET is unset' },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    );
  }

  // Stripe.Event.created is the ordering key for state projections —
  // delivery order is not guaranteed, so a delayed older event must not
  // overwrite a newer one.
  const eventCreatedAt = new Date(event.created * 1000);

  try {
    const claimed = await claimStripeWebhookEvent({
      stripeEventId: event.id,
      type: event.type,
      payload: event.data,
    });

    // Only skip when a previous delivery actually finished projecting.
    // An event that was recorded but never projected (projection threw,
    // Stripe retried) still has work to do.
    if (claimed.alreadyProcessed) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await upsertStripePayment({
          stripePaymentIntentId: paymentIntent.id,
          stripeCustomerId:
            typeof paymentIntent.customer === 'string'
              ? paymentIntent.customer
              : paymentIntent.customer?.id ?? null,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          product: paymentIntent.metadata?.product ?? null,
          eventCreatedAt,
        });
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await upsertStripeSubscription({
          stripeSubscriptionId: subscription.id,
          stripeCustomerId:
            typeof subscription.customer === 'string'
              ? subscription.customer
              : subscription.customer?.id ?? null,
          priceId: subscription.items.data[0]?.price.id ?? null,
          status: subscription.status,
          cancelledAt: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000)
            : null,
          product: subscription.metadata?.product ?? null,
          eventCreatedAt,
        });
        break;
      }

      default:
        // Event is recorded in stripe_webhook_events; no state projection.
        break;
    }

    await markStripeWebhookEventProcessed(claimed.id);

    return NextResponse.json({
      received: true,
      eventId: claimed.id,
      stripeEventId: event.id,
    });
  } catch (error) {
    console.error('Stripe webhook processing error:', error);
    return NextResponse.json(
      {
        error: 'Stripe webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
