// Adapter interface + mock + Neon persistence for /apply submissions.
//
// Provider switch: env `LEAD_FORM_PROVIDER` ∈ {"mock", "neon", "resend"}.
//   - "neon":   persists to `applied_intelligence_leads` on NeonDB via
//               src/db/apply.ts. Requires DATABASE_URL and the columns added
//               in db/migrations/003_apply_submission_fields.sql.
//   - "mock":   logs the payload, simulates 700ms latency, returns a
//               synthetic leadId. UI compiles + form submits + thank-you
//               renders without any external dependency.
//   - "resend": historical value that never persisted anything. Kept as an
//               alias for "mock" so an environment already carrying it does
//               not silently start writing to a table whose migration may
//               not be applied yet. Switch it to "neon" deliberately.
//
// Persistence is opt-in on purpose. `neon` must be set explicitly — a
// DATABASE_URL alone does not enable it — so the migration can be applied
// before any write reaches the table, in either order, without a window
// where /apply 500s on a missing column.
//
// Hard rules: no Firebase. No hardcoded secrets. Fail soft when env is
// missing — the form must still submit successfully via the mock adapter.

import { randomUUID } from "node:crypto";
import type { ApplyInput } from "./apply-schema";

export type ApplySuccess = {
  ok: true;
  leadId: string;
  provider: "mock" | "neon";
};

// Request-scoped context the row needs but the form cannot supply. Mirrors
// the diagnostic pipeline's LeadContext; re-declared here rather than
// imported so this module stays free of the "server-only" db barrel.
export type ApplySubmitContext = {
  ipHash: string | null;
  userAgent: string | null;
};

export type ApplyError = {
  ok: false;
  error: string;
  code: "VALIDATION_ERROR" | "PROVIDER_ERROR" | "RATE_LIMITED";
  details?: unknown;
};

export type ApplyResult = ApplySuccess | ApplyError;

export interface ApplyAdapter {
  submit(input: ApplyInput, ctx: ApplySubmitContext): Promise<ApplyResult>;
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
      offer: input.offer,
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

// ─── Neon adapter ────────────────────────────────────────────────────────────

const neonAdapter: ApplyAdapter = {
  async submit(input, ctx) {
    // Imported lazily so the "server-only" db modules are never pulled into a
    // build that runs with the mock provider.
    const { insertApplySubmission } = await import("@/db/apply");

    try {
      const stored = await insertApplySubmission(input, ctx);
      return { ok: true, leadId: stored.id, provider: "neon" };
    } catch (err) {
      // Log with enough to find the row that did not land, then surface a
      // provider error. Never echo the Neon message to the caller — it names
      // tables and constraints.
      console.error("[apply] failed to persist submission", {
        error: err instanceof Error ? err.message : String(err),
        email: input.email,
        offer: input.offer,
      });
      return {
        ok: false,
        error: "We couldn't save your application. Please try again in a moment.",
        code: "PROVIDER_ERROR",
      };
    }
  },
};

// ─── Provider selector ───────────────────────────────────────────────────────

let providerEnvWarned = false;

export function getApplyAdapter(): ApplyAdapter {
  const explicit = process.env.LEAD_FORM_PROVIDER?.toLowerCase().trim();

  if (explicit === "neon") {
    if (!process.env.DATABASE_URL) {
      // Warn once per cold start: this is a deployment-config error, not a
      // per-request one. Falling back to mock keeps the form working rather
      // than failing every application on a missing connection string.
      if (!providerEnvWarned) {
        providerEnvWarned = true;
        console.warn(
          "[apply] LEAD_FORM_PROVIDER=neon but DATABASE_URL is unset; falling back to mock",
        );
      }
      return mockAdapter;
    }
    return neonAdapter;
  }

  // Default to mock — keeps local dev + missing-env environments functional,
  // and keeps the legacy "resend" value non-persisting until someone opts in.
  return mockAdapter;
}
