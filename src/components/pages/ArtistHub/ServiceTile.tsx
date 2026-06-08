'use client';

import { ExternalLink, Clock, DollarSign } from 'lucide-react';

interface ServiceTileProps {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  productUrl: string;
  imageUrl: string;
  pricing?: string;
  duration?: string;
}

export default function ServiceTile({
  title,
  description,
  ctaText,
  productUrl,
  imageUrl,
  pricing,
  duration
}: ServiceTileProps) {
  const handleCtaClick = () => {
    if (!productUrl) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'artist_hub_service_click', {
        service_name: title,
      });
    }

    window.open(productUrl, '_blank');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Service Image */}
      <div className="aspect-video bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/400x225/FF4500/FFFFFF?text=${encodeURIComponent(title)}`;
          }}
        />
      </div>

      {/* Service Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>

        {/* Service Details */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          {pricing && (
            <div className="flex items-center gap-1">
              <DollarSign size={16} />
              <span>{pricing}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{duration}</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleCtaClick}
          className="w-full bg-[#FF4500] hover:bg-[#E03D00] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {ctaText}
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}