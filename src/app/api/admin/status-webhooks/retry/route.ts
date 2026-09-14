/**
 * Status Webhook Retry Runner API
 * 
 * Processes queued webhook retries with:
 * - Admin-key protection
 * - Batch processing (up to 25 items)
 * - Retry logic with backoff
 * - Max attempts enforcement (5 attempts)
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAdminKey } from '@/lib/server/adminSession';
import { 
  getPendingWebhookRetries, 
  updateWebhookRetry, 
  logWebhookAttempt 
} from '@/lib/server/statusWebhookStore';

interface RetryRunnerResponse {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  results: {
    event_id: string;
    url: string;
    success: boolean;
    error?: string;
  }[];
}

async function requireAdminKey(request: NextRequest): Promise<void> {
  const adminKey = request.headers.get('admin-key');
  const expectedAdminKey = process.env.ADMIN_KEY;
  
  if (!expectedAdminKey || !isAdminKey(adminKey ?? '', expectedAdminKey)) {
    throw new Error('Unauthorized: Invalid admin key');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdminKey(request);

    console.log('Starting webhook retry runner...');

    // Get pending webhook retries
    const pendingRetries = await getPendingWebhookRetries(25);
    
    if (pendingRetries.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        succeeded: 0,
        failed: 0,
        results: [],
      } as RetryRunnerResponse);
    }

    console.log(`Processing ${pendingRetries.length} pending webhook retries`);

    let succeeded = 0;
    let failed = 0;
    const results: RetryRunnerResponse['results'] = [];

    // Process each retry
    for (const retry of pendingRetries) {
      const { id: docId, data } = retry;
      const { event_id, payload, url, attempts } = data;

      console.log(`Retrying webhook: ${event_id} → ${url} (attempt ${attempts + 1})`);

      const startTime = Date.now();
      let success = false;
      let error: string | undefined;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'AudioJones-Status-Webhook-Retry/1.0',
          },
          body: JSON.stringify(payload),
          // 10 second timeout for retries (longer than initial attempts)
          signal: AbortSignal.timeout(10000),
        });

        const responseTime = Date.now() - startTime;

        if (response.ok) {
          success = true;
          succeeded++;
          console.log(`Webhook retry succeeded: ${event_id} → ${url} (${responseTime}ms)`);
          
          // Log successful retry
          await logWebhookAttempt(event_id, url, response.status, undefined, responseTime);
          
        } else {
          error = `HTTP ${response.status}: ${response.statusText}`;
          failed++;
          console.error(`Webhook retry failed: ${event_id} → ${url} - ${error}`);
          
          // Log failed retry
          await logWebhookAttempt(event_id, url, response.status, error, responseTime);
        }

      } catch (fetchError: any) {
        const responseTime = Date.now() - startTime;
        error = fetchError.message || 'Network error';
        failed++;
        console.error(`Webhook retry network error: ${event_id} → ${url} - ${error}`);
        
        // Log network error
        await logWebhookAttempt(event_id, url, null, error, responseTime);
      }

      // Update retry status
      await updateWebhookRetry(docId, success, error);

      results.push({
        event_id,
        url,
        success,
        error,
      });
    }

    const response: RetryRunnerResponse = {
      success: true,
      processed: pendingRetries.length,
      succeeded,
      failed,
      results,
    };

    console.log(`Webhook retry run completed: ${succeeded} succeeded, ${failed} failed`);

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error: any) {
    console.error('Error in webhook retry runner:', error);

    const errorResponse: RetryRunnerResponse = {
      success: false,
      processed: 0,
      succeeded: 0,
      failed: 0,
      results: [],
    };

    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json(errorResponse, { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Only POST method allowed
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to trigger webhook retries.' },
    { status: 405 }
  );
}

export async function PUT() {
  return GET();
}

export async function DELETE() {
  return GET();
}