# Official Sources - NIST SP 800-53 Rev 5

## Overview

This document maps the native NIST 800-53 Rev 5 control families used in this framework. The framework uses native NIST 800-53 control families (AC, AU, CA, etc.) rather than NIST CSF phases for 800-53 compliance assessments.

## Official Reference

- **Source:** NIST (National Institute of Standards and Technology)
- **Document:** NIST Special Publication 800-53 Revision 5 - Security and Privacy Controls for Information Systems and Organizations
- **URL:** https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final
- **Release Date:** September 2020 (updated January 2022)

## NIST 800-53 Rev 5 Control Families

### AC - Access Control (32 controls)

Policies and procedures limiting system access to authorized users, processes, and devices.

| Control Range | Description |
|--------------|-------------|
| AC-1-AC-3 | Access Control Policy and Procedures |
| AC-4-AC-6 | Information Flow Enforcement, Separation of Duties |
| AC-7-AC-10 | Unsuccessful Logon, System Use Notification, Session Lock, Permitted Actions |
| AC-11-AC-21 | Session Termination, User-Based/Role-Based/Rule-Based Enforcement |

### AT - Awareness and Training (5 controls)

Security awareness training and role-based training for personnel with security responsibilities.

| Control Range | Description |
|--------------|-------------|
| AT-1-AT-2 | Security Awareness and Training Policy |
| AT-3-AT-4 | Role-Based Security Training, Training Records |
| AT-5 | Security Awareness and Training Feedback |

### AU - Audit and Accountability (14 controls)

Audit logging, review, analysis, reporting, and protection of audit records.

| Control Range | Description |
|--------------|-------------|
| AU-1-AU-2 | Audit and Accountability Policy |
| AU-3-AU-6 | Audit Events, Content, Storage, Protection |
| AU-7-AU-12 | Audit Reduction, Report Generation, Monitoring, Correlation |

### CA - Security Assessment and Authorization (9 controls)

Assessment of security controls, system authorization, and continuous monitoring.

| Control Range | Description |
|--------------|-------------|
| CA-1-CA-2 | Security Assessment and Authorization Policy |
| CA-3-CA-5 | Information Exchange, Security Assessments, Plan of Action |
| CA-6-CA-9 | Authorization, Continuous Monitoring, Internal System Connections |

### CM - Configuration Management (10 controls)

Baseline configurations, change control, and system component inventory management.

| Control Range | Description |
|--------------|-------------|
| CM-1-CM-2 | Configuration Management Policy |
| CM-3-CM-6 | Configuration Change Control, Impact Analysis, Access Restrictions |
| CM-7-CM-9 | Configuration Settings, Least Functionality, Information System Components |

### CP - Contingency Planning (10 controls)

Contingency plans, backups, testing, and recovery procedures for system continuity.

| Control Range | Description |
|--------------|-------------|
| CP-1-CM-2 | Contingency Planning Policy |
| CP-3-CM-6 | Contingency Plan, Training, Testing |
| CP-7-CM-10 | Alternate Storage/Site, Recovery, Reconstitution |

### IA - Identification and Authentication (12 controls)

Unique user identification, authentication mechanisms, and authenticator management.

| Control Range | Description |
|--------------|-------------|
| IA-1-IA-2 | Identification and Authentication Policy |
| IA-3-IA-5 | Identifier/Authenticator Management, Cryptographic Module |
| IA-6-IA-12 | Authenticator Feedback, Certificated-Based Auth, Identity Assurance |

### IR - Incident Response (9 controls)

Incident response capability, handling, reporting, and lessons learned.

| Control Range | Description |
|--------------|-------------|
| IR-1-IR-2 | Incident Response Policy |
| IR-3-IR-6 | Incident Handling, Response Planning, Reporting, Monitoring |
| IR-7-IR-9 | Incident Response Assistance, Incident Response Reserve |

### MA - Maintenance (6 controls)

Controlled system maintenance, tools, remote maintenance, and maintenance personnel.

| Control Range | Description |
|--------------|-------------|
| MA-1-MA-2 | System Maintenance Policy |
| MA-3-MA-5 | Maintenance Tools, Personnel, Timeliness |
| MA-6 | Maintenance Personnel |

### MP - Media Protection (8 controls)

Protection, sanitization, and destruction of system media containing information.

| Control Range | Description |
|--------------|-------------|
| MP-1-MP-2 | Media Protection Policy |
| MP-3-MP-6 | Media Access, Storage, Transport, Sanitization, Destruction |

