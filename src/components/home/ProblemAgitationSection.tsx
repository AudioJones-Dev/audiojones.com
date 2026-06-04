// Problem/Agitation Section - Addresses creator pain points
export default function ProblemAgitationSection() {
  const problems = [
    {
      icon: "😤",
      title: "Content That Doesn't Convert",
      description: "You're creating amazing content but struggling to turn viewers into paying customers."
    },
    {
      icon: "⏰",
      title: "Manual Marketing Mayhem", 
      description: "Spending 80% of your time on marketing tasks instead of creating what you love."
    },
    {
      icon: "📉",
      title: "Inconsistent Revenue",
      description: "Income fluctuates wildly because you don't have systematic, predictable processes."
    },
    {
      icon: "🔧",
      title: "Tech Stack Chaos",
      description: "Your tools don't talk to each other, creating gaps where leads and revenue leak."
    }
  ];

  return (
    <section className="py-20 bg-surface-1">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Stop Leaving Money on the Table
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Most creators are stuck in the <span className="text-signal-yellow font-semibold">content creation hamster wheel</span>.
            You're talented, but your systems aren't working as hard as you are.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="bg-black/50 border border-red-900/30 rounded-xl p-6 text-center hover:border-signal-yellow/50 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{problem.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-3">{problem.title}</h3>
              <p className="text-text-muted text-sm">{problem.description}</p>
            </div>
          ))}
        </div>

        {/* Agitation CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-text-muted mb-6">
            <span className="text-signal-yellow font-semibold">Sound familiar?</span> You're not alone.
            But there's a better way to build your creator business.
          </p>
          <div className="inline-block bg-gradient-to-r from-[#E8FF5A] to-[#4DACFF] p-1 rounded-lg">
            <div className="bg-black px-6 py-3 rounded-lg">
              <span className="text-white font-medium">
                Let's fix this mess. Here's how ↓
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}