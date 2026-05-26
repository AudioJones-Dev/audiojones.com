import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/legacyAdmin';

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = await adminAuth().verifyIdToken(token, true);

    // Get user's dashboard data
    const dashboardData = await getDashboardData(decoded.uid);

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Portal dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getDashboardData(userId: string) {
  // TODO: In a real implementation, these would query your actual data sources
  // For now, return mock data that matches the interface

  const mockData = {
    nextActions: [
      {
        id: '1',
        title: 'Review brand logo concepts',
        type: 'approval' as const,
        dueDate: 'Today',
        urgent: true,
      },
      {
        id: '2',
        title: 'Update payment method',
        type: 'payment' as const,
        dueDate: 'Nov 5, 2025',
        urgent: false,
      },
      {
        id: '3',
        title: 'Strategy consultation call',
        type: 'meeting' as const,
        dueDate: 'Nov 3, 2025',
        urgent: false,
      },
    ],
    billingStatus: {
      status: 'active' as const,
      nextBilling: 'Nov 15, 2025',
      amount: 2500,
    },
    upcomingMeetings: [
      {
        id: '1',
        title: 'Brand Strategy Review',
        date: 'Nov 3, 2025 at 2:00 PM',
        type: 'consultation',
        meetingLink: 'https://meet.google.com/abc-def-ghi',
      },
      {
        id: '2',
        title: 'Weekly Check-in',
        date: 'Nov 6, 2025 at 10:00 AM',
        type: 'status-update',
      },
    ],
    projectSummary: {
      total: 5,
      active: 3,
      completed: 2,
      pendingApprovals: 2,
    },
    recentActivity: [
      {
        id: '1',
        action: 'New file uploaded: brand-guidelines-v2.pdf',
        date: '2 hours ago',
        type: 'file' as const,
      },
      {
        id: '2',
        action: 'Project milestone completed: Logo design',
        date: '1 day ago',
        type: 'project' as const,
      },
      {
        id: '3',
        action: 'Content approval submitted for review',
        date: '2 days ago',
        type: 'approval' as const,
      },
    ],
  };

  return mockData;
}