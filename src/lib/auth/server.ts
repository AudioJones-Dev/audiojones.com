import 'server-only';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/server/legacyAdmin';

export interface CurrentUser {
  uid: string;
  email?: string;
  isAdmin?: boolean;
}

/**
 * Server-side helper to get the current authenticated user
 * Checks Retired auth session cookie and returns user info + admin status
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return null;
    }

    // Verify the session cookie using retired admin
    const decoded = await adminAuth().verifySessionCookie(sessionCookie, true);
    
    // Check if user has admin claim (based on existing pattern in admin routes)
    const isAdmin = decoded.admin === true;

    return {
      uid: decoded.uid,
      email: decoded.email || undefined,
      isAdmin,
    };
  } catch (error) {
    console.error('getCurrentUser verification failed:', error);
    return null;
  }
}