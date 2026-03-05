# code-review

Security-focused code review skill. Use `/code-review` to identify vulnerabilities against
OWASP Top 10 and CWE Top 25.

## Quick Start

```
/code-review
/code-review /path/to/project/src/
/code-review /path/to/project/, Company: Acme Corp, URL: https://acme.com
/code-review /path/to/api/ Focus: injection, authentication, HIPAA compliance
```

## What it does

- Language auto-detection (detect-language.ts)
- OWASP Top 10 and CWE Top 25 vulnerability scanning
- Automated CVE research for detected frameworks (NVD)
- P0-P3 prioritized remediation guide with code examples
- Professional deliverables (FINDINGS, REMEDIATION-GUIDE, FULL-REPORT)

## Workflow

Delegates to the developer agent using the standalone 5-phase pipeline at `skills/code-review/phases/`.
Utility scripts in `tools/code-review/` support PoC generation and coverage analysis.

## Output

`private/output/code-review/{project}-{YYYY-MM-DD}/`

## Related

- `/sec-review` — Architecture-level security review with STRIDE/PASTA and optional
  security practices and patch management assessment
- `/advisory` — Quick security guidance
- `/vuln-scan` — Runtime vulnerability scanning
- `/pentest` — Active penetration testing
