import type { DiagnosticInput, DiagnosticResult, Maturity, RecommendationState } from "./types";

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, Math.round(value)));

function frequencyMultiplier(frequency: string): number {
  if (frequency === "Daily") return 240;
  if (frequency === "Several times per week") return 144;
  if (frequency === "Weekly") return 52;
  return 12;
}

function budgetMidpoint(range?: string): number {
  switch (range) {
    case "Under $5K": return 3000;
    case "$5K–$15K": return 10000;
    case "$15K–$35K": return 25000;
    case "$35K–$75K": return 55000;
    case "$75K+": return 90000;
    default: return 15000;
  }
}

function maturityScore(value?: Maturity): number {
  if (value === "Strong") return 100;
  if (value === "Partial") return 62;
  if (value === "Weak") return 24;
  return 55;
}

function recommendationFor(roiScore: number, readinessScore: number, priorityScore: number): RecommendationState {
  if (roiScore >= 72 && readinessScore >= 68 && priorityScore >= 64) return "automate-now";
  if (roiScore >= 62 && readinessScore >= 48) return "pilot-first";
  if (roiScore >= 58 && readinessScore < 48) return "fix-foundation";
  if (priorityScore >= 58 && roiScore < 58) return "measure-first";
  if (readinessScore < 38) return "take-signal-diagnostic";
  return "not-yet";
}

export function scoreDiagnostic(input: DiagnosticInput): DiagnosticResult {
  const annualRuns = frequencyMultiplier(input.taskFrequency);
  const people = Math.max(1, input.peopleInvolved || 1);
  const minutes = Math.max(1, input.timePerTaskMinutes || 1);
  const hourly = Math.max(1, input.hourlyLaborCost || 1);
  const annualLaborCost = (annualRuns * minutes * people * hourly) / 60;
  const frictionCost =
    annualLaborCost * ((input.errorRatePercent ?? 0) / 100) +
    (input.reworkTimeHours ?? 0) * hourly * 12 +
    (input.customerWaitTimeHours ?? 0) * hourly * 0.35 * 12 +
    (input.manualHandoffs ?? 0) * annualRuns * 4 +
    (input.toolCount ?? 0) * 180 +
    (input.approvalBottleneck ? 3500 : 0);
  const annualGrossImpact = annualLaborCost * 0.42 + frictionCost * 0.55;
  const annualOngoing = (input.monthlySoftwareBudget ?? 0) * 12 + (input.humanQaHoursPerWeek ?? 0) * hourly * 52;
  const expectedAnnualImpact = Math.max(0, annualGrossImpact - annualOngoing);
  const implementationCost = budgetMidpoint(input.implementationBudgetRange) + (input.internalTrainingHours ?? 0) * hourly;
  const paybackMonths = expectedAnnualImpact > 0 ? Math.min(120, Math.max(1, Math.round((implementationCost / expectedAnnualImpact) * 12))) : 120;

  const readinessInputs = [input.sopMaturity, input.dataQuality, input.processClarity, input.kpiTracking, input.leadershipBuyIn, input.teamAdoptionRisk, input.existingAutomation, input.securityConstraints];
  const readinessScore = clamp(readinessInputs.reduce((sum, item) => sum + maturityScore(item), 0) / readinessInputs.length);
  const roiScore = clamp((expectedAnnualImpact / Math.max(implementationCost, 1)) * 28 + (paybackMonths <= 6 ? 22 : paybackMonths <= 12 ? 14 : 6));
  const frictionSignal = Math.min(40, ((annualLaborCost + frictionCost) / 50000) * 40);
  const priorityScore = clamp(frictionSignal + roiScore * 0.35 + (input.approvalBottleneck ? 8 : 0) + (people >= 3 ? 8 : 0) + (annualRuns >= 144 ? 9 : 0));

  return {
    roiScore,
    readinessScore,
    priorityScore,
    recommendation: recommendationFor(roiScore, readinessScore, priorityScore),
    conservativeAnnualImpact: Math.round(expectedAnnualImpact * 0.55),
    expectedAnnualImpact: Math.round(expectedAnnualImpact),
    aggressiveAnnualImpact: Math.round(expectedAnnualImpact * 1.35),
    paybackMonths,
    bottleneck: {
      label: input.workflowType,
      annualLaborCost: Math.round(annualLaborCost),
      annualFrictionCost: Math.round(frictionCost),
      confidence: readinessScore >= 70 ? "High" : readinessScore >= 45 ? "Medium" : "Low",
    },
  };
}
