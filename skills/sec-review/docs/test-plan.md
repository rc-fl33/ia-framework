# Test Plan - Security Architecture Review

> **Note:** For a simpler, reusable template, see `templates/test-plan.md`

**Engagement ID:** `SAR-YYYY-XXX`
**References:** `scoping-document.md`
**Status:** Draft / Pending Approval
**Last Updated:** YYYY-MM-DD

---

## 1. Plan Metadata

### Scope Summary
- **System:** [System name]
- **Domains Selected:** [List from scoping document Section 3]
- **Review Type:** [Initial / Follow-up / Periodic]
- **Methodology:** [STRIDE / PASTA / Custom]

### Domain-to-Procedure Mapping
| Domain | Procedure Section | Priority |
|--------|------------------|----------|
| Architecture & Environment | Section 3.1 | Always |
| Security Practices | Section 3.2 | If selected |
| Patch Management | Section 3.3 | If selected |
| Supply Chain | Section 3.4 | If selected |

---

## 2. Domain-Specific Procedures

### 2.1 Architecture & Environment Review

**Source:** STRIDE/PASTA methodology, NIST CSF
**Priority:** MANDATORY (always included)

#### Review Item: Architecture Design Review
- **Objective:** Evaluate overall system architecture for security flaws
- **Framework Mapping:** NIST CSF PR.AC, PR.DS, PR.PT
- **Documents to Review:**
  - [ ] Network architecture diagrams
  - [ ] Data flow diagrams
  - [ ] API specifications
  - [ ] Integration documentation
- **Review Approach:**
  ```
  1. Obtain architecture documentation
  2. Create/update data flow diagram
  3. Identify trust boundaries
  4. Map data classification
  5. Identify attack surfaces
  ```
- **Findings Template:**
  | Finding | Severity | Description | Impact |
  |---------|----------|-------------|--------|
  | [Issue] | [High/Medium/Low] | [Description] | [Impact] |

#### Review Item: Technology Stack Assessment
- **Objective:** Verify secure technology choices
- **Framework Mapping:** NIST CSF PR.AC, PR.IP
- **Review Commands/Questions:**
  ```markdown
  - What web framework is used? Is it current?
  - What database is used? Encryption at rest?
  - What authentication library? MFA support?
  - What caching layer? Sensitive data in cache?
  - TLS version for all connections?
  ```
- **Expected Result:** Modern, supported technologies with security features enabled

#### Review Item: Network Segmentation
- **Objective:** Verify proper network isolation
- **Framework Mapping:** NIST CSF PR.AC-5
- **Review Checklist:**
  - [ ] DMZ isolation from internal networks
  - [ ] Database not internet-facing
  - [ ] Admin interfaces on separate network/VPN
  - [ ] Cloud networkACLs/firewall rules reviewed

---

### 2.2 Security Practices Review

**Source:** OWASP SAMM, CIS Controls
**Priority:** SELECTED (only if checked in scoping)

#### Review Item: Authentication Mechanisms
- **Objective:** Evaluate authentication security
- **Framework Mapping:** OWASP A07:2021, CWE-287
- **Review Questions:**
  ```markdown
  - Password policy enforcement?
  - MFA available? Mandatory for whom?
  - Session timeout values?
  - Account lockout policy?
  - Password reset flow secure?
  - OAuth/OIDC implementation secure?
  ```
- **Evidence Required:**
  - [ ] Authentication architecture diagram
  - [ ] MFA enrollment flow
  - [ ] Session management code review

#### Review Item: Authorization Models
- **Objective:** Verify proper access control
- **Framework Mapping:** OWASP A01:2021, CWE-284
- **Review Questions:**
  ```markdown
  - RBAC/ABAC/ACL implementation?
  - Default deny policy?
  - Privilege escalation prevention?
  - Horizontal privilege separation?
  - API authorization checks?
  ```
- **Evidence Required:**
  - [ ] Authorization matrix
  - [ ] Role definitions
  - [ ] Access control code

#### Review Item: Cryptographic Implementation
- **Objective:** Verify secure cryptography
- **Framework Mapping:** CWE-327, CWE-331
- **Review Checklist:**
  - [ ] TLS 1.2+ for all connections
  - [ ] Strong cipher suites
  - [ ] Proper key management
  - [ ] Encryption at rest for sensitive data
  - [ ] Hashing with salt (bcrypt/Argon2)
  - [ ] No custom cryptography

---

### 2.3 Patch Management Review

**Source:** CIS Controls, NIST CSF PR.IP
**Priority:** SELECTED (only if checked in scoping)

