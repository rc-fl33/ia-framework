# Risk Assessment Methodology Guide

Practical reference for scoring, classification, and treatment decisions used in the
`/risk-assess` skill. Read this before running Phase 03 (Analyze) for the first time.

---

## Section 1: Likelihood × Impact Scoring

### Likelihood Scale (1–5)

| Score | Label | Description |
|-------|-------|-------------|
| 1 | Rare | Unlikely in the next 3 years; no known precedent for this org profile |
| 2 | Unlikely | Could occur but historical rate is low; seen occasionally in sector |
| 3 | Possible | Reasonably expected at some point; sector incidents documented |
| 4 | Likely | Expected to occur within the year; active threat actor interest or past incidents |
| 5 | Almost Certain | Ongoing or recurring; active exploitation in the wild against similar targets |

### Impact Scale (1–5)

| Score | Label | Description |
|-------|-------|-------------|
| 1 | Negligible | No service disruption; no regulatory exposure; recoverable in hours |
| 2 | Minor | Limited disruption; minor data exposure; recoverable within a day |
| 3 | Moderate | Meaningful outage or data loss; potential regulatory notification required |
| 4 | Major | Significant financial or reputational damage; regulatory penalties likely |
| 5 | Critical | Existential threat — extended outage, mass data breach, regulatory shutdown risk |

### Risk Level Matrix

Risk Score = Likelihood × Impact

| Risk Score | Tier | Default Treatment |
|------------|------|-------------------|
| 20–25 | Critical | Mitigate or Avoid — immediate action required |
| 10–19 | High | Mitigate — treatment plan with owner and deadline |
| 5–9 | Medium | Mitigate or Accept — document residual risk |
| 1–4 | Low | Accept — monitor and review annually |

### Scoring When Data Is Limited

Apply conservative bias: when you cannot confirm a lower score, score up.

- Unknown likelihood → default to 3 (Possible) rather than 1 or 2
- Unknown impact → default to 3 (Moderate) rather than 1 or 2
- No existing controls documented → do not reduce either dimension to account for assumed controls
- Justification for scores below 3 requires cited evidence (incident history, vendor reports, pen test results)

### Common Scoring Mistakes

**Overscoring likelihood** for low-sophistication threats against hardened targets. A nation-state
APT against an org with MFA and EDR is not a 5 likelihood. Check existing controls before scoring.

**Underscoring impact for low-probability events.** A ransomware event that encrypts backup
infrastructure is a 5 impact even if the likelihood is a 2. The Risk Score (2 × 5 = 10, High)
correctly reflects the treatment urgency.

**Anchoring to past incidents only.** Threat landscape evolves. An org with no prior breach is
not automatically low likelihood — it may simply not have been targeted yet.

**Scoring controls as likelihood reduction without verifying they work.** Only reduce likelihood
when controls are tested and confirmed effective (pen test, audit, monitoring evidence).

---

## Section 2: Asset Taxonomy

### Standard Asset Categories

| Category | Examples |
|----------|----------|
| Systems | Servers, workstations, cloud instances, network devices, OT/ICS |
| Data | Databases, file shares, backups, logs, PII/PHI/CHD repositories |
| People | Employees, contractors, privileged users, third-party admins |
| Processes | Change management, access provisioning, incident response, backups |
| Third Parties | SaaS vendors, cloud providers, MSPs, payment processors, partners |

### Criticality Assignment (1–5)

| Score | Label | Criteria |
|-------|-------|----------|
| 1 | Minimal | Non-production, no sensitive data, loss has no business impact |
| 2 | Low | Internal use only, limited sensitive data, recoverable within a week |
| 3 | Moderate | Business function support, some sensitive data, SLA implications |
| 4 | High | Core business function, significant sensitive data, regulatory scope |
| 5 | Critical | Mission-critical, maximum sensitive data density, single point of failure |

**Worked Examples:**

- Primary payment processing database → 5 (Critical): in PCI scope, mission-critical, breach = regulatory action
- Internal HR portal (no SSO, no PII export) → 3 (Moderate): sensitive data, not externally exposed
- Dev/test environment with anonymized data → 1 (Minimal): no production data, isolated network
- Payroll SaaS provider → 4 (High): third-party holding sensitive compensation and banking data

