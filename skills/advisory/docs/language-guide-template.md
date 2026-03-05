# Language Guide Template

**Master template for generating security guides for any programming language.**

---

## Purpose

This template ensures all language guides follow the same structure and quality standards as Python, JavaScript, and Java guides.

**Generated guides are:**
- Saved in `docs/languages/{language}/`
- Reusable for all future code reviews
- Shareable across the framework
- Version-controlled and maintained

---

## Directory Structure

```
docs/languages/{language}/
├── manifest.yaml      # Language metadata and detection
├── patterns.yaml      # Vulnerability patterns with CWE mapping
├── checklist.yaml     # Security checks with OWASP ASVS alignment
└── examples.md        # Code examples with before/after
```

---

## File 1: manifest.yaml

**Purpose:** Language identification and metadata

```yaml
language:
  name: "{Language}"
  aliases: ["{lang}", "{alt}"]  # e.g., ["js", "node", "nodejs"]
  file_extensions: [".{ext}"]   # e.g., [".rs", ".toml"]
  frameworks:
    - {Framework1}
    - {Framework2}
    - {Framework3}
  version_current: "{Latest}"      # e.g., "1.75.0"
  version_minimum_secure: "{Min}"  # e.g., "1.70.0"

detection:
  file_patterns:
    - "*.{ext}"
    - "{package_file}"           # e.g., "Cargo.toml"
  shebang: "#!/usr/bin/{lang}"   # if applicable
  package_files:
    - "{package_file}"           # e.g., "Cargo.toml"
    - "{lock_file}"              # e.g., "Cargo.lock"

resources:
  official_security: "{URL}"
  package_advisories: "{URL}"
  style_guide: "{URL}"
  cert_standard: "{URL}"         # if exists

owasp_asvs_applicable: true      # Most languages: true
cwe_top25_applicable: [{CWE}, {CWE}, ...]  # List applicable CWEs

pattern_count: {NUMBER}          # Updated after patterns.yaml created
framework_coverage: ["{fw1}", "{fw2}"]

last_updated: "{YYYY-MM-DD}"
status: "complete"
```

**Example (Rust):**
```yaml
language:
  name: "Rust"
  aliases: ["rust", "rs"]
  file_extensions: [".rs", ".toml"]
  frameworks:
    - Actix-web
    - Rocket
    - Tokio
    - Axum
  version_current: "1.75.0"
  version_minimum_secure: "1.70.0"

detection:
  file_patterns:
    - "*.rs"
    - "Cargo.toml"
  shebang: ""
  package_files:
    - "Cargo.toml"
    - "Cargo.lock"

resources:
  official_security: "https://www.rust-lang.org/policies/security"
  package_advisories: "https://rustsec.org/"
  style_guide: "https://doc.rust-lang.org/stable/style-guide/"
  cert_standard: ""

owasp_asvs_applicable: true
cwe_top25_applicable: [119, 200, 327, 502, 78, 22, 862]

pattern_count: 14
framework_coverage: ["actix-web", "rocket"]

last_updated: "2026-01-18"
status: "complete"
```

---

## File 2: patterns.yaml

**Purpose:** Vulnerability patterns with CWE mapping

### Structure

```yaml
patterns:
  # Pattern template
  - id: {LANG}-{CWE}-{NUM}     # e.g., RUST-119-001
    cwe: {CWE_NUMBER}           # e.g., 119
    category: {CATEGORY}        # e.g., "Memory Safety"
    severity: CRITICAL | HIGH | MEDIUM | LOW
    owasp_asvs: V{X}.{Y}.{Z}   # e.g., V5.3.4
    description: {DESCRIPTION}  # Clear, concise description

    vulnerable_pattern: |
      {INSECURE_CODE_EXAMPLE}
      # Must be realistic and compilable

    secure_pattern: |
      {SECURE_CODE_EXAMPLE}
      # Must show best practice mitigation

metadata:
  total_patterns: {COUNT}
  coverage:
    owasp_top_10: [{A01}, {A02}, ...]
    cwe_top_25: [{CWE1}, {CWE2}, ...]
  frameworks_covered: ["{framework1}", "{framework2}"]
  last_updated: "{YYYY-MM-DD}"
  status: "complete"
```

