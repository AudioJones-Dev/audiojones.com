'use client';

/**
 * Performance Optimization Dashboard
 * 
 * Comprehensive admin interface for monitoring and managing performance optimizations
 * including caching, CDN, database performance, and application-level optimizations.
 */

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/lib/client/useRequireAuth';

interface PerformanceMetrics {
  cacheHitRate: number;
  averageResponseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  databaseQueryTime: number;
  totalRequests: number;
  errorRate: number;
  throughput: number;
  p50ResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
}

interface CacheStats {
  memoryCache: {
    entries: number;
    hitRate: number;
    memoryUsage: string;
    evictions: number;
  };
  diskCache: {
    entries: number;
    hitRate: number;
    diskUsage: string;
    evictions: number;
  };
  distributedCache: {
    entries: number;
    hitRate: number;
    networkLatency: string;
    replicationFactor: number;
  };
}

interface CDNStats {
  regions: string[];
  totalRequests: number;
  cacheHitRate: number;
  bandwidthSaved: string;
  averageLatency: string;
  optimizations: {
    images: { count: number; savedBytes: string };
    css: { count: number; savedBytes: string };
    js: { count: number; savedBytes: string };
    fonts: { count: number; savedBytes: string };
  };
}

interface DatabaseStats {
  connectionPool: {
    active: number;
    idle: number;
    maxSize: number;
    waitingRequests: number;
  };
  queryPerformance: {
    averageTime: number;
    slowQueries: number;
    queryCache: {
      hitRate: number;
      entries: number;
      memoryUsage: string;
    };
  };
  indexes: {
    total: number;
    unused: number;
    suggestions: number;
  };
  replication: {
    replicas: number;
    lagTime: string;
    status: string;
  };
}

interface PerformanceData {
  metrics?: PerformanceMetrics;
  cacheStats?: CacheStats;
  cdnStats?: CDNStats;
  databaseStats?: DatabaseStats;
  recommendations?: Array<{
    category: string;
    priority: string;
    title: string;
    description: string;
    impact: string;
    implementation: string;
  }>;
}

