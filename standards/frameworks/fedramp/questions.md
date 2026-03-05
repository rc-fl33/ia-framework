# FedRAMP Interview Questions - HIGH Baseline

**Based on NIST 800-53 Rev 5 | 53 Questions**

---

## Access Control (AC) - 8 Questions

### 1. Account Management (AC-2)
**How do you manage user account provisioning, modification, and deprovisioning for your cloud system?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AC-001 |
| Controls | AC-2 |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Account management procedures
- User provisioning workflows
- Account review logs (quarterly for HIGH)

**Scoring:**
- **Full:** Automated provisioning with approval workflows, quarterly access reviews
- **Partial:** Manual process with documented procedures
- **None:** Ad-hoc account management

---

### 2. Automated Account Management (AC-2(2), AC-2(3))
**How do you implement automated account management mechanisms including automatic disabling of inactive/temporary accounts?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AC-002 |
| Controls | AC-2(2), AC-2(3) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Automated account disable configuration
- Inactive account threshold settings (35 days for HIGH)
- Temporary account expiration policies

**Scoring:**
- **Full:** Automated disable after 35 days inactivity, temp accounts auto-expire
- **Partial:** Manual review process for inactive accounts
- **None:** No automated account management

---

### 3. Multi-Factor Authentication (IA-2(1), IA-2(2), IA-2(11))
**How is multi-factor authentication implemented for ALL users (privileged and non-privileged) accessing the system?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AC-003 |
| Controls | IA-2(1), IA-2(2), IA-2(11) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- MFA configuration for all user types
- Hardware token/PIV implementation
- Replay-resistant authentication evidence

**Scoring:**
- **Full:** Phishing-resistant MFA (FIDO2, PIV/CAC) for all users, replay-resistant
- **Partial:** TOTP MFA for privileged, password for standard users
- **None:** Password-only authentication

---

### 4. Least Privilege (AC-6)
**How do you enforce least privilege and ensure users only have access necessary for their duties?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AC-004 |
| Controls | AC-6, AC-6(1), AC-6(2) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Role definitions with privilege justification
- Privileged function authorization records
- Security-relevant function access controls

**Scoring:**
- **Full:** Documented least privilege, privileged functions require explicit authorization
- **Partial:** Roles defined but not consistently enforced
- **None:** Shared admin accounts, no privilege restrictions

---

### 5. Separation of Duties (AC-5)
**How do you implement and enforce separation of duties for critical functions?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AC-005 |
| Controls | AC-5 |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Separation of duties matrix
- Conflicting duty identification
- Compensating controls for exceptions

**Scoring:**
- **Full:** Documented separation matrix, system-enforced, no single person controls critical functions
- **Partial:** Policy exists, manual enforcement
- **None:** No separation of duties

---

### 6. Remote Access (AC-17)
**How are remote access sessions secured, monitored, and controlled?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AC-006 |
| Controls | AC-17, AC-17(1), AC-17(2), AC-17(3), AC-17(4) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Remote access policy and authorization
- Encrypted tunnel configuration (FIPS-validated)
- Managed access control points
- Remote session disconnection policies

**Scoring:**
- **Full:** FIPS-validated encryption, managed access points, session recording, auto-disconnect
- **Partial:** VPN with basic logging
- **None:** Direct internet access without controls

---

### 7. Wireless Access (AC-18)
**How do you control and monitor wireless access to the system?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AC-007 |
| Controls | AC-18, AC-18(1) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Wireless access policy
- Authentication/encryption for wireless (WPA3/WPA2-Enterprise)
- Wireless IDS configuration

**Scoring:**
- **Full:** WPA3 or WPA2-Enterprise, wireless IDS, rogue AP detection
- **Partial:** WPA2 with pre-shared keys
- **None:** Open wireless or WEP

---

### 8. Mobile Device Security (AC-19)
**How do you control the use of mobile devices and enforce security requirements?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AC-008 |
| Controls | AC-19, AC-19(5) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Mobile device policy
- MDM configuration
- Full-device encryption verification
- Container/app-level protections

**Scoring:**
- **Full:** MDM enforced, full-device encryption, containerization, remote wipe capability
- **Partial:** Policy exists, partial MDM coverage
- **None:** No mobile device controls

