'use client';

import { useState } from 'react';

interface ComingSoonCardProps {
  title: string;
  description: string;
  waitlistTag: string;
  estimatedLaunch?: string;
}

export default function ComingSoonCard({ 
  title, 
  description, 
  waitlistTag, 
  estimatedLaunch 
}: ComingSoonCardProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/config/epm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          waitlistTag
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }

      setSuccess(true);
      setEmail('');
      
      // Track analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'epm_waitlist_signup', {
          service_name: title,
          waitlist_tag: waitlistTag
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Service Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
        {estimatedLaunch && (
          <p className="text-sm text-[#008080] font-semibold mt-2">
            Estimated Launch: {estimatedLaunch}
          </p>
        )}
      </div>

      {/* Waitlist Form */}
      {!success ? (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8FF5A] focus:border-transparent outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#E8FF5A] hover:bg-[#F0FF85] disabled:opacity-50 text-[#080808] font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              {loading ? 'Joining...' : 'Join Waitlist'}
            </button>
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </form>
      ) : (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-600 font-semibold">You're on the waitlist!</p>
          <p className="text-gray-600 text-sm mt-1">We'll notify you when {title} launches.</p>
        </div>
      )}
    </div>
  );
}