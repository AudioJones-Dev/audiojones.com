// src/app/consent-testimonial/page.tsx
"use client";

import { useState } from "react";

export default function ConsentTestimonialPage() {
  const [consentName, setConsentName] = useState(false);
  const [consentImage, setConsentImage] = useState(false);
  const [consentEdit, setConsentEdit] = useState(false);
  const [signature, setSignature] = useState("");
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to a server
    console.log({
      consentName,
      consentImage,
      consentEdit,
      signature,
      date,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#111] text-white">
        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Thank You!</h1>
          <p className="mt-4 text-lg text-white/75">Your consent has been submitted.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111] text-white">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
          Client Testimonial Release & Consent
        </h1>

        <div className="prose prose-invert mt-8 max-w-none">
          <p>
            I authorize Audio Jones / AJ Digital LLC to use my name, image, and testimonial in marketing
            materials including website, social media, and advertising. I understand my testimonial may be
            edited for length or clarity without changing meaning. I may withdraw consent by emailing{" "}
            <a href="mailto:contact@audiojones.com">contact@audiojones.com</a> (30 days notice).
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={consentName}
                  onChange={(e) => setConsentName(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="ml-3 text-white">Consent to use name</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={consentImage}
                  onChange={(e) => setConsentImage(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="ml-3 text-white">Consent to use image</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={consentEdit}
                  onChange={(e) => setConsentEdit(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="ml-3 text-white">Consent to edit for length/clarity</span>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="signature" className="block text-sm font-medium text-white/80">
                  Signature
                </label>
                <input
                  type="text"
                  id="signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-border-subtle bg-white/5 py-2 px-3 text-white shadow-sm focus:border-signal-yellow focus:ring-signal-yellow"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-white/80">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-border-subtle bg-white/5 py-2 px-3 text-white shadow-sm focus:border-signal-yellow focus:ring-signal-yellow"
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-full px-6 py-3 font-bold text-black shadow-[0_4px_20px_rgba(232,255,90,0.35)]
                         bg-signal-yellow hover:bg-signal-soft transition"
            >
              Submit Consent
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
