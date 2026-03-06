---
name: openrouter
type: api-client
classification: public
description: Multi-model API routing with parallel execution, retry logic, session tracking, and cost estimation
version: 1.0.0
last_updated: 2026-02-14
env_required: true
env_keys:
  - OPENROUTER_API_KEY
commands:
  - bun tools/api/openrouter/client.ts <model> <prompt> [options]
related_tools:
  - tools/model-ranker
  - tools/api/grok
  - skills/write
  - skills/advisory
---

# OpenRouter API Client

**Type:** API Client
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

---

## Classification

**PUBLIC** - Multi-model API routing via OpenRouter.ai. Core framework component used by writing, advisory, and research skills.

**Why Public:**
- Provider-agnostic multi-model access (Claude, GPT, Grok, Gemini, etc.)
- Well-established OpenRouter.ai API (official documentation)
- No proprietary logic - standard API wrapper with quality-of-life features
- Wide applicability beyond personal use

---

## Purpose

Unified TypeScript client for OpenRouter multi-model API access. Provides a consistent interface for calling multiple AI models from different providers (Anthropic, OpenAI, X.AI, Google) with automatic retry logic, session tracking, and cost estimation.

**Core Capabilities:**
- **Multi-model execution**: Call Claude, GPT, Grok, Gemini, and 200+ models via single interface
- **Parallel execution**: Run multiple models simultaneously with Promise.all
- **Automatic retry**: Exponential backoff with jitter for resilient API calls
- **Session tracking**: Request count, token usage, and cost estimation per session
- **ZDR enforcement**: Zero Data Retention mode for privacy-sensitive use cases
- **Image generation**: Flux model support for image/video generation via OpenRouter
- **Cost estimation**: Real-time cost tracking based on token usage and model pricing

**Use Cases:**
- Content generation with model comparison (skills/write)
- Research with multi-perspective analysis (skills/advisory)
- Model performance evaluation (tools/model-ranker)
- Image generation workflows (tools/api/grok alternative)

---

## Usage

### Class-Based API (Recommended)

**Basic Call:**
```typescript
import { OpenRouterClient } from '@/tools/openrouter';

const client = new OpenRouterClient();

const result = await client.call(
  'anthropic/claude-sonnet-4.5',
  'Explain quantum computing in simple terms',
  {
    temperature: 0.7,
    max_tokens: 2000,
    systemPrompt: 'You are a physics educator.',
    retries: 3  // Automatic retry with exponential backoff
  }
);

if (result.status === 'success') {
  console.log(result.content);
  console.log(`Tokens: ${result.tokens.total_tokens}`);
  console.log(`Cost: $${result.cost.toFixed(4)}`);
} else {
  console.error(`Error: ${result.error}`);
}
```

**Parallel Execution:**
```typescript
const models = [
  'anthropic/claude-sonnet-4.5',
  'x-ai/grok-4-fast',
  'google/gemini-2.0-flash-001'
];

const results = await client.callParallel(
  models,
  'What are the key differences between React and Vue?'
);

for (const result of results) {
  if (result.status === 'success') {
    console.log(`\n${result.model}:`);
    console.log(result.content);
  }
}
```

**Session Statistics:**
```typescript
const stats = client.getSessionStats();
console.log(`Total requests: ${stats.requests}`);
console.log(`Total tokens: ${stats.totalTokens}`);
console.log(`Total cost: $${stats.totalCost.toFixed(4)}`);
console.log(`Session duration: ${(stats.duration_ms / 1000).toFixed(1)}s`);
```

**ZDR Enforcement (Zero Data Retention):**
```typescript
const client = new OpenRouterClient({
  enforceZDR: true  // Force all requests through ZDR providers only
});

// All calls will now use provider.zdr: true, data_collection: "deny"
const result = await client.call('anthropic/claude-sonnet-4.5', 'Sensitive prompt');
```

