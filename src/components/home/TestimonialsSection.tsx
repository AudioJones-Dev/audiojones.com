import Image from 'next/image';

export default function TestimonialsSection() {
  return (
    <section className="relative bg-[#0B0B0B] py-16 sm:py-20 lg:py-24 text-white">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
      
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#E8FF5A]">CLIENT RESULTS</p>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Trusted by South Florida Leaders &amp; Creators
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-300">
            Discover the impact of a streamlined system from leaders who transformed their brand presence.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mike Keegan */}
          <article className="relative rounded-xl bg-white/5 p-8 shadow-lg ring-1 ring-white/10">
            <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#E8FF5A] to-transparent" />
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 flex-shrink-0 rounded-full bg-center bg-cover p-1 ring-2 ring-offset-2 ring-offset-[#0B0B0B] ring-[#F0FF85]">
                <Image
                  src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Client%20Testiomonials/MIKE_KEEGAN_IMAGE_PROFILE_2025.png?updatedAt=1761600050350"
                  alt="Mike Keegan"
                  width={64}
                  height={64}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <p className="text-base font-bold">Mike Keegan</p>
                <p className="text-sm text-gray-400">Business Owner</p>
              </div>
            </div>
            <blockquote className="mt-6 text-base leading-7 text-gray-300">
              "Even as a blue‑collar business owner, using podcasting to bridge to an audience who needed my services was truly something I hadn't imagined."
            </blockquote>
          </article>

          {/* Abebe Lewis */}
          <article className="relative rounded-xl bg-white/5 p-8 shadow-lg ring-1 ring-white/10">
            <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#E8FF5A] to-transparent" />
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 flex-shrink-0 rounded-full bg-center bg-cover p-1 ring-2 ring-offset-2 ring-offset-[#0B0B0B] ring-[#F0FF85]">
                <Image
                  src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Client%20Testiomonials/ABEBE_LEWIS_MAGE_PROFILE_2025_2.webp?updatedAt=1762105182886"
                  alt="Abebe Lewis"
                  width={64}
                  height={64}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <p className="text-base font-bold">Abebe Lewis</p>
                <p className="text-sm text-gray-400">Music Executive, Circle House Digital</p>
              </div>
            </div>
            <blockquote className="mt-6 text-base leading-7 text-gray-300">
              "As someone who always played the background, podcasting changed the dynamic—now I'm the talent, and it's opened so many opportunities."
            </blockquote>
          </article>

          {/* K Foxx */}
          <article className="relative rounded-xl bg-white/5 p-8 shadow-lg ring-1 ring-white/10">
            <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#E8FF5A] to-transparent" />
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 flex-shrink-0 rounded-full bg-center bg-cover p-1 ring-2 ring-offset-2 ring-offset-[#0B0B0B] ring-[#F0FF85]">
                <Image
                  src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Client%20Testiomonials/KFOXX_IMAGE_PROFILE_2025.webp?updatedAt=1762105182864"
                  alt="K Foxx"
                  width={64}
                  height={64}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <p className="text-base font-bold">K Foxx</p>
                <p className="text-sm text-gray-400">99 Jams Radio Personality</p>
              </div>
            </div>
            <blockquote className="mt-6 text-base leading-7 text-gray-300">
              "Easy to work with—honestly a no‑brainer for delivering content consistently."
            </blockquote>
          </article>
        </div>

        <div className="mt-16 flex justify-center">
          <a 
            href="/book" 
            className="inline-flex h-14 items-center justify-center rounded-full px-8 bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] text-black text-base font-bold tracking-wide shadow-[0_0_20px_0_rgba(232,255,90,0.45)] hover:scale-105 transition"
          >
            Start Your Studio System
          </a>
        </div>
      </div>
    </section>
  );
}