---

## Audit and Accountability (AU) - 6 Questions

### 9. Audit Events (AU-2)
**What events are logged and do you capture all required audit events for HIGH baseline?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AU-001 |
| Controls | AU-2, AU-2(3) |
| NIST CSF Phase | DETECT |

**Evidence Required:**
- Audit policy defining all loggable events
- Evidence of organization-defined events beyond baseline
- Audit event review and update records

**Scoring:**
- **Full:** All baseline events plus organization-defined, reviewed annually
- **Partial:** Basic baseline events captured
- **None:** Minimal logging

---

### 10. Audit Content (AU-3)
**What information is captured in audit records and does it support after-the-fact investigation?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AU-002 |
| Controls | AU-3, AU-3(1) |
| NIST CSF Phase | DETECT |

**Evidence Required:**
- Audit record format documentation
- Sample logs showing required fields
- Additional detail for organization-defined events

**Scoring:**
- **Full:** Who, what, when, where, source, outcome plus additional context
- **Partial:** Basic fields captured
- **None:** Insufficient audit detail

---

### 11. Audit Storage and Failure (AU-4, AU-5)
**How do you ensure adequate audit storage capacity and prevent audit failure?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AU-003 |
| Controls | AU-4, AU-5, AU-5(1) |
| NIST CSF Phase | DETECT |

**Evidence Required:**
- Storage capacity planning documentation
- Alert thresholds for storage
- Real-time alerts to security personnel on audit failure

**Scoring:**
- **Full:** Capacity planning, real-time alerts, automatic shutdown on audit failure
- **Partial:** Basic capacity monitoring
- **None:** No capacity management

---

### 12. Audit Protection (AU-9)
**How do you protect audit information from unauthorized access, modification, and deletion?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AU-004 |
| Controls | AU-9, AU-9(2), AU-9(3), AU-9(4) |
| NIST CSF Phase | DETECT |

**Evidence Required:**
- Log access controls
- Backup to separate physical system
- Cryptographic protection (hashing/signing)
- Privileged user access restrictions

**Scoring:**
- **Full:** Immutable storage, separate backup system, cryptographic integrity, restricted access
- **Partial:** Access controls on logs, no immutability
- **None:** Logs stored with application data

---

### 13. Audit Retention and Review (AU-6, AU-11)
**How long are audit records retained and what is the review/analysis process?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AU-005 |
| Controls | AU-6, AU-6(1), AU-6(3), AU-11 |
| NIST CSF Phase | DETECT |

**Evidence Required:**
- Log retention configuration (minimum 1 year online)
- Automated analysis tools
- Correlation across system components
- Weekly review evidence

**Scoring:**
- **Full:** 1+ year retention, automated SIEM, cross-component correlation, weekly review
- **Partial:** 90-day retention, manual review
- **None:** Short retention, no analysis

---

### 14. Time Synchronization (AU-8)
**How do you synchronize time across all system components for audit correlation?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AU-006 |
| Controls | AU-8, AU-8(1) |
| NIST CSF Phase | DETECT |

**Evidence Required:**
- NTP/time synchronization configuration
- Authoritative time source identification
- Time sync monitoring

**Scoring:**
- **Full:** Authoritative time source, all components synchronized, monitored
- **Partial:** NTP configured but not monitored
- **None:** No time synchronization

---

## Awareness and Training (AT) - 2 Questions

### 15. Security Awareness (AT-2)
**How do you provide security awareness training and how often is it required?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AT-001 |
| Controls | AT-2, AT-2(2) |
| NIST CSF Phase | GOVERN |

**Evidence Required:**
- Security awareness training program
- Training completion records
- Insider threat awareness content
- Annual refresher evidence

**Scoring:**
- **Full:** Initial + annual training, insider threat awareness, completion tracking
- **Partial:** Training exists but not tracked
- **None:** No security awareness program

---

### 16. Role-Based Training (AT-3)
**How do you provide role-based security training for personnel with significant security responsibilities?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-AT-002 |
| Controls | AT-3, AT-3(3) |
| NIST CSF Phase | GOVERN |

**Evidence Required:**
- Role-based training curriculum
- Training for developers, admins, security personnel
- Practical exercises included
- Training completion records by role

