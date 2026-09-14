// POST /api/newsletter — canonical newsletter subscription endpoint.
//
// Routes through the adapter in `src/lib/newsletter/newsletter-storage.ts`,
// which reads NEWSLETTER_PROVIDER, DATABASE_URL, MAILERLITE_TOKEN and
// NEXT_PUBLIC_MAILERLITE_DISABLED. It answers 200 only when the address was
// saved to Neon ("neon"), MailerLite accepted it ("mailerlite"), or a
// developer chose mock outside production. An unset provider, a missing
// DATABASE_URL or token, a failed insert, or a MailerLite failure under
// "mailerlite" is a 500 PROVIDER_ERROR, never a fallback to mock.
//
// The legacy `/api/newsletter/subscribe` route is preserved for any external
// callers; new in-product surfaces should use this canonical path.

import { NextResponse, type NextRequest } from "next/server";
import { newsletterSchema } from "@/lib/newsletter/newsletter-schema";
import { getNewsletterAdapter } from "@/lib/newsletter/newsletter-storage";
import { hashIp } from "@/lib/leads/lead-storage";

export const runtime = "nodejs";

// Crude in-memory rate limiter, with the limits and shape of /api/apply.
// Enough to slow obvious abuse on a single instance; cluster-wide protection
// belongs at the edge (Vercel WAF / CF). The honeypot only stops bots that
// fill it, so without this a valid payload can be replayed without limit into
// the insert path under "neon", or into MailerLite's API under "mailerlite".
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

  const parsed = newsletterSchema.safeParse(body);
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
      { ok: true, id: "honeypot", provider: "mock" },
      { status: 200 },
    );
  }

  const adapter = getNewsletterAdapter();
  const result = await adapter.subscribe(parsed.data, {
    ipHash: hashIp(ip),
    userAgent: req.headers.get("user-agent"),
  });
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
