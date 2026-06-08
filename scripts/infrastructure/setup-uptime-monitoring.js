#!/usr/bin/env node

/**
 * UptimeRobot Integration Setup
 * 
 * This script configures external uptime monitoring for all critical endpoints
 * using the UptimeRobot API. It creates monitors, configures alert contacts,
 * and sets up webhook notifications.
 * 
 * Usage:
 * node scripts/infrastructure/setup-uptime-monitoring.js
 * 
 * Environment Variables Required:
 * - UPTIMEROBOT_API_KEY (UptimeRobot API key)
 * - UPTIMEROBOT_ALERT_EMAIL (email for alerts)
 * - UPTIMEROBOT_WEBHOOK_URL (optional webhook for alerts)
 */

const https = require('https');
const querystring = require('querystring');

// Configuration
const UPTIMEROBOT_CONFIG = {
  apiKey: process.env.UPTIMEROBOT_API_KEY,
  baseUrl: 'https://api.uptimerobot.com/v2',
  alertEmail: process.env.UPTIMEROBOT_ALERT_EMAIL,
  webhookUrl: process.env.UPTIMEROBOT_WEBHOOK_URL || 'https://audiojones.com/api/webhooks/uptime',
  productionUrl: 'https://audiojones.com'
};

// Critical endpoints to monitor
const CRITICAL_ENDPOINTS = [
  {
    name: 'Audio Jones Homepage',
    url: 'https://audiojones.com',
    type: 1, // HTTP(s)
    interval: 300, // 5 minutes
    timeout: 30
  },
  {
    name: 'Admin Health Check',
    url: 'https://audiojones.com/api/admin/health',
    type: 1,
    interval: 300,
    timeout: 30,
    httpHeaders: 'admin-key:' + (process.env.ADMIN_API_KEY || 'placeholder')
  },
  {
    name: 'Stripe Checkout API',
    url: 'https://audiojones.com/api/stripe/checkout',
    type: 1,
    interval: 600, // 10 minutes (less frequent for payment endpoint)
    timeout: 30
  },
  {
    name: 'Analytics System',
    url: 'https://audiojones.com/api/admin/analytics/summary',
    type: 1,
    interval: 900, // 15 minutes
    timeout: 30,
    httpHeaders: 'admin-key:' + (process.env.ADMIN_API_KEY || 'placeholder')
  },
  {
    name: 'Auto-Alert System',
    url: 'https://audiojones.com/api/admin/auto-alerts',
    type: 1,
    interval: 900, // 15 minutes
    timeout: 30,
    httpHeaders: 'admin-key:' + (process.env.ADMIN_API_KEY || 'placeholder')
  },
  {
    name: 'Maintenance System',
    url: 'https://audiojones.com/api/system/maintenance',
    type: 1,
    interval: 1800, // 30 minutes
    timeout: 30,
    httpHeaders: 'admin-key:' + (process.env.ADMIN_API_KEY || 'placeholder')
  }
];

function makeUptimeRobotRequest(endpoint, data) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      api_key: UPTIMEROBOT_CONFIG.apiKey,
      format: 'json',
      ...data
    });

    const options = {
      hostname: 'api.uptimerobot.com',
      path: `/v2/${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function setupAlertContacts() {
  console.log('📧 Setting up alert contacts...');
  
  try {
    // Get existing alert contacts
    const existingContacts = await makeUptimeRobotRequest('getAlertContacts', {});
    
    const emailExists = existingContacts.alert_contacts?.some(
      contact => contact.value === UPTIMEROBOT_CONFIG.alertEmail
    );

    let emailContactId;
    
    if (!emailExists) {
      // Create email alert contact
      const emailContact = await makeUptimeRobotRequest('newAlertContact', {
        type: 2, // Email
        value: UPTIMEROBOT_CONFIG.alertEmail,
        friendly_name: 'Audio Jones Admin Email'
      });
      
      if (emailContact.stat === 'ok') {
        emailContactId = emailContact.alert_contact.id;
        console.log('✅ Email alert contact created:', emailContactId);
      } else {
        throw new Error('Failed to create email contact: ' + emailContact.error?.message);
      }
    } else {
      emailContactId = existingContacts.alert_contacts.find(
        contact => contact.value === UPTIMEROBOT_CONFIG.alertEmail
      ).id;
      console.log('✅ Using existing email contact:', emailContactId);
    }

    // Setup webhook contact if URL provided
    let webhookContactId;
    if (UPTIMEROBOT_CONFIG.webhookUrl) {
      const webhookExists = existingContacts.alert_contacts?.some(
        contact => contact.value === UPTIMEROBOT_CONFIG.webhookUrl
      );

      if (!webhookExists) {
        const webhookContact = await makeUptimeRobotRequest('newAlertContact', {
          type: 3, // Webhook
          value: UPTIMEROBOT_CONFIG.webhookUrl,
          friendly_name: 'Audio Jones Webhook Alerts'
        });
        
        if (webhookContact.stat === 'ok') {
          webhookContactId = webhookContact.alert_contact.id;
          console.log('✅ Webhook alert contact created:', webhookContactId);
        }
      } else {
        webhookContactId = existingContacts.alert_contacts.find(
          contact => contact.value === UPTIMEROBOT_CONFIG.webhookUrl
        ).id;
        console.log('✅ Using existing webhook contact:', webhookContactId);
      }
    }

    return { emailContactId, webhookContactId };
    
  } catch (error) {
    console.error('❌ Failed to setup alert contacts:', error);
    throw error;
  }
}

async function createMonitors(alertContacts) {
  console.log('📊 Creating uptime monitors...');
  
  const { emailContactId, webhookContactId } = alertContacts;
  const alertContactIds = [emailContactId, webhookContactId].filter(Boolean).join('-');
  
  const createdMonitors = [];
  
  for (const endpoint of CRITICAL_ENDPOINTS) {
    try {
      console.log(`🔍 Setting up monitor for: ${endpoint.name}`);
      
      const monitorData = {
        friendly_name: endpoint.name,
        url: endpoint.url,
        type: endpoint.type,
        interval: endpoint.interval,
        timeout: endpoint.timeout,
        alert_contacts: alertContactIds
      };

      // Add HTTP headers if specified
      if (endpoint.httpHeaders) {
        monitorData.http_header = endpoint.httpHeaders;
      }

      const monitor = await makeUptimeRobotRequest('newMonitor', monitorData);
      
      if (monitor.stat === 'ok') {
        createdMonitors.push({
          id: monitor.monitor.id,
          name: endpoint.name,
          url: endpoint.url,
          status: 'created'
        });
        console.log(`✅ Monitor created for ${endpoint.name} (ID: ${monitor.monitor.id})`);
      } else {
        console.error(`❌ Failed to create monitor for ${endpoint.name}:`, monitor.error?.message);
        createdMonitors.push({
          name: endpoint.name,
          url: endpoint.url,
          status: 'failed',
          error: monitor.error?.message
        });
      }
      
      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error creating monitor for ${endpoint.name}:`, error);
      createdMonitors.push({
        name: endpoint.name,
        url: endpoint.url,
        status: 'error',
        error: error.message
      });
    }
  }
  
  return createdMonitors;
}

