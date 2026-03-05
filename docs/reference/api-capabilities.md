---
audience: intermediate
category: reference
---


# API Capabilities Matrix

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Purpose:** Quick reference for API capabilities, limits, and characteristics

---

## Comprehensive Comparison

| API | Data Type | Unique Value Proposition | Rate Limits | Auth Method | Cost | Fallback | Avg Response Time |
|-----|-----------|-------------------------|-------------|-------------|------|----------|-------------------|
| **NVD** | CVE Database (JSON) | Structured CVE data with CVSS scores, official vulnerability database | 5 req/30s (no key)<br/>50 req/30s (with key) | Optional API key in header | Free | None | 2-5 seconds |
| **Grok** | LLM Analysis (Markdown) | AI-powered research synthesis, novel technique discovery, test case generation | Varies by OpenRouter tier<br/>(~10 req/min free) | Required: Bearer token | $0.10-$0.30 per session | Claude Haiku | 30-90 seconds |
| **Context7** | Documentation Search (JSON) | 50K+ authoritative sources, official docs, standards, RFCs | 100 req/day (free)<br/>1000 req/day (pro) | Optional API key in query param | Free (100/day)<br/>Paid (1000/day) | WebSearch | 3-8 seconds |
| **WebSearch** | Web Search (Markdown) | Built-in Claude tool, unlimited usage, recent news and discussions | None (built-in) | None (built-in) | Free | None | 5-15 seconds |

---

## Data Type Details

### NVD (JSON)

**Schema:**
```json
{
  "vulnerabilities": [
    {
      "cve": {
        "id": "CVE-YYYY-NNNNN",
        "descriptions": [{ "lang": "en", "value": "..." }],
        "published": "ISO-8601-date",
        "metrics": {
          "cvssV3": [{
            "cvssData": {
              "baseScore": 0.0-10.0,
              "baseSeverity": "LOW|MEDIUM|HIGH|CRITICAL",
              "vectorString": "CVSS:3.x/..."
            }
          }]
        },
        "references": [{ "url": "...", "source": "..." }]
      }
    }
  ]
}
```

**Strengths:**
- Structured, machine-readable
- CVSS scoring for prioritization
- Official CVE IDs for tracking
- Historical data (full CVE history)

**Limitations:**
- CVEs only (no general security info)
- Lags behind zero-days (weeks to months)
- No synthesis or analysis

### Grok (Markdown)

**Format:**
```markdown
## Analysis Title

### Key Findings
- Finding 1 with [source](url)
- Finding 2 with [source](url)

### Vulnerabilities
1. **CVE-2024-12345**: Description
   - Impact: High
   - Remediation: ...

### Test Cases
...

Sources:
- [Source 1](url)
- [Source 2](url)
```

**Strengths:**
- LLM-powered synthesis and analysis
- Novel technique discovery (not in databases)
- Test case generation
- Source attribution

**Limitations:**
- Requires paid API (OpenRouter)
- Slower than database lookups (30-90s)
- May hallucinate (requires validation)
- Non-deterministic output

### Context7 (JSON)

**Schema:**
```json
{
  "results": [
    {
      "title": "...",
      "url": "...",
      "content": "excerpt...",
      "source": "domain.com",
      "relevance": 0.0-1.0,
      "publishedDate": "ISO-8601-date",
      "documentType": "official|community|vendor|standard"
    }
  ],
  "totalResults": 123,
  "queryId": "..."
}
```

**Strengths:**
- Authoritative sources (official docs, RFCs, standards)
- Document type classification
- Relevance scoring
- 50K+ curated sources

**Limitations:**
- Free tier: 100 req/day limit
- No CVE-specific data
- Lags behind very recent docs (hours to days)

### WebSearch (Markdown)

**Format:**
```markdown
Search Results:

1. [Title](url) - Snippet...
   Published: Date

2. [Title](url) - Snippet...
```

**Strengths:**
- Built-in (no setup)
- Unlimited usage
- Most recent content (real-time indexing)
- Broad coverage (entire web)

**Limitations:**
- No structured data
- Lower authority than Context7 (no curation)
- Markdown parsing required
- No relevance scoring

---

## Rate Limits Detailed

### NVD

| Tier | Requests per 30s | Requests per Day | API Key Required | Cost |
|------|-----------------|------------------|------------------|------|
| Free (no key) | 5 | 10,000 | No | Free |
| API Key | 50 | 100,000 | Yes (free to request) | Free |

**Recommendation:** Request API key (free) for 10x rate limit increase

**Retry Strategy:** Exponential backoff on 429, max 10 retries

### Grok (via OpenRouter)

| Tier | Rate Limit | Cost per 1M Input Tokens | Cost per 1M Output Tokens | API Key Required |
|------|------------|-------------------------|--------------------------|------------------|
| Free | ~10 req/min | Varies by model | Varies by model | Yes |
| Paid | Much higher | ~$1-5 (model dependent) | ~$5-15 (model dependent) | Yes |

