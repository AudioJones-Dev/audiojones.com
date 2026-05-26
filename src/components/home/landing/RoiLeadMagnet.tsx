import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";

const ROI_BG =
  "/assets/Homepage/09-roi-calculator/backgrounds/roi-light-bg-v2.webp";

const inputs = [
  ["Leads / mo", "84"],
  ["Close rate", "18%"],
  ["AOV", "$2,400"],
] as const;

export default function RoiLeadMagnet() {
  return (
    <section className="relative overflow-hidden border-t border-[var(--line-2)] bg-bg-0 py-16 text-fg-0 sm:py-24">
      <div aria-hidden className="absolute inset-0">
        <Image
          src={ROI_BG}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          style={{ opacity: 0.18 }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,15,0.78),rgba(5,7,15,0.92))]" />
      </div>

      <div className="relative mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[5fr_7fr] lg:items-center">
        <div>
          <Eyebrow tone="blue">ROI Calculator</Eyebrow>
          <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-fg-0">
            How much revenue is leaking through slow follow-up?
          </h2>
          <p className="mt-5 text-lg leading-8 text-fg-2">
            Estimate the cost of missed demand before deciding whether
            ResponseOS is the right recovery layer.
          </p>
          <Link href="/roi-calculator" className="aj-btn-signal mt-8">
            Calculate Lost Revenue
          </Link>
        </div>

        <div
          className="rounded-[var(--r-panel)] border border-[rgba(148,163,184,0.16)] p-6 sm:p-8"
          style={{
            background: "rgba(10,14,28,0.72)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.14)] pb-4">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-fg-3">
              Signal Output
            </p>
            <span className="rounded-[4px] border border-[rgba(77,172,255,0.30)] bg-[rgba(77,172,255,0.10)] px-3 py-1 font-mono text-xs font-bold text-[var(--accent-blue)]">
              ROI PREVIEW
            </span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {inputs.map(([label, value]) => (
              <label key={label} className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-fg-3">
                  {label}
                </span>
                <span className="flex min-h-12 items-center rounded-[6px] border border-[rgba(148,163,184,0.14)] bg-[rgba(5,7,15,0.55)] px-4 font-mono text-lg font-bold text-fg-0">
                  {value}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-6 rounded-[8px] border border-[rgba(232,255,90,0.28)] bg-[rgba(232,255,90,0.08)] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--signal-yellow)]">
              Lost revenue estimate
            </p>
            <p className="mt-3 font-mono text-4xl font-black text-fg-0">
              $28,224
            </p>
            <p className="mt-2 text-sm leading-6 text-fg-2">
              Preview only. The calculator routes the result into ResponseOS or
              the AI Readiness Diagnostic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
