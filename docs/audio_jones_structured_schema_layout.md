# Audio Jones Structured Schema Layout (Final)

> **Historical notice (2026-07-31):** This layout predates the current
> evidence standard. Numerical marketing examples retained below are not
> verified AJ Digital client results and must not be copied into public pages,
> metadata, or JSON-LD without a stable source and publication approval.

## 1. Organization

## 2. Founder (Person)

## 3. Local Business / Studio (Circle House)

## 4. WebSite

## 5. WebPage (Homepage)

**Hero Image:**  
URL: `https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/AUDIO%20JONES%20HERO%20IMAGE%20%20(1).webp?updatedAt=1762104789649`  
Aspect Ratio: 16:9  
Dimensions: 1920 × 1080 px  
Type: `.webp`

## 6. Breadcrumb

## 7. Services Grid (What We Build)

**Background Image (Services/Pillars):**  
`https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(1).png?updatedAt=1761600049545`

**Pillars:**
- Personal Branding Authority
- Video Podcast Production
- AI Marketing Systems

```json
{
  "@type": "ItemList",
  "@id": "https://audiojones.com/#services",
  "name": "What We Build — Three pillars to grow authority and revenue",
  "description": "Personal branding, video podcast production, and AI marketing systems delivered as a unified growth engine.",
  "image": "https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(1).png?updatedAt=1761600049545",
  "itemListElement": [
    {
      "@type": "Service",
      "@id": "https://audiojones.com/#service/personal-branding",
      "name": "Personal Branding Authority",
      "description": "We help you build a powerful, authentic personal brand that establishes you as a thought leader in your industry.",
      "areaServed": "South Florida",
      "serviceType": ["Brand Strategy","Content Creation","Audience Growth"],
      "offers": {
        "@type": "Offer",
        "url": "https://audiojones.com/book?service=personal-branding",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "Service",
      "@id": "https://audiojones.com/#service/podcast-production",
      "name": "Video Podcast Production",
      "description": "From concept to distribution, we handle the entire podcasting process to produce high-quality video and audio content.",
      "serviceType": ["Full-Service Production","High-Quality Editing","Distribution Strategy"],
      "offers": {
        "@type": "Offer",
        "url": "https://audiojones.com/book?service=podcast",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "Service",
      "@id": "https://audiojones.com/#service/ai-marketing-systems",
      "name": "AI Marketing Systems",
      "description": "Leverage artificial intelligence to streamline content repurposing, lead generation, and workflow optimization.",
      "serviceType": ["AI Automation","Content Repurposing","Lead Generation"],
      "offers": {
        "@type": "Offer",
        "url": "https://audiojones.com/book?service=ai",
        "priceCurrency": "USD"
      }
    }
  ],
  "isPartOf": { "@id": "https://audiojones.com/#homepage" }
}
```

## 8. Agitation / The Real Blockers
 Agitation / The Real Blockers

```json
{
  "@type": "CreativeWork",
  "@id": "https://audiojones.com/#real-blockers",
  "name": "The Real Blockers — Content Bottleneck Section",
  "description": "Consistency beats virality. Publish weekly, grow steadily. Many leaders chase fleeting trends, but true influence is built through consistent, valuable content. Without a reliable publishing schedule, your growth stalls, and your long-term impact diminishes.",
  "image": "https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(10).png?updatedAt=1761600050213",
  "about": [
    "Sporadic publishing leads to forgotten presence.",
    "Slow, inconsistent growth despite best efforts.",
    "Struggling to build authority and trust over time.",
    "Missing the compound effect of continuous engagement."
  ],
  "inLanguage": "en-US",
  "isPartOf": { "@id": "https://audiojones.com/#homepage" }
}
```

## 9. Social Proof / Testimonials

**Placement:** This UI section sits **after 8. Agitation / The Real Blockers** and **before 12. Smart Data / Case Study.**

