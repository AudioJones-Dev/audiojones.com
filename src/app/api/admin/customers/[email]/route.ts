// src/app/api/admin/customers/[email]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/firebaseAdmin";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { AdminCustomer, SubscriptionEvent, safeDocCast } from "@/types/admin";
import { createAuditLog } from "../../audit/route";

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    requireAdmin(req);
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);

    // Get customer by email (document ID = email)
    const customerDoc = await getDb().collection("customers").doc(decodedEmail).get();
    
    let customer = null;
    if (customerDoc.exists) {
      customer = {
        email: decodedEmail,
        ...customerDoc.data()
      };
    }

    // Get all subscription events for this customer
    let events: any[] = [];
    try {
      const eventsSnapshot = await getDb()
        .collection("subscription_events")
        .where("customer_email", "==", decodedEmail)
        .orderBy("timestamp", "desc")
        .limit(50) // Limit to recent 50 events
        .get();

      events = eventsSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (eventsError) {
      console.warn("[admin/customers] Events query failed (likely missing index):", eventsError);
      // Continue without events if index is missing
    }

    // Get customer notes
    let notes: any[] = [];
    try {
      const notesSnapshot = await getDb()
        .collection("customers")
        .doc(decodedEmail)
        .collection("notes")
        .orderBy("created_at", "desc")
        .get();

      notes = notesSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (notesError) {
      console.warn("[admin/customers] Notes query failed:", notesError);
      // Continue without notes if there's an error
    }

    return NextResponse.json({
      ok: true,
      customer,
      events,
      notes,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("[admin/customers] Error:", error);
    
    // Handle specific Firestore errors
    if (error instanceof Error) {
      if (error.message.includes('index')) {
        return NextResponse.json({
          ok: false,
          error: 'Database index required for customer_email + timestamp query',
          customer: null,
          events: [],
        });
      }
    }
    
    return NextResponse.json(
      { 
        ok: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        customer: null,
        events: [],
      },
      { status: 500 }
    );
  }
}

// PATCH - Update customer information
export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    requireAdmin(req);

    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);
    
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Validate allowed fields
    const allowedFields = ['status', 'billing_sku', 'service_id', 'tier_id'];
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Only include allowed fields that are present in the request
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Check if customer exists
    const customerRef = getDb().collection('customers').doc(decodedEmail);
    const customerDoc = await customerRef.get();
    
    if (!customerDoc.exists) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Update the customer document
    await customerRef.update(updateData);

    // Fetch the updated document
    const updatedDoc = await customerRef.get();
    const updatedCustomer = { 
      email: decodedEmail, 
      ...updatedDoc.data() 
    };

    // Create audit log entry
    await createAuditLog(
      'customer_update',
      decodedEmail,
      {
        updated_fields: Object.keys(updateData).filter(f => f !== 'updated_at'),
        changes: updateData,
        previous_data: customerDoc.data()
      }
    );

    console.log(`[admin/customers] Customer ${decodedEmail} updated by admin:`, updateData);

    return NextResponse.json({
      ok: true,
      customer: updatedCustomer,
      updated_fields: Object.keys(updateData),
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof NextResponse) {
      return error;
    }

    console.error("[admin/customers] PATCH error:", error);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}