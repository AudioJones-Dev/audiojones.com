// src/app/api/admin/webhooks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/server/firebaseAdmin';
import { requireAdmin } from "@/lib/server/requireAdmin";

export async function GET(req: NextRequest) {
  try {
    // Admin authentication using shared helper
    requireAdmin(req);

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Query subscription_events collection
    let query = getDb().collection('subscription_events')
      .orderBy('timestamp', 'desc')
      .limit(limit);

    if (offset > 0) {
      // For pagination, we'd need to implement cursor-based pagination
      // For now, we'll use limit/offset approximation
      query = query.offset(offset);
    }

    const snapshot = await query.get();
    
    const events = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      // Add replay status indicators
      has_been_replayed: !!doc.data().last_replay_at,
      replay_count: doc.data().replay_count || 0
    }));

    // Get total count for pagination
    const totalSnapshot = await getDb().collection('subscription_events').count().get();
    const total = totalSnapshot.data().count;

    return NextResponse.json({
      events,
      pagination: {
        total,
        limit,
        offset,
        has_more: (offset + limit) < total
      }
    });

  } catch (error) {
    console.error('[webhooks API] Error:', error);
    
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof NextResponse) {
      return error;
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
