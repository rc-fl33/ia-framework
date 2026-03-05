/**
 * Skill Structure Validator Hook
 *
 * PreToolUse hook that validates skill directory structure before Write tool executes.
 * Enforces the standard documented in skills/create/templates/SKILL-TEMPLATE.md
 *
 * Required structure:
 * skills/{skill-name}/
 * ├── SKILL.md              # Main entry (required, must have ASCII workflow diagram)
 * ├── STATUS.md             # Status tracking (required)
 * ├── README.md             # User documentation (required)
 * ├── VERIFY.md             # Verification checklist (required)
 * ├── phases/               # Workflow phase definitions (required, min 3 files)
 * ├── docs/                 # Documentation (required, must have adding-credentials.md)
 * ├── input/                # Input files (required, must have .gitkeep)
 * ├── output/               # Output files (required, must have .gitkeep)
 * ├── commands/             # Symlinked to /commands/ (optional)
 * ├── workflows/            # Additional workflows (optional)
 * ├── templates/            # Output templates (optional)
 * └── scripts/              # TypeScript automation (optional)
 *
 * Validations:
 * - SKILL.md exists with valid frontmatter (name, description, classification)
 * - SKILL.md classification is 'public' or 'private'
 * - SKILL.md contains ASCII workflow diagram (box drawing characters)
 * - STATUS.md exists with required sections (Last Updated, Readiness, Session Changes)
 * - README.md exists (user documentation)
 * - VERIFY.md exists (verification checklist)
 * - phases/ directory exists with minimum 3 phase files
 * - docs/ directory exists with adding-credentials.md
 * - input/ and output/ directories exist with .gitkeep files
 * - Directory structure follows valid subdirectories
 *
 * Trigger: PreToolUse on Write tool when writing to skills/
 * Action: Validate structure, warn or block on violations
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';

interface PreToolUseInput {
  tool_name: string;
  tool_input: {
    file_path?: string;
    content?: string;
    [key: string]: unknown;
  };
}

interface ValidationResult {
  action: 'allow' | 'warn' | 'block';
  message?: string;
  suggestion?: string;
}

interface SkillStructureIssue {
  skill: string;
  issues: string[];
  suggestions: string[];
}

// Framework paths - Use IA_FRAMEWORK_ROOT env var if set, otherwise self-discover from script location
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..');
const SKILLS_DIR = join(FRAMEWORK_ROOT, 'skills');

// Skills to skip (special files/directories)
const SKIP_SKILLS = ['README.md'];

// Required files for a skill
const REQUIRED_FILES = ['SKILL.md', 'STATUS.md', 'README.md', 'VERIFY.md'];

// Allowed files in skill root (only these + .gitkeep, .gitignore, .env.example)
const ALLOWED_ROOT_FILES = [
  'SKILL.md',
  'STATUS.md',
  'README.md',
  'VERIFY.md',
  '.gitkeep',
  '.gitignore',
  '.env.example'
];

// Required directories for a skill
const REQUIRED_DIRS = ['input', 'output', 'phases', 'docs'];

// Required docs files
const REQUIRED_DOCS = ['adding-credentials.md'];

// Valid classification values
const VALID_CLASSIFICATION = ['public', 'private'];

// Valid subdirectories per SKILL-TEMPLATE.md (reference renamed to docs)
const VALID_SUBDIRS = ['commands', 'workflows', 'docs', 'templates', 'scripts', 'input', 'output', 'reference', 'phases', 'methodologies', 'frameworks', 'mappings', 'infrastructure', 'client'];

// Required frontmatter fields in SKILL.md
const REQUIRED_FRONTMATTER = ['name', 'description', 'classification'];

// ASCII diagram indicators (box drawing characters used in workflow diagrams)
// Supports both Unicode (┌─┐) and ASCII (+--+) style diagrams
const DIAGRAM_INDICATORS = ['┌', '┐', '└', '┘', '│', '─', '▼', '▶', '→', '+--', '|', '-->'];

/**
 * Extract YAML frontmatter from markdown file
 */
function extractFrontmatter(filePath: string): Record<string, string> | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;

    const frontmatter: Record<string, string> = {};
    const lines = match[1].split('\n');
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
        frontmatter[key] = value;
      }
    }
    return frontmatter;
  } catch {
    return null;
  }
}

/**
 * Validate a single skill directory
 */
