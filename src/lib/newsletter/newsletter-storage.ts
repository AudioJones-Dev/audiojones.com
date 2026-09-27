// Adapter interface + mock + production wrappers for newsletter subscriptions.
//
// Provider selection:
//   - "mock" when NEXT_PUBLIC_MAILERLITE_DISABLED is "true"/"1" or
//     NEWSLETTER_PROVIDER is "mock"
//   - otherwise "mailerlite" whenever a MailerLite token is configured
//   - otherwise "mock"
//
// Mock never answers in real production: it would show "you're subscribed"
// while discarding the address. There, a missing token or an upstream
// failure returns PROVIDER_ERROR and the form asks the visitor to retry.
//
// Hard rules: no Firebase. No hardcoded secrets.

import { randomUUID } from "node:crypto";
import type { NewsletterInput } from "./newsletter-schema";
import { redactEmail } from "@/lib/logging/redact-email";
import { getMailerLiteToken, upsertSubscriber } from "@/lib/integrations/mailerlite";

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

export type NewsletterProvider = "mock" | "mailerlite";

export function resolveProvider(): NewsletterProvider {
  if (isDisabledByPublicFlag()) return "mock";
  if (process.env.NEWSLETTER_PROVIDER?.toLowerCase().trim() === "mock") return "mock";
  return getMailerLiteToken() ? "mailerlite" : "mock";
}

export function getNewsletterAdapter(): NewsletterAdapter {
  if (resolveProvider() === "mailerlite") return mailerliteAdapter;
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
