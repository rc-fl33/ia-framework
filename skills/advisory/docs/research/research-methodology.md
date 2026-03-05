# Research Methodology for Advisory Engagements

**Purpose:** Guidelines for researching current best practices, novel techniques, and emerging threats
**Applies to:** Architecture review, code review, ad-hoc advisory

---

## Research Sources Hierarchy

### Tier 1: Official Documentation (ALWAYS use first)

**Tool:** Context7 API via `tools/api/context7/client.ts`

**When to use:**
- Framework/library security documentation
- API documentation for code being reviewed
- Official security guides from vendors

**Examples:**
```bash
# Django security documentation
bun tools/api/context7/client.ts quick "security vulnerabilities" django

# React security best practices
bun tools/api/context7/client.ts search "security best practices" react
bun tools/api/context7/client.ts get "security vulnerabilities" /facebook/react --tokens=20000

# OWASP ASVS latest
bun tools/api/context7/client.ts quick "security requirements" "OWASP ASVS"
```

**Why Tier 1:**
- Most authoritative source
- Version-specific information
- Official security advisories
- Best practices from creators

---

### Tier 2: Web Search for Current Best Practices

**Tool:** WebSearch (Claude Code built-in)

**When to use:**
- Researching 2026 best practices (training data cutoff: Jan 2025)
- Finding recent security advisories
- Discovering novel attack techniques
- Checking for framework-specific CVEs

**Search Query Patterns:**
```
"{technology} security best practices 2026"
"{framework} vulnerabilities CVE 2025 2026"
"{language} secure coding guide 2026"
"OWASP {topic} 2026"
"{technology} security advisory {month} 2026"
```

**Quality Criteria:**
- Prefer .gov, .edu, official project sites
- Cross-reference multiple sources (minimum 3)
- Check publication date (prefer <6 months old)
- Verify author credentials

**Why Tier 2:**
- Up-to-date information
- Emerging threats not in books
- Real-world case studies
- Community consensus on best practices

---

### Tier 3: Social Media & Expert Opinions