**Image Generation:**
```typescript
const imageResult = await client.generateImage({
  prompt: 'A futuristic cyberpunk cityscape at sunset',
  model: 'black-forest-labs/flux.2-max',
  aspect_ratio: '16:9'
});

if (imageResult.status === 'success') {
  console.log(`Image generated: ${imageResult.imageData.length} bytes`);
  console.log(`Cost: $${imageResult.cost}`);
}

// Save to file
const savedResult = await client.generateImageToFile({
  prompt: 'Abstract digital art',
  model: 'black-forest-labs/flux.2-max',
  outputPath: './output/image.png'
});
```

### Standalone Function

For one-off calls without creating a client instance:

```typescript
import { callModel } from '@/tools/openrouter';

const result = await callModel(
  'deepseek/deepseek-chat',  // Free model for testing
  'Write hello world in Python'
);

console.log(result.content);
```

### CLI Usage

```bash
# Basic usage
bun tools/api/openrouter/client.ts deepseek/deepseek-chat "Explain quantum computing"

# With options
bun tools/api/openrouter/client.ts anthropic/claude-sonnet-4.5 \
  "Write a Rust function to calculate Fibonacci" \
  --temperature=0.3 \
  --max-tokens=1000

# Test free models
bun tools/api/openrouter/client.ts deepseek/deepseek-r1-0528:free "Solve 2x + 5 = 13"
```

---

## Configuration

### Environment Variables

**Required:**
```bash
OPENROUTER_API_KEY=[your API key]  # Get from https://openrouter.ai/keys
```

**API Key Setup:**
1. Sign up at https://openrouter.ai
2. Navigate to https://openrouter.ai/keys
3. Create new API key
4. Add to `.env` in framework root

**Rate Limits:**
- Varies by model and provider
- Check https://openrouter.ai/models for specific limits
- Client handles rate limiting with automatic retry

### Constructor Options

```typescript
interface OpenRouterClientOptions {
  apiKey?: string;           // API key (defaults to OPENROUTER_API_KEY)
  timeout?: number;          // Request timeout in ms (default: 120000)
  referer?: string;          // HTTP Referer header (default: intelligence-adjacent.com)
  appTitle?: string;         // X-Title header (default: IA Framework)
  defaultProvider?: ProviderConfig;  // Default provider configuration
  enforceZDR?: boolean;      // Force Zero Data Retention mode (default: false)
}
```

### Provider Configuration

Fine-grained routing control via `provider` parameter:

```typescript
const client = new OpenRouterClient({
  defaultProvider: {
    zdr: true,                    // Zero Data Retention endpoints only
    data_collection: 'deny',      // Deny data collection
    allow_fallbacks: true,        // Enable backup providers (default: true)
    sort: 'price',                // Sort by price, throughput, or latency
    order: ['anthropic', 'openai'], // Provider order preference
    only: ['anthropic'],          // Whitelist specific providers
    ignore: ['someProvider'],     // Blacklist specific providers
    max_price: {
      prompt: 0.001,              // Max price per prompt token (per million)
      completion: 0.003           // Max price per completion token
    }
  }
});
```

**See:** https://openrouter.ai/docs/guides/routing/provider-selection

---

## API Reference

### OpenRouterClient Class

#### `constructor(options?: OpenRouterClientOptions)`
Create new client instance.

**Parameters:**
- `options.apiKey` - API key (defaults to `OPENROUTER_API_KEY` env var)
- `options.timeout` - Request timeout in milliseconds (default: 120000)
- `options.referer` - HTTP Referer header
- `options.appTitle` - X-Title header
- `options.defaultProvider` - Default provider configuration
- `options.enforceZDR` - Force ZDR mode for all requests

**Throws:** Error if no API key found

---

#### `call(model, prompt, options?): Promise<ModelCallResult>`
Call a single model with automatic retry logic.

