# Enhance Language Guide Workflow

**Add patterns, frameworks, or improvements to existing language security guides.**

---

## Overview

Language guides evolve over time:
- New vulnerability patterns discovered
- New frameworks gain popularity
- Security standards updated
- Real-world findings from code reviews

This workflow enhances existing guides while maintaining quality and consistency.

---

## When to Use

**Trigger Conditions:**
- New vulnerability pattern discovered during code review
- User requests framework addition: "Add Laravel support to PHP guide"
- Security advisory published for language/framework
- Guide quality improvement needed
- Annual guide refresh

**Example Scenarios:**
```
Scenario 1: New Pattern from Code Review
  "During Python review, found FastAPI-specific CORS misconfiguration not in guide"
  → Add pattern PY-942-002: CORS misconfiguration (FastAPI)

Scenario 2: Framework Addition
  "Need to add Svelte framework to JavaScript guide"
  → Add Svelte-specific XSS patterns and checklist items

Scenario 3: Standard Update
  "OWASP ASVS 5.1 released with new requirements"
  → Update all guides with new ASVS references
```

---

## Enhancement Types

### Type 1: Add New Pattern

**When:** New vulnerability pattern discovered

**Input:**
- Language: Python
- Pattern: CORS misconfiguration in FastAPI
- CWE: 942
- Example code (vulnerable + secure)

**Output:**
- New pattern added to `patterns.yaml`
- New checklist item added
- New example added to `examples.md`
- Metadata updated

### Type 2: Add Framework Support

**When:** Popular framework needs coverage

**Input:**
- Language: JavaScript
- Framework: Svelte
- Version: 4.0+

**Output:**
- Framework-specific patterns added
- Framework-specific checklist section added
- Framework examples added
- Manifest updated with framework

### Type 3: Update Existing Pattern

**When:** Pattern needs improvement or correction

**Input:**
- Pattern ID: PY-89-001 (SQL Injection)
- Update: Add SQLAlchemy 2.0 example

**Output:**
- Pattern updated with new example
- Examples.md updated
- Version incremented

### Type 4: Bulk Quality Improvement

**When:** Guide needs refresh or standardization

**Input:**
- Language: All
- Improvement: Add OWASP ASVS 5.1 references

**Output:**
- All guides updated with new references
- Metadata updated
- Changelog maintained

---

## Workflow Phases

### Phase 1: ASSESS

**Goal:** Understand what enhancement is needed

**Steps:**

1. **Identify Enhancement Type:**
   ```
   What are we enhancing?
     ├─ Add new pattern → Type 1
     ├─ Add framework → Type 2
     ├─ Update pattern → Type 3
     └─ Bulk improvement → Type 4
   ```

2. **Validate Current Guide:**
   ```bash
   # Check guide exists
   ls docs/languages/{language}/manifest.yaml

   # Review current content
   cat docs/languages/{language}/patterns.yaml | grep {pattern}
   ```

3. **Check for Conflicts:**
   - Pattern ID already exists?
   - Framework already covered?
   - Duplicate examples?

4. **Define Enhancement Scope:**
   ```markdown
   Enhancement Request:
     - Language: Python
     - Type: Add Pattern
     - Pattern: CORS misconfiguration (FastAPI)
     - CWE: 942
     - Files to update: patterns.yaml, checklist.yaml, examples.md
     - Estimated impact: 1 pattern, 2 checks, 1 example
   ```

**Gate:** Enhancement validated, no conflicts, scope defined

---

### Phase 2: RESEARCH

**Goal:** Gather information for enhancement

**Steps (varies by type):**

**For New Pattern:**
1. Research vulnerability:
   ```
   WebSearch: "{language} {vulnerability} 2026"
   WebSearch: "CWE-{number} {language} examples"
   WebFetch: Official framework security docs
   ```

2. Find real-world examples:
   - GitHub code search
   - Security advisories (CVE databases)
   - OWASP resources

3. Identify mitigation:
   - Framework best practices
   - Language-specific secure patterns
   - Industry standards

**For Framework Addition:**
1. Research framework:
   ```
   WebSearch: "{framework} security best practices"
   WebFetch: {framework} security documentation
   WebSearch: "{framework} common vulnerabilities"
   ```

2. Identify framework-specific patterns:
   - Authentication mechanisms
   - Input validation approaches
   - Common misconfigurations

3. Map to existing patterns:
   - Which existing patterns apply?
   - Which need framework-specific variants?

