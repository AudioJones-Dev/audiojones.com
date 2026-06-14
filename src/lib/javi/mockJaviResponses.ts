/**
 * Javi V1 — mock response adapter.
 *
 * This file is intentionally hard-coded. It exists so the on-site
 * Javi widget can demonstrate the AI Executive Assistant offer
 * without coupling the marketing site to the (in-progress) Javi
 * assistant backend (`AudioJones-Dev/Audio-Jones-Executive-Assistant-Javi`).
 *
 * When the real backend is ready, swap the body of
 * `getMockJaviResponse` for an `await fetch(JAVI_API_URL, …)` inside
 * `src/lib/javi/javiClient.ts`. The widget contract does not change.
 */

export type JaviSuggestion = {
  id: string;
  label: string;
};

export type JaviCta = {
  label: string;
  href: string;
};

export type JaviResponse = {
  /** Text shown in the assistant bubble. Kept short — chat-sized copy. */
  text: string;
  /** Optional follow-up suggestions to surface as chips below the bubble. */
  followUps?: JaviSuggestion[];
  /** Optional CTA rendered as a primary button under the bubble. */
  cta?: JaviCta;
};

export const JAVI_SUGGESTED_PROMPTS: JaviSuggestion[] = [
  { id: "what-aj-builds", label: "What does Audio Jones build?" },
  { id: "explain-responseos", label: "Can you explain ResponseOS?" },
  { id: "use-an-assistant", label: "How could I use an AI executive assistant?" },
  { id: "want-one", label: "I want one like Javi" },
];

const DIAGNOSTIC_CTA: JaviCta = {
  label: "Start with the AI Readiness Diagnostic",
  href: "/ai-readiness-diagnostic",
};

const BOOK_CALL_CTA: JaviCta = {
  label: "Book a call with Audio Jones",
  href: "/book-a-call",
};

const INTRO_FOLLOWUPS: JaviSuggestion[] = [
  { id: "explain-responseos", label: "Can you explain ResponseOS?" },
  { id: "use-an-assistant", label: "How could I use an AI executive assistant?" },
];

/**
 * Map a user message (free-text or a suggestion id) to a canned response.
 * The matcher is intentionally generous — substring + suggestion-id match —
 * because this is a marketing proof-of-concept, not a real NLP layer.
 */
export function getMockJaviResponse(input: string): JaviResponse {
  const raw = input.trim();
  const q = raw.toLowerCase();

  if (!raw) {
    return {
      text:
        "Type a question, or tap one of the suggestions above. I can talk through our systems, how a Javi-style assistant could work for your business, or send you straight to the diagnostic.",
    };
  }

  // Exact suggestion-id matches first (the chips send the id, not the label).
  switch (raw) {
    case "what-aj-builds":
      return {
        text:
          "Audio Jones builds Founder Intelligence Systems for founder-led businesses ($250K–$5M ARR). Think ResponseOS for revenue recovery, AI executive assistants like me, and operator workflows that turn signal into action — without the noise of a generic SaaS rebuild.",
        followUps: [
          { id: "explain-responseos", label: "Tell me about ResponseOS" },
          { id: "use-an-assistant", label: "How would an assistant help me?" },
        ],
        cta: DIAGNOSTIC_CTA,
      };
    case "explain-responseos":
      return {
        text:
          "ResponseOS is Audio Jones' revenue recovery system — it catches the leads, replies, and follow-ups that fall through the cracks in a founder-led business and turns them into structured, owned operations. It's the system underneath the assistant.",
        cta: DIAGNOSTIC_CTA,
      };
    case "use-an-assistant":
      return {
        text:
          "An AI executive assistant like me handles the operational tax on a founder's day — answering inbound questions, routing leads, surfacing what matters, and carrying memory between conversations. Most founders save 8–15 hours a week and stop dropping warm leads.",
        followUps: [{ id: "want-one", label: "I want one like Javi" }],
        cta: DIAGNOSTIC_CTA,
      };
    case "want-one":
      return {
        text:
          "Good. The fastest path is the AI Readiness Diagnostic — it tells us what's worth automating in your business before we build anything. Takes about 7 minutes and you get a real plan, not a sales pitch.",
        cta: DIAGNOSTIC_CTA,
      };
  }

  // Loose keyword matching for free-text.
  if (/(responseos|response os|revenue recovery)/.test(q)) {
    return getMockJaviResponse("explain-responseos");
  }
  if (/(assistant|executive|ea|chatbot|agent)/.test(q)) {
    return getMockJaviResponse("use-an-assistant");
  }
  if (/(what.*(build|do)|services?|offer|product)/.test(q)) {
    return getMockJaviResponse("what-aj-builds");
  }
  if (/(price|cost|pricing|how much)/.test(q)) {
    return {
      text:
        "Pricing depends on what we're actually building — assistants like me, ResponseOS rollouts, and operator workflows are scoped per engagement. The diagnostic surfaces the right shape and budget range before anyone quotes you a number.",
      cta: DIAGNOSTIC_CTA,
    };
  }
  if (/(book|call|talk|demo|meet)/.test(q)) {
    return {
      text:
        "Easiest way is the diagnostic first — it gives the call a real agenda. If you'd rather go straight to a conversation, you can book directly.",
      cta: BOOK_CALL_CTA,
    };
  }
  if (/(hi|hello|hey|sup|yo)\b/.test(q)) {
    return {
      text:
        "Hey — I'm Javi, Audio Jones' AI Executive Assistant. Ask me anything about what Audio Jones builds, or how an assistant like me could work for your business.",
      followUps: INTRO_FOLLOWUPS,
    };
  }

  // Graceful fallback — always points back to the offer.
  return {
    text:
      "I'm a V1 proof-of-concept, so I keep my answers tight. The fastest way to get a real answer for your business is the AI Readiness Diagnostic — it surfaces what's worth automating before we build anything.",
    followUps: INTRO_FOLLOWUPS,
    cta: DIAGNOSTIC_CTA,
  };
}
