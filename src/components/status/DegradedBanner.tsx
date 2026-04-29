/**
 * Degraded Service Banner Component
 *
 * Shows contextual banners when system is degraded or experiencing outages.
 * Can be dismissed per-session using localStorage.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, AlertTriangle, AlertCircle, ExternalLink } from 'lucide-react';
import { IncidentFeedItem } from '@/types/incidents';

interface DegradedBannerProps {
  status: 'operational' | 'degraded' | 'outage';
  incidents?: IncidentFeedItem[];
}

export function DegradedBanner({ status, incidents = [] }: DegradedBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Storage key for dismissal state (includes status for granular control)
  const dismissalKey = `aj-status-banner-dismissed-${status}`;

  // Check if banner was previously dismissed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(dismissalKey);
      setIsDismissed(dismissed === 'true');
    }
  }, [dismissalKey]);

  // Handle dismissal
  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(dismissalKey, 'true');
    }
  };

  // Clear dismissal state when status changes back to operational
  useEffect(() => {
    if (status === 'operational' && typeof window !== 'undefined') {
      localStorage.removeItem('aj-status-banner-dismissed-degraded');
      localStorage.removeItem('aj-status-banner-dismissed-outage');
    }
  }, [status]);

  // Don't render if operational or dismissed
  if (status === 'operational' || isDismissed) {
    return null;
  }

  const primaryIncident = incidents[0];
  const additionalCount = incidents.length > 1 ? incidents.length - 1 : 0;

  // Configure banner based on status
  const bannerConfig = {
    degraded: {
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-800 dark:text-amber-200',
      iconColor: 'text-amber-600 dark:text-amber-400',
      icon: AlertTriangle,
      title: 'Service Degraded',
      message: primaryIncident 
        ? `We're experiencing issues: ${primaryIncident.title}`
        : 'Some services may be experiencing issues',
    },
    outage: {
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      iconColor: 'text-red-600 dark:text-red-400',
      icon: AlertCircle,
      title: 'Service Disruption',
      message: primaryIncident 
        ? `Service interruption: ${primaryIncident.title}`
        : 'One or more services are currently unavailable',
    },
  };

  const config = bannerConfig[status];
  const IconComponent = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 mb-6 rounded-r-lg`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium ${config.textColor}`}>
              {config.title}
            </h3>
            <button
              onClick={handleDismiss}
              className={`ml-4 inline-flex rounded-md p-1.5 ${config.textColor} hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current`}
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mt-1">
            <p className={`text-sm ${config.textColor}`}>
              {config.message}
            </p>
            
            {primaryIncident?.short_description && (
              <p className={`text-sm ${config.textColor} opacity-80 mt-1`}>
                {primaryIncident.short_description}
              </p>
            )}
            
            {additionalCount > 0 && (
              <p className={`text-sm ${config.textColor} opacity-80 mt-1`}>
                {additionalCount} additional incident{additionalCount !== 1 ? 's' : ''} affecting services.
              </p>
            )}
          </div>
          
          <div className="mt-3 flex items-center space-x-4">
            <Link
              href="/status"
              className={`inline-flex items-center text-sm font-medium ${config.textColor} hover:underline`}
            >
              View Status Page
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
            
            {primaryIncident?.started_at && (
              <span className={`text-xs ${config.textColor} opacity-60`}>
                Started {formatIncidentTime(primaryIncident.started_at)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact version for mobile or smaller spaces
 */
export function DegradedBannerCompact({ status, incidents = [] }: DegradedBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const dismissalKey = `aj-status-banner-compact-dismissed-${status}`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(dismissalKey);
      setIsDismissed(dismissed === 'true');
    }
  }, [dismissalKey]);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(dismissalKey, 'true');
    }
  };

  if (status === 'operational' || isDismissed) {
    return null;
  }

  const config = {
    degraded: {
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      textColor: 'text-amber-800 dark:text-amber-200',
      icon: AlertTriangle,
      message: 'Service issues detected',
    },
    outage: {
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-800 dark:text-red-200', 
      icon: AlertCircle,
      message: 'Service disruption',
    },
  };

  const bannerConfig = config[status];
  const IconComponent = bannerConfig.icon;

  return (
    <div className={`${bannerConfig.bgColor} px-4 py-2 flex items-center justify-between`}>
      <div className="flex items-center space-x-2">
        <IconComponent className={`h-4 w-4 ${bannerConfig.textColor}`} />
        <span className={`text-sm font-medium ${bannerConfig.textColor}`}>
          {bannerConfig.message}
        </span>
        <Link
          href="/status"
          className={`text-sm ${bannerConfig.textColor} hover:underline ml-2`}
        >
          Details
        </Link>
      </div>
      <button
        onClick={handleDismiss}
        className={`${bannerConfig.textColor} hover:opacity-75`}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * Format incident timestamp for display
 */
function formatIncidentTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  } catch (error) {
    return 'recently';
  }
}