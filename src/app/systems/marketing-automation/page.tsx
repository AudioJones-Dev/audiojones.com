import { Metadata } from "next";
import Link from "next/link";
import { getModuleById } from "@/config/modules";
import { portalLinks, getBookingUrl } from "@/config/links";

const pageModule = getModuleById("marketing-automation")!;

export const metadata: Metadata = {
  title: "Marketing Automation System | Audio Jones",
  description: "AI-powered marketing automation with intelligent content distribution, social media management, and multi-channel campaigns.",
  keywords: ["marketing automation", "content distribution", "social media automation", "campaign management", "ai marketing"],
};

export default function MarketingAutomationSystemPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Module Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#FF4500]/20 border border-[#FF4500]/30 mb-8">
              <div className="w-2 h-2 bg-[#FF4500] rounded-full animate-pulse mr-3"></div>
              <span className="text-sm font-medium text-[#FF4500]">System Module</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className={`bg-gradient-to-r from-[${pageModule.gradient.from}] to-[${pageModule.gradient.to}] bg-clip-text text-transparent`}>
                {pageModule.name}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              {pageModule.tagline}
            </p>

            {/* Description */}
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-white/70 leading-relaxed">
                {pageModule.shortDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How This Connects Section */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How This Connects
            </h2>

            <div className="space-y-8">
              {/* Client Portal Integration */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">👤</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Client Portal Integration</h3>
                    <p className="text-white/70 mb-4">
                      Clients manage their marketing campaigns at <strong>client.audiojones.com</strong> to:
                    </p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                      <li>Review and approve automated content calendars</li>
                      <li>Monitor campaign performance in real-time</li>
                      <li>Upload assets for automated distribution</li>
                      <li>Track engagement metrics across all channels</li>
                      <li>Schedule and manage paid campaign budgets</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Admin Portal Integration */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">⚙️</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Admin Portal Integration</h3>
                    <p className="text-white/70 mb-4">
                      Team members use <strong>admin.audiojones.com</strong> to:
                    </p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                      <li>Configure automation rules and campaign templates</li>
                      <li>Manage multi-tenant client marketing accounts</li>
                      <li>Set up AI content generation and distribution rules</li>
                      <li>Monitor system-wide campaign performance</li>
                      <li>Configure integrations with social platforms and email services</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Billing Integration */}
              <div className="p-6 rounded-xl border border-[#FFD700]/20 bg-[#FFD700]/5">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💳</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Billing Integration</h3>
                    <p className="text-white/70 mb-4">
                      Seamlessly integrated with Whop and Stripe for:
                    </p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                      <li>Monthly marketing automation subscriptions</li>
                      <li>Campaign-specific service packages</li>
                      <li>Usage-based billing for ad spend and distribution</li>
                      <li>Add-on services for enhanced targeting</li>
                    </ul>
                    {/* TODO: Add specific Whop/Stripe checkout URLs for marketing packages */}
                    <p className="mt-4 text-sm text-white/50">
                      <em>Checkout integration: Links to be added for marketing automation packages</em>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How This Module Works Section */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How This Module Works
            </h2>
            
            <div className="space-y-6">
              {/* Step 1: Lead Generation */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">🎯</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#FF4500]">1. Lead Generation</h3>
                  <p className="text-white/70">
                    Capture leads across multiple touchpoints (landing pages, social media, email campaigns) and automatically route them into MailerLite segments. Track source attribution and campaign performance in real-time.
                  </p>
                </div>
              </div>

              {/* Step 2: Segmentation */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">🎛️</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#FF4500]">2. Segmentation</h3>
                  <p className="text-white/70">
                    AI-powered segmentation engine analyzes lead behavior, engagement patterns, and firmographic data to create dynamic audience groups. Automatically update segments based on real-time interactions.
                  </p>
                </div>
              </div>

              {/* Step 3: Campaign Execution */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">🚀</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#FF4500]">3. Campaign Execution</h3>
                  <p className="text-white/70">
                    Deploy multi-channel campaigns with automated content personalization. Schedule email sequences, social posts, and paid ads from a unified calendar with optimal send-time optimization.
                  </p>
                </div>
              </div>

              {/* Step 4: Performance Tracking */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">📊</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#FF4500]">4. Performance Tracking</h3>
                  <p className="text-white/70">
                    Monitor engagement metrics (opens, clicks, conversions) across all channels. Track lead progression through funnel stages and identify high-performing content and messaging.
                  </p>
                </div>
              </div>

              {/* Step 5: ROI Analysis */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">💰</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#FF4500]">5. ROI Analysis</h3>
                  <p className="text-white/70">
                    Tie marketing spend to revenue outcomes via Whop purchase data. Calculate customer acquisition costs (CAC), return on marketing investment (ROMI), and lifetime value (LTV) at campaign level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Technology Stack
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* MailerLite */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">📧</div>
                <h3 className="text-xl font-bold mb-2">MailerLite</h3>
                <p className="text-white/70">
                  <strong>Role:</strong> Email marketing automation, subscriber management, campaign analytics
                </p>
              </div>

              {/* Whop */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-bold mb-2">Whop</h3>
                <p className="text-white/70">
                  <strong>Role:</strong> Payment processing, customer lifecycle tracking, revenue attribution
                </p>
              </div>

              {/* n8n */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-bold mb-2">n8n</h3>
                <p className="text-white/70">
                  <strong>Role:</strong> Workflow orchestration, multi-platform integrations, automated lead routing
                </p>
              </div>

              {/* Social Platforms */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-bold mb-2">Social Platforms</h3>
                <p className="text-white/70">
                  <strong>Role:</strong> Multi-channel distribution (LinkedIn, Twitter, Instagram), paid ad management
                </p>
              </div>

              {/* AI Content Engine */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2">AI Content Engine</h3>
                <p className="text-white/70">
                  <strong>Role:</strong> Automated content generation, personalization, A/B test creation
                </p>
              </div>

              {/* Client Portal */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-2">Client Portal</h3>
                <p className="text-white/70">
                  <strong>Role:</strong> Campaign dashboard, content approval workflows, real-time analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What We Measure Section */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What We Measure
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Conversion Rate */}
              <div className="p-6 rounded-xl border border-[#FF4500]/30 bg-[#FF4500]/10 text-center">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="text-xl font-bold mb-2 text-[#FF4500]">Conversion Rate</h3>
                <p className="text-white/70 text-sm">
                  Lead-to-customer conversion percentage across all campaign touchpoints
                </p>
              </div>

              {/* MQLs Generated */}
              <div className="p-6 rounded-xl border border-[#FF4500]/30 bg-[#FF4500]/10 text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-bold mb-2 text-[#FF4500]">MQLs Generated</h3>
                <p className="text-white/70 text-sm">
                  Marketing-qualified leads meeting engagement and fit criteria
                </p>
              </div>

              {/* CAC */}
              <div className="p-6 rounded-xl border border-[#FF4500]/30 bg-[#FF4500]/10 text-center">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="text-xl font-bold mb-2 text-[#FF4500]">CAC</h3>
                <p className="text-white/70 text-sm">
                  Customer acquisition cost per channel and campaign
                </p>
              </div>

              {/* ROMI */}
              <div className="p-6 rounded-xl border border-[#FF4500]/30 bg-[#FF4500]/10 text-center">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2 text-[#FF4500]">ROMI</h3>
                <p className="text-white/70 text-sm">
                  Return on marketing investment with revenue attribution
                </p>
              </div>

              {/* Email Engagement */}
              <div className="p-6 rounded-xl border border-[#FF4500]/30 bg-[#FF4500]/10 text-center">
                <div className="text-4xl mb-3">📧</div>
                <h3 className="text-xl font-bold mb-2 text-[#FF4500]">Email Engagement</h3>
                <p className="text-white/70 text-sm">
                  Open rates, click rates, and sequence completion metrics
                </p>
              </div>

              {/* Multi-Touch Attribution */}
              <div className="p-6 rounded-xl border border-[#FF4500]/30 bg-[#FF4500]/10 text-center">
                <div className="text-4xl mb-3">🔗</div>
                <h3 className="text-xl font-bold mb-2 text-[#FF4500]">Multi-Touch Attribution</h3>
                <p className="text-white/70 text-sm">
                  Revenue credit distribution across campaign touchpoints
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Section */}
      <div className="py-20 border-t border-white/10 bg-gradient-to-b from-transparent to-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Automation Pipeline
            </h2>

            <div className="grid md:grid-cols-5 gap-4">
              {/* Step 1: Strategy */}
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-[#FF4500]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
                <div className="p-6 rounded-xl border border-[#FF4500]/30 bg-[#FF4500]/10 text-center h-full">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="text-lg font-bold mb-2 text-[#FF4500]">1. Strategy</h3>
                  <p className="text-sm text-white/70">
                    AI analyzes audience and goals
                  </p>
                </div>
              </div>

              {/* Step 2: Create */}
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-[#FF4500]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
                <div className="p-6 rounded-xl border border-[#FF4500]/30 bg-[#FF4500]/10 text-center h-full">
                  <div className="text-4xl mb-3">✍️</div>
                  <h3 className="text-lg font-bold mb-2 text-[#FF4500]">2. Create</h3>
                  <p className="text-sm text-white/70">
                    Content generation and optimization
                  </p>
                </div>
              </div>

              {/* Step 3: Schedule */}
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-[#FF4500]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
                <div className="p-6 rounded-xl border border-[#FF4500]/30 bg-[#FF4500]/10 text-center h-full">
                  <div className="text-4xl mb-3">📅</div>
                  <h3 className="text-lg font-bold mb-2 text-[#FF4500]">3. Schedule</h3>
                  <p className="text-sm text-white/70">
                    Optimal timing across channels
                  </p>
                </div>
              </div>

              {/* Step 4: Distribute */}
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-[#FF4500]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
                <div className="p-6 rounded-xl border border-[#FF4500]/30 bg-[#FF4500]/10 text-center h-full">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="text-lg font-bold mb-2 text-[#FF4500]">4. Distribute</h3>
                  <p className="text-sm text-white/70">
                    Multi-channel deployment
                  </p>
                </div>
              </div>

              {/* Step 5: Optimize */}
              <div className="p-6 rounded-xl border border-[#FF4500]/30 bg-[#FF4500]/10 text-center h-full">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="text-lg font-bold mb-2 text-[#FF4500]">5. Optimize</h3>
                <p className="text-sm text-white/70">
                  Real-time performance tuning
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Automate Your Marketing
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Book a session to see how AI can transform your marketing distribution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={getBookingUrl()}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] text-black font-bold text-lg hover:opacity-90 transition"
              >
                Book a Session
              </Link>
              <Link
                href={portalLinks.client}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-bold text-lg hover:border-white/40 transition"
              >
                Visit Client Portal →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
