import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-black via-[#0B0B0B] to-[#1A0E00] py-16 sm:py-20 lg:py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(232,255,90,0.1)_0%,transparent_50%)]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Copy */}
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#E8FF5A]">
              South Florida Leaders & Creators
            </p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Miami Consultant for Personal Branding, Podcast Production, and AI Marketing Systems
            </h1>
            <p className="text-lg text-white/75 max-w-2xl">
              Build authority, automate growth, and amplify your voice from our studio serving South Florida leaders and entrepreneurs.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <a
                href="/book"
                className="rounded-full px-6 py-3 font-bold text-black shadow-[0_4px_20px_rgba(255,215,0,0.35)]
                         bg-[linear-gradient(135deg,#E8FF5A,#F0FF85)]
                         hover:bg-[linear-gradient(135deg,#F0FF85,#E8FF5A)] transition"
              >
                Book a Consultation
              </a>
              <a
                href="/services"
                className="rounded-full border border-white/20 px-6 py-3 font-bold text-white 
                         hover:bg-white/10 transition"
              >
                Watch the 7m Build Overview
              </a>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="flex items-start justify-center lg:justify-end">
            <div className="relative">
              <Image
                src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/AUDIO%20JONES%20HERO%20IMAGE%20%20(1).webp?updatedAt=1762104789649"
                alt="Audio Jones Hero"
                width={1920}
                height={1080}
                className="w-full max-w-lg rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}