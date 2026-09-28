// Adapter interface + mock + production wrappers for newsletter subscriptions.
//
// Provider selection:
//   - "mock" when NEXT_PUBLIC_MAILERLITE_DISABLED is "true"/"1" or
//     NEWSLETTER_PROVIDER is "mock"
//   - "neon" when NEWSLETTER_PROVIDER says so: the address is saved to
//     `newsletter_subscribers` and the signup is answered once the row
//     exists, then sent to MailerLite after the response
//   - otherwise "mailerlite" whenever a MailerLite token is configured
//   - otherwise "mock"
//
// Mock never answers in real production: it would show "you're subscribed"
// while discarding the address. There, a missing token or an upstream
// failure returns PROVIDER_ERROR and the form asks the visitor to retry.
//
// Persistence is opt-in, as it is for /apply. `neon` must be named
// explicitly — a DATABASE_URL alone does not enable it — so
// db/migrations/005_newsletter_subscribers.sql can be applied before any
// write reaches the table. Setting the provider before applying the
// migration is the wrong order: every insert fails and visitors get a retry
// message. Migration first.
//
// Under "neon" a MailerLite failure no longer costs the signup. The row is
// the promise to the visitor; the sync result is recorded on it as 'synced',
// 'failed' or 'skipped' so a failed address can be replayed. Under
// "mailerlite" nothing is saved on our side, so a failure is still a refusal.
//
// Hard rules: no Firebase. No hardcoded secrets.

import { randomUUID } from "node:crypto";
import type { MailerLiteSyncOutcome, NewsletterRowContext } from "./newsletter-row";
import type { NewsletterInput } from "./newsletter-schema";
import { redactEmail } from "@/lib/logging/redact-email";
import { getMailerLiteToken, upsertSubscriber } from "@/lib/integrations/mailerlite";

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
  // `ctx` carries what the row needs but the form cannot supply. It is
  // optional so the adapters that store nothing can be called without it.
  subscribe(input: NewsletterInput, ctx?: NewsletterRowContext): Promise<NewsletterResult>;
}

// ─── Mock adapter ────────────────────────────────────────────────────────────

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

// An upstream failure is reported, never papered over with the mock: a
// "you're subscribed" screen for an address MailerLite never received is a
// lost subscriber nobody finds out about.
const mailerliteAdapter: NewsletterAdapter = {
  async subscribe(input) {
    const groupId = process.env.MAILERLITE_GROUP_ID;
    const result = await upsertSubscriber({
      email: input.email,
      name: input.name,
      groups: groupId ? [groupId] : undefined,
    });
    if (!result.ok) {
      console.error("[newsletter mailerlite] subscribe failed", {
        status: result.status,
        email: redactEmail(input.email),
        source: input.source,
      });
      return { ok: false, error: "Subscription failed", code: "PROVIDER_ERROR" };
    }
    return { ok: true, id: result.id, provider: "mailerlite" };
  },
};

const refusingAdapter: NewsletterAdapter = {
  async subscribe(input) {
    console.error("[newsletter] no live provider in production; subscription refused", {
      email: redactEmail(input.email),
      source: input.source,
    });
    return { ok: false, error: "Subscription failed", code: "PROVIDER_ERROR" };
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
// throws: the signup is already saved and answered, so the log and the row
// are the only places left to report a failure.
//
// The token check goes through getMailerLiteToken() rather than reading one
// name: MAILERLITE_API_KEY is accepted as a fallback name, and reading only
// MAILERLITE_TOKEN would record 'skipped' on a deployment whose upsert would
// in fact have worked.
async function syncToMailerLite(
  store: NewsletterStore,
  id: string,
  input: NewsletterInput,
) {
  let outcome: MailerLiteSyncOutcome;

  if (!getMailerLiteToken()) {
    outcome = { status: "skipped" };
  } else {
    const groupId = process.env.MAILERLITE_GROUP_ID;
    const result = await upsertSubscriber({
      email: input.email,
      name: input.name,
      groups: groupId ? [groupId] : undefined,
    });
    if (result.ok) {
      outcome = { status: "synced", subscriberId: result.id };
    } else {
      outcome = { status: "failed", error: `MailerLite answered ${result.status}` };
      // The row id rather than the address: the address is safe in the table.
      console.error("[newsletter] MailerLite sync failed; subscriber is saved", {
        id,
        status: result.status,
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
        saved = await store.save(input, ctx ?? { ipHash: null, userAgent: null });
      } catch (err) {
        // Nothing was saved, so this is a real failure and the visitor should
        // retry. The Neon message names tables and constraints; it is logged,
        // never returned.
        console.error("[newsletter] could not save the subscriber", {
          email: redactEmail(input.email),
          source: input.source,
          error: err instanceof Error ? err.message : String(err),
        });
        return { ok: false, error: "Subscription failed", code: "PROVIDER_ERROR" };
      }
      const { id } = saved;

      // `after` rather than awaiting: the saved row is what the visitor was
      // promised, so MailerLite's latency or failure must not delay or change
      // the answer. `after` rather than a bare `void`: on serverless the
      // invocation can be suspended once the response is sent, which would
      // drop the request mid-flight and leave the row 'pending'.
      const sync = () => syncToMailerLite(store, id, input);
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

// Naming neon without a DATABASE_URL is a deployment-config error, and
// refusing is the only safe answer in every environment: falling back to mock
// would answer "you're subscribed" while the address went nowhere, and a
// smoke test against a half-configured deploy is expected to fail.
const neonMisconfiguredAdapter: NewsletterAdapter = {
  async subscribe(input) {
    console.error("[newsletter] NEWSLETTER_PROVIDER=neon but DATABASE_URL is unset; subscription refused", {
      email: redactEmail(input.email),
      source: input.source,
    });
    return { ok: false, error: "Subscription failed", code: "PROVIDER_ERROR" };
  },
};

// ─── Provider selector ───────────────────────────────────────────────────────

function isDisabledByPublicFlag(): boolean {
  // Server-side env access — NEXT_PUBLIC_* is exposed at runtime in API routes
  // too, just like any other env var.
  const v = process.env.NEXT_PUBLIC_MAILERLITE_DISABLED;
  return v === "true" || v === "1";
}

// Same definition as the apply pipeline: previews run with NODE_ENV=production
// too, so only VERCEL_ENV identifies the deployment serving real visitors.
const isRealProduction = () =>
  process.env.VERCEL_ENV === "production" ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");

export type NewsletterProvider = "mock" | "mailerlite" | "neon";

export function resolveProvider(): NewsletterProvider {
  // The disable flag still wins over everything, as it always has: a
  // Storybook or E2E session that asked for no integrations must not start
  // writing rows either.
  if (isDisabledByPublicFlag()) return "mock";
  const explicit = process.env.NEWSLETTER_PROVIDER?.toLowerCase().trim();
  if (explicit === "mock") return "mock";
  if (explicit === "neon") return "neon";
  return getMailerLiteToken() ? "mailerlite" : "mock";
}

export function getNewsletterAdapter(): NewsletterAdapter {
  const provider = resolveProvider();
  if (provider === "neon") {
    return process.env.DATABASE_URL ? neonAdapter : neonMisconfiguredAdapter;
  }
  if (provider === "mailerlite") return mailerliteAdapter;
  return isRealProduction() ? refusingAdapter : mockAdapter;
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
