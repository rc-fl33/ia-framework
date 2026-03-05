# Scoping Document

**Engagement ID:** `[TYPE]-YYYY-XXX`
**Engagement Type:** [Penetration Test | Security Code Review | Security Architecture Review | Vulnerability Assessment]
**Date:** YYYY-MM-DD
**Status:** Draft / Pending Approval

---

## 1. Client & Authorization

| Field | Value |
|-------|-------|
| **Client** | [Organization name] |
| **Contact** | [Name, email, phone] |
| **Authorization Basis** | [Signed SOW / Bug Bounty / VDP / Internal] |
| **SOW Reference** | [Document number/version] |

---

## 2. Scope Definition

### In-Scope Assets

| Asset ID | Type | Identifier | Description |
|----------|------|------------|-------------|
| [001] | [Web/API/Mobile/Network/Cloud/Code] | [URL/IP/Repo] | [Description] |
| [002] | | | |

### Out-of-Scope

| Asset/Activity | Reason |
|----------------|--------|
| [Item] | [Reason] |

### Constraints

- **Testing Window:** [Dates/times]
- **Rate Limits:** [Max requests]
- **Restrictions:** [DoS, social engineering, etc.]

---

## 3. Technical Details

**Engagement-Specific Fields (Fill based on type):**

### For Penetration Tests
- **Testing Domains:** [Web, API, Mobile, Network, Cloud]
- **Methodology:** [OWASP Top 10, MITRE ATT&CK, etc.]

### For Code Reviews
- **Repository:** [URL]
- **Branch/Commit:** [SHA]
- **Languages:** [List]
- **Review Type:** [Full / Incremental / Focused / Delta]

### For Architecture Reviews
- **System:** [Name]
- **Architecture Domains:** [Authentication, Data Protection, Patch Management, Supply Chain]
- **Methodology:** [STRIDE, PASTA, etc.]

---

## 4. Access & Credentials

### Provided Access
- [ ] VPN/Network access
- [ ] Source code access
- [ ] Cloud console access
- [ ] Test accounts: [List]

### Credentials (reference `creds.txt` if applicable)
| Asset | Username | Access Level |
|-------|----------|--------------|
| | | |

---

## 5. Standards & Frameworks

- [ ] OWASP Top 10
- [ ] CWE Top 25
- [ ] MITRE ATT&CK
- [ ] [Other: specify]

---

## 6. Deliverables

| Deliverable | Format | Description |
|-------------|--------|-------------|
| Final Report | Markdown/HTML | Executive summary + technical findings |
| Findings | Markdown | Individual finding documentation |

---

## 7. Emergency Contacts

| Role | Name | Email | Phone | Response |
|------|------|-------|-------|----------|
| Primary | | | | < 1 hour |
| Technical | | | | < 4 hours |

---

## 8. Approval

| | |
|---|---|
| **Client Representative** | _________________________________ |
| **Date** | [Date] |

---

*Template: templates/scoping-document.md*
