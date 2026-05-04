// POST /api/newsletter — canonical newsletter subscription endpoint.
//
// Routes through the adapter pattern in `src/lib/newsletter/newsletter-storage.ts`.
// Honors NEWSLETTER_PROVIDER + NEXT_PUBLIC_MAILERLITE_DISABLED. Falls back to
// mock on any upstream failure — the user always sees success.
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
