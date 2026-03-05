/**
 * Shared QA Model Configuration
 *
 * Central location for QA model standards across all skills.
 * See: docs/standards/qa-model-standards.md
 *
 * Usage:
 *   import { QA_MODEL, QA_MODEL_COMPLEX, createQAPayload } from '@/tools/framework/utils/qa-model';
 */

interface QAPayload {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature: number;
  max_tokens: number;
  reasoning?: {
    effort: string;
  };
  zdr?: boolean;
}

/**
 * Standard QA model for routine verification tasks
 * Override with QA_MODEL environment variable
 *
 * Current: google/gemma-3-27b-it:free (10.9s, free, 0 FAIL rate)
 * Last Updated: 2026-01-23
 * Next Review: 2026-04-23
 */
export const QA_MODEL = process.env.QA_MODEL || 'google/gemma-3-27b-it:free';

/**
 * Complex reasoning model for advanced QA tasks
 * Use for: legal citation verification, complex compliance analysis
 * Override with QA_MODEL_COMPLEX environment variable
 *
 * Current: x-ai/grok-4.1-fast (38.3s, $0.013, deep reasoning)
 */
export const QA_MODEL_COMPLEX = process.env.QA_MODEL_COMPLEX || 'x-ai/grok-4.1-fast';

/**
 * Create OpenRouter API payload with model-specific configuration
 *
 * @param model - Model ID (defaults to QA_MODEL)
 * @param messages - Chat messages array
 * @param options - Optional overrides (temperature, max_tokens, etc.)
 * @returns Configured payload for OpenRouter API
 */
export function createQAPayload(
  model: string = QA_MODEL,
  messages: Array<{ role: string; content: string }>,
  options: {
    temperature?: number;
    max_tokens?: number;
    reasoning_effort?: string;
  } = {}
): QAPayload {
  const payload: QAPayload = {
    model,
    messages,
    temperature: options.temperature ?? 0.2,
    max_tokens: options.max_tokens ?? 4096,
  };

  // Model-specific configuration
  if (model.includes('grok')) {
    payload.reasoning = { effort: options.reasoning_effort ?? 'high' };
  }

  // ZDR (Zero Data Retention): Enable for paid models that support it
  // Free models (:free suffix) and Grok don't support ZDR
  if (!model.includes('grok') && !model.includes(':free')) {
    payload.zdr = true;
  }

  return payload;
}

/**
 * Get model display name for logging
 */
export function getModelName(model: string = QA_MODEL): string {
  const names: Record<string, string> = {
    'google/gemma-3-27b-it:free': 'Gemma 3 27B (Free)',
    'x-ai/grok-4.1-fast': 'Grok 4.1 Fast',
    'meta-llama/llama-3.3-70b-instruct:free': 'Llama 3.3 70B (Free)',
    'qwen/qwen-2.5-72b-instruct': 'Qwen 2.5 72B',
    'mistralai/mistral-large': 'Mistral Large',
  };

  return names[model] || model;
}

/**
 * Check if model is free (zero cost)
 */
export function isFreeModel(model: string = QA_MODEL): boolean {
  return model.includes(':free');
}

/**
 * Get estimated cost per request (in dollars)
 * Based on typical 5-6K tokens per QA run
 */
export function getEstimatedCost(model: string = QA_MODEL): number {
  const costs: Record<string, number> = {
    'google/gemma-3-27b-it:free': 0,
    'x-ai/grok-4.1-fast': 0.013,
    'meta-llama/llama-3.3-70b-instruct:free': 0,
    'qwen/qwen-2.5-72b-instruct': 0,
    'mistralai/mistral-large': 0,
  };

  return costs[model] ?? 0;
}
