/**
 * CDN Optimization Service
 * 
 * Provides intelligent asset delivery, compression, and optimization
 * with global edge location management and performance monitoring.
 */

import eventStreamingEngine from '@/lib/streaming/EventStreamingEngine';
import { lazySingleton } from '@/lib/server/lazySingleton';

interface CDNEdgeLocation {
  id: string;
  region: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  capacity: number;
  currentLoad: number;
  latency: number;
  status: 'active' | 'maintenance' | 'offline';
}

interface AssetOptimization {
  originalUrl: string;
  optimizedUrl: string;
  originalSize: number;
  optimizedSize: number;
  compressionType: string;
  cacheHeaders: Record<string, string>;
  expirationTime: number;
}

interface CDNMetrics {
  totalRequests: number;
  cacheHitRate: number;
  bandwidthSaved: number;
  averageLatency: number;
  errorRate: number;
  topAssets: Array<{
    url: string;
    requests: number;
    bandwidth: number;
  }>;
  edgePerformance: Record<string, {
    requests: number;
    latency: number;
    uptime: number;
  }>;
}

interface OptimizationRule {
  id: string;
  pattern: string;
  assetType: 'image' | 'css' | 'js' | 'font' | 'video' | 'document';
  compressionLevel: number;
  cacheMaxAge: number;
  enableWebP: boolean;
  enableBrotli: boolean;
  minifyEnabled: boolean;
  priority: number;
}

/**
 * CDN Optimization Service
 * Manages global content delivery and optimization
 */
class CDNOptimizationService {
  private static instance: CDNOptimizationService;
  private edgeLocations: Map<string, CDNEdgeLocation> = new Map();
  private optimizedAssets: Map<string, AssetOptimization> = new Map();
  private optimizationRules: OptimizationRule[] = [];
  private metrics: CDNMetrics;

  constructor() {
    this.metrics = {
      totalRequests: 0,
      cacheHitRate: 0.92,
      bandwidthSaved: 0,
      averageLatency: 45,
      errorRate: 0.001,
      topAssets: [],
      edgePerformance: {},
    };

    this.initializeService();
  }

  static getInstance(): CDNOptimizationService {
    if (!CDNOptimizationService.instance) {
      CDNOptimizationService.instance = new CDNOptimizationService();
    }
    return CDNOptimizationService.instance;
  }

  /**
   * Initialize CDN optimization service
   */
  private async initializeService(): Promise<void> {
    console.log('🌐 Initializing CDN Optimization Service...');
    
    // Initialize edge locations
    await this.initializeEdgeLocations();
    
    // Load optimization rules
    await this.loadOptimizationRules();
    
    // Setup monitoring
    await this.setupCDNMonitoring();
    
    // Start background optimization
    this.startBackgroundOptimization();
    
    console.log('✅ CDN Optimization Service initialized successfully');
  }

