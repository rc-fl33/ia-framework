# Generate Language Guide Workflow

**Auto-generate comprehensive security guide for any programming language.**

---

## When to Use This Workflow

**Trigger Conditions:**
- Code review requested for language without existing guide
- User explicitly requests language support: "Add support for Rust"
- Phase 1 INTAKE detects unsupported language

**Auto-Triggered By:**
- Code review workflow when `docs/languages/{language}/manifest.yaml` not found
- Direct invocation: "Generate security guide for {language}"

---

## Overview

Generate complete language security guide following proven Python/JavaScript/Java methodology:

```
RESEARCH → PATTERNS → CHECKLIST → EXAMPLES → VALIDATE
```

**Output:** 4 files in `docs/languages/{language}/`
- `manifest.yaml` - Language metadata
- `patterns.yaml` - 12+ vulnerability patterns with CWE mapping
- `checklist.yaml` - 50+ security checks with OWASP ASVS alignment
- `examples.md` - 10+ vulnerability classes with before/after examples

---

## Phase Execution

### Phase 1: RESEARCH

**Goal:** Gather language-specific security knowledge

**Steps:**

1. **Search for Security Vulnerabilities:**
   ```
   WebSearch: "{language} security vulnerabilities 2026"
   WebSearch: "{language} OWASP secure coding guide"
   WebSearch: "CWE {language} common weaknesses"
   WebSearch: "{language} CVE recent"
   ```

2. **Find Official Security Documentation:**
   ```
   WebFetch: Official language security guide
   WebFetch: Language-specific CERT coding standard (if exists)
   ```

3. **Identify Framework Ecosystem:**
   - Research top 3-5 frameworks for language
   - Find framework-specific security guides
   - Example: Rust → Actix-web, Rocket, Tokio

4. **Map to CWE Top 25:**
   - Identify which CWE vulnerabilities apply to language
   - Note language-specific vulnerability classes
   - Example: Rust → unsafe blocks, FFI, panic safety

5. **Document Research Findings:**
   ```
   output/advisory/language-guides/{language}-research-{date}/
   ├── vulnerabilities.md     # Top 15-20 vulnerabilities found
   ├── frameworks.md          # Framework ecosystem map
   ├── official-docs.md       # Links to official security resources
   └── cwe-mapping.md         # CWE applicability analysis
   ```

**Quality Gate:**
- [ ] Identified minimum 10 vulnerability classes
- [ ] Found official security documentation
- [ ] Identified top 3 frameworks
- [ ] Mapped to CWE Top 25 (which apply?)

---

### Phase 2: PATTERNS

**Goal:** Create vulnerability patterns with code examples

**Template:**
```yaml
patterns:
  - id: {LANG}-{CWE}-{NUM}
    cwe: {CWE_NUMBER}
    category: {CATEGORY}
    severity: CRITICAL | HIGH | MEDIUM | LOW
    owasp_asvs: V{X}.{Y}.{Z}
    description: {DESCRIPTION}

    vulnerable_pattern: |
      {INSECURE_CODE_EXAMPLE}

    secure_pattern: |
      {SECURE_CODE_EXAMPLE}
```

**Steps:**

1. **Generate Core Patterns (Mandatory):**
   - SQL Injection (CWE-89) - if database language
   - Command Injection (CWE-78) - if OS interaction
   - Path Traversal (CWE-22)
   - Hardcoded Credentials (CWE-798)
   - Weak Cryptography (CWE-327)
   - Missing Authorization (CWE-862)

2. **Generate Language-Specific Patterns:**
   - **Rust:** Unsafe blocks, FFI, panic handling, data races
   - **PHP:** Type juggling, eval(), unserialize(), SQL injection
   - **Go:** Goroutine safety, defer patterns, SQL injection
   - **Ruby:** Mass assignment, command injection, YAML deserialization
   - **C#:** SQL injection, XSS, deserialization, XXE

3. **Generate Framework-Specific Patterns:**
   - Top framework vulnerabilities
   - Framework-specific mitigations
   - Example: Laravel → mass assignment, blade XSS

4. **For Each Pattern:**
   - Write vulnerable code example (realistic, compilable)
   - Write secure code example (best practice)
   - Add CWE number and OWASP ASVS reference
   - Assign severity based on CVSS

