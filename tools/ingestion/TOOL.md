---
name: ingestion
type: utility
classification: public
description: GitHub repository ingestion engine - framework definitions, standards, educational resources via gitingest CLI
version: 2.0.0
last_updated: 2026-02-14
env_required: false
env_keys: []
commands:
  - bun tools/ingestion/framework-ingester.ts
  - bun tools/bug-bounty/ingest-frameworks.ts --list
  - bun tools/standards/ingest-frameworks.ts --all
  - bun skills/mentorship/scripts/ingest-resources.ts --resource oscp-prep
related_tools:
  - gitingest
  - tools/markdown
  - skills/security
  - standards
  - skills/mentorship
---

# Framework Ingestion Engine

**Type:** Utility
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

---

## Classification

**PUBLIC** - Reusable GitHub repository ingestion system.

**Why Public:**
- Generic ingestion patterns (gitingest wrapper, metadata generation)
- No proprietary logic - CLI orchestration and file management
- Useful for framework contributors and skill developers
- Configuration-driven design makes it extensible

---

## Purpose

Reusable ingestion system for GitHub repositories containing security frameworks, compliance standards, and educational resources. Consolidates framework definitions into YAML configuration files and provides a shared engine for all skills.

**Core Capabilities:**
- **GitHub ingestion**: Fetch repositories via gitingest CLI
- **Metadata generation**: Timestamps, categories, descriptions
- **Configuration-driven**: YAML-based framework definitions
- **Multi-skill support**: Security, compliance, mentorship
- **Batch operations**: Ingest single or all frameworks
- **Directory management**: Automatic output directory creation

**Use Cases:**
- **Security skill**: Ingest OWASP Top 10, MITRE ATT&CK, NIST standards
- **Compliance skill**: Fetch NIST OSCAL, CIS Benchmarks, ISO frameworks
- **Mentorship skill**: Download certification prep, roadmaps, learning collections
- **Framework updates**: Re-ingest to get latest versions
- **Custom skills**: Extend with new YAML configurations

---

## Usage

### List Available Frameworks

**Security frameworks:**
```bash
bun run tools/bug-bounty/ingest-frameworks.ts --list

# Output:
# Available frameworks:
#
# owasp-top10-web
#   Name: OWASP Top 10 - Web Applications
#   Repository: https://github.com/OWASP/Top10
#   Output: reference/github/owasp/top10-web
#   Description: OWASP Top 10 Web Application Security Risks
#   Category: advisory
#
# owasp-top10-api
#   Name: OWASP Top 10 - API
#   Repository: https://github.com/OWASP/API-Security
#   ...
```

**Compliance frameworks:**
```bash
bun run tools/standards/ingest-frameworks.ts --list

# Lists 24 compliance frameworks:
# - NIST OSCAL, SP 800-53, SP 800-171, CSF
# - CIS Controls & Benchmarks
# - FedRAMP baselines
# - ISO 27001/27002
# - PCI DSS, HIPAA, GDPR, SOC 2
```

**Learning resources:**
```bash
bun run skills/mentorship/scripts/ingest-resources.ts --list

# Lists 6 learning resources:
# - OSCP/CEH/CISSP prep
# - Cybersecurity/DevOps roadmaps
# - Awesome Security collections
```

---

### Ingest Single Framework

**Security framework:**
```bash
bun run tools/bug-bounty/ingest-frameworks.ts --framework owasp-top10-web

# Output:
# Ingesting OWASP Top 10 - Web Applications...
# Repository: https://github.com/OWASP/Top10
# Output: reference/github/owasp/top10-web
# Running gitingest...
# [gitingest output...]
# ✓ Successfully ingested OWASP Top 10 - Web Applications
#   Output: skills/pentest/reference/github/owasp/top10-web/owasp-top10-web.txt
#   Metadata: skills/pentest/reference/github/owasp/top10-web/metadata.json
```

**Compliance framework:**
```bash
bun run tools/standards/ingest-frameworks.ts --framework nist-oscal

# Fetches NIST OSCAL repository
# Generates standards/frameworks/nist/reference/github/oscal/nist-oscal.txt
```

