import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
import InsightArticle from "@/components/founder-intelligence/InsightArticle";
import { H2, P, UL } from "@/components/founder-intelligence/FrameworkArticle";
import FAQ from "@/components/founder-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  definedTermJsonLd,
  faqJsonLd,
} from "@/lib/seo/schema";

const PATH = "/insights/follow-up-intelligence";
const TITLE = "What is Follow-Up Intelligence?";
const DEFINITION =
  "Follow-Up Intelligence is a system that determines which leads need contact, when, and why — automatically — so follow-up becomes consistent and scored instead of manual and forgotten.";
const DESCRIPTION =
  "Follow-Up Intelligence is the system that knows which leads to contact, when, and why — so no opportunity goes cold. It turns from-memory follow-up into a scored, reliable process.";

const FAQS = [
  {
    question: "What is Follow-Up Intelligence?",
    answer: DEFINITION,
  },
  {
    question: "How is it different from a CRM?",
    answer:
      "A CRM stores contacts. Follow-Up Intelligence decides and drives the next action — who to contact, when, and why — and re-engages leads that go quiet.",
  },
  {
    question: "Is this just automation?",
    answer:
      "Automation sends messages on a fixed schedule. Follow-Up Intelligence decides which message, to whom, and when — based on lead behavior and intent, not a generic drip.",
  },
  {
    question: "Do I need to replace my tools?",
    answer:
      "Usually not. It is built around the tools you already use, then adds the scoring and cadence layer on top.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  type: "article",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Insights", url: "/insights" },
          { name: TITLE, url: PATH },
        ])}
      />
      <JsonLd data={articleJsonLd({ title: TITLE, description: DESCRIPTION, url: PATH })} />
      <JsonLd data={definedTermJsonLd({ name: "Follow-Up Intelligence", description: DEFINITION, url: PATH })} />
      <JsonLd data={faqJsonLd(FAQS)} />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights" },
          { name: "Follow-Up Intelligence" },
        ]}
      />

      <InsightArticle
        eyebrow="Definition"
        title={TITLE}
        intro="The fastest answer: Follow-Up Intelligence makes sure every lead gets the right next touch at the right time — without relying on someone to remember."
      >
        <P>
          Most businesses follow up from memory and good intentions. A lead
          comes in, someone means to call back, and the day gets busy. Follow-Up
          Intelligence removes the memory and the busy-ness from the equation.
        </P>

        <H2>What it actually does</H2>
        <UL
          items={[
            "Captures every lead the moment it arrives.",
            "Scores which leads need attention first.",
            "Triggers the next touch on a cadence built around your offer.",
            "Re-engages stalled and ghosted leads automatically.",
            "Shows you which follow-ups are actually converting.",
          ]}
        />

        <H2>Why follow-up beats more leads</H2>
        <P>
          The leads you already paid for are the cheapest revenue you have.
          Speed and consistency on those usually beat spending more to get new
          ones — and they cost nothing extra to capture.
        </P>

        <H2>Example</H2>
        <P>
          A contractor booked more estimates not by spending more, but by
          answering faster and following up five times instead of once. Same
          leads, more booked work.
        </P>

        <H2>Where it lives</H2>
        <P>
          Follow-Up Intelligence is the core of{" "}
          <Link href="/agents/responseos" className="text-accent-blue hover:text-accent-blue">
            ResponseOS
          </Link>
          , the revenue-recovery system. A{" "}
          <Link
            href="/insights/revenue-leak-diagnostic"
            className="text-accent-blue hover:text-accent-blue"
          >
            Founder Revenue Leak Diagnostic
          </Link>{" "}
          usually surfaces it as the first fix.
        </P>

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </InsightArticle>
    </>
  );
}
