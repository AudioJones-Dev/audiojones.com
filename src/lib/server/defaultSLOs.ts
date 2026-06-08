/**
 * Default SLO Definitions
 * 
 * Defines baseline Service Level Objectives for core AudioJones services.
 * These SLOs establish reliability targets and error budgets for monitoring.
 */

import type { SLO } from './slo';

export const DEFAULT_SLOS: SLO[] = [
  {
    id: "webhook-availability",
    service: "webhook",
    target: 99.0, // 99% availability = ~1.7 hours downtime per week
    window: "7d",
    bad_event_type: "webhook",
    description: "Webhook endpoint availability and processing reliability"
  },
  {
    id: "webhook-reliability-monthly",
    service: "webhook", 
    target: 99.5, // 99.5% availability = ~3.6 hours downtime per month
    window: "30d",
    bad_event_type: "webhook",
    description: "Monthly webhook reliability for billing and subscription events"
  },
  {
    id: "capacity-forecasting",
    service: "capacity",
    target: 98.5, // 98.5% accuracy = allow some forecasting variance
    window: "7d", 
    bad_event_type: "capacity",
    description: "Capacity forecasting accuracy and threshold management"
  },
  {
    id: "capacity-management-monthly",
    service: "capacity",
    target: 99.0, // 99% capacity management reliability
    window: "30d",
    bad_event_type: "capacity", 
    description: "Monthly capacity management and scaling effectiveness"
  },
  {
    id: "admin-api-uptime",
    service: "system",
    target: 99.5, // 99.5% uptime = ~3.6 hours downtime per month
    window: "30d",
    bad_event_type: "system",
    description: "Admin API and dashboard availability for operations"
  },
  {
    id: "billing-processing",
    service: "billing",
    target: 99.8, // 99.8% billing accuracy = very high reliability needed
    window: "7d",
    bad_event_type: "billing",
    description: "Billing event processing reliability"
  },
  {
    id: "predictive-alerts",
    service: "capacity",
    target: 95.0, // 95% predictive accuracy = allow for prediction variance
    window: "7d",
    bad_event_type: "predictive",
    description: "Predictive alert accuracy and early warning effectiveness"
  },
  {
    id: "system-health-weekly",
    service: "system", 
    target: 98.0, // 98% system health = ~3.4 hours issues per week
    window: "7d",
    bad_event_type: "system",
    description: "Overall system health and infrastructure reliability"
  }
];

/**
 * Get SLOs by service type
 * 
 * @param service - Service type to filter by
 * @returns Array of SLOs for the specified service
 */
export function getSLOsByService(service: "webhook" | "capacity" | "billing" | "system"): SLO[] {
  return DEFAULT_SLOS.filter(slo => slo.service === service);
}

/**
 * Get SLOs by time window
 * 
 * @param window - Time window to filter by
 * @returns Array of SLOs for the specified window
 */
export function getSLOsByWindow(window: "7d" | "30d"): SLO[] {
  return DEFAULT_SLOS.filter(slo => slo.window === window);
}

/**
 * Get critical SLOs (high target percentages)
 * 
 * @param threshold - Minimum target percentage (default: 99.0)
 * @returns Array of SLOs with targets above threshold
 */
export function getCriticalSLOs(threshold: number = 99.0): SLO[] {
  return DEFAULT_SLOS.filter(slo => slo.target >= threshold);
}

/**
 * Get SLO by ID
 * 
 * @param id - SLO identifier
 * @returns SLO definition or undefined if not found
 */
export function getSLOById(id: string): SLO | undefined {
  return DEFAULT_SLOS.find(slo => slo.id === id);
}

/**
 * Validate SLO definition
 * 
 * @param slo - SLO to validate
 * @returns Validation result with errors if any
 */
export function validateSLO(slo: SLO): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!slo.id || slo.id.trim().length === 0) {
    errors.push('SLO ID is required');
  }

  if (!["webhook", "capacity", "billing", "system"].includes(slo.service)) {
    errors.push('Invalid service type');
  }

  if (slo.target <= 0 || slo.target > 100) {
    errors.push('Target must be between 0 and 100');
  }

  if (!["7d", "30d"].includes(slo.window)) {
    errors.push('Window must be 7d or 30d');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get SLO display name
 * 
 * @param slo - SLO definition
 * @returns Human-readable display name
 */
export function getSLODisplayName(slo: SLO): string {
  const serviceNames = {
    webhook: 'Webhook',
    capacity: 'Capacity',
    billing: 'Billing',
    system: 'System'
  };

  const windowNames = {
    '7d': '7-day',
    '30d': '30-day'
  };

  return `${serviceNames[slo.service]} ${windowNames[slo.window]} (${slo.target}%)`;
}

/**
 * Get recommended error budget alert thresholds
 * 
 * @param slo - SLO definition
 * @returns Recommended alert thresholds for error budget consumption
 */
export function getErrorBudgetThresholds(slo: SLO): { warning: number; critical: number } {
  // More aggressive thresholds for higher-target SLOs
  if (slo.target >= 99.5) {
    return { warning: 50, critical: 80 }; // Alert earlier for high-reliability services
  } else if (slo.target >= 99.0) {
    return { warning: 60, critical: 85 };
  } else {
    return { warning: 70, critical: 90 }; // More tolerance for lower-target SLOs
  }
}