/**
 * Discord Webhook Endpoint
 * 
 * Handles Discord application webhooks with proper signature verification.
 * See Discord Developer Portal for webhook configuration.
 */

import { verifyKey } from 'discord-interactions';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server/legacyAdmin';
import { sendAlertNotification } from '@/lib/server/notify';

export async function POST(req: NextRequest) {
  try {
    // Get Discord signature headers
    const signature = req.headers.get('x-signature-ed25519');
    const timestamp = req.headers.get('x-signature-timestamp');
    const body = await req.text();

    // Verify Discord signature using public key
    const publicKey = process.env.DISCORD_PUBLIC_KEY;
    
    if (!publicKey) {
      console.error('❌ DISCORD_PUBLIC_KEY not configured');
      return NextResponse.json(
        { error: 'Discord public key not configured' },
        { status: 500 }
      );
    }

    if (!signature || !timestamp) {
      console.error('❌ Missing Discord signature headers');
      return NextResponse.json(
        { error: 'Missing signature headers' },
        { status: 400 }
      );
    }

    // Verify the signature
    const isValid = verifyKey(body, signature, timestamp, publicKey);
    
    if (!isValid) {
      console.error('❌ Invalid Discord signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const json = JSON.parse(body);
    console.log('📨 Discord webhook received:', { type: json.type, data: json.data ? 'present' : 'none' });

    // Handle Discord verification ping
    if (json.type === 1) {
      console.log('🏓 Discord verification ping received');
      return NextResponse.json({ type: 1 });
    }

    // Handle Discord application events
    await handleDiscordEvent(json);

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('❌ Discord webhook processing failed:', error);
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Process Discord application events
 */
async function handleDiscordEvent(event: any): Promise<void> {
  try {
    console.log('🎮 Processing Discord event:', event.type);

    // Store event in Firestore for audit trail
    await getDb().collection('discord_events').add({
      event_type: event.type,
      event_data: event.data || {},
      received_at: new Date().toISOString(),
      processed_at: new Date().toISOString(),
      source: 'discord-webhook'
    });

    // Handle specific event types
    switch (event.type) {
      case 0: // APPLICATION_AUTHORIZED
        await handleApplicationAuthorized(event.data);
        break;
        
      case 2: // ENTITLEMENT_CREATE
        await handleEntitlementCreate(event.data);
        break;
        
      case 3: // ENTITLEMENT_UPDATE
        await handleEntitlementUpdate(event.data);
        break;
        
      case 4: // ENTITLEMENT_DELETE
        await handleEntitlementDelete(event.data);
        break;
        
      default:
        console.log(`ℹ️ Unhandled Discord event type: ${event.type}`);
    }

  } catch (error) {
    console.error('❌ Failed to process Discord event:', error);
    
    // Create alert for processing failures
    await sendAlertNotification({
      type: 'discord',
      severity: 'warning',
      message: `Failed to process Discord webhook event: ${error instanceof Error ? error.message : 'Unknown error'}`,
      created_at: new Date().toISOString(),
      meta: {
        event_type: event.type,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      },
      source: 'discord-webhook'
    });
  }
}

/**
 * Handle application authorization events
 */
async function handleApplicationAuthorized(data: any): Promise<void> {
  console.log('✅ Discord application authorized:', data);
  
  // Send notification about new authorization
  await sendAlertNotification({
    type: 'discord',
    severity: 'info',
    message: `Discord application authorized by user`,
    created_at: new Date().toISOString(),
    meta: {
      event_type: 'application_authorized',
      user_id: data.user?.id,
      guild_id: data.guild?.id,
      application_id: data.application_id
    },
    source: 'discord-webhook'
  });

  // Store authorization record
  await getDb().collection('discord_authorizations').add({
    user_id: data.user?.id,
    guild_id: data.guild?.id,
    application_id: data.application_id,
    authorized_at: new Date().toISOString(),
    permissions: data.permissions || [],
    meta: data
  });
}

/**
 * Handle entitlement creation (subscriptions, purchases)
 */
async function handleEntitlementCreate(data: any): Promise<void> {
  console.log('💰 Discord entitlement created:', data);
  
  await sendAlertNotification({
    type: 'discord',
    severity: 'info',
    message: `New Discord entitlement created: ${data.sku_id}`,
    created_at: new Date().toISOString(),
    meta: {
      event_type: 'entitlement_create',
      entitlement_id: data.id,
      sku_id: data.sku_id,
      user_id: data.user_id,
      type: data.type
    },
    source: 'discord-webhook'
  });
}

/**
 * Handle entitlement updates
 */
async function handleEntitlementUpdate(data: any): Promise<void> {
  console.log('🔄 Discord entitlement updated:', data);
  
  await sendAlertNotification({
    type: 'discord',
    severity: 'info',
    message: `Discord entitlement updated: ${data.sku_id}`,
    created_at: new Date().toISOString(),
    meta: {
      event_type: 'entitlement_update',
      entitlement_id: data.id,
      sku_id: data.sku_id,
      user_id: data.user_id
    },
    source: 'discord-webhook'
  });
}

/**
 * Handle entitlement deletion (cancellations)
 */
async function handleEntitlementDelete(data: any): Promise<void> {
  console.log('❌ Discord entitlement deleted:', data);
  
  await sendAlertNotification({
    type: 'discord',
    severity: 'warning',
    message: `Discord entitlement deleted: ${data.sku_id}`,
    created_at: new Date().toISOString(),
    meta: {
      event_type: 'entitlement_delete',
      entitlement_id: data.id,
      sku_id: data.sku_id,
      user_id: data.user_id
    },
    source: 'discord-webhook'
  });
}

export const runtime = 'nodejs'; // Required for crypto libs in edge environments
