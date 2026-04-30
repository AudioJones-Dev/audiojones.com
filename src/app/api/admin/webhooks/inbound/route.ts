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
    const eventFilter = searchParams.get('event');
    const limit = Math.min(parseInt(searchParams.get('limit') || '25'), 100);

    const db = getDb();
    let query = db.collection('aj_webhook_events')
      .orderBy('created_at', 'desc')
      .limit(limit);

    // Optional event type filter
    if (eventFilter) {
      query = query.where('event', '==', eventFilter);
    }

    const snapshot = await query.get();
    
    const items = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        event: data.event || 'unknown',
        source: data.source || data.ip || 'unknown',
        created_at: data.created_at || data.timestamp,
        verified: data.verified ?? null,
        signature_valid: data.signature_valid ?? null,
        error: data.error || null,
        user_agent: data.user_agent || null,
        payload_size: data.payload_size || null
      };
    });

    return NextResponse.json({
      ok: true,
      items,
      total: items.length,
      limit
    });

  } catch (error) {
    console.error('[webhooks/inbound] Error:', error);
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Failed to fetch inbound webhooks',
        items: [] 
      },
      { status: 500 }
    );
  }
}