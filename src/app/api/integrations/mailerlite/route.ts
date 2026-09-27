// Legacy path, kept for external callers. POST goes through the canonical
// newsletter handler so a public caller gets the same validation and honeypot,
// and cannot pick MailerLite groups or read subscriber records back.
import { NextResponse } from "next/server";
import { getMailerLiteToken } from "@/lib/integrations/mailerlite";

export const runtime = "nodejs";
export { POST } from "@/app/api/newsletter/route";

export async function GET() {
  return NextResponse.json({ ok: true, hasToken: Boolean(getMailerLiteToken()) });
}
