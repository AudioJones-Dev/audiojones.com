# Vercel Environment Variables Setup

## 🎯 Your Webhook is Working - Just Need Vercel Environment Variables!

Your webhook is successfully deployed at `https://audiojones.com/api/whop` but needs environment variables in Vercel to write to Firebase.

## Steps to Complete Setup:

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/ajdigitalllc/audiojones-com/settings/environment-variables

### 2. Add These 5 Environment Variables:

**FIREBASE_PROJECT_ID**
```
audiojoneswebsite
```

**FIREBASE_CLIENT_EMAIL**
```
firebase-adminsdk-fbsvc@audiojoneswebsite.iam.gserviceaccount.com
```

**FIREBASE_PRIVATE_KEY**
```
-----BEGIN PRIVATE KEY-----
<REDACTED — see SECURITY NOTE below>
-----END PRIVATE KEY-----
```
> **SECURITY NOTE:** A live Firebase service-account PEM was committed to
> this document in earlier history and has been redacted. Firebase has been
> removed from audiojones.com (see `docs/architecture/stack-decision.md`),
> so this key should be treated as **revoked / dead**. If anyone still
> holds a copy, rotate it via the GCP console regardless. Pull live values
> from Vercel / Doppler — never paste real PEMs into tracked docs.

**WHOP_APP_ID**
```
<REDACTED — pull from Vercel env or Doppler>
```

**WHOP_API_KEY**
```
<REDACTED — pull from Vercel env or Doppler>
```
> **SECURITY NOTE:** A live Whop API key was previously committed here.
> Treat it as compromised and rotate via the Whop dashboard if not already
> done. Future secrets must live in Vercel / Doppler, not in tracked docs.

### 3. After Adding Variables
- Vercel will automatically redeploy
- Wait 2-3 minutes for deployment to complete

### 4. Test the Production Webhook
Run this test:
```bash
node test-whop-webhook.js 
```

### 5. Verify in Firebase Console
Check for new records at:
https://console.firebase.google.com/project/audiojoneswebsite/firestore

You should see:
- ✅ `customers` collection with test customer data
- ✅ `subscription_events` collection with webhook events

## Current Status:
- ✅ Webhook deployed and responding: https://audiojones.com/api/whop  
- ✅ Local `.env.local` configured correctly
- ⏳ Need Vercel environment variables added
- ⏳ Then ready for production Whop webhook integration!

## Whop Webhook URL for Your App:
```
https://audiojones.com/api/whop
```

Add this URL to your Whop app dashboard for automatic webhook delivery.