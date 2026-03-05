# Policy-to-Framework Mappings

This directory contains mappings between security/compliance policies and framework requirements.

## Purpose

Help organizations understand which policies are required by which frameworks, enabling:
1. Policy portfolio planning
2. Multi-framework policy generation
3. Gap analysis (policy coverage)

## Files

**matrix.yaml** - Structured mapping of policies to frameworks (YAML format)
**requirements.md** - Narrative guidance and policy descriptions

**See also:** `docs/framework-mapping.md` - Comprehensive policy-framework matrix with detailed citations

## Structure

Each policy maps to multiple frameworks with requirement levels:

```yaml
policies:
  - policy_id: access_management
    title: "Access Management Policy"
    frameworks:
      nist-csf:
        status: required
        controls: ["PR.AA-01", "PR.AA-04"]
      iso-27001:
        status: required
        controls: ["A.5.15", "A.8.2", "A.8.3"]
```

## Requirement Levels

- **required:** Framework explicitly mandates this policy
- **recommended:** Framework strongly implies or recommends
- **optional:** Framework mentions but doesn't require

## Agent Workflow Pattern

**Policy generation for multiple frameworks:**

1. User requests policies for HIPAA + SOC 2
2. Agent loads `matrix.yaml`
3. Identifies policies required by both frameworks
4. Generates policies from templates (generic or framework-specific)
5. Tags each policy with satisfying frameworks

**Gap analysis:**

1. Organization has existing policies: A, B, C
2. Target framework requires: A, B, C, D, E
3. Gap = {D, E} (missing policies)
4. Agent generates only D and E

---

**Version:** 1.0
**Last Updated:** 2026-02-14
**Maintained By:** Compliance Skill