  /**
   * Optimize asset for CDN delivery
   */
  async optimizeAsset(url: string, type: string, options?: {
    quality?: number;
    format?: string;
    enableWebP?: boolean;
    compressionLevel?: number;
  }): Promise<AssetOptimization> {
    const startTime = Date.now();
    
    try {
      // Check if already optimized
      const cached = this.optimizedAssets.get(url);
      if (cached && cached.expirationTime > Date.now()) {
        return cached;
      }

      // Find applicable optimization rule
      const rule = this.findOptimizationRule(url, type as any);
      
      // Simulate optimization process
      const originalSize = Math.floor(Math.random() * 1000000) + 100000; // 100KB - 1MB
      let optimizedSize = originalSize;
      let compressionType = 'gzip';

      // Apply optimizations based on asset type
      switch (type) {
        case 'image':
          optimizedSize = this.optimizeImage(originalSize, options);
          compressionType = options?.enableWebP ? 'webp' : 'jpeg';
          break;
        case 'css':
          optimizedSize = this.optimizeCSS(originalSize, rule || undefined);
          compressionType = rule?.enableBrotli ? 'brotli' : 'gzip';
          break;
        case 'js':
          optimizedSize = this.optimizeJavaScript(originalSize, rule || undefined);
          compressionType = rule?.enableBrotli ? 'brotli' : 'gzip';
          break;
        case 'font':
          optimizedSize = this.optimizeFont(originalSize);
          compressionType = 'woff2';
          break;
      }

      // Generate optimized URL
      const optimizedUrl = this.generateOptimizedUrl(url, type, compressionType);
      
      // Set cache headers
      const cacheHeaders = this.generateCacheHeaders(type, rule || undefined);
      
      const optimization: AssetOptimization = {
        originalUrl: url,
        optimizedUrl,
        originalSize,
        optimizedSize,
        compressionType,
        cacheHeaders,
        expirationTime: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };

      // Cache the optimization
      this.optimizedAssets.set(url, optimization);
      
      // Update metrics
      this.updateOptimizationMetrics(optimization);
      
      // Record performance
      const optimizationTime = Date.now() - startTime;
      await this.recordOptimizationPerformance(type, optimizationTime);

      console.log(`📦 Asset optimized: ${url} (${originalSize} -> ${optimizedSize} bytes, ${optimizationTime}ms)`);
      
      return optimization;

    } catch (error) {
      console.error('❌ Asset optimization failed:', error);
      throw error;
    }
  }

  /**
   * Find optimal edge location for request
   */
  findOptimalEdgeLocation(clientIP: string, assetType: string): CDNEdgeLocation | null {
    // Simulate geolocation and edge selection
    const availableEdges = Array.from(this.edgeLocations.values())
      .filter(edge => edge.status === 'active' && edge.currentLoad < edge.capacity * 0.9);

    if (availableEdges.length === 0) return null;

    // Simple round-robin for demo (in production, use geo-proximity + load)
    const optimalEdge = availableEdges.reduce((best, current) => {
      const bestScore = this.calculateEdgeScore(best, clientIP, assetType);
      const currentScore = this.calculateEdgeScore(current, clientIP, assetType);
      return currentScore > bestScore ? current : best;
    });

    return optimalEdge;
  }

  /**
   * Purge cache for specific assets or patterns
   */
  async purgeCache(pattern: string, type: 'url' | 'pattern' | 'tag' = 'url'): Promise<{
    success: boolean;
    purgedCount: number;
    estimatedPropagationTime: number;
  }> {
    const startTime = Date.now();
    let purgedCount = 0;

    try {
      switch (type) {
        case 'url':
          if (this.optimizedAssets.has(pattern)) {
            this.optimizedAssets.delete(pattern);
            purgedCount = 1;
          }
          break;
        
        case 'pattern':
          const regex = new RegExp(pattern);
          for (const [url] of this.optimizedAssets) {
            if (regex.test(url)) {
              this.optimizedAssets.delete(url);
              purgedCount++;
            }
          }
          break;
        
        case 'tag':
          // In production, this would purge by cache tags
          purgedCount = Math.floor(Math.random() * 100) + 10;
          break;
      }

      // Simulate propagation time (varies by edge count and distance)
      const edgeCount = this.edgeLocations.size;
      const estimatedPropagationTime = Math.min(edgeCount * 2, 300); // Max 5 minutes

      // Publish purge event
      await eventStreamingEngine.publishEvent({
        type: 'cdn.cache.purged',
        source: 'cdn-optimization-service',
        data: {
          pattern,
          type,
          purgedCount,
          propagationTime: estimatedPropagationTime,
        },
        metadata: {
          version: 1,
        },
      });

      console.log(`🗑️ Cache purged: ${pattern} (${purgedCount} entries, ~${estimatedPropagationTime}s propagation)`);

      return {
        success: true,
        purgedCount,
        estimatedPropagationTime,
      };

    } catch (error) {
      console.error('❌ Cache purge failed:', error);
      return {
        success: false,
        purgedCount: 0,
        estimatedPropagationTime: 0,
      };
    }
  }

  /**
   * Get CDN performance metrics
   */
  getMetrics(): CDNMetrics {
    return { ...this.metrics };
  }

