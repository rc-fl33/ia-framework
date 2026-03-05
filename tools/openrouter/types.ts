/**
 * OpenRouter API Type Definitions
 */

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
  provider?: ProviderConfig;
}

export interface OpenRouterUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface OpenRouterChoice {
  index: number;
  message: OpenRouterMessage;
  finish_reason: string;
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  created: number;
  choices: OpenRouterChoice[];
  usage: OpenRouterUsage;
}

export interface ModelCallResult {
  model: string;
  status: 'success' | 'error';
  content?: string;
  tokens?: OpenRouterUsage;
  latency_ms?: number;
  cost?: number;
  finish_reason?: string;
  error?: string;
}

export interface SessionStats {
  requests: number;
  totalTokens: number;
  totalCost: number;
  startTime: number;
}

export interface OpenRouterClientOptions {
  apiKey?: string;
  timeout?: number;
  referer?: string;
  appTitle?: string;
  defaultProvider?: ProviderConfig;
  enforceZDR?: boolean;
  onQuotaWarning?: (usage: number, limit: number) => void;
  onError?: (error: string, model: string) => void;
}

export interface CallModelOptions {
  systemPrompt?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  retries?: number;
}

// Provider Configuration (ZDR, data collection, routing)
// Ref: https://openrouter.ai/docs/guides/routing/provider-selection

export interface ProviderSortConfig {
  by: 'price' | 'throughput' | 'latency';
  partition?: 'none' | 'model';
}

export interface ProviderPriceLimit {
  prompt?: number;
  completion?: number;
  request?: number;
  image?: number;
}

export interface ProviderPercentileThreshold {
  p50?: number;
  p75?: number;
  p90?: number;
  p99?: number;
}

export interface ProviderConfig {
  /** Enforce Zero Data Retention endpoints only */
  zdr?: boolean;
  /** Route only to providers supporting all request parameters */
  require_parameters?: boolean;
  /** Control data retention policies */
  data_collection?: 'allow' | 'deny';
  /** Enable backup providers when primary unavailable (default: true) */
  allow_fallbacks?: boolean;
  /** Sort by price, throughput, or latency — string or object with partition */
  sort?: 'price' | 'throughput' | 'latency' | ProviderSortConfig;
  /** List of provider slugs to try in order */
  order?: string[];
  /** Whitelist specific providers */
  only?: string[];
  /** Exclude specific providers */
  ignore?: string[];
  /** Filter by quantization levels (int4, int8, fp8, fp16, bf16, unknown) */
  quantizations?: string[];
  /** Route to models allowing text distillation */
  enforce_distillable_text?: boolean;
  /** Minimum tokens/sec threshold */
  preferred_min_throughput?: number | ProviderPercentileThreshold;
  /** Maximum latency in seconds */
  preferred_max_latency?: number | ProviderPercentileThreshold;
  /** Price ceiling per token type (per million tokens) */
  max_price?: ProviderPriceLimit;
}

// Image Generation Types

export interface ImageGenerationOptions {
  prompt: string;
  model?: string;
  aspect_ratio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  image_size?: '1024x1024' | '1792x1024' | '1024x1792' | '1536x1024' | '1024x1536';
  retries?: number;
}

export interface ImageGenerationResult {
  model: string;
  status: 'success' | 'error';
  imageData?: string; // base64 encoded image data
  imagePath?: string; // saved file path
  prompt: string;
  latency_ms?: number;
  cost?: number;
  error?: string;
  timestamp: string;
}
