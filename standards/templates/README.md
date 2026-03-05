# Templates Directory

**Generic** assessment deliverable templates, engagement rules, and policy templates applicable to ANY compliance framework.

**Framework-specific templates** have been moved to `frameworks/{framework-id}/templates/`. See "Framework-Specific vs Generic" section below.

---

## Directory Structure

```
templates/
├── README.md                           # This file
├── framework-handbook-template.md      # Template for creating new framework handbooks
├── deliverables/                       # Generic client-facing deliverables
│   ├── cybersecurity_risk_assessment_report-template.md
│   ├── cybersecurity_strategic_action_plan_template.md
│   ├── cybersecurity_implementation_checklist_template.md
│   ├── compliance-matrix-template.md
│   └── phase-findings-template.md
│
├── engagement-rules/                   # Generic engagement rules
│   ├── risk-assessment-rules-template.md
│   ├── compliance-audit-rules-template.md
│   └── incident-response-rules-template.md
│
├── policies/                           # Generic security policies (27 core)
│   ├── access_management.md
│   ├── asset_management.md
│   └── ...                             # 25 more generic policies
│
└── _template-assessment/               # Generic assessment folder structure
```

**Note:** Framework-specific templates (AIUC-1, DSA, etc.) are now in `frameworks/{framework-id}/templates/`.

---

## Framework-Specific vs Generic

### Generic Templates (This Directory)

**Location:** `templates/`

**When to use:** Templates applicable to ANY compliance framework with minimal customization.

**Examples:**
- Generic compliance matrix (works for any framework)
- Generic risk assessment report structure
- Generic 27 core security policies (access management, incident response, etc.)
- Generic assessment folder structure

**Characteristics:**
- No framework-specific terminology
- Adaptable placeholders
- Universal compliance concepts
- Baseline security controls

### Framework-Specific Templates

**Location:** `frameworks/{framework-id}/templates/`

**When to use:** Templates that differ significantly from generic versions due to framework requirements.

**Examples:**
- AIUC-1 stakeholder interview guide (AI-specific role matrix)
- AIUC-1 assessment folder (6 AI principles structure)
- AIUC-1 AI policy templates (data privacy, safety, reliability, etc.)
- DSA policy templates (EU-specific platform regulations)

**Characteristics:**
- Framework-specific terminology and control IDs
- Specialized structure for framework requirements
- Domain-specific guidance (e.g., AI, platform safety)
- Certification-aligned formats

### Decision Criteria

**Use generic template when:**
- Structure is universal (compliance matrix, findings report)
- Framework is just context, not structure driver
- Template can accommodate any framework via placeholders

**Create framework-specific template when:**
- Framework requires unique structure or sections
- Generic template would need 50%+ customization
- Framework has specialized terminology not in generic policies
- Certification body expects specific format

### Examples

**Generic:** Compliance matrix template
- Works for HIPAA, SOC 2, ISO 27001, AIUC-1, etc.
- Framework name is just a variable
- Control structure adapts via placeholders

**Framework-Specific:** AIUC-1 stakeholder interview guide
- Role matrix specific to AI governance (Data Protection Officer, AI Safety Lead, etc.)
- Questions organized by 6 AI principles (not generic security domains)
- AI-specific evidence collection (model cards, hallucination metrics, etc.)

---

## Deliverables

Client-facing documents generated at the end of an assessment engagement.

### Security Assessment Report
**File:** `cybersecurity_risk_assessment_report-template.md`

**Purpose:** Comprehensive 10-15 page assessment report documenting findings, gaps, and recommendations

**Generated:** Phase 6 of advisory workflow (if selected)

**Contents:**
- Executive Summary
- Organization Profile
- Current Security Posture
- Gap Analysis
- Risk Assessment
- Prioritized Recommendations
- Budget Considerations
- Compliance Mapping
- Appendices

**Use Case:** Primary deliverable for risk assessments, board presentations, compliance evidence

---

### 120-Day Strategic Action Plan
**File:** `cybersecurity_strategic_action_plan_template.md`

**Purpose:** Week-by-week implementation guide for addressing identified gaps

**Generated:** Phase 6 of advisory workflow (if selected)

**Contents:**
- Implementation Timeline (Weeks 1-120)
- Quick Wins (First 30 days)
- Foundation Building (Days 31-60)
- Advanced Implementation (Days 61-90)
- Maturity & Optimization (Days 91-120)
- Resource Planning
- Success Metrics

**Use Case:** Operational roadmap for IT teams, implementation tracking, project management

---

### Implementation Checklist
**File:** `cybersecurity_implementation_checklist_template.md`

**Purpose:** 120+ checkbox action items for tactical execution

**Generated:** Phase 6 of advisory workflow (if selected)

