"use client";

import { Suspense, useMemo, useSyncExternalStore } from "react";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

const DIAGNOSTIC_RESULT_STORAGE_KEY = "audiojones:diagnostic-result";

type StoredDiagnosticResult =
  | {
      type: "applied-intelligence";
      leadId?: string | null;
      priority?: string;
      totalScore?: number;
      primaryConstraint?: string;
      desiredOutcome?: string;
      timeline?: string;
      email?: string;
      submittedAt?: string;
    }
  | {
      type: "roi-calculator";
      leadId?: string | null;
      recommendation?: string;
      recommendedNextAction?: string;
      annualSavings?: number;
      monthlySavings?: number;
      readinessScore?: number;
      confidenceTier?: string;
      paybackMonths?: number | null;
      email?: string;
      submittedAt?: string;
    };

function readStoredResult(): StoredDiagnosticResult | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(DIAGNOSTIC_RESULT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredDiagnosticResult;
    if (parsed.type !== "applied-intelligence" && parsed.type !== "roi-calculator") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function titleCase(value?: string) {
  if (!value) return "Received";
  return value
    .split("-")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function subscribeToStoredResult() {
  return () => undefined;
}

export default function DiagnosticThankYouPanel() {
  const result = useSyncExternalStore(
    subscribeToStoredResult,
    readStoredResult,
    () => null,
  );

  const summary = useMemo(() => {
    if (!result) {
      return {
        label: "Diagnostic received",
        title: "Your diagnostic submission is in.",
        description:
          "Your answers were received. The detailed report and next-step explanation will be sent to the email address you submitted.",
        metrics: [
          ["Status", "Queued for review"],
          ["Report", "Email delivery pending"],
          ["Next step", "Optional call"],
        ],
      };
    }

    if (result.type === "roi-calculator") {
      return {
        label: "ROI result received",
        title: result.recommendation || "Your ROI signal is ready.",
        description:
          result.recommendedNextAction ||
          "Your directional ROI report will be emailed with the recommended next action.",
        metrics: [
          ["Annual savings", result.annualSavings ? money(result.annualSavings) : "Calculated"],
          ["Readiness", result.readinessScore ? `${result.readinessScore}/100` : "Scored"],
          ["Confidence", titleCase(result.confidenceTier)],
        ],
      };
    }

    return {
      label: "Diagnostic result received",
      title: "Your AI readiness signal has been captured.",
      description:
        "Your score, fit signal, and next-step explanation will be emailed after the system processes the submission.",
      metrics: [
        ["Signal score", result.totalScore != null ? `${result.totalScore}/100` : "Scored"],
        ["Priority", titleCase(result.priority)],
        ["Timeline", result.timeline || "Review first"],
      ],
    };
  }, [result]);

  return (
    <section className="bg-bg-0 py-20 sm:py-28">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <Eyebrow tone="signal" withLine>
              {summary.label}
            </Eyebrow>
            <h1 className="mt-5 t-h1 text-balance">{summary.title}</h1>
            <p className="mt-5 t-lead text-fg-2">{summary.description}</p>
            <p className="mt-5 t-body text-fg-2">
              You do not need to keep this page open. The report path continues
              by email, and this page is safe to close after you have the next
              step you want.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {summary.metrics.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-[var(--line-2)] bg-bg-2 p-5"
                >
                  <p className="t-label text-fg-3">{label}</p>
                  <p className="mt-2 t-h4 text-fg-0">{value}</p>
                </div>
              ))}
            </div>

            {result?.leadId ? (
              <p className="mt-5 t-small text-fg-3">
                Reference ID: {result.leadId}
              </p>
            ) : null}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/book-a-call" variant="glow" size="lg">
                Schedule a Call
              </ButtonLink>
              <ButtonLink href="/" variant="secondary" size="lg">
                Back to Site
              </ButtonLink>
              <ButtonLink href="/insights" variant="ghost" size="lg">
                Browse Insights
              </ButtonLink>
            </div>
          </div>

          <aside className="rounded-lg border border-[var(--line-2)] bg-bg-2 p-6 sm:p-8">
            <Eyebrow tone="blue">Optional</Eyebrow>
            <h2 className="mt-4 t-h3 text-balance">
              Get the follow-up frameworks.
            </h2>
            <p className="mt-4 t-body text-fg-2">
              Subscribe only if you want the operating-system notes that sit
              behind the diagnostic: attribution, follow-up, AI readiness, and
              revenue recovery.
            </p>
            <div className="mt-6">
              <Suspense fallback={<NewsletterSkeleton />}>
                <NewsletterForm
                  source="diagnostic-thank-you"
                  showPendingNotice={false}
                />
              </Suspense>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function NewsletterSkeleton() {
  return (
    <div aria-hidden className="grid gap-4 opacity-50">
      <div className="h-20 rounded-md bg-bg-3" />
      <div className="h-12 w-36 rounded-md bg-bg-3" />
    </div>
  );
}
