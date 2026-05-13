import EpmFlowStep from './EpmFlowStep';

interface EpmFlowStepData {
  step: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  icon?: string;
}

interface EpmFlowProps {
  steps: EpmFlowStepData[];
}

export default function EpmFlow({ steps }: EpmFlowProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How EPM Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our four-step framework transforms traditional marketing into 
            emotionally intelligent, predictive systems that build authentic connections.
          </p>
        </div>

        {/* Flow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step) => (
            <EpmFlowStep
              key={step.step}
              {...step}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6">
            Ready to experience the future of marketing?
          </p>
          <button className="bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] hover:from-[#d4eb3a] hover:to-[#F0FF85] text-[#080808] font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
            Join the EPM Revolution
          </button>
        </div>
      </div>
    </section>
  );
}