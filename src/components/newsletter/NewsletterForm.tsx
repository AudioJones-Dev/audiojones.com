"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import {
  newsletterSchema,
  NEWSLETTER_SOURCES,
  type NewsletterInput,
} from "@/lib/newsletter/newsletter-schema";
import NewsletterPendingNotice from "./NewsletterPendingNotice";
import NewsletterSuccess from "./NewsletterSuccess";

type Variant = "default" | "inline";

type Props = {
  /** "default" = final-CTA-style block. "inline" = compact footer row. */
  variant?: Variant;
  /** Source-attribution label written into the payload. */
  source?: (typeof NEWSLETTER_SOURCES)[number];
  /** Show the gold "pending mode" notice above the form. */
  showPendingNotice?: boolean;
  className?: string;
};

const initial: NewsletterInput = {
  email: "",
  source: "direct",
  hp: "",
};

export default function NewsletterForm({
  variant = "default",
  source,
  showPendingNotice = true,
  className,
}: Props) {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<NewsletterInput>({
    ...initial,
    source: source ?? "direct",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  // UTM passthrough on mount
  useEffect(() => {
    if (!searchParams) return;
    setForm((f) => ({
      ...f,
      utmSource: searchParams.get("utm_source") ?? undefined,
      utmMedium: searchParams.get("utm_medium") ?? undefined,
      utmCampaign: searchParams.get("utm_campaign") ?? undefined,
      utmTerm: searchParams.get("utm_term") ?? undefined,
      utmContent: searchParams.get("utm_content") ?? undefined,
    }));
  }, [searchParams]);

  if (submittedEmail) {
    return <NewsletterSuccess variant={variant} email={submittedEmail} />;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = newsletterSchema.safeParse(form);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Please check the email field";
      setError(first);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as
        | { ok: true; id: string; provider: string }
        | { ok: false; error: string; code: string };
      if (!data.ok) {
        // Adapter pattern guarantees mock fallback on upstream failure,
        // so a non-ok response here means schema/network — surface a soft
        // generic message, never the upstream error verbatim.
        setError("Something went wrong. Please try again in a moment.");
        setSubmitting(false);
        return;
      }
      setSubmittedEmail(parsed.data.email);
    } catch {
      setError("Network error. Please try again in a moment.");
      setSubmitting(false);
    }
  }

  // ─── Inline variant — compact, single row ─────────────────────────────────
  if (variant === "inline") {
    return (
      <form
        onSubmit={onSubmit}
        noValidate
        aria-label="Subscribe to insights"
        className={["flex flex-col gap-3", className].filter(Boolean).join(" ")}
      >
        <Honeypot value={form.hp ?? ""} onChange={(v) => setForm((f) => ({ ...f, hp: v }))} />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <label htmlFor="newsletter-inline-email" className="sr-only">
            Email
          </label>
          <Input
            id="newsletter-inline-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            invalid={!!error}
            className="sm:flex-1"
          />
          <Button
            type="submit"
            variant="secondary"
            size="md"
            disabled={submitting}
            className="sm:w-auto"
          >
            {submitting ? "Subscribing…" : "Subscribe"}
          </Button>
        </div>
        {error && (
          <p role="alert" className="t-small text-[color:var(--danger)]">
            {error}
          </p>
        )}
      </form>
    );
  }

  // ─── Default variant — block, with pending notice ─────────────────────────
  return (
    <div className={["flex flex-col gap-4", className].filter(Boolean).join(" ")}>
      {showPendingNotice && <NewsletterPendingNotice />}
      <form
        onSubmit={onSubmit}
        noValidate
        aria-label="Subscribe to insights"
        className="flex flex-col gap-4"
      >
        <Honeypot value={form.hp ?? ""} onChange={(v) => setForm((f) => ({ ...f, hp: v }))} />
        <FormField
          id="newsletter-email"
          label="Email"
          hint="Tactical, contrarian, framework-driven. No drip nurture fluff."
          error={error ?? undefined}
        >
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            invalid={!!error}
          />
        </FormField>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
          >
            {submitting ? "Subscribing…" : "Subscribe"}
          </Button>
          <p className="t-small text-fg-3">No spam. Unsubscribe in one click.</p>
        </div>
      </form>
    </div>
  );
}

// ─── Honeypot field — visually hidden, not focusable ──────────────────────────

function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      aria-hidden
      className="absolute h-px w-px overflow-hidden"
      style={{ clip: "rect(0 0 0 0)", clipPath: "inset(50%)" }}
    >
      <label>
        Leave this field empty
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