```json
{
  "@type": "ItemList",
  "@id": "https://audiojones.com/#testimonials",
  "name": "Client Testimonials — South Florida Leaders & Creators",
  "itemListElement": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Abebe Lewis",
        "jobTitle": "Music Executive, Circle House Digital",
        "image": "https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Client%20Testiomonials/ABEBE_LEWIS_MAGE_PROFILE_2025_2.webp?updatedAt=1762105182886"
      },
      "reviewBody": "Partnering with Audio Jones elevated our digital storytelling and helped modernize the Circle House brand with automation and creative strategy that actually moves culture.",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "publisher": { "@id": "https://audiojones.com/#org" }
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "K Foxx",
        "jobTitle": "99 Jams Radio Personality",
        "image": "https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Client%20Testiomonials/KFOXX_IMAGE_PROFILE_2025.webp?updatedAt=1762105182864"
      },
      "reviewBody": "The production quality and AI-driven marketing systems transformed how I engage my audience. The Audio Jones team gets it on every level — creative, business, and tech.",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "publisher": { "@id": "https://audiojones.com/#org" }
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Mike Keegan",
        "jobTitle": "Business Owner",
        "image": "https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Client%20Testiomonials/MIKE_KEEGAN_IMAGE_PROFILE_2025.png?updatedAt=1761600050350"
      },
      "reviewBody": "From podcast automation to brand positioning, Audio Jones gave us a complete system that attracts clients effortlessly. It’s next-level marketing.",
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "publisher": { "@id": "https://audiojones.com/#org" }
    }
  ]
}
```

**UI — Client Results / Testimonials**

```html
<section class="relative bg-[#0B0B0B] py-16 sm:py-20 lg:py-24 text-white">
  <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent"></div>
  <div class="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <p class="text-sm font-bold uppercase tracking-widest text-[#FF4500]">CLIENT RESULTS</p>
      <h2 class="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">Trusted by South Florida Leaders &amp; Creators</h2>
      <p class="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-300">Discover the impact of a streamlined system from leaders who transformed their brand presence.</p>
    </div>

    <div class="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Mike Keegan -->
      <article class="relative rounded-xl bg-white/5 p-8 shadow-lg ring-1 ring-white/10">
        <div class="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#FF4500] to-transparent"></div>
        <div class="flex items-center gap-6">
          <div class="h-16 w-16 flex-shrink-0 rounded-full bg-center bg-cover p-1 ring-2 ring-offset-2 ring-offset-[#0B0B0B] ring-[#FFD700]" style="background-image:url('https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Client%20Testiomonials/MIKE_KEEGAN_IMAGE_PROFILE_2025.png?updatedAt=1761600050350');"></div>
          <div>
            <p class="text-base font-bold">Mike Keegan</p>
            <p class="text-sm text-gray-400">Business Owner</p>
          </div>
        </div>
        <blockquote class="mt-6 text-base leading-7 text-gray-300">“Even as a blue‑collar business owner, using podcasting to bridge to an audience who needed my services was truly something I hadn’t imagined.”</blockquote>
      </article>

      <!-- Abebe Lewis -->
      <article class="relative rounded-xl bg-white/5 p-8 shadow-lg ring-1 ring-white/10">
        <div class="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#FF4500] to-transparent"></div>
        <div class="flex items-center gap-6">
          <div class="h-16 w-16 flex-shrink-0 rounded-full bg-center bg-cover p-1 ring-2 ring-offset-2 ring-offset-[#0B0B0B] ring-[#FFD700]" style="background-image:url('https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Client%20Testiomonials/ABEBE_LEWIS_MAGE_PROFILE_2025_2.webp?updatedAt=1762105182886');"></div>
          <div>
            <p class="text-base font-bold">Abebe Lewis</p>
            <p class="text-sm text-gray-400">Music Executive, Circle House Digital</p>
          </div>
        </div>
        <blockquote class="mt-6 text-base leading-7 text-gray-300">“As someone who always played the background, podcasting changed the dynamic—now I’m the talent, and it’s opened so many opportunities.”</blockquote>
      </article>

      <!-- K Foxx -->
      <article class="relative rounded-xl bg-white/5 p-8 shadow-lg ring-1 ring-white/10">
        <div class="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#FF4500] to-transparent"></div>
        <div class="flex items-center gap-6">
          <div class="h-16 w-16 flex-shrink-0 rounded-full bg-center bg-cover p-1 ring-2 ring-offset-2 ring-offset-[#0B0B0B] ring-[#FFD700]" style="background-image:url('https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Client%20Testiomonials/KFOXX_IMAGE_PROFILE_2025.webp?updatedAt=1762105182864');"></div>
          <div>
            <p class="text-base font-bold">K Foxx</p>
            <p class="text-sm text-gray-400">99 Jams Radio Personality</p>
          </div>
        </div>
        <blockquote class="mt-6 text-base leading-7 text-gray-300">“Easy to work with—honestly a no‑brainer for delivering content consistently.”</blockquote>
      </article>
    </div>

    <div class="mt-16 flex justify-center">
      <a href="/book" class="inline-flex h-14 items-center justify-center rounded-full px-8 bg-gradient-to-r from-[#FF4500] to-[#FFD700] text-black text-base font-bold tracking-wide shadow-[0_0_20px_0_rgba(255,69,0,0.45)] hover:scale-105 transition">Start Your Studio System</a>
    </div>
  </div>
</section>
```

