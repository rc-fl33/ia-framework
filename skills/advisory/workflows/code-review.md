# Code Review Workflow

**Full 5-phase security code review with CWE classification and dynamic language support.**

---

## Overview

This workflow executes a comprehensive code security review:
1. Gather code, detect language, ensure guide availability (**auto-generates guides for new languages**)
2. Analyze for vulnerabilities using language-specific patterns (OWASP/CWE)
3. Classify and prioritize findings
4. Generate remediation guidance
5. Create professional deliverables

**Language Support:** This workflow automatically generates security guides for any language that doesn't have one yet. Once generated, guides are saved permanently and reused for future reviews.


**Currently Supported:**
- ✅ Python (17 patterns, 60+ checks, Django/Flask/FastAPI)
- ✅ JavaScript (17 patterns, 75+ checks, React/Express/Next.js/Vue)
- ✅ Java (16 patterns, 80+ checks, Spring Boot/Spring Security/Jakarta EE)
- 🔄 Any other language (auto-generated on first use: Rust, Go, PHP, Ruby, C#, etc.)
- 🔄 Polyglot projects (multiple languages detected and reviewed together)

---

## Phase Execution

### Phase 1: INTAKE

**Goal:** Gather code location, detect language, ensure guide availability

**Steps:**

1. **Identify code source:**
   - Directory path
   - Specific files
   - Git repository
   - Company name/URL (optional — used to discover additional technology context in Step 2b)

2. **Detect programming language(s):**
   ```bash
   # Automated detection using TypeScript script
   bun run skills/advisory/scripts/detect-language.ts /path/to/code --json

   # Returns:
   {
     "primary": { "language": "python", "confidence": "high", "frameworks": ["FastAPI"] },
     "secondary": [{ "language": "javascript", "confidence": "medium" }],
     "polyglot": true  # Multiple languages detected
   }

   # Manual detection (fallback):
   Priority 1: Check for package files (most reliable)
     - package.json → JavaScript/TypeScript
     - pom.xml/build.gradle → Java
     - requirements.txt/pyproject.toml → Python
     - Cargo.toml → Rust
     - composer.json → PHP
     - Gemfile → Ruby
     - go.mod → Go
     - *.csproj → C#

   Priority 2: Count files by extension
     - Primary language = highest file count

   Priority 3: Check shebang lines
     - #!/usr/bin/python → Python
     - #!/usr/bin/node → JavaScript
   ```

   **If polyglot project detected:**
   → Continue with multi-language review process

3. **Check language guide availability:**
   ```
   Check: docs/languages/{language}/manifest.yaml exists?
     ├─ YES → ✅ Guide available
     │         Load patterns, checklist, examples
     │         Proceed to step 4
     │
     └─ NO → 🔄 Guide missing - auto-generate
               │
               ├─ Inform user: "Generating {language} security guide..."
               │
               ├─ Execute generate-language-guide workflow:
               │   1. RESEARCH: Gather {language} security knowledge
               │   2. PATTERNS: Create 12+ vulnerability patterns
               │   3. CHECKLIST: Generate 50+ security checks
               │   4. EXAMPLES: Create 10+ code examples
               │   5. VALIDATE: Quality assurance
               │
               ├─ Save guide to docs/languages/{language}/
               │
               ├─ Inform user: "✅ {Language} guide complete"
               │
               └─ Proceed to step 4
   ```

4. **Automated Research (Step 2b):**
   - After language detection and guide loading, automatically fetch CVE data for detected frameworks:
     ```bash
     bun run tools/nvd/client.ts searchCVEsByKeyword "{framework}" --startDate "2023-01-01" --limit 10
     ```
   - Generate targeted scan checklist from CVE CWE categories (e.g., if CVEs show CWE-89, prioritize SQL injection patterns)
   - Write `research-brief.md` to output directory with:
     - Detected language/framework
     - CVEs found (by severity)
     - CWE categories to prioritize in scan
     - Language guide patterns loaded
   - Proceed with specific focus areas instead of generic questions
   - **Non-blocking:** If NVD fails, continue with language guide patterns only
   - **QUICK mode:** Skip this step entirely

   **Intermediate output:** `research-brief.md` (consumed by Phase 2 Step 0)

5. **Determine review depth:**
   - Quick: High-severity vulnerabilities only
   - Standard: OWASP Top 10 coverage
   - Deep: Comprehensive review with all patterns

6. **Define focus areas:**
   - Specific vulnerability classes
   - Framework-specific checks
   - Compliance requirements (if any)
   - CVE-informed priorities (from Step 2b, if available)

**Gate:** Code accessible, language detected, **security guide available**, scope defined

**Decision Tree:**
```
Code Review Request
        │
        ▼
  Detect Language
        │
        ▼
  Guide Exists?
    ├─ YES → Continue Review
    │
    └─ NO  → Generate Guide
              │
              ├─ Research
              ├─ Patterns
              ├─ Checklist
              ├─ Examples
              ├─ Validate
              │
              └─ Save & Continue
```

### Phase 2: ANALYZE

**Goal:** Identify security vulnerabilities using language-specific guides

**Steps:**

1. **Load Language Guide:**
   ```
   Load from docs/languages/{language}/
     - patterns.yaml → Vulnerability patterns to search for
     - checklist.yaml → Security checks to perform
     - examples.md → Reference for code examples
   ```

2. **Pattern-Based Analysis:**
   - Search for each pattern from `patterns.yaml`
   - Check for vulnerable code matching patterns
   - Record file location, line number, code snippet

3. **Checklist Validation:**
   - Execute each check from `checklist.yaml`
   - Validate against framework-specific checks
   - Mark pass/fail for each item

4. **OWASP Top 10 Checks:**
   - A01: Broken Access Control
   - A02: Cryptographic Failures
   - A03: Injection
   - A04: Insecure Design
   - A05: Security Misconfiguration
   - A06: Vulnerable Components
   - A07: Auth Failures
   - A08: Data Integrity Failures
   - A09: Logging Failures
   - A10: SSRF

5. **Framework-Specific Analysis:**
   - Apply framework-specific checks from checklist
   - Check framework security configurations
   - Validate framework best practices

6. **Code Pattern Search:**
   - User input handling
   - Database queries
   - Authentication logic
   - Cryptographic operations
   - File operations
   - External API calls
   - Language-specific patterns (unsafe blocks, eval, etc.)

**Quality Check:**
- Each finding must match a pattern from `patterns.yaml`
- Each finding must have CWE classification
- Reference secure example from `examples.md` for remediation

**Gate:** All in-scope code reviewed, findings documented with pattern references

### Phase 3: RECOMMEND

**Goal:** Classify findings and generate remediation

**Steps:**
1. Assign CWE classification
2. Assign severity (Critical/High/Medium/Low)
3. Generate remediation with code examples
4. Prioritize (P0-P3)

**Finding Format (MANDATORY):**
```markdown
### Finding [N]: [Title]

**Severity:** Critical | High | Medium | Low
**CWE:** CWE-XXX ([Name])
**OWASP:** [Category]

**WHAT:** [What is the vulnerability]

**WHERE:**
- File: `path/to/file.ext`
- Line: [line number]
- Code:
```[language]
[vulnerable code snippet]
```

**WHY:** [Why this is vulnerable - explain the attack]

**HOW:** [How to fix it]
```[language]
[fixed code example]
```
```

**Gate:** All findings have WHAT/WHY/HOW + CWE

### Phase 4: DOCUMENT

**Goal:** Create professional deliverables

**Output structure:**
```
output/advisory/code-reviews/{project}-{YYYY-MM-DD}/
├── EXECUTIVE-SUMMARY.md      # High-level overview
├── REVIEW-SUMMARY.md         # Scope, methodology, stats
├── FINDINGS.md               # All findings with details
├── REMEDIATION-GUIDE.md      # Prioritized fix list
├── FULL-REPORT.md            # Consolidated report
└── metadata.json             # Engagement metadata
```

**Gate:** All deliverables complete

### Phase 5: DELIVER

**Goal:** Present to user and capture feedback

**Steps:**
1. Summarize key statistics
2. Highlight critical findings (P0)
3. Present remediation priority
4. Suggest follow-up
5. Capture feedback

**Gate:** User can access all deliverables

---

## CWE Quick Reference

| Category | CWE | Description |
|----------|-----|-------------|
| Injection | CWE-89 | SQL Injection |
| Injection | CWE-79 | Cross-Site Scripting (XSS) |
| Injection | CWE-78 | OS Command Injection |
| Auth | CWE-287 | Improper Authentication |
| Auth | CWE-306 | Missing Authentication |
| Access | CWE-862 | Missing Authorization |
| Access | CWE-639 | Authorization Bypass |
| Crypto | CWE-327 | Broken Crypto Algorithm |
| Crypto | CWE-328 | Reversible One-Way Hash |
| Data | CWE-200 | Exposure of Sensitive Info |
| Data | CWE-532 | Insertion of Sensitive Info into Log |
| Memory | CWE-119 | Buffer Overflow |
| Memory | CWE-416 | Use After Free |
| Input | CWE-20 | Improper Input Validation |
| Input | CWE-22 | Path Traversal |

---

## Quality Checklist

- [ ] All code in scope reviewed
- [ ] All findings have WHAT/WHY/HOW
- [ ] All findings have CWE classification
- [ ] All findings have severity rating
- [ ] Remediation includes code examples
- [ ] No false positives included
- [ ] Professional formatting

---

## Related Files

**Workflows:**
- `workflows/generate-language-guide.md` - Auto-generate language guides (5-phase workflow)
- `workflows/enhance-language-guide.md` - Add patterns/frameworks to existing guides

**Scripts:**
- `scripts/detect-language.ts` - Automated language detection (TypeScript)

**Documentation:**
- `docs/language-guide-template.md` - Template for language guide structure and quality standards
- `docs/languages/{language}/` - Language-specific security guides
  - `manifest.yaml` - Language metadata
  - `patterns.yaml` - Vulnerability patterns
  - `checklist.yaml` - Security checks
  - `examples.md` - Code examples
  - `CHANGELOG.md` - Version history (if exists)

**Templates:**
- `templates/code-review-report.md` - Report template

**Other:**
- `phases/01-intake.md` - Detailed intake instructions (if exists)
- `phases/02-analyze.md` - Analysis methodology (if exists)
- `docs/secure-coding-standards.md` - Coding standards reference (if exists)