### Required Patterns (Minimum 12)

**Universal Patterns (Apply to most languages):**
1. Hardcoded Credentials (CWE-798)
2. Weak Cryptography (CWE-327)
3. Path Traversal (CWE-22)
4. Missing Authorization (CWE-862)
5. Insecure Random (CWE-330)
6. Information Exposure (CWE-200)

**If Applicable:**
7. SQL Injection (CWE-89) - if database access
8. Command Injection (CWE-78) - if OS interaction
9. XSS (CWE-79) - if web framework
10. XXE (CWE-611) - if XML parsing
11. Deserialization (CWE-502) - if serialization
12. SSRF (CWE-918) - if HTTP client

**Language-Specific Examples:**
- **Rust:** Unsafe blocks (CWE-119), FFI (CWE-129), Data races (CWE-362)
- **PHP:** Type juggling (CWE-843), eval() (CWE-94), unserialize() (CWE-502)
- **Go:** Goroutine races (CWE-362), defer panics (CWE-703), SQL injection (CWE-89)
- **Ruby:** Mass assignment (CWE-915), YAML deserialization (CWE-502), command injection (CWE-78)

### Quality Standards

- [ ] Minimum 12 patterns
- [ ] All CWE numbers valid and documented
- [ ] All patterns have vulnerable + secure examples
- [ ] All code examples syntactically correct
- [ ] OWASP ASVS references included (80%+)
- [ ] Severity ratings follow CVSS guidelines
- [ ] Framework-specific patterns included

---

## File 3: checklist.yaml

**Purpose:** Comprehensive security checklist for code review

### Structure

```yaml
checklist:
  {category}:
    required: true | false
    items:
      - id: {CATEGORY}-{NUM}
        check: "{SPECIFIC_TESTABLE_CHECK}"
        severity: CRITICAL | HIGH | MEDIUM | LOW
        cwe: {CWE_NUMBER}
        patterns_to_check: ["{LANG}-{CWE}-{NUM}"]
        references:
          - "OWASP ASVS V{X}.{Y}.{Z}"
          - "{Additional Reference}"

metadata:
  total_checks: {COUNT}+
  critical_checks: {COUNT}
  high_checks: {COUNT}
  framework_coverage: ["{framework}"]
  cert_standard: "{Standard}" # if applicable
  owasp_asvs_level: 2
  last_updated: "{YYYY-MM-DD}"
  status: "complete"
```

### Required Categories (Minimum 9)

**1. input_validation:**
```yaml
input_validation:
  required: true
  items:
    - id: INPUT-01
      check: "{Language-specific input validation}"
      severity: CRITICAL
      cwe: 20
      patterns_to_check: ["{LANG}-89-001"]
      references:
        - "OWASP ASVS V5.1.1"
```

**2. authentication:**
```yaml
authentication:
  required: true
  items:
    - id: AUTH-01
      check: "Password hashing uses approved algorithm (bcrypt, Argon2, PBKDF2)"
      severity: CRITICAL
      cwe: 327
```

**3. authorization:**
```yaml
authorization:
  required: true
  items:
    - id: AUTHZ-01
      check: "Authorization checks on all protected operations"
      severity: CRITICAL
      cwe: 862
```

**4. session_management:** (if applicable)
```yaml
session_management:
  required: true
  items:
    - id: SESSION-01
      check: "Session tokens have sufficient entropy"
      severity: HIGH
```

**5. cryptography:**
```yaml
cryptography:
  required: true
  items:
    - id: CRYPTO-01
      check: "Strong encryption algorithms (AES-256-GCM, not DES/ECB)"
      severity: CRITICAL
      cwe: 327
```

**6. database_security:** (if applicable)
```yaml
database_security:
  required: true
  items:
    - id: DB-01
      check: "Parameterized queries used (no string concatenation)"
      severity: CRITICAL
      cwe: 89
```

**7. error_handling:**
```yaml
error_handling:
  required: true
  items:
    - id: ERR-01
      check: "No sensitive data in error messages"
      severity: HIGH
      cwe: 200
```

