# Framework Completion Status

**Tracking artifact completeness across all compliance frameworks.**

---

## Quality Bar Artifacts

Every framework needs these 8 artifacts minimum:

| # | Artifact | Purpose |
|:-:|----------|---------|
| 1 | manifest.yaml | Framework discovery and routing |
| 2 | metadata.yaml | Acquisition, versioning, maintenance |
| 3 | controls.yaml | Structured control definitions |
| 4 | questions.yaml | Assessment questions with scoring |
| 5 | docs/ | Reference documentation |
| 6 | Implementation guide | Per-control gap closure steps |
| 7 | Framework handbook | Human-readable practitioner walkthrough |
| 8 | Findings templates | Per-requirement assessment forms |

Certifiable frameworks additionally need:
| 9 | Certification guide | Audit preparation and process |

---

## Completion Matrix

| Framework | manifest | metadata | controls | questions | docs | impl guide | handbook | findings | cert guide | Tier |
|-----------|:--------:|:--------:|:--------:|:---------:|:----:|:----------:|:--------:|:--------:|:----------:|:----:|
| **AIUC-1** | Y | Y | Y | Y | Y | Y | Y | - | Y | 1 |
| **ISO 27001** | Y | Y | Y | Y | Y | Y | Y | - | Y | 1 |
| **ISO 42001** | Y | Y | Y | Y | Y | Y | Y | - | Y | 1 |
| **ISO 9001** | Y | Y | Y | Y | Y | Y | Y | - | Y | 1 |
| **ISO 13485** | Y | Y | Y | Y | Y | Y | Y | - | Y | 1 |
| **ISO 42005** | Y | Y | Y | Y | Y | Y | Y | - | N/A | 1 |
| **NIST CSF** | Y | - | Y | Y | Y | - | - | - | N/A | 2 |
| **SOC 2** | Y | Y | Y | Y | - | - | - | - | - | 3 |
| **HIPAA** | Y | Y | Y | Y | Y | - | - | - | N/A | 2 |
| **PCI-DSS** | Y | Y | - | Y | Y | - | - | - | - | 2 |
| **FedRAMP** | Y | Y | - | Y | Y | - | - | - | - | 2 |
| **NIST 800-53** | Y | Y | - | Y | Y | - | - | - | N/A | 2 |
| **CIS Controls** | Y | Y | - | Y | - | - | - | - | N/A | 2 |
| **FFIEC** | Y | Y | - | Y | Y | - | - | - | N/A | 2 |
| **ISO 19011** | Y | Y | Y | Y | Y | - | Y | - | N/A | 2 |
| **ISO 42006** | Y | Y | Y | Y | Y | - | Y | - | N/A | 2 |
| **ISO 24028** | Y | Y | Y | Y | Y | - | Y | - | N/A | 2 |
| **GDPR** | Y | - | - | Y | - | - | - | - | N/A | 3 |
| **DSA** | Y | - | - | Y | Y | - | - | - | N/A | 3 |

**Legend:** Y = Complete, - = Missing, N/A = Not applicable

---

## Tier Definitions

| Tier | Definition | Frameworks |
|:----:|-----------|------------|
| 1 | Full quality bar met | AIUC-1, ISO 27001, ISO 42001, ISO 9001, ISO 13485, ISO 42005 |
| 2 | Has core artifacts (manifest + metadata + questions + docs), missing controls.yaml and/or deliverables | NIST CSF, HIPAA, PCI-DSS, FedRAMP, NIST 800-53, CIS Controls, FFIEC, ISO 19011, ISO 42006, ISO 24028 |
| 3 | Has manifest + questions, missing metadata and/or controls.yaml | SOC 2, GDPR, DSA |

---

## ISO Framework Crosswalks

All 8 ISO frameworks now have crosswalk YAMLs in `mappings/crosswalks/`:

| Crosswalk | Controls Mapped | External Frameworks |
|-----------|:---------------:|---------------------|
| iso-27001.yaml | 60 | NIST CSF, NIST 800-53, PCI-DSS, HIPAA, SOC2, AIUC-1, CIS v8 |
| iso-42001.yaml | 38 | AIUC-1, NIST AI RMF, EU AI Act, ISO 27001, ISO 42005 |
| iso-9001.yaml | 23 | ISO 13485, ISO 27001, ISO 14001, NIST CSF |
| iso-13485.yaml | 21 | ISO 9001, FDA 21 CFR 820, EU MDR, NIST CSF |
| iso-42005.yaml | 17 | ISO 42001, NIST AI RMF, EU AI Act |
| iso-42006.yaml | 28 | ISO 17021-1, ISO 42001 |
| iso-24028.yaml | 16 | ISO 42001, NIST AI RMF, EU AI Act, AIUC-1, MITRE ATLAS |
| iso-19011.yaml | 16 | ISO 17021-1, ISO 9001, ISO 27001, NIST CSF |