export default function PerformanceDashboard() {
  const { loading } = useRequireAuth({ redirectTo: "/login" });
  
  const [data, setData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'caching' | 'cdn' | 'database' | 'recommendations' | 'testing'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);

  useEffect(() => {
    if (!loading) {
      loadPerformanceData();
    }
  }, [loading]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadPerformanceData();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadPerformanceData = async () => {
    try {
      setIsLoading(true);

      // Load all performance data in parallel
      const [metricsRes, cacheRes, cdnRes, dbRes, recommendationsRes] = await Promise.all([
        fetch('/api/admin/performance?action=metrics'),
        fetch('/api/admin/performance?action=cache-stats'),
        fetch('/api/admin/performance?action=cdn-stats'),
        fetch('/api/admin/performance?action=database-stats'),
        fetch('/api/admin/performance?action=recommendations'),
      ]);

      const [metrics, cacheStats, cdnStats, databaseStats, recommendations] = await Promise.all([
        metricsRes.json(),
        cacheRes.json(),
        cdnRes.json(),
        dbRes.json(),
        recommendationsRes.json(),
      ]);

      setData({
        metrics: metrics.metrics,
        cacheStats: cacheStats.cacheStats,
        cdnStats: cdnStats.cdnStats,
        databaseStats: databaseStats.databaseStats,
        recommendations: recommendations.recommendations,
      });

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runPerformanceTest = async () => {
    try {
      setIsRunningTest(true);
      
      const response = await fetch('/api/admin/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'performance-test',
          comprehensive: true,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setTestResults(result.results);
      } else {
        console.error('Performance test failed:', result.error);
      }
    } catch (error) {
      console.error('Failed to run performance test:', error);
    } finally {
      setIsRunningTest(false);
    }
  };

  const optimizeCache = async () => {
    try {
      const response = await fetch('/api/admin/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'optimize-cache',
          pattern: '*',
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Cache optimized:', result.invalidatedEntries, 'entries');
        loadPerformanceData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to optimize cache:', error);
    }
  };

  const clearCache = async (pattern: string) => {
    try {
      const response = await fetch('/api/admin/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'clear-cache',
          tag: pattern,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Cache cleared:', result.clearedEntries, 'entries');
        loadPerformanceData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading performance dashboard...</div>
      </div>
    );
  }

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  const formatPercentage = (num: number): string => {
    return `${(num * 100).toFixed(1)}%`;
  };

  const getStatusColor = (value: number, good: number, warning: number): string => {
    if (value >= good) return 'text-green-400';
    if (value >= warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-900/20';
      case 'high': return 'text-orange-400 bg-orange-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-text-muted bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Performance Optimization</h1>
              <p className="text-text-muted">
                Monitor and optimize system performance across all layers
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoRefresh" className="text-sm text-text-muted">
                  Auto-refresh
                </label>
              </div>
              {lastUpdate && (
                <div className="text-sm text-text-muted">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
              <button
                onClick={loadPerformanceData}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
            {['overview', 'caching', 'cdn', 'database', 'recommendations', 'testing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-text-muted hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && data?.metrics && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Response Time</h3>
                <p className={`text-2xl font-bold ${getStatusColor(data.metrics.averageResponseTime, 500, 1000)}`}>
                  {formatNumber(data.metrics.averageResponseTime, 0)}ms
                </p>
                <p className="text-sm text-text-muted mt-1">Average response time</p>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Cache Hit Rate</h3>
                <p className={`text-2xl font-bold ${getStatusColor(data.metrics.cacheHitRate, 0.8, 0.6)}`}>
                  {formatPercentage(data.metrics.cacheHitRate)}
                </p>
                <p className="text-sm text-text-muted mt-1">Overall cache efficiency</p>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Error Rate</h3>
                <p className={`text-2xl font-bold ${getStatusColor(1 - data.metrics.errorRate, 0.95, 0.9)}`}>
                  {formatPercentage(data.metrics.errorRate)}
                </p>
                <p className="text-sm text-text-muted mt-1">System error rate</p>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Memory Usage</h3>
                <p className={`text-2xl font-bold ${getStatusColor(1 - data.metrics.memoryUsage, 0.3, 0.15)}`}>
                  {formatPercentage(data.metrics.memoryUsage)}
                </p>
                <p className="text-sm text-text-muted mt-1">System memory usage</p>
              </div>
            </div>

            {/* Performance Percentiles */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Response Time Percentiles</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-text-muted">P50 (Median)</p>
                  <p className="text-lg font-semibold">{formatNumber(data.metrics.p50ResponseTime, 0)}ms</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">P95</p>
                  <p className="text-lg font-semibold">{formatNumber(data.metrics.p95ResponseTime, 0)}ms</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">P99</p>
                  <p className="text-lg font-semibold">{formatNumber(data.metrics.p99ResponseTime, 0)}ms</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Caching Tab */}
        {selectedTab === 'caching' && data?.cacheStats && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Cache Performance</h2>
              <div className="space-x-2">
                <button
                  onClick={optimizeCache}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                >
                  Optimize Cache
                </button>
                <button
                  onClick={() => clearCache('*')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Clear All Cache
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Memory Cache */}
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Memory Cache</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Entries:</span>
                    <span>{data.cacheStats.memoryCache.entries.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Hit Rate:</span>
                    <span className={getStatusColor(data.cacheStats.memoryCache.hitRate, 0.8, 0.6)}>
                      {formatPercentage(data.cacheStats.memoryCache.hitRate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Memory Usage:</span>
                    <span>{data.cacheStats.memoryCache.memoryUsage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Evictions:</span>
                    <span>{data.cacheStats.memoryCache.evictions}</span>
                  </div>
                </div>
              </div>

              {/* Disk Cache */}
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Disk Cache</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Entries:</span>
                    <span>{data.cacheStats.diskCache.entries.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Hit Rate:</span>
                    <span className={getStatusColor(data.cacheStats.diskCache.hitRate, 0.7, 0.5)}>
                      {formatPercentage(data.cacheStats.diskCache.hitRate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Disk Usage:</span>
                    <span>{data.cacheStats.diskCache.diskUsage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Evictions:</span>
                    <span>{data.cacheStats.diskCache.evictions}</span>
                  </div>
                </div>
              </div>

              {/* Distributed Cache */}
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Distributed Cache</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Entries:</span>
                    <span>{data.cacheStats.distributedCache.entries.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Hit Rate:</span>
                    <span className={getStatusColor(data.cacheStats.distributedCache.hitRate, 0.65, 0.45)}>
                      {formatPercentage(data.cacheStats.distributedCache.hitRate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Network Latency:</span>
                    <span>{data.cacheStats.distributedCache.networkLatency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Replication:</span>
                    <span>{data.cacheStats.distributedCache.replicationFactor}x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CDN Tab */}
        {selectedTab === 'cdn' && data?.cdnStats && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">CDN Performance</h2>

            {/* CDN Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Total Requests</h3>
                <p className="text-2xl font-bold text-blue-400">
                  {data.cdnStats.totalRequests.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Cache Hit Rate</h3>
                <p className="text-2xl font-bold text-green-400">
                  {formatPercentage(data.cdnStats.cacheHitRate)}
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Bandwidth Saved</h3>
                <p className="text-2xl font-bold text-purple-400">
                  {data.cdnStats.bandwidthSaved}
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Average Latency</h3>
                <p className="text-2xl font-bold text-yellow-400">
                  {data.cdnStats.averageLatency}
                </p>
              </div>
            </div>

            {/* Regions */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Active Regions</h3>
              <div className="flex flex-wrap gap-2">
                {data.cdnStats.regions.map((region) => (
                  <span
                    key={region}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>

            {/* Asset Optimizations */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Asset Optimizations</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(data.cdnStats.optimizations).map(([type, stats]) => (
                  <div key={type} className="text-center">
                    <div className="text-sm text-text-muted capitalize">{type}</div>
                    <div className="text-lg font-semibold">{stats.count.toLocaleString()}</div>
                    <div className="text-xs text-green-400">{stats.savedBytes}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Database Tab */}
        {selectedTab === 'database' && data?.databaseStats && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Database Performance</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Connection Pool */}
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Connection Pool</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Active:</span>
                    <span className="text-green-400">{data.databaseStats.connectionPool.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Idle:</span>
                    <span>{data.databaseStats.connectionPool.idle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Max Size:</span>
                    <span>{data.databaseStats.connectionPool.maxSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Waiting:</span>
                    <span className={data.databaseStats.connectionPool.waitingRequests > 0 ? 'text-red-400' : 'text-green-400'}>
                      {data.databaseStats.connectionPool.waitingRequests}
                    </span>
                  </div>
                </div>
              </div>

              {/* Query Performance */}
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Query Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Average Time:</span>
                    <span className={getStatusColor(200 - data.databaseStats.queryPerformance.averageTime, 150, 50)}>
                      {data.databaseStats.queryPerformance.averageTime}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Slow Queries:</span>
                    <span className={data.databaseStats.queryPerformance.slowQueries > 10 ? 'text-red-400' : 'text-green-400'}>
                      {data.databaseStats.queryPerformance.slowQueries}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Cache Hit Rate:</span>
                    <span className={getStatusColor(data.databaseStats.queryPerformance.queryCache.hitRate, 0.7, 0.5)}>
                      {formatPercentage(data.databaseStats.queryPerformance.queryCache.hitRate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Cache Entries:</span>
                    <span>{data.databaseStats.queryPerformance.queryCache.entries.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Indexes */}
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Index Optimization</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Total Indexes:</span>
                    <span>{data.databaseStats.indexes.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Unused:</span>
                    <span className={data.databaseStats.indexes.unused > 0 ? 'text-yellow-400' : 'text-green-400'}>
                      {data.databaseStats.indexes.unused}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Suggestions:</span>
                    <span className={data.databaseStats.indexes.suggestions > 0 ? 'text-blue-400' : 'text-text-muted'}>
                      {data.databaseStats.indexes.suggestions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Replication */}
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Replication</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Replicas:</span>
                    <span>{data.databaseStats.replication.replicas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Lag Time:</span>
                    <span className="text-green-400">{data.databaseStats.replication.lagTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Status:</span>
                    <span className={data.databaseStats.replication.status === 'healthy' ? 'text-green-400' : 'text-red-400'}>
                      {data.databaseStats.replication.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {selectedTab === 'recommendations' && data?.recommendations && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Performance Recommendations</h2>

            <div className="space-y-4">
              {data.recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-900 p-6 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{rec.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-gray-700 text-text-primary rounded-full text-xs">
                          {rec.category.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-text-primary mb-3">{rec.description}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-green-400">Impact: </span>
                          <span className="text-sm text-text-primary">{rec.impact}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-blue-400">Implementation: </span>
                          <span className="text-sm text-text-primary">{rec.implementation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testing Tab */}
        {selectedTab === 'testing' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Performance Testing</h2>
              <button
                onClick={runPerformanceTest}
                disabled={isRunningTest}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50"
              >
                {isRunningTest ? 'Running Test...' : 'Run Performance Test'}
              </button>
            </div>

            {testResults && (
              <div className="space-y-6">
                {/* Test Overview */}
                <div className="bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Test Results Overview</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{testResults.overallScore}</div>
                      <div className="text-sm text-text-muted">Overall Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{testResults.totalTestTime}ms</div>
                      <div className="text-sm text-text-muted">Test Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{testResults.recommendations.length}</div>
                      <div className="text-sm text-text-muted">Recommendations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {testResults.applicationPerformance.loadTime.timeToInteractive}ms
                      </div>
                      <div className="text-sm text-text-muted">Time to Interactive</div>
                    </div>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-900 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Cache Performance</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Memory Cache Hit Rate:</span>
                        <span>{formatPercentage(testResults.cachePerformance.memoryCache.hitRate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Disk Cache Hit Rate:</span>
                        <span>{formatPercentage(testResults.cachePerformance.diskCache.hitRate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Distributed Cache Hit Rate:</span>
                        <span>{formatPercentage(testResults.cachePerformance.distributedCache.hitRate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Database Performance</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Connection Time:</span>
                        <span>{testResults.databasePerformance.connectionTime}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Query Execution:</span>
                        <span>{testResults.databasePerformance.queryExecutionTime}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Index Utilization:</span>
                        <span>{formatPercentage(testResults.databasePerformance.indexUtilization)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Recommendations */}
                <div className="bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Test Recommendations</h3>
                  <div className="space-y-3">
                    {testResults.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority.toUpperCase()}
                        </span>
                        <span className="text-sm">{rec.action}</span>
                        <span className="text-xs text-text-muted">- {rec.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}