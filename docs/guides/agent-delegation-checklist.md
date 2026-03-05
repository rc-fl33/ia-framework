---
type: documentation
title: Agent Delegation Checklist
classification: public
version: 1.0
last_updated: 2026-02-16
audience: base-claude
category: orchestration
---

# Agent Delegation Checklist

**Purpose:** Prevent domain confusion when delegating tasks to specialized agents

**Key Principle:** The issue is never "which agent" - it's "how clear is the prompt"

---

## Pre-Delegation Checklist

Before calling `Task(subagent_type="...", prompt="...")`, verify:

### ✅ 1. Task Type Stated Explicitly
- [ ] First line starts with: `**TASK TYPE: [CATEGORY]**`
- [ ] Category is clear and unambiguous
- [ ] Examples: TECHNICAL IMPLEMENTATION DOCUMENTATION, SECURITY ASSESSMENT, CONTENT CREATION

### ✅ 2. What You're Doing Section
- [ ] 3-5 bullet points of specific actions
- [ ] Uses concrete verbs (adding, extracting, configuring, testing)
- [ ] Describes the actual work, not the domain

### ✅ 3. What You're NOT Doing Section
- [ ] Lists common misconceptions
- [ ] Clarifies domain boundaries
- [ ] Prevents agent rejection

### ✅ 4. Historical Context (if applicable)
- [ ] References similar successful work
- [ ] Cites agent IDs if relevant
- [ ] Shows this is routine/established pattern

### ✅ 5. Input/Output Clarity
- [ ] Source files with absolute paths
- [ ] Target files with absolute paths
- [ ] Expected file modifications described

### ✅ 6. Structure Examples
- [ ] Shows exact YAML/format structure
- [ ] Includes realistic examples
- [ ] Demonstrates expected output

### ✅ 7. Quality Metrics
- [ ] Quantifiable targets (line counts, field counts)
- [ ] Reference to quality standards (AIUC-1, etc.)
- [ ] Comparison to known-good examples

### ✅ 8. Closing Affirmation
- [ ] Ends with: "This is [domain] work. Proceed."
- [ ] Reinforces domain classification
- [ ] Gives explicit permission

---

## Prompt Template

```markdown
**TASK TYPE: [PRIMARY CATEGORY]**

[1-2 sentence description of what this task actually is]

**WHAT YOU'RE DOING:**
- [Specific action 1 with concrete verb]
- [Specific action 2 with concrete verb]
- [Specific action 3 with concrete verb]

**WHAT YOU'RE NOT DOING:**
- [Common misconception 1]
- [Common misconception 2]
- [Common misconception 3]

**CONTEXT:**
[If similar to past work, reference it here with agent IDs]

**INPUT/OUTPUT:**
- Source: [absolute path to input file(s)]
- Target: [absolute path to output file(s)]
- Action: [what modification you're making]

**STRUCTURE/FORMAT:**
[Show exact structure with code blocks and examples]

```yaml
example:
  field1: "value"
  field2: "value"
```

**QUALITY TARGET:**
- [Metric 1: e.g., ~10K lines per item]
- [Metric 2: e.g., all 12 field groups]
- [Reference: e.g., same quality as PCI DSS controls]

This is [domain] work, not [what it's not]. Proceed.
```

---

## Domain Classification Reference

### Technical Implementation Documentation
**Agent:** engineer
**Keywords:** implementation, procedures, configuration, tools, validation, testing
**Examples:**
- Adding implementation_steps to compliance controls
- Documenting tools_and_approaches with vendor examples
- Creating test_scenarios with validation procedures
- Defining maturity_levels for technical capabilities

### Security Assessment
**Agent:** security
**Keywords:** testing, scanning, vulnerabilities, threats, exploits
**Examples:**
- Penetration testing
- Code review for security flaws
- Threat modeling
- Vulnerability scanning

