export default function HomeHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <div className="inline-block">
              <span className="text-signal-yellow text-sm font-medium tracking-wide uppercase bg-signal-yellow/10 px-3 py-1 rounded-full">
                AI-Driven Marketing & Automation
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Build a brand system that{" "}
              <span className="text-signal-yellow">actually converts</span>.
            </h1>

            {/* Subtext */}
            <p className="text-xl text-text-muted leading-relaxed max-w-2xl">
              We help creators, consultants, and service businesses connect content → automations → revenue using AI, Whop, and Google Business Ultra.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-signal-yellow hover:bg-signal-soft text-black font-semibold rounded-lg transition-colors duration-200"
              >
                Request Growth Call
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white font-semibold rounded-lg transition-colors duration-200"
              >
                View Services
              </a>
            </div>
          </div>

          {/* Right Column - Portrait */}
          <div className="flex justify-center lg:justify-end">
            <div className="mx-auto mt-8 aspect-square w-full max-w-[560px] rounded-3xl bg-[#0c0c0c] p-4 ring-1 ring-white/10">
              <img
                src="/assets/Backgrounds/aj-hero-portrait.webp"
                alt="Audio Jones portrait"
                className="h-full w-full rounded-2xl object-cover object-center"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}