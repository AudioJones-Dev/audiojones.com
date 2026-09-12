// Adapter interface + Neon, MailerLite and mock adapters for newsletter
// subscriptions.
//
// Provider switch: env `NEWSLETTER_PROVIDER` ∈ {"neon", "mailerlite", "mock"}.
//   - "neon":       saves the address to `newsletter_subscribers` on NeonDB
//                   (src/db/newsletter.ts) and answers ok:true once the row
//                   exists. MailerLite is called after the response and the
//                   outcome is written back to the row: 'synced', 'failed'
//                   (MailerLite refused or was unreachable) or 'skipped' (no
//                   MAILERLITE_TOKEN). A MailerLite failure does not cost the
//                   signup. Requires DATABASE_URL and
//                   db/migrations/005_newsletter_subscribers.sql. Without a
//                   DATABASE_URL it is refused, never downgraded to mock.
//   - "mailerlite": POSTs the address to MailerLite with MAILERLITE_TOKEN and
//                   answers ok:true only when MailerLite accepts it. A missing
//                   token, a non-2xx response or a failed request is refused
//                   with PROVIDER_ERROR. Nothing is saved on our side, so a
//                   refused signup is recorded only in the log.
//   - "mock":       logs a redacted payload, simulates 700ms latency, returns
//                   a synthetic id. Nothing is stored. Naming it is allowed
//                   locally and on previews, and refused in real production.
//                   NEXT_PUBLIC_MAILERLITE_DISABLED=true|1 is the same choice
//                   and gets the same treatment.
//   - Anything else, unset included, is refused on any deployed environment.
//     Only local development falls back to mock.
//
// MAILERLITE_TOKEN is the only MailerLite key name read; MAILERLITE_API_KEY is
// not.
//
// Persistence is opt-in, as it is for /apply. `neon` must be set explicitly,
// and a DATABASE_URL alone does not enable it, so migration 005 can be applied
// before any write reaches the table. Setting the provider before applying the
// migration is the wrong order: every insert fails and visitors get a retry
// message. Migration first.
//
// This module used to fail soft on purpose: every path, a MailerLite 401
// included, ended in a synthetic success, which NewsletterForm renders as
// "Subscribed." The form sits in the footer of every page, so an unset
// provider or a revoked token discarded every signup behind a success
// message. #251 closed the same hole for /apply after LEAD_FORM_PROVIDER was
// found unset in production on 2026-09-10, and the selector below follows
// src/lib/apply/apply-storage.ts. Nothing here may answer ok:true unless the
// row was saved, MailerLite accepted the address, or a developer chose mock
// outside production.
//
// Hard rules: no Firebase. No hardcoded secrets.

import { randomUUID } from "node:crypto";
import type { MailerLiteSyncOutcome, NewsletterRowContext } from "./newsletter-row";
import type { NewsletterInput } from "./newsletter-schema";

export type NewsletterSuccess = {
  ok: true;
  id: string;
  provider: "mock" | "mailerlite" | "neon";
};

export type NewsletterError = {
  ok: false;
  error: string;
  code: "VALIDATION_ERROR" | "PROVIDER_ERROR" | "RATE_LIMITED";
};

export type NewsletterResult = NewsletterSuccess | NewsletterError;

export interface NewsletterAdapter {
  subscribe(input: NewsletterInput, ctx: NewsletterRowContext): Promise<NewsletterResult>;
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

// ─── MailerLite ──────────────────────────────────────────────────────────────

const MAILERLITE_API_BASE =
  process.env.MAILERLITE_API_BASE ?? "https://connect.mailerlite.com";

type MailerLiteResult =
  | { ok: true; subscriberId: string | null }
  | { ok: false; reason: string; error?: string };

// Shared by the mailerlite adapter, which refuses on failure, and the neon
// sync, which records it. Never throws.
async function sendToMailerLite(token: string, email: string): Promise<MailerLiteResult> {
  const groupId = process.env.MAILERLITE_GROUP_ID; // optional

  const body: Record<string, unknown> = { email, fields: {} };
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
      return { ok: false, reason: `MailerLite answered ${res.status}` };
    }

