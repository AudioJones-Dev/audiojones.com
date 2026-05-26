// src/app/api/admin/alerts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/legacyAdmin";
import { requireAdmin } from "@/lib/server/requireAdmin";

// GET - Get specific alert
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);
    const { id } = await params;

    const doc = await getDb().collection("alerts").doc(id).get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { ok: false, error: "Alert not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      alert: { id: doc.id, ...doc.data() },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("[alerts API] GET error:", error);
    
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

// PATCH - Update alert (primarily for dismissing)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);
    const { id } = await params;
    const body = await req.json();

    const docRef = getDb().collection("alerts").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { ok: false, error: "Alert not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};

    // Handle dismiss action
    if (body.action === 'dismiss') {
      updateData.status = 'dismissed';
      updateData.dismissed_at = new Date().toISOString();
      updateData.dismissed_by = body.dismissed_by || 'admin';
    }

    // Handle reactivate action
    if (body.action === 'reactivate') {
      updateData.status = 'active';
      updateData.dismissed_at = null;
      updateData.dismissed_by = null;
    }

    // Allow updating specific fields
    if (body.title) updateData.title = body.title.trim();
    if (body.message) updateData.message = body.message.trim();
    if (body.severity) updateData.severity = body.severity;
    if (body.metadata) updateData.metadata = { ...doc.data()?.metadata, ...body.metadata };

    updateData.updated_at = new Date().toISOString();

    await docRef.update(updateData);

    // Get updated document
    const updatedDoc = await docRef.get();

    return NextResponse.json({
      ok: true,
      alert: { id: updatedDoc.id, ...updatedDoc.data() },
      action: body.action || 'update',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("[alerts API] PATCH error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: error instanceof Error && error.message.includes("Admin") ? 403 : 500 }
    );
  }
}

// DELETE - Delete alert (for cleanup)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(req);
    const { id } = await params;

    const docRef = getDb().collection("alerts").doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { ok: false, error: "Alert not found" },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({
      ok: true,
      message: "Alert deleted successfully",
      alert_id: id,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("[alerts API] DELETE error:", error);
    
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