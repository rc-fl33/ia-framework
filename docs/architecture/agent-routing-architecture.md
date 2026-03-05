---
type: documentation
title: Agent Routing Architecture
classification: public
version: 2
last_updated: Wed Dec 10 2025 18:00:00 GMT-0600 (Central Standard Time)
audience: intermediate
category: architecture
---



# Agent Routing Architecture

**Version:** 2.0
**Updated:** 2025-12-11
**Purpose:** Documentation for agent routing architecture

---

## Overview

The Intelligence Adjacent framework uses a **specialized agent architecture** where base Claude Code handles simple operations and specialized agents handle domain-specific work.

---

## Current Architecture

```
User Request
     ↓
[Base Claude] ← Handles simple operations (file ops, git, navigation)
     ↓
[Domain Analysis] ← Matches request to specialized domain
     ↓
[Specialized Agent] ← security | engineer | developer | writer | advisor | legal
     ↓
[Expert Execution] ← Agent loads skills and executes workflow
```

### Specialized Agents

1. **security** - Security assessment (pentesting, vulnerability scanning, threat modeling)
2. **developer** - Code review, architecture review, secure coding, code quality assessment
3. **engineer** - Infrastructure implementation (remediation, hardening, deployment)
4. **writer** - Content creation (blog posts, technical docs, security reports)
5. **advisor** - Personal development, OSINT research, QA review
6. **legal** - Legal compliance with mandatory citation verification

**Invocation:** `Task(subagent_type="agent-name", prompt="...")`

---

## Routing Logic

### When Base Claude Handles Directly

**Simple Operations:**
- File reads: "read CLAUDE.md"
- Git status: "git status"
- Directory listings: "ls skills/"
- Simple searches: "find files with TODO"
- Documentation: "update README.md"

### When Base Claude Delegates to Agents

**Security Work → security agent:**
- Penetration testing
- Vulnerability scanning and assessment
- Compliance validation (CIS, STIG, OWASP)
- Threat intelligence gathering

**Code Review & Architecture → developer agent:**
- Code review (security + quality + performance + maintainability)
- Architecture review (design patterns + scalability + threat modeling)
- Secure coding assessment (language-specific, framework-specific)
- Code generation quality validation

**Infrastructure Implementation → engineer agent:**
- Security remediation and hardening
- VPS/cloud infrastructure deployment
- Configuration and infrastructure-as-code
- Systems integration and orchestration
- Security fix implementation (always plan mode + rollback)

**Content Creation → writer agent:**
- Blog posts
- Technical documentation
- Security reports
- Newsletter generation

**Advisory/Research → advisor agent:**
- Career development (job applications, resume review, interview prep)
- OSINT research
- QA review (blog posts, documentation, code)
- Personal coaching (CliftonStrengths-based)
- ISO compliance assessments (machinery, information security, etc.)

**ISO Compliance → advisor agent (delegated skills):**
- **`/iso-machinery`** - Machinery safety assessments (ISO 12100/13849)
  - Assessment: Gap analysis, risk findings, roadmap
  - Implementation: Delegates to engineer agent for remediation
  - Validation: Post-implementation compliance verification
- **`/iso-lifecycle`** - Multi-standard compliance orchestration
  - Coordinates multiple ISO standards simultaneously
  - Detects control overlaps (efficiency gains)
  - Sequences implementation across standards
  - Manages certification timelines

**Naming Convention (NIST-aligned):**
- Commands: Short, action-oriented (e.g., `/iso-machinery`, `/iso-lifecycle`)
- Skills: Long, domain-focused (e.g., `iso-machinery-safety`, `iso-lifecycle`)
- Multiple commands can route to one skill for flexibility
- See ISO Family Expansion Guidelines in CONTRIBUTING.md for adding new standards

**Legal Compliance → legal agent:**
- GDPR, CCPA, privacy compliance
- Risk assessments
- Jurisdictional research
- Policy review
- **Always with mandatory citation verification**

---

## Task Delegation Best Practices

### Critical Rule: Explicit Task Intent

**Lesson Learned (2026-02-16):** When delegating to specialized agents, **always state the task type explicitly** at the start of the prompt. Agents may reject work if they perceive domain mismatch.

#### ❌ BAD: Ambiguous Task Description
```
Task(subagent_type="engineer", prompt="""
Enrich ISO/IEC 42001:2023 controls with AIUC-1 methodology.
Add compliance documentation fields...
""")
```
**Problem:** "Compliance documentation" sounds like legal/advisory work. Agent rejects.

#### ✅ GOOD: Explicit Task Type First
```
Task(subagent_type="engineer", prompt="""
**TASK TYPE: TECHNICAL IMPLEMENTATION DOCUMENTATION**

You are enriching technical implementation guidance for ISO 42001 controls.
This is the SAME work you've done for PCI DSS controls (agents a432a4e, a59e3f6...).

**WHAT YOU'RE DOING:**
Adding technical fields to control definitions:
- implementation_steps: Step-by-step technical procedures
- tools_and_approaches: Software, platforms, technical methods
- test_scenarios: Technical validation procedures

**WHAT YOU'RE NOT DOING:**
- Legal compliance interpretation
- Regulatory analysis
- Policy writing

[...rest of clear instructions...]
""")
```
**Result:** Agent understands domain and executes successfully.

