import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/legacyAdmin';

/**
 * Client Login API Route
 * 
 * Creates HttpOnly, Secure session cookies for client authentication.
 * This provides an alternative to always passing Bearer tokens in headers.
 * 
 * The client can still use Authorization headers for backwards compatibility.
 */

interface LoginRequest {
  idToken: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: LoginRequest;
    
    try {
      body = await request.json();
    } catch {
      return Response.json({
        ok: false,
        error: 'invalid_json'
      }, { status: 400 });
    }

    if (!body.idToken) {
      return Response.json({
        ok: false,
        error: 'id_token_required'
      }, { status: 400 });
    }

    // Verify the retired auth token
    const decodedToken = await adminAuth().verifyIdToken(body.idToken, true);
    
    if (!decodedToken.email) {
      return Response.json({
        ok: false,
        error: 'email_not_found_in_token'
      }, { status: 400 });
    }

    // Create a session cookie (expires in 5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
    const sessionCookie = await adminAuth().createSessionCookie(body.idToken, { expiresIn });

    // Create response with session cookie
    const response = NextResponse.json({
      ok: true,
      user: {
        email: decodedToken.email,
        uid: decodedToken.uid,
      },
      expiresAt: new Date(Date.now() + expiresIn).toISOString()
    });

    // Set HttpOnly, Secure cookie
    response.cookies.set('client-session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn / 1000, // maxAge is in seconds
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Client login error:', error);
    
    // Handle Retired auth token verification errors
    if (error instanceof Error) {
      if (error.message.includes('retired auth token')) {
        return Response.json({
          ok: false,
          error: 'invalid_token'
        }, { status: 401 });
      }
      
      if (error.message.includes('expired')) {
        return Response.json({
          ok: false,
          error: 'token_expired'
        }, { status: 401 });
      }
    }
    
    return Response.json({
      ok: false,
      error: 'internal_server_error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Logout: clear the session cookie
    const response = NextResponse.json({
      ok: true,
      message: 'Logged out successfully'
    });

    // Clear the session cookie
    response.cookies.set('client-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Immediately expire
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Client logout error:', error);
    
    return Response.json({
      ok: false,
      error: 'internal_server_error'
    }, { status: 500 });
  }
}