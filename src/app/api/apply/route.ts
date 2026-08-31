// POST /api/apply — submit the deeper-intent qualification form.
//
// Reads LEAD_FORM_PROVIDER (mock | neon | resend) and dispatches via the
// apply adapter. Always returns JSON. Always reachable in dev — the mock
// adapter satisfies the contract without external dependencies.

import { NextResponse, type NextRequest } from "next/server";
import { applySchema } from "@/lib/apply/apply-schema";
import { getApplyAdapter } from "@/lib/apply/apply-storage";
import { hashIp } from "@/lib/leads/lead-storage";

export const runtime = "nodejs";

// Crude in-memory rate limiter, matching the limits and shape used by the
// diagnostic route (src/app/api/founder-intelligence/leads/route.ts). Enough
// to slow obvious abuse on a single edge node; cluster-wide protection
// belongs at the edge (Vercel WAF / CF). The honeypot only stops bots that
// fill it, so without this a valid payload can be replayed without limit
// straight into the insert path once the Neon provider is enabled.
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

  if (ip && !rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please wait a moment.", code: "RATE_LIMITED" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed JSON", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  const parsed = applySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  // Honeypot: any non-empty value means a bot filled the hidden field.
  if (parsed.data.hp) {
    // Pretend success so bots don't iterate; never call the adapter.
    return NextResponse.json(
      { ok: true, leadId: "honeypot", provider: "mock" },
      { status: 200 },
    );
  }

  const adapter = getApplyAdapter();
  const result = await adapter.submit(parsed.data, {
    ipHash: hashIp(ip),
    userAgent: req.headers.get("user-agent"),
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
