import { NextResponse } from "next/server";

// Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. Returns a response
// to send back when the request must be refused, or null when it may run.
// With no CRON_SECRET configured every request is refused: a guessable
// fallback would let anyone trigger the job.
export function rejectUnauthorizedCron(req: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET is not configured" }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
