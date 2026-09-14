/**
 * Individual Status Webhook Target Admin API
 * 
 * Manages individual webhook targets:
 * - PATCH: Update webhook target
 * - DELETE: Soft-delete webhook target (set active=false)
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAdminKey } from '@/lib/server/adminSession';
import { 
  getWebhookTarget,
  updateWebhookTarget,
  deleteWebhookTarget,
  validateWebhookTargetData,
  type UpdateWebhookTargetData
} from '@/lib/server/statusWebhookTargets';

async function requireAdminKey(request: NextRequest): Promise<void> {
  const adminKey = request.headers.get('admin-key');
  const expectedAdminKey = process.env.ADMIN_KEY;
  
  if (!expectedAdminKey || !isAdminKey(adminKey ?? '', expectedAdminKey)) {
    throw new Error('Unauthorized: Invalid admin key');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminKey(request);

    const { id: targetId } = await params;

    // Check if target exists
    const existingTarget = await getWebhookTarget(targetId);
    if (!existingTarget) {
      return NextResponse.json(
        { success: false, error: 'Webhook target not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const updateData: UpdateWebhookTargetData = {
      url: body.url,
      secret: body.secret,
      events: body.events,
      active: body.active,
      description: body.description,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof UpdateWebhookTargetData] === undefined) {
        delete updateData[key as keyof UpdateWebhookTargetData];
      }
    });

    // Validate data
    const validationErrors = validateWebhookTargetData(updateData);
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

    // Update webhook target
    await updateWebhookTarget(targetId, updateData);

    return NextResponse.json({
      success: true,
      message: 'Webhook target updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating webhook target:', error);

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update webhook target' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminKey(request);

    const { id: targetId } = await params;

    // Check if target exists
    const existingTarget = await getWebhookTarget(targetId);
    if (!existingTarget) {
      return NextResponse.json(
        { success: false, error: 'Webhook target not found' },
        { status: 404 }
      );
    }

    // Soft delete webhook target
    await deleteWebhookTarget(targetId);

    return NextResponse.json({
      success: true,
      message: 'Webhook target deleted successfully',
    });

  } catch (error: any) {
    console.error('Error deleting webhook target:', error);

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete webhook target' },
      { status: 500 }
    );
  }
}

// Only PATCH and DELETE methods allowed
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET on /targets for listing.' },
    { status: 405 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST on /targets for creation.' },
    { status: 405 }
  );
}