#### Review Item: OS Patching
- **Objective:** Verify timely OS security updates
- **Framework Mapping:** CIS Control 7
- **Review Questions:**
  ```markdown
  - Patch deployment frequency?
  - Critical patch SLA?
  - Automated patching enabled?
  - Patch testing process?
  - Outdated systems inventory?
  ```
- **Evidence Required:**
  - [ ] Patch management policy
  - [ ] System inventory with versions
  - [ ] Recent patch deployment logs

#### Review Item: Application Patching
- **Objective:** Verify dependency vulnerability management
- **Framework Mapping:** OWASP A06:2021
- **Review Questions:**
  ```markdown
  - Dependency scanning enabled?
  - CVE monitoring process?
  - Remediation SLA for critical vulnerabilities?
  - Known vulnerable components?
  - Third-party component updates?
  ```
- **Review Commands:**
  ```bash
  # Check for known CVEs in dependencies
  npm audit
  pip-audit
  owasp-dependency-check

  # Check component versions
  npm list --depth=0
  pip freeze
  ```

---

### 2.4 Supply Chain Review

**Source:** OWASP SAMM, SLSA, NIST SSDF
**Priority:** SELECTED (only if checked in scoping)

#### Review Item: Dependency Management
- **Objective:** Verify secure dependency management
- **Framework Mapping:** OWASP A06:2021, CWE-1104
- **Review Checklist:**
  - [ ] Dependency lock files
  - [ ] Private dependency scanning
  - [ ] Supply chain security tools (Sigstore, SLSA)
  - [ ] Dependency review process

#### Review Item: CI/CD Pipeline Security
- **Objective:** Verify secure build and deployment
- **Framework Mapping:** CWE-94, CWE-250
- **Review Questions:**
  ```markdown
  - Build isolation?
  - Secrets management in CI/CD?
  - Pipeline integrity verification?
  - Artifact signing?
  - Deployment approval process?
  ```
- **Review Commands:**
  ```bash
  # Check for exposed secrets in CI/CD configs
  grep -r "password\|secret\|key\|token" .github/workflows/ .gitlab-ci.yml

  # Check for insecure configurations
  cat .github/workflows/*.yml | jq '.'
  ```

#### Review Item: Container Security
- **Objective:** Verify container image security
- **Framework Mapping:** CIS Docker/Container Benchmark
- **Review Checklist:**
  - [ ] Base image minimal/updated
  - [ ] No secrets in images
  - [ ] Root user not used
  - [ ] Image scanning enabled
  - [ ] Signed images

---

## 3. Evidence Collection Checklist

### Required Artifacts

| Artifact | Source | Format |
|----------|--------|--------|
| Architecture diagrams | Client | Draw.io/PDF |
| Data flow diagrams | Client | Draw.io/PDF |
| API specifications | Client | OpenAPI/Swagger |
| Network diagrams | Client | Draw.io/PDF |
| Configuration samples | Interview + Review | JSON/YAML |
| Security policies | Client | Markdown/PDF |

### Interview Checklist

| Role | Topics |
|------|--------|
| Architect | Design decisions, threat model, data flow |
| Developer | Authentication, authorization, input handling |
| DevOps | Deployment, patching, infrastructure |
| Security | Existing findings, compliance, monitoring |

---

## 4. Risk Scoring Methodology

### Likelihood Scale
| Rating | Description |
|--------|-------------|
| 5 | Exploitable immediately, no skill required |
| 4 | Exploitable with some effort/skills |
| 3 | Exploitable under specific conditions |
| 2 | Theoretical, difficult to exploit |
| 1 | Very unlikely to be exploited |

### Impact Scale
| Rating | Description |
|--------|-------------|
| 5 | Catastrophic - full system compromise, data breach |
| 4 | Severe - significant data loss or system damage |
| 3 | Moderate - noticeable impact, manageable |
| 2 | Minor - limited impact |
| 1 | Negligible - no real impact |

### Risk Matrix
| | Impact 1 | Impact 2 | Impact 3 | Impact 4 | Impact 5 |
|----------|----------|----------|----------|----------|----------|
| **Likelihood 5** | Low | Medium | High | Critical | Critical |
| **Likelihood 4** | Low | Medium | High | High | Critical |
| **Likelihood 3** | Low | Low | Medium | High | High |
| **Likelihood 2** | Low | Low | Medium | Medium | High |
| **Likelihood 1** | Low | Low | Low | Low | Medium |

---

## 5. Approval

### Test Plan Approval

| | |
|---|---|
| **Test Plan Status** | [ ] Approved for Execution |
| **Lead Reviewer** | _________________________________ |
| **Client Representative** | _________________________________ |
| **Date** | [Date] |

---

*Template: skills/sec-review/docs/test-plan.md*
*This document is dynamically assembled based on scoping document domain selection*
