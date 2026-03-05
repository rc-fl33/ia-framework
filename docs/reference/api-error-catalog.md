---
audience: intermediate
category: reference
---


# API Error Catalog

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Purpose:** Comprehensive error reference for multi-API research workflows

---

## Error Matrix

| API | Error Code | HTTP Status | Cause | Recovery Strategy | Max Retries | Severity | Expected Frequency |
|-----|------------|-------------|-------|-------------------|-------------|----------|-------------------|
| **NVD** | `RATE_LIMIT` | 429 | Rate limit exceeded (5 req/30s no key, 50 req/30s with key) | Exponential backoff (1s, 2s, 4s, 8s, 16s, 32s) | 10 | Medium | 5-10% (no key) |
| NVD | `SERVICE_UNAVAILABLE` | 503 | NVD maintenance or outage | Retry with 5s delay | 3 | High | <1% |
| NVD | `INVALID_QUERY` | 400 | Malformed query parameters | Log error, continue with partial | 0 | Low | <1% |
| NVD | `TIMEOUT` | - | Request took > 30s | Retry with increased timeout | 2 | Medium | <2% |
| NVD | `NETWORK_ERROR` | - | Network connectivity issue | Check connection, retry | 3 | High | <1% |
| **Grok** | `RATE_LIMIT` | 429 | OpenRouter rate limit exceeded | Wait 60s, retry once, fallback to Haiku | 1 | Medium | 5-15% (free tier) |
| Grok | `AUTH_FAILED` | 401 | Invalid or missing OPENROUTER_API_KEY | **STOP** - Fix .env | 0 | **Critical** | 0% (if configured) |
| Grok | `MODEL_UNAVAILABLE` | 503 | Grok model not available | Fallback to Haiku immediately | 0 | Medium | <5% |
| Grok | `TIMEOUT` | - | Request took > 180s | Retry with reduced context | 2 | Medium | 2-5% |
| Grok | `CONTENT_POLICY` | 400 | Query violates content policy | Log error, continue with partial | 0 | Low | <1% |
| Grok | `INSUFFICIENT_CREDITS` | 402 | OpenRouter balance depleted | **STOP** - Add credits | 0 | **Critical** | 0% (if monitored) |
| **Context7** | `RATE_LIMIT` | 429 | Free tier: 100 req/day exceeded | Wait 60s, retry once, fallback to WebSearch | 1 | Medium | 10-20% (heavy usage) |
| Context7 | `NO_RESULTS` | 200 | Query returned 0 results | Fallback to WebSearch | 0 | Low | 5-10% |
| Context7 | `INVALID_QUERY` | 400 | Malformed query | Log error, fallback to WebSearch | 0 | Low | <1% |
| Context7 | `SERVICE_ERROR` | 500 | Context7 internal error | Retry with 5s delay, then fallback | 3 | Medium | <2% |
| Context7 | `TIMEOUT` | - | Request took > 30s | Retry once, then fallback | 1 | Medium | <2% |
| **WebSearch** | `TIMEOUT` | - | Search took > 60s | Retry once | 1 | High | <1% |
| WebSearch | `SEARCH_FAILED` | - | Built-in tool failed | **CRITICAL** - Likely Claude API issue | 0 | **Critical** | <0.1% |
| WebSearch | `NO_RESULTS` | 200 | Query returned 0 results | Log warning, continue | 0 | Low | <2% |

---

## Error Details by API

### NVD Errors

#### RATE_LIMIT (429)

**Full Error:**
```json
{
  "error": "Rate limit exceeded",
  "message": "Maximum requests per 30 seconds exceeded",
  "retryAfter": 15
}
```

**Causes:**
- No API key: Exceeded 5 requests/30s
- With API key: Exceeded 50 requests/30s
- Burst requests without delay

**Recovery Strategy:**
```typescript
async function handleNVDRateLimit(attempt: number): Promise<void> {
  const backoffSeconds = Math.pow(2, attempt); // 1, 2, 4, 8, 16, 32
  console.log(`NVD rate limit hit, waiting ${backoffSeconds}s (attempt ${attempt}/10)`);
  await sleep(backoffSeconds * 1000);
}
```

**Prevention:**
- Request free API key → 10x rate limit increase
- Implement request queue with 1s minimum delay
- Batch queries when possible

**Expected Frequency:**
- No key: 5-10% of sessions (with parallel calls)
- With key: <1% of sessions

#### SERVICE_UNAVAILABLE (503)

**Full Error:**
```json
{
  "error": "Service unavailable",
  "message": "NVD is currently undergoing maintenance"
}
```

**Causes:**
- Scheduled NVD maintenance (rare)
- Unexpected outage
- Database overload

