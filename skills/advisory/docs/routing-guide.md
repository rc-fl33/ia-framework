# Advisory vs Compliance vs Security - Routing Guide

**When to use which skill for security-related requests.**

---

## Decision Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SECURITY REQUEST RECEIVED                            │
└─────────────────────────────┬───────────────────────────────────────────────┘
                              │
                              ▼
          ┌───────────────────────────────────────┐
          │     What type of security work?       │
          └───────────────────┬───────────────────┘
                              │
    ┌─────────────────────────┼─────────────────────────┐
    │                         │                         │
    ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│   ADVISORY    │       │  COMPLIANCE   │       │   SECURITY    │
│   (guidance)  │       │ (frameworks)  │       │   (testing)   │
└───────┬───────┘       └───────┬───────┘       └───────┬───────┘
    │                       │                       │
    ▼                       ▼                       ▼
"Review this code"      "Are we HIPAA         "Pentest my app"
"Review architecture"    compliant?"          "Scan for vulns"
"Best practice for X?"  "NIST CSF assessment" "Test segmentation"
"Threat model this"     "PCI-DSS gap analysis"
```

---

## When to Use ADVISORY (This Skill)

**Purpose:** Strategic guidance, design review, code analysis

| Scenario | Command | Example |
|----------|---------|---------|
| Security question | `/advisory` | "What's the best practice for API authentication?" |
| Review system design | `/sec-review` | "Review this microservices architecture for threats" |
| Review code security | `/code-review` | "Scan this codebase for vulnerabilities" |
| Threat modeling | `/sec-review` | "Create STRIDE threat model for payment system" |

**Key indicators:** "review", "advice", "guidance", "best practice", "threat model", "secure design"

**What you get:**
- Strategic security guidance
- Code security analysis (OWASP, CWE)
- Best practice recommendations

**For architecture/threat modeling:** Use `/sec-review` — routed to security agent with
STRIDE/PASTA, optional security practices (Domain B), and patch management (Domain C).

---

## When to Use COMPLIANCE (Different Skill)

**Purpose:** Framework-based assessment and gap analysis

| Scenario | Command | Example |
|----------|---------|---------|
| Framework assessment | `/compliance` | "Assess us against HIPAA" |
| Risk assessment | `/risk-assess` | "Run a NIST CSF risk assessment" |
| Hardening validation | `/harden` | "Validate CIS benchmarks on this server" |
| Incident response | `/incident` | "Document this security incident" |

**Key indicators:** "compliance", "HIPAA", "PCI", "ISO", "NIST", "framework", "audit", "certification"

**What you get:**
- Gap analysis against frameworks
- Control mapping
- Compliance roadmap
- Audit preparation
- Remediation priorities

---

## When to Use SECURITY (Different Skill)

**Purpose:** Active security testing and vulnerability discovery

| Scenario | Command | Example |
|----------|---------|---------|
| Penetration testing | `/pentest` | "Pentest this web application" |
| Vulnerability scanning | `/vuln-scan` | "Scan this network for vulnerabilities" |
| Segmentation testing | `/seg-test` | "Validate firewall rules between zones" |

**Key indicators:** "pentest", "exploit", "scan", "hack", "vulnerability scan", "segmentation"

**What you get:**
- Active penetration testing
- Vulnerability scanning (Nmap, Nessus)
- Exploitation attempts
- Segmentation validation
- Attack path analysis

---

## Key Distinctions

| Aspect | Advisory | Compliance | Security |
|--------|----------|------------|----------|
| **Approach** | Consultative | Framework-driven | Technical testing |
| **Deliverable** | Guidance report | Gap analysis | Pentest report |
| **Methodology** | STRIDE, OWASP | NIST CSF, ISO | PTES, OWASP Testing |
| **Timeline** | Standard engagement | Extended assessment | Standard engagement |
| **Output Focus** | Design improvements | Control gaps | Vulnerabilities found |

---

## Common Routing Mistakes

### ❌ Wrong: Advisory for Compliance
```
User: "Are we HIPAA compliant?"
Wrong: Use advisory skill
Right: Use /compliance skill
```

### ❌ Wrong: Advisory for Testing
```
User: "Pentest my application"
Wrong: Use advisory skill
Right: Use /pentest skill
```

### ✅ Correct: Advisory for Guidance
```
User: "What's the best practice for encrypting data at rest?"
Correct: Use advisory skill (strategic guidance)
```

### ✅ Correct: Advisory for Review
```
User: "Review this authentication code for security issues"
Correct: Use advisory skill (code review mode)
```

---

## Still Unsure?

**Ask yourself:**

1. **Do they want advice/guidance?** → Advisory
2. **Do they mention a framework (HIPAA, PCI, NIST)?** → Compliance
3. **Do they want active testing/scanning?** → Security

**When in doubt:** Start with advisory and redirect if needed.

---

**Version:** 1.0
**Last Updated:** 2026-01-19
**Source:** Extracted from SKILL.md for maintainability
