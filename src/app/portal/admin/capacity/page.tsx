'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RefreshCw, Users, Clock, DollarSign, Calendar, AlertCircle, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatOpenDate, calculateUtilization, getCapacityStatusColor } from '@/lib/capacity';
import type { ForecastResponse } from '@/types/capacity';

interface CapacityData {
  availability: 'open' | 'limited' | 'full';
  is_full: boolean;
  capacity_metrics: {
    total_mrr: number;
    total_hours: number;
    active_retainers: number;
    active_podcast_clients: number;
    slots_filled: number;
    slots_total: number;
  };
  thresholds: {
    min_mrr: number;
    min_retainers: number;
    max_hours: number;
    max_podcast_clients: number;
  };
  next_open_date?: string;
  timestamp: string;
}

// Using imported ForecastResponse type

export default function AdminCapacityPage() {
  const [capacity, setCapacity] = useState<CapacityData | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchCapacity = async () => {
    try {
      setError(null);
      const response = await fetch('/api/capacity');
      const data = await response.json();

      if (data.ok) {
        setCapacity(data);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setError(data.message || 'Failed to load capacity data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async () => {
    try {
      setForecastLoading(true);
      const response = await fetch('/api/capacity/forecast');
      const data = await response.json();

      if (data.ok) {
        setForecast(data);
      } else {
        console.error('Failed to load forecast:', data.message);
      }
    } catch (err) {
      console.error('Forecast error:', err);
    } finally {
      setForecastLoading(false);
    }
  };

  useEffect(() => {
    fetchCapacity();
    fetchForecast();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchCapacity();
      fetchForecast();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (availability: string) => {
    switch (availability) {
      case 'open':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'limited':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'full':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-text-muted" />;
    }
  };

  const getStatusBadgeVariant = (availability: string) => {
    switch (availability) {
      case 'open':
        return 'default';
      case 'limited':
        return 'secondary';
      case 'full':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-text-muted" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Capacity Management</h1>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-3 w-32 bg-gray-200 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Capacity Management</h1>
          <button
            onClick={fetchCapacity}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <p className="font-medium">Failed to load capacity data</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!capacity) {
    return <div>No capacity data available</div>;
  }

  const mrrUtilization = calculateUtilization(capacity.capacity_metrics.total_mrr, capacity.thresholds.min_mrr);
  const hourUtilization = calculateUtilization(capacity.capacity_metrics.total_hours, capacity.thresholds.max_hours);
  const slotUtilization = calculateUtilization(capacity.capacity_metrics.slots_filled, capacity.capacity_metrics.slots_total);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Capacity Management</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated} • Auto-refreshes every 5 minutes
          </p>
        </div>
        <button
          onClick={() => {
            fetchCapacity();
            fetchForecast();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Current Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(capacity.availability)}
            Current Capacity Status
          </CardTitle>
          <CardDescription>
            Business availability for new client engagements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant={getStatusBadgeVariant(capacity.availability) as any} className="mb-2">
                {capacity.availability.toUpperCase()}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {capacity.next_open_date 
                  ? `Next opening: ${formatOpenDate(capacity.next_open_date)}`
                  : 'No scheduled openings'
                }
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {capacity.capacity_metrics.slots_filled}/{capacity.capacity_metrics.slots_total}
              </p>
              <p className="text-sm text-muted-foreground">Slots filled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Capacity Forecast
          </CardTitle>
          <CardDescription>
            Predictive capacity analysis and risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forecastLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading forecast...</span>
            </div>
          ) : forecast ? (
            <div className="space-y-4">
              {/* Current Status & Risk */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusBadgeVariant(forecast.current.status) as any}>
                    {forecast.current.status.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {getRiskIcon(forecast.forecast.risk)}
                    <Badge variant={getRiskBadgeVariant(forecast.forecast.risk) as any}>
                      {forecast.forecast.risk.toUpperCase()} RISK
                    </Badge>
                  </div>
                </div>
                {forecast.forecast.projected_open_date && (
                  <div className="text-right">
                    <p className="text-sm font-medium">Next Open Slot</p>
                    <p className="text-xs text-muted-foreground">
                      {formatOpenDate(forecast.forecast.projected_open_date)}
                    </p>
                  </div>
                )}
              </div>

              {/* Utilization Table */}
              <div className="border rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Metric</th>
                      <th className="text-right p-3 font-medium">Current</th>
                      <th className="text-right p-3 font-medium">Target/Max</th>
                      <th className="text-right p-3 font-medium">Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Hours Committed</td>
                      <td className="text-right p-3">{forecast.current.hours}</td>
                      <td className="text-right p-3">{capacity?.thresholds.max_hours}</td>
                      <td className="text-right p-3">
                        <span className={`font-medium ${
                          capacity && forecast.current.hours >= capacity.thresholds.max_hours * 0.9 
                            ? 'text-red-600' 
                            : capacity && forecast.current.hours >= capacity.thresholds.max_hours * 0.7 
                              ? 'text-yellow-600' 
                              : 'text-green-600'
                        }`}>
                          {capacity ? Math.round((forecast.current.hours / capacity.thresholds.max_hours) * 100) : 0}%
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Monthly Revenue</td>
                      <td className="text-right p-3">${forecast.current.mrr.toLocaleString()}</td>
                      <td className="text-right p-3">${capacity?.thresholds.min_mrr.toLocaleString()}</td>
                      <td className="text-right p-3">
                        <span className={`font-medium ${
                          capacity && forecast.current.mrr >= capacity.thresholds.min_mrr 
                            ? 'text-green-600' 
                            : 'text-yellow-600'
                        }`}>
                          {capacity ? Math.round((forecast.current.mrr / capacity.thresholds.min_mrr) * 100) : 0}%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Forecast Projection */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium mb-2">7-Day Projection</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Projected Status</p>
                    <Badge variant={getStatusBadgeVariant(forecast.forecast.projected_status) as any} className="mt-1">
                      {forecast.forecast.projected_status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Risk Assessment</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getRiskIcon(forecast.forecast.risk)}
                      <span className="font-medium">
                        {forecast.forecast.risk.charAt(0).toUpperCase() + forecast.forecast.risk.slice(1)} Risk
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Forecast data unavailable</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${capacity.capacity_metrics.total_mrr.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {mrrUtilization}% of ${capacity.thresholds.min_mrr.toLocaleString()} minimum
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${mrrUtilization >= 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
                style={{ width: `${Math.min(mrrUtilization, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours Committed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{capacity.capacity_metrics.total_hours}</div>
            <p className="text-xs text-muted-foreground">
              {hourUtilization}% of {capacity.thresholds.max_hours} maximum
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${hourUtilization >= 90 ? 'bg-red-500' : hourUtilization >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(hourUtilization, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Retainer Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{capacity.capacity_metrics.active_retainers}</div>
            <p className="text-xs text-muted-foreground">
              {capacity.thresholds.min_retainers} minimum required
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Podcast Clients</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{capacity.capacity_metrics.active_podcast_clients}</div>
            <p className="text-xs text-muted-foreground">
              {capacity.thresholds.max_podcast_clients} maximum allowed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Thresholds Card */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity Thresholds</CardTitle>
          <CardDescription>
            Business rules that determine availability status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Minimum Requirements (for "Open" status)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• MRR: ${capacity.thresholds.min_mrr.toLocaleString()}</li>
                <li>• Retainer clients: {capacity.thresholds.min_retainers}</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Maximum Capacity (triggers "Full" status)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Total hours: {capacity.thresholds.max_hours}</li>
                <li>• Podcast clients: {capacity.thresholds.max_podcast_clients}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}