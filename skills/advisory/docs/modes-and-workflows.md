# Advisory Modes and Workflows

**Detailed descriptions of the three advisory modes and their workflows.**

---

## Mode 1: Ad-Hoc Advisory (Default)

**When:** Quick security questions, best practice guidance, policy advice

### Use Cases

- "What's the best practice for API authentication?"
- "How should we secure our S3 buckets?"
- "Should we use JWT or sessions for our mobile app?"
- "What encryption algorithm should we use for PII?"

### Workflow

1. **Understand** the question/scenario
   - Gather context if needed
   - Clarify scope

2. **Research** if needed
   - WebSearch for current best practices
   - Check NIST/OWASP guidance
   - Review CVEs if applicable

3. **Provide guidance**
   - Clear, actionable recommendations
   - Include framework references (NIST, OWASP, CIS)
   - Cite specific controls

4. **Document** (if complex)
   - Save to `output/advisory/ad-hoc/{topic}-{YYYY-MM-DD}/`
   - Include research sources
   - Provide references for further reading

5. **Suggest follow-up** if complex
   - Recommend full arch review if needed
   - Suggest compliance assessment if framework-related

### Output Options

**Simple questions:**
- Direct response (no file output)

**Complex guidance:**
```
output/advisory/ad-hoc/{topic}-{YYYY-MM-DD}/
├── request.md              # Original question/context
├── research.md             # Research findings
├── recommendations.md      # Actionable guidance
├── references.md           # Framework citations, sources
└── FULL-REPORT.md          # Consolidated report
```

### Effort Level

- **QUICK** - Single question, direct answer
- **STANDARD** - Requires research, documented output

---

## Mode 2: Architecture Review (Standalone — /sec-review)

**Note:** Architecture security review is no longer part of the advisory skill. Use
`/sec-review` for STRIDE/PASTA threat modeling, security practices assessment, and patch
management evaluation.

- "Review this microservices architecture for security risks" → `/sec-review`
- "Create a threat model for our payment processing system" → `/sec-review`
- "Analyze the security of our multi-tenant SaaS architecture" → `/sec-review`

The `/sec-review` skill is fully standalone with its own phases in
`skills/sec-review/phases/` and routes to the security agent.

---

## Mode 2: Code Review

**When:** User says "code review", "review this code", "security code analysis"

### Use Cases

- "Review this authentication code for security vulnerabilities"
- "Scan our API codebase for injection flaws"
- "Check this payment processing code for security issues"
- "Review our cryptography implementation"

### Workflow: Full 5-Phase Review

#### Phase 1: INTAKE
- Identify code scope (files, modules, features)
- Understand technology stack
- Clarify security concerns
- Set review boundaries

#### Phase 2: ANALYZE
- Static code analysis
- Map to OWASP Top 10 / CWE Top 25
- Identify vulnerability patterns:
  - Injection flaws (SQL, command, XSS)
  - Authentication/authorization issues
  - Cryptography misuse
  - Insecure deserialization
  - Security misconfiguration
  - Sensitive data exposure

#### Phase 3: RECOMMEND
- Categorize findings by CWE
- Provide WHAT/WHY/HOW for each finding:
  - **WHAT** - The vulnerability
  - **WHY** - The security risk
  - **HOW** - How to fix it
- Include secure code examples
- Prioritize by exploitability

#### Phase 4: DOCUMENT
- Create remediation guide
- Map findings to OWASP/CWE
- Provide secure coding patterns

#### Phase 5: DELIVER
- Present findings
- Explain vulnerabilities
- Capture questions

### Deliverables

```
output/advisory/code-reviews/{project}-{YYYY-MM-DD}/
├── REVIEW-SUMMARY.md       # Overview of review scope and findings
├── FINDINGS.md             # Detailed vulnerabilities with WHAT/WHY/HOW
├── REMEDIATION-GUIDE.md    # Secure coding guidance and fixes
└── FULL-REPORT.md          # Consolidated report
```

### Vulnerability Classification

**Map findings to:**
- **OWASP Top 10** - Web application security risks
- **CWE Top 25** - Most dangerous software weaknesses
- **SANS Top 25** - Most dangerous programming errors

**Example finding format:**
```markdown
## [CRITICAL] SQL Injection in User Login

**CWE:** CWE-89 (SQL Injection)
**OWASP:** A03:2021 - Injection

### WHAT
User input is directly concatenated into SQL query without sanitization.

### WHY
Attacker can execute arbitrary SQL, bypass authentication, or extract sensitive data.

### HOW
Use parameterized queries or ORM with prepared statements:

\`\`\`python
# Bad
query = f"SELECT * FROM users WHERE username = '{username}'"

# Good
cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
\`\`\`
```

### Effort Level

- **THOROUGH** - Always requires EnterPlanMode
- Full 5-phase workflow
- Professional deliverables

---

## Mode Selection Decision Tree

```
What does the user need?
│
├── Quick security question?
│   └── Mode: AD-HOC
│       └── Direct response with framework references
│
├── Architecture/design review?
│   └── Route to /sec-review (separate standalone skill)
│       └── Security agent with STRIDE/PASTA + optional Domain B/C
│
├── Code security review?
│   └── Mode: CODE-REVIEW
│       └── Full 5-phase workflow
│       └── Deliverable: Code security report
│
└── Strategic guidance needed?
    └── Mode: AD-HOC (documented)
        └── Research + documented advisory report
```

---

## Related Workflows

**Workflow files in `workflows/` directory:**
- `workflows/ad-hoc-advisory.md` - Ad-hoc mode workflow
- `workflows/code-review.md` - Full code review workflow

**For architecture security review:** See `skills/sec-review/` (standalone skill)

**Phase files in `phases/` directory:**
- `phases/01-intake.md` - Context gathering
- `phases/02-analyze.md` - Analysis phase
- `phases/03-recommend.md` - Recommendations
- `phases/04-document.md` - Documentation
- `phases/05-deliver.md` - Delivery

---

**Version:** 1.0
**Last Updated:** 2026-01-19
**Source:** Extracted from SKILL.md for maintainability