**Learning resource:**
```bash
bun run skills/mentorship/scripts/ingest-resources.ts --resource oscp-prep

# Fetches OSCP preparation repository
# Generates skills/mentorship/docs/github/oscp-preparation/oscp-prep.txt
```

---

### Ingest All Frameworks

**All security frameworks (25 total):**
```bash
bun run tools/bug-bounty/ingest-frameworks.ts --all

# Ingests all 25 frameworks:
# - OWASP Top 10 variants (Web, API, Mobile, IoT, LLM, CI/CD)
# - OWASP Testing & Assessment (ASVS, MASTG, SAMM, Testing Guide)
# - MITRE Frameworks (ATT&CK, ATLAS, CAPEC)
# - NIST Standards (SP 800-115, 800-40, 800-53)
# - CWE, CVSS, CISA KEV, OSINT, PayloadsAllTheThings
```

**All compliance frameworks (24 total):**
```bash
bun run tools/standards/ingest-frameworks.ts --all

# Ingests all 24 frameworks (warning: large downloads)
```

---

### Programmatic Usage

**Basic usage:**
```typescript
import { FrameworkIngester } from "@/tools/ingestion/framework-ingester";
import { loadIngestionConfig, getConfigPath } from "@/tools/ingestion/config-loader";

// Load security frameworks config
const config = loadIngestionConfig(getConfigPath("security"));

// Create ingester
const ingester = new FrameworkIngester(config);

// List all frameworks
ingester.listAll();

// Ingest single framework
await ingester.ingestFramework("owasp-top10-web");

// Ingest all frameworks
await ingester.ingestAll();
```

**Custom configuration:**
```typescript
import { IngestionConfig } from "@/tools/ingestion/types";

const customConfig: IngestionConfig = {
  skillName: "Custom Skill",
  skillPath: "skills/custom",
  itemType: "framework",
  frameworks: {
    "my-framework": {
      name: "My Custom Framework",
      repo: "https://github.com/org/repo",
      outputDir: "reference/github/custom",
      description: "Custom framework description",
      category: "custom"
    }
  }
};

const ingester = new FrameworkIngester(customConfig);
await ingester.ingestFramework("my-framework");
```

**CLI factory:**
```typescript
import { createIngestionCLI } from "@/tools/ingestion/framework-ingester";
import { loadIngestionConfig, getConfigPath } from "@/tools/ingestion/config-loader";

// Create CLI handler
const config = loadIngestionConfig(getConfigPath("security"));
const cli = createIngestionCLI(
  config,
  "tools/bug-bounty/ingest-frameworks.ts",
  "framework"
);

// Run CLI (handles --help, --list, --all, --framework)
await cli();
```

---

## Configuration

### YAML Configuration Files

**Location:** `tools/ingestion/config/`

**Available configurations:**
- `security-frameworks.yaml` - 25 security frameworks
- `compliance-frameworks.yaml` - 24 compliance frameworks
- `learning-resources.yaml` - 6 learning resources

**Configuration schema:**
```yaml
skillName: "Skill Name"
skillPath: "skills/skill-name"
itemType: "framework" | "resource"

frameworks:
  framework-id:
    name: "Display Name"
    repo: "https://github.com/org/repo"
    outputDir: "relative/path"
    description: "Brief description"
    category: "category-type"
  # ... more entries
```

**Example entry:**
```yaml
owasp-top10-web:
  name: "OWASP Top 10 - Web Applications"
  repo: "https://github.com/OWASP/Top10"
  outputDir: "reference/github/owasp/top10-web"
  description: "OWASP Top 10 Web Application Security Risks"
  category: "advisory"
```

---

### Security Frameworks Configuration

**25 frameworks organized by category:**

**OWASP Top 10 Variants (6):**
- `owasp-top10-web` - Web Applications
- `owasp-top10-api` - API Security
- `owasp-top10-mobile` - Mobile Applications
- `owasp-top10-iot` - IoT Security
- `owasp-top10-llm` - Large Language Models
- `owasp-top10-cicd` - CI/CD Security

