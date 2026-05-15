# AUDIO JONES — WEBSITE LAYOUT & STITCH PROMPTS (v1)

## GLOBAL COMPONENTS

### Header/Nav (final)
```html
<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out font-display bg-background-dark/80 backdrop-blur-lg border-b border-white/10" x-data="{ mobileMenuOpen: false }">
  <nav aria-label="Global" class="container mx-auto px-6 lg:px-8">
    <div class="flex h-20 items-center justify-between">
      <div class="flex items-center">
        <a href="/" class="-m-1.5 p-1.5 flex items-center gap-2">
          <span class="sr-only">Audio Jones</span>
          <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/AUDIO_JONES_LOGO_2025/AUDIO_JONES_LOGO_2025_HORIZONTAL_TRANSPARENT.png?updatedAt=1761669548119" alt="Audio Jones Logo" class="h-8 w-auto" loading="eager" decoding="async" />
        </a>
      </div>
      <div class="flex md:hidden">
        <button @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Toggle main menu" type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
          <span class="sr-only">Open main menu</span>
          <span class="material-symbols-outlined" x-show="!mobileMenuOpen">menu</span>
          <span class="material-symbols-outlined hidden" x-show="mobileMenuOpen">close</span>
        </button>
      </div>
      <div class="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-x-10">
        <a href="/" class="text-sm font-semibold text-white/80 hover:text-white transition">Home</a>
        <a href="/services" class="text-sm font-semibold text-white/80 hover:text-white transition">Services</a>
        <a href="/podcast" class="text-sm font-semibold text-white/80 hover:text-white transition">Podcast</a>
        <a href="/insights" class="text-sm font-semibold text-white/80 hover:text-white transition">Insights</a>
        <a href="/about" class="text-sm font-semibold text-white/80 hover:text-white transition">About</a>
        <a href="/book" class="rounded-full px-4 py-2 text-sm font-bold text-black bg-gradient-to-r from-[#FF4500] to-[#FFD700] hover:opacity-90 transition">Book a Call</a>
        <a href="/portal" class="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20 transition">Portal</a>
      </div>
    </div>
  </nav>
  <div x-show="mobileMenuOpen" @click.away="mobileMenuOpen=false" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 -translate-y-4" x-transition:enter-end="opacity-100 translate-y-0" x-transition:leave="transition ease-in duration-150" x-transition:leave-start="opacity-100 translate-y-0" x-transition:leave-end="opacity-0 -translate-y-4" class="md:hidden bg-background-dark border-t border-white/10">
    <div class="px-6 py-6 space-y-4">
      <a href="/" class="block text-base font-semibold text-white/80 hover:text-white">Home</a>
      <a href="/services" class="block text-base font-semibold text-white/80 hover:text-white">Services</a>
      <a href="/podcast" class="block text-base font-semibold text-white/80 hover:text-white">Podcast</a>
      <a href="/insights" class="block text-base font-semibold text-white/80 hover:text-white">Insights</a>
      <a href="/about" class="block text-base font-semibold text-white/80 hover:text-white">About</a>
      <div class="pt-4 border-t border-white/10 space-y-3">
        <a href="/book" class="block text-center rounded-full px-4 py-3 text-base font-bold text-black bg-gradient-to-r from-[#FF4500] to-[#FFD700] hover:opacity-90">Book a Call</a>
        <a href="/portal" class="block text-center rounded-full bg-white/10 px-4 py-3 text-base font-bold text-white hover:bg-white/20">Portal</a>
      </div>
    </div>
  </div>
</header>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

---

## PAGE STRUCTURE

### Homepage (`/`)
Sections:
1. Hero (Parallax)
2. Authority Metrics
3. 3-Step System
4. Testimonials
5. Podcast Gallery
6. Final CTA Band

### Other Pages
- **/services** — Whop API cards + FAQ
- **/podcast** — Featured episode, grid gallery
- **/insights** — Blog/resource hub
- **/about** — Founder, story, timeline, partners
- **/book** — Cal.com embed
- **/contact** — Form + social links
- **/legal** — Terms + Privacy templates

---

## DEPLOY FLOW
1. Build in Stitch AI → copy HTML here.
2. Export `.md` → Codex deploy.
3. Command: `codex run -f codex.deploy.yml deploy`.

---

## TESTIMONIALS — SOCIAL PROOF SECTION
```html
<section class="w-full bg-[#111111] py-16 sm:py-24">
  <div class="mx-auto max-w-5xl px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <h4 class="text-sm font-bold uppercase tracking-widest gradient-text">CLIENT RESULTS</h4>
      <h2 class="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Trusted by South Florida Leaders & Creators</h2>
      <p class="mt-6 text-lg leading-8 text-white/80">Discover the impact of a streamlined system from leaders who have transformed their brand presence.</p>
    </div>

    <div class="mx-auto mt-24 grid max-w-lg grid-cols-1 gap-y-20 gap-x-8 lg:max-w-none lg:grid-cols-3">
      <!-- Abebe Lewis -->
      <div class="flex flex-col relative transform -rotate-2">
        <div class="deconstructed-avatar-frame">
          <img alt="Abebe Lewis" class="h-16 w-16 object-cover" src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Client%20Testiomonials/ABEBE_LEWIS_MAGE_PROFILE_2025_2.png?updatedAt=1761600050240"/>
        </div>
        <div class="deconstructed-card-border">
          <div class="flex h-full flex-col bg-[#1c1c1c] p-8 pt-12">
            <blockquote class="flex-grow text-lg leading-7 text-white/80">
              <p>“Audio Jones helped redefine how our studio tells its story. The system streamlined our content flow and improved how we reach new audiences.”</p>
            </blockquote>
            <cite class="mt-6 pt-6 border-t border-white/10 not-italic font-semibold text-white">Abebe Lewis, Music Executive of Circle House Studio</cite>
          </div>
        </div>
      </div>

      <!-- K Foxx -->
      <div class="flex flex-col relative transform rotate-1 lg:mt-8">
        <div class="deconstructed-avatar-frame right-[-1rem]">
          <img alt="K Foxx" class="h-16 w-16 object-cover" src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Client%20Testiomonials/KFOXX_IMAGE_PROFILE_2025.png?updatedAt=1761600050591"/>
        </div>
        <div class="deconstructed-card-border">
          <div class="flex h-full flex-col bg-[#1c1c1c] p-8 pt-12">
            <blockquote class="flex-grow text-lg leading-7 text-white/80">
              <p>“Working with Audio Jones brought a new level of quality and clarity to my brand. The process was creative, professional, and results-driven.”</p>
            </blockquote>
            <cite class="mt-6 pt-6 border-t border-white/10 not-italic font-semibold text-white">K Foxx, Radio Personality at 99Jamz</cite>
          </div>
        </div>
      </div>

      <!-- Michael Keegan -->
      <div class="flex flex-col relative transform rotate-2 lg:-mt-4">
        <div class="deconstructed-avatar-frame">
          <img alt="Michael Keegan" class="h-16 w-16 object-cover" src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Client%20Testiomonials/MIKE_KEEGAN_IMAGE_PROFILE_2025.png?updatedAt=1761600050350"/>
        </div>
        <div class="deconstructed-card-border">
          <div class="flex h-full flex-col bg-[#1c1c1c] p-8 pt-12">
            <blockquote class="flex-grow text-lg leading-7 text-white/80">
              <p>“They delivered more than marketing — they built systems that automate our message and free us to focus on serving clients.”</p>
            </blockquote>
            <cite class="mt-6 pt-6 border-t border-white/10 not-italic font-semibold text-white">Michael Keegan, Owner of Florida Ramp & Lift</cite>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-20 text-center">
      <a href="#book" class="inline-block gradient-button px-10 py-4 text-base font-bold text-white transition-transform duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#111111] focus:ring-orange-500/50">Start Your Studio System</a>
    </div>
  </div>
