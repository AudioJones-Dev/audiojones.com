# Task: Vercel Failed Deployment Monitor

## Overview
Automated monitoring system that responds to Vercel deployment failures by logging, alerting, and creating tracking issues.

## Implementation Status

- [x] Create Next.js API route at `src/app/api/webhooks/vercel-deploy/route.ts`
- [x] Route accepts Vercel "deployment finished" webhook payload
- [x] If `state !== "ERROR"` → return 200 and ignore
- [x] If `state === "ERROR"` → execute automated response chain
- [x] Log failure details to console (visible in Vercel logs)
- [x] Send Slack-compatible notification to configured webhook
- [x] Auto-create GitHub issue with deployment details
- [ ] Configure Vercel webhook: Project → Settings → Webhooks → Deployment finished
- [ ] Add required environment variables in Vercel
- [ ] Test webhook with failed deployment

## Configuration Required

### 1. Vercel Webhook Setup
1. Go to Vercel Project → **Settings** → **Webhooks**
2. Click "Add webhook"
3. Select event: **Deployment finished**
4. URL: `https://audiojones.com/api/webhooks/vercel-deploy`
5. Optional: Add secret for security

### 2. Environment Variables
Add these to your Vercel project environment:

```env
# Required for log fetching (you provided this)
VERCEL_TOKEN=<REDACTED — pull from Doppler / Vercel; rotate the value previously committed here>

# Optional: Slack/n8n/Make webhook for notifications
DEPLOY_FAIL_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# Optional: GitHub integration for auto-issue creation
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_REPO=AJDIGITALllc/audiojones.com
```

### 3. GitHub Token Setup (Optional)
If you want auto-issue creation:
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Create token with `repo` scope
3. Add as `GITHUB_TOKEN` environment variable

## Features

### Automatic Actions on Deployment Failure
1. **Logging**: Detailed failure info in Vercel logs
2. **Slack Notification**: Rich message with deployment details
3. **GitHub Issue**: Auto-created with:
   - Deployment ID and preview URL
   - Commit message and branch
   - Next steps for resolution
   - Auto-assigned to main developer

### Webhook Payload Support
- Handles Vercel's standard deployment webhook format
- Extracts commit info, timestamps, deployment URLs
- Supports both success and failure states (only acts on failures)

### Security & Reliability
- Input validation for webhook payload
- Error handling for all external API calls
- Graceful degradation if services are unavailable
- GET endpoint for health checks

## Testing

### Test the webhook endpoint:
```bash
curl https://audiojones.com/api/webhooks/vercel-deploy
```

### Mock a failed deployment:
```bash
curl -X POST https://audiojones.com/api/webhooks/vercel-deploy \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_deployment",
    "name": "audiojones.com", 
    "url": "test.vercel.app",
    "state": "ERROR",
    "meta": {
      "githubCommitMessage": "Test deployment failure",
      "githubCommitRef": "main"
    }
  }'
```

## Benefits

✅ **Proactive Monitoring**: No need to check Vercel dashboard manually  
✅ **Instant Alerts**: Immediate Slack notifications for team awareness  
✅ **Issue Tracking**: Auto-created GitHub issues for systematic resolution  
✅ **Audit Trail**: Complete log history of deployment failures  
✅ **Integration Ready**: Works with existing n8n/Make workflows  

## Future Enhancements

- [ ] Add Firebase/Data Connect logging for analytics
- [ ] Implement failure pattern detection
- [ ] Add auto-retry mechanisms for transient failures
- [ ] Create deployment health dashboard
- [ ] Integrate with monitoring tools (Sentry, etc.)

## Related Files

- `src/app/api/webhooks/vercel-deploy/route.ts` - Main webhook handler
- `scripts/get-vercel-failed-logs.ps1` - Manual log fetching tool
- `run-vercel-logs.bat` - Simplified log fetcher interface