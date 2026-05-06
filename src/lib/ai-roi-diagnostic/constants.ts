export const ANALYTICS_EVENTS = {
  AI_ROI_DIAGNOSTIC_STARTED: "AI_ROI_DIAGNOSTIC_STARTED",
  AI_ROI_DIAGNOSTIC_STEP_COMPLETED: "AI_ROI_DIAGNOSTIC_STEP_COMPLETED",
  AI_ROI_DIAGNOSTIC_COMPLETED: "AI_ROI_DIAGNOSTIC_COMPLETED",
  AI_ROI_EMAIL_GATE_SUBMITTED: "AI_ROI_EMAIL_GATE_SUBMITTED",
  AI_ROI_BOOKING_CTA_CLICKED: "AI_ROI_BOOKING_CTA_CLICKED",
} as const;

export const INDUSTRY_OPTIONS = [
  "Local Service Business",
  "Professional Services",
  "Agency / Creative Services",
  "Podcast / Content Business",
  "E-commerce",
  "Real Estate / Property Management",
  "Healthcare / Admin Office",
  "Home Services",
  "Other",
] as const;

export const COMPANY_SIZE_OPTIONS = [
  "Solo / Founder-led",
  "2-5 employees",
  "6-10 employees",
  "11-25 employees",
  "26-50 employees",
  "51-100 employees",
  "100+ employees",
] as const;

export const REVENUE_OPTIONS = [
  "Under $10K",
  "$10K-$25K",
  "$25K-$50K",
  "$50K-$100K",
  "$100K-$250K",
  "$250K+",
] as const;

export const MARGIN_OPTIONS = [
  "Under 20%",
  "20%-40%",
  "40%-60%",
  "60%+",
] as const;

export const BUSINESS_MODEL_OPTIONS = [
  "Service",
  "Product",
  "Hybrid",
  "Subscription / Retainer",
] as const;

export const WORKFLOW_OPTIONS = [
  "Lead follow-up",
  "Customer intake",
  "Scheduling",
  "Proposal creation",
  "Content production",
  "Customer support",
  "Admin / back-office",
  "Reporting",
  "Sales enablement",
  "Other",
] as const;

export const FREQUENCY_OPTIONS = [
  "Monthly",
  "Weekly",
  "Several times per week",
  "Daily",
  "Multiple times per day",
] as const;

export const FREQUENCY_TO_MONTHLY: Record<string, number> = {
  Monthly: 1,
  Weekly: 4,
  "Several times per week": 12,
  Daily: 22,
  "Multiple times per day": 60,
};

export const IMPLEMENTATION_BUDGET_OPTIONS = [
  "Under $1K",
  "$1K-$5K",
  "$5K-$15K",
  "$15K-$50K",
  "$50K+",
] as const;

export const IMPLEMENTATION_BUDGET_MIDPOINT: Record<string, number> = {
  "Under $1K": 750,
  "$1K-$5K": 3000,
  "$5K-$15K": 10000,
  "$15K-$50K": 30000,
  "$50K+": 75000,
};

export const MATURITY_OPTIONS = ["Strong", "Partial", "Weak"] as const;

export const SECURITY_OPTIONS = ["Low", "Moderate", "High", "Unsure"] as const;

export const AUTOMATION_CAPTURE_RATE = 0.5;

export const FIELD_LIMITS = {
  timePerTaskMinutes: { min: 1, max: 600 },
  peopleInvolved: { min: 1, max: 500 },
  hourlyLaborCost: { min: 1, max: 1000 },
  manualHandoffs: { min: 0, max: 20 },
  errorRate: { min: 0, max: 100 },
  reworkTimeHours: { min: 0, max: 100 },
  customerWaitTimeHours: { min: 0, max: 720 },
  toolCount: { min: 1, max: 50 },
  monthlySoftwareBudget: { min: 0, max: 100000 },
  internalTrainingHours: { min: 0, max: 1000 },
  humanQaHoursPerWeek: { min: 0, max: 168 },
  adoptionTimelineMonths: { min: 0, max: 36 },
} as const;

import type { DiagnosticInput } from "./types";

export const DEFAULT_INPUT: DiagnosticInput = {
  industry: "",
  companySize: "",
  monthlyRevenueRange: "",
  grossMarginRange: "",
  businessModel: "",

  workflowType: "",
  taskFrequency: "",
  timePerTaskMinutes: 30,
  peopleInvolved: 1,
  hourlyLaborCost: 35,
  manualHandoffs: 2,

  errorRate: 10,
  reworkTimeHours: 1,
  customerWaitTimeHours: 24,
  approvalBottleneck: false,
  toolCount: 3,

  implementationBudgetRange: "",
  monthlySoftwareBudget: 250,
  internalTrainingHours: 10,
  humanQaHoursPerWeek: 2,
  adoptionTimelineMonths: 2,

  sopMaturity: "",
  dataQuality: "",
  processClarity: "",
  kpiTracking: "",
  leadershipBuyIn: "",
  teamAdoptionRisk: "",
  existingAutomation: "",
  securityConstraints: "",
};
