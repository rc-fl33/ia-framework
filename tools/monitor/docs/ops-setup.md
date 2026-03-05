# Phase: SETUP (Dependency Verification)

**Maps to Universal Phase:** PREPARE

**Purpose:** Verify dependencies are installed and environment is ready

**Success Criteria Mutation:** VERIFY dependencies and PREPARE environment

---

## Gate Question

> "Are all dependencies installed and configured?"

**Pass Criteria:**
- [ ] Bun runtime available
- [ ] Node modules installed
- [ ] Port 4000 available
- [ ] Required files exist

---

## What Happens

### Step 1: Check Runtime

```bash
# Verify Bun is installed
bun --version
```

### Step 2: Check Dependencies

```bash
# Install if missing
cd tools/monitor/scripts && bun install
```

### Step 3: Check Port Availability

```bash
# Check if port 4000 is available
lsof -i :4747 || echo "Port available"
```

### Step 4: Verify Files

Required files:
- `scripts/server.ts`
- `scripts/manage.sh`
- `client/index.html`

---

## Exit Criteria

- [ ] Bun runtime verified
- [ ] Dependencies installed
- [ ] Port 4000 available
- [ ] All required files present
- [ ] Ready for Phase 2: Start

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Bun not installed | Guide user to install Bun |
| Dependencies missing | Run `bun install` automatically |
| Port in use | Identify process, offer to stop or use different port |
| Files missing | Report missing files, cannot proceed |