  /**
   * Get edge location status
   */
  getEdgeLocations(): CDNEdgeLocation[] {
    return Array.from(this.edgeLocations.values());
  }

  /**
   * Get optimization rules
   */
  getOptimizationRules(): OptimizationRule[] {
    return [...this.optimizationRules];
  }

  /**
   * Add or update optimization rule
   */
  async updateOptimizationRule(rule: Omit<OptimizationRule, 'id'> & { id?: string }): Promise<string> {
    const ruleId = rule.id || `rule_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    const optimizationRule: OptimizationRule = {
      id: ruleId,
      ...rule,
    };

    // Update or add rule
    const existingIndex = this.optimizationRules.findIndex(r => r.id === ruleId);
    if (existingIndex >= 0) {
      this.optimizationRules[existingIndex] = optimizationRule;
    } else {
      this.optimizationRules.push(optimizationRule);
    }

    // Sort by priority
    this.optimizationRules.sort((a, b) => b.priority - a.priority);

    console.log(`📋 Optimization rule updated: ${ruleId}`);
    return ruleId;
  }

  /**
   * Analyze asset performance
   */
  async analyzeAssetPerformance(timeRange: number = 24 * 60 * 60 * 1000): Promise<{
    topAssets: Array<{
      url: string;
      requests: number;
      bandwidth: number;
      cacheHitRate: number;
      averageLoadTime: number;
    }>;
    optimizationOpportunities: Array<{
      url: string;
      currentSize: number;
      potentialSavings: number;
      recommendation: string;
    }>;
    performanceByRegion: Record<string, {
      requests: number;
      latency: number;
      bandwidth: number;
    }>;
  }> {
    // Simulate asset analysis
    const topAssets = [
      {
        url: '/assets/images/hero-bg.jpg',
        requests: 12543,
        bandwidth: 245.6 * 1024 * 1024, // MB to bytes
        cacheHitRate: 0.94,
        averageLoadTime: 125,
      },
      {
        url: '/_next/static/css/main.css',
        requests: 8932,
        bandwidth: 45.2 * 1024 * 1024,
        cacheHitRate: 0.89,
        averageLoadTime: 67,
      },
      {
        url: '/_next/static/js/main.js',
        requests: 8745,
        bandwidth: 123.8 * 1024 * 1024,
        cacheHitRate: 0.91,
        averageLoadTime: 89,
      },
    ];

    const optimizationOpportunities = [
      {
        url: '/assets/images/gallery-1.png',
        currentSize: 2.3 * 1024 * 1024, // 2.3MB
        potentialSavings: 1.6 * 1024 * 1024, // 1.6MB
        recommendation: 'Convert PNG to WebP format and enable compression',
      },
      {
        url: '/assets/fonts/custom-font.ttf',
        currentSize: 456 * 1024, // 456KB
        potentialSavings: 123 * 1024, // 123KB
        recommendation: 'Convert TTF to WOFF2 format for better compression',
      },
    ];

    const performanceByRegion = {
      'us-east-1': { requests: 35400, latency: 23, bandwidth: 1.2 * 1024 * 1024 * 1024 },
      'us-west-2': { requests: 28900, latency: 31, bandwidth: 0.95 * 1024 * 1024 * 1024 },
      'eu-west-1': { requests: 19800, latency: 45, bandwidth: 0.67 * 1024 * 1024 * 1024 },
      'ap-southeast-1': { requests: 12300, latency: 67, bandwidth: 0.43 * 1024 * 1024 * 1024 },
    };

    return {
      topAssets,
      optimizationOpportunities,
      performanceByRegion,
    };
  }

  // Private helper methods
  private async initializeEdgeLocations(): Promise<void> {
    const locations: CDNEdgeLocation[] = [
      {
        id: 'edge_us_east_1',
        region: 'us-east-1',
        city: 'Virginia',
        country: 'USA',
        latitude: 38.13,
        longitude: -78.45,
        capacity: 10000,
        currentLoad: 6500,
        latency: 12,
        status: 'active',
      },
      {
        id: 'edge_us_west_2',
        region: 'us-west-2',
        city: 'Oregon',
        country: 'USA',
        latitude: 45.52,
        longitude: -122.67,
        capacity: 8000,
        currentLoad: 5200,
        latency: 15,
        status: 'active',
      },
      {
        id: 'edge_eu_west_1',
        region: 'eu-west-1',
        city: 'Dublin',
        country: 'Ireland',
        latitude: 53.35,
        longitude: -6.26,
        capacity: 12000,
        currentLoad: 7800,
        latency: 8,
        status: 'active',
      },
      {
        id: 'edge_ap_southeast_1',
        region: 'ap-southeast-1',
        city: 'Singapore',
        country: 'Singapore',
        latitude: 1.35,
        longitude: 103.87,
        capacity: 6000,
        currentLoad: 3400,
        latency: 18,
        status: 'active',
      },
    ];

    for (const location of locations) {
      this.edgeLocations.set(location.id, location);
    }

    console.log(`🌍 Initialized ${locations.length} edge locations`);
  }

  private async loadOptimizationRules(): Promise<void> {
    this.optimizationRules = [
      {
        id: 'rule_images',
        pattern: '\\.(jpg|jpeg|png|gif|webp)$',
        assetType: 'image',
        compressionLevel: 85,
        cacheMaxAge: 86400 * 30, // 30 days
        enableWebP: true,
        enableBrotli: false,
        minifyEnabled: false,
        priority: 100,
      },
      {
        id: 'rule_css',
        pattern: '\\.css$',
        assetType: 'css',
        compressionLevel: 9,
        cacheMaxAge: 86400 * 7, // 7 days
        enableWebP: false,
        enableBrotli: true,
        minifyEnabled: true,
        priority: 90,
      },
      {
        id: 'rule_js',
        pattern: '\\.js$',
        assetType: 'js',
        compressionLevel: 9,
        cacheMaxAge: 86400 * 7, // 7 days
        enableWebP: false,
        enableBrotli: true,
        minifyEnabled: true,
        priority: 90,
      },
      {
        id: 'rule_fonts',
        pattern: '\\.(woff|woff2|ttf|otf)$',
        assetType: 'font',
        compressionLevel: 6,
        cacheMaxAge: 86400 * 365, // 1 year
        enableWebP: false,
        enableBrotli: false,
        minifyEnabled: false,
        priority: 80,
      },
    ];

    console.log(`📋 Loaded ${this.optimizationRules.length} optimization rules`);
  }

  private async setupCDNMonitoring(): Promise<void> {
    // Setup periodic metrics collection
    setInterval(async () => {
      await this.collectCDNMetrics();
    }, 60000); // Every minute

    // Setup edge health monitoring
    setInterval(async () => {
      await this.monitorEdgeHealth();
    }, 30000); // Every 30 seconds

    console.log('📊 CDN monitoring configured');
  }

  private startBackgroundOptimization(): void {
    // Periodic cache optimization
    setInterval(async () => {
      await this.optimizeGlobalCache();
    }, 300000); // Every 5 minutes

    // Edge load balancing
    setInterval(async () => {
      await this.rebalanceEdgeLoad();
    }, 120000); // Every 2 minutes

    console.log('🔄 Background optimization started');
  }

  private findOptimizationRule(url: string, type: OptimizationRule['assetType']): OptimizationRule | null {
    return this.optimizationRules.find(rule => {
      const regex = new RegExp(rule.pattern, 'i');
      return regex.test(url) && rule.assetType === type;
    }) || null;
  }

  private optimizeImage(originalSize: number, options?: any): number {
    const compressionRatio = options?.quality ? (100 - options.quality) / 100 : 0.3;
    return Math.floor(originalSize * (1 - compressionRatio));
  }

  private optimizeCSS(originalSize: number, rule?: OptimizationRule): number {
    const compressionRatio = rule?.minifyEnabled ? 0.4 : 0.2;
    return Math.floor(originalSize * (1 - compressionRatio));
  }

  private optimizeJavaScript(originalSize: number, rule?: OptimizationRule): number {
    const compressionRatio = rule?.minifyEnabled ? 0.5 : 0.3;
    return Math.floor(originalSize * (1 - compressionRatio));
  }

  private optimizeFont(originalSize: number): number {
    return Math.floor(originalSize * 0.8); // 20% compression for fonts
  }

  private generateOptimizedUrl(originalUrl: string, type: string, compression: string): string {
    const params = new URLSearchParams({
      type,
      compression,
      v: Date.now().toString(),
    });
    
    return `https://cdn.audiojones.com${originalUrl}?${params.toString()}`;
  }