## 10. Insights / Blog Grid
 Insights / Blog Grid

**Background Image:**  
`https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(5).png?updatedAt=1761600049689`

**UI Spec (3-card layout + global CTA):**

```html
<section
  class="relative py-20 text-white"
  style="background-image: url('https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(5).png?updatedAt=1761600049689'); background-size: cover; background-position: center;"
>
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
      <div>
        <p class="text-sm uppercase tracking-wide text-orange-400 font-semibold">Insights &amp; Playbooks</p>
        <h2 class="text-3xl md:text-4xl font-bold leading-tight">Learn how Miami leaders stay visible.</h2>
        <p class="text-gray-200 mt-2 max-w-2xl">AI, podcasting, and AEO strategies we’re using with clients right now.</p>
      </div>
      <a href="/insights" class="inline-flex items-center rounded-full border border-white/15 bg-black/30 px-5 py-2 text-sm font-semibold text-white hover:border-white/70 transition-all">View all insights</a>
    </div>

    <div class="grid gap-6 md:grid-cols-3">
      <!-- Card 1 -->
      <article class="flex flex-col bg-black/35 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
        <div class="h-40 bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuALIuT_z9iONkvaxl2V2a5KpJ3-hB00lKUrjiJNGylwbdCZFEufo4-IRxnUBRJbBfZtT3Gwn4XLWWMULTVafNtoF8CT9dR76obURMYMlamWF8PJNiJi5eDEvSuMVYRd7ElWhFP5EdqW4b-KVHAZ0UoI57f_s9SLZIPv2UYfHqUfGmcXf0aiMAJfs26te6daMCP4nwitysMZHHPVJE1TdlstG0RoBwQf6qJCFWbqOvrpMdvJZdLd29N9PK_lV-1PlhZJcFRDkJaiT-A');"></div>
        <div class="p-6 flex flex-col gap-3 flex-1">
          <p class="text-xs uppercase tracking-wide text-orange-300">AI Marketing • 5 min read</p>
          <h3 class="text-lg font-semibold leading-snug">The Miami Podcast Playbook: How to Launch a Show That Gets Noticed</h3>
          <p class="text-gray-300 text-sm flex-1">A step-by-step approach to launching a video-first show for South Florida audiences.</p>
          <a href="/blog/miami-podcast-playbook" class="inline-flex items-center mt-1 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] px-4 py-2 text-sm font-semibold text-black shadow-md hover:opacity-90 transition-all">Open Playbook →</a>
        </div>
      </article>

      <!-- Card 2 -->
      <article class="flex flex-col bg-black/35 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
        <div class="h-40 bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzA6uOZnyxeK0KsbKj9feBBZWpIJZRKVtpHbieFPu5Uoyrvv7FVI4UpxLNGha9XtMaBza5u6kQ2OvC_YmVj4rQmeT1cPH93tqGQvRg9rwdhRVs5zTJfHQ5n3VML-6It-cG20-SJyNMMWsZZ9-i75qHPUKUK9gf5kA96Rbpol71BS58KYQ3CulO1hzKfxSWCSBJs9j-w16I17z2h3mreCTROdcoAHGPwcnlqfbphtEf5_HxjQN8uzxVR1sTpsS4M86DYifPmvh56nM');"></div>
        <div class="p-6 flex flex-col gap-3 flex-1">
          <p class="text-xs uppercase tracking-wide text-orange-300">Content Systems • 7 min read</p>
          <h3 class="text-lg font-semibold leading-snug">AI-Powered Content Marketing: How to Generate Leads on Autopilot</h3>
          <p class="text-gray-300 text-sm flex-1">Use automation and AI to turn episodes into multi-channel lead gen.</p>
          <a href="/blog/ai-powered-content-marketing" class="inline-flex items-center mt-1 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] px-4 py-2 text-sm font-semibold text-black shadow-md hover:opacity-90 transition-all">Open Playbook →</a>
        </div>
      </article>

      <!-- Card 3 -->
      <article class="flex flex-col bg-black/35 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
        <div class="h-40 bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_oXrpO1n6EMg7g6c3qsNyGv8sV7SV8b-r7F1-qCR9kCVkk7Kk6ctjd3YTU2l0UghGSiS2RUYe3VBJuFcLUSLbCUezTtoj0xF-OouiXDlw5rhU_17PvW4235j7nMiE7jt8Gczv9JF4Ode2Ki0Pi0wyCpZA9DhEX0cV6sB3FEaENtzKHvG-QTs36S--yKEWM3u19xhMbS_3HGygHwwkuqxRhZhDd3QrbjRltyWJZWY4NDuvFSuRcIPnc0uGar4b8gURHIbRkS72FNo');"></div>
        <div class="p-6 flex flex-col gap-3 flex-1">
          <p class="text-xs uppercase tracking-wide text-orange-300">AEO / Local SEO • 6 min read</p>
          <h3 class="text-lg font-semibold leading-snug">The AEO Framework: How to Build a Personal Brand That Attracts Clients</h3>
          <p class="text-gray-300 text-sm flex-1">Position yourself for Miami search, zero-click results, and branded queries.</p>
          <a href="/blog/miami-aeo-framework" class="inline-flex items-center mt-1 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] px-4 py-2 text-sm font-semibold text-black shadow-md hover:opacity-90 transition-all">Open Playbook →</a>
        </div>
      </article>
    </div>
  </div>
</section>
```

