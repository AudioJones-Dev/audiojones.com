/**
 * Status Webhook Queue Stats API
 * 
 * Returns webhook queue statistics for admin UI
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAdminKey } from '@/lib/server/adminSession';
import { getWebhookQueueStats } from '@/lib/server/statusWebhookStore';

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

    // Get queue statistics
    const stats = await getWebhookQueueStats();

    return NextResponse.json({
      success: true,
      stats,
    });

  } catch (error: any) {
    console.error('Error fetching webhook queue stats:', error);

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch webhook queue stats' },
      { status: 500 }
    );
  }
}