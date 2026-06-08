/**
 * Capacity Management Utilities
 * 
 * Helper functions for business capacity calculations and time-based logic.
 */

/**
 * Derives monthly hour commitment from plan tier
 */
export function deriveHoursFromPlan(plan_tier?: string): number {
  if (!plan_tier) return 20; // default
  
  const tierHours: Record<string, number> = {
    'foundation': 20,
    'growth': 35,
    'web_funnel': 38,
    'integrated': 55,
    'podcast': 22
  };
  
  return tierHours[plan_tier.toLowerCase()] || 20;
}

/**
 * Checks if a date is within the specified number of days from now
 */
export function isWithinWindow(dateIso: string, days: number): boolean {
  try {
    const targetDate = new Date(dateIso);
    const now = new Date();
    const windowEnd = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return targetDate >= now && targetDate <= windowEnd;
  } catch (error) {
    console.warn('Invalid date format for window check:', dateIso);
    return false;
  }
}

/**
 * Formats a date for display in capacity banners
 */
export function formatOpenDate(dateIso: string): string {
  try {
    const date = new Date(dateIso);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    return 'TBD';
  }
}

/**
 * Calculates capacity utilization percentage
 */
export function calculateUtilization(current: number, max: number): number {
  if (max === 0) return 0;
  return Math.round((current / max) * 100);
}

/**
 * Determines capacity status color for UI
 */
export function getCapacityStatusColor(availability: string): string {
  switch (availability) {
    case 'open':
      return 'green';
    case 'limited':
      return 'yellow';
    case 'full':
      return 'red';
    default:
      return 'gray';
  }
}