**Parameters:**
- `model` - Model ID (e.g., "anthropic/claude-sonnet-4.5")
- `prompt` - User prompt text
- `options.systemPrompt` - System prompt (default: "You are a helpful assistant.")
- `options.temperature` - Sampling temperature 0-1 (default: 0.7)
- `options.max_tokens` - Max completion tokens (default: 2000)
- `options.top_p` - Nucleus sampling parameter
- `options.retries` - Number of retry attempts (default: 3)

**Returns:**
```typescript
interface ModelCallResult {
  model: string;
  status: 'success' | 'error';
  content?: string;
  tokens?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  latency_ms?: number;
  cost?: number;
  finish_reason?: string;
  error?: string;
}
```

**Retry Behavior:**
- Exponential backoff: 1s, 2s, 4s, ...
- Jitter: +0-500ms random delay
- Updates session stats on success

---

#### `callParallel(models, prompt, options?): Promise<ModelCallResult[]>`
Call multiple models in parallel using Promise.all.

**Parameters:**
- `models` - Array of model IDs
- `prompt` - Shared prompt for all models
- `options` - Same as `call()`

**Returns:** Array of ModelCallResult (one per model)

**Example:**
```typescript
const results = await client.callParallel(
  ['anthropic/claude-sonnet-4.5', 'x-ai/grok-4-fast'],
  'Explain async/await'
);
```

---

#### `retryFailed(failedResults, prompt, options?): Promise<ModelCallResult[]>`
Retry only failed calls from a previous batch.

**Parameters:**
- `failedResults` - Array of failed ModelCallResult objects
- `prompt` - Original prompt
- `options` - Call options

**Returns:** Array of retry results

**Example:**
```typescript
const results = await client.callParallel(models, prompt);
const failed = results.filter(r => r.status === 'error');
const retried = await client.retryFailed(failed, prompt);
```

---

#### `validateApiKey(): Promise<boolean>`
Test API key with a quick free model call.

**Returns:** `true` if valid, `false` otherwise

**Example:**
```typescript
const isValid = await client.validateApiKey();
if (!isValid) {
  console.error('Invalid API key');
}
```

---

#### `generateImage(options): Promise<ImageGenerationResult>`
Generate image using Flux models via OpenRouter.

**Parameters:**
```typescript
interface ImageGenerationOptions {
  prompt: string;
  model?: string;  // Default: 'black-forest-labs/flux.2-max'
  aspect_ratio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  image_size?: '1024x1024' | '1792x1024' | '1024x1792' | '1536x1024' | '1024x1536';
  retries?: number;
}
```

**Returns:**
```typescript
interface ImageGenerationResult {
  model: string;
  status: 'success' | 'error';
  imageData?: string;  // base64 encoded
  imagePath?: string;  // file path if saved
  prompt: string;
  latency_ms?: number;
  cost?: number;
  error?: string;
  timestamp: string;
}
```

**Supported Models:**
- `black-forest-labs/flux.2-max` - Highest quality ($0.04/image)
- `black-forest-labs/flux.2-klein` - Balanced ($0.02/image)
- `black-forest-labs/flux.2-flex` - Flexible ($0.02/image)
- `black-forest-labs/flux.2-pro` - Professional ($0.05/image)

---

#### `generateImageToFile(options): Promise<ImageGenerationResult>`
Generate image and save to file.

**Parameters:** Same as `generateImage()` plus `outputPath: string`

**Example:**
```typescript
const result = await client.generateImageToFile({
  prompt: 'Cyberpunk city at night',
  outputPath: './images/cyberpunk.png'
});
```

---

#### `getSessionStats(): SessionStats & { duration_ms: number }`
Get current session statistics.

**Returns:**
```typescript
interface SessionStats {
  requests: number;
  totalTokens: number;
  totalCost: number;
  startTime: number;
  duration_ms: number;
}
```

---

#### `resetSessionStats(): void`
Reset session statistics to zero.

---

### Standalone Functions

#### `callModel(model, prompt, options?): Promise<ModelCallResult>`
Convenience function for one-off calls without creating a client.

**Parameters:** Same as `OpenRouterClient.call()`

