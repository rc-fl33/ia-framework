# Language-Specific Code Review Guides

**Purpose:** Template-based code review system that adapts to any programming language
**Pattern:** Similar to compliance/frameworks/ - dynamic resource loading

---

## Directory Structure

```
languages/
├── _template.yaml          # Template for creating new language guides
├── python/
│   ├── manifest.yaml       # Language metadata & detection rules
│   ├── patterns.yaml       # Vulnerability patterns (TODO)
│   ├── checklist.yaml      # Code review checklist (TODO)
│   └── examples.md         # Code examples (TODO)
├── javascript/
├── java/
├── go/
├── rust/
├── php/
├── ruby/
└── csharp/
```

---

## How It Works

### 1. Language Detection (Phase 0)

**During code review intake:**
```
1. Scan codebase for file extensions and package files
2. Calculate language distribution:
   - Python: 145 files (65%) → PRIMARY
   - JavaScript: 52 files (23%) → SECONDARY
   - Shell: 18 files (8%) → IGNORE (<10%)

3. Load manifests for PRIMARY and SECONDARY languages
4. Build combined checklist
```

### 2. Resource Loading (Phase 2)

**For each detected language:**
```
IF manifest.yaml exists:
  - Load language metadata
  - Load patterns.yaml (vulnerability patterns)
  - Load checklist.yaml (code review checklist)
  - Load examples.md (code examples)

ELSE:
  - Use generic OWASP ASVS Level 2 baseline
  - WARN user: "Limited support for {language}"
  - Recommend creating language guide
```

### 3. Checklist Combination (Phase 3)

**For multi-language projects:**
```
combined_checklist:
  - Primary language: 100% coverage
  - Secondary languages: Critical paths only (80%)
  - Tertiary languages: Spot checks (<10%)
```

---

## Creating a New Language Guide

### Step 1: Copy Template
```bash
mkdir docs/languages/kotlin/
cp docs/languages/_template.yaml docs/languages/kotlin/manifest.yaml
```

### Step 2: Fill in manifest.yaml
```yaml
language:
  name: "Kotlin"
  aliases: ["kt", "kotlin"]
  file_extensions: [".kt", ".kts"]
  frameworks: ["Spring Boot", "Ktor", "Android"]
  version_current: "1.9"
  version_minimum_secure: "1.7"
```

### Step 3: Create patterns.yaml
```yaml
patterns:
  - id: KT-89-001
    cwe: 89
    category: SQL Injection
    severity: CRITICAL
    owasp: A03
    vulnerable_pattern: |
      val query = "SELECT * FROM users WHERE id = $userId"
    secure_pattern: |
      val query = "SELECT * FROM users WHERE id = ?"
```

### Step 4: Create checklist.yaml
```yaml
checklist:
  authentication:
    required: true
    items:
      - id: AUTH-01
        check: "No hardcoded credentials"
        severity: CRITICAL
        cwe: 798
```

### Step 5: Create examples.md
```markdown
# Kotlin Secure Coding Examples

## SQL Injection (CWE-89)

### Vulnerable
...code...

### Secure
...code...
```

### Step 6: Update manifest status
```yaml
status: "complete"
```

---

## Language Status

| Language | Manifest | Patterns | Checklist | Examples | Status |
|----------|----------|----------|-----------|----------|--------|
| Python | ✅ | ❌ | ❌ | ❌ | Partial |
| JavaScript | ✅ | ❌ | ❌ | ❌ | Partial |
| Java | ✅ | ❌ | ❌ | ❌ | Partial |
| Go | ❌ | ❌ | ❌ | ❌ | Stub |
| Rust | ❌ | ❌ | ❌ | ❌ | Stub |
| PHP | ❌ | ❌ | ❌ | ❌ | Stub |
| Ruby | ❌ | ❌ | ❌ | ❌ | Stub |
| C# | ❌ | ❌ | ❌ | ❌ | Stub |

**Phase 1 Complete:** Python, JavaScript, Java manifests created
**Phase 2 (TODO):** Create patterns, checklists, examples for top 3 languages
**Phase 3 (TODO):** Add Go, Rust, PHP, Ruby, C# complete guides

---

## Integration with Code Review Workflow

**See:** `skills/advisory/workflows/code-review.md`

**Decision Tree:**
```
Phase 0: Language Detection
  ↓
Phase 1: Load Language Resources
  ↓
Phase 2: Build Combined Checklist
  ↓
Phase 3: Execute Language-Specific Scans
  ↓
Phase 4: Generate Language-Aware Report
```

---

## Maintenance

**Quarterly Updates:**
- Check for new framework versions
- Update version_current and version_minimum_secure
- Add new frameworks to framework_coverage
- Update CWE applicable list if new weaknesses discovered

**Annual Updates:**
- Review and update vulnerability patterns
- Add new patterns based on CVE disclosures
- Update examples with real-world case studies

---

**Created:** 2026-01-17
**Last Updated:** 2026-01-17
**Maintainer:** Advisory skill
