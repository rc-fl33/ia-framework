# Monitor Dashboard Security Review
**Date**: 2026-01-17
**Reviewer**: Security Analysis (Automated)
**Scope**: Monitor dashboard with terminal integration

## Executive Summary

**OVERALL RISK LEVEL: 🔴 CRITICAL**

The monitor dashboard has **7 significant vulnerabilities** requiring immediate attention. The most critical issues are:
1. Network exposure without authentication (CVSS 10.0)
2. Unrestricted shell access via WebSocket (CVSS 10.0)
3. Path traversal allowing access to sensitive files (CVSS 8.6)

**Recommendation**: Do NOT expose this tool to any network. Use only on localhost with remediations applied.

---

## Vulnerability Details

### 🔴 CRITICAL-001: Network Exposure Without Authentication

**File**: `scripts/types.ts:137`
**Severity**: CVSS 10.0 (Critical)
**CWE**: CWE-306 (Missing Authentication)

**Vulnerable Code**:
```typescript
export const DEFAULT_CONFIG: ServerConfig = {
  port: 4000,
  host: '0.0.0.0',  // ← Binds to ALL network interfaces
```

**Attack Vector**:
- Attacker on same network can access dashboard
- No username/password required
- No token/session validation
- Direct access to terminal and filesystem

**Proof of Concept**:
```bash
# From any machine on network:
curl http://<victim-ip>:4000/api/files
wscat -c ws://<victim-ip>:4000/stream
```

**Impact**: Complete system compromise

**Remediation**:
```typescript
export const DEFAULT_CONFIG: ServerConfig = {
  port: 4000,
  host: '127.0.0.1',  // ✓ Localhost only
```

---

### 🔴 CRITICAL-002: Unrestricted Shell Access

**File**: `scripts/server.ts:621-686`
**Severity**: CVSS 10.0 (Critical)
**CWE**: CWE-78 (OS Command Injection)

**Vulnerable Code**:
```typescript
function initTerminalSession(ws: any): void {
  // No authentication check!
  const shell = Bun.spawn(['bash', '-i'], {
    stdin: 'pipe',
    stdout: 'pipe',
    stderr: 'pipe',
```

**Attack Vector**:
1. Connect to WebSocket endpoint
2. Send `{"type": "terminal_init"}`
3. Receive full bash shell
4. Execute arbitrary commands

**Impact**:
- Read/write any file
- Install malware
- Exfiltrate credentials
- Pivot to other systems

**Remediation Options**:
1. **Remove terminal feature** (if not needed)
2. **Add authentication** (token-based)
3. **Restrict to localhost only** (network layer)
4. **Implement command whitelist** (partial mitigation)

---

### 🔴 CRITICAL-003: Path Traversal Vulnerability

**File**: `scripts/server.ts:58-76`
**Severity**: CVSS 8.6 (High)
**CWE**: CWE-22 (Path Traversal)

**Vulnerable Code**:
```typescript
function isPathAllowedRead(path: string): boolean {
  const normalized = path.replace(/^\//, '');  // Only strips leading /

  // Check allowed paths
  for (const allowed of ALLOWED_READ_PATHS) {
    if (normalized === allowed || normalized.startsWith(allowed + '/')) {
      return true;  // ← Vulnerable!
    }
  }
```

**Attack Vector**:
```bash
# Request: /api/file?path=sessions/../../.env
# normalized = "sessions/../../.env"
# Passes check: startsWith("sessions/")
# join(claudeDir, "sessions/../../.env") = claudeDir + "/.env"
# Result: .env file exposed!
```

**Proof of Concept**:
```javascript
fetch('/api/file?path=sessions/../../../etc/passwd')
fetch('/api/file?path=skills/../.env')
```

**Impact**: Access to:
- `.env` (credentials)
- `.git` (source code history)
- `~/.ssh` (SSH keys)
- Any file on system

