/**
 * Feature Flags Evaluation API
 * Handles client-side feature flag evaluation requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { featureFlagsEngine } from '@/lib/featureflags/FeatureFlagsEngine';
import { getAdminAuth } from '@/lib/server/legacyAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { flag_key, context = {} } = body;

    if (!flag_key) {
      return NextResponse.json({
        success: false,
        error: 'flag_key is required'
      }, { status: 400 });
    }

    // Extract user context from authorization header if present
    const authHeader = request.headers.get('authorization');
    let userId: string | undefined;
    let userAttributes: Record<string, any> = {};

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decodedToken = await getAdminAuth().verifyIdToken(token);
        userId = decodedToken.uid;
        userAttributes = {
          email: decodedToken.email,
          email_verified: decodedToken.email_verified,
          admin: decodedToken.admin || false,
          ...context.user_attributes
        };
      } catch (error) {
        // Invalid token, continue as anonymous user
        console.warn('Invalid auth token for feature flag evaluation:', error);
      }
    }

    // Build evaluation context
    const evaluationContext = {
      user_id: userId || context.user_id,
      organization_id: context.organization_id,
      session_id: context.session_id,
      user_attributes: userAttributes,
      request_context: {
        ip: request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date().toISOString(),
        ...context.request_context
      }
    };

    // Evaluate feature flag
    const result = await featureFlagsEngine.evaluateFeatureFlag(flag_key, evaluationContext);

    return NextResponse.json({
      success: true,
      data: {
        flag_key,
        enabled: result.enabled,
        variant: result.variant,
        value: result.value,
        reason: result.reason,
        evaluation_time_ms: result.evaluation_time_ms
      }
    });

  } catch (error) {
    console.error('Feature flag evaluation API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const flagKey = searchParams.get('flag_key');
    
    if (!flagKey) {
      return NextResponse.json({
        success: false,
        error: 'flag_key parameter is required'
      }, { status: 400 });
    }

    // Extract user context from authorization header if present
    const authHeader = request.headers.get('authorization');
    let userId: string | undefined;
    let userAttributes: Record<string, any> = {};

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decodedToken = await getAdminAuth().verifyIdToken(token);
        userId = decodedToken.uid;
        userAttributes = {
          email: decodedToken.email,
          email_verified: decodedToken.email_verified,
          admin: decodedToken.admin || false
        };
      } catch (error) {
        // Invalid token, continue as anonymous user
        console.warn('Invalid auth token for feature flag evaluation:', error);
      }
    }

    // Build minimal evaluation context for GET requests
    const evaluationContext = {
      user_id: userId,
      organization_id: searchParams.get('organization_id') || undefined,
      session_id: searchParams.get('session_id') || undefined,
      user_attributes: userAttributes,
      request_context: {
        ip: request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date().toISOString()
      }
    };

    // Evaluate feature flag
    const result = await featureFlagsEngine.evaluateFeatureFlag(flagKey, evaluationContext);

    return NextResponse.json({
      success: true,
      data: {
        flag_key: flagKey,
        enabled: result.enabled,
        variant: result.variant,
        value: result.value,
        reason: result.reason,
        evaluation_time_ms: result.evaluation_time_ms
      }
    });

  } catch (error) {
    console.error('Feature flag evaluation API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}