### Task Prompt Template

**Use this structure for ALL agent delegations:**

```markdown
**TASK TYPE: [PRIMARY CATEGORY]**

[1-2 sentence description of what this task actually is]

**WHAT YOU'RE DOING:**
- [Specific action 1]
- [Specific action 2]
- [Specific action 3]

**WHAT YOU'RE NOT DOING:**
- [Common misconception 1]
- [Common misconception 2]

**CONTEXT:**
[Any historical context showing this is routine/similar to past work]

**INPUT/OUTPUT:**
- Source: [files to read]
- Target: [files to modify]

**FIELD STRUCTURE:**
[Exact structure with examples]

**QUALITY TARGET:**
[Expected output metrics]

This is [domain] work. Proceed.
```

### Domain Classification Guide

**Technical Implementation Documentation** (engineer agent):
- Implementation steps, procedures, configurations
- Tools and software (vendors, platforms, versions)
- Test scenarios, validation procedures
- Gap indicators, observable failures
- Maturity models, capability progression

**Compliance Analysis** (legal/advisor agents):
- Regulatory interpretation
- Jurisdictional requirements
- Policy creation/review
- Risk assessment frameworks
- Citation verification

**Content Creation** (writer agent):
- Blog posts, articles
- Marketing content
- User-facing documentation
- Narrative reports

**Security Assessment** (security agent):
- Penetration testing
- Vulnerability analysis
- Threat modeling

**Code Review & Architecture** (developer agent):
- Code review (security + quality + performance)
- Architecture review and design quality
- Secure coding per language/framework
- Code generation validation

### Verification Checklist

Before delegating to an agent, verify:
- [ ] Task type explicitly stated at top of prompt
- [ ] "WHAT YOU'RE DOING" section clarifies domain
- [ ] "WHAT YOU'RE NOT DOING" prevents confusion
- [ ] Context provided if similar to past successful work
- [ ] Input/output files clearly specified
- [ ] Expected structure/format shown with examples
- [ ] Quality metrics defined

**Remember:** The issue is never "which agent" - it's "how clear is the prompt."

---

## Enforcement Mechanisms

### 1. Agent Prompts (Primary Enforcement)

**Location:** `agents/*.md` files

**Method:** Each agent has MANDATORY sections defining:
- QA review requirements (writer: rating ≥4 before publishing)
- File organization rules (FILE-LOCATION-STANDARDS.md)
- Session state protocols
- Workflow phase requirements

**Advantage:** Self-enforcing through agent identity and memory

### 2. Pre-Commit Hooks (Git-Level Enforcement)

**Location:** `.git/hooks/pre-commit`

**Enforces:**
- Agent format validation (150-line limit)
- Credential scanning (blocks hardcoded API keys)

**Status:** ✅ Active and working (when migrated)

### 3. Documentation Standards

**Location:** `docs/*.md` files

**Standards:**
- FILE-LOCATION-STANDARDS.md (where files belong)
- session-checkpoint-enforcement.md (multi-session protocol)
- CREDENTIAL-HANDLING-ENFORCEMENT.md (credential management)

**Advantage:** Clear reference documentation, agent memory enforces compliance

---

## Quality Maintenance

**Quality maintained through:**
- Clear agent instructions (MANDATORY sections in agent.md files)
- Skill workflow definitions (sequential phases defined in SKILL.md)
- Documentation standards (FILE-LOCATION-STANDARDS, session protocol)
- Agent invocation rules (proper delegation to specialized agents)
- Pre-commit validation (format checks, credential scanning)

**See:** `docs/session-checkpoint-enforcement.md` for session protocol

---

## Historical Note

**Previous Architecture (v1.0 - Nov 2025):**
- Included director agent as mandatory routing layer
- mandatory-director-router.ts hook enforced director usage
- Layer 0 enforcement with keyword patterns
- All complex requests forced through director first

**Rationale for Change:**
- Director agent was redundant orchestration layer
- Base Claude can analyze domains and route directly
- Simplified architecture is more maintainable
- Reduced cognitive overhead for users
- Same quality enforcement through agent prompts and documentation

---

## Related Documentation

- **Agent Files:** `agents/security.md`, `agents/developer.md`, `agents/writer.md`, `agents/advisor.md`, `agents/legal.md`
- **Skill Registry:** `skills/*/SKILL.md` files
- **Tool Catalog:** `docs/catalogs/tool-catalog.md`
- **CLAUDE.md:** Section "Agent Invocation Rules"

---

**Version:** 2.1 (Added developer agent for code review and architecture)
**Last Updated:** 2025-12-11
**Framework:** Intelligence Adjacent (IA)
