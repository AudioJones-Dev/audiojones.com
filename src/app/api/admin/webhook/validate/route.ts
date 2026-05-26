import { NextRequest, NextResponse } from 'next/server';
import { verifyAjSignedRequest } from '@/lib/server/ajWebhookVerifier';
import { adminAuth } from '@/lib/server/legacyAdmin';

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth().verifyIdToken(token, true);
    
    if (!decodedToken.admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const { payload, signature, timestamp } = await req.json();

    if (!payload || !signature) {
      return NextResponse.json(
        { error: 'payload and signature are required' },
        { status: 400 }
      );
    }

    // Parse payload to get event type
    let parsedPayload;
    try {
      parsedPayload = typeof payload === 'string' ? JSON.parse(payload) : payload;
    } catch (parseError) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'Invalid JSON payload: ' + (parseError instanceof Error ? parseError.message : 'Parse error')
        },
        { status: 200 }
      );
    }

    // Create mock request object for verification
    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const mockRequest = {
      headers: {
        get: (name: string) => {
          switch (name.toLowerCase()) {
            case 'x-aj-signature':
              return signature;
            case 'x-aj-timestamp':
              return timestamp || Math.floor(Date.now() / 1000).toString();
            case 'content-type':
              return 'application/json';
            default:
              return null;
          }
        }
      },
      body: payloadString
    };

    // Attempt verification
    try {
      const verificationResult = await verifyAjSignedRequest(mockRequest as any);
      
      return NextResponse.json({
        valid: true,
        event_type: parsedPayload.event || 'unknown',
        payload_size: Buffer.byteLength(payloadString, 'utf8'),
        signature_method: 'HMAC-SHA256',
        timestamp: new Date().toISOString(),
        verified_payload: verificationResult
      });

    } catch (verificationError) {
      // Extract meaningful error message
      let errorMessage = 'Signature verification failed';
      if (verificationError instanceof Error) {
        errorMessage = verificationError.message;
      }

      return NextResponse.json({
        valid: false,
        error: errorMessage,
        event_type: parsedPayload.event || 'unknown',
        payload_size: Buffer.byteLength(payloadString, 'utf8'),
        signature_method: 'HMAC-SHA256',
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('[webhook-validate] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}