// src/app/api/admin/pricing/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/server/firebaseAdmin';
import { createAuditLog } from "../audit/route";
import { requireAdmin } from "@/lib/server/requireAdmin";

// GET - Fetch all pricing SKUs
export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);

    const snapshot = await getDb().collection("pricing_skus")
      .orderBy("billing_sku", "asc")
      .get();

    const skus: any[] = [];
    snapshot.forEach((doc: any) => {
      skus.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return NextResponse.json({
      ok: true,
      skus,
      count: skus.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("[pricing API] GET error:", error);
    
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof NextResponse) {
      return error;
    }
    
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST - Create or update a pricing SKU
export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);

    const body = await req.json();
    const { billing_sku, service_id, tier_id, active } = body;

    if (!billing_sku || !service_id || !tier_id) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: billing_sku, service_id, tier_id" },
        { status: 400 }
      );
    }

    const skuData: any = {
      billing_sku: billing_sku.trim(),
      service_id: service_id.trim(),
      tier_id: tier_id.trim(),
      active: active !== false, // Default to true
      updated_at: new Date().toISOString(),
    };

    // Check if SKU already exists
    const existingQuery = await getDb().collection("pricing_skus")
      .where("billing_sku", "==", skuData.billing_sku)
      .get();

    let docRef;
    let isUpdate = false;

    if (!existingQuery.empty) {
      // Update existing SKU
      docRef = existingQuery.docs[0].ref;
      await docRef.update(skuData);
      isUpdate = true;
    } else {
      // Create new SKU
      skuData.created_at = new Date().toISOString();
      docRef = await getDb().collection("pricing_skus").add(skuData);
    }

    // Get the final document
    const finalDoc = await docRef.get();
    const result = { id: finalDoc.id, ...finalDoc.data() };

    // Create audit log entry
    await createAuditLog(
      isUpdate ? 'pricing_update' : 'pricing_create',
      skuData.billing_sku, // Use billing_sku as target
      {
        action: isUpdate ? 'updated' : 'created',
        sku_data: skuData,
        sku_id: finalDoc.id
      }
    );

    console.log(`[pricing API] SKU ${isUpdate ? 'updated' : 'created'}: ${skuData.billing_sku}`);

    return NextResponse.json({
      ok: true,
      sku: result,
      action: isUpdate ? 'updated' : 'created',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("[pricing API] POST error:", error);
    
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof NextResponse) {
      return error;
    }
    
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
