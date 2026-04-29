'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ServiceTile from './ServiceTile';

interface ArtistHubService {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  whopProductUrl: string;
  imageUrl: string;
  pricing?: string;
  duration?: string;
  order: number;
  enabled: boolean;
}

interface ArtistHubConfig {
  title: string;
  description: string;
  services: ArtistHubService[];
}

export default function ArtistHubLayout() {
  const [config, setConfig] = useState<ArtistHubConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch('/api/config/artist-hub');
        if (!response.ok) {
          throw new Error('Failed to load artist hub configuration');
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
          <p className="text-gray-600">Loading Artist Hub...</p>
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

  const enabledServices = config.services
    .filter(service => service.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FF4500] to-[#E03D00] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{config.title}</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            {config.description}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {enabledServices.map((service) => (
              <ServiceTile
                key={service.id}
                {...service}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Elevate Your Sound?
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join hundreds of artists who've transformed their music with Audio Jones professional services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/portal"
              className="bg-[#008080] hover:bg-[#006666] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Client Portal
            </a>
            <Link
              href="/"
              className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}