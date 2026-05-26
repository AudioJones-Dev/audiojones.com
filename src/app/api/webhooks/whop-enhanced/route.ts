/**
 * Event-Enhanced Whop Webhook Handler
 * 
 * Integrates the existing Whop webhook with the new event streaming system
 * to provide real-time event correlation and automated workflows.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server/legacyAdmin';
import { EventPublisher, WebhookEventHandler } from '@/lib/streaming/EventIntegrations';

export async function POST(request: NextRequest) {
  console.log('🎣 Whop webhook received with event streaming integration');
  
  try {
    const body = await request.json();
    const { type, data } = body;

    // Validate webhook (existing logic)
    if (!type || !data) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    // Store webhook data (existing logic)
    const db = getDb();
    const webhookDoc = {
      type,
      data,
      timestamp: new Date(),
      processed: false,
    };

    const docRef = await db.collection('whop_webhooks').add(webhookDoc);
    console.log('📝 Webhook stored:', docRef.id);

    // NEW: Publish to event streaming system
    try {
      const eventId = await WebhookEventHandler.handleWhopWebhook(body);
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
    switch (type) {
      case 'payment:succeeded':
        await handlePaymentSuccess(data, docRef.id);
        break;
        
      case 'subscription:created':
        await handleSubscriptionCreated(data, docRef.id);
        break;
        
      case 'subscription:cancelled':
        await handleSubscriptionCancelled(data, docRef.id);
        break;
        
      default:
        console.log(`📋 Unhandled webhook type: ${type}`);
        // Still publish as generic webhook event
        await EventPublisher.publishSystemEvent({
          component: 'whop_webhook',
          level: 'info',
          message: `Received unhandled webhook type: ${type}`,
          details: { type, dataKeys: Object.keys(data) },
        });
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      webhookId: docRef.id,
      eventStreaming: true,
    });

  } catch (error) {
    console.error('💥 Whop webhook processing error:', error);
    
    // Publish error event
    try {
      await EventPublisher.publishSystemEvent({
        component: 'whop_webhook',
        level: 'error',
        message: 'Webhook processing failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        },
      });
    } catch (eventError) {
      console.error('Failed to publish error event:', eventError);
    }

    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(data: any, webhookId: string) {
  console.log('💰 Processing successful payment');
  
  try {
    const db = getDb();
    
    // Store payment record (existing logic)
    await db.collection('payments').add({
      whopPaymentId: data.id,
      customerId: data.customer_id,
      amount: data.amount,
      currency: data.currency,
      status: 'completed',
      timestamp: new Date(),
      webhookId,
    });

    // NEW: Publish detailed payment event with correlation
    await EventPublisher.publishPaymentEvent({
      customerId: data.customer_id,
      amount: data.amount,
      currency: data.currency,
      status: 'completed',
      paymentMethod: data.payment_method || 'whop',
      metadata: {
        source: 'whop',
        webhookId,
        whopPaymentId: data.id,
        correlationId: `payment_${data.customer_id}_${Date.now()}`,
      },
    });

    // NEW: Trigger customer analytics update
    await EventPublisher.publishSystemEvent({
      component: 'customer_analytics',
      level: 'info',
      message: 'Customer payment completed - update analytics',
      details: {
        customerId: data.customer_id,
        amount: data.amount,
        currency: data.currency,
      },
      metadata: {
        correlationId: `payment_${data.customer_id}_${Date.now()}`,
      },
    });

    console.log('✅ Payment success processed with event streaming');
    
  } catch (error) {
    console.error('❌ Payment success processing error:', error);
    throw error;
  }
}

async function handleSubscriptionCreated(data: any, webhookId: string) {
  console.log('📝 Processing subscription creation');
  
  try {
    const db = getDb();
    
    // Store subscription record (existing logic)
    await db.collection('subscriptions').add({
      whopSubscriptionId: data.id,
      customerId: data.customer_id,
      planId: data.plan_id,
      status: data.status,
      timestamp: new Date(),
      webhookId,
    });

    // NEW: Publish subscription event
    const eventId = await EventPublisher.publishSystemEvent({
      component: 'subscription_manager',
      level: 'info',
      message: 'New subscription created',
      details: {
        subscriptionId: data.id,
        customerId: data.customer_id,
        planId: data.plan_id,
        status: data.status,
      },
      metadata: {
        correlationId: `subscription_${data.customer_id}_${Date.now()}`,
        source: 'whop',
        webhookId,
      },
    });

    // NEW: Trigger welcome workflow if first subscription
    const customerSubscriptions = await db.collection('subscriptions')
      .where('customerId', '==', data.customer_id)
      .get();

    if (customerSubscriptions.size === 1) {
      await EventPublisher.publishSystemEvent({
        component: 'customer_onboarding',
        level: 'info',
        message: 'First subscription - trigger welcome workflow',
        details: {
          customerId: data.customer_id,
          subscriptionId: data.id,
        },
        metadata: {
          correlationId: `welcome_${data.customer_id}_${Date.now()}`,
          causationId: eventId,
        },
      });
    }

    console.log('✅ Subscription creation processed with event streaming');
    
  } catch (error) {
    console.error('❌ Subscription creation processing error:', error);
    throw error;
  }
}

async function handleSubscriptionCancelled(data: any, webhookId: string) {
  console.log('❌ Processing subscription cancellation');
  
  try {
    const db = getDb();
    
    // Update subscription record (existing logic)
    const subscriptions = await db.collection('subscriptions')
      .where('whopSubscriptionId', '==', data.id)
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
      message: 'Subscription cancelled',
      details: {
        subscriptionId: data.id,
        customerId: data.customer_id,
        reason: data.cancellation_reason || 'not_specified',
      },
      metadata: {
        correlationId: `cancellation_${data.customer_id}_${Date.now()}`,
        source: 'whop',
        webhookId,
      },
    });

    // NEW: Trigger retention workflow
    await EventPublisher.publishSystemEvent({
      component: 'customer_retention',
      level: 'info',
      message: 'Subscription cancelled - trigger retention workflow',
      details: {
        customerId: data.customer_id,
        subscriptionId: data.id,
        timeToCancel: data.created_at ? Date.now() - new Date(data.created_at).getTime() : null,
      },
      metadata: {
        correlationId: `retention_${data.customer_id}_${Date.now()}`,
      },
    });

    console.log('✅ Subscription cancellation processed with event streaming');
    
  } catch (error) {
    console.error('❌ Subscription cancellation processing error:', error);
    throw error;
  }
}