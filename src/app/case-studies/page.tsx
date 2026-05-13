import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { publishedCaseStudies, type CaseStudy } from "@/data/case-studies";
import { buildMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "Applied Intelligence Engagements documented as signal, leak, and system. Anonymized case studies with verified metrics from in-flight Audio Jones engagements.";

export const metadata: Metadata = buildMetadata({
  title: "Case Studies",
  description: DESCRIPTION,
  path: "/case-studies",
});

function CaseStudyCard({ study }: { study: CaseStudy }) {
  const headlineMetrics = study.results.slice(0, 3);
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group flex h-full flex-col rounded-[4px] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6 transition-colors hover:border-[var(--signal-yellow)] sm:p-8"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
          {study.industry}
        </span>
        <span className="h-1 w-1 rounded-full bg-[var(--text-muted)]" aria-hidden />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
          {study.duration}
        </span>
      </div>

      <h3 className="mt-6 font-accent text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#FFFFFF] group-hover:text-[var(--signal-yellow)]">
        {study.headline}
      </h3>

      <p className="mt-4 text-base leading-7 text-[var(--text-primary)]">
        {study.summary}
      </p>

      <dl className="mt-8 grid gap-4 border-t border-[var(--border-subtle)] pt-6 sm:grid-cols-3">
        {headlineMetrics.map((metric) => (
          <div key={`${metric.value}-${metric.label}`}>
            <dt className="font-accent text-3xl font-bold leading-none tracking-[-0.02em] text-[var(--signal-yellow)]">
              {metric.value}
            </dt>
            <dd className="mt-2 text-xs leading-5 text-[var(--text-primary)]">
              {metric.label}
            </dd>
          </div>
        ))}
      </dl>

      <span className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--signal-yellow)]">
        Read Case Study
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}

export default function CaseStudiesPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--aj-gradient-dark)] py-20 sm:py-28 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[1080px] px-5 sm:px-8">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--signal-yellow)]">
            Operator Evidence
          </p>
          <h1 className="mt-6 max-w-[20ch] font-accent text-[clamp(2.55rem,8vw,5rem)] font-bold leading-[0.98] tracking-[-0.035em] text-[#FFFFFF]">
            Proof should show the system, not just the result.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-primary)] sm:text-xl">
            {DESCRIPTION}
          </p>
        </div>
      </section>

      <section className="bg-[var(--bg-base)] py-16 sm:py-20">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Published
          </p>
          <div className="mt-8 grid gap-6">
            {publishedCaseStudies.map((study) => (
              <CaseStudyCard key={study.slug} study={study} />
            ))}
          </div>

          <div className="mt-12 rounded-[4px] border border-dashed border-[var(--border-subtle)] bg-[var(--surface-1)] p-8 text-center">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
              In Progress
            </p>
            <p className="mt-3 text-base leading-7 text-[var(--text-muted)]">
              More case studies coming. Several engagements are in flight; we publish
              once metrics stabilize and client consent is on file.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--aj-gradient-dark)] py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[900px] px-5 text-center sm:px-8">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--signal-yellow)]">
            Next Engagement
          </p>
          <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.035em] text-[#FFFFFF]">
            Your business could be next.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[var(--text-primary)]">
            Start with the AI Readiness Diagnostic. It produces the same signal map
            our engagements are built on — before anything gets automated.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/ai-readiness-diagnostic" variant="glow">
              Start the AI Readiness Diagnostic
            </ButtonLink>
            <ButtonLink href="/book-a-call" variant="secondary">
              Book a Call
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
