---
domain: infrastructure
tool: model-ranker
agent: none
model: haiku
mode: single-command
complexity: low
---

# /model-ranker - Privacy-Safe Model Rankings

## IDENTITY

**Agent:** None (base Claude orchestrator handles this)

**Command-specific role:** Execute model ranking refresh or status check operations using the
ZDR Model Ranker tool. Display results to user.

**Additional constraints:** Must use Bash tool for all shell commands. Never execute bash
directly. Verify OPENROUTER_API_KEY exists before refresh operations.

---

## INPUT CONTRACT

**Receives:**
- Optional flags: `--top N`, `--status`, `--profile <name>`, `--quiet`
- User intent: refresh rankings, check status, show top models

**Prerequisites:**
- `OPENROUTER_API_KEY` environment variable set (for refresh operations)
- `ARTIFICIAL_ANALYSIS_API_KEY` optional (degrades gracefully without it)
- `tools/model-ranker/scripts/refresh.ts` script exists

**Source:** User command line input

---

## OBJECTIVE

**Goal:** Provide easy access to ZDR model rankings without requiring users to remember bash
commands or tool paths.

**Success criteria:**
- User sees current model rankings or cache status
- Results displayed in readable format
- Cache refreshed if requested
- Appropriate profile applied if specified

**Failure criteria:**
- Direct bash execution instead of Bash tool → Fix before proceeding
- Missing OPENROUTER_API_KEY without clear error message → Display setup instructions
- Tool errors not caught and displayed to user → Always catch and explain

---

## METHODOLOGY

This is a **thin wrapper command** around the existing model-ranker tool. The tool handles all
logic; this command provides:

1. **Framework integration** - Uses Bash tool instead of direct execution
2. **Error handling** - Catches and explains tool errors
3. **User-friendly output** - Formats results for readability
4. **Environment validation** - Checks required credentials before execution

**Do NOT re-implement tool logic in this command.** Just call the tool via Bash and present
results.

---

## EXECUTION

### Step 1: Parse User Intent

Determine operation from user request:

| User Request | Operation | Flags |
|--------------|-----------|-------|
| "/model-ranker" | Full refresh | (none - shows top 15 default) |
| "/model-ranker --top 5" | Full refresh | `--top 5` |
| "/model-ranker --status" | Status check only | `--status` |
| "/model-ranker --profile batch-scanning" | Full refresh | `--profile batch-scanning` |
| "/model-ranker --quiet" | Full refresh | `--quiet` (cron mode) |

**Common patterns:**
- No flags → Full refresh + show top 15 models
- `--status` → No refresh, just cache check
- `--top N` → Refresh + show top N models
- `--profile <name>` → Use specific weight profile
- `--quiet` → Suppress verbose output (cron mode)

### Step 2: Validate Environment (Refresh Operations Only)

**If operation is refresh (not --status only):**

Check for required credentials:

```typescript
// Pseudo-code - implement with Bash tool
const hasOpenRouterKey = process.env.OPENROUTER_API_KEY !== undefined;

if (!hasOpenRouterKey) {
  console.error('Error: Missing OPENROUTER_API_KEY');
  console.error('\nSetup instructions:');
  console.error('1. Obtain API key from https://openrouter.ai');
  console.error('2. Add to .env: OPENROUTER_API_KEY=[insert your key here]');
  console.error('3. Source: source .env');
  console.error('4. Verify: echo $OPENROUTER_API_KEY');
  process.exit(1);
}
```

**Implementation:** Use Bash tool to check environment variable:

```bash
# Via Bash tool
if [ -z "$OPENROUTER_API_KEY" ]; then
  echo "Error: Missing OPENROUTER_API_KEY"
  echo ""
  echo "Setup instructions:"
  echo "1. Obtain API key from https://openrouter.ai"
  echo "2. Add to .env: OPENROUTER_API_KEY=[insert your key here]"
  echo "3. Source: source .env"
  echo "4. Verify: echo \$OPENROUTER_API_KEY"
  exit 1
fi
```

**If --status only:** Skip credential check (status reads local cache, no API calls)

### Step 3: Execute Model Ranker Tool

**Use the Bash tool to execute the refresh script:**

```bash
# Build command with user-provided flags
bun tools/model-ranker/scripts/refresh.ts [flags]
```

**Flag mapping:**
- User: `/model-ranker` → Bash: `bun tools/model-ranker/scripts/refresh.ts` (default top 15)
- User: `/model-ranker --top 10` → Bash: `bun tools/model-ranker/scripts/refresh.ts --top 10`
- User: `/model-ranker --status` → Bash: `bun tools/model-ranker/scripts/refresh.ts --status`
- User: `/model-ranker --profile batch-scanning` → Bash: `bun tools/model-ranker/scripts/refresh.ts
  --profile batch-scanning`

**CRITICAL:** Use the framework's Bash tool for execution:

```typescript
// Correct - uses Bash tool
Bash({
  command: 'bun tools/model-ranker/scripts/refresh.ts --top 10',
  description: 'Refresh ZDR model rankings and show top 10'
});

// WRONG - direct execution
execSync('bun tools/model-ranker/scripts/refresh.ts');  // ❌ Never do this
```

### Step 4: Display Results

**The tool outputs to stdout.** Present results to user directly:

