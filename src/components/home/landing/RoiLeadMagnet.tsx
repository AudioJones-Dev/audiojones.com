import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

const inputs = [
  ["Leads / mo", "84"],
  ["Close rate", "18%"],
  ["AOV", "$2,400"],
] as const;

export default function RoiLeadMagnet() {
  return (
    <section
      className="relative overflow-hidden border-t border-black/10 py-20 text-[#0A0A0A] sm:py-32"
      style={{
        background:
          "radial-gradient(circle at 82% 22%, rgba(77,172,255,0.20), transparent 28%), radial-gradient(circle at 72% 76%, rgba(232,255,90,0.26), transparent 32%), #F4F2EA",
      }}
    >
      <div className="relative mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-3 bg-[#080808] px-4 py-3 text-[var(--signal-yellow)]">
            <Calculator aria-hidden className="h-4 w-4" strokeWidth={1.8} />
            <span className="font-mono text-[0.68rem] font-black uppercase tracking-[0.18em]">
              ROI Calculator
            </span>
          </div>
          <p className="mt-7 font-mono text-[0.68rem] font-black uppercase tracking-[0.18em] text-black/46">
            The cost of waiting
          </p>
          <h2 className="mt-4 max-w-[12ch] font-[family-name:var(--font-headline)] text-[clamp(3rem,6vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.055em]">
            How much revenue is leaking through slow follow-up?
          </h2>
          <p className="mt-7 max-w-[48ch] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.65] text-black/62">
            Estimate the cost of missed demand before deciding whether
            ResponseOS is the right recovery layer.
          </p>
          <Link
            href="/roi-calculator"
            className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#080808] px-6 py-3 font-[family-name:var(--font-headline)] font-bold text-[var(--signal-yellow)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] focus-visible:ring-offset-4"
          >
            Calculate Lost Revenue
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>

        <div
          className="rounded-[28px] border border-transparent p-6 sm:p-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.62), rgba(255,255,255,0.30)) padding-box, linear-gradient(135deg, rgba(77,172,255,0.82), rgba(255,255,255,0.70) 48%, rgba(232,255,90,0.92)) border-box",
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 28px 90px rgba(8,10,16,0.18), inset 0 1px 0 rgba(255,255,255,0.72)",
          }}
        >
          <div className="flex items-center justify-between border-b border-black/10 pb-5">
            <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-black/48">
              Signal output
            </p>
            <span className="rounded-full border border-[rgba(77,172,255,0.38)] bg-[rgba(77,172,255,0.12)] px-3 py-1 font-mono text-xs font-black text-[#176AAE]">
              ROI PREVIEW
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {inputs.map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/80 bg-white/46 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]"
              >
                <p className="font-mono text-[0.64rem] font-black uppercase tracking-[0.14em] text-black/42">
                  {label}
                </p>
                <p className="mt-4 font-mono text-2xl font-black text-[#0A0A0A]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[22px] bg-[#080808] p-6 text-white sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-[var(--signal-yellow)]">
                  Revenue at risk
                </p>
                <p className="mt-3 font-mono text-[clamp(2.65rem,6vw,5rem)] font-black leading-none tracking-[-0.06em]">
                  $28,224
                </p>
              </div>
              <span className="border border-white/12 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/48">
                Sample scenario
              </span>
            </div>
            <p className="mt-6 max-w-[48ch] border-t border-white/10 pt-5 text-sm leading-6 text-white/58">
              The preview turns three familiar inputs into one consequence you
              can evaluate before choosing the next system layer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
