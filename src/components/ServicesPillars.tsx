"use client";

export default function ServicesPillars() {
  return (
    <section className="font-display bg-background-light dark:bg-background-dark flex min-h-screen w-full items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tighter text-zinc-900 dark:text-white sm:text-4xl md:text-5xl">
            What We Build
          </h1>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
            Three pillars to grow authority and revenue.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="group rounded-xl border border-zinc-200/50 bg-white/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-zinc-800/50 dark:bg-[#1E1E1E] dark:hover:border-zinc-700">
            <div className="flex h-full flex-col">
              <span className="material-symbols-outlined mb-4 text-5xl bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] bg-clip-text text-transparent">
                auto_awesome
              </span>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Personal Branding Authority
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Build a powerful, authentic personal brand that positions you as
                a thought leader.
              </p>
              <ul className="my-6 space-y-3 text-left text-sm text-zinc-700 dark:text-zinc-300">
                {["Brand Strategy", "Content Creation", "Audience Growth"].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] bg-clip-text text-transparent">
                      check_circle
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <button className="mt-auto h-11 w-full cursor-pointer rounded-lg bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] px-5 text-sm font-bold text-[#080808] transition-all duration-300 hover:brightness-110 group-hover:scale-105">
                Build Your Brand
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group rounded-xl border border-zinc-200/50 bg-white/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-zinc-800/50 dark:bg-[#1E1E1E] dark:hover:border-zinc-700">
            <div className="flex h-full flex-col">
              <span className="material-symbols-outlined mb-4 text-5xl bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] bg-clip-text text-transparent">
                movie
              </span>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Video Podcast Production
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Concept, capture, and distribution for studio-quality video
                podcasts. Audio repurposed for every channel.
              </p>
              <ul className="my-6 space-y-3 text-left text-sm text-zinc-700 dark:text-zinc-300">
                {[
                  "Full-Service Production",
                  "High-Quality Editing",
                  "Distribution Strategy",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] bg-clip-text text-transparent">
                      check_circle
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <button className="mt-auto h-11 w-full cursor-pointer rounded-lg bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] px-5 text-sm font-bold text-[#080808] transition-all duration-300 hover:brightness-110 group-hover:scale-105">
                Launch Your Podcast
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group rounded-xl border border-zinc-200/50 bg-white/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-zinc-800/50 dark:bg-[#1E1E1E] dark:hover:border-zinc-700">
            <div className="flex h-full flex-col">
              <span className="material-symbols-outlined mb-4 text-5xl bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] bg-clip-text text-transparent">
                psychology
              </span>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                AI Marketing Systems
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Automations and playbooks for lead gen, content repurposing, and
                analytics.
              </p>
              <ul className="my-6 space-y-3 text-left text-sm text-zinc-700 dark:text-zinc-300">
                {["AI Automation", "Content Repurposing", "Lead Generation"].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] bg-clip-text text-transparent">
                      check_circle
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <button className="mt-auto h-11 w-full cursor-pointer rounded-lg bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] px-5 text-sm font-bold text-[#080808] transition-all duration-300 hover:brightness-110 group-hover:scale-105">
                Automate Your Marketing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
