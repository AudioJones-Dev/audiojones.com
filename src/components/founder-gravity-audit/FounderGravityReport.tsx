"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import {
  GRAVITY_LAYERS,
  SEGMENT_DEFINITIONS,
} from "@/lib/founder-gravity-audit/content";
import type { FounderGravityResult } from "@/lib/founder-gravity-audit/types";

const STORAGE_REPORT_KEY = "audiojones:fga:last-report";

type StoredReport = {
  leadId: string;
  result: FounderGravityResult;
  submittedAt: string;
  founder: {
    email: string;
    displayName: string;
    entityName: string;
  };
};

function emitCtaClick(report: StoredReport) {
  if (typeof window === "undefined") return;
  const event = {
    event: "fga_cta_clicked",
    leadId: report.leadId,
    segment: report.result.segment,
    gravityLoad: report.result.gravityLoad,
    conversionEvent: report.result.cta.event,
  };
  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  win.dataLayer?.push(event);
  window.dispatchEvent(
    new CustomEvent("audiojones:fga_event", {
      detail: { ...event, timestamp: new Date().toISOString() },
    }),
  );
}

export default function FounderGravityReport() {
  const [report] = useState<StoredReport | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(STORAGE_REPORT_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredReport;
    } catch {
      sessionStorage.removeItem(STORAGE_REPORT_KEY);
      return null;
    }
  });

  if (!report) {
    return (
      <section className="bg-bg-base py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <p className="t-label">Report Not Found</p>
          <h1 className="mt-4 t-h2">Start the diagnostic to generate a report.</h1>
          <p className="mt-4 t-body-lg">
            Founder Gravity Audit reports are generated after the preview reveal
            and email gate. No report state is currently available in this
            browser session.
          </p>
          <ButtonLink href="/founder-gravity-audit/diagnostic" className="mt-8">
            Begin diagnostic
          </ButtonLink>
        </div>
      </section>
    );
  }

  const { result } = report;
  const topLayers = result.topLayers.map((layer) => ({
    id: layer,
    label: GRAVITY_LAYERS[layer],
    score: result.layerScores[layer],
  }));

  return (
    <section className="bg-bg-base py-12 sm:py-16">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="border-b border-border-subtle pb-8">
          <p className="t-label">Founder Gravity Audit Report</p>
          <h1 className="mt-4 max-w-4xl text-balance t-h1">
            {report.founder.entityName}: {result.segment}
          </h1>
          <p className="mt-5 max-w-3xl t-body-lg">
            {SEGMENT_DEFINITIONS[result.segment]}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <ReportMetric label="Gravity Load" value={`${result.gravityLoad}`} />
          <ReportMetric label="Confidence" value={`${result.confidenceScore}`} />
          <ReportMetric label="Segment" value={result.segment} />
          <ReportMetric label="Lead ID" value={report.leadId.slice(0, 8)} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-6">
            <div className="aj-card is-surface-2">
              <p className="t-label">Layer Concentration</p>
              <h2 className="mt-4 t-h3">The strongest pull is in {GRAVITY_LAYERS[result.highestLayer]}.</h2>
              <div className="mt-6 grid gap-4">
                {topLayers.map((layer) => (
                  <div key={layer.id}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="font-headline font-bold text-fg-0">{layer.label}</span>
                      <span className="font-mono text-sm text-signal-yellow">{layer.score}</span>
                    </div>
                    <div
                      className={`aj-score-bar ${
                        layer.score >= 70 ? "" : layer.score >= 40 ? "is-mid" : "is-high"
                      }`}
                      style={{ "--value": layer.score } as CSSProperties}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="aj-card">
              <p className="t-label">Operational Exposure</p>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Callout
                  label="Top fragility zone"
                  value={result.topFragilityZone}
                />
                <Callout
                  label="Contradiction signal"
                  value={result.strongestContradictionSignal}
                />
                <Callout
                  label="Resonance zone"
                  value={GRAVITY_LAYERS[result.resonanceZone]}
                />
                <Callout
                  label="Report status"
                  value={
                    result.suppression.suppressed
                      ? `Suppressed: ${result.suppression.reason}`
                      : "Eligible for follow-up handoff"
                  }
                />
              </div>
            </div>
          </div>

          <aside className="aj-form-panel h-fit">
            <p className="t-label">Recommended Next Move</p>
            <h2 className="mt-4 t-h4">{result.cta.label}</h2>
            <p className="mt-3 t-body">
              This CTA is placed here because the diagnostic indicates the next
              useful move is tied to {GRAVITY_LAYERS[result.resonanceZone]}, not
              a generic sales sequence.
            </p>
            <Link
              href={result.cta.href}
              className="btn-glow mt-6 w-full"
              onClick={() => emitCtaClick(report)}
            >
              {result.cta.label}
            </Link>
            <p className="mt-5 t-small">
              Conversion event: <span className="font-mono text-signal-yellow">{result.cta.event}</span>
            </p>
          </aside>
        </div>

        <div className="mt-8">
          <Link
            href="/founder-gravity-audit/diagnostic"
            className="t-small text-fg-2 underline-offset-4 hover:text-fg-0 hover:underline"
          >
            Re-run diagnostic
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReportMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="aj-data-panel">
      <p className="aj-data-label">{label}</p>
      <p className="mt-2 aj-data-value">{value}</p>
    </div>
  );
}

function Callout({ label, value }: { label: string; value: string }) {
  return (
    <div className="aj-callout">
      <p className="aj-data-label">{label}</p>
      <p className="mt-2 font-headline text-lg font-bold text-fg-0">{value}</p>
    </div>
  );
}
