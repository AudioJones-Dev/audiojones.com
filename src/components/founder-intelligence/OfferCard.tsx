import SectionShell from "./SectionShell";
import { ButtonLink } from "@/components/ui/Button";
import { ctaLinks } from "@/config/links";

const DELIVERABLES = [
  "Growth constraint analysis",
  "Signal vs noise audit",
  "M.A.P. attribution review",
  "AI readiness assessment",
  "System architecture recommendation",
  "Sprint roadmap",
];

export default function OfferCard() {
  return (
    <SectionShell variant="alt" eyebrow="The offer">
      <div className="rounded-2xl border border-border-subtle bg-surface-1 p-8 sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-yellow">
              Engagement
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Founder Intelligence Diagnostic
            </h2>
            <p className="mt-4 text-lg text-text-primary">
              A focused engagement that identifies the constraint, maps the
              signal, and produces the architecture you need before you spend
              another dollar on AI tooling.
            </p>
            <ButtonLink
              href={ctaLinks.signalDiagnostic}
              variant="primary"
              className="mt-8"
            >
              Request Strategic Diagnostic
            </ButtonLink>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Deliverables
            </p>
            <ul className="space-y-3">
              {DELIVERABLES.map((d) => (
                <li
                  key={d}
                  className="flex gap-3 rounded-md border border-border-subtle bg-surface-2 p-4 text-text-primary"
                >
                  <span aria-hidden className="text-accent-blue">▸</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