function validateSkillStructure(skillPath: string): SkillStructureIssue | null {
  const skillName = basename(skillPath);
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check SKILL.md exists
  const skillMdPath = join(skillPath, 'SKILL.md');
  if (!existsSync(skillMdPath)) {
    issues.push('Missing SKILL.md (required entry point)');
    suggestions.push('Create SKILL.md using skills/create/templates/SKILL-TEMPLATE.md');
  } else {
    // Validate SKILL.md frontmatter
    const frontmatter = extractFrontmatter(skillMdPath);
    if (!frontmatter) {
      issues.push('SKILL.md missing YAML frontmatter');
      suggestions.push('Add frontmatter with name and description fields');
    } else {
      for (const field of REQUIRED_FRONTMATTER) {
        if (!frontmatter[field]) {
          issues.push(`SKILL.md missing required frontmatter field: ${field}`);
        }
      }

      // Check name matches directory
      if (frontmatter.name && frontmatter.name !== skillName) {
        issues.push(`SKILL.md name "${frontmatter.name}" does not match directory "${skillName}"`);
        suggestions.push('Rename skill atomically per SKILL-RENAME-PROTOCOL.md');
      }

      // Validate classification value
      if (frontmatter.classification && !VALID_CLASSIFICATION.includes(frontmatter.classification)) {
        issues.push(`SKILL.md classification "${frontmatter.classification}" is invalid`);
        suggestions.push(`Classification must be one of: ${VALID_CLASSIFICATION.join(', ')}`);
      }
    }

    // Check for ASCII workflow diagram
    try {
      const skillContent = readFileSync(skillMdPath, 'utf-8');
      const hasDiagram = DIAGRAM_INDICATORS.some(indicator => skillContent.includes(indicator));
      if (!hasDiagram) {
        issues.push('SKILL.md missing ASCII workflow diagram');
        suggestions.push('Add 5-phase workflow diagram per SKILL-TEMPLATE.md');
      }
    } catch {
      // Can't read file for diagram check
    }
  }

  // Check STATUS.md exists and has required sections
  const statusMdPath = join(skillPath, 'STATUS.md');
  if (!existsSync(statusMdPath)) {
    issues.push('Missing STATUS.md (required for status tracking)');
    suggestions.push('Create STATUS.md using skills/create/templates/STATUS-TEMPLATE.md');
  } else {
    // Validate STATUS.md has required sections
    try {
      const statusContent = readFileSync(statusMdPath, 'utf-8');
      const requiredSections = ['Last Updated:', 'Readiness:', 'Session Changes'];

      for (const section of requiredSections) {
        if (!statusContent.includes(section)) {
          issues.push(`STATUS.md missing required section: ${section}`);
        }
      }
    } catch {
      issues.push('Could not read STATUS.md');
    }
  }

  // Check README.md exists
  const readmePath = join(skillPath, 'README.md');
  if (!existsSync(readmePath)) {
    issues.push('Missing README.md (required user documentation)');
    suggestions.push('Create README.md using skills/create/templates/README-TEMPLATE.md');
  }

  // Check VERIFY.md exists
  const verifyPath = join(skillPath, 'VERIFY.md');
  if (!existsSync(verifyPath)) {
    issues.push('Missing VERIFY.md (required verification checklist)');
    suggestions.push('Create VERIFY.md using skills/create/templates/VERIFY-TEMPLATE.md');
  }

  // Check required directories exist
  for (const dir of REQUIRED_DIRS) {
    const dirPath = join(skillPath, dir);
    if (!existsSync(dirPath)) {
      issues.push(`Missing required directory: ${dir}/`);
      suggestions.push(`Create directory: mkdir -p skills/${skillName}/${dir}`);
    }
  }

  // Check phases/ has phase files (01-XX.md through 05-XX.md pattern)
  const phasesDir = join(skillPath, 'phases');
  if (existsSync(phasesDir)) {
    try {
      const phaseFiles = readdirSync(phasesDir).filter(f => f.endsWith('.md'));
      if (phaseFiles.length < 3) {
        issues.push(`phases/ directory has fewer than 3 phase files (has ${phaseFiles.length})`);
        suggestions.push('Create phase files following 01-name.md, 02-name.md pattern');
      }
    } catch {
      // Can't read phases directory
    }
  }

  // Check docs/adding-credentials.md exists
  const docsDir = join(skillPath, 'docs');
  if (existsSync(docsDir)) {
    for (const requiredDoc of REQUIRED_DOCS) {
      const docPath = join(docsDir, requiredDoc);
      if (!existsSync(docPath)) {
        issues.push(`Missing required docs file: docs/${requiredDoc}`);
        suggestions.push('Create from skills/create/templates/adding-credentials-template.md');
      }
    }
  }

  // Check input/ and output/ have .gitkeep files
  const inputDir = join(skillPath, 'input');
  const outputDir = join(skillPath, 'output');
  if (existsSync(inputDir) && !existsSync(join(inputDir, '.gitkeep'))) {
    issues.push('Missing input/.gitkeep');
    suggestions.push('Run: touch skills/' + skillName + '/input/.gitkeep');
  }
  if (existsSync(outputDir) && !existsSync(join(outputDir, '.gitkeep'))) {
    issues.push('Missing output/.gitkeep');
    suggestions.push('Run: touch skills/' + skillName + '/output/.gitkeep');
  }

  // Check for invalid files in skill root
  try {
    const entries = readdirSync(skillPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        if (!ALLOWED_ROOT_FILES.includes(entry.name)) {
          issues.push(`File in skill root should be in subdirectory: ${entry.name}`);
          suggestions.push(`Move to appropriate subdirectory (docs/, templates/, etc.)`);
        }
      }

      // Check for invalid subdirectories
      if (entry.isDirectory()) {
        if (!VALID_SUBDIRS.includes(entry.name) && !entry.name.startsWith('.')) {
          // Allow nested skill structures (e.g., compliance/nist/assessment)
          const nestedSkillMd = join(skillPath, entry.name, 'SKILL.md');
          if (!existsSync(nestedSkillMd)) {
            issues.push(`Invalid subdirectory: ${entry.name}`);
            suggestions.push(`Valid subdirectories: ${VALID_SUBDIRS.join(', ')}`);
          }
        }
      }
    }
  } catch {
    // Can't read directory
  }

  // Check commands/ symlinks exist in /commands/ if commands/ exists
  const commandsDir = join(skillPath, 'commands');
  if (existsSync(commandsDir)) {
    try {
      const commandFiles = readdirSync(commandsDir).filter(f => f.endsWith('.md') && f !== 'README.md');
      const rootCommandsDir = join(FRAMEWORK_ROOT, 'commands');

      for (const cmdFile of commandFiles) {
        const cmdName = cmdFile.replace('.md', '');
        const symlinkPath = join(rootCommandsDir, cmdName);

        if (!existsSync(symlinkPath)) {
          issues.push(`Command ${cmdFile} not symlinked to /commands/`);
          suggestions.push(`Run: ln -s ../skills/${skillName}/commands/${cmdFile} commands/${cmdName}`);
        }
      }
    } catch {
      // Can't read commands directory
    }
  }

  if (issues.length === 0) {
    return null;
  }

  return { skill: skillName, issues, suggestions };
}

