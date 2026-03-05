# HIPAA Security Rule - Official Reference Sources

## Verified Control Sources

This document tracks the official sources used to build the HIPAA framework controls.

### Primary Sources (Authoritative)

| Source | URL | Last Verified |
|--------|-----|---------------|
| Cornell LII | https://www.law.cornell.edu/cfr/text/45/part-164/subpart-C | 2026-03-03 |
| eCFR | https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C | 2026-03-03 |
| HHS.gov | https://www.hhs.gov/hipaa/ | 2026-03-03 |

### Control Counts by Section

| Section | Title | Implementation Specifications |
|---------|-------|------------------------------|
| 164.308 | Administrative Safeguards | 23 controls |
| 164.310 | Physical Safeguards | 10 controls |
| 164.312 | Technical Safeguards | 9 controls |
| 164.314 | Organizational Requirements | 9 controls |
| 164.316 | Policies and Procedures | 4 controls |
| **TOTAL** | | **55 controls** |

### Verification Status

- [x] 164.308 - Verified against Cornell LII (2026-03-03)
- [x] 164.310 - Verified against Cornell LII (2026-03-03)
- [x] 164.312 - Verified against Cornell LII (2026-03-03)
- [x] 164.314 - Verified against Cornell LII (2026-03-03)
- [x] 164.316 - Verified against Cornell LII (2026-03-03)

### IMPORTANT: HIPAA-Native Categories Only

This framework uses **HIPAA's native terminology** - NOT NIST CSF phases.

| hipaa_safeguard value | Maps to |
|---------------------|---------|
| `administrative` | 164.308 (Administrative Safeguards), 164.314 (Organizational), 164.316 (Policies) |
| `physical` | 164.310 (Physical Safeguards) |
| `technical` | 164.312 (Technical Safeguards) |

**Do NOT use NIST phases** (IDENTIFY, GOVERN, PROTECT, DETECT, RESPOND, RECOVER) in HIPAA assessments.

### Notes

- "Addressable" does NOT mean optional under HIPAA
- Addressable specs must be assessed - implement if reasonable/appropriate, or document rationale for not implementing
- All required specs must be implemented as specified
- Documentation must be retained for 6 years

### Reference Documents

- `docs/HIPAA-Security-Rule/hipaa-simplification-201303.pdf` - HHS official guidance
- `controls.yaml` - Machine-readable control definitions
- `questions.yaml` - Assessment questions per control
