# Framework References

**Security frameworks and standards for advisory guidance and control mapping.**

---

## Primary Frameworks

**When providing advisory guidance, cite relevant controls from these frameworks:**

| Framework | Use For | Version | Access |
|-----------|---------|---------|--------|
| **NIST CSF** | Overall security guidance | 2.0 | https://www.nist.gov/cyberframework |
| **OWASP Top 10** | Web application security | 2021 | https://owasp.org/www-project-top-ten/ |
| **CWE Top 25** | Code vulnerability classification | 2023 | https://cwe.mitre.org/top25/ |
| **CIS Controls** | Infrastructure hardening | v8 | https://www.cisecurity.org/controls |
| **MITRE ATT&CK** | Threat actor techniques | Current | https://attack.mitre.org/ |
| **SANS Top 25** | Programming errors | Current | https://www.sans.org/top25-software-errors/ |

---

## Standards Library Paths

For detailed control enumeration, load structured data from `standards/frameworks/` rather than using inline summaries or external URLs.

| Framework | Path | Controls | Questions | Handbook |
|-----------|------|:--------:|:---------:|:--------:|
| AIUC-1 | `standards/frameworks/aiuc-1/` | Y | Y | Y |
| NIST CSF 2.0 | `standards/frameworks/nist-csf/` | Y | Y | - |
| NIST AI RMF | `standards/frameworks/nist-ai-rmf/` | Y | Y | - |
| NIST 800-53 | `standards/frameworks/nist-800-53/` | partial | - | - |
| ISO 27001 | `standards/frameworks/iso/27001/` | Y | Y | Y |
| ISO 42001 | `standards/frameworks/iso/42001/` | Y | Y | Y |
| CIS Controls v8.1 | `standards/frameworks/cis-controls/` | partial | Y | - |
| MITRE ATLAS | `standards/frameworks/mitre-atlas/` | Y | Y | - |
| OWASP LLM Top 10 | `standards/frameworks/owasp-llm/` | Y | Y | - |
| EU AI Act | `standards/frameworks/eu-ai-act/` | Y | Y | - |
| GDPR | `standards/frameworks/gdpr/` | - | - | - |
| PCI-DSS | `standards/frameworks/pci-dss/` | partial | Y | - |
| HIPAA | `standards/frameworks/hipaa/` | Y | Y | - |
| SOC 2 | `standards/frameworks/soc2/` | Y | Y | - |
| FedRAMP | `standards/frameworks/fedramp/` | - | - | - |
| CIS Benchmarks | `standards/frameworks/cis-benchmarks/{platform}/` | - | - | - |

**Discovery pattern:** `Glob: standards/frameworks/{id}/controls.yaml`
**Crosswalks:** `standards/mappings/crosswalks/{id}.yaml`

---

## Framework Selection Guide

### For Architecture Reviews

**Primary:**
- NIST CSF 2.0 - Core functions and controls
- CIS Controls - Infrastructure security
- STRIDE - Threat modeling

**Secondary:**
- MITRE ATT&CK - Threat actor mapping
- Zero Trust Architecture (NIST SP 800-207)

### For Code Reviews

**Primary:**
- OWASP Top 10 - Web vulnerabilities
- CWE Top 25 - Weakness classification
- SANS Top 25 - Programming errors

**Secondary:**
- OWASP ASVS - Application Security Verification Standard
- OWASP Testing Guide - Testing methodology

### For General Guidance

**Primary:**
- NIST CSF 2.0 - Risk management framework
- CIS Controls - Security best practices

**Secondary:**
- ISO 27001/27002 - Information security controls
- PCI-DSS - Payment security (if applicable)
- HIPAA - Healthcare security (if applicable)

---

## Citation Format

**When providing recommendations, cite specific controls:**

### Example 1: Simple Citation

```markdown
**Recommendation:** Implement multi-factor authentication for all administrative access.

**Framework Reference:** NIST CSF 2.0 - PR.AA-01 (Identity management)
```

### Example 2: Multiple Frameworks

```markdown
**Recommendation:** Implement phishing-resistant MFA (FIDO2/WebAuthn) for remote access.

**Framework References:**
- **NIST CSF 2.0:** PR.AA-01 (Identity management, authentication)
- **PCI-DSS v4.0.1:** 8.3.1 (MFA for all administrative access)
- **CIS Controls v8:** 6.3 (Require MFA for remote access)
```

### Example 3: Code Review Finding

```markdown
## SQL Injection in User Authentication

**Severity:** Critical

**CWE:** CWE-89 (Improper Neutralization of Special Elements in SQL Command)
**OWASP:** A03:2021 - Injection
**SANS:** CWE-89 (Failure to Preserve SQL Query Structure)

**Recommendation:** Use parameterized queries or ORM with prepared statements.
```

