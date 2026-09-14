/**
 * Status Webhook Deliveries API
 * 
 * Returns recent webhook delivery attempts for admin UI
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAdminKey } from '@/lib/server/adminSession';
import { getRecentWebhookDeliveries } from '@/lib/server/statusWebhookStore';

async function requireAdminKey(request: NextRequest): Promise<void> {
  const adminKey = request.headers.get('admin-key');
  const expectedAdminKey = process.env.ADMIN_KEY;
  
  if (!expectedAdminKey || !isAdminKey(adminKey ?? '', expectedAdminKey)) {
    throw new Error('Unauthorized: Invalid admin key');
  }
}

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminKey(request);

    // Get recent deliveries
    const deliveries = await getRecentWebhookDeliveries(50);

    return NextResponse.json({
      success: true,
      deliveries,
    });

  } catch (error: any) {
    console.error('Error fetching webhook deliveries:', error);

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch webhook deliveries' },
      { status: 500 }
    );
  }
}