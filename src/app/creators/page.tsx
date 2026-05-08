import { Metadata } from "next";
import Link from "next/link";
import { portalLinks, getBookingUrl } from "@/config/links";

export const metadata: Metadata = {
  title: "For Creators | Audio Jones",
  description: "Integrated systems for artists, podcasters, and content creators to scale their creative business.",
  keywords: ["creator tools", "artist services", "podcast production", "content creator", "creative business"],
};

export default function CreatorsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#FF4500] to-[#FFD700] bg-clip-text text-transparent">
                Built for Creators
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              Scale your creative business with integrated systems for artists, podcasters, and content creators
            </p>

            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-white/70 leading-relaxed">
                Whether you&apos;re producing podcasts, releasing music, or building a content empire—our integrated platform
                handles delivery, marketing, optimization, and analytics so you can focus on creating.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Creator-Specific Systems */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Systems That Scale With You
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Podcast Production */}
              <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <div className="text-5xl mb-4">🎙️</div>
                <h3 className="text-2xl font-bold mb-4">Podcast Production & Distribution</h3>
                <ul className="space-y-3 text-white/70 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Automated episode production workflow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Multi-platform distribution (Spotify, Apple, YouTube)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>AI-powered show notes and social clips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Analytics and audience growth tracking</span>
                  </li>
                </ul>
                <Link
                  href="/services"
                  className="text-[#FF4500] hover:text-[#FFD700] font-semibold transition"
                >
                  Learn More →
                </Link>
              </div>

              {/* Music Distribution */}
              <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <div className="text-5xl mb-4">🎵</div>
                <h3 className="text-2xl font-bold mb-4">Music Release Management</h3>
                <ul className="space-y-3 text-white/70 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Coordinated release campaigns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Social media amplification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Playlist pitching and PR coordination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Performance tracking across platforms</span>
                  </li>
                </ul>
                <Link
                  href="/services"
                  className="text-[#FF4500] hover:text-[#FFD700] font-semibold transition"
                >
                  Learn More →
                </Link>
              </div>

              {/* Content Strategy */}
              <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-2xl font-bold mb-4">Content Strategy & Growth</h3>
                <ul className="space-y-3 text-white/70 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Multi-channel content calendars</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Audience growth optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Engagement tracking and insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Brand partnership opportunities</span>
                  </li>
                </ul>
                <Link
                  href="/applied-intelligence"
                  className="text-[#FF4500] hover:text-[#FFD700] font-semibold transition"
                >
                  Learn More →
                </Link>
              </div>

              {/* Monetization */}
              <div className="p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold mb-4">Monetization & Revenue</h3>
                <ul className="space-y-3 text-white/70 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Subscription and membership management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Digital product delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Sponsorship tracking and fulfillment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF4500] mt-1">✓</span>
                    <span>Revenue analytics and forecasting</span>
                  </li>
                </ul>
                <Link
                  href="/applied-intelligence"
                  className="text-[#FF4500] hover:text-[#FFD700] font-semibold transition"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ArtistHub CTA */}
      <div className="py-20 border-t border-white/10 bg-gradient-to-b from-transparent to-white/5">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Access Your Creator Hub
            </h2>
            <p className="text-lg text-white/70 mb-8">
              ArtistHub is your central command for all projects, bookings, and creative services.
            </p>
            <Link
              href="https://artisthub.audiojones.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] text-black font-bold text-lg hover:opacity-90 transition"
            >
              Launch ArtistHub
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Scale Your Creative Business?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Book a session to see how our integrated platform supports creators like you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={getBookingUrl()}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] text-black font-bold text-lg hover:opacity-90 transition"
              >
                Book a Session
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-bold text-lg hover:border-white/40 transition"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
