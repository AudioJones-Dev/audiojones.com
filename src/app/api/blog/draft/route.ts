// Blog Draft Management API
// Handles CRUD operations for blog drafts with retired admin authentication

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/legacyAdmin';
import { blogGenerator } from '@/lib/automation/blog-generator';
import { BlogDraft, validateBlogDraft, PillarType, CTAType } from '@/lib/models/blog';

// Verify admin authentication
async function requireAdmin(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth().verifyIdToken(token, true);
    
    if (!decodedToken.admin) {
      throw new Error('Admin privileges required');
    }

    return decodedToken;
  } catch (error) {
    throw new Error('Authentication failed');
  }
}

// GET /api/blog/draft - List all drafts with filtering
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const pillar = searchParams.get('pillar');
    const source = searchParams.get('source');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Replace with Data Connect query
    // For now, return mock data structure
    const mockDrafts = [
      {
        id: '1',
        title: 'AI Marketing Automation for Creators',
        slug: 'ai-marketing-automation-creators',
        pillar: 'ai',
        source: 'perplexity',
        status: 'needs_review',
        seoDescription: 'Discover how creators can leverage AI marketing automation...',
        readingTime: 7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: null,
        contentPerformance: null
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        drafts: mockDrafts,
        total: mockDrafts.length,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('Failed to list drafts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list drafts' },
      { status: error instanceof Error && error.message === 'Authentication failed' ? 401 : 500 }
    );
  }
}

// POST /api/blog/draft - Create new draft
export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const body = await req.json();
    
    // Validate required fields
    const { pillar, topic, persona = 'entrepreneur', intent = 'educate', ctaType = 'newsletter', framework } = body;
    
    if (!pillar || !topic) {
      return NextResponse.json(
        { success: false, error: 'Pillar and topic are required' },
        { status: 400 }
      );
    }

    // Generate blog using automation pipeline
    const generationResult = await blogGenerator.generateBlog({
      pillar: pillar as PillarType,
      topic,
      persona,
      intent,
      ctaType: ctaType as CTAType,
      framework
    });

    // Validate the generated draft
    const validation = validateBlogDraft(generationResult.draft);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: 'Generated draft validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // TODO: Save to Data Connect database
    // For now, return the generated draft
    const savedDraft = {
      id: `draft_${Date.now()}`,
      ...generationResult.draft,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: {
        draft: savedDraft,
        voiceValidation: generationResult.voiceValidation,
        aeoScore: generationResult.aeoScore,
        researchUsed: {
          topic: generationResult.researchUsed.topic,
          summary: generationResult.researchUsed.summary,
          keyPoints: generationResult.researchUsed.keyPoints.slice(0, 3) // Truncate for response
        }
      }
    });
  } catch (error) {
    console.error('Failed to create draft:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create draft', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/draft/[id] - Update existing draft
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req);

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Draft ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    
    // Validate the updated draft
    const validation = validateBlogDraft(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: 'Draft validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // TODO: Update in Data Connect database
    const updatedDraft = {
      id,
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: { draft: updatedDraft }
    });
  } catch (error) {
    console.error('Failed to update draft:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update draft' },
      { status: error instanceof Error && error.message === 'Authentication failed' ? 401 : 500 }
    );
  }
}

// DELETE /api/blog/draft/[id] - Delete draft
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);

    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Draft ID is required' },
        { status: 400 }
      );
    }

    // TODO: Delete from Data Connect database
    
    return NextResponse.json({
      success: true,
      data: { message: 'Draft deleted successfully' }
    });
  } catch (error) {
    console.error('Failed to delete draft:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete draft' },
      { status: error instanceof Error && error.message === 'Authentication failed' ? 401 : 500 }
    );
  }
}