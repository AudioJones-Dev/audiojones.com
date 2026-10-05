import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ctaLinks } from "@/config/links";

const operatingProblems = [
  [
    "Work lives in people’s heads",
    "Critical context, rules, and judgment disappear when the right person is unavailable.",
  ],
  [
    "Handoffs lose information",
    "Customers, projects, orders, assets, approvals, or responsibilities move forward without the context required for the next step.",
  ],
  [
    "Software reflects the tool—not the operation",
    "Teams compensate with duplicate entry, spreadsheets, side conversations, and manual reconciliation.",
  ],
  [
    "Automation magnifies ambiguity",
    "Making a broken process faster does not make it better.",
  ],
] as const;

const discoveryExamines = [
  "where work enters",
  "who touches it",
  "what information each person needs",
  "which rules determine what happens next",
  "where exceptions occur",
  "which system holds the authoritative record",
  "where delay, rework, risk, or lost revenue is created",
] as const;

const discoveryOutputs = [
  "Current-State Operating Map",
  "Stakeholder and Handoff Map",
  "Business Rules and Exception Register",
  "Information and System Map",
  "Priority Gap Analysis",
  "Future-State Architecture",
  "Implementation Recommendation",
] as const;

const method = [
  ["Assess", "Establish the symptoms, operating context, and likely constraint."],
  ["Diagnose", "Discover how work actually happens and identify where the system fails."],
  [
    "Architect",
    "Define the future-state workflow, information structure, roles, rules, integrations, controls, and system blueprint.",
  ],
  [
    "Install",
    "Implement the approved workflow, application, integration, automation, AI, or reporting layer.",
  ],
  [
    "Improve",
    "Measure adoption and operating results, then revise from validated evidence.",
  ],
] as const;

const capabilities = [
  ["Process & Workflow Design", "Redesign work, ownership, approvals, handoffs, and exception paths."],
  ["Business Memory", "Convert scattered knowledge into usable SOPs, definitions, decision rules, and approved operating context."],
  ["Custom Applications", "Build purpose-specific internal tools when existing software cannot support the required workflow."],
  ["Integrations & Automation", "Connect systems, remove duplicate work, and route information reliably across the operation."],
  ["AI Agent Systems", "Give AI defined responsibilities, approved sources, authority boundaries, human review gates, and failure behavior."],
  ["Operational Intelligence", "Instrument cycle time, throughput, exceptions, response, quality, and other meaningful operating outcomes."],
  ["ResponseOS", "Use when customer response, qualification, routing, or follow-up is the diagnosed operating constraint."],
] as const;

const outcomes = [
  "Less founder dependency",
  "Fewer dropped handoffs",
  "Less duplicate entry",
  "Lower rework",
  "Shorter cycle times",
  "Clearer ownership",
  "Better decision context",
  "More reliable customer response",
  "Measurable operating performance",
] as const;

const engagements = [
  ["Founder Intelligence Diagnostic", "A decision-ready diagnosis of workflow, information, ownership, systems, knowledge, and AI-readiness gaps."],
  ["Business Systems Architecture", "Current-state model, future-state design, rules, information structure, system boundaries, and implementation blueprint."],
  ["System Installation", "Implement the approved process changes, applications, integrations, automation, AI systems, and measurement layer."],
  ["Managed Intelligence", "Maintain workflows, operating knowledge, controls, evidence, and system performance over time."],
] as const;

function CardGrid({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2">
      {items.map(([title, copy]) => (
        <article key={title} className="rounded-2xl border border-border-subtle bg-surface-1 p-6 sm:p-8">
          <h3 className="t-h4 text-fg-0">{title}</h3>
          <p className="mt-3 t-body text-fg-2">{copy}</p>
        </article>
      ))}
    </div>
  );
}