```
Fetching data from all sources...

ZDR Model Rankings
────────────────────────────────────────────────────────────
Generated:  2026-02-13T10:30:00.000Z
Expires:    2026-02-20T10:30:00.000Z
Version:    1.0

Sources:
  [+] openrouter-zdr           128 models
  [+] openrouter-models        450 models
  [+] artificial-analysis      45 models
  [+] lmarena                  120 models

Filters:
  ZDR required:     true
  Blocked prefixes: deepseek/, qwen/, mistralai/, 01-ai/, alibaba/
  Exclude Claude:   true
  Before filter:    450 models
  After filter:     42 models

Top 10 Models (profile: security-interactive):
──────────────────────────────────────────────────────────────────────────────────────────────────
   1. google/gemini-pro-1.5                      score:  89.5%  cost:   $2.50/M  ctx:  128k  data: 100%
   2. openai/gpt-4-turbo                         score:  87.2%  cost:   $10.0/M  ctx:  128k  data: 100%
   3. anthropic/claude-3-opus-20240229           score:  86.1%  cost:   $15.0/M  ctx:  200k  data: 100%
   [...]

Cache written to: tools/model-ranker/scripts/cache/zdr-rankings.json
Total eligible models: 42
```

**For --status operations:**

```
Cache: fresh
Generated: 2026-02-13T10:30:00.000Z
Expires:   2026-02-20T10:30:00.000Z
Models:    42
```

**On errors:**

```
Error: Failed to fetch from OpenRouter ZDR endpoint
Reason: Invalid API key (401 Unauthorized)

Check your OPENROUTER_API_KEY and try again.
```

### Step 5: Provide Next Steps (Optional)

After successful refresh, optionally provide guidance:

```
✓ Rankings refreshed successfully

Next steps:
- View full rankings: cat tools/model-ranker/scripts/cache/zdr-rankings.json
- Use different profile: /model-ranker --profile batch-scanning
- Check cache status: /model-ranker --status
- Integrate with code: import { getTopModels } from '@/tools/model-ranker/scripts/client'
```

---

## OUTPUT CONTRACT

**Produces:**
- Updated cache file: `tools/model-ranker/scripts/cache/zdr-rankings.json` (if refresh)
- Console output: Top N models with scores and metadata
- Exit code: 0 (success) or 1 (error)

**Format:** Terminal output from refresh.ts script (pass-through)

---

## NEXT

**On success:** Command complete. User has current rankings or status information.

**On failure:** Display error message with setup/troubleshooting guidance.

**Follow-up suggestions:**
- If cache is stale → Suggest running refresh
- If missing credentials → Display setup instructions
- If specific profile needed → Suggest `--profile <name>` flag

---

## EXAMPLES

### Example 1: Full Refresh (Default)

**User:** `/model-ranker`

**Execution:**

```bash
# Via Bash tool
bun tools/model-ranker/scripts/refresh.ts
```

**Output:** Full refresh with top 15 models displayed

---

### Example 2: Show Top 5

**User:** `/model-ranker --top 5`

**Execution:**

```bash
# Via Bash tool
bun tools/model-ranker/scripts/refresh.ts --top 5
```

**Output:** Refresh + top 5 models only

---

### Example 3: Check Status

**User:** `/model-ranker --status`

**Execution:**

```bash
# Via Bash tool
bun tools/model-ranker/scripts/refresh.ts --status
```

**Output:**
```
Cache: fresh
Generated: 2026-02-13T10:30:00.000Z
Expires:   2026-02-20T10:30:00.000Z
Models:    42
```

---

### Example 4: Batch Scanning Profile

**User:** `/model-ranker --profile batch-scanning`

**Execution:**

```bash
# Via Bash tool
bun tools/model-ranker/scripts/refresh.ts --profile batch-scanning
```

**Output:** Refresh with batch-scanning weight profile applied

---

### Example 5: Cron Mode

**User:** `/model-ranker --quiet`

**Execution:**

```bash
# Via Bash tool
bun tools/model-ranker/scripts/refresh.ts --quiet
```

**Output:** No verbose output, errors only (suitable for cron jobs)

---

## ERROR HANDLING

### Missing OPENROUTER_API_KEY

**Detection:** Check environment variable before execution (non-status operations)

**Response:**
```
Error: Missing OPENROUTER_API_KEY

Setup instructions:
1. Obtain API key from https://openrouter.ai
2. Add to .env: OPENROUTER_API_KEY=[insert your key here]
3. Source: source .env
4. Verify: echo $OPENROUTER_API_KEY

See: private/docs/env-setup.md for complete setup guide
```

### Stale Cache

**Detection:** Tool returns exit code 1 on --status with stale cache

**Response:**
```
Cache: STALE
Generated: 2026-02-06T10:30:00.000Z
Expires:   2026-02-13T10:30:00.000Z
Models:    42

Run '/model-ranker' to refresh.
```

### API Errors

**Detection:** Tool fails during fetch operations

**Response:** Pass through tool's error message + suggest troubleshooting steps

```
Error: Failed to fetch from OpenRouter ZDR endpoint
Reason: [error from tool]

Troubleshooting:
1. Check OPENROUTER_API_KEY is valid
2. Verify network connectivity
3. Check OpenRouter API status: https://status.openrouter.ai
4. Try again in a few minutes
```

### Invalid Profile

**Detection:** Tool returns error for unknown profile name

**Response:**
```
Error: Unknown profile 'invalid-name'

Valid profiles:
- security-interactive (default)
- batch-scanning
- deep-analysis

Usage: /model-ranker --profile security-interactive
```

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Used Bash tool for script execution (never direct bash)
- [ ] Validated credentials before refresh operations
- [ ] Displayed tool output to user
- [ ] Provided clear error messages if tool failed
- [ ] User knows next steps (if applicable)

**Error recovery:**
- If missing credentials: Display setup instructions, do not proceed
- If tool fails: Show error message + troubleshooting steps
- If cache stale: Suggest running refresh

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
