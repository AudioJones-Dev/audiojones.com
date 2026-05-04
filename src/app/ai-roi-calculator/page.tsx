import type { Metadata } from "next";
import Link from "next/link";
import AiRoiDiagnostic from "@/components/ai-roi-diagnostic/AiRoiDiagnostic";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  type FaqItem,
} from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "AI ROI Diagnostic | Audio Jones",
  description:
    "Find out whether AI is worth investing in for your business. Calculate ROI potential, AI readiness, automation priority, and the best next step before you automate.",
  path: "/ai-roi-calculator",
});

const FAQS: FaqItem[] = [
  {
    question: "How do I calculate AI ROI for my business?",
    answer:
      "AI ROI is calculated by comparing the annual financial benefit of AI against the total cost of implementation, software, training, maintenance, and human review. The most useful AI ROI models include labor savings, error reduction, revenue lift, cycle-time improvement, and cost avoidance.",
  },
  {
    question: "Why do AI projects fail?",
    answer:
      "AI projects usually fail because the workflow, data, SOPs, adoption plan, or business objective is unclear. The issue is rarely the model alone. AI works best when attached to a measurable business bottleneck and a repeatable workflow.",
  },
  {
    question: "Should every business automate with AI?",
    answer:
      "No. Some businesses should automate immediately, while others need to fix workflows, data quality, documentation, or measurement before AI will create ROI. Automating a broken process often increases operational noise.",
  },
  {
    question: "What is an AI readiness score?",
    answer:
      "An AI readiness score measures whether a business has the operational conditions required for AI to work. It considers SOP maturity, data quality, process clarity, leadership buy-in, tool fragmentation, team adoption risk, and measurement discipline.",
  },
  {
    question: "What is the best first workflow to automate?",
    answer:
      "The best first workflow to automate is usually repetitive, high-volume, measurable, and tied to either revenue, labor cost, customer response time, or error reduction. Common examples include lead follow-up, customer intake, scheduling, content production, reporting, and support.",
  },
];

export default function AiRoiCalculatorPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "AI ROI Diagnostic", url: "/ai-roi-calculator" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <main className="min-h-screen bg-[#0f0f10] text-white">
        <div className="h-16" />

        <section className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f10] via-[#141416] to-[#0f0f10]" />
          <div className="absolute inset-0 opacity-25">
            <div className="absolute -left-1/4 top-0 h-full w-full rounded-full bg-gradient-radial from-[#FF4500] to-transparent blur-3xl" />
            <div className="absolute -right-1/4 bottom-0 h-full w-full rounded-full bg-gradient-radial from-[#FFD700] to-transparent blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 lg:px-8">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-white/50">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-white">AI ROI Diagnostic</li>
              </ol>
            </nav>

            <p className="text-xs font-semibold uppercase tracking-widest text-[#FF4500]">
              AI ROI Diagnostic
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Find Out If AI Is Actually Worth It For Your Business
            </h1>
            <p className="max-w-2xl text-lg text-white/75">
              Estimate your AI ROI potential, diagnose your operational
              readiness, and identify whether you should automate now, pilot
              first, or fix the system before investing.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#diagnostic"
                className="inline-flex items-center justify-center rounded-full bg-[#FF4500] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#ff5a1f]"
              >
                Start the Diagnostic
              </a>
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
              >
                Book an AI Readiness Review
              </Link>
            </div>
            <p className="max-w-2xl text-sm text-white/55">
              Most AI projects fail because the workflow, data, SOPs, or
              measurement system were not ready. This diagnostic helps separate
              real AI opportunity from expensive automation theater.
            </p>
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0B0B0D] py-12">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FF4500]">
                  Signal vs. Noise
                </p>
                <p className="mt-2 text-sm text-white/80">
                  AI accelerates whatever system already exists. We diagnose
                  the system before recommending automation.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FF4500]">
                  ROI Before Hype
                </p>
                <p className="mt-2 text-sm text-white/80">
                  We calculate labor savings, error reduction, payback period,
                  and risk-adjusted impact — not vibes.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FF4500]">
                  Applied Intelligent Systems
                </p>
                <p className="mt-2 text-sm text-white/80">
                  Built for founder-led businesses ready to operationalize AI
                  inside real workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="diagnostic"
          className="border-t border-white/5 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <AiRoiDiagnostic />
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0B0B0D] py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-3xl font-black sm:text-4xl">
              How the scoring works
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
              The diagnostic produces three scores. Each is calibrated against
              real bottlenecks we see in founder-led service businesses,
              agencies, content businesses, and SMBs.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/40 p-6">
                <h3 className="text-lg font-bold text-white">AI ROI Score</h3>
                <p className="mt-2 text-sm text-white/75">
                  Weighs labor savings, payback period, frequency, error
                  savings, revenue proximity, and cost efficiency to estimate
                  whether the workflow has meaningful financial upside.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-6">
                <h3 className="text-lg font-bold text-white">
                  AI Readiness Score
                </h3>
                <p className="mt-2 text-sm text-white/75">
                  Weighs SOP maturity, data quality, process clarity, KPI
                  tracking, leadership buy-in, adoption risk, automation
                  maturity, security posture, and tool fragmentation.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-6">
                <h3 className="text-lg font-bold text-white">
                  Automation Priority Score
                </h3>
                <p className="mt-2 text-sm text-white/75">
                  Combines ROI, readiness, bottleneck severity, and time-to-
                  value to rank whether this is the right workflow to automate
                  first.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-3xl font-black sm:text-4xl">
              When this diagnostic helps
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
              The diagnostic is built for the messy middle — businesses that
              know AI matters but aren&apos;t sure where to start.
            </p>

            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              <li className="rounded-xl border border-white/10 bg-black/40 p-5">
                <h3 className="font-semibold text-white">
                  Founder-led service businesses
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Decide whether to automate lead follow-up, intake, or
                  scheduling before hiring the next person.
                </p>
              </li>
              <li className="rounded-xl border border-white/10 bg-black/40 p-5">
                <h3 className="font-semibold text-white">
                  Agencies and creative studios
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Compare proposal creation, content production, and reporting
                  workflows for automation potential.
                </p>
              </li>
              <li className="rounded-xl border border-white/10 bg-black/40 p-5">
                <h3 className="font-semibold text-white">
                  Operators considering an AI consultant
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Pressure-test scope before investing in custom builds or
                  expensive software.
                </p>
              </li>
              <li className="rounded-xl border border-white/10 bg-black/40 p-5">
                <h3 className="font-semibold text-white">
                  Teams stuck on automation theater
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Diagnose whether the real blocker is workflow design, not the
                  model itself.
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section className="border-t border-white/5 bg-[#0B0B0D] py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-3xl font-black sm:text-4xl">FAQ</h2>
            <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/40">
              {FAQS.map((item) => (
                <details key={item.question} className="group p-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-base font-semibold text-white">
                    <span>{item.question}</span>
                    <span
                      aria-hidden
                      className="mt-1 text-[#FF4500] transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
            <h2 className="text-3xl font-black sm:text-4xl">
              Ready for a deeper review?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Run the diagnostic, then book a 30-minute AI Readiness Review to
              walk through your scores, your bottleneck, and the next step that
              actually moves the system.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#diagnostic"
                className="inline-flex items-center justify-center rounded-full bg-[#FF4500] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#ff5a1f]"
              >
                Run the Diagnostic
              </a>
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
              >
                Book an AI Readiness Review
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
