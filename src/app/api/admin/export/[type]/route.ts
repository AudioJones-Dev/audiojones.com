// src/app/api/admin/export/[type]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/server/firebaseAdmin";
import { requireAdmin } from "@/lib/server/requireAdmin";

// CSV conversion helper
function arrayToCSV(data: any[], headers: string[]): string {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes in CSV
      return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
        ? `"${value.replace(/"/g, '""')}"` 
        : value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    // Admin authentication using shared helper
    requireAdmin(req);

    const { type } = await params;
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv'; // csv or json
    const limit = parseInt(searchParams.get('limit') || '1000');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    let data: any[] = [];
    let headers: string[] = [];
    let filename = '';

    switch (type) {
      case 'customers':
        const customersSnapshot = await getDb().collection('customers').limit(limit).get();
        data = customersSnapshot.docs.map((doc: any) => ({
          email: doc.id,
          ...doc.data(),
          document_id: doc.id
        }));
        headers = ['email', 'whop_user_id', 'name', 'billing_sku', 'tier', 'service_name', 'status', 'created_at', 'updated_at'];
        filename = `customers-export-${new Date().toISOString().split('T')[0]}`;
        break;

      case 'events':
        let eventsQuery = getDb().collection('subscription_events').orderBy('timestamp', 'desc').limit(limit);
        
        if (startDate) {
          eventsQuery = eventsQuery.where('timestamp', '>=', startDate);
        }
        if (endDate) {
          eventsQuery = eventsQuery.where('timestamp', '<=', endDate);
        }
        
        const eventsSnapshot = await eventsQuery.get();
        data = eventsSnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        }));
        headers = ['id', 'event_type', 'customer_email', 'whop_user_id', 'tier', 'timestamp', 'processed_at', 'processing_time_ms'];
        filename = `events-export-${new Date().toISOString().split('T')[0]}`;
        break;

      case 'revenue':
        // Get customers grouped by service and tier for revenue analysis
        const revenueSnapshot = await getDb().collection('customers').get();
        const customers = revenueSnapshot.docs.map((doc: any) => doc.data());
        
        // Group by service and tier
        const revenueData = customers.reduce((acc: any[], customer: any) => {
          acc.push({
            customer_email: customer.email,
            service_name: customer.service_name || 'unknown',
            tier: customer.tier || 'unknown',
            billing_sku: customer.billing_sku || 'unknown',
            status: customer.status || 'unknown',
            created_at: customer.created_at || '',
            updated_at: customer.updated_at || ''
          });
          return acc;
        }, []);
        
        data = revenueData;
        headers = ['customer_email', 'service_name', 'tier', 'billing_sku', 'status', 'created_at', 'updated_at'];
        filename = `revenue-analysis-${new Date().toISOString().split('T')[0]}`;
        break;

      case 'pricing':
        const pricingSnapshot = await getDb().collection('pricing_skus').get();
        data = pricingSnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        }));
        headers = ['id', 'billing_sku', 'service_id', 'tier_id', 'active', 'created_at', 'updated_at'];
        filename = `pricing-skus-${new Date().toISOString().split('T')[0]}`;
        break;

      case 'audit':
        const auditSnapshot = await getDb().collection('admin_audit_log').orderBy('created_at', 'desc').limit(limit).get();
        data = auditSnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          payload: JSON.stringify(doc.data().payload || {})
        }));
        headers = ['id', 'action', 'actor', 'target_email', 'payload', 'created_at'];
        filename = `audit-log-${new Date().toISOString().split('T')[0]}`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 });
    }

    if (format === 'json') {
      return NextResponse.json({
        type,
        data,
        total: data.length,
        exported_at: new Date().toISOString()
      }, {
        headers: {
          'Content-Disposition': `attachment; filename="${filename}.json"`
        }
      });
    } else {
      // CSV format
      const csvContent = arrayToCSV(data, headers);
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      });
    }

  } catch (error) {
    console.error('[export] Error:', error);
    
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof NextResponse) {
      return error;
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}