**Remediation**:
```typescript
function isPathAllowedRead(path: string): boolean {
  const normalized = path.replace(/^\//, '');

  // Resolve absolute path
  const fullPath = join(config.claudeDir, normalized);
  const resolvedPath = resolve(fullPath);

  // Ensure path is still within claudeDir
  if (!resolvedPath.startsWith(config.claudeDir)) {
    return false;
  }

  // Check blocked paths
  for (const blocked of BLOCKED_PATHS) {
    const blockedPath = join(config.claudeDir, blocked);
    if (resolvedPath.startsWith(blockedPath)) {
      return false;
    }
  }

  // Check allowed paths
  for (const allowed of ALLOWED_READ_PATHS) {
    const allowedPath = join(config.claudeDir, allowed);
    if (resolvedPath === allowedPath || resolvedPath.startsWith(allowedPath + '/')) {
      return true;
    }
  }

  return false;
}
```

---

### 🟡 HIGH-001: CORS Wildcard

**File**: `scripts/server.ts:300`
**Severity**: CVSS 7.5 (High)
**CWE**: CWE-942 (Overly Permissive CORS)

**Vulnerable Code**:
```typescript
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',  // ← Any origin can access
```

**Attack Vector**:
- Malicious website embeds dashboard API calls
- User visits malicious site while dashboard is running
- Site exfiltrates files, session data, etc.

**Remediation**:
```typescript
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'http://localhost:4747',  // ✓ Same-origin only
```

---

### 🟡 HIGH-002: No Rate Limiting

**File**: `scripts/server.ts` (entire server)
**Severity**: CVSS 7.5 (High)
**CWE**: CWE-770 (Uncontrolled Resource Allocation)

**Vulnerable Areas**:
- File read/write endpoints
- WebSocket connections
- Terminal session spawning
- Event log queries

**Attack Vector**:
```bash
# Spawn 1000 terminal sessions
for i in {1..1000}; do
  wscat -c ws://localhost:4747/stream &
done

# Read large files repeatedly
while true; do
  curl http://localhost:4747/api/file?path=sessions/large-file.md
done
```

**Impact**:
- Server crash (OOM)
- Disk space exhaustion
- CPU saturation

**Remediation**:
- Limit WebSocket connections per IP (e.g., 3 max)
- Limit terminal sessions (1 per client)
- Rate limit API requests (10 req/sec per IP)
- Implement request timeouts

---

### 🟡 MEDIUM-001: Session Management

**File**: `scripts/server.ts:40`
**Severity**: CVSS 5.3 (Medium)
**CWE**: CWE-400 (Uncontrolled Resource Consumption)

**Issue**: No limit on terminal sessions per WebSocket client

**Current Code**:
```typescript
const terminalSessions = new Map<any, any>();

function initTerminalSession(ws: any): void {
  // No check if session already exists!
  const shell = Bun.spawn(['bash', '-i'], {
```

**Attack Vector**:
```javascript
// Single client spawns multiple shells
ws.send(JSON.stringify({type: 'terminal_init'}));
ws.send(JSON.stringify({type: 'terminal_init'}));
ws.send(JSON.stringify({type: 'terminal_init'}));
// Result: 3 bash processes, only 1 tracked
```

**Remediation**:
```typescript
function initTerminalSession(ws: any): void {
  // Prevent multiple sessions per client
  if (terminalSessions.has(ws)) {
    ws.send(JSON.stringify({
      type: 'terminal_error',
      error: 'Terminal session already active'
    }));
    return;
  }

  const shell = Bun.spawn(['bash', '-i'], {
```

---

### 🟡 MEDIUM-002: Information Disclosure

**File**: `scripts/server.ts:628-632`
**Severity**: CVSS 6.5 (Medium)
**CWE**: CWE-200 (Information Exposure)

**Vulnerable Code**:
```typescript
const shell = Bun.spawn(['bash', '-i'], {
  env: {
    ...process.env,  // ← Exposes ALL environment variables
    TERM: 'xterm-256color',
```

**Impact**: Terminal user can access:
- `API_KEY`, `SECRET_KEY`, etc.
- `DATABASE_URL`
- `AWS_ACCESS_KEY_ID`
- Any credentials in environment

**Commands**:
```bash
env | grep -i key
env | grep -i secret
env | grep -i password
printenv
```