---

## NIST CSF 2.0 Core Functions

| Function | Code | Purpose | Use In Advisory |
|----------|------|---------|-----------------|
| **GOVERN** | GV | Governance, risk management | Strategic guidance |
| **IDENTIFY** | ID | Asset management, risk assessment | Architecture review |
| **PROTECT** | PR | Access control, data security | All modes |
| **DETECT** | DE | Monitoring, detection processes | Architecture review |
| **RESPOND** | RS | Incident response | Incident guidance |
| **RECOVER** | RC | Recovery planning | Business continuity |

**Most Cited in Advisory:**
- PR.AA (Access Control)
- PR.DS (Data Security)
- PR.IP (Identity Management)
- DE.CM (Continuous Monitoring)

---

## OWASP Top 10 (2021)

| Rank | Category | Code | Common In |
|------|----------|------|-----------|
| A01 | Broken Access Control | | APIs, web apps |
| A02 | Cryptographic Failures | | Data storage, transmission |
| A03 | Injection | | SQL, command, XSS |
| A04 | Insecure Design | | Architecture flaws |
| A05 | Security Misconfiguration | | Cloud, containers |
| A06 | Vulnerable Components | | Dependencies, libraries |
| A07 | Authentication Failures | | Login, session management |
| A08 | Software & Data Integrity | | CI/CD, deserialization |
| A09 | Logging Failures | | Monitoring, detection |
| A10 | SSRF | | APIs, webhooks |

---

## CWE Top 25 (2023) - Most Common

| Rank | CWE | Name | Category |
|------|-----|------|----------|
| 1 | CWE-787 | Out-of-bounds Write | Memory |
| 2 | CWE-79 | Cross-site Scripting (XSS) | Injection |
| 3 | CWE-89 | SQL Injection | Injection |
| 4 | CWE-416 | Use After Free | Memory |
| 5 | CWE-78 | OS Command Injection | Injection |
| 6 | CWE-20 | Improper Input Validation | Input |
| 7 | CWE-125 | Out-of-bounds Read | Memory |
| 8 | CWE-22 | Path Traversal | File |
| 9 | CWE-352 | CSRF | Session |
| 10 | CWE-434 | Unrestricted Upload | File |

**Full list:** https://cwe.mitre.org/top25/

---

## CIS Controls v8 - Implementation Groups

### IG1 (Essential Cyber Hygiene)
Basic security controls for all organizations:
- Controls 1-6: Asset inventory, access control, data protection

### IG2 (Enterprise Security)
Additional controls for managing risk:
- Controls 7-12: Continuous vulnerability management, audit log management

### IG3 (Expert/Progressive Security)
Advanced controls for high-risk environments:
- Controls 13-18: Network monitoring, security awareness, penetration testing

**In advisory guidance:** Recommend appropriate IG based on organization maturity.

---

## STRIDE Threat Modeling

| Category | Threat | Security Property Violated |
|----------|--------|----------------------------|
| **S** | Spoofing | Authentication |
| **T** | Tampering | Integrity |
| **R** | Repudiation | Non-repudiation |
| **I** | Information Disclosure | Confidentiality |
| **D** | Denial of Service | Availability |
| **E** | Elevation of Privilege | Authorization |

**Reference:** `threat-modeling-guide.md` for detailed STRIDE application.

---

## Citation Best Practices

### Do's ✅

- **Cite specific controls** - "NIST CSF PR.AA-01" not just "NIST"
- **Use current versions** - OWASP Top 10 2021, not 2017
- **Provide context** - Explain why the control applies
- **Link to resources** - Include framework URLs when helpful

### Don'ts ❌

- **Don't cite irrelevant frameworks** - HIPAA for non-healthcare
- **Don't cite without understanding** - Read the control first
- **Don't over-cite** - 1-2 primary frameworks per recommendation
- **Don't use outdated versions** - Check for current framework versions

---

## Additional Resources

### NIST Special Publications

- **SP 800-53** - Security and Privacy Controls
- **SP 800-207** - Zero Trust Architecture
- **SP 800-63B** - Digital Identity Guidelines (Authentication)

### OWASP Projects

- **OWASP ASVS** - Application Security Verification Standard
- **OWASP Testing Guide** - Security testing methodology
- **OWASP Cheat Sheet Series** - Quick reference guides

### Industry Standards

- **PCI-DSS v4.0.1** - Payment Card Industry Data Security Standard
- **HIPAA Security Rule** - Healthcare data protection
- **ISO 27001/27002** - Information security management

---

**Version:** 1.0
**Last Updated:** 2026-01-19
**Source:** Extracted from SKILL.md for maintainability
