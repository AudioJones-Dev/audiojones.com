import { NextRequest, NextResponse } from "next/server";

/**
 * Vercel → Deployments Webhook
 * Configure in Vercel: Project → Settings → Webhooks → "Deployment finished"
 * 
 * Automatically handles failed deployments by:
 * 1. Logging to console (visible in Vercel logs)
 * 2. Sending notifications to configured webhooks (Slack/n8n)
 * 3. Creating GitHub issues for tracking
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ ok: false, error: "No body" }, { status: 400 });
  }

  // Vercel webhook payload structure:
  // {
  //   "id": "dpl_xyz123",
  //   "name": "audiojones.com",
  //   "url": "audiojones-com-xxxxx.vercel.app", 
  //   "state": "READY" | "ERROR" | "BUILDING" | "QUEUED",
  //   "meta": { githubCommitMessage, githubCommitRef, etc. },
  //   "createdAt": "2023-11-06T12:00:00.000Z"
  // }

  const deploymentState = body.state;
  const projectName = body.name;
  const deploymentUrl = body.url;
  const deploymentId = body.id;
  const commitMessage = body.meta?.githubCommitMessage || "Unknown commit";
  const commitRef = body.meta?.githubCommitRef || "Unknown ref";
  const createdAt = body.createdAt || new Date().toISOString();

  console.log(`[VERCEL WEBHOOK] ${projectName} deployment ${deploymentId}: ${deploymentState}`);

  // Only act on failures
  if (deploymentState !== "ERROR") {
    return NextResponse.json({ 
      ok: true, 
      ignored: true, 
      reason: `Deployment state is ${deploymentState}, not ERROR` 
    });
  }

  // 🚨 DEPLOYMENT FAILED - Take action
  console.error("[VERCEL DEPLOY FAILED]", {
    projectName,
    deploymentId,
    deploymentUrl: `https://${deploymentUrl}`,
    commitMessage,
    commitRef,
    createdAt,
  });

  const failureData = {
    type: "vercel-deploy-failed",
    project: projectName,
    deploymentId,
    deploymentUrl: `https://${deploymentUrl}`,
    commitMessage,
    commitRef,
    timestamp: new Date().toISOString(),
    vercelTimestamp: createdAt,
  };

  // 1) Send to configured webhook (Slack/n8n/Make)
  const webhookUrl = process.env.DEPLOY_FAIL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn(
      "[WEBHOOK] Got failed deployment but DEPLOY_FAIL_WEBHOOK_URL not configured. Set this env var for notifications."
    );
  } else {
    try {
      console.log("[WEBHOOK] Sending failure notification to:", webhookUrl);
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...failureData,
          // Slack-compatible format
          text: `🚨 Vercel deployment failed for ${projectName}`,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*🚨 Vercel Deployment Failed*\n\n*Project:* ${projectName}\n*Deployment:* \`${deploymentId}\`\n*Commit:* ${commitMessage}\n*Branch:* ${commitRef}\n*Preview:* https://${deploymentUrl}`
              }
            }
          ]
        }),
      });
      console.log("[WEBHOOK] Notification sent successfully");
    } catch (err) {
      console.error("[WEBHOOK] Failed to notify:", err);
    }
  }

  // 2) Auto-create GitHub issue for tracking
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO || "AJDIGITALllc/audiojones.com";

  if (!githubToken || !githubRepo) {
    console.warn(
      "[GITHUB] Got failed deployment but GitHub envs missing. Set GITHUB_TOKEN and GITHUB_REPO for auto-issue creation."
    );
  } else {
    const [owner, repo] = githubRepo.split("/");
    try {
      console.log("[GITHUB] Creating issue for failed deployment");
      
      const issueResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          title: `🚨 Vercel deployment failed: ${deploymentId}`,
          body: [
            `A Vercel deployment failed for **${projectName}**.`,
            ``,
            `## Deployment Details`,
            `- **Deployment ID:** \`${deploymentId}\``,
            `- **Preview URL:** https://${deploymentUrl}`,
            `- **Commit Message:** ${commitMessage}`,
            `- **Branch/Ref:** ${commitRef}`,
            `- **Failed At:** ${createdAt}`,
            ``,
            `## Next Steps`,
            `1. Check Vercel logs for detailed error information`,
            `2. Run the log fetcher script: \`pwsh scripts/get-vercel-failed-logs.ps1 -VercelToken ${process.env.VERCEL_TOKEN || 'YOUR_TOKEN'}\` (or \`scripts/get-vercel-failed-logs.sh\` on Linux/Mac)`,
            `3. Fix the underlying issue`,
            `4. Close this issue when resolved`,
            ``,
            `---`,
            `*This issue was automatically created by the Vercel webhook monitor.*`
          ].join("\n"),
          labels: ["vercel", "deployment", "failed", "auto-generated"],
          assignees: ["tyronedigitalll"], // Auto-assign to main dev
        }),
      });

      if (issueResponse.ok) {
        const issue = await issueResponse.json();
        console.log(`[GITHUB] Created issue #${issue.number}: ${issue.html_url}`);
      } else {
        console.error("[GITHUB] Failed to create issue:", issueResponse.status, await issueResponse.text());
      }
    } catch (err) {
      console.error("[GITHUB] Failed to create issue:", err);
    }
  }

  // 3) Optional: log to NeonDB for analytics
  // TODO: Add deployment failure tracking.
  
  return NextResponse.json({ 
    ok: true, 
    handled: true,
    deploymentId,
    actions: {
      webhook: !!webhookUrl,
      github: !!(githubToken && githubRepo),
      logged: true,
    },
    warnings: [
      ...(!webhookUrl ? ["DEPLOY_FAIL_WEBHOOK_URL not configured - no notifications sent"] : []),
      ...(!githubToken || !githubRepo ? ["GitHub integration not configured - no auto-issues created"] : [])
    ].filter(Boolean)
  });
}

// Support GET for webhook verification/testing
export async function GET() {
  return NextResponse.json({ 
    service: "Vercel Deploy Monitor",
    status: "active",
    timestamp: new Date().toISOString(),
    env: {
      webhookConfigured: !!process.env.DEPLOY_FAIL_WEBHOOK_URL,
      githubConfigured: !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO),
    }
  });
}