export default function HomepageSystems() {
  return (
    <>
      <section className="bg-bg-base py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow>The operating problem</Eyebrow>
          <h2 className="mt-4 max-w-4xl t-h2 text-balance text-fg-0">
            Growth exposes the system the business has been carrying informally.
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 t-body-lg text-fg-2">
            <p>Early-stage businesses often operate through memory, direct communication, founder judgment, spreadsheets, and informal workarounds.</p>
            <p>As volume increases, that invisible operating system becomes fragile.</p>
          </div>
          <CardGrid items={operatingProblems} />
        </div>
      </section>

      <section className="border-y border-border-subtle bg-surface-1 py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow tone="blue">Business Systems Discovery</Eyebrow>
          <h2 className="mt-4 max-w-4xl t-h2 text-balance text-fg-0">
            We do not start with a tool list. We start with how the business really works.
          </h2>
          <p className="mt-6 max-w-3xl t-body-lg text-fg-2">
            Discovery combines structured assessments, stakeholder interviews, workflow walkthroughs, document and system review, and exception analysis. The objective is to turn operational knowledge into evidence that can support a defensible system decision.
          </p>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border-subtle bg-bg-base p-6 sm:p-8">
              <h3 className="t-h3 text-fg-0">What we examine</h3>
              <ul className="mt-6 space-y-3 t-body text-fg-2">
                {discoveryExamines.map((item) => <li key={item}>— {item}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-bg-base p-6 sm:p-8">
              <h3 className="t-h3 text-fg-0">What discovery produces</h3>
              <ul className="mt-6 space-y-3 t-body text-fg-2">
                {discoveryOutputs.map((item) => <li key={item}>— {item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="method" className="scroll-mt-24 bg-bg-base py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow>The engagement path</Eyebrow>
          <h2 className="mt-4 max-w-4xl t-h2 text-balance text-fg-0">
            Understand the business first. Architect the system second.
          </h2>
          <ol className="mt-12 grid gap-5 lg:grid-cols-5">
            {method.map(([title, copy], index) => (
              <li key={title} className="rounded-2xl border border-border-subtle bg-surface-1 p-6">
                <p className="font-mono text-xs text-signal-yellow">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 t-h4 text-fg-0">{title}</h3>
                <p className="mt-3 t-small text-fg-2">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-border-subtle bg-surface-1 py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow tone="blue">What the architecture may call for</Eyebrow>
          <h2 className="mt-4 max-w-4xl t-h2 text-balance text-fg-0">
            The solution is determined by the problem—not by a preferred technology.
          </h2>
          <CardGrid items={capabilities} />
        </div>
      </section>

      <section className="bg-bg-base py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow>Economic value</Eyebrow>
          <h2 className="mt-4 max-w-4xl t-h2 text-balance text-fg-0">
            A better system reduces the cost of operating through ambiguity.
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((outcome) => (
              <p key={outcome} className="rounded-xl border border-border-subtle bg-surface-1 px-5 py-4 t-body text-fg-1">{outcome}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border-subtle bg-surface-1 py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow tone="blue">Evidence before claims</Eyebrow>
          <h2 className="mt-4 max-w-4xl t-h2 text-balance text-fg-0">
            Show what was discovered, why the architecture changed, and what improved.
          </h2>
          <p className="mt-6 max-w-3xl t-body-lg text-fg-2">
            Current examples are presented as system patterns until discovery evidence, implementation records, and measured results can be published responsibly.
          </p>
          <ButtonLink href="/case-studies" variant="secondary" className="mt-8">View System Patterns</ButtonLink>
        </div>
      </section>

      <section className="bg-bg-base py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow>How engagements progress</Eyebrow>
          <h2 className="mt-4 max-w-4xl t-h2 text-balance text-fg-0">One path from uncertainty to a working system.</h2>
          <CardGrid items={engagements} />
        </div>
      </section>

      <section className="border-t border-border-subtle bg-surface-1 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Eyebrow>Start with the operating reality</Eyebrow>
          <h2 className="mt-4 t-h2 text-balance text-fg-0">Do not buy another tool until you know what the business actually needs.</h2>
          <p className="mx-auto mt-6 max-w-2xl t-body-lg text-fg-2">The Founder Intelligence Diagnostic identifies what is breaking, why it is breaking, and what system—if any—should be built next.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={ctaLinks.founderIntelligenceDiagnostic} variant="glow">Start the Founder Intelligence Diagnostic</ButtonLink>
            <ButtonLink href="/book-a-call" variant="secondary">Discuss a Known Systems Problem</ButtonLink>
          </div>
          <p className="mt-6 t-small text-fg-3">Reviewed personally. No tool recommendation before diagnosis.</p>
        </div>
      </section>
    </>
  );
}
