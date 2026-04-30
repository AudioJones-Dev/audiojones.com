/**
 * Runbook Management API
 * 
 * Create and manage runbooks for incident response.
 * POST /api/admin/runbooks - Create runbook
 * GET /api/admin/runbooks - List runbooks  
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import { getDb } from '@/lib/server/firebaseAdmin';
import type { Runbook } from '@/lib/server/incidents';

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    
    const body = await req.json();
    const { name, source, steps, active = true } = body;
    
    if (!name || !source || !Array.isArray(steps)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, source, steps' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const runbook: Omit<Runbook, 'id'> = {
      name,
      source,
      steps,
      active,
      created_at: now,
      updated_at: now
    };

    const docRef = await getDb().collection('runbooks').add(runbook);
    
    console.log(`📚 Created runbook ${docRef.id} for source: ${source}`);
    
    return NextResponse.json({
      ok: true,
      runbookId: docRef.id,
      message: 'Runbook created successfully'
    });

  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    
    console.error('❌ Failed to create runbook:', error);
    return NextResponse.json(
      { error: 'Failed to create runbook' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    
    const { searchParams } = new URL(req.url);
    const source = searchParams.get('source');
    const activeOnly = searchParams.get('active') === 'true';
    
    let query = getDb().collection('runbooks').orderBy('created_at', 'desc');
    
    if (source) {
      query = query.where('source', '==', source);
    }
    
    if (activeOnly) {
      query = query.where('active', '==', true);
    }
    
    const snapshot = await query.get();
    
    const runbooks = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })) as Runbook[];

    return NextResponse.json({
      ok: true,
      runbooks,
      count: runbooks.length
    });

  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    
    console.error('❌ Failed to list runbooks:', error);
    return NextResponse.json(
      { error: 'Failed to list runbooks' },
      { status: 500 }
    );
  }
}
