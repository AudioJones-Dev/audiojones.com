# PowerShell script to set up Vercel environment variables
#
# OBSOLETE: This script previously embedded a live Firebase service-account
# private key and a Whop API key in plaintext. Firebase has been removed
# from audiojones.com (see docs/architecture/stack-decision.md), so both
# secrets are dead and have been redacted from this file. Treat any value
# that ever appeared here as compromised and rotate it.
#
# To set Vercel env vars going forward, pull live values from Doppler or
# 1Password and use `vercel env add <NAME> production --sensitive` interactively.

Write-Host "This setup script has been retired." -ForegroundColor Yellow
Write-Host "The secrets it embedded have been removed. See docs/VERCEL_ENV_SOP.md" -ForegroundColor Yellow
Write-Host "for the current procedure, and pull live values from Doppler / 1Password." -ForegroundColor Yellow
exit 1
