import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import type { CaseStudy } from "@/data/case-studies";

function MonoLabel({
  children,
  color = "muted",
}: {
  children: React.ReactNode;
  color?: "muted" | "signal";
}) {
  const tone =
    color === "signal" ? "text-[var(--signal-yellow)]" : "text-[var(--text-muted)]";
  return (
    <p
      className={`font-mono text-[10px] font-medium uppercase tracking-[0.16em] ${tone}`}
    >
      {children}
    </p>
  );
}

function SectionShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t border-[var(--border-subtle)] py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function CaseStudyTemplate({ study }: { study: CaseStudy }) {
  return (
    <article className="bg-[var(--bg-base)] text-[var(--text-primary)]">
      <header className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--aj-gradient-dark)] py-20 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[1080px] px-5 sm:px-8">
          <Link
            href="/case-studies"
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-[var(--signal-yellow)]"
          >
            ← All case studies
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <MonoLabel>{study.industry}</MonoLabel>
            <span className="h-1 w-1 rounded-full bg-[var(--text-muted)]" aria-hidden />
            <MonoLabel>{study.engagement}</MonoLabel>
            <span className="h-1 w-1 rounded-full bg-[var(--text-muted)]" aria-hidden />
            <MonoLabel>{study.duration}</MonoLabel>
          </div>

          <h1 className="mt-8 max-w-[18ch] font-accent text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.035em] text-[#FFFFFF]">
            {study.headline}
          </h1>
        </div>
      </header>

      <SectionShell>
        <MonoLabel color="signal">The Problem</MonoLabel>
        <p className="mt-5 max-w-[64ch] text-lg leading-8 text-[var(--text-primary)]">
          {study.problem.body}
        </p>
        {study.problem.symptoms.length > 0 ? (
          <ul className="mt-8 grid gap-3 sm:max-w-[64ch]">
            {study.problem.symptoms.map((symptom) => (
              <li
                key={symptom}
                className="flex gap-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-3 text-sm leading-7 text-[var(--text-primary)]"
              >
                <span className="mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[var(--signal-yellow)]" aria-hidden />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </SectionShell>

      <SectionShell>
        <MonoLabel color="signal">The Signal Audit Found</MonoLabel>
        <p className="mt-5 max-w-[64ch] text-lg leading-8 text-[var(--text-primary)]">
          {study.diagnostic.body}
        </p>
        <div className="mt-8 grid gap-4">
          {study.diagnostic.findings.map((finding) => (
            <div key={finding} className="aj-callout">
              <p className="text-base leading-7 text-[var(--text-primary)]">{finding}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <MonoLabel color="signal">What We Built</MonoLabel>
        <p className="mt-5 max-w-[64ch] text-lg leading-8 text-[var(--text-primary)]">
          {study.solution.body}
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {study.solution.bullets.map((bullet, idx) => (
            <li
              key={bullet}
              className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-5"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-base leading-7 text-[var(--text-primary)]">{bullet}</p>
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell>
        <MonoLabel color="signal">Results</MonoLabel>
        <h2 className="mt-4 max-w-[24ch] font-accent text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#FFFFFF]">
          The signal map became the operating system.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {study.results.map((metric) => (
            <div
              key={`${metric.value}-${metric.label}`}
              className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6"
            >
              <div className="font-accent text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-none tracking-[-0.02em] text-[var(--signal-yellow)]">
                {metric.value}
              </div>
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.12em] text-[var(--text-primary)]">
                {metric.label}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {metric.context}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="pb-20 sm:pb-24">
        <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6 sm:p-8">
          <MonoLabel>Methodology Note</MonoLabel>
          <p className="mt-4 font-mono text-xs leading-6 text-[var(--text-muted)]">
            {study.methodologyNote}
          </p>
        </div>
      </SectionShell>

      <section className="relative overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--aj-gradient-dark)] py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-[900px] px-5 text-center sm:px-8">
          <MonoLabel color="signal">Next</MonoLabel>
          <h2 className="mt-4 font-accent text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#FFFFFF]">
            Your business could be next.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[var(--text-primary)]">
            The Signal Audit finds the leak before we write a line of automation.
            Start with the AI Readiness Diagnostic to see what the audit would surface.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/ai-readiness-diagnostic" variant="glow">
              Start the Diagnostic
            </ButtonLink>
            <ButtonLink href="/book-a-call" variant="secondary">
              Book a Call
            </ButtonLink>
          </div>
        </div>
      </section>
    </article>
  );
}
