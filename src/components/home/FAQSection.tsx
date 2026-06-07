export default function FAQSection() {
  return (
    <section 
      className="relative py-24 text-white" 
      style={{
        backgroundImage: "url('https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(8).png?updatedAt=1761600049315')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative max-w-5xl mx-auto px-6 text-center mb-12">
        <p className="uppercase text-sm tracking-wide text-signal-yellow font-semibold mb-2">
          FAQ / How It Works
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Frequently Asked Questions — How Our 3-Step Content Engine Works
        </h2>
        <p className="text-text-muted max-w-3xl mx-auto">
          These are the questions we answer first on every strategy call.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 space-y-6">
        <div className="flex items-start gap-4 bg-black/70 border border-border-subtle rounded-2xl px-6 py-5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8FF5A] to-[#4DACFF] flex items-center justify-center text-black font-bold text-lg mt-1">
            1
          </div>
          <div className="text-left">
            <h3 className="text-lg md:text-xl font-semibold mb-1 text-white">
              How do we start the content creation process?
            </h3>
            <p className="text-text-muted leading-relaxed">
              We start with a content + offer strategy session, then map one recording day that becomes 30 days of omni-channel content.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-black/70 border border-border-subtle rounded-2xl px-6 py-5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8FF5A] to-[#4DACFF] flex items-center justify-center text-black font-bold text-lg mt-1">
            2
          </div>
          <div className="text-left">
            <h3 className="text-lg md:text-xl font-semibold mb-1 text-white">
              What happens after recording?
            </h3>
            <p className="text-text-muted leading-relaxed">
              Our team edits the long-form episode, pulls 6–12 micro clips, designs thumbnails, and preps captions. We can push to your scheduler for hands-free publishing.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-black/70 border border-border-subtle rounded-2xl px-6 py-5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8FF5A] to-[#4DACFF] flex items-center justify-center text-black font-bold text-lg mt-1">
            3
          </div>
          <div className="text-left">
            <h3 className="text-lg md:text-xl font-semibold mb-1 text-white">
              How do AI systems fit into all of this?
            </h3>
            <p className="text-text-muted leading-relaxed">
              We integrate AI + automation (MailerLite, n8n, Whop) so your show feeds your list, offers, and private communities automatically.
            </p>
          </div>
        </div>
      </div>

      <div className="relative text-center mt-10 flex justify-center gap-4">
        <a 
          href="/book" 
          className="bg-signal-yellow hover:bg-signal-soft text-black px-8 py-3 rounded-full font-semibold shadow-md transition-all"
        >
          Book Your Strategy
        </a>
        <a 
          href="/packages" 
          className="border border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:border-white transition-all bg-black/20"
        >
          See Packages
        </a>
      </div>
    </section>
  );
}