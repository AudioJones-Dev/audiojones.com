import {
  AUTOMATION_CAPTURE_RATE,
  FREQUENCY_TO_MONTHLY,
  IMPLEMENTATION_BUDGET_MIDPOINT,
} from "./constants";
import type {
  BottleneckSeverity,
  ConfidenceLevel,
  DiagnosticInput,
  DiagnosticResult,
  RecommendationState,
} from "./types";

const clamp = (value: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, value));

const safeNumber = (value: number, fallback = 0): number =>
  Number.isFinite(value) ? value : fallback;

const maturityScore = (level: string): number => {
  switch (level) {
    case "Strong":
      return 100;
    case "Partial":
      return 60;
    case "Weak":
      return 25;
    default:
      return 0;
  }
};

const securityScore = (level: string): number => {
  switch (level) {
    case "Low":
      return 100;
    case "Moderate":
      return 70;
    case "High":
      return 40;
    case "Unsure":
      return 50;
    default:
      return 0;
  }
};

const revenueProximityScore = (workflow: string): number => {
  switch (workflow) {
    case "Lead follow-up":
    case "Sales enablement":
    case "Proposal creation":
      return 100;
    case "Customer intake":
    case "Scheduling":
      return 80;
    case "Customer support":
      return 70;
    case "Content production":
      return 60;
    case "Reporting":
      return 50;
    case "Admin / back-office":
      return 40;
    default:
      return 50;
  }
};

const toolFragmentationScore = (toolCount: number): number => {
  if (toolCount <= 2) return 100;
  if (toolCount <= 4) return 80;
  if (toolCount <= 7) return 55;
  if (toolCount <= 10) return 30;
  return 15;
};

const bottleneckSeverityFromScore = (score: number): BottleneckSeverity => {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Moderate";
  return "Low";
};

const confidenceFromReadiness = (readiness: number): ConfidenceLevel => {
  if (readiness >= 70) return "High";
  if (readiness >= 45) return "Moderate";
  return "Low";
};

export function calculateRecommendation(
  roiScore: number,
  readinessScore: number,
): RecommendationState {
  if (roiScore >= 70 && readinessScore >= 70) return "Automate Now";
  if (roiScore >= 70 && readinessScore >= 40 && readinessScore < 70)
    return "Pilot First";
  if (roiScore >= 70 && readinessScore < 40) return "Fix Operations First";
  if (roiScore >= 40 && roiScore < 70 && readinessScore >= 60)
    return "Redesign Workflow First";
  if (roiScore < 40 && readinessScore >= 60) return "Use Off-the-Shelf AI Tools";
  return "Avoid Automation for Now";
}

