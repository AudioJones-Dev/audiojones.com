// Adapter interface + mock + Neon persistence for /apply submissions.
//
// Provider switch: env `LEAD_FORM_PROVIDER` ∈ {"mock", "neon", "resend"}.
//   - "neon":   persists to `applied_intelligence_leads` on NeonDB via
//               src/db/apply.ts. Requires DATABASE_URL and the columns added
//               in db/migrations/003_apply_submission_fields.sql.
//               Selecting it without a DATABASE_URL rejects submissions
//               rather than falling back — see misconfiguredAdapter below.
//   - "mock":   logs the payload, simulates 700ms latency, returns a
//               synthetic leadId. UI compiles + form submits + thank-you
//               renders without any external dependency. Nothing is stored.
//   - "mock" is a development convenience. Naming it explicitly is allowed
//               locally and on previews; it is refused in real production,
//               where answering ok:true while storing nothing is a lie to an
//               applicant. Falling through to it is refused on any deployed
//               environment, previews included, because nobody chose it.
//   - "resend": historical value that never persisted anything. It is no
//               longer an alias for "mock": an unrecognised provider is an
//               error, so an environment still carrying it fails loudly
//               instead of quietly discarding applications. Set "neon".
//
// Persistence is opt-in on purpose. `neon` must be set explicitly — a
// DATABASE_URL alone does not enable it — so the migration can be applied
// without a write reaching the table before its columns exist. Setting the
// provider before the migration is applied is still the wrong order: the
// insert fails and applicants see a retry message. Migration first.
//
// Worth knowing when reading the mock path: `ok: true` makes ApplyForm
// redirect to /apply/thank-you, which reads "Application received". On mock
// nothing is received. That is acceptable in development. In production it
// is not, and on 2026-09-10 it stopped being hypothetical: LEAD_FORM_PROVIDER
// was unset in production and every application was discarded behind a
// success message. The selector below therefore refuses to reach mock in
// production, and refuses unrecognised values outright. Nothing here may
// answer ok:true without a persisted row.
//
// This matches how the sibling capture paths behave — see
// persistFounderIntelligenceLead in src/lib/leads/lead-storage.ts, which
// re-throws "rather than pretending to succeed", and
// persistRoiCalculatorLead in src/lib/roi-calculator/roi-calculator-storage.ts,
// which refuses in production and mocks only outside it.
//
// Hard rules: no Firebase. No hardcoded secrets.

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

// Applicant emails must not reach the logs in full. Module-local for the same
// reason the equivalents in src/lib/roi-calculator/roi-calculator-storage.ts
// and src/lib/newsletter/newsletter-storage.ts are: a log helper is not worth
// a shared import.
//
// The middle is `.*`, not the `.+` those two use. With `.+` the pattern needs
// at least one character between the first and the `@`, so a single-character
// local part — `a@b.com`, valid and real — matches nothing and is logged
// verbatim, which is the leak this function exists to prevent. Output is
// identical for every longer address.
function redactEmail(email: string): string {
  return email.replace(/(.).*(@.+)/, "$1•••$2");
}

// ─── Mock adapter ────────────────────────────────────────────────────────────

