---
name: context7
type: api-client
classification: public
description: Library documentation search with LLM-powered ranking via Context7 API
version: 1.0.0
last_updated: 2026-02-14
env_required: false
env_keys:
  - CONTEXT7_API_KEY
commands: []
---

> **FOR AI AGENTS:** Library documentation search and retrieval using official Context7 TypeScript SDK.
> Load when: User needs documentation for libraries (React, Next.js, etc.) or API references

---

# Context7 API Client

**Up-to-date library documentation search with LLM-powered relevance ranking**

Framework wrapper for the official Context7 TypeScript SDK, providing instant access to current library documentation with intelligent ranking for relevance.

---

## Classification

**Type:** api-client
**Visibility:** public
**Commands:** None (programmatic API and CLI scripts)

---

## Purpose

Enables instant access to library documentation:

1. **Library Search:** Find documentation by library name with LLM-powered ranking
2. **Context Retrieval:** Get relevant documentation snippets for specific queries
3. **Combined Workflow:** Search and retrieve in one call for convenience

**Why it exists:** Constantly checking official documentation sites is time-consuming and doesn't provide AI-optimized relevance ranking. Context7 maintains up-to-date docs with intelligent retrieval.

**Framework integration:** Advisory skill uses for language/framework reference during code reviews, write skill uses for technical accuracy verification.

---

## Usage

### Programmatic API

```typescript
import { searchLibrary, getContext, searchAndGetContext } from '@/tools/context7';

// 1. Search for libraries
const libraries = await searchLibrary(
  "I need to build a UI with components",
  "react"
);
console.log(libraries[0].id); // "/facebook/react"

// 2. Get documentation for a specific library
const docs = await getContext(
  "How do I use hooks?",
  "/facebook/react",
  { type: 'json' }  // or 'txt'
);
console.log(docs[0].title, docs[0].content);

// 3. Search and get docs in one call (convenience method)
const context = await searchAndGetContext(
  "authentication setup",
  "next.js",
  { type: 'txt', tokens: 1000 }
);
console.log(context);
```

### CLI Usage

```bash
# Search for libraries
bun tools/api/context7/client.ts search "UI components" react

# Get documentation by library ID
bun tools/api/context7/client.ts get "How do I use hooks?" /facebook/react --type=txt

# Quick search and get (convenience)
bun tools/api/context7/client.ts quick "authentication setup" next.js --type=txt --tokens=1000
```

---

## Configuration

### Environment Variables

**Optional (has free tier):**
```bash
# API key for higher rate limits (optional)
CONTEXT7_API_KEY=ctx7sk_your_api_key_here
```

**Setup:**
```bash
# Get API key from dashboard (optional)
# https://context7.com/dashboard

# Add to .env
echo "CONTEXT7_API_KEY=ctx7sk_..." >> .env
source .env
```

**Rate Limits:**
- **Free tier:** Rate limited (see dashboard for current limits)
- **With API key:** Higher rate limits
- **No authentication required** for basic usage

---

## Architecture

```
User Query
    ↓
Client (tools/api/context7/client.ts)
    ↓
Official SDK (@upstash/context7-sdk v0.3.0)
    ↓
Context7 API (https://context7.com)
    ↓
LLM-Powered Ranking + Documentation Retrieval
    ↓
Relevant Documentation Snippets
```

**Components:**
- **Client:** Framework wrapper providing convenience methods
- **Official SDK:** @upstash/context7-sdk (TypeScript, maintained by Upstash)
- **Context7 Service:** Maintains up-to-date library documentation

**Migration History:**
- Previous: Custom Python implementation (509 lines, removed)
- Current: Official TypeScript SDK (~150 lines, maintained)
- Benefits: Official maintenance, TypeScript support, better error handling

---

## API Reference

### `searchLibrary(query, libraryName)`

**Purpose:** Search for libraries with LLM-powered relevance ranking

**Parameters:**
- `query` (string, required): User's question for ranking (e.g., "I need authentication")
- `libraryName` (string, required): Library identifier (e.g., "react", "next.js")

**Returns:**
```typescript
Context7Library[] {
  id: string;        // e.g., "/facebook/react"
  name: string;      // Library display name
  score: number;     // Relevance score
}
```

**Example:**
```typescript
const libs = await searchLibrary("state management", "react");
// [{ id: "/facebook/react", name: "React", score: 0.95 }]
```

---

### `getContext(query, libraryId, options?)`

**Purpose:** Get documentation context for a specific library

