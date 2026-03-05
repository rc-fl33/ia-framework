---
name: nvd
type: api-client
classification: public
description: NIST National Vulnerability Database API client for CVE research and security analysis
version: 1.0.0
last_updated: 2026-02-14
env_required: false
env_keys:
  - NVD_API_KEY
commands:
  - bun tools/nvd/client.ts <keyword> [--severity=CRITICAL] [--limit=20] [--since=YYYY-MM-DD]
related_tools:
  - skills/pentest
  - skills/vuln-scan
  - skills/bug-bounty
  - skills/code-review
  - skills/advisory
  - standards
  - tools/api/context7
---

# NVD API Client

**Type:** API Client
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

---

## Classification

**PUBLIC** - NIST National Vulnerability Database (NVD) API client for CVE research.

**Why Public:**
- Official US government public API (services.nvd.nist.gov)
- Widely used for vulnerability research and security analysis
- No proprietary logic - standard API wrapper with formatting helpers
- Useful for security professionals, researchers, and developers

---

## Purpose

TypeScript client for querying the NIST National Vulnerability Database (NVD) API to search and retrieve Common Vulnerabilities and Exposures (CVE) data. Provides structured access to vulnerability information including CVSS scores, CWE classifications, and patch status.

**Core Capabilities:**
- **Keyword search**: Find CVEs by technology/product name (e.g., "GraphQL", "nginx")
- **CVE lookup**: Retrieve specific CVE by ID (e.g., CVE-2024-1234)
- **Severity filtering**: Filter by CVSS v3 severity (CRITICAL, HIGH, MEDIUM, LOW)
- **Date range filtering**: Query CVEs published within specific timeframes
- **Markdown formatting**: Export CVE data for reports and documentation
- **Rate limit handling**: Automatic API key support for higher rate limits

**Use Cases:**
- **Security testing**: Research known vulnerabilities for penetration testing (skills/pentest)
- **Code review**: Identify vulnerable dependencies during code audits (skills/code-review)
- **Compliance**: Document CVEs for risk assessment frameworks (standards)
- **Advisory work**: CVE research for security advisories (skills/advisory)
- **Bug bounty**: Technology stack vulnerability mapping (skills/bug-bounty)

---

## Usage

### Programmatic API

**Search by keyword:**
```typescript
import { searchCVEsByKeyword } from '@/tools/nvd';

const results = await searchCVEsByKeyword('GraphQL', {
  startDate: '2024-01-01',
  endDate: '2025-12-31',
  severity: 'HIGH',
  limit: 50
});

console.log(`Found ${results.totalResults} total CVEs`);
console.log(`Returned ${results.vulnerabilities.length} results`);

results.vulnerabilities.forEach(({ cve }) => {
  const desc = cve.descriptions.find(d => d.lang === 'en')?.value;
  const cvss = cve.metrics?.cvssMetricV31?.[0]?.cvssData;

  console.log(`\n${cve.id} - ${cvss?.baseSeverity}`);
  console.log(`Score: ${cvss?.baseScore} | ${desc?.split('.')[0]}`);
});
```

**Get specific CVE:**
```typescript
import { getCVEById } from '@/tools/nvd';

const cve = await getCVEById('CVE-2024-1234');

if (cve) {
  console.log(`ID: ${cve.id}`);
  console.log(`Status: ${cve.vulnStatus}`);
  console.log(`Published: ${cve.published}`);

  const cvss = cve.metrics?.cvssMetricV31?.[0]?.cvssData;
  console.log(`CVSS: ${cvss?.baseScore} (${cvss?.baseSeverity})`);
  console.log(`Vector: ${cvss?.vectorString}`);
} else {
  console.log('CVE not found');
}
```

**Format for markdown reports:**
```typescript
import { searchCVEsByKeyword, formatCVEForMarkdown } from '@/tools/nvd';

const results = await searchCVEsByKeyword('nginx', { severity: 'CRITICAL' });

const report = results.vulnerabilities.map(({ cve }) =>
  formatCVEForMarkdown(cve)
).join('\n\n---\n\n');

console.log(report);
// Output:
// CVE-2024-1234 | CRITICAL | Buffer overflow in nginx HTTP/2
// - CVSS: 9.8 (CRITICAL)
// - Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
// - CWE: CWE-120
// - Published: 2024-03-15
// - Status: Analyzed
// - Source: https://nvd.nist.gov/vuln/detail/CVE-2024-1234
```