**Scoring:**
- **Full:** Role-specific training with practical exercises, completion tracked
- **Partial:** Generic training for all roles
- **None:** No role-based training

---

## Configuration Management (CM) - 5 Questions

### 17. Baseline Configuration (CM-2)
**How do you develop, document, and maintain baseline configurations for system components?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-CM-001 |
| Controls | CM-2, CM-2(1), CM-2(2), CM-2(3) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Baseline configuration documentation
- Review and update records (annual minimum)
- Automated baseline maintenance tools
- High-risk area baseline retention

**Scoring:**
- **Full:** Documented baselines, automated maintenance, annual review, retained for high-risk
- **Partial:** Baselines documented but manual
- **None:** No defined baselines

---

### 18. Change Management (CM-3, CM-4)
**How is change management implemented and do you analyze security impact before changes?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-CM-002 |
| Controls | CM-3, CM-3(2), CM-4 |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Change management policy
- Security impact analysis process
- Test/development environment for changes
- Change advisory board records

**Scoring:**
- **Full:** Formal CAB, mandatory security impact analysis, test environment, rollback procedures
- **Partial:** Documented process without security analysis
- **None:** Ad-hoc changes

---

### 19. Configuration Settings (CM-6)
**How do you enforce security configuration settings across all system components?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-CM-003 |
| Controls | CM-6, CM-6(1) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Configuration settings documentation
- Automated central management/verification
- Deviation response procedures

**Scoring:**
- **Full:** Automated compliance checking, centralized management, deviation alerts
- **Partial:** Manual configuration verification
- **None:** No configuration enforcement

---

### 20. Software Restrictions (CM-7, CM-11)
**How do you restrict, disable, and prevent unauthorized software installation?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-CM-004 |
| Controls | CM-7, CM-7(1), CM-7(2), CM-7(5), CM-11 |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Least functionality documentation
- Prohibited/permitted software lists
- Periodic review of functions/services
- Software allowlisting configuration

**Scoring:**
- **Full:** Allowlisting enforced, periodic function review, automated monitoring
- **Partial:** Policy exists, manual enforcement
- **None:** No software restrictions

---

### 21. Component Inventory (CM-8)
**How do you maintain a complete and accurate inventory of system components?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-CM-005 |
| Controls | CM-8, CM-8(1), CM-8(2), CM-8(3), CM-8(5) |
| NIST CSF Phase | IDENTIFY |

**Evidence Required:**
- Component inventory (automated updates)
- Accountability by component
- Duplicate address detection
- Unauthorized component detection process

**Scoring:**
- **Full:** Automated inventory, continuous updates, duplicate detection, unauthorized alerts
- **Partial:** Manual inventory updated periodically
- **None:** No component inventory

---

## Contingency Planning (CP) - 4 Questions

### 22. Contingency Plan (CP-2)
**Do you have a documented contingency plan addressing all required elements?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-CP-001 |
| Controls | CP-2, CP-2(1), CP-2(2), CP-2(3) |
| NIST CSF Phase | RECOVER |

**Evidence Required:**
- Contingency plan with all required elements
- Resumption of essential missions within defined time
- Full system restoration capability planning
- Coordination with external plans

**Scoring:**
- **Full:** Complete plan, coordinated with related plans, addresses full restoration
- **Partial:** Basic plan without coordination
- **None:** No contingency plan

---

### 23. Contingency Testing (CP-4)
**How often is the contingency plan tested and what types of tests are performed?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-CP-002 |
| Controls | CP-4, CP-4(1) |
| NIST CSF Phase | RECOVER |

**Evidence Required:**
- Test schedule (annual minimum for HIGH)
- Coordinated testing with related plans
- Test results and lessons learned
- Plan updates based on tests

**Scoring:**
- **Full:** Annual functional testing, coordinated, lessons incorporated
- **Partial:** Tabletop only, not full functional
- **None:** No testing

---

### 24. System Backup (CP-9)
**How are system backups performed, stored, and tested for restoration?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-CP-003 |
| Controls | CP-9, CP-9(1), CP-9(2), CP-9(3), CP-9(5) |
| NIST CSF Phase | RECOVER |

**Evidence Required:**
- Backup policy covering all data types
- Separate storage location (alternate site for HIGH)
- Restoration test results
- Transfer to alternate site capability

