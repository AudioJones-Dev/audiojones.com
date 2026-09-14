// POST /api/newsletter — canonical newsletter subscription endpoint.
//
// Routes through the adapter in `src/lib/newsletter/newsletter-storage.ts`,
// which reads NEWSLETTER_PROVIDER, MAILERLITE_TOKEN and
// NEXT_PUBLIC_MAILERLITE_DISABLED. It answers 200 only when MailerLite
// accepted the address, or when a developer chose mock outside production.
// An unset provider, a missing token or a MailerLite failure is a 500
// PROVIDER_ERROR, never a fallback to mock.
//
// The legacy `/api/newsletter/subscribe` route is preserved for any external
// callers; new in-product surfaces should use this canonical path.

import { NextResponse, type NextRequest } from "next/server";
import { newsletterSchema } from "@/lib/newsletter/newsletter-schema";
import { getNewsletterAdapter } from "@/lib/newsletter/newsletter-storage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
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
  const result = await adapter.subscribe(parsed.data);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