**Parameters:**
- `query` (string, required): Question about the library
- `libraryId` (string, required): Library ID from searchLibrary (e.g., "/facebook/react")
- `options` (object, optional):
  - `type`: `'json' | 'txt'` (default: 'json')
  - `topic`: Optional topic filter
  - `tokens`: Maximum tokens to return

**Returns:**
- If `type: 'json'`: Array of documentation objects
  ```typescript
  {
    title: string;
    content: string;
    url?: string;
  }[]
  ```
- If `type: 'txt'`: Plain text string with concatenated documentation

**Example:**
```typescript
const docs = await getContext(
  "How do I use hooks?",
  "/facebook/react",
  { type: 'json', tokens: 2000 }
);
// [{ title: "Hooks API", content: "...", url: "..." }]
```

---

### `searchAndGetContext(query, libraryName, options?)`

**Purpose:** Convenience method combining searchLibrary + getContext

**Parameters:**
- `query` (string, required): Question about the library
- `libraryName` (string, required): Library name to search
- `options` (object, optional): Same as `getContext`

**Returns:** Documentation context from best matching library (string or array)

**Example:**
```typescript
const context = await searchAndGetContext(
  "authentication setup",
  "next.js",
  { type: 'txt', tokens: 1000 }
);
// Returns plain text documentation about Next.js authentication
```

---

## Scripts

| Script | Purpose |
|--------|---------|
| `client.ts` | Main client with three commands: search, get, quick |

**Usage:**
```bash
# Search libraries
bun client.ts search <query> <libraryName>

# Get documentation
bun client.ts get <query> <libraryId> [--type=json|txt] [--tokens=N]

# Combined workflow
bun client.ts quick <query> <libraryName> [--type=json|txt] [--tokens=N]
```

---

## Dependencies

**Runtime:**
- Bun (script execution)
- Official SDK: @upstash/context7-sdk v0.3.0

**Node packages:**
- `@upstash/context7-sdk` (official TypeScript SDK)

---

## Troubleshooting

### Rate Limit Exceeded

**Symptom:** Error message about rate limits

**Fix:**
```bash
# Get API key from dashboard
# https://context7.com/dashboard

# Add to .env
CONTEXT7_API_KEY=ctx7sk_your_key

# Source environment
source .env
```

### Library Not Found

**Symptom:** Empty results or error finding library

**Causes:**
- Library name typo
- Library not indexed by Context7
- Library has different canonical name

**Fix:**
```bash
# Try variations
bun client.ts search "UI components" react
bun client.ts search "UI components" reactjs
bun client.ts search "UI components" "facebook/react"

# Check Context7 website for indexed libraries
# https://context7.com/libraries
```

### SDK Import Error

**Symptom:** Cannot find module '@upstash/context7-sdk'

**Fix:**
```bash
# Install dependencies
cd tools/api/context7
bun install

# Verify installation
ls -la node_modules/@upstash/context7-sdk
```

### Context7Error

**Symptom:** API errors during requests

**Debug:**
```typescript
import { Context7Error } from '@upstash/context7-sdk';

try {
  const context = await getContext("query", "/invalid/library");
} catch (error) {
  if (error instanceof Context7Error) {
    console.error("Context7 API Error:", error.message);
    // Check: invalid library ID, network issues, service outage
  }
}
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Skills:**
- `skills/advisory/` — uses searchAndGetContext() for framework/library reference during code reviews
- `skills/write/` — uses searchAndGetContext() for technical accuracy verification

**Tools:**
- Context7 is invoked programmatically from skill workflows as a Tier 3 API source

No direct TypeScript importers confirmed in hooks — invoked programmatically from skill workflows.

---

## Related Tools

- **advisory** (skills/advisory/): Uses context7 for framework reference during code reviews
- **write** (skills/write/): Uses context7 for technical accuracy verification
- **nvd** (tools/nvd/): Complementary for vulnerability data

---

## Version History

- **1.0.0** (2026-01-29): Migration to official TypeScript SDK, replaced Python implementation

---

## References

- **Official Documentation:** https://context7.com/docs
- **TypeScript SDK Guide:** https://context7.com/docs/sdks/ts/getting-started
- **API Reference:** https://context7.com/docs/api-reference
- **GitHub Repository:** https://github.com/upstash/context7
- **NPM Package:** https://www.npmjs.com/package/@upstash/context7-sdk

---

**Framework:** Intelligence Adjacent (IA)
**Maintainer:** Framework Team
