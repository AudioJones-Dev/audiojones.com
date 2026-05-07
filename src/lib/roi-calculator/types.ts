export type RoiCalculatorInput = {
  industry: string;
  companySize: string;
  monthlyRevenue: string;
  workflowType: string;
  taskFrequency: string;
  hoursPerWeek: number;
  hourlyCost: number;
  errorFrequency: string;
  monthlyReworkCost: number;
  delayPain: string;
  implementationBudget: number;
  timelineExpectation: string;
  internalOwner: string;
  processClarity: number;
  dataQuality: number;
  sopMaturity: number;
  toolFragmentation: number;
  teamAdoption: number;
  name: string;
  email: string;
  company: string;
  phone?: string;
  message?: string;
};

export type RoiRecommendation =
  | "Automate Now"
  | "Pilot First"
  | "Diagnose the Workflow";

export type RoiConfidenceTier = "High" | "Medium" | "Low";

export type RoiCalculatorResult = {
  monthlySavings: number;
  annualSavings: number;
  paybackMonths: number | null;
  readinessScore: number;
  priorityScore: number;
  confidenceTier: RoiConfidenceTier;
  recommendation: RoiRecommendation;
  recommendedNextAction: string;
  savingsBreakdown: {
    laborSavings: number;
    reworkSavings: number;
    delayRecovery: number;
  };
};

export type RoiLeadRequest = {
  email: string;
  input: RoiCalculatorInput;
  result: RoiCalculatorResult;
  source?: string;
  utm?: Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content", string>>;
  hp?: string;
};
