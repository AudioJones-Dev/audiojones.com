// Adapter interface + mock + production wrappers for newsletter subscriptions.
//
// Provider selection:
//   - "mock" when NEXT_PUBLIC_NEWSLETTER_DISABLED is "true"/"1" or
//     NEWSLETTER_PROVIDER is "mock"
//   - otherwise "resend" whenever the Resend newsletter config is complete
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
import { subscribeWithResend } from "@/lib/integrations/resend-newsletter";

export type NewsletterSuccess = {
  ok: true;
  id: string;
  provider: "mock" | "resend";
  welcomeQueued?: boolean;
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

// ─── Resend adapter ─────────────────────────────────────────────────────────

const resendAdapter: NewsletterAdapter = {
  async subscribe(input) {
    const result = await subscribeWithResend(input);
    if (!result.ok) {
      console.error("[newsletter resend] subscribe failed", {
        status: result.status,
        email: redactEmail(input.email),
        source: input.source,
      });
      return { ok: false, error: "Subscription failed", code: "PROVIDER_ERROR" };
    }
    return {
      ok: true,
      id: result.id,
      provider: "resend",
      ...(result.welcomeQueued === undefined
        ? {}
        : { welcomeQueued: result.welcomeQueued }),
    };
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
  const values = [
    process.env.NEXT_PUBLIC_NEWSLETTER_DISABLED,
    // Compatibility during the provider migration. Remove after every
    // environment has the provider-neutral flag.
    process.env.NEXT_PUBLIC_MAILERLITE_DISABLED,
  ];
  return values.some((value) => value === "true" || value === "1");
}

// Same definition as the apply pipeline: previews run with NODE_ENV=production
// too, so only VERCEL_ENV identifies the deployment serving real visitors.
const isRealProduction = () =>
  process.env.VERCEL_ENV === "production" ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === "production");

export type NewsletterProvider = "mock" | "resend";

export function resolveProvider(): NewsletterProvider {
  if (isDisabledByPublicFlag()) return "mock";
  const explicit = process.env.NEWSLETTER_PROVIDER?.toLowerCase().trim();
  if (explicit === "mock") return "mock";
  if (explicit === "resend") return "resend";
  return process.env.RESEND_API_KEY &&
    process.env.RESEND_NEWSLETTER_SEGMENT_ID &&
    process.env.RESEND_NEWSLETTER_TOPIC_ID &&
    process.env.RESEND_NEWSLETTER_WELCOME_TEMPLATE_ID
    ? "resend"
    : "mock";
}

export function getNewsletterAdapter(): NewsletterAdapter {
  if (resolveProvider() === "resend") return resendAdapter;
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
