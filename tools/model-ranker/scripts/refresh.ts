#!/usr/bin/env bun
/**
 * ZDR Model Ranker - CLI Refresh
 *
 * Usage:
 *   bun tools/model-ranker/scripts/refresh.ts              # Full refresh with output
 *   bun tools/model-ranker/scripts/refresh.ts --top 10    # Show top N after refresh
 *   bun tools/model-ranker/scripts/refresh.ts --quiet      # Cron-friendly (errors only)
 *   bun tools/model-ranker/scripts/refresh.ts --status     # Check cache status
 *   bun tools/model-ranker/scripts/refresh.ts --profile batch-scanning  # Use specific profile
 *   bun tools/model-ranker/scripts/refresh.ts --no-zdr     # All models, no ZDR/Claude filter
 */

import { refreshRankings, getCacheStatus, getTopModels } from './client';
import type { RankedModel, RankingsCache } from './types';

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const statusOnly = args.includes('--status');
const noZdr = args.includes('--no-zdr');
const topIndex = args.indexOf('--top');
const topCount = topIndex !== -1 ? parseInt(args[topIndex + 1]) || 10 : 0;
const profileIndex = args.indexOf('--profile');
const defaultProfile = 'security-interactive';
const profile =
  profileIndex !== -1 ? args[profileIndex + 1] || defaultProfile : defaultProfile;

function log(msg: string): void {
  if (!quiet) console.log(msg);
}

function formatModel(model: RankedModel, rank: number): string {
  const score = (model.compositeScore * 100).toFixed(1);
  const completeness = (model.dataCompleteness * 100).toFixed(0);
  // OpenRouter pricing is per-token; multiply by 1M for per-million display
  const rawPromptPrice = model.raw.promptPricePerMillion;
  const cost = rawPromptPrice !== undefined
    ? `$${(rawPromptPrice * 1_000_000).toFixed(2)}/M`
    : 'n/a';
  const ctx = model.raw.contextWindow
    ? `${(model.raw.contextWindow / 1000).toFixed(0)}k`
    : 'n/a';

  const rankStr = String(rank).padStart(2);
  const modelId = model.id.padEnd(45);
  const scoreStr = score.padStart(5);
  const costStr = cost.padStart(10);
  const ctxStr = ctx.padStart(6);

  return (
    `  ${rankStr}. ${modelId} score: ${scoreStr}%  ` +
    `cost: ${costStr}  ctx: ${ctxStr}  data: ${completeness}%`
  );
}

function printSummary(cache: RankingsCache): void {
  const title = cache.filters.zdrRequired ? 'ZDR Model Rankings' : 'Model Rankings (All — No ZDR Filter)';
  log(`\n${title}`);
  log(`${'─'.repeat(60)}`);
  log(`Generated:  ${cache.generatedAt}`);
  log(`Expires:    ${cache.expiresAt}`);
  log(`Version:    ${cache.version}`);
  log('');

  log(`Sources:`);
  for (const src of cache.sources) {
    const icon = src.status === 'success' ? '+' : src.status === 'skipped' ? '~' : 'x';
    const detail = src.status === 'success'
      ? `${src.modelCount} models`
      : src.error || 'unknown error';
    log(`  [${icon}] ${src.source.padEnd(25)} ${detail}`);
  }
  log('');

  log(`Filters:`);
  log(`  ZDR required:     ${cache.filters.zdrRequired}`);
  log(`  Blocked prefixes: ${cache.filters.blockedPrefixes.join(', ')}`);
  log(`  Exclude Claude:   ${cache.filters.excludeClaude}`);
  log(`  Before filter:    ${cache.filters.totalModelsBeforeFilter} models`);
  log(`  After filter:     ${cache.filters.totalModelsAfterFilter} models`);
}

async function main(): Promise<void> {
  // Status check only
  if (statusOnly) {
    const status = await getCacheStatus();
    if (!status.exists) {
      console.log('Cache: not found');
      process.exit(1);
    }
    console.log(`Cache: ${status.fresh ? 'fresh' : 'STALE'}`);
    console.log(`Generated: ${status.generatedAt}`);
    console.log(`Expires:   ${status.expiresAt}`);
    console.log(`Models:    ${status.modelCount}`);
    process.exit(status.fresh ? 0 : 1);
  }

  // Full refresh
  log('Fetching data from all sources...');

  try {
    const cache = await refreshRankings({ noZdr });

    printSummary(cache);

    // Show top models
    const showCount = topCount || 15;
    const rankings = cache.profileRankings[profile] || cache.rankings;

    log(`\nTop ${showCount} Models (profile: ${profile}):`);
    log(`${'─'.repeat(110)}`);
    for (let i = 0; i < Math.min(showCount, rankings.length); i++) {
      log(formatModel(rankings[i], i + 1));
    }
    log('');

    if (!quiet) {
      const cacheFileName = noZdr ? 'all-rankings.json' : 'zdr-rankings.json';
      log(`Cache written to: tools/model-ranker/cache/${cacheFileName}`);
      log(`Total eligible models: ${cache.rankings.length}`);
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
