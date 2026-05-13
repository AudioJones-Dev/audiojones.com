import { testimonials } from "@/data/testimonials"

export default function Testimonials() {
  return (
    <section id="proof" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            What <span className="text-[#E8FF5A]">Clients Say</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From boring businesses to creators, results stay the same — predictable growth.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-[#F0FF85]/30 transition-colors duration-300"
            >
              {/* Quote */}
              <blockquote className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Client Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      const initials = testimonial.name.split(' ').map(n => n[0]).join('');
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.innerHTML = `<div class="w-full h-full bg-[#E8FF5A] text-[#080808] flex items-center justify-center font-semibold">${initials}</div>`;
                      }
                    }}
                  />
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-[#F0FF85]">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}