**OWASP Testing & Assessment (6):**
- `owasp-asvs` - Application Security Verification Standard
- `owasp-mastg` - Mobile Application Security Testing Guide
- `owasp-samm` - Software Assurance Maturity Model
- `owasp-testing-guide` - Web Application Testing Guide
- `owasp-secure-coding` - Secure Coding Practices
- `owasp-risk-rating` - Risk Rating Methodology

**MITRE Frameworks (4):**
- `mitre-attack` - ATT&CK Framework
- `mitre-attack-mobile` - Mobile ATT&CK
- `mitre-atlas` - Adversarial Threat Landscape for AI Systems
- `mitre-capec` - Common Attack Pattern Enumeration

**NIST Standards (3):**
- `nist-sp800-115` - Technical Guide to Information Security Testing
- `nist-sp800-40` - Guide to Enterprise Patch Management
- `nist-sp800-53` - Security and Privacy Controls

**Additional Resources (6):**
- `cwe-top25` - CWE Top 25 Most Dangerous Software Weaknesses
- `cvss` - Common Vulnerability Scoring System
- `cisa-kev` - Known Exploited Vulnerabilities Catalog
- `osint-framework` - OSINT Framework
- `payloadsallthethings` - Payload & Bypass Collection

---

### Compliance Frameworks Configuration

**24 frameworks organized by organization:**

**NIST (6):**
- `nist-oscal` - Open Security Controls Assessment Language
- `nist-sp800-53` - Security and Privacy Controls
- `nist-sp800-171` - Protecting CUI in Nonfederal Systems
- `nist-sp800-53b` - Control Baselines
- `nist-csf` - Cybersecurity Framework 2.0
- `nist-privacy` - Privacy Framework

**CIS (3):**
- `cis-controls` - CIS Critical Security Controls
- `cis-benchmarks` - CIS Benchmarks
- `cis-aws` - AWS Foundations Benchmark

**FedRAMP (2):**
- `fedramp-baselines` - Security Baselines
- `fedramp-oscal` - OSCAL Library

**ISO (3):**
- `iso-27001` - Information Security Management
- `iso-27002` - Information Security Controls
- `iso-27035` - Incident Management

**Industry Specific (4):**
- `pci-dss` - Payment Card Industry Data Security Standard
- `hipaa` - Health Insurance Portability and Accountability Act
- `gdpr` - General Data Protection Regulation
- `soc2` - SOC 2 Compliance

**Additional (6):**
- `mitre-attack` - ATT&CK Framework (compliance view)
- `mitre-atlas` - AI/ML Threat Landscape
- `cwe-top25` - CWE Top 25
- `nist-sp800-161` - Supply Chain Risk Management
- `nist-sp800-181` - Workforce Framework (NICE)
- `cisa-security` - CISA Security Guidance

---

### Learning Resources Configuration

**6 resources organized by category:**

**Certification Prep (3):**
- `oscp-prep` - Offensive Security Certified Professional
- `ceh-prep` - Certified Ethical Hacker
- `cissp-prep` - Certified Information Systems Security Professional

**Roadmaps (2):**
- `cybersecurity-roadmap` - Cybersecurity Career Roadmap
- `devops-roadmap` - DevOps Career Roadmap

**Learning Collections (1):**
- `awesome-security` - Curated Security Resources

---

## API Reference

### FrameworkIngester Class

#### `new FrameworkIngester(config: IngestionConfig)`

Create ingestion engine instance.

**Parameters:**
- `config` - Configuration object from YAML file

**Returns:** FrameworkIngester instance

---

#### `async ingestFramework(key: string): Promise<void>`

Ingest single framework or resource.

**Parameters:**
- `key` - Framework ID from configuration (e.g., "owasp-top10-web")

**Process:**
1. Validates framework key exists
2. Creates output directory
3. Runs `gitingest <repo> -o <outputfile>`
4. Generates metadata.json
5. Logs success or failure

**Throws:** Error if framework key not found or gitingest fails

---

#### `async ingestAll(): Promise<void>`

Ingest all frameworks/resources in configuration.

**Process:**
- Iterates through all framework entries
- Calls `ingestFramework()` for each
- Continues on individual failures (logs error)

