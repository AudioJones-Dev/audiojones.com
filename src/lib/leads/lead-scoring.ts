import type { FounderIntelligenceLeadInput } from "./lead-schema";

export type LeadPriority = "low" | "medium" | "high" | "urgent";

export type LeadScores = {
  icpFitScore: number;
  signalScore: number;
  aiReadinessScore: number;
  attributionScore: number;
  totalScore: number;
  priority: LeadPriority;
};

const PRIME_REVENUE = ["$250K–$500K", "$500K–$1M", "$1M–$2M", "$2M–$5M"];
const ACTIVE_TIMELINES = ["Immediately", "30 days", "60 days", "90 days"];

export function scoreFounderIntelligenceLead(
  input: FounderIntelligenceLeadInput,
): LeadScores {
  const revenueScore = PRIME_REVENUE.includes(input.annualRevenueRange || "")
    ? 25
    : input.annualRevenueRange === "$5M+"
      ? 15
      : 5;

  const constraintScore = input.primaryConstraint ? 20 : 0;
  const existingRevenueScore =
    input.annualRevenueRange && input.annualRevenueRange !== "Under $250K"
      ? 15
      : 0;
  const aiGoalScore = input.aiMainGoal ? 15 : 0;
  const attributionGapScore =
    input.canIdentifyBestLeadSource === false ||
    input.tracksConversionSource === false ||
    (input.attributionConfidence ?? 0) <= 6
      ? 15
      : 5;
  const timelineScore = ACTIVE_TIMELINES.includes(input.timeline || "")
    ? 10
    : 0;

  const icpFitScore =
    revenueScore +
    constraintScore +
    existingRevenueScore +
    aiGoalScore +
    attributionGapScore +
    timelineScore;

  const signalScore =
    (input.canIdentifyBestLeadSource ? 20 : 0) +
    (input.tracksConversionSource ? 20 : 0) +
    (input.crmUsed ? 15 : 0) +
    (input.analyticsUsed ? 15 : 0) +
    (input.documentedSops ? 15 : 0) +
    ((input.knowsCAC ? 7 : 0) + (input.knowsLTV ? 8 : 0));

  const role = input.role?.toLowerCase() || "";
  const aiReadinessScore =
    (input.aiMainGoal ? 25 : 0) +
    (input.projectManagementUsed ? 20 : 0) +
    (input.crmUsed || input.analyticsUsed ? 20 : 0) +
    (role.includes("founder") || role.includes("ceo") ? 15 : 5) +
    (input.whatHaveYouTried ? 20 : 0);

  const attributionScore =
    (input.canIdentifyBestLeadSource ? 25 : 0) +
    (input.tracksConversionSource ? 25 : 0) +
    (input.knowsCAC ? 20 : 0) +
    (input.knowsLTV ? 15 : 0) +
    Math.min((input.attributionConfidence ?? 0) * 1.5, 15);

  const totalScore = Math.round(
    icpFitScore * 0.35 +
      signalScore * 0.25 +
      aiReadinessScore * 0.2 +
      attributionScore * 0.2,
  );

  const priority: LeadPriority =
    totalScore >= 80
      ? "urgent"
      : totalScore >= 60
        ? "high"
        : totalScore >= 40
          ? "medium"
          : "low";

  return {
    icpFitScore: Math.min(icpFitScore, 100),
    signalScore: Math.min(signalScore, 100),
    aiReadinessScore: Math.min(aiReadinessScore, 100),
    attributionScore: Math.min(Math.round(attributionScore), 100),
    totalScore: Math.min(totalScore, 100),
    priority,
  };
}
