export default function LegalBand() {
  const legalLinks = [
    { text: "Privacy Policy", href: "/privacy" },
    { text: "Terms of Service", href: "/terms" },
    { text: "Cancellation & Refund Policy", href: "/cancellation" },
    { text: "Cookie Notice", href: "/cookie-policy" }
  ]

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        {/* Footer CTA */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to build your{" "}
            <span className="text-[#E8FF5A]">Audio Jones</span> system?
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#E8FF5A] hover:bg-[#E8FF5A]/90 text-[#080808] font-semibold rounded-lg transition-colors duration-200"
            >
              Book Intake Call
            </a>
            <a
              href="/packages"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#F0FF85] text-[#F0FF85] hover:bg-[#F0FF85] hover:text-black font-semibold rounded-lg transition-colors duration-200"
            >
              View Packages
            </a>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Legal Navigation */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-[#008080] text-sm transition-colors duration-200"
                >
                  {link.text}
                </a>
              ))}
            </div>

            {/* Florida Business Disclosure */}
            <div className="text-gray-400 text-sm text-center lg:text-right">
              <p>AJ DIGITAL LLC • 20028 NW 64th PL, Hialeah, FL 33015</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Audio Jones. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  )
}