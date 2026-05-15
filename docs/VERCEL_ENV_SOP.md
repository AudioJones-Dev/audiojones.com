# Vercel Environment Variables Setup - Standard Operating Procedure (SOP)

## 🎯 **Problem Solved**: Firebase Private Key Truncation

**Issue**: Vercel dashboard truncates long environment variables (1678 chars → 40 chars)  
**Solution**: Use Vercel CLI with file-based input and `--force` flag  
**Status**: ✅ **RESOLVED** - Production webhook confirmed working

---

## 📋 **Standard Operating Procedure**

### **Method 1: Direct File Input (RECOMMENDED)**

This is the **permanent solution** for storing PEM keys and other long secrets on Vercel:

```powershell
# 1. Create/verify the private key file exists
Get-Content .\scripts\firebase-private-key.txt

# 2. Set the environment variable using file input
Get-Content .\scripts\firebase-private-key.txt | vercel env add FIREBASE_PRIVATE_KEY production --sensitive --force
```

**✅ What this does:**
- Reads exact PEM file contents (no truncation, no `\n` issues)
- Pipes directly into Vercel CLI, preserving all formatting
- `--sensitive` hides it in the dashboard
- `--force` overwrites existing entries if needed
- **This is the correct permanent way to store real PEMs on Vercel**

### **Method 2: Base64 Backup (FAILSAFE)**

Cross-platform method immune to newline issues:

```powershell
# Set the Base64 version as backup
Write-Output "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t..." | vercel env add FIREBASE_PRIVATE_KEY_BASE64 production --sensitive
```

**Code usage:**
```typescript
// In your Firebase Admin initialization
privateKey: process.env.FIREBASE_PRIVATE_KEY || 
           Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64!, 'base64').toString('utf8')
```

---

## 🔧 **Complete Setup Commands**

### **All Environment Variables:**

```powershell
# Firebase Admin SDK
Get-Content .\scripts\firebase-private-key.txt | vercel env add FIREBASE_PRIVATE_KEY production --sensitive --force
vercel env add FIREBASE_PROJECT_ID production  # Enter: audiojoneswebsite
vercel env add FIREBASE_CLIENT_EMAIL production  # Enter: firebase-adminsdk-fbsvc@audiojoneswebsite.iam.gserviceaccount.com

# Whop API
vercel env add WHOP_API_KEY production --sensitive  # Enter: apik_... (pull from Doppler / Whop dashboard)
vercel env add WHOP_APP_ID production  # Enter: app_Tzvx5EwI6UjdyS

# Base64 Backup (optional but recommended)
Write-Output "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t..." | vercel env add FIREBASE_PRIVATE_KEY_BASE64 production --sensitive
```

---

## 🎯 **Verification Steps**

### **1. Confirm Variables Are Set:**
```powershell
vercel env ls production | findstr "FIREBASE\|WHOP"
```

### **2. Test Webhook Endpoint:**
```powershell
# Should return: {"ok": true, "source": "whop-webhook"}
curl https://audiojones.com/api/whop
```

### **3. Verify Key Length (Not Truncated):**
```powershell
# Pull variables locally to check (DO NOT COMMIT)
vercel env pull .env.temp
$key = (Get-Content .env.temp | Where-Object { $_ -like "FIREBASE_PRIVATE_KEY=*" }) -replace "FIREBASE_PRIVATE_KEY=",""
Write-Host "Key Length: $($key.Length) characters"  # Should be ~1678, NOT 40
Remove-Item .env.temp -Force
```

---

## 📁 **File Structure**

```
scripts/
├── firebase-private-key.txt      # PEM file (LOCAL ONLY - never commit)
├── setup-vercel-env.ps1         # Automated setup script
├── vercel-env-manual.ps1        # Manual step-by-step guide
└── vercel-env-check.ps1          # Verification script
```

---

## ⚙️ **Best Practices Going Forward**

### **✅ DO:**
- Keep `firebase-private-key.txt` local only (never commit to git)
- Maintain both vars (`FIREBASE_PRIVATE_KEY` and `_BASE64`) for seamless fallback
- Use CLI for all future long secrets (Stripe, service accounts, etc.)
- Test webhooks after any environment variable changes

### **❌ DON'T:**
- Use Vercel dashboard for long/multiline environment variables
- Commit `.env.vercel.*` files to git (already in `.gitignore`)
- Store private keys in plain text in code or documentation

---

## 🚀 **Production Deployment Workflow**

```powershell
# 1. Set environment variables (one-time setup)
Get-Content .\scripts\firebase-private-key.txt | vercel env add FIREBASE_PRIVATE_KEY production --sensitive --force

# 2. Deploy code changes
git add .
git commit -m "feat: your changes"
git push origin main

# 3. Verify deployment (auto-triggers from git push)
Start-Sleep 60  # Wait for deployment
curl https://audiojones.com/api/whop

# 4. Manual redeploy if needed
vercel --prod
```

---

## 🎉 **Success Metrics**

✅ **CONFIRMED WORKING:**
- Main webhook: `https://audiojones.com/api/whop` returns `{"ok": true}`
- Firebase private key: Full 1678 characters (not truncated to 40)
- Environment variables: All set via CLI with proper formatting
- Production deployment: Auto-triggers from git push

---

## 🆘 **Troubleshooting**

### **If webhook returns errors:**
1. Check environment variables: `vercel env ls production`
2. Verify private key length (see verification steps above)
3. Test locally: `npm run dev` then `curl http://localhost:3000/api/whop`
4. Check deployment logs: `vercel logs --follow`

### **If private key is still truncated:**
1. Remove existing variable: `vercel env rm FIREBASE_PRIVATE_KEY production`
2. Re-add using file method: `Get-Content .\scripts\firebase-private-key.txt | vercel env add FIREBASE_PRIVATE_KEY production --sensitive`
3. Use Base64 fallback if needed

---

## 📚 **Related Files**

- `src/app/api/whop/route.ts` - Main webhook implementation
- `src/app/api/whop-base64/route.ts` - Base64 fallback webhook
- `src/lib/firebase/admin.ts` - Firebase Admin SDK configuration
- `ISSUE_ANALYSIS.md` - Detailed technical analysis of the truncation problem

---

**Last Updated**: November 8, 2025  
**Status**: ✅ Production Ready  
**Verified**: Main webhook operational at https://audiojones.com/api/whop