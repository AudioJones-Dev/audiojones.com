interface EpmExplainerProps {
  title: string;
  content: string;
  problemList: string[];
}

export default function EpmExplainer({ title, content, problemList }: EpmExplainerProps) {
  return (
    <section id="explainer" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {content}
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-signal-yellow hover:bg-signal-soft text-bg-base font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                See How It Works
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                Download Whitepaper
              </button>
            </div>
          </div>

          {/* Right Column - Problem List */}
          <div className="bg-gray-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              The Problems We Solve
            </h3>
            <ul className="space-y-4">
              {problemList.map((problem, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{problem}</p>
                </li>
              ))}
            </ul>
            
            {/* Solution Preview */}
            <div className="mt-8 p-4 bg-gradient-to-r from-[#E8FF5A]/10 to-[#4DACFF]/10 rounded-lg border border-[#E8FF5A]/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-gradient-to-r from-[#E8FF5A] to-[#4DACFF] rounded-full"></div>
                <span className="font-semibold text-gray-900">EPM Solution</span>
              </div>
              <p className="text-sm text-gray-600">
                Transform these challenges into opportunities with emotional intelligence, 
                predictive analytics, and automated optimization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}