export type Maturity = "Strong" | "Partial" | "Weak";

export type DiagnosticInput = {
  industry: string;
  companySize: string;
  monthlyRevenueRange: string;
  grossMarginRange?: string;
  businessModel?: string;
  workflowType: string;
  taskFrequency: string;
  timePerTaskMinutes: number;
  peopleInvolved: number;
  hourlyLaborCost: number;
  manualHandoffs?: number;
  errorRatePercent?: number;
  reworkTimeHours?: number;
  customerWaitTimeHours?: number;
  toolCount?: number;
  approvalBottleneck?: boolean;
  implementationBudgetRange?: string;
  monthlySoftwareBudget?: number;
  internalTrainingHours?: number;
  humanQaHoursPerWeek?: number;
  adoptionTimelineMonths?: number;
  sopMaturity: Maturity;
  dataQuality: Maturity;
  processClarity: Maturity;
  kpiTracking?: Maturity;
  leadershipBuyIn?: Maturity;
  teamAdoptionRisk?: Maturity;
  existingAutomation?: Maturity;
  securityConstraints?: Maturity;
};

export type RecommendationState =
  | "automate-now"
  | "pilot-first"
  | "fix-foundation"
  | "measure-first"
  | "take-signal-diagnostic"
  | "not-yet";

export type DiagnosticResult = {
  roiScore: number;
  readinessScore: number;
  priorityScore: number;
  recommendation: RecommendationState;
  conservativeAnnualImpact: number;
  expectedAnnualImpact: number;
  aggressiveAnnualImpact: number;
  paybackMonths: number;
  bottleneck: {
    label: string;
    annualLaborCost: number;
    annualFrictionCost: number;
    confidence: "High" | "Medium" | "Low";
  };
};
