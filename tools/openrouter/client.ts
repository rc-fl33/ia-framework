#!/usr/bin/env bun
/**
 * OpenRouter API Client
 *
 * Unified TypeScript client for OpenRouter multi-model API access.
 * Shared client for all framework skills requiring multi-model API access.
 *
 * Features:
 * - Single and parallel model execution
 * - Automatic retry with exponential backoff
 * - Session tracking and cost estimation
 * - API key validation
 * - Comprehensive error handling
 *
 * API Documentation: https://openrouter.ai/docs
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import type {
  OpenRouterMessage,
  OpenRouterRequest,
  OpenRouterResponse,
  ModelCallResult,
  SessionStats,
  OpenRouterClientOptions,
  CallModelOptions,
  ImageGenerationOptions,
  ImageGenerationResult,
  ProviderConfig,
} from './types';

// Load .env from framework root
config({ path: resolve(import.meta.dir, '../../../.env') });

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * OpenRouter API Client with session tracking and retry logic.
 *
 * ZDR enforcement: Pass `enforceZDR: true` to force all requests through
 * Zero Data Retention providers (`provider.zdr: true, data_collection: "deny"`).
 * See: https://openrouter.ai/docs/guides/features/zdr
 */
export class OpenRouterClient {
  private apiKey: string;
  private apiKeyHash: string; // For key rotation detection
  private timeout: number;
  private referer: string;
  private appTitle: string;
  private sessionStats: SessionStats;
  private defaultProvider?: ProviderConfig;
  private enforceZDR: boolean;
  private rateLimitHits: number = 0;
  private quotaWarningThreshold: number = 0.8; // 80% of quota
  private onQuotaWarning?: (usage: number, limit: number) => void;
  private onError?: (error: string, model: string) => void;

  constructor(options: OpenRouterClientOptions = {}) {
    this.apiKey = options.apiKey || process.env.OPENROUTER_API_KEY || '';
    this.timeout = options.timeout || 120000; // 2 minutes
    this.referer = options.referer || 'https://intelligence-adjacent.com';
    this.appTitle = options.appTitle || 'IA Framework';
    this.defaultProvider = options.defaultProvider;
    this.enforceZDR = options.enforceZDR || false;
    this.onQuotaWarning = options.onQuotaWarning;
    this.onError = options.onError;

    // Track API key hash for rotation detection (first 8 chars for logging)
    this.apiKeyHash = this._hashApiKey(this.apiKey);

    this.sessionStats = {
      requests: 0,
      totalTokens: 0,
      totalCost: 0,
      startTime: Date.now()
    };

    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY not found in environment or options');
    }

