import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import PilotApplicationForm from "@/components/pilot/PilotApplicationForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  organizationJsonLd,
} from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site";

const PATH = "/founder-intelligence-systems-pilot";
const TITLE = "Founder Intelligence Systems Pilot Program";
const DESCRIPTION =
  "A limited pilot for founder-led service businesses ready to replace fragmented communication, manual coordination, and undocumented operations with a structured business operating system.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

// ── Section data ──────────────────────────────────────────────────────────

const PROBLEM_ITEMS = [
  "Emails",
  "Texts",
  "Calls",
  "Job details",
  "Contractor updates",
  "Customer history",
  "Invoices",
  "Follow-ups",
  "Documentation",
];

const FRAMEWORK_ITEMS = [
  { title: "CRM structure", body: "Centralized customer + job records, replacing notebooks and group chats." },
  { title: "Communication intake", body: "One front door for calls, texts, web forms, and emails — not eight." },
  { title: "Job / work order pipeline", body: "Every job has a state, an owner, and a clear next step." },
  { title: "Contractor documentation flow", body: "Field paperwork that captures itself instead of waiting on the office." },
  { title: "Business memory system", body: "Searchable, versioned knowledge that survives staff turnover." },
  { title: "Automation workflows", body: "Three to five high-leverage automations that compress operational drag." },
  { title: "AI-assisted reporting", body: "Operational dashboards plus AI helpers grounded in your real data." },
  { title: "Operational dashboard", body: "One screen that tells the founder what's open, what's stuck, and what's late." },
];

const INCLUDED = [
  "Operational Intelligence Audit",
  "CRM / data architecture",
  "SaaS stack recommendation",
  "Communication workflow design",
  "Job / work order pipeline",
  "Contractor documentation checklist",
  "Google Drive or knowledge-base structure",
  "Obsidian / business memory framework",
  "3–5 workflow automations",
  "Basic operational dashboard",
  "SOP starter kit",
  "Case study documentation",
];

const GOOD_FIT = [
  "Founder-led service business",
  "Owner is still heavily involved in operations",
  "Communications are spread across phone, text, and email",
  "No reliable CRM — or incomplete CRM usage",
  "Manual dispatch or job coordination",
  "Repeated documentation or billing gaps",
  "Wants AI, but knows structure has to come first",
];

const NOT_FIT = [
  "Looking for a quick chatbot only",
  "No willingness to document processes",
  "No budget for the software tools the system needs",
  "No owner involvement during implementation",
  "Wants automation before operational clarity",
];

const OUTCOMES = [
  "Clearer operational visibility",
  "Reduced founder dependency",
  "Centralized customer / job records",
  "Better follow-up",
  "Better documentation",
  "Faster billing",
  "Repeatable SOPs",
  "AI-ready business memory",
  "Foundation for future AI agents",
];

const CASE_STUDIES = [
  { name: "Florida Ramp & Lift", status: "Pilot partner — in development" },
  { name: "Pilot Partner 2", status: "Slot open" },
  { name: "Pilot Partner 3", status: "Slot open" },
];