---

#### `listAll(): void`

Display all available frameworks with details.

**Output:**
- Framework ID
- Display name
- Repository URL
- Output directory
- Description
- Category

---

#### `getKeys(): string[]`

Get array of all framework IDs.

**Returns:** Array of framework keys

---

#### `showHelp(scriptName: string, itemName?: string): void`

Display help message with usage examples.

**Parameters:**
- `scriptName` - Path to wrapper script
- `itemName` - "framework" or "resource" (default: "framework")

---

### Configuration Loader

#### `loadIngestionConfig(configPath: string): IngestionConfig`

Load and validate YAML configuration.

**Parameters:**
- `configPath` - Absolute path to YAML config file

**Returns:** Parsed IngestionConfig object

**Throws:** Error if file not found or invalid structure

---

#### `getConfigPath(skillName: "security" | "compliance" | "mentorship"): string`

Get configuration path for skill.

**Parameters:**
- `skillName` - Skill identifier

**Returns:** Absolute path to YAML config file

---

### CLI Factory

#### `createIngestionCLI(config, scriptName, itemName?)`

Create CLI handler function.

**Parameters:**
- `config` - IngestionConfig object
- `scriptName` - Script path for help display
- `itemName` - "framework" or "resource" (default: "framework")

**Returns:** Async function handling CLI arguments

**Supported arguments:**
- `--help` - Display usage
- `--list` - List all frameworks
- `--all` - Ingest all frameworks
- `--framework <name>` - Ingest single framework
- `--resource <name>` - Ingest single resource

---

## Architecture

### Ingestion Flow

```
User runs: bun run tools/bug-bounty/ingest-frameworks.ts --framework owasp-top10-web
   ↓
1. CLI wrapper loads config
   loadIngestionConfig(getConfigPath("security"))
   ↓
2. Create ingester
   new FrameworkIngester(config)
   ↓
3. Parse arguments
   createIngestionCLI() handles --framework flag
   ↓
4. Validate framework exists
   config.frameworks["owasp-top10-web"] exists?
   ↓
5. Create output directory
   fs.mkdirSync(skills/pentest/reference/github/owasp/top10-web, {recursive: true})
   ↓
6. Run gitingest
   execFileSync('gitingest', [repo, '-o', outputFile])
   ↓
7. Generate metadata
   {
     framework: "OWASP Top 10 - Web Applications",
     category: "advisory",
     repository: "https://github.com/OWASP/Top10",
     outputFile: "owasp-top10-web.txt",
     ingested_at: "2026-02-14T18:00:00.000Z",
     description: "OWASP Top 10 Web Application Security Risks",
     gitingest_cli: "gitingest"
   }
   ↓
8. Write metadata.json
   fs.writeFileSync(metadata.json, JSON.stringify(metadata, null, 2))
   ↓
9. Log success
   ✓ Successfully ingested OWASP Top 10 - Web Applications
```

---

### Directory Structure

**Output organization:**
```
skills/pentest/
├── reference/github/
│   ├── owasp/
│   │   ├── top10-web/
│   │   │   ├── owasp-top10-web.txt      # Ingested repository
│   │   │   └── metadata.json             # Metadata
│   │   ├── top10-api/
│   │   ├── asvs/
│   │   └── ...
│   ├── mitre/
│   │   ├── attack/
│   │   ├── atlas/
│   │   └── capec/
│   └── nist/
│       ├── sp800-115/
│       └── ...

standards/
├── frameworks/
│   ├── nist/
│   │   └── reference/github/
│   │       ├── oscal/
│   │       │   ├── nist-oscal.txt
│   │       │   └── metadata.json
│   │       └── ...
│   └── cis/
│       └── reference/github/
│           └── ...

skills/mentorship/
├── docs/github/
│   ├── oscp-preparation/
│   │   ├── oscp-prep.txt
│   │   └── metadata.json
│   └── ...
```

---

### Metadata Format

