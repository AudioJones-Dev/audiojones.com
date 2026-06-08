export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { pilotApplicationSchema } from "@/lib/pilot/pilot-schema";
import {
  hashIp,
  persistPilotApplication,
} from "@/lib/pilot/pilot-storage";
import { notifyPilotApplication } from "@/lib/pilot/pilot-notifications";

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
    input = pilotApplicationSchema.parse(payload);
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
    return NextResponse.json({ ok: true, applicationId: "blocked" });
  }

  try {
    const stored = await persistPilotApplication(input, {
      ipHash: hashIp(ip),
      userAgent,
    });

    void notifyPilotApplication({
      applicationId: stored.id,
      input,
    });

    return NextResponse.json({
      ok: true,
      applicationId: stored.id,
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