**Recovery Strategy:**
```typescript
// Retry 3 times with 5s delay
for (let i = 0; i < 3; i++) {
  try {
    return await nvdClient.search(query);
  } catch (error) {
    if (error.code === 'SERVICE_UNAVAILABLE' && i < 2) {
      await sleep(5000);
      continue;
    }
    // After 3 failures: Continue with partial results
    console.error('NVD unavailable, continuing without CVE data');
    return { cveCount: 0, reason: 'NVD unavailable' };
  }
}
```

**Impact:** -30% quality (lose structured CVE data)

**Expected Frequency:** <1% (NVD has high uptime)

#### TIMEOUT

**Causes:**
- Large result set (>1000 CVEs)
- Network latency
- NVD slow response

**Recovery Strategy:**
```typescript
// Increase timeout from 30s to 60s
const results = await nvdClient.search(query, { timeout: 60000 });
```

**Prevention:**
- Narrow date ranges (smaller result sets)
- Use `resultsPerPage` to limit response size

**Expected Frequency:** <2%

---

### Grok (OpenRouter) Errors

#### RATE_LIMIT (429)

**Full Error:**
```json
{
  "error": {
    "message": "Rate limit exceeded",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
```

**Causes:**
- Free tier: ~10 requests/minute exceeded
- Paid tier: Account-specific limits
- Burst requests

**Recovery Strategy:**
```typescript
try {
  return await grokClient.research(query);
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    console.warn('Grok rate limit, waiting 60s...');
    await sleep(60000);

    try {
      return await grokClient.research(query); // Retry once
    } catch (retryError) {
      console.warn('Grok still unavailable, falling back to Haiku');
      return await haikuClient.synthesize(sources); // Fallback
    }
  }
}
```

