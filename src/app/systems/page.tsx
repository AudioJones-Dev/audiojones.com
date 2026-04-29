import { Metadata } from "next";
import Link from "next/link";
import { modules } from "@/config/modules";
import { funnelStages } from "@/config/nav";
import { portalLinks, getBookingUrl } from "@/config/links";

export const metadata: Metadata = {
  title: "Systems Overview | Audio Jones",
  description: "Integrated platform modules for seamless client delivery, marketing automation, AI optimization, and data intelligence.",
  keywords: ["client delivery", "marketing automation", "ai optimization", "data intelligence", "business systems"],
};

export default function SystemsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#FF4500] to-[#FFD700] bg-clip-text text-transparent">
                Integrated Systems
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              One unified platform connecting marketing, delivery, optimization, and intelligence
            </p>

            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-lg text-white/70 leading-relaxed">
                Our systems aren&apos;t random services—they&apos;re integrated modules that work together 
                across <strong>audiojones.com</strong> (marketing site), <strong>client.audiojones.com</strong> (client portal), 
                and <strong>admin.audiojones.com</strong> (admin portal), all tied to Whop and Stripe billing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Modules Grid */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Platform Modules
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {modules.map((module) => (
                <Link
                  key={module.id}
                  href={module.href}
                  className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-white/20 hover:from-white/10 transition-all duration-300"
                >
                  {/* Module Icon */}
                  <div className="text-5xl mb-4">{module.icon}</div>

                  {/* Module Name */}
                  <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r from-[${module.gradient.from}] to-[${module.gradient.to}] bg-clip-text text-transparent`}>
                    {module.name}
                  </h3>

                  {/* Tagline */}
                  <p className="text-lg text-white/60 mb-4">{module.tagline}</p>

                  {/* Description */}
                  <p className="text-white/70 mb-6">{module.shortDescription}</p>

                  {/* Learn More Arrow */}
                  <div className="flex items-center text-sm font-semibold text-white/80 group-hover:text-white transition">
                    Learn More
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* High-Level Funnel Mapping Section */}
      <div className="py-20 border-t border-white/10 bg-gradient-to-b from-transparent to-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Audio Jones Funnel Map
            </h2>
            <p className="text-center text-white/70 mb-16 max-w-2xl mx-auto">
              Each module maps to a specific stage in your customer journey, creating a complete growth system.
            </p>

            {/* Funnel Stages */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {funnelStages.map((stage, index) => (
                <div key={stage.id} className="relative">
                  {/* Connector Arrow */}
                  {index < funnelStages.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                      <svg className="w-4 h-4 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                      </svg>
                    </div>
                  )}

                  {/* Stage Card */}
                  <div className="p-6 rounded-xl border border-white/10 bg-white/5 text-center h-full">
                    <div className="text-3xl mb-2">{index + 1}</div>
                    <h3 className="text-lg font-bold mb-2">{stage.label}</h3>
                    <p className="text-sm text-white/60 mb-4">{stage.description}</p>
                    
                    {/* Mapped Modules */}
                    <div className="space-y-1">
                      {stage.modules.map((moduleId) => {
                        const mod = modules.find((m) => m.id === moduleId);
                        return mod ? (
                          <div key={moduleId} className="text-xs text-white/50">
                            {mod.icon} {mod.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* End-to-End Funnel Governance Section */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              End-to-End Funnel Governance
            </h2>
            <p className="text-center text-white/70 mb-16 max-w-3xl mx-auto">
              Our Funnel Governance module continuously monitors, validates, and optimizes conversion funnels across all touchpoints to ensure consistent performance and identify improvement opportunities.
            </p>

            {/* Governance Workflow */}
            <div className="space-y-6">
              {/* Step 1: Funnel Mapping */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">🗺️</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">1. Funnel Mapping</h3>
                  <p className="text-white/70">
                    Define all conversion stages, touchpoints, and user paths. Document expected behaviors and conversion thresholds for each funnel segment. Map module ownership (which system handles each stage).
                  </p>
                </div>
              </div>

              {/* Step 2: Performance Tracking */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">📊</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">2. Performance Tracking</h3>
                  <p className="text-white/70">
                    Real-time monitoring of conversion metrics, behavior analysis at each stage, and continuous data collection from all integrated systems (Marketing, Client Delivery, Data Intelligence).
                  </p>
                </div>
              </div>

              {/* Step 3: Bottleneck Analysis */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">🔍</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">3. Bottleneck Analysis</h3>
                  <p className="text-white/70">
                    Identify drop-off points, conduct root cause analysis (UX issues, messaging problems, technical friction), and prioritize improvements based on impact potential.
                  </p>
                </div>
              </div>

              {/* Step 4: Optimization Testing */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">🧪</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">4. Optimization Testing</h3>
                  <p className="text-white/70">
                    Design and run A/B tests on funnel elements (copy, design, flows). Measure before/after performance with statistical significance. Deploy winning variants across the platform.
                  </p>
                </div>
              </div>

              {/* Step 5: Governance Reporting */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">📈</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">5. Governance Reporting</h3>
                  <p className="text-white/70">
                    Generate executive dashboards, compliance monitoring reports, and quality assurance scorecards. Track overall funnel health and cross-channel consistency metrics.
                  </p>
                </div>
              </div>
            </div>

            {/* Governance KPIs Grid */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-center mb-8">What We Measure</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-white/10 bg-white/5 text-center">
                  <div className="text-4xl mb-3">🎯</div>
                  <h4 className="text-lg font-bold mb-2">Overall Conversion</h4>
                  <p className="text-sm text-white/60">End-to-end funnel conversion rates across all touchpoints</p>
                </div>

                <div className="p-6 rounded-xl border border-white/10 bg-white/5 text-center">
                  <div className="text-4xl mb-3">📉</div>
                  <h4 className="text-lg font-bold mb-2">Stage Drop-offs</h4>
                  <p className="text-sm text-white/60">Stage-by-stage abandonment percentages and patterns</p>
                </div>

                <div className="p-6 rounded-xl border border-white/10 bg-white/5 text-center">
                  <div className="text-4xl mb-3">⏱️</div>
                  <h4 className="text-lg font-bold mb-2">Time-to-Conversion</h4>
                  <p className="text-sm text-white/60">Average duration from first touch to final conversion</p>
                </div>

                <div className="p-6 rounded-xl border border-white/10 bg-white/5 text-center">
                  <div className="text-4xl mb-3">📊</div>
                  <h4 className="text-lg font-bold mb-2">Optimization Impact</h4>
                  <p className="text-sm text-white/60">Before/after metrics from funnel improvements and tests</p>
                </div>

                <div className="p-6 rounded-xl border border-white/10 bg-white/5 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <h4 className="text-lg font-bold mb-2">Compliance Score</h4>
                  <p className="text-sm text-white/60">Adherence to conversion best practices and governance rules</p>
                </div>

                <div className="p-6 rounded-xl border border-white/10 bg-white/5 text-center">
                  <div className="text-4xl mb-3">🌐</div>
                  <h4 className="text-lg font-bold mb-2">Cross-Channel Consistency</h4>
                  <p className="text-sm text-white/60">Funnel performance alignment across marketing, client, admin portals</p>
                </div>
              </div>
            </div>

            {/* Maintenance Cadence */}
            <div className="mt-12 p-6 rounded-xl border border-white/10 bg-white/5">
              <h3 className="text-xl font-bold mb-4 text-center">Continuous Monitoring Schedule</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-white">Daily:</strong>
                  <span className="text-white/70"> Funnel performance monitoring and alert management</span>
                </div>
                <div>
                  <strong className="text-white">Weekly:</strong>
                  <span className="text-white/70"> Conversion trend analysis and bottleneck identification</span>
                </div>
                <div>
                  <strong className="text-white">Bi-weekly:</strong>
                  <span className="text-white/70"> Optimization experiment design and implementation</span>
                </div>
                <div>
                  <strong className="text-white">Monthly:</strong>
                  <span className="text-white/70"> Comprehensive funnel health reports and stakeholder reviews</span>
                </div>
                <div className="md:col-span-2">
                  <strong className="text-white">Quarterly:</strong>
                  <span className="text-white/70"> Funnel strategy evaluation and governance framework updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Integration Section */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Connected Platform
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Marketing Site */}
              <div className="text-center p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-bold mb-2">Marketing Site</h3>
                <p className="text-sm text-white/60 mb-4">audiojones.com</p>
                <p className="text-white/70">
                  Public-facing content, service pages, and lead generation
                </p>
              </div>

              {/* Client Portal */}
              <div className="text-center p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-bold mb-2">Client Portal</h3>
                <p className="text-sm text-white/60 mb-4">client.audiojones.com</p>
                <p className="text-white/70">
                  Project management, bookings, asset delivery, and status updates
                </p>
                <Link
                  href={portalLinks.client}
                  className="mt-4 inline-block text-sm font-semibold text-[#FF4500] hover:text-[#FFD700] transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Access Portal →
                </Link>
              </div>

              {/* Admin Portal */}
              <div className="text-center p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className="text-xl font-bold mb-2">Admin Portal</h3>
                <p className="text-sm text-white/60 mb-4">admin.audiojones.com</p>
                <p className="text-white/70">
                  Multi-tenant management, service configuration, and automation controls
                </p>
                <Link
                  href={portalLinks.admin}
                  className="mt-4 inline-block text-sm font-semibold text-[#FF4500] hover:text-[#FFD700] transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Admin Access →
                </Link>
              </div>
            </div>

            {/* Billing Integration Note */}
            <div className="mt-12 p-6 rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/5 text-center">
              <p className="text-white/80">
                <strong>Unified Billing:</strong> All modules integrate with Whop and Stripe for seamless subscription management.
                {/* TODO: Add specific Whop checkout URLs once product mappings are finalized */}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Book a session to see how our integrated systems can transform your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={getBookingUrl()}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] text-black font-bold text-lg hover:opacity-90 transition"
              >
                Book a Session
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