**Example:**
```typescript
import { callModel } from '@/tools/openrouter';
const result = await callModel('deepseek/deepseek-chat', 'Hello');
```

---

## Architecture

### Request Flow

```
User Call
   ↓
OpenRouterClient.call()
   ↓
Retry Loop (1-3 attempts)
   ↓
_executeCall()
   ├─ Build messages array (system + user)
   ├─ Apply ZDR config if enforceZDR=true
   ├─ Merge defaultProvider config
   ├─ POST to OpenRouter API
   ├─ Parse response
   ├─ Estimate cost
   └─ Update session stats
   ↓
Return ModelCallResult
```

### Parallel Execution

```
callParallel(models, prompt)
   ↓
Promise.all(models.map(model => call(model, prompt)))
   ↓
[result1, result2, result3, ...]
```

### Retry Logic

```
Attempt 1 → FAIL → Wait 1s + jitter (0-500ms)
Attempt 2 → FAIL → Wait 2s + jitter
Attempt 3 → FAIL → Return error result
Attempt N → SUCCESS → Return success result
```

**Jitter Formula:** `delay = (1000 * 2^(attempt-1)) + random(0-500)`

### Cost Estimation

Cost calculated using approximate pricing per 1M tokens:

| Model Family | Cost/1M Tokens |
|--------------|----------------|
| Grok         | $5.00          |
| Claude       | $3.00          |
| GPT-4        | $10.00         |
| GPT-3        | $0.50          |
| Gemini       | $2.00          |
| Deepseek     | $0.10          |
| Default      | $4.00          |

**Formula:** `cost = (total_tokens / 1,000,000) * model_price`

### Session Tracking

Tracks cumulative stats across all calls in a client instance:
- **requests**: Total API calls made
- **totalTokens**: Sum of all token usage
- **totalCost**: Estimated total cost in USD
- **startTime**: Client instantiation timestamp

**Reset:** Call `resetSessionStats()` to zero out counters

---

## Scripts

### Production

**Call single model:**
```bash
bun tools/api/openrouter/client.ts <model> <prompt> [--temperature=0.7] [--max-tokens=2000]
```

**Examples:**
```bash
# Free model (testing)
bun tools/api/openrouter/client.ts deepseek/deepseek-chat "What is TypeScript?"

# Premium model
bun tools/api/openrouter/client.ts anthropic/claude-sonnet-4.5 "Write a Rust function"

# With options
bun tools/api/openrouter/client.ts x-ai/grok-4-fast "Explain async" --temperature=0.3
```

### Testing

**Integration tests:**
```bash
bun tools/api/__tests__/openrouter.test.ts
```

**Validate API key:**
```bash
bun -e 'import { OpenRouterClient } from "./tools/api/openrouter/client.ts"; \
  const c = new OpenRouterClient(); \
  const ok = await c.validateApiKey(); \
  console.log(ok ? "✅ Valid" : "❌ Invalid")'
```

---

## Dependencies

### Runtime

**External:** None (uses Bun built-ins)

**Internal:**
- `dotenv` - Environment variable loading
- TypeScript type definitions in `types.ts`

### Framework Integration

**Used By:**
- `skills/write` - Content generation with model comparison
- `skills/advisory` - Multi-perspective research
- `tools/model-ranker` - Model performance evaluation
- `tools/api/grok` - Fallback for image generation

**File Structure:**
```
tools/api/openrouter/
├── client.ts        # Main client implementation + CLI
├── types.ts         # TypeScript type definitions
└── README.md        # Legacy documentation (superseded by TOOL.md)
```

---

## Troubleshooting

### "OPENROUTER_API_KEY not found"

**Cause:** Missing or improperly loaded .env file

**Fix:**
```bash
# Verify .env exists in framework root
ls -la ~/ia-framework/.env

# Add key if missing
echo 'OPENROUTER_API_KEY=[your key]' >> .env

# Get key from https://openrouter.ai/keys
```

### "Failed after 3 attempts"

**Cause:** Network issues, rate limiting, or invalid model ID

