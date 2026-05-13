export default function PackagesSection() {
  return (
    <section className="relative bg-[#000000] py-20 px-4 sm:px-6 lg:px-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60">Packages</p>
          <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Choose Your Growth Trajectory
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="border border-white/10 rounded-lg p-8 flex flex-col">
            <div className="flex-grow">
              <h3 className="text-2xl font-bold">Starter: Brand Foundation</h3>
              <p className="text-4xl font-extrabold my-6">$1,497</p>
              <p className="text-white/70 mb-8">
                One-time project to define your brand, audience, and core message. Perfect for new creators.
              </p>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>Brand Strategy Workshop</span>
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>Audience Persona Development</span>
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>Content Pillar Identification</span>
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>Basic Media Kit</span>
                </li>
              </ul>
            </div>
            <a 
              href="/book" 
              className="mt-8 block w-full text-center rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition"
            >
              Get Started
            </a>
          </div>

          {/* Growth (Most Popular) */}
          <div className="border border-[#E8FF5A]/50 rounded-lg p-8 flex flex-col relative overflow-hidden ring-2 ring-[#E8FF5A]/50 shadow-2xl shadow-[#E8FF5A]/10">
            <div className="absolute top-0 right-0 -mr-1 mt-1">
              <div className="inline-flex items-center text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] rounded-bl-lg">
                Most Popular
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-bold">Growth: Content Engine Monthly</h3>
              <p className="text-4xl font-extrabold my-6">
                $2,497<span className="text-base font-medium text-white/50">/mo</span>
              </p>
              <p className="text-white/70 mb-8">
                Full-service podcast production and content repurposing to fuel your brand's growth.
              </p>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>4 Podcast Episodes/Month</span>
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>AI-Powered Content Repurposing</span>
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>Social Media Clip Creation</span>
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>Monthly Strategy &amp; Analytics</span>
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>Guest Outreach &amp; Coordination</span>
                </li>
              </ul>
            </div>
            <a 
              href="/book" 
              className="mt-8 block w-full text-center rounded-full px-6 py-3 text-sm font-bold text-black bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] hover:opacity-90 transition"
            >
              Start Growing
            </a>
          </div>

          {/* Scale */}
          <div className="border border-white/10 rounded-lg p-8 flex flex-col">
            <div className="flex-grow">
              <h3 className="text-2xl font-bold">Scale: AI Marketing Partner</h3>
              <p className="text-4xl font-extrabold my-6">$4,997</p>
              <p className="text-white/70 mb-8">
                A fully integrated partnership to scale your brand with cutting-edge AI marketing strategies.
              </p>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>Everything in Growth, plus:</span>
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>AI-Driven Ad Campaigns</span>
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>Personalized Email Automation</span>
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>Advanced Performance Analytics</span>
                </li>
                <li className="flex items-center gap-x-3">
                  <span className="text-[#E8FF5A]">✓</span>
                  <span>Dedicated Brand Strategist</span>
                </li>
              </ul>
            </div>
            <a 
              href="/book" 
              className="mt-8 block w-full text-center rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition"
            >
              Book a Discovery Call
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-white/50">
          On-site recording available at 13700 NW 1st Ave, Miami, FL 33168.
        </p>
      </div>
    </section>
  );
}