## 11. FAQ / How It Works

**Background Image:**  
`https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(8).png?updatedAt=1761600049315`

**Section Title:**  
**Frequently Asked Questions — How Our 3-Step Content Engine Works**

**Intro Copy:**  
Our process is tailored for podcasters, consultants, and creators in the Miami market who want to simplify their content engine, stay consistent, and dominate local + digital discovery.

```html
<!-- FAQ / How It Works -->
<section class="relative py-24 text-white" style="background-image: url('https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(8).png?updatedAt=1761600049315'); background-size: cover; background-position: center;">
  <div class="max-w-5xl mx-auto px-6 text-center mb-12">
    <p class="uppercase text-sm tracking-wide text-orange-400 font-semibold mb-2">FAQ / How It Works</p>
    <h2 class="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions — How Our 3-Step Content Engine Works</h2>
    <p class="text-gray-200 max-w-3xl mx-auto">These are the questions we answer first on every strategy call.</p>
  </div>
  <div class="max-w-4xl mx-auto px-6 space-y-6">
    <div class="flex items-start gap-4 bg-black/70 border border-orange-500/10 rounded-2xl px-6 py-5">
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FFD700] flex items-center justify-center text-black font-bold text-lg mt-1">1</div>
      <div class="text-left">
        <h3 class="text-lg md:text-xl font-semibold mb-1 text-white">How do we start the content creation process?</h3>
        <p class="text-gray-300 leading-relaxed">We start with a content + offer strategy session, then map one recording day that becomes 30 days of omni-channel content.</p>
      </div>
    </div>
    <div class="flex items-start gap-4 bg-black/70 border border-orange-500/10 rounded-2xl px-6 py-5">
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FFD700] flex items-center justify-center text-black font-bold text-lg mt-1">2</div>
      <div class="text-left">
        <h3 class="text-lg md:text-xl font-semibold mb-1 text-white">What happens after recording?</h3>
        <p class="text-gray-300 leading-relaxed">Our team edits the long-form episode, pulls 6–12 micro clips, designs thumbnails, and preps captions. We can push to your scheduler for hands-free publishing.</p>
      </div>
    </div>
    <div class="flex items-start gap-4 bg-black/70 border border-orange-500/10 rounded-2xl px-6 py-5">
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FFD700] flex items-center justify-center text-black font-bold text-lg mt-1">3</div>
      <div class="text-left">
        <h3 class="text-lg md:text-xl font-semibold mb-1 text-white">How do AI systems fit into all of this?</h3>
        <p class="text-gray-300 leading-relaxed">We integrate AI + automation (MailerLite, n8n, Whop) so your show feeds your list, offers, and private communities automatically.</p>
      </div>
    </div>
  </div>
  <div class="text-center mt-10 flex justify-center gap-4">
    <a href="/book" class="bg-gradient-to-r from-[#FF4500] to-[#FFD700] text-black px-8 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition-all">Book Your Strategy</a>
    <a href="/packages" class="border border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:border-white transition-all bg-black/20">See Packages</a>
  </div>
</section>
```