### Content Creation
**Agent:** writer
**Keywords:** blog, article, documentation, narrative, report
**Examples:**
- Blog posts
- Technical documentation
- User guides
- Marketing content

### Advisory/Research
**Agent:** advisor
**Keywords:** research, analysis, recommendations, coaching
**Examples:**
- Career development
- OSINT research
- QA review
- Personal coaching

### Legal/Compliance Analysis
**Agent:** legal
**Keywords:** regulatory, interpretation, jurisdiction, policy, citation
**Examples:**
- GDPR compliance analysis
- Jurisdictional research
- Policy creation
- Risk assessment frameworks

---

## Common Failure Patterns

### ❌ Pattern 1: Ambiguous Domain
```
Task(subagent_type="engineer", prompt="""
Enrich compliance documentation for ISO controls.
Add regulatory fields and compliance mappings.
""")
```
**Problem:** "Compliance documentation" + "regulatory" sounds like legal work
**Fix:** State "TECHNICAL IMPLEMENTATION DOCUMENTATION" first

### ❌ Pattern 2: Missing Context
```
Task(subagent_type="engineer", prompt="""
Add fields to controls.yaml for PCI DSS.
""")
```
**Problem:** No context on what type of fields or what this work is
**Fix:** Show structure, reference similar completed work

### ❌ Pattern 3: Vague Instructions
```
Task(subagent_type="engineer", prompt="""
Improve the ISO 42001 controls file.
Make it more complete.
""")
```
**Problem:** "Improve" and "complete" are subjective
**Fix:** Specific actions, measurable targets, explicit structure

---

## Real-World Example: Success vs Failure

### ❌ Failed Attempt (agent rejected)
```python
Task(
    subagent_type="engineer",
    description="Enrich ISO 42001 controls",
    prompt="""
    Enrich ISO/IEC 42001:2023 controls with AIUC-1 methodology.
    Add compliance documentation enrichment fields...
    """
)
# Result: Agent rejected as "compliance documentation = legal work"
```

### ✅ Successful Attempt (same agent, clearer prompt)
```python
Task(
    subagent_type="engineer",
    description="Enrich ISO 42001 controls",
    prompt="""
    **TASK TYPE: TECHNICAL IMPLEMENTATION DOCUMENTATION**

    You are enriching technical implementation guidance for ISO 42001 controls.
    This is the SAME work you've done for PCI DSS controls all session
    (agents a432a4e, a59e3f6, a903ee9... all completed successfully).

    **WHAT YOU'RE DOING:**
    - Adding implementation_steps: Step-by-step technical procedures
    - Adding tools_and_approaches: Software, platforms, configurations
    - Adding test_scenarios: Technical validation procedures
    - Adding gap_examples: Observable technical failures

    **WHAT YOU'RE NOT DOING:**
    - Legal compliance interpretation
    - Regulatory analysis
    - Policy writing

    **INPUT/OUTPUT:**
    - Source: /path/to/controls.yaml (39 baseline controls)
    - Target: Same file (add 12 field groups to each)

    **STRUCTURE:**
    [shows exact YAML structure with examples]

    **QUALITY:** ~10K lines per control, same as PCI DSS

    This is technical documentation work. Proceed.
    """
)
# Result: Success - agent understood domain and executed
```

---

## Verification Before Send

**Quick Check (5 seconds):**
1. Does first line say `**TASK TYPE: [CLEAR CATEGORY]**`?
2. Can I see "WHAT YOU'RE DOING" and "WHAT YOU'RE NOT DOING"?
3. Are paths absolute and structure shown?
4. Does it end with "[domain] work. Proceed."?

If all YES → Send
If any NO → Revise prompt

---

**Remember:** Agents are domain experts. They WILL execute if they understand:
1. What type of work this is
2. What specific actions to take
3. What the output should look like

The clarity of delegation determines success.

---

**Version:** 1.0
**Last Updated:** 2026-02-16
**Framework:** Intelligence Adjacent (IA)
**Related:** agent-routing-architecture.md
