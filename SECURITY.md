# Security Policy

**Intelligence Adjacent (IA) Framework**

The IA Framework is designed with security best practices for AI-assisted development.

---

## For Users

### Credential Management

- **Never commit credentials** — Use `.env` files for API keys and secrets
- The framework includes pre-commit hooks that scan for accidental credential commits
- Always use environment variables, never hardcode secrets in source files

### Private Data

- The framework supports a `private/` directory for user-specific content
- This directory is excluded from version control by default
- Review `.gitignore` to understand what's tracked

### Pre-Commit Validation

The framework includes automated security checks that run before each commit:
- Credential detection (API keys, tokens, passwords)
- File path validation
- Structure compliance checks

---

## For Contributors

### Reporting Vulnerabilities

If you find a security issue in this framework:

1. **Do NOT** open a public GitHub issue
2. Email the maintainer directly
3. Include detailed steps to reproduce
4. Allow time for remediation before disclosure

### Security Standards

The framework embeds security testing knowledge through:
- OWASP guidelines
- PTES (Penetration Testing Execution Standard)
- NIST security controls

---

## Framework Security Features

| Feature | Description |
|---------|-------------|
| Credential Scanning | Prevents accidental secret commits |
| Privacy-First | Telemetry disabled by default |
| Input Validation | Sanitizes user-provided data |
| Agent Limits | Prevents context overflow |

---

## Questions?

For security-related questions, open an issue with `[Security]` in the title.
