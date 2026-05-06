import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/applied-intelligence/Breadcrumbs";
import FAQ from "@/components/applied-intelligence/FAQ";
import FinalCTA from "@/components/applied-intelligence/FinalCTA";
import MissingMiddleDiagram from "@/components/applied-intelligence/MissingMiddleDiagram";
import Step2Framework from "@/components/applied-intelligence/Step2Framework";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo/schema";

const PATH = "/step-2";

const FAQS = [
  {
    question: "What is Step 2 in AI business strategy?",
    answer:
      "Step 2 is the missing operating layer between AI tools and measurable business outcomes. It turns AI capability into useful workflows, attribution systems, and evidence-based implementation.",
  },
  {
    question: "Why do AI projects fail in businesses?",
    answer:
      "AI projects often fail because businesses automate unclear workflows, skip operational diagnosis, lack attribution, and do not define measurable outcomes before implementation.",
  },
  {
    question: "What is the difference between AI hype and applied intelligence?",
    answer:
      "AI hype focuses on tools and promises. Applied intelligence focuses on using tools inside real workflows to produce measurable business outcomes.",
  },
  {
    question: "How does Audio Jones help businesses with AI?",
    answer:
      "Audio Jones helps businesses identify bottlenecks, redesign workflows, build applied intelligence systems, create attribution loops, and measure whether AI improves revenue, margin, speed, or decision quality.",
  },
  {
    question: "What should a business do before adopting AI?",
    answer:
      "Before adopting AI, a business should clarify its offer, map workflows, identify bottlenecks, document SOPs, define attribution, and decide which processes are worth automating.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Step 2: The Missing Layer Between AI Hype and Profit | Audio Jones",
    description:
      "Step 2 is the missing operating layer between AI capability and measurable business outcomes. Audio Jones helps businesses turn AI hype into applied intelligence, attribution, workflow redesign, and profit.",
    path: PATH,
    type: "article",
  }),
  // Noindex: /step-2 is a funnel/internal route, not a primary SEO target.
  // It is removed from sitemap.ts. Keep the page live but exclude from crawl index.
  robots: { index: false, follow: true },
};