**Remediation**:
```typescript
// Whitelist safe environment variables
const safeEnv = {
  TERM: 'xterm-256color',
  PATH: process.env.PATH,
  HOME: process.env.HOME,
  USER: process.env.USER,
  SHELL: '/bin/bash',
  PS1: '\\[\\033[1;32m\\]\\u@\\h\\[\\033[0m\\]:\\[\\033[1;34m\\]\\w\\[\\033[0m\\]$ ',
};

const shell = Bun.spawn(['bash', '-i'], {
  env: safeEnv,  // ✓ Only safe vars
```

---

## Additional Security Concerns

### XSS in Terminal Output
**Status**: ✅ MITIGATED
xterm.js properly escapes terminal output, preventing XSS through ANSI escape codes.

### WebSocket Origin Validation
**Status**: ⚠️ MISSING
No origin checking on WebSocket upgrade.

**Remediation**:
```typescript
fetch(req, server) {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path === '/stream') {
    // Validate origin
    const origin = req.headers.get('origin');
    if (origin && origin !== 'http://localhost:4747') {
      return new Response('Forbidden', { status: 403 });
    }

    const upgraded = server.upgrade(req);
```

### File Write Validation
**Status**: ⚠️ PARTIAL
Path validation exists but has traversal vulnerability (see CRITICAL-003)

### HTTPS/TLS
**Status**: ❌ NOT IMPLEMENTED
All traffic is plaintext, including terminal commands and credentials.

**Recommendation**: For localhost-only use, HTTP is acceptable. For network access, require HTTPS.

---

## Remediation Priority

### Immediate (Block Production Use)
1. ✅ Change `host: '0.0.0.0'` → `host: '127.0.0.1'`
2. ✅ Fix path traversal validation
3. ✅ Add terminal session limit per client
4. ✅ Filter environment variables in terminal

### Short Term (Before Network Exposure)
5. Add authentication (token-based or basic auth)
6. Implement rate limiting
7. Add WebSocket origin validation
8. Restrict CORS to same-origin

### Long Term (Production Hardening)
9. Add HTTPS/TLS support
10. Implement audit logging
11. Add session timeouts
12. Implement CSP headers
13. Add input sanitization on file writes

---

## Security Checklist

- [ ] Server binds to 127.0.0.1 only
- [ ] Path traversal protection with canonicalization
- [ ] Terminal sessions limited to 1 per client
- [ ] Environment variables filtered
- [ ] CORS restricted to same-origin
- [ ] Rate limiting on API endpoints
- [ ] WebSocket origin validation
- [ ] Authentication mechanism (if network-exposed)
- [ ] Audit logging enabled
- [ ] HTTPS/TLS configured (if network-exposed)

---

## Testing Recommendations

### Automated Security Testing
```bash
# Path traversal tests
curl "http://localhost:4747/api/file?path=sessions/../../.env"
curl "http://localhost:4747/api/file?path=skills/../.env"

# CORS tests
curl -H "Origin: https://evil.com" http://localhost:4747/api/health

# Rate limit tests
for i in {1..1000}; do curl http://localhost:4747/api/files & done

# Session spawn tests
wscat -c ws://localhost:4747/stream
> {"type":"terminal_init"}
> {"type":"terminal_init"}
> {"type":"terminal_init"}
```

### Manual Penetration Testing
1. Verify localhost-only binding: `nmap -p 4000 <external-ip>`
2. Test path traversal: Attempt to read `/etc/passwd`, `.env`, `.git/config`
3. Test DoS: Spawn multiple WebSocket connections
4. Test info disclosure: Check `env` output in terminal
5. Test XSS: Upload files with `<script>` tags

---

## Conclusion

The monitor dashboard is a **powerful development tool** but requires significant security hardening before any network exposure. The current implementation is **safe for localhost-only use** provided the recommended fixes are applied.

**Do NOT expose to network without**:
- Authentication
- HTTPS/TLS
- All critical vulnerabilities fixed
- Penetration testing completed

---

**Review Status**: DRAFT
**Next Review**: After remediation implementation
**Sign-off Required**: Security Lead, Development Lead