**Quality Gate:**
- [ ] Research complete with credible sources
- [ ] Vulnerability well understood
- [ ] Mitigation validated
- [ ] Code examples prepared

---

### Phase 3: IMPLEMENT

**Goal:** Update guide files with enhancement

### Type 1: Add New Pattern

**Step 1: Add to patterns.yaml**

```yaml
# Add new pattern at end of file
  - id: {LANG}-{CWE}-{NEXT_NUM}
    cwe: {CWE_NUMBER}
    category: {CATEGORY}
    severity: CRITICAL | HIGH | MEDIUM | LOW
    owasp_asvs: V{X}.{Y}.{Z}
    description: {CLEAR_DESCRIPTION}

    vulnerable_pattern: |
      {REALISTIC_VULNERABLE_CODE}

    secure_pattern: |
      {SECURE_CODE_WITH_MITIGATION}
```

**Step 2: Add to checklist.yaml**

```yaml
# Find appropriate category or create new one
{category}:
  required: true
  items:
    # Add new check
    - id: {CATEGORY}-{NEXT_NUM}
      check: "{SPECIFIC_TESTABLE_CHECK}"
      severity: {SEVERITY}
      cwe: {CWE_NUMBER}
      patterns_to_check: ["{LANG}-{CWE}-{NUM}"]
      references:
        - "OWASP ASVS V{X}.{Y}.{Z}"
```

**Step 3: Add to examples.md**

```markdown
# Add new section
## {VULNERABILITY_CLASS}

**CWE:** CWE-{NUMBER} ({NAME})
**OWASP ASVS:** V{X}.{Y}.{Z}
**Severity:** {SEVERITY}

### Vulnerable Code

```{language}
{VULNERABLE_EXAMPLE}
```

**Why This Is Dangerous:**
{EXPLANATION}

### Secure Code

```{language}
{SECURE_EXAMPLE}
```

**Why This Is Secure:**
{EXPLANATION}
```

**Step 4: Update metadata**

```yaml
# In patterns.yaml
metadata:
  total_patterns: {OLD_COUNT + 1}
  last_updated: "{YYYY-MM-DD}"

# In checklist.yaml
metadata:
  total_checks: {OLD_COUNT + 1}
  last_updated: "{YYYY-MM-DD}"

# In manifest.yaml
pattern_count: {NEW_COUNT}
last_updated: "{YYYY-MM-DD}"
```

### Type 2: Add Framework Support

**Step 1: Update manifest.yaml**

```yaml
language:
  frameworks:
    - {Existing1}
    - {Existing2}
    - {NewFramework}  # Add here

framework_coverage: ["{existing}", "{new}"]  # Add to list
```

**Step 2: Add framework-specific patterns**

```yaml
# In patterns.yaml
  - id: {LANG}-{CWE}-{NUM}
    cwe: {CWE}
    category: {CATEGORY}
    severity: {SEVERITY}
    framework: {NewFramework}  # Mark as framework-specific
    description: {FRAMEWORK_SPECIFIC_DESCRIPTION}

    vulnerable_pattern: |
      // {Framework}-specific vulnerable code
      {CODE}

    secure_pattern: |
      // {Framework}-specific secure code
      {CODE}
```

**Step 3: Add framework section to checklist**

```yaml
framework_specific:
  {new_framework}:
    - id: {FRAMEWORK}-01
      check: "{FRAMEWORK_SPECIFIC_CHECK}"
      severity: {SEVERITY}
      references:
        - "{Framework security docs}"

    - id: {FRAMEWORK}-02
      check: "{ANOTHER_CHECK}"
      severity: {SEVERITY}
```

**Step 4: Add framework examples**

```markdown
### Framework-Specific Example ({NewFramework})

```{language}
// Secure pattern for {Framework}
{FRAMEWORK_SPECIFIC_CODE}
```
```

### Type 3: Update Existing Pattern

**Step 1: Locate pattern**

```bash
# Find pattern in patterns.yaml
grep -n "id: {PATTERN_ID}" docs/languages/{lang}/patterns.yaml
```

**Step 2: Update pattern content**

```yaml
# Update description, code, or severity
  - id: {EXISTING_ID}
    cwe: {CWE}
    category: {CATEGORY}
    severity: {UPDATED_SEVERITY}  # If changed
    description: {IMPROVED_DESCRIPTION}

    vulnerable_pattern: |
      {IMPROVED_VULNERABLE_EXAMPLE}

    secure_pattern: |
      {IMPROVED_SECURE_EXAMPLE}
      # Added: {Framework} 2.0 example
      {NEW_FRAMEWORK_VERSION_EXAMPLE}
```

