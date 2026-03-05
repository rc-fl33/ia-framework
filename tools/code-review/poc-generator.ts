#!/usr/bin/env bun
/**
 * poc-generator.ts - Automated Proof of Concept generator for security findings.
 * Generates exploit scripts (curl, Python) from confirmed vulnerability findings.
 * Usage: bun run poc-generator.ts --finding-file <path> --engagement-dir <path>
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";

/** Template for a vulnerability class with placeholder slots */
interface PoCTemplate {
  name: string;
  description: string;
  steps: string[];
  curlTemplate: string;
  pythonTemplate: string;
  expectedVulnerable: string;
  expectedSecure: string;
}

/** Generated PoC with target-specific values filled in */
interface PoCOutput {
  findingId: string;
  vulnClass: string;
  target: string;
  severity: string;
  curl: string;
  python: string;
  steps: string[];
  description: string;
  expectedVulnerable: string;
  expectedSecure: string;
  generatedAt: string;
}

/** Input finding data */
interface VulnerabilityFinding {
  id: string;
  type: "injection" | "xss" | "auth-bypass" | "idor" | "ssrf";
  target: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  evidence: string;
  parameters: Record<string, string>;
}

// -- Template Registry -------------------------------------------------------

const TEMPLATES: Record<string, PoCTemplate> = {
  injection: {
    name: "SQL Injection",
    description: "SQL injection via unsanitized user input in {{parameter}}.",
    steps: [
      "Identify injectable parameter: {{parameter}}",
      "Send payload: {{payload}}",
      "Observe database error or data leakage in response",
      "Confirm with time-based blind: {{payload}} (sleep variant)",
    ],
    curlTemplate: `curl -sk -X POST '{{target}}' \\
  -H 'Content-Type: application/x-www-form-urlencoded' \\
  -d '{{parameter}}={{payload}}'
# sqlmap: sqlmap -u '{{target}}' --data='{{parameter}}=test' -p '{{parameter}}' --batch`,
    pythonTemplate: `import requests
url = "{{target}}"
data = {"{{parameter}}": "{{payload}}"}
resp = requests.post(url, data=data, verify=False)
print(f"Status: {resp.status_code}")
print(resp.text[:500])`,
    expectedVulnerable: "Database error, unexpected data disclosure, or time delay",
    expectedSecure: "Input rejected, parameterized query returns normal response",
  },
  xss: {
    name: "Reflected Cross-Site Scripting",
    description: "Reflected XSS via unescaped output of {{parameter}}.",
    steps: [
      "Inject XSS payload into parameter: {{parameter}}",
      "Payload: {{payload}}",
      "Observe script execution or unescaped reflection in response body",
    ],
    curlTemplate: `curl -sk '{{target}}?{{parameter}}={{payload}}' | grep -i '<script'
# Browser: {{target}}?{{parameter}}={{payload}}`,
    pythonTemplate: `import requests
url = "{{target}}"
params = {"{{parameter}}": "{{payload}}"}
resp = requests.get(url, params=params, verify=False)
if "{{payload}}" in resp.text:
    print("[VULNERABLE] Payload reflected without encoding")
else:
    print("[SAFE] Payload was encoded or stripped")`,
    expectedVulnerable: "Payload reflected unencoded in response body",
    expectedSecure: "Payload HTML-encoded or stripped from response",
  },
  "auth-bypass": {
    name: "Authentication Bypass",
    description: "Authentication bypass via manipulated token or session in {{parameter}}.",
    steps: [
      "Capture valid authentication token",
      "Modify token: {{token}}",
      "Replay request to {{target}} with manipulated token",
      "Observe access to protected resource without valid credentials",
    ],
    curlTemplate: `curl -sk '{{target}}' -H 'Authorization: Bearer {{token}}'
# Without token (should fail): curl -sk '{{target}}'`,
    pythonTemplate: `import requests
url = "{{target}}"
headers = {"Authorization": f"Bearer {{token}}"}
resp = requests.get(url, headers=headers, verify=False)
print(f"Status: {resp.status_code}")
if resp.status_code == 200:
    print("[VULNERABLE] Access granted with manipulated token")
else:
    print("[SAFE] Access denied")`,
    expectedVulnerable: "HTTP 200 with protected resource data",
    expectedSecure: "HTTP 401/403 with access denied",
  },
  idor: {
    name: "Insecure Direct Object Reference",
    description: "IDOR allowing access to other users' resources by modifying {{parameter}}.",
    steps: [
      "Authenticate as User A",
      "Identify resource ID in parameter: {{parameter}}",
      "Replace with another user's resource ID: {{payload}}",
      "Observe unauthorized access to User B's data at {{target}}",
    ],
    curlTemplate: `# Own resource (baseline):
curl -sk '{{target}}' -H 'Authorization: Bearer {{token}}'
# Swapped ID:
curl -sk '{{target}}/{{payload}}' -H 'Authorization: Bearer {{token}}'`,
    pythonTemplate: `import requests
base, headers = "{{target}}", {"Authorization": "Bearer {{token}}"}
own = requests.get(base, headers=headers, verify=False)
other = requests.get(f"{base}/{{payload}}", headers=headers, verify=False)
print(f"Own: {own.status_code}, Other: {other.status_code}")
if other.status_code == 200:
    print("[VULNERABLE] Accessed another user's resource")`,
    expectedVulnerable: "HTTP 200 with another user's data",
    expectedSecure: "HTTP 403/404 when accessing other user's resource",
  },
  ssrf: {
    name: "Server-Side Request Forgery",
    description: "SSRF via {{parameter}} allowing internal network requests.",
    steps: [
      "Set up listener: interactsh or Burp Collaborator",
      "Inject internal URL into {{parameter}}: {{payload}}",
      "Send request to {{target}}",
      "Verify callback received on listener confirming server-side fetch",
    ],
    curlTemplate: `curl -sk -X POST '{{target}}' \\
  -H 'Content-Type: application/json' \\
  -d '{"{{parameter}}": "{{payload}}"}'
# Verify: interactsh-client -v`,
    pythonTemplate: `import requests
url = "{{target}}"
data = {"{{parameter}}": "{{payload}}"}
resp = requests.post(url, json=data, verify=False)
print(f"Status: {resp.status_code}")
print(f"Body: {resp.text[:500]}")
# Check interactsh/collaborator for callback`,
    expectedVulnerable: "Callback received on listener or internal data returned",
    expectedSecure: "URL blocked by allowlist, no outbound request made",
  },
};