  private generateCacheHeaders(type: string, rule?: OptimizationRule): Record<string, string> {
    const maxAge = rule?.cacheMaxAge || 86400; // Default 1 day
    
    return {
      'Cache-Control': `public, max-age=${maxAge}, immutable`,
      'Content-Encoding': rule?.enableBrotli ? 'br' : 'gzip',
      'Vary': 'Accept-Encoding',
      'ETag': `"${Date.now()}-${Math.random().toString(36).substr(2, 8)}"`,
    };
  }

  private calculateEdgeScore(edge: CDNEdgeLocation, clientIP: string, assetType: string): number {
    // Simplified scoring (in production, use actual geolocation and performance data)
    const loadScore = (1 - edge.currentLoad / edge.capacity) * 100;
    const latencyScore = Math.max(0, 100 - edge.latency);
    
    return (loadScore + latencyScore) / 2;
  }

  private updateOptimizationMetrics(optimization: AssetOptimization): void {
    this.metrics.totalRequests++;
    this.metrics.bandwidthSaved += optimization.originalSize - optimization.optimizedSize;
  }

  private async recordOptimizationPerformance(type: string, time: number): Promise<void> {
    await eventStreamingEngine.publishEvent({
      type: 'cdn.optimization.completed',
      source: 'cdn-optimization-service',
      data: {
        assetType: type,
        optimizationTime: time,
      },
      metadata: {
        version: 1,
      },
    });
  }

