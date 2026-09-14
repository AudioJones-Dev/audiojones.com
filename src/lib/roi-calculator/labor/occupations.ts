import type { LaborScopeKey } from "../types";

export type OccupationKey =
  | "receptionist"
  | "customer_service"
  | "admin_support"
  | "dispatcher"
  | "office_clerk"
  | "inside_sales"
  | "billing_clerk"
  | "office_admin_all"
  | "admin_supervisor";

export const OCCUPATION_LABELS: Record<OccupationKey, string> = {
  receptionist: "Receptionists and Information Clerks",
  customer_service: "Customer Service Representatives",
  admin_support: "Secretaries and Administrative Assistants",
  dispatcher: "Dispatchers (except police, fire, and ambulance)",
  office_clerk: "Office Clerks, General",
  inside_sales: "Sales Representatives, Services",
  billing_clerk: "Billing and Posting Clerks",
  office_admin_all: "Office and Administrative Support Occupations",
  admin_supervisor: "First-Line Supervisors of Office and Administrative Support Workers",
};

/**
 * Which occupational benchmark prices each operational scope. Owner-performed
 * hours use the same proxy — that is the replacement-cost reading — while the
 * founder-capacity reading uses the owner's own stated hourly value instead.
 */
export const SCOPE_OCCUPATIONS: Record<LaborScopeKey, OccupationKey> = {
  calls: "receptionist",
  customer_communication: "customer_service",
  scheduling: "admin_support",
  dispatch: "dispatcher",
  crm_admin: "office_clerk",
  quote_followup: "inside_sales",
  billing: "billing_clerk",
  operations_admin: "admin_supervisor",
  custom: "office_admin_all",
};
