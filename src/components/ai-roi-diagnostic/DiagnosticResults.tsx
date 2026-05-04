"use client";

import DiagnosticEmailGate from "./DiagnosticEmailGate";
import DiagnosticRecommendationCard from "./DiagnosticRecommendationCard";
import DiagnosticScoreCard from "./DiagnosticScoreCard";
import { getRecommendationCopy } from "@/lib/ai-roi-diagnostic/recommendations";
import type {
  DiagnosticInput,
  DiagnosticResult,
} from "@/lib/ai-roi-diagnostic/types";

type DiagnosticResultsProps = {
  input: DiagnosticInput;
  result: DiagnosticResult;
  onRestart: () => void;
};

const formatCurrency = (n: number): string => {
  if (!Number.isFinite(n)) return "$0";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(Math.round(n));
  return `${sign}$${abs.toLocaleString("en-US")}`;
};

const formatMonths = (m: number): string => {
  if (!Number.isFinite(m) || m <= 0) return "—";
  if (m > 60) return "60+ months";
  return `${m.toFixed(1)} months`;
};

export default function DiagnosticResults({
  input,
  result,
  onRestart,
}: DiagnosticResultsProps) {
  const recCopy = getRecommendationCopy(result.recommendation);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#FF4500]">
          Diagnostic Complete
        </p>
        <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
          Your AI ROI Diagnostic Results
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
          Based on your inputs, this diagnostic estimates the financial upside,
          operational readiness, and implementation risk of applying AI to your{" "}
          <span className="text-white">
            {input.workflowType || "selected"}
          </span>{" "}
          workflow.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <DiagnosticScoreCard
          title="AI ROI Score"
          score={result.roiScore}
          description="Whether the workflow has meaningful financial upside if automated."
        />
        <DiagnosticScoreCard
          title="AI Readiness Score"
          score={result.readinessScore}
          description="Operational maturity required for AI to actually work in your business."
        />
        <DiagnosticScoreCard
          title="Automation Priority"
          score={result.priorityScore}
          description="Whether this is the right workflow to automate first."
        />
      </div>

      <DiagnosticRecommendationCard
        recommendation={result.recommendation}
        description={recCopy.description}
        ctaLabel={recCopy.ctaLabel}
        ctaHref={recCopy.ctaHref}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
            Estimated Annual Impact
          </h3>
          <dl className="mt-4 space-y-3 text-sm text-white/85">
            <div className="flex items-center justify-between">
              <dt>Conservative</dt>
              <dd className="font-semibold text-white">
                {formatCurrency(result.conservativeAnnualImpact)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Expected</dt>
              <dd className="font-semibold text-white">
                {formatCurrency(result.expectedAnnualImpact)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Aggressive</dt>
              <dd className="font-semibold text-white">
                {formatCurrency(result.aggressiveAnnualImpact)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <dt className="text-white/70">Risk-adjusted (readiness)</dt>
              <dd className="font-semibold text-[#FF4500]">
                {formatCurrency(result.riskAdjustedAnnualImpact)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-white/50">
            Confidence:{" "}
            <span className="font-semibold text-white/80">
              {result.confidenceLevel}
            </span>
            . Estimates are directional, not guarantees.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
            Cost & Payback
          </h3>
          <dl className="mt-4 space-y-3 text-sm text-white/85">
            <div className="flex items-center justify-between">
              <dt>Estimated annual AI cost</dt>
              <dd className="font-semibold text-white">
                {formatCurrency(result.annualAiCost)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Monthly labor savings</dt>
              <dd className="font-semibold text-white">
                {formatCurrency(result.monthlyLaborSavings)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Annual error savings</dt>
              <dd className="font-semibold text-white">
                {formatCurrency(result.annualErrorSavings)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <dt className="text-white/70">Payback period</dt>
              <dd className="font-semibold text-[#FF4500]">
                {formatMonths(result.paybackMonths)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-white/70">ROI %</dt>
              <dd className="font-semibold text-white">
                {result.roiPercent.toLocaleString("en-US")}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
          Bottleneck Diagnosis
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/80">
          Bottleneck severity is{" "}
          <span className="font-semibold text-white">
            {result.bottleneckSeverity}
          </span>
          . The biggest pressure points in this workflow appear to come from
          handoffs, customer wait time, error rate, and approval gates. Reducing
          any one of these will increase the value AI can capture.
        </p>
      </div>

      <DiagnosticEmailGate input={input} result={result} />

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/40"
        >
          ← Restart Diagnostic
        </button>
        <p className="text-xs text-white/50">
          Want a deeper review of these results? Book an AI Readiness Review.
        </p>
      </div>
    </div>
  );
}
