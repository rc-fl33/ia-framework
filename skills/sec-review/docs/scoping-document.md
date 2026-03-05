# Scoping Document - Security Architecture Review

> **Note:** For a simpler, reusable template, see `templates/scoping-document.md`

**Engagement ID:** `SAR-YYYY-XXX`
**Date:** YYYY-MM-DD
**Status:** Draft / Pending Approval

---

## 1. Engagement Metadata

| Field | Value |
|-------|-------|
| **Client** | [Organization name] |
| **System/Application** | [System name] |
| **Review Type** | [Initial / Follow-up / Periodic] |
| **Start Date** | YYYY-MM-DD |
| **End Date** | YYYY-MM-DD |
| **Lead Reviewer** | [Name] |
| **Client Contact** | [Name, email, phone] |

---

## 2. Authorization Context

### Authorization Basis
- [ ] Signed Statement of Work (SOW)
- [ ] Internal Security Initiative
- [ ] Compliance Requirement
- [ ] Other: [Specify]

**SOW Reference:** [Document number/version]

---

## 3. Architecture Domains In Scope

### Domain A: Architecture & Environment (ALWAYS INCLUDED)
This domain is mandatory for all security architecture reviews.

- [ ] Overall architecture design
- [ ] Technology stack review
- [ ] Environment configuration (dev/staging/prod)
- [ ] Network architecture
- [ ] Data flow diagrams
- [ ] Integration points

### Domain B: Security Practices
Select based on system characteristics.

- [ ] Authentication mechanisms
- [ ] Authorization models
- [ ] Session management
- [ ] Cryptographic implementations
- [ ] Key management
- [ ] Data classification

### Domain C: Patch Management
Select based on infrastructure.

- [ ] Operating system patching
- [ ] Application patching
- [ ] Dependency vulnerability management
- [ ] Firmware updates
- [ ] Patch testing procedures

### Domain D: Supply Chain
Select based on development practices.

- [ ] Dependency management
- [ ] Third-party component security
- [ ] CI/CD pipeline security
- [ ] Artifact integrity
- [ ] Code signing practices
- [ ] Container security

---

## 4. Documentation In Scope

### Required Documentation
- [ ] Architecture diagrams (network, data flow)
- [ ] API specifications
- [ ] Data dictionary
- [ ] Threat model (if exists)
- [ ] Security requirements

### Optional Documentation
- [ ] Design documents
- [ ] Configuration standards
- [ ] Incident response plan
- [ ] Business continuity plan

---

## 5. Systems/Components In Scope

### Primary System
| Component | Type | Description |
|-----------|------|-------------|
| [Component 1] | [Web App/API/Database] | [Description] |
| [Component 2] | [Service/Function] | [Description] |

### Integration Points
| Integration | Protocol | Purpose |
|-------------|----------|---------|
| [Service A] | REST API | [Purpose] |
| [Database] | PostgreSQL | [Purpose] |

### Infrastructure
| Environment | Provider | Resources |
|-------------|----------|-----------|
| Production | AWS/Azure/GCP | [Resources] |
| Staging | [Provider] | [Resources] |
| Development | [Provider] | [Resources] |

---

## 6. Access Constraints

### Physical Access
- [ ] On-site review required
- [ ] Remote review only
- [ ] No physical access needed

### System Access
- [ ] Read-only access to systems
- [ ] Documentation review only
- [ ] Interview-based review

### Personnel Access
- [ ] Developers
- [ ] Security team
- [ ] Operations/DevOps
- [ ] Architecture team

---

## 7. Review Methodology

### Primary Methodology
- [ ] STRIDE
- [ ] PASTA
- [ ] VAST
- [ ] Custom

### Standards to Apply
- [ ] OWASP SAMM
- [ ] NIST CSF
- [ ] CIS Controls
- [ ] ISO 27001
- [ ] [Other]

---

## 8. Deliverables

| Deliverable | Format | Description |
|-------------|--------|-------------|
| Architecture Review Report | Markdown | Detailed findings with recommendations |
| Executive Summary | Markdown | High-level findings for management |
| Threat Model | [Format] | Identified threats and mitigations |
| Risk Register | Markdown | Prioritized risks with severity |

---

## 9. Review Constraints

### Excluded Areas
| Area | Reason |
|------|--------|
| [Area 1] | [Reason] |
| [Area 2] | [Reason] |

### Known Limitations
- [Limitation 1]
- [Limitation 2]

---

## 10. Emergency Contacts

| Role | Name | Email | Phone | Response Time |
|------|------|-------|-------|---------------|
| Primary | [Name] | [Email] | [Phone] | < 1 hour |
| Technical | [Name] | [Email] | [Phone] | < 4 hours |

---

## 11. Approval

### Client Approval

| | |
|---|---|
| **Client Representative** | _________________________________ |
| **Name** | [Print name] |
| **Title** | [Title] |
| **Date** | [Date] |

---

## 12. Test Plan Reference

Once approved, this scoping document drives test plan generation:
- **Test Plan File:** `test-plan.md`
- **Domains Selected:** [List from Section 3]
- **Methodology:** [From Section 7]

---

*Document Version: 1.0*
*Template: skills/sec-review/docs/scoping-document.md*
