'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import EpmHero from '@/components/pages/EPM/EpmHero';
import EpmExplainer from '@/components/pages/EPM/EpmExplainer';
import EpmFlow from '@/components/pages/EPM/EpmFlow';
import ComingSoonCard from '@/components/pages/EPM/ComingSoonCard';

interface EpmPageConfig {
  hero: {
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta?: string;
  };
  explainer: {
    title: string;
    content: string;
    problemList: string[];
  };
  flow: Array<{
    step: 1 | 2 | 3 | 4;
    title: string;
    description: string;
    icon?: string;
  }>;
  comingSoon: Array<{
    title: string;
    description: string;
    waitlistTag: string;
    estimatedLaunch?: string;
  }>;
  ecosystem: Array<{
    module: string;
    description: string;
    href: string;
  }>;
}

export default function EpmPage() {
  const [config, setConfig] = useState<EpmPageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch('/api/config/epm');
        if (!response.ok) {
          throw new Error('Failed to load EPM configuration');
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4500] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EPM...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#FF4500] text-white px-4 py-2 rounded-lg hover:bg-[#E03D00] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!config) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <EpmHero {...config.hero} />

      {/* Explainer Section */}
      <EpmExplainer {...config.explainer} />

      {/* How It Works Flow */}
      <EpmFlow steps={config.flow} />

      {/* Coming Soon Services */}
      <section id="coming-soon" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Coming Soon
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Be the first to experience the next generation of EPM tools and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.comingSoon.map((service, index) => (
              <ComingSoonCard
                key={index}
                {...service}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Integration */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Part of the Audio Jones Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              EPM integrates seamlessly with our other modules to create a comprehensive 
              AI-powered marketing and automation platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.ecosystem.map((module, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{module.module}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{module.description}</p>
                <a
                  href={module.href}
                  className="text-[#FF4500] hover:text-[#E03D00] font-semibold transition-colors duration-200"
                >
                  Learn More →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-[#FF4500] to-[#FFD700] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl mb-8 leading-relaxed">
            Join the EPM revolution and discover how emotional intelligence 
            can transform your audience relationships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#coming-soon"
              className="bg-white text-[#FF4500] font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Join Waitlist
            </a>
            <Link
              href="/"
              className="border border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-[#FF4500] transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}