#!/usr/bin/env bun
/**
 * Bounty Targets Sync CLI (ARCHIVED)
 *
 * DEPRECATED: This tool is no longer used.
 * It previously synced custom VPS-based scrapers to a git repository.
 *
 * REPLACEMENT: Use bounty-scope-parser-public.ts instead, which fetches
 * data directly from https://github.com/arkadiyt/bounty-targets-data
 *
 * Kept for reference only. Do not use in new code.
 */

import { parseArgs } from 'util';
import * as path from 'path';
import { runScan } from './bounty-targets';
import type { Platform } from './bounty-targets/types';

// Parse command-line arguments
const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    platforms: {
      type: 'string',
      short: 'p',
      default: 'bugcrowd,hackerone',
    },
    'output-dir': {
      type: 'string',
      short: 'o',
      default: path.join(process.cwd(), 'private/output/bug-bounty/bounty-targets-data/data'),
    },
    'git-repo': {
      type: 'string',
      short: 'r',
    },
    'git-ssh-key': {
      type: 'string',
      short: 'k',
    },
    'no-push': {
      type: 'boolean',
      default: false,
    },
    help: {
      type: 'boolean',
      short: 'h',
      default: false,
    },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`
Bounty Targets Sync - Scrape bug bounty programs from multiple platforms

Usage:
  bun run bounty-targets-sync.ts [options]

Options:
  -p, --platforms <platforms>    Comma-separated list of platforms to scrape
                                 (default: bugcrowd,hackerone)
                                 Available: bugcrowd, hackerone, intigriti, yeswehack, federacy

  -o, --output-dir <path>        Output directory for data files
                                 (default: private/output/bug-bounty/bounty-targets-data/data)

  -r, --git-repo <url>          Git repository URL for pushing data
                                 (e.g., git@github.com:user/bounty-targets-data.git)

  -k, --git-ssh-key <path>      Path to SSH private key for git push
                                 (default: ~/.ssh/id_rsa)

  --no-push                      Don't push to git repository (local only)

  -h, --help                     Show this help message

Examples:
  # Scrape all platforms and save locally
  bun run bounty-targets-sync.ts

  # Scrape specific platforms
  bun run bounty-targets-sync.ts -p bugcrowd,hackerone

  # Scrape and push to git
  bun run bounty-targets-sync.ts -r git@github.com:user/repo.git -k ~/.ssh/deploy_key

  # Scrape without pushing
  bun run bounty-targets-sync.ts --no-push

Environment Variables:
  BOUNTY_TARGETS_GIT_REPO       Git repository URL (alternative to --git-repo)
  BOUNTY_TARGETS_SSH_KEY_PATH   SSH key path (alternative to --git-ssh-key)
  BOUNTY_TARGETS_OUTPUT_DIR     Output directory (alternative to --output-dir)
`);
  process.exit(0);
}

// Parse platforms
const platformsStr = values.platforms as string;
const platforms = platformsStr.split(',').map((p) => p.trim()) as Platform[];

// Validate platforms
const validPlatforms: Platform[] = ['bugcrowd', 'hackerone', 'intigriti', 'yeswehack', 'federacy'];
const invalidPlatforms = platforms.filter((p) => !validPlatforms.includes(p));
if (invalidPlatforms.length > 0) {
  console.error(`Error: Invalid platforms: ${invalidPlatforms.join(', ')}`);
  console.error(`Valid platforms: ${validPlatforms.join(', ')}`);
  process.exit(1);
}

// Get configuration from args or environment
const outputDir = (values['output-dir'] as string) || process.env.BOUNTY_TARGETS_OUTPUT_DIR;
const gitRepo = (values['git-repo'] as string) || process.env.BOUNTY_TARGETS_GIT_REPO;
const gitSshKeyPath =
  (values['git-ssh-key'] as string) ||
  process.env.BOUNTY_TARGETS_SSH_KEY_PATH ||
  path.join(process.env.HOME || '~', '.ssh/id_rsa');
const noPush = values['no-push'] as boolean;

if (!outputDir) {
  console.error('Error: Output directory not specified');
  process.exit(1);
}

// Run scan
console.log('Bounty Targets Sync');
console.log('===================\n');

const startTime = Date.now();

try {
  const results = await runScan({
    platforms,
    outputDir,
    gitRepo,
    gitSshKeyPath,
    noPush,
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n===================');
  console.log('Scan Results:');
  console.log('===================\n');

  for (const result of results) {
    const status = result.success ? '✓' : '✗';
    console.log(`${status} ${result.platform}: ${result.programCount} programs, ${result.uriCount} URIs`);
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    }
  }

  console.log(`\nCompleted in ${elapsed}s`);

  // Exit with error if any platform failed
  const anyFailed = results.some((r) => !r.success);
  process.exit(anyFailed ? 1 : 0);
} catch (error) {
  console.error('\nFatal error:', error instanceof Error ? error.message : error);
  process.exit(1);
}
