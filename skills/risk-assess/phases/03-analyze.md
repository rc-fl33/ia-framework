---
domain: risk-assess
skill: risk-assess
agent: advisor
model: sonnet
mode: single-agent
complexity: high
chain_position: middle
---

# Phase 3: ANALYZE (Likelihood × Impact Scoring, Risk Level Calculation)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Score each asset/threat pair using the likelihood × impact matrix,
calculate risk levels, and produce the risk analysis document. This phase transforms the
raw inventory from Phase 2 into quantified, comparable risk entries ready for prioritization.

**Additional constraints:** Do not assign treatment options in this phase — that is Phase 4.
Focus entirely on accurate scoring. Challenge any score that seems inflated or deflated and
ask for supporting rationale. Consistency across the matrix matters more than individual
precision.

---

## INPUT CONTRACT

**Receives:**
- ASSET-INVENTORY.md and THREAT-LANDSCAPE.md from Phase 02
- scope.md with framework selection
- Output directory path: `private/output/risk-assess/{org}-{YYYY-MM}/`

**Prerequisites:**
- ASSET-INVENTORY.md exists with enumerated assets
- THREAT-LANDSCAPE.md exists with threat actors and vectors
- Framework confirmed in Phase 01

**Source:** `skills/risk-assess/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Produce a scored risk matrix for every relevant asset/threat pair, with consistent
likelihood × impact scoring and framework-aligned risk level ratings.

**Success criteria:**
- All Critical and High assets scored against all applicable threats
- Likelihood and impact scored 1-5 with rationale for each
- Risk levels calculated and categorized (Low / Medium / High / Critical)
- RISK-ANALYSIS.md written with complete risk matrix

**Failure criteria:**
- No assets or threats available from Phase 2 → Return to Phase 2
- User declines to score any pairs → STOP with guidance

---

## METHODOLOGY

**Scoring is structured, not exact.** The 1-5 scale produces comparable results across pairs,
which is the goal. Precision to fractions is not meaningful. What matters is that a
Critical-rated asset facing a High-capability threat actor with known exploitation paths scores
appropriately higher than a Low asset facing an opportunistic threat with strong controls.

**Controls reduce likelihood, not necessarily impact.** Strong controls reduce the chance
a threat is realized; they do not change the damage if the threat succeeds. Score impact
based on worst-case realization. Score likelihood after accounting for existing controls.

**Framework alignment:** Some frameworks have prescribed scoring scales. Apply them:
- FedRAMP / NIST 800-30: Maps to Very Low / Low / Moderate / High / Very High — translate to 1-5
- HIPAA: Requires considering current controls in likelihood; impact based on PHI sensitivity
- PCI DSS: Prioritize CHD assets; focus on confidentiality impact for cardholder data
- ISO 27001: ISO 27005 recommends qualitative scales — map to 1-5 for consistency
- AIUC-1: Include model-specific impact dimensions (model integrity, inference reliability)

---

## EXECUTION

### Step 1: Load Prior Phase Context

**Tool:** Read

Load from the output directory:
- `private/output/risk-assess/{org}-{YYYY-MM}/ASSET-INVENTORY.md`
- `private/output/risk-assess/{org}-{YYYY-MM}/THREAT-LANDSCAPE.md`
- `private/output/risk-assess/{org}-{YYYY-MM}/scope.md`

Extract: asset list with criticality, threat actors and vectors, existing controls and gaps,
framework selection.

**Expected output:** Prior phase context loaded
**On failure:** Ask user to confirm key assets and threats; proceed without file if needed

### Step 2: Explain Scoring Methodology

**Tool:** Direct conversation

Present the scoring methodology to the user before scoring:

**Likelihood Scale (1-5):**

| Score | Label | Definition |
|-------|-------|------------|
| 1 | Rare | Unlikely to occur in the next 12 months; no known exploitation history |
| 2 | Unlikely | Could occur but strong controls make it improbable |
| 3 | Possible | May occur; controls present but not fully effective |
| 4 | Likely | Will probably occur; weak controls or active exploitation in the wild |
| 5 | Almost Certain | Expected to occur; no effective controls, active targeting confirmed |

**Impact Scale (1-5):**

| Score | Label | Definition |
|-------|-------|------------|
| 1 | Negligible | Minimal operational disruption; no regulatory exposure |
| 2 | Minor | Limited disruption; recoverable within hours; minor reputational impact |
| 3 | Moderate | Significant disruption; recoverable within days; some regulatory exposure |
| 4 | Major | Severe disruption; extended recovery; regulatory violation likely; significant cost |
| 5 | Catastrophic | Existential impact; unrecoverable data loss; critical regulatory violation; operations halt |

**Risk Level = Likelihood × Impact:**

| Risk Score | Rating | Action Priority |
|-----------|--------|----------------|
| 20-25 | Critical | Immediate action required |
| 10-19 | High | Address within 30 days |
| 5-9 | Medium | Address within 90 days |
| 1-4 | Low | Monitor; address in roadmap |

**Expected output:** Scoring methodology understood by user
**On failure:** Proceed with default explanations; note if user wants to customize scales

### Step 3: Score Critical and High Assets First

**Tool:** Direct conversation

For each Critical and High asset from the inventory, score against each applicable threat
vector from the threat landscape. Work asset by asset.

For each asset/threat pair, determine:
1. **Likelihood (1-5):** How likely is this threat to target and successfully affect this asset?
   Consider: threat actor capability, existing controls, asset exposure, known exploitation activity
2. **Impact (1-5):** If this threat is realized against this asset, what is the damage?
   Consider: asset criticality, regulatory sensitivity, business dependencies, recovery capability
3. **Risk Score:** Likelihood × Impact
4. **Risk Level:** Critical (20-25) / High (10-19) / Medium (5-9) / Low (1-4)
5. **Rationale:** Brief explanation supporting the scores (1-2 sentences)

Ask for user input on each score. Do not assign scores unilaterally — scores should reflect
the organization's actual context. Challenge scores that seem misaligned:
- "That asset holds PHI for 50,000 patients. Are you sure impact is 2 (Minor)?"
- "You have no MFA on this system and it's internet-facing. Likelihood 1 (Rare) seems low."

**Expected output:** Critical and High assets fully scored
**On failure:** Document partial scoring; flag incomplete pairs for follow-up

### Step 4: Score Medium and Low Assets

**Tool:** Direct conversation

Repeat the scoring process for Medium and Low assets. These can be scored more quickly —
a batch approach is acceptable if the user confirms scores for asset categories rather than
individual assets.

For Low assets with no regulatory sensitivity and strong controls, a simplified scoring
approach is acceptable (likelihood 1-2, impact 1-2, risk level Low).

**Expected output:** All in-scope assets scored
**On failure:** Document incomplete scores; note in RISK-ANALYSIS.md

### Step 5: Framework-Specific Adjustments

**Tool:** Direct conversation

Apply framework-specific scoring adjustments:

**NIST CSF 2.0:** Map risk scores to CSF functions — risks affecting Detect or Respond functions
may have compounding impact (a detection failure makes other risks worse). Note these compound risks.

**HIPAA:** Per §164.308(a)(1), likelihood must account for threats to PHI "reasonably anticipated."
Ensure all PHI assets have at least one threat pair scored. Likelihood of 1 (Rare) for an
internet-facing system holding PHI requires strong justification.

**PCI DSS:** CHD assets in the CDE must be scored for all applicable threat vectors.
The impact for any successful CHD breach must be rated 4 (Major) or 5 (Catastrophic) due to
contractual and regulatory consequences.

**FedRAMP:** Apply FIPS 199 impact levels (Low/Moderate/High) to confirm alignment with
the system's ATO impact category. Risks scoring Critical must be escalated per FedRAMP
continuous monitoring requirements.

**ISO 27001:** Ensure risk scores are consistent with the Statement of Applicability (SoA)
if one exists. Accepted risks must have explicit justification.

Load `standards/frameworks/iso/27001/controls.yaml` for control references.
For each risk rated HIGH or CRITICAL, cite the relevant Annex A control IDs:

| Threat Category | Primary Annex A Controls |
|-----------------|--------------------------|
| Confidentiality threat | A.8.3 (Information access restriction), A.8.24 (Use of cryptography) |
| Integrity threat | A.8.32 (Change management), A.8.28 (Secure coding) |
| Availability threat | A.8.13 (Information backup), A.8.14 (Redundancy), A.5.29 (Information security in BCM) |
| Access control | A.8.2 (Privileged access rights), A.8.5 (Secure authentication) |
| Malware | A.8.7 (Protection against malware) |
| Vulnerability | A.8.8 (Management of technical vulnerabilities) |
| Monitoring | A.8.15 (Logging), A.8.16 (Monitoring activities) |
| Network | A.8.20 (Networks security), A.8.22 (Segregation of networks) |

Add `related_controls:` field to the risk register for each HIGH/CRITICAL risk.
Format: `related_controls: [A.8.3, A.8.24]`

**AIUC-1:** Add AI-specific impact dimensions: model integrity (training data poisoning),
inference reliability (adversarial inputs), data exfiltration (membership inference), and
model theft (model extraction). Score these separately for each AI system asset.

**General:** No additional adjustments required.

**Expected output:** Framework adjustments applied and noted in the analysis
**On failure:** Note framework adjustments as recommendations in RISK-ANALYSIS.md

### Step 6: Write RISK-ANALYSIS.md

**Tool:** Write

Write the complete risk analysis to:
`private/output/risk-assess/{org}-{YYYY-MM}/RISK-ANALYSIS.md`

Format:

```markdown
# Risk Analysis