### PE - Physical and Environmental Protection (17 controls)

Physical access controls, environmental protections, and facility monitoring.

| Control Range | Description |
|--------------|-------------|
| PE-1-PE-2 | Physical and Environmental Policy |
| PE-3-PE-8 | Physical Access, Monitoring, Power, Environmental |
| PE-9-PE-17 | Fire Protection, Flood, Temperature, Delivery/Removal |

### PL - Planning (9 controls)

System security and privacy plans, rules of behavior, and security-related planning activities.

| Control Range | Description |
|--------------|-------------|
| PL-1-PL-2 | Security/Privacy Planning Policy |
| PL-3-PL-8 | System Security/Privacy Plans, Rules of Behavior, Privacy Compliance |

### PM - Program Management (12 controls)

Organization-wide information security program, governance, and risk management.

| Control Range | Description |
|--------------|-------------|
| PM-1-PM-6 | Program Management, Enterprise Architecture, Risk Management |
| PM-7-PM-12 | Supply Chain, Technology Infrastructure, Continuous Improvement |

### PS - Personnel Security (8 controls)

Personnel screening, termination, transfer, sanctions, and access agreements.

| Control Range | Description |
|--------------|-------------|
| PS-1-PS-2 | Personnel Security Policy |
| PS-3-PS-6 | Screening, Termination, Transfer, Access Agreements |
| PS-7-PS-8 | Personnel Sanctions, Third-Party Personnel |

### PT - PII Processing and Transparency (9 controls)

Policies for PII processing, consent, privacy notice, and individual rights.

| Control Range | Description |
|--------------|-------------|
| PT-1-PT-2 | PII Processing and Transparency Policy |
| PT-3-PT-7 | Notice, Consent, Individual Rights, Dispute Resolution |
| PT-8-PT-9 | Disclosure, Accountability, Data Quality, Data Minimization |

### RA - Risk Assessment (6 controls)

Risk assessment methodology, risk register, vulnerability monitoring, and privacy risk.

| Control Range | Description |
|--------------|-------------|
| RA-1-RA-2 | Risk Assessment Policy |
| RA-3-RA-6 | Risk Assessment, Risk Analysis, Vulnerability Monitoring |

### SA - System and Services Acquisition (12 controls)

Security in acquisition, system development lifecycle, and external service management.

| Control Range | Description |
|--------------|-------------|
| SA-1-SA-2 | System and Services Acquisition Policy |
| SA-3-SA-5 | System Development Lifecycle, Acquisition Process |
| SA-8-SA-22 | Security Engineering, External Service Providers, Developer Configuration |

### SC - System and Communications Protection (43 controls)

Boundary protection, encryption, network segmentation, and communications security.

| Control Range | Description |
|--------------|-------------|
| SC-1-SC-2 | System and Communications Protection Policy |
| SC-3-SC-10 | Cryptographic Services, Boundary Protection, DNS, Electronic Mail |
| SC-11-SC-28 | Trusted Path, Session Auth, Data at Rest, Use of Cryptography |

### SI - System and Information Integrity (16 controls)

Flaw remediation, malicious code protection, system monitoring, and integrity tools.

| Control Range | Description |
|--------------|-------------|
| SI-1-SI-2 | System and Information Integrity Policy |
| SI-3-SI-8 | Malicious Code Protection, Security Functionality Verification |
| SI-9-SI-16 | Information Input Validation, Error Handling, Audit Reduction |

### SR - Supply Chain Risk Management (9 controls)

Supply chain risk policies, supplier assessments, acquisition strategies, and SBOM.

| Control Range | Description |
|--------------|-------------|
| SR-1-SR-2 | Supply Chain Risk Management Policy |
| SR-3-SR-9 | Supply Chain Controls, Supplier Assessment, Acquisition |

**Total: 20 families, 1,189 controls (base controls + enhancements)**

## Framework Mapping

### Controls Structure

Each control in the framework includes:
- `id`: Unique control family identifier (e.g., AC, AU, CA)
- `control_family`: Native NIST 800-53 control family (AC, AU, CA, etc.)
- `title`: Control family title
- `description`: Control family description
- `status`: active
- `category`: NIST CSF function mapping (ID, GV, PR, DE, RS, RC)

### Control Family Values

