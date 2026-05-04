import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/applied-intelligence/Breadcrumbs";
import SignalHero from "@/components/applied-intelligence/SignalHero";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/applied-intelligence/tokens";

const DIAGNOSTIC_HREF = "/applied-intelligence/diagnostic";

export const metadata: Metadata = buildMetadata({
  title: "AI Workshops for Founder-Led Businesses | Audio Jones",
  description:
    "Audio Jones AI workshops help founder-led teams turn AI from scattered prompts into repeatable business workflows, agent-ready systems, and practical operating leverage.",
  path: "/ai-workshops",
});

const PROBLEM_BULLETS = [
  "Random prompts with no reusable context",
  "No workflow map before automation",
  "No team-wide usage standard",
  "No safety model for AI permissions",
  "No clear measurement of what AI is improving",
];

const PROMISE_CARDS: Array<{ title: string; body: string }> = [
  {
    title: "Business Bottleneck Map",
    body: "Identify where time, leads, communication, and content get stuck.",
  },
  {
    title: "Company AI Context Sheet",
    body: "Create reusable business context that improves every AI interaction.",
  },
  {
    title: "Workflow-to-Agent Blueprint",
    body: "Convert repeated work into structured prompts, SOPs, and agent-ready tasks.",
  },
  {
    title: "Progressive Trust Model",
    body: "Teach the team when AI should read, draft, suggest, or act.",
  },
  {
    title: "30-Day Execution Plan",
    body: "Leave with a practical implementation path instead of more theory.",
  },
];

const SYSTEM_STEPS: Array<{ step: string; title: string; body: string }> = [
  {
    step: "01",
    title: "Diagnose",
    body: "Map the business bottleneck before touching tools.",
  },
  {
    step: "02",
    title: "Contextualize",
    body: "Create the business, brand, workflow, and role context AI needs.",
  },
  {
    step: "03",
    title: "Build",
    body: "Turn one repeated workflow into a reusable AI-assisted operating process.",
  },
  {
    step: "04",
    title: "Govern",
    body: "Add safety rules, human review points, and progressive permissions.",
  },
  {
    step: "05",
    title: "Deploy",
    body: "Create a 30-day implementation plan your team can execute.",
  },
];

const BEST_FIT = [
  "Consultants",
  "Agencies",
  "Coaches",
  "Podcast and content brands",
  "Local service businesses",
  "Small teams with repeatable admin, sales, content, or operations work",
];

const DEMO_WORKFLOWS = [
  "Turn one podcast transcript into platform-native content assets",
  "Convert lead intake into qualification summaries and follow-up drafts",
  "Create a daily business briefing from tasks, calendar, and priorities",
  "Turn client notes into project briefs, email drafts, and action items",
  "Build a comment-to-DM content funnel using tools like ManyChat and Repurpose",
];

const OFFER_INCLUDES = [
  "30-minute pre-workshop intake",
  "Two 90-minute live workshop sessions",
  "AI-readiness scorecard",
  "Workflow bottleneck map",
  "Custom prompt and context pack",
  "One live workflow prototype",
  "30-day implementation roadmap",
];

function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Signal OS Workshop",
    serviceType: "AI Workshop for Founder-Led Businesses",
    provider: {
      "@type": "Organization",
      name: "Audio Jones",
      url: SITE_URL,
    },
    areaServed: "Global",
    description:
      "A two-session workshop that helps founder-led teams turn AI from scattered prompting into repeatable, human-supervised business workflows.",
    url: `${SITE_URL}/ai-workshops`,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: 3500,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${DIAGNOSTIC_HREF}`,
    },
  } as const;
}

export default function AiWorkshopsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Workshops", url: "/ai-workshops" },
        ])}
      />
      <JsonLd data={serviceJsonLd()} />

      <Breadcrumbs
        items={[{ name: "Home", href: "/" }, { name: "Workshops" }]}
      />

      <SignalHero
        eyebrow="AI Workshops for Founder-Led Teams"
        headline="Turn AI From a Random Tool Into a Business Operating System"
        subheadline="Most teams are not behind because they lack AI tools. They are behind because they lack context, workflows, and operating logic. The Signal OS Workshop helps your team move from scattered prompting to repeatable, human-supervised AI workflows."
        primaryCta={{ label: "Book Your Diagnostic", href: DIAGNOSTIC_HREF }}
        secondaryCta={{ label: "See the System", href: "#workshop-system" }}
      />

      <section className="border-t border-white/5 bg-[#0B1020] py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#C8A96A]">
            The Problem
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Most Businesses Are Using AI Like Google
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            They ask one-off questions, copy and paste outputs, and never turn
            the work into a repeatable process. That creates scattered
            productivity, not operational leverage.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {PROBLEM_BULLETS.map((b) => (
              <li
                key={b}
                className="rounded-lg border border-white/10 bg-[#05070F] px-4 py-3 text-slate-200"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#05070F] py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#C8A96A]">
            Workshop Promise
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
            What the Workshop Installs
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PROMISE_CARDS.map((c, i) => (
              <div
                key={c.title}
                className="rounded-xl border border-white/10 bg-[#0B1020] p-6 transition hover:border-white/30"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C8A96A]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {c.title}
                </h3>
                <p className="mt-3 text-slate-300">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="workshop-system"
        className="scroll-mt-24 border-t border-white/10 bg-[#0B1020] py-24"
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#C8A96A]">
            The Signal OS Method
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
            The Signal OS Workshop System
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            A five-step path from operational noise to a working AI operating
            layer your team can run, govern, and scale.
          </p>
          <ol className="mt-10 space-y-4">
            {SYSTEM_STEPS.map((s) => (
              <li
                key={s.step}
                className="flex gap-5 rounded-xl border border-white/10 bg-[#05070F] p-6"
              >
                <span className="shrink-0 text-2xl font-semibold text-[#3B5BFF]">
                  {s.step}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-slate-300">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#05070F] py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#C8A96A]">
            Best Fit
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Built for Founder-Led Businesses That Need Leverage
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BEST_FIT.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-white/10 bg-[#0B1020] px-4 py-3 text-slate-200"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0B1020] py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#C8A96A]">
            Targeted Demo
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
            From Manual Task to AI Workflow
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Bring one task your team repeats every week. We will show how it
            can become a structured AI workflow with human review, reusable
            prompts, and clear next actions.
          </p>
          <ul className="mt-8 space-y-3">
            {DEMO_WORKFLOWS.map((w) => (
              <li
                key={w}
                className="rounded-lg border border-white/10 bg-[#05070F] px-5 py-4 text-slate-200"
              >
                {w}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#05070F] py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#C8A96A]">
            Workshop Format
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Signal OS Workshop
          </h2>
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#0B1020] p-8">
            <ul className="space-y-3">
              {OFFER_INCLUDES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-slate-200"
                >
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#3B5BFF]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-slate-400">
              Starting at{" "}
              <span className="font-semibold text-white">$3,500</span>
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#05070F] py-24">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <h2 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Ready to Turn AI Into Operating Leverage?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Start with a diagnostic. We identify the bottleneck, map the
            workflow, and determine whether a workshop or implementation sprint
            is the right next move.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={DIAGNOSTIC_HREF}
              className="inline-flex items-center justify-center rounded-md bg-[#3B5BFF] px-8 py-4 text-sm font-semibold text-white shadow-[0_12px_50px_-10px_rgba(59,91,255,0.8)] transition hover:bg-[#5B7AFF]"
            >
              Book Your Diagnostic
            </Link>
            <Link
              href="/frameworks"
              className="inline-flex items-center justify-center rounded-md border border-white/15 px-8 py-4 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Explore Frameworks
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
