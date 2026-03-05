---
domain: risk-assess
skill: risk-assess
agent: advisor
model: sonnet
mode: single-agent
complexity: medium
chain_position: middle
---

# Phase 2: IDENTIFY (Asset Inventory, Threat Landscape, Vulnerability Enumeration)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Enumerate all in-scope assets, build the threat landscape for this
organization, and identify existing controls and gaps per asset category. This phase produces
the raw material for risk scoring in Phase 3.

**Additional constraints:** Do not score likelihood or impact in this phase. Focus entirely
on enumeration — assets, threats, and control gaps. Completeness here directly determines
the quality of the risk register.

---

## INPUT CONTRACT

**Receives:**
- scope.md content from Phase 01 (org context, framework selection, asset boundary)
- Output directory path: `private/output/risk-assess/{org}-{YYYY-MM}/`

**Prerequisites:**
- scope.md exists in the output directory
- Framework and asset boundary confirmed in Phase 01

**Source:** `skills/risk-assess/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Produce a complete asset inventory and threat landscape for the organization,
aligned with the selected framework's categorization approach.

**Success criteria:**
- All in-scope asset categories enumerated with criticality ratings
- Threat actors, vectors, and events documented per asset category
- Existing controls and gaps identified per asset
- ASSET-INVENTORY.md and THREAT-LANDSCAPE.md written to output directory

**Failure criteria:**
- User cannot provide any asset information → STOP with guidance on what to gather
- No threat sources identifiable for the org's industry → Unlikely; use General threat taxonomy

---

## METHODOLOGY

**Enumerate before analyzing.** The goal here is breadth — capture all relevant assets and
threats before Phase 3 scores them. It is better to have more entries and filter them during
prioritization than to miss critical asset/threat pairs early.

**Framework shapes categorization.** Each selected framework has a preferred asset taxonomy
and threat source categorization. Apply the framework's lens to organize the inventory.

**Threats are asset-specific.** A threat to a payment processing system differs from a threat
to HR records. Map threats to the asset categories they target, not as a flat list.

---

## EXECUTION

### Step 1: Load Prior Phase Context

**Tool:** Read

Load scope.md from the output directory:
```
private/output/risk-assess/{org}-{YYYY-MM}/scope.md
```

Extract: org name, selected framework, asset boundary (inclusions and exclusions),
industry, and regulatory environment.

**Expected output:** Scope context loaded
**On failure:** Ask user to confirm org name and framework; proceed without file if needed

### Step 2: Enumerate Asset Inventory

**Tool:** Direct conversation, Read (if asset documentation provided)

Enumerate all in-scope assets within the boundary defined in Phase 01. For each asset,
collect or infer the following fields:

| Field | Description |
|-------|-------------|
| Asset ID | Unique identifier (A-001, A-002, ...) |
| Asset Name | Descriptive name |
| Asset Type | Data, System, Application, People/Process, Physical, Third Party |
| Description | Brief description of purpose and content |
| Owner | Business owner or responsible team |
| Criticality | Critical / High / Medium / Low |
| Criticality Rationale | Why this criticality rating |
| Regulatory Sensitivity | PHI, PCI, PII, Confidential, Public |
| Dependencies | What this asset depends on |

**Framework-specific asset categories:**
- NIST CSF 2.0: Align to Identify function — assets, vulnerabilities, risk tolerance
- ISO 27001: Annex A asset categories — information, software, hardware, services, people
- PCI DSS: CDE assets first — CHD storage, transmission, processing; then connected systems
- HIPAA: PHI/ePHI assets first — EHR, billing, clinical systems; then supporting infrastructure
- FedRAMP: FIPS 199 categorization — Low / Moderate / High impact per confidentiality/integrity/availability
- AIUC-1: AI system components — models, training data, inference APIs, monitoring systems, pipelines
- General: Five categories — Data, Systems, Applications, People/Processes, Third Parties

Ask the user to confirm or augment the asset list. If the user has an existing CMDB, asset
register, or system inventory, request it.

**Expected output:** Complete asset list with criticality ratings
**On failure:** Build from industry-standard asset categories for the org's vertical

### Step 3: Build Threat Landscape

**Tool:** Direct conversation, WebSearch (for industry threat intelligence)

For each asset category (not each individual asset), enumerate:

**Threat Actors:**
- Internal: Malicious insider, negligent employee, contractor, third-party vendor
- External: Cybercriminal, nation-state, hacktivist, competitor, opportunistic attacker
- Environmental: Natural disaster, infrastructure failure, supply chain disruption

**Threat Vectors (how threats reach assets):**
- Network: Internet-facing services, lateral movement, man-in-the-middle
- Application: Injection, authentication bypass, business logic abuse
- Social: Phishing, pretexting, vishing
- Physical: Unauthorized access, device theft, destruction
- Supply chain: Compromised vendor, malicious update, third-party breach
- Insider: Privilege abuse, data exfiltration, sabotage

**Threat Events (what happens when a threat is realized):**
- Unauthorized access to sensitive data
- Data exfiltration and breach
- Ransomware or destructive malware
- Denial of service or availability disruption
- Fraudulent transaction or financial theft
- Regulatory violation or compliance failure
- Reputational damage

For industry-specific threats, use WebSearch:
```
"{industry} threat landscape {current year} common attacks"
```

Apply framework-specific threat taxonomy where applicable:
- NIST CSF 2.0: Threat events mapped to Detect/Respond functions
- HIPAA: Threats to PHI confidentiality, integrity, availability (CIA triad per HIPAA guidance)
- PCI DSS: Threats to cardholder data in transmission, processing, storage
- FedRAMP: NIST 800-30 threat source and event categories
- AIUC-1: Adversarial ML threats, model poisoning, data exfiltration via inference, model theft

**Expected output:** Threat landscape documented by actor, vector, and event per asset category
**On failure:** Use NIST 800-30 threat catalog as default; note any gaps

### Step 4: Enumerate Existing Controls and Gaps

**Tool:** Direct conversation

For each asset category, identify:

**Existing Controls:**
- Technical controls: Firewalls, encryption, MFA, SIEM, endpoint protection, patching
- Administrative controls: Policies, procedures, training, access reviews, vendor management
- Physical controls: Badge access, camera systems, clean desk, hardware inventory

**Control Gaps:**
- Missing controls (no MFA on critical systems, no encryption at rest)
- Weak controls (annual patching cycles, outdated firewall rules)
- Untested controls (DR plan never exercised, backups never restored)

Ask the user to describe current controls. If they have a control inventory or recent audit
findings, request them. If no information is available, note gaps as "unknown — to be assessed"
and flag for remediation.

**Expected output:** Controls and gaps mapped to asset categories
**On failure:** Document all controls as "unknown" and flag for assessment in Phase 3

### Step 5: Write ASSET-INVENTORY.md

**Tool:** Write

Write the complete asset inventory to:
`private/output/risk-assess/{org}-{YYYY-MM}/ASSET-INVENTORY.md`

Format:

```markdown
# Asset Inventory

