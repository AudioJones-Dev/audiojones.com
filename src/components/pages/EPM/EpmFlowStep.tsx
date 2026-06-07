interface EpmFlowStepProps {
  step: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  icon?: string;
}

export default function EpmFlowStep({ step, title, description, icon }: EpmFlowStepProps) {
  return (
    <div className="relative">
      {/* Connection Line (except for last step) */}
      {step < 4 && (
        <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#E8FF5A] to-[#4DACFF] transform translate-x-1/2 z-0"></div>
      )}

      {/* Step Content */}
      <div className="relative z-10 text-center">
        {/* Step Number & Icon */}
        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[#E8FF5A] to-[#4DACFF] rounded-full mb-6 shadow-lg">
          <div className="text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-white font-bold text-lg">Step {step}</div>
          </div>
        </div>

        {/* Step Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>

        {/* Step Description */}
        <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>
    </div>
  );
}