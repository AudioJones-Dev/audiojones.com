import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import RoiCalculatorClient from "@/components/roi-calculator/RoiCalculatorClient";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "AI ROI Calculator",
  description: "Estimate potential ROI, readiness, and payback period before you invest in automation.",
  alternates: { canonical: "https://audiojones.com/roi-calculator" },
  openGraph: {
    title: "AI ROI Calculator | Audio Jones",
    description: "Find out if AI is actually worth it for your business.",
    url: "https://audiojones.com/roi-calculator",
    siteName: "Audio Jones",
    type: "website",
  },
};

const values = [
  ["Signal vs. Noise", "AI accelerates whatever system already exists. We diagnose the system before recommending automation."],
  ["ROI Before Hype", "We calculate labor savings, error reduction, payback period, and risk-adjusted impact — not vibes."],
  ["Applied Intelligence", "Score your workflow on ROI, readiness, and priority. Get one of six clear recommended next steps."],
];

export default function RoiCalculatorPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Audio Jones AI ROI Calculator", url: "https://audiojones.com/roi-calculator", applicationCategory: "BusinessApplication" }} />
      <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,69,0,.16),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(59,91,255,.14),transparent_28%)]" />
        <div className="mx-auto max-w-[1280px]">
          <div className="max-w-[780px]">
            <Eyebrow tone="gold">AI ROI Calculator</Eyebrow>
            <h1 className="mt-5 t-display-lg">Find out if AI is actually worth it for your business.</h1>
            <p className="mt-6 t-lead text-fg-2">Estimate potential ROI, readiness, and payback period before you invest in automation.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#diagnostic" className="btn-glow inline-flex min-h-11 items-center justify-center px-6 py-3">Calculate Your AI ROI</a>
              <a href="https://diagnostic.audiojones.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--line-2)] px-6 py-3 t-small font-semibold text-fg-1 hover:text-fg-0">Take Signal Diagnostic</a>
            </div>
            <p className="mt-6 max-w-[680px] t-small text-fg-3">Most AI projects fail because the workflow, data, SOPs, or measurement system were not ready. This diagnostic separates real AI opportunity from expensive automation theater.</p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {values.map(([title, text]) => <article className="rounded-3xl border border-[var(--line-2)] bg-bg-2/70 p-5" key={title}><h2 className="t-h4">{title}</h2><p className="mt-3 t-small text-fg-2">{text}</p></article>)}
          </div>
        </div>
      </section>
      <section id="diagnostic" className="scroll-mt-24 px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-[980px]">
          <div className="mb-6">
            <Eyebrow tone="gold">Diagnostic</Eyebrow>
            <h2 className="mt-3 t-h2">Five inputs. One operating signal.</h2>
          </div>
          <RoiCalculatorClient />
        </div>
      </section>
    </>
  );
}