**Scoring:**
- **Full:** Automated backups, alternate site storage, regular restoration tests, encrypted
- **Partial:** Backups performed but rarely tested
- **None:** Inconsistent or no backups

---

### 25. Alternate Processing Site (CP-7)
**Do you have an alternate processing site and how quickly can operations be transferred?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-CP-004 |
| Controls | CP-7, CP-7(1), CP-7(2), CP-7(3) |
| NIST CSF Phase | RECOVER |

**Evidence Required:**
- Alternate processing site documentation
- Transfer time objectives
- Equivalent security controls at alternate
- Accessibility during area-wide disruption

**Scoring:**
- **Full:** Geographically separate site, equivalent security, defined transfer time
- **Partial:** Alternate site but not fully configured
- **None:** No alternate processing capability

---

## Identification and Authentication (IA) - 4 Questions

### 26. Identification (IA-2, IA-3, IA-4, IA-8)
**How do you uniquely identify and authenticate all users, devices, and services?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-IA-001 |
| Controls | IA-2, IA-3, IA-4, IA-8 |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- User identification process
- Device identification/authentication
- Identifier management procedures
- Non-organizational user identification

**Scoring:**
- **Full:** Unique IDs for all entities, device authentication, non-org user identification
- **Partial:** User identification only
- **None:** Shared accounts permitted

---

### 27. Authenticator Management (IA-5)
**How do you manage authenticator credentials (passwords, tokens, certificates, keys)?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-IA-002 |
| Controls | IA-5, IA-5(1), IA-5(2), IA-5(6), IA-5(7), IA-5(8) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Password complexity enforcement
- PKI certificate validation
- Authenticator protection mechanisms
- Refresh frequency (60-day max for HIGH)
- Group authenticator controls

**Scoring:**
- **Full:** Strong password policy, PKI validation, protected storage, regular refresh
- **Partial:** Basic password policy, manual management
- **None:** Weak passwords, no management

---

### 28. Cryptographic Module Authentication (IA-7)
**How do you authenticate cryptographic modules and ensure secure operation?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-IA-003 |
| Controls | IA-7 |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- FIPS 140-2/3 validation certificates
- Cryptographic module inventory
- Module authentication mechanisms

**Scoring:**
- **Full:** FIPS 140-2/3 Level 1+ validated modules, documented inventory
- **Partial:** FIPS-validated encryption but not all modules
- **None:** Non-validated cryptography

---

### 29. Service Account Management (IA-4, IA-5)
**How are service accounts, API keys, and system credentials managed and monitored?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-IA-004 |
| Controls | IA-4, IA-5 |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Service account inventory
- API key rotation policy and automation
- Service account activity monitoring
- Secrets management solution

**Scoring:**
- **Full:** Inventoried, automated rotation, vault/secrets management, monitored
- **Partial:** Inventory exists, manual rotation
- **None:** No service account management

---

## Incident Response (IR) - 4 Questions

### 30. IR Capability (IR-1, IR-8)
**Do you have a documented incident response capability addressing all FedRAMP requirements?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-IR-001 |
| Controls | IR-1, IR-8 |
| NIST CSF Phase | RESPOND |

**Evidence Required:**
- Incident response policy and plan
- Defined incident handling procedures
- Plan review and update records

**Scoring:**
- **Full:** Complete IR policy/plan, reviewed annually, addresses all phases
- **Partial:** Basic IR plan without full coverage
- **None:** No incident response capability

---

### 31. IR Training and Testing (IR-2, IR-3)
**How do you train incident response personnel and test the IR capability?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-IR-002 |
| Controls | IR-2, IR-3, IR-3(2) |
| NIST CSF Phase | RESPOND |

**Evidence Required:**
- IR training program and records
- IR testing schedule and results (annual for HIGH)
- Coordination with related plans
- Automated testing mechanisms

**Scoring:**
- **Full:** Regular IR training, annual testing with automation, coordinated exercises
- **Partial:** Training exists, infrequent testing
- **None:** No IR training or testing

---

### 32. Incident Reporting (IR-6)
**How do you report incidents to FedRAMP, US-CERT, and agency customers within required timeframes?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-IR-003 |
| Controls | IR-6, IR-6(1) |
| NIST CSF Phase | RESPOND |

