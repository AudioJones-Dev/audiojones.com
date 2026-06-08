export default function ModulesShowcase() {
  const modules = [
    {
      title: "Marketing Automation Module",
      purpose: "MailerLite, Beacon AI, n8n workflows for lead nurturing",
      icon: "🤖"
    },
    {
      title: "Client Delivery Module",
      purpose: "GBU → Notion seamless client onboarding",
      icon: "🚀"
    },
    {
      title: "Data Intelligence Module",
      purpose: "Sheets → Data Studio analytics and reporting",
      icon: "📊"
    },
    {
      title: "AI Optimization Module",
      purpose: "Adaptive/personalized offers and content optimization",
      icon: "⚡"
    }
  ]

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Your brand runs on{" "}
            <span className="text-[#008080]">4 modules</span>
          </h2>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {modules.map((module, index) => (
            <div
              key={index}
              className="bg-black/50 border border-gray-800 rounded-xl p-6 hover:border-[#008080]/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Icon */}
              <div className="text-4xl mb-4 text-center">
                {module.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-4 text-center leading-tight">
                {module.title}
              </h3>
              
              {/* Purpose */}
              <p className="text-gray-300 text-sm text-center mb-6 leading-relaxed">
                {module.purpose}
              </p>

              {/* Link */}
              <div className="text-center">
                <a
                  href="/founder-intelligence-system"
                  className="inline-flex items-center text-[#008080] hover:text-[#FFD700] font-medium text-sm transition-colors duration-200"
                >
                  Learn More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <a
            href="/founder-intelligence-system"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#008080] hover:bg-[#008080]/90 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Explore All Systems
          </a>
        </div>
      </div>
    </section>
  )
}