**Contents:**
- Immediate Actions (Week 1-4)
- Foundation Phase (Week 5-8)
- Implementation Phase (Week 9-12)
- Optimization Phase (Week 13-16)
- Category-specific checklists:
  - Identity & Access Management
  - Network Security
  - Endpoint Protection
  - Data Security
  - Incident Response
  - Compliance
  - Training & Awareness

**Use Case:** Task tracking, delegation, completion verification

---

### Compliance Matrix
**File:** `compliance-matrix-template.md`

**Purpose:** Multi-framework compliance status showing control-by-control assessment across all selected frameworks

**Generated:** After completing all NIST CSF phase assessments

**Contents:**
- Executive summary with overall compliance score
- Compliance by framework (separate tables)
- Compliance by NIST CSF phase (GV, ID, PR, DE, RS, RC)
- Control cross-reference matrix (single control → multiple frameworks)
- Gap summary by priority (Critical, High, Medium)
- Framework-specific certification readiness
- Evidence index
- Control deduplication analysis

**Use Case:** Multi-framework assessments (HIPAA + NIST CSF + PCI-DSS), certification preparation, board reporting

---

### Phase Findings Template
**File:** `phase-findings-template.md`

**Purpose:** Per-phase assessment findings documenting interview responses, evidence, and gap analysis

**Generated:** At completion of each NIST CSF phase (GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER)

**Contents:**
- Phase summary with control counts and score
- Interview responses with control mappings
- Evidence collected per control
- Findings summary (compliant, partial, non-compliant)
- Gap analysis with remediation recommendations
- Handoff notes to next phase or agent

**Use Case:** Phase-based assessments, handoff documentation between advisor/engineer/security agents

---

## Engagement Rules

Internal templates that define HOW to conduct specific types of engagements.

### Risk Assessment Rules
**File:** `risk-assessment-rules-template.md`

**Purpose:** Rules and workflow for conducting cybersecurity risk assessments

**Contains:**
- Assessment methodology
- Question sequencing rules
- OSINT research protocols
- Scoring and prioritization logic
- Deliverable generation workflow

**Used by:** Risk Assessment Advisor agent during structured assessments

---

### Compliance Audit Rules
**File:** `compliance-audit-rules-template.md`

**Purpose:** Rules and workflow for compliance-focused audits

**Contains:**
- Framework selection logic (HIPAA, PCI DSS, SOC 2, etc.)
- Evidence collection requirements
- Control testing procedures
- Audit report structure
- Remediation tracking

**Used by:** Compliance-focused advisory engagements

---

### Incident Response Rules
**File:** `incident-response-rules-template.md`

**Purpose:** Rules and workflow for incident response advisory

**Contains:**
- Incident classification
- Response phases (Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned)
- Communication protocols
- Evidence preservation
- Post-incident report structure

**Used by:** IR advisory engagements, IR plan development

---

## Template Usage Workflow

### Standard Risk Assessment
1. **Phase 1-4:** Conduct 22-question assessment (per `02_assessment_workflow.md`)
2. **Phase 4.5:** Generate interview transcript
3. **Phase 5:** Present incremental approval summary
4. **Phase 6:** User selects deliverables
5. **Generation:** Load selected templates from `deliverables/`
6. **Output:** Populated deliverables with assessment data

### Custom Engagements
1. Select appropriate engagement rules template
2. Follow rules-specific workflow
3. Load relevant deliverable templates
4. Generate customized outputs

---

## Relationship to Core Advisory Workflow

These templates support the main advisory workflow defined in:
- `00_master_readme.md` - Master instructions
- `01_agent_core.md` - Agent principles
- `02_assessment_workflow.md` - 22-question workflow
- `03_industry_frameworks.md` - Industry-specific guidance

**Template Loading:**
- Core workflow files (00-03) → Always loaded
- Engagement rules → Loaded based on engagement type
- Deliverable templates → Loaded in Phase 6 based on user selection

---

## Customization Guidelines

When adapting templates for specific clients:

1. **DO customize:**
   - Organization-specific details
   - Industry-specific risks
   - Budget constraints
   - Timeline adjustments
   - Compliance requirements

2. **DON'T modify:**
   - Core template structure
   - Section headings (for consistency)
   - Quality checklist requirements
   - Multi-responder methodology

3. **Always maintain:**
   - Interview transcript reference
   - Source documentation
   - Evidence-based findings
   - Product-agnostic recommendations

---

## Version Control

Templates should be versioned separately from core workflow files:
- Major changes (structure, sections) → New version number
- Minor changes (content updates) → Update "Last Updated" date
- Industry additions → Note in change log

**Current Template Versions:**
- Deliverables: v3.2 (aligned with master workflow)
- Engagement Rules: v1.0 (initial implementation)

---

---

## Policy Templates Library

**Location:** `templates/policies/`

