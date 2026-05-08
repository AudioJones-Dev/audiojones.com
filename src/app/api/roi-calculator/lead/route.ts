export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { roiLeadSchema } from "@/lib/roi-calculator/roi-calculator-schema";
import { getRoiCalculatorStorageAdapter, hashValue } from "@/lib/roi-calculator/roi-calculator-storage";
import { sendAgencyNotification, sendClientResultEmail } from "@/lib/roi-calculator/roi-calculator-email";

const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function rateLimit(key: string) {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || entry.resetAt < now) {
    rateMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || null;
  const userAgent = req.headers.get("user-agent");
  let payload: unknown;
  try { payload = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "VALIDATION_ERROR", message: "Request body must be valid JSON." }, { status: 400 });
  }

  let lead;
  try { lead = roiLeadSchema.parse(payload); } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ ok: false, error: "VALIDATION_ERROR", message: "Check the highlighted fields and try again.", details: err.flatten() }, { status: 400 });
    }
    throw err;
  }

  if (lead.hp) return NextResponse.json({ ok: true, leadId: "blocked" });

  const ipHash = hashValue(ip);
  const emailHash = hashValue(lead.email) ?? "unknown";
  const limitKey = `${ipHash ?? "no-ip"}:${emailHash}`;
  if (!rateLimit(limitKey)) {
    return NextResponse.json({ ok: false, error: "RATE_LIMITED", message: "Too many submissions. Try again later." }, { status: 429 });
  }

  const storage = getRoiCalculatorStorageAdapter();
  try {
    const stored = await storage.insertLead(lead, { ipHash, userAgent, emailHash });
    try {
      await sendAgencyNotification(stored.id, lead);
      await storage.updateEmailStatus(stored.id, { agency: "sent" });
    } catch (err) {
      console.error("[roi-calculator] agency email failed", { leadId: stored.id, err });
      await storage.updateEmailStatus(stored.id, { agency: "failed" });
    }
    void sendClientResultEmail(lead)
      .then(() => storage.updateEmailStatus(stored.id, { client: "sent" }))
      .catch((err) => {
        console.error("[roi-calculator] client email failed", { leadId: stored.id, err });
        void storage.updateEmailStatus(stored.id, { client: "failed" });
      });
    return NextResponse.json({ ok: true, leadId: stored.id });
  } catch (err) {
    console.error("[roi-calculator] persistence failed", err);
    return NextResponse.json({ ok: false, error: "PROVIDER_ERROR", message: "We could not save the lead right now." }, { status: 500 });
  }
}
