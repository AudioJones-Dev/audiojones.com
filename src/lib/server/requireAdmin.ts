// src/lib/server/requireAdmin.ts
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminKey } from './adminSession';

/**
 * Admin authentication helper for API routes
 * Throws a NextResponse with 401/500 if auth fails
 */
export function requireAdmin(req: NextRequest): void {
  const adminKey = req.headers.get('admin-key') || req.headers.get('x-admin-key');
  const expectedAdminKey = process.env.ADMIN_KEY;
  
  if (!expectedAdminKey) {
    throw NextResponse.json(
      { error: 'Server configuration error: ADMIN_KEY not set' }, 
      { status: 500 }
    );
  }
  
  if (!isAdminKey(adminKey ?? '', expectedAdminKey)) {
    throw NextResponse.json(
      { error: 'Unauthorized: Invalid or missing admin key' }, 
      { status: 401 }
    );
  }
}

/**
 * Admin authentication middleware that returns a response instead of throwing
 * Useful for cases where you want to handle the error response manually
 */
export function checkAdmin(req: NextRequest): NextResponse | null {
  try {
    requireAdmin(req);
    return null; // Auth passed
  } catch (response) {
    return response as NextResponse;
  }
}