| Control ID | Control Family | Category Mapping |
|------------|---------------|------------------|
| AC | Access Control | PR (Protect) |
| AT | Awareness and Training | PR (Protect) |
| AU | Audit and Accountability | DE (Detect) |
| CA | Assessment, Authorization, and Monitoring | GV (Govern) |
| CM | Configuration Management | PR (Protect) |
| CP | Contingency Planning | RC (Recover) |
| IA | Identification and Authentication | PR (Protect) |
| IR | Incident Response | RS (Respond) |
| MA | Maintenance | PR (Protect) |
| MP | Media Protection | PR (Protect) |
| PE | Physical and Environmental Protection | PR (Protect) |
| PL | Planning | GV (Govern) |
| PM | Program Management | GV (Govern) |
| PS | Personnel Security | PR (Protect) |
| PT | PII Processing and Transparency | GV (Govern) |
| RA | Risk Assessment | ID (Identify) |
| SA | System and Services Acquisition | GV (Govern) |
| SC | System and Communications Protection | PR (Protect) |
| SI | System and Information Integrity | DE (Detect) |
| SR | Supply Chain Risk Management | GV (Govern) |

## Notes

- All 1,189 controls (base + enhancements) in NIST 800-53 Rev 5 are addressed
- The framework uses native NIST 800-53 control families (AC, AU, CA, CM, etc.) rather than NIST CSF phases (IDENTIFY, GOVERN, PROTECT, DETECT, RESPOND, RECOVER)
- The `category` field in controls.yaml maps to NIST CSF functions for cross-framework compatibility, but the `control_family` field represents the native NIST 800-53 control family

---

# Official Sources - ISO/IEC 27001:2022

## Overview

This document maps the native ISO/IEC 27001:2022 Annex A Control categories used in this framework. The framework uses native ISO 27001 control categories (A.5-A.8) rather than NIST CSF phases for ISO 27001 compliance assessments.

## Official Reference

- **Source:** ISO (International Organization for Standardization)
- **Document:** ISO/IEC 27001:2022 Information security, cybersecurity and privacy protection
- **URL:** https://www.iso.org/standard/27001
- **Release Date:** 2022-10-25

## ISO 27001:2022 Annex A Control Categories

### A.5 - Organizational Controls (37 controls)

Policies, roles, asset management, access control, supplier relationships, incident management, business continuity, and legal compliance.

| Control Range | Description |
|--------------|-------------|
| A.5.1-A.5.10 | Policies, Roles, Duties, Management |
| A.5.11-A.5.14 | Asset Management, Classification |
| A.5.15-A.5.18 | Access Control |
| A.5.19-A.5.23 | Supplier Relationships, Cloud |
| A.5.24-A.5.28 | Incident Management |
| A.5.29-A.5.30 | Business Continuity |
| A.5.31-A.5.37 | Legal, Compliance, Reviews |

### A.6 - People Controls (8 controls)

Human resource security covering screening, employment terms, awareness training, disciplinary processes, and remote working.

| Control Range | Description |
|--------------|-------------|
| A.6.1-A.6.2 | Screening, Employment Terms |
| A.6.3-A.6.8 | Security Awareness, Termination, Remote Work |

### A.7 - Physical Controls (14 controls)

Physical and environmental security for premises, equipment, cabling, and storage media.

| Control Range | Description |
|--------------|-------------|
| A.7.1-A.7.14 | Physical Security Perimeters, Entry, Facilities, Equipment |

### A.8 - Technological Controls (34 controls)

Technical controls for endpoints, access, authentication, cryptography, network security, secure development, and data protection.

| Control Range | Description |
|--------------|-------------|
| A.8.1-A.8.12 | Endpoint, Access, Identity, Data Protection |
| A.8.13-A.8.16 | Backup, Redundancy, Logging, Monitoring |
| A.8.17-A.8.22 | Clock Sync, Utilities, Software, Network |
| A.8.23-A.8.34 | Filtering, Cryptography, SDLC, Testing |

**Total: 93 controls**

## Framework Mapping

### Controls Structure

Each control in the framework includes:
- `id`: Unique control identifier (e.g., A.5.1, A.6.1)
- `function`: ISO 27001 control function (ORGANIZATIONAL, PEOPLE, PHYSICAL, TECHNOLOGICAL)
- `category`: Specific control category name
- `iso_category`: Native ISO 27001 category identifier (A.5, A.6, A.7, A.8)
- `title`: Control title
- `description`: Control description
- `status`: mandatory
- `frequency`: Typical assessment frequency

### ISO Category Values

| Control ID Prefix | ISO Category | Function |
|-------------------|--------------|----------|
| A.5.x | A.5 | ORGANIZATIONAL |
| A.6.x | A.6 | PEOPLE |
| A.7.x | A.7 | PHYSICAL |
| A.8.x | A.8 | TECHNOLOGICAL |

