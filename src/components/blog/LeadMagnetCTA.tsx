// Lead Magnet CTA Component - Dynamic CTA based on pillar and content type
import { PILLARS, PillarType } from '@/lib/models/blog';

interface LeadMagnetCTAProps {
  ctaType: string;
  headline: string;
  description: string;
  link: string;
  pillar: PillarType;
}

export default function LeadMagnetCTA({ ctaType, headline, description, link, pillar }: LeadMagnetCTAProps) {
  const pillarConfig = PILLARS[pillar];

  // Get appropriate icon and styling based on CTA type
  const getCtaConfig = () => {
    switch (ctaType) {
      case 'newsletter':
        return {
          icon: '📧',
          bgGradient: 'from-signal-yellow/20 to-signal-yellow/10',
          borderColor: 'border-signal-yellow/30',
          buttonColor: 'bg-signal-yellow text-bg-base hover:bg-signal-soft'
        };
      case 'podcast':
        return {
          icon: '🎙️',
          bgGradient: 'from-accent-blue/20 to-accent-blue/10',
          borderColor: 'border-accent-blue/30',
          buttonColor: 'bg-accent-blue hover:bg-accent-blue/90'
        };
      case 'services':
        return {
          icon: '🚀',
          bgGradient: 'from-signal-yellow/20 to-signal-yellow/10',
          borderColor: 'border-signal-yellow/30',
          buttonColor: 'bg-signal-yellow text-bg-base hover:bg-signal-soft'
        };
      case 'lead_magnet':
        return {
          icon: '📋',
          bgGradient: 'from-accent-green/20 to-accent-green/10',
          borderColor: 'border-accent-green/30',
          buttonColor: 'bg-accent-green text-bg-base hover:bg-accent-green/90'
        };
      default:
        return {
          icon: '✨',
          bgGradient: 'from-signal-yellow/20 to-signal-yellow/10',
          borderColor: 'border-signal-yellow/30',
          buttonColor: 'bg-signal-yellow text-bg-base hover:bg-signal-soft'
        };
    }
  };

  const ctaConfig = getCtaConfig();

  return (
    <section 
      className={`bg-gradient-to-r ${ctaConfig.bgGradient} border ${ctaConfig.borderColor} rounded-2xl p-8 lg:p-12 text-center`}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="text-4xl mb-4">{ctaConfig.icon}</div>
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          {headline}
        </h2>
        <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Pillar-specific benefits */}
      <div className="mb-8">
        <PillarBenefits pillar={pillar} ctaType={ctaType} />
      </div>

      {/* CTA Form/Button */}
      <div className="max-w-md mx-auto">
        {ctaType === 'newsletter' ? (
          <NewsletterForm buttonColor={ctaConfig.buttonColor} />
        ) : (
          <a
            href={link}
            className={`inline-block px-8 py-4 ${ctaConfig.buttonColor} font-semibold rounded-lg transition-colors`}
          >
            {getButtonText(ctaType)}
          </a>
        )}
      </div>

      {/* Trust indicators */}
      <div className="mt-6 text-sm text-text-muted">
        <div className="flex items-center justify-center gap-4 mb-2">
          <span>✅ Operator-tested strategies</span>
          <span>✅ Miami-forward perspective</span>
        </div>
        <p>Join 5,000+ creators and entrepreneurs using Audio Jones systems</p>
      </div>
    </section>
  );
}

function PillarBenefits({ pillar, ctaType }: { pillar: PillarType; ctaType: string }) {
  const benefits = {
    ai: [
      'Latest AI marketing automation tactics',
      'EPM framework implementation guides',
      'Predictive growth strategies'
    ],
    marketing: [
      'AEO optimization techniques',
      'Conversion funnel blueprints',
      'Marketing automation workflows'
    ],
    'podcast-news': [
      'Creator economy insights',
      'Monetization strategies',
      'Industry trend analysis'
    ],
    'tech-business-trends': [
      'Technology trend analysis',
      'Business model innovations',
      'Strategic market insights'
    ],
    'personal-brand': [
      'Personal brand frameworks',
      'Thought leadership strategies',
      'Authority building tactics'
    ]
  };

  const pillarBenefits = benefits[pillar] || benefits.ai;

  return (
    <div className="grid md:grid-cols-3 gap-4 text-sm">
      {pillarBenefits.map((benefit, index) => (
        <div key={index} className="flex items-center gap-2 text-text-muted">
          <span className="text-signal-yellow">✨</span>
          <span>{benefit}</span>
        </div>
      ))}
    </div>
  );
}

function NewsletterForm({ buttonColor }: { buttonColor: string }) {
  return (
    <form className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-3 bg-surface-2 border border-border-subtle rounded-lg text-white placeholder-text-muted focus:border-signal-yellow focus:outline-none"
      />
      <button
        type="submit"
        className={`px-6 py-3 ${buttonColor} font-semibold rounded-lg transition-colors whitespace-nowrap`}
      >
        Subscribe Now
      </button>
    </form>
  );
}

function getButtonText(ctaType: string): string {
  switch (ctaType) {
    case 'podcast':
      return 'Listen Now';
    case 'services':
      return 'Get Started';
    case 'lead_magnet':
      return 'Download Free';
    default:
      return 'Learn More';
  }
}