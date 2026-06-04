'use client'

import { useState } from 'react'

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: "How quickly can you get our AI systems up and running?",
    answer: "Most clients see their first AI automation live within 2 weeks. Complex multi-system integrations typically take 4-6 weeks. We prioritize quick wins first, then layer in advanced functionality."
  },
  {
    question: "Do you work with businesses outside of Miami?",
    answer: "Absolutely! While we're based in Miami, we serve clients worldwide. All our systems are built remotely and can be managed from anywhere. We've built AI systems for creators in over 15 countries."
  },
  {
    question: "What makes your AI systems different from other marketing automation?",
    answer: "We don't use generic templates. Every AI system is custom-built for your specific business model, audience, and goals. Our systems learn and adapt, becoming more effective over time. Plus, everything integrates—your content, marketing, sales, and operations work as one machine."
  },
  {
    question: "How much technical knowledge do I need to manage these systems?",
    answer: "Zero. We build everything with user-friendly dashboards and provide complete training. If you can use a smartphone, you can manage our AI systems. We also offer ongoing support to ensure everything runs smoothly."
  },
  {
    question: "What's your typical ROI for AI automation projects?",
    answer: "Our clients typically see 25x ROI within the first 6 months. This comes from reduced manual work, increased conversion rates, and new revenue streams our AI systems identify and capture automatically."
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
            href="/book"
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