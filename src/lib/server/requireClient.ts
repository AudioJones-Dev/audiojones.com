import { NextRequest } from 'next/server';
import { adminAuth } from './legacyAdmin';

/**
 * Client Authentication Helper
 * 
 * Verifies Retired auth JWT from Authorization Bearer header.
 * Returns the decoded email on success, throws on failure.
 * 
 * This follows the same pattern as admin authentication but without
 * requiring custom claims - any authenticated Retired auth user can access
 * client endpoints.
 */
export async function requireClient(request: NextRequest): Promise<string> {
  const authHeader = request.headers.get('authorization');
  
  // Primary: Check for Authorization Bearer token
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    if (token) {
      try {
        // Verify the retired auth token
        const decodedToken = await adminAuth().verifyIdToken(token, true);
        
        if (!decodedToken.email) {
          throw new AuthError('Email not found in token', 401);
        }

        return decodedToken.email;
        
      } catch (error) {
        console.error('Bearer token verification failed:', error);
        
        if (error instanceof AuthError) {
          throw error;
        }
        
        // Retired auth verification errors
        if (error instanceof Error) {
          if (error.message.includes('retired auth token')) {
            throw new AuthError('Invalid authentication token', 401);
          }
          if (error.message.includes('expired')) {
            throw new AuthError('Authentication token expired', 401);
          }
        }
        
        throw new AuthError('Authentication failed', 401);
      }
    }
  }

  // Fallback: Check for session cookie
  const sessionCookie = request.cookies.get('client-session')?.value;
  
  if (sessionCookie) {
    try {
      // Verify the session cookie
      const decodedToken = await adminAuth().verifySessionCookie(sessionCookie, true);
      
      if (!decodedToken.email) {
        throw new AuthError('Email not found in session', 401);
      }

      return decodedToken.email;
      
    } catch (error) {
      console.error('Session cookie verification failed:', error);
      
      // Don't throw here, fall through to the final error
    }
  }

  // No valid authentication found
  throw new AuthError('Authentication required - provide Bearer token or valid session', 401);
}

/**
 * Custom authentication error class for proper error handling
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Helper function to create standardized auth error responses
 */
export function createAuthErrorResponse(error: AuthError) {
  return Response.json(
    { 
      ok: false, 
      error: error.message === 'Authentication failed' 
        ? 'unauthorized' 
        : error.message.toLowerCase().replace(/\s+/g, '_')
    },
    { status: error.statusCode }
  );
}