## 11. Packages / Pricing (Place after Case Study, before FAQ)

```html
<section class="relative bg-[#000000] py-20 px-4 sm:px-6 lg:px-8 text-white">
  <div class="mx-auto max-w-6xl">
    <div class="text-center mb-16">
      <p class="text-xs font-bold uppercase tracking-widest text-white/60">Packages</p>
      <h2 class="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">Choose Your Growth Trajectory</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Starter -->
      <div class="border border-white/10 rounded-lg p-8 flex flex-col">
        <div class="flex-grow">
          <h3 class="text-2xl font-bold">Starter: Brand Foundation</h3>
          <p class="text-4xl font-extrabold my-6">$1,497</p>
          <p class="text-white/70 mb-8">One-time project to define your brand, audience, and core message. Perfect for new creators.</p>
          <ul class="space-y-4 text-sm">
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>Brand Strategy Workshop</span></li>
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>Audience Persona Development</span></li>
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>Content Pillar Identification</span></li>
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>Basic Media Kit</span></li>
          </ul>
        </div>
        <a href="/book" class="mt-8 block w-full text-center rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition">Get Started</a>
      </div>

      <!-- Growth (Most Popular) -->
      <div class="border border-[#ffa64d]/50 rounded-lg p-8 flex flex-col relative overflow-hidden ring-2 ring-[#ffa64d]/50 shadow-2xl shadow-[#ffa64d]/10">
        <div class="absolute top-0 right-0 -mr-1 mt-1">
          <div class="inline-flex items-center text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-bl-lg">Most Popular</div>
        </div>
        <div class="flex-grow">
          <h3 class="text-2xl font-bold">Growth: Content Engine Monthly</h3>
          <p class="text-4xl font-extrabold my-6">$2,497<span class="text-base font-medium text-white/50">/mo</span></p>
          <p class="text-white/70 mb-8">Full-service podcast production and content repurposing to fuel your brand's growth.</p>
          <ul class="space-y-4 text-sm">
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>4 Podcast Episodes/Month</span></li>
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>AI-Powered Content Repurposing</span></li>
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>Social Media Clip Creation</span></li>
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>Monthly Strategy &amp; Analytics</span></li>
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>Guest Outreach &amp; Coordination</span></li>
          </ul>
        </div>
        <a href="/book" class="mt-8 block w-full text-center rounded-full px-6 py-3 text-sm font-bold text-black bg-gradient-to-r from-[#FF4500] to-[#FFD700] hover:opacity-90 transition">Start Growing</a>
      </div>

      <!-- Scale -->
      <div class="border border-white/10 rounded-lg p-8 flex flex-col">
        <div class="flex-grow">
          <h3 class="text-2xl font-bold">Scale: AI Marketing Partner</h3>
          <p class="text-4xl font-extrabold my-6">$4,997</p>
          <p class="text-white/70 mb-8">A fully integrated partnership to scale your brand with cutting-edge AI marketing strategies.</p>
          <ul class="space-y-4 text-sm">
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>Everything in Growth, plus:</span></li>
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>AI-Driven Ad Campaigns</span></li>
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>Personalized Email Automation</span></li>
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>Advanced Performance Analytics</span></li>
            <li class="flex items-center gap-x-3"><span class="material-symbols-outlined text-[#ffa64d]">check_circle</span><span>Dedicated Brand Strategist</span></li>
          </ul>
        </div>
        <a href="/book" class="mt-8 block w-full text-center rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition">Book a Discovery Call</a>
      </div>
    </div>

    <p class="mt-8 text-center text-sm text-white/50">On-site recording available at 13700 NW 1st Ave, Miami, FL 33168.</p>
  </div>
</section>
```