// -- Core Class --------------------------------------------------------------

/** Generates, validates, and exports PoCs from vulnerability findings. */
class PoCGenerator {
  private engagementDir: string;

  constructor(engagementDir: string) {
    this.engagementDir = resolve(engagementDir);
  }

  /** Fill template placeholders with finding-specific values */
  private fill(text: string, finding: VulnerabilityFinding): string {
    return text
      .replace(/\{\{target\}\}/g, finding.target)
      .replace(/\{\{parameter\}\}/g, finding.parameters.parameter ?? "param")
      .replace(/\{\{payload\}\}/g, finding.parameters.payload ?? "")
      .replace(/\{\{token\}\}/g, finding.parameters.token ?? "");
  }

  /** Generate a PoC from a vulnerability finding by filling the matching template */
  generatePoC(finding: VulnerabilityFinding): PoCOutput {
    const tpl = TEMPLATES[finding.type];
    if (!tpl) throw new Error(`No template for vulnerability class: ${finding.type}`);
    return {
      findingId: finding.id,
      vulnClass: finding.type,
      target: finding.target,
      severity: finding.severity,
      curl: this.fill(tpl.curlTemplate, finding),
      python: this.fill(tpl.pythonTemplate, finding),
      steps: tpl.steps.map((s) => this.fill(s, finding)),
      description: this.fill(tpl.description, finding),
      expectedVulnerable: tpl.expectedVulnerable,
      expectedSecure: tpl.expectedSecure,
      generatedAt: new Date().toISOString(),
    };
  }

  /** Return a bash command that re-executes the PoC curl for validation */
  validatePoC(poc: PoCOutput): { valid: boolean; command: string } {
    const line = poc.curl.split("\n").find((l) => l.trimStart().startsWith("curl"));
    return { valid: !!line, command: line?.trim() ?? 'echo "No curl command found"' };
  }

  /** Render the PoC in the specified output format */
  exportPoC(poc: PoCOutput, format: "curl" | "python" | "markdown"): string {
    if (format === "curl") return poc.curl;
    if (format === "python") return poc.python;
    const name = TEMPLATES[poc.vulnClass]?.name ?? poc.vulnClass;
    return `# PoC: ${name}

**Finding:** ${poc.findingId}
**Target:** ${poc.target}
**Severity:** ${poc.severity.toUpperCase()}
**Generated:** ${poc.generatedAt}

## Description

${poc.description}

## Reproduction Steps

${poc.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

## Curl PoC

\`\`\`bash
${poc.curl}
\`\`\`

## Python PoC

\`\`\`python
${poc.python}
\`\`\`

## Expected Results

| Condition | Response |
|-----------|----------|
| Vulnerable | ${poc.expectedVulnerable} |
| Secure | ${poc.expectedSecure} |
`;
  }

  /** Write the PoC markdown to the engagement directory */
  writePoCFile(poc: PoCOutput): string {
    const dir = join(this.engagementDir, "05-exploitation", "proof-of-concept");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const filePath = join(dir, `POC-${poc.findingId}.md`);
    writeFileSync(filePath, this.exportPoC(poc, "markdown"), "utf-8");
    return filePath;
  }
}

// -- CLI Entry Point ---------------------------------------------------------

function main(): void {
  const args = process.argv.slice(2);
  const findingFileIdx = args.indexOf("--finding-file");
  const engagementDirIdx = args.indexOf("--engagement-dir");

  if (findingFileIdx === -1 || engagementDirIdx === -1) {
    console.error("Usage: bun run poc-generator.ts --finding-file <path> --engagement-dir <path>");
    process.exit(1);
  }

  const findingFile = resolve(args[findingFileIdx + 1]);
  const engagementDir = resolve(args[engagementDirIdx + 1]);

  if (!existsSync(findingFile)) {
    console.error(`Finding file not found: ${findingFile}`);
    process.exit(1);
  }

  const finding: VulnerabilityFinding = JSON.parse(readFileSync(findingFile, "utf-8"));
  const generator = new PoCGenerator(engagementDir);
  const poc = generator.generatePoC(finding);
  const outPath = generator.writePoCFile(poc);
  const validation = generator.validatePoC(poc);

  console.log(`PoC generated: ${outPath}`);
  console.log(`Validation command:\n  ${validation.command}`);
}

main();
