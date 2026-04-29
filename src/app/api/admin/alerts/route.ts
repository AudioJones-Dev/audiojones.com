// src/app/api/admin/alerts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/server/firebaseAdmin';
import { requireAdmin } from "@/lib/server/requireAdmin";
import { publishEvent, SUPPORTED_EVENT_TYPES } from "@/lib/server/eventBus";
import { AdminAlert, safeDocCast } from "@/types/admin";

// GET - Fetch all alerts with optional filtering
export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    
    const url = new URL(req.url);
    const status = url.searchParams.get('status'); // 'active', 'dismissed', 'all'
    const severity = url.searchParams.get('severity'); // 'critical', 'warning', 'info'
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query = getDb().collection("alerts").orderBy("created_at", "desc");

    // Filter by status
    if (status && status !== 'all') {
      query = query.where("status", "==", status);
    }

    // Filter by severity
    if (severity) {
      query = query.where("severity", "==", severity);
    }

    // Apply limit
    query = query.limit(limit);

    const snapshot = await query.get();
    const alerts: any[] = [];

    snapshot.forEach((doc: any) => {
      alerts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Get alert counts by status and severity
    const statsSnapshot = await getDb().collection("alerts").get();
    const stats = {
      total: statsSnapshot.size,
      active: 0,
      dismissed: 0,
      critical: 0,
      warning: 0,
      info: 0,
    };

    statsSnapshot.forEach((doc: any) => {
      const data = doc.data();
      if (data.status === 'active') stats.active++;
      if (data.status === 'dismissed') stats.dismissed++;
      if (data.severity === 'critical') stats.critical++;
      if (data.severity === 'warning') stats.warning++;
      if (data.severity === 'info') stats.info++;
    });

    return NextResponse.json({
      ok: true,
      alerts,
      stats,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("[alerts API] GET error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: error instanceof Error && error.message.includes("Admin") ? 403 : 500 }
    );
  }
}

// POST - Create a new alert
export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);

    const body = await req.json();
    const { title, message, severity, category, metadata, auto_dismiss_minutes } = body;

    if (!title || !message || !severity) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: title, message, severity" },
        { status: 400 }
      );
    }

    const alertData = {
      title: title.trim(),
      message: message.trim(),
      severity: severity, // 'critical', 'warning', 'info'
      category: category || 'system', // 'webhook', 'payment', 'system', 'user'
      status: 'active',
      created_at: new Date().toISOString(),
      created_by: 'admin', // Could be enhanced with actual user info
      dismissed_at: null,
      dismissed_by: null,
      metadata: metadata || {},
      auto_dismiss_at: auto_dismiss_minutes 
        ? new Date(Date.now() + auto_dismiss_minutes * 60 * 1000).toISOString()
        : null,
    };

    const docRef = await getDb().collection("alerts").add(alertData);

    // Publish alert event to event bus
    publishEvent(SUPPORTED_EVENT_TYPES.ALERT_TRIGGERED, {
      alert_id: docRef.id,
      title: alertData.title,
      message: alertData.message,
      severity: alertData.severity,
      category: alertData.category,
      created_at: alertData.created_at
    }, {
      source: 'admin-api',
      alert_type: alertData.category,
      severity: alertData.severity,
      ...(alertData.metadata && { metadata: alertData.metadata })
    }).catch(error => {
      console.error('Failed to publish alert event:', error);
    });

    return NextResponse.json({
      ok: true,
      alert_id: docRef.id,
      alert: { id: docRef.id, ...alertData },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("[alerts API] POST error:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: error instanceof Error && error.message.includes("Admin") ? 403 : 500 }
    );
  }
}