**8. logging:**
```yaml
logging:
  required: true
  items:
    - id: LOG-01
      check: "Security events logged (auth failures, access violations)"
      severity: HIGH
```

**9. dependencies:**
```yaml
dependencies:
  required: true
  items:
    - id: DEP-01
      check: "No known vulnerable dependencies"
      severity: CRITICAL
```

### Optional Categories (Language-Specific)

**Rust:**
```yaml
unsafe_code:
  required: true
  items:
    - id: UNSAFE-01
      check: "Unsafe blocks have safety documentation"
      severity: HIGH
      cwe: 119

concurrency:
  required: true
  items:
    - id: CONCUR-01
      check: "Data races prevented (Arc/Mutex patterns)"
      severity: HIGH
      cwe: 362
```

**PHP:**
```yaml
configuration:
  required: true
  items:
    - id: CONFIG-01
      check: "display_errors disabled in production"
      severity: HIGH
```

### Framework-Specific Sections

```yaml
framework_specific:
  {framework_name}:
    - id: {FRAMEWORK}-01
      check: "{Framework-specific security check}"
      severity: {SEVERITY}
      references:
        - "{Framework security docs}"
```

**Example (Rust + Actix-web):**
```yaml
framework_specific:
  actix_web:
    - id: ACTIX-01
      check: "CORS configured restrictively (not allow all)"
      severity: HIGH

    - id: ACTIX-02
      check: "Request size limits configured"
      severity: MEDIUM
```

### Quality Standards

- [ ] Minimum 50 checks total
- [ ] All 9 core categories present
- [ ] Framework-specific sections for top 2-3 frameworks
- [ ] All checks have severity ratings
- [ ] Pattern cross-references included where applicable
- [ ] OWASP ASVS Level 2 aligned

---

## File 4: examples.md

**Purpose:** Real-world vulnerability examples with before/after code

### Structure

```markdown
# {Language} Security Code Review Examples

**Based on:** OWASP ASVS Level 2, CWE Top 25

---

## {VULNERABILITY_CLASS_1}

**CWE:** CWE-{NUMBER} ({NAME})
**OWASP ASVS:** V{X}.{Y}.{Z}
**Severity:** {CRITICAL|HIGH|MEDIUM|LOW}

### Vulnerable Code

```{language}
// ❌ Vulnerable - {VULNERABILITY_TYPE}
{REALISTIC_INSECURE_EXAMPLE}
```

**Why This Is Dangerous:**
{EXPLANATION_OF_ATTACK_VECTOR}

### Secure Code

```{language}
// ✅ Secure - {MITIGATION_TECHNIQUE}
{SECURE_EXAMPLE_WITH_BEST_PRACTICES}
```

**Why This Is Secure:**
{EXPLANATION_OF_MITIGATION}

### Framework-Specific Example ({FRAMEWORK})

```{language}
// {Framework}-specific secure pattern
{FRAMEWORK_SPECIFIC_IMPLEMENTATION}
```

---

## {VULNERABILITY_CLASS_2}

{REPEAT STRUCTURE}
```

### Required Vulnerability Classes (Minimum 10)

**Priority 1 (Critical):**
1. **Injection** (SQL/NoSQL/Command)
2. **Authentication Bypass**
3. **Hardcoded Credentials**
4. **Weak Cryptography**

**Priority 2 (High):**
5. **Path Traversal**
6. **Missing Authorization**
7. **Insecure Deserialization**
8. **SSRF**

**Priority 3 (Language-Specific):**
9-10. Language-specific vulnerabilities
   - Rust: Unsafe blocks, FFI
   - PHP: Type juggling, eval()
   - Go: Goroutine races, defer panics
   - Ruby: Mass assignment, YAML deserialization

### Example Template (Rust - Unsafe Block)

```markdown
## Unsafe Memory Access

**CWE:** CWE-119 (Improper Restriction of Operations within Memory Buffer Bounds)
**OWASP ASVS:** V5.3.1
**Severity:** CRITICAL

### Vulnerable Code

```rust
// ❌ Vulnerable - Unsafe memory access without bounds checking
fn process_buffer(data: &[u8], index: usize) -> u8 {
    unsafe {
        *data.as_ptr().add(index)  // No bounds checking
    }
}

