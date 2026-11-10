// Vercel Cron entry for the lead outbox (schedule in vercel.json).

import { NextResponse, type NextRequest } from "next/server";
import { dispatchLeadOutbox } from "@/lib/outbox/dispatcher";
import { rejectUnauthorizedCron } from "@/lib/server/cronAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const rejected = rejectUnauthorizedCron(req);
  if (rejected) return rejected;
  try {
    const summary = await dispatchLeadOutbox(25);
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    console.error("[lead-outbox] cron run failed", err);
    return NextResponse.json({ ok: false, error: "dispatch failed" }, { status: 500 });
  }
}
