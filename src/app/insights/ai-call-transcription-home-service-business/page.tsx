import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
import InsightArticle from "@/components/founder-intelligence/InsightArticle";
import { H2, P, UL } from "@/components/founder-intelligence/FrameworkArticle";
import FAQ from "@/components/founder-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";

const PATH = "/insights/ai-call-transcription-home-service-business";
const TITLE =
  "AI call transcription for home service businesses: what it does and when it pays off";
const DESCRIPTION =
  "AI call transcription records and writes down every call to your business line, logs it in your CRM and triggers the right follow-up. Here is what it captures, where a person should stay involved, and when it pays off.";

const LINK_CLASS = "text-accent-blue hover:text-accent-blue";

const FAQS = [
  {
    question: "What is AI call transcription for a small business?",
    answer:
      "It is a business phone line that records each call and turns it into text automatically. The text is then used to log the call in your CRM and send the caller a relevant follow-up, so no request depends on someone remembering it.",
  },
  {
    question: "Does it replace the person who answers the phone?",
    answer:
      "No. It makes sure every call is written down and followed up. A person still handles pricing, safety and medical questions about equipment, complaints and anything that needs judgment.",
  },
  {
    question: "Is it legal to record customer calls?",
    answer:
      "Often yes, with the right notice, but the rules depend on where you and the caller are. Some states, such as Florida, require all parties' consent. Tell callers the call is recorded, and check your state's rules before you turn recording on.",
  },
  {
    question: "Does it work with my existing CRM?",
    answer:
      "Usually. Most setups pass the call summary, caller details and next step into the CRM you already use. If you do not have one, picking one is part of the scope you agree before any build.",
  },
  {
    question: "When is it not worth it?",
    answer:
      "When call volume is low, when someone already answers and logs every call reliably, or when most work comes through a channel other than the phone.",
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
      <JsonLd
        data={articleJsonLd({
          title: TITLE,
          description: DESCRIPTION,
          url: PATH,
          datePublished: "2026-11-07",
        })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights" },
          { name: "AI call transcription" },
        ]}
      />

      <InsightArticle
        eyebrow="Guide"
        title={TITLE}
        intro="AI call transcription records every call to your business line, turns it into text, logs it in your CRM and starts the right follow-up, so no caller depends on someone remembering them. It pays off when you get more calls than your team can answer and track, and it matters less when someone already logs every call reliably."
      >
        <P>
          Home service businesses run on the phone. Ramp and lift installers,
          remodelers, roofers and HVAC companies all get their best leads as
          calls. The problem is not getting calls. It is what happens to them
          when nobody is free to write anything down.
        </P>

        <H2>What it is, in plain words</H2>
        <P>
          You get a business phone number. Calls to that number are recorded,
          with notice to the caller. Software turns the recording into text and
          pulls out the useful parts: who called, what they need and what should
          happen next. That information goes into your CRM, and the follow-up
          starts from there.
        </P>
        <P>
          You do not need to change how you talk to customers. You just stop
          relying on memory, voicemail and sticky notes.
        </P>

        <H2>What gets captured</H2>
        <UL
          items={[
            "The caller's name, phone number and, if they give them, their email and address. If someone answers live, they ask for an email address for the follow-up.",
            "What they asked about. For a mobility company, that might be a wheelchair ramp, a stairlift, a vertical platform lift or grab bars.",
            "Details that shape the quote, such as number of steps, indoor or outdoor, and who the equipment is for.",
            "How urgent it is, for example a hospital discharge date.",
            "The next step: site visit, callback, quote or answer to a question.",
            "A full transcript, so you can check exactly what was said.",
          ]}
        />

        <H2>How it feeds the CRM and follow-up</H2>
        <P>
          Each call becomes a record in the CRM with a summary and a next step.
          From there:
        </P>
        <UL
          items={[
            "The caller gets a follow-up that matches what they asked about, not a generic \"thanks for calling\". It goes by email when the caller gave an address, or by text to their phone number when they did not and have agreed to texts.",
            "Open quote requests stay on a list until a quote goes out.",
            "Someone gets a reminder when a callback, site measure or quote is overdue.",
            "You can see how many requests came in and how many turned into quotes and jobs.",
          ]}
        />
        <P>
          This is the capture half of a follow-up system. The other half is
          deciding who to contact next and when, which we cover in{" "}
          <Link href="/insights/follow-up-intelligence" className={LINK_CLASS}>
            Follow-Up Intelligence
          </Link>
          .
        </P>

        <H2>Where a person should stay in the loop</H2>
        <P>
          Automation should handle the paperwork, not the judgment. Keep a person
          on:
        </P>
        <UL
          items={[
            "Pricing. Quotes, discounts and funding questions should come from someone who knows the job.",
            "Safety and medical questions. Whether a lift suits a person's condition, weight limits, transfer safety or anything a clinician should weigh in on.",
            "Complaints and service problems. An upset customer needs a call back from a person, quickly.",
            "Anything unusual. If the summary does not make sense, someone should read the transcript.",
          ]}
        />

        <H2>Privacy and consent</H2>
        <P>
          Ask for consent before recording starts. A short greeting is the usual
          way to do it, for example: &ldquo;This call is recorded so we can
          follow up accurately. Press 1 to continue, or press 2 to talk without
          recording.&rdquo; Callers who decline should reach a person, or leave
          a callback request, without being recorded. Recording laws vary by
          state, so check your state&rsquo;s rules before you turn it on. For
          example, Florida requires all parties&rsquo; consent to record a call. Calls
          about mobility equipment can include health details, so limit who can
          see transcripts and do not keep recordings longer than you need them.
          This is general information, not legal advice.
        </P>

        <H2>When it pays off, and when it does not</H2>
        <P>It tends to pay off when:</P>
        <UL
          items={[
            "Calls come in while you and your crew are on jobs.",
            "You know some quote requests never get a quote back.",
            "Each job is worth enough that a few recovered sales a month matter.",
            "Requests are scattered across voicemail, texts and notes.",
          ]}
        />
        <P>It probably is not worth it yet when:</P>
        <UL
          items={[
            "You get only a handful of calls a month.",
            "Someone already answers and logs every call, and nothing slips.",
            "Most of your work comes from a channel other than the phone, like a referral partner who books directly.",
          ]}
        />

        <H2>A real result: Florida Ramp &amp; Lift</H2>
        <P>
          Florida Ramp &amp; Lift is an accessibility and home-modification
          company in Florida. At least 5 quote requests a month never got a quote
          back, because the owner was buried in day-to-day operations. We set up
          a new business phone line with AI call transcription. Every call is
          captured and entered into the CRM, and customers get follow-up emails
          relevant to their call automatically. Those 5 missed quotes a month
          became 5 new sales a month.
        </P>
        <P>
          &ldquo;I went from working in my business to working on my business. I
          got my time back.&rdquo; &mdash; Owner, Florida Ramp &amp; Lift
        </P>
        <P>
          Read the{" "}
          <Link href="/case-studies" className={LINK_CLASS}>
            full case study
          </Link>
          , or see{" "}
          <Link
            href="/insights/missed-quote-requests-ramp-lift-companies"
            className={LINK_CLASS}
          >
            why ramp and lift companies lose quote requests
          </Link>
          . Results depend on your call volume and how quickly quotes go out.
        </P>

        <H2>How to start</H2>
        <P>
          Start with the{" "}
          <Link href="/founder-intelligence/diagnostic" className={LINK_CLASS}>
            diagnostic
          </Link>
          . It is a six-step request, reviewed by a person, that looks at how
          calls reach you today and where they drop. If call capture is the right
          first fix, it is built on{" "}
          <Link href="/agents/responseos" className={LINK_CLASS}>
            ResponseOS
          </Link>
          , our lead capture and follow-up system.
        </P>

        <H2>FAQ</H2>
        <FAQ items={FAQS} />
      </InsightArticle>
    </>
  );
}
