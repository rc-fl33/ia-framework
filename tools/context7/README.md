# Context7 API Client

**Status:** ✅ Implemented using official SDK
**Version:** 1.0.0 (SDK: @upstash/context7-sdk v0.3.0)
**Last Updated:** 2026-01-29

---

## Overview

Framework wrapper for the official Context7 TypeScript SDK, providing access to up-to-date library documentation with LLM-powered ranking.

**Official SDK:** [@upstash/context7-sdk](https://www.npmjs.com/package/@upstash/context7-sdk)
**Documentation:** https://context7.com/docs/sdks/ts/getting-started

---

## Installation

```bash
cd tools/api/context7
bun install  # SDK already added: @upstash/context7-sdk
```

---

## Authentication

**Environment Variable (Recommended):**
```bash
# Add to .env
CONTEXT7_API_KEY=ctx7sk_your_api_key_here
```

**Get API Key:** https://context7.com/dashboard

**Rate Limits:**
- Free tier: Rate limited (see dashboard)
- With API key: Higher limits

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

## API Reference

### `searchLibrary(query, libraryName)`

Search for libraries with LLM-powered relevance ranking.

**Parameters:**
- `query` (string) - User's question for ranking (e.g., "I need authentication")
- `libraryName` (string) - Library identifier (e.g., "react", "next.js")

**Returns:** Array of `Context7Library` objects with IDs like `"/facebook/react"`

### `getContext(query, libraryId, options?)`

Get documentation context for a specific library.

**Parameters:**
- `query` (string) - Question about the library
- `libraryId` (string) - Library ID from searchLibrary
- `options` (optional):
  - `type`: `'json' | 'txt'` (default: json)
  - `topic`: Optional topic filter
  - `tokens`: Maximum tokens to return

**Returns:** Documentation snippets (JSON array or plain text string)

### `searchAndGetContext(query, libraryName, options?)`

Convenience method combining search + get.

**Parameters:**
- `query` (string) - Question about the library
- `libraryName` (string) - Library name to search
- `options` (optional) - Same as `getContext`

**Returns:** Documentation context from best matching library

---

## Error Handling

```typescript
import { Context7Error } from '@upstash/context7-sdk';

try {
  const context = await getContext("query", "/invalid/library");
} catch (error) {
  if (error instanceof Context7Error) {
    console.error("Context7 API Error:", error.message);
  }
}
```

---

## Migration from Python Client

**Old location:** `tools/context7/docs.py` (509 lines, removed)
**New location:** `tools/api/context7/client.ts` (using official SDK)

**Benefits:**
- Official SDK maintenance and updates
- Full TypeScript support
- Simpler codebase (~150 lines vs 509 lines)
- Better error handling with `Context7Error`
- Maintained as canonical library API implementation

---

## References

- **Official Docs:** https://context7.com/docs
- **TypeScript SDK Guide:** https://context7.com/docs/sdks/ts/getting-started
- **API Reference:** https://context7.com/docs/api-reference
- **GitHub:** https://github.com/upstash/context7