**Org:** {org}
**Framework:** {framework}
**Date:** {YYYY-MM-DD}
**Total Pairs Scored:** {count}

---

## Scoring Methodology

**Likelihood Scale:** 1 (Rare) to 5 (Almost Certain)
**Impact Scale:** 1 (Negligible) to 5 (Catastrophic)
**Risk Level = Likelihood × Impact**

| Risk Score | Rating |
|-----------|--------|
| 20-25 | Critical |
| 10-19 | High |
| 5-9 | Medium |
| 1-4 | Low |

---

## Risk Matrix

| Risk ID | Asset | Asset Criticality | Threat | Likelihood | Impact | Risk Score | Risk Level | Related Controls | Rationale |
|---------|-------|-------------------|--------|-----------|--------|-----------|------------|-----------------|-----------|
| R-001 | A-001: {name} | Critical | Ransomware | 4 | 5 | 20 | Critical | A.8.13, A.8.14 | {rationale} |
| R-002 | A-001: {name} | Critical | Insider exfil | 3 | 5 | 15 | High | A.8.3, A.8.24 | {rationale} |
...

---

## Risk Distribution

| Risk Level | Count | Percentage |
|-----------|-------|-----------|
| Critical | {n} | {%} |
| High | {n} | {%} |
| Medium | {n} | {%} |
| Low | {n} | {%} |

