# harden

Infrastructure hardening skill. Use `/harden` to validate or remediate system configuration
against a security framework.

## Quick Start

```
/harden
/harden validate ubuntu-22.04 CIS Controls v8.1
/harden remediate nginx-server NIST CSF 2.0
/harden validate --target=k8s-cluster --framework=FedRAMP
/harden remediate --target=rhel9-host --framework=HIPAA
```

## What It Does

- Control-by-control gap analysis (Pass/Fail/NA) against your chosen framework
- Severity-rated findings (Critical/High/Medium/Low) with evidence references
- Prioritized remediation action list (P0–P3)
- **validate mode:** step-by-step remediation guidance per finding, no changes made
- **remediate mode:** executable bash/powershell scripts with prereq checks, verification
  steps, and rollback commands per finding; CHANGE-LOG.md tracking all actions

## Supported Frameworks

| Framework | Description | Scope |
|-----------|-------------|-------|
| CIS Controls v8.1 | 18 control groups, Implementation Groups IG1/IG2/IG3 | OS-specific benchmarks |
| NIST CSF 2.0 | 6 functions as hardening lens (Govern through Recover) | Risk-based |
| FedRAMP | NIST SP 800-53 Rev 5, Low/Moderate/High impact baselines | US federal cloud |
| ISO 27001 | Annex A controls mapped to hardening tasks | International standard |
| HIPAA | Technical safeguards (§164.312) and physical safeguards | Healthcare |
| General | CIS-inspired hardening checklist, OS-agnostic | General-purpose |

## Modes

**validate** (default)
- Non-destructive. Runs only read and observe operations.
- Enumerates current configuration, assesses against framework controls.
- Produces findings with detailed step-by-step remediation guidance.
- No rollback plan required — nothing changes on the target.
- Use this when you want to know your posture before committing to changes.

**remediate**
- Active. Generates executable remediation scripts.
- Each script includes: prerequisite check, change action, verification step, rollback command.
- Produces CHANGE-LOG.md tracking what was done.
- Requires rollback prerequisites before proceeding (backup strategy, change window, approval).
- Use this when you are ready to apply fixes with audit trail.

## When to Use

**Use /harden when:**
- Assessing a server or container against a hardening benchmark
- Preparing for a FedRAMP or ISO 27001 audit
- Implementing CIS benchmarks on a new host
- Generating remediation scripts for configuration drift
- Validating hardening posture after an infrastructure change

**Don't use if:**
- Need architecture-level security review → `/sec-review`
- Need runtime exploit testing → `/pentest` or `/vuln-scan`
- Need GRC framework compliance mapping → `/compliance`
- Need risk assessment across controls → `/risk-assess`

## Workflow

Standalone 6-phase pipeline in `skills/harden/phases/`. All phases use the engineer agent.
State detection enables resume — if a run is interrupted, pick up where it left off.

## Output

`private/output/harden/{target}-{YYYY-MM}/`

```
{target}-{YYYY-MM}/
├── scope.md                    ← framework, mode, target, rollback plan (if remediate)
├── BASELINE.md                 ← current-state inventory + applicable controls list
├── FINDINGS.md                 ← Pass/Fail/NA per control, severity, evidence
├── REMEDIATION.md              ← guidance or scripts depending on mode
├── CHANGE-LOG.md               ← remediate mode only
├── EXECUTIVE-SUMMARY.md
├── FULL-REPORT.md
└── metadata.json
```

## Related Commands

- `/risk-assess` — Risk assessment and scoring across controls
- `/incident` — Incident response workflow
- `/sec-review` — Architecture and threat modeling review
- `/pentest` — Active penetration testing
- `/vuln-scan` — Vulnerability scanning and triage
