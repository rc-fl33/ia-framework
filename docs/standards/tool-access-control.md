---
audience: advanced
category: security
---


# Tool Access Control

**Security Framework: CLAWDBOT Hardening Recommendation #8**

Restrict MCP/framework tools to minimum needed per skill/agent.

---

## Problem

By default, all agents have access to all tools (Read, Write, Edit, Bash, WebFetch, etc.). This violates the principle of least privilege:

- A blog writing agent doesn't need Bash access
- A research agent doesn't need Write access to critical files
- Security testing agents need elevated tools, but should be restricted from modifying framework code

**Risk:** Compromised agent or prompt injection could abuse elevated tool access.

---

## Solution: Tool Allowlists

Each skill/agent declares which tools it needs. Framework enforces restrictions.

---

## Implementation Design

### 1. Tool Allowlist Declaration (in SKILL.md)

```yaml
---
name: risk-analyzer
agent: engineer
tools:
  allowed:
    - Read
    - Write
    - Edit
    - Bash  # Only for this agent
  blocked:
    - WebFetch  # Use approved APIs only
  restrictions:
    - pattern: "^~/ia-framework/hooks/"
      reason: "Cannot modify framework hooks"
---
```

### 2. Agent-Level Defaults

**Base defaults by agent:**

```typescript
const AGENT_TOOL_DEFAULTS = {
  writer: {
    allowed: ['Read', 'Write', 'Edit', 'WebFetch', 'WebSearch'],
    blocked: ['Bash'], // Writers don't need shell access
  },
  security: {
    allowed: ['Read', 'Bash', 'WebFetch', 'Task'],
    blocked: ['Write', 'Edit'], // Read-only for security scans
  },
  engineer: {
    allowed: ['Read', 'Write', 'Edit', 'Bash', 'Task'],
    blocked: ['WebFetch'], // Use approved APIs
  },
  advisor: {
    allowed: ['Read', 'WebFetch', 'WebSearch'],
    blocked: ['Write', 'Edit', 'Bash'], // Research only
  },
  legal: {
    allowed: ['Read', 'WebFetch'],
    blocked: ['Write', 'Edit', 'Bash'], // Read-only
  }
};
```

### 3. Enforcement Hook

**Pre-tool-use hook checks allowlist:**

```typescript
// hooks/tool-access-control.ts
import { validateToolAccess } from './validators/tool-access';

export async function preToolUse(context: {
  tool: string;
  agent: string;
  skill: string;
}): Promise<{ allowed: boolean; reason?: string }> {
  const allowlist = getToolAllowlist(context.agent, context.skill);

  if (!allowlist.includes(context.tool)) {
    return {
      allowed: false,
      reason: `Tool ${context.tool} not in allowlist for ${context.agent}/${context.skill}`
    };
  }

  // Check path restrictions (if Write/Edit)
  if (['Write', 'Edit'].includes(context.tool)) {
    const pathCheck = await validatePathRestrictions(context);
    if (!pathCheck.allowed) {
      return pathCheck;
    }
  }

  return { allowed: true };
}
```

---

## Migration Strategy

### Phase 1: Audit (Non-Breaking)

Track which tools each skill/agent actually uses:

```bash
# Generate tool usage report
bun tools/framework/security/audit-tool-usage.ts

# Output:
# writer/ghost: Read (47), Write (12), WebFetch (3)
# security/pentest: Read (15), Bash (8), Task (2)
```

### Phase 2: Declare Allowlists (Non-Breaking)

Add `tools:` section to all SKILL.md files. No enforcement yet.

### Phase 3: Enforce (Breaking - Opt-In)

Add hook to enforce allowlists. Enable per-skill with flag:

```yaml
tools:
  allowed: [Read, Write]
  enforce: true  # Opt-in enforcement
```

### Phase 4: Default Enforcement

After testing, make enforcement default. Skills must declare allowlists.

---

## Path Restrictions

Prevent agents from modifying critical framework files:

```yaml
tools:
  path_restrictions:
    - pattern: "^~/ia-framework/hooks/"
      access: read-only
      reason: "Framework hooks are security-critical"

    - pattern: "^~/ia-framework/agents/"
      access: read-only
      reason: "Agent definitions should not be modified by agents"

    - pattern: "^~/ia-framework/\.env$"
      access: blocked
      reason: "Credentials file - no agent access"

    - pattern: "^~/ia-framework/tools/api/"
      access: read-only
      reason: "API clients should not be modified by agents"
```

---

## Testing

### Unit Tests

```typescript
// hooks/__tests__/tool-access-control.test.ts
describe('Tool Access Control', () => {
  test('blocks Bash for writer agent', () => {
    const result = validateToolAccess({
      tool: 'Bash',
      agent: 'writer',
      skill: 'ghost'
    });
    expect(result.allowed).toBe(false);
  });

  test('allows Read for all agents', () => {
    for (const agent of ['writer', 'security', 'engineer']) {
      const result = validateToolAccess({
        tool: 'Read',
        agent,
        skill: 'test'
      });
      expect(result.allowed).toBe(true);
    }
  });

  test('blocks Write to hooks directory', () => {
    const result = validateToolAccess({
      tool: 'Write',
      agent: 'engineer',
      skill: 'test',
      path: '~/ia-framework/hooks/pre-commit.ts'
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('security-critical');
  });
});
```

---

## Benefits

1. **Least Privilege:** Agents only get tools they need
2. **Blast Radius:** Compromised agent has limited tool access
3. **Audit Trail:** Know which agent used which tool when
4. **Defense in Depth:** Multiple layers (tool allowlist + path restrictions + command validation)

---

## Trade-offs

**Pros:**
- Significant security improvement
- Clear audit trail
- Prevents accidental misuse

**Cons:**
- More configuration overhead
- Could break existing skills during migration
- Requires testing each skill's tool usage

---

## Recommendation

**Implement in phases:**
1. ✅ Document design (this file)
2. ⏳ Audit current tool usage (generate report)
3. ⏳ Add allowlists to SKILL.md files (non-breaking)
4. ⏳ Implement enforcement hook (opt-in)
5. ⏳ Test with 2-3 skills
6. ⏳ Roll out to all skills
7. ⏳ Make enforcement default

Start with high-risk agents (security, engineer) and expand.

---

## Related Documentation

- `hooks/bash-command-validator.ts` - Command-level validation
- `tools/validation/` - Content validation and security checks
- `docs/standards/credential-handling-enforcement.md` - Credential security
- CLAWDBOT Security Hardening Guide - Original recommendations

---

**Status:** Design complete, implementation pending
**Priority:** Medium (start with audit phase)
**Effort:** Standard (2-3 days for full implementation)
