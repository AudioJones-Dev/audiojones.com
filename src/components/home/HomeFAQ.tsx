'use client'

import { useState } from 'react'

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: "How quickly can you get our AI systems up and running?",
    answer: "Timing depends on access, data quality, integrations, workflow complexity, and approval speed. We define the implementation plan after diagnosis instead of promising one universal timeline."
  },
  {
    question: "Do you work with businesses outside of Miami?",
    answer: "AJ Digital can deliver remote diagnostic and systems work when the workflow, access, data, and operating requirements support it. Fit is confirmed during intake."
  },
  {
    question: "What makes your AI systems different from other marketing automation?",
    answer: "We start with the operating constraint and install only the workflow, integration, governance, and measurement layer the evidence supports. Existing systems are retained or integrated where practical."
  },
  {
    question: "How much technical knowledge do I need to manage these systems?",
    answer: "The required operator skill depends on the installed workflow. Training, human approval states, documentation, and a defined support window are scoped into the engagement where needed."
  },
  {
    question: "Do you guarantee ROI for AI automation projects?",
    answer: "No. AJ Digital establishes a baseline, agrees on measurable outcomes, and reports what changed. Modeled ROI may help prioritize an investigation, but it is not a guaranteed client result."
  },
  {
    question: "Can you integrate with our existing tools and platforms?",
    answer: "Yes! We specialize in connecting disparate systems. Whether you're using CRM software, email platforms, social media tools, or custom applications, we can integrate everything into one seamless workflow."
  }
]

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-bg-base">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-bold uppercase tracking-widest text-signal-yellow mb-4">FAQ</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-6 text-lg leading-8 text-text-muted max-w-2xl mx-auto">
            Get answers to the most common questions about our AI systems and automation services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border-subtle rounded-xl overflow-hidden">
              <button
                className="w-full px-6 py-5 text-left bg-surface-1 hover:bg-surface-2 transition-colors duration-200 flex items-center justify-between"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-semibold text-white">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-text-muted transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 py-5 bg-surface-1 border-t border-border-subtle">
                  <p className="text-text-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-text-muted mb-6">Still have questions?</p>
          <a
            href="/book-a-call"
            className="inline-flex h-12 items-center justify-center rounded-full px-8 bg-signal-yellow hover:bg-signal-soft text-black text-sm font-bold tracking-wide hover:scale-105 transition"
          >
            Book a Strategy Call
          </a>
        </div>
      </div>

      {/* Structured Data for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </section>
  )
}
