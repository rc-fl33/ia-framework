# IA Template Standards

Standards for creating and maintaining scoping documents, test plans, and other engagement templates in the Intelligence Adjacent Framework.

---

## 1. Required Metadata Section

Every template must include a standardized header section:

```markdown
# [Document Title]

**Engagement ID:** `ENG-YYYY-XXX`
**Date:** YYYY-MM-DD
**Status:** Draft / Pending Approval
```

**Required fields:**
- Engagement ID: Format `TYPE-YYYY-NNN` (ENG, CR, SAR, etc.)
- Date: ISO format YYYY-MM-DD
- Status: Draft → Pending Approval → Approved

---

## 2. Dynamic Section Syntax

Templates should support modular, expandable sections based on engagement scope.

### Domain Checkbox Syntax

Use checkboxes to indicate selectable domains:

```markdown
### In-Scope Domains

- [ ] **Web Application Testing** → Load: `methodologies/web-api/framework.md`
- [ ] **API Testing** → Load: `methodologies/web-api/framework.md`
- [ ] **Mobile App Testing** → Load: `methodologies/mobile/framework.md`
- [ ] **Network/Infrastructure** → Load: `methodologies/network/framework.md`
```

### Expandable Section Headers

Mark dynamic sections with clear headers:

```markdown
### [DOMAIN: Web Application Testing]
**Source:** `methodologies/web-api/framework.md`

[Content expands based on scope - include only if domain is checked]
```

---

## 3. Executable Command Format

Test plans must use copy-paste command blocks, not abstract descriptions.

### Code Block Requirements

1. **Always use language identifiers:**
   ```bash
   # Shell commands
   ```

2. **One command per line for simple commands:**
   ```bash
   curl -s https://example.com/
   nmap -sS -p- target.com
   ```

3. **Use loops for repeated commands:**
   ```bash
   for i in {1..100}; do
     curl -s -o /dev/null -w "%{http_code}\n" https://example.com/api/login
   done
   ```

4. **Chain related commands:**
   ```bash
   # Enumerate and test
   nmap -sn 192.168.1.0/24 -oA discovery
   nmap -sV -p 22,80,443 192.168.1.0/24
   ```

### Command Placeholders

Use descriptive placeholders in brackets:

```bash
# Good:
curl -s -H "Authorization: Bearer $TOKEN" https://api.example.com/users

# Avoid:
curl -s -H "Authorization: Bearer TOKEN" https://example.com
```

---

## 4. Source Mapping

Every test case must reference its methodology source.

### Required Mapping Format

```markdown
#### Test Case: A01 - Broken Access Control
- **Framework Mapping:** OWASP A01:2021
- **Source:** `methodologies/web-api/framework.md`
- **CWE Reference:** CWE-284
```

### Source File Locations

| Domain | Framework File |
|--------|---------------|
| Web/API | `methodologies/web-api/framework.md` |
| Mobile | `methodologies/mobile/framework.md` |
| Network | `methodologies/network/framework.md` |
| Cloud (AWS) | `methodologies/cloud/aws-framework.md` |
| Cloud (Azure) | `methodologies/cloud/azure-framework.md` |
| Cloud (GCP) | `methodologies/cloud/gcp-framework.md` |
| Web3 | `methodologies/web3/framework.md` |
| AI/LLM | `methodologies/ai-llm/framework.md` |
| Active Directory | `methodologies/active-directory/framework.md` |
| Thick Client | `methodologies/thick-client/framework.md` |

---

## 5. Tone Guidelines

### Do

- Use specific facts and findings
- Reference actual assets by URL/IP/identifier
- Include real CVEs, CWEs, OWASP references
- Provide actionable remediation steps
- Quantify impact where possible

### Don't

- Use marketing language ("world-class", "industry-leading")
- Assume vulnerabilities exist without evidence
- Use generic language ("could lead to", "may expose")
- Include fluff or filler content
- Speculate about impact without basis

### Example Transformations

| Instead of... | Use... |
|--------------|--------|
| "This could potentially lead to a data breach" | "Attacker can retrieve all user records via SQL injection" |
| "The application uses potentially weak cryptography" | "Passwords hashed with MD5 (CWE-327)" |
| "Improper input validation could allow injection" | "SQLi in login parameter (CWE-89)" |

---

## 6. Table Formatting

### Standard Tables

Use markdown tables for structured data:

```markdown
| Asset ID | URL | Description | Auth Required |
|----------|-----|-------------|---------------|
| WEB-001 | `https://example.com` | Main application | Yes |
| WEB-002 | `https://api.example.com` | REST API | Yes (JWT) |
```

### Time Estimates

Include time estimates for each test case:

```markdown
- **Time Estimate:** 4 hours
```

---

## 7. Approval Sections

All test plans must include approval sections:

```markdown
## Approval

### Test Plan Approval

| | |
|---|---|
| **Test Plan Status** | [ ] Approved for Execution |
| **Lead Tester** | _________________________________ |
| **Client Representative** | _________________________________ |
| **Date** | [Date] |
```

---

## 8. Template File Naming

| Template Type | Naming Convention |
|---------------|-------------------|
| Scoping Document | `scoping-document.md` |
| Test Plan | `test-plan.md` |
| Finding Template | `finding-template.md` |
| Execution Plan | `execution-plan.md` |

---

## 9. Quarto Style Integration

For templates that will be rendered to HTML/PDF via Quarto:

### YAML Frontmatter

```yaml
---
title: "Security Assessment Report"
format:
  html:
    theme:
      - cosmo
      - ../../../private/brand/assets/theme-light.scss
    css: ../../../private/brand/assets/styles.css
---
```

### CSS Classes

Use IA style guide classes for severity and status:
- `.badge-critical`, `.badge-high`, `.badge-medium`, `.badge-low`, `.badge-info`
- `.finding-critical`, `.finding-high`, `.finding-medium`, `.finding-low`
- `.priority-immediate`, `.priority-short-term`, etc.

See `docs/standards/quarto-style-guide.md` for complete reference.

---

## 10. Template Locations

Place templates in skill-specific directories:

```
skills/
├── pentest/
│   └── templates/
│       ├── scoping-document.md
│       └── test-plan.md
├── code-review/
│   └── templates/
│       ├── scoping-document.md
│       └── test-plan.md
└── sec-review/
    └── templates/
        ├── scoping-document.md
        └── test-plan.md
```

---

## 11. Deprecation Notice

When templates are replaced or renamed, add deprecation notice:

```markdown
> **DEPRECATED:** This template has been replaced by `scoping-document.md`.
> Last updated: YYYY-MM-DD
> Use: `skills/pentest/docs/scoping-document.md`
```

---

*Version: 1.0*
*Last Updated: 2026-03-01*
*Reference: `docs/standards/template-standards.md`*