/**
 * Validate all skills in the framework
 */
function validateAllSkills(): SkillStructureIssue[] {
  const allIssues: SkillStructureIssue[] = [];

  if (!existsSync(SKILLS_DIR)) {
    return allIssues;
  }

  try {
    const entries = readdirSync(SKILLS_DIR, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (SKIP_SKILLS.includes(entry.name)) continue;

      const skillPath = join(SKILLS_DIR, entry.name);
      const result = validateSkillStructure(skillPath);

      if (result) {
        allIssues.push(result);
      }

      // Check for nested skills (e.g., compliance/nist/assessment)
      try {
        const nestedEntries = readdirSync(skillPath, { withFileTypes: true });
        for (const nested of nestedEntries) {
          if (!nested.isDirectory()) continue;
          if (VALID_SUBDIRS.includes(nested.name)) continue;

          const nestedPath = join(skillPath, nested.name);
          const nestedSkillMd = join(nestedPath, 'SKILL.md');

          if (existsSync(nestedSkillMd)) {
            const nestedResult = validateSkillStructure(nestedPath);
            if (nestedResult) {
              nestedResult.skill = `${entry.name}/${nested.name}`;
              allIssues.push(nestedResult);
            }
          }
        }
      } catch {
        // Can't read nested directory
      }
    }
  } catch {
    // Can't read skills directory
  }

  return allIssues;
}

/**
 * Main hook entry point
 */
async function main() {
  // Read input from stdin
  let inputData = '';

  for await (const chunk of Bun.stdin.stream()) {
    inputData += new TextDecoder().decode(chunk);
  }

  // Parse input
  let data: PreToolUseInput;
  try {
    data = JSON.parse(inputData);
  } catch {
    // Not valid JSON, allow by default
    console.log(JSON.stringify({ action: 'allow' }));
    return;
  }

  // Only run on Write tool targeting skills/
  if (data.tool_name !== 'Write') {
    console.log(JSON.stringify({ action: 'allow' }));
    return;
  }

  const filePath = data.tool_input?.file_path || '';
  if (!filePath.includes('/skills/')) {
    console.log(JSON.stringify({ action: 'allow' }));
    return;
  }

  // Validate all skills and report
  const issues = validateAllSkills();

  if (issues.length === 0) {
    console.log(JSON.stringify({ action: 'allow' }));
    return;
  }

  // Build warning message
  const messages: string[] = ['Skill structure issues detected:'];

  for (const issue of issues) {
    messages.push(`\n  ${issue.skill}:`);
    for (const i of issue.issues) {
      messages.push(`    - ${i}`);
    }
  }

  // Warn but don't block (allow development)
  const result: ValidationResult = {
    action: 'warn',
    message: messages.join('\n'),
    suggestion: 'See skills/create/templates/SKILL-TEMPLATE.md for correct structure'
  };

  console.log(JSON.stringify(result));
}

main().catch(err => {
  console.error('Skill structure validator error:', err);
  console.log(JSON.stringify({ action: 'allow' }));
});

export { validateAllSkills, validateSkillStructure };
