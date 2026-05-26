/**
 * Audio Jones Webhook Receiver
 * 
 * Sample endpoint that receives and verifies Audio Jones webhooks.
 * Demonstrates proper signature verification and event handling.
 * 
 * Expected headers:
 * - X-AJ-Signature: HMAC-SHA256 hex digest
 * - X-AJ-Timestamp: ISO timestamp
 * - X-AJ-Event: Event type (status_change, status_operational, etc.)
 * 
 * Body: JSON payload that was signed
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAjWebhook, extractWebhookHeaders, isValidEventType } from '@/lib/server/verifyAjWebhook';
import { getDb } from '@/lib/server/legacyAdmin';

interface WebhookEvent {
  event_id: string;
  event_type: string;
  payload: any;
  headers: {
    signature?: string;
    timestamp?: string;
    event?: string;
    userAgent?: string;
  };
  verified: boolean;
  received_at: string;
  source_ip?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get the shared secret from environment
    const secret = process.env.AJ_WEBHOOK_SHARED_SECRET;
    
    if (!secret) {
      console.error('AJ_WEBHOOK_SHARED_SECRET not configured');
      return NextResponse.json(
        { ok: false, reason: 'server-configuration-error' },
        { status: 500 }
      );
    }

    // Read raw body for signature verification
    const rawBody = await request.text();
    
    if (!rawBody) {
      return NextResponse.json(
        { ok: false, reason: 'empty-body' },
        { status: 400 }
      );
    }

    // Extract headers for logging
    const headers = extractWebhookHeaders(request);
    
    console.log('Received AJ webhook:', {
      contentLength: rawBody.length,
      headers,
      url: request.url,
    });

    // Verify the webhook signature
    const verifyResult = verifyAjWebhook({ req: request, rawBody, secret });
    
    if (!verifyResult.ok) {
      console.warn('AJ webhook verification failed:', verifyResult.reason);
      
      // Log failed verification attempt
      await logWebhookEvent({
        event_id: `failed_${Date.now()}`,
        event_type: headers.event || 'unknown',
        payload: null,
        headers,
        verified: false,
        received_at: new Date().toISOString(),
        source_ip: getClientIP(request),
      });

      return NextResponse.json(
        { ok: false, reason: verifyResult.reason },
        { status: 401 }
      );
    }

    // Parse the JSON payload
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('Failed to parse webhook JSON:', parseError);
      return NextResponse.json(
        { ok: false, reason: 'invalid-json' },
        { status: 400 }
      );
    }

    // Validate event type
    if (!isValidEventType(verifyResult.event!)) {
      console.warn('Invalid event type:', verifyResult.event);
      return NextResponse.json(
        { ok: false, reason: 'invalid-event-type' },
        { status: 400 }
      );
    }

    // Log successful webhook event
    const eventId = `aj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await logWebhookEvent({
      event_id: eventId,
      event_type: verifyResult.event!,
      payload,
      headers,
      verified: true,
      received_at: new Date().toISOString(),
      source_ip: getClientIP(request),
    });

    console.log(`AJ webhook processed successfully: ${eventId} (${verifyResult.event})`);

    // Process the webhook based on event type
    await processWebhookEvent(verifyResult.event!, payload);

    return NextResponse.json({
      ok: true,
      event_id: eventId,
      event_type: verifyResult.event,
      message: 'Webhook processed successfully',
    });

  } catch (error) {
    console.error('Error processing AJ webhook:', error);
    
    return NextResponse.json(
      { ok: false, reason: 'internal-server-error' },
      { status: 500 }
    );
  }
}

/**
 * Log webhook event to Firestore
 */
async function logWebhookEvent(event: WebhookEvent): Promise<void> {
  try {
    await getDb().collection('aj_webhook_events').doc(event.event_id).set(event);
  } catch (error) {
    console.error('Failed to log webhook event:', error);
    // Don't throw - webhook processing should continue
  }
}

/**
 * Process webhook event based on type
 */
async function processWebhookEvent(eventType: string, payload: any): Promise<void> {
  try {
    switch (eventType) {
      case 'status_change':
        console.log('Processing status change:', payload.from, '→', payload.to);
        // Add your status change logic here
        break;
        
      case 'status_operational':
        console.log('System back to operational:', payload);
        // Add your operational recovery logic here
        break;
        
      case 'status_degraded':
        console.log('System degraded:', payload);
        // Add your degraded status logic here
        break;
        
      case 'status_outage':
        console.log('System outage detected:', payload);
        // Add your outage handling logic here
        break;
        
      default:
        console.log('Unknown event type:', eventType, payload);
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    // Don't throw - we've already verified and logged the webhook
  }
}

/**
 * Extract client IP address
 */
function getClientIP(request: NextRequest): string | undefined {
  // Check various headers for client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return undefined;
}

// Only POST method allowed
export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests with signed webhooks',
      documentation: 'See /docs for webhook format details'
    },
    { status: 405 }
  );
}

export async function PUT() {
  return GET();
}

export async function DELETE() {
  return GET();
}