---

## Questions Summary

| Framework | Questions | File |
|-----------|:---------:|------|
| FedRAMP HIGH | 53 | `fedramp/questions.yaml` |
| AIUC-1 v1.0 | 51 | `aiuc-1/questions.yaml` |
| NIST 800-53 Rev 5 | 40 | `nist-800-53/questions.yaml` |
| ISO 27001:2022 | 35 | `iso-27001/questions.yaml` |
| CIS Controls v8.1 | 36 | `cis-controls/questions.yaml` |
| DSA (2022/2065) | 35 | `dsa/questions.yaml` |
| SOC 2 (TSC 2017-2022) | 30 | `soc2/questions.yaml` |
| GDPR | 30 | `gdpr/questions.yaml` |
| ISO/IEC 42001:2023 | 30 | `iso-42001/questions.yaml` |
| FFIEC IT Examination | 25 | `ffiec/questions.yaml` |
| ISO 13485:2016 | 25 | `iso-13485/questions.yaml` |
| NIST CSF 2.0 | 22 | `nist-csf/questions.yaml` |
| PCI-DSS v4.0.1 | 20 | `pci-dss/questions.yaml` |
| ISO 9001:2015 | 20 | `iso-9001/questions.yaml` |
| ISO 42005:2025 | 14 | `iso-42005/questions.yaml` |
| ISO 19011:2018 | 13 | `iso-19011/questions.yaml` |
| ISO 42006:2025 | 13 | `iso-42006/questions.yaml` |
| ISO 24028:2020 | 12 | `iso-24028/questions.yaml` |
| HIPAA Security Rule | 18 | `hipaa/questions.yaml` |

---

## ISO Documentation Suite (completed 2026-02-22)

All 8 ISO frameworks now have documentation suites. Tier 1 frameworks have the full suite:

| Document | ISO 27001 | ISO 42001 | ISO 9001 | ISO 13485 | ISO 42005 |
|----------|:---------:|:---------:|:--------:|:---------:|:---------:|
| Handbook | Y | Y | Y | Y | Y |
| Implementation guide | Y | Y | Y | Y | Y |
| Assessor playbook | Y | Y | - | - | Y |
| Test playbook | Y | Y | - | - | Y |
| Certification guide | Y | Y | Y | Y | N/A |
| Crosswalk YAML | Y | Y | Y | Y | Y |

Tier 2 ISO frameworks (handbook + crosswalk + assessment suite):

| Document | ISO 19011 | ISO 42006 | ISO 24028 |
|----------|:---------:|:---------:|:---------:|
| Handbook | Y | Y | Y |
| Implementation guide | N/A | Y | Y |
| Assessor playbook | Y | Y | Y |
| Test playbook | Y | Y | Y |
| Crosswalk YAML | Y | Y | Y |

**Note:** ISO pentest methodology and AI ISO unified workpaper docs previously lived in
`skills/compliance/docs/`. That skill directory was retired. Framework data now lives in
`standards/frameworks/`. Pentest methodology docs can be regenerated from framework controls
in `standards/frameworks/iso/27001/` and `standards/frameworks/iso/42001/`.

---

## Priority Order (remaining work)

| Priority | Framework | Next Action |
|:--------:|-----------|-------------|
| 1 | SOC 2 | Implementation guide, handbook, findings templates, certification guide |
| 2 | HIPAA | Implementation guide, handbook, findings templates |
| 3 | PCI-DSS | controls.yaml, implementation guide, handbook, findings templates, certification guide |
| 4 | NIST CSF | Enhance controls.yaml, implementation guide, handbook, findings templates |
| 5 | FedRAMP | controls.yaml, implementation guide, handbook, findings templates, certification guide |
| 6 | NIST 800-53 | controls.yaml, implementation guide, handbook, findings templates |
| 7 | GDPR | metadata.yaml, controls.yaml, implementation guide, handbook, findings templates |
| 8 | DSA | metadata.yaml, controls.yaml, implementation guide, handbook, findings templates |
| 9 | CIS Controls | controls.yaml, implementation guide, handbook, findings templates |
| 10 | FFIEC | controls.yaml, implementation guide, handbook, findings templates |
| 11 | ISO 42006 | ~~Implementation guide~~ — Complete |
| 12 | ISO 24028 | ~~Implementation guide~~ — Complete |
| 13 | ISO 19011 | Implementation guide was N/A; assessment suite complete |

---

## Templates

| Template | Location | Purpose |
|----------|----------|---------|
| Framework handbook | `templates/framework-handbook-template.md` | 10-section practitioner guide template |
| Phase findings | `templates/deliverables/phase-findings-template.md` | Per-phase assessment findings |
| Compliance matrix | `templates/deliverables/compliance-matrix-template.md` | Multi-framework compliance status |

---

**Last Updated:** 2026-02-23
