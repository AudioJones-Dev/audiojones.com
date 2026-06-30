"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import {
  FOUNDER_INTELLIGENCE_ASSESSMENT_RESULT_KEY,
  founderIntelligenceRecommendations,
  type FounderIntelligenceAssessmentResult,
} from "@/lib/founder-intelligence/assessment-result";

const scoreLabels = [
  {
    key: "icpFitScore",
    label: "ICP fit",
    description: "Revenue range, founder context, urgency, and fit for this offer.",
  },
  {
    key: "signalScore",
    label: "Signal clarity",
    description: "Whether the business can see source, follow-up, and operating truth.",
  },
  {
    key: "aiReadinessScore",
    label: "AI readiness",
    description: "Existing systems, tools, workflow maturity, and implementation posture.",
  },
  {
    key: "attributionScore",
    label: "Attribution clarity",
    description: "Confidence in CAC, LTV, lead source, and conversion-source tracking.",
  },
] as const;

function loadResult() {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(FOUNDER_INTELLIGENCE_ASSESSMENT_RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FounderIntelligenceAssessmentResult;
  } catch {
    sessionStorage.removeItem(FOUNDER_INTELLIGENCE_ASSESSMENT_RESULT_KEY);
    return null;
  }
}

function priorityLabel(priority: string) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export default function DiagnosticResult() {
  const [result] = useState<FounderIntelligenceAssessmentResult | null>(loadResult);
  const recommendation = useMemo(() => {
    if (!result) return null;
    return founderIntelligenceRecommendations[result.scores.priority];
  }, [result]);

  if (!result || !recommendation) {
    return (
      <section className="bg-bg-base py-24">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <p className="t-label">Result Not Found</p>
          <h1 className="mt-4 t-h2">Start the assessment to generate a score.</h1>
          <p className="mt-4 t-body-lg text-fg-2">
            Founder Intelligence Assessment results are generated after a
            successful diagnostic submission. No result state is currently
            available in this browser session.
          </p>
          <ButtonLink href="/founder-intelligence/diagnostic" className="mt-8">
            Start assessment
          </ButtonLink>
        </div>
      </section>
    );
  }

  const displayName = result.founder.companyName || result.founder.firstName || "Your business";

  return (
    <section className="bg-bg-base py-12 sm:py-16">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="border-b border-border-subtle pb-8">
          <p className="t-label">Founder Intelligence Assessment Result</p>
          <h1 className="mt-4 max-w-4xl text-balance t-h1">
            {displayName}: {result.scores.totalScore}/100 signal score
          </h1>
          <p className="mt-5 max-w-3xl t-body-lg text-fg-2">
            This is a first-pass score from the diagnostic intake. It is not a
            final operating diagnosis; it tells us which next step should happen
            before a system build.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Metric label="Total score" value={`${result.scores.totalScore}`} />
          <Metric label="Priority" value={priorityLabel(result.scores.priority)} />
          <Metric label="Constraint" value={result.context.primaryConstraint || "Not specified"} />
          <Metric label="Timeline" value={result.context.timeline || "Not specified"} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="aj-card is-surface-2">
            <p className="t-label">Score Dimensions</p>
            <h2 className="mt-4 t-h3">Where the signal is strongest and weakest.</h2>
            <div className="mt-8 grid gap-6">
              {scoreLabels.map((item) => {
                const score = result.scores[item.key];
                return (
                  <div key={item.key}>
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-headline font-bold text-fg-0">{item.label}</p>
                        <p className="mt-1 t-small text-fg-2">{item.description}</p>
                      </div>
                      <span className="font-mono text-sm text-signal-yellow">{score}</span>
                    </div>
                    <div
                      className={`aj-score-bar ${
                        score >= 70 ? "" : score >= 40 ? "is-mid" : "is-high"
                      }`}
                      style={{ "--value": score } as CSSProperties}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="aj-form-panel h-fit">
            <p className="t-label">Recommended Next Move</p>
            <h2 className="mt-4 t-h4">{recommendation.label}</h2>
            <p className="mt-3 t-body text-fg-1">{recommendation.summary}</p>
            <p className="mt-4 t-small text-fg-2">{recommendation.rationale}</p>
            <ButtonLink href={recommendation.href} className="mt-6 w-full">
              {recommendation.label}
            </ButtonLink>
            <p className="mt-5 t-small text-fg-3">
              Lead ID: <span className="font-mono text-signal-yellow">{result.leadId.slice(0, 8)}</span>
            </p>
          </aside>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 t-small">
          <Link
            href="/founder-intelligence/diagnostic"
            className="text-fg-2 underline-offset-4 hover:text-fg-0 hover:underline"
          >
            Re-run assessment
          </Link>
          <Link
            href="/founder-intelligence/diagnostic/thank-you"
            className="text-fg-2 underline-offset-4 hover:text-fg-0 hover:underline"
          >
            View confirmation page
          </Link>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="aj-data-panel">
      <p className="aj-data-label">{label}</p>
      <p className="mt-2 aj-data-value">{value}</p>
    </div>
  );
}

