/**
 * Advanced Analytics Engine
 * 
 * Enterprise-grade analytics processing with predictive insights, trend analysis,
 * anomaly detection, and business intelligence capabilities.
 * 
 * Features:
 * - Real-time data processing and aggregation
 * - Predictive analytics with confidence scoring
 * - Custom metrics and KPI tracking
 * - Anomaly detection with alerting
 * - Trend analysis and forecasting
 * - Business intelligence dashboards
 * - Multi-tenant analytics isolation
 * - Performance optimization with caching
 */

import { getDb } from '@/lib/server/firebaseAdmin';

// Core analytics types
export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  timestamp: number;
  dimensions: Record<string, string>;
  organizationId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface PredictiveInsight {
  id: string;
  metricId: string;
  type: 'trend' | 'forecast' | 'anomaly' | 'pattern';
  prediction: number;
  confidence: number; // 0-100
  timeHorizon: number; // days
  factors: string[];
  recommendation?: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  organizationId?: string;
}

export interface AnalyticsAlert {
  id: string;
  metricId: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq' | 'ne';
  condition: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  status: 'active' | 'resolved' | 'suppressed';
  organizationId?: string;
  createdAt: number;
  resolvedAt?: number;
}

export interface CustomDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  organizationId?: string;
  userId?: string;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'kpi' | 'trend' | 'heatmap';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  dataSource: string;
  refreshInterval: number; // seconds
}

export interface AnalyticsQuery {
  metrics: string[];
  dimensions?: string[];
  filters?: Array<{ field: string; operator: string; value: any }>;
  timeRange: { start: number; end: number };
  granularity: 'minute' | 'hour' | 'day' | 'week' | 'month';
  limit?: number;
  organizationId?: string;
}

export interface AnalyticsResult {
  data: Array<{
    timestamp: number;
    values: Record<string, number>;
    dimensions: Record<string, string>;
  }>;
  aggregations: Record<string, number>;
  insights: PredictiveInsight[];
  alerts: AnalyticsAlert[];
  metadata: {
    executionTime: number;
    dataPoints: number;
    cacheHit: boolean;
  };
}

/**
 * Advanced Analytics Engine
 * 
 * Provides enterprise-grade analytics processing and insights
 */
export class AdvancedAnalyticsEngine {
  private cache = new Map<string, { data: any; expiry: number }>();
  private alertProcessors = new Map<string, Function>(); // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  private predictiveModels = new Map<string, Function>(); // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  
  // Configuration
  private readonly config = {
    cacheTimeoutMs: 300000, // 5 minutes
    maxCacheSize: 1000,
    predictionHorizonDays: 30,
    anomalyThreshold: 2.5, // standard deviations
    batchSize: 1000,
    maxQueryDuration: 30000, // 30 seconds
  };

  /**
   * Initialize the analytics engine
   */
  async initialize(): Promise<void> {
    console.log('🔬 Initializing Advanced Analytics Engine...');

    try {
      // Initialize database connections
      await this.initializeCollections();

      // Load predictive models
      await this.loadPredictiveModels();

      // Setup alert processors
      this.setupAlertProcessors();

      // Start background tasks
      this.startBackgroundTasks();

      console.log('✅ Advanced Analytics Engine initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize analytics engine:', error);
      throw error;
    }
  }

  /**
   * Initialize Firebase collections for analytics
   */
  private async initializeCollections(): Promise<void> {
    const db = await getDb();
    
    // Initialize analytics collections with indexes
    const collections = [
      'analytics_metrics',
      'analytics_insights', 
      'analytics_alerts',
      'custom_dashboards',
      'analytics_cache'
    ];

    for (const collection of collections) {
      // Ensure collection exists by writing an initialization document
      await db.collection(collection).doc('_init').set({
        initialized_at: new Date(),
        version: '1.0.0'
      });
    }
  }

  /**
   * Load and register predictive models
   */
  private async loadPredictiveModels(): Promise<void> {
    // Register built-in predictive models
    this.predictiveModels.set('linear_trend', this.linearTrendModel.bind(this));
    this.predictiveModels.set('seasonal_forecast', this.seasonalForecastModel.bind(this));
    this.predictiveModels.set('anomaly_detection', this.anomalyDetectionModel.bind(this));
    this.predictiveModels.set('capacity_prediction', this.capacityPredictionModel.bind(this));
    this.predictiveModels.set('revenue_forecast', this.revenueForecastModel.bind(this));
  }

