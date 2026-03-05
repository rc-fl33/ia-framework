# Security Review - Intake Checklist

This checklist helps us understand your system before we begin the security review. Please
complete all Required sections and as many Recommended sections as possible. The information
you provide allows us to deliver a more focused and valuable assessment.

Once submitted, we'll use this to define scope, confirm domains, and generate questionnaires
for selected optional domains.

---

## 1. Organization and Project Context

**Priority: Required**

- [ ] **Organization Name:** _______________________________________________
- [ ] **Industry/Sector:** _______________________________________________
- [ ] **Project/System Name:** _______________________________________________
- [ ] **Business Criticality:**
  - [ ] Revenue-generating (customer-facing)
  - [ ] Internal operations
  - [ ] Compliance-driven
  - [ ] Other: _______________________________________________
- [ ] **Regulatory Environment** (select all that apply):
  - [ ] HIPAA (Healthcare)
  - [ ] PCI DSS (Payment Card Industry)
  - [ ] SOC 2
  - [ ] GDPR (EU Data Protection)
  - [ ] FedRAMP (Federal)
  - [ ] CCPA (California Privacy)
  - [ ] None
  - [ ] Other: _______________________________________________

---

## 2. Architecture Documentation

**Priority: Required (at minimum one architecture diagram or system description)**

Please provide documentation in at least one form. We can work with draft diagrams or
existing technical documentation.

**Documentation Provided:**

- [ ] Architecture diagrams (infrastructure, component, or network topology)
- [ ] Design documents or technical specifications
- [ ] Data flow diagrams
- [ ] API specifications (OpenAPI/Swagger, Postman collections, etc.)
- [ ] Infrastructure-as-Code files (Terraform, CloudFormation, Kubernetes manifests)
- [ ] README files or developer documentation
- [ ] Other relevant documentation: _______________________________________________

**Upload or share links to documentation here:**

_______________________________________________

_______________________________________________

_______________________________________________

---

## 3. Technology Stack

**Priority: Required**

- [ ] **Frontend Technologies:** _______________________________________________
- [ ] **Backend Technologies:** _______________________________________________
- [ ] **Database(s):** _______________________________________________
- [ ] **Caching Layer:** _______________________________________________
- [ ] **Message Queue/Event System:** _______________________________________________
- [ ] **Cloud Provider(s):** _______________________________________________
- [ ] **Key Cloud Services Used:** _______________________________________________
- [ ] **Third-Party Integrations:** _______________________________________________
- [ ] **SaaS Dependencies:** _______________________________________________
- [ ] **Authentication/Authorization Mechanism:** _______________________________________________

---

## 4. Data Classification

**Priority: Required**

- [ ] **Types of Data Processed** (select all that apply):
  - [ ] Personally Identifiable Information (PII)
  - [ ] Protected Health Information (PHI)
  - [ ] Financial data (credit cards, bank accounts, transactions)
  - [ ] User credentials or API keys
  - [ ] Business confidential information
  - [ ] Other: _______________________________________________

- [ ] **Data Residency Requirements:** _______________________________________________

- [ ] **Encryption Requirements:**
  - [ ] Data at rest: _______________________________________________
  - [ ] Data in transit: _______________________________________________

---

## 5. Deployment and Infrastructure

**Priority: Recommended**

- [ ] **Deployment Model:**
  - [ ] Cloud (AWS, Azure, GCP)
  - [ ] On-premises
  - [ ] Hybrid
  - [ ] Other: _______________________________________________

- [ ] **Environment Structure:**
  - [ ] Development
  - [ ] Staging/QA
  - [ ] Production
  - [ ] Other: _______________________________________________

- [ ] **Network Segmentation:** _______________________________________________

- [ ] **CI/CD Pipeline Details:** _______________________________________________

---

## 6. Review Focus Areas

**Priority: Recommended**

Help us prioritize the review by identifying your primary concerns.

- [ ] **What concerns you most about this system?**

_______________________________________________

_______________________________________________

- [ ] **Known Risks or Recent Incidents:**

_______________________________________________

_______________________________________________

- [ ] **Previous Security Assessments or Audit Findings:**

_______________________________________________

_______________________________________________

- [ ] **Specific Components to Prioritize:**

_______________________________________________

_______________________________________________

---

## 7. Scope Boundaries

**Priority: Required**

- [ ] **In Scope (components/systems to review):**

_______________________________________________

_______________________________________________

- [ ] **Out of Scope (components/systems excluded):**

_______________________________________________

_______________________________________________

- [ ] **Access Constraints:**
  - [ ] Read-only code access
  - [ ] No production environment access
  - [ ] Limited network access
  - [ ] Other: _______________________________________________

- [ ] **Timeline or Deadline Constraints:** _______________________________________________

---

## 8. Domain Selection

**Priority: Required**

Select which assessment domains to include. Domain A is always included.

- [x] **Domain A: Architecture and Environment** (always included)
  - Architecture decomposition and trust boundary analysis
  - Data flow mapping and attack surface enumeration
  - STRIDE/PASTA threat modeling

- [ ] **Domain B: Security Practices** (optional)
  - SDLC security integration assessment
  - Secure coding standards and vulnerability management
  - Security testing program evaluation
  - Scored against OWASP SAMM / NIST SSDF baseline
  - Requires completing the Security Practices Questionnaire

- [ ] **Domain C: Patch Management** (optional)
  - Patch management process maturity
  - OS/Platform, Application, and Emergency patching practices
  - Maturity scoring (1-5 per category)
  - Requires completing the Patch Assessment Questionnaire

**Note:** If Domain B or C is selected, we will provide questionnaires to complete before
Phase 2 analysis begins.

---

## Submission

Please return this completed checklist along with the requested documentation to begin the
scoping process. After review, we'll confirm the engagement scope, selected domains, and
provide any questionnaires needed for optional domains.

**Questions?** Contact us with any questions about this intake process or the information
requested.
