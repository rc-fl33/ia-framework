#!/usr/bin/env bun
/**
 * Bounty Scope Parser
 *
 * Parses bug bounty program data from 5 platforms (HackerOne, Bugcrowd,
 * Intigriti, YesWeHack, Federacy) into a common normalized schema.
 *
 * Usage:
 *   bun run bounty-scope-parser.ts --platform hackerone --program "HackerOne"
 *   bun run bounty-scope-parser.ts --platform bugcrowd --program "LastPass" --fuzzy
 *   bun run bounty-scope-parser.ts --platform yeswehack --program "spacelift" --data-dir ~/custom-data
 */

import { parseArgs } from "util";
import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Platform =
  | "hackerone"
  | "bugcrowd"
  | "intigriti"
  | "yeswehack"
  | "federacy";

export interface ParsedBountyScope {
  programName: string;
  platform: Platform;
  handle: string;
  url: string;
  state: string;
  safeHarbor?: string;

  inScopeAssets: Array<{
    type: string;
    target: string;
    uri?: string;
    maxSeverity?: string;
    eligibleForBounty: boolean;
    instruction?: string;
  }>;

  outOfScopeAssets: Array<{
    type: string;
    target: string;
  }>;

  credentials?: string;
  focusAreas: string[];
  outOfScopeVulns: string[];
  rewardTiers: Array<{ severity: string; min?: number; max?: number }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_PLATFORMS: Platform[] = [
  "hackerone",
  "bugcrowd",
  "intigriti",
  "yeswehack",
  "federacy",
];

function stderr(msg: string): void {
  process.stderr.write(msg + "\n");
}

function loadJson(filePath: string): unknown {
  if (!existsSync(filePath)) {
    stderr(`Error: File not found: ${filePath}`);
    stderr(
      "The data file may be missing if the repository was partially cloned or data hasn't been scraped yet."
    );
    process.exit(2);
  }
  try {
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    stderr(
      `Error: Failed to parse JSON from ${filePath}: ${err instanceof Error ? err.message : err}`
    );
    process.exit(2);
  }
}

/**
 * Score a candidate name/handle against a query for fuzzy ranking.
 * Returns 0 for no match, higher is better.
 */
function fuzzyScore(query: string, candidate: string): number {
  const q = query.toLowerCase();
  const c = candidate.toLowerCase();

  // Exact match
  if (c === q) return 1000;

  // Starts with query
  if (c.startsWith(q)) return 500 + (q.length / c.length) * 100;

  // Contains query as substring
  const idx = c.indexOf(q);
  if (idx >= 0) return 300 + (q.length / c.length) * 100;

  // Tokenized containment: all query words appear in candidate
  const qWords = q.split(/[\s\-_]+/).filter(Boolean);
  const matchedAll = qWords.every((w) => c.includes(w));
  if (matchedAll) return 200 + (q.length / c.length) * 50;

  // Partial token overlap
  const matchedCount = qWords.filter((w) => c.includes(w)).length;
  if (matchedCount > 0) return (matchedCount / qWords.length) * 100;

  return 0;
}

interface FuzzyMatch {
  name: string;
  handle: string;
  score: number;
}

function showFuzzyResults(matches: FuzzyMatch[], platform: Platform): void {
  if (matches.length === 0) {
    stderr(`No programs found on ${platform} matching that query.`);
  } else {
    stderr(`Did you mean one of these programs on ${platform}?`);
    stderr("");
    for (const m of matches.slice(0, 5)) {
      stderr(`  ${m.name}  (handle: ${m.handle})`);
    }
  }
}

/** Extract a handle from a URL path (last segment). */
function handleFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const segments = u.pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] || "";
  } catch {
    // Fallback: last path segment
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  }
}

