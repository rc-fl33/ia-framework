# Advisory: Research with Multi-API Integration

**Skill:** Advisory
**Phases:** Phase 1 (INTAKE), Phase 2 (ANALYZE)
**Version:** 1.0.0
**Last Updated:** 2026-01-24

---

## Overview

This workflow integrates multi-API research (Tier 3) into the advisory skill for comprehensive architecture review, framework research, and code review preparation.

**When to Use:**
- Architecture review (framework selection, security analysis)
- Code review preparation (language-specific vulnerability patterns)
- Threat modeling (attack pattern research)
- Framework research (multi-framework control mapping)

**Value Proposition:**
- **Authoritative documentation** (Context7: 50K+ official sources)
- **Recent CVE data** (NVD: structured vulnerability database)
- **Novel attack patterns** (Grok: synthesis beyond databases)
- **Multi-source validation** (4 APIs prevent single-source bias)

---

## Integration with Existing Research Hierarchy

### Current 4-Tier Research Hierarchy

**Tier 1 (Authoritative):** Context7 official documentation
**Tier 2 (Community):** WebSearch (blogs, forums, StackOverflow)
**Tier 3 (Social):** Reddit, Twitter, HackerNews
**Tier 4 (Books):** O'Reilly, Manning, technical books

### Enhanced Hierarchy with Multi-API

**Tier 0 (Comprehensive - NEW):** Multi-API Full Stack
- Combines all existing tiers automatically
- Context7 (authoritative) remains primary
- Adds NVD (CVE data) + Grok (synthesis)
- WebSearch (community) integrated

**Use Cases:**
- **Tier 0 (Multi-API):** Complex advisory work, architecture reviews, multi-framework analysis
- **Tier 1 (Context7):** Simple documentation lookup (existing)
- **Tier 2-4:** As before (existing)

**Note:** Multi-API (Tier 0) is **additive**, not a replacement. Context7 remains the primary authoritative source, now enhanced with CVE data and LLM synthesis.

---

## Integration Points

### Phase 1: INTAKE (Ad-Hoc Advisory)

**Current Flow:**
1. Client question received
2. Context7 lookup (authoritative docs)
3. WebSearch if Context7 insufficient
4. Manual synthesis
5. Response with citations

**Enhanced Flow (Multi-API):**
1. Client question received
2. **Determine complexity:**
   - Simple question → Context7 only (existing Tier 1)
   - Complex question → **Multi-API Tier 3** (new)
3. **Automated research** (if Tier 3)
   - Context7 (authoritative)
   - NVD (if security/vulnerability related)
   - Grok (synthesis + novel insights)
   - WebSearch (community validation)
4. Response with **multi-source validation**

**Example Complex Questions:**
- "Compare Next.js vs Remix security posture and CVE history"
- "What are the OWASP Top 10 risks for GraphQL APIs with mitigations?"
- "Django ORM SQL injection patterns and recent CVEs"

### Phase 2: ANALYZE (Architecture Review)

**Current Flow:**
1. Architecture diagrams + code provided
2. Manual security analysis
3. Framework-specific research (Context7)
4. Manual threat modeling
5. Report generation

**Enhanced Flow (Multi-API):**
1. Architecture diagrams + code provided
2. **Automated framework research** (Multi-API Tier 3)
   - Technology stack → Research topic
   - Example: "React + Next.js + Prisma security best practices and vulnerabilities"
3. **CVE discovery** (NVD integration)
4. **Threat modeling** (Grok synthesis)
5. Report generation with **auto-generated test cases**

---

## Execution Guide

### Step 1: Determine Research Tier

**Decision Matrix:**

| Question Complexity | Topic | Tier Recommendation |
|-------------------|-------|---------------------|
| Simple doc lookup | "How to use React hooks?" | Tier 1 (Context7 only) |
| CVE check | "Django 4.x CVEs?" | Tier 2 (NVD + WebSearch) |
| Framework comparison | "Next.js vs Remix security?" | **Tier 3 (Multi-API)** |
| Multi-framework research | "HIPAA + PCI-DSS control mapping?" | **Tier 3 (Multi-API)** |
| Architecture review | "Kubernetes security best practices?" | **Tier 3 (Multi-API)** |

**Rule of Thumb:**
- Single-framework docs → Tier 1 (Context7)
- CVE-focused → Tier 2 (NVD + WebSearch)
- Comparison/comprehensive/multi-framework → **Tier 3 (Multi-API)**

### Step 2: Execute Multi-API Research

```typescript
import { orchestrateResearch } from '@/tools/api';

// Example: Architecture review for React/Next.js app
const results = await orchestrateResearch({
  topic: 'Next.js React security vulnerabilities and best practices',
  tier: 3, // Full stack for comprehensive advisory
  dateRange: {
    start: '2024-01-01',
    end: '2025-12-31'
  },
  outputPath: 'private/output/advisory/nextjs-sec-review/',
  options: {
    generateTestCases: true, // For code review checklist
    minimumSources: 30,
    qualityThreshold: 5
  }
});

console.log(`Research complete:`);
console.log(`- CVEs discovered: ${results.cveCount}`);
console.log(`- Total sources: ${results.sourcesUnique}`);
console.log(`- Authoritative docs: ${results.sources.filter(s => s.sourceType === 'context7').length}`);
console.log(`- Test cases: ${results.testCases?.length || 0}`);
```