**Quality Gate:**
- [ ] Minimum 12 patterns created
- [ ] Each pattern has vulnerable + secure example
- [ ] All code examples syntactically correct
- [ ] CWE mapping complete (100%)
- [ ] OWASP ASVS references included (80%+)
- [ ] Framework-specific patterns for top 2 frameworks

**Output:** `docs/languages/{language}/patterns.yaml`

---

### Phase 3: CHECKLIST

**Goal:** Create comprehensive security checklist

**Template:**
```yaml
checklist:
  {category}:
    required: true
    items:
      - id: {CATEGORY}-{NUM}
        check: "{SPECIFIC_CHECK_DESCRIPTION}"
        severity: CRITICAL | HIGH | MEDIUM | LOW
        cwe: {CWE_NUMBER}
        patterns_to_check: ["{LANG}-{CWE}-{NUM}"]
        references:
          - "OWASP ASVS V{X}.{Y}.{Z}"
```

**Steps:**

1. **Create Universal Categories:**
   - input_validation
   - authentication
   - authorization
   - session_management (if web language)
   - cryptography
   - database_security (if applicable)
   - error_handling
   - logging
   - dependencies

2. **Add Language-Specific Categories:**
   - **Rust:** unsafe_code, ffi, concurrency
   - **PHP:** configuration, deserialization
   - **Go:** concurrency, defer_panic
   - **Ruby:** metaprogramming, gems
   - **C#:** linq, entity_framework

3. **Add Framework-Specific Sections:**
   ```yaml
   framework_specific:
     {framework_name}:
       - id: {FRAMEWORK}-{NUM}
         check: "{FRAMEWORK_SPECIFIC_CHECK}"
         severity: {SEVERITY}
   ```

4. **For Each Check:**
   - Write clear, testable check description
   - Link to relevant pattern(s)
   - Add OWASP ASVS reference
   - Assign severity rating

**Quality Gate:**
- [ ] Minimum 50 checks created
- [ ] All OWASP Top 10 categories covered
- [ ] Framework-specific sections for top 2-3 frameworks
- [ ] All checks have severity ratings
- [ ] Pattern cross-references included
- [ ] OWASP ASVS alignment verified

**Output:** `docs/languages/{language}/checklist.yaml`

---

### Phase 4: EXAMPLES

**Goal:** Generate real-world code examples

**Template:**
```markdown
## {VULNERABILITY_CLASS}

**CWE:** CWE-{NUMBER} ({NAME})
**OWASP ASVS:** V{X}.{Y}.{Z}
**Severity:** {CRITICAL|HIGH|MEDIUM|LOW}

### Vulnerable Code

```{language}
{REALISTIC_VULNERABLE_EXAMPLE}
```

**Why This Is Dangerous:**
{EXPLANATION_OF_ATTACK_VECTOR}

### Secure Code

```{language}
{SECURE_EXAMPLE_WITH_BEST_PRACTICES}
```

**Why This Is Secure:**
{EXPLANATION_OF_MITIGATION}

### Framework-Specific Example ({FRAMEWORK})

```{language}
{FRAMEWORK_SPECIFIC_SECURE_PATTERN}
```
```

**Steps:**

1. **Generate Examples for Top Vulnerabilities:**
   - Use patterns from Phase 2 as starting point
   - Expand each pattern into full example with context
   - Add realistic scenario (e.g., login form, API endpoint)

2. **For Each Vulnerability Class:**
   - Show vulnerable code with explanation
   - Show secure code with explanation
   - Add framework-specific variant if applicable
   - Include attack scenario description

3. **Coverage Requirements:**
   - Minimum 10 vulnerability classes
   - Prioritize: Injection, XSS, Auth, Crypto, Deserialization
   - Include language-specific vulnerabilities
   - Add framework examples for popular frameworks

4. **Code Quality:**
   - All examples must compile/run
   - Use realistic variable names and scenarios
   - Follow language idioms and conventions
   - Include comments explaining security relevance

**Quality Gate:**
- [ ] Minimum 10 vulnerability classes documented
- [ ] All examples syntactically valid
- [ ] Clear before/after contrast for each
- [ ] Attack vectors explained
- [ ] Framework examples for top 2 frameworks
- [ ] Examples follow language conventions

**Output:** `docs/languages/{language}/examples.md`

---

### Phase 5: VALIDATE

**Goal:** Quality assurance before use

