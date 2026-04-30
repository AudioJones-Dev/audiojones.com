import { NextRequest } from 'next/server';
import { getFirestore } from "@/lib/legacy-stubs";
import { requireClient, AuthError, createAuthErrorResponse } from '@/lib/server/requireClient';
import { sendAlertNotification } from '@/lib/server/notify';

/**
 * Client Billing Portal API Route
 * 
 * Provides authenticated clients with access to their billing management portal.
 * Returns portal links for Whop or Stripe based on the client's subscription type.
 * This closes the revenue loop by enabling self-service billing management.
 */

interface BillingPortalResponse {
  ok: boolean;
  portal_url?: string;
  provider?: 'whop' | 'stripe' | 'manual';
  subscription_info?: {
    billing_sku: string;
    tier_id: string;
    status: string;
  };
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate the client and get their email
    const userEmail = await requireClient(request);

    // Get Firestore instance
    const db = getFirestore();

    // Fetch customer billing information
    const customerDoc = await db.collection('customers').doc(userEmail).get();
    
    if (!customerDoc.exists) {
      return Response.json({
        ok: false,
        error: 'customer_not_found'
      }, { status: 404 });
    }

    const customerData = customerDoc.data();
    const billingSkuMap = customerData?.billing_sku;
    const tierId = customerData?.tier_id;
    const serviceId = customerData?.service_id;
    const status = customerData?.status;

    if (!billingSkuMap || !tierId) {
      return Response.json({
        ok: false,
        error: 'billing_info_incomplete',
        message: 'No billing information found for your account'
      }, { status: 400 });
    }

    // Determine billing provider based on billing_sku pattern
    let provider: 'whop' | 'stripe' | 'manual' = 'manual';
    let portalUrl: string | null = null;

    // Check if this is a Whop-managed subscription
    if (billingSkuMap.startsWith('whop-') || serviceId?.includes('whop')) {
      provider = 'whop';
      
      // For Whop, we'll direct them to their Whop customer portal
      // Note: Whop customer portal URL format may vary based on their setup
      portalUrl = `https://whop.com/hub/memberships`;
      
      // If we have specific Whop customer ID, we could make this more specific:
      // const whopCustomerId = customerData?.whop_customer_id;
      // if (whopCustomerId) {
      //   portalUrl = `https://whop.com/hub/memberships/${whopCustomerId}`;
      // }
      
    } else if (billingSkuMap.includes('stripe') || serviceId?.includes('stripe')) {
      provider = 'stripe';
      
      // For Stripe, we'd create a customer portal session
      // This requires Stripe integration which we can add later
      const stripeCustomerId = customerData?.stripe_customer_id;
      
      if (stripeCustomerId) {
        // TODO: Create Stripe customer portal session
        // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        // const session = await stripe.billingPortal.sessions.create({
        //   customer: stripeCustomerId,
        //   return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/portal/client`,
        // });
        // portalUrl = session.url;
        
        // For now, direct to Stripe customer portal (they'd need to log in)
        portalUrl = 'https://billing.stripe.com/p/login';
      } else {
        return Response.json({
          ok: false,
          error: 'stripe_customer_not_found',
          message: 'Stripe customer ID not found in your account'
        }, { status: 400 });
      }
      
    } else {
      // Manual/direct billing - provide contact information
      provider = 'manual';
      portalUrl = '/contact?subject=billing'; // Internal contact page
    }

    const response: BillingPortalResponse = {
      ok: true,
      portal_url: portalUrl || undefined,
      provider,
      subscription_info: {
        billing_sku: billingSkuMap,
        tier_id: tierId,
        status: status || 'unknown'
      }
    };

    // If no portal URL was generated, provide helpful message
    if (!portalUrl) {
      response.error = 'portal_unavailable';
      response.ok = false;
      return Response.json(response, { status: 400 });
    }

    return Response.json(response);

  } catch (error) {
    console.error('Client billing portal error:', error);
    
    // Handle authentication errors
    if (error instanceof AuthError) {
      return createAuthErrorResponse(error);
    }
    
    return Response.json({ 
      ok: false, 
      error: 'internal_server_error' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle billing portal actions (upgrade/downgrade requests)
    const userEmail = await requireClient(request);
    
    let actionData;
    try {
      actionData = await request.json();
    } catch {
      return Response.json({
        ok: false,
        error: 'invalid_json'
      }, { status: 400 });
    }

    const { action, target_tier, target_sku } = actionData;

    if (!action || !['upgrade', 'downgrade', 'cancel'].includes(action)) {
      return Response.json({
        ok: false,
        error: 'invalid_action',
        message: 'Action must be upgrade, downgrade, or cancel'
      }, { status: 400 });
    }

    // Log the billing action request in Firestore
    const db = getFirestore();
    
    await db.collection('billing_requests').add({
      customer_email: userEmail,
      action,
      target_tier: target_tier || null,
      target_sku: target_sku || null,
      requested_at: new Date().toISOString(),
      status: 'pending',
      source: 'client_portal'
    });

    // Create an admin alert for manual processing
    const alertData = {
      category: 'billing',
      severity: 'medium',
      title: `Billing ${action} request`,
      message: `Customer ${userEmail} requested ${action}${target_tier ? ` to ${target_tier}` : ''}`,
      created_at: new Date().toISOString(),
      resolved: false,
      metadata: {
        customer_email: userEmail,
        action,
        target_tier,
        target_sku
      }
    };
    
    // Write alert to Firestore
    await db.collection('alerts').add(alertData);
    
    // Send outbound notification
    await sendAlertNotification({
      type: 'billing',
      severity: 'warning',
      message: alertData.message,
      created_at: alertData.created_at,
      source: 'client_portal',
      email: userEmail,
      meta: {
        action,
        target_tier,
        target_sku
      }
    });

    return Response.json({
      ok: true,
      message: `Your ${action} request has been submitted and will be processed within 24 hours.`,
      request_id: Date.now().toString() // Simple request ID
    });

  } catch (error) {
    console.error('Billing action request error:', error);
    
    if (error instanceof AuthError) {
      return createAuthErrorResponse(error);
    }
    
    return Response.json({ 
      ok: false, 
      error: 'internal_server_error' 
    }, { status: 500 });
  }
}