**Evidence Required:**
- Incident reporting procedures (1-hour for HIGH)
- US-CERT notification process
- Agency notification templates
- Automated reporting mechanisms

**Scoring:**
- **Full:** 1-hour reporting capability, automated mechanisms, defined templates
- **Partial:** Reporting procedures but not automated
- **None:** No incident reporting process

---

### 33. Evidence Handling (IR-4)
**How do you handle evidence collection, preservation, and chain of custody for incidents?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-IR-004 |
| Controls | IR-4, IR-4(1), IR-4(4) |
| NIST CSF Phase | RESPOND |

**Evidence Required:**
- Evidence handling procedures
- Automated incident handling tools
- Information correlation capability
- Chain of custody documentation

**Scoring:**
- **Full:** Automated handling, evidence correlation, documented chain of custody
- **Partial:** Manual evidence collection
- **None:** No evidence handling procedures

---

## Maintenance (MA) - 2 Questions

### 34. System Maintenance (MA-2, MA-3)
**How do you control and monitor system maintenance activities?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-MA-001 |
| Controls | MA-2, MA-2(2), MA-3, MA-3(1), MA-3(2) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Maintenance policy and procedures
- Automated maintenance scheduling
- Maintenance tool controls
- Media inspection before use

**Scoring:**
- **Full:** Scheduled maintenance, controlled tools, media inspection, automated where possible
- **Partial:** Documented procedures, manual process
- **None:** Ad-hoc maintenance

---

### 35. Remote Maintenance (MA-4)
**How do you control nonlocal (remote) maintenance and diagnostic activities?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-MA-002 |
| Controls | MA-4, MA-4(2), MA-4(3) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Remote maintenance policy
- Strong authentication for remote maintenance
- Session termination procedures
- Comparable security at remote sites

**Scoring:**
- **Full:** Approved remote maintenance, strong auth, session recording, terminated when complete
- **Partial:** Remote maintenance with basic controls
- **None:** Uncontrolled remote access

---

## Media Protection (MP) - 2 Questions

### 36. Media Protection (MP-2, MP-3, MP-4, MP-5)
**How do you protect and control digital and non-digital media containing system information?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-MP-001 |
| Controls | MP-2, MP-3, MP-4, MP-5 |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Media protection policy
- Media marking procedures
- Controlled area storage
- Transport protection (encryption, courier)

**Scoring:**
- **Full:** Marked media, controlled storage, encrypted transport, custodian accountability
- **Partial:** Basic media controls
- **None:** No media protection

---

### 37. Media Sanitization (MP-6)
**How do you sanitize or destroy media before disposal or reuse?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-MP-002 |
| Controls | MP-6, MP-6(1), MP-6(2) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Sanitization procedures by media type
- Testing of sanitization equipment
- Non-destructive sanitization for portable devices
- Sanitization records

**Scoring:**
- **Full:** NIST 800-88 compliant sanitization, tested equipment, documented
- **Partial:** Basic sanitization without verification
- **None:** Media disposed without sanitization

---

## Physical and Environmental Protection (PE) - 2 Questions

### 38. Physical Access (PE-2, PE-3, PE-4, PE-5, PE-6)
**How do you control physical access to facilities and system components?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-PE-001 |
| Controls | PE-2, PE-3, PE-3(1), PE-4, PE-5, PE-6 |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Physical access authorization records
- Access control systems (guards, locks, badges)
- Tamper protection for access devices
- Access control for transmission medium
- Visitor controls and logs

**Scoring:**
- **Full:** Multi-factor physical access, monitored, visitor escorts, tamper-evident
- **Partial:** Badge access with basic monitoring
- **None:** Uncontrolled physical access

---

### 39. Environmental Protection (PE-9 through PE-15)
**How do you protect against environmental hazards and ensure emergency provisions?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-PE-002 |
| Controls | PE-9, PE-10, PE-11, PE-12, PE-13, PE-14, PE-15 |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Power protection (UPS, generator)
- Emergency shutoff procedures
- Fire protection systems
- Temperature/humidity controls
- Water damage protection

**Scoring:**
- **Full:** Redundant power, fire suppression, HVAC, water detection, automatic shutoff
- **Partial:** Basic environmental controls
- **None:** No environmental protection

