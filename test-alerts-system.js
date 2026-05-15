// test-alerts-system.js
// Test the comprehensive alerts system

const ADMIN_KEY = process.env.ADMIN_KEY;
if (!ADMIN_KEY) {
  console.error('Set ADMIN_KEY in your environment before running this script.');
  process.exit(1);
}
const BASE_URL = process.env.TEST_BASE_URL || 'https://audiojones.com';

async function testAlertsSystem() {
  console.log('🚨 Testing Comprehensive Alerts System\n');

  // Test 1: Create a test alert
  console.log('📝 Creating Test Alert');
  try {
    const response = await fetch(`${BASE_URL}/api/admin/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'admin-key': ADMIN_KEY,
      },
      body: JSON.stringify({
        title: 'Test Alert System',
        message: 'This is a test alert to verify the system is working correctly.',
        severity: 'info',
        category: 'system',
        auto_dismiss_minutes: 5,
        metadata: {
          test_id: 'alert_system_test_' + Date.now(),
          source: 'test_script'
        }
      }),
    });

    const result = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, JSON.stringify(result, null, 2));
    
    if (result.ok) {
      var testAlertId = result.alert_id;
    }
  } catch (error) {
    console.error(`   Error:`, error.message);
  }

  // Test 2: Fetch all alerts
  console.log('\n📋 Fetching All Alerts');
  try {
    const response = await fetch(`${BASE_URL}/api/admin/alerts?status=all&limit=10`, {
      headers: { 'admin-key': ADMIN_KEY },
    });

    const result = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Found ${result.alerts?.length || 0} alerts`);
    console.log(`   Stats:`, JSON.stringify(result.stats, null, 2));
  } catch (error) {
    console.error(`   Error:`, error.message);
  }

  // Test 3: Test webhook that creates alerts
  console.log('\n🔗 Testing Webhook Alert Creation');
  try {
    // This will trigger rate limiting and security alerts
    const promises = [];
    for (let i = 0; i < 3; i++) {
      promises.push(
        fetch(`${BASE_URL}/api/whop`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'test.alert_system',
            data: {
              test_id: i,
              user: { email: `alert-test-${i}@example.com` }
            }
          }),
        })
      );
    }

    const responses = await Promise.all(promises);
    console.log(`   Sent ${responses.length} webhook requests`);
    
    // Check for new alerts
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for processing
    
    const alertsResponse = await fetch(`${BASE_URL}/api/admin/alerts?status=active&limit=5`, {
      headers: { 'admin-key': ADMIN_KEY },
    });
    const alertsResult = await alertsResponse.json();
    console.log(`   Active alerts after webhook test: ${alertsResult.stats?.active || 0}`);
    
  } catch (error) {
    console.error(`   Error:`, error.message);
  }

  // Test 4: Dismiss an alert
  if (testAlertId) {
    console.log('\n❌ Testing Alert Dismissal');
    try {
      const response = await fetch(`${BASE_URL}/api/admin/alerts/${testAlertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'admin-key': ADMIN_KEY,
        },
        body: JSON.stringify({
          action: 'dismiss',
          dismissed_by: 'test_script'
        }),
      });

      const result = await response.json();
      console.log(`   Status: ${response.status}`);
      console.log(`   Alert dismissed: ${result.ok}`);
    } catch (error) {
      console.error(`   Error:`, error.message);
    }
  }

  // Test 5: Test alert filtering
  console.log('\n🔍 Testing Alert Filtering');
  try {
    const filters = [
      { name: 'Critical alerts', params: 'severity=critical' },
      { name: 'Active alerts', params: 'status=active' },
      { name: 'System alerts', params: 'category=system' }
    ];

    for (const filter of filters) {
      const response = await fetch(`${BASE_URL}/api/admin/alerts?${filter.params}`, {
        headers: { 'admin-key': ADMIN_KEY },
      });
      const result = await response.json();
      console.log(`   ${filter.name}: ${result.alerts?.length || 0} found`);
    }
  } catch (error) {
    console.error(`   Error:`, error.message);
  }

  console.log('\n✅ Alerts System Test Complete!');
  console.log('\n📊 Test Results Summary:');
  console.log('   - Alert creation: Tested');
  console.log('   - Alert fetching: Tested');
  console.log('   - Webhook integration: Tested');
  console.log('   - Alert dismissal: Tested');
  console.log('   - Alert filtering: Tested');
  console.log('   - Admin UI: Available at /portal/admin/alerts');
}

testAlertsSystem().catch(console.error);