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
    
    // Query for webhook events with verification failures or errors
    // We need to use a compound query approach since Firestore doesn't support OR on different fields
    const failedVerificationQuery = db.collection('aj_webhook_events')
      .where('verified', '==', false)
      .orderBy('created_at', 'desc')
      .limit(limit);

    const [failedVerificationSnapshot] = await Promise.all([
      failedVerificationQuery.get()
    ]);

    // Also try to get events with errors (if we have that field indexed)
    let errorEventsSnapshot;
    try {
      const errorEventsQuery = db.collection('aj_webhook_events')
        .where('error', '!=', null)
        .orderBy('created_at', 'desc')
        .limit(limit);
      
      errorEventsSnapshot = await errorEventsQuery.get();
    } catch (errorQueryError) {
      // If error field query fails (not indexed), we'll just use verification failures
      console.log('[webhooks/failures] Error field query failed (likely not indexed):', errorQueryError);
      errorEventsSnapshot = { docs: [] };
    }

    // Combine results and dedupe by document ID
    const allFailureDocs = new Map();
    
    failedVerificationSnapshot.docs.forEach((doc: any) => {
      allFailureDocs.set(doc.id, doc);
    });
    
    if (errorEventsSnapshot?.docs) {
      errorEventsSnapshot.docs.forEach((doc: any) => {
        allFailureDocs.set(doc.id, doc);
      });
    }

    // Convert to array and sort by created_at
    const items = Array.from(allFailureDocs.values())
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          event: data.event || 'unknown',
          source: data.source || data.ip || 'unknown',
          created_at: data.created_at || data.timestamp,
          verified: data.verified ?? null,
          signature_valid: data.signature_valid ?? null,
          error: data.error || null,
          failure_reason: data.error || (data.verified === false ? 'signature_verification_failed' : 'unknown'),
          user_agent: data.user_agent || null
        };
      })
      .sort((a, b) => {
        const aTime = new Date(a.created_at || 0).getTime();
        const bTime = new Date(b.created_at || 0).getTime();
        return bTime - aTime; // desc order
      })
      .slice(0, limit);

    return NextResponse.json({
      ok: true,
      items,
      total: items.length,
      limit
    });

  } catch (error) {
    console.error('[webhooks/failures] Error:', error);
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Failed to fetch validation failures',
        items: [] 
      },
      { status: 500 }
    );
  }
}