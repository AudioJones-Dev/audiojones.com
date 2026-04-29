import { NextRequest } from 'next/server';
import { getFirestore } from "@/lib/legacy-stubs";
import { requireClient, AuthError, createAuthErrorResponse } from '@/lib/server/requireClient';

/**
 * Client Events API Route
 * 
 * Allows authenticated clients to view their own subscription and webhook events history.
 * Returns only lightweight, read-only event data for the authenticated user.
 */

interface ClientEvent {
  type: string;
  received_at: string;
  sku?: string;
  status?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate the client and get their email
    const userEmail = await requireClient(request);

    // Get Firestore instance
    const db = getFirestore();

    // Query subscription events for this customer
    // Note: Using 'events' collection as established in the webhook system
    const eventsQuery = await db
      .collection('events')
      .where('customer_email', '==', userEmail)
      .orderBy('timestamp', 'desc')
      .limit(25)
      .get();

    // Transform events to client-safe format
    const events: ClientEvent[] = eventsQuery.docs.map(doc => {
      const data = doc.data();
      
      return {
        type: data.event_type || 'unknown',
        received_at: data.timestamp || data.received_at || new Date().toISOString(),
        sku: data.billing_sku || data.sku,
        status: data.status
      };
    });

    // Also check for subscription-specific events if we have a separate collection
    let subscriptionEvents: ClientEvent[] = [];
    try {
      const subEventsQuery = await db
        .collection('subscription_events')
        .where('email', '==', userEmail)
        .orderBy('received_at', 'desc')
        .limit(25)
        .get();

      subscriptionEvents = subEventsQuery.docs.map(doc => {
        const data = doc.data();
        
        return {
          type: data.type || data.event_type || 'subscription_event',
          received_at: data.received_at || data.timestamp || new Date().toISOString(),
          sku: data.sku || data.billing_sku,
          status: data.status
        };
      });
    } catch (error) {
      // subscription_events collection might not exist yet, that's okay
      console.log('subscription_events collection not found, using events only');
    }

    // Combine and sort all events by timestamp
    const allEvents = [...events, ...subscriptionEvents]
      .sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime())
      .slice(0, 25); // Limit to 25 most recent

    return Response.json({
      ok: true,
      events: allEvents,
      total: allEvents.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Client events API error:', error);
    
    // Handle authentication errors
    if (error instanceof AuthError) {
      return createAuthErrorResponse(error);
    }
    
    return Response.json({ 
      ok: false, 
      error: 'internal_server_error' 
    }, { status: 500 });
  }
}