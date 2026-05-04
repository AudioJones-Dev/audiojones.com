// POST /api/apply — submit the deeper-intent qualification form.
//
// Reads LEAD_FORM_PROVIDER (mock | resend) and dispatches via the apply
// adapter. Always returns JSON. Always reachable in dev — the mock
// adapter satisfies the contract without external dependencies.

import { NextResponse, type NextRequest } from "next/server";
import { applySchema } from "@/lib/apply/apply-schema";
import { getApplyAdapter } from "@/lib/apply/apply-storage";

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
  const result = await adapter.submit(parsed.data);

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