---

## Framework-Specific Notes

{Framework adjustments and observations}

---

## Scoring Assumptions and Limitations

{Any assumptions made during scoring; data gaps; assets not scored and why}
```

**Expected output:** RISK-ANALYSIS.md written with complete risk matrix
**On failure:** Write partial analysis; flag incomplete entries with "PENDING" in Risk Level

### Step 7: Verify Analysis Completeness

**Tool:** Direct analysis

Confirm:
- All Critical assets have at least one scored risk pair
- All High assets have at least one scored risk pair
- Risk distribution is plausible (most orgs have more Medium/Low than Critical/High)
- No Critical assets have all Low risk scores without strong justification

**Expected output:** Analysis verified, phase summary displayed
**On failure:** Return to Step 3 or 4 to complete missing scores

---

## OUTPUT CONTRACT

**Produces:**
- `RISK-ANALYSIS.md` → `private/output/risk-assess/{org}-{YYYY-MM}/RISK-ANALYSIS.md`

**Format:** Markdown risk matrix table with scored asset/threat pairs, risk distribution
summary, and framework-specific notes.

---

## NEXT

**On success:** → Proceed to Phase 4 (Prioritize):

Load `skills/risk-assess/phases/04-prioritize.md` with:
- Complete risk matrix with scores and risk levels
- Asset criticality and regulatory sensitivity
- Control gaps identified in Phase 2
- Output directory path

**On failure (incomplete scoring):** → Ask user for missing scores; retry scoring steps

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] All Critical assets scored against applicable threats
- [ ] All High assets scored against applicable threats
- [ ] Medium and Low assets scored (or batch-confirmed)
- [ ] Risk levels calculated for all pairs
- [ ] Framework-specific adjustments applied
- [ ] RISK-ANALYSIS.md written with complete risk matrix
- [ ] Risk distribution is plausible and defensible
- [ ] Ready to proceed to Phase 4 (PRIORITIZE)

**Error recovery:**
- If scoring stalls: Provide scoring examples based on the org's industry to calibrate
- If user inflates all scores to Critical: Walk through the scale; request rationale
- If user deflates all scores to Low: Ask about control effectiveness and incident history
- If write fails: Check output directory path and permissions

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