## Notes

- All 93 Annex A controls are mandatory for ISO 27001:2022 certification
- The framework uses native ISO 27001 control categories (A.5-A.8) rather than NIST CSF phases (IDENTIFY, GOVERN, PROTECT, DETECT, RESPOND, RECOVER)
- Controls are organized into four themes: Organizational (A.5), People (A.6), Physical (A.7), and Technological (A.8)

---

# Official Sources - SOC 2 Trust Services Criteria

## Overview

This document maps the native SOC 2 Trust Services Criteria (TSC) categories used in this framework. The framework uses native TSC categories rather than NIST CSF phases for SOC 2 compliance assessments.

## Official Reference

- **Source:** AICPA Trust Services Criteria
- **Document:** 2017 Trust Services Criteria with Revised Points of Focus (2022)
- **URL:** https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022

## Trust Services Categories

### Security (Common Criteria - CC)

Required for all SOC 2 engagements. Information and systems are protected against unauthorized access, unauthorized disclosure, and damage to systems.

| TSC Category | Description | Control Count |
|--------------|-------------|---------------|
| CC1 | Control Environment | 5 |
| CC2 | Communication and Information | 3 |
| CC3 | Risk Assessment | 4 |
| CC4 | Monitoring Activities | 2 |
| CC5 | Control Activities | 3 |
| CC6 | Logical and Physical Access Controls | 8 |
| CC7 | System Operations | 5 |
| CC8 | Change Management | 1 |
| CC9 | Risk Mitigation | 2 |

**Total: 33 controls**

### Availability (A1)

Optional. Information and systems are available for operation and use to meet the entity's objectives.

| TSC Category | Description | Control Count |
|--------------|-------------|---------------|
| A1 | System Availability | 3 |

### Processing Integrity (PI1)

Optional. System processing is complete, valid, accurate, timely, and authorized to meet the entity's objectives.

| TSC Category | Description | Control Count |
|--------------|-------------|---------------|
| PI1 | Processing Integrity | 5 |

### Confidentiality (C1)

Optional. Information designated as confidential is protected to meet the entity's objectives.

| TSC Category | Description | Control Count |
|--------------|-------------|---------------|
| C1 | Confidentiality | 2 |

### Privacy (P1-P8)

Optional. Personal information is collected, used, retained, disclosed, and disposed of to meet the entity's objectives.

| TSC Category | Description | Control Count |
|--------------|-------------|---------------|
| P1 | Notice and Communication of Objectives | 1 |
| P2 | Choice and Consent | 1 |
| P3 | Collection | 2 |
| P4 | Use, Retention, and Disposal | 3 |
| P5 | Access | 2 |
| P6 | Disclosure and Notification | 7 |
| P7 | Quality | 1 |
| P8 | Monitoring and Enforcement | 1 |

**Total: 18 controls**

## Framework Mapping

### Controls Structure

Each control in the framework includes:
- `id`: Unique control identifier (e.g., CC1.1, A1.1)
- `function`: Trust service category (SECURITY, AVAILABILITY, PROCESSING_INTEGRITY, CONFIDENTIALITY, PRIVACY)
- `category`: Specific TSC category name
- `tsc_category`: Native TSC category identifier (CC1-CC9, A1, PI1, C1, P1-P8)
- `title`: Control title
- `description`: Control description
- `status`: mandatory or optional
- `frequency`: Typical assessment frequency

### TSC Category Values

| Control ID Prefix | TSC Category | Function |
|-------------------|--------------|----------|
| CC1.x | CC1 | SECURITY |
| CC2.x | CC2 | SECURITY |
| CC3.x | CC3 | SECURITY |
| CC4.x | CC4 | SECURITY |
| CC5.x | CC5 | SECURITY |
| CC6.x | CC6 | SECURITY |
| CC7.x | CC7 | SECURITY |
| CC8.x | CC8 | SECURITY |
| CC9.x | CC9 | SECURITY |
| A1.x | A1 | AVAILABILITY |
| PI1.x | PI1 | PROCESSING_INTEGRITY |
| C1.x | C1 | CONFIDENTIALITY |
| P1.x | P1 | PRIVACY |
| P2.x | P2 | PRIVACY |
| P3.x | P3 | PRIVACY |
| P4.x | P4 | PRIVACY |
| P5.x | P5 | PRIVACY |
| P6.x | P6 | PRIVACY |
| P7.x | P7 | PRIVACY |
| P8.x | P8 | PRIVACY |