const mockAdapter: ApplyAdapter = {
  async submit(input) {
    // Redact obvious PII from the console log so dev-tools history is safer.
    const summary = {
      firstName: input.firstName,
      email: redactEmail(input.email),
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

      // Notify after the row is committed. The application is safe in the
      // table either way, so a slow or failing notifier must not delay the
      // applicant or turn a successful submission into an error — hence its
      // own try/catch, inside which even the dynamic import is guarded.
      // Notifying here rather than in the route is deliberate: a mock
      // submission stored nothing, so there is nothing to announce.
      //
      // `after` rather than a bare `void`: on serverless the invocation can
      // be suspended as soon as the response is sent, which would drop the
      // Resend and webhook requests mid-flight and leave the application
      // silently unannounced. `after` keeps the invocation alive until the
      // work settles, without holding up the response.
      try {
        const { notifyApplySubmission } = await import("./apply-notifications");
        const notify = () => notifyApplySubmission({ leadId: stored.id, input });

        try {
          const { after } = await import("next/server");
          after(notify);
        } catch {
          // No request scope — a script or a test calling the adapter
          // directly. Await instead: notifyApplySubmission resolves through
          // Promise.allSettled and never rejects, so this cannot turn a
          // saved row into a failed submission.
          await notify();
        }
      } catch (err) {
        console.error("[apply] notification dispatch failed; row is saved", {
          error: err instanceof Error ? err.message : String(err),
          leadId: stored.id,
        });
      }

      return { ok: true, leadId: stored.id, provider: "neon" };
    } catch (err) {
      // Log with enough to find the row that did not land, then surface a
      // provider error. Never echo the Neon message to the caller — it names
      // tables and constraints.
      console.error("[apply] failed to persist submission", {
        error: err instanceof Error ? err.message : String(err),
        email: redactEmail(input.email),
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

// ─── Misconfigured adapter ───────────────────────────────────────────────────

// Selecting "neon" without a DATABASE_URL is a deployment-config error, and
// the only safe response is to refuse the submission. Falling back to mock
// here would answer ok:true and send the applicant to the thank-you page
// while the application was discarded — a false success on a lead form is
// worse than an error, because the applicant has no reason to try again.
const misconfiguredAdapter: ApplyAdapter = {
  async submit(input) {
    console.error("[apply] rejecting submission: provider is neon but DATABASE_URL is unset", {
      email: redactEmail(input.email),
      offer: input.offer,
    });
    return {
      ok: false,
      error: "We couldn't save your application. Please try again in a moment.",
      code: "PROVIDER_ERROR",
    };
  },
};

// Refusing adapter for a provider that cannot persist. `reason` is logged,
// never returned: the applicant gets a retry message, not our configuration.
function refusingAdapter(reason: string): ApplyAdapter {
  return {
    async submit(input) {
      console.error(`[apply] rejecting submission: ${reason}`, {
        email: redactEmail(input.email),
        offer: input.offer,
      });
      return {
        ok: false,
        error: "We couldn't save your application. Please try again in a moment.",
        code: "PROVIDER_ERROR",
      };
    },
  };
}

// ─── Provider selector ───────────────────────────────────────────────────────

// Two different questions, and conflating them costs one or the other.
//
// `isRealProduction` — a deployment serving real visitors, where a mock is
// never acceptable. Vercel sets VERCEL_ENV=production only for production
// deployments; preview builds also run with NODE_ENV=production, so NODE_ENV
// alone would refuse a developer's explicitly chosen mock on a preview.
// The NODE_ENV fallback covers hosting that sets no VERCEL_ENV.
const isRealProduction = () =>
  process.env.VERCEL_ENV === "production" ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");

// `isHosted` — any deployed environment, preview included. Falling through to
// mock here is what produced the 2026-09-10 incident, and a preview that
// answers "Application received" while storing nothing misleads whoever is
// testing the form just as effectively as production did.
const isHosted = () =>
  Boolean(process.env.VERCEL_ENV) || process.env.NODE_ENV === "production";

// Warn once per cold start per condition, so a misconfigured deploy leaves one
// visible signal rather than a line per submission. Each refused submission is
// still logged individually by the adapter itself.
const warned = new Set<string>();
function warnOnce(key: string, message: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(message);
}

export function getApplyAdapter(): ApplyAdapter {
  const explicit = process.env.LEAD_FORM_PROVIDER?.toLowerCase().trim();

  if (explicit === "neon") {
    if (!process.env.DATABASE_URL) {
      warnOnce(
        "neon-no-db",
        "[apply] LEAD_FORM_PROVIDER=neon but DATABASE_URL is unset; applications will be rejected",
      );
      return misconfiguredAdapter;
    }
    return neonAdapter;
  }

  // Naming mock explicitly is consent to a non-persisting run, which is fine
  // locally and on a preview. It is never fine in front of real visitors.
  if (explicit === "mock") {
    if (isRealProduction()) {
      warnOnce(
        "mock-in-prod",
        "[apply] LEAD_FORM_PROVIDER=mock is refused in production; applications will be rejected",
      );
      return refusingAdapter("provider is mock, which cannot persist, and this is production");
    }
    return mockAdapter;
  }

  // Anything else — unset, or a value this module does not implement, the
  // legacy "resend" included — cannot persist, and nobody chose it. On any
  // deployed environment that is the failure this selector exists to prevent.
  // Locally it is just a developer without configuration, so mock keeps the
  // form workable.
  if (isHosted()) {
    warnOnce(
      "unusable-provider-in-prod",
      `[apply] LEAD_FORM_PROVIDER is ${explicit ? `"${explicit}", which is not a usable provider` : "unset"}; applications will be rejected`,
    );
    return refusingAdapter(
      explicit
        ? `provider "${explicit}" is not implemented and this is a deployed environment`
        : "no provider is configured and this is a deployed environment",
    );
  }

  warnOnce(
    "mock-fallback",
    `[apply] LEAD_FORM_PROVIDER is ${explicit ? `"${explicit}"` : "unset"}; using the mock adapter. Nothing will be stored.`,
  );
  return mockAdapter;
}
