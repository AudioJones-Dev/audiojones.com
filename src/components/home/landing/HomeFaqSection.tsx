import { Eyebrow } from "@/components/ui/Eyebrow";
import FAQ from "@/components/founder-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/seo/schema";

// Plain-language, founder-readable FAQ. Leads with what the business does in
// everyday terms, then names the framework — not the other way around.
const HOME_FAQS = [
  {
    "question": "What does Audio Jones do?",
    "answer": "Audio Jones helps founders find where work breaks down and what to fix first. AJ Digital builds the agreed workflows, tools, and reporting. The aim is to lose fewer leads, cut repeat work, and help the team act without waiting on the founder."
  },
  {
    "question": "Who is this for?",
    "answer": "Founder-led service businesses with steady leads or repeat work. It fits teams that miss follow-ups, lose track of jobs, or rely on the owner for each next step. You do not need to know which tool to buy."
  },
  {
    "question": "What is a Founder Intelligence System?",
    "answer": "Founder Intelligence Systems for founder-led service businesses connect team tasks, customer records, shared knowledge, and reports. A customer relationship management system, or CRM, keeps track of leads and clients. Business memory keeps the rules and steps your team agrees to use."
  },
  {
    "question": "What is a business diagnostic?",
    "answer": "A diagnostic is a close look at how your business works. We trace the steps, find where time or sales are lost, and agree on the first issue to fix. An online request starts the review. It is not the full diagnostic or an instant report."
  },
  {
    "question": "Do I need AI or new software?",
    "answer": "That depends on the gap. A clear owner or a shared checklist may be enough. If you need AI or new tools, we define their job, limits, and checks before a build starts."
  },
  {
    "question": "What happens when I request a diagnostic?",
    "answer": "You answer six steps about your business, tools, and goals. Audio Jones reviews your request. If there is a strong fit, the next step is a conversation about scope. Any paid work is agreed before it starts."
  },
  {
    "question": "Can you guarantee more sales?",
    "answer": "No. Results depend on demand, your offer, the data, and how your team uses the system. We agree on what to measure and check progress against that starting point."
  }
];

export default function HomeFaqSection() {
  return (
    <section className="border-t border-[var(--line-2)] bg-bg-0 py-24 sm:py-32">
      <JsonLd data={faqJsonLd(HOME_FAQS)} />
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="mb-12 max-w-3xl">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">Questions founders ask first.</h2>
          <p className="mt-5 t-lead text-fg-2">
            Plain answers, before you book anything.
          </p>
        </div>
        <div className="max-w-3xl">
          <FAQ items={HOME_FAQS} />
        </div>
      </div>
    </section>
  );
}
