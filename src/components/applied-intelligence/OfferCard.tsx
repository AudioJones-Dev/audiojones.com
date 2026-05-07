import Link from "next/link";
import SectionShell from "./SectionShell";
import { ctaLinks } from "@/config/links";

const DELIVERABLES = [
  "Growth constraint analysis",
  "Signal vs noise audit",
  "M.A.P attribution review",
  "AI readiness assessment",
  "System architecture recommendation",
  "Sprint roadmap",
];

export default function OfferCard() {
  return (
    <SectionShell variant="alt" eyebrow="The offer">
      <div className="rounded-2xl border border-white/10 bg-[#0B1020] p-8 sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C8A96A]">
              Engagement
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Applied Intelligence Diagnostic
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              A focused engagement that identifies the constraint, maps the
              signal, and produces the architecture you need before you spend
              another dollar on AI tooling.
            </p>
            <Link
              href={ctaLinks.signalDiagnostic}
              className="mt-8 inline-flex items-center justify-center rounded-md bg-[#3B5BFF] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(59,91,255,0.7)] transition hover:bg-[#5B7AFF]"
            >
              Request Strategic Diagnostic
            </Link>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Deliverables
            </p>
            <ul className="space-y-3">
              {DELIVERABLES.map((d) => (
                <li
                  key={d}
                  className="flex gap-3 rounded-md border border-white/10 bg-[#101827] p-4 text-slate-200"
                >
                  <span aria-hidden className="text-[#3B5BFF]">▸</span>
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
