import { NextRequest } from 'next/server';
import { getDb } from '@/lib/server/legacyAdmin';

/**
 * Capacity Waitlist API
 * 
 * Allows potential clients to join the waitlist when we're at full capacity.
 * Includes simple rate limiting per IP address.
 */

interface WaitlistEntry {
  email: string;
  joined_at: string;
  ip_address: string;
  source: string;
  status: 'active' | 'contacted' | 'converted';
}

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // Max 3 submissions per hour per IP

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const key = ip;
  
  const existing = rateLimitMap.get(key);
  
  if (!existing || now > existing.resetTime) {
    // New IP or window expired
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  
  if (existing.count >= RATE_LIMIT_MAX) {
    return { allowed: false, resetTime: existing.resetTime };
  }
  
  // Increment count
  existing.count++;
  rateLimitMap.set(key, existing);
  
  return { allowed: true };
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return Response.json({
        ok: false,
        error: 'invalid_email',
        message: 'Valid email address is required'
      }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return Response.json({
        ok: false,
        error: 'invalid_email_format',
        message: 'Please provide a valid email address'
      }, { status: 400 });
    }

    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      const resetTime = rateLimit.resetTime || Date.now();
      const resetDate = new Date(resetTime);
      
      return Response.json({
        ok: false,
        error: 'rate_limit_exceeded',
        message: 'Too many submissions. Please try again later.',
        reset_time: resetDate.toISOString()
      }, { status: 429 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existingDoc = await getDb().collection('capacity_waitlist').doc(normalizedEmail).get();
    
    if (existingDoc.exists) {
      const existing = existingDoc.data();
      if (existing?.status === 'active') {
        return Response.json({
          ok: true,
          message: 'You are already on our waitlist. We will contact you when space becomes available.',
          already_exists: true
        });
      }
    }

    // Add to waitlist
    const waitlistEntry: WaitlistEntry = {
      email: normalizedEmail,
      joined_at: new Date().toISOString(),
      ip_address: clientIP,
      source: 'capacity_banner',
      status: 'active'
    };

    await getDb().collection('capacity_waitlist').doc(normalizedEmail).set(waitlistEntry);

    // Log the waitlist addition
    await getDb().collection('admin_audit_log').add({
      action: 'waitlist_join',
      performed_by: 'capacity_system',
      timestamp: new Date().toISOString(),
      details: {
        email: normalizedEmail,
        source: 'capacity_banner',
        ip_address: clientIP
      },
      ip_address: clientIP,
      user_agent: request.headers.get('user-agent') || 'unknown'
    });

    console.log(`📝 Added ${normalizedEmail} to capacity waitlist`);

    return Response.json({
      ok: true,
      message: 'Successfully joined the waitlist! We will contact you when space becomes available.',
      joined_at: waitlistEntry.joined_at
    });

  } catch (error) {
    console.error('❌ Waitlist submission failed:', error);
    
    return Response.json({
      ok: false,
      error: 'waitlist_submission_failed',
      message: 'Failed to join waitlist. Please try again later.'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Simple health check for the waitlist endpoint
  try {
    const waitlistSnapshot = await getDb().collection('capacity_waitlist')
      .where('status', '==', 'active')
      .get();
    
    return Response.json({
      ok: true,
      status: 'active',
      waitlist_count: waitlistSnapshot.size,
      description: 'Capacity waitlist endpoint is operational'
    });
    
  } catch (error) {
    return Response.json({
      ok: false,
      error: 'waitlist_health_check_failed',
      message: 'Waitlist system health check failed'
    }, { status: 500 });
  }
}