### CLI Usage

**Basic keyword search:**
```bash
bun tools/nvd/client.ts nginx
```

**Filter by severity:**
```bash
bun tools/nvd/client.ts GraphQL --severity=CRITICAL
```

**Limit results:**
```bash
bun tools/nvd/client.ts "next.js" --limit=10
```

**Date range filter:**
```bash
bun tools/nvd/client.ts WordPress --since=2024-01-01 --severity=HIGH
```

**Full example:**
```bash
bun tools/nvd/client.ts OpenSSL --severity=CRITICAL --limit=5 --since=2024-01-01

# Output:
# Searching NVD for CVEs matching: "OpenSSL"
# Severity filter: CRITICAL
# Since: 2024-01-01
#
# Total results: 12
# Returned: 5
#
# CVE-2024-5678 | CRITICAL | Remote code execution via malformed certificate
# - CVSS: 9.8 (CRITICAL)
# - Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
# - CWE: CWE-787
# - Published: 2024-06-20
# - Status: Analyzed
# - Source: https://nvd.nist.gov/vuln/detail/CVE-2024-5678
```

---

## Configuration

### Environment Variables

**Optional (but recommended):**
```bash
NVD_API_KEY=[your API key]  # Get from https://nvd.nist.gov/developers/request-an-api-key
```

**Why use an API key?**
- **Without key**: 5 requests/30 seconds, 10,000 requests/day
- **With key**: 50 requests/30 seconds, 100,000 requests/day
- **10x rate limit improvement** for free

**Setup:**
1. Request free API key: https://nvd.nist.gov/developers/request-an-api-key
2. Add to `.env`: `NVD_API_KEY=[key]`
3. Client auto-detects and uses key

### API Limits

| Limit Type | Without Key | With Key |
|------------|-------------|----------|
| Requests/30s | 5 | 50 |
| Requests/day | 10,000 | 100,000 |
| Cost | Free | Free |

**Best Practice:** Always use API key for production workflows

---

## API Reference

### `searchCVEsByKeyword(keyword, options?): Promise<NVDResponse>`

Search NVD for CVEs matching keyword.

**Parameters:**
- `keyword` - Technology/product name (e.g., "GraphQL", "nginx", "WordPress")
- `options.startDate` - Published after date (YYYY-MM-DD format)
- `options.endDate` - Published before date (YYYY-MM-DD format)
- `options.severity` - CVSS v3 severity filter: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
- `options.limit` - Max results per page (default: 20, max: 2000)

**Returns:**
```typescript
interface NVDResponse {
  vulnerabilities: Array<{ cve: NVDVulnerability }>;
  totalResults: number;
}
```

**Example:**
```typescript
const results = await searchCVEsByKeyword('Apache Struts', {
  startDate: '2023-01-01',
  severity: 'CRITICAL',
  limit: 100
});
```

---

### `getCVEById(cveId): Promise<NVDVulnerability | null>`

Retrieve specific CVE by ID.

**Parameters:**
- `cveId` - CVE identifier (e.g., "CVE-2024-1234")

**Returns:**
- `NVDVulnerability` object if found
- `null` if not found (404)

**Example:**
```typescript
const cve = await getCVEById('CVE-2024-1234');
if (cve) {
  console.log(cve.id, cve.vulnStatus);
}
```

---

### `formatCVEForMarkdown(cve): string`

Format CVE data as markdown for reports.

**Parameters:**
- `cve` - NVDVulnerability object

**Returns:** Formatted markdown string

**Output Format:**
```
CVE-ID | SEVERITY | Description summary
- CVSS: X.X (SEVERITY)
- Vector: CVSS:3.1/...
- CWE: CWE-###
- Published: YYYY-MM-DD
- Status: Analyzed/Modified/...
- Source: https://nvd.nist.gov/vuln/detail/CVE-ID
```

**Example:**
```typescript
const results = await searchCVEsByKeyword('nginx');
const markdown = results.vulnerabilities
  .map(({ cve }) => formatCVEForMarkdown(cve))
  .join('\n\n---\n\n');
```

---

### Type Definitions