**Step 3: Update related examples**

```markdown
## {Existing Vulnerability}

### Secure Code

```{language}
// Original secure pattern
{ORIGINAL}

// Updated for {Framework} 2.0
{UPDATED_EXAMPLE}
```
```

**Step 4: Document change**

```yaml
# Add to changelog (create if doesn't exist)
# docs/languages/{language}/CHANGELOG.md

## 2026-01-18

### Updated
- Pattern {ID}: Added {Framework} 2.0 example
```

### Type 4: Bulk Quality Improvement

**Step 1: Identify affected guides**

```bash
# List all language guides
ls -d docs/languages/*/
```

**Step 2: For each guide, apply improvement**

```yaml
# Example: Add OWASP ASVS 5.1 references

# Script to update all patterns
for pattern in patterns:
  if pattern.owasp_asvs.startswith("V5."):
    # Map to ASVS 5.1 reference
    pattern.owasp_asvs = map_to_asvs_5_1(pattern.owasp_asvs)
```

**Step 3: Validate consistency**

```bash
# Ensure all guides updated
for lang in languages:
  check_asvs_version(lang) == "5.1"
```

**Quality Gate:**
- [ ] All files updated correctly
- [ ] No syntax errors
- [ ] Cross-references valid
- [ ] Metadata incremented
- [ ] Examples compile/run

---

### Phase 4: VALIDATE

**Goal:** Ensure enhancement maintains quality standards

**Validation Checklist:**

**File Completeness:**
- [ ] All required files updated
- [ ] No broken cross-references
- [ ] Pattern IDs unique
- [ ] CWE numbers valid

**Code Quality:**
- [ ] All code examples syntactically correct
- [ ] Vulnerable examples actually vulnerable
- [ ] Secure examples actually secure
- [ ] Framework examples use current versions

**Documentation Quality:**
- [ ] Descriptions clear and accurate
- [ ] Attack vectors explained
- [ ] Mitigations explained
- [ ] OWASP ASVS references correct

**Metadata Accuracy:**
- [ ] Pattern count updated
- [ ] Total checks updated
- [ ] Last updated date current
- [ ] Framework list accurate

**Testing:**
```bash
# Validate YAML syntax
yamllint docs/languages/{language}/patterns.yaml
yamllint docs/languages/{language}/checklist.yaml
yamllint docs/languages/{language}/manifest.yaml

# Check for broken references
grep -r "patterns_to_check" checklist.yaml | while read line; do
  pattern_id=$(echo $line | grep -o '{LANG}-[0-9]*-[0-9]*')
  grep -q "id: $pattern_id" patterns.yaml || echo "Broken ref: $pattern_id"
done
```

**Quality Gate:**
- [ ] All validation checks passed
- [ ] No regression in existing patterns
- [ ] Enhancement meets quality standards

---

### Phase 5: DOCUMENT

**Goal:** Record enhancement for future reference

**Steps:**

1. **Update Changelog:**
   ```markdown
   # docs/languages/{language}/CHANGELOG.md

   ## {YYYY-MM-DD}

   ### Added
   - Pattern {ID}: {Description}
   - Framework support: {Framework}
   - Checklist items: {COUNT}

   ### Updated
   - Pattern {ID}: {Change description}

   ### Deprecated
   - Pattern {ID}: {Reason}
   ```

2. **Update Guide Stats:**
   ```yaml
   # manifest.yaml
   pattern_count: {NEW_COUNT}
   framework_coverage: [{frameworks}]
   last_updated: "{YYYY-MM-DD}"
   version: "1.1"  # Increment minor version
   ```

3. **Document Enhancement Rationale:**
   ```markdown
   # sessions/{date}-guide-enhancement-{language}.md

   ## Enhancement: {Title}

   **Date:** {YYYY-MM-DD}
   **Language:** {Language}
   **Type:** {Enhancement Type}

   **Rationale:**
   {Why this enhancement was needed}

   **Changes:**
   - Added pattern: {ID}
   - Updated checklist: {Items}
   - Added examples: {Count}

   **Quality Impact:**
   - Before: {stats}
   - After: {stats}

   **Testing:**
   - Validated against: {codebase/scenario}
   - Results: {findings}
   ```

**Quality Gate:**
- [ ] Changelog updated
- [ ] Enhancement documented
- [ ] Version incremented
- [ ] Ready for use

---

## Enhancement Patterns

### Pattern: Add Framework to Existing Guide