## Notes

- SOC 2 engagements ALWAYS include Security (Common Criteria CC1-CC9)
- Other TSC categories (Availability, Processing Integrity, Confidentiality, Privacy) are optional based on service commitments
- The framework uses native TSC categories (CC1-CC9, A1, PI1, C1, P1-P8) rather than NIST CSF phases (IDENTIFY, GOVERN, PROTECT, DETECT, RESPOND, RECOVER)

---

# Official Sources - PCI DSS v4.0.1

## Overview

This document maps the native PCI-DSS v4.0.1 Requirements used in this framework. The framework uses native PCI-DSS requirement numbers (1-12) rather than NIST CSF phases for PCI compliance assessments.

## Official Reference

- **Source:** PCI Security Standards Council, LLC
- **Document:** Payment Card Industry Data Security Standard v4.0.1
- **URL:** https://www.pcisecuritystandards.org/
- **Reference Document:** https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0_1.pdf

## PCI-DSS v4.0.1 Requirements

### Requirement 1: Install and Maintain Network Security Controls

Network security controls (NSCs) must be implemented to protect cardholder data.

| Sub-Requirement | Title | Status |
|----------------|-------|--------|
| 1.1 | Processes and mechanisms for installing and maintaining network security controls | Required |
| 1.2 | Network security controls (NSCs) are configured and maintained | Required |
| 1.3 | Network connections between trusted and untrusted networks are restricted | Required |
| 1.4 | Risks to cardholder data from networked devices are mitigated | Required |

### Requirement 2: Apply Secure Configurations to All System Components

Default credentials, insecure services, and unnecessary functionality must be addressed.

| Sub-Requirement | Title | Status |
|----------------|-------|--------|
| 2.1 | All system components are changed from vendor defaults | Required |
| 2.2 | System component configurations are developed securely | Required |
| 2.3 | Wireless vendor defaults are changed | Required |
| 2.4 | Only necessary services, protocols, and ports are enabled | Required |
| 2.5 | Security features are documented and implemented | Required |
| 2.6 | All other system components are configured securely | Required |

### Requirement 3: Protect Stored Account Data

Storage of cardholder data must be minimized and protected.

| Sub-Requirement | Title | Status |
|----------------|-------|--------|
| 3.1 | Stored cardholder data is minimized | Required |
| 3.2 | Cardholder data storage is kept to a minimum | Required |
| 3.3 | Sensitive authentication data (SAD) is rendered unrecoverable | Required |
| 3.4 | Cardholder data on magnetic stripe is protected | Required |
| 3.5 | Cryptographic keys are managed securely | Required |
| 3.6 | Key management processes are implemented | Required |

### Requirement 4: Protect Cardholder Data with Strong Cryptography During Transmission Over Open, Public Networks

Transmission of cardholder data must be encrypted.

| Sub-Requirement | Title | Status |
|----------------|-------|--------|
| 4.1 | Strong cryptography is used during transmission | Required |
| 4.2 | Protocols are implemented securely | Required |

### Requirement 5: Protect All Systems and Networks from Malicious Software

Systems must be protected from malware.

| Sub-Requirement | Title | Status |
|----------------|-------|--------|
| 5.1 | Malicious software is prevented from entering the network | Required |
| 5.2 | Malicious software is detected and removed | Required |
| 5.3 | Anti-malware mechanisms are kept current | Required |

### Requirement 6: Develop and Maintain Secure Systems and Software

Systems and software must be securely developed.

| Sub-Requirement | Title | Status |
|----------------|-------|--------|
| 6.1 | Security vulnerabilities are identified and addressed | Required |
| 6.2 | Software is developed securely | Required |
| 6.3 | Software is developed to prevent security vulnerabilities | Required |
| 6.4 | Change management procedures are implemented | Required |
| 6.5 | Software development processes address common coding vulnerabilities | Required |
| 6.6 | Web applications are protected from attacks | Required |

### Requirement 7: Restrict Access to System Components and Cardholder Data by Business Need to Know

Access must be restricted based on business need to know.

| Sub-Requirement | Title | Status |
|----------------|-------|--------|
| 7.1 | Access to system components and data is appropriately limited | Required |
| 7.2 | Access is managed effectively | Required |

### Requirement 8: Identify Users and Authenticate Access to System Components

Users must be identified and authenticated.

