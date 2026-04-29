import { Metadata } from "next";
import Link from "next/link";
import { getModuleById } from "@/config/modules";
import { portalLinks, getBookingUrl } from "@/config/links";

const pageModule = getModuleById("client-delivery")!;

export const metadata: Metadata = {
  title: "Client Delivery System | Audio Jones",
  description: "Streamlined project management with real-time tracking, automated reporting, and transparent client communication.",
  keywords: ["client delivery", "project management", "client portal", "progress tracking", "automated reporting"],
};

export default function ClientDeliverySystemPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Module Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#008080]/20 border border-[#008080]/30 mb-8">
              <div className="w-2 h-2 bg-[#008080] rounded-full animate-pulse mr-3"></div>
              <span className="text-sm font-medium text-[#008080]">System Module</span>
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
                      Clients access their project dashboard at <strong>client.audiojones.com</strong> to:
                    </p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                      <li>View real-time project status and milestones</li>
                      <li>Download delivered assets and reports</li>
                      <li>Schedule follow-up sessions</li>
                      <li>Communicate directly with your team</li>
                      <li>Access booking calendar and payment history</li>
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
                      <li>Manage multi-tenant client accounts and permissions</li>
                      <li>Configure service templates and delivery workflows</li>
                      <li>Monitor project pipeline and resource allocation</li>
                      <li>Automate status notifications and reporting</li>
                      <li>Track SLAs and service level compliance</li>
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
                      <li>Subscription-based project packages</li>
                      <li>One-time project bookings</li>
                      <li>Automated invoicing and payment tracking</li>
                      <li>Service upgrades and add-ons</li>
                    </ul>
                    {/* TODO: Add specific Whop/Stripe checkout URLs for project packages */}
                    <p className="mt-4 text-sm text-white/50">
                      <em>Checkout integration: Links to be added for specific project packages</em>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How This Module Works */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              How This Module Works
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5">
                <div className="text-2xl">📝</div>
                <div>
                  <h3 className="font-bold mb-1">Client Onboarding & Requirements Gathering</h3>
                  <p className="text-white/70 text-sm">Automated intake forms collect project specs, deliverable expectations, and timeline requirements</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5">
                <div className="text-2xl">📅</div>
                <div>
                  <h3 className="font-bold mb-1">Project Planning & Milestone Setup</h3>
                  <p className="text-white/70 text-sm">Automated scheduling based on service templates with milestone tracking and deadline management</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5">
                <div className="text-2xl">👥</div>
                <div>
                  <h3 className="font-bold mb-1">Resource Allocation & Team Assignment</h3>
                  <p className="text-white/70 text-sm">Smart task distribution to team members based on capacity and expertise</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5">
                <div className="text-2xl">📊</div>
                <div>
                  <h3 className="font-bold mb-1">Progress Tracking & Status Updates</h3>
                  <p className="text-white/70 text-sm">Real-time dashboards for clients and team with automated notification triggers</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5">
                <div className="text-2xl">✅</div>
                <div>
                  <h3 className="font-bold mb-1">Delivery & Quality Assurance</h3>
                  <p className="text-white/70 text-sm">Asset delivery with client approval workflows and satisfaction surveys</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="py-20 border-t border-white/10 bg-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Technology Stack
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-white/10 bg-black">
                <h3 className="font-bold mb-2">Whop</h3>
                <p className="text-white/70 text-sm">Payment processing triggers automated contract generation and project setup</p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-black">
                <h3 className="font-bold mb-2">GBU (GetBizUp)</h3>
                <p className="text-white/70 text-sm">Digital contract creation and e-signature management</p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-black">
                <h3 className="font-bold mb-2">MailerLite</h3>
                <p className="text-white/70 text-sm">Automated onboarding emails, milestone notifications, and review requests</p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-black">
                <h3 className="font-bold mb-2">n8n</h3>
                <p className="text-white/70 text-sm">Workflow automation connecting payment → contracts → onboarding → delivery</p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-black">
                <h3 className="font-bold mb-2">Firebase</h3>
                <p className="text-white/70 text-sm">Real-time database for project status, file storage, and client portal access</p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-black">
                <h3 className="font-bold mb-2">Client Portal</h3>
                <p className="text-white/70 text-sm">Custom Next.js dashboard at client.audiojones.com for project visibility</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs We Track */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              What We Measure
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">⏱️</div>
                <h3 className="font-bold mb-2">On-Time Completion Rate</h3>
                <p className="text-white/70 text-sm">Projects delivered within agreed timeline</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">😊</div>
                <h3 className="font-bold mb-2">Client Satisfaction (CSAT)</h3>
                <p className="text-white/70 text-sm">Post-delivery feedback scores</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="font-bold mb-2">Resource Utilization</h3>
                <p className="text-white/70 text-sm">Team capacity and efficiency metrics</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-bold mb-2">Budget Adherence</h3>
                <p className="text-white/70 text-sm">Actual vs. estimated project costs</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="font-bold mb-2">Time-to-Delivery</h3>
                <p className="text-white/70 text-sm">Booking to first deliverable speed</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🔄</div>
                <h3 className="font-bold mb-2">Client Retention Rate</h3>
                <p className="text-white/70 text-sm">Repeat bookings within 90 days</p>
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
              Delivery Pipeline
            </h2>

            <div className="grid md:grid-cols-5 gap-4">
              {/* Step 1: Book */}
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-[#008080]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
                <div className="p-6 rounded-xl border border-[#008080]/30 bg-[#008080]/10 text-center h-full">
                  <div className="text-4xl mb-3">📅</div>
                  <h3 className="text-lg font-bold mb-2 text-[#008080]">1. Book</h3>
                  <p className="text-sm text-white/70">
                    Client schedules session through portal
                  </p>
                </div>
              </div>

              {/* Step 2: Onboard */}
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-[#008080]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
                <div className="p-6 rounded-xl border border-[#008080]/30 bg-[#008080]/10 text-center h-full">
                  <div className="text-4xl mb-3">📋</div>
                  <h3 className="text-lg font-bold mb-2 text-[#008080]">2. Onboard</h3>
                  <p className="text-sm text-white/70">
                    Automated intake and project setup
                  </p>
                </div>
              </div>

              {/* Step 3: Execute */}
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-[#008080]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
                <div className="p-6 rounded-xl border border-[#008080]/30 bg-[#008080]/10 text-center h-full">
                  <div className="text-4xl mb-3">⚡</div>
                  <h3 className="text-lg font-bold mb-2 text-[#008080]">3. Execute</h3>
                  <p className="text-sm text-white/70">
                    Real-time progress tracking
                  </p>
                </div>
              </div>

              {/* Step 4: Deliver */}
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-[#008080]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
                <div className="p-6 rounded-xl border border-[#008080]/30 bg-[#008080]/10 text-center h-full">
                  <div className="text-4xl mb-3">📦</div>
                  <h3 className="text-lg font-bold mb-2 text-[#008080]">4. Deliver</h3>
                  <p className="text-sm text-white/70">
                    Asset delivery and client approval
                  </p>
                </div>
              </div>

              {/* Step 5: Follow-Up */}
              <div className="p-6 rounded-xl border border-[#008080]/30 bg-[#008080]/10 text-center h-full">
                <div className="text-4xl mb-3">🔄</div>
                <h3 className="text-lg font-bold mb-2 text-[#008080]">5. Follow-Up</h3>
                <p className="text-sm text-white/70">
                  Feedback collection and next steps
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
              Experience Seamless Delivery
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Book a session to see how our Client Delivery System keeps your projects on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={getBookingUrl()}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#008080] to-[#00CED1] text-white font-bold text-lg hover:opacity-90 transition"
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
