#!/usr/bin/env bun
/**
 * Bounty Scope Parser - Public Data Edition
 *
 * Parses bug bounty program data from the public arkadiyt/bounty-targets-data
 * repository (https://github.com/arkadiyt/bounty-targets-data) for 5 platforms:
 * HackerOne, Bugcrowd, Intigriti, YesWeHack, Federacy
 *
 * This version fetches directly from GitHub instead of requiring local scrapers.
 *
 * Usage:
 *   bun run bounty-scope-parser-public.ts --platform hackerone --program "Shopify"
 *   bun run bounty-scope-parser-public.ts --platform bugcrowd --program "Microsoft" --fuzzy
 */

import { parseArgs } from "util";

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

const VALID_PLATFORMS: Platform[] = [
  "hackerone",
  "bugcrowd",
  "intigriti",
  "yeswehack",
  "federacy",
];

const PUBLIC_DATA_REPO =
  "https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/main/data";

function stderr(msg: string): void {
  process.stderr.write(msg + "\n");
}

/**
 * Fetch JSON data from the public repository
 */
async function fetchPublicData(fileName: string): Promise<unknown[]> {
  const url = `${PUBLIC_DATA_REPO}/${fileName}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as unknown[];
  } catch (err) {
    stderr(
      `Error: Failed to fetch ${fileName} from ${PUBLIC_DATA_REPO}: ${err instanceof Error ? err.message : err}`
    );
    process.exit(2);
  }
}

function fuzzyScore(query: string, candidate: string): number {
  const q = query.toLowerCase();
  const c = candidate.toLowerCase();

  if (c === q) return 1000;
  if (c.startsWith(q)) return 500 + (q.length / c.length) * 100;

  const idx = c.indexOf(q);
  if (idx >= 0) return 300 + (q.length / c.length) * 100;

  const qWords = q.split(/[\s\-_]+/).filter(Boolean);
  const matchedAll = qWords.every((w) => c.includes(w));
  if (matchedAll) return 200 + (q.length / c.length) * 50;

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

async function parseHackerOne(
  program: string,
  fuzzy: boolean
): Promise<ParsedBountyScope | null> {
  const programs = await fetchPublicData("hackerone_data.json");

  const query = program.toLowerCase();
  let match = programs.find(
    (p: any) =>
      p.handle?.toLowerCase() === query || p.name?.toLowerCase() === query
  );

  if (!match && fuzzy) {
    const scored: FuzzyMatch[] = programs
      .map((p: any) => ({
        name: p.name || "",
        handle: p.handle || "",
        score: fuzzyScore(query, (p.name || "") + " " + (p.handle || "")),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    showFuzzyResults(scored, "hackerone");
    return null;
  }

  if (!match) {
    stderr(`Program "${program}" not found on HackerOne (exact match).`);
    stderr("");

    const scored: FuzzyMatch[] = programs
      .map((p: any) => ({
        name: p.name || "",
        handle: p.handle || "",
        score: fuzzyScore(query, (p.name || "") + " " + (p.handle || "")),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    showFuzzyResults(scored, "hackerone");
    process.exit(1);
  }

  const inScopeRaw = match.targets?.in_scope || [];
  const outOfScopeRaw = match.targets?.out_of_scope || [];

  return {
    programName: match.name || "",
    platform: "hackerone",
    handle: match.handle || "",
    url: match.url || "",
    state: match.submission_state || "unknown",
    safeHarbor: match.safe_harbor || undefined,

    inScopeAssets: inScopeRaw.map((a: any) => ({
      type: a.type || "other",
      target: a.target || "",
      uri: a.uri || undefined,
      maxSeverity: a.max_severity || undefined,
      eligibleForBounty: a.eligible_for_bounty ?? false,
      instruction: a.instruction || undefined,
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
      min: typeof t.min === "number" && t.min > 0 ? t.min : undefined,
      max: typeof t.max === "number" && t.max > 0 ? t.max : undefined,
    })),
  };
}

async function parseBugcrowd(
  program: string,
  fuzzy: boolean
): Promise<ParsedBountyScope | null> {
  const programs = await fetchPublicData("bugcrowd_data.json");

  const query = program.toLowerCase();
  let match = programs.find((p: any) =>
    (p.name || "").toLowerCase().includes(query)
  );

  if (!match && fuzzy) {
    const scored: FuzzyMatch[] = programs
      .map((p: any) => ({
        name: p.name || "",
        handle: p.url?.split("/").pop() || "",
        score: fuzzyScore(query, p.name || ""),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    showFuzzyResults(scored, "bugcrowd");
    return null;
  }

  if (!match) {
    stderr(`Program "${program}" not found on Bugcrowd (exact match).`);
    stderr("");

    const scored: FuzzyMatch[] = programs
      .map((p: any) => ({
        name: p.name || "",
        handle: p.url?.split("/").pop() || "",
        score: fuzzyScore(query, p.name || ""),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    showFuzzyResults(scored, "bugcrowd");
    process.exit(1);
  }

  const inScopeRaw = match.targets?.in_scope || [];
  const outOfScopeRaw = match.targets?.out_of_scope || [];

  return {
    programName: match.name || "",
    platform: "bugcrowd",
    handle: match.url?.split("/").pop() || "",
    url: match.url || "",
    state: match.max_payout ? "open" : "closed",
    safeHarbor: match.safe_harbor || undefined,

    inScopeAssets: inScopeRaw.map((a: any) => ({
      type: a.type || "website",
      target: a.target || a.uri || "",
      uri: a.uri || a.target || undefined,
      maxSeverity: undefined,
      eligibleForBounty: (match.max_payout || 0) > 0,
      instruction: a.name || undefined,
    })),

    outOfScopeAssets: outOfScopeRaw.map((a: any) => ({
      type: a.type || "website",
      target: a.target || a.uri || "",
    })),

    credentials: undefined,
    focusAreas: [],
    outOfScopeVulns: [],

    rewardTiers: match.max_payout
      ? [
          {
            severity: "All",
            min: undefined,
            max: match.max_payout,
          },
        ]
      : [],
  };
}

async function parseIntigriti(
  program: string,
  fuzzy: boolean
): Promise<ParsedBountyScope | null> {
  const programs = await fetchPublicData("intigriti_data.json");

  const query = program.toLowerCase();
  let match = programs.find(
    (p: any) =>
      p.handle?.toLowerCase() === query || p.name?.toLowerCase() === query
  );

  if (!match && fuzzy) {
    const scored: FuzzyMatch[] = programs
      .map((p: any) => ({
        name: p.name || "",
        handle: p.handle || "",
        score: fuzzyScore(query, (p.name || "") + " " + (p.handle || "")),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    showFuzzyResults(scored, "intigriti");
    return null;
  }

  if (!match) {
    stderr(`Program "${program}" not found on Intigriti (exact match).`);
    stderr("");

    const scored: FuzzyMatch[] = programs
      .map((p: any) => ({
        name: p.name || "",
        handle: p.handle || "",
        score: fuzzyScore(query, (p.name || "") + " " + (p.handle || "")),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    showFuzzyResults(scored, "intigriti");
    process.exit(1);
  }

  const inScopeRaw = match.targets?.in_scope || [];
  const outOfScopeRaw = match.targets?.out_of_scope || [];

  return {
    programName: match.name || "",
    platform: "intigriti",
    handle: match.handle || "",
    url: match.url || "",
    state: match.submission_state || "unknown",
    safeHarbor: match.safe_harbor || undefined,

    inScopeAssets: inScopeRaw.map((a: any) => ({
      type: a.type || "other",
      target: a.target || "",
      uri: a.uri || undefined,
      maxSeverity: a.max_severity || undefined,
      eligibleForBounty: a.eligible_for_bounty ?? false,
      instruction: a.instruction || undefined,
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
      min: typeof t.min === "number" && t.min > 0 ? t.min : undefined,
      max: typeof t.max === "number" && t.max > 0 ? t.max : undefined,
    })),
  };
}

async function parseYesWeHack(
  program: string,
  fuzzy: boolean
): Promise<ParsedBountyScope | null> {
  const programs = await fetchPublicData("yeswehack_data.json");

  const query = program.toLowerCase();
  let match = programs.find((p: any) =>
    (p.name || "").toLowerCase().includes(query)
  );

  if (!match && fuzzy) {
    const scored: FuzzyMatch[] = programs
      .map((p: any) => ({
        name: p.name || "",
        handle: p.slug || "",
        score: fuzzyScore(query, p.name || ""),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    showFuzzyResults(scored, "yeswehack");
    return null;
  }

  if (!match) {
    stderr(`Program "${program}" not found on YesWeHack (exact match).`);
    stderr("");

    const scored: FuzzyMatch[] = programs
      .map((p: any) => ({
        name: p.name || "",
        handle: p.slug || "",
        score: fuzzyScore(query, p.name || ""),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    showFuzzyResults(scored, "yeswehack");
    process.exit(1);
  }

  const inScopeRaw = match.targets?.in_scope || [];
  const outOfScopeRaw = match.targets?.out_of_scope || [];

  return {
    programName: match.name || "",
    platform: "yeswehack",
    handle: match.slug || "",
    url: match.url || "",
    state: match.state || "unknown",
    safeHarbor: undefined,

    inScopeAssets: inScopeRaw.map((a: any) => ({
      type: a.type || "website",
      target: a.target || "",
      uri: undefined,
      maxSeverity: undefined,
      eligibleForBounty: true,
      instruction: undefined,
    })),

    outOfScopeAssets: outOfScopeRaw.map((a: any) => ({
      type: a.type || "website",
      target: a.target || "",
    })),

    credentials: undefined,
    focusAreas: [],
    outOfScopeVulns: [],

    rewardTiers: match.max_payout
      ? [
          {
            severity: "All",
            min: undefined,
            max: match.max_payout,
          },
        ]
      : [],
  };
}

async function parseFederacy(
  program: string,
  fuzzy: boolean
): Promise<ParsedBountyScope | null> {
  const programs = await fetchPublicData("federacy_data.json");

  const query = program.toLowerCase();
  let match = programs.find((p: any) =>
    (p.name || "").toLowerCase().includes(query)
  );

  if (!match && fuzzy) {
    const scored: FuzzyMatch[] = programs
      .map((p: any) => ({
        name: p.name || "",
        handle: p.slug || "",
        score: fuzzyScore(query, p.name || ""),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    showFuzzyResults(scored, "federacy");
    return null;
  }

  if (!match) {
    stderr(`Program "${program}" not found on Federacy (exact match).`);
    stderr("");

    const scored: FuzzyMatch[] = programs
      .map((p: any) => ({
        name: p.name || "",
        handle: p.slug || "",
        score: fuzzyScore(query, p.name || ""),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    showFuzzyResults(scored, "federacy");
    process.exit(1);
  }

  const inScopeRaw = match.targets?.in_scope || [];
  const outOfScopeRaw = match.targets?.out_of_scope || [];

  return {
    programName: match.name || "",
    platform: "federacy",
    handle: match.slug || "",
    url: match.url || "",
    state: match.state || "unknown",
    safeHarbor: undefined,

    inScopeAssets: inScopeRaw.map((a: any) => ({
      type: a.type || "website",
      target: a.target || "",
      uri: undefined,
      maxSeverity: undefined,
      eligibleForBounty: true,
      instruction: undefined,
    })),

    outOfScopeAssets: outOfScopeRaw.map((a: any) => ({
      type: a.type || "website",
      target: a.target || "",
    })),

    credentials: undefined,
    focusAreas: [],
    outOfScopeVulns: [],

    rewardTiers: match.max_payout
      ? [
          {
            severity: "All",
            min: undefined,
            max: match.max_payout,
          },
        ]
      : [],
  };
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      platform: {
        type: "string",
        short: "p",
      },
      program: {
        type: "string",
        short: "P",
      },
      fuzzy: {
        type: "boolean",
        short: "f",
        default: false,
      },
      help: {
        type: "boolean",
        short: "h",
        default: false,
      },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(`
Bounty Scope Parser - Public Data Edition

Parse bug bounty programs from arkadiyt/bounty-targets-data

Usage:
  bun run bounty-scope-parser-public.ts --platform <platform> --program "<name>"

Options:
  -p, --platform <platform>   Platform (hackerone, bugcrowd, intigriti, yeswehack, federacy)
  -pr, --program <name>       Program name or handle to search for
  -f, --fuzzy                 Enable fuzzy matching
  -h, --help                  Show this help message

Examples:
  bun run bounty-scope-parser-public.ts --platform hackerone --program "Shopify"
  bun run bounty-scope-parser-public.ts --platform bugcrowd --program "Microsoft" --fuzzy

Data Source:
  https://github.com/arkadiyt/bounty-targets-data
`);
    process.exit(0);
  }

  const platform = values.platform as string | undefined;
  const program = values.program as string | undefined;
  const fuzzy = values.fuzzy as boolean;

  if (!platform || !program) {
    stderr("Error: --platform and --program are required");
    process.exit(1);
  }

  if (!VALID_PLATFORMS.includes(platform as Platform)) {
    stderr(`Error: Invalid platform: ${platform}`);
    stderr(`Valid platforms: ${VALID_PLATFORMS.join(", ")}`);
    process.exit(1);
  }

  let result: ParsedBountyScope | null = null;

  switch (platform) {
    case "hackerone":
      result = await parseHackerOne(program, fuzzy);
      break;
    case "bugcrowd":
      result = await parseBugcrowd(program, fuzzy);
      break;
    case "intigriti":
      result = await parseIntigriti(program, fuzzy);
      break;
    case "yeswehack":
      result = await parseYesWeHack(program, fuzzy);
      break;
    case "federacy":
      result = await parseFederacy(program, fuzzy);
      break;
  }

  if (result) {
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main().catch((err) => {
  stderr(`Fatal error: ${err instanceof Error ? err.message : err}`);
  process.exit(2);
});