  /**
   * Setup alert processors for different metric types
   */
  private setupAlertProcessors(): void {
    this.alertProcessors.set('threshold', this.thresholdAlertProcessor.bind(this));
    this.alertProcessors.set('rate_of_change', this.rateChangeAlertProcessor.bind(this));
    this.alertProcessors.set('anomaly', this.anomalyAlertProcessor.bind(this));
    this.alertProcessors.set('pattern', this.patternAlertProcessor.bind(this));
  }

  /**
   * Start background processing tasks
   */
  private startBackgroundTasks(): void {
    // Process analytics every 5 minutes
    setInterval(() => {
      this.processScheduledAnalytics().catch(error => {
        console.error('Error in scheduled analytics:', error);
      });
    }, 300000);

    // Clean cache every 10 minutes
    setInterval(() => {
      this.cleanCache();
    }, 600000);

    // Generate insights every hour
    setInterval(() => {
      this.generatePredictiveInsights().catch(error => {
        console.error('Error generating insights:', error);
      });
    }, 3600000);
  }

  /**
   * Record a new analytics metric
   */
  async recordMetric(metric: Omit<AnalyticsMetric, 'id' | 'timestamp'>): Promise<string> {
    const db = await getDb();
    
    const fullMetric: AnalyticsMetric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...metric,
    };

    // Store in organization-specific collection if available
    const collection = metric.organizationId 
      ? db.collection('analytics').doc(metric.organizationId).collection('metrics')
      : db.collection('analytics').doc('system').collection('metrics');

    await collection.doc(fullMetric.id).set(fullMetric);

    // Process real-time alerts
    await this.processRealTimeAlerts(fullMetric);

    // Invalidate related cache
    this.invalidateCache(metric.name, metric.organizationId);

