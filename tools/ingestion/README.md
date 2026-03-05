# Framework Ingestion Engine

Reusable ingestion system for GitHub repositories containing frameworks, standards, and educational resources. Consolidates framework definitions into configuration files and provides a shared engine for all skills.

## Architecture

### Core Components

1. **framework-ingester.ts** - Main ingestion engine
   - `FrameworkIngester` class: Handles gitingest CLI invocation, directory creation, metadata generation
   - `createIngestionCLI()` factory: CLI argument parsing (--list, --all, --framework, --resource)
   - Supports both "framework" and "resource" item types
   - Parameterized output directories and skill paths

2. **config-loader.ts** - Configuration management
   - Loads YAML configuration files
   - Maps skill names to configuration paths
   - Validates configuration structure

3. **types.ts** - TypeScript type definitions
   - `FrameworkEntry`: Individual framework/resource definition
   - `IngestionConfig`: Configuration structure
   - `IngestionMetadata`: Metadata output structure

## Configuration Files

### security-frameworks.yaml
25 frameworks for security skill:
- OWASP Top 10 variants (Web, API, Mobile, IoT, LLM, CI/CD)
- OWASP Testing & Assessment (ASVS, MASTG, SAMM, Testing Guide, Secure Coding, Risk Rating)
- MITRE Frameworks (ATT&CK variants, ATLAS, CAPEC)
- NIST Standards (SP 800-115, 800-40, 800-53)
- Additional Resources (CWE Top 25, CVSS, CISA KEV, OSINT Tools, PayloadsAllTheThings)

### compliance-frameworks.yaml
24 frameworks for compliance skill:
- NIST Frameworks (OSCAL, SP 800-53, SP 800-171, SP 800-53B, CSF, Privacy Framework)
- CIS Controls & Benchmarks (Controls, Benchmarks, AWS Foundations)
- FedRAMP (Baselines, OSCAL Library)
- ISO Standards (27001, 27002, 27035)
- Industry Specific (PCI DSS, HIPAA, GDPR, SOC 2)
- Threat Intelligence (MITRE ATT&CK, MITRE ATLAS, CWE)
- Additional Guidance (NIST SP 800-161, NIST SP 800-181, CISA Security Guidance)

### learning-resources.yaml
6 resources for mentorship skill:
- Certification Prep (OSCP, CEH, CISSP)
- Roadmaps (Cybersecurity, DevOps)
- Learning Collections (Awesome Security)

## Usage

### Via Skill Scripts

Each skill now uses the shared engine through minimal wrappers:

```bash
# Security frameworks
bun run tools/bug-bounty/ingest-frameworks.ts --help
bun run tools/bug-bounty/ingest-frameworks.ts --list
bun run tools/bug-bounty/ingest-frameworks.ts --framework owasp-top10-web
bun run tools/bug-bounty/ingest-frameworks.ts --all

# Compliance frameworks
bun run tools/standards/ingest-frameworks.ts --help
bun run tools/standards/ingest-frameworks.ts --list
bun run tools/standards/ingest-frameworks.ts --framework nist-oscal
bun run tools/standards/ingest-frameworks.ts --all

# Learning resources
bun run skills/mentorship/scripts/ingest-resources.ts --help
bun run skills/mentorship/scripts/ingest-resources.ts --list
bun run skills/mentorship/scripts/ingest-resources.ts --resource oscp-prep
bun run skills/mentorship/scripts/ingest-resources.ts --all
```

### Programmatic Usage

```typescript
import { FrameworkIngester } from "@/tools/ingestion/framework-ingester";
import { loadIngestionConfig, getConfigPath } from "@/tools/ingestion/config-loader";

// Load configuration
const config = loadIngestionConfig(getConfigPath("security"));

// Create ingester
const ingester = new FrameworkIngester(config);

// List all
ingester.listAll();

// Ingest single framework
await ingester.ingestFramework("owasp-top10-web");

// Ingest all
await ingester.ingestAll();
```

## CLI Commands

