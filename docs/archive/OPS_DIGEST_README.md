# Ops Digest System

## Overview

The Ops Digest system provides automated operational status reports to Slack, consolidating SLO health, incident status, and capacity forecasts into digestible summaries.

## Components

### Core Services
- **`src/lib/server/digest.ts`** - Digest builder that aggregates data from SLO, incidents, and capacity systems
- **`src/lib/server/digestSlack.ts`** - Slack formatter using Block Kit for rich notifications
- **`src/app/api/admin/digest/run/route.ts`** - Admin API endpoint for triggering digests
- **`scripts/runOpsDigest.ts`** - Standalone script for cron/GitHub Actions automation
- **`src/app/portal/admin/digest/page.tsx`** - Admin UI for manual digest sending and status

### Data Sources
- **SLOs**: All default SLOs from `defaultSLOs.ts` with error budget calculations
- **Incidents**: Open incidents (status != "resolved") from Firestore `incidents` collection  
- **Capacity**: Latest capacity scans and predictive forecasts from Firestore

## Usage

### Manual Trigger (Admin UI)
1. Navigate to `/portal/admin/digest`
2. Click "Preview" to see what will be sent
3. Click "Send Digest Now" to send to Slack

### API Trigger
```bash
# Send digest
curl -X POST https://audiojones.com/api/admin/digest/run \
  -H "admin-key: YOUR_ADMIN_KEY"

# Preview digest  
curl -X POST https://audiojones.com/api/admin/digest/run?preview=true \
  -H "admin-key: YOUR_ADMIN_KEY"
```

### Automated Scheduling

#### GitHub Actions (Recommended)
```yaml
name: Send Ops Digest
on:
  schedule:
    - cron: '0 13 * * *'  # Daily at 9 AM EST
jobs:
  ops-digest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          curl -X POST https://audiojones.com/api/admin/digest/run \
            -H "admin-key: ${{ secrets.ADMIN_KEY }}"
```

#### Command Line (with proper Next.js environment)
```bash
# Set environment variables
export ADMIN_KEY="your-admin-key"
export BASE_URL="https://audiojones.com"

# Run script
npx tsx scripts/runOpsDigest.ts
npx tsx scripts/runOpsDigest.ts --preview  # Preview mode
```

## Configuration

### Required Environment Variables
- `ADMIN_KEY` - Admin API authentication key
- `SLACK_WEBHOOK_URL` - Slack incoming webhook URL

### Optional Environment Variables  
- `BASE_URL` - API base URL (defaults to localhost:3000)
- `SLACK_BOT_TOKEN` - Slack bot token (for advanced features)

## Digest Content

### Slack Message Structure
1. **Header** - "AudioJones Ops Digest" with timestamp
2. **Overall Status** - Health indicator (🟢 healthy, 🟡 warning, 🔴 critical)
3. **SLO Summary** - Count of healthy/at-risk/violating SLOs with details
4. **Open Incidents** - Recent incidents requiring attention
5. **Capacity Status** - Current utilization and forecast risk
6. **Quick Links** - Direct links to admin dashboard sections

### Status Determination Logic
- **Critical**: Any SLOs violating OR critical incidents OR critical capacity
- **Warning**: Any SLOs at-risk OR open incidents OR capacity warnings  
- **Healthy**: All systems operating within acceptable parameters

## Persistence & Logging

### Firestore Collections
- **`ops_digests/{timestamp}`** - Historical digest logs with full content
- **`ops_digest_status/last`** - Last sent status with success/failure tracking

### Error Handling
- API always returns 200 (safe for schedulers) with error details in response

## Webhook Verification System

### Overview
The system includes comprehensive webhook signature verification for receiving Audio Jones status webhooks securely.

### Inbound Webhook Verification

#### Endpoint
- **URL**: `/api/integrations/aj-webhook`
- **Method**: POST only
- **Purpose**: Receive and verify signed webhooks from Audio Jones systems

#### Required Headers
```
X-AJ-Signature: sha256=<hex-encoded-hmac-sha256-signature>
X-AJ-Timestamp: <ISO-8601-timestamp>
X-AJ-Event: <event-type>
Content-Type: application/json
```

#### Signature Verification Process
1. **Extract Headers**: Signature, timestamp, and event type from request headers
2. **Timestamp Validation**: Reject requests older than 5 minutes (replay attack prevention)
3. **HMAC Verification**: Generate expected signature using shared secret and compare with constant-time algorithm
4. **Event Logging**: Store all webhook attempts (successful and failed) in `aj_webhook_events` collection

#### Environment Variables
```bash
# Required for webhook verification
AJ_WEBHOOK_SHARED_SECRET=your-shared-secret-minimum-32-characters
```

#### Security Features
- **Constant-time comparison**: Prevents timing attacks on signature verification
- **Timestamp validation**: 5-minute window prevents replay attacks
- **Event type validation**: Only accepts known event types (status_change, status_operational, etc.)
- **Comprehensive logging**: All attempts logged with IP, headers, and verification status

#### Testing Webhook Verification
1. Navigate to `/portal/admin/status-webhooks`
2. Click "Test Webhook Verification" button
3. System sends signed test payload to receiver endpoint
4. Check results in admin UI and `aj_webhook_events` collection

#### Event Types Supported
- `status_change` - Status transitions (operational → degraded)
- `status_operational` - System back to operational
- `status_degraded` - System performance degradation
- `status_outage` - Complete system outage

#### Response Format
```json
{
  "ok": true,
  "event_id": "aj_1234567890_abc123def",
  "event_type": "status_change",
  "message": "Webhook processed successfully"
}
```

#### Error Responses
```json
{
  "ok": false,
  "reason": "signature-mismatch" | "timestamp-expired" | "invalid-json" | "server-configuration-error"
}
```
- Partial data failures continue with available information
- Slack failures are logged but don't prevent digest generation
- All errors are logged to console with structured format

## Testing

### System Validation
```bash
node test-digest-system.js  # Full system test
node validate-slo-system.js # SLO integration validation
```

### Manual Testing
1. Preview mode: Test digest generation without sending
2. Admin UI: Visual validation of digest content and formatting
3. Configuration check: Verify Slack and environment setup

## Monitoring

### Success Indicators
- Digest successfully generated and sent to Slack
- No errors in Firestore logs  
- Admin UI shows "Successfully sent" status
- Slack channel receives formatted message

### Common Issues
- **"Slack not configured"**: Set `SLACK_WEBHOOK_URL` environment variable
- **"Admin authentication failed"**: Verify `ADMIN_KEY` is correct
- **"No SLO data"**: Check that default SLOs are loaded and Firebase is accessible
- **"Digest API timeout"**: Server may be overloaded or Firebase connection slow

## Recommended Schedule

- **Daily Digest**: 9:00 AM EST weekdays (morning standup)
- **Weekly Summary**: Friday 5:00 PM EST (week recap)
- **Critical Alerts**: Use existing alert system for immediate notifications
- **Monthly Report**: First Monday of month (trend analysis)

## Security

- Admin authentication required for all digest endpoints
- No sensitive data exposed in Slack messages
- All API calls are logged with request metadata
- Firestore access follows existing security rules
- Environment variables should be kept secure and rotated regularly