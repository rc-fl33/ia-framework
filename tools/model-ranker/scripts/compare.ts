#!/usr/bin/env bun
/**
 * ZDR Model Ranker - Cross-Provider Comparison
 *
 * Compare the same prompt across OpenRouter and grok2api providers.
 * Fan out all calls in parallel and collect results with provider metadata.
 */

import { Grok2ApiProvider } from '@/tools/grok2api/provider';
import type { ModelCallResult } from '@/tools/openrouter/types';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CompareSpec {
  provider: 'openrouter' | 'grok2api';
  model: string;
}

export interface ComparisonResult extends ModelCallResult {
  provider: string;
}

interface CompareOptions {
  systemPrompt?: string;
  temperature?: number;
  max_tokens?: number;
}

// ─── Provider Callers ───────────────────────────────────────────────────────

async function callGrok2Api(
  model: string,
  prompt: string,
  options: CompareOptions,
): Promise<ComparisonResult> {
  const provider = new Grok2ApiProvider();
  const result = await provider.call(model, prompt, {
    systemPrompt: options.systemPrompt,
    temperature: options.temperature,
    max_tokens: options.max_tokens,
  });
  return { ...result, provider: 'grok2api' };
}

async function callOpenRouter(
  model: string,
  prompt: string,
  options: CompareOptions,
): Promise<ComparisonResult> {
  const { OpenRouterClient } = await import('@/tools/openrouter/client');
  const client = new OpenRouterClient();
  const result = await client.callModel(model, prompt, {
    systemPrompt: options.systemPrompt,
    temperature: options.temperature,
    max_tokens: options.max_tokens,
  });
  return { ...result, provider: 'openrouter' };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Compare multiple model+provider combinations against the same prompt.
 * All calls execute in parallel via Promise.all.
 */
export async function compareModels(
  prompt: string,
  specs: CompareSpec[],
  options: CompareOptions = {},
): Promise<ComparisonResult[]> {
  const calls = specs.map(spec => {
    if (spec.provider === 'grok2api') {
      return callGrok2Api(spec.model, prompt, options);
    }
    return callOpenRouter(spec.model, prompt, options);
  });

  return Promise.all(calls);
}

// ─── CLI Entry Point ────────────────────────────────────────────────────────

function printUsage(): void {
  console.log(`
Cross-Provider Model Comparison

Usage:
  bun tools/model-ranker/scripts/compare.ts <prompt> <provider:model> [provider:model...]

Examples:
  bun tools/model-ranker/scripts/compare.ts "Hello" grok2api:grok-4.1-fast openrouter:x-ai/grok-4-fast
  bun tools/model-ranker/scripts/compare.ts "Explain TypeScript" grok2api:grok-4.20-beta openrouter:google/gemini-2.5-flash-preview-05-20
`);
}

function parseSpecs(args: string[]): CompareSpec[] {
  return args.map(arg => {
    const colonIdx = arg.indexOf(':');
    if (colonIdx === -1) {
      throw new Error(`Invalid spec "${arg}". Expected format: provider:model`);
    }
    const provider = arg.substring(0, colonIdx);
    const model = arg.substring(colonIdx + 1);
    if (provider !== 'openrouter' && provider !== 'grok2api') {
      throw new Error(`Unknown provider "${provider}". Use "openrouter" or "grok2api".`);
    }
    return { provider, model };
  });
}

if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    printUsage();
    process.exit(0);
  }

  const [prompt, ...specArgs] = args;
  const specs = parseSpecs(specArgs);

  console.log(`Prompt: ${prompt}`);
  console.log(`Comparing ${specs.length} model(s)...\n`);

  const results = await compareModels(prompt!, specs);

  for (const result of results) {
    console.log(`--- ${result.provider}/${result.model} ---`);
    if (result.status === 'success') {
      console.log(`Content: ${result.content?.substring(0, 200)}...`);
      console.log(
        `Tokens: ${result.tokens?.total_tokens ?? 'N/A'} | ` +
        `Cost: $${result.cost?.toFixed(4) ?? 'N/A'} | ` +
        `Latency: ${result.latency_ms ?? 'N/A'}ms`,
      );
    } else {
      console.log(`Error: ${result.error}`);
    }
    console.log();
  }
}
