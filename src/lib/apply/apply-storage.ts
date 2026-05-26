// Adapter interface + mock + production stub for /apply submissions.
//
// Provider switch: env `LEAD_FORM_PROVIDER` ∈ {"mock", "resend"}.
//   - "mock":   default in dev when RESEND_API_KEY is unset.
//               Logs the payload to console, simulates 700ms latency,
//               returns a synthetic leadId. UI compiles + form submits +
//               thank-you renders without any external dependency.
//   - "resend": forwards through the production lead pipeline (Neon insert
//               + Resend email). Stubbed here with a TODO; concrete impl
//               lands when /apply is wired into the canonical lead pipeline
//               (likely in Wave 7 funnel-pack reconciliation).
//
// Hard rules: no Retired auth. No hardcoded secrets. Fail soft when env is
// missing — the form must still submit successfully via the mock adapter.

import { randomUUID } from "node:crypto";
import type { ApplyInput } from "./apply-schema";

export type ApplySuccess = {
  ok: true;
  leadId: string;
  provider: "mock" | "resend";
};

export type ApplyError = {
  ok: false;
  error: string;
  code: "VALIDATION_ERROR" | "PROVIDER_ERROR" | "RATE_LIMITED";
  details?: unknown;
};

export type ApplyResult = ApplySuccess | ApplyError;

export interface ApplyAdapter {
  submit(input: ApplyInput): Promise<ApplyResult>;
}

// ─── Mock adapter ────────────────────────────────────────────────────────────

const mockAdapter: ApplyAdapter = {
  async submit(input) {
    // Redact obvious PII from the console log so dev-tools history is safer.
    const summary = {
      firstName: input.firstName,
      email: input.email.replace(/(.).+(@.+)/, "$1•••$2"),
      companyName: input.companyName,
      revenue: input.annualRevenueRange,
      timeline: input.timeline,
      source: input.source,
    };
    // eslint-disable-next-line no-console
    console.info("[apply mock] submission accepted", summary);
    await new Promise((r) => setTimeout(r, 700));
    return {
      ok: true,
      leadId: `mock-${randomUUID()}`,
      provider: "mock",
    };
  },
};

// ─── Production adapter (stubbed) ────────────────────────────────────────────

const productionAdapter: ApplyAdapter = {
  async submit(_input) {
    // TODO: integration deferred — wire into the canonical lead pipeline
    // (Neon insert via `src/db/leads.ts` + Resend notification via
    // `src/lib/leads/lead-notifications.ts`) during Wave 7 funnel-pack
    // reconciliation. Until then this path falls back to mock so the
    // contract is satisfied even if LEAD_FORM_PROVIDER=resend is set
    // prematurely.
    return mockAdapter.submit(_input);
  },
};

// ─── Provider selector ───────────────────────────────────────────────────────

export function getApplyAdapter(): ApplyAdapter {
  const explicit = process.env.LEAD_FORM_PROVIDER?.toLowerCase().trim();
  if (explicit === "resend" && process.env.RESEND_API_KEY) {
    return productionAdapter;
  }
  // Default to mock — keeps local dev + missing-env environments functional
  return mockAdapter;
}