## 12. Smart Data / Case Study

**Implementation note:** In build, place this section **after “10. Insights / Blog Grid”** and **before FAQ** for strongest conversion flow.

**Background Image:**  
`https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(4).png?updatedAt=1761600049303`

**Section Title:**  
**Why a Podcast Is the Smartest Marketing Investment of 2026**

**Intro Copy:**  
One recording day → a month of content and measurable pipeline. We combine podcast-first production, AI repurposing, and automated distribution to turn attention into leads.

```html
<!-- Case Study / Results (place after Insights, before FAQ) -->
<section
  class="relative w-full overflow-hidden py-16 sm:py-24 lg:py-32 text-white"
  style="background-image:url('https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(4).png?updatedAt=1761600049303');background-size:cover;background-position:center;"
>
  <!-- left-side readability overlay behind copy only -->
  <div class="absolute inset-y-0 left-0 w-full md:w-1/2 bg-black/45"></div>

  <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <!-- Copy -->
      <div class="flex flex-col items-start gap-6">
        <span class="font-bold uppercase tracking-wider text-[#FF7A33]">Real Results</span>
        <h2 class="text-4xl sm:text-5xl font-extrabold leading-tight">
          Why a Podcast Is the Smartest Marketing Investment of 2026
        </h2>
        <p class="text-base sm:text-lg text-gray-100/90 max-w-xl">
          One recording day → a month of content and measurable pipeline. We combine podcast-first
          production, AI repurposing, and automated distribution to turn attention into leads.
        </p>

        <ul class="mt-1 space-y-4 text-white">
          <li class="flex items-start gap-3">
            <span class="mt-0.5 h-2 w-2 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700]"></span>
            <span class="text-lg">34% Conversion Rate — highest of any content channel</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-0.5 h-2 w-2 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700]"></span>
            <span class="text-lg">+38% Revenue Growth — AI-powered podcast workflows</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-0.5 h-2 w-2 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700]"></span>
            <span class="text-lg">+89% Brand Awareness — outperforms traditional media</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-0.5 h-2 w-2 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700]"></span>
            <span class="text-lg">10% Guest → Client Conversion — predictable B2B leads</span>
          </li>
        </ul>

        <div class="mt-6 flex flex-wrap gap-4">
          <a
            href="/book"
            class="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] px-6 text-base font-bold text-black shadow-md hover:opacity-90 transition"
          >Book a Consultation</a>
          <a
            href="/insights"
            class="inline-flex h-12 items-center justify-center rounded-full px-6 text-base font-bold ring-2 ring-white/90 hover:bg-white/10 transition"
          >See Full Breakdown</a>
        </div>
      </div>

      <!-- Mockups -->
      <div class="relative h-[420px] sm:h-[520px]">
        <!-- back card -->
        <div class="absolute bottom-2 right-2 w-[68%] sm:w-[70%] -rotate-6">
          <img
            src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/AUDIO%20JONES%20IMAGE%20PHONE%20WITH%20CONTENT%20CREATORS%201.png?updatedAt=1762145968983"
            alt="Podcast phone mockups with creators — set 1"
            class="w-full h-auto rounded-2xl shadow-2xl"
            style="filter: drop-shadow(0 20px 30px rgba(0,0,0,.35));"
          />
        </div>
        <!-- front card -->
        <div class="absolute top-0 left-0 w-[72%] sm:w-[74%] rotate-6">
          <img
            src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/AUDIO%20JONES%20IMAGE%20PHONE%20WITH%20CONTENT%20CREATORS%202.png?updatedAt=1762145969059"
            alt="Podcast phone mockups with creators — set 2"
            class="w-full h-auto rounded-2xl shadow-2xl"
            style="filter: drop-shadow(0 24px 36px rgba(0,0,0,.45));"
          />
        </div>
      </div>
    </div>
  </div>
</section>
```

## 13. Newsletter / Join the List

**Background Image:**  
`https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(9).png?updatedAt=1761600050362`

