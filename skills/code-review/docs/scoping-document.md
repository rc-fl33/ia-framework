# Scoping Document - Security Code Review

> **Note:** For a simpler, reusable template, see `templates/scoping-document.md`

**Engagement ID:** `CR-YYYY-XXX`
**Date:** YYYY-MM-DD
**Status:** Draft / Pending Approval

---

## 1. Engagement Metadata

| Field | Value |
|-------|-------|
| **Client** | [Organization name] |
| **Repository/Project** | [Project name] |
| **Review Type** | [Full / Incremental / Focused / Delta] |
| **Start Date** | YYYY-MM-DD |
| **End Date** | YYYY-MM-DD |
| **Lead Reviewer** | [Name] |
| **Client Contact** | [Name, email, phone] |

---

## 2. Authorization Context

### Authorization Basis
- [ ] Signed Statement of Work (SOW)
- [ ] Bug Bounty Program
- [ ] Internal Security Review
- [ ] Pre-Release Security Audit
- [ ] Other: [Specify]

**SOW Reference:** [Document number/version]

### Review Scope Justification
**Business Context:** [Regulatory requirement, pre-release audit, incident response, or stated objective of this assessment]

---

## 3. Code Repositories In Scope

### Primary Repository

| Field | Value |
|-------|-------|
| **Repository URL** | `https://github.com/org/repo` |
| **Branch** | [main/develop/release branch] |
| **Commit/Tag** | [SHA or tag] |
| **Language** | [JavaScript/Go/Python/Java/etc.] |

### Additional Repositories

| Repository | Branch | Purpose |
|------------|--------|---------|
| [Repo 1] | [Branch] | [Backend API] |
| [Repo 2] | [Branch] | [Frontend] |
| [Repo 3] | [Branch] | [Libraries] |

---

## 4. Branch/Tag Scope

### Branches In Scope
- [ ] `main` / `master`
- [ ] `develop` / `develop`
- [ ] Release branches: `release/X.Y.Z`
- [ ] Feature branches: `feature/*`

### Tags In Scope
- [ ] Production tags: `v*`
- [ ] All tags

### Specific Commits
- [ ] Review from commit: [SHA]
- [ ] Review to commit: [SHA]

---

## 5. Dependencies In Scope

### Internal Dependencies
| Package | Version | Source |
|---------|---------|--------|
| [lib-a] | 1.2.0 | Internal npm registry |
| [lib-b] | 2.0.0 | Monorepo |

### Third-Party Dependencies
| Package | Version | Vulnerability Status |
|---------|---------|---------------------|
| [package-a] | 3.1.0 | Check for known CVEs |
| [package-b] | 1.0.0 | Check for known CVEs |

---

## 6. Excluded Code/Areas

The following are explicitly excluded from this review:

| Path/Pattern | Reason |
|--------------|--------|
| `vendor/*` | Third-party code |
| `node_modules/*` | Dependencies |
| `test/*` | Test code |
| `legacy/*` | Legacy code out of scope |
| `docs/*` | Documentation |
| [Specific file/folder] | [Reason] |

---

## 7. Review Focus Areas

### Primary Focus (High Priority)
- [ ] Authentication & Authorization
- [ ] Input Validation & Sanitization
- [ ] Data Protection (encryption, PII handling)
- [ ] Session Management
- [ ] API Security
- [ ] Cryptographic Implementations

### Secondary Focus (Medium Priority)
- [ ] Error Handling & Logging
- [ ] File Operations
- [ ] Database Queries
- [ ] Memory Management
- [ ] Concurrency/Race Conditions

### Excluded from Review
- [ ] Code style/formatting
- [ ] Performance optimization
- [ ] Unit test coverage
- [ ] Documentation

---

## 8. Review Type

### Full Review
Complete review of all in-scope code. Time-intensive, comprehensive.

### Incremental Review
Review of changes since last review. Requires baseline commit.

### Focused Review
Specific security domains or vulnerability classes. Use for rapid assessments.

### Delta Review
Review of specific changes (PR/commits). Fastest turnaround.

---

## 9. Access Requirements

### Required Access
- [ ] Read access to repository
- [ ] Access to dependency repositories
- [ ] Access to architecture documentation
- [ ] Access to threat model (if exists)

### Optional Access (Nice to Have)
- [ ] Access to running application
- [ ] Access to test environment
- [ ] Access to CI/CD pipelines

### Client Support Required
- [ ] Environment setup assistance
- [ ] Architecture walkthrough
- [ ] Key developer interview
- [ ] Access to security findings from other assessments

---

## 10. Security Standards to Apply

### Standards/Frameworks
- [ ] OWASP Top 10 (Web)
- [ ] OWASP Top 10 (API)
- [ ] CWE Top 25
- [ ] CERT Secure Coding Standards
- [ ] Language-specific best practices

### Compliance Requirements
- [ ] PCI DSS
- [ ] SOC 2
- [ ] HIPAA
- [ ] GDPR
- [ ] [Other]

---

## 11. Deliverables

| Deliverable | Format | Description |
|-------------|--------|-------------|
| Finding Report | Markdown | Detailed findings with code snippets |
| Executive Summary | Markdown | High-level findings for management |
| Finding Template | [Code format] | Individual finding details |

---

## 12. Emergency Contacts

| Role | Name | Email | Phone | Response Time |
|------|------|-------|-------|---------------|
| Primary | [Name] | [Email] | [Phone] | < 1 hour |
| Technical | [Name] | [Email] | [Phone] | < 4 hours |

---

## 13. Approval

### Client Approval

| | |
|---|---|
| **Client Representative** | _________________________________ |
| **Name** | [Print name] |
| **Title** | [Title] |
| **Date** | [Date] |

---

## 14. Test Plan Reference

Once approved, this scoping document drives test plan generation:
- **Test Plan File:** `test-plan.md`
- **Code Analysis Approach:** [From Section 7]
- **Review Type:** [From Section 8]

---

*Document Version: 1.0*
*Template: skills/code-review/docs/scoping-document.md*