---

## Risk Assessment (RA) - 3 Questions

### 40. Risk Assessment (RA-3)
**How do you perform and document risk assessments for the system?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-RA-001 |
| Controls | RA-3, RA-3(1) |
| NIST CSF Phase | IDENTIFY |

**Evidence Required:**
- Risk assessment methodology
- Risk assessment report
- Supply chain risk assessment
- Annual update evidence

**Scoring:**
- **Full:** Annual risk assessment, supply chain included, documented methodology
- **Partial:** Periodic assessment without supply chain
- **None:** No risk assessment

---

### 41. Vulnerability Scanning (RA-5)
**How often do you perform vulnerability scanning and what is your remediation process?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-RA-002 |
| Controls | RA-5, RA-5(2), RA-5(3), RA-5(5), RA-5(6) |
| NIST CSF Phase | IDENTIFY |

**Evidence Required:**
- Vulnerability scan reports (monthly OS, weekly web/DB for HIGH)
- Authenticated scanning configuration
- Breadth/depth of coverage
- Privileged access scanning
- Trend analysis reports

**Scoring:**
- **Full:** Monthly+ scans, authenticated, full coverage, trend analysis, remediation SLAs
- **Partial:** Quarterly scans, unauthenticated
- **None:** No vulnerability scanning

---

### 42. Penetration Testing (CA-8)
**How often do you perform penetration testing and how are findings addressed?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-RA-003 |
| Controls | CA-8, CA-8(1) |
| NIST CSF Phase | IDENTIFY |

**Evidence Required:**
- Penetration test reports (annual minimum)
- Red team exercises for HIGH
- Remediation tracking
- Testing scope documentation

**Scoring:**
- **Full:** Annual pentest, red team exercises, tracked remediation
- **Partial:** Annual pentest without red team
- **None:** No penetration testing

---

## System and Communications Protection (SC) - 4 Questions

### 43. Boundary Protection (SC-7)
**How do you implement boundary protection and control network traffic?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-SC-001 |
| Controls | SC-7, SC-7(3), SC-7(4), SC-7(5), SC-7(7), SC-7(8), SC-7(18) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Network architecture with security boundaries
- Access points limited and monitored
- Deny-by-default traffic rules
- Fail-secure configuration
- Traffic filtering on managed interfaces

**Scoring:**
- **Full:** Segmented network, deny-by-default, fail-secure, managed interfaces only
- **Partial:** Basic firewall, limited segmentation
- **None:** Flat network

---

### 44. Transmission Confidentiality (SC-8)
**How is data protected during transmission (in transit)?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-SC-002 |
| Controls | SC-8, SC-8(1) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Encryption standards for transmission
- TLS 1.2+ configuration
- FIPS-validated cryptographic modules
- Alternative physical safeguards (if used)

**Scoring:**
- **Full:** FIPS-validated TLS 1.2+, all transmission encrypted
- **Partial:** TLS implemented but not FIPS-validated
- **None:** Unencrypted transmission

---

### 45. Data at Rest Protection (SC-28)
**How is data protected at rest (stored data)?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-SC-003 |
| Controls | SC-28, SC-28(1) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Encryption at rest configuration
- FIPS-validated cryptographic modules
- Key management procedures

**Scoring:**
- **Full:** FIPS-validated encryption for all data at rest, proper key management
- **Partial:** Encryption implemented but not FIPS-validated
- **None:** No encryption at rest

---

### 46. Key Management (SC-12)
**How do you manage cryptographic keys throughout their lifecycle?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-SC-004 |
| Controls | SC-12, SC-12(1) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Key management policy
- Key generation, distribution, storage procedures
- Key rotation and destruction
- HSM or equivalent protection

**Scoring:**
- **Full:** FIPS-compliant key management, HSM protection, documented lifecycle
- **Partial:** Basic key management without HSM
- **None:** No key management

---

## System and Information Integrity (SI) - 4 Questions

### 47. Flaw Remediation (SI-2)
**How do you identify, report, and correct system flaws (patch management)?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-SI-001 |
| Controls | SI-2, SI-2(2), SI-2(3) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Patch management policy with SLAs
- Automated patch deployment
- Patch installation verification
- Remediation benchmarks (30 days critical for HIGH)