**Typical Session:** 2K-5K tokens → $0.10-$0.30 per research session

**Recommendation:** Monitor OpenRouter dashboard for rate limits and costs

**Retry Strategy:** 429 → Wait 60s → Retry once → Fallback to Haiku

### Context7

| Tier | Requests per Day | Requests per Minute | API Key Required | Cost |
|------|-----------------|---------------------|------------------|------|
| Free | 100 | 10 | No (optional for tracking) | Free |
| Pro | 1,000 | 60 | Yes | Paid |

**Recommendation:** Free tier sufficient for most use cases (100/day)

**Retry Strategy:** 429 → Wait 60s → Retry once → Fallback to WebSearch

### WebSearch

| Tier | Rate Limit | Cost | API Key Required |
|------|------------|------|------------------|
| Built-in | None (unlimited) | Free | No |

**Recommendation:** Primary free source, no limits

**Retry Strategy:** Failure is CRITICAL (likely Claude API issue)

---

## Authentication Methods

### NVD

**Method:** Optional API key in request header

**Setup:**
```bash
# .env
NVD_API_KEY=[insert key]  # Optional, but recommended
```

**Request Example:**
```typescript
const headers = process.env.NVD_API_KEY
  ? { 'apiKey': process.env.NVD_API_KEY }
  : {};

fetch('https://services.nvd.nist.gov/rest/json/cves/2.0', {
  headers
});
```

**Get Key:** https://nvd.nist.gov/developers/request-an-api-key (free)

### Grok (OpenRouter)

**Method:** Required Bearer token in Authorization header

**Setup:**
```bash
# .env
OPENROUTER_API_KEY=[insert key]  # REQUIRED for Tier 3
```

**Request Example:**
```typescript
const headers = {
  'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
  'HTTP-Referer': 'https://intelligence-adjacent.com',
  'Content-Type': 'application/json'
};

fetch('https://openrouter.ai/api/v1/chat/completions', {
  headers,
  body: JSON.stringify({ ... })
});
```

**Get Key:** https://openrouter.ai/keys (requires account, free tier available)

### Context7

**Method:** Optional API key in query parameter

**Setup:**
```bash
# .env
CONTEXT7_API_KEY=[insert key]  # Optional
```

**Request Example:**
```typescript
const url = process.env.CONTEXT7_API_KEY
  ? `https://api.context7.com/search?apiKey=${process.env.CONTEXT7_API_KEY}&q=...`
  : `https://api.context7.com/search?q=...`;  // Free tier

