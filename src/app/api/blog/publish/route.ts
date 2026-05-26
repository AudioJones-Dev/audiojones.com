// Blog Publish API
// Handles publishing blog drafts and content distribution

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/legacyAdmin';
import { BlogDraft, BlogStatus } from '@/lib/models/blog';
import { revalidatePath } from 'next/cache';

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

// POST /api/blog/publish - Publish a draft
export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { draftId, scheduledFor, distributionChannels = ['website'] } = await req.json();
    
    if (!draftId) {
      return NextResponse.json(
        { success: false, error: 'Draft ID is required' },
        { status: 400 }
      );
    }

    // TODO: Get draft from Data Connect database
    const draft = await getDraftById(draftId);
    
    if (!draft) {
      return NextResponse.json(
        { success: false, error: 'Draft not found' },
        { status: 404 }
      );
    }

    if (draft.status !== 'approved' && draft.status !== 'scheduled') {
      return NextResponse.json(
        { success: false, error: 'Only approved or scheduled drafts can be published' },
        { status: 400 }
      );
    }

    const publishTime = scheduledFor ? new Date(scheduledFor) : new Date();
    
    // Update draft status to published
    const publishedDraft = await updateDraftStatus(draftId, 'published', publishTime);

    // Revalidate blog pages in Next.js
    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${draft.slug}`);
    } catch (revalidateError) {
      console.warn('Failed to revalidate pages:', revalidateError);
    }

    // Create content performance tracking record
    await createPerformanceRecord(draftId, draft.slug, draft.pillar);

    // Queue distribution tasks
    const distributionTasks = await queueDistribution(publishedDraft, distributionChannels);

    return NextResponse.json({
      success: true,
      data: {
        draft: publishedDraft,
        publishedAt: publishTime.toISOString(),
        distributionTasks,
        revalidatedPaths: ['/blog', `/blog/${draft.slug}`]
      }
    });
  } catch (error) {
    console.error('Failed to publish draft:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish draft', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: error instanceof Error && error.message === 'Authentication failed' ? 401 : 500 }
    );
  }
}

// PUT /api/blog/publish/schedule - Schedule a draft for future publishing
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { draftId, scheduledFor, distributionChannels = ['website', 'newsletter'] } = await req.json();
    
    if (!draftId || !scheduledFor) {
      return NextResponse.json(
        { success: false, error: 'Draft ID and scheduled time are required' },
        { status: 400 }
      );
    }

    const scheduleTime = new Date(scheduledFor);
    
    if (scheduleTime <= new Date()) {
      return NextResponse.json(
        { success: false, error: 'Scheduled time must be in the future' },
        { status: 400 }
      );
    }

    // TODO: Get draft from Data Connect database
    const draft = await getDraftById(draftId);
    
    if (!draft) {
      return NextResponse.json(
        { success: false, error: 'Draft not found' },
        { status: 404 }
      );
    }

    if (draft.status !== 'approved') {
      return NextResponse.json(
        { success: false, error: 'Only approved drafts can be scheduled' },
        { status: 400 }
      );
    }

    // Update draft status and schedule
    const scheduledDraft = await scheduleDraft(draftId, scheduleTime, distributionChannels);

    return NextResponse.json({
      success: true,
      data: {
        draft: scheduledDraft,
        scheduledFor: scheduleTime.toISOString(),
        distributionChannels
      }
    });
  } catch (error) {
    console.error('Failed to schedule draft:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to schedule draft' },
      { status: error instanceof Error && error.message === 'Authentication failed' ? 401 : 500 }
    );
  }
}

// DELETE /api/blog/publish/[id] - Unpublish a blog post
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);

    const url = new URL(req.url);
    const draftId = url.pathname.split('/').pop();
    
    if (!draftId) {
      return NextResponse.json(
        { success: false, error: 'Draft ID is required' },
        { status: 400 }
      );
    }

    // TODO: Get draft from Data Connect database
    const draft = await getDraftById(draftId);
    
    if (!draft) {
      return NextResponse.json(
        { success: false, error: 'Draft not found' },
        { status: 404 }
      );
    }

    if (draft.status !== 'published') {
      return NextResponse.json(
        { success: false, error: 'Only published drafts can be unpublished' },
        { status: 400 }
      );
    }

    // Update draft status to draft
    const unpublishedDraft = await updateDraftStatus(draftId, 'draft');

    // Revalidate blog pages
    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${draft.slug}`);
    } catch (revalidateError) {
      console.warn('Failed to revalidate pages:', revalidateError);
    }

    return NextResponse.json({
      success: true,
      data: {
        draft: unpublishedDraft,
        unpublishedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Failed to unpublish draft:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unpublish draft' },
      { status: error instanceof Error && error.message === 'Authentication failed' ? 401 : 500 }
    );
  }
}