### Overview

**Professional-grade policy and standard templates** covering all major security domains. Each template includes:
- Comprehensive policy requirements and controls
- Compliance framework mappings (NIST, ISO 27001, CIS, PCI-DSS, HIPAA, etc.)
- Roles and responsibilities definitions
- Audit and monitoring requirements
- **Built-in Document Control revision tracking tables** (added 2025-11-25)

### Document Control Feature

**All policy templates + deliverable templates include standardized revision tracking tables** for professional document governance:

**Table Format:**
```markdown
## Document Control

| Version | Date | Author | Changes | Approved By | Next Review |
|---------|------|--------|---------|-------------|-------------|
| {{VERSION}} | {{EFFECTIVE_DATE}} | {{AUTHOR_NAME}} | {{CHANGE_SUMMARY}} | {{APPROVER_NAME}} | {{NEXT_REVIEW_DATE}} |

**Document History:**
- Track all policy revisions in the table above
- Include version number, date, author, summary of changes, approver, and next review date
- Maintain historical versions for audit purposes
- Archive superseded versions per document retention policy
```

**Benefits:**
- Meets ISO 27001, SOC 2, and ISO 9001 document control requirements
- Provides complete audit trail for policy revisions
- Tracks approvals and review cycles
- Supports iterative policy improvement over time
- Enables version comparison and change tracking

**Location:** Positioned immediately after document header, before main content

### Available Templates

**Access Control & Identity Management (4)**
1. `access_management.md` - User access provisioning and lifecycle
2. `identity_management.md` - Identity governance and authentication
3. `password_standard.md` - Password construction and management
4. `privileged_access_management.md` - Administrative account controls

**Asset & Configuration Management (3)**
5. `asset_management.md` - IT asset inventory and tracking
6. `configuration_management.md` - System configuration baselines
7. `software_management.md` - Software inventory and licensing

**Data & Privacy Protection (4)**
8. `data_inventory.md` - Data classification and cataloging
9. `database_security.md` - Database credential and access security
10. `encryption_standard.md` - Encryption algorithms and key management
11. `privacy_management.md` - Personal data protection and GDPR compliance

**Infrastructure & Network Security (5)**
12. `cloud_management.md` - Cloud service provider oversight
13. `email_security.md` - Email authentication and filtering
14. `internet_usage.md` - Acceptable Internet use standards
15. `mobile_device_management.md` - BYOD and mobile security
16. `network_security.md` - Network device hardening and monitoring

**Operations & Resilience (4)**
17. `business_continuity.md` - BC/DR and crisis management
18. `incident_response.md` - Security incident handling
19. `log_management.md` - Centralized logging and SIEM
20. `vulnerability_management.md` - Patch management and remediation

**Governance & Compliance (5)**
21. `acceptable_use.md` - IT resource usage policies
22. `ai_governance.md` - Artificial intelligence ethics and compliance
23. `physical_security.md` - Facility and physical asset protection
24. `risk_management.md` - Cyber risk assessment and reporting
25. `security_awareness_training.md` - Security education programs

**Third-Party & Lifecycle Management (2)**
26. `equipment_disposal.md` - Secure device decommissioning
27. `third_party_risk_management.md` - Vendor security assessments

**Total: 27 generic security policies**

### Framework-Specific Policies

**AIUC-1 AI Agent Controls (7 policies)**
- **Location:** `frameworks/aiuc-1/templates/policies/`
- Policies: data-privacy.md, security.md, safety.md, reliability.md, accountability.md, governance.md, societal-safety.md
- Coverage: AIUC-1 Principles A-F (51 controls)

**DSA Platform Safety (5 policies)**
- **Location:** `frameworks/dsa/templates/policies/`
- Policies: CHILD-SAFETY-POLICY-TEMPLATE.md, NOTICE-ACTION-POLICY-TEMPLATE.md, RISK-ASSESSMENT-TEMPLATE.md, STATEMENT-OF-REASONS-TEMPLATE.md, TERMS-OF-SERVICE-TEMPLATE.md
- Coverage: EU Digital Services Act requirements

### Template Placeholders

**All templates use standardized placeholders for easy customization:**

**Organization Details:**
- `{{ORGANIZATION_NAME}}` - Legal entity name
- `{{POLICY_OWNER}}` - Department/role responsible
- `{{CONTACT_EMAIL}}` - Policy support contact

**Version Control:**
- `{{VERSION}}` - Policy version number (e.g., 1.0, 2.1)
- `{{EFFECTIVE_DATE}}` - Implementation date
- `{{NEXT_REVIEW_DATE}}` - Scheduled review date

**Document Control Table:**
- `{{AUTHOR_NAME}}` - Policy author/creator
- `{{CHANGE_SUMMARY}}` - Description of changes in this version
- `{{APPROVER_NAME}}` - Approving authority (e.g., CISO, CTO)

