# OpenRouter API Client

**Status:** ✅ Unified TypeScript implementation
**Version:** 1.0.0
**Last Updated:** 2026-01-29

---

## Overview

Unified OpenRouter API client for all framework skills requiring multi-model API access.

**API Documentation:** https://openrouter.ai/docs

---

## Features

- ✅ Single and parallel model execution
- ✅ Automatic retry with exponential backoff
- ✅ Session tracking (requests, tokens, cost)
- ✅ Cost estimation per model
- ✅ API key validation
- ✅ TypeScript with full type safety
- ✅ Comprehensive error handling

---

## Installation

```bash
cd tools/api/openrouter
bun install  # No external dependencies needed
```

---

## Authentication

**Environment Variable (Recommended):**
```bash
# Add to .env
OPENROUTER_API_KEY=[insert your OpenRouter API key]
```

**Get API Key:** https://openrouter.ai/keys

**Rate Limits:** Varies by model (check openrouter.ai/models)

---

## Usage

### 1. Class-Based API (Recommended)

```typescript
import { OpenRouterClient } from '@/tools/openrouter';

const client = new OpenRouterClient();

// Single model call
const result = await client.call(
  'anthropic/claude-sonnet-4.5',
  'Explain quantum computing',
  {
    temperature: 0.7,
    max_tokens: 2000,
    systemPrompt: 'You are a physics expert.',
    retries: 3  // Automatic retry on failure
  }
);

if (result.status === 'success') {
  console.log(result.content);
  console.log(`Tokens: ${result.tokens.total_tokens}`);
  console.log(`Cost: $${result.cost}`);
}

// Parallel execution (multiple models)
const models = [
  'anthropic/claude-sonnet-4.5',
  'x-ai/grok-4-fast',
  'google/gemini-2.0-flash-001'
];

const results = await client.callParallel(models, 'What is AI?');

// Session statistics
const stats = client.getSessionStats();
console.log(`Total requests: ${stats.requests}`);
console.log(`Total tokens: ${stats.totalTokens}`);
console.log(`Total cost: $${stats.totalCost.toFixed(4)}`);
```

### 2. Standalone Function

```typescript
import { callModel } from '@/tools/openrouter';

const result = await callModel(
  'deepseek-chat',
  'Write hello world in Python'
);

console.log(result.content);
```

### 3. CLI Usage

```bash
# Basic usage
bun tools/api/openrouter/client.ts deepseek-chat "Explain quantum computing"

# With options
bun tools/api/openrouter/client.ts anthropic/claude-sonnet-4.5 \
  "Write a Rust function" \
  --temperature=0.3 \
  --max-tokens=1000

# Test free models
bun tools/api/openrouter/client.ts deepseek-chat "Hello, world!"
```

---

## API Reference

### `OpenRouterClient`

#### Constructor Options
```typescript
interface OpenRouterClientOptions {
  apiKey?: string;        // Defaults to OPENROUTER_API_KEY env var
  timeout?: number;       // Request timeout (default: 120000ms)
  referer?: string;       // HTTP Referer header
  appTitle?: string;      // X-Title header
}
```

#### Methods

**`call(model, prompt, options?)`**
- Call a single model with automatic retry
- Returns: `Promise<ModelCallResult>`

**`callParallel(models, prompt, options?)`**
- Call multiple models in parallel
- Returns: `Promise<ModelCallResult[]>`

**`retryFailed(failedResults, prompt, options?)`**
- Retry only failed calls from a previous batch
- Returns: `Promise<ModelCallResult[]>`

**`validateApiKey()`**
- Test API key with a quick free call
- Returns: `Promise<boolean>`

**`getSessionStats()`**
- Get current session statistics
- Returns: Session stats with request count, tokens, cost

**`resetSessionStats()`**
- Reset session tracking

---

## Popular Models

### Free Models (Testing)
- `deepseek-chat` - Fast, free for testing

### Premium Models
- `anthropic/claude-sonnet-4.5` - Best for coding
- `anthropic/claude-opus-4` - Best for complex reasoning
- `x-ai/grok-4-fast` - Fast Grok model
- `google/gemini-2.0-flash-001` - Google's latest
- `openai/gpt-4-turbo` - OpenAI GPT-4

**Full model list:** https://openrouter.ai/models

---

## Error Handling

```typescript
const result = await client.call('model-name', 'prompt');

if (result.status === 'error') {
  console.error(`Model failed: ${result.error}`);
  // Handle error
} else {
  console.log(result.content);
}
```

---

## Cost Estimation

The client automatically estimates costs based on token usage:

```typescript
const result = await client.call('anthropic/claude-sonnet-4.5', 'Hello');
console.log(`Estimated cost: $${result.cost?.toFixed(6)}`);
```

**Cost rates (per 1M tokens, approximate):**
- Grok: $5/1M
- Claude: $3/1M
- GPT-4: $10/1M
- Gemini: $2/1M
- Deepseek: $0.1/1M

---

## Migration from Old Clients

**Current location:**
- `tools/api/openrouter/client.ts`

**Import:**
```typescript
import { callModel } from '@/tools/openrouter';
// OR
import { OpenRouterClient } from '@/tools/openrouter';
```

---

## Testing

See `tools/api/__tests__/openrouter.test.ts` for integration tests.

```bash
bun tools/api/__tests__/openrouter.test.ts
```

---

## References

- **Official Docs:** https://openrouter.ai/docs
- **Models:** https://openrouter.ai/models
- **API Keys:** https://openrouter.ai/keys
- **Pricing:** https://openrouter.ai/docs/pricing
