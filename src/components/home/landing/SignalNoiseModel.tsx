import Image from "next/image";
import { ArrowRight } from "lucide-react";

const SIGNAL_FLOW =
  "/assets/Homepage/03-signal-problem/signal-gap-flow.png";

export default function SignalNoiseModel() {
  return (
    <>
      <section
        id="signal-problem"
        aria-labelledby="signal-problem-heading"
        className="relative scroll-mt-20 overflow-hidden bg-[#080808] py-24 sm:py-32 lg:py-40"
      >
        <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="max-w-[640px]">
            <p className="t-eyebrow text-[var(--signal-yellow)]">
              The signal problem
            </p>
            <h2
              id="signal-problem-heading"
              className="mt-5 max-w-[18ch] font-[family-name:var(--font-headline)] text-[clamp(2.35rem,2.9vw,3rem)] font-bold leading-[0.94] tracking-[-0.045em] text-white"
            >
              Revenue leaks in the gaps between tools, teams, and follow-up.
            </h2>
            <p className="mt-7 max-w-[58ch] font-[family-name:var(--font-accent)] text-[clamp(1rem,1.35vw,1.16rem)] font-medium leading-[1.65] text-white/60">
              A lead arrives, but the response is slow. A decision is made,
              but the reason is never captured. A report shows activity, but
              not what caused the result. Each gap creates noise—and makes the
              next decision harder.
            </p>
          </div>

          <figure className="overflow-hidden border border-white/[0.08] bg-[#0D0E0C]">
            <figcaption className="grid grid-cols-3 border-b border-white/[0.08]">
              {[
                ["01", "Demand captured"],
                ["02", "Follow-up gap"],
                ["03", "Signal recovered"],
              ].map(([step, label], index) => (
                <div
                  key={step}
                  className="border-r border-white/[0.08] px-3 py-4 last:border-r-0 sm:px-5"
                >
                  <p
                    className={`font-mono text-[0.62rem] font-bold tracking-[0.16em] ${
                      index === 1
                        ? "text-white/38"
                        : index === 2
                          ? "text-[var(--signal-yellow)]"
                          : "text-white/58"
                    }`}
                  >
                    {step}
                  </p>
                  <p className="mt-1 text-[0.68rem] font-semibold uppercase leading-4 tracking-[0.08em] text-white/72 sm:text-xs">
                    {label}
                  </p>
                </div>
              ))}
            </figcaption>
            <div className="relative min-h-[230px] sm:min-h-[300px] lg:min-h-[330px]">
              <Image
                src={SIGNAL_FLOW}
                alt="Demand enters, weakens across the follow-up gap, and reconnects as a recovered signal"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 56vw"
              />
            </div>
          </figure>
        </div>

        <div className="mx-auto mt-16 max-w-[1280px] px-5 sm:mt-20 sm:px-8">
          <div className="grid gap-5 bg-[var(--signal-yellow)] p-6 text-[#0A0A0A] sm:grid-cols-[0.28fr_1fr_auto] sm:items-center sm:p-8">
            <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.18em] text-black/56">
              Decision rule
            </p>
            <p className="max-w-[34ch] font-[family-name:var(--font-headline)] text-[clamp(1.55rem,2.8vw,2.7rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              Not more data. A clearer view of what deserves action.
            </p>
            <ArrowRight aria-hidden className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
        </div>
      </section>

      <section
        id="founder-intelligence-preview"
        aria-labelledby="founder-intelligence-preview-heading"
        className="scroll-mt-20 bg-[#F7F6F1] py-24 text-[#0A0A0A] sm:py-32 lg:py-40"
      >
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
          <p className="h-fit w-fit bg-[#080808] px-4 py-3 font-mono text-[0.68rem] font-black uppercase tracking-[0.18em] text-[var(--signal-yellow)]">
            Founder Intelligence
          </p>
          <div className="max-w-[900px]">
            <h2
              id="founder-intelligence-preview-heading"
              className="max-w-[18ch] text-balance font-[family-name:var(--font-headline)] text-[clamp(2.75rem,5.7vw,6.1rem)] font-bold leading-[0.93] tracking-[-0.05em]"
            >
              See what matters. Decide what to do. Build what compounds.
            </h2>
            <p className="mt-8 max-w-[61ch] font-[family-name:var(--font-accent)] text-[clamp(1.05rem,1.7vw,1.35rem)] font-medium leading-[1.65] text-black/62">
              Founder Intelligence connects the signals, operating knowledge,
              and decisions a business needs to act consistently—without every
              answer living in the founder&apos;s head.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