fetch(url);
```

**Get Key:** https://context7.com/pricing (free tier: no key needed)

### WebSearch

**Method:** None (built-in Claude tool)

**Setup:** None required

**Usage:** Via Claude Code orchestrator (automatic)

---

## Cost Analysis

### Per-Session Cost (Tier 3)

| API | Typical Usage | Cost per Session | Notes |
|-----|---------------|------------------|-------|
| NVD | 1-3 requests | $0 | Free (all tiers) |
| Grok | 2K-5K tokens | $0.10-$0.30 | Model dependent (Grok 3 most expensive) |
| Context7 | 1-2 requests | $0 | Free tier (100/day) |
| WebSearch | 1-2 searches | $0 | Built-in (unlimited) |
| **Total** | - | **$0.15-$0.50** | Dominated by Grok cost |

### Monthly Cost Estimates

**Light Usage** (5 Tier 3 sessions/month):
- Grok: 5 × $0.20 = $1.00
- All others: Free
- **Total: $1.00/month**

**Medium Usage** (20 Tier 3 sessions/month):
- Grok: 20 × $0.20 = $4.00
- All others: Free
- **Total: $4.00/month**

**Heavy Usage** (100 Tier 3 sessions/month):
- Grok: 100 × $0.25 = $25.00
- Context7: May exceed free tier (100/day) → $10-20/month if Pro needed
- All others: Free
- **Total: $25-45/month**

**Note:** Context7 free tier is 100/day, so heavy usage typically stays within free limits

---

## Fallback Chains

### Context7 → WebSearch

**Trigger:** Context7 rate limit exceeded or no results

**Impact:** -10% quality (lose authoritative source priority)

**Mitigation:** WebSearch still provides documentation, just less curated

**Example:**
```typescript
let docResults;
try {
  docResults = await context7Client.query(query);
} catch (error) {
  if (error.code === 'RATE_LIMIT' || error.code === 'NO_RESULTS') {
    console.warn('Context7 unavailable, falling back to WebSearch');
    docResults = await webSearchClient.search(query + ' official documentation');
  }
}
```

### Grok → Claude Haiku

**Trigger:** Grok rate limit, timeout, or model unavailable

**Impact:** -15% quality (lose Grok's advanced reasoning, but Haiku still synthesizes)

**Mitigation:** Haiku faster and cheaper, suitable for synthesis

**Example:**
```typescript
let synthesis;
try {
  synthesis = await grokClient.research(query);
} catch (error) {
  if (error.code === 'RATE_LIMIT' || error.code === 'TIMEOUT') {
    console.warn('Grok unavailable, falling back to Claude Haiku');
    synthesis = await haikuClient.synthesize(dedupedSources);
  }
}
```

### No Fallback (Critical APIs)

**NVD:** No fallback (no alternative CVE database)
- **Impact if fails:** -30% quality (lose structured CVE data)
- **Action:** Continue with partial results, mark "CVE data unavailable"

**WebSearch:** No fallback (built-in tool, should never fail)
- **Impact if fails:** CRITICAL (likely Claude API issue)
- **Action:** Stop execution, report error

---

## Response Time Analysis

Based on Test B execution data:

| API | Min Response Time | Avg Response Time | Max Response Time | Timeout Setting |
|-----|------------------|-------------------|-------------------|-----------------|
| NVD | 1.5s | 3.2s | 8.5s | 30s |
| Grok | 25s | 52s | 120s | 180s |
| Context7 | 2s | 5.1s | 15s | 30s |
| WebSearch | 3s | 8.7s | 25s | 60s |

**Total Parallel Execution:** Max(all) ≈ 120s (dominated by Grok)

**Sequential Would Be:** 3.2s + 52s + 5.1s + 8.7s = 69s minimum, 163s average, 353s max

**Parallel Advantage:** 4x faster on average (69s → 120s vs 163s)

---

## Data Freshness

| API | Update Frequency | Lag Time | Use Case |
|-----|-----------------|----------|----------|
| NVD | Daily (CVE updates) | Hours to weeks (CVE disclosure → NVD publication) | Historical CVE research, not zero-days |
| Grok | Real-time (LLM knowledge) | Varies (knowledge cutoff + real-time retrieval) | Novel technique analysis, synthesis |
| Context7 | Hourly (doc indexing) | Hours to days (doc publication → Context7 index) | Authoritative documentation |
| WebSearch | Real-time | Minutes (web crawling) | Recent news, blog posts, discussions |

**For Zero-Days:** WebSearch most current → Grok analysis → NVD (after CVE assigned)

**For Historical Research:** NVD most reliable → Context7 official docs → WebSearch community analysis

---

## Unique Strengths by Use Case

### CVE Discovery
**Winner:** NVD
- Structured data with CVSS scores
- Official CVE IDs for tracking
- Historical completeness

**Fallback:** WebSearch (CVE mentions, but unstructured)

### Novel Technique Research
**Winner:** Grok
- LLM synthesis across sources
- Not limited to disclosed CVEs
- Discovers patterns and trends

**Fallback:** WebSearch + manual analysis

### Authoritative Documentation
**Winner:** Context7
- 50K+ curated official sources
- Document type classification
- High relevance scoring

**Fallback:** WebSearch (less curated, but broader)

### Recent News/Discussions
**Winner:** WebSearch
- Real-time indexing
- Broad coverage (blogs, forums, social)
- Unlimited usage

**No Clear Fallback:** Most current source available

### Test Case Generation
**Winner:** Grok
- LLM-powered code generation
- Understands context and vulnerabilities
- Actionable test cases

**No Alternative:** Only API with this capability

---

## Integration Recommendations

### For Security Workflows
**Primary:** NVD (CVE data) + Grok (synthesis) + WebSearch (recent intel)
**Optional:** Context7 if researching specific frameworks

### For Advisory Workflows
**Primary:** Context7 (authoritative docs) + WebSearch (community) + Grok (synthesis)
**Optional:** NVD if CVE-focused

### For Compliance Workflows
**Primary:** Context7 (regulatory docs) + NVD (vulnerability data) + Grok (control mapping)
**Optional:** WebSearch for industry guidance

---

## Quick Reference Commands

### Test All API Connections
```bash
bun tools/nvd/test-connection.ts
bun tools/api/openrouter/test-grok.ts
bun tools/api/context7/test-connection.ts
# WebSearch: No test needed (built-in)
```

### Check Rate Limit Status
```bash
# NVD (no built-in check, monitor 429 responses)
# OpenRouter: https://openrouter.ai/activity
# Context7: https://context7.com/dashboard
```

### Cost Estimation
```typescript
import { estimateCost } from '@/tools/api/orchestrator';

const estimate = estimateCost({
  topic: 'GraphQL security',
  tier: 3,
  expectedTokens: 3000  // Optional
});

console.log(`Estimated cost: $${estimate.total}`);
// Estimated cost: $0.18 (Grok: $0.18, others: $0)
```

---

## Version History

**1.0.0 (2026-01-24):**
- Initial release
- 4 APIs documented (NVD, Grok, Context7, WebSearch)
- Rate limits, auth methods, fallback chains
- Cost analysis and response times from Test B

---

## References

- **Architecture:** See `docs/` directory for complete technical documentation
- **Error Handling:** See `tools/api/` directory for API utilities and error recovery

---

**Framework:** ▲ Intelligence Adjacent (IA)
**Version:** 1.0.0
**Last Updated:** 2026-01-24
