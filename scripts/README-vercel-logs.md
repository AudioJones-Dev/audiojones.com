# Vercel Failed Deployment Log Downloader

This script helps you download and analyze logs from failed Vercel deployments to debug build issues.

## Setup

1. **Get your Vercel API token**:
   - Go to [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Create a new token with appropriate permissions
   - Copy the token

2. **Find your project details** (if different from defaults):
   - Project name: Usually your repository name
   - Team ID: Optional, only needed if using Vercel teams

## Usage

### Option 1: PowerShell Script (Windows / pwsh on Linux/Mac)
```powershell
.\scripts\get-vercel-failed-logs.ps1 -VercelToken "YOUR_VERCEL_TOKEN"

# With custom project name
.\scripts\get-vercel-failed-logs.ps1 -VercelToken "YOUR_VERCEL_TOKEN" -ProjectName "my-project"

# With team ID
.\scripts\get-vercel-failed-logs.ps1 -VercelToken "YOUR_VERCEL_TOKEN" -TeamId "team_xxx"
```

### Option 2: Bash Script (WSL/Linux/Mac)
```bash
# Set environment variables
export VERCEL_TOKEN="YOUR_VERCEL_TOKEN"
export PROJECT_NAME="audiojones.com"  # optional
export TEAM_ID=""                     # optional

# Run the script
./scripts/get-vercel-failed-logs.sh

# Or in one line
VERCEL_TOKEN="YOUR_VERCEL_TOKEN" ./scripts/get-vercel-failed-logs.sh
```

## Output

The script creates:

- `deployments.json` - Full deployment data from Vercel API
- `failed.txt` - List of failed deployment IDs
- `vercel-failed-logs/` directory containing:
  - `{deployment-id}.json` - Raw event data for each failed deployment
  - `{deployment-id}-build.log` - Readable build logs (stdout/stderr)

## Example

```powershell
PS C:\dev\audiojones.com> .\scripts\get-vercel-failed-logs.ps1 -VercelToken vercel_abc123...

Downloading failed deployment logs for audiojones.com...
Using token: vercel_abc...

Fetching last 100 deployments...
Found 5 failed deployments:
  - dpl_xyz789 | 2024-11-06 15:30:45 | fix: resolve build issues
  - dpl_abc456 | 2024-11-06 14:20:30 | feat: add new components

[1/5] Downloading logs for dpl_xyz789...
  ✓ Saved 45 log entries
[2/5] Downloading logs for dpl_abc456...
  ✓ Saved 32 log entries

✅ Log download complete!
```

## Troubleshooting

- **401 Unauthorized**: Check your Vercel token
- **404 Not Found**: Verify project name and team ID
- **No failed deployments**: Great! Your recent builds are working
- **Rate limiting**: The script includes small delays to avoid API limits

## Security Note

⚠️ **Never commit your Vercel token to version control!** 

The scripts are designed to take the token as a parameter to avoid accidentally committing secrets.