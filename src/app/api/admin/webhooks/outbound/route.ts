import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/server/requireAdmin';
import { getDb } from '@/lib/server/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    // Require admin authentication
    const adminResponse = checkAdmin(req);
    if (adminResponse) {
      return adminResponse;
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status'); // 'failed' to filter failed deliveries
    const limit = Math.min(parseInt(searchParams.get('limit') || '25'), 100);

    const db = getDb();
    const query = db.collection('status_webhook_deliveries')
      .orderBy('created_at', 'desc')
      .limit(limit);

    const snapshot = await query.get();
    
    let items = snapshot.docs.map(doc => {
      const data = doc.data();
      const statusCode = data.status_code || data.statusCode || 0;
      
      return {
        id: doc.id,
        url: data.url || data.target_url || 'unknown',
        event: data.event || data.event_type || 'status_change',
        status_code: statusCode,
        status: statusCode >= 400 ? 'failed' : statusCode >= 200 ? 'success' : 'pending',
        created_at: data.created_at || data.timestamp,
        response_time_ms: data.response_time_ms || data.duration_ms || null,
        error: data.error || null,
        retry_count: data.retry_count || data.attempts || 0
      };
    });

    // Apply status filter after mapping
    if (statusFilter === 'failed') {
      items = items.filter(item => item.status === 'failed');
    }

    return NextResponse.json({
      ok: true,
      items,
      total: items.length,
      limit,
      filtered: statusFilter ? { status: statusFilter } : null
    });

  } catch (error) {
    console.error('[webhooks/outbound] Error:', error);
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Failed to fetch outbound deliveries',
        items: [] 
      },
      { status: 500 }
    );
  }
}