async function getMonitorStatus() {
  console.log('📈 Retrieving monitor status...');
  
  try {
    const monitors = await makeUptimeRobotRequest('getMonitors', {
      logs: 1,
      logs_limit: 5
    });
    
    if (monitors.stat === 'ok') {
      console.log('✅ Monitor status retrieved successfully');
      
      monitors.monitors.forEach(monitor => {
        const status = monitor.status === 2 ? '🟢 UP' : '🔴 DOWN';
        console.log(`${status} ${monitor.friendly_name} (${monitor.uptime_ratio}% uptime)`);
      });
      
      return monitors.monitors;
    } else {
      throw new Error('Failed to get monitor status: ' + monitors.error?.message);
    }
    
  } catch (error) {
    console.error('❌ Failed to get monitor status:', error);
    throw error;
  }
}

async function generateConfiguration() {
  console.log('📋 Generating UptimeRobot configuration summary...');
  
  const config = {
    service: 'UptimeRobot',
    configured_at: new Date().toISOString(),
    endpoints_monitored: CRITICAL_ENDPOINTS.length,
    monitoring_intervals: {
      homepage: '5 minutes',
      api_endpoints: '5-15 minutes', 
      payment_systems: '10 minutes',
      automation_systems: '15-30 minutes'
    },
    alert_methods: ['email', 'webhook'],
    alert_email: UPTIMEROBOT_CONFIG.alertEmail,
    webhook_url: UPTIMEROBOT_CONFIG.webhookUrl,
    coverage: {
      core_platform: true,
      payment_systems: true,
      automation_layer: true,
      infrastructure_apis: true
    }
  };
  
  console.log('✅ Configuration summary generated');
  return config;
}

async function main() {
  console.log('🚀 Setting up UptimeRobot monitoring for Audio Jones...');
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  
  // Validate API key
  if (!UPTIMEROBOT_CONFIG.apiKey) {
    console.error('❌ UPTIMEROBOT_API_KEY environment variable required');
    process.exit(1);
  }
  
  if (!UPTIMEROBOT_CONFIG.alertEmail) {
    console.error('❌ UPTIMEROBOT_ALERT_EMAIL environment variable required');
    process.exit(1);
  }
  
  try {
    // Setup alert contacts
    const alertContacts = await setupAlertContacts();
    
    // Create monitors
    const monitors = await createMonitors(alertContacts);
    
    // Get initial status
    const status = await getMonitorStatus();
    
    // Generate configuration
    const config = await generateConfiguration();
    
    console.log('🎉 UptimeRobot setup completed successfully!');
    console.log(`📊 Created ${monitors.filter(m => m.status === 'created').length} monitors`);
    console.log(`📧 Alert email: ${UPTIMEROBOT_CONFIG.alertEmail}`);
    console.log(`🔗 Webhook: ${UPTIMEROBOT_CONFIG.webhookUrl || 'Not configured'}`);
    
    const summary = {
      setup_completed: true,
      timestamp: new Date().toISOString(),
      monitors_created: monitors.filter(m => m.status === 'created').length,
      monitors_failed: monitors.filter(m => m.status === 'failed').length,
      alert_contacts: alertContacts,
      configuration: config
    };
    
    console.log('\n📋 Setup Summary:');
    console.log(JSON.stringify(summary, null, 2));
    
    process.exit(0);
    
  } catch (error) {
    console.error('💥 UptimeRobot setup failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  setupAlertContacts,
  createMonitors,
  getMonitorStatus,
  CRITICAL_ENDPOINTS,
  UPTIMEROBOT_CONFIG
};