**Generated metadata.json:**
```json
{
  "framework": "OWASP Top 10 - Web Applications",
  "category": "advisory",
  "repository": "https://github.com/OWASP/Top10",
  "outputFile": "owasp-top10-web.txt",
  "ingested_at": "2026-02-14T18:00:00.000Z",
  "description": "OWASP Top 10 Web Application Security Risks",
  "gitingest_cli": "gitingest"
}
```

**For resources (itemType: "resource"):**
```json
{
  "resource": "OSCP Preparation Guide",
  "category": "certification-prep",
  "repository": "https://github.com/...",
  ...
}
```

---

## Scripts

### Add New Framework

**Edit configuration file:**
```yaml
# tools/ingestion/config/security-frameworks.yaml
new-framework-id:
  name: "New Framework Name"
  repo: "https://github.com/org/new-framework"
  outputDir: "reference/github/category/name"
  description: "Brief description"
  category: "testing"
```

**Ingest immediately:**
```bash
bun run tools/bug-bounty/ingest-frameworks.ts --framework new-framework-id
```

**No code changes required!** Configuration-driven design automatically:
- Adds to `--list` output
- Accepts via `--framework` flag
- Includes in `--all` operations

---

### Update Existing Framework

**Re-run ingestion:**
```bash
bun run tools/bug-bounty/ingest-frameworks.ts --framework owasp-top10-web

# Overwrites existing files:
# - owasp-top10-web.txt (updated repository content)
# - metadata.json (new timestamp)
```

---

### Batch Update All Frameworks

```bash
#!/bin/bash
# Update all security frameworks

bun run tools/bug-bounty/ingest-frameworks.ts --all

# Takes ~10-15 minutes for 25 frameworks
# Requires internet connection
# gitingest must be installed
```

---

### Create Custom Skill Integration

```bash
# 1. Create YAML config
cat > tools/ingestion/config/my-skill.yaml <<EOF
skillName: "My Skill"
skillPath: "skills/my-skill"
itemType: "framework"

frameworks:
  example-framework:
    name: "Example Framework"
    repo: "https://github.com/example/framework"
    outputDir: "reference/github/example"
    description: "Example framework"
    category: "example"
EOF

# 2. Create wrapper script
cat > skills/my-skill/scripts/ingest-frameworks.ts <<EOF
import { createIngestionCLI } from "@/tools/ingestion/framework-ingester";
import { loadIngestionConfig } from "@/tools/ingestion/config-loader";

const configPath = "tools/ingestion/config/my-skill.yaml";
const config = loadIngestionConfig(configPath);

const cli = createIngestionCLI(
  config,
  "skills/my-skill/scripts/ingest-frameworks.ts",
  "framework"
);

cli();
EOF

# 3. Run
bun run skills/my-skill/scripts/ingest-frameworks.ts --list
```

---

## Dependencies

### Runtime

**External:**
- `gitingest` - CLI tool for repository ingestion (must be installed)
- `yaml` - YAML parsing (npm package)

**Internal:**
- Node.js `fs`, `path`, `child_process` modules
- Bun runtime

### Framework Integration

**Used By:**
- `tools/bug-bounty/ingest-frameworks.ts` - Security framework ingestion
- `tools/standards/ingest-frameworks.ts` - Compliance framework ingestion
- `skills/mentorship/scripts/ingest-resources.ts` - Learning resource ingestion

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Skills:**
- `tools/bug-bounty/ingest-frameworks.ts` — uses framework-ingester.ts to pull OWASP, NIST, MITRE ATTACK repositories
- `tools/standards/ingest-frameworks.ts` — ingests compliance standard repos (SOC2, HIPAA, PCI-DSS, etc.)
- `skills/mentorship/scripts/ingest-resources.ts` — pulls OSCP prep and security learning resources

---

**File Structure:**
```
tools/ingestion/
├── framework-ingester.ts       # Main engine (150 lines)
├── config-loader.ts            # Config loader (41 lines)
├── types.ts                    # Type definitions (23 lines)
├── config/
│   ├── security-frameworks.yaml       # 25 frameworks
│   ├── compliance-frameworks.yaml     # 24 frameworks
│   └── learning-resources.yaml        # 6 resources
├── README.md                   # This file's predecessor
└── TOOL.md                     # This file
```

---