### Step 3: Integration with Advisory Report

```typescript
// Load research results
const research = JSON.parse(
  await Bun.file('private/output/advisory/nextjs-sec-review/sources.json').text()
);

// Group by source type
const authoritativeDocs = research.filter(s => s.sourceType === 'context7');
const cveData = research.filter(s => s.sourceType === 'nvd');
const communityInsights = research.filter(s => s.sourceType === 'websearch');
const grokAnalysis = research.filter(s => s.sourceType === 'grok');

// Generate advisory report
const report = `
# Next.js Security Advisory

## Executive Summary
Based on research across ${research.length} authoritative sources...

## Official Recommendations (Context7)
${authoritativeDocs.map(d => `- ${d.title}: ${d.content.substring(0, 200)}...`).join('\n')}

## Known Vulnerabilities (NVD)
${cveData.map(c => `- ${c.cveId} (CVSS ${c.cvssScore}): ${c.content}`).join('\n')}

## Community Best Practices (WebSearch)
${communityInsights.slice(0, 10).map(i => `- ${i.title}`).join('\n')}

## Novel Attack Patterns (Grok Synthesis)
${grokAnalysis.map(g => g.content).join('\n\n')}

## Code Review Checklist
[Auto-generated from test-cases.yaml]
`;
```

---

## Real-World Example: Framework Comparison

### Scenario

**Client Question:** "We're choosing between Next.js and Remix for our new e-commerce platform. Which is more secure?"

**Research Approach:** Multi-API Tier 3 (comprehensive comparison)

### Execution

```typescript
// Research both frameworks in parallel
const nextjsResults = await orchestrateResearch({
  topic: 'Next.js security vulnerabilities CVEs and best practices',
  tier: 3,
  dateRange: { start: '2020-01-01', end: '2025-12-31' },
  outputPath: 'private/output/advisory/nextjs-security/'
});

const remixResults = await orchestrateResearch({
  topic: 'Remix security vulnerabilities CVEs and best practices',
  tier: 3,
  dateRange: { start: '2020-01-01', end: '2025-12-31' },
  outputPath: 'private/output/advisory/remix-security/'
});
```

### Comparative Analysis (from Multi-API Results)

**Next.js:**
- **CVEs:** 8 (2020-2025)
- **Highest Severity:** CVSS 7.5 (XSS in older versions)
- **Authoritative Docs:** 22 sources (Next.js official, Vercel guides)
- **Community Maturity:** High (extensive community resources)
- **Novel Risks:** Server-side data leakage in API routes (Grok discovery)

**Remix:**
- **CVEs:** 2 (2020-2025) - Newer framework, fewer disclosed vulnerabilities
- **Highest Severity:** CVSS 5.3 (Information disclosure)
- **Authoritative Docs:** 15 sources (Remix official, Shopify guides)
- **Community Maturity:** Growing (smaller ecosystem)
- **Novel Risks:** Form action CSRF in older versions (Grok discovery)

**Advisory Recommendation:**
> **Next.js** for this use case (e-commerce platform). While Next.js has more disclosed CVEs, this is expected for a mature framework (8 years vs 3 years). The extensive security documentation, community resources, and proactive security updates outweigh the CVE count. The higher CVSS score (7.5) was in versions <10.x, now EOL.
>
> **Risk Mitigation:**
> - Use Next.js 14.x+ (latest stable)
> - Enable all security headers (CSP, HSTS, X-Frame-Options)
> - Validate all API route inputs (prevent server-side data leakage)
> - Regular dependency updates (Dependabot + monthly manual review)
>
> **Citations:** [22 authoritative sources from Context7, 8 CVEs from NVD, community validation from WebSearch]

**Client Value:** Comprehensive, multi-source comparison in 25 minutes (vs days of manual research)

---

## Use Case: Code Review Preparation

### Scenario

**Task:** Security code review for Python/Django e-commerce application

**Preparation:** Multi-API research for Django-specific vulnerability patterns

### Execution

```typescript
const results = await orchestrateResearch({
  topic: 'Django security vulnerabilities SQL injection XSS CSRF patterns',
  tier: 3,
  dateRange: { start: '2023-01-01', end: '2025-12-31' }, // Recent patterns
  outputPath: 'private/output/advisory/django-code-review-prep/',
  options: {
    generateTestCases: true, // → Code review checklist
    minimumSources: 30
  }
});
```

### Results

**CVEs Discovered: 12**
- CVE-2024-XXXXX: Django ORM SQL injection via queryset union
- CVE-2024-YYYYY: CSRF bypass in form validation
- CVE-2024-ZZZZZ: XSS in template rendering
- ... (9 more)

