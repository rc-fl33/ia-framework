#!/usr/bin/env bun
/**
 * HackerOne API Client
 * Fetch program data, list programs, and discover new opportunities
 *
 * Usage:
 *   bun run api.ts program <handle>     # Fetch single program
 *   bun run api.ts list                  # List accessible programs
 *   bun run api.ts discover [--new]      # Find programs with scope
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

// Load .env from framework root
function loadEnv(): { username: string; token: string } {
  const envPath = resolve(dirname(import.meta.path), '../../../../.env');

  if (!existsSync(envPath)) {
    console.error(`ERROR: .env not found at ${envPath}`);
    process.exit(1);
  }

  const envContent = readFileSync(envPath, 'utf-8');
  const env: Record<string, string> = {};

  for (const line of envContent.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) {
      env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }

  const username = env.HACKERONE_USERNAME;
  const token = env.HACKERONE_API_TOKEN;

  if (!username || !token) {
    console.error('ERROR: HACKERONE_USERNAME and HACKERONE_API_TOKEN required in .env');
    process.exit(1);
  }

  return { username, token };
}

// API base URL
const API_BASE = 'https://api.hackerone.com/v1';

// Make authenticated request
async function apiRequest(endpoint: string, creds: { username: string; token: string }): Promise<any> {
  const auth = Buffer.from(`${creds.username}:${creds.token}`).toString('base64');

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed - check credentials');
    }
    if (response.status === 404) {
      throw new Error('Resource not found');
    }
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Fetch single program by handle
async function fetchProgram(handle: string): Promise<void> {
  const creds = loadEnv();

  try {
    const data = await apiRequest(`/hackers/programs/${handle}`, creds);
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`ERROR: Failed to fetch program '${handle}'`);
    console.error((error as Error).message);
    process.exit(1);
  }
}

// List all accessible programs
async function listPrograms(page: number = 1, pageSize: number = 100): Promise<any[]> {
  const creds = loadEnv();
  const programs: any[] = [];

  try {
    // Fetch paginated list
    let currentPage = page;
    let hasMore = true;

    while (hasMore) {
      const data = await apiRequest(
        `/hackers/programs?page[number]=${currentPage}&page[size]=${pageSize}`,
        creds
      );

      if (data.data && data.data.length > 0) {
        programs.push(...data.data);
        currentPage++;

        // Check if there are more pages
        hasMore = data.links?.next !== undefined;

        // Safety limit
        if (currentPage > 20) {
          console.error('Warning: Reached page limit (20)');
          break;
        }
      } else {
        hasMore = false;
      }
    }

    return programs;
  } catch (error) {
    console.error('ERROR: Failed to list programs');
    console.error((error as Error).message);
    process.exit(1);
  }
}

// Discover programs with reasonable scope
interface ProgramSummary {
  handle: string;
  name: string;
  bountyRange: string;
  assetCount: number;
  webAssets: number;
  apiAssets: number;
  launchedAt: string;
  responseEfficiency: string;
  state: string;
}

async function discoverPrograms(options: { newOnly?: boolean; minAssets?: number } = {}): Promise<void> {
  const { newOnly = false, minAssets = 3 } = options;

  console.log('Fetching programs from HackerOne API...\n');

  const programs = await listPrograms();

  // Filter and summarize
  const summaries: ProgramSummary[] = [];

  for (const program of programs) {
    const attrs = program.attributes;

    // Skip if not accepting submissions
    if (attrs.state !== 'public_mode' && attrs.submission_state !== 'open') {
      continue;
    }

    // Count assets by type
    const structuredScopes = program.relationships?.structured_scopes?.data || [];
    let webAssets = 0;
    let apiAssets = 0;
    let totalAssets = structuredScopes.length;

    // We need to fetch full program to get scope details
    // For now, use what's available

    // Calculate bounty range
    const bountyLower = attrs.offers_bounties ? (attrs.bounty_split_min || 'varies') : 'none';
    const bountyUpper = attrs.offers_bounties ? (attrs.bounty_split_max || 'varies') : 'none';
    const bountyRange = attrs.offers_bounties ? `$${bountyLower}-$${bountyUpper}` : 'No bounties';

    // Check launch date if filtering for new
    const launchedAt = attrs.started_accepting_at || attrs.created_at || 'unknown';

    if (newOnly) {
      const launchDate = new Date(launchedAt);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      if (launchDate < sixMonthsAgo) {
        continue;
      }
    }

    summaries.push({
      handle: attrs.handle,
      name: attrs.name,
      bountyRange,
      assetCount: totalAssets,
      webAssets,
      apiAssets,
      launchedAt,
      responseEfficiency: attrs.response_efficiency_percentage ? `${attrs.response_efficiency_percentage}%` : 'N/A',
      state: attrs.state
    });
  }

  // Sort by launch date (newest first) or asset count
  summaries.sort((a, b) => {
    if (newOnly) {
      return new Date(b.launchedAt).getTime() - new Date(a.launchedAt).getTime();
    }
    return b.assetCount - a.assetCount;
  });

  // Display top results
  console.log(`Found ${summaries.length} programs accepting submissions\n`);
  console.log('Top programs with scope:\n');
  console.log('-'.repeat(80));

  const display = summaries.slice(0, 15);

  for (const prog of display) {
    console.log(`Handle:     ${prog.handle}`);
    console.log(`Name:       ${prog.name}`);
    console.log(`Bounties:   ${prog.bountyRange}`);
    console.log(`Assets:     ${prog.assetCount}`);
    console.log(`Launched:   ${prog.launchedAt}`);
    console.log(`Response:   ${prog.responseEfficiency}`);
    console.log('-'.repeat(80));
  }

  // Also output as JSON for programmatic use
  if (process.env.OUTPUT_JSON) {
    console.log('\n--- JSON OUTPUT ---');
    console.log(JSON.stringify(summaries, null, 2));
  }
}

// Fetch detailed scope for a program
async function fetchScope(handle: string): Promise<void> {
  const creds = loadEnv();

  try {
    const data = await apiRequest(`/hackers/programs/${handle}`, creds);

    // Handle both response formats (with or without data wrapper)
    const programData = data.data || data;
    const attrs = programData.attributes;

    console.log(`\nScope for: ${attrs.name}\n`);
    console.log('='.repeat(60));

    // Get structured scopes from relationships
    const structuredScopes = programData.relationships?.structured_scopes?.data || [];

    // In-scope assets
    console.log('\nIN SCOPE (eligible for bounty):');
    console.log('-'.repeat(60));

    let inScopeCount = 0;
    for (const scope of structuredScopes) {
      if (scope.attributes.eligible_for_submission && scope.attributes.eligible_for_bounty) {
        const scopeAttrs = scope.attributes;
        console.log(`  [${scopeAttrs.asset_type}] ${scopeAttrs.asset_identifier}`);
        if (scopeAttrs.max_severity && scopeAttrs.max_severity !== 'none') {
          console.log(`    Max severity: ${scopeAttrs.max_severity}`);
        }
        if (scopeAttrs.instruction) {
          console.log(`    Notes: ${scopeAttrs.instruction.substring(0, 100)}`);
        }
        inScopeCount++;
      }
    }

    if (inScopeCount === 0) {
      console.log('  (No bounty-eligible assets listed - check policy)');
    }

    // In-scope but no bounty
    console.log('\nIN SCOPE (no bounty):');
    console.log('-'.repeat(60));

    let noBountyCount = 0;
    for (const scope of structuredScopes) {
      if (scope.attributes.eligible_for_submission && !scope.attributes.eligible_for_bounty) {
        const scopeAttrs = scope.attributes;
        console.log(`  [${scopeAttrs.asset_type}] ${scopeAttrs.asset_identifier}`);
        noBountyCount++;
      }
    }

    if (noBountyCount === 0) {
      console.log('  (None)');
    }

    // Out-of-scope
    console.log('\nOUT OF SCOPE:');
    console.log('-'.repeat(60));

    let outCount = 0;
    for (const scope of structuredScopes) {
      if (!scope.attributes.eligible_for_submission) {
        const scopeAttrs = scope.attributes;
        console.log(`  [${scopeAttrs.asset_type}] ${scopeAttrs.asset_identifier}`);
        outCount++;
      }
    }

    if (outCount === 0) {
      console.log('  (None explicitly listed)');
    }

    // Summary
    console.log('\nSUMMARY:');
    console.log('-'.repeat(60));
    console.log(`  Total assets: ${structuredScopes.length}`);
    console.log(`  In-scope (bounty): ${inScopeCount}`);
    console.log(`  In-scope (no bounty): ${noBountyCount}`);
    console.log(`  Out of scope: ${outCount}`);
    console.log(`  Offers bounties: ${attrs.offers_bounties ? 'Yes' : 'No'}`);
    console.log(`  State: ${attrs.state}`);

  } catch (error) {
    console.error(`ERROR: Failed to fetch scope for '${handle}'`);
    console.error((error as Error).message);
    process.exit(1);
  }
}

// Main CLI
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'program':
    if (!args[1]) {
      console.error('Usage: bun run api.ts program <handle>');
      process.exit(1);
    }
    await fetchProgram(args[1]);
    break;

  case 'list':
    const programs = await listPrograms();
    console.log(JSON.stringify(programs, null, 2));
    break;

  case 'discover':
    const newOnly = args.includes('--new');
    await discoverPrograms({ newOnly });
    break;

  case 'scope':
    if (!args[1]) {
      console.error('Usage: bun run api.ts scope <handle>');
      process.exit(1);
    }
    await fetchScope(args[1]);
    break;

  default:
    console.log(`
HackerOne API Client

Commands:
  program <handle>    Fetch single program details
  list                List all accessible programs (JSON)
  discover [--new]    Find programs with scope (human-readable)
  scope <handle>      Fetch detailed scope for a program

Examples:
  bun run api.ts program crypto
  bun run api.ts discover --new
  bun run api.ts scope yahoo
`);
}
