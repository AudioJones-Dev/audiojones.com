// src/app/api/admin/customers/[email]/note/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/legacyAdmin";
import { requireAdmin } from "@/lib/server/requireAdmin";

export async function POST(
  req: NextRequest, 
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    // Admin authentication using shared helper
    requireAdmin(req);
    const { email } = await params;
    const decodedEmail = decodeURIComponent(email);
    
    // Parse request body
    const body = await req.json();
    const { message } = body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Invalid request: message is required and must be a non-empty string' 
      }, { status: 400 });
    }

    // Write note to subcollection
    const noteData = {
      message: message.trim(),
      created_at: new Date().toISOString(),
      created_by: "admin"
    };

    const noteRef = await getDb()
      .collection("customers")
      .doc(decodedEmail)
      .collection("notes")
      .add(noteData);

    return NextResponse.json({
      ok: true,
      noteId: noteRef.id,
      timestamp: noteData.created_at
    });

  } catch (error) {
    console.error("[admin/customers/note] Error:", error);
    
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof NextResponse) {
      return error;
    }
    
    return NextResponse.json(
      { 
        ok: false, 
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}