**Scenario:** JavaScript guide has React, need to add Svelte

**Steps:**
1. Research Svelte security patterns
2. Identify Svelte-specific vulnerabilities (XSS, reactive statement injection)
3. Add Svelte to manifest.yaml frameworks list
4. Add 2-3 Svelte-specific patterns to patterns.yaml
5. Add Svelte section to checklist.yaml (3-5 checks)
6. Add Svelte examples to examples.md
7. Validate all code examples work with Svelte 4.0+
8. Update metadata

**Result:**
- JavaScript guide now covers: React, Vue, Angular, Express, Next.js, **Svelte**

### Pattern: Improve Pattern Quality

**Scenario:** Python SQL injection pattern uses old syntax

**Steps:**
1. Review current pattern PY-89-001
2. Research modern Python SQL practices (SQLAlchemy 2.0, asyncpg)
3. Update vulnerable example with realistic code
4. Update secure example with current best practices
5. Add framework-specific variants (Django ORM, SQLAlchemy)
6. Validate examples against current versions
7. Document change in changelog

**Result:**
- Pattern PY-89-001 now shows modern, realistic examples

### Pattern: Add Emerging Vulnerability

**Scenario:** New Rust vulnerability discovered (CVE-2024-XXXX)

**Steps:**
1. Analyze CVE details
2. Map to CWE classification
3. Research affected Rust versions
4. Create vulnerable example reproducing issue
5. Create secure example with mitigation
6. Add pattern to patterns.yaml with CVE reference
7. Add checklist item
8. Add example to examples.md
9. Announce enhancement to users

**Result:**
- Rust guide updated with latest security information

---

## Quality Standards

**Enhancement Must Meet:**

| Metric | Standard |
|--------|----------|
| Code Examples | Syntactically correct, compile/run |
| CWE Classification | Valid CWE number from official list |
| OWASP ASVS | Level 2 reference (V{X}.{Y}.{Z}) |
| Severity Rating | Follows CVSS guidelines |
| Documentation | Clear attack vector + mitigation |
| Testing | Validated against real code |

**Version Control:**
- Minor version increment for pattern additions (1.0 → 1.1)
- Patch version for corrections (1.1 → 1.1.1)
- Major version for breaking changes (1.x → 2.0)

---

## Automation Opportunities

**Future Enhancements:**

1. **Automated Vulnerability Tracking:**
   ```bash
   # Script to check for new CVEs
   check-cve-feed.ts --language rust --since 2024-01-01
   # Output: 3 new CVEs found, suggest patterns
   ```

2. **Framework Popularity Tracking:**
   ```bash
   # Track framework adoption
   track-framework-usage.ts --language javascript
   # Output: Svelte usage +50% YoY, suggest adding to guide
   ```

3. **Pattern Quality Metrics:**
   ```bash
   # Analyze pattern effectiveness
   pattern-metrics.ts --language python
   # Output: Pattern PY-89-001 found issues in 45 reviews
   ```

---

## Related Files

- `workflows/generate-language-guide.md` - Initial guide generation
- `workflows/code-review.md` - Using guides in reviews
- `docs/language-guide-template.md` - Guide structure reference

---

## Usage Examples

### Example 1: Add New Pattern

```bash
# User discovers new vulnerability during review
User: "Found CORS misconfiguration in FastAPI not covered by Python guide"

# Execute enhancement workflow
1. Assess: Type 1 (Add Pattern), Language: Python, CWE: 942
2. Research: FastAPI CORS security documentation
3. Implement:
   - Add PY-942-001 to patterns.yaml
   - Add CORS-01 to checklist.yaml (FastAPI section)
   - Add CORS example to examples.md
4. Validate: Test examples against FastAPI 0.109+
5. Document: Update changelog, increment version 1.2 → 1.3
```

### Example 2: Add Framework

```bash
# User requests framework addition
User: "Add Laravel support to PHP guide"

# Execute enhancement workflow
1. Assess: Type 2 (Add Framework), Language: PHP, Framework: Laravel
2. Research: Laravel security features, common vulnerabilities
3. Implement:
   - Add Laravel to manifest.yaml frameworks
   - Add 3 Laravel-specific patterns (mass assignment, blade XSS, etc.)
   - Add Laravel section to checklist.yaml (5 checks)
   - Add Laravel examples to examples.md
4. Validate: Test against Laravel 10+
5. Document: Changelog, version 1.4 → 1.5
```

---

**Version:** 1.0
**Status:** Ready for use
**Last Updated:** 2026-01-18