## Troubleshooting

### "gitingest: command not found"

**Cause:** gitingest CLI not installed

**Fix:**
```bash
# Install gitingest
pip install gitingest

# Or with pipx (isolated installation)
pipx install gitingest

# Verify installation
which gitingest
gitingest --version
```

---

### "Configuration file not found"

**Cause:** Invalid config path or missing YAML file

**Debug:**
```bash
# Check config files exist
ls -la tools/ingestion/config/

# Verify config loader mapping
# config-loader.ts maps: security → security-frameworks.yaml
#                       compliance → compliance-frameworks.yaml
#                       mentorship → learning-resources.yaml
```

**Fix:**
```typescript
// Use correct skill name
const config = loadIngestionConfig(getConfigPath("security")); // ✓
const config = loadIngestionConfig(getConfigPath("pentest"));  // ✗ Invalid
```

---

### "Unknown framework 'xyz'"

**Cause:** Framework ID not in configuration

**Debug:**
```bash
# List available frameworks
bun run tools/bug-bounty/ingest-frameworks.ts --list

# Check exact ID in YAML
grep "^  [a-z-]*:" tools/ingestion/config/security-frameworks.yaml
```

**Fix:**
```bash
# Use exact framework ID from --list output
bun run ... --framework owasp-top10-web  # ✓
bun run ... --framework owasp-web        # ✗ Wrong ID
```

---

### "gitingest failed with exit code 1"

**Cause:** Repository doesn't exist, network error, or rate limiting

**Debug:**
```bash
# Test gitingest directly
gitingest https://github.com/OWASP/Top10 -o /tmp/test.txt

# Check repository URL
curl -I https://github.com/OWASP/Top10  # Should return 200
```

**Fix:**
```yaml
# Update repository URL in config if moved
owasp-top10-web:
  repo: "https://github.com/OWASP/www-project-top-ten"  # Updated URL
```

---

### "Invalid configuration file"

**Cause:** Missing required YAML fields

**Fix:**
```yaml
# Ensure all required fields present
skillName: "Skill Name"       # Required
skillPath: "skills/name"      # Required
itemType: "framework"         # Required
frameworks:                   # Required
  framework-id:               # At least one entry required
    name: "..."
    repo: "..."
    outputDir: "..."
    description: "..."
    category: "..."
```

---

### "Permission denied" when creating output directory

**Cause:** Insufficient filesystem permissions

**Debug:**
```bash
# Check permissions
ls -la skills/pentest/

# Check if directory writable
touch skills/pentest/test.txt && rm skills/pentest/test.txt
```

**Fix:**
```bash
# Fix permissions
chmod -R u+w skills/pentest/

# Or run with appropriate user
sudo chown -R $USER:$USER skills/
```

---

## Related Tools

- **gitingest** - GitHub repository ingestion CLI
- **tools/markdown** - Markdown parsing utilities (for ingested content)
- **skills/security** - Security skill using this tool
- **standards** - GRC standards data store using this tool
- **skills/mentorship** - Mentorship skill using this tool

---

## Version History

### 2.0.0 (2026-01-28)
- ✅ Generic reusable engine (replaces 3 skill-specific scripts)
- ✅ Configuration-driven framework definitions (YAML)
- ✅ Multi-skill support (security, compliance, mentorship)
- ✅ CLI factory for consistent command-line interface
- ✅ Metadata generation with timestamps and descriptions
- ✅ TypeScript type definitions
- ✅ Eliminated 600+ lines of duplicate code
- ✅ Support for both "framework" and "resource" item types

### 1.0.0 (2026-01-15)
- Initial skill-specific ingestion scripts
- Hardcoded framework lists
- 311, 308, and 169 lines per script

---

## References

- **gitingest CLI**: https://github.com/cyclotruc/gitingest
- **YAML Package**: https://www.npmjs.com/package/yaml
- **OWASP Projects**: https://owasp.org/projects/
- **MITRE Frameworks**: https://attack.mitre.org/
- **NIST Standards**: https://csrc.nist.gov/publications
- **CIS Benchmarks**: https://www.cisecurity.org/cis-benchmarks