**Compliance:**
- `{{COMPLIANCE_FRAMEWORKS}}` - Applicable frameworks (SOC 2, ISO 27001, HIPAA, etc.)

### Context Variables (`context.yaml`)

All assessments include a `context.yaml` file in `00-engagement/` that centralizes placeholder values. This file is populated during Phase 1 (Intake) and referenced by all templates during generation.

**Placeholder to Context.yaml Mapping:**

| Template Placeholder | Context.yaml Field |
|---------------------|-------------------|
| `{{ORGANIZATION_NAME}}` | `organization.name` |
| `{{POLICY_OWNER}}` | `governance.policy_owner` |
| `{{CONTACT_EMAIL}}` | `governance.contact_email` |
| `{{VERSION}}` | `documents.version` |
| `{{EFFECTIVE_DATE}}` | `documents.effective_date` |
| `{{NEXT_REVIEW_DATE}}` | `documents.next_review_date` |
| `{{AUTHOR_NAME}}` | `assessment.assessor_name` |
| `{{CHANGE_SUMMARY}}` | `documents.change_summary` |
| `{{APPROVER_NAME}}` | `governance.policy_approver` |
| `{{COMPLIANCE_FRAMEWORKS}}` | `compliance_frameworks` |

**Workflow:** Intake collects values from user, `context.yaml` is populated, templates reference it during generation, deliverables are produced with real values instead of placeholders.

**AIUC-1 assessments** include an additional `ai_systems` section in `context.yaml` that captures AI system names, model providers, deployment types, and risk levels.

---

### Usage Guidelines

**When to Use Policy Templates:**
1. **Risk Assessment Mode** - Generate customized policies as deliverables
2. **Ad-Hoc Advisory Mode** - Provide sample policies in response to client questions
3. **Compliance Projects** - Customize templates for SOC 2, ISO 27001, HIPAA audits
4. **GRC Implementations** - Bootstrap governance programs with complete policy suites

**Customization Workflow:**
1. Copy template from `templates/policies/` to engagement directory
2. Replace all `{{PLACEHOLDERS}}` with organization-specific values
3. Review and adjust requirements based on organization size and maturity
4. Map to specific compliance frameworks being pursued
5. Add first entry to Document Control revision table
6. Submit for organizational review and approval

**Template Structure (Consistent Across All Templates):**
1. Header with effective date and version
2. **Document Control** revision table (added 2025-11-25)
3. Purpose and objectives
4. Scope and applicability
5. Policy requirements (detailed controls)
6. Roles and responsibilities
7. Compliance and monitoring
8. Related policies and standards
9. Framework compliance mapping

**Compliance Framework Mappings Included:**
- NIST Cybersecurity Framework (CSF)
- NIST SP 800-53 / 800-171
- ISO 27001:2022 Controls
- CIS Controls v8.1
- PCI DSS v4.0
- HIPAA Security Rule
- OWASP ASVS 5.0
- SOC 2 Trust Service Criteria
- AIUC-1 AI Unified Controls v1.0 (51 controls across 6 principles)
- NIST AI Risk Management Framework (AI RMF)
- ISO 42001 AI Management System
- EU AI Act
- OWASP LLM Top 10 (2025)
- MITRE ATLAS
- CSA AI Controls Matrix (AICM)

**Professional Standards:**
- Industry best practices incorporated
- Regulatory compliance requirements addressed
- Audit-ready formatting and structure
- Citation-backed control requirements

### Deliverable Template Revisions

**All 3 deliverable templates include Document Control revision tables** for tracking updates over time:

1. **cybersecurity_risk_assessment_report-template.md**
   - Use case: Annual risk assessments, scope changes, follow-up reviews

2. **cybersecurity_strategic_action_plan_template.md**
   - Use case: Quarterly updates, milestone adjustments, scope refinements

3. **cybersecurity_implementation_checklist_template.md**
   - Use case: Task completions, priority changes, resource adjustments

**Revision Tracking Use Cases:**
- Annual risk assessment updates and comparisons
- Quarterly action plan progress reviews
- Implementation checklist milestone tracking
- Scope changes and engagement adjustments
- Audit trail for client engagements

**Template Placeholders (Deliverables):**
- `[ORGANIZATION NAME]` - Client organization
- `[VERSION NUMBER]` - Document version
- `[ASSESSMENT DATE]` / `[PLAN DATE]` / `[IMPLEMENTATION START DATE]` - Engagement dates
- `[AUTHOR NAME]` - Assessment team/consultant
- `[CHANGE SUMMARY]` - Description of revisions
- `[APPROVER NAME]` - Client approval authority
- `[NEXT REVIEW DATE]` - Scheduled review date

---

**Last Updated:** 2025-11-25