</section>
```

---

Next: integrate Footer section + MailerLite subscription block.


---

## HOMEPAGE STACK — FINAL ORDER & NOTES

**Order:**
1) Header/Nav  
2) Hero (Parallax)  
3) Authority Metrics / AI Noise  
4) Scrolling Brand Logos  
5) Problem/Agitation  
6) 3‑Step System  
7) Services Grid  
8) Testimonials  
9) Podcast Gallery  
10) Final CTA Band  
11) Footer + MailerLite

**SEO/AEO:** Use primary keywords in H1/H2, JSON‑LD for `Organization`, `Service`, `Review`, `VideoObject`, `FAQPage`. Add internal links to `/services`, `/book`, and `/podcast`.

---

## Scrolling Brand Logos — Snippet
```html
<section id="brands" class="bg-black py-10 border-y border-white/10">
  <div class="max-w-7xl mx-auto px-6 overflow-hidden">
    <h3 class="text-center text-white/70 text-sm tracking-widest mb-6 uppercase">Trusted by Brands & Partners</h3>

    <!-- marquee container -->
    <div class="relative">
      <!-- track duplicated for seamless loop -->
      <div class="flex items-center gap-12 whitespace-nowrap will-change-transform animate-scroll">
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/1CH1LIFE.png?updatedAt=1761672546290" alt="1CH1 Life" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/QUALITY%20CONTROL.png?updatedAt=1761672351054" alt="Quality Control" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/GOOGLE.png?updatedAt=1761672351007" alt="Google" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/INNER%20CRICLE.png?updatedAt=1761672350978" alt="Inner Circle" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/POTIERI.png?updatedAt=1761672351038" alt="Potieri" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/WE%20THE%20BEST.png?updatedAt=1761672350945" alt="We The Best" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/FRL.png?updatedAt=1761672351377" alt="Florida Ramp & Lift" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/LIVE%20HOUSE.png?updatedAt=1761672350948" alt="Live House" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/UNIVERSAL%20MUSIC.png?updatedAt=1761672350908" alt="Universal Music" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/CASH%20%20MONEY.png?updatedAt=1761672350863" alt="Cash Money Records" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/ABEBE%20LEWIS.png?updatedAt=1761672350896" alt="Abebe Lewis" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/CAPITAL.png?updatedAt=1761672350877" alt="Capitol Records" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/MOTWON%20UNIVERSAL.png?updatedAt=1761672350812" alt="Motown / Universal" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/TYLAN.png?updatedAt=1761672350759" alt="Tylan" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/THE%20ORCHARD.png?updatedAt=1761672350733" alt="The Orchard" class="h-8 opacity-70 hover:opacity-100 transition" />
        <!-- duplicate set for infinite loop -->
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/1CH1LIFE.png?updatedAt=1761672546290" alt="1CH1 Life" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/QUALITY%20CONTROL.png?updatedAt=1761672351054" alt="Quality Control" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/GOOGLE.png?updatedAt=1761672351007" alt="Google" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/INNER%20CRICLE.png?updatedAt=1761672350978" alt="Inner Circle" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/POTIERI.png?updatedAt=1761672351038" alt="Potieri" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/WE%20THE%20BEST.png?updatedAt=1761672350945" alt="We The Best" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/FRL.png?updatedAt=1761672351377" alt="Florida Ramp & Lift" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/LIVE%20HOUSE.png?updatedAt=1761672350948" alt="Live House" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/UNIVERSAL%20MUSIC.png?updatedAt=1761672350908" alt="Universal Music" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/CASH%20%20MONEY.png?updatedAt=1761672350863" alt="Cash Money Records" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/ABEBE%20LEWIS.png?updatedAt=1761672350896" alt="Abebe Lewis" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/CAPITAL.png?updatedAt=1761672350877" alt="Capitol Records" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/MOTWON%20UNIVERSAL.png?updatedAt=1761672350812" alt="Motown / Universal" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/TYLAN.png?updatedAt=1761672350759" alt="Tylan" class="h-8 opacity-70 hover:opacity-100 transition" />
        <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/client%20logos/THE%20ORCHARD.png?updatedAt=1761672350733" alt="The Orchard" class="h-8 opacity-70 hover:opacity-100 transition" />
      </div>
    </div>
  </div>
