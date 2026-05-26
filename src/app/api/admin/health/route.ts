// src/app/api/admin/health/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/server/legacyAdmin';
import { requireAdmin } from "@/lib/server/requireAdmin";

const startTime = Date.now();

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);

    // Test Firestore connection with a simple read
    let firestoreConnected = false;
    try {
      await getDb().collection("customers").limit(1).get();
      firestoreConnected = true;
    } catch (firestoreError) {
      console.error("Firestore connection failed:", firestoreError);
    }

    const uptime = Math.floor((Date.now() - startTime) / 1000);

    const healthData = {
      status: "ok",
      firestore: firestoreConnected,
      version: "0.1.0", // from package.json
      timestamp: new Date().toISOString(),
      uptime: `${uptime}s`
    };

    // Return 500 if Firestore is down, 200 if connected
    const statusCode = firestoreConnected ? 200 : 500;
    
    return NextResponse.json(healthData, { status: statusCode });

  } catch (error) {
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof NextResponse) {
      return error;
    }

    console.error("[admin/health] Health check failed:", error);
    
    return NextResponse.json(
      { 
        ok: false, 
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
