import { Metadata } from "next";
import Link from "next/link";
import { getModuleById } from "@/config/modules";
import { portalLinks, getBookingUrl } from "@/config/links";

const pageModule = getModuleById("data-intelligence")!;

export const metadata: Metadata = {
  title: "Data Intelligence System | Audio Jones",
  description: "Comprehensive analytics, custom dashboards, and data-driven insights for strategic decision making.",
  keywords: ["data intelligence", "analytics", "dashboards", "data insights", "business intelligence"],
};

export default function DataIntelligenceSystemPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Module Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#4169E1]/20 border border-[#4169E1]/30 mb-8">
              <div className="w-2 h-2 bg-[#4169E1] rounded-full animate-pulse mr-3"></div>
              <span className="text-sm font-medium text-[#4169E1]">System Module</span>
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
                      Clients access their analytics at <strong>client.audiojones.com</strong> to:
                    </p>
                    <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                      <li>View custom dashboards tailored to their goals</li>
                      <li>Track performance metrics in real-time</li>
                      <li>Access detailed reports and trend analysis</li>
                      <li>Download data exports and visualizations</li>
                      <li>Set up custom alerts for key metrics</li>
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
                      <li>Configure data pipelines and collection rules</li>
                      <li>Manage cross-client analytics and benchmarks</li>
                      <li>Create custom dashboard templates</li>
                      <li>Monitor data quality and completeness</li>
                      <li>Set up automated reporting schedules</li>
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
                      <li>Monthly analytics and dashboard subscriptions</li>
                      <li>Advanced reporting packages</li>
                      <li>Custom data warehouse access</li>
                      <li>API access for data integrations</li>
                    </ul>
                    {/* TODO: Add specific Whop/Stripe checkout URLs for analytics packages */}
                    <p className="mt-4 text-sm text-white/50">
                      <em>Checkout integration: Links to be added for data intelligence packages</em>
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
              {/* Step 1: Data Collection */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">📥</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#4169E1]">1. Data Collection</h3>
                  <p className="text-white/70">
                    Aggregate data from all integrated sources: marketing platforms (MailerLite, social channels), sales systems (Whop, Stripe), customer touchpoints (website, portal logins), and operational tools (n8n workflows). Set up automated collection schedules and real-time event streaming.
                  </p>
                </div>
              </div>

              {/* Step 2: Data Processing */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">🔧</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#4169E1]">2. Data Processing</h3>
                  <p className="text-white/70">
                    ETL pipelines via n8n clean, validate, and transform raw data. Deduplicate records, normalize schemas, handle missing values, and enrich with external data sources. Store processed data in centralized warehouse (Google Sheets for rapid prototyping, BigQuery for scale).
                  </p>
                </div>
              </div>

              {/* Step 3: Analysis & Modeling */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">📊</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#4169E1]">3. Analysis & Modeling</h3>
                  <p className="text-white/70">
                    Run automated analysis jobs: cohort analysis, trend detection, anomaly identification, and predictive modeling. Calculate business metrics (CAC, LTV, churn, conversion funnels) and segment performance by client, campaign, and time period.
                  </p>
                </div>
              </div>

              {/* Step 4: Insights & Reporting */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">📝</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#4169E1]">4. Insights & Reporting</h3>
                  <p className="text-white/70">
                    Generate actionable insights via automated reports. Surface key findings, trend alerts, and optimization recommendations. Create executive summaries with drill-down capabilities. Schedule weekly/monthly report distribution via email or portal notifications.
                  </p>
                </div>
              </div>

              {/* Step 5: Visualization & Dashboards */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">📊</div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#4169E1]">5. Visualization & Dashboards</h3>
                  <p className="text-white/70">
                    Build custom dashboards in Google Data Studio (Looker Studio) with real-time data refresh. Create interactive visualizations (charts, tables, heatmaps) tailored to client goals. Enable self-service analytics with configurable filters and drill-through navigation.
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
              {/* Google Sheets */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">📄</div>
                <h3 className="text-xl font-bold mb-2">Google Sheets</h3>
                <p className="text-white/70">
                  <strong>Role:</strong> Rapid data prototyping, collaborative analysis, lightweight ETL target
                </p>
              </div>

              {/* Data Studio (Looker Studio) */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Data Studio</h3>
                <p className="text-white/70">
                  <strong>Role:</strong> Custom dashboards, interactive visualizations, real-time reporting
                </p>
              </div>

              {/* n8n ETL */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-bold mb-2">n8n ETL</h3>
                <p className="text-white/70">
                  <strong>Role:</strong> Data pipeline orchestration, scheduled jobs, multi-source aggregation
                </p>
              </div>

              {/* Firebase/BigQuery */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">🗄️</div>
                <h3 className="text-xl font-bold mb-2">Firebase/BigQuery</h3>
                <p className="text-white/70">
                  <strong>Role:</strong> Data warehouse, SQL analytics, scalable data storage
                </p>
              </div>

              {/* MailerLite/Whop APIs */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">🔌</div>
                <h3 className="text-xl font-bold mb-2">MailerLite/Whop APIs</h3>
                <p className="text-white/70">
                  <strong>Role:</strong> Source system integrations for marketing and sales data
                </p>
              </div>

              {/* Client Portal */}
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-2">Client Portal</h3>
                <p className="text-white/70">
                  <strong>Role:</strong> Embedded dashboards, report downloads, self-service analytics
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
              {/* Data Quality Score */}
              <div className="p-6 rounded-xl border border-[#4169E1]/30 bg-[#4169E1]/10 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-xl font-bold mb-2 text-[#4169E1]">Data Quality Score</h3>
                <p className="text-white/70 text-sm">
                  Completeness, accuracy, consistency, and timeliness of data across sources
                </p>
              </div>

              {/* Reporting Timeliness */}
              <div className="p-6 rounded-xl border border-[#4169E1]/30 bg-[#4169E1]/10 text-center">
                <div className="text-4xl mb-3">⏱️</div>
                <h3 className="text-xl font-bold mb-2 text-[#4169E1]">Reporting Timeliness</h3>
                <p className="text-white/70 text-sm">
                  Data freshness, dashboard refresh rates, report delivery SLAs
                </p>
              </div>

              {/* Insight Accuracy */}
              <div className="p-6 rounded-xl border border-[#4169E1]/30 bg-[#4169E1]/10 text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-bold mb-2 text-[#4169E1]">Insight Accuracy</h3>
                <p className="text-white/70 text-sm">
                  Validation rate of predictions, forecast error margins, alert precision
                </p>
              </div>

              {/* Dashboard Adoption */}
              <div className="p-6 rounded-xl border border-[#4169E1]/30 bg-[#4169E1]/10 text-center">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2 text-[#4169E1]">Dashboard Adoption</h3>
                <p className="text-white/70 text-sm">
                  User engagement rates, dashboard views, self-service usage metrics
                </p>
              </div>

              {/* Pipeline Reliability */}
              <div className="p-6 rounded-xl border border-[#4169E1]/30 bg-[#4169E1]/10 text-center">
                <div className="text-4xl mb-3">🔧</div>
                <h3 className="text-xl font-bold mb-2 text-[#4169E1]">Pipeline Reliability</h3>
                <p className="text-white/70 text-sm">
                  ETL job success rates, error recovery time, data processing latency
                </p>
              </div>

              {/* Business Impact */}
              <div className="p-6 rounded-xl border border-[#4169E1]/30 bg-[#4169E1]/10 text-center">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="text-xl font-bold mb-2 text-[#4169E1]">Business Impact</h3>
                <p className="text-white/70 text-sm">
                  Decisions driven by insights, cost savings from optimizations, ROI of analytics
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
              Intelligence Pipeline
            </h2>

            <div className="grid md:grid-cols-5 gap-4">
              {/* Step 1: Collect */}
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-[#4169E1]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
                <div className="p-6 rounded-xl border border-[#4169E1]/30 bg-[#4169E1]/10 text-center h-full">
                  <div className="text-4xl mb-3">📥</div>
                  <h3 className="text-lg font-bold mb-2 text-[#4169E1]">1. Collect</h3>
                  <p className="text-sm text-white/70">
                    Gather data from all sources
                  </p>
                </div>
              </div>

              {/* Step 2: Process */}
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-[#4169E1]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
                <div className="p-6 rounded-xl border border-[#4169E1]/30 bg-[#4169E1]/10 text-center h-full">
                  <div className="text-4xl mb-3">⚙️</div>
                  <h3 className="text-lg font-bold mb-2 text-[#4169E1]">2. Process</h3>
                  <p className="text-sm text-white/70">
                    Clean and transform data
                  </p>
                </div>
              </div>

              {/* Step 3: Analyze */}
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-[#4169E1]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
                <div className="p-6 rounded-xl border border-[#4169E1]/30 bg-[#4169E1]/10 text-center h-full">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="text-lg font-bold mb-2 text-[#4169E1]">3. Analyze</h3>
                  <p className="text-sm text-white/70">
                    Extract patterns and insights
                  </p>
                </div>
              </div>

              {/* Step 4: Visualize */}
              <div className="relative">
                <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-full -translate-y-1/2 z-10">
                  <svg className="w-4 h-4 text-[#4169E1]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
                <div className="p-6 rounded-xl border border-[#4169E1]/30 bg-[#4169E1]/10 text-center h-full">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="text-lg font-bold mb-2 text-[#4169E1]">4. Visualize</h3>
                  <p className="text-sm text-white/70">
                    Create dashboards and reports
                  </p>
                </div>
              </div>

              {/* Step 5: Act */}
              <div className="p-6 rounded-xl border border-[#4169E1]/30 bg-[#4169E1]/10 text-center h-full">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-lg font-bold mb-2 text-[#4169E1]">5. Act</h3>
                <p className="text-sm text-white/70">
                  Make informed decisions
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
              Transform Data Into Action
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Book a session to see how comprehensive analytics can drive your growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={getBookingUrl()}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#4169E1] to-[#00CED1] text-white font-bold text-lg hover:opacity-90 transition"
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