/** Safely extract a number or undefined from a bounty value object or number. */
function bountyNum(val: unknown): number | undefined {
  if (val === null || val === undefined) return undefined;
  if (typeof val === "number") return val > 0 ? val : undefined;
  if (typeof val === "object" && val !== null && "value" in val) {
    const v = (val as { value: number }).value;
    return v > 0 ? v : undefined;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Platform Parsers
// ---------------------------------------------------------------------------

function parseHackerOne(
  program: string,
  dataDir: string,
  fuzzy: boolean
): ParsedBountyScope | null {
  const programsPath = join(dataDir, "hackerone", "programs-latest.json");
  const targetsPath = join(dataDir, "hackerone", "targets-latest.json");

  const programs = loadJson(programsPath) as any[];
  const targets = loadJson(targetsPath) as any[];

  // Build a targets lookup by handle for the join
  const targetsMap = new Map<string, any>();
  for (const t of targets) {
    if (t.handle) targetsMap.set(t.handle.toLowerCase(), t);
  }

  // Find program: try exact match on handle first, then name
  const query = program.toLowerCase();
  let match = programs.find(
    (p: any) => p.handle?.toLowerCase() === query || p.name?.toLowerCase() === query
  );

  if (!match && fuzzy) {
    return hackerOneFuzzy(programs, program);
  }

  if (!match) {
    // Auto-fuzzy on miss
    stderr(`Program "${program}" not found on HackerOne (exact match).`);
    stderr("");
    hackerOneFuzzy(programs, program);
    process.exit(1);
  }

  // Join with targets data for richer target info
  const targetData = targetsMap.get(match.handle?.toLowerCase());

  // Prefer targets from the targets file (richer), fall back to programs file
  const inScopeRaw =
    targetData?.targets?.in_scope || match.targets?.in_scope || [];
  const outOfScopeRaw =
    targetData?.targets?.out_of_scope || match.targets?.out_of_scope || [];

  return {
    programName: match.name || "",
    platform: "hackerone",
    handle: match.handle || "",
    url: match.url || "",
    state: match.state || match.submission_state || "",
    safeHarbor: match.safe_harbor || undefined,

    inScopeAssets: inScopeRaw.map((a: any) => ({
      type: a.type || "other",
      target: a.target || "",
      uri: a.uri || undefined,
      maxSeverity: a.max_severity || undefined,
      eligibleForBounty: a.eligible_for_bounty ?? false,
      instruction: a.instruction || a.description || undefined,
    })),

    outOfScopeAssets: outOfScopeRaw.map((a: any) => ({
      type: a.type || "other",
      target: a.target || "",
    })),

    credentials: match.credentials || undefined,
    focusAreas: Array.isArray(match.focus_areas) ? match.focus_areas : [],
    outOfScopeVulns: match.scope_descriptions?.out_of_scope_vulns || [],

    rewardTiers: (match.reward_tiers || []).map((t: any) => ({
      severity: t.severity || "",
      min: bountyNum(t.min),
      max: bountyNum(t.max),
    })),
  };
}

function hackerOneFuzzy(programs: any[], query: string): null {
  const scored: FuzzyMatch[] = programs
    .map((p: any) => ({
      name: p.name || "",
      handle: p.handle || "",
      score: Math.max(
        fuzzyScore(query, p.name || ""),
        fuzzyScore(query, p.handle || "")
      ),
    }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  showFuzzyResults(scored, "hackerone");
  return null;
}

function parseBugcrowd(
  program: string,
  dataDir: string,
  fuzzy: boolean
): ParsedBountyScope | null {
  const filePath = join(dataDir, "bugcrowd", "programs-latest.json");
  const programs = loadJson(filePath) as any[];

  const query = program.toLowerCase();

  // Bugcrowd has no explicit handle field; derive from URL
  let match = programs.find((p: any) => {
    const h = handleFromUrl(p.url || "");
    return (
      h.toLowerCase() === query ||
      p.name?.toLowerCase() === query
    );
  });

  if (!match && fuzzy) {
    return bugcrowdFuzzy(programs, program);
  }

  if (!match) {
    stderr(`Program "${program}" not found on Bugcrowd (exact match).`);
    stderr("");
    bugcrowdFuzzy(programs, program);
    process.exit(1);
  }

  const handle = handleFromUrl(match.url || "");
  const inScopeRaw = match.targets?.in_scope || [];
  const outOfScopeRaw = match.targets?.out_of_scope || [];

  return {
    programName: match.name || "",
    platform: "bugcrowd",
    handle,
    url: match.url || "",
    state: match.allows_disclosure != null
      ? match.allows_disclosure
        ? "open"
        : "closed"
      : "unknown",
    safeHarbor: match.safe_harbor || undefined,

    inScopeAssets: inScopeRaw.map((a: any) => ({
      type: a.type || "other",
      target: a.target || "",
      uri: a.uri || undefined,
      maxSeverity: undefined,
      eligibleForBounty: true, // Bugcrowd in-scope assets default eligible
      instruction: undefined,
    })),

    outOfScopeAssets: outOfScopeRaw.map((a: any) => ({
      type: a.type || "other",
      target: a.target || "",
    })),

    credentials: match.credentials || undefined,
    focusAreas: Array.isArray(match.focus_areas) ? match.focus_areas : [],
    outOfScopeVulns: match.scope_descriptions?.out_of_scope_vulns || [],

    rewardTiers: (match.reward_tiers || []).map((t: any) => ({
      severity: t.severity || "",
      min: bountyNum(t.min),
      max: bountyNum(t.max),
    })),
  };
}

function bugcrowdFuzzy(programs: any[], query: string): null {
  const scored: FuzzyMatch[] = programs
    .map((p: any) => {
      const h = handleFromUrl(p.url || "");
      return {
        name: p.name || "",
        handle: h,
        score: Math.max(fuzzyScore(query, p.name || ""), fuzzyScore(query, h)),
      };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  showFuzzyResults(scored, "bugcrowd");
  return null;
}

function parseIntigriti(
  program: string,
  dataDir: string,
  fuzzy: boolean
): ParsedBountyScope | null {
  const filePath = join(dataDir, "intigriti", "programs-latest.json");
  const programs = loadJson(filePath) as any[];

  const query = program.toLowerCase();

  let match = programs.find(
    (p: any) =>
      p.handle?.toLowerCase() === query ||
      p.name?.toLowerCase() === query ||
      p.company_handle?.toLowerCase() === query
  );

  if (!match && fuzzy) {
    return intigritiFuzzy(programs, program);
  }

  if (!match) {
    stderr(`Program "${program}" not found on Intigriti (exact match).`);
    stderr("");
    intigritiFuzzy(programs, program);
    process.exit(1);
  }

  const inScopeRaw = match.targets?.in_scope || [];
  const outOfScopeRaw = match.targets?.out_of_scope || [];

  return {
    programName: match.name || "",
    platform: "intigriti",
    handle: match.handle || "",
    url: match.url || "",
    state: match.status || "",
    safeHarbor: match.safe_harbor || undefined,

    inScopeAssets: inScopeRaw.map((a: any) => ({
      type: a.type || "other",
      target: a.target || "",
      uri: undefined,
      maxSeverity: undefined,
      eligibleForBounty: a.tier ? !a.tier.toLowerCase().includes("no bounty") : false,
      instruction: a.description || undefined,
    })),

    outOfScopeAssets: outOfScopeRaw.map((a: any) => ({
      type: a.type || "other",
      target: a.target || "",
    })),

    credentials: match.credentials || undefined,
    focusAreas: Array.isArray(match.focus_areas) ? match.focus_areas : [],
    outOfScopeVulns: match.scope_descriptions?.out_of_scope_vulns || [],

    rewardTiers: (match.reward_tiers || []).map((t: any) => ({
      severity: t.severity || "",
      min: bountyNum(t.min),
      max: bountyNum(t.max),
    })),
  };
}

function intigritiFuzzy(programs: any[], query: string): null {
  const scored: FuzzyMatch[] = programs
    .map((p: any) => ({
      name: p.name || "",
      handle: p.handle || "",
      score: Math.max(
        fuzzyScore(query, p.name || ""),
        fuzzyScore(query, p.handle || ""),
        fuzzyScore(query, p.company_handle || "")
      ),
    }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  showFuzzyResults(scored, "intigriti");
  return null;
}

function parseYesWeHack(
  program: string,
  dataDir: string,
  fuzzy: boolean
): ParsedBountyScope | null {
  const filePath = join(dataDir, "data", "yeswehack_data.json");
  const programs = loadJson(filePath) as any[];

  const query = program.toLowerCase();

  let match = programs.find(
    (p: any) =>
      p.slug?.toLowerCase() === query ||
      p.name?.toLowerCase() === query ||
      p.title?.toLowerCase() === query
  );

  if (!match && fuzzy) {
    return yesWeHackFuzzy(programs, program);
  }

  if (!match) {
    stderr(`Program "${program}" not found on YesWeHack (exact match).`);
    stderr("");
    yesWeHackFuzzy(programs, program);
    process.exit(1);
  }

  const inScopeRaw = match.targets?.in_scope || [];
  const outOfScopeRaw = match.targets?.out_of_scope || [];

  // Build reward tiers from min/max bounty if no explicit tiers
  const rewardTiers: Array<{ severity: string; min?: number; max?: number }> =
    [];
  const minB = bountyNum(match.min_bounty);
  const maxB = bountyNum(match.max_bounty);
  if (minB !== undefined || maxB !== undefined) {
    rewardTiers.push({ severity: "range", min: minB, max: maxB });
  }

  return {
    programName: match.name || match.title || "",
    platform: "yeswehack",
    handle: match.slug || "",
    url: match.url || "",
    state: match.status || "",
    safeHarbor: undefined,

    inScopeAssets: inScopeRaw.map((a: any) => ({
      type: a.type || a.scope_type || "other",
      target: a.target || a.scope || "",
      uri: a.scope && a.scope.startsWith("http") ? a.scope : undefined,
      maxSeverity: a.asset_value || undefined,
      eligibleForBounty: match.bounty_enabled ?? false,
      instruction: undefined,
    })),

    outOfScopeAssets: outOfScopeRaw.map((a: any) => ({
      type: a.type || a.scope_type || "other",
      target: a.target || a.scope || "",
    })),

    credentials: undefined,
    focusAreas: [],
    outOfScopeVulns: [],
    rewardTiers,
  };
}

function yesWeHackFuzzy(programs: any[], query: string): null {
  const scored: FuzzyMatch[] = programs
    .map((p: any) => ({
      name: p.name || p.title || "",
      handle: p.slug || "",
      score: Math.max(
        fuzzyScore(query, p.name || ""),
        fuzzyScore(query, p.slug || ""),
        fuzzyScore(query, p.title || "")
      ),
    }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  showFuzzyResults(scored, "yeswehack");
  return null;
}

function parseFederacy(
  program: string,
  dataDir: string,
  fuzzy: boolean
): ParsedBountyScope | null {
  const filePath = join(dataDir, "data", "federacy_data.json");
  const programs = loadJson(filePath) as any[];

  const query = program.toLowerCase();

  let match = programs.find(
    (p: any) =>
      p.slug?.toLowerCase() === query ||
      p.name?.toLowerCase() === query ||
      p.program_name?.toLowerCase() === query
  );

  if (!match && fuzzy) {
    return federacyFuzzy(programs, program);
  }

  if (!match) {
    stderr(`Program "${program}" not found on Federacy (exact match).`);
    stderr("");
    federacyFuzzy(programs, program);
    process.exit(1);
  }

  const inScopeRaw = match.targets?.in_scope || [];
  const outOfScopeRaw = match.targets?.out_of_scope || [];

  // Build reward tiers from award fields
  const rewardTiers: Array<{ severity: string; min?: number; max?: number }> =
    [];
  const awardFields: Array<{ key: string; severity: string }> = [
    { key: "award_critical", severity: "critical" },
    { key: "award_high", severity: "high" },
    { key: "award_medium", severity: "medium" },
    { key: "award_low", severity: "low" },
  ];
  for (const { key, severity } of awardFields) {
    const val = match[key];
    if (val != null && val > 0) {
      // Federacy stores awards in cents
      rewardTiers.push({ severity, max: val / 100 });
    }
  }

  return {
    programName: match.name || match.program_name || "",
    platform: "federacy",
    handle: match.slug || "",
    url: match.url || "",
    state: match.public ? "public" : "private",
    safeHarbor: undefined,

    inScopeAssets: inScopeRaw.map((a: any) => ({
      type: a.type || a.scope_type || "other",
      target: a.target || a.identifier || "",
      uri: undefined,
      maxSeverity: a.impact || undefined,
      eligibleForBounty: a.bounty === "money",
      instruction: undefined,
    })),

    outOfScopeAssets: outOfScopeRaw.map((a: any) => ({
      type: a.type || a.scope_type || "other",
      target: a.target || a.identifier || "",
    })),

    credentials: undefined,
    focusAreas: [],
    outOfScopeVulns: [],
    rewardTiers,
  };
}

function federacyFuzzy(programs: any[], query: string): null {
  const scored: FuzzyMatch[] = programs
    .map((p: any) => ({
      name: p.name || p.program_name || "",
      handle: p.slug || "",
      score: Math.max(
        fuzzyScore(query, p.name || ""),
        fuzzyScore(query, p.slug || ""),
        fuzzyScore(query, p.program_name || "")
      ),
    }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  showFuzzyResults(scored, "federacy");
  return null;
}

// ---------------------------------------------------------------------------
// Exported API
// ---------------------------------------------------------------------------

/**
 * Parse a bounty program scope from a given platform.
 *
 * @param platform - The bug bounty platform
 * @param program  - Program name or handle to search for
 * @param options  - Optional: fuzzy search, custom data directory
 * @returns ParsedBountyScope or null if not found (with stderr output)
 */
export function parseBountyScope(
  platform: Platform,
  program: string,
  options?: { fuzzy?: boolean; dataDir?: string }
): ParsedBountyScope | null {
  const dataDir =
    options?.dataDir ||
    join(process.env.HOME || "~", "ia-framework-targets-data");
  const fuzzy = options?.fuzzy ?? false;

  if (!existsSync(dataDir)) {
    stderr(`Data directory not found: ${dataDir}`);
    stderr("Auto-cloning public bounty-targets-data repository...");
    try {
      execSync(
        `git clone https://github.com/arkadiyt/bounty-targets-data.git ${dataDir}`,
        { stdio: "inherit" }
      );
      stderr("Clone complete.");
    } catch {
      stderr("Error: Failed to clone bounty-targets-data repository.");
      stderr("Manual clone:");
      stderr(
        `  git clone https://github.com/arkadiyt/bounty-targets-data.git ${dataDir}`
      );
      return null;
    }
  }

  switch (platform) {
    case "hackerone":
      return parseHackerOne(program, dataDir, fuzzy);
    case "bugcrowd":
      return parseBugcrowd(program, dataDir, fuzzy);
    case "intigriti":
      return parseIntigriti(program, dataDir, fuzzy);
    case "yeswehack":
      return parseYesWeHack(program, dataDir, fuzzy);
    case "federacy":
      return parseFederacy(program, dataDir, fuzzy);
    default:
      stderr(`Error: Unknown platform "${platform}".`);
      stderr(`Valid platforms: ${VALID_PLATFORMS.join(", ")}`);
      return null;
  }
}

export type { ParsedBountyScope as ParsedBountyScopeType };

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function printUsage(): void {
  console.log(`
Bounty Scope Parser - Parse bug bounty programs into a normalized schema

Usage:
  bun run bounty-scope-parser.ts --platform <platform> --program "<name>" [options]

Options:
  --platform <name>     Platform: hackerone, bugcrowd, intigriti, yeswehack, federacy
  --program <name>      Program name or handle to look up
  --fuzzy               Enable fuzzy search (show top 5 matches and exit)
  --data-dir <path>     Data directory (default: ~/ia-framework-targets-data)
  --help                Show this help message

Examples:
  bun run bounty-scope-parser.ts --platform hackerone --program "security"
  bun run bounty-scope-parser.ts --platform bugcrowd --program "LastPass" --fuzzy
  bun run bounty-scope-parser.ts --platform yeswehack --program "spacelift" --fuzzy

Exit Codes:
  0  Success (JSON output on stdout)
  1  Program not found
  2  Parse error or missing data
`);
}

// Only run CLI when executed directly (not imported)
const isDirectExecution =
  typeof Bun !== "undefined"
    ? Bun.main === import.meta.path
    : process.argv[1] &&
      (process.argv[1] === import.meta.url.replace("file://", "") ||
        process.argv[1].endsWith("bounty-scope-parser.ts"));

if (isDirectExecution) {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      platform: { type: "string" },
      program: { type: "string" },
      fuzzy: { type: "boolean", default: false },
      "data-dir": { type: "string" },
      help: { type: "boolean", short: "h", default: false },
    },
    strict: true,
  });

  if (values.help) {
    printUsage();
    process.exit(0);
  }

  if (!values.platform) {
    stderr("Error: --platform is required.");
    stderr(`Valid platforms: ${VALID_PLATFORMS.join(", ")}`);
    process.exit(2);
  }

  if (!VALID_PLATFORMS.includes(values.platform as Platform)) {
    stderr(`Error: Invalid platform "${values.platform}".`);
    stderr(`Valid platforms: ${VALID_PLATFORMS.join(", ")}`);
    process.exit(2);
  }

  if (!values.program) {
    stderr("Error: --program is required.");
    stderr('Example: --program "HackerOne"');
    process.exit(2);
  }

  const result = parseBountyScope(
    values.platform as Platform,
    values.program as string,
    {
      fuzzy: values.fuzzy as boolean,
      dataDir: values["data-dir"] as string | undefined,
    }
  );

  if (result) {
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } else {
    // Fuzzy mode or not-found already printed to stderr
    process.exit(1);
  }
}
