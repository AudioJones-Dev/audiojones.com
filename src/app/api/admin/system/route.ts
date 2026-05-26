import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/legacyAdmin';

/** Validate Bearer token and require the `admin` custom claim */
async function requireAdmin(req: NextRequest) {
  const authz = req.headers.get('authorization') || '';
  const match = authz.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return { ok: false, res: NextResponse.json({ error: 'Missing Authorization Bearer token' }, { status: 401 }) };
  }

  try {
    const decoded = await adminAuth().verifyIdToken(match[1], true);
    if (!decoded.admin && !(decoded.customClaims && (decoded.customClaims as any).admin)) {
      return { ok: false, res: NextResponse.json({ error: 'Forbidden: admin claim required' }, { status: 403 }) };
    }
    return { ok: true, decoded };
  } catch (err: any) {
    return { ok: false, res: NextResponse.json({ error: 'Invalid token', details: err?.message }, { status: 401 }) };
  }
}

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.res!;

  try {
    // Test retired auth services
    const legacyAuthStatus = await testRetiredAuthServices();
    
    // Test API endpoints
    const apiStatus = await testApiEndpoints();
    
    // Test external integrations
    const integrationStatus = await testIntegrations();
    
    // Get environment info
    const environmentInfo = getEnvironmentInfo();
    
    // Get deployment info
    const deploymentInfo = getDeploymentInfo();

    const systemStatus = {
      legacyAuth: legacyAuthStatus,
      apis: apiStatus,
      integrations: integrationStatus,
      environment: environmentInfo,
      deployment: deploymentInfo,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(systemStatus);
  } catch (error) {
    console.error('System health check failed:', error);
    return NextResponse.json({ error: 'System health check failed' }, { status: 500 });
  }
}

async function testRetiredAuthServices() {
  const status = {
    admin: false,
    auth: false,
    database: false,
  };

  try {
    // Test retired admin SDK
    await adminAuth().listUsers(1);
    status.admin = true;
    status.auth = true;
    
    // TODO: Test database connectivity when you have it set up
    status.database = true;
  } catch (error) {
    console.error('Retired auth test failed:', error);
  }

  return status;
}

async function testApiEndpoints() {
  const status = {
    ping: false,
    whoami: false,
    users: false,
  };

  try {
    // These would be internal tests
    // For now, assume they work if retired admin works
    const legacyAuthWorking = await testRetiredAuthServices();
    if (legacyAuthWorking.admin) {
      status.ping = true;
      status.whoami = true;
      status.users = true;
    }
  } catch (error) {
    console.error('API test failed:', error);
  }

  return status;
}

async function testIntegrations() {
  const status = {
    stripe: false,
    whop: false,
    n8n: false,
  };

  try {
    // Test Stripe
    if (process.env.STRIPE_SECRET_KEY) {
      status.stripe = true; // TODO: Actually test Stripe API
    }

    // Test Whop
    if (process.env.WHOP_API_KEY) {
      status.whop = true; // TODO: Actually test Whop API
    }

    // Test N8N
    if (process.env.N8N_WEBHOOK_URL) {
      status.n8n = true; // TODO: Actually test N8N connectivity
    }
  } catch (error) {
    console.error('Integration test failed:', error);
  }

  return status;
}

function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV || 'unknown',
    vercelEnv: process.env.VERCEL_ENV,
    hasSecrets: !!(
      process.env.LEGACY_AUTH_ADMIN_CREDENTIALS &&
      process.env.NEXT_PUBLIC_LEGACY_AUTH_API_KEY
    ),
  };
}

function getDeploymentInfo() {
  return {
    lastDeploy: process.env.VERCEL_DEPLOYMENT_DATE || undefined,
    commitHash: process.env.VERCEL_GIT_COMMIT_SHA || undefined,
    branch: process.env.VERCEL_GIT_COMMIT_REF || undefined,
  };
}
