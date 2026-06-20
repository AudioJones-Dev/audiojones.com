export type GravityLayerId =
  | "decision"
  | "approval"
  | "accountability"
  | "revenue"
  | "memory"
  | "execution";

export type FounderGravityStage =
  | "identification"
  | "symptom_recognition"
  | "dependency_mapping"
  | "operational_exposure";

export type FounderGravityQuestionRole =
  | "firmographic"
  | "self_perception"
  | "layer_item"
  | "scenario";

export type FounderGravityResponseOption = {
  value: string;
  label: string;
  score?: number;
  layerScores?: Partial<Record<GravityLayerId, number>>;
  fragilityZone?: string;
};

export type FounderGravityQuestion = {
  id: string;
  code: string;
  role: FounderGravityQuestionRole;
  stage: FounderGravityStage;
  prompt: string;
  layer?: GravityLayerId;
  weight?: number;
  options: FounderGravityResponseOption[];
};

export type FounderGravitySegment =
  | "Orbit"
  | "High Pull"
  | "Drift"
  | "Stabilizing"
  | "Distributed";

export type FounderGravityCta = {
  label: string;
  event: string;
  href: string;
  pathway: string;
};

export type FounderGravityResult = {
  segment: FounderGravitySegment;
  gravityLoad: number;
  layerScores: Record<GravityLayerId, number>;
  topLayers: GravityLayerId[];
  highestLayer: GravityLayerId;
  topFragilityZone: string;
  strongestContradictionSignal: string;
  resonanceZone: GravityLayerId;
  confidenceScore: number;
  completedQuestionCount: number;
  totalQuestionCount: number;
  suppression: {
    suppressed: boolean;
    reason:
      | "low_confidence_score"
      | "speedrun_completion"
      | "consent_withdrawn"
      | "internal_test_traffic"
      | "self_perception_noise"
      | null;
  };
  cta: FounderGravityCta;
};

export type FounderGravityAttribution = {
  acquisitionChannel?: string;
  sourcePage?: string;
  referrer?: string;
  landingPath?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

export type FounderGravityLeadInput = {
  email: string;
  displayName: string;
  entityName: string;
  consentToContact: boolean;
  sessionId: string;
  answers: Record<string, string>;
  durationSeconds?: number;
  attribution?: FounderGravityAttribution;
  events?: Array<{
    event: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
  }>;
  website_url?: string;
};
