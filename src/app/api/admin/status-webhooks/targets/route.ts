/**
 * Status Webhook Targets Admin API
 * 
 * Manages webhook targets with admin-key protection:
 * - GET: List all webhook targets
 * - POST: Create new webhook target
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAdminKey } from '@/lib/server/adminSession';
import { 
  getAllWebhookTargets,
  createWebhookTarget,
  validateWebhookTargetData,
  type CreateWebhookTargetData
} from '@/lib/server/statusWebhookTargets';

async function requireAdminKey(request: NextRequest): Promise<void> {
  const adminKey = request.headers.get('admin-key');
  const expectedAdminKey = process.env.ADMIN_KEY;
  
  if (!expectedAdminKey || !isAdminKey(adminKey ?? '', expectedAdminKey)) {
    throw new Error('Unauthorized: Invalid admin key');
  }
}

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminKey(request);

    // Get all webhook targets
    const targets = await getAllWebhookTargets();

    return NextResponse.json({
      success: true,
      targets,
    });

  } catch (error: any) {
    console.error('Error fetching webhook targets:', error);

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch webhook targets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminKey(request);

    // Parse request body
    const body = await request.json();
    const targetData: CreateWebhookTargetData = {
      url: body.url,
      secret: body.secret,
      events: body.events,
      description: body.description,
    };

    // Validate data
    const validationErrors = validateWebhookTargetData(targetData);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    // Create webhook target
    const targetId = await createWebhookTarget(targetData);

    return NextResponse.json({
      success: true,
      target_id: targetId,
      message: 'Webhook target created successfully',
    });

  } catch (error: any) {
    console.error('Error creating webhook target:', error);

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create webhook target' },
      { status: 500 }
    );
  }
}

// Only GET and POST methods allowed
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use PATCH on individual target endpoints.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use DELETE on individual target endpoints.' },
    { status: 405 }
  );
}