### Minimum Asset Inventory Requirements by Org Size

| Org Size | Minimum Asset Count | Coverage Expectation |
|----------|---------------------|----------------------|
| Micro (<25 employees) | 10–20 assets | All critical systems + top 3 data stores |
| Small (25–100) | 25–50 assets | All production systems, data flows, key third parties |
| Mid (100–500) | 50–100 assets | Full production environment, all regulated data, all material vendors |
| Enterprise (500+) | 100+ assets | Scoped by engagement; business unit or system boundary defined in Phase 01 |

---

## Section 3: Threat Landscape

### Threat Actor Categories

| Actor Type | Motivation | Sophistication | Typical Vectors |
|------------|------------|----------------|-----------------|
| Nation-state | Espionage, disruption, IP theft | High | Supply chain, spearphishing, zero-day |
| Cybercriminal | Financial gain | Medium–High | Ransomware, credential theft, BEC |
| Insider | Grievance, financial gain, negligence | Variable | Privileged access abuse, data exfiltration |
| Hacktivist | Ideology, reputation damage | Low–Medium | DDoS, defacement, data leaks |
| Opportunist | Targets of convenience | Low | Automated scanning, unpatched CVEs, default creds |

### Threat Vector Categories

| Vector | Description | Common Entry Points |
|--------|-------------|---------------------|
| Network | Direct exploitation of network-exposed services | Open ports, unpatched services, firewall gaps |
| Application | Web/API vulnerabilities, logic flaws | OWASP Top 10, API misconfigurations, injection |
| Social Engineering | Human manipulation to bypass controls | Phishing, vishing, pretexting |
| Physical | Unauthorized physical access | Tailgating, stolen devices, removable media |
| Supply Chain | Compromise via trusted third parties | SaaS vendors, software updates, MSP access |

### Framework-Specific Threat Focus

Framework selection in Phase 01 shapes which threats receive elevated attention:

- **HIPAA** — PHI/ePHI threats: ransomware encrypting medical records, unauthorized PHI disclosure,
  workforce member access violations, business associate breaches
- **PCI DSS** — CHD threats: skimming (physical/digital), credential theft for payment systems,
  network segmentation failures, third-party processor compromise
- **FedRAMP** — Nation-state and advanced persistent threats; supply chain risk; Federal data
  classification spillage
- **ISO 27001** — Broad coverage; Annex A controls map to threat categories across all vectors
- **NIST CSF 2.0** — Risk management focus (GV.RM); threat-informed defense via IDENTIFY function
- **AIUC-1** — Model risk (training data poisoning, adversarial inputs), data lineage failures,
  inference attacks, model theft, hallucination-driven decision risk
- **General** — No framework constraints; use full threat actor and vector taxonomy above

---

## Section 4: Risk Treatment Decisions

### Treatment Options

**Accept**
Acknowledge the risk without additional controls. Document formally — acceptance is not inaction,
it is a deliberate decision with an owner.
- Use when: Risk score is Low (1–4) AND below organizational risk tolerance threshold
- Required: Risk owner, residual risk documented, review date set

**Mitigate**
Implement controls to reduce likelihood, impact, or both. Most common treatment for Medium and High.
- Use when: Risk score is Medium (5–9) or High (10–19), and cost of control is less than expected loss
- Required: Specific control(s) named, owner assigned, deadline set, residual risk scored post-control

**Transfer**
Shift financial consequence to a third party. Does not reduce likelihood or inherent risk.
- Cyber insurance: Covers breach response costs, regulatory fines, business interruption
- Contract indemnification: Vendor/partner bears liability for their systems
- Outsourcing: Transfer operational risk to a managed service provider
- Use when: Risk is High or Critical and internal mitigation cost exceeds transfer cost
- Caution: Regulatory obligations (HIPAA, PCI DSS) cannot be contractually transferred — only financial liability

**Avoid**
Discontinue the activity creating the risk. The most complete treatment; also highest business cost.
- Use when: Risk is Critical (20–25) and no feasible mitigating control exists, OR when
  the business value of the activity is less than the risk exposure