**Debug:**
```typescript
const result = await client.call('model-id', 'test');
console.log(result.error);  // Check specific error message
```

**Common Causes:**
- Invalid model ID → Check https://openrouter.ai/models
- Rate limit hit → Add delay between calls or reduce concurrency
- Network timeout → Increase `timeout` in constructor options

### High Cost Estimates

**Cause:** Using expensive models (GPT-4, Claude Opus) with high token counts

**Fix:**
```typescript
// Use cheaper models for testing
await client.call('deepseek/deepseek-chat', prompt);  // Free
await client.call('google/gemini-2.0-flash-001', prompt);  // $2/1M

// Reduce max_tokens
await client.call('model', prompt, { max_tokens: 500 });

// Track session costs
const stats = client.getSessionStats();
console.log(`Cost so far: $${stats.totalCost.toFixed(4)}`);
```

### ZDR Not Working

**Cause:** Provider doesn't support Zero Data Retention for selected model

**Fix:**
```typescript
// Verify ZDR enforcement
const client = new OpenRouterClient({
  enforceZDR: true,
  defaultProvider: {
    zdr: true,
    data_collection: 'deny'
  }
});

// Check OpenRouter docs for ZDR-compatible providers
// https://openrouter.ai/docs/guides/features/zdr
```

### Parallel Calls Failing

**Cause:** Too many concurrent requests hitting rate limits

**Fix:**
```typescript
// Reduce batch size
const models = [...]; // 20 models
const batches = chunkArray(models, 5);  // Process 5 at a time

for (const batch of batches) {
  const results = await client.callParallel(batch, prompt);
  // Process results
  await new Promise(resolve => setTimeout(resolve, 1000));  // 1s delay between batches
}
```

### Image Generation Failures

**Cause:** Invalid model, malformed prompt, or timeout

**Fix:**
```typescript
// Use recommended model
const result = await client.generateImage({
  prompt: 'Clear, descriptive prompt',
  model: 'black-forest-labs/flux.2-max',
  retries: 5  // Increase retries for image gen
});

// Increase timeout for large images
const client = new OpenRouterClient({ timeout: 180000 }); // 3 minutes
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Skills:**
- `skills/write/` — uses OpenRouterClient for content generation with model comparison
- `skills/advisory/` — uses callParallel() for multi-perspective research analysis
- `skills/pentest/` — uses callModel() for AI-assisted reconnaissance and analysis

**Tools:**
- `tools/model-router/model-router.ts` — routes security research queries through OpenRouter to Claude or Grok
- `tools/research/orchestrator.ts` — uses OpenRouter as LLM synthesis layer in Tier 3 research

---

## Related Tools

- **tools/model-ranker** - LLM model ranking using OpenRouter for model comparison
- **tools/api/grok** - Grok Imagine Docker service (alternative image generation)
- **skills/write** - Content writing skill using OpenRouter for drafts
- **skills/advisory** - Research skill using multi-model analysis
- **skills/pentest** - Security testing with AI-assisted reconnaissance

---

## Version History

### 1.0.0 (2026-01-29)
- ✅ Unified TypeScript implementation
- ✅ Single and parallel model execution
- ✅ Automatic retry with exponential backoff
- ✅ Session tracking and cost estimation
- ✅ API key validation
- ✅ ZDR enforcement support
- ✅ Image generation via Flux models
- ✅ Comprehensive error handling
- ✅ CLI interface
- ✅ Full TypeScript type safety

---

## References

- **Official API Docs:** https://openrouter.ai/docs
- **Model Catalog:** https://openrouter.ai/models
- **API Keys:** https://openrouter.ai/keys
- **Pricing:** https://openrouter.ai/docs/pricing
- **Provider Selection:** https://openrouter.ai/docs/guides/routing/provider-selection
- **Zero Data Retention:** https://openrouter.ai/docs/guides/features/zdr
- **Framework README:** `tools/api/openrouter/README.md` (legacy)
