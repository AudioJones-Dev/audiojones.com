// Vercel Cron entry for the lead outbox (schedule in vercel.json).
// Vercel sends `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set.
// With no CRON_SECRET this route refuses to run rather than fall back to a
// guessable default.

import { NextResponse, type NextRequest } from "next/server";
import { dispatchLeadOutbox } from "@/lib/outbox/dispatcher";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET is not configured" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const summary = await dispatchLeadOutbox(25);
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    console.error("[lead-outbox] cron run failed", err);
    return NextResponse.json({ ok: false, error: "dispatch failed" }, { status: 500 });
  }
}
