// Adapter interface + MailerLite adapter + mock for newsletter subscriptions.
//
// Provider switch: env `NEWSLETTER_PROVIDER` ∈ {"mailerlite", "mock"}.
//   - "mailerlite": POSTs the address to MailerLite with MAILERLITE_TOKEN and
//                   answers ok:true only when MailerLite accepts it. A missing
//                   token, a non-2xx response or a failed request is refused
//                   with PROVIDER_ERROR. MAILERLITE_TOKEN is the only key
//                   name read; MAILERLITE_API_KEY is not.
//   - "mock":       logs a redacted payload, simulates 700ms latency, returns
//                   a synthetic id. Nothing is stored. Naming it is allowed
//                   locally and on previews, and refused in real production.
//                   NEXT_PUBLIC_MAILERLITE_DISABLED=true|1 is the same choice
//                   and gets the same treatment.
//   - Anything else, unset included, is refused on any deployed environment.
//     Only local development falls back to mock.
//
// This module used to fail soft on purpose: every path, a MailerLite 401
// included, ended in a synthetic success, which NewsletterForm renders as
// "Subscribed." The form sits in the footer of every page, so an unset
// provider or a revoked token discarded every signup behind a success
// message. #251 closed the same hole for /apply after LEAD_FORM_PROVIDER was
// found unset in production on 2026-09-10, and the selector below follows
// src/lib/apply/apply-storage.ts. Nothing here may answer ok:true unless
// MailerLite accepted the address or a developer chose mock outside
// production.
//
// Signups are not written to Neon. MailerLite is the only store, so this
// surface does not meet the zero-loss bar in docs/PRD.md §6.
//
// Hard rules: no Firebase. No hardcoded secrets.

import { randomUUID } from "node:crypto";
import type { NewsletterInput } from "./newsletter-schema";

export type NewsletterSuccess = {
  ok: true;
  id: string;
  provider: "mock" | "mailerlite";
};

export type NewsletterError = {
  ok: false;
  error: string;
  code: "VALIDATION_ERROR" | "PROVIDER_ERROR" | "RATE_LIMITED";
};

export type NewsletterResult = NewsletterSuccess | NewsletterError;

export interface NewsletterAdapter {
  subscribe(input: NewsletterInput): Promise<NewsletterResult>;
}

// ─── Refusal ─────────────────────────────────────────────────────────────────

// `reason` is logged, never returned: the caller gets a retry message, not our
// configuration or MailerLite's response. The address is logged in full on
// purpose — nothing else records a refused signup, so this line is the only
// way to find and re-add it.
function refuse(
  reason: string,
  input: NewsletterInput,
  extra?: Record<string, unknown>,
): NewsletterError {
  console.error(`[newsletter] rejecting subscription: ${reason}`, {
    email: input.email,
    source: input.source,
    ...extra,
  });
  return {
    ok: false,
    error: "We couldn't complete your subscription. Please try again in a moment.",
    code: "PROVIDER_ERROR",
  };
}

function refusingAdapter(reason: string): NewsletterAdapter {
  return {
    async subscribe(input) {
      return refuse(reason, input);
    },
  };
}

// ─── Mock adapter ────────────────────────────────────────────────────────────

function redactEmail(email: string): string {
  return email.replace(/(.).+(@.+)/, "$1•••$2");
}

const mockAdapter: NewsletterAdapter = {
  async subscribe(input) {
    // eslint-disable-next-line no-console
    console.info("[newsletter mock] subscribe accepted", {
      email: redactEmail(input.email),
      source: input.source,
    });
    await new Promise((r) => setTimeout(r, 700));
    return {
      ok: true,
      id: `mock-${randomUUID()}`,
      provider: "mock",
    };
  },
};

// ─── MailerLite adapter ──────────────────────────────────────────────────────

const MAILERLITE_API_BASE =
  process.env.MAILERLITE_API_BASE ?? "https://connect.mailerlite.com";