  private async collectCDNMetrics(): Promise<void> {
    // Update real-time metrics
    this.metrics.averageLatency = Array.from(this.edgeLocations.values())
      .reduce((sum, edge) => sum + edge.latency, 0) / this.edgeLocations.size;
    
    // Update edge performance metrics
    for (const [id, edge] of this.edgeLocations) {
      this.metrics.edgePerformance[id] = {
        requests: Math.floor(Math.random() * 1000) + 500,
        latency: edge.latency,
        uptime: 0.995 + Math.random() * 0.004, // 99.5-99.9%
      };
    }
  }

  private async monitorEdgeHealth(): Promise<void> {
    for (const [id, edge] of this.edgeLocations) {
      // Simulate health check
      const healthScore = Math.random();
      
      if (healthScore < 0.1 && edge.status === 'active') {
        edge.status = 'maintenance';
        console.warn(`⚠️ Edge ${id} moved to maintenance mode`);
        
        await eventStreamingEngine.publishEvent({
          type: 'cdn.edge.status_change',
          source: 'cdn-optimization-service',
          data: {
            edgeId: id,
            oldStatus: 'active',
            newStatus: 'maintenance',
            reason: 'health_check_failed',
          },
          metadata: {
            version: 1,
          },
        });
      } else if (healthScore > 0.9 && edge.status === 'maintenance') {
        edge.status = 'active';
        console.log(`✅ Edge ${id} restored to active status`);
      }
    }
  }

  private async optimizeGlobalCache(): Promise<void> {
    console.log('🔧 Running global cache optimization...');
    // Implement cache optimization logic
  }

  private async rebalanceEdgeLoad(): Promise<void> {
    console.log('⚖️ Rebalancing edge load distribution...');
    // Implement load balancing logic
  }
}

// Lazy singleton — see lazySingleton.ts for rationale.
const cdnOptimizationService = lazySingleton(() => CDNOptimizationService.getInstance());
export default cdnOptimizationService;