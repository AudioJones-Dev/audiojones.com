export default function RealBlockersSection() {
  return (
    <section 
      className="relative py-16 sm:py-20 lg:py-24 text-white"
      style={{
        backgroundImage: "url('https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(10).png?updatedAt=1761600050213')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-signal-yellow">
            The Real Blockers
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            Consistency beats virality.
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-text-muted leading-relaxed">
            Publish weekly, grow steadily. Many leaders chase fleeting trends, but true influence is built through consistent, valuable content. Without a reliable publishing schedule, your growth stalls, and your long-term impact diminishes.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problems List */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">What's Really Holding You Back:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-signal-yellow rounded-full mt-2 flex-shrink-0" />
                <p className="text-text-muted">Sporadic publishing leads to forgotten presence.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-signal-yellow rounded-full mt-2 flex-shrink-0" />
                <p className="text-text-muted">Slow, inconsistent growth despite best efforts.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-signal-yellow rounded-full mt-2 flex-shrink-0" />
                <p className="text-text-muted">Struggling to build authority and trust over time.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-signal-yellow rounded-full mt-2 flex-shrink-0" />
                <p className="text-text-muted">Missing the compound effect of continuous engagement.</p>
              </div>
            </div>
          </div>

          {/* Solution Preview */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-border-subtle p-8">
            <h3 className="text-xl font-bold text-white mb-4">The Solution:</h3>
            <p className="text-text-muted mb-6 leading-relaxed">
              A content operating system that turns one recording day into 30 days of omni-channel content, automated distribution, and measurable pipeline growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="/book"
                className="inline-flex items-center justify-center px-6 py-3 bg-signal-yellow hover:bg-signal-soft text-black font-semibold rounded-full transition"
              >
                Fix This Now
              </a>
              <a 
                href="/services"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}