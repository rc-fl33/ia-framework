# Professional Security Test Execution

**For: Security Agents executing TEST-PLAN.md in Phase 5 (Exploitation)**

---

## Core Principles

1. **Follow TEST-PLAN.md exactly** — Each test case is a numbered checklist with exact commands
2. **Execute steps sequentially** — Step 1 → Step 2 → Step 3... in order
3. **Capture evidence at every step** — Save all outputs to `05-exploitation/evidence/`
4. **Update TEST-PLAN.md in real-time** — Show progress without token overhead
5. **Respect rate limits** — Throttle requests to avoid DoS or detection
6. **Use parallel execution** — Spawn background agents for parallel-safe TCs

---

## TEST-PLAN.md Format

Each test case has this structure:

```markdown
### TC-001: [Vulnerability Name]

**Tool:** [curl/sqlmap/nuclei/etc]
**Execution:** [VPS or local]
**Parallel-Safe:** [yes/no]
**Rate-Limit:** [N req/sec]
**Dependencies:** [TC-XXX if sequential]

**Step 1:** [Description]
```bash
[exact command to run]
```
Result: [what to look for]

**Step 2:** [Next step]
...

**Status:** ⏳ Pending → ✅ Complete - [Finding ID or "No Finding"]
```

---

## Execution Workflow

### For Each Test Case:

**1. Read TC from TEST-PLAN.md**
- Identify all steps (Step 1, Step 2, etc.)
- Note rate-limit and parallel-safe flags
- Check dependencies

**2. Execute Step 1**
```bash
# Run exact command from TEST-PLAN.md
# Show output to user
# Analyze for vulnerabilities
```

**3. Save Evidence**
```bash
# Save to: 05-exploitation/evidence/tc-XXX-step1-[descriptor].txt
# Include full stdout + stderr
```

**4. Execute Step 2, 3, etc. (sequentially)**
- Each step builds on previous
- Save evidence after each step

**5. Analyze Results**
- Did we find a vulnerability?
- Is response unexpected?
- Do we have confirmation?

**6. Create Finding (if vulnerable)**
```bash
# Create: ./05-exploitation/findings/FINDING-NNN.json
# Create: ./05-exploitation/findings/FINDING-NNN.md
# Run: bun run tools/code-review/poc-generator.ts
# Update: session.json with finding
```

**7. Update TEST-PLAN.md Status**
```markdown
**Status:** ✅ Complete - FINDING-NNN
```
or
```markdown
**Status:** ✅ Complete - No Finding
```

**8. Move to Next Test Case**
- Return to Step 1 for TC-002
- Repeat

---

## Rate Limiting

**Before each request:**

```bash
# Get rate limit from TC metadata
RATE_LIMIT=2  # req/sec from TC

# Wait between requests
sleep $(echo "scale=2; 1.0 / $RATE_LIMIT" | bc)

# Execute request
curl -s "https://target.com/endpoint"
```

**For parallel TCs:**
- Each agent independently respects its rate limit
- Do NOT coordinate across agents
- Set conservative limits (2 req/sec maximum)

---

## Parallel Execution Strategy

### Identify Batches

**Read TEST-PLAN.md and group TCs:**

```
Batch 1 - Parallel Safe (no dependencies):
  TC-016 (GraphQL introspection) - parallel-safe: yes
  TC-029 (Subdomain enum) - parallel-safe: yes
  TC-030 (Security headers) - parallel-safe: yes
  → Can run concurrently

Batch 2 - Sequential (with dependencies):
  TC-001 → TC-002 → TC-003 (IDOR tests)
  → Must run one at a time
  → Reason: TC-002 requires TC-001 auth token
```

### Spawn Background Agents

```typescript
// For each TC in parallel batch:
Task(
  subagent_type="security",
  prompt="Execute TC-016 step-by-step from TEST-PLAN.md...",
  run_in_background=true
)

Task(
  subagent_type="security",
  prompt="Execute TC-029 step-by-step from TEST-PLAN.md...",
  run_in_background=true
)

Task(
  subagent_type="security",
  prompt="Execute TC-030 step-by-step from TEST-PLAN.md...",
  run_in_background=true
)

// Wait for all background tasks to complete
// Check TEST-PLAN.md for ✅ Complete status on all three
// Proceed to Batch 2
```

---

## Evidence Capture

### Standard Format

```
tc-XXX-stepN-[descriptor].txt
├── Command executed
├── Full HTTP request (if applicable)
├── Full response (stdout + stderr)
├── Analysis of response
└── Vulnerability confirmed? YES/NO
```

### For Each Test Step, save:

```bash
# Capture both stdout and stderr
ssh $VPS_HOST "docker exec kali-pentest [command]" \
  > ./05-exploitation/evidence/tc-XXX-stepN.txt 2>&1

# Verify file created and has content
wc -l 05-exploitation/evidence/tc-XXX-stepN.txt
```

### If Vulnerable:

