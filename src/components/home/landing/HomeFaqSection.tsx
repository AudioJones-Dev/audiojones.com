import { Eyebrow } from "@/components/ui/Eyebrow";
import FAQ from "@/components/founder-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/seo/schema";

// Plain-language, founder-readable FAQ. Leads with what the business does in
// everyday terms, then names the framework — not the other way around.
const HOME_FAQS = [
  {
    question: "What does Audio Jones actually do?",
    answer:
      "We help service businesses stop losing revenue to missed calls, slow follow-up, and not knowing which marketing actually works. Then we build the system that keeps those gaps closed.",
  },
  {
    question: "What is a Founder Intelligence System?",
    answer:
      "It is the system we build. It connects your follow-up, CRM, and reporting so you can see where revenue is leaking and what to fix next — instead of guessing.",
  },
  {
    question: "Who is this for?",
    answer:
      "Founder-led service and trades businesses, where leads come in by phone and form, follow-up is inconsistent, and no one is sure which marketing is paying off.",
  },
  {
    question: "How is this different from an agency or more software?",
    answer:
      "An agency runs more campaigns. Software adds another tool to manage. We fix the system underneath, so the leads you already get stop slipping away — before you spend more to get more.",
  },
  {
    question: "Where do I start?",
    answer:
      "With a diagnostic. We map where your business is losing revenue and attention, then show you the single highest-leverage fix to make next.",
  },
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
