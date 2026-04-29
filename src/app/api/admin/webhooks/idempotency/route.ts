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
    const limit = Math.min(parseInt(searchParams.get('limit') || '25'), 100);

    const db = getDb();
    const query = db.collection('webhook_idempotency')
      .orderBy('seen_at', 'desc')
      .limit(limit);

    const snapshot = await query.get();
    
    const items = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        event_id: data.event_id || doc.id,
        seen_at: data.seen_at,
        expires_at: data.expires_at,
        is_expired: data.expires_at ? new Date(data.expires_at) < new Date() : false
      };
    });

    return NextResponse.json({
      ok: true,
      items,
      total: items.length,
      limit
    });

  } catch (error) {
    console.error('[webhooks/idempotency] Error:', error);
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Failed to fetch idempotency records',
        items: [] 
      },
      { status: 500 }
    );
  }
}