```bash
# Create findings directory if needed
mkdir -p ./05-exploitation/findings

# Create structured JSON for PoC generator
cat > ./05-exploitation/findings/FINDING-001.json << 'EOF'
{
  "id": "FINDING-001",
  "type": "sql-injection",
  "severity": "critical",
  "target": "https://api.target.com/search",
  "parameter": "q",
  "payload": "' OR 1=1--",
  "evidence_file": "../evidence/tc-XXX-stepN.txt"
}
EOF

# Create markdown finding
cat > ./05-exploitation/findings/FINDING-001.md << 'EOF'
# FINDING-001: SQL Injection in Search

## Severity: CRITICAL

## Description
[Full description]

## Evidence
See: ../evidence/tc-XXX-stepN.txt

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
EOF

# Generate PoC
bun run tools/code-review/poc-generator.ts \
  --finding-file ./05-exploitation/findings/FINDING-001.json \
  --engagement-dir .

# Record in session
bun run tools/pentest/session-manager.ts \
  --dir . --action record-finding \
  --finding-id FINDING-001 --severity critical
```

---

## TEST-PLAN.md Real-Time Status Updates

**User sees live progress without token overhead:**

Before execution:
```markdown
| TC-001 | SQL injection | ... | ⏳ Pending |
| TC-002 | XSS in search | ... | ⏳ Pending |
| TC-003 | Auth bypass   | ... | ⏳ Pending |
```

After TC-001 completes:
```markdown
| TC-001 | SQL injection | ... | ✅ Complete - FINDING-001 |
| TC-002 | XSS in search | ... | ⏳ Pending |
| TC-003 | Auth bypass   | ... | ⏳ Pending |
```

User can check TEST-PLAN.md anytime to see status.

---

## Stuck Mode - Get Research Ideas

**When a test case fails or finds no vulnerability:**

Instead of giving up:

```bash
# Use model-router.ts to research alternatives
bun run tools/api/model-router.ts \
  --query-type stuck-mode \
  --task "SQL injection tests failed on parameter 'q'. What alternatives?" \
  --tech-stack "Next.js 14 + PostgreSQL" \
  --engagement-dir .

# Get suggestions for:
# 1. Different SQL injection variants
# 2. Alternative parameters to test
# 3. Bypass techniques
# 4. Similar vulnerabilities to try
```

**Then update TEST-PLAN.md with new test ideas:**

```markdown
### TC-001-VARIANT-A: SQL Injection - Time-based Blind

**Suggested by:** Stuck mode research
**Research:** Testing time-based delays instead of error-based

**Step 1:** [New approach based on research]
```

---

## VPS Execution Pattern

**ALL security tools run on VPS, NEVER locally:**

```bash
# Load VPS config
source .env
VPS_CMD="ssh -i $VPS_SSH_KEY -p $VPS_PORT $VPS_USER@$VPS_HOST"

# Execute test from VPS container
$VPS_CMD "docker exec kali-pentest [tool] [arguments]" \
  > ./05-exploitation/evidence/tc-XXX-stepN.txt 2>&1

# Verify success
$VPS_CMD "docker exec kali-pentest bash -c 'test -f /tmp/evidence.txt && echo OK'"
```

---

## Phase Advancement Gate

**Can only advance Phase 5→6 when:**

1. ✅ All TC status marked (✅ Complete or ⏸️ Skipped)
2. ✅ Evidence files ≥ completed TC count
3. ✅ All findings documented in 05-exploitation/findings/
4. ✅ session.json updated with all finding IDs

**Check evidence:**

```bash
# Count completed TCs in TEST-PLAN.md
COMPLETED=$(grep -c "✅ Complete" TEST-PLAN.md)

# Count evidence files
EVIDENCE=$(ls -1 ./05-exploitation/evidence/tc-* 2>/dev/null | wc -l)

# Must match or exceed
if [ $EVIDENCE -ge $COMPLETED ]; then
  echo "✅ Evidence gate PASSED"
else
  echo "❌ Evidence gate FAILED: $EVIDENCE files < $COMPLETED completed TCs"
fi
```

---

## Example: Executing TC-001

**Read TEST-PLAN.md:**
```markdown
### TC-001: Staff Permission Escalation

**Tool:** curl
**Execution:** VPS (kali-pentest container)
**Parallel-Safe:** No (requires specific staff account setup)
**Rate-Limit:** 1 req/sec

**Step 1:** Load limited staff access token
```bash
STAFF_TOKEN=$(cat 01-pre-engagement/credentials.env | grep STAFF_LIMITED_TOKEN | cut -d= -f2)
```

**Step 2:** Attempt unauthorized orders API access
```bash
ssh $VPS_HOST "docker exec kali-pentest curl -v \
  -H 'X-Shopify-Access-Token: $STAFF_TOKEN' \
  https://store.myshopify.com/admin/api/2025-01/orders.json" \
  > ./05-exploitation/evidence/tc-001-step2-response.txt 2>&1
```

**Step 3:** Analyze response
```bash
grep "HTTP/" 05-exploitation/evidence/tc-001-step2-response.txt
```
- If `403 Forbidden`: ✅ PASS (access control working)
- If `200 OK` with orders: ❌ **VULNERABILITY FOUND**
```

**Execution:**

1. Show user: "Executing TC-001: Staff Permission Escalation"
2. Run Step 1 (load token)
3. Show: "Token loaded: [partial token]***"
4. Run Step 2 (curl request)
5. Show: "Response saved: 2,145 bytes"
6. Run Step 3 (analyze)
7. Show: "HTTP/1.1 200 OK - **VULNERABILITY FOUND**"
8. Create FINDING-001.json and FINDING-001.md
9. Update TEST-PLAN.md: "**Status:** ✅ Complete - FINDING-001"
10. Move to TC-002

---

**This keeps execution professional, traceable, and evidence-based.**