const FAQS = [
  {
    q: "Is this only for AI?",
    a: "No. The pilot rebuilds the operating layer underneath the business — CRM, communications, job pipeline, documentation, and memory — and then layers AI on top once the foundation is sound. Most service businesses do not have an AI problem; they have an operations problem.",
  },
  {
    q: "Do I need a CRM already?",
    a: "No. If you have one, we'll work with it where it fits. If you don't, we'll recommend and structure one as part of the engagement.",
  },
  {
    q: "What software do you use?",
    a: "We're pragmatic. The recommended stack depends on your industry, team size, field-vs-office split, and existing tools. Common picks include HubSpot or GoHighLevel for CRM, Google Workspace plus Obsidian for memory, n8n for automation, and ImageKit for media. The audit sets the stack.",
  },
  {
    q: "Are software costs included?",
    a: "No. Software subscriptions are billed separately and are not part of the implementation fee. We'll size them with you up front so there are no surprises.",
  },
  {
    q: "How long does implementation take?",
    a: "Pilot implementations run roughly 4–8 weeks from kickoff to first operational dashboard, depending on existing data and team availability. The ongoing optimization retainer continues from there.",
  },
  {
    q: "What happens after the pilot?",
    a: "Pilot partners can continue on the $2,500/month optimization retainer (suggested 6-month minimum) or transition to a standard engagement. Either way, you keep everything that was built.",
  },
  {
    q: "Do you build custom software?",
    a: "Mostly no. The pilot favors composing best-in-class tools with automations and AI on top, not bespoke software that locks you in. Custom code is reserved for cases where no off-the-shelf option closes the gap.",
  },
  {
    q: "What do you need from the business owner?",
    a: "Three things: roughly 2–4 hours per week during implementation, willingness to document how the business actually runs, and willingness to provide before/after performance insights for the case study.",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function PilotProgramPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Founder Intelligence System", url: "/founder-intelligence-system" },
          { name: "Pilot Program", url: PATH },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: TITLE,
          serviceType: "Operational intelligence consulting",
          provider: {
            "@type": "Organization",
            name: "AJ Digital LLC",
            url: siteConfig.url,
          },
          areaServed: "United States",
          description: DESCRIPTION,
          url: `${siteConfig.url}${PATH}`,
          offers: {
            "@type": "Offer",
            price: "10000",
            priceCurrency: "USD",
            description:
              "Pilot-partner implementation fee. Ongoing optimization retainer billed at $2,500/month with a suggested 6-month minimum. Software subscriptions billed separately.",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      {/* ── 1. Hero ── */}
      <section className="bg-bg-0 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
          <Eyebrow withLine>Pilot Program · Limited to 3 partners</Eyebrow>
          <h1 className="mt-5 t-h1 text-balance">
            Founder Intelligence Systems Pilot Program
          </h1>
          <p className="mt-6 max-w-[720px] t-lead text-fg-2">{DESCRIPTION}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="#apply" variant="primary" size="lg">
              Apply for Pilot Program
            </ButtonLink>
            <ButtonLink href="/book-a-call" variant="secondary" size="lg">
              Book Pilot Fit Call
            </ButtonLink>
          </div>

          <p className="mt-6 t-small text-fg-3">
            Only 3 pilot partners accepted during this validation phase.
          </p>
        </div>
      </section>

      {/* ── 2. Problem ── */}
      <section className="border-t border-white/5 bg-bg-1 py-20 sm:py-28">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
          <Eyebrow tone="muted">The real problem</Eyebrow>
          <h2 className="mt-4 t-h2 text-balance">
            Most service businesses do not have an AI problem. They have an
            operations problem.
          </h2>
          <p className="mt-6 max-w-[720px] t-lead text-fg-2">
            Founder-led companies usually rely on the owner to personally hold
            the whole operation together — managing everything from intake to
            invoicing in their head, their inbox, and their phone:
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-3">
            {PROBLEM_ITEMS.map((item) => (
              <li
                key={item}
                className="rounded-md border border-white/8 bg-bg-2 px-4 py-3 t-small text-fg-1"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[720px] t-body text-fg-2">
            The result is operational drag, missed revenue, slow response
            times, and a business that cannot scale past the founder.
          </p>
        </div>
      </section>

      {/* ── 3. What FIS does ── */}
      <section className="border-t border-white/5 bg-bg-0 py-20 sm:py-28">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
          <Eyebrow>What Founder Intelligence Systems does</Eyebrow>
          <h2 className="mt-4 t-h2 text-balance">
            We build the operating layer underneath the business.
          </h2>
          <p className="mt-6 max-w-[720px] t-lead text-fg-2">
            The pilot rebuilds the foundation: structured customer + job data,
            a single intake surface, documented field work, searchable
            business memory, and AI assistants grounded in your real
            operations.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {FRAMEWORK_ITEMS.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-white/8 bg-bg-1 p-6"
              >
                <h3 className="t-h5 font-headline">{item.title}</h3>
                <p className="mt-3 t-body text-fg-2">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 & 6. Pilot program + investment ── */}
      <section className="border-t border-white/5 bg-bg-1 py-20 sm:py-28">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
          <Eyebrow>Pilot Partner Program</Eyebrow>
          <h2 className="mt-4 t-h2 text-balance">
            We're taking on 2–3 pilot partners to validate this in real
            businesses.
          </h2>
          <p className="mt-6 max-w-[760px] t-lead text-fg-2">
            AJ Digital is accepting a small group of founder-led service
            businesses to validate and refine the Founder Intelligence Systems
            framework in real operating conditions. Pilot partners receive
            hands-on consulting, systems architecture, workflow design,
            automation setup, and AI-readiness implementation at a reduced
            pilot-partner investment.
          </p>
          <p className="mt-4 max-w-[760px] t-body text-fg-2">
            In exchange, pilot partners agree to provide implementation
            feedback, before / after performance insights, and case study
            participation where appropriate.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Investment card */}
            <div className="rounded-xl border border-signal-yellow/30 bg-bg-2 p-8">
              <Eyebrow tone="signal">Pilot Partner Investment</Eyebrow>
              <ul className="mt-6 space-y-5">
                <li>
                  <div className="t-small text-fg-3">Normal engagement value</div>
                  <div className="mt-1 t-h4 text-fg-2 line-through decoration-fg-3/40">
                    $25,000 – $50,000+
                  </div>
                </li>
                <li>
                  <div className="t-small text-fg-3">
                    Pilot partner implementation
                  </div>
                  <div className="mt-1 t-h3 text-signal-yellow">$10,000</div>
                </li>
                <li>
                  <div className="t-small text-fg-3">
                    Ongoing optimization retainer
                  </div>
                  <div className="mt-1 t-h4">$2,500 / month</div>
                </li>
                <li>
                  <div className="t-small text-fg-3">Suggested minimum</div>
                  <div className="mt-1 t-h5">6 months</div>
                </li>
              </ul>
              <p className="mt-8 t-small text-fg-3">
                Software subscriptions are billed separately and are not
                included in the implementation fee.
              </p>
            </div>

            {/* What's included */}
            <div className="rounded-xl border border-white/8 bg-bg-2 p-8">
              <Eyebrow>What's included</Eyebrow>
              <ul className="mt-6 space-y-3">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex gap-3 t-body text-fg-1">
                    <span
                      aria-hidden
                      className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-signal-yellow"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Who this is for ── */}
      <section className="border-t border-white/5 bg-bg-0 py-20 sm:py-28">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
          <Eyebrow>Fit</Eyebrow>
          <h2 className="mt-4 t-h2 text-balance">Who this is for.</h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-signal-yellow/30 bg-bg-1 p-6">
              <h3 className="t-h5 text-signal-yellow">Good fit</h3>
              <ul className="mt-4 space-y-3">
                {GOOD_FIT.map((item) => (
                  <li key={item} className="flex gap-3 t-body text-fg-1">
                    <span aria-hidden className="mt-[2px] text-signal-yellow">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-white/8 bg-bg-1 p-6">
              <h3 className="t-h5 text-fg-2">Not a fit</h3>
              <ul className="mt-4 space-y-3">
                {NOT_FIT.map((item) => (
                  <li key={item} className="flex gap-3 t-body text-fg-2">
                    <span aria-hidden className="mt-[2px] text-fg-3">
                      ✕
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Outcomes ── */}
      <section className="border-t border-white/5 bg-bg-1 py-20 sm:py-28">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
          <Eyebrow>Outcomes</Eyebrow>
          <h2 className="mt-4 t-h2 text-balance">
            What the pilot is designed to produce.
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OUTCOMES.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-white/8 bg-bg-2 px-5 py-5 t-body text-fg-1"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 9. Case studies ── */}
      <section className="border-t border-white/5 bg-bg-0 py-20 sm:py-28">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
          <Eyebrow tone="blue">Pilot Case Studies</Eyebrow>
          <h2 className="mt-4 t-h2 text-balance">In development.</h2>
          <p className="mt-6 max-w-[720px] t-lead text-fg-2">
            Pilot case studies are currently being developed with select
            founder-led service businesses. Each will eventually include the
            before state, the system built, the metrics improved, and the
            founder's own quote.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {CASE_STUDIES.map((c) => (
              <div
                key={c.name}
                className="rounded-lg border border-white/8 bg-bg-1 p-6"
              >
                <div className="t-small text-fg-3">{c.status}</div>
                <h3 className="mt-3 t-h5">{c.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <section className="border-t border-white/5 bg-bg-1 py-20 sm:py-28">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-4 t-h2 text-balance">Common questions.</h2>
          <div className="mt-10 divide-y divide-white/8 border-y border-white/8">
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="group py-5"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-fg-1">
                  <span className="t-h5 font-headline">{item.q}</span>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-signal-yellow transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[760px] t-body text-fg-2">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. Final CTA + form ── */}
      <section className="border-t border-white/5 bg-bg-0 py-24 sm:py-32">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
          <div className="mx-auto max-w-[760px] text-center">
            <Eyebrow tone="signal">Apply</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance">
              Apply to become a pilot partner.
            </h2>
            <p className="mt-6 t-lead text-fg-2">
              Only 3 pilot partners will be accepted during this validation
              phase. Reviewed personally by Audio Jones.
            </p>
            <p className="mt-4 t-small text-fg-3">
              Prefer to talk first?{" "}
              <Link
                href="/book-a-call"
                className="font-semibold text-signal-yellow underline-offset-4 hover:underline"
              >
                Book a Pilot Fit Call
              </Link>
              .
            </p>
          </div>

          <div className="mt-14">
            <Suspense
              fallback={
                <div
                  aria-hidden
                  className="mx-auto h-[600px] w-full max-w-[640px] rounded-md bg-bg-2 opacity-40"
                />
              }
            >
              <PilotApplicationForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