    this._logKeyRotationCheck();
  }

  /**
   * Hash API key for rotation detection (first 8 chars for logging)
   */
  private _hashApiKey(key: string): string {
    return key.substring(0, 8);
  }

  /**
   * Check for API key rotation and log if detected
   */
  private _logKeyRotationCheck(): void {
    const currentKey = process.env.OPENROUTER_API_KEY || '';
    const currentHash = this._hashApiKey(currentKey);

    if (currentHash !== this.apiKeyHash && this.apiKeyHash) {
      console.error('⚠️  API KEY ROTATION DETECTED');
      console.error(`Previous key prefix: ${this.apiKeyHash}...`);
      console.error(`New key prefix: ${currentHash}...`);
      console.error('This may indicate a security issue or key refresh.');
    }
  }

  /**
   * Set monitoring hooks for quota warnings and errors
   */
  setMonitoringHooks(hooks: {
    onQuotaWarning?: (usage: number, limit: number) => void;
    onError?: (error: string, model: string) => void;
  }): void {
    this.onQuotaWarning = hooks.onQuotaWarning;
    this.onError = hooks.onError;
  }

  /**
   * Call a single model with retry logic
   */
  async call(
    model: string,
    prompt: string,
    options: CallModelOptions = {}
  ): Promise<ModelCallResult> {
    const {
      systemPrompt = 'You are a helpful assistant.',
      temperature = 0.7,
      max_tokens = 2000,
      top_p,
      retries = 3
    } = options;

    let lastError: string = '';

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await this._executeCall(model, prompt, {
          systemPrompt,
          temperature,
          max_tokens,
          top_p
        });

        // Update session stats on success
        if (result.status === 'success') {
          this.sessionStats.requests++;
          this.sessionStats.totalTokens += result.tokens?.total_tokens || 0;
          this.sessionStats.totalCost += result.cost || 0;
        }

        return result;

      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);

        // Call error monitoring hook
        if (this.onError) {
          this.onError(lastError, model);
        }

        if (attempt < retries) {
          // Exponential backoff with jitter to prevent thundering herd
          const exponentialDelay = 1000 * Math.pow(2, attempt - 1);
          const jitterMs = Math.random() * 500;
          const delay = exponentialDelay + jitterMs;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }

    // All retries failed
    return {
      model,
      status: 'error',
      error: `Failed after ${retries} attempts. Last error: ${lastError}`
    };
  }

  /**
   * Execute a single API call (no retry logic)
   */
  private async _executeCall(
    model: string,
    prompt: string,
    options: CallModelOptions
  ): Promise<ModelCallResult> {
    const startTime = Date.now();

    const messages: OpenRouterMessage[] = [];
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    // Build provider config: enforceZDR overrides, then defaultProvider
    let provider: ProviderConfig | undefined = this.defaultProvider
      ? { ...this.defaultProvider }
      : undefined;

    if (this.enforceZDR) {
      provider = {
        ...provider,
        zdr: true,
        data_collection: 'deny',
      };
    }

    const requestBody: OpenRouterRequest = {
      model,
      messages,
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      ...(options.top_p && { top_p: options.top_p }),
      ...(provider && { provider }),
    };

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': this.referer,
        'X-Title': this.appTitle
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(this.timeout)
    });

    const latency_ms = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      const errorMsg = `HTTP ${response.status}: ${errorText}`;

      // Track rate limit hits
      if (response.status === 429) {
        this.rateLimitHits++;
      }

      // Call error monitoring hook
      if (this.onError) {
        this.onError(errorMsg, model);
      }

      return {
        model,
        status: 'error',
        error: errorMsg,
        latency_ms
      };
    }

    // Check for quota warnings in response headers
    const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
    const rateLimitLimit = response.headers.get('x-ratelimit-limit');

    if (rateLimitRemaining && rateLimitLimit) {
      const remaining = parseInt(rateLimitRemaining);
      const limit = parseInt(rateLimitLimit);
      const usage = limit - remaining;

      // Trigger quota warning if approaching limit
      if (remaining / limit < (1 - this.quotaWarningThreshold)) {
        if (this.onQuotaWarning) {
          this.onQuotaWarning(usage, limit);
        }
      }
    }

    const data: OpenRouterResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      const errorMsg = 'No choices returned from API';

      // Call error monitoring hook
      if (this.onError) {
        this.onError(errorMsg, model);
      }

      return {
        model,
        status: 'error',
        error: errorMsg,
        latency_ms
      };
    }

    const cost = this._estimateCost(model, data.usage);

    return {
      model,
      status: 'success',
      content: data.choices[0].message.content,
      tokens: data.usage,
      latency_ms,
      cost,
      finish_reason: data.choices[0].finish_reason
    };
  }

  /**
   * Call multiple models in parallel
   */
  async callParallel(
    models: string[],
    prompt: string,
    options: CallModelOptions = {}
  ): Promise<ModelCallResult[]> {
    console.log(`🚀 Calling ${models.length} models in parallel...`);

    const promises = models.map(model => this.call(model, prompt, options));
    const results = await Promise.all(promises);

    const successes = results.filter(r => r.status === 'success').length;
    const failures = results.filter(r => r.status === 'error').length;

    console.log(`✅ ${successes} succeeded, ❌ ${failures} failed`);

    return results;
  }

  /**
   * Retry only the failed calls from a previous batch
   */
  async retryFailed(
    failedResults: ModelCallResult[],
    prompt: string,
    options: CallModelOptions = {}
  ): Promise<ModelCallResult[]> {
    if (failedResults.length === 0) {
      return [];
    }

    console.log(`🔄 Retrying ${failedResults.length} failed models...`);

    const retryResults: ModelCallResult[] = [];

    for (const failed of failedResults) {
      const result = await this.call(failed.model, prompt, options);
      retryResults.push(result);
    }

    return retryResults;
  }

  /**
   * Validate API key with a quick test call
   */
  async validateApiKey(): Promise<boolean> {
    try {
      const result = await this.call(
        'deepseek/deepseek-chat', // Free model for testing
        'Say hello',
        { max_tokens: 10, retries: 1 }
      );
      return result.status === 'success';
    } catch {
      return false;
    }
  }

  /**
   * Estimate cost based on model and token usage
   */
  private _estimateCost(model: string, usage: OpenRouterResponse['usage']): number {
    if (!usage) return 0;

    // Cost per 1M tokens (rough estimates)
    const costPerMillion: Record<string, number> = {
      'grok': 5.0,
      'claude': 3.0,
      'gpt-4': 10.0,
      'gpt-3': 0.5,
      'deepseek': 0.1,
      'gemini': 2.0
    };

    // Find matching cost tier
    for (const [key, price] of Object.entries(costPerMillion)) {
      if (model.toLowerCase().includes(key)) {
        return (usage.total_tokens / 1_000_000) * price;
      }
    }

    // Default fallback
    return (usage.total_tokens / 1_000_000) * 4.0;
  }

  /**
   * Get current session statistics
   */
  getSessionStats(): SessionStats & { duration_ms: number } {
    return {
      ...this.sessionStats,
      duration_ms: Date.now() - this.sessionStats.startTime
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
      startTime: Date.now()
    };
    this.rateLimitHits = 0;
  }

  /**
   * Get rate limit statistics
   */
  getRateLimitStats(): { hits: number; requests: number; hitRate: number } {
    return {
      hits: this.rateLimitHits,
      requests: this.sessionStats.requests,
      hitRate: this.sessionStats.requests > 0
        ? this.rateLimitHits / this.sessionStats.requests
        : 0
    };
  }

  /**
   * Generate an image using Flux models via OpenRouter
   *
   * Supported models:
   * - black-forest-labs/flux.2-max (highest quality)
   * - black-forest-labs/flux.2-klein (balanced)
   * - black-forest-labs/flux.2-flex (flexible)
   * - black-forest-labs/flux.2-pro (professional)
   */
  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    const {
      prompt,
      model = 'black-forest-labs/flux.2-max',
      aspect_ratio = '1:1',
      image_size = '1024x1024',
      retries = 3
    } = options;

    let lastError: string = '';

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const startTime = Date.now();

        const requestBody = {
          model,
          messages: [{ role: 'user', content: prompt }]
        };

        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': this.referer,
            'X-Title': this.appTitle
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(this.timeout)
        });

        const latency_ms = Date.now() - startTime;

        if (!response.ok) {
          const errorText = await response.text();
          lastError = `HTTP ${response.status}: ${errorText}`;

          if (attempt < retries) {
            // Exponential backoff with jitter
            const exponentialDelay = 1000 * Math.pow(2, attempt - 1);
            const jitterMs = Math.random() * 500;
            const delay = exponentialDelay + jitterMs;
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          return {
            model,
            status: 'error',
            error: lastError,
            prompt,
            latency_ms,
            timestamp: new Date().toISOString()
          };
        }

        const data = await response.json();

        if (!data.choices || data.choices.length === 0) {
          lastError = 'No choices returned from API';

          if (attempt < retries) {
            // Exponential backoff with jitter
            const exponentialDelay = 1000 * Math.pow(2, attempt - 1);
            const jitterMs = Math.random() * 500;
            const delay = exponentialDelay + jitterMs;
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          return {
            model,
            status: 'error',
            error: lastError,
            prompt,
            latency_ms,
            timestamp: new Date().toISOString()
          };
        }

        // Extract base64 image data from response
        const message = data.choices[0].message;
        let imageData: string | undefined;

        // Check for images array in message
        if (message.images && message.images.length > 0) {
          const imageUrl = message.images[0].image_url?.url;
          if (imageUrl) {
            // Extract base64 from data URL (format: data:image/png;base64,...)
            const base64Match = imageUrl.match(/^data:image\/[^;]+;base64,(.+)$/);
            imageData = base64Match ? base64Match[1] : imageUrl;
          }
        }

        if (!imageData) {
          lastError = 'No image data found in response';

          if (attempt < retries) {
            // Exponential backoff with jitter
            const exponentialDelay = 1000 * Math.pow(2, attempt - 1);
            const jitterMs = Math.random() * 500;
            const delay = exponentialDelay + jitterMs;
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          return {
            model,
            status: 'error',
            error: lastError,
            prompt,
            latency_ms,
            timestamp: new Date().toISOString()
          };
        }

        // Update session stats
        this.sessionStats.requests++;
        const estimatedCost = this._estimateImageCost(model);
        this.sessionStats.totalCost += estimatedCost;

        return {
          model,
          status: 'success',
          imageData,
          prompt,
          latency_ms,
          cost: estimatedCost,
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);

        if (attempt < retries) {
          // Exponential backoff with jitter
          const exponentialDelay = 1000 * Math.pow(2, attempt - 1);
          const jitterMs = Math.random() * 500;
          const delay = exponentialDelay + jitterMs;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }

    // All retries failed
    return {
      model,
      status: 'error',
      error: `Failed after ${retries} attempts. Last error: ${lastError}`,
      prompt,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Extract base64 image data from OpenRouter response content
   */
  private _extractBase64Image(content: string): string | undefined {
    // OpenRouter returns data URLs like: data:image/jpeg;base64,/9j/4AAQ...
    const dataUrlMatch = content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
    if (dataUrlMatch) {
      return dataUrlMatch[1];
    }

    // Fallback: check if content is already base64
    if (/^[A-Za-z0-9+/=]+$/.test(content) && content.length > 100) {
      return content;
    }

    return undefined;
  }

  /**
   * Estimate cost for image generation
   */
  private _estimateImageCost(model: string): number {
    // Rough estimates per image (in USD)
    const costPerImage: Record<string, number> = {
      'flux.2-max': 0.04,
      'flux.2-klein': 0.02,
      'flux.2-flex': 0.02,
      'flux.2-pro': 0.05
    };

    for (const [key, price] of Object.entries(costPerImage)) {
      if (model.toLowerCase().includes(key)) {
        return price;
      }
    }

    return 0.03; // Default estimate
  }

  /**
   * Generate image and save to file
   */
  async generateImageToFile(
    options: ImageGenerationOptions & { outputPath: string }
  ): Promise<ImageGenerationResult> {
    const result = await this.generateImage(options);

    if (result.status === 'success' && result.imageData) {
      const { writeFile, mkdir } = await import('fs/promises');
      const { dirname } = await import('path');

      // Ensure directory exists
      await mkdir(dirname(options.outputPath), { recursive: true });

      // Decode base64 and write to file
      const buffer = Buffer.from(result.imageData, 'base64');
      await writeFile(options.outputPath, buffer);

      result.imagePath = options.outputPath;
    }

    return result;
  }
}

/**
 * Convenience function for one-off calls without creating a client
 */
export async function callModel(
  model: string,
  prompt: string,
  options: CallModelOptions & { apiKey?: string } = {}
): Promise<ModelCallResult> {
  const client = new OpenRouterClient({ apiKey: options.apiKey });
  return client.call(model, prompt, options);
}

// CLI usage
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
OpenRouter API Client

Usage:
  bun client.ts <model> <prompt> [--temperature 0.7] [--max-tokens 2000]

Environment:
  OPENROUTER_API_KEY   Required API key from openrouter.ai

Examples:
  bun client.ts deepseek/deepseek-chat "Explain quantum computing"
  bun client.ts anthropic/claude-sonnet-4.5 "Write hello world in Rust"
  bun client.ts x-ai/grok-4-fast "What is the IA Framework?" --temperature 0.3

Available Models:
  - deepseek/deepseek-chat (free, fast)
  - deepseek/deepseek-r1-0528:free (free reasoning model)
  - anthropic/claude-sonnet-4.5
  - x-ai/grok-4-fast
  - google/gemini-2.0-flash-001
  - And many more at openrouter.ai/models
`);
    process.exit(0);
  }

  const model = args[0];
  const promptStart = args.findIndex(arg => !arg.startsWith('--')) + 1;
  const prompt = args.slice(1, args.findIndex(arg => arg.startsWith('--'), 1) || undefined)
    .filter(arg => !arg.startsWith('--'))
    .join(' ');

  const tempArg = args.find(arg => arg.startsWith('--temperature='))?.split('=')[1];
  const tokensArg = args.find(arg => arg.startsWith('--max-tokens='))?.split('=')[1];

  console.log(`\n🤖 Testing model: ${model}`);
  console.log(`📝 Prompt: ${prompt}\n`);

  const client = new OpenRouterClient();

  const result = await client.call(model, prompt, {
    ...(tempArg && { temperature: parseFloat(tempArg) }),
    ...(tokensArg && { max_tokens: parseInt(tokensArg) })
  });

  if (result.status === 'success') {
    console.log('✅ Success!\n');
    console.log(result.content);
    console.log(`\n📊 Tokens: ${result.tokens?.total_tokens} | Cost: $${result.cost?.toFixed(4)} | Latency: ${result.latency_ms}ms`);
  } else {
    console.log('❌ Failed!\n');
    console.log(`Error: ${result.error}`);
    process.exit(1);
  }

  const stats = client.getSessionStats();
  console.log(`\n📈 Session: ${stats.requests} requests | ${stats.totalTokens} tokens | $${stats.totalCost.toFixed(4)}`);
}
