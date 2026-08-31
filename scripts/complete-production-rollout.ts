/**
 * Finishes a production deploy and proves it reached the production alias.
 *
 * `vercel deploy --prod` creates a production deployment but does not, on a
 * project with rolling releases configured, move the production alias to it.
 * The deployment enters the rollout as a canary and waits. If nothing ever
 * completes that rollout, the alias keeps serving the previous deployment and
 * every subsequent deploy queues behind it — silently, with a green CI run.
 *
 * That is not hypothetical: this project served commit 84ea3ef for 45 days
 * and 15 merges while every deploy job reported success.
 *
 * So this script does two things, and the second matters more than the first:
 * completes the rollout when one is active, then asserts the alias actually
 * points at the deployment we just made. A production deploy that does not
 * reach production is a failed deploy and should be a red run.
 */

const API = "https://api.vercel.com";

const VERIFY_ATTEMPTS = 10;
const VERIFY_DELAY_MS = 6_000;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

/** Read inside main() so a missing variable reports through the same handler. */
let token = "";
let teamId = "";
let projectId = "";
let deploymentUrl = "";

function loadConfig(): void {
  token = requireEnv("VERCEL_TOKEN");
  teamId = requireEnv("VERCEL_ORG_ID");
  projectId = requireEnv("VERCEL_PROJECT_ID");
  deploymentUrl = requireEnv("DEPLOYMENT_URL");
}

/** Never interpolated into output — the token must not reach the run log. */
async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const separator = path.includes("?") ? "&" : "?";
  const res = await fetch(`${API}${path}${separator}teamId=${teamId}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`${init.method ?? "GET"} ${path} → ${res.status}\n${body}`);
  }
  return body ? (JSON.parse(body) as T) : ({} as T);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Deployment = { id?: string };
type RollingRelease = {
  rollingRelease: null | {
    state?: string;
    canaryDeployment?: { id?: string };
  };
};
type Project = {
  targets?: {
    production?: { id?: string; readySubstate?: string } | null;
  };
};

/**
 * `targets.production.id` alone is not enough. A staged canary can occupy that
 * slot while the alias still serves the previous deployment — the id would
 * match and this check would pass on exactly the failure it exists to catch.
 * `readySubstate` is what separates "promoted" from "staged"/"rolling".
 * Projects without rolling releases may omit it, so absent is treated as
 * promoted; only an explicit staged/rolling value is a failure.
 */
function isPromoted(substate: string | undefined): boolean {
  return substate === undefined || substate === "PROMOTED";
}

/**
 * Ground truth, free of any assumption about the project API's shape: on a
 * project with rolling releases the edge sets a `_vcrr_*` cookie naming the
 * deployment that actually served the request.
 */
async function servingDeploymentFromEdge(): Promise<string | undefined> {
  const productionUrl = process.env.PRODUCTION_URL;
  if (!productionUrl) return undefined;
  try {
    const res = await fetch(productionUrl, { method: "HEAD", redirect: "follow" });
    const cookie = res.headers.get("set-cookie") ?? "";
    return /_vcrr_[^=]*=(dpl_[A-Za-z0-9]+)/.exec(cookie)?.[1];
  } catch {
    return undefined;
  }
}

async function resolveDeploymentId(): Promise<string> {
  const host = deploymentUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const deployment = await api<Deployment>(`/v13/deployments/${host}`);
  if (!deployment.id) {
    throw new Error(`Could not resolve a deployment id for ${host}`);
  }
  return deployment.id;
}

/**
 * Returns true when a rollout was completed. A project with no rolling release
 * configured is normal — the alias moves on its own — so that is not an error
 * here. The verification step below is what decides whether it worked.
 */
async function completeRollout(deploymentId: string): Promise<boolean> {
  const { rollingRelease } = await api<RollingRelease>(
    `/v1/projects/${projectId}/rolling-release`,
  );

  if (!rollingRelease || rollingRelease.state !== "ACTIVE") {
    console.log(
      `No active rolling release (state: ${rollingRelease?.state ?? "none"}).`,
    );
    return false;
  }

  const canaryId = rollingRelease.canaryDeployment?.id;
  if (canaryId !== deploymentId) {
    // Completing someone else's in-flight rollout would promote a deployment
    // this run never built. Refuse and let a human look.
    throw new Error(
      `A rolling release is active for a different deployment.\n` +
        `  canary:    ${canaryId ?? "unknown"}\n` +
        `  this run:  ${deploymentId}\n` +
        `Resolve it in the Vercel dashboard before re-running.`,
    );
  }

  await api(`/v1/projects/${projectId}/rolling-release/complete`, {
    method: "POST",
    body: JSON.stringify({ canaryDeploymentId: deploymentId }),
  });
  console.log(`Completed the rolling release for ${deploymentId}.`);
  return true;
}

/** The whole point of this script: did production actually change? */
async function verifyAliasAdvanced(deploymentId: string): Promise<void> {
  let observed: string | undefined;
  let substate: string | undefined;
  let edge: string | undefined;

  for (let attempt = 1; attempt <= VERIFY_ATTEMPTS; attempt++) {
    const project = await api<Project>(`/v9/projects/${projectId}`);
    const production = project.targets?.production;

    if (production === undefined) {
      throw new Error(
        `Could not read targets.production from the project API. The response ` +
          `shape may have changed; this check needs updating rather than ` +
          `ignoring.\nReceived keys: ${Object.keys(project).join(", ") || "none"}`,
      );
    }

    observed = production?.id;
    substate = production?.readySubstate;
    edge = await servingDeploymentFromEdge();

    const apiAgrees = observed === deploymentId && isPromoted(substate);
    const edgeAgrees = edge === undefined || edge === deploymentId;

    if (apiAgrees && edgeAgrees) {
      console.log(`Production now serves ${deploymentId}.`);
      return;
    }

    if (attempt < VERIFY_ATTEMPTS) await sleep(VERIFY_DELAY_MS);
  }

  throw new Error(
    `Production did not advance to this deployment.\n` +
      `  expected:            ${deploymentId}\n` +
      `  project target:      ${observed ?? "none"} (substate: ${substate ?? "none"})\n` +
      `  actually serving:    ${edge ?? "not reported"}\n` +
      `The deployment built and is healthy, but the public site is still on ` +
      `an older one. Promote it in the Vercel dashboard, or run:\n` +
      `  vercel rolling-release complete --dpl=${deploymentUrl}\n` +
      `  # or, if no rolling release is configured:\n` +
      `  vercel promote ${deploymentUrl}`,
  );
}

async function main(): Promise<void> {
  loadConfig();
  const deploymentId = await resolveDeploymentId();
  console.log(`Deployment ${deploymentId} (${deploymentUrl})`);
  await completeRollout(deploymentId);
  await verifyAliasAdvanced(deploymentId);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
