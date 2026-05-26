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

    // Get user's projects
    const projects = await getUserProjects(decoded.uid);

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getUserProjects(userId: string) {
  // TODO: In a real implementation, query your project database
  // For now, return mock data

  const mockProjects = [
    {
      id: '1',
      name: 'Brand Identity Redesign',
      status: 'in-progress',
      progress: 75,
      startDate: 'Oct 15, 2025',
      endDate: 'Nov 30, 2025',
      description: 'Complete overhaul of brand identity including logo, color palette, and brand guidelines.',
      teamMembers: [
        { name: 'Sarah Johnson', role: 'Creative Director' },
        { name: 'Mike Chen', role: 'Brand Strategist' },
        { name: 'Alex Rivera', role: 'Graphic Designer' },
      ],
      milestones: [
        { id: '1', name: 'Brand Discovery', status: 'completed', dueDate: 'Oct 20, 2025' },
        { id: '2', name: 'Logo Concepts', status: 'completed', dueDate: 'Oct 25, 2025' },
        { id: '3', name: 'Brand Guidelines', status: 'in-progress', dueDate: 'Nov 10, 2025' },
        { id: '4', name: 'Final Delivery', status: 'pending', dueDate: 'Nov 30, 2025' },
      ],
      nextMilestone: 'Complete Brand Guidelines',
    },
    {
      id: '2',
      name: 'Website Development',
      status: 'review',
      progress: 90,
      startDate: 'Sep 1, 2025',
      endDate: 'Nov 15, 2025',
      description: 'Modern, responsive website with integrated e-commerce functionality.',
      teamMembers: [
        { name: 'David Park', role: 'Lead Developer' },
        { name: 'Emma Wilson', role: 'UX Designer' },
      ],
      milestones: [
        { id: '1', name: 'Wireframes', status: 'completed', dueDate: 'Sep 10, 2025' },
        { id: '2', name: 'Design System', status: 'completed', dueDate: 'Sep 25, 2025' },
        { id: '3', name: 'Development', status: 'completed', dueDate: 'Oct 30, 2025' },
        { id: '4', name: 'Client Review', status: 'in-progress', dueDate: 'Nov 5, 2025' },
      ],
      nextMilestone: 'Client Approval',
    },
    {
      id: '3',
      name: 'Social Media Campaign',
      status: 'planning',
      progress: 25,
      startDate: 'Nov 1, 2025',
      endDate: 'Dec 15, 2025',
      description: 'Comprehensive social media strategy and content creation for Q4 launch.',
      teamMembers: [
        { name: 'Lisa Martinez', role: 'Social Media Manager' },
        { name: 'James Thompson', role: 'Content Creator' },
      ],
      milestones: [
        { id: '1', name: 'Strategy Development', status: 'in-progress', dueDate: 'Nov 8, 2025' },
        { id: '2', name: 'Content Creation', status: 'pending', dueDate: 'Nov 20, 2025' },
        { id: '3', name: 'Campaign Launch', status: 'pending', dueDate: 'Dec 1, 2025' },
      ],
      nextMilestone: 'Complete Strategy',
    },
  ];

  return mockProjects;
}