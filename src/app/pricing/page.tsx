/* app/pricing/page.tsx */

import Link from 'next/link';
import { getAllServices, applyMarketRules } from '@/lib/getPricing';

export default function PricingPage() {
  // Load all services and apply market rules
  const allServices = getAllServices();
  const servicesWithMarketPricing = allServices.map(service => ({
    ...service,
    tiers: service.tiers.map(tier => ({
      ...tier,
      price_min: applyMarketRules(service.id, service.market, tier.price_min),
      price_max: applyMarketRules(service.id, service.market, tier.price_max),
    }))
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://audiojones.com/pricing",
        "url": "https://audiojones.com/pricing",
        "name": "Audio Jones Pricing",
        "description": "Transparent AI consulting and media systems pricing.",
        "isPartOf": { "@id": "https://audiojones.com/#website" },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://audiojones.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Pricing"
            }
          ]
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main className="bg-[#0f0f10] text-white min-h-screen">
        {/* top spacer if your layout has fixed nav */}
        <div className="h-16" />

        {/* hero */}
        <section className="relative flex w-full justify-center overflow-hidden py-20 sm:py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f10] to-[#181818]" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-1/4 top-0 h-full w-full rounded-full bg-gradient-radial from-[#FF4500] to-transparent blur-3xl" />
            <div className="absolute -right-1/4 bottom-0 h-full w-full rounded-full bg-gradient-radial from-[#FFD700] to-transparent blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center">
            {/* breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center justify-center gap-2 text-sm text-white/50">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li>/</li>
                <li className="text-white">Pricing</li>
              </ol>
            </nav>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
              Transparent AI Consulting Plans for 2025
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Choose a system that scales with your brand. Built for creators, founders, and media operators.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/book"
                className="bg-[#ff7847] text-black font-semibold px-6 py-3 rounded-lg hover:scale-[1.02] transition"
              >
                Book a Strategy Call
              </a>
              <a
                href="#plans"
                className="border border-white/30 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white/10 transition"
              >
                Compare Plans
              </a>
            </div>
          </div>
        </section>

        {/* Dynamic services from catalog */}
        <div className="max-w-6xl mx-auto px-4 pb-16 space-y-16">
          {servicesWithMarketPricing.map((service) => (
            <section key={service.id} id={service.id} className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold">{service.label}</h2>
                <p className="text-white/60 mt-2">
                  {service.market.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Market
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {service.tiers.filter(tier => tier.active).map((tier, index) => (
                  <div 
                    key={tier.id}
                    className={`rounded-2xl p-6 flex flex-col gap-4 ${
                      index === 1 
                        ? 'border border-[#ff7847] bg-gradient-to-b from-[#181818] to-[#101010] relative' 
                        : 'border border-white/5 bg-[#131313]'
                    }`}
                  >
                    {index === 1 && (
                      <span className="absolute -top-3 right-4 bg-[#ff7847] text-black text-xs font-bold px-3 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                    
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">{tier.id.toUpperCase()}</p>
                      <h3 className="text-lg font-semibold mt-1">{tier.name}</h3>
                    </div>
                    
                    <div className="text-2xl font-bold">
                      {tier.billing_model === 'custom' ? (
                        'Custom'
                      ) : tier.price_min === tier.price_max ? (
                        `$${tier.price_min.toLocaleString()}`
                      ) : (
                        `$${tier.price_min.toLocaleString()} - $${tier.price_max.toLocaleString()}`
                      )}
                      {tier.billing_model === 'monthly' && <span className="text-sm font-normal text-white/50">/mo</span>}
                    </div>
                    
                    <p className="text-xs text-white/50 uppercase tracking-wide">
                      {tier.billing_model.replace('_', ' ')} • {tier.contract_min_months === 0 ? 'No contract' : `${tier.contract_min_months} mo min`}
                    </p>
                    
                    <ul className="space-y-2 text-sm text-white/70 flex-grow">
                      {tier.deliverables.map((deliverable, i) => (
                        <li key={i}>• {deliverable}</li>
                      ))}
                    </ul>
                    
                    <a
                      href="/book"
                      className={`mt-auto inline-flex justify-center rounded-lg py-2 text-sm font-semibold transition ${
                        index === 1
                          ? 'bg-[#ff7847] text-black hover:opacity-90'
                          : tier.billing_model === 'custom'
                          ? 'border border-white/20 hover:bg-white/10'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {tier.billing_model === 'custom' ? 'Contact Sales' : `Get ${tier.name}`}
                    </a>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* trust */}
        <section className="bg-[#0b0b0b] border-y border-white/5 py-14">
          <div className="max-w-6xl mx-auto px-4 space-y-8">
            <h2 className="text-center text-xl font-semibold">Trusted by South Florida leaders and creators</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-white/5 rounded-xl p-5 space-y-3">
                <p className="text-sm text-white/70">
                  "Our content cadence finally matched our sales cadence."
                </p>
                <p className="text-xs text-white/40">Founder, local media brand</p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 space-y-3">
                <p className="text-sm text-white/70">
                  "The AI repurposing saved us hours every week."
                </p>
                <p className="text-xs text-white/40">Podcast network operator</p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 space-y-3">
                <p className="text-sm text-white/70">
                  "Portal reporting made it easy to show ROI."
                </p>
                <p className="text-xs text-white/40">Service-based business</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 py-16 space-y-8">
          <h2 className="text-2xl font-semibold">Pricing FAQs</h2>
          <div className="space-y-4">
            <details className="bg-white/5 rounded-lg p-4">
              <summary className="cursor-pointer font-medium">Do you offer month-to-month?</summary>
              <p className="mt-2 text-sm text-white/70">
                Yes. Most clients start month-to-month while we dial in the content system.
              </p>
            </details>
            <details className="bg-white/5 rounded-lg p-4">
              <summary className="cursor-pointer font-medium">Can you integrate with our existing studio setup?</summary>
              <p className="mt-2 text-sm text-white/70">
                Yes. We can work with your current production tools and CRMs.
              </p>
            </details>
            <details className="bg-white/5 rounded-lg p-4">
              <summary className="cursor-pointer font-medium">What's included in support?</summary>
              <p className="mt-2 text-sm text-white/70">
                Pro and Enterprise get priority support, reporting, and automation updates.
              </p>
            </details>
          </div>
        </section>
      </main>
    </>
  );
}