const mailerliteAdapter: NewsletterAdapter = {
  async subscribe(input) {
    const token = process.env.MAILERLITE_TOKEN;
    if (!token) {
      // The selector never picks this adapter without a token; this guards a
      // direct call.
      return refuse("provider is mailerlite but MAILERLITE_TOKEN is unset", input);
    }
    const groupId = process.env.MAILERLITE_GROUP_ID; // optional

    const body: Record<string, unknown> = { email: input.email, fields: {} };
    if (groupId) body.groups = [groupId];

    try {
      const res = await fetch(`${MAILERLITE_API_BASE}/api/subscribers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });

      // 401/403 is a bad or revoked token, 422 an address MailerLite rejects,
      // 429/5xx trouble on MailerLite's side. None of them subscribed anyone.
      if (!res.ok) {
        return refuse(`MailerLite answered ${res.status}`, input);
      }

      // Best-effort id extraction; MailerLite payload shape varies by API version
      let id = `ml-${randomUUID()}`;
      try {
        const data = (await res.json()) as { data?: { id?: string } };
        if (data?.data?.id) id = String(data.data.id);
      } catch {
        // ignore — fallback id already set
      }

      return { ok: true, id, provider: "mailerlite" };
    } catch (err) {
      return refuse("MailerLite request failed", input, {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },
};

// ─── Provider selector ───────────────────────────────────────────────────────

// Same two questions as src/lib/apply/apply-storage.ts, answered the same way.
//
// `isRealProduction` — a deployment serving real visitors, where a mock is
// never acceptable. Vercel sets VERCEL_ENV=production only for production
// deployments; previews also run with NODE_ENV=production, so NODE_ENV alone
// would refuse a mock a developer deliberately chose on a preview. The
// NODE_ENV fallback covers hosting that sets no VERCEL_ENV.
const isRealProduction = () =>
  process.env.VERCEL_ENV === "production" ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");

// `isHosted` — a real deployment, preview included. A preview that says
// "Subscribed." while subscribing nobody misleads whoever is testing the
// form as effectively as production would. Only preview and production
// count: `vercel dev` sets VERCEL_ENV=development for a local session, and a
// developer machine must still get the documented mock fallback. The
// NODE_ENV fallback covers hosting that sets no VERCEL_ENV.
const isHosted = () =>
  process.env.VERCEL_ENV === "preview" ||
  process.env.VERCEL_ENV === "production" ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");

// Warn once per cold start per condition, so a misconfigured deploy leaves one
// visible signal rather than a line per submission. Each refused subscription
// is still logged individually by refuse().
const warned = new Set<string>();
function warnOnce(key: string, message: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(message);
}

function isDisabledByPublicFlag(): boolean {
  // Server-side env access — NEXT_PUBLIC_* is exposed at runtime in API routes
  // too, just like any other env var.
  const v = process.env.NEXT_PUBLIC_MAILERLITE_DISABLED;
  return v === "true" || v === "1";
}

export function getNewsletterAdapter(): NewsletterAdapter {
  const explicit = process.env.NEWSLETTER_PROVIDER?.toLowerCase().trim();

  // Naming mock, or setting NEXT_PUBLIC_MAILERLITE_DISABLED for a browser,
  // Storybook or E2E session, is consent to a run that subscribes nobody.
  // Fine locally and on a preview; never in front of real visitors. The flag
  // still wins over a configured provider, as it always has.
  if (explicit === "mock" || isDisabledByPublicFlag()) {
    if (isRealProduction()) {
      warnOnce(
        "mock-in-prod",
        "[newsletter] mock (NEWSLETTER_PROVIDER=mock or NEXT_PUBLIC_MAILERLITE_DISABLED) is refused in production; subscriptions will be rejected",
      );
      return refusingAdapter("mock subscribes nobody, and this is production");
    }
    return mockAdapter;
  }

  if (explicit === "mailerlite") {
    if (!process.env.MAILERLITE_TOKEN) {
      warnOnce(
        "mailerlite-no-token",
        "[newsletter] NEWSLETTER_PROVIDER=mailerlite but MAILERLITE_TOKEN is unset; subscriptions will be rejected",
      );
      return refusingAdapter("provider is mailerlite but MAILERLITE_TOKEN is unset");
    }
    return mailerliteAdapter;
  }

  // Anything else — unset, or a value this module does not implement — cannot
  // subscribe anyone, and nobody chose that. On any deployed environment it is
  // the failure this selector exists to prevent. Locally it is just a
  // developer without configuration, so mock keeps the form workable.
  if (isHosted()) {
    warnOnce(
      "unusable-provider-hosted",
      `[newsletter] NEWSLETTER_PROVIDER is ${explicit ? `"${explicit}", which is not a usable provider` : "unset"}; subscriptions will be rejected`,
    );
    return refusingAdapter(
      explicit
        ? `provider "${explicit}" is not implemented and this is a deployed environment`
        : "no provider is configured and this is a deployed environment",
    );
  }

  warnOnce(
    "mock-fallback",
    `[newsletter] NEWSLETTER_PROVIDER is ${explicit ? `"${explicit}"` : "unset"}; using the mock adapter. Nothing will be stored.`,
  );
  return mockAdapter;
}

// Convenience for UI to decide whether to show the pending notice.
// Reads only NEXT_PUBLIC_* so it's safe to call from server components.
export function isNewsletterInPendingMode(): boolean {
  if (isDisabledByPublicFlag()) return true;
  // If the public flag isn't set, we don't expose the runtime provider
  // resolution to the client (server-only env vars). The UI assumes
  // pending mode whenever it's mounted on a page that hasn't been
  // told otherwise. Components default to showing the notice.
  return false;
}
