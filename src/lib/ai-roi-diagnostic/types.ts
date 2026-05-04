export type RecommendationState =
  | "Automate Now"
  | "Pilot First"
  | "Fix Operations First"
  | "Redesign Workflow First"
  | "Use Off-the-Shelf AI Tools"
  | "Avoid Automation for Now";

export type ConfidenceLevel = "Low" | "Moderate" | "High";

export type BottleneckSeverity = "Low" | "Moderate" | "High" | "Critical";

export type MaturityLevel = "Strong" | "Partial" | "Weak";

export type SecurityLevel = "Low" | "Moderate" | "High" | "Unsure";

export type DiagnosticInput = {
  industry: string;
  companySize: string;
  monthlyRevenueRange: string;
  grossMarginRange: string;
  businessModel: string;

  workflowType: string;
  taskFrequency: string;
  timePerTaskMinutes: number;
  peopleInvolved: number;
  hourlyLaborCost: number;
  manualHandoffs: number;

  errorRate: number;
  reworkTimeHours: number;
  customerWaitTimeHours: number;
  approvalBottleneck: boolean;
  toolCount: number;

  implementationBudgetRange: string;
  monthlySoftwareBudget: number;
  internalTrainingHours: number;
  humanQaHoursPerWeek: number;
  adoptionTimelineMonths: number;

  sopMaturity: MaturityLevel | "";
  dataQuality: MaturityLevel | "";
  processClarity: MaturityLevel | "";
  kpiTracking: MaturityLevel | "";
  leadershipBuyIn: MaturityLevel | "";
  teamAdoptionRisk: MaturityLevel | "";
  existingAutomation: MaturityLevel | "";
  securityConstraints: SecurityLevel | "";
};

export type DiagnosticResult = {
  roiScore: number;
  readinessScore: number;
  priorityScore: number;

  monthlyLaborSavings: number;
  annualLaborSavings: number;
  annualErrorSavings: number;
  totalAnnualBenefit: number;
  annualAiCost: number;
  roiPercent: number;
  paybackMonths: number;

  conservativeAnnualImpact: number;
  expectedAnnualImpact: number;
  aggressiveAnnualImpact: number;
  riskAdjustedAnnualImpact: number;

  recommendation: RecommendationState;
  confidenceLevel: ConfidenceLevel;
  bottleneckSeverity: BottleneckSeverity;
};

export type DiagnosticLeadPayload = {
  firstName: string;
  email: string;
  companyName?: string;
  input: DiagnosticInput;
  result: DiagnosticResult;
};
