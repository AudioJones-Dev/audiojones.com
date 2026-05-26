import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/server/legacyAdmin";

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(token, true);
    
    if (!decodedToken.admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Query parameters for filtering
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const category = url.searchParams.get("category");
    const startDate = url.searchParams.get("startDate");
    
    // Mock audit log entries
    const auditLogs = [
      {
        id: "audit_001",
        timestamp: "2024-11-12T10:30:00Z",
        category: "authentication",
        action: "user_login",
        userId: "user_123",
        email: "user@example.com",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0...",
        details: {
          success: true,
          method: "email_password",
          location: "New York, US"
        }
      },
      {
        id: "audit_002",
        timestamp: "2024-11-12T10:25:00Z",
        category: "data_access",
        action: "customer_data_export",
        userId: "admin_456",
        email: "admin@audiojones.com",
        ipAddress: "192.168.1.50",
        userAgent: "Mozilla/5.0...",
        details: {
          exportType: "csv",
          recordCount: 1247,
          reason: "monthly_report"
        }
      },
      {
        id: "audit_003",
        timestamp: "2024-11-12T10:20:00Z",
        category: "system",
        action: "backup_created",
        userId: "system",
        email: "system@audiojones.com",
        ipAddress: "internal",
        userAgent: "cronjob/1.0",
        details: {
          backupSize: "2.3GB",
          tables: ["users", "projects", "payments"],
          status: "success"
        }
      },
      {
        id: "audit_004",
        timestamp: "2024-11-12T10:15:00Z",
        category: "payment",
        action: "payment_processed",
        userId: "user_789",
        email: "customer@example.com",
        ipAddress: "203.0.113.45",
        userAgent: "Mobile Safari",
        details: {
          amount: 299.00,
          currency: "USD",
          paymentId: "pi_1234567890",
          status: "succeeded"
        }
      },
      {
        id: "audit_005",
        timestamp: "2024-11-12T10:10:00Z",
        category: "security",
        action: "failed_login_attempt",
        userId: null,
        email: "attacker@malicious.com",
        ipAddress: "198.51.100.25",
        userAgent: "Bot/1.0",
        details: {
          attempts: 5,
          blocked: true,
          reason: "rate_limit_exceeded"
        }
      },
      {
        id: "audit_006",
        timestamp: "2024-11-12T10:05:00Z",
        category: "configuration",
        action: "settings_updated",
        userId: "admin_456",
        email: "admin@audiojones.com",
        ipAddress: "192.168.1.50",
        userAgent: "Mozilla/5.0...",
        details: {
          section: "email_templates",
          changes: ["welcome_email", "payment_confirmation"],
          previousVersion: "1.2.3"
        }
      }
    ];

    // Filter by category if specified
    let filteredLogs = auditLogs;
    if (category) {
      filteredLogs = auditLogs.filter(log => log.category === category);
    }

    // Filter by date if specified
    if (startDate) {
      const start = new Date(startDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= start);
    }

    // Apply limit
    const limitedLogs = filteredLogs.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        logs: limitedLogs,
        total: filteredLogs.length,
        categories: ["authentication", "data_access", "system", "payment", "security", "configuration"],
        summary: {
          total_events: auditLogs.length,
          categories: {
            authentication: auditLogs.filter(l => l.category === "authentication").length,
            data_access: auditLogs.filter(l => l.category === "data_access").length,
            system: auditLogs.filter(l => l.category === "system").length,
            payment: auditLogs.filter(l => l.category === "payment").length,
            security: auditLogs.filter(l => l.category === "security").length,
            configuration: auditLogs.filter(l => l.category === "configuration").length
          }
        }
      }
    });

  } catch (error) {
    console.error("Audit log retrieval error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(token, true);
    
    if (!decodedToken.admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { category, action, details, userId } = body;

    // Create new audit log entry
    const auditEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: category || "manual",
      action: action || "manual_entry",
      userId: userId || decodedToken.uid,
      email: decodedToken.email || "unknown",
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      details: details || {}
    };

    console.log("New audit entry created:", auditEntry);

    return NextResponse.json({
      success: true,
      data: auditEntry,
      message: "Audit entry created successfully"
    });

  } catch (error) {
    console.error("Audit log creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}