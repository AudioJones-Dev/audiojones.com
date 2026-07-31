import Image from 'next/image';

export default function CaseStudySection() {
  return (
    <section
      className="relative w-full overflow-hidden py-16 sm:py-24 lg:py-32 text-white"
      style={{
        backgroundImage: "url('https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(4).png?updatedAt=1761600049303')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Left-side readability overlay behind copy only */}
      <div className="absolute inset-y-0 left-0 w-full md:w-1/2 bg-black/45" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Copy */}
          <div className="flex flex-col items-start gap-6">
            <span className="font-bold uppercase tracking-wider text-signal-yellow">Illustrative Workflow</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Why a Podcast Is the Smartest Marketing Investment of 2026
            </h2>
            <p className="text-base sm:text-lg text-text-primary max-w-xl">
              A podcast operating model can connect production, repurposing,
              distribution, and attribution. The results must be measured against
              the client&apos;s baseline before any performance claim is published.
            </p>

            <ul className="mt-1 space-y-4 text-white">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-gradient-to-r from-[#E8FF5A] to-[#4DACFF]" />
                <span className="text-lg">Tracked outcome — qualified opportunities by source</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-gradient-to-r from-[#E8FF5A] to-[#4DACFF]" />
                <span className="text-lg">Measured baseline — current content-to-pipeline path</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-gradient-to-r from-[#E8FF5A] to-[#4DACFF]" />
                <span className="text-lg">Operational goal — repeatable production and distribution</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-gradient-to-r from-[#E8FF5A] to-[#4DACFF]" />
                <span className="text-lg">Evidence rule — no result claim without a stable source</span>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="/book-a-call"
                className="inline-flex h-12 items-center justify-center rounded-full bg-signal-yellow hover:bg-signal-soft px-6 text-base font-bold text-black shadow-md transition"
              >
                Book a Consultation
              </a>
              <a
                href="/insights"
                className="inline-flex h-12 items-center justify-center rounded-full px-6 text-base font-bold ring-2 ring-white/90 hover:bg-white/10 transition"
              >
                See Full Breakdown
              </a>
            </div>
          </div>

          {/* Mockups */}
          <div className="relative h-[420px] sm:h-[520px]">
            {/* Back card */}
            <div className="absolute bottom-2 right-2 w-[68%] sm:w-[70%] -rotate-6">
              <Image
                src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/AUDIO%20JONES%20IMAGE%20PHONE%20WITH%20CONTENT%20CREATORS%201.png?updatedAt=1762145968983"
                alt="Podcast phone mockups with creators — set 1"
                width={400}
                height={600}
                className="w-full h-auto rounded-2xl shadow-2xl"
                style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,.35))' }}
              />
            </div>
            {/* Front card */}
            <div className="absolute top-0 left-0 w-[72%] sm:w-[74%] rotate-6">
              <Image
                src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/AUDIO%20JONES%20IMAGE%20PHONE%20WITH%20CONTENT%20CREATORS%202.png?updatedAt=1762145969059"
                alt="Podcast phone mockups with creators — set 2"
                width={400}
                height={600}
                className="w-full h-auto rounded-2xl shadow-2xl"
                style={{ filter: 'drop-shadow(0 24px 36px rgba(0,0,0,.45))' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