**Org:** {org}
**Framework:** {framework}
**Date:** {YYYY-MM-DD}
**Total Assets:** {count}

---

## Asset Register

| Asset ID | Asset Name | Type | Criticality | Regulatory Sensitivity | Owner | Dependencies |
|----------|------------|------|-------------|----------------------|-------|--------------|
| A-001 | ... | Data | Critical | PHI | IT | A-003, A-007 |
...

---

## Asset Details

### A-001: {Asset Name}
- **Type:** Data
- **Description:** {description}
- **Criticality:** Critical
- **Criticality Rationale:** {why}
- **Regulatory Sensitivity:** PHI
- **Owner:** {owner}
- **Dependencies:** A-003, A-007
- **Existing Controls:** {list}
- **Control Gaps:** {list}

...
```

**Expected output:** ASSET-INVENTORY.md written
**On failure:** Write partial inventory with available data; flag incomplete entries

### Step 6: Write THREAT-LANDSCAPE.md

**Tool:** Write

Write the threat landscape to:
`private/output/risk-assess/{org}-{YYYY-MM}/THREAT-LANDSCAPE.md`

Format:

```markdown
# Threat Landscape

**Org:** {org}
**Framework:** {framework}
**Date:** {YYYY-MM-DD}
**Industry:** {industry}

---

## Threat Actor Profiles

### External Threat Actors
| Actor | Motivation | Capability | Target Assets |
|-------|-----------|-----------|--------------|
| Cybercriminal | Financial | High | A-001, A-004 |
...

### Internal Threat Actors
| Actor | Motivation | Capability | Target Assets |
|-------|-----------|-----------|--------------|
| Malicious Insider | Financial/Grievance | Medium | A-002, A-005 |
...

---

## Threat Vectors by Asset Category

### Data Assets
- **Primary vectors:** {list}
- **Notable events:** {list}

### System Assets
- **Primary vectors:** {list}
...

---

## Industry Threat Intelligence

{Summary of current threats relevant to the org's industry and technology stack}

---

## Framework-Specific Threat Notes

{Notes specific to the selected framework's threat taxonomy}
```

**Expected output:** THREAT-LANDSCAPE.md written
**On failure:** Write with available data; note any research gaps

### Step 7: Verify Completeness

**Tool:** Direct analysis

Confirm both files exist and contain substantive content:
- ASSET-INVENTORY.md has at least 5 assets enumerated
- THREAT-LANDSCAPE.md covers at least 3 threat actors and 3 threat vectors

**Expected output:** Completeness confirmed, phase summary displayed
**On failure:** Return to the step that produced incomplete output

---

## OUTPUT CONTRACT

**Produces:**
- `ASSET-INVENTORY.md` → `private/output/risk-assess/{org}-{YYYY-MM}/ASSET-INVENTORY.md`
- `THREAT-LANDSCAPE.md` → `private/output/risk-assess/{org}-{YYYY-MM}/THREAT-LANDSCAPE.md`

**Format:** Markdown tables and structured sections with asset registers and threat profiles.

---

## NEXT

**On success:** → Proceed to Phase 3 (Analyze):

Load `skills/risk-assess/phases/03-analyze.md` with:
- Asset inventory and criticality ratings
- Threat landscape (actors, vectors, events)
- Control gaps identified
- Output directory path

**On failure (incomplete inventory):** → Ask user for missing asset data, retry this phase

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Asset inventory complete — all in-scope asset categories enumerated with criticality
- [ ] Each asset has an owner, type, and criticality rating
- [ ] Threat landscape documented — actors, vectors, events per asset category
- [ ] Existing controls and gaps identified per asset category
- [ ] ASSET-INVENTORY.md written to output directory
- [ ] THREAT-LANDSCAPE.md written to output directory
- [ ] Ready to proceed to Phase 3 (ANALYZE)

**Error recovery:**
- If asset list is incomplete: Document what is known; flag unknowns explicitly
- If threat data is sparse: Use NIST 800-30 default threat catalog for the org's industry
- If control gaps unknown: Document as "to be assessed" and flag for Priority 1 treatment
- If write fails: Check output directory path and permissions

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
