# Standards & Methodologies Index

**Canonical agent discovery file. Lists every compliance framework and testing methodology with path, tier, type, and skill usage.**

Last updated: 2026-02-25

---

## Discovery Pattern

```
Load controls:      standards/frameworks/{id}/controls.yaml
Load questions:     standards/frameworks/{id}/questions.yaml
Load crosswalk:     standards/mappings/crosswalks/{id}.yaml
Load benchmark:     standards/frameworks/cis-benchmarks/{platform}/{version}/manifest.yaml
Load methodology:   methodologies/{domain}/framework.md
```

---

## Framework Index

| Framework | Path | Tier | Type | Category | Skills |
|-----------|------|:----:|------|----------|--------|
| AIUC-1 AI Unified Controls | `standards/frameworks/aiuc-1/` | T1 | standard | ai_governance | gap-analysis, pentest, advisory |
| EU AI Act | `standards/frameworks/eu-ai-act/` | T3 | regulation | ai_governance | pentest, advisory |
| ISO 24028 | `standards/frameworks/iso/24028/` | T2 | standard | ai_governance | gap-analysis |
| ISO 42001 | `standards/frameworks/iso/42001/` | T1 | standard | ai_governance | gap-analysis |
| ISO 42005 | `standards/frameworks/iso/42005/` | T1 | standard | ai_governance | gap-analysis |
| ISO 42006 | `standards/frameworks/iso/42006/` | T1 | standard | ai_governance | gap-analysis |
| MITRE ATLAS | `standards/frameworks/mitre-atlas/` | T2 | framework | ai_governance | pentest, advisory |
| NIST AI RMF | `standards/frameworks/nist-ai-rmf/` | T3 | framework | ai_governance | pentest, advisory, risk-assess |
| ISO 19011 | `standards/frameworks/iso/19011/` | T1 | standard | audit_methodology | gap-analysis |
| CIS Benchmarks — AWS Database Services | `standards/frameworks/cis-benchmarks/aws/cis-aws-database-services-benchmark-v1.0.0/` | ref | benchmark | hardening | harden, pentest |
| CIS Benchmarks — AWS Storage Services | `standards/frameworks/cis-benchmarks/aws/cis-aws-storage-services-benchmark-v1.0.0/` | ref | benchmark | hardening | harden, pentest |
| CIS Benchmarks — Azure Foundations | `standards/frameworks/cis-benchmarks/azure/cis-microsoft-azure-foundations-benchmark-v5.0.0/` | ref | benchmark | hardening | harden, pentest |
| CIS Benchmarks — Docker | `standards/frameworks/cis-benchmarks/docker/cis-docker-benchmark-v1.8.000/` | ref | benchmark | hardening | harden, pentest |
| CIS Benchmarks — GKE | `standards/frameworks/cis-benchmarks/gcp/cis-google-kubernetes-engine-gke-benchmark-v1.8.000-pdf/` | ref | benchmark | hardening | harden, pentest |
| CIS Benchmarks — Kubernetes | `standards/frameworks/cis-benchmarks/kubernetes/cis-kubernetes-benchmark-v1.12.000-pdf/` | ref | benchmark | hardening | harden, pentest |
| CIS Benchmarks — Ubuntu 22.04 | `standards/frameworks/cis-benchmarks/ubuntu/cis-ubuntu-linux-022.04-lts-benchmark-v3.0.000/` | ref | benchmark | hardening | harden, pentest |
| CIS Benchmarks — Ubuntu 24.04 | `standards/frameworks/cis-benchmarks/ubuntu/cis-ubuntu-linux-024.04-lts-benchmark-v1.0.000/` | ref | benchmark | hardening | harden, pentest |
| ISO 13485 | `standards/frameworks/iso/13485/` | T1 | standard | quality_management | gap-analysis |
| ISO 9001 | `standards/frameworks/iso/9001/` | T1 | standard | quality_management | gap-analysis |
| DSA | `standards/frameworks/dsa/` | T3 | regulation | regulatory | — |
| FedRAMP | `standards/frameworks/fedramp/` | T2 | framework | regulatory | gap-analysis, harden |
| GDPR | `standards/frameworks/gdpr/` | T3 | regulation | regulatory | advisory |
| HIPAA | `standards/frameworks/hipaa/` | T2 | regulation | regulatory | gap-analysis, advisory, harden |
| PCI-DSS | `standards/frameworks/pci-dss/` | T2 | standard | regulatory | gap-analysis |
| CIS Controls v8.1 | `standards/frameworks/cis-controls/` | T2 | controls | security | gap-analysis, advisory, harden |
| FFIEC | `standards/frameworks/ffiec/` | T3 | framework | security | — |
| ISO 27001 | `standards/frameworks/iso/27001/` | T1 | standard | security | gap-analysis, advisory, harden, risk-assess |
| NIST 800-53 | `standards/frameworks/nist-800-53/` | T3 | controls | security | gap-analysis |
| NIST CSF 2.0 | `standards/frameworks/nist-csf/` | T2 | framework | security | gap-analysis, advisory, harden, code-review, risk-assess |
| OWASP ASVS v4 | `standards/frameworks/owasp-asvs/v4/` | ref | standard | security | pentest, code-review |
| OWASP ASVS v5 | `standards/frameworks/owasp-asvs/v5/` | ref | standard | security | pentest, code-review |
| OWASP LLM Top 10 | `standards/frameworks/owasp-llm/` | T3 | standard | security | pentest, advisory, code-review |
| SOC 2 | `standards/frameworks/soc2/` | T3 | framework | security | — |