// Attack: Call with index beyond buffer size causes undefined behavior
let result = process_buffer(&vec![1, 2, 3], 10);  // Out of bounds!
```

**Why This Is Dangerous:**
- No bounds checking in unsafe block
- Out-of-bounds access causes undefined behavior
- Can lead to memory corruption, crashes, or arbitrary code execution
- Violates Rust's memory safety guarantees

### Secure Code

```rust
// ✅ Secure - Safe indexing with bounds checking
fn process_buffer(data: &[u8], index: usize) -> Option<u8> {
    data.get(index).copied()  // Safe bounds-checked access
}

// Returns None if index out of bounds
match process_buffer(&vec![1, 2, 3], 10) {
    Some(value) => println!("Value: {}", value),
    None => println!("Index out of bounds"),
}
```

**Why This Is Secure:**
- Uses safe Rust bounds-checked indexing
- Returns `Option` to handle out-of-bounds gracefully
- No unsafe code needed for this operation
- Compiler enforces memory safety

### Best Practice

```rust
// If unsafe is absolutely necessary, document safety invariants
/// Safety: Caller must ensure `index < data.len()`
unsafe fn process_buffer_unchecked(data: &[u8], index: usize) -> u8 {
    debug_assert!(index < data.len(), "Index out of bounds");
    *data.as_ptr().add(index)
}

// Only use in performance-critical code after profiling
// Always validate preconditions
let index = user_input.min(data.len() - 1);
let result = unsafe { process_buffer_unchecked(&data, index) };
```
```

### Quality Standards

- [ ] Minimum 10 vulnerability classes documented
- [ ] All code examples syntactically correct and compilable
- [ ] Clear before/after contrast for each vulnerability
- [ ] Attack vectors explained clearly
- [ ] Mitigations explained clearly
- [ ] Framework-specific examples for popular frameworks
- [ ] Examples follow language idioms and conventions
- [ ] Realistic scenarios (not toy examples)

---

## Quality Assurance Checklist

**Before marking language guide as "complete":**

### manifest.yaml
- [ ] Language name and aliases correct
- [ ] All file extensions listed
- [ ] Top 3-5 frameworks identified
- [ ] Current and minimum secure versions accurate
- [ ] Detection patterns comprehensive
- [ ] Official resources linked
- [ ] CWE applicability mapped
- [ ] Pattern count matches patterns.yaml
- [ ] Status set to "complete"

### patterns.yaml
- [ ] Minimum 12 patterns created
- [ ] All CWE numbers valid
- [ ] All patterns have ID, severity, description
- [ ] All patterns have vulnerable + secure examples
- [ ] Code examples syntactically correct
- [ ] OWASP ASVS references included (80%+)
- [ ] Framework-specific patterns included
- [ ] Metadata section complete

### checklist.yaml
- [ ] Minimum 50 checks created
- [ ] All 9 core categories present
- [ ] Framework-specific sections included
- [ ] All checks have severity ratings
- [ ] Pattern cross-references valid
- [ ] OWASP ASVS Level 2 aligned
- [ ] Metadata section complete

### examples.md
- [ ] Minimum 10 vulnerability classes
- [ ] All code examples valid syntax
- [ ] Attack vectors explained
- [ ] Mitigations explained
- [ ] Framework examples included
- [ ] Examples follow language conventions
- [ ] Realistic scenarios used

### Cross-File Validation
- [ ] Pattern IDs consistent across files
- [ ] CWE numbers consistent
- [ ] No broken cross-references
- [ ] Framework names consistent

---

## Usage Notes

**Once Generated:**
- Guide is saved permanently in `docs/languages/{language}/`
- Reusable for all future code reviews of that language
- Can be enhanced over time with new patterns
- Shareable across the framework and with other users

**Maintenance:**
- Update when new vulnerability classes emerge
- Enhance with additional framework support
- Update version recommendations
- Add new patterns from real-world findings

---

**Template Version:** 1.0
**Last Updated:** 2026-01-18
**Compatible With:** Advisory Skill v2.0+
