import Image from 'next/image';

export default function WhyAudioJonesSection() {
  return (
    <section 
      className="relative overflow-hidden" 
      style={{
        backgroundImage: 'linear-gradient(to bottom right, #1A0E00, #0B0B0B)'
      }}
    >
      <div className="absolute -right-1/4 -top-1/4 h-[800px] w-[800px] bg-[radial-gradient(circle_at_center,rgba(232,255,90,0.15)_0%,rgba(232,255,90,0)_50%)]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-12 py-24 md:py-32 lg:grid-cols-2 lg:gap-16">
          {/* Text */}
          <div className="flex flex-col gap-8 text-center lg:text-left">
            <p className="font-bold uppercase tracking-widest text-[#E8FF5A]">Why Audio Jones</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
              The Studio That Builds Thought Leaders
            </h2>
            <p className="max-w-2xl text-lg text-gray-300 mx-auto lg:mx-0">
              Audio Jones bridges creativity, technology, and strategy — helping South Florida entrepreneurs, artists, and executives amplify their message through content systems that actually convert.
            </p>
            
            <ul className="flex flex-col gap-4 text-left">
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#E8FF5A] to-[#F0FF85]">
                  <span className="text-white text-xs">✨</span>
                </span>
                <span className="text-white">Proven AI + Automation Frameworks</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#E8FF5A] to-[#F0FF85]">
                  <span className="text-white text-xs">🎙️</span>
                </span>
                <span className="text-white">Studio-Quality Podcast Production</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#E8FF5A] to-[#F0FF85]">
                  <span className="text-white text-xs">📄</span>
                </span>
                <span className="text-white">Content Repurposing That Scales Authority</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#E8FF5A] to-[#F0FF85]">
                  <span className="text-white text-xs">🏆</span>
                </span>
                <span className="text-white">Personal Branding, Simplified</span>
              </li>
            </ul>
            
            <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <a 
                href="/book" 
                className="inline-flex h-12 items-center justify-center rounded-full px-8 bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] text-black text-base font-bold tracking-wide shadow-lg hover:scale-105 transition"
              >
                Work With Audio Jones
              </a>
              <a 
                href="/about" 
                className="inline-flex h-12 items-center justify-center rounded-full px-8 ring-1 ring-inset ring-white text-white text-base font-bold hover:bg-white hover:text-black transition"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="order-first lg:order-last">
            <Image 
              src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/audio-jones-hero.png?updatedAt=1761600050750" 
              alt="Audio Jones — studio portrait" 
              width={600}
              height={600}
              className="w-full rounded-lg shadow-2xl" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}