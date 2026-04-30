/**
 * Feature Flags Admin API
 * CRUD operations for feature flags management
 */

import { NextRequest, NextResponse } from 'next/server';
import { featureFlagsEngine } from '@/lib/featureflags/FeatureFlagsEngine';

export async function GET(request: NextRequest) {
  try {
    const { checkAdmin } = await import('@/lib/server/requireAdmin');
    const adminResponse = checkAdmin(request);
    if (adminResponse) {
      return adminResponse;
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'dashboard': {
        console.log('📊 Getting feature flags dashboard metrics');
        
        // Get all flags
        const flags = await featureFlagsEngine.getAllFeatureFlags();
        
        // Calculate metrics
        const totalFlags = flags.length;
        const activeFlags = flags.filter(f => f.status === 'active').length;
        const flagsWithKillSwitch = flags.filter(f => f.kill_switch?.enabled).length;
        const flagsInRollout = flags.filter(f => f.rollout.enabled && f.rollout.percentage < 100).length;
        
        // Get recent metrics
        const recentMetrics = await featureFlagsEngine.getFeatureFlagMetrics(undefined, 1);
        const totalEvaluations = recentMetrics.reduce((sum, m) => sum + m.total_evaluations, 0);
        const avgEvaluationTime = recentMetrics.reduce((sum, m) => sum + m.avg_evaluation_time_ms, 0) / Math.max(recentMetrics.length, 1);
        
        // Top flags by usage
        const topFlags = flags
          .sort((a, b) => b.metadata.total_evaluations - a.metadata.total_evaluations)
          .slice(0, 5)
          .map(f => ({
            key: f.key,
            name: f.name,
            evaluations: f.metadata.total_evaluations,
            rollout_percentage: f.rollout.percentage,
            status: f.status
          }));

        return NextResponse.json({
          success: true,
          data: {
            metrics: {
              total_flags: totalFlags,
              active_flags: activeFlags,
              flags_with_kill_switch: flagsWithKillSwitch,
              flags_in_rollout: flagsInRollout,
              total_evaluations_24h: totalEvaluations,
              avg_evaluation_time_ms: Math.round(avgEvaluationTime),
              top_flags_by_usage: topFlags
            },
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'flags': {
        console.log('🚩 Getting all feature flags');
        const flags = await featureFlagsEngine.getAllFeatureFlags();
        
        return NextResponse.json({
          success: true,
          data: {
            flags,
            total: flags.length
          }
        });
      }

      case 'flag': {
        const flagKey = searchParams.get('flag_key');
        if (!flagKey) {
          return NextResponse.json({
            success: false,
            error: 'flag_key parameter is required'
          }, { status: 400 });
        }

        console.log(`🚩 Getting feature flag details: ${flagKey}`);
        const db = (await import('@/lib/server/firebaseAdmin')).getDb();
        
        // Get flag
        const flagQuery = await db
          .collection('feature_flags')
          .where('key', '==', flagKey)
          .limit(1)
          .get();

        if (flagQuery.empty) {
          return NextResponse.json({
            success: false,
            error: 'Feature flag not found'
          }, { status: 404 });
        }

        const flag = { id: flagQuery.docs[0].id, ...flagQuery.docs[0].data() };

        // Get recent metrics
        const metrics = await featureFlagsEngine.getFeatureFlagMetrics(flagKey, 7);

        // Get recent evaluations
        const evaluationsSnapshot = await db
          .collection('feature_flag_evaluations')
          .where('flag_key', '==', flagKey)
          .orderBy('evaluation_context.timestamp', 'desc')
          .limit(50)
          .get();

        const evaluations = evaluationsSnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        }));

        return NextResponse.json({
          success: true,
          data: {
            flag,
            metrics,
            recent_evaluations: evaluations
          }
        });
      }

      case 'metrics': {
        const flagKey = searchParams.get('flag_key');
        const days = parseInt(searchParams.get('days') || '7');

        console.log(`📈 Getting feature flag metrics${flagKey ? ` for ${flagKey}` : ''}`);
        const metrics = await featureFlagsEngine.getFeatureFlagMetrics(flagKey || undefined, days);

        return NextResponse.json({
          success: true,
          data: { metrics }
        });
      }

      case 'audit_log': {
        const flagKey = searchParams.get('flag_key');
        const limit = parseInt(searchParams.get('limit') || '50');

        console.log(`📋 Getting feature flag audit log${flagKey ? ` for ${flagKey}` : ''}`);
        const db = (await import('@/lib/server/firebaseAdmin')).getDb();
        
        let auditSnapshot;
        
        if (flagKey) {
          auditSnapshot = await db.collection('feature_flag_audit_log')
            .where('flag_key', '==', flagKey)
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
        } else {
          auditSnapshot = await db.collection('feature_flag_audit_log')
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .get();
        }

        const auditLog = auditSnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        }));

        return NextResponse.json({
          success: true,
          data: { audit_log: auditLog }
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Feature flags admin API GET error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { checkAdmin } = await import('@/lib/server/requireAdmin');
    const adminResponse = checkAdmin(request);
    if (adminResponse) {
      return adminResponse;
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'initialize': {
        console.log('🚀 Initializing feature flags system');
        await featureFlagsEngine.initialize();

        return NextResponse.json({
          success: true,
          message: 'Feature flags system initialized successfully'
        });
      }

      case 'create_flag': {
        const { name, key, description, config } = body;
        
        if (!name || !key || !description) {
          return NextResponse.json({
            success: false,
            error: 'name, key, and description are required'
          }, { status: 400 });
        }

        console.log(`🚩 Creating feature flag: ${name} (${key})`);
        const flag = await featureFlagsEngine.createFeatureFlag(
          name,
          key,
          description,
          'admin-system',
          config || {}
        );

        return NextResponse.json({
          success: true,
          data: { flag },
          message: `Feature flag '${name}' created successfully`
        });
      }

      case 'update_rollout': {
        const { flag_key, percentage } = body;
        
        if (!flag_key || percentage === undefined) {
          return NextResponse.json({
            success: false,
            error: 'flag_key and percentage are required'
          }, { status: 400 });
        }

        if (percentage < 0 || percentage > 100) {
          return NextResponse.json({
            success: false,
            error: 'percentage must be between 0 and 100'
          }, { status: 400 });
        }

        console.log(`🎯 Updating rollout for ${flag_key}: ${percentage}%`);
        await featureFlagsEngine.updateRollout(flag_key, percentage, 'admin-system');

        return NextResponse.json({
          success: true,
          message: `Rollout updated to ${percentage}% for flag '${flag_key}'`
        });
      }

      case 'trigger_kill_switch': {
        const { flag_key, reason } = body;
        
        if (!flag_key || !reason) {
          return NextResponse.json({
            success: false,
            error: 'flag_key and reason are required'
          }, { status: 400 });
        }

        console.log(`🔴 Triggering kill switch for ${flag_key}`);
        await featureFlagsEngine.triggerKillSwitch(flag_key, 'admin-system', reason);

        return NextResponse.json({
          success: true,
          message: `Kill switch activated for flag '${flag_key}'`
        });
      }

      case 'disable_kill_switch': {
        const { flag_key } = body;
        
        if (!flag_key) {
          return NextResponse.json({
            success: false,
            error: 'flag_key is required'
          }, { status: 400 });
        }

        console.log(`🟢 Disabling kill switch for ${flag_key}`);
        const db = (await import('@/lib/server/firebaseAdmin')).getDb();
        
        // Get flag
        const flagQuery = await db
          .collection('feature_flags')
          .where('key', '==', flag_key)
          .limit(1)
          .get();

        if (flagQuery.empty) {
          return NextResponse.json({
            success: false,
            error: 'Feature flag not found'
          }, { status: 404 });
        }

        const flagDoc = flagQuery.docs[0];

        // Disable kill switch
        await flagDoc.ref.update({
          'kill_switch.enabled': false,
          'kill_switch.disabled_at': new Date(),
          'kill_switch.disabled_by': 'admin-system',
          updated_at: new Date()
        });

        // Log activity
        await db.collection('feature_flag_audit_log').add({
          timestamp: new Date(),
          flag_key,
          user_id: 'admin-system',
          action: 'kill_switch_disabled',
          metadata: {
            disabled_at: new Date().toISOString()
          },
          success: true
        });

        return NextResponse.json({
          success: true,
          message: `Kill switch disabled for flag '${flag_key}'`
        });
      }

      case 'update_flag': {
        const { flag_key, updates } = body;
        
        if (!flag_key || !updates) {
          return NextResponse.json({
            success: false,
            error: 'flag_key and updates are required'
          }, { status: 400 });
        }

        console.log(`📝 Updating feature flag: ${flag_key}`);
        const db = (await import('@/lib/server/firebaseAdmin')).getDb();
        
        // Get flag
        const flagQuery = await db
          .collection('feature_flags')
          .where('key', '==', flag_key)
          .limit(1)
          .get();

        if (flagQuery.empty) {
          return NextResponse.json({
            success: false,
            error: 'Feature flag not found'
          }, { status: 404 });
        }

        const flagDoc = flagQuery.docs[0];

        // Update flag
        await flagDoc.ref.update({
          ...updates,
          updated_at: new Date()
        });

        // Log activity
        await db.collection('feature_flag_audit_log').add({
          timestamp: new Date(),
          flag_key,
          user_id: 'admin-system',
          action: 'flag_updated',
          metadata: {
            updates,
            updated_at: new Date().toISOString()
          },
          success: true
        });

        return NextResponse.json({
          success: true,
          message: `Feature flag '${flag_key}' updated successfully`
        });
      }

      case 'gradual_rollout': {
        console.log('📈 Performing gradual rollout increases');
        await featureFlagsEngine.performGradualRollout();

        return NextResponse.json({
          success: true,
          message: 'Gradual rollout increases performed'
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Feature flags admin API POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}