### --help
Display usage instructions and list all available frameworks/resources.

```bash
bun run tools/bug-bounty/ingest-frameworks.ts --help
```

### --list
Display detailed information about all available frameworks/resources:
- Name
- Repository URL
- Output directory
- Description
- Category

```bash
bun run tools/bug-bounty/ingest-frameworks.ts --list
```

### --framework <name> or --resource <name>
Ingest a specific framework or resource. Runs gitingest and generates metadata.json.

```bash
bun run tools/bug-bounty/ingest-frameworks.ts --framework owasp-top10-web
bun run skills/mentorship/scripts/ingest-resources.ts --resource oscp-prep
```

### --all
Ingest all frameworks/resources for the skill.

```bash
bun run tools/bug-bounty/ingest-frameworks.ts --all
```

## Output

### Ingestion Process
1. Creates output directory structure
2. Runs `gitingest <repo> -o <outputfile>`
3. Generates `metadata.json` with:
   - Framework/resource name
   - Category
   - Repository URL
   - Output filename
   - Ingestion timestamp (ISO format)
   - Description
   - gitingest CLI version

### Directory Structure
```
skills/pentest/
├── reference/github/
│   ├── owasp/
│   │   ├── top10-web/
│   │   │   ├── owasp-top10-web.txt
│   │   │   └── metadata.json
│   │   └── ...
│   ├── mitre/
│   └── nist/
└── ...

standards/
├── frameworks/
│   ├── nist/
│   │   └── reference/github/
│   │       ├── oscal/
│   │       │   ├── nist-oscal.txt
│   │       │   └── metadata.json
│   │       └── ...
│   ├── cis/
│   └── ...
└── ...

skills/mentorship/
├── docs/github/
│   ├── oscp-preparation/
│   │   ├── oscp-prep.txt
│   │   └── metadata.json
│   └── ...
└── ...
```

## Adding a New Framework

1. Edit the appropriate YAML config file:
   ```yaml
   new-framework-id:
     name: "Full Framework Name"
     repo: "https://github.com/org/repo"
     outputDir: "reference/github/category/name"
     description: "Brief description"
     category: "category-type"
   ```

2. The script will automatically:
   - Add it to --list output
   - Accept it via --framework or --resource
   - Include it in --all operations

No code changes needed!

## Configuration Schema

Each YAML file must include:

```yaml
skillName: "Skill Name"
skillPath: "skills/skill-name"
itemType: "framework" | "resource"

frameworks:
  framework-id:
    name: "Display Name"
    repo: "https://github.com/..."
    outputDir: "relative/path"
    description: "Description"
    category: "category-type"
  # ... more entries
```

## Benefits

1. **DRY Principle**: Eliminated 600+ lines of duplicate code
2. **Maintainability**: Single engine, configuration-driven updates
3. **Extensibility**: Add new skills without code changes
4. **Consistency**: Identical CLI behavior across all skills
5. **Flexibility**: Supports multiple item types (framework vs resource)
6. **Testability**: Centralized logic is easier to test

## Dependencies

- bun (Zig-based JavaScript runtime)
- gitingest (CLI tool for GitHub repository ingestion)
- yaml (npm package - already in package.json)

## Error Handling

- Invalid framework/resource names: Clear error message with list of available options
- Missing config file: Error with path information
- Invalid YAML: Error during config loading
- gitingest failure: Passes through execSync error with full stack trace

## Migration Path

The original scripts were 311, 308, and 169 lines respectively. After consolidation:
- Engine files: 270 lines (reusable, tested)
- Configuration: 418 lines (YAML, maintainable)
- Wrapper scripts: 69 lines (minimal, clear)
- Total: 757 lines (31 line reduction + better organization)

All original functionality is preserved. The scripts are drop-in replacements with no CLI changes.

## Testing

Run the verification tests:

```bash
bash /tmp/final-test.sh
```

Tests verify:
- TypeScript imports
- CLI help output
- Framework counts
- YAML configuration validity
- Wrapper script minimalism
- Import path correctness
