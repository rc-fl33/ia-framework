#!/usr/bin/env bun
/**
 * Grok2API LLM Provider
 *
 * Provides the same interface as OpenRouterClient for cross-provider
 * model comparison. Cost is always 0 (local, free).
 *
 * Usage:
 *   const provider = new Grok2ApiProvider();
 *   const result = await provider.call('grok-4.20-beta', 'Hello');
 *   // result: ModelCallResult (same type as OpenRouter)
 */

import type { ModelCallResult, SessionStats } from '@/tools/openrouter/types';
import { GROK2API_BASE_URL } from './types';

export interface Grok2ApiProviderOptions {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

export class Grok2ApiProvider {
  private baseUrl: string;
  private timeout: number;
  private retries: number;
  private sessionStats: SessionStats;

  constructor(options: Grok2ApiProviderOptions = {}) {
    this.baseUrl = options.baseUrl || GROK2API_BASE_URL;
    this.timeout = options.timeout || 120_000;
    this.retries = options.retries || 3;
    this.sessionStats = {
      requests: 0,
      totalTokens: 0,
      totalCost: 0,
      startTime: Date.now(),
    };
  }

  /**
   * Call a single model (matches OpenRouterClient.call signature)
   */
  async call(
    model: string,
    prompt: string,
    options: {
      systemPrompt?: string;
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
      retries?: number;
    } = {},
  ): Promise<ModelCallResult> {
    const {
      systemPrompt = 'You are a helpful assistant.',
      temperature = 0.7,
      max_tokens = 2000,
      top_p,
      retries = this.retries,
    } = options;

    let lastError = '';

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await this._executeCall(
          model, prompt, { systemPrompt, temperature, max_tokens, top_p },
        );

        if (result.status === 'success') {
          return result;
        }

        lastError = result.error || 'Unknown error';

        if (attempt < retries) {
          await this._backoff(attempt);
          continue;
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);

        if (attempt < retries) {
          await this._backoff(attempt);
          continue;
        }
      }
    }

    return {
      model,
      status: 'error',
      error: `Failed after ${retries} attempts. Last error: ${lastError}`,
    };
  }

  /**
   * Execute a single API call (no retry logic)
   */
  private async _executeCall(
    model: string,
    prompt: string,
    options: {
      systemPrompt?: string;
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
    },
  ): Promise<ModelCallResult> {
    const startTime = Date.now();

    const messages: Array<{ role: string; content: string }> = [];
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const payload: Record<string, unknown> = {
      model,
      messages,
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      stream: false,
    };
    if (options.top_p !== undefined) payload.top_p = options.top_p;

    const response = await fetch(
      `${this.baseUrl}/v1/chat/completions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.timeout),
      },
    );

    const latency_ms = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      return {
        model,
        status: 'error',
        error: `HTTP ${response.status}: ${errorText}`,
        latency_ms,
      };
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return {
        model,
        status: 'error',
        error: 'No choices returned from API',
        latency_ms,
      };
    }

    // Update session stats
    this.sessionStats.requests++;
    const tokens = data.usage?.total_tokens || 0;
    this.sessionStats.totalTokens += tokens;
    // Cost is always 0 for local grok2api
    this.sessionStats.totalCost += 0;

    return {
      model,
      status: 'success',
      content: data.choices[0].message.content,
      tokens: data.usage,
      latency_ms,
      cost: 0, // Local, free
      finish_reason: data.choices[0].finish_reason,
    };
  }

  /**
   * Exponential backoff with jitter
   */
  private async _backoff(attempt: number): Promise<void> {
    const delay = 1000 * Math.pow(2, attempt - 1) + Math.random() * 500;
    await new Promise(r => setTimeout(r, delay));
  }

  /**
   * Call multiple models in parallel
   */
  async callParallel(
    models: string[],
    prompt: string,
    options: {
      systemPrompt?: string;
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
    } = {},
  ): Promise<ModelCallResult[]> {
    return Promise.all(
      models.map(model => this.call(model, prompt, options)),
    );
  }

  /**
   * Check if grok2api Docker service is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/models`, {
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * List available models from the Docker service
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/models`, {
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) return [];
      const data = await response.json();
      return (data.data || []).map((m: { id: string }) => m.id);
    } catch {
      return [];
    }
  }

  /**
   * Get session statistics
   */
  getSessionStats(): SessionStats & { duration_ms: number } {
    return {
      ...this.sessionStats,
      duration_ms: Date.now() - this.sessionStats.startTime,
    };
  }

  /**
   * Reset session statistics
   */
  resetSessionStats(): void {
    this.sessionStats = {
      requests: 0,
      totalTokens: 0,
      totalCost: 0,
      startTime: Date.now(),
    };
  }
}

// CLI usage
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
Grok2API Provider CLI

Usage:
  bun tools/grok2api/provider.ts <model> <prompt>

Examples:
  bun tools/grok2api/provider.ts grok-4.20-beta "Hello world"
  bun tools/grok2api/provider.ts grok-4.1-fast "Explain TypeScript"
`);
    process.exit(0);
  }

  const provider = new Grok2ApiProvider();
  const available = await provider.isAvailable();

  if (!available) {
    console.error('grok2api Docker service is not running');
    process.exit(1);
  }

  const [model, ...promptParts] = args;
  const prompt = promptParts.join(' ');

  console.log(`Model: ${model}`);
  console.log(`Prompt: ${prompt}\n`);

  const result = await provider.call(model!, prompt);

  if (result.status === 'success') {
    console.log(result.content);
    console.log(
      `\nTokens: ${result.tokens?.total_tokens} | ` +
      `Cost: $0.00 | Latency: ${result.latency_ms}ms`,
    );
  } else {
    console.error(`Error: ${result.error}`);
    process.exit(1);
  }
}