**Platforms:**
- Twitter/X (#infosec, #appsec, #bugbounty)
- Mastodon (infosec.exchange)
- Reddit (r/netsec, r/AskNetsec, r/blueteam)
- GitHub Security Advisories
- HackerNews

**When to use:**
- Novel attack techniques (zero-days, new exploits)
- Early warnings before official advisories
- Expert opinions on controversial topics
- Real-world practitioner experiences

**Researchers to Reference:**
```
Twitter/X:
- @tqbf (Thomas Ptacek - web security)
- @samwcyo (Sam Curry - bug bounty)
- @albinowax (James Kettle - PortSwigger/Burp)
- @0xdabbad00 (Scott Piper - AWS security)
- @rsnake (Robert Hansen - web security)
- @troyhunt (Troy Hunt - HIBP, web security)
- @GossiTheDog (Kevin Beaumont - threat intel)

Mastodon (infosec.exchange):
- Security researchers migrating from Twitter
- OWASP community
- SANS instructors

Reddit:
- r/netsec - Network security news
- r/AskNetsec - Security Q&A
- r/blueteam - Defensive security
```

**Validation Process:**
1. Verify claim with official sources
2. Check if vulnerability has CVE
3. Cross-reference with multiple experts
4. Test claims in lab environment if possible
5. **NEVER rely solely on social media - always validate**

**Why Tier 3:**
- Fastest detection of emerging threats
- Practitioner experiences
- Novel techniques before formal publications
- Community validation of claims

---

### Tier 4: Reference Books

**Source:** `skills/advisory/docs/books/`

**When to use:**
- Understanding attacker methodologies
- Learning vulnerability classes
- Case studies of past vulnerabilities
- Foundational knowledge

**Books by Use Case:**

**Code Review:**
- OWASP ASVS v5 (primary checklist)
- Black-Hat-Python-2021 (Python patterns)
- Bug-Bounty-Bootcamp-2021 (vulnerability discovery)

**Architecture Review:**
- Gray-Hat-Hacking-2022 (attack methodologies)
- Hacking-APIs-2022 (API security)
- MITRE-ATLAS (AI threat modeling)

**Advisory:**
- Ethical-Hacking-2021 (general security)
- Real-World-Bug-Hunting-2019 (case studies)

**Why Tier 4:**
- Comprehensive coverage
- Structured learning
- Battle-tested knowledge
- Offline reference

---

## Research Workflow by Engagement Type

### Architecture Review Research

**Phase 1: Technology Stack Research**
```
1. Identify all technologies (languages, frameworks, databases, cloud providers)
2. For each technology:
   - Context7: Official security documentation
   - WebSearch: "{technology} security best practices 2026"
   - WebSearch: "{technology} CVE {current year}"
3. Document findings in threat model
```

**Phase 2: Threat Intelligence**
```
1. WebSearch: "{industry} security threats 2026"
2. Social media: Recent attacks on similar systems
3. MITRE ATT&CK: Relevant TTPs for technology stack
4. MITRE ATLAS: If AI/ML components present
```

**Phase 3: Similar System Analysis**
```
1. WebSearch: "{similar product} security breach"
2. Learn from past incidents
3. Check if your architecture has same weaknesses
```

---

### Code Review Research

**Phase 1: Language & Framework Research**
```
1. Detect languages (see language detection system)
2. For each language:
   - Context7: Load language official security docs
   - Load language guide: docs/languages/{language}/
   - WebSearch: "{language} security vulnerabilities 2026"
3. For each framework:
   - Context7: Framework security documentation
   - WebSearch: "{framework} CVE {current year}"
```

**Phase 2: Vulnerability Pattern Research**
```
1. Review OWASP ASVS categories applicable to codebase
2. Cross-reference CWE Top 25 patterns
3. WebSearch for novel exploitation techniques:
   - "new {language} exploitation techniques 2025 2026"
   - "{framework} security bypass 2026"
```

**Phase 3: Dependency Research**
```
1. If SBOM provided:
   - Check each dependency for known CVEs
   - WebSearch: "{dependency} vulnerability {version}"
2. Social media: Check for discussions of zero-days
```

---

### Ad-hoc Advisory Research

**Phase 1: Question Classification**
- Best practice inquiry
- Technology selection
- Incident triage
- Compliance question

**Phase 2: Research Execution**
```
For best practice questions:
1. Context7: Official documentation
2. WebSearch: Minimum 5 sources (prefer .gov, .edu, OWASP)
3. Social media: Expert consensus
4. Books: Foundational knowledge

For technology selection:
1. Context7: Compare official docs
2. WebSearch: "{tech A} vs {tech B} security 2026"
3. Social media: Practitioner experiences
4. WebSearch: Recent vulnerabilities in each option

For incident triage:
1. WebSearch: Similar incident case studies
2. Social media: Real-time threat intel
3. MITRE ATT&CK: Identify relevant TTPs
```

**Phase 3: Validation & Synthesis**
```
1. Verify all claims with multiple sources
2. Check for conflicts between sources
3. Identify trade-offs (security vs performance, cost, complexity)
4. Document limitations and assumptions
```

---

## Citation Standards

**MANDATORY:** All claims must be cited. Use this format:

**In Reports:**
```markdown
According to OWASP ASVS 5.0, authentication mechanisms should implement
multi-factor authentication for privileged accounts [1].

## References
[1] OWASP Application Security Verification Standard v5.0, Section V2: Authentication
    https://owasp.org/www-project-application-security-verification-standard/
```

**In Code Review Findings:**
```markdown
### CWE-89: SQL Injection (P0 - Critical)

**Vulnerable Code:** src/auth.py:45-52

This pattern is vulnerable to SQL injection attacks, allowing attackers to
bypass authentication or extract sensitive data [1][2].

**References:**
[1] OWASP ASVS v5.0 - V5.3.4: Verify that all SQL queries use parameterized queries
[2] CWE-89: Improper Neutralization of Special Elements in SQL Command
    https://cwe.mitre.org/data/definitions/89.html
```

**In Advisory Responses:**
```markdown
## Recommendation: Use OAuth 2.1 with PKCE

Based on current best practices (2026), OAuth 2.1 with PKCE (Proof Key for
Code Exchange) is recommended for mobile applications [1][2][3].

**Sources:**
[1] OAuth 2.1 Specification (2024) - https://oauth.net/2.1/
[2] OWASP Mobile Application Security - https://owasp.org/www-project-mobile-app-security/
[3] NIST SP 800-63B Digital Identity Guidelines (2024) - https://pages.nist.gov/800-63-3/
```

---

## Quality Metrics

**Minimum Standards:**

| Engagement Type | Min Sources | Max Source Age | Citation Rate |
|----------------|-------------|----------------|---------------|
| Architecture Review | 10+ | 1 year | 100% |
| Code Review (per finding) | 2+ | 2 years | 100% |
| Ad-hoc Advisory | 5+ | 1 year | 100% |

**Source Quality Scoring:**

Tier 1 (Best):
- Official standards (OWASP, NIST, CERT)
- Peer-reviewed publications
- Official vendor documentation
- CVE/CWE databases

Tier 2 (Good):
- Recognized security blogs (PortSwigger, Trail of Bits, NCC Group)
- Conference presentations (DEF CON, Black Hat, OWASP)
- Security vendor research (Google Project Zero, Mandiant)

Tier 3 (Use with caution):
- Social media (validate with Tier 1/2)
- Blog posts from unknown authors
- Forum discussions
- Stack Overflow (for pattern identification only)

---

## Research Tools Integration

**Context7 (Official Docs):**
```bash
# Framework library: tools/api/context7/client.ts

# Search for library and get docs in one call
bun tools/api/context7/client.ts quick "<query>" <library_name>

# Search for library IDs
bun tools/api/context7/client.ts search "<query>" <library_name>

# Get specific documentation
bun tools/api/context7/client.ts get "<query>" <org/repo> --tokens=<N>
```

**WebSearch (Built-in):**
```
Use Claude Code's WebSearch tool with appropriate queries
```

**Social Media Monitoring:**
```
Manual monitoring of key researchers
Set up alerts for critical technologies
```

**GitHub Security Advisories:**
```
https://github.com/advisories
Filter by ecosystem (npm, PyPI, Maven, etc.)
```

---

## Common Research Scenarios

### Scenario 1: Unknown Framework
```
1. Context7: Search for framework
2. If not found, WebSearch: "{framework} documentation"
3. WebSearch: "{framework} security guide"
4. Social media: Check for recent security discussions
5. Fallback: Generic OWASP ASVS + manual analysis
```

### Scenario 2: Novel Vulnerability Class
```
1. Social media: Find first reports
2. Check if CVE assigned
3. WebSearch: Academic research on vulnerability
4. Reproduce in lab environment
5. Reference books: Similar vulnerability classes
```

### Scenario 3: Conflicting Best Practices
```
1. Identify date of each source
2. Check if recommendations evolved over time
3. Evaluate context (threat model, risk tolerance)
4. Document trade-offs of each approach
5. Present options with pros/cons
```

---

## Anti-Patterns (DO NOT DO)

❌ **Rely on training data without verification**
- Training cutoff: January 2025
- Always check 2026 sources for recent changes

❌ **Use single source for critical claims**
- Minimum 2 sources for vulnerabilities
- Minimum 3 sources for best practice questions

❌ **Trust social media without validation**
- Social media = early warning, not proof
- Always validate with official sources

❌ **Skip Context7 lookup**
- Official docs are authoritative
- Prevent using outdated API information

❌ **Ignore recency of sources**
- Security evolves rapidly
- Prefer sources <1 year old for best practices
- Exception: Foundational concepts (CWE, vulnerability classes)

---

## Continuous Learning

**Stay Updated:**
1. Monitor OWASP project updates
2. Track NIST publications (SP 800 series)
3. Follow key security researchers
4. Review CVE database weekly
5. Attend virtual conferences (DEF CON, Black Hat recordings)

**Update Research Materials:**
1. Quarterly: Review and update language guides
2. Annually: Update reference books
3. Continuous: Monitor security advisories

---

**Version:** 1.0
**Last Updated:** 2026-01-17
**Applies to:** Advisory skill - all engagement types
**Enforcement:** 100% citation rate mandatory for all deliverables
