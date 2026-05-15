// Test script to verify the enhanced pricing integration
const axios = require('axios');

async function testEnhancedPricing() {
  console.log('🔍 Testing Enhanced Pricing Integration');
  console.log('=====================================');

  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    console.error('Set ADMIN_KEY in your environment before running this script.');
    process.exit(1);
  }
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://audiojones.com'
    : 'http://localhost:3000';

  try {
    // 1. Create a test SKU in Firestore
    console.log('\n1. Creating test SKU in Firestore...');
    const testSku = {
      billing_sku: 'test-enhanced-sku-' + Date.now(),
      service_id: 'ai-automation',
      tier_id: 'enterprise',
      active: true
    };

    const createResponse = await axios.post(`${baseUrl}/api/admin/pricing`, testSku, {
      headers: { 'admin-key': adminKey }
    });
    
    console.log('✅ Test SKU created:', testSku.billing_sku);

    // 2. Simulate a webhook with the test SKU
    console.log('\n2. Simulating webhook with test SKU...');
    const webhookPayload = {
      event_type: 'subscription.created',
      user: {
        email: 'test-enhanced@example.com'
      },
      billing_sku: testSku.billing_sku,
      timestamp: Math.floor(Date.now() / 1000)
    };

    // Generate HMAC signature for webhook
    const crypto = require('crypto');
    const secret = process.env.WHOP_WEBHOOK_SECRET || 'whop_secret_123';
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = JSON.stringify(webhookPayload);
    const signedPayload = `${timestamp}.${payload}`;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    console.log('📤 Sending webhook with Firestore SKU...');
    
    const webhookResponse = await axios.post(`${baseUrl}/api/whop`, webhookPayload, {
      headers: {
        'content-type': 'application/json',
        'x-whop-signature': `sha256=${signature}`,
        'x-whop-timestamp': timestamp.toString()
      }
    });

    console.log('✅ Webhook response:', webhookResponse.status);

    // 3. Verify the customer was created with Firestore pricing
    console.log('\n3. Verifying customer data...');
    const customerResponse = await axios.get(
      `${baseUrl}/api/admin/customers/test-enhanced@example.com`,
      { headers: { 'admin-key': adminKey } }
    );

    const customer = customerResponse.data;
    console.log('📊 Customer tier:', customer.tier);
    console.log('📊 Customer service:', customer.service_name);

    if (customer.tier === 'enterprise' && customer.service_name === 'ai-automation') {
      console.log('✅ Enhanced pricing integration working correctly!');
      console.log('🎯 Firestore SKU was successfully used instead of hardcoded fallback');
    } else {
      console.log('⚠️  Unexpected customer data - check integration');
    }

    // 4. Test fallback with unknown SKU
    console.log('\n4. Testing fallback with unknown SKU...');
    const fallbackPayload = {
      ...webhookPayload,
      billing_sku: 'unknown-sku-test',
      user: { email: 'test-fallback@example.com' }
    };

    const fallbackSignature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${JSON.stringify(fallbackPayload)}`, 'utf8')
      .digest('hex');

    await axios.post(`${baseUrl}/api/whop`, fallbackPayload, {
      headers: {
        'content-type': 'application/json',
        'x-whop-signature': `sha256=${fallbackSignature}`,
        'x-whop-timestamp': timestamp.toString()
      }
    });

    console.log('✅ Fallback test completed');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.status, error.response.data);
    }
  }
}

// Run the test
testEnhancedPricing();