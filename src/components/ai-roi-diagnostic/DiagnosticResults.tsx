"use client";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
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
      <div className="rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6 sm:p-10">
        <Eyebrow tone="gold">Diagnostic Complete</Eyebrow>
        <h2 className="mt-3 t-h2 text-balance text-fg-0">
          Your AI ROI Diagnostic Results
        </h2>
        <p className="mt-3 t-lead text-fg-2">
          Based on your inputs, this diagnostic estimates the financial upside,
          operational readiness, and implementation risk of applying AI to your{" "}
          <span className="text-fg-0">{input.workflowType || "selected"}</span>{" "}
          workflow.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <DiagnosticScoreCard
          tone="signal"
          title="AI ROI Score"
          score={result.roiScore}
          description="Whether the workflow has meaningful financial upside if automated."
        />
        <DiagnosticScoreCard
          tone="system"
          title="AI Readiness Score"
          score={result.readinessScore}
          description="Operational maturity required for AI to actually work in your business."
        />
        <DiagnosticScoreCard
          tone="metric"
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
        <div className="rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6">
          <Eyebrow tone="muted">Estimated Annual Impact</Eyebrow>
          <dl className="mt-4 space-y-3 t-body text-fg-1">
            <div className="flex items-center justify-between">
              <dt>Conservative</dt>
              <dd className="font-semibold text-fg-0">
                {formatCurrency(result.conservativeAnnualImpact)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Expected</dt>
              <dd className="font-semibold text-fg-0">
                {formatCurrency(result.expectedAnnualImpact)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Aggressive</dt>
              <dd className="font-semibold text-fg-0">
                {formatCurrency(result.aggressiveAnnualImpact)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--line-1)] pt-3">
              <dt className="text-fg-2">Risk-adjusted (readiness)</dt>
              <dd className="font-semibold text-aj-orange">
                {formatCurrency(result.riskAdjustedAnnualImpact)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 t-small text-fg-3">
            Confidence:{" "}
            <span className="font-semibold text-fg-1">
              {result.confidenceLevel}
            </span>
            . Estimates are directional, not guarantees.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6">
          <Eyebrow tone="muted">Cost & Payback</Eyebrow>
          <dl className="mt-4 space-y-3 t-body text-fg-1">
            <div className="flex items-center justify-between">
              <dt>Estimated annual AI cost</dt>
              <dd className="font-semibold text-fg-0">
                {formatCurrency(result.annualAiCost)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Monthly labor savings</dt>
              <dd className="font-semibold text-fg-0">
                {formatCurrency(result.monthlyLaborSavings)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Annual error savings</dt>
              <dd className="font-semibold text-fg-0">
                {formatCurrency(result.annualErrorSavings)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--line-1)] pt-3">
              <dt className="text-fg-2">Payback period</dt>
              <dd className="font-semibold text-aj-blue-bright">
                {formatMonths(result.paybackMonths)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-fg-2">ROI %</dt>
              <dd className="font-semibold text-fg-0">
                {result.roiPercent.toLocaleString("en-US")}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6">
        <Eyebrow tone="muted">Bottleneck Diagnosis</Eyebrow>
        <p className="mt-3 t-body text-fg-1">
          Bottleneck severity is{" "}
          <span className="font-semibold text-fg-0">
            {result.bottleneckSeverity}
          </span>
          . The biggest pressure points in this workflow appear to come from
          handoffs, customer wait time, error rate, and approval gates. Reducing
          any one of these will increase the value AI can capture.
        </p>
      </div>

      <DiagnosticEmailGate input={input} result={result} />

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" onClick={onRestart}>
          ← Restart Diagnostic
        </Button>
        <p className="t-small text-fg-3">
          Want a deeper review of these results? Take the Signal Diagnostic.
        </p>
      </div>
    </div>
  );
}