export default function Step2Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Step 2", url: PATH },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: "Step 2: The Missing Layer Between AI Hype and Profit",
          description:
            "Step 2 is the missing operating layer between AI capability and measurable business outcomes.",
          url: PATH,
        })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <Breadcrumbs
        items={[{ name: "Home", href: "/" }, { name: "Step 2" }]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#05070F] pt-20 pb-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(59,91,255,0.18),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(200,169,106,0.10),transparent_60%)]"
        />
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#C8A96A]">
            Applied Intelligence for the missing middle
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Step 2: The Missing Layer Between AI Hype and Profit
          </h1>
          <p className="mt-6 text-lg text-slate-300 sm:text-xl">
            AI has Step 1 — powerful tools. AI promises Step 3 — profit,
            leverage, and transformation. But most businesses are missing
            Step 2: the operating layer that turns AI capability into
            measurable business outcomes.
          </p>
          <p className="mt-4 text-lg text-slate-300">
            Audio Jones builds Step 2 through{" "}
            <Link
              href="/applied-intelligence"
              className="text-[#3B5BFF] hover:text-[#5B7AFF]"
            >
              applied intelligence
            </Link>
            ,{" "}
            <Link
              href="/frameworks/map-attribution"
              className="text-[#3B5BFF] hover:text-[#5B7AFF]"
            >
              attribution
            </Link>
            , workflow redesign, and{" "}
            <Link
              href="/applied-intelligence/diagnostic"
              className="text-[#3B5BFF] hover:text-[#5B7AFF]"
            >
              AI readiness
            </Link>
            .
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/applied-intelligence/diagnostic"
              className="inline-flex items-center justify-center rounded-md bg-[#3B5BFF] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(59,91,255,0.7)] transition hover:bg-[#5B7AFF]"
            >
              Build Your Step 2 System
            </Link>
            <Link
              href="/applied-intelligence"
              className="inline-flex items-center justify-center rounded-md border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Explore Applied Intelligence
            </Link>
          </div>
        </div>
      </section>

      {/* Direct answer block (AEO) */}
      <section className="bg-[#0B1020] py-14">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#C8A96A]">
            Direct answer
          </p>
          <p className="text-lg leading-relaxed text-slate-100">
            Step 2 is the missing operating layer between AI capability and
            measurable business outcomes. It includes workflow redesign,
            business diagnosis, AI readiness, attribution, implementation
            systems, and evidence-based optimization. Without Step 2,
            businesses often buy AI tools without proving whether those tools
            improve profit, speed, margin, or decision quality.
          </p>
        </div>
      </section>

      {/* Diagram */}
      <section className="border-t border-white/5 bg-[#05070F] py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
              The missing layer between AI hype and profit.
            </h2>
            <p className="mt-3 text-lg text-slate-300">
              AI tools do not create transformation by themselves. They need
              to be connected to real business bottlenecks, redesigned
              workflows, and evidence-based measurement systems.
            </p>
          </div>
          <MissingMiddleDiagram />
        </div>
      </section>

      {/* What is Step 2? */}
      <section className="border-t border-white/5 bg-[#0B1020] py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            What is Step 2?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Step 2 is the missing operating layer between AI capability and
            measurable profit. It includes:
          </p>
          <ul className="mt-6 grid gap-2 text-slate-200 sm:grid-cols-2">
            {[
              "business diagnosis",
              "bottleneck identification",
              "workflow redesign",
              "attribution modeling",
              "AI readiness",
              "automation strategy",
              "SOP development",
              "feedback loops",
              "evidence-based implementation",
              "compounding optimization",
            ].map((item) => (
              <li
                key={item}
                className="rounded-md border border-white/10 bg-[#101827] px-4 py-3"
              >
                — {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-lg text-slate-300">
            Without Step 2, AI remains hype. With Step 2, AI becomes
            applied intelligence.
          </p>
        </div>
      </section>

      {/* S.T.E.P. 2 framework */}
      <section className="border-t border-white/5 bg-[#05070F] py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#C8A96A]">
            Framework
          </p>
          <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
            The S.T.E.P. 2 Framework
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Audio Jones uses the S.T.E.P. 2 Framework to convert AI from hype
            into business leverage. Signal identifies the real bottleneck.
            Translation converts AI capability into usable workflows.
            Evidence proves whether the system improved the business. Profit
            compounds what works.
          </p>
          <div className="mt-10">
            <Step2Framework />
          </div>
        </div>
      </section>

      {/* AI is not the strategy */}
      <section className="border-t border-white/5 bg-[#0B1020] py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            AI is not the strategy.
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            AI is the amplifier. If your workflow is broken, AI scales the
            break. If your attribution is weak, AI scales the confusion. If
            your offer is unclear, AI scales the noise.
          </p>
          <p className="mt-4 text-lg text-slate-300">Step 2 is where the money is:</p>
          <ul className="mt-4 grid gap-2 text-slate-200 sm:grid-cols-2">
            {[
              "diagnosis",
              "redesign",
              "implementation",
              "attribution",
              "evidence",
              "compounding",
            ].map((item) => (
              <li
                key={item}
                className="rounded-md border border-white/10 bg-[#101827] px-4 py-3"
              >
                — {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why most AI implementations fail */}
      <section className="border-t border-white/5 bg-[#05070F] py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Why most AI implementations fail
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Most AI projects fail because businesses skip the operational
            layer. They:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-300">
            <li>buy tools before diagnosing bottlenecks,</li>
            <li>automate workflows before redesigning them,</li>
            <li>chase productivity before defining attribution,</li>
            <li>measure activity instead of outcomes,</li>
            <li>confuse demos with deployment,</li>
            <li>confuse automation with profit.</li>
          </ul>
          <p className="mt-4 text-lg text-slate-300">Step 2 fixes that.</p>
        </div>
      </section>

      {/* What Audio Jones builds */}
      <section className="border-t border-white/5 bg-[#0B1020] py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            What Audio Jones builds
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Audio Jones helps businesses install the missing operational
            layer between AI capability and measurable outcomes. That
            includes:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-300">
            <li>identifying where profit is leaking,</li>
            <li>mapping the current workflow,</li>
            <li>removing unnecessary complexity,</li>
            <li>defining the highest-value automation points,</li>
            <li>building AI-assisted workflows,</li>
            <li>documenting SOPs,</li>
            <li>measuring before-and-after performance,</li>
            <li>creating attribution loops,</li>
            <li>compounding what works.</li>
          </ul>
        </div>
      </section>

      {/* Offer bridge */}
      <section className="border-t border-white/5 bg-[#05070F] py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            From Step 2 to implementation
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Step 2 is not theory. It becomes an implementation system. Audio
            Jones can help diagnose, design, and build the operating layer
            your business needs before AI can produce meaningful leverage.
          </p>
          <p className="mt-4 text-lg text-slate-300">
            If you are trying to use AI but cannot clearly connect it to
            revenue, margin, speed, or decision quality, you do not have an
            AI problem. You have a Step 2 problem.
          </p>
          <Link
            href="/applied-intelligence/diagnostic"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-[#3B5BFF] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(59,91,255,0.7)] transition hover:bg-[#5B7AFF]"
          >
            Build Your Step 2 System
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 bg-[#0B1020] py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="mb-8 text-3xl font-semibold text-white sm:text-4xl">
            Frequently asked questions
          </h2>
          <FAQ items={FAQS} />
        </div>
      </section>

      <FinalCTA
        headline="Stop buying tools. Start building Step 2."
        body="Audio Jones helps founder-led businesses install the missing operating layer between AI capability and measurable outcomes."
        ctaLabel="Build Your Step 2 System"
        ctaHref="/applied-intelligence/diagnostic"
      />
    </>
  );
}
