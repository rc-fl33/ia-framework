# Threat Modeling Guide

Reference documentation for architecture security reviews.

---

## Methodologies

### STRIDE

Microsoft's threat modeling methodology. Analyze each component for:

| Category | Question | Example Threats |
|----------|----------|-----------------|
| **S**poofing | Can attackers impersonate? | Credential theft, session hijacking |
| **T**ampering | Can data be modified? | Man-in-the-middle, SQL injection |
| **R**epudiation | Can actions be denied? | Missing audit logs, log tampering |
| **I**nfo Disclosure | Can data leak? | Error messages, debug info, insecure storage |
| **D**enial of Service | Can availability be impacted? | Resource exhaustion, amplification |
| **E**levation of Privilege | Can attackers gain access? | Privilege escalation, RBAC bypass |

### PASTA

Process for Attack Simulation and Threat Analysis (risk-centric):

1. **Define Objectives** - Business impact, compliance requirements
2. **Define Technical Scope** - Systems, data flows, boundaries
3. **Application Decomposition** - Components, dependencies, entry points
4. **Threat Analysis** - Threat actors, attack scenarios
5. **Vulnerability Analysis** - Weaknesses, exposure
6. **Attack Modeling** - Attack trees, kill chains
7. **Risk Analysis** - Likelihood, impact, prioritization

### Attack Trees

Visual representation of attack paths:

```
                    [Goal: Steal Credentials]
                           /        \
                          /          \
              [Phishing]            [System Exploit]
               /    \                    |
              /      \                   |
    [Email]  [SMS]         [Exploit CVE-XXXX]
```

---

## Trust Boundaries

Identify where trust changes:

| Boundary Type | Examples |
|---------------|----------|
| Network | Internet → DMZ → Internal |
| Authentication | Anonymous → Authenticated |
| Authorization | User → Admin |
| Process | Browser → Server → Database |
| Data | Encrypted → Decrypted |

---

## Data Flow Diagrams (DFD)

Elements:
- **External Entity** (rectangle) - Users, external systems
- **Process** (circle) - Application components
- **Data Store** (parallel lines) - Databases, files
- **Data Flow** (arrow) - Data movement
- **Trust Boundary** (dashed line) - Where trust changes

---

## Risk Rating

| Severity | Impact | Likelihood | Action |
|----------|--------|------------|--------|
| P0 Critical | High | High | Fix immediately |
| P1 High | High | Medium | Fix this sprint |
| P2 Medium | Medium | Medium | Plan remediation |
| P3 Low | Low | Low | Backlog |

---

## References

- OWASP Threat Modeling: owasp.org/www-community/Threat_Modeling
- Microsoft STRIDE: docs.microsoft.com/en-us/azure/security/develop/threat-modeling-tool
- PASTA: owasp.org/www-pdf-archive/AppSecEU2012_PASTA.pdf