**Scoring:**
- **Full:** Automated patching, 30-day critical SLA, centralized management, verified
- **Partial:** Manual patching, longer SLAs
- **None:** No patch management

---

### 48. Malicious Code Protection (SI-3)
**How do you protect against malicious code?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-SI-002 |
| Controls | SI-3, SI-3(1), SI-3(2) |
| NIST CSF Phase | DETECT |

**Evidence Required:**
- Anti-malware solution configuration
- Automatic updates (real-time for HIGH)
- Detection and eradication capability
- Non-signature-based detection

**Scoring:**
- **Full:** EDR/XDR with behavioral analysis, real-time updates, automated response
- **Partial:** Signature-based AV with daily updates
- **None:** No malware protection

---

### 49. System Monitoring (SI-4)
**How do you monitor the system for security-relevant events and anomalies?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-SI-003 |
| Controls | SI-4, SI-4(2), SI-4(4), SI-4(5), SI-4(12) |
| NIST CSF Phase | DETECT |

**Evidence Required:**
- Monitoring strategy and coverage
- Automated analysis tools
- Real-time alerts for indicators of compromise
- System-wide intrusion detection
- Alert correlation capability

**Scoring:**
- **Full:** Comprehensive monitoring, automated analysis, real-time IOC alerts, correlated
- **Partial:** Basic monitoring with manual review
- **None:** No security monitoring

---

### 50. Software/Firmware Integrity (SI-7)
**How do you verify software, firmware, and information integrity?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-SI-004 |
| Controls | SI-7, SI-7(1), SI-7(7) |
| NIST CSF Phase | PROTECT |

**Evidence Required:**
- Integrity verification mechanisms
- Integrity checking automation (boot, restart)
- Unauthorized change detection
- Response procedures for integrity violations

**Scoring:**
- **Full:** Automated integrity checking, boot/restart verification, violation response
- **Partial:** Periodic integrity checks
- **None:** No integrity verification

---

## Security Assessment (CA) - 3 Questions

### 51. POA&M (CA-5)
**How do you maintain the Plan of Action and Milestones (POA&M) for identified vulnerabilities?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-CA-001 |
| Controls | CA-5, CA-5(1) |
| NIST CSF Phase | IDENTIFY |

**Evidence Required:**
- Current POA&M document
- Automated POA&M tracking
- Remediation timelines and status
- Risk acceptance documentation

**Scoring:**
- **Full:** Automated POA&M, tracked remediation, defined timelines, risk acceptance process
- **Partial:** Manual POA&M tracking
- **None:** No POA&M

---

### 52. Continuous Monitoring (CA-7)
**How do you implement continuous monitoring for the FedRAMP authorization?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-CA-002 |
| Controls | CA-7, CA-7(1) |
| NIST CSF Phase | DETECT |

**Evidence Required:**
- Continuous monitoring strategy
- Automated monitoring where possible
- Monthly/annual deliverable schedule
- Ongoing authorization evidence

**Scoring:**
- **Full:** Automated ConMon, timely deliverables, ongoing authorization maintained
- **Partial:** Manual ConMon, occasional delays
- **None:** No continuous monitoring

---

### 53. 3PAO Assessment (CA-2, CA-6)
**When was your last 3PAO assessment and what is the authorization status?**

| Attribute | Value |
|-----------|-------|
| ID | Q-FEDRAMP-CA-003 |
| Controls | CA-2, CA-2(1), CA-2(2), CA-6 |
| NIST CSF Phase | GOVERN |

**Evidence Required:**
- 3PAO Security Assessment Report (SAR)
- Authorization decision and date
- Independent assessor qualifications
- Specialized assessments for HIGH

**Scoring:**
- **Full:** Current authorization, annual assessment, specialized assessments as needed
- **Partial:** Authorization >1 year old, pending reauthorization
- **None:** No FedRAMP authorization

---

## Quick Reference Index