// Helper functions (TODO: Replace with Data Connect queries)

async function getDraftById(id: string): Promise<BlogDraft | null> {
  // TODO: Implement Data Connect query
  // For now, return mock data
  return {
    id,
    pillar: 'ai',
    source: 'perplexity',
    status: 'approved',
    title: 'Sample Blog Post',
    slug: 'sample-blog-post',
    content: '# Sample Content',
    seoKeywords: ['test'],
    keyTakeaways: ['Key takeaway'],
    ctaType: 'newsletter',
    ctaHeadline: 'Subscribe',
    ctaDescription: 'Get updates',
    ctaLink: '/newsletter',
    readingTime: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

async function updateDraftStatus(id: string, status: BlogStatus, publishedAt?: Date): Promise<BlogDraft> {
  // TODO: Implement Data Connect mutation
  const draft = await getDraftById(id);
  if (draft) {
    draft.status = status;
    draft.updatedAt = new Date();
    if (publishedAt) {
      draft.publishedAt = publishedAt;
    }
  }
  return draft!;
}

async function scheduleDraft(id: string, scheduledFor: Date, distributionChannels: string[]): Promise<BlogDraft> {
  // TODO: Implement Data Connect mutation for scheduling
  const draft = await getDraftById(id);
  if (draft) {
    draft.status = 'scheduled';
    draft.scheduledFor = scheduledFor;
    draft.updatedAt = new Date();
  }
  return draft!;
}

async function createPerformanceRecord(draftId: string, slug: string, pillar: string): Promise<void> {
  // TODO: Implement Data Connect mutation to create ContentPerformance record
  console.log(`Creating performance record for ${draftId}`);
}

async function queueDistribution(draft: BlogDraft, channels: string[]): Promise<Array<{ channel: string; status: string }>> {
  const tasks: Array<{ channel: string; status: string }> = [];

  for (const channel of channels) {
    try {
      switch (channel) {
        case 'website':
          // Already handled by publishing the draft
          tasks.push({ channel, status: 'completed' });
          break;
          
        case 'newsletter':
          await queueNewsletterDistribution(draft);
          tasks.push({ channel, status: 'queued' });
          break;
          
        case 'social':
          if (draft.pillar === 'podcast-news') {
            await queueSocialDistribution(draft);
            tasks.push({ channel, status: 'queued' });
          } else {
            tasks.push({ channel, status: 'skipped' });
          }
          break;
          
        default:
          tasks.push({ channel, status: 'unknown' });
      }
    } catch (error) {
      console.error(`Failed to queue ${channel} distribution:`, error);
      tasks.push({ channel, status: 'failed' });
    }
  }

  return tasks;
}

async function queueNewsletterDistribution(draft: BlogDraft): Promise<void> {
  // TODO: Integrate with MailerLite API
  console.log(`Queuing newsletter distribution for: ${draft.title}`);
  
  const newsletterPayload = {
    title: draft.title,
    summary: draft.seoDescription || `New ${draft.pillar} insights from Audio Jones`,
    link: `https://audiojones.com/blog/${draft.slug}`,
    pillar: draft.pillar,
    keyTakeaways: draft.keyTakeaways.slice(0, 3)
  };

  // Queue for newsletter campaign creation
  // await mailerlite.campaigns.create(newsletterPayload);
}

async function queueSocialDistribution(draft: BlogDraft): Promise<void> {
  // TODO: Create social media variants for podcast-news content
  console.log(`Queuing social distribution for: ${draft.title}`);
  
  if (draft.pillar === 'podcast-news') {
    const socialVariant = {
      originalContent: draft.content,
      maxLength: 280,
      platforms: ['twitter', 'linkedin'],
      tone: 'audiojones-social'
    };

    // Queue for social media posting
    // await socialQueue.add(socialVariant);
  }
}