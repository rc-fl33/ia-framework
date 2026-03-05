# NIST CSF 2.0 Official Sources Verification

## Verification Overview

This document verifies the NIST Cybersecurity Framework 2.0 controls defined in `controls.yaml` against official NIST sources.

## Official Source Information

| Attribute | Value |
|-----------|-------|
| **Official URL** | https://www.nist.gov/cyberframework |
| **Reference Document** | NIST.CSWP.29 (NIST Cybersecurity Framework Version 2.0) |
| **Document URL** | https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf |
| **DOI** | 10.6028/NIST.CSWP.29 |
| **Release Date** | February 26, 2024 |
| **Verification Date** | 2026-03-03 |
| **Verification Source** | csf.tools (NIST CSF Reference Tool) |

## Control Count Verification

| Function | Official Count | Local File Count | Discrepancy |
|----------|---------------|------------------|--------------|
| GV (Govern) | 31 | 21 | -10 |
| ID (Identify) | 21 | 16 | -5 |
| PR (Protect) | 22 | 21 | -1 |
| DE (Detect) | 11 | 10 | -1 |
| RS (Respond) | 13 | 12 | -1 |
| RC (Recover) | 8 | 8 | 0 |
| **TOTAL** | **106** | **76** | **-30** |

## Discrepancies Found

### GOVERN Function (10 missing controls)

| Control ID | Title (Official) | Status |
|------------|------------------|--------|
| GV.RM-05 | Lines of communication across the organization are established for cybersecurity risks | Missing |
| GV.RM-06 | A standardized method for calculating, documenting, categorizing, and prioritizing cybersecurity risks is established and communicated | Missing |
| GV.RM-07 | Strategic opportunities are characterized and are included in organizational cybersecurity risk discussions | Missing |
| GV.SC-05 | Requirements to address cybersecurity risks in supply chains are established, prioritized, and integrated into contracts | Missing |
| GV.SC-06 | Planning and due diligence are performed to reduce risks before entering into formal supplier relationships | Missing |
| GV.SC-07 | The risks posed by a supplier, their products and services, and other third parties are understood, recorded, prioritized, assessed, responded to, and monitored | Missing |
| GV.SC-08 | Relevant suppliers and other third parties are included in incident planning, response, and recovery activities | Missing |
| GV.SC-09 | Supply chain security practices are integrated into cybersecurity and enterprise risk management programs | Missing |
| GV.SC-10 | Cybersecurity supply chain risk management plans include provisions for activities after the conclusion of a partnership | Missing |
| GV.RR-01 | Organizational leadership is responsible and accountable for cybersecurity risk and fosters a culture that is risk-aware | Worded differently |

### IDENTIFY Function (5 missing controls)

| Control ID | Title (Official) | Status |
|------------|------------------|--------|
| ID.AM-06 | Assets are protected from environmental threats and other disruptions | Missing |
| ID.RA-07 | Changes and exceptions are managed, assessed for risk impact, recorded, and tracked | Missing |
| ID.RA-08 | Processes for receiving, analyzing, and responding to vulnerability disclosures are established | Missing |
| ID.RA-09 | The authenticity and integrity of hardware and software are assessed prior to acquisition and use | Missing |
| ID.RA-10 | Critical suppliers are assessed prior to acquisition | Missing |

### PROTECT Function (1 missing control)

| Control ID | Title (Official) | Status |
|------------|------------------|--------|
| PR.DS-03 | Data is protected at key milestones in the data lifecycle | Missing |
| PR.DS-04 | Data integrity is protected | Missing |
| PR.DS-05 | Data during transfer is protected | Missing |
| PR.DS-06 | Data is made unavailable when no longer needed | Missing |
| PR.DS-07 | Data is securely deleted | Missing |
| PR.DS-08 | Data is protected from integrity errors | Missing |
| PR.DS-09 | Data is inventoried and managed | Missing |

### DETECT Function (1 missing control)

| Control ID | Title (Official) | Status |
|------------|------------------|--------|
| DE.AE-01 | A baseline of network operations and expected data flows is established and managed | Missing |
| DE.AE-05 | Events that could impede the ability to achieve organizational objectives are analyzed | Missing |

### RESPOND Function (1 missing control)

| Control ID | Title (Official) | Status |
|------------|------------------|--------|
| RS.CO-01 | Personnel know their roles and order of operations when a response is needed | Missing |
| RS.MI-03 | Incidents are resolved | Missing |

## Title/Description Variations

The following controls have minor wording differences between the official source and the local file:

| Control ID | Local Title | Official Title | Severity |
|------------|-------------|----------------|----------|
| GV.OC-05 | Outcomes, capabilities, and services dependencies are understood | Outcomes, capabilities, and services that the organization depends on are understood | Minor |
| GV.RR-01 | Organizational leadership is responsible for cybersecurity risk | Organizational leadership is responsible and accountable for cybersecurity risk and fosters a culture | Minor |
| GV.RR-03 | Adequate resources are allocated for cybersecurity | Adequate resources are allocated commensurate with the cybersecurity risk strategy | Minor |
| PR.AA-02 | Physical access is managed | Identities are proofed and bound to credentials based on context | **Major** - Wrong control |
| PR.AA-03 | Remote access is managed | Users, services, and hardware are authenticated | **Major** - Wrong control |
| PR.AA-04 | Identity assertions are managed | Identity assertions are protected, conveyed, and verified | Minor |
| PR.AA-05 | Access permissions are managed | Access permissions, entitlements, and authorizations are defined in a policy, managed, enforced, and reviewed | Minor |
| PR.AA-06 | Users, devices, and assets are authenticated | Physical access to assets is managed, monitored, and enforced | **Major** - Wrong control |
| PR.AT-01 | Personnel are provided awareness and training | Personnel are provided with awareness and training so that they possess the knowledge and skills | Minor |
| PR.AT-02 | Privileged users understand roles | Individuals in specialized roles are provided with awareness and training | Minor |
| PR.DS-01 | Data at rest is protected | The confidentiality, integrity, and availability of data-at-rest are protected | Minor |
| PR.DS-02 | Data in transit is protected | The confidentiality, integrity, and availability of data-in-transit are protected | Minor |
| PR.DS-10 | Data in use is protected | The confidentiality, integrity, and availability of data-in-use are protected | Minor |
| PR.DS-11 | Backups of data are maintained | Backups of data are created, protected, maintained, and tested | Minor |
| PR.PS-01 | Configuration management is applied | Configuration management practices are established and applied | Minor |
| PR.PS-02 | Software is maintained, replaced, and removed | Software is maintained, replaced, and removed commensurate with risk | Minor |
| PR.PS-05 | Installation of software is managed | Installation and execution of unauthorized software are prevented | Minor |
| PR.PS-06 | Secure development practices are followed | Secure software development practices are integrated | Minor |
| PR.IR-01 | Networks are protected | Networks and environments are protected from unauthorized logical access and usage | Minor |
| PR.IR-02 | Technology assets are protected | The organization's technology assets are protected from environmental threats | Minor |
| PR.IR-04 | Adequate resource capacity is maintained | Adequate resource capacity to ensure availability is maintained | Minor |
| DE.CM-01 | Networks and services are monitored | Networks and network services are monitored to find potentially adverse events | Minor |
| DE.CM-02 | Physical environment is monitored | The physical environment is monitored to find potentially adverse events | Minor |
| DE.CM-03 | Personnel activity is monitored | Personnel activity and technology usage are monitored to find potentially adverse events | Minor |
| DE.CM-06 | External service provider activity is monitored | External service provider activities and services are monitored | Minor |
| DE.CM-09 | Computing hardware is monitored | Computing hardware and software, runtime environments, and their data are monitored | Minor |
| DE.AE-02 | Potentially adverse events are analyzed | Potentially adverse events are analyzed to better understand associated activities | Minor |
| DE.AE-04 | Impact of events is estimated | The estimated impact and scope of adverse events are understood | Minor |
| DE.AE-06 | Incident alerts are declared | Information on adverse events is provided to authorized staff and tools | Minor |
| DE.AE-07 | Cyber threat intelligence is used | Cyber threat intelligence and other contextual information are integrated into the analysis | Minor |
| DE.AE-08 | Incidents are declared | Incidents are declared when adverse events meet the defined incident criteria | Minor |
| RS.MA-01 | Incident response plan is executed | The incident response plan is executed in coordination with relevant third parties | Minor |
| RS.AN-06 | Actions taken are recorded | Actions performed during an investigation are recorded, and the records' integrity and provenance are preserved | Minor |
| RS.AN-07 | Incident data is collected and preserved | Incident data and metadata are collected, and their integrity and provenance are preserved | Minor |
| RS.AN-08 | Incident analysis supports forensics | An incident's magnitude is estimated and validated | **Different** |
| RS.CO-02 | Internal stakeholders are notified | Internal and external stakeholders are notified of incidents | Minor |
| RS.MI-01 | Incidents are contained | Incidents are contained | Match |
| RC.RP-01 | Recovery plan is executed | The recovery portion of the incident response plan is executed once initiated | Minor |
| RC.RP-03 | Data and assets are restored | The integrity of backups and other restoration assets is verified before using them | Minor |
| RC.RP-05 | Integrity of restored assets is verified | The integrity of restored assets is verified, systems and services are restored | Minor |
| RC.CO-03 | Recovery activities are communicated | Recovery activities and progress in restoring operational capabilities are communicated | Minor |
| RC.CO-04 | Public communications are managed | Public updates on incident recovery are shared using approved methods | Minor |

## Critical Issues

### 1. Missing PR.AA Control Mappings (Major)
The local file has **incorrect control ID assignments** for PR.AA:
- Local `PR.AA-02` should be `PR.AA-06` (Physical access)
- Local `PR.AA-03` should be `PR.AA-03` (Authentication)
- Local `PR.AA-06` should be `PR.AA-02` (Identity proofing)

This is a significant structural error that affects 3 controls.

### 2. Missing RS.CO-01 and RS.MI-03
These controls are present in the official framework but missing from the local file.

### 3. Missing ID.AM-06
ID.AM-06 ("Assets are protected from environmental threats") is present in the official framework but missing.

## Recommendations

1. **Update controls.yaml** to include all 30 missing controls
2. **Fix PR.AA control mappings** - the current mapping is incorrect
3. **Update control titles** to match official NIST wording
4. **Add category descriptions** to match the official framework

## Sources

- [NIST Cybersecurity Framework Official Page](https://www.nist.gov/cyberframework)
- [NIST CSF 2.0 PDF](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf)
- [CSF Tools Reference](https://csf.tools/reference/nist-cybersecurity-framework/v2-0/)
