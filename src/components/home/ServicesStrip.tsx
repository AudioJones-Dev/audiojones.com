export default function ServicesStrip() {
  const services = [
    {
      title: "Entity-Based Content Architecture",
      benefits: [
        "Content structured for AI understanding",
        "Better semantic search visibility"
      ]
    },
    {
      title: "AI-Snippet / Answer Engine Optimization",
      benefits: [
        "Optimized for ChatGPT, Perplexity, Bard responses",
        "Featured snippet dominance"
      ]
    },
    {
      title: "Local GBP Growth (Miami, Doral, Ft. Lauderdale, Ft. Myers)",
      benefits: [
        "Google Business Profile optimization",
        "Local search authority building"
      ]
    },
    {
      title: "Automation-Ready Landing Pages",
      benefits: [
        "High-converting page templates",
        "Integrated with marketing automation"
      ]
    }
  ]

  return (
    <section id="services" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            AI-SEO & AEO Services for{" "}
            <span className="text-[#F0FF85]">2026+</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Built to win in AI search, not just Google SERPs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-black/50 border border-gray-800 rounded-xl p-6 hover:border-[#008080]/50 transition-colors duration-300"
            >
              <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                {service.title}
              </h3>
              
              <ul className="space-y-2 mb-6">
                {service.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="text-gray-300 text-sm flex items-start">
                    <span className="text-[#008080] mr-2 mt-1">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>

              <button className="w-full bg-[#008080]/10 hover:bg-[#008080]/20 text-[#008080] border border-[#008080]/30 hover:border-[#008080]/50 px-4 py-3 rounded-lg font-medium transition-colors duration-200">
                Add to Build Sheet
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}