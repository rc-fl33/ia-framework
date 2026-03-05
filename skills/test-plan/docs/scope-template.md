# Scope Template

> **Note:** This template is used to document the scope during Phase 1 (Intake).
> It can be filled out manually or generated from existing scope documents.

---

## Test Plan Scope

**Date:** YYYY-MM-DD
**Project:** [Project name]
**Assessment Type:** [pentest / security review / code review / vuln-scan / red team]

---

### 1. Assessment Information

| Field | Value |
|-------|-------|
| Client | [Client name] |
| Contact | [Contact email] |
| Project Lead | [Lead name] |
| Engagement Manager | [Manager name] |

---

### 2. Domains

Select the domains to include in this assessment:

- [ ] **Web Application** - Testing of web applications and web interfaces
- [ ] **API** - Testing of REST/SOAP/GraphQL APIs
- [ ] **Mobile - Android** - Testing of Android applications
- [ ] **Mobile - iOS** - Testing of iOS applications
- [ ] **Network/Infrastructure** - Testing of network infrastructure
- [ ] **Cloud - AWS** - Testing of AWS environment
- [ ] **Cloud - Azure** - Testing of Azure environment
- [ ] **Cloud - GCP** - Testing of GCP environment
- [ ] **AI/LLM** - Testing of AI/LLM features
- [ ] **Active Directory** - Testing of AD environment
- [ ] **Web3/Smart Contracts** - Testing of blockchain/smart contracts
- [ ] **Thick Client** - Testing of desktop applications

---

### 3. Targets

#### Web Application Targets
| URL | Description |
|-----|-------------|
| https://example.com | Main application |
| https://api.example.com | API endpoint |

#### API Targets
| Endpoint | Method | Description |
|----------|--------|-------------|
| https://api.example.com/v1/users | GET, POST | User API |

#### Network Targets
| IP Range | Description |
|----------|-------------|
| 192.168.1.0/24 | Internal network |

#### Cloud Targets
| Account ID | Provider | Region |
|------------|----------|--------|
| 123456789012 | AWS | us-east-1 |

#### Mobile Applications
| Platform | Package/Bundle ID | Version |
|----------|-------------------|---------|
| Android | com.example.app | 1.0.0 |
| iOS | com.example.app | 1.0.0 |

---

### 4. Scope Boundaries

#### In Scope
- [Primary domain/application]
- [API endpoints]
- [Mobile applications]

#### Out of Scope
- [Third-party services]
- [Development environments unless specified]
- [Denial of Service testing]

---

### 5. Compliance Requirements

Select applicable frameworks:

- [ ] OWASP Top 10
- [ ] OWASP API Security Top 10
- [ ] CIS Benchmarks
- [ ] PCI-DSS
- [ ] HIPAA
- [ ] SOC 2
- [ ] NIST
- [ ] Other: _______________

---

### 6. Constraints and Limitations

| Constraint | Description |
|------------|-------------|
| Testing Window | Business hours only / 24x7 |
| Rate Limiting | [If any] |
| IP Blacklist | [If any] |
| Data Handling | [PII handling requirements] |

---

### 7. Client-Specific Concerns

[List any specific concerns or areas of focus from the client]

Example:
- Recent security incident involving XSS
- Concern about authentication flow
- Third-party integrations

---

### 8. Credentials and Access

| Target | Username | Method |
|--------|----------|--------|
| Web App | testuser@example.com | OAuth |
| API | api_test_key | Header |

---

### 9. Timeline

| Milestone | Date |
|-----------|------|
| Test Plan Due | YYYY-MM-DD |
| Execution Window Start | YYYY-MM-DD |
| Execution Window End | YYYY-MM-DD |
| Report Due | YYYY-MM-DD |

---

### 10. Contacts

| Role | Name | Email | Phone |
|------|------|-------|-------|
| Technical Contact | | | |
| Security Contact | | | |
| Emergency Contact | | | |

---

*Template: skills/test-plan/docs/scope-template.md*