</section>
<style>
@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.animate-scroll { animation: scroll 45s linear infinite; }
</style>
```

**Placement:** Insert after **Authority Metrics / AI Noise** and before **Problem/Agitation**.

---

## Notes for Codex
- Replace hard-coded `/assets/logos/*.svg` from earlier example with the ImageKit URLs above (already done).  
- Keep alt text accurate for accessibility and SEO.  
- Ensure the marquee container is wide and overflow-hidden to avoid vertical jank on mobile.


---

## FOOTER + NEWSLETTER (MailerLite)
```html
<footer class="bg-black border-t border-white/10">
  <div class="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
    <!-- Brand -->
    <div>
      <img src="https://ik.imagekit.io/audiojones/AUDIOJONES.COM/AUDIO_JONES_LOGO_2025/AUDIO_JONES_LOGO_2025_HORIZONTAL_TRANSPARENT.png?updatedAt=1761669548119" alt="Audio Jones" class="h-8 w-auto" />
      <p class="mt-4 text-white/60 text-sm max-w-sm">Brand strategy, podcast production, and AI marketing systems built in South Florida.</p>
    </div>

    <!-- Nav -->
    <div>
      <h4 class="text-white font-bold mb-4">Navigate</h4>
      <ul class="space-y-2 text-white/75 text-sm">
        <li><a href="/services" class="hover:text-white">Services</a></li>
        <li><a href="/podcast" class="hover:text-white">Podcast</a></li>
        <li><a href="/insights" class="hover:text-white">Insights</a></li>
        <li><a href="/about" class="hover:text-white">About</a></li>
        <li><a href="/book" class="hover:text-white">Book a Call</a></li>
      </ul>
    </div>

    <!-- Social -->
    <div>
      <h4 class="text-white font-bold mb-4">Follow</h4>
      <ul class="space-y-2 text-white/75 text-sm">
        <li><a href="#" class="hover:text-white">YouTube</a></li>
        <li><a href="#" class="hover:text-white">Instagram</a></li>
        <li><a href="#" class="hover:text-white">LinkedIn</a></li>
        <li><a href="#" class="hover:text-white">X</a></li>
      </ul>
    </div>

    <!-- Newsletter (MailerLite) -->
    <div>
      <h4 class="text-white font-bold mb-4">Join the newsletter</h4>
      <form id="ml-subscribe" class="space-y-3" onsubmit="return false;">
        <input type="email" placeholder="you@example.com" class="w-full rounded-full bg-white/10 border border-white/20 px-4 h-11 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500" />
        <button class="w-full h-11 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] text-black font-bold">Subscribe</button>
        <p class="text-xs text-white/50">By subscribing, you agree to our <a href="/legal/privacy" class="underline">Privacy Policy</a>.</p>
      </form>
      <!-- Replace with MailerLite embed or API call in Next.js -->
    </div>
  </div>
  <div class="border-t border-white/10 py-6 text-center text-white/50 text-xs">© <span id="year"></span> AJ DIGITAL LLC. All rights reserved. <a href="/legal/terms" class="underline ml-2">Terms</a> · <a href="/legal/privacy" class="underline">Privacy</a></div>
</footer>
<script>document.getElementById('year').textContent = new Date().getFullYear();</script>
```

---

## OTHER PAGES & ROUTES SPEC

### `/services` — Whop-powered Offers
```html
<section class="bg-[#0A0A0A] py-16">
  <div class="max-w-7xl mx-auto px-6">
    <h1 class="text-4xl font-extrabold text-white mb-8">What We Build</h1>
    <p class="text-white/70 mb-10">Three pillars to grow authority and revenue.</p>
    <div id="services-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Cards rendered from Whop API response -->
    </div>
  </div>
</section>
<!-- Next.js notes: create /api/whop/products, fetch on server, render cards with checkout links -->
```

### `/podcast` — Featured + Gallery
```html
<section class="bg-black py-16">
  <div class="max-w-7xl mx-auto px-6">
    <h1 class="text-4xl font-extrabold text-white mb-8">The Audio Jones Podcast</h1>
    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <!-- Featured video embed (YouTube) with VideoObject schema -->
        <div class="aspect-video rounded-lg overflow-hidden border border-white/10">
          <iframe class="w-full h-full" src="https://www.youtube.com/embed/VIDEO_ID" title="Featured Episode" allowfullscreen></iframe>
        </div>
      </div>
      <aside class="space-y-4">
        <!-- Recent episodes list -->
        <a class="block p-4 border border-white/10 rounded-lg hover:bg-white/5" href="#">Episode Title →</a>
      </aside>
    </div>
  </div>
</section>
```

### `/insights` — Blog/Resource Hub
```html
<section class="bg-[#0A0A0A] py-16">
  <div class="max-w-7xl mx-auto px-6">
    <h1 class="text-4xl font-extrabold text-white mb-8">Insights</h1>
    <div id="posts" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Cards: title, excerpt, tags, date -->
    </div>
  </div>
</section>
<!-- Next.js notes: /insights uses MDX or CMS. Add JSON-LD Article schema per post. -->
```

### `/about` — Story + Partners
```html
<section class="bg-black py-16">
  <div class="max-w-5xl mx-auto px-6 space-y-10">
    <h1 class="text-4xl font-extrabold text-white">About Audio Jones</h1>
    <p class="text-white/75">Short founder story. Mission. Studio details. Partner logos.</p>
    <div class="grid sm:grid-cols-2 gap-6">
      <div class="p-6 border border-white/10 rounded-lg">Timeline / milestones</div>
      <div class="p-6 border border-white/10 rounded-lg">Studio & partners</div>
    </div>
  </div>
</section>
```

### `/book` — Cal.com Embed
```html
<section class="bg-[#0A0A0A] py-16">
  <div class="max-w-3xl mx-auto px-6">
    <h1 class="text-3xl font-bold text-white mb-6">Book a Strategy Call</h1>
    <div class="border border-white/10 rounded-xl overflow-hidden">
      <!-- Replace USERNAME -->
      <iframe src="https://cal.com/USERNAME" class="w-full h-[900px] bg-black"></iframe>
    </div>
  </div>
</section>
```

### `/contact` — Contact + Social
```html
<section class="bg-black py-16">
  <div class="max-w-3xl mx-auto px-6 space-y-6">
    <h1 class="text-3xl font-bold text-white">Contact</h1>
    <form class="space-y-4">
      <input class="w-full h-11 rounded-lg bg-white/10 border border-white/20 px-4 text-white" placeholder="Name"/>
      <input class="w-full h-11 rounded-lg bg-white/10 border border-white/20 px-4 text-white" placeholder="Email"/>
      <textarea class="w-full rounded-lg bg-white/10 border border-white/20 px-4 text-white h-36" placeholder="How can we help?"></textarea>
      <button class="h-11 px-6 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] text-black font-bold">Send</button>
    </form>
  </div>
</section>
```

### `/portal` — Client Dashboard (Auth required)
```html
<section class="bg-[#0A0A0A] min-h-screen py-10">
  <div class="max-w-7xl mx-auto px-6">
    <h1 class="text-2xl font-bold text-white mb-6">Client Portal</h1>
    <div class="grid lg:grid-cols-5 gap-6">
      <aside class="lg:col-span-1 space-y-2">
        <a href="#overview" class="block px-4 py-2 rounded bg-white/5 hover:bg-white/10">Overview</a>
        <a href="#bookings" class="block px-4 py-2 rounded bg-white/5 hover:bg-white/10">Bookings</a>
        <a href="#contracts" class="block px-4 py-2 rounded bg-white/5 hover:bg-white/10">Contracts</a>
        <a href="#invoices" class="block px-4 py-2 rounded bg-white/5 hover:bg-white/10">Invoices</a>
        <a href="#files" class="block px-4 py-2 rounded bg-white/5 hover:bg-white/10">Files</a>
        <a href="#admin" class="block px-4 py-2 rounded bg-white/5 hover:bg-white/10">Admin</a>
      </aside>
      <main class="lg:col-span-4 space-y-6">
        <div id="overview" class="p-6 border border-white/10 rounded-xl">Overview widgets</div>
        <div id="bookings" class="p-6 border border-white/10 rounded-xl">Bookings table</div>
        <div id="contracts" class="p-6 border border-white/10 rounded-xl">Contracts & eSign</div>
        <div id="invoices" class="p-6 border border-white/10 rounded-xl">Stripe invoices & subscriptions</div>
        <div id="files" class="p-6 border border-white/10 rounded-xl">Files (ImageKit URLs)</div>
        <div id="admin" class="p-6 border border-white/10 rounded-xl">Admin controls</div>
      </main>
    </div>
  </div>
</section>
```

### `/404` — Not Found
```html
<section class="min-h-screen bg-black flex items-center justify-center text-center px-6">
  <div>
    <h1 class="text-7xl font-extrabold text-white">404</h1>
    <p class="mt-4 text-white/70">Page not found. Let’s get you back on track.</p>
    <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/" class="px-6 h-11 rounded-full bg-gradient-to-r from-[#FF4500] to-[#FFD700] text-black font-bold">Go Home</a>
      <a href="/book" class="px-6 h-11 rounded-full bg-white/10 text-white font-bold hover:bg-white/20">Book a Call</a>
    </div>
  </div>
</section>
```

---

## API ENDPOINT MAP (Next.js ↔ Functions ↔ External)

```txt
# Next.js (app/api/*) → Firebase Functions proxies where needed
POST /api/stripe/webhook        -> functions: stripeWebhook
POST /api/calcom/webhook        -> functions: calcomWebhook
POST /api/contracts/generate    -> functions: generateContract
POST /api/contracts/links       -> functions: getDriveLinks
GET  /api/whop/products         -> fetch Whop API (server-side) and cache
POST /api/newsletter/subscribe  -> call MailerLite API
GET  /api/podcast/feed          -> YouTube API fetch, cache in Firestore (optional)
```

**Collections (recap):** `users`, `bookings`, `contracts`, `payments`, `subscriptions`, `files`, `testimonials`.

**Notes:**
- Whop API keys in Vercel env. Render `/services` from SSR fetch.
- MailerLite: use server route to avoid exposing key. Validate email, return status.
- Add JSON-LD generators per route in `<head>` using Next.js metadata.


---

## SUBSTACK RSS INTEGRATION

**Feed URL:** `https://audiojones.substack.com/feed`

### Env
```bash
# .env / Vercel
SUBSTACK_FEED_URL=https://audiojones.substack.com/feed
```

### Server parser
```ts
// lib/getSubstackFeed.ts
import Parser from "rss-parser";
const parser = new Parser();

export async function getSubstackFeed() {
  const url = process.env.SUBSTACK_FEED_URL!;
  const feed = await parser.parseURL(url);
  return feed.items.map(i => ({
    id: i.guid || i.link || String(i.isoDate || i.pubDate),
    title: i.title || "",
    link: i.link || "",
    date: i.isoDate || i.pubDate || "",
    excerpt: (i.contentSnippet || "").slice(0, 200),
  }));
}
```

### API route (ISR cached)
```ts
// app/api/insights/feed/route.ts
import { NextResponse } from "next/server";
import { getSubstackFeed } from "@/lib/getSubstackFeed";

export const revalidate = 3600; // seconds

export async function GET() {
  const items = await getSubstackFeed();
  return NextResponse.json({ items }, { status: 200 });
}
```

### Insights page renderer
```tsx
// app/insights/page.tsx
import Link from "next/link";
import { getSubstackFeed } from "@/lib/getSubstackFeed";

export const revalidate = 3600;

export default async function InsightsPage() {
  const posts = await getSubstackFeed();
  return (
    <section className="bg-[#0A0A0A] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-white mb-8">Insights</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(p => (
            <Link key={p.id} href={p.link} target="_blank" className="p-6 border border-white/10 rounded-lg hover:bg-white/5">
              <h3 className="text-white font-bold line-clamp-2">{p.title}</h3>
              <p className="text-white/70 text-sm mt-2 line-clamp-3">{p.excerpt}</p>
              <p className="text-white/40 text-xs mt-3">{p.date ? new Date(p.date).toLocaleDateString() : ""}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Metadata
```tsx
// app/layout.tsx (partial)
export const metadata = {
  alternates: { types: { "application/rss+xml": process.env.SUBSTACK_FEED_URL } },
};
```

### Codex tasks
```bash
# add env
vercel env add SUBSTACK_FEED_URL
# install parser
npm i rss-parser
# deploy
codex run -f codex.deploy.yml deploy
```

**Notes:** Keep canonical links to Substack. When you later ingest posts locally, add JSON‑LD `Article` per post.

