export const INDUSTRY_OPTIONS = ["Professional services", "Healthcare", "Real estate", "Ecommerce", "Education", "Media / creator business", "Agency / marketing", "Trades / local services", "SaaS / technology", "Other"] as const;
export const COMPANY_SIZE_OPTIONS = ["1", "2–5", "6–15", "16–50", "51–200", "200+"] as const;
export const REVENUE_OPTIONS = ["Under $25K/mo", "$25K–$50K/mo", "$50K–$100K/mo", "$100K–$250K/mo", "$250K–$500K/mo", "$500K+/mo"] as const;
export const MARGIN_OPTIONS = ["Under 20%", "20–40%", "40–60%", "60%+"] as const;
export const BUSINESS_MODEL_OPTIONS = ["Services", "Productized services", "Subscription", "Transactional", "Marketplace", "Hybrid"] as const;
export const WORKFLOW_OPTIONS = ["Lead intake / qualification", "Sales follow-up", "Client onboarding", "Support / helpdesk", "Reporting / analytics", "Content production", "Finance / billing", "Operations handoffs", "Compliance / QA"] as const;
export const FREQUENCY_OPTIONS = ["Daily", "Several times per week", "Weekly", "Monthly"] as const;
export const IMPLEMENTATION_BUDGET_OPTIONS = ["Under $5K", "$5K–$15K", "$15K–$35K", "$35K–$75K", "$75K+", "Not sure yet"] as const;
export const MATURITY_OPTIONS = ["Strong", "Partial", "Weak"] as const;
export const FIELD_LIMITS = {
  timePerTaskMinutes: { min: 1, max: 480 },
  peopleInvolved: { min: 1, max: 200 },
  hourlyLaborCost: { min: 1, max: 500 },
  manualHandoffs: { min: 0, max: 50 },
  errorRatePercent: { min: 0, max: 100 },
  reworkTimeHours: { min: 0, max: 200 },
  customerWaitTimeHours: { min: 0, max: 720 },
  toolCount: { min: 0, max: 50 },
  monthlySoftwareBudget: { min: 0, max: 100000 },
  internalTrainingHours: { min: 0, max: 1000 },
  humanQaHoursPerWeek: { min: 0, max: 168 },
  adoptionTimelineMonths: { min: 0, max: 36 },
} as const;
