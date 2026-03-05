/**
 * Researcher Identification Headers for Bug Bounty Engagements
 *
 * Generates HTTP headers that identify the researcher on all requests.
 * Required by HackerOne programs to attribute traffic to authorized testing.
 *
 * Usage:
 *   import { getResearcherHeaders, buildCurlFlags } from './http-headers';
 *
 *   const headers = getResearcherHeaders();
 *   const curlFlags = buildCurlFlags();
 *
 * CLI:
 *   bun run tools/bug-bounty/http-headers.ts
 */

import { getEnvValue } from "@/tools/framework/utils/vps-config";

/**
 * Platform researcher emails (not sensitive — used for attribution only).
 */
export const RESEARCHER_EMAILS: Record<string, string> = {
  hackerone: "notchrisgroves@wearehackerone.com",
  bugcrowd: "notchrisgroves@bugcrowdninja.com",
};

/**
 * Get researcher identification headers as a key-value map.
 *
 * @param platform - Optional platform override ('hackerone' | 'bugcrowd'). Defaults to 'hackerone'.
 * @returns Record with User-Agent, X-Bug-Bounty-Researcher, and platform-specific header
 * @throws Error if HACKERONE_USERNAME is not set in .env
 */
export function getResearcherHeaders(platform: string = "hackerone"): Record<string, string> {
  const username = getEnvValue("HACKERONE_USERNAME");
  if (!username) {
    throw new Error(
      "HACKERONE_USERNAME not set in .env\n" +
      "Add: HACKERONE_USERNAME=your_hackerone_username"
    );
  }

  const headers: Record<string, string> = {
    "User-Agent": `BugBounty-Research/${username}`,
    "X-Bug-Bounty-Researcher": username,
  };

  if (platform === "hackerone") {
    headers["X-HackerOne-Research"] = username;
  } else if (platform === "bugcrowd") {
    headers["X-Bugcrowd-Research"] = username;
  }

  return headers;
}

/**
 * Build curl -H flags for researcher identification headers.
 *
 * @returns String of curl -H flags ready to append to curl commands
 * @throws Error if HACKERONE_USERNAME is not set in .env
 */
export function buildCurlFlags(platform: string = "hackerone"): string {
  const headers = getResearcherHeaders(platform);
  return Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(" ");
}

// CLI mode
if (typeof Bun !== "undefined" && import.meta.main) {
  try {
    const platform = process.argv[2] || "hackerone";
    const headers = getResearcherHeaders(platform);
    const curlFlags = buildCurlFlags(platform);

    console.log(`Researcher Identification Headers (${platform})\n`);

    console.log("Headers:");
    for (const [key, value] of Object.entries(headers)) {
      console.log(`  ${key}: ${value}`);
    }

    console.log("\nPlatform Emails:");
    for (const [plat, email] of Object.entries(RESEARCHER_EMAILS)) {
      console.log(`  ${plat}: ${email}`);
    }

    console.log("\nCurl flags:");
    console.log(`  ${curlFlags}`);

    console.log("\nExample:");
    console.log(`  curl ${curlFlags} https://target.com/api/endpoint`);
  } catch (e: any) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}
