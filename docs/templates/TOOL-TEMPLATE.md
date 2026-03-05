---
name: tool-name
type: api-client|validation|utility|infrastructure
classification: public|private
description: One-line description of what this tool does
version: 1.0
last_updated: YYYY-MM-DD
env_required: true|false
env_keys:
  - API_KEY_NAME  # If env_required: true
commands:
  - /command-name  # If tool provides user-facing commands
---

> **FOR AI AGENTS:** Brief description of tool capability and when to use it.
> Load when: [specific triggers or use cases]

---

# Tool Name

**One-line purpose statement**

Brief description of what this tool provides and its primary use case.

---

## Classification

**Type:** [api-client|validation|utility|infrastructure]
**Visibility:** [public|private]
**Commands:** [List of user-facing commands, or "None - programmatic only"]

---

## Purpose

Detailed explanation of:
- What this tool does
- Why it exists
- How it fits into the framework
- Primary use cases

---

## Usage

### Programmatic API

```typescript
import { functionName } from '@/tools/[category]/[tool-name]/client';

// Example usage
const result = await functionName(params);
```

### Command-Line Usage (if applicable)

```bash
bun tools/[category]/[tool-name]/[script].ts [flags]
```

---

## Configuration

### Environment Variables (if env_required: true)

```bash
# Required
API_KEY_NAME=value  # Description of what this key is for

# Optional
OPTIONAL_KEY=value  # Description
```

**Setup:**
1. Obtain API key from [source]
2. Add to `.env`
3. Verify: `echo $API_KEY_NAME`

---

## API Reference

### Public Functions

#### `functionName(params)`

**Purpose:** What this function does

**Parameters:**
- `param1` (type): Description
- `param2` (type, optional): Description

**Returns:** Return type and description

**Example:**
```typescript
const result = await functionName({
  param1: 'value',
  param2: 'optional-value'
});
```

---

## Architecture

```
[High-level architecture diagram or flow]
```

**Key components:**
- Component 1: Description
- Component 2: Description

---

## Dependencies

**Runtime:**
- Package 1: Purpose
- Package 2: Purpose

**Dev:**
- Package 3: Purpose

---

## Testing

```bash
bun test tools/[category]/[tool-name]/__tests__/
```

---

## Troubleshooting

### Common Issue 1

**Symptom:** Error message or behavior

**Cause:** Why this happens

**Fix:** How to resolve

---

## Related Tools

- Tool 1: How it relates
- Tool 2: How it relates

---

## Version History

- **1.0** (YYYY-MM-DD): Initial release

---

**Framework:** Intelligence Adjacent (IA)
**Maintainer:** Framework Team
