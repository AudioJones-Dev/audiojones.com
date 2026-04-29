// src/app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/server/firebaseAdmin';
import { requireAdmin } from "@/lib/server/requireAdmin";
import { AdminCustomer, SubscriptionEvent, safeDocCast } from "@/types/admin";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    // Get total customers
    const customersSnapshot = await getDb().collection("customers").get();
    const totalCustomers = customersSnapshot.size;

    // Get active subscriptions (customers with status "active")
    const activeCustomersSnapshot = await getDb()
      .collection("customers")
      .where("status", "==", "active")
      .get();
    const activeSubscriptions = activeCustomersSnapshot.size;

    // Get total events
    const eventsSnapshot = await getDb().collection("subscription_events").get();
    const totalEvents = eventsSnapshot.size;

    // Get recent events (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const recentEventsSnapshot = await getDb()
      .collection("subscription_events")
      .where("timestamp", ">=", yesterday.toISOString())
      .get();
    const recentEvents = recentEventsSnapshot.size;

    // Get event type breakdown
    const eventTypes: { [key: string]: number } = {};
    eventsSnapshot.docs.forEach((doc: any) => {
      const data = doc.data();
      const eventType = data.event_type || "unknown";
      eventTypes[eventType] = (eventTypes[eventType] || 0) + 1;
    });

    // Get customer status breakdown
    const customerStatuses: { [key: string]: number } = {};
    customersSnapshot.docs.forEach((doc: any) => {
      const data = doc.data();
      const status = data.status || "unknown";
      customerStatuses[status] = (customerStatuses[status] || 0) + 1;
    });

    return NextResponse.json({
      ok: true,
      stats: {
        totalCustomers,
        activeSubscriptions,
        totalEvents,
        recentEvents,
        eventTypes,
        customerStatuses,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof NextResponse) {
      return error;
    }

    console.error("[admin/stats] Error:", error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
