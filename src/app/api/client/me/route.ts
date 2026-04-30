import { NextRequest } from 'next/server';
import { getFirestore } from "@/lib/legacy-stubs";
import { requireClient, AuthError, createAuthErrorResponse } from '@/lib/server/requireClient';

export async function GET(request: NextRequest) {
  try {
    // Authenticate the client and get their email
    const userEmail = await requireClient(request);

    // Get Firestore instance
    const db = getFirestore();

    // Fetch customer data from Firestore
    const customerDoc = await db.collection('customers').doc(userEmail).get();
    
    let customer = null;
    if (customerDoc.exists) {
      customer = {
        id: customerDoc.id,
        ...customerDoc.data(),
      };
    }

    // Fetch recent events for this customer
    const eventsQuery = await db
      .collection('events')
      .where('customer_email', '==', userEmail)
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    const events = eventsQuery.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json({
      customer,
      events,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Client API error:', error);
    
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