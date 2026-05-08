import { Metadata } from "next";
import Link from "next/link";
import { portalLinks, getBookingUrl } from "@/config/links";

export const metadata: Metadata = {
  title: "For Businesses | Audio Jones",
  description: "Enterprise solutions for consultants, SMBs, and thought leaders to scale their authority and operations.",
  keywords: ["business solutions", "consultant services", "smb tools", "thought leadership", "enterprise systems"],
};

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#008080] to-[#FFD700] bg-clip-text text-transparent">
                Built for Business
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              Enterprise solutions for consultants, SMBs, and thought leaders scaling their authority
            </p>

            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-white/70 leading-relaxed">
                Transform your expertise into a scalable business with integrated systems that handle client delivery,
                marketing automation, performance optimization, and data intelligence—all in one platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Business-Specific Systems */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Systems That Scale Your Business
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Thought Leadership */}
              <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-2xl font-bold mb-4">Thought Leadership Platform</h3>
                <ul className="space-y-3 text-white/70 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Content production and distribution system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Multi-channel authority building</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Speaking engagement management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Media kit and press coordination</span>
                  </li>
                </ul>
                <Link
                  href="/services"
                  className="text-[#008080] hover:text-[#FFD700] font-semibold transition"
                >
                  Learn More →
                </Link>
              </div>

              {/* Consultant Operations */}
              <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-4">Consultant Operations</h3>
                <ul className="space-y-3 text-white/70 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Client onboarding and project management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Automated proposal and contract generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Deliverable tracking and client portals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Time tracking and invoicing</span>
                  </li>
                </ul>
                <Link
                  href="/services"
                  className="text-[#008080] hover:text-[#FFD700] font-semibold transition"
                >
                  Learn More →
                </Link>
              </div>

              {/* Lead Generation */}
              <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <div className="text-5xl mb-4">🔥</div>
                <h3 className="text-2xl font-bold mb-4">Lead Generation & Conversion</h3>
                <ul className="space-y-3 text-white/70 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Automated funnel optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Lead scoring and qualification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Email and SMS nurture sequences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>CRM integration and pipeline management</span>
                  </li>
                </ul>
                <Link
                  href="/applied-intelligence"
                  className="text-[#008080] hover:text-[#FFD700] font-semibold transition"
                >
                  Learn More →
                </Link>
              </div>

              {/* Business Intelligence */}
              <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold mb-4">Business Intelligence</h3>
                <ul className="space-y-3 text-white/70 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Real-time revenue and pipeline tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Client lifetime value analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Marketing ROI and attribution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008080] mt-1">✓</span>
                    <span>Custom dashboards and reporting</span>
                  </li>
                </ul>
                <Link
                  href="/applied-intelligence"
                  className="text-[#008080] hover:text-[#FFD700] font-semibold transition"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EPM Framework */}
      <div className="py-20 border-t border-white/10 bg-gradient-to-b from-transparent to-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built on the EPM Framework
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Our systems are designed around the Experience-Perception-Monetization framework
              to help you build sustainable, scalable business authority.
            </p>
            <Link
              href="/epm"
              className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-[#008080] to-[#FFD700] text-white font-bold text-lg hover:opacity-90 transition"
            >
              Learn About EPM Theory
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Scale Your Business Authority?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Book a consultation to see how our enterprise platform can transform your operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={getBookingUrl()}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#008080] to-[#FFD700] text-white font-bold text-lg hover:opacity-90 transition"
              >
                Book a Consultation
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-bold text-lg hover:border-white/40 transition"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
