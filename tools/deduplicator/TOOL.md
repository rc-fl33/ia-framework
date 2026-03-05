---
name: deduplicator
type: utility
classification: public
description: Cross-source result deduplication - removes duplicate research sources by URL normalization, CVE ID, and content hash
version: 1.0.0
last_updated: 2026-02-17
env_required: false
env_keys: []
commands: []
---

> **FOR AI AGENTS:** Cross-source deduplication engine for research results from multiple APIs.
> Load when: Multiple API sources (NVD, Grok, Context7, WebSearch) return overlapping results that need merging.

# Deduplicator

**Cross-source result deduplication by URL normalization, CVE ID, and content hash**

Removes duplicate research sources when multiple APIs (NVD, Grok, Context7, WebSearch) return the same vulnerability or document. Merges duplicate entries with priority-based source selection and freshness scoring.

---

## Purpose

When security research runs against 3-4 APIs simultaneously, the same CVE entry or web article often appears in multiple results. Deduplication:

- **URL normalization** - Strips trailing slashes, upgrades HTTP to HTTPS, removes `www.`, lowercases
- **CVE ID deduplication** - Groups all entries for the same CVE ID regardless of source
- **Content hashing** - SHA-256 hash deduplication for entries without URLs
- **Priority merging** - Keeps Context7 > NVD > Grok > WebSearch as primary, merges metadata from duplicates
- **Freshness scoring** - Scores sources by publication date recency
- **HTTP request deduplication** - `DeduplicateHTTPClient` prevents duplicate concurrent API calls (thundering herd protection)

**Expected deduplication rate:** 10-30% of total sources removed.

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

No direct TypeScript importers currently — planned for use by the research orchestrator.

*(Future consumer: `tools/research/orchestrator.ts` — deduplicates combined API results)*

---

## Usage

```typescript
import {
  deduplicateSources,
  DeduplicateHTTPClient,
  normalizeUrl,
  urlSimilarity,
  hashContent,
  mergeSources,
  calculateFreshness,
  getSourcePriority,
} from '@/tools/deduplicator/deduplicator';

// Deduplicate research sources
const rawSources = [
  { url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-12345', sourceType: 'nvd', ... },
  { url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-12345/', sourceType: 'grok', ... }, // Duplicate
  { url: 'https://example.com/article', sourceType: 'websearch', ... },
];

const result = deduplicateSources(rawSources);
// { original: [...], deduplicated: [...], deduplicationRate: 25 }
console.log(`${result.original.length} → ${result.deduplicated.length} (${result.deduplicationRate}% removed)`);

// HTTP request deduplication
const client = new DeduplicateHTTPClient();
const p1 = client.fetch('https://api.example.com/data');
const p2 = client.fetch('https://api.example.com/data'); // Same promise as p1
// Only ONE actual fetch occurs

// URL normalization
normalizeUrl('HTTP://WWW.EXAMPLE.COM/page/');
// → 'https://example.com/page'

// URL similarity
urlSimilarity('http://example.com/page', 'https://www.example.com/page/');
// → 1.0 (identical after normalization)
```

---

## File Structure

```
tools/deduplicator/
├── deduplicator.ts    # Deduplication engine + HTTP client
└── TOOL.md            # This file
```

---

## Source Priority Order

| Priority | Source | Reason |
|----------|--------|--------|
| 1 | context7 | Authoritative library documentation |
| 2 | nvd | Official CVE database |
| 3 | grok | LLM-powered analysis |
| 4 | websearch | General web sources |

---

## Dependencies

**Runtime:** Bun, `crypto` (built-in for SHA-256 hashing)
**Related types:** `tools/api/types.ts` (ResearchSource, DeduplicationResult, APISourceType)
**Used by:** Research orchestrator (planned)

---

## Related Tools

- **tools/research** - Orchestrator that calls deduplicator after parallel API execution
- **tools/nvd** - NVD data source (one of the deduplicated APIs)
- **tools/context7** - Context7 data source (highest priority in merge)

---

**Framework:** Intelligence Adjacent (IA)
