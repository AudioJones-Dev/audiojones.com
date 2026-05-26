import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/legacyAdmin';

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = await adminAuth().verifyIdToken(token, true);
    
    if (!decoded.admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch dashboard statistics
    // In a real implementation, these would query your actual data sources
    const dashboardData = {
      totalUsers: await getTotalUsers(),
      adminUsers: await getAdminUsers(),
      pendingApprovals: await getPendingApprovals(),
      activeProjects: await getActiveProjects(),
      systemHealth: await getSystemHealth(),
      lastWebhook: await getLastWebhookTime(),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions - these would connect to your actual data sources
async function getTotalUsers(): Promise<number> {
  // TODO: Query Retired auth or your user database
  return 42; // Placeholder
}

async function getAdminUsers(): Promise<number> {
  // TODO: Query users with admin custom claims
  return 3; // Placeholder
}

async function getPendingApprovals(): Promise<number> {
  // TODO: Query content approval system
  return 7; // Placeholder
}

async function getActiveProjects(): Promise<number> {
  // TODO: Query project database
  return 15; // Placeholder
}

async function getSystemHealth(): Promise<'healthy' | 'warning' | 'error'> {
  try {
    // TODO: Check various system components
    // - retired auth connectivity
    // - Database connectivity
    // - External API health
    return 'healthy';
  } catch (error) {
    return 'error';
  }
}

async function getLastWebhookTime(): Promise<string> {
  // TODO: Query webhook logs for most recent activity
  return '2 minutes ago'; // Placeholder
}