```typescript
interface NVDVulnerability {
  id: string;                    // CVE-YYYY-NNNNN
  sourceIdentifier?: string;     // Reporting organization
  published: string;             // ISO 8601 datetime
  lastModified: string;          // ISO 8601 datetime
  vulnStatus: string;            // "Analyzed", "Modified", "Undergoing Analysis"

  descriptions: Array<{
    lang: string;                // "en"
    value: string;               // Vulnerability description
  }>;

  metrics?: {
    cvssMetricV31?: Array<{      // CVSS v3.1 scoring
      cvssData: {
        baseScore: number;       // 0.0 - 10.0
        baseSeverity: string;    // "NONE", "LOW", "MEDIUM", "HIGH", "CRITICAL"
        vectorString: string;    // CVSS:3.1/AV:N/AC:L/...
      };
    }>;
    cvssMetricV2?: Array<{       // CVSS v2 scoring (legacy)
      cvssData: {
        baseScore: number;
        baseSeverity: string;
        vectorString: string;
      };
    }>;
  };

  weaknesses?: Array<{
    description: Array<{
      lang: string;
      value: string;             // CWE-###
    }>;
  }>;

  references: Array<{
    url: string;                 // Advisory/patch URLs
    source: string;
  }>;
}
```

---

## Architecture

### Request Flow

```
searchCVEsByKeyword('nginx', { severity: 'HIGH' })
   ↓
Build URLSearchParams
   ├─ keywordSearch=nginx
   ├─ cvssV3Severity=HIGH
   └─ resultsPerPage=20
   ↓
Add headers
   ├─ Content-Type: application/json
   └─ apiKey: [NVD_API_KEY] (if present)
   ↓
GET https://services.nvd.nist.gov/rest/json/cves/2.0?params
   ↓
Parse JSON response
   ↓
Return NVDResponse { vulnerabilities, totalResults }
```

### CVE Lookup Flow

```
getCVEById('CVE-2024-1234')
   ↓
GET https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2024-1234
   ↓
if 404 → return null
if 200 → return vulnerabilities[0].cve
```

### Markdown Formatting

```
formatCVEForMarkdown(cve)
   ↓
Extract fields:
   ├─ English description
   ├─ CVSS v3 score/severity (fallback to v2)
   ├─ CWE IDs
   ├─ Published date
   └─ Vulnerability status
   ↓
Format as markdown template
   ↓
Return string
```

---

## Scripts

### Production

**Search CVEs:**
```bash
bun tools/nvd/client.ts <keyword> [options]
```

**Options:**
- `--severity=CRITICAL|HIGH|MEDIUM|LOW` - Filter by severity
- `--limit=N` - Max results (default: 20)
- `--since=YYYY-MM-DD` - Published after date

**Examples:**
```bash
# Critical vulnerabilities in WordPress
bun tools/nvd/client.ts WordPress --severity=CRITICAL

# Recent high-severity nginx CVEs
bun tools/nvd/client.ts nginx --severity=HIGH --since=2024-01-01

# Top 5 GraphQL vulnerabilities
bun tools/nvd/client.ts GraphQL --limit=5
```

### Development

**Test keyword search:**
```bash
bun -e 'import { searchCVEsByKeyword } from "./tools/nvd/client.ts"; \
  const r = await searchCVEsByKeyword("nginx", { limit: 1 }); \
  console.log(r.totalResults, "total CVEs")'
```

**Test CVE lookup:**
```bash
bun -e 'import { getCVEById } from "./tools/nvd/client.ts"; \
  const cve = await getCVEById("CVE-2024-1234"); \
  console.log(cve?.id, cve?.vulnStatus)'
```

---

## Dependencies

### Runtime

**External:** None (uses Bun built-ins)

**Internal:**
- `dotenv` - Environment variable loading
- TypeScript type definitions

### Framework Integration

**Used By:**
- `skills/pentest` - Vulnerability research for penetration testing
- `skills/code-review` - Dependency vulnerability checks
- `skills/advisory` - CVE research for security guidance
- `standards` - Risk assessment CVE documentation
- `skills/bug-bounty` - Target technology vulnerability mapping

**File Structure:**
```
tools/nvd/
├── client.ts       # Main client + CLI
├── README.md       # Legacy documentation (superseded by TOOL.md)
└── TOOL.md         # This file
```