    return fullMetric.id;
  }

  /**
   * Execute an analytics query with caching
   */
  async executeQuery(query: AnalyticsQuery): Promise<AnalyticsResult> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(query);
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return {
        ...cached,
        metadata: {
          ...cached.metadata,
          cacheHit: true,
        }
      };
    }

    const db = await getDb();
    const data: AnalyticsResult['data'] = [];
    const aggregations: Record<string, number> = {};

    try {
      // Build Firestore query
      const collection = query.organizationId
        ? db.collection('analytics').doc(query.organizationId).collection('metrics')
        : db.collectionGroup('metrics');

      let firestoreQuery = collection
        .where('timestamp', '>=', query.timeRange.start)
        .where('timestamp', '<=', query.timeRange.end);

      // Apply filters
      if (query.filters) {
        for (const filter of query.filters) {
          firestoreQuery = firestoreQuery.where(filter.field, filter.operator as any, filter.value);
        }
      }

      // Apply limit
      if (query.limit) {
        firestoreQuery = firestoreQuery.limit(query.limit);
      }

      firestoreQuery = firestoreQuery.orderBy('timestamp', 'desc');

      const snapshot = await firestoreQuery.get();

      // Process results
      const rawData: AnalyticsMetric[] = [];
      snapshot.forEach(doc => {
        rawData.push(doc.data() as AnalyticsMetric);
      });

      // Aggregate data by time granularity
      const aggregatedData = this.aggregateByGranularity(rawData, query.granularity);
      data.push(...aggregatedData);

      // Calculate aggregations
      aggregations.count = rawData.length;
      aggregations.sum = rawData.reduce((sum, item) => sum + item.value, 0);
      aggregations.avg = aggregations.count > 0 ? aggregations.sum / aggregations.count : 0;
      aggregations.min = rawData.length > 0 ? Math.min(...rawData.map(d => d.value)) : 0;
      aggregations.max = rawData.length > 0 ? Math.max(...rawData.map(d => d.value)) : 0;

      // Generate insights
      const insights = await this.generateInsightsForQuery(query, rawData);

      // Check for alerts
      const alerts = await this.evaluateAlerts(query, rawData);

      const result: AnalyticsResult = {
        data,
        aggregations,
        insights,
        alerts,
        metadata: {
          executionTime: Date.now() - startTime,
          dataPoints: rawData.length,
          cacheHit: false,
        }
      };

      // Cache the result
      this.setCache(cacheKey, result);

      return result;

    } catch (error) {
      console.error('Error executing analytics query:', error);
      throw error;
    }
  }

  /**
   * Generate predictive insights for metrics
   */
  async generatePredictiveInsights(organizationId?: string): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];
    const db = await getDb();

    try {
      // Get recent metrics for analysis
      const collection = organizationId
        ? db.collection('analytics').doc(organizationId).collection('metrics')
        : db.collectionGroup('metrics');

      const snapshot = await collection
        .where('timestamp', '>', Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        .orderBy('timestamp', 'desc')
        .limit(10000)
        .get();

      const metrics: AnalyticsMetric[] = [];
      snapshot.forEach(doc => {
        metrics.push(doc.data() as AnalyticsMetric);
      });

      // Group by metric name
      const metricGroups = new Map<string, AnalyticsMetric[]>();
      metrics.forEach(metric => {
        if (!metricGroups.has(metric.name)) {
          metricGroups.set(metric.name, []);
        }
        metricGroups.get(metric.name)!.push(metric);
      });

      // Generate insights for each metric group
      for (const [metricName, metricData] of metricGroups) {
        if (metricData.length < 10) continue; // Need minimum data points

        // Sort by timestamp
        metricData.sort((a, b) => a.timestamp - b.timestamp);

        // Apply each predictive model
        for (const [modelName, modelFunction] of this.predictiveModels) {
          try {
            const insight = await modelFunction(metricName, metricData);
            if (insight) {
              insights.push({
                ...insight,
                organizationId,
              });
            }
          } catch (error) {
            console.error(`Error applying model ${modelName} to ${metricName}:`, error);
          }
        }
      }

      // Store insights
      for (const insight of insights) {
        const insightCollection = organizationId
          ? db.collection('analytics').doc(organizationId).collection('insights')
          : db.collection('analytics').doc('system').collection('insights');

        await insightCollection.doc(insight.id).set(insight);
      }

      console.log(`🔮 Generated ${insights.length} predictive insights`);
      return insights;

    } catch (error) {
      console.error('Error generating predictive insights:', error);
      return [];
    }
  }

  /**
   * Create a custom dashboard
   */
  async createDashboard(dashboard: Omit<CustomDashboard, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const db = await getDb();
    
    const fullDashboard: CustomDashboard = {
      id: `dashboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...dashboard,
    };

    const collection = dashboard.organizationId
      ? db.collection('analytics').doc(dashboard.organizationId).collection('dashboards')
      : db.collection('analytics').doc('system').collection('dashboards');

    await collection.doc(fullDashboard.id).set(fullDashboard);

    return fullDashboard.id;
  }

  /**
   * Get dashboard data with real-time updates
   */
  async getDashboardData(dashboardId: string, organizationId?: string): Promise<{
    dashboard: CustomDashboard;
    widgetData: Record<string, any>;
  }> {
    const db = await getDb();
    
    // Get dashboard configuration
    const collection = organizationId
      ? db.collection('analytics').doc(organizationId).collection('dashboards')
      : db.collection('analytics').doc('system').collection('dashboards');

    const dashboardDoc = await collection.doc(dashboardId).get();
    if (!dashboardDoc.exists) {
      throw new Error('Dashboard not found');
    }

    const dashboard = dashboardDoc.data() as CustomDashboard;
    const widgetData: Record<string, any> = {};

    // Fetch data for each widget
    for (const widget of dashboard.widgets) {
      try {
        const data = await this.getWidgetData(widget, organizationId);
        widgetData[widget.id] = data;
      } catch (error) {
        console.error(`Error fetching data for widget ${widget.id}:`, error);
        widgetData[widget.id] = { error: 'Failed to load data' };
      }
    }

    return { dashboard, widgetData };
  }

  /**
   * Detect anomalies in real-time
   */
  async detectAnomalies(organizationId?: string): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];
    const db = await getDb();

    try {
      // Get recent metrics
      const collection = organizationId
        ? db.collection('analytics').doc(organizationId).collection('metrics')
        : db.collectionGroup('metrics');

      const snapshot = await collection
        .where('timestamp', '>', Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        .orderBy('timestamp', 'desc')
        .limit(5000)
        .get();

      const metrics: AnalyticsMetric[] = [];
      snapshot.forEach(doc => {
        metrics.push(doc.data() as AnalyticsMetric);
      });

      // Group by metric name and detect anomalies
      const metricGroups = new Map<string, AnalyticsMetric[]>();
      metrics.forEach(metric => {
        if (!metricGroups.has(metric.name)) {
          metricGroups.set(metric.name, []);
        }
        metricGroups.get(metric.name)!.push(metric);
      });

      for (const [metricName, metricData] of metricGroups) {
        if (metricData.length < 20) continue; // Need sufficient data

        const anomalies = this.detectStatisticalAnomalies(metricData);
        for (const anomaly of anomalies) {
          insights.push({
            id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            metricId: anomaly.id,
            type: 'anomaly',
            prediction: anomaly.value,
            confidence: anomaly.confidence,
            timeHorizon: 0,
            factors: ['statistical_deviation'],
            recommendation: `Investigate unusual ${metricName} value: ${anomaly.value}`,
            impact: anomaly.severity,
            timestamp: Date.now(),
            organizationId,
          });
        }
      }

      return insights;

    } catch (error) {
      console.error('Error detecting anomalies:', error);
      return [];
    }
  }

  // PRIVATE HELPER METHODS

  /**
   * Linear trend prediction model
   */
  private async linearTrendModel(metricName: string, data: AnalyticsMetric[]): Promise<PredictiveInsight | null> {
    if (data.length < 10) return null;

    // Calculate linear regression
    const n = data.length;
    const sumX = data.reduce((sum, _, i) => sum + i, 0);
    const sumY = data.reduce((sum, d) => sum + d.value, 0);
    const sumXY = data.reduce((sum, d, i) => sum + i * d.value, 0);
    const sumXX = data.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict future value
    const futureIndex = n + this.config.predictionHorizonDays;
    const prediction = slope * futureIndex + intercept;

    // Calculate confidence based on R-squared
    const mean = sumY / n;
    const totalSumSquares = data.reduce((sum, d) => sum + Math.pow(d.value - mean, 2), 0);
    const residualSumSquares = data.reduce((sum, d, i) => {
      const predicted = slope * i + intercept;
      return sum + Math.pow(d.value - predicted, 2);
    }, 0);
    const rSquared = 1 - (residualSumSquares / totalSumSquares);
    const confidence = Math.max(0, Math.min(100, rSquared * 100));

    return {
      id: `trend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metricId: metricName,
      type: 'trend',
      prediction,
      confidence,
      timeHorizon: this.config.predictionHorizonDays,
      factors: ['linear_regression', 'historical_trend'],
      recommendation: slope > 0 ? `${metricName} is trending upward` : `${metricName} is trending downward`,
      impact: Math.abs(slope) > mean * 0.1 ? 'high' : 'medium',
      timestamp: Date.now(),
    };
  }

  /**
   * Seasonal forecast model
   */
  private async seasonalForecastModel(metricName: string, data: AnalyticsMetric[]): Promise<PredictiveInsight | null> {
    if (data.length < 28) return null; // Need at least 4 weeks of data

    // Detect weekly seasonality
    const weeklyPattern = this.detectSeasonalPattern(data, 7);
    if (!weeklyPattern.isSignificant) return null;

    // Forecast based on seasonal pattern
    const dayOfWeek = new Date().getDay();
    const prediction = weeklyPattern.pattern[dayOfWeek];

    return {
      id: `seasonal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metricId: metricName,
      type: 'forecast',
      prediction,
      confidence: weeklyPattern.confidence,
      timeHorizon: 7,
      factors: ['seasonal_pattern', 'weekly_cycle'],
      recommendation: `${metricName} follows weekly seasonal pattern`,
      impact: 'medium',
      timestamp: Date.now(),
    };
  }

  /**
   * Anomaly detection model
   */
  private async anomalyDetectionModel(metricName: string, data: AnalyticsMetric[]): Promise<PredictiveInsight | null> {
    const anomalies = this.detectStatisticalAnomalies(data);
    if (anomalies.length === 0) return null;

    const latestAnomaly = anomalies[0];
    
    return {
      id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metricId: metricName,
      type: 'anomaly',
      prediction: latestAnomaly.value,
      confidence: latestAnomaly.confidence,
      timeHorizon: 0,
      factors: ['statistical_deviation'],
      recommendation: `Unusual ${metricName} value detected`,
      impact: latestAnomaly.severity,
      timestamp: Date.now(),
    };
  }

  /**
   * Capacity prediction model
   */
  private async capacityPredictionModel(metricName: string, data: AnalyticsMetric[]): Promise<PredictiveInsight | null> {
    if (!metricName.includes('capacity') && !metricName.includes('usage')) return null;
    
    // Calculate growth rate
    const recent = data.slice(-7); // Last 7 data points
    const historical = data.slice(-14, -7); // Previous 7 data points
    
    if (recent.length < 5 || historical.length < 5) return null;

    const recentAvg = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
    const historicalAvg = historical.reduce((sum, d) => sum + d.value, 0) / historical.length;
    const growthRate = (recentAvg - historicalAvg) / historicalAvg;

    // Predict when capacity might be reached (assuming 100% capacity)
    const currentUsage = recentAvg;
    const daysToCapacity = growthRate > 0 ? (100 - currentUsage) / (growthRate * currentUsage / 7) : -1;

    if (daysToCapacity > 0 && daysToCapacity < 30) {
      return {
        id: `capacity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metricId: metricName,
        type: 'forecast',
        prediction: daysToCapacity,
        confidence: 75,
        timeHorizon: Math.ceil(daysToCapacity),
        factors: ['growth_rate', 'capacity_planning'],
        recommendation: `Capacity may be reached in ${Math.ceil(daysToCapacity)} days`,
        impact: daysToCapacity < 7 ? 'critical' : daysToCapacity < 14 ? 'high' : 'medium',
        timestamp: Date.now(),
      };
    }

    return null;
  }

  /**
   * Revenue forecast model
   */
  private async revenueForecastModel(metricName: string, data: AnalyticsMetric[]): Promise<PredictiveInsight | null> {
    if (!metricName.includes('revenue') && !metricName.includes('income')) return null;
    
    // Simple moving average forecast
    const windowSize = Math.min(7, data.length);
    const recent = data.slice(-windowSize);
    const average = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
    
    // Calculate prediction confidence based on variance
    const variance = recent.reduce((sum, d) => sum + Math.pow(d.value - average, 2), 0) / recent.length;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = standardDeviation / average;
    const confidence = Math.max(50, Math.min(95, 100 - coefficientOfVariation * 100));

    return {
      id: `revenue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metricId: metricName,
      type: 'forecast',
      prediction: average,
      confidence,
      timeHorizon: 7,
      factors: ['moving_average', 'historical_performance'],
      recommendation: `Expected ${metricName}: ${average.toFixed(2)}`,
      impact: 'medium',
      timestamp: Date.now(),
    };
  }

  /**
   * Process real-time alerts for a metric
   */
  private async processRealTimeAlerts(metric: AnalyticsMetric): Promise<void> {
    const db = await getDb();
    
    // Get active alerts for this metric
    const collection = metric.organizationId
      ? db.collection('analytics').doc(metric.organizationId).collection('alerts')
      : db.collection('analytics').doc('system').collection('alerts');

    const snapshot = await collection
      .where('metricId', '==', metric.name)
      .where('status', '==', 'active')
      .get();

    const alerts: AnalyticsAlert[] = [];
    snapshot.forEach(doc => {
      alerts.push(doc.data() as AnalyticsAlert);
    });

    // Process each alert
    for (const alert of alerts) {
      const processor = this.alertProcessors.get('threshold');
      if (processor) {
        try {
          await processor(alert, metric);
        } catch (error) {
          console.error(`Error processing alert ${alert.id}:`, error);
        }
      }
    }
  }

  /**
   * Threshold alert processor
   */
  private async thresholdAlertProcessor(alert: AnalyticsAlert, metric: AnalyticsMetric): Promise<void> {
    let triggered = false;

    switch (alert.operator) {
      case 'gt':
        triggered = metric.value > alert.threshold;
        break;
      case 'lt':
        triggered = metric.value < alert.threshold;
        break;
      case 'eq':
        triggered = metric.value === alert.threshold;
        break;
      case 'ne':
        triggered = metric.value !== alert.threshold;
        break;
    }

    if (triggered) {
      console.log(`🚨 Alert triggered: ${alert.condition} (${metric.value} ${alert.operator} ${alert.threshold})`);
      
      // Here you would typically send notifications
      // For now, we'll just log the alert
    }
  }

  /**
   * Rate of change alert processor
   */
  private async rateChangeAlertProcessor(alert: AnalyticsAlert, metric: AnalyticsMetric): Promise<void> {
    // Implementation for rate of change alerts
    console.log(`📈 Processing rate change alert for ${metric.name}`);
  }

  /**
   * Anomaly alert processor
   */
  private async anomalyAlertProcessor(alert: AnalyticsAlert, metric: AnalyticsMetric): Promise<void> {
    // Implementation for anomaly alerts
    console.log(`🔍 Processing anomaly alert for ${metric.name}`);
  }

  /**
   * Pattern alert processor
   */
  private async patternAlertProcessor(alert: AnalyticsAlert, metric: AnalyticsMetric): Promise<void> {
    // Implementation for pattern-based alerts
    console.log(`🎯 Processing pattern alert for ${metric.name}`);
  }

  /**
   * Generate insights for a specific query
   */
  private async generateInsightsForQuery(query: AnalyticsQuery, data: AnalyticsMetric[]): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];
    
    // Group by metric name
    const metricGroups = new Map<string, AnalyticsMetric[]>();
    data.forEach(metric => {
      if (!metricGroups.has(metric.name)) {
        metricGroups.set(metric.name, []);
      }
      metricGroups.get(metric.name)!.push(metric);
    });

    // Generate insights for each metric
    for (const [metricName, metricData] of metricGroups) {
      if (metricData.length >= 5) {
        const trendInsight = await this.linearTrendModel(metricName, metricData);
        if (trendInsight) {
          insights.push(trendInsight);
        }
      }
    }

    return insights;
  }

  /**
   * Evaluate alerts for query results
   */
  private async evaluateAlerts(query: AnalyticsQuery, data: AnalyticsMetric[]): Promise<AnalyticsAlert[]> {
    // Return empty array for now - alerts would be evaluated against the data
    return [];
  }

  /**
   * Aggregate data by time granularity
   */
  private aggregateByGranularity(data: AnalyticsMetric[], granularity: AnalyticsQuery['granularity']): AnalyticsResult['data'] {
    const buckets = new Map<number, { values: Record<string, number[]>; dimensions: Record<string, string> }>();

    // Calculate bucket size in milliseconds
    const bucketSize = this.getBucketSize(granularity);

    data.forEach(metric => {
      const bucketTimestamp = Math.floor(metric.timestamp / bucketSize) * bucketSize;
      
      if (!buckets.has(bucketTimestamp)) {
        buckets.set(bucketTimestamp, { 
          values: {}, 
          dimensions: metric.dimensions || {} 
        });
      }

      const bucket = buckets.get(bucketTimestamp)!;
      if (!bucket.values[metric.name]) {
        bucket.values[metric.name] = [];
      }
      bucket.values[metric.name].push(metric.value);
    });

    // Convert buckets to result format
    const result: AnalyticsResult['data'] = [];
    buckets.forEach((bucket, timestamp) => {
      const values: Record<string, number> = {};
      Object.entries(bucket.values).forEach(([name, vals]) => {
        values[name] = vals.reduce((sum, val) => sum + val, 0) / vals.length; // Average
      });

      result.push({
        timestamp,
        values,
        dimensions: bucket.dimensions,
      });
    });

    return result.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get bucket size for time granularity
   */
  private getBucketSize(granularity: AnalyticsQuery['granularity']): number {
    switch (granularity) {
      case 'minute': return 60 * 1000;
      case 'hour': return 60 * 60 * 1000;
      case 'day': return 24 * 60 * 60 * 1000;
      case 'week': return 7 * 24 * 60 * 60 * 1000;
      case 'month': return 30 * 24 * 60 * 60 * 1000;
      default: return 60 * 60 * 1000;
    }
  }

  /**
   * Detect seasonal patterns in data
   */
  private detectSeasonalPattern(data: AnalyticsMetric[], period: number): {
    pattern: number[];
    confidence: number;
    isSignificant: boolean;
  } {
    if (data.length < period * 2) {
      return { pattern: [], confidence: 0, isSignificant: false };
    }

    const pattern: number[] = new Array(period).fill(0);
    const counts: number[] = new Array(period).fill(0);

    // Calculate average for each position in the cycle
    data.forEach((metric, index) => {
      const position = index % period;
      pattern[position] += metric.value;
      counts[position]++;
    });

    // Average the values
    pattern.forEach((sum, i) => {
      pattern[i] = counts[i] > 0 ? sum / counts[i] : 0;
    });

    // Calculate confidence based on consistency
    const overallMean = pattern.reduce((sum, val) => sum + val, 0) / pattern.length;
    const variance = pattern.reduce((sum, val) => sum + Math.pow(val - overallMean, 2), 0) / pattern.length;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = overallMean > 0 ? standardDeviation / overallMean : 1;
    
    const confidence = Math.max(0, Math.min(100, (1 - coefficientOfVariation) * 100));
    const isSignificant = confidence > 60; // Threshold for significance

    return { pattern, confidence, isSignificant };
  }

  /**
   * Detect statistical anomalies in data
   */
  private detectStatisticalAnomalies(data: AnalyticsMetric[]): Array<{
    id: string;
    value: number;
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }> {
    if (data.length < 10) return [];

    const values = data.map(d => d.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    const anomalies: Array<{
      id: string;
      value: number;
      confidence: number;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }> = [];

    data.forEach(metric => {
      const zScore = Math.abs((metric.value - mean) / standardDeviation);
      
      if (zScore > this.config.anomalyThreshold) {
        let severity: 'low' | 'medium' | 'high' | 'critical';
        if (zScore > 4) severity = 'critical';
        else if (zScore > 3) severity = 'high';
        else if (zScore > 2.5) severity = 'medium';
        else severity = 'low';

        anomalies.push({
          id: metric.id,
          value: metric.value,
          confidence: Math.min(95, zScore * 20), // Convert z-score to confidence percentage
          severity,
        });
      }
    });

    return anomalies.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get widget data based on widget configuration
   */
  private async getWidgetData(widget: DashboardWidget, organizationId?: string): Promise<any> {
    switch (widget.type) {
      case 'metric':
        return this.getMetricWidgetData(widget, organizationId);
      case 'chart':
        return this.getChartWidgetData(widget, organizationId);
      case 'kpi':
        return this.getKPIWidgetData(widget, organizationId);
      case 'trend':
        return this.getTrendWidgetData(widget, organizationId);
      default:
        return { error: 'Unsupported widget type' };
    }
  }

  /**
   * Get metric widget data
   */
  private async getMetricWidgetData(widget: DashboardWidget, organizationId?: string): Promise<any> {
    const query: AnalyticsQuery = {
      metrics: [widget.config.metric || widget.dataSource],
      timeRange: {
        start: Date.now() - (widget.config.timeRange || 24) * 60 * 60 * 1000,
        end: Date.now(),
      },
      granularity: widget.config.granularity || 'hour',
      organizationId,
    };

    const result = await this.executeQuery(query);
    
    return {
      currentValue: result.aggregations.avg || 0,
      previousValue: result.data.length > 1 ? result.data[result.data.length - 2].values[widget.config.metric] || 0 : 0,
      change: result.data.length > 1 ? 
        ((result.aggregations.avg || 0) - (result.data[result.data.length - 2].values[widget.config.metric] || 0)) : 0,
      trend: result.insights.filter(i => i.type === 'trend')[0] || null,
    };
  }

  /**
   * Get chart widget data
   */
  private async getChartWidgetData(widget: DashboardWidget, organizationId?: string): Promise<any> {
    const query: AnalyticsQuery = {
      metrics: widget.config.metrics || [widget.dataSource],
      timeRange: {
        start: Date.now() - (widget.config.timeRange || 168) * 60 * 60 * 1000, // Default 7 days
        end: Date.now(),
      },
      granularity: widget.config.granularity || 'hour',
      organizationId,
    };

    const result = await this.executeQuery(query);
    
    return {
      labels: result.data.map(d => new Date(d.timestamp).toISOString()),
      datasets: Object.keys(result.data[0]?.values || {}).map(metric => ({
        label: metric,
        data: result.data.map(d => d.values[metric] || 0),
      })),
      insights: result.insights,
    };
  }

  /**
   * Get KPI widget data
   */
  private async getKPIWidgetData(widget: DashboardWidget, organizationId?: string): Promise<any> {
    // Similar to metric widget but with KPI-specific formatting
    return this.getMetricWidgetData(widget, organizationId);
  }

  /**
   * Get trend widget data
   */
  private async getTrendWidgetData(widget: DashboardWidget, organizationId?: string): Promise<any> {
    const query: AnalyticsQuery = {
      metrics: [widget.config.metric || widget.dataSource],
      timeRange: {
        start: Date.now() - (widget.config.timeRange || 168) * 60 * 60 * 1000,
        end: Date.now(),
      },
      granularity: widget.config.granularity || 'day',
      organizationId,
    };

    const result = await this.executeQuery(query);
    const trendInsights = result.insights.filter(i => i.type === 'trend');
    
    return {
      data: result.data,
      trend: trendInsights[0] || null,
      prediction: trendInsights[0]?.prediction || null,
      confidence: trendInsights[0]?.confidence || 0,
    };
  }

  /**
   * Process scheduled analytics tasks
   */
  private async processScheduledAnalytics(): Promise<void> {
    try {
      console.log('🔄 Processing scheduled analytics...');
      
      // Generate insights for all organizations
      await this.generatePredictiveInsights();
      
      // Detect anomalies
      await this.detectAnomalies();
      
      console.log('✅ Scheduled analytics processing complete');
    } catch (error) {
      console.error('Error in scheduled analytics:', error);
    }
  }

  /**
   * Cache management methods
   */
  private generateCacheKey(query: AnalyticsQuery): string {
    return `query_${JSON.stringify(query)}_${Math.floor(Date.now() / this.config.cacheTimeoutMs)}`;
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    if (this.cache.size >= this.config.maxCacheSize) {
      // Remove oldest entries
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].expiry - b[1].expiry);
      const toRemove = entries.slice(0, Math.floor(this.config.maxCacheSize * 0.2));
      toRemove.forEach(([k]) => this.cache.delete(k));
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + this.config.cacheTimeoutMs,
    });
  }

  private invalidateCache(metricName: string, organizationId?: string): void {
    const keysToRemove: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.includes(metricName) || (organizationId && key.includes(organizationId))) {
        keysToRemove.push(key);
      }
    });
    keysToRemove.forEach(key => this.cache.delete(key));
  }

  private cleanCache(): void {
    const now = Date.now();
    const keysToRemove: string[] = [];
    
    this.cache.forEach((value, key) => {
      if (value.expiry <= now) {
        keysToRemove.push(key);
      }
    });
    
    keysToRemove.forEach(key => this.cache.delete(key));
    
    console.log(`🧹 Cleaned ${keysToRemove.length} expired cache entries`);
  }

  /**
   * Get system status
   */
  getSystemStatus(): {
    initialized: boolean;
    cacheSize: number;
    modelsLoaded: number;
    alertProcessors: number;
  } {
    return {
      initialized: true,
      cacheSize: this.cache.size,
      modelsLoaded: this.predictiveModels.size,
      alertProcessors: this.alertProcessors.size,
    };
  }
}

// Export singleton instance
export const advancedAnalyticsEngine = new AdvancedAnalyticsEngine();

export default advancedAnalyticsEngine;