- Examples: Decommission a legacy system with no patch path; exit a business line with unacceptable
  regulatory exposure; stop processing a data category you are not required to hold

### Decision Matrix

| Risk Level | Treatment Cost Low | Treatment Cost Medium | Treatment Cost High |
|------------|--------------------|-----------------------|---------------------|
| Critical | Mitigate | Mitigate or Transfer | Avoid or Transfer |
| High | Mitigate | Mitigate or Transfer | Transfer |
| Medium | Mitigate | Accept or Mitigate | Accept |
| Low | Accept | Accept | Accept |

**Business Value Modifier:** If an activity generating a High risk provides Critical business value,
Transfer or partial Mitigation is preferred over Avoid. Document the value justification in the
risk register.

---

## Section 5: Framework-Specific Notes

### HIPAA §164.308(a)(1) — Required Risk Analysis Elements

The Security Rule mandates a risk analysis that addresses all of the following. The `/risk-assess`
Phase 02–04 outputs map to these elements:

| Required Element | Covered By |
|------------------|------------|
| Asset inventory (ePHI systems) | ASSET-INVENTORY.md |
| Threat identification | THREAT-LANDSCAPE.md |
| Vulnerability identification | THREAT-LANDSCAPE.md |
| Likelihood of threat occurrence | RISK-ANALYSIS.md (likelihood column) |
| Potential impact to ePHI | RISK-ANALYSIS.md (impact column) |
| Risk level determination | RISK-ANALYSIS.md (risk score + tier) |
| Existing controls documentation | RISK-ANALYSIS.md (controls column) |
| Residual risk | RISK-REGISTER.md |

OCR enforcement expects the risk analysis to be documented, reviewed periodically, and updated
when operations change. The output files satisfy the documentation requirement.

### FedRAMP — FIPS 199 Impact Categorization

FedRAMP requires FIPS 199 categorization (Low/Moderate/High) for each information type before
the full risk assessment. This maps to the `/risk-assess` asset criticality scale:

| FIPS 199 Impact | Asset Criticality |
|-----------------|------------------|
| High | 4–5 |
| Moderate | 3 |
| Low | 1–2 |

The overall system categorization is the high-water mark across all information types. This
feeds directly into the risk register and determines the baseline control set (NIST SP 800-53).

### ISO 27005 — Formal Methodology Mapping

ISO 27005 is the formal information security risk management standard. The `/risk-assess`
workflow approximates it without requiring full standard compliance:

| ISO 27005 Activity | /risk-assess Phase |
|--------------------|--------------------|
| Context establishment | Phase 01 — Scope |
| Asset identification and valuation | Phase 02 — Identify |
| Threat and vulnerability identification | Phase 02 — Identify |
| Risk estimation (likelihood × impact) | Phase 03 — Analyze |
| Risk evaluation and prioritization | Phase 04 — Prioritize |
| Risk treatment selection | Phase 04 — Prioritize |
| Risk acceptance and communication | Phase 05 — Deliver |

For ISO 27001 certification, supplement the `/risk-assess` output with a Statement of
Applicability (SoA) mapping risks to Annex A controls.

### NIST CSF 2.0 — GV.RM (Govern.Risk Management)

The CSF 2.0 Govern function introduced explicit Risk Management category (GV.RM). The risk
register produced by `/risk-assess` directly feeds this function:

- **GV.RM-01:** Risk management objectives established → Phase 01 Scope defines this
- **GV.RM-02:** Risk appetite and tolerance established → Phase 01 captures risk tolerance
- **GV.RM-03:** Risk management activities integrated → risk register feeds treatment roadmap
- **GV.RM-06:** Risk register maintained → RISK-REGISTER.md is the artifact

The `/risk-assess` output also populates the IDENTIFY function (ID.RA — Risk Assessment subcategory),
covering asset identification, threat intelligence, and vulnerability analysis.

---

**Guide:** risk-methodology-guide.md
**Skill:** risk-assess
**Version:** 1.0 | **Last Updated:** 2026-02-25