---

## Troubleshooting

### Rate Limit Exceeded (429)

**Cause:** Exceeded 5 requests/30 seconds without API key

**Fix:**
```bash
# Get free API key
curl -X POST https://nvd.nist.gov/developers/request-an-api-key

# Add to .env
echo 'NVD_API_KEY=[your key]' >> .env

# Verify key is loaded
bun -e 'import { config } from "dotenv"; config(); \
  console.log(process.env.NVD_API_KEY ? "✅ Key loaded" : "❌ No key")'
```

### "NVD API error: 503"

**Cause:** NVD service temporarily unavailable

**Fix:**
- Retry after 30-60 seconds
- Check NVD status: https://nvd.nist.gov
- Implement exponential backoff in production code

```typescript
async function searchWithRetry(keyword: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await searchCVEsByKeyword(keyword);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
}
```

### No Results Found

**Cause:** Keyword doesn't match any CVE descriptions

**Debug:**
```typescript
const results = await searchCVEsByKeyword('your-keyword');
console.log(`Total results: ${results.totalResults}`);
// If 0, try:
// - Broader keyword (e.g., "Apache" instead of "Apache Struts 2.5.3")
// - Remove version numbers
// - Try common names (e.g., "nginx" not "NGINX")
```

**Tips:**
- Use product names without versions: "WordPress" not "WordPress 6.4.2"
- Try vendor names: "Microsoft" for Windows CVEs
- Search generic tech: "GraphQL" not "Apollo GraphQL Server"

### Missing CVSS Score

**Cause:** CVE not yet analyzed by NIST

**Handle:**
```typescript
const cvss = cve.metrics?.cvssMetricV31?.[0]?.cvssData;
if (!cvss) {
  console.log(`${cve.id}: Not yet scored (status: ${cve.vulnStatus})`);
} else {
  console.log(`${cve.id}: ${cvss.baseScore} (${cvss.baseSeverity})`);
}
```

### Date Range Returns No Results

**Cause:** Incorrect date format or unrealistic range

**Fix:**
```typescript
// Correct format: YYYY-MM-DD
await searchCVEsByKeyword('nginx', {
  startDate: '2024-01-01',  // ✅ Correct
  endDate: '2024-12-31'
});

// NOT: MM/DD/YYYY, DD-MM-YYYY, or YYYY/MM/DD
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Skills:**
- `skills/pentest/` — uses searchCVEsByKeyword() for vulnerability research during penetration testing
- `skills/code-review/` — uses searchCVEsByKeyword() for dependency vulnerability checks
- `skills/advisory/` — uses getCVEById() and formatCVEForMarkdown() for security guidance reports
- `standards/` — uses NVD data for risk assessment CVE documentation
- `skills/bug-bounty/` — uses keyword search for target technology stack CVE mapping

**Tools:**
- `tools/framework/` — NVD client is included as a Tier 2 and Tier 3 parallel API source

---

## Related Tools

- **skills/pentest** - Penetration testing with CVE research
- **skills/code-review** - Security-focused code audits with dependency checks
- **skills/advisory** - Security guidance with CVE citations
- **standards** - Risk assessment frameworks with CVE documentation
- **skills/bug-bounty** - Target reconnaissance with technology stack CVE mapping
- **tools/api/context7** - Documentation search (complementary to vulnerability research)

---

## Version History

### 1.0.0 (2026-01-29)
- ✅ Migrated from `skills/pentest/scripts/nvd-api/nvd-client.ts`
- ✅ Consolidated to `tools/nvd/client.ts`
- ✅ Keyword search with severity/date filtering
- ✅ CVE ID lookup
- ✅ Markdown formatting helper
- ✅ API key support for increased rate limits
- ✅ TypeScript type safety
- ✅ CLI interface

---

## References

- **Official API Docs:** https://nvd.nist.gov/developers/vulnerabilities
- **API Key Request:** https://nvd.nist.gov/developers/request-an-api-key
- **NVD Home:** https://nvd.nist.gov
- **CVSS Calculator:** https://nvd.nist.gov/vuln-metrics/cvss/v3-calculator
- **CWE Database:** https://cwe.mitre.org
- **CVE Numbering:** https://www.cve.org
- **Framework README:** `tools/nvd/README.md` (legacy)
