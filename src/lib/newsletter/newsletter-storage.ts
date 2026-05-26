// Adapter interface + mock + production wrappers for newsletter subscriptions.
//
// Provider switch: env `NEWSLETTER_PROVIDER` ∈ {"mock", "mailerlite"}.
// Default is mock when:
//   - NEWSLETTER_PROVIDER is unset or "mock", OR
//   - MAILERLITE_TOKEN is unset, OR
//   - NEXT_PUBLIC_MAILERLITE_DISABLED is "true"/"1"
//
// Critical UX rule: when the live adapter is selected but the upstream
// MailerLite call returns 401/403/5xx, fall back to mock with a console
// warning rather than surfacing the error to the user. The user always
// gets a positive confirmation experience — the integration is the
// implementation detail.
//
// Hard rules: no Retired auth. No hardcoded secrets. Fail soft when env is
// missing. The form must always submit successfully via the mock adapter.

import { randomUUID } from "node:crypto";
import type { NewsletterInput } from "./newsletter-schema";

export type NewsletterSuccess = {
  ok: true;
  id: string;
  provider: "mock" | "mailerlite";
  fellBackToMock?: boolean;
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

// ─── MailerLite adapter (with mock fallback on upstream failure) ────────────

const MAILERLITE_API_BASE =
  process.env.MAILERLITE_API_BASE ?? "https://connect.mailerlite.com";

const mailerliteAdapter: NewsletterAdapter = {
  async subscribe(input) {
    const token = process.env.MAILERLITE_TOKEN;
    if (!token) {
      // Should not be selected in this state, but guard anyway
      // eslint-disable-next-line no-console
      console.warn(
        "[newsletter mailerlite] MAILERLITE_TOKEN missing — falling back to mock",
      );
      const r = await mockAdapter.subscribe(input);
      return r.ok ? { ...r, fellBackToMock: true } : r;
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

      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.warn(
          `[newsletter mailerlite] upstream ${res.status} — falling back to mock`,
        );
        const r = await mockAdapter.subscribe(input);
        return r.ok ? { ...r, fellBackToMock: true } : r;
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
      // eslint-disable-next-line no-console
      console.warn(
        "[newsletter mailerlite] network error — falling back to mock",
        err,
      );
      const r = await mockAdapter.subscribe(input);
      return r.ok ? { ...r, fellBackToMock: true } : r;
    }
  },
};

// ─── Provider selector ───────────────────────────────────────────────────────

function isDisabledByPublicFlag(): boolean {
  // Server-side env access — NEXT_PUBLIC_* is exposed at runtime in API routes
  // too, just like any other env var.
  const v = process.env.NEXT_PUBLIC_MAILERLITE_DISABLED;
  return v === "true" || v === "1";
}

export type NewsletterProvider = "mock" | "mailerlite";

export function resolveProvider(): NewsletterProvider {
  if (isDisabledByPublicFlag()) return "mock";
  const explicit = process.env.NEWSLETTER_PROVIDER?.toLowerCase().trim();
  if (explicit === "mailerlite" && process.env.MAILERLITE_TOKEN) {
    return "mailerlite";
  }
  return "mock";
}

export function getNewsletterAdapter(): NewsletterAdapter {
  return resolveProvider() === "mailerlite" ? mailerliteAdapter : mockAdapter;
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