```html
<section class="relative bg-cover bg-center bg-no-repeat py-20 sm:py-24" style="background-image: url('https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(9).png?updatedAt=1761600050362');">
  <div class="absolute inset-0 bg-black/70"></div>
  <div class="relative mx-auto max-w-[820px] px-6 text-center">
    <p class="text-sm font-bold uppercase tracking-[0.2em] text-[#FF4500]">Stay ahead in AI + Podcasting</p>
    <h2 class="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white max-w-3xl mx-auto mt-4">Get the Audio Jones playbooks before they drop.</h2>
    <p class="max-w-2xl mx-auto mt-4 text-lg text-gray-200">Weekly insights, creator case studies, and automation recipes delivered straight from the studio.</p>
    <form action="/api/subscribe" method="POST" class="mt-6 flex w-full max-w-lg mx-auto flex-col gap-4 sm:flex-row items-center justify-center" aria-label="Newsletter signup form">
      <label class="sr-only" for="email-address">Email address</label>
      <input id="email-address" name="email" type="email" required placeholder="Enter your best email" class="w-full flex-auto rounded-full border border-white/15 bg-[#1C1C1C] px-5 py-3.5 text-base text-white placeholder:text-gray-500 focus:border-[#FF4500] focus:outline-none focus:ring-2 focus:ring-[#FF4500]/50" />
      <button type="submit" class="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] px-8 py-3.5 text-sm font-bold text-black shadow-sm hover:opacity-90 transition-all">Join the List</button>
    </form>
    <p class="mt-3 text-xs text-gray-400">Powered by AJ DIGITAL LLC · Delivered via MailerLite · No spam, ever.</p>
  </div>
</section>

## 14. Why Audio Jones (Place after Newsletter, before Footer)

```html
<section class="relative overflow-hidden" style="background-image:linear-gradient(to bottom right,#1A0E00,#0B0B0B);">
  <div class="absolute -right-1/4 -top-1/4 h-[800px] w-[800px] bg-[radial-gradient(circle_at_center,rgba(255,68,0,0.15)_0%,rgba(255,68,0,0)_50%)]"></div>
  <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid w-full grid-cols-1 items-center gap-12 py-24 md:py-32 lg:grid-cols-2 lg:gap-16">
      <!-- Text -->
      <div class="flex flex-col gap-8 text-center lg:text-left">
        <p class="font-bold uppercase tracking-widest text-[#FF4500]">Why Audio Jones</p>
        <h2 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">The Studio That Builds Thought Leaders</h2>
        <p class="max-w-2xl text-lg text-gray-300 mx-auto lg:mx-0">Audio Jones bridges creativity, technology, and strategy — helping South Florida entrepreneurs, artists, and executives amplify their message through content systems that actually convert.</p>
        <ul class="flex flex-col gap-4 text-left">
          <li class="flex items-center gap-3"><span class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4500] to-[#FFD700]"><span class="material-symbols-outlined text-sm text-white">auto_awesome</span></span><span class="text-white">Proven AI + Automation Frameworks</span></li>
          <li class="flex items-center gap-3"><span class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4500] to-[#FFD700]"><span class="material-symbols-outlined text-sm text-white">podcasts</span></span><span class="text-white">Studio-Quality Podcast Production</span></li>
          <li class="flex items-center gap-3"><span class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4500] to-[#FFD700]"><span class="material-symbols-outlined text-sm text-white">content_copy</span></span><span class="text-white">Content Repurposing That Scales Authority</span></li>
          <li class="flex items-center gap-3"><span class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#FF4500] to-[#FFD700]"><span class="material-symbols-outlined text-sm text-white">badge</span></span><span class="text-white">Personal Branding, Simplified</span></li>
        </ul>
        <div class="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
          <a href="/book" class="inline-flex h-12 items-center justify-center rounded-full px-8 bg-gradient-to-r from-[#FF4500] to-[#FFD700] text-black text-base font-bold tracking-wide shadow-lg hover:scale-105 transition">Work With Audio Jones</a>
          <a href="/about" class="inline-flex h-12 items-center justify-center rounded-full px-8 ring-1 ring-inset ring-white text-white text-base font-bold hover:bg-white hover:text-black transition">Learn More</a>
        </div>
      </div>

      <!-- Image -->
      <div class="order-first lg:order-last">
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/audio-jones-hero.png?updatedAt=1761600050750" alt="Audio Jones — studio portrait" class="w-full rounded-lg shadow-2xl" />
      </div>
    </div>
  </div>
</section>
```

## 15. Footer (to be added)
