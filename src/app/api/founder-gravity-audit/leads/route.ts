export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { notifyFounderGravityAuditLead } from "@/lib/founder-gravity-audit/notifications";
import { scoreFounderGravityAudit } from "@/lib/founder-gravity-audit/scoring";
import { founderGravityAuditLeadSchema } from "@/lib/founder-gravity-audit/schema";
import {
  hashFounderGravityIp,
  persistFounderGravityAuditLead,
} from "@/lib/founder-gravity-audit/storage";

const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 60_000;

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
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;
  const userAgent = req.headers.get("user-agent");

  if (ip && !rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMITED" },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON" },
      { status: 400 },
    );
  }

  let input;
  try {
    input = founderGravityAuditLeadSchema.parse(payload);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", details: err.flatten() },
        { status: 400 },
      );
    }
    throw err;
  }

  if (input.website_url) {
    return NextResponse.json({
      ok: true,
      leadId: "blocked",
      result: scoreFounderGravityAudit(input.answers, {
        consentToContact: false,
        durationSeconds: input.durationSeconds,
      }),
    });
  }

  const result = scoreFounderGravityAudit(input.answers, {
    consentToContact: input.consentToContact,
    durationSeconds: input.durationSeconds,
  });

  try {
    const stored = await persistFounderGravityAuditLead(input, result, {
      ipHash: hashFounderGravityIp(ip),
      userAgent,
    });

    void notifyFounderGravityAuditLead({
      leadId: stored.id,
      input,
      result,
    });

    return NextResponse.json({
      ok: true,
      leadId: stored.id,
      result,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "STORAGE_ERROR",
        message: "We couldn't save your report request. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
