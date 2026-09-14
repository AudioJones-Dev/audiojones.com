import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

const problems = [
  ["Leads go quiet", "A call gets missed. A quote sits in an inbox. No one owns the next step, so a chance to win the job slips away."],
  ["Work waits for you", "Your team needs an answer only you have. Jobs slow down when you are busy, out on a call, or away."],
  ["The numbers do not add up", "Calls, sales, and ad costs live in different places. It is hard to tell what paid off and what needs to change."],
] as const;

const steps = [
  ["Find the gap", "We trace a real lead or job with your team. We look for lost time, missed steps, and work that gets done twice."],
  ["Choose the first fix", "We weigh the cost of each gap. Then we agree on what to fix, who owns it, and how to check the result."],
  ["Build and check", "AJ Digital builds the agreed fix. We test it with your team and track what changes before adding more."],
] as const;

const capabilities = [
  { name: "Workflow automation", plain: "Keep the next step moving", copy: "A workflow is the set of steps a job follows. We set clear owners and connect tools so routine tasks can move without a reminder.", href: "/solutions" },
  { name: "Business memory", plain: "Get key knowledge out of your head", copy: "Keep agreed steps, rules, and past choices in one trusted place. Your team can find what it needs without asking you each time.", href: "/founder-intelligence" },
  { name: "Marketing attribution", plain: "See which efforts lead to sales", copy: "Attribution links a sale to the calls, ads, or other steps that came before it. We check what your data can show and where it has gaps.", href: "/frameworks" },
  { name: "AI agent systems", plain: "Give AI a clear job and limits", copy: "AI can help with set tasks using your approved information. We define what it may do, when a person must step in, and how to check its work.", href: "/agents" },
] as const;

export default function HomepageSystems() {
  return (
    <>
      <section className="border-b border-border-subtle bg-bg-base py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow>Does this sound like your day?</Eyebrow>
          <h2 className="mt-4 max-w-3xl t-h2 text-balance text-fg-0">You have work coming in. Too much still depends on you.</h2>
          <p className="mt-5 max-w-2xl t-body-lg text-fg-2">The first fix depends on where the most time or sales are lost. We help you find that gap before you spend on another tool.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {problems.map(([title, copy]) => (
              <article key={title} className="rounded-lg border border-border-subtle bg-surface-1 p-6 sm:p-8">
                <h3 className="t-h4 text-fg-0">{title}</h3>
                <p className="mt-4 t-body text-fg-2">{copy}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl t-body text-fg-2">Built for founder-led service businesses with regular leads or repeat work. Home service, accessibility, and home modification teams are examples of this fit.</p>
        </div>
      </section>

      <section id="process" className="scroll-mt-24 bg-surface-1 py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow>The method</Eyebrow>
          <h2 className="mt-4 max-w-3xl t-h2 text-balance text-fg-0">Find the cause. Fix the first gap. Check the result.</h2>
          <p className="mt-5 max-w-2xl t-body-lg text-fg-2">A diagnostic is a close look at how work gets done. It helps us choose the right fix and a clear way to measure it.</p>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map(([title, copy], index) => (
              <li key={title} className="rounded-lg border border-border-subtle bg-bg-base p-6 sm:p-8">
                <span className="font-mono text-sm text-signal-yellow">0{index + 1}</span>
                <h3 className="mt-4 t-h4 text-fg-0">{title}</h3>
                <p className="mt-4 t-body text-fg-2">{copy}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-3xl t-body text-fg-2">We agree on scope, price, and how to judge success before a build starts. Results depend on the problem, the data, and how the team uses the fix.</p>
        </div>
      </section>

      <section className="border-y border-border-subtle bg-bg-base py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <Eyebrow>Business systems consulting</Eyebrow>
          <h2 className="mt-4 max-w-3xl t-h2 text-balance text-fg-0">Clear steps. Shared knowledge. Tools that work together.</h2>
          <p className="mt-5 max-w-3xl t-body-lg text-fg-2">Founder Intelligence Systems for founder-led service businesses connect the way your team works, the facts it needs, and the tools it uses. The goal is less chasing and clearer choices.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {capabilities.map((item) => (
              <article key={item.name} className="rounded-lg border border-border-subtle bg-surface-1 p-6 sm:p-8">
                <p className="font-mono text-xs uppercase tracking-wider text-aj-data">{item.name}</p>
                <h3 className="mt-3 t-h4 text-fg-0">{item.plain}</h3>
                <p className="mt-4 t-body text-fg-2">{item.copy}</p>
                <Link href={item.href} className="mt-5 inline-block text-sm text-fg-0 underline underline-offset-4 hover:text-signal-yellow">Explore {item.name.toLowerCase()}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-1 py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <Eyebrow>When follow-up is the gap</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">Give each lead a clear next step.</h2>
            <p className="mt-5 t-body-lg text-fg-2">ResponseOS is our revenue recovery system. It is designed to capture inquiries, check what people need, route them to the right person, and follow up on open work.</p>
            <p className="mt-4 t-body text-fg-2">We first check whether that fits your business. Setup, tools, and any AI tasks are agreed for each project.</p>
            <Link href="/agents/responseos" className="mt-6 inline-block text-fg-0 underline underline-offset-4 hover:text-signal-yellow">Explore ResponseOS</Link>
          </div>
          <aside className="rounded-lg border border-border-subtle bg-bg-base p-6 sm:p-8">
            <Eyebrow>Put a cost on the gap</Eyebrow>
            <h3 className="mt-4 t-h3 text-fg-0">What could missed leads cost you?</h3>
            <p className="mt-5 t-body text-fg-2">Use your own numbers to estimate the sales at risk. The ROI calculator shows a model, not a promise of what you will earn back.</p>
            <Link href="/roi-calculator" className="mt-6 inline-block text-fg-0 underline underline-offset-4 hover:text-signal-yellow">Estimate missed sales</Link>
            <p className="mt-8 t-small text-fg-2">Want to see how a system could work?</p>
            <Link href="/case-studies" className="mt-3 inline-block text-fg-0 underline underline-offset-4 hover:text-signal-yellow">View system examples</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
