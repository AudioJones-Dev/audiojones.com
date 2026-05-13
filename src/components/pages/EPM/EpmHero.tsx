'use client';

interface EpmHeroProps {
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta?: string;
}

export default function EpmHero({ title, subtitle, primaryCta, secondaryCta }: EpmHeroProps) {
  const handlePrimaryCta = () => {
    // Scroll to waitlist section
    const comingSoonSection = document.getElementById('coming-soon');
    if (comingSoonSection) {
      comingSoonSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'epm_hero_cta_click', {
        cta_type: 'primary',
        destination: 'waitlist'
      });
    }
  };

  const handleSecondaryCta = () => {
    // Scroll to explainer section
    const explainerSection = document.getElementById('explainer');
    if (explainerSection) {
      explainerSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'epm_hero_cta_click', {
        cta_type: 'secondary',
        destination: 'learn_more'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#000000] text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-[#E8FF5A] to-[#F0FF85] rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-[#008080] to-[#F0FF85] rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Neural Network Grid */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#F0FF85" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pre-title */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] text-black px-4 py-2 rounded-full text-sm font-semibold mb-8">
          <span className="animate-pulse">🧠</span>
          Revolutionary Marketing Framework
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
          <span className="bg-gradient-to-r from-[#E8FF5A] via-[#F0FF85] to-[#008080] bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={handlePrimaryCta}
            className="bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] hover:from-[#d4eb3a] hover:to-[#F0FF85] text-black font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {primaryCta}
          </button>
          
          {secondaryCta && (
            <button
              onClick={handleSecondaryCta}
              className="border-2 border-[#008080] hover:bg-[#008080] text-[#008080] hover:text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200"
            >
              {secondaryCta}
            </button>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-[#F0FF85]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}