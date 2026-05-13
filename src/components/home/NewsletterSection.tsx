export default function NewsletterSection() {
  return (
    <section 
      className="relative bg-cover bg-center bg-no-repeat py-20 sm:py-24" 
      style={{
        backgroundImage: "url('https://ik.imagekit.io/audiojones/AUDIOJONES.COM/assets/Backgrounds/Audio_Jones_Website_Backgrounds_%20(9).png?updatedAt=1761600050362')"
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative mx-auto max-w-[820px] px-6 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E8FF5A]">
          Stay ahead in AI + Podcasting
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white max-w-3xl mx-auto mt-4">
          Get the Audio Jones playbooks before they drop.
        </h2>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-200">
          Weekly insights, creator case studies, and automation recipes delivered straight from the studio.
        </p>
        
        <form 
          action="/api/newsletter/subscribe" 
          method="POST" 
          className="mt-6 flex w-full max-w-lg mx-auto flex-col gap-4 sm:flex-row items-center justify-center" 
          aria-label="Newsletter signup form"
        >
          <label className="sr-only" htmlFor="email-address">Email address</label>
          <input 
            id="email-address" 
            name="email" 
            type="email" 
            required 
            placeholder="Enter your best email" 
            className="w-full flex-auto rounded-full border border-white/15 bg-[#1C1C1C] px-5 py-3.5 text-base text-white placeholder:text-gray-500 focus:border-[#E8FF5A] focus:outline-none focus:ring-2 focus:ring-[#E8FF5A]/50" 
          />
          <button 
            type="submit" 
            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] px-8 py-3.5 text-sm font-bold text-black shadow-sm hover:opacity-90 transition-all"
          >
            Join the List
          </button>
        </form>
        
        <p className="mt-3 text-xs text-gray-400">
          Powered by AJ DIGITAL LLC · Delivered via MailerLite · No spam, ever.
        </p>
      </div>
    </section>
  );
}