| # | Topic | Controls | Phase |
|---|-------|----------|-------|
| 1 | Account Management | AC-2 | PROTECT |
| 2 | Automated Account Management | AC-2(2), AC-2(3) | PROTECT |
| 3 | Multi-Factor Authentication | IA-2(1), IA-2(2), IA-2(11) | PROTECT |
| 4 | Least Privilege | AC-6 | PROTECT |
| 5 | Separation of Duties | AC-5 | PROTECT |
| 6 | Remote Access | AC-17 | PROTECT |
| 7 | Wireless Access | AC-18 | PROTECT |
| 8 | Mobile Device Security | AC-19 | PROTECT |
| 9 | Audit Events | AU-2 | DETECT |
| 10 | Audit Content | AU-3 | DETECT |
| 11 | Audit Storage and Failure | AU-4, AU-5 | DETECT |
| 12 | Audit Protection | AU-9 | DETECT |
| 13 | Audit Retention and Review | AU-6, AU-11 | DETECT |
| 14 | Time Synchronization | AU-8 | DETECT |
| 15 | Security Awareness | AT-2 | GOVERN |
| 16 | Role-Based Training | AT-3 | GOVERN |
| 17 | Baseline Configuration | CM-2 | PROTECT |
| 18 | Change Management | CM-3, CM-4 | PROTECT |
| 19 | Configuration Settings | CM-6 | PROTECT |
| 20 | Software Restrictions | CM-7, CM-11 | PROTECT |
| 21 | Component Inventory | CM-8 | IDENTIFY |
| 22 | Contingency Plan | CP-2 | RECOVER |
| 23 | Contingency Testing | CP-4 | RECOVER |
| 24 | System Backup | CP-9 | RECOVER |
| 25 | Alternate Processing Site | CP-7 | RECOVER |
| 26 | Identification | IA-2, IA-3, IA-4, IA-8 | PROTECT |
| 27 | Authenticator Management | IA-5 | PROTECT |
| 28 | Cryptographic Module Auth | IA-7 | PROTECT |
| 29 | Service Account Management | IA-4, IA-5 | PROTECT |
| 30 | IR Capability | IR-1, IR-8 | RESPOND |
| 31 | IR Training and Testing | IR-2, IR-3 | RESPOND |
| 32 | Incident Reporting | IR-6 | RESPOND |
| 33 | Evidence Handling | IR-4 | RESPOND |
| 34 | System Maintenance | MA-2, MA-3 | PROTECT |
| 35 | Remote Maintenance | MA-4 | PROTECT |
| 36 | Media Protection | MP-2, MP-3, MP-4, MP-5 | PROTECT |
| 37 | Media Sanitization | MP-6 | PROTECT |
| 38 | Physical Access | PE-2, PE-3, PE-4, PE-5, PE-6 | PROTECT |
| 39 | Environmental Protection | PE-9 through PE-15 | PROTECT |
| 40 | Risk Assessment | RA-3 | IDENTIFY |
| 41 | Vulnerability Scanning | RA-5 | IDENTIFY |
| 42 | Penetration Testing | CA-8 | IDENTIFY |
| 43 | Boundary Protection | SC-7 | PROTECT |
| 44 | Transmission Confidentiality | SC-8 | PROTECT |
| 45 | Data at Rest Protection | SC-28 | PROTECT |
| 46 | Key Management | SC-12 | PROTECT |
| 47 | Flaw Remediation | SI-2 | PROTECT |
| 48 | Malicious Code Protection | SI-3 | DETECT |
| 49 | System Monitoring | SI-4 | DETECT |
| 50 | Software/Firmware Integrity | SI-7 | PROTECT |
| 51 | POA&M | CA-5 | IDENTIFY |
| 52 | Continuous Monitoring | CA-7 | DETECT |
| 53 | 3PAO Assessment | CA-2, CA-6 | GOVERN |

---

## Summary by NIST CSF Phase

| Phase | Questions | Count |
|-------|-----------|-------|
| GOVERN | 15, 16, 53 | 3 |
| IDENTIFY | 21, 40, 41, 42, 51 | 5 |
| PROTECT | 1-8, 17-20, 26-29, 34-39, 43-47, 50 | 31 |
| DETECT | 9-14, 48, 49, 52 | 10 |
| RESPOND | 30-33 | 4 |
| RECOVER | 22-25 | 4 |

---

**Version:** Rev 5 HIGH Baseline
**Total Questions:** 53
**Last Updated:** 2026-01-14
