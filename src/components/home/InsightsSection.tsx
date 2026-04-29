import Link from 'next/link';

export default function InsightsSection() {
  return (
    <section
      className="relative py-20 text-white"
      style={{
        backgroundImage: "url('https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(5).png?updatedAt=1761600049689')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-wide text-orange-400 font-semibold">
              Insights &amp; Playbooks
            </p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Learn how Miami leaders stay visible.
            </h2>
            <p className="text-gray-200 mt-2 max-w-2xl">
              AI, podcasting, and AEO strategies we're using with clients right now.
            </p>
          </div>
          <Link
            href="/insights"
            className="inline-flex items-center rounded-full border border-white/15 bg-black/30 px-5 py-2 text-sm font-semibold text-white hover:border-white/70 transition-all"
          >
            View all insights
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <article className="flex flex-col bg-black/35 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
            <div 
              className="h-40 bg-cover bg-center" 
              style={{ 
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuALIuT_z9iONkvaxl2V2a5KpJ3-hB00lKUrjiJNGylwbdCZFEufo4-IRxnUBRJbBfZtT3Gwn4XLWWMULTVafNtoF8CT9dR76obURMYMlamWF8PJNiJi5eDEvSuMVYRd7ElWhFP5EdqW4b-KVHAZ0UoI57f_s9SLZIPv2UYfHqUfGmcXf0aiMAJfs26te6daMCP4nwitysMZHHPVJE1TdlstG0RoBwQf6qJCFWbqOvrpMdvJZdLd29N9PK_lV-1PlhZJcFRDkJaiT-A')" 
              }}
            />
            <div className="p-6 flex flex-col gap-3 flex-1">
              <p className="text-xs uppercase tracking-wide text-orange-300">AI Marketing • 5 min read</p>
              <h3 className="text-lg font-semibold leading-snug">
                The Miami Podcast Playbook: How to Launch a Show That Gets Noticed
              </h3>
              <p className="text-gray-300 text-sm flex-1">
                A step-by-step approach to launching a video-first show for South Florida audiences.
              </p>
              <Link
                href="/blog/miami-podcast-playbook"
                className="inline-flex items-center mt-1 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] px-4 py-2 text-sm font-semibold text-black shadow-md hover:opacity-90 transition-all"
              >
                Open Playbook →
              </Link>
            </div>
          </article>

          {/* Card 2 */}
          <article className="flex flex-col bg-black/35 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
            <div 
              className="h-40 bg-cover bg-center" 
              style={{ 
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzA6uOZnyxeK0KsbKj9feBBZWpIJZRKVtpHbieFPu5Uoyrvv7FVI4UpxLNGha9XtMaBza5u6kQ2OvC_YmVj4rQmeT1cPH93tqGQvRg9rwdhRVs5zTJfHQ5n3VML-6It-cG20-SJyNMMWsZZ9-i75qHPUKUK9gf5kA96Rbpol71BS58KYQ3CulO1hzKfxSWCSBJs9j-w16I17z2h3mreCTROdcoAHGPwcnlqfbphtEf5_HxjQN8uzxVR1sTpsS4M86DYifPmvh56nM')" 
              }}
            />
            <div className="p-6 flex flex-col gap-3 flex-1">
              <p className="text-xs uppercase tracking-wide text-orange-300">Content Systems • 7 min read</p>
              <h3 className="text-lg font-semibold leading-snug">
                AI-Powered Content Marketing: How to Generate Leads on Autopilot
              </h3>
              <p className="text-gray-300 text-sm flex-1">
                Use automation and AI to turn episodes into multi-channel lead gen.
              </p>
              <Link
                href="/blog/ai-powered-content-marketing"
                className="inline-flex items-center mt-1 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] px-4 py-2 text-sm font-semibold text-black shadow-md hover:opacity-90 transition-all"
              >
                Open Playbook →
              </Link>
            </div>
          </article>

          {/* Card 3 */}
          <article className="flex flex-col bg-black/35 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
            <div 
              className="h-40 bg-cover bg-center" 
              style={{ 
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_oXrpO1n6EMg7g6c3qsNyGv8sV7SV8b-r7F1-qCR9kCVkk7Kk6ctjd3YTU2l0UghGSiS2RUYe3VBJuFcLUSLbCUezTtoj0xF-OouiXDlw5rhU_17PvW4235j7nMiE7jt8Gczv9JF4Ode2Ki0Pi0wyCpZA9DhEX0cV6sB3FEaENtzKHvG-QTs36S--yKEWM3u19xhMbS_3HGygHwwkuqxRhZhDd3QrbjRltyWJZWY4NDuvFSuRcIPnc0uGar4b8gURHIbRkS72FNo')" 
              }}
            />
            <div className="p-6 flex flex-col gap-3 flex-1">
              <p className="text-xs uppercase tracking-wide text-orange-300">AEO / Local SEO • 6 min read</p>
              <h3 className="text-lg font-semibold leading-snug">
                The AEO Framework: How to Build a Personal Brand That Attracts Clients
              </h3>
              <p className="text-gray-300 text-sm flex-1">
                Position yourself for Miami search, zero-click results, and branded queries.
              </p>
              <Link
                href="/blog/miami-aeo-framework"
                className="inline-flex items-center mt-1 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] px-4 py-2 text-sm font-semibold text-black shadow-md hover:opacity-90 transition-all"
              >
                Open Playbook →
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}