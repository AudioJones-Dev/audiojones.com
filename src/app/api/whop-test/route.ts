// src/app/api/whop-test/route.ts - Test version with better error handling
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "Test webhook endpoint ready",
    env_check: {
      has_project_id: !!process.env.GOOGLE_CLOUD_PROJECT,
      has_client_email: !!process.env.LEGACY_AUTH_CLIENT_EMAIL,
      has_private_key: !!process.env.LEGACY_AUTH_PRIVATE_KEY,
      has_whop_api_key: !!process.env.WHOP_API_KEY,
      has_whop_app_id: !!process.env.WHOP_APP_ID,
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[test webhook] Received payload:", JSON.stringify(body, null, 2));
    
    // Check environment variables
    const projectId = process.env.GOOGLE_CLOUD_PROJECT;
    const clientEmail = process.env.LEGACY_AUTH_CLIENT_EMAIL;
    const privateKey = process.env.LEGACY_AUTH_PRIVATE_KEY;
    
    if (!projectId || !clientEmail || !privateKey) {
      return NextResponse.json({
        error: "Missing retired auth credentials",
        details: {
          has_project_id: !!projectId,
          has_client_email: !!clientEmail,
          has_private_key: !!privateKey,
          private_key_start: privateKey ? privateKey.substring(0, 50) + "..." : "missing"
        }
      }, { status: 400 });
    }
    
    // Try to use shared Retired auth utility
    try {
      const { getDb } = await import("@/lib/server/legacyAdmin");
      const db = getDb();
      console.log("[whop-test] Using shared Retired auth utility");
      
      return NextResponse.json({
        success: true,
        message: "Retired auth loaded from shared utility successfully",
        payload: body
      });
      
    } catch (legacyAuthError: any) {
      console.error("[test webhook] Retired auth error:", legacyAuthError);
      return NextResponse.json({
        error: "Retired auth initialization failed",
        details: legacyAuthError.message,
        private_key_format_check: {
          starts_with_begin: privateKey.startsWith("-----BEGIN"),
          ends_with_end: privateKey.includes("-----END"),
          has_newlines: privateKey.includes("\\n") || privateKey.includes("\n"),
          length: privateKey.length
        }
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error("[test webhook] General error:", error);
    return NextResponse.json({
      error: "Request processing failed",
      details: error.message
    }, { status: 500 });
  }
}