| Sub-Requirement | Title | Status |
|----------------|-------|--------|
| 8.1 | User identification is managed effectively | Required |
| 8.2 | User authentication is managed effectively | Required |
| 8.3 | Access to system components is authenticated securely | Required |
| 8.4 | Multi-factor authentication (MFA) is implemented | Required |
| 8.5 | User ID and credential management is secure | Required |
| 8.6 | Access to sensitive data is properly authenticated | Required |

### Requirement 9: Restrict Physical Access to Cardholder Data

Physical access to cardholder data must be restricted.

| Sub-Requirement | Title | Status |
|----------------|-------|--------|
| 9.1 | Physical access to cardholder data is restricted | Required |
| 9.2 | Physically secure areas are protected | Required |
| 9.3 | Media containing cardholder data is protected | Required |
| 9.4 | Electronic media with cardholder data is protected | Required |
| 9.5 | Media with cardholder data is securely stored | Required |

### Requirement 10: Log and Monitor All Access to System Components and Cardholder Data

All access must be logged and monitored.

| Sub-Requirement | Title | Status |
|----------------|-------|--------|
| 10.1 | Audit logs are implemented | Required |
| 10.2 | Audit log data is protected | Required |
| 10.3 | Audit logs are reviewed | Required |
| 10.4 | Time synchronization is implemented | Required |

### Requirement 11: Test Security of Systems and Networks Regularly

Security must be tested regularly.

| Sub-Requirement | Title | Status |
|----------------|-------|--------|
| 11.1 | Security vulnerability scans are performed | Required |
| 11.2 | Network intrusions are detected | Required |
| 11.3 | Network segmentation is tested | Required |
| 11.4 | Security testing is performed | Required |

### Requirement 12: Support Information Security with Organizational Policies and Programs

Information security must be supported by organizational policies.

| Sub-Requirement | Title | Status |
|----------------|-------|--------|
| 12.1 | Information security policy is established | Required |
| 12.2 | Security awareness program is implemented | Required |
| 12.3 | Personnel are screened | Required |
| 12.4 | Security policies are communicated to personnel | Required |
| 12.5 | Risk assessment process is implemented | Required |
| 12.6 | Security policies are reviewed and updated | Required |
| 12.7 | Incident response plan is implemented | Required |
| 12.8 | PCI DSS compliance is managed | Required |
| 12.9 | Service providers are managed | Required |
| 12.10 | Security incident response procedures are implemented | Required |

## Framework Mapping

### Controls Structure

Each control in the framework includes:
- `id`: Unique control identifier (e.g., 1.1.1, 9.1.1)
- `function`: PCI-DSS function (BUILD_MAINTAIN_SECURE_NETWORK, PROTECT_CARDHOLDER_DATA, etc.)
- `category`: Specific control category name
- `pci_requirement`: Native PCI-DSS requirement number (1-12)
- `title`: Control title
- `description`: Control description
- `status`: required or best_practice

### Requirement Number Values

| Control ID Prefix | PCI-DSS Requirement | Function |
|-------------------|---------------------|----------|
| 1.x | 1 | BUILD_MAINTAIN_SECURE_NETWORK |
| 2.x | 2 | BUILD_MAINTAIN_SECURE_NETWORK |
| 3.x | 3 | PROTECT_CARDHOLDER_DATA |
| 4.x | 4 | PROTECT_CARDHOLDER_DATA |
| 5.x | 5 | MAINTAIN_VULNERABILITY_MGMT |
| 6.x | 6 | MAINTAIN_VULNERABILITY_MGMT |
| 7.x | 7 | IMPLEMENT_ACCESS_CONTROL |
| 8.x | 8 | IMPLEMENT_ACCESS_CONTROL |
| 9.x | 9 | IMPLEMENT_ACCESS_CONTROL |
| 10.x | 10 | MONITOR_TEST_NETWORKS |
| 11.x | 11 | MONITOR_TEST_NETWORKS |
| 12.x | 12 | MAINTAIN_INFO_SECURITY_POLICY |

## Notes

- All 12 PCI-DSS Requirements must be addressed for full compliance
- The framework uses native PCI-DSS requirement numbers (1-12) rather than NIST CSF phases (IDENTIFY, GOVERN, PROTECT, DETECT, RESPOND, RECOVER)
- Requirement 1-12 map to six PCI-DSS goals: Build and Maintain Secure Network (1-2), Protect Cardholder Data (3-4), Maintain Vulnerability Management (5-6), Implement Strong Access Control (7-9), Monitor and Test Networks (10-11), Maintain Information Security Policy (12)
