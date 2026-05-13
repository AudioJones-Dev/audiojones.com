// FAQ Block Component - Structured Q&A section
'use client';

import { useState } from 'react';

interface FAQ {
  q: string;
  a: string;
}

interface FAQBlockProps {
  faqs: FAQ[];
}

export default function FAQBlock({ faqs }: FAQBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-700 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          <span className="text-[#F0FF85]">❓</span> Frequently Asked Questions
        </h2>
        <p className="text-gray-300">
          Common questions about Audio Jones strategies and implementation
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-xl overflow-hidden transition-all duration-200 hover:border-[#E8FF5A]/30"
          >
            <button
              className="w-full px-6 py-4 text-left flex items-center justify-between bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <h3 className="font-semibold text-white pr-4">
                {faq.q}
              </h3>
              <div className="flex-shrink-0">
                <svg
                  className={`w-5 h-5 text-[#E8FF5A] transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
            
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-900/30 border-t border-gray-700">
                <p className="text-gray-300 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </section>
  );
}