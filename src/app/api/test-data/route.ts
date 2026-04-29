// src/app/api/test-data/route.ts
import { NextResponse } from "next/server";
import { getDb } from '@/lib/server/firebaseAdmin';

export async function GET() {
  try {
    // Check customers
    const customersSnapshot = await getDb().collection("customers").limit(5).get();
    const customers = customersSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    // Check events  
    const eventsSnapshot = await getDb().collection("subscription_events").limit(5).get();
    const events = eventsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      ok: true,
      customers: {
        count: customersSnapshot.size,
        data: customers
      },
      events: {
        count: eventsSnapshot.size,  
        data: events
      }
    });

  } catch (error) {
    console.error("Test data check failed:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