---

## Methodology Index

Domain-specific testing methodologies shared across pentest, bug-bounty, and vuln-scan.

| Domain | Path | Skills | Key Standards |
|--------|------|--------|---------------|
| Active Directory | `methodologies/active-directory/framework.md` | pentest, vuln-scan | MITRE ATT&CK, AD Security |
| AI / LLM | `methodologies/ai-llm/framework.md` | pentest, bug-bounty | MITRE ATLAS, OWASP LLM Top 10, AIUC-1 |
| Cloud | `methodologies/cloud/framework.md` | pentest, vuln-scan | CIS Benchmarks (AWS/Azure/GCP) |
| Hardware / Embedded | `methodologies/hardware/framework.md` | pentest | OWASP FSTM |
| Mobile | `methodologies/mobile/framework.md` | pentest, bug-bounty | OWASP MASTG, MASVS |
| Network | `methodologies/network/framework.md` | pentest, vuln-scan | MITRE ATT&CK, PTES |
| Thick Client | `methodologies/thick-client/framework.md` | pentest | OWASP, PTES |
| Web / API | `methodologies/web-api/framework.md` | pentest, bug-bounty | OWASP Top 10, OWASP ASVS |
| Web3 / Smart Contracts | `methodologies/web3/framework.md` | pentest, bug-bounty | OWASP SCSVS |

**Cloud sub-files:** `methodologies/cloud/{aws,azure,gcp,multi-cloud}-framework.md`
**Mobile sub-files:** `methodologies/mobile/{android,ios}-framework.md`
**Thick client sub-files:** `methodologies/thick-client/{linux,macos,windows}-applications.md`

---

## Tier Definitions

| Tier | Definition |
|:----:|-----------|
| T1 | Full assessment ready — controls + questions + handbook + implementation guide |
| T2 | Partial support — controls + questions, no handbook or implementation guide |
| T3 | Metadata only — manifest only, no structured controls |
| ref | Reference benchmark — PDF content, manifest only |

## Type Values

`standard` | `framework` | `controls` | `regulation` | `benchmark`

## Category Values

`ai_governance` | `security` | `regulatory` | `quality_management` | `audit_methodology` | `hardening`

Note: Methodologies use `domain` instead of category — see Methodology Index above.

---

## Crosswalks

Available crosswalk mappings in `standards/mappings/crosswalks/`:

- `aiuc-1.yaml`
- `eu-ai-act.yaml`
- `hipaa.yaml`
- `iso-13485.yaml`
- `iso-19011.yaml`
- `iso-24028.yaml`
- `iso-27001.yaml`
- `iso-42001.yaml`
- `iso-42005.yaml`
- `iso-42006.yaml`
- `iso-9001.yaml`
- `mitre-atlas.yaml`
- `nist-ai-rmf.yaml`
- `nist-csf.yaml`
- `owasp-llm.yaml`
- `soc2.yaml`

---

## Adding Frameworks

See `README.md` for the complete guide on adding new frameworks.

---

**See also:** `STATUS.md` — artifact completion matrix