**Impact:** -15% quality if fallback to Haiku (lose Grok's advanced reasoning)

**Expected Frequency:**
- Free tier: 5-15%
- Paid tier: <1%

#### AUTH_FAILED (401)

**Full Error:**
```json
{
  "error": {
    "message": "Invalid authentication credentials",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}
```

**Causes:**
- `OPENROUTER_API_KEY` missing from `.env`
- Invalid/expired API key
- Typo in API key

**Recovery Strategy:**
```typescript
if (error.code === 'AUTH_FAILED') {
  console.error('CRITICAL: OpenRouter authentication failed');
  console.error('Check OPENROUTER_API_KEY in .env file');
  console.error('Get API key: https://openrouter.ai/keys');
  process.exit(1); // STOP - don't continue without auth
}
```

**Severity:** CRITICAL (Tier 3 requires Grok, can't fallback without auth)

**Prevention:**
- Pre-execution checklist: Test Grok connection
- Validate env vars before starting

**Expected Frequency:** 0% (if properly configured)

#### MODEL_UNAVAILABLE (503)

**Full Error:**
```json
{
  "error": {
    "message": "Model is currently unavailable",
    "type": "server_error",
    "code": "model_unavailable"
  }
}
```

**Causes:**
- Grok model temporarily offline
- High demand (capacity limits)
- Model deployment/maintenance

**Recovery Strategy:**
```typescript
if (error.code === 'MODEL_UNAVAILABLE') {
  console.warn('Grok model unavailable, falling back to Haiku immediately');
  return await haikuClient.synthesize(sources);
}
```

**Impact:** -15% quality (Haiku still capable, but not as advanced)

**Expected Frequency:** <5%

#### TIMEOUT

**Causes:**
- Large context (>10K tokens)
- Complex synthesis task
- Model slow response

**Recovery Strategy:**
```typescript
try {
  return await grokClient.research(query, { timeout: 180000 });
} catch (error) {
  if (error.code === 'TIMEOUT') {
    // Retry with reduced context (drop low-relevance sources)
    const reducedSources = sources.slice(0, 20); // Top 20 only
    return await grokClient.research(query, { sources: reducedSources, timeout: 180000 });
  }
}
```

**Prevention:**
- Limit context size (max 5K tokens)
- Use summarization for large datasets

**Expected Frequency:** 2-5%

#### INSUFFICIENT_CREDITS (402)

**Full Error:**
```json
{
  "error": {
    "message": "Insufficient credits",
    "type": "payment_error",
    "code": "insufficient_credits"
  }
}
```

**Causes:**
- OpenRouter balance depleted
- Payment method declined

**Recovery Strategy:**
```typescript
if (error.code === 'INSUFFICIENT_CREDITS') {
  console.error('CRITICAL: OpenRouter credits depleted');
  console.error('Add credits: https://openrouter.ai/credits');
  process.exit(1); // STOP - can't continue without credits
}
```

**Severity:** CRITICAL

**Prevention:**
- Monitor OpenRouter dashboard regularly
- Set up low-balance alerts

**Expected Frequency:** 0% (if monitored)

---

### Context7 Errors

#### RATE_LIMIT (429)

**Full Error:**
```json
{
  "error": "Rate limit exceeded",
  "message": "Free tier: 100 requests per day exceeded",
  "resetAt": "2026-01-25T00:00:00Z"
}
```

**Causes:**
- Free tier: Exceeded 100 requests/day
- Free tier: Exceeded 10 requests/minute

**Recovery Strategy:**
```typescript
if (error.code === 'RATE_LIMIT') {
  console.warn('Context7 rate limit, falling back to WebSearch');
  return await webSearchClient.search(query + ' official documentation');
}
```

**Impact:** -10% quality (WebSearch less curated, but still finds docs)

**Prevention:**
- Track daily usage (log requests)
- Upgrade to Pro tier if needed (1000/day)

**Expected Frequency:**
- Light usage (<5 sessions/day): <1%
- Heavy usage (>20 sessions/day): 10-20%

#### NO_RESULTS (200)

**Full Error:**
```json
{
  "results": [],
  "totalResults": 0,
  "message": "No documents found for query"
}
```

**Causes:**
- Query too specific (no matching docs)
- Topic not in Context7's 50K sources
- Typo in query

**Recovery Strategy:**
```typescript
if (results.totalResults === 0) {
  console.warn('Context7 returned no results, falling back to WebSearch');
  return await webSearchClient.search(query);
}
```

**Impact:** -5% quality (WebSearch will likely find something)

**Expected Frequency:** 5-10% (niche topics)

---

### WebSearch Errors

#### TIMEOUT

**Causes:**
- Network latency
- Claude API slow response
- Large search result set

**Recovery Strategy:**
```typescript
try {
  return await webSearchClient.search(query, { timeout: 60000 });
} catch (error) {
  if (error.code === 'TIMEOUT') {
    console.warn('WebSearch timeout, retrying once...');
    return await webSearchClient.search(query, { timeout: 90000 });
  }
}
```

**Expected Frequency:** <1%

#### SEARCH_FAILED

**Causes:**
- Claude API outage (rare)
- Built-in tool failure (very rare)
- Network completely down

**Recovery Strategy:**
```typescript
if (error.code === 'SEARCH_FAILED') {
  console.error('CRITICAL: WebSearch (built-in Claude tool) failed');
  console.error('This likely indicates a Claude API issue');
  console.error('Check: https://status.anthropic.com');
  process.exit(1); // STOP - can't continue without WebSearch
}
```

**Severity:** CRITICAL (WebSearch is foundational, no fallback)

**Expected Frequency:** <0.1% (extremely rare)

---

---

## Graceful Degradation Matrix

**Minimum Viable Results:** ≥2 API sources must succeed for Tier 3

| APIs Succeeded | Tier Achieved | Quality | Acceptable? | Action |
|---------------|---------------|---------|-------------|--------|
| 4/4 (all) | Tier 3 | 5/5 | ✅ Yes | Complete success |
| 3/4 | Tier 3 | 4.5/5 | ✅ Yes | Mark missing API, continue |
| 2/4 | Tier 2 (equivalent) | 4/5 | ⚠️ Marginal | Warn user, allow override |
| 1/4 | Tier 1 (equivalent) | 3/5 | ❌ No | Fail quality gate, retry or abort |
| 0/4 | Failed | 0/5 | ❌ No | Abort execution |

**Examples:**

✅ **Acceptable (3/4 APIs):**
- NVD + Grok + WebSearch succeeded, Context7 failed → Still comprehensive
- Grok + Context7 + WebSearch succeeded, NVD failed → Lost CVE data, but high quality otherwise

⚠️ **Marginal (2/4 APIs):**
- NVD + WebSearch succeeded → Tier 2 equivalent (acceptable for CVE-focused)
- Grok + Context7 succeeded → High quality, but low CVE count

❌ **Unacceptable (1/4 APIs):**
- Only WebSearch succeeded → Tier 1 (not Tier 3)
- Only NVD succeeded → CVEs with no context (incomplete)

---

## Error Logging and Debugging

### Standard Error Log Format

```typescript
interface ErrorLog {
  timestamp: string;
  api: 'nvd' | 'grok' | 'context7' | 'websearch';
  errorCode: string;
  httpStatus?: number;
  message: string;
  retryAttempt?: number;
  recoveryAction: string;
  impact: 'none' | 'minor' | 'moderate' | 'severe' | 'critical';
}
```

### Example Error Logs

```json
{
  "timestamp": "2026-01-24T22:00:00Z",
  "api": "nvd",
  "errorCode": "RATE_LIMIT",
  "httpStatus": 429,
  "message": "Rate limit exceeded (5 req/30s)",
  "retryAttempt": 3,
  "recoveryAction": "Exponential backoff: waiting 8s",
  "impact": "minor"
}

{
  "timestamp": "2026-01-24T22:01:30Z",
  "api": "grok",
  "errorCode": "MODEL_UNAVAILABLE",
  "httpStatus": 503,
  "message": "Grok model temporarily offline",
  "recoveryAction": "Fallback to Claude Haiku",
  "impact": "moderate"
}

{
  "timestamp": "2026-01-24T22:02:15Z",
  "api": "grok",
  "errorCode": "AUTH_FAILED",
  "httpStatus": 401,
  "message": "Invalid OPENROUTER_API_KEY",
  "recoveryAction": "STOP - Fix .env and retry",
  "impact": "critical"
}
```

---

## Error Prevention Checklist

### Pre-Execution

- [ ] All API keys in `.env` (NVD optional, OPENROUTER required, CONTEXT7 optional)
- [ ] Test connections: `bun tools/api/*/test-connection.ts`
- [ ] Check rate limit quotas (OpenRouter dashboard, Context7 dashboard)
- [ ] Check OpenRouter credits balance
- [ ] Validate query parameters (date ranges, keywords)

### During Execution

- [ ] Monitor real-time logs for errors
- [ ] Track retry attempts (abort if excessive)
- [ ] Validate partial results meet quality thresholds
- [ ] Log all errors for post-execution analysis

### Post-Execution

- [ ] Review error logs for patterns
- [ ] Validate ≥2 APIs succeeded (Tier 3 requirement)
- [ ] Check if fallbacks were used (quality impact)
- [ ] Update rate limit quotas if frequently exceeded

---

## Common Error Combinations

### Scenario 1: Multiple Rate Limits

**Situation:** Both NVD and Context7 hit rate limits in same session

**Cause:** Burst requests without delay, free tiers

**Impact:** Moderate (still have Grok + WebSearch)

**Recovery:**
1. NVD → Exponential backoff (succeeds on retry 3-5)
2. Context7 → Fallback to WebSearch immediately
3. Continue with 3/4 APIs (acceptable quality)

### Scenario 2: Grok Auth + Context7 Rate Limit

**Situation:** Grok auth fails (critical) + Context7 rate limit (non-critical)

**Cause:** Misconfigured `.env` + heavy Context7 usage

**Impact:** Critical (Grok required for Tier 3)

**Recovery:**
1. Grok auth failure → STOP immediately (fix `.env`)
2. Don't continue without Grok (Tier 3 requirement)
3. Fix auth, restart session

### Scenario 3: All APIs Timeout

**Situation:** Network connectivity issue causes all APIs to timeout

**Cause:** Internet outage, firewall blocking, VPN issues

**Impact:** Critical (0/4 APIs succeeded)

**Recovery:**
1. Check network connectivity
2. Test: `ping nvd.nist.gov`, `ping openrouter.ai`, `ping context7.com`
3. Resolve network issue
4. Restart session

---

## Error Rate Benchmarks

**From Test B and production usage:**

| API | Overall Error Rate | Rate Limit Errors | Auth Errors | Timeout Errors | Service Errors |
|-----|-------------------|-------------------|-------------|----------------|----------------|
| NVD | 3-5% | 2-3% (no key)<br/><1% (with key) | N/A | <1% | <1% |
| Grok | 8-12% | 5-10% (free tier)<br/><1% (paid) | 0% (if configured) | 2-3% | <2% |
| Context7 | 12-18% | 10-15% (heavy usage) | N/A | <2% | <2% |
| WebSearch | <1% | N/A | N/A | <1% | <0.1% |

**Overall Session Success Rate:** ~90-95% (at least 2/4 APIs succeed)

---

## Mitigation Strategies Summary

1. **Get API Keys:**
   - NVD key → 10x rate limit
   - OpenRouter paid tier → Avoid free tier limits
   - Context7 pro → 10x rate limit

2. **Implement Delays:**
   - 1s minimum between NVD requests
   - 5s minimum between Grok requests
   - Request queueing for parallel scenarios

3. **Use Fallback Chains:**
   - Context7 → WebSearch (documented fallback)
   - Grok → Haiku (tested fallback)
   - Validate ≥2 APIs for Tier 3

4. **Monitor Quotas:**
   - OpenRouter dashboard (daily)
   - Context7 dashboard (if heavy usage)
   - Log rate limit errors for trend analysis

5. **Test Connections:**
   - Pre-execution checklist includes connection tests
   - Fail fast if critical API unavailable (Grok)

---

## Version History

**1.0.0 (2026-01-24):**
- Initial release
- 17 error types documented across 4 APIs
- Recovery strategies and severity levels
- Error rate benchmarks from Test B

---

## References

- **API Documentation:** `tools/api/index.ts` (central API exports)
- **Capabilities:** [api-capabilities.md](./api-capabilities.md)

---

**Framework:** ▲ Intelligence Adjacent (IA)
**Version:** 1.0.0
**Last Updated:** 2026-01-24
