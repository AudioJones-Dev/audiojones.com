import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/server/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = await adminAuth().verifyIdToken(token, true);

    // Get user's billing information
    const billingInfo = await getUserBillingInfo(decoded.uid);

    return NextResponse.json(billingInfo);
  } catch (error) {
    console.error('Billing API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getUserBillingInfo(userId: string) {
  // TODO: In a real implementation, this would:
  // 1. Query your database for the user's Stripe customer ID
  // 2. Fetch subscription details from Stripe
  // 3. Get payment method information
  // 4. Retrieve invoice history
  
  // For now, return mock data
  const mockBillingInfo = {
    subscription: {
      status: 'active' as const,
      plan: 'Professional',
      amount: 2500,
      currency: 'month',
      nextBilling: 'Nov 15, 2025',
    },
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2026,
    },
    invoices: [
      {
        id: 'inv_1',
        date: 'Oct 15, 2025',
        amount: 2500,
        status: 'paid' as const,
        downloadUrl: '/api/invoices/inv_1/download',
      },
      {
        id: 'inv_2',
        date: 'Sep 15, 2025',
        amount: 2500,
        status: 'paid' as const,
        downloadUrl: '/api/invoices/inv_2/download',
      },
      {
        id: 'inv_3',
        date: 'Aug 15, 2025',
        amount: 2500,
        status: 'paid' as const,
        downloadUrl: '/api/invoices/inv_3/download',
      },
    ],
    usage: {
      current: 7,
      limit: 10,
      period: 'month',
    },
  };

  return mockBillingInfo;
}