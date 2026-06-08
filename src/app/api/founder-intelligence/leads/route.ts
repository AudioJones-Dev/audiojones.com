export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { founderIntelligenceLeadSchema } from "@/lib/leads/lead-schema";
import { scoreFounderIntelligenceLead } from "@/lib/leads/lead-scoring";
import {
  hashIp,
  persistFounderIntelligenceLead,
} from "@/lib/leads/lead-storage";
import { notifyFounderIntelligenceLead } from "@/lib/leads/lead-notifications";

// Crude in-memory rate limiter — sufficient to slow obvious abuse on a single
// edge node. Cluster-wide protection should sit at the edge (Vercel WAF / CF).
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
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
    input = founderIntelligenceLeadSchema.parse(payload);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", details: err.flatten() },
        { status: 400 },
      );
    }
    throw err;
  }

  // Honeypot — silently accept and drop.
  if (input.website_url) {
    return NextResponse.json({ ok: true, leadId: "blocked", priority: "low", totalScore: 0 });
  }

  const scores = scoreFounderIntelligenceLead(input);

  try {
    const stored = await persistFounderIntelligenceLead(input, scores, {
      ipHash: hashIp(ip),
      userAgent,
    });

    // Notifications run sequentially after persistence but failures don't
    // block the user response — they're logged inside the notifier.
    void notifyFounderIntelligenceLead({
      leadId: stored.id,
      input,
      scores,
    });

    return NextResponse.json({
      ok: true,
      leadId: stored.id,
      priority: scores.priority,
      totalScore: scores.totalScore,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: "STORAGE_ERROR",
        message: err instanceof Error ? err.message : "Unknown storage error",
      },
      { status: 500 },
    );
  }
}