**Validation Checklist:**

1. **File Completeness:**
   - [ ] manifest.yaml exists and complete
   - [ ] patterns.yaml exists with 12+ patterns
   - [ ] checklist.yaml exists with 50+ checks
   - [ ] examples.md exists with 10+ classes

2. **Manifest Quality:**
   - [ ] Language name and aliases correct
   - [ ] File extensions complete
   - [ ] Top frameworks listed (3-5)
   - [ ] Version information accurate
   - [ ] Detection patterns comprehensive

3. **Patterns Quality:**
   - [ ] Minimum 12 patterns
   - [ ] All CWE numbers valid
   - [ ] All patterns have vulnerable + secure examples
   - [ ] Code examples syntactically correct
   - [ ] OWASP ASVS references valid
   - [ ] Severity ratings assigned

4. **Checklist Quality:**
   - [ ] Minimum 50 checks
   - [ ] All categories present
   - [ ] Framework-specific sections included
   - [ ] All checks have severity
   - [ ] Pattern cross-references valid
   - [ ] OWASP ASVS Level 2 aligned

5. **Examples Quality:**
   - [ ] Minimum 10 vulnerability classes
   - [ ] All code examples valid syntax
   - [ ] Attack vectors explained
   - [ ] Mitigations explained
   - [ ] Framework examples included

6. **Cross-Reference Validation:**
   - [ ] Pattern IDs match between files
   - [ ] CWE numbers consistent
   - [ ] No broken references

7. **Final Metadata:**
   - [ ] Update manifest.yaml: `status: "complete"`
   - [ ] Update manifest.yaml: `last_updated: "{YYYY-MM-DD}"`
   - [ ] Update manifest.yaml: `pattern_count: {ACTUAL_COUNT}`

**Quality Gate:**
- [ ] ALL validation checklist items passed
- [ ] No broken cross-references
- [ ] Guide meets quality standards
- [ ] Ready for production use

**Output:** Validated language guide ready for code review

---

## Integration with Code Review

**This workflow is auto-triggered during code review Phase 1:**

```
Code Review Phase 1: INTAKE
  ↓
Language Detection
  ↓
Check: docs/languages/{language}/manifest.yaml exists?
  ↓
NO → Trigger This Workflow
  ↓
Generate Language Guide (5 phases)
  ↓
Validate Quality
  ↓
Continue Code Review with New Guide
```

**User Messaging:**
```
"Detected {language} codebase. Generating comprehensive security guide...

✅ Phase 1: RESEARCH - Gathered {language} security knowledge
✅ Phase 2: PATTERNS - Created 15 vulnerability patterns
✅ Phase 3: CHECKLIST - Generated 62 security checks
✅ Phase 4: EXAMPLES - Created 12 code examples
✅ Phase 5: VALIDATE - Quality check passed

{Language} security guide complete. Proceeding with code review..."
```

---

## Language-Specific Guidance

### For Compiled Languages (Rust, Go, C#)
- Focus on memory safety, concurrency
- Include compiler warnings/linters
- Cover unsafe operations
- Framework-specific: Actix/Rocket (Rust), Gin/Echo (Go), ASP.NET (C#)

### For Scripting Languages (PHP, Ruby, Python)
- Focus on injection vulnerabilities
- Include deserialization risks
- Cover eval/exec dangers
- Framework-specific: Laravel/Symfony (PHP), Rails (Ruby), Django/Flask (Python)

### For Functional Languages (Elixir, Haskell)
- Focus on side effects, IO
- Include serialization
- Cover type safety boundaries
- Framework-specific: Phoenix (Elixir), Servant/Yesod (Haskell)

---

## Success Criteria

**Guide Generation Success:**
- [ ] All 4 files created and validated
- [ ] Quality gates passed
- [ ] Guide usable for code review immediately
- [ ] Generation completed in < 5 minutes
- [ ] No manual intervention required

**Long-term Success:**
- [ ] Generated guides reusable for future reviews
- [ ] Quality comparable to manually-created guides
- [ ] User experience seamless
- [ ] Framework coverage comprehensive

---

## Related Files

- `docs/language-guide-template.md` - Master template
- `workflows/code-review.md` - Integration point
- `docs/languages/{language}/` - Output location

---

**Version:** 1.0
**Status:** Ready for implementation
**Last Updated:** 2026-01-18
