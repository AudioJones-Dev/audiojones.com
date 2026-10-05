import Link from "next/link";
import {
  ArrowRight,
  Inbox,
  RefreshCw,
  Route,
  ScanSearch,
} from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const stages = [
  {
    step: "01",
    label: "Capture",
    role: "Input",
    description: "Every inbound signal enters one visible queue.",
    Icon: Inbox,
  },
  {
    step: "02",
    label: "Qualify",
    role: "Decision",
    description: "Intent is checked against the business and offer fit.",
    Icon: ScanSearch,
  },
  {
    step: "03",
    label: "Route",
    role: "Handoff",
    description: "The next action and responsible owner become explicit.",
    Icon: Route,
  },
  {
    step: "04",
    label: "Recover",
    role: "Outcome",
    description: "Stalled demand re-enters a structured follow-up loop.",
    Icon: RefreshCw,
  },
] as const;

export default function ResponseOSWedge() {
  return (
    <section className="aj-bg-grid-dark border-t border-[var(--line-2)] py-24 sm:py-40">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Eyebrow>Flagship - Revenue Recovery Infrastructure</Eyebrow>
            <h2 className="mt-4 max-w-[13ch] text-balance font-[family-name:var(--font-headline)] text-[clamp(2.6rem,5.2vw,5.8rem)] font-bold leading-[0.92] tracking-[-0.05em] text-white">
              ResponseOS recovers the revenue your follow-up is losing.
            </h2>
          </div>
          <div className="max-w-[620px] lg:justify-self-end">
            <p className="text-[clamp(1.05rem,1.7vw,1.35rem)] leading-[1.65] text-fg-2">
              The leak is not just missed calls. It is scattered intent, slow
              response, weak qualification, and no recovery memory.
            </p>
            <p className="mt-5 border-l-2 border-[var(--signal-yellow)] pl-5 font-mono text-xs uppercase leading-6 tracking-[0.12em] text-white/56">
              One operating relationship: demand enters, intent is clarified,
              responsibility is assigned, and follow-up continues.
            </p>
          </div>
        </div>

        <div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          role="list"
          aria-label="ResponseOS recovery process"
        >
          {stages.map(({ step, label, role, description, Icon }, index) => (
            <article
              key={label}
              role="listitem"
              className="relative border border-white/[0.09] bg-[rgba(11,13,12,0.90)] p-5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.66rem] font-black tracking-[0.16em] text-white/36">
                  {step}
                </span>
                <span className="font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-[var(--signal-yellow)]">
                  {role}
                </span>
              </div>
              <div className="mt-8 flex h-11 w-11 items-center justify-center border border-[var(--signal-yellow)]/35 bg-[var(--signal-yellow)]/10 text-[var(--signal-yellow)]">
                <Icon aria-hidden className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-headline)] text-2xl font-bold tracking-[-0.03em] text-white">
                {label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/54">
                {description}
              </p>
              {index < stages.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-[18px] top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#080808] text-[var(--signal-yellow)] lg:flex"
                >
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link href="/agents/responseos" className="aj-btn-signal">
            Explore ResponseOS
          </Link>
          <Link href="/roi-calculator" className="aj-btn-intel">
            Calculate Lost Revenue
          </Link>
        </div>
      </div>
    </section>
  );
}