**Test Cases Generated: 15**
1. SQL injection via ORM queryset operations
2. CSRF token validation bypass
3. Template XSS via user-generated content
4. Authentication bypass via session fixation
5. ... (11 more)

**Code Review Checklist (from test-cases.yaml):**

```yaml
- name: ORM SQL Injection Check
  description: Validate all queryset operations for SQL injection
  steps:
    - Search codebase for .raw(), .extra(), .union()
    - Verify parameterized queries used
    - Check string interpolation in Q objects
  expected: No raw SQL without parameterization
  severity: CRITICAL
```

**Impact:** Code review armed with 15 specific patterns to check (vs generic OWASP checklist)

---

## Multi-Framework Control Mapping

### Scenario

**Compliance Advisory:** Client needs to map controls across NIST CSF + HIPAA + PCI-DSS

**Challenge:** Each framework uses different terminology, requires cross-referencing authoritative documentation

### Execution

```typescript
const results = await orchestrateResearch({
  topic: 'NIST CSF 2.0 HIPAA ePHI PCI-DSS control mapping encryption data protection',
  tier: 3, // Context7 essential for authoritative regulatory docs
  outputPath: 'private/output/advisory/multi-framework-encryption/',
  options: {
    generateTestCases: true, // → Compliance validation checklist
    minimumSources: 40 // Higher threshold for regulatory work
  }
});
```

### Results

**Sources by Type:**
- **Context7 (Authoritative):** 25 sources
  - NIST CSF 2.0 official PDF
  - HIPAA regulations (HHS.gov)
  - PCI-DSS v4.0 requirements
- **NVD (CVE Data):** 8 encryption-related CVEs
- **WebSearch (Guidance):** 18 sources (industry best practices, HHS guidance)
- **Grok (Synthesis):** Cross-framework control mapping matrix

**Grok-Generated Control Mapping:**

| Control Type | NIST CSF 2.0 | HIPAA | PCI-DSS | Implementation |
|-------------|--------------|-------|---------|----------------|
| Data at Rest Encryption | PR.DS-1 | § 164.312(a)(2)(iv) | Req 3.4 | AES-256 |
| Data in Transit Encryption | PR.DS-2 | § 164.312(e)(1) | Req 4.1 | TLS 1.3+ |
| Key Management | PR.DS-5 | § 164.312(a)(2)(iv) | Req 3.6 | HSM/KMS |

**Advisory Value:** Comprehensive control mapping in 15 minutes (vs 2-4 hours manual cross-referencing)

---

## Best Practices

### When to Use Multi-API (Tier 3)

✅ **Use Tier 3 for:**
- Framework comparisons (Next.js vs Remix, Django vs Flask)
- Architecture reviews (comprehensive security analysis)
- Code review preparation (vulnerability pattern research)
- Multi-framework compliance mapping
- Novel technology assessment (new frameworks, emerging patterns)
- Client-facing advisory (quality requirement: 5/5)

❌ **Don't Use Tier 3 for:**
- Simple documentation lookup (use Tier 1 Context7)
- Quick CVE check (use Tier 2 NVD + WebSearch)
- Internal notes/drafts (free tier sufficient)

### Citation Management

**Context7 Remains Primary:**
```typescript
// Advisory reports should prioritize authoritative sources
const sources = research.sort((a, b) => {
  const priority = { context7: 1, nvd: 2, grok: 3, websearch: 4 };
  return priority[a.sourceType] - priority[b.sourceType];
});

// Cite in order: Context7 > NVD > Grok > WebSearch
```

**100% Citation Coverage:**
- Every claim must have source
- Multi-source claims strengthen credibility
- Example: "Next.js recommends CSP headers [1] to prevent XSS [2][3]"
  - [1] = Context7 (Next.js official docs)
  - [2] = NVD (CVE showing XSS risk)
  - [3] = WebSearch (community best practice)

---

## Troubleshooting

### Issue: Too many sources (>100)

**Cause:** Broad research topic (e.g., "web security")

**Resolution:**
1. Narrow topic to specific framework/technology
2. Reduce date range (2024-2025 vs 2020-2025)
3. Filter sources by relevance score before synthesis

### Issue: Context7 dominates (80%+ of sources)

**This is GOOD for advisory work!**
- Context7 is authoritative documentation
- High Context7 percentage = high quality
- Don't artificially balance sources (WebSearch is supplementary)

### Issue: No CVEs found (NVD returned 0 results)

**Cause:** Topic not vulnerability-focused

**Resolution:**
1. This is acceptable for non-security advisory
2. Focus on Context7 (authoritative docs) + WebSearch (best practices)
3. Grok will still provide synthesis

---

## References

- **Advisory Research Methodology:** `skills/advisory/docs/research/research-methodology.md`
- **Context7 Integration:** `tools/api/context7/` (TypeScript library)
- **API Catalog:** `docs/catalogs/tool-catalog.md`

---

**Framework:** ▲ Intelligence Adjacent (IA)
**Skill:** Advisory
**Classification:** Private
**Version:** 1.0.0
**Last Updated:** 2026-01-24
