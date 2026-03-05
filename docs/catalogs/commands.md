# Command Catalog

Comprehensive reference mapping slash commands to agents, skills, classifications, and outputs.

**Last Updated:** 2026-03-04
**Total Commands:** 36 (31 public, 5 private)
**Source of Truth:** `skills/*/commands/*.md` and `tools/*/commands/*.md` frontmatter

---

## Command Reference Matrix

| Command | Description | Agent | Skill | Classification | Structure | Output Location |
|---------|-------------|-------|-------|----------------|-----------|-----------------|
| `/advisory` | Security guidance and best practices — ad-hoc security advice with framework references | advisor | advisory | public | - | - |
| `/bug-bounty` | Data-driven bug bounty testing with auto-scope from platform data | security | bug-bounty | public | - | - |
| `/career` | Job posting analysis with GO/NO-GO assessment, company research, and tailored deliverables | advisor | career | public | - | - |
| `/career-search` | Discover and score remote job opportunities from hiring.cafe - returns ranked results for manual /career analysis | advisor | career | public | - | - |
| `/clifton` | CliftonStrengths analysis with individual coaching, team comparison, and multi-format output (markdown, HTML, slides) | base | clifton | public | - | - |
| `/code-review` | Security-focused code review with OWASP/CWE vulnerability detection | developer | code-review | public | - | - |
| `/create` | Interactive creation wizard for skills and tools - gathers requirements inline, then delegates generation to engineer agent | base | create | public | - | - |
| `/framework-update` | Check for and preview framework updates | base | - | public | - | - |
| `/framework-update-apply` | Apply framework updates after reviewing | base | - | public | - | - |
| `/gap-analysis` | Framework gap analysis — multi-framework, framework-native output with compliance matrix, gap findings, and remediation roadmap | advisor | gap-analysis | public | - | - |
| `/ghost-newsletter` | Weekly Digest Automation | writer | ghost | private | - | - |
| `/ghost-research` | Research Phase Tester | writer | ghost | private | - | - |
| `/ghost-write` | Blog Writing Workflow | writer | ghost | private | - | - |
| `/git-public` | Sync to your public GitHub repository (high friction, triple verification) | base | - | public | - | - |
| `/git-push` | Commit and push to your private repository | base | - | public | - | - |
| `/harden` | Infrastructure hardening — validate or remediate system configuration against CIS Controls v8.1, NIST CSF 2.0, FedRAMP, ISO 27001, HIPAA, or General benchmarks. | engineer | harden | public | - | - |
| `/incident` | Incident response — active IR documentation, tabletop exercise facilitation, or post-incident review. Mode determines agent selection before delegation. | security | incident | public | - | - |
| `/mentorship` | Skill building with learning roadmaps, 30/60/90-day plans, certifications, and career progression guidance | base | mentorship | public | - | - |
| `/model-ranker` | Privacy-Safe Model Rankings | none | - | private | - | - |
| `/monitor-start` | Start the Intelligence Adjacent monitoring dashboard server | base | - | public | - | - |
| `/monitor-stop` | Stop the Intelligence Adjacent monitoring dashboard server | base | - | public | - | - |
| `/mermaid-editor-start` | Start the Mermaid Live Editor visual editor on http://localhost:8080 | base | - | public | - | - |
| `/mermaid-editor-stop` | Stop the Mermaid Live Editor visual editor | base | - | public | - | - |
| `/pentest` | Custom client penetration testing with Director/Mentor/Demo modes | security | pentest | public | - | - |
| `/report-builder-start` | Start the Report Builder visual editor on http://localhost:3002 | base | - | public | - | - |
| `/report-builder-stop` | Stop the Report Builder visual editor | base | - | public | - | - |
| `/risk-assess` | Structured risk assessment — asset inventory, threat landscape, likelihood/impact scoring, and risk register. | advisor | risk-assess | public | - | - |
| `/sec-review` | Comprehensive security review with STRIDE/PASTA threat modeling, security practices, and patch management | security | sec-review | public | - | - |
| `/seg-test` | Network segmentation validation with Director/Demo modes | security | seg-test | public | - | - |
| `/setup` | Framework initialization - install and configure the IA Framework | base | - | public | - | - |
| `/test-plan` | Generate skill-agnostic test plans with test cases for security assessments | security | test-plan | public | - | - |
| `/update-reference` | Framework Reference Synchronization | writer | ghost | private | - | - |
| `/vuln-scan` | Automated vulnerability scanning with Director/Demo modes | security | vuln-scan | public | - | - |
| `/write` | Content writing command router — validates input and loads 5-phase workflow | writer | write | public | - | - |
| `/write-research` | Topic discovery and suggestion engine - find topics then redirect to /write | writer | write | public | - | - |
| `/write-setup` | Validate and configure content writing skill environment | base | write | public | - | - |

---

## Classification Summary

**Public Commands (29)** - Available in public ia-framework repository:
- `/advisory`
- `/bug-bounty`
- `/career`
- `/career-search`
- `/clifton`
- `/code-review`
- `/create`
- `/framework-update`
- `/framework-update-apply`
- `/gap-analysis`
- `/git-public`
- `/git-push`
- `/harden`
- `/incident`
- `/mentorship`
- `/monitor-start`
- `/monitor-stop`
- `/mermaid-editor-start`
- `/mermaid-editor-stop`
- `/pentest`
- `/report-builder-start`
- `/report-builder-stop`
- `/risk-assess`
- `/sec-review`
- `/seg-test`
- `/setup`
- `/test-plan`
- `/vuln-scan`
- `/write`
- `/write-research`
- `/write-setup`

**Private Commands (5)** - Available only in private instances:
- `/ghost-newsletter`
- `/ghost-research`
- `/ghost-write`
- `/model-ranker`
- `/update-reference`

**Classification determines:**
- Which commands are synced to public repository via `/git-public`
- Which command symlinks are created in `commands/` directory
- Documentation filtering during public release

**Note:** Skill classification in `SKILL.md` frontmatter is the source of truth. This catalog reflects those classifications for easy reference.

---

## Commands by Agent

### Advisor Agent
- **Public:** `/advisory`, `/career`, `/career-search`, `/gap-analysis`, `/risk-assess`

### Base Claude
- **Public:** `/clifton`, `/create`, `/framework-update`, `/framework-update-apply`, `/git-public`, `/git-push`, `/mentorship`, `/mermaid-editor-start`, `/mermaid-editor-stop`, `/monitor-start`, `/monitor-stop`, `/report-builder-start`, `/report-builder-stop`, `/setup`, `/write-setup`

### Developer Agent
- **Public:** `/code-review`

### Engineer Agent
- **Public:** `/harden`

### None Agent
- **Private:** `/model-ranker`

### Security Agent
- **Public:** `/bug-bounty`, `/incident`, `/pentest`, `/sec-review`, `/seg-test`, `/test-plan`, `/vuln-scan`

### Writer Agent
- **Public:** `/write`, `/write-research`
- **Private:** `/ghost-newsletter`, `/ghost-research`, `/ghost-write`, `/update-reference`

---

**Framework:** Intelligence Adjacent (IA)