    // Best-effort id extraction; MailerLite payload shape varies by API version
    let subscriberId: string | null = null;
    try {
      const data = (await res.json()) as { data?: { id?: string } };
      if (data?.data?.id) subscriberId = String(data.data.id);
    } catch {
      // ignore — the address was accepted either way
    }
    return { ok: true, subscriberId };
  } catch (err) {
    return {
      ok: false,
      reason: "MailerLite request failed",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

const mailerliteAdapter: NewsletterAdapter = {
  async subscribe(input) {
    const token = process.env.MAILERLITE_TOKEN;
    if (!token) {
      // The selector never picks this adapter without a token; this guards a
      // direct call.
      return refuse("provider is mailerlite but MAILERLITE_TOKEN is unset", input);
    }

    const sent = await sendToMailerLite(token, input.email);
    if (!sent.ok) {
      return refuse(sent.reason, input, sent.error ? { error: sent.error } : undefined);
    }
    return { ok: true, id: sent.subscriberId ?? `ml-${randomUUID()}`, provider: "mailerlite" };
  },
};

// ─── Neon adapter ────────────────────────────────────────────────────────────

// The two writes the neon adapter makes. Injected so the save-then-sync
// sequence can be tested without a database; the selector uses neonStore.
export interface NewsletterStore {
  save(input: NewsletterInput, ctx: NewsletterRowContext): Promise<{ id: string }>;
  recordSync(id: string, outcome: MailerLiteSyncOutcome): Promise<void>;
}

// Imported lazily, as in src/lib/apply/apply-storage.ts. src/db/* is
// "server-only", which throws when loaded outside a server bundle, and the
// tests import this module directly.
const neonStore: NewsletterStore = {
  async save(input, ctx) {
    const { saveNewsletterSubscriber } = await import("@/db/newsletter");
    return saveNewsletterSubscriber(input, ctx);
  },
  async recordSync(id, outcome) {
    const { recordMailerLiteSync } = await import("@/db/newsletter");
    return recordMailerLiteSync(id, outcome);
  },
};

// Sends a saved address to MailerLite and writes down what happened. Never
// throws: the signup is already saved and answered, so the log and the row are
// the only places left to report a failure.
async function syncToMailerLite(store: NewsletterStore, id: string, email: string) {
  const token = process.env.MAILERLITE_TOKEN;
  let outcome: MailerLiteSyncOutcome;

  if (!token) {
    outcome = { status: "skipped" };
  } else {
    const sent = await sendToMailerLite(token, email);
    if (sent.ok) {
      outcome = { status: "synced", subscriberId: sent.subscriberId };
    } else {
      outcome = { status: "failed", error: sent.reason };
      // The row id rather than the address: the address is safe in the table.
      console.error("[newsletter] MailerLite sync failed; subscriber is saved", {
        id,
        reason: sent.reason,
        error: sent.error,
      });
    }
  }

  try {
    await store.recordSync(id, outcome);
  } catch (err) {
    console.error("[newsletter] could not record the MailerLite sync result", {
      id,
      status: outcome.status,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export function createNeonAdapter(store: NewsletterStore): NewsletterAdapter {
  return {
    async subscribe(input, ctx) {
      let saved: { id: string };
      try {
        saved = await store.save(input, ctx);
      } catch (err) {
        // Nothing was saved, so this is a real failure and the visitor should
        // retry. The Neon message names tables and constraints; it is logged,
        // never returned.
        return refuse("could not save the subscriber to Neon", input, {
          error: err instanceof Error ? err.message : String(err),
        });
      }
      const { id } = saved;

      // Every signup is sent to MailerLite, repeats included, as the
      // mailerlite provider already does.
      //
      // `after` rather than awaiting: the saved row is what the visitor was
      // promised, so MailerLite's latency or failure must not delay or change
      // the answer. `after` rather than a bare `void`: on serverless the
      // invocation can be suspended once the response is sent, which would
      // drop the request mid-flight and leave the row 'pending'.
      const sync = () => syncToMailerLite(store, id, input.email);
      try {
        const { after } = await import("next/server");
        after(sync);
      } catch {
        // No request scope — a script or a test calling the adapter directly.
        // Await instead; syncToMailerLite never rejects.
        await sync();
      }

      return { ok: true, id, provider: "neon" };
    },
  };
}

const neonAdapter = createNeonAdapter(neonStore);

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

// `isHosted` — any deployed environment, preview included. A preview that
// says "Subscribed." while subscribing nobody misleads whoever is testing the
// form as effectively as production would.
const isHosted = () =>
  Boolean(process.env.VERCEL_ENV) || process.env.NODE_ENV === "production";

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

  if (explicit === "neon") {
    if (!process.env.DATABASE_URL) {
      warnOnce(
        "neon-no-db",
        "[newsletter] NEWSLETTER_PROVIDER=neon but DATABASE_URL is unset; subscriptions will be rejected",
      );
      return refusingAdapter("provider is neon but DATABASE_URL is unset");
    }
    if (!process.env.MAILERLITE_TOKEN && isHosted()) {
      warnOnce(
        "neon-no-mailerlite",
        "[newsletter] NEWSLETTER_PROVIDER=neon but MAILERLITE_TOKEN is unset; subscribers will be saved as 'skipped' and not sent to MailerLite",
      );
    }
    return neonAdapter;
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