export function calculateDiagnostic(input: DiagnosticInput): DiagnosticResult {
  const monthlyTaskFrequency =
    FREQUENCY_TO_MONTHLY[input.taskFrequency] ?? 4;

  const hourlyLaborCost = Math.max(input.hourlyLaborCost, 1);
  const peopleInvolved = Math.max(input.peopleInvolved, 1);
  const timePerTaskMinutes = Math.max(input.timePerTaskMinutes, 1);

  const monthlyLaborCost =
    (timePerTaskMinutes / 60) *
    monthlyTaskFrequency *
    peopleInvolved *
    hourlyLaborCost;

  const monthlyLaborSavings = monthlyLaborCost * AUTOMATION_CAPTURE_RATE;
  const annualLaborSavings = monthlyLaborSavings * 12;

  const monthlyErrorSavings =
    monthlyTaskFrequency *
    (input.errorRate / 100) *
    input.reworkTimeHours *
    hourlyLaborCost *
    peopleInvolved;
  const annualErrorSavings = monthlyErrorSavings * 12;

  const totalAnnualBenefit = annualLaborSavings + annualErrorSavings;

  const implementationCost =
    IMPLEMENTATION_BUDGET_MIDPOINT[input.implementationBudgetRange] ?? 3000;

  const annualAiCost =
    implementationCost +
    input.monthlySoftwareBudget * 12 +
    input.internalTrainingHours * hourlyLaborCost +
    input.humanQaHoursPerWeek * 52 * hourlyLaborCost;

  const safeAiCost = Math.max(annualAiCost, 1);
  const roiPercent =
    ((totalAnnualBenefit - annualAiCost) / safeAiCost) * 100;

  const monthlyNetBenefit =
    monthlyLaborSavings +
    monthlyErrorSavings -
    input.monthlySoftwareBudget -
    input.humanQaHoursPerWeek * 4.33 * hourlyLaborCost;

  const paybackMonths =
    implementationCost / Math.max(monthlyNetBenefit, 1);

  const conservativeAnnualImpact = totalAnnualBenefit * 0.5;
  const expectedAnnualImpact = totalAnnualBenefit;
  const aggressiveAnnualImpact = totalAnnualBenefit * 1.5;

  const laborSavingsScore = clamp((annualLaborSavings / 50000) * 100);
  const paybackScore = clamp(
    paybackMonths <= 0
      ? 0
      : paybackMonths < 3
        ? 100
        : paybackMonths < 6
          ? 80
          : paybackMonths < 12
            ? 60
            : paybackMonths < 24
              ? 35
              : 15,
  );
  const frequencyScore = clamp((monthlyTaskFrequency / 60) * 100);
  const errorSavingsScore = clamp((annualErrorSavings / 25000) * 100);
  const revenueScore = revenueProximityScore(input.workflowType);
  const costEfficiencyScore = clamp(
    annualAiCost === 0
      ? 0
      : Math.min(100, (totalAnnualBenefit / safeAiCost) * 25),
  );

  const roiScore = clamp(
    laborSavingsScore * 0.35 +
      paybackScore * 0.25 +
      frequencyScore * 0.15 +
      errorSavingsScore * 0.1 +
      revenueScore * 0.1 +
      costEfficiencyScore * 0.05,
  );

  const sopScore = maturityScore(input.sopMaturity);
  const dataQualityScore = maturityScore(input.dataQuality);
  const processClarityScore = maturityScore(input.processClarity);
  const kpiTrackingScore = maturityScore(input.kpiTracking);
  const leadershipScore = maturityScore(input.leadershipBuyIn);
  const adoptionScore = maturityScore(input.teamAdoptionRisk);
  const automationMaturityScore = maturityScore(input.existingAutomation);
  const securityReadinessScore = securityScore(input.securityConstraints);
  const fragmentationScore = toolFragmentationScore(input.toolCount);

  const readinessScore = clamp(
    sopScore * 0.15 +
      dataQualityScore * 0.15 +
      processClarityScore * 0.15 +
      kpiTrackingScore * 0.1 +
      leadershipScore * 0.1 +
      adoptionScore * 0.1 +
      automationMaturityScore * 0.1 +
      securityReadinessScore * 0.1 +
      fragmentationScore * 0.05,
  );

  const handoffPressure = clamp((input.manualHandoffs / 10) * 100);
  const waitPressure = clamp((input.customerWaitTimeHours / 72) * 100);
  const approvalPressure = input.approvalBottleneck ? 100 : 30;
  const errorPressure = clamp((input.errorRate / 50) * 100);
  const bottleneckSeverityScore = clamp(
    handoffPressure * 0.3 +
      waitPressure * 0.25 +
      approvalPressure * 0.2 +
      errorPressure * 0.25,
  );

  const timeToValueScore = clamp(
    input.adoptionTimelineMonths <= 1
      ? 100
      : input.adoptionTimelineMonths <= 3
        ? 80
        : input.adoptionTimelineMonths <= 6
          ? 55
          : input.adoptionTimelineMonths <= 12
            ? 30
            : 15,
  );

  const priorityScore = clamp(
    roiScore * 0.45 +
      readinessScore * 0.3 +
      bottleneckSeverityScore * 0.15 +
      timeToValueScore * 0.1,
  );

  const confidenceMultiplier = readinessScore / 100;
  const riskAdjustedAnnualImpact = expectedAnnualImpact * confidenceMultiplier;

  const recommendation = calculateRecommendation(roiScore, readinessScore);

  return {
    roiScore: Math.round(roiScore),
    readinessScore: Math.round(readinessScore),
    priorityScore: Math.round(priorityScore),

    monthlyLaborSavings: Math.round(safeNumber(monthlyLaborSavings)),
    annualLaborSavings: Math.round(safeNumber(annualLaborSavings)),
    annualErrorSavings: Math.round(safeNumber(annualErrorSavings)),
    totalAnnualBenefit: Math.round(safeNumber(totalAnnualBenefit)),
    annualAiCost: Math.round(safeNumber(annualAiCost)),
    roiPercent: Math.round(safeNumber(roiPercent)),
    paybackMonths:
      Math.round(safeNumber(paybackMonths, 0) * 10) / 10,

    conservativeAnnualImpact: Math.round(safeNumber(conservativeAnnualImpact)),
    expectedAnnualImpact: Math.round(safeNumber(expectedAnnualImpact)),
    aggressiveAnnualImpact: Math.round(safeNumber(aggressiveAnnualImpact)),
    riskAdjustedAnnualImpact: Math.round(safeNumber(riskAdjustedAnnualImpact)),

    recommendation,
    confidenceLevel: confidenceFromReadiness(readinessScore),
    bottleneckSeverity: bottleneckSeverityFromScore(bottleneckSeverityScore),
  };
}
