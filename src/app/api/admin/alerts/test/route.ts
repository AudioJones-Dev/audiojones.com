/**
 * Admin Alert Test Endpoint
 * 
 * Allows admins to send test alerts to verify notification system.
 * Creates test alert in Firestore and sends outbound notification.
 */

import { NextRequest } from 'next/server';
import { getDb } from '@/lib/server/legacyAdmin';
import { requireAdmin } from '@/lib/server/requireAdmin';
import { sendAlertNotification } from '@/lib/server/notify';

interface TestAlertRequest {
  message?: string;
  severity?: 'info' | 'warning' | 'critical';
  type?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    requireAdmin(request);
    
    console.log('🧪 Processing admin alert test request...');
    
    // Parse request body
    let body: TestAlertRequest;
    try {
      body = await request.json();
    } catch (error) {
      return Response.json({
        ok: false,
        error: 'invalid_json',
        message: 'Request body must be valid JSON'
      }, { status: 400 });
    }

    // Extract and validate parameters
    const {
      message = 'Test alert from admin panel',
      severity = 'warning',
      type = 'test'
    } = body;

    // Validate severity
    if (!['info', 'warning', 'critical'].includes(severity)) {
      return Response.json({
        ok: false,
        error: 'invalid_severity',
        message: 'Severity must be one of: info, warning, critical'
      }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    
    // Create alert document
    const alertData = {
      type: `test-${type}`,
      severity,
      message,
      created_at: timestamp,
      source: 'admin-test',
      status: 'active',
      meta: {
        test_alert: true,
        requested_by: 'admin',
        ip_address: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown'
      }
    };

    // Write test alert to Firestore
    console.log(`📝 Creating test alert: ${severity} - ${message}`);
    const alertRef = await getDb().collection('alerts').add(alertData);
    
    // Send outbound notification
    console.log('📨 Sending test notification...');
    const notificationSent = await sendAlertNotification({
      type: alertData.type,
      severity: alertData.severity as any,
      message: alertData.message,
      created_at: alertData.created_at,
      source: alertData.source,
      meta: {
        ...alertData.meta,
        alert_id: alertRef.id
      }
    });

    console.log(`✅ Test alert created: ${alertRef.id}`);

    return Response.json({
      ok: true,
      alert_id: alertRef.id,
      message: 'Test alert created and notification sent',
      notification_sent: notificationSent,
      alert: {
        type: alertData.type,
        severity: alertData.severity,
        message: alertData.message,
        created_at: alertData.created_at
      }
    });

  } catch (error) {
    console.error('❌ Test alert creation failed:', error);
    
    // Handle auth errors (they throw NextResponse)
    if (error instanceof Response) {
      return error;
    }
    
    return Response.json({
      ok: false,
      error: 'test_alert_failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
