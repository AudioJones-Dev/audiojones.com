/**
 * Event-Enhanced Stripe Webhook Handler
 * 
 * Integrates the existing Stripe webhook with the new event streaming system
 * to provide real-time event correlation and automated workflows.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server/firebaseAdmin';
import { EventPublisher, WebhookEventHandler } from '@/lib/streaming/EventIntegrations';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Stripe SDK init is deferred to request time so the build's page-data
// collection doesn't blow up when STRIPE_SECRET_KEY is unset (e.g. CI build).
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-10-29.clover',
    });
  }
  return _stripe;
}

export async function POST(request: NextRequest) {
  console.log('💳 Stripe webhook received with event streaming integration');
  
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  try {
    // Verify webhook signature (existing logic)
    const event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    // Store webhook data (existing logic)
    const db = getDb();
    const webhookDoc = {
      stripeEventId: event.id,
      type: event.type,
      data: event.data,
      timestamp: new Date(),
      processed: false,
    };

    const docRef = await db.collection('stripe_webhooks').add(webhookDoc);
    console.log('📝 Stripe webhook stored:', docRef.id);

    // NEW: Publish to event streaming system
    try {
      const eventId = await WebhookEventHandler.handleStripeWebhook(event);
      console.log('📡 Event published to streaming system:', eventId);
      
      // Update webhook doc with event correlation
      await docRef.update({
        processed: true,
        eventId: eventId,
        streamingProcessed: true,
      });
      
    } catch (streamingError) {
      console.error('❌ Failed to publish to event streaming:', streamingError);
      
      // Mark as processed but with streaming error
      await docRef.update({
        processed: true,
        streamingError: streamingError instanceof Error ? streamingError.message : 'Unknown error',
      });
    }

    // Process different webhook types (existing + enhanced logic)
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, docRef.id);
        break;
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, docRef.id);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, docRef.id);
        break;
        
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, docRef.id);
        break;
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, docRef.id);
        break;
        
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer, docRef.id);
        break;
        
      default:
        console.log(`📋 Unhandled Stripe webhook type: ${event.type}`);
        // Still publish as generic webhook event
        await EventPublisher.publishSystemEvent({
          component: 'stripe_webhook',
          level: 'info',
          message: `Received unhandled webhook type: ${event.type}`,
          details: { 
            type: event.type, 
            stripeEventId: event.id,
            objectType: (event.data.object as any)?.object || 'unknown',
          },
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Stripe webhook processed successfully',
      webhookId: docRef.id,
      stripeEventId: event.id,
      eventStreaming: true,
    });

  } catch (error) {
    console.error('💥 Stripe webhook processing error:', error);
    
    // Publish error event
    try {
      await EventPublisher.publishSystemEvent({
        component: 'stripe_webhook',
        level: 'error',
        message: 'Webhook processing failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          signature: signature ? 'present' : 'missing',
        },
      });
    } catch (eventError) {
      console.error('Failed to publish error event:', eventError);
    }

    return NextResponse.json(
      { 
        error: 'Stripe webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent, webhookId: string) {
  console.log('💰 Processing successful payment intent');
  
  try {
    const db = getDb();
    
    // Store payment record (existing logic)
    await db.collection('payments').add({
      stripePaymentIntentId: paymentIntent.id,
      customerId: paymentIntent.customer as string,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'completed',
      timestamp: new Date(),
      webhookId,
    });

    // NEW: Publish detailed payment event
    await EventPublisher.publishPaymentEvent({
      customerId: paymentIntent.customer as string,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'completed',
      paymentMethod: paymentIntent.payment_method_types[0] || 'unknown',
      metadata: {
        source: 'stripe',
        webhookId,
        stripePaymentIntentId: paymentIntent.id,
        correlationId: `payment_${paymentIntent.customer}_${Date.now()}`,
      },
    });

    // NEW: Update customer lifetime value
    await EventPublisher.publishSystemEvent({
      component: 'customer_analytics',
      level: 'info',
      message: 'Payment completed - update customer LTV',
      details: {
        customerId: paymentIntent.customer,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        paymentMethod: paymentIntent.payment_method_types[0],
      },
      metadata: {
        correlationId: `ltv_update_${paymentIntent.customer}_${Date.now()}`,
      },
    });

    console.log('✅ Payment intent success processed with event streaming');
    
  } catch (error) {
    console.error('❌ Payment intent success processing error:', error);
    throw error;
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, webhookId: string) {
  console.log('📝 Processing Stripe subscription creation');
  
  try {
    const db = getDb();
    
    // Store subscription record (existing logic)
    await db.collection('subscriptions').add({
      stripeSubscriptionId: subscription.id,
      customerId: subscription.customer as string,
      planId: subscription.items.data[0]?.price.id,
      status: subscription.status,
      timestamp: new Date(),
      webhookId,
    });

    // NEW: Publish subscription event
    const eventId = await EventPublisher.publishSystemEvent({
      component: 'subscription_manager',
      level: 'info',
      message: 'New Stripe subscription created',
      details: {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        planId: subscription.items.data[0]?.price.id,
        status: subscription.status,
        amount: subscription.items.data[0]?.price.unit_amount,
        currency: subscription.items.data[0]?.price.currency,
      },
      metadata: {
        correlationId: `subscription_${subscription.customer}_${Date.now()}`,
        source: 'stripe',
        webhookId,
      },
    });

    // NEW: Check if this is customer's first subscription
    const customerSubscriptions = await db.collection('subscriptions')
      .where('customerId', '==', subscription.customer)
      .get();

    if (customerSubscriptions.size === 1) {
      await EventPublisher.publishSystemEvent({
        component: 'customer_onboarding',
        level: 'info',
        message: 'First Stripe subscription - trigger welcome workflow',
        details: {
          customerId: subscription.customer,
          subscriptionId: subscription.id,
          planValue: subscription.items.data[0]?.price.unit_amount,
        },
        metadata: {
          correlationId: `welcome_${subscription.customer}_${Date.now()}`,
          causationId: eventId,
        },
      });
    }

    console.log('✅ Stripe subscription creation processed with event streaming');
    
  } catch (error) {
    console.error('❌ Stripe subscription creation processing error:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, webhookId: string) {
  console.log('❌ Processing Stripe subscription deletion');
  
  try {
    const db = getDb();
    
    // Update subscription record (existing logic)
    const subscriptions = await db.collection('subscriptions')
      .where('stripeSubscriptionId', '==', subscription.id)
      .get();

    if (!subscriptions.empty) {
      const subscriptionDoc = subscriptions.docs[0];
      await subscriptionDoc.ref.update({
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelWebhookId: webhookId,
      });
    }

    // NEW: Publish cancellation event
    await EventPublisher.publishSystemEvent({
      component: 'subscription_manager',
      level: 'warning',
      message: 'Stripe subscription cancelled',
      details: {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        cancelReason: subscription.cancellation_details?.reason || 'not_specified',
        cancelComment: subscription.cancellation_details?.comment,
      },
      metadata: {
        correlationId: `cancellation_${subscription.customer}_${Date.now()}`,
        source: 'stripe',
        webhookId,
      },
    });

    // NEW: Trigger churn analysis
    await EventPublisher.publishSystemEvent({
      component: 'churn_analysis',
      level: 'info',
      message: 'Stripe subscription cancelled - analyze churn factors',
      details: {
        customerId: subscription.customer,
        subscriptionId: subscription.id,
        subscriptionAge: subscription.created ? Date.now() - (subscription.created * 1000) : null,
        planId: subscription.items.data[0]?.price.id,
      },
      metadata: {
        correlationId: `churn_analysis_${subscription.customer}_${Date.now()}`,
      },
    });

    console.log('✅ Stripe subscription deletion processed with event streaming');
    
  } catch (error) {
    console.error('❌ Stripe subscription deletion processing error:', error);
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, webhookId: string) {
  console.log('💰 Processing successful invoice payment');
  
  try {
    // NEW: Publish invoice payment success event
    await EventPublisher.publishSystemEvent({
      component: 'billing_manager',
      level: 'info',
      message: 'Invoice payment succeeded',
      details: {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        amount: invoice.amount_paid,
        currency: invoice.currency,
      },
      metadata: {
        correlationId: `invoice_success_${invoice.customer}_${Date.now()}`,
        source: 'stripe',
        webhookId,
      },
    });

    console.log('✅ Invoice payment success processed with event streaming');
    
  } catch (error) {
    console.error('❌ Invoice payment success processing error:', error);
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, webhookId: string) {
  console.log('❌ Processing failed invoice payment');
  
  try {
    // NEW: Publish invoice payment failure event
    await EventPublisher.publishSystemEvent({
      component: 'billing_manager',
      level: 'error',
      message: 'Invoice payment failed',
      details: {
        invoiceId: invoice.id,
        customerId: invoice.customer,
        amount: invoice.amount_due,
        currency: invoice.currency,
      },
      metadata: {
        correlationId: `invoice_failed_${invoice.customer}_${Date.now()}`,
        source: 'stripe',
        webhookId,
      },
    });

    console.log('✅ Invoice payment failure processed with event streaming');
    
  } catch (error) {
    console.error('❌ Invoice payment failure processing error:', error);
    throw error;
  }
}

async function handleCustomerCreated(customer: Stripe.Customer, webhookId: string) {
  console.log('👤 Processing Stripe customer creation');
  
  try {
    const db = getDb();
    
    // Store customer record (existing logic)
    await db.collection('customers').add({
      stripeCustomerId: customer.id,
      email: customer.email,
      name: customer.name,
      created: new Date(customer.created * 1000),
      timestamp: new Date(),
      webhookId,
    });

    // NEW: Publish customer creation event
    await EventPublisher.publishSystemEvent({
      component: 'customer_management',
      level: 'info',
      message: 'New Stripe customer created',
      details: {
        customerId: customer.id,
        email: customer.email,
        name: customer.name,
        source: 'stripe',
      },
      metadata: {
        correlationId: `customer_${customer.id}_${Date.now()}`,
        webhookId,
      },
    });

    // NEW: Trigger lead scoring workflow
    await EventPublisher.publishSystemEvent({
      component: 'lead_scoring',
      level: 'info',
      message: 'New Stripe customer - calculate lead score',
      details: {
        customerId: customer.id,
        email: customer.email,
        source: 'stripe_direct',
        hasName: !!customer.name,
        hasPhone: !!customer.phone,
      },
      metadata: {
        correlationId: `lead_score_${customer.id}_${Date.now()}`,
      },
    });

    console.log('✅ Stripe customer creation processed with event streaming');
    
  } catch (error) {
    console.error('❌ Stripe customer creation processing error:', error);
    throw error;
  }
}