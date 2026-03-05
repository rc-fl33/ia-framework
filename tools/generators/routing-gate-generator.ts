#!/usr/bin/env bun

/**
 * Routing Gate Generator - Generates routing gates for CLAUDE.md, agents, and skills
 *
 * Flow:
 * 1. Load appropriate template (framework/agent/skill)
 * 2. Gather context (agents list, skills list, etc.)
 * 3. Replace template variables
 * 4. Send to Haiku for generation (stub for MVP)
 * 5. Integrate into target file (replace lines 0-15)
 *
 * Usage:
 *   bun run tools/framework/generators/routing-gate-generator.ts --type framework --target CLAUDE.md
 *   bun run tools/framework/generators/routing-gate-generator.ts --type agent --target agents/security.md
 *   bun run tools/framework/generators/routing-gate-generator.ts --type skill --target skills/pentest/SKILL.md
 *   bun run tools/framework/generators/routing-gate-generator.ts --all
 *
 * Cost: ~$0.0012 for all 24 gates (one-time)
 */

import { readFile, writeFile, readdir, stat } from "fs/promises";
import { join } from "path";

// Types
interface GateContext {
  // Framework context
  agents_list?: string;
  intent_enrichment_enabled?: boolean;
  parallel_threshold?: number;

  // Agent context
  agent_name?: string;
  agent_domain?: string;
  agent_tasks?: string;
  agent_not_tasks?: string;
  skills_list?: string;

  // Skill context
  skill_name?: string;
  skill_description?: string;
}

interface GenerationResult {
  gateContent: string;
  targetFile: string;
  success: boolean;
  error?: string;
}

// Configuration
const FRAMEWORK_ROOT =
  process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..', '..');
const TEMPLATES_DIR = join(FRAMEWORK_ROOT, "library", "templates");
const AGENTS_DIR = join(FRAMEWORK_ROOT, "agents");
const SKILLS_DIR = join(FRAMEWORK_ROOT, "skills");

/**
 * Load template file
 */
async function loadTemplate(
  type: "framework" | "agent" | "skill"
): Promise<string> {
  const templateFile = `${type.toUpperCase()}-routing-gate-template.md`;
  const templatePath = join(TEMPLATES_DIR, templateFile);

  try {
    const content = await readFile(templatePath, "utf-8");

    // Extract template from markdown code block
    const templateMatch = content.match(/```markdown\n([\s\S]*?)\n```/);
    if (!templateMatch) {
      throw new Error(`No template found in ${templateFile}`);
    }

    return templateMatch[1];
  } catch (error) {
    throw new Error(`Failed to load template ${templateFile}: ${error}`);
  }
}

/**
 * Gather framework context
 */
async function gatherFrameworkContext(): Promise<GateContext> {
  // Get list of agents
  const agentFiles = await readdir(AGENTS_DIR);
  const agents = agentFiles
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => f.replace(".md", ""));

  return {
    agents_list: agents.join(", "),
    intent_enrichment_enabled: true,
    parallel_threshold: 3,
  };
}

/**
 * Gather agent context
 */
async function gatherAgentContext(agentFile: string): Promise<GateContext> {
  // agentFile may be "security.md" or "agents/security.md"
  const fileName = agentFile.replace("agents/", "").replace(".md", "");
  const agentName = fileName;
  const agentPath = join(AGENTS_DIR, `${agentName}.md`);

  try {
    const content = await readFile(agentPath, "utf-8");

    // Extract domain from file (look for "Domain:" line)
    const domainMatch = content.match(/\*\*Domain:\*\*\s*(.+)/);
    const domain = domainMatch
      ? domainMatch[1].trim()
      : "Specialized agent domain";

    // Get skills that this agent can load
    const skillDirs = await readdir(SKILLS_DIR);
    const agentSkills: string[] = [];

    for (const skillDir of skillDirs) {
      const skillPath = join(SKILLS_DIR, skillDir);
      const skillStat = await stat(skillPath);

      if (skillStat.isDirectory()) {
        const skillMdPath = join(skillPath, "SKILL.md");
        try {
          const skillContent = await readFile(skillMdPath, "utf-8");
          // Check if skill requires this agent
          const agentMatch = skillContent.match(/agent:\s*(\w+)/);
          if (agentMatch && agentMatch[1] === agentName) {
            agentSkills.push(skillDir);
          }
        } catch {
          // Skip if SKILL.md doesn't exist
        }
      }
    }

    // Define what this agent handles based on agent name
    const agentTasks = getAgentTasks(agentName);
    const agentNotTasks = getAgentNotTasks(agentName);

    return {
      agent_name: agentName,
      agent_domain: domain,
      agent_tasks: agentTasks,
      agent_not_tasks: agentNotTasks,
      skills_list: agentSkills.join(", "),
    };
  } catch (error) {
    throw new Error(`Failed to gather context for ${agentFile}: ${error}`);
  }
}

/**
 * Gather skill context
 */
async function gatherSkillContext(skillPath: string): Promise<GateContext> {
  // skillPath may be "security/SKILL.md" or "skills/pentest/SKILL.md"
  const parts = skillPath.replace("skills/", "").replace("/SKILL.md", "").split("/");
  const skillName = parts[0];
  const skillMdPath = join(SKILLS_DIR, skillName, "SKILL.md");

  try {
    const content = await readFile(skillMdPath, "utf-8");

    // Extract agent requirement from frontmatter
    const agentMatch = content.match(/agent:\s*(\w+)/);
    const agentName = agentMatch ? agentMatch[1] : "unknown";

    // Extract description from frontmatter
    const descMatch = content.match(/description:\s*(.+)/);
    const description = descMatch
      ? descMatch[1].trim()
      : "Skill description";

    return {
      skill_name: skillName,
      agent_name: agentName,
      skill_description: description,
    };
  } catch (error) {
    throw new Error(`Failed to gather context for ${skillPath}: ${error}`);
  }
}

/**
 * Get tasks an agent handles (based on agent name)
 */
function getAgentTasks(agentName: string): string {
  const taskMap: Record<string, string> = {
    security:
      "- Security testing (pentest, vuln scan, code review)\n- Risk assessment and threat modeling\n- Compliance validation\n- Segmentation testing",
    writer:
      "- Blog post creation\n- Technical documentation\n- Security reports\n- Content QA and review",
    engineer:
      "- Infrastructure implementation\n- Remediation and hardening\n- System configuration\n- Deployment automation",
    advisor:
      "- Career guidance and analysis\n- Personal development planning\n- OSINT research\n- Quality assurance review",
    legal:
      "- Legal compliance analysis\n- Regulatory risk assessment\n- Citation verification\n- Jurisdictional research",
  };

  return taskMap[agentName] || "- Specialized domain tasks";
}

/**
 * Get tasks an agent does NOT handle
 */
function getAgentNotTasks(agentName: string): string {
  const notTaskMap: Record<string, string> = {
    security:
      "- Content writing or publishing\n- Infrastructure implementation\n- Career advice\n- Legal analysis",
    writer:
      "- Security testing or auditing\n- Infrastructure deployment\n- Compliance assessment\n- Code implementation",
    engineer:
      "- Security testing (delegate to security agent)\n- Content creation (delegate to writer agent)\n- Legal compliance (delegate to legal agent)",
    advisor:
      "- Security testing\n- Infrastructure implementation\n- Legal compliance\n- Content publishing",
    legal:
      "- Security testing or implementation\n- Content writing\n- Infrastructure deployment\n- Career guidance",
  };

  return notTaskMap[agentName] || "- Tasks outside specialized domain";
}

/**
 * Replace template variables with context
 */
function replaceTemplateVariables(
  template: string,
  context: GateContext
): string {
  let result = template;

  // Replace all context variables
  for (const [key, value] of Object.entries(context)) {
    const placeholder = `{${key}}`;
    result = result.replace(new RegExp(placeholder, "g"), String(value));
  }

  return result;
}

/**
 * Generate routing gate with Haiku
 * For MVP: Returns template directly
 * For production: Sends to Haiku API for generation
 */
async function generateWithHaiku(
  template: string,
  context: GateContext
): Promise<string> {
  // MVP: Return template with variables replaced
  // TODO: Integrate with Haiku API for actual generation

  const filledTemplate = replaceTemplateVariables(template, context);

  // For now, return the filled template
  // In production, this would be sent to Haiku with instructions:
  // "Generate a concise routing gate based on this template. Preserve
  // blockquote formatting, emoji, and command language. Output only the gate."

  return filledTemplate;
}

/**
 * Integrate routing gate into target file
 * Replaces lines 0-15 with generated gate
 */
async function integrateRoutingGate(
  gateContent: string,
  targetFile: string
): Promise<void> {
  const targetPath = join(FRAMEWORK_ROOT, targetFile);

  try {
    // Read existing file
    const existingContent = await readFile(targetPath, "utf-8");
    const lines = existingContent.split("\n");

    // Find where to insert (after routing gate, look for separator or frontmatter)
    let insertPoint = 15;

    // For skills, look for the first non-blockquote line or frontmatter
    if (targetFile.includes("SKILL.md")) {
      for (let i = 0; i < Math.min(lines.length, 30); i++) {
        if (lines[i].startsWith("---") && i > 5) {
          insertPoint = i;
          break;
        }
      }
    }

    // Preserve content after routing gate
    const remainingContent = lines.slice(insertPoint).join("\n");

    // Combine gate + remaining content
    const newContent = `${gateContent}\n\n${remainingContent}`;

    // Write back
    await writeFile(targetPath, newContent, "utf-8");
  } catch (error) {
    throw new Error(`Failed to integrate gate into ${targetFile}: ${error}`);
  }
}

/**
 * Generate routing gate for a single file
 */
async function generateRoutingGate(
  type: "framework" | "agent" | "skill",
  targetFile: string
): Promise<GenerationResult> {
  try {
    console.log(`Generating ${type} gate for ${targetFile}...`);

    // 1. Load template
    const template = await loadTemplate(type);

    // 2. Gather context
    let context: GateContext;
    if (type === "framework") {
      context = await gatherFrameworkContext();
    } else if (type === "agent") {
      context = await gatherAgentContext(targetFile);
    } else {
      // skill
      context = await gatherSkillContext(targetFile);
    }

    // 3. Generate with Haiku
    const gateContent = await generateWithHaiku(template, context);

    // 4. Integrate into file
    await integrateRoutingGate(gateContent, targetFile);

    console.log(`✓ Generated gate for ${targetFile}`);

    return {
      gateContent,
      targetFile,
      success: true,
    };
  } catch (error) {
    console.error(`✗ Failed to generate gate for ${targetFile}:`, error);
    return {
      gateContent: "",
      targetFile,
      success: false,
      error: String(error),
    };
  }
}

/**
 * Generate all routing gates (24 files)
 */
async function generateAllGates(): Promise<void> {
  console.log("Generating all routing gates...\n");

  const results: GenerationResult[] = [];

  // 1. Framework gate (CLAUDE.md)
  results.push(await generateRoutingGate("framework", "CLAUDE.md"));

  // 2. Agent gates (5 agents)
  const agentFiles = await readdir(AGENTS_DIR);
  for (const agentFile of agentFiles) {
    if (agentFile.endsWith(".md") && agentFile !== "README.md") {
      results.push(await generateRoutingGate("agent", `agents/${agentFile}`));
    }
  }

  // 3. Skill gates (all skills with SKILL.md)
  const skillDirs = await readdir(SKILLS_DIR);
  for (const skillDir of skillDirs) {
    const skillPath = join(SKILLS_DIR, skillDir);
    const skillStat = await stat(skillPath);

    if (skillStat.isDirectory()) {
      const skillMdPath = join(skillPath, "SKILL.md");
      try {
        await stat(skillMdPath);
        results.push(
          await generateRoutingGate("skill", `skills/${skillDir}/SKILL.md`)
        );
      } catch {
        // Skip if SKILL.md doesn't exist
        console.log(`⊘ Skipping ${skillDir} (no SKILL.md)`);
      }
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("Generation Summary");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`Total: ${results.length}`);
  console.log(`✓ Successful: ${successful}`);
  console.log(`✗ Failed: ${failed}`);

  if (failed > 0) {
    console.log("\nFailed files:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.targetFile}: ${r.error}`);
      });
  }

  console.log("\nNext steps:");
  console.log("1. Run validation: bun run tools/validation/validate-routing-gates.ts --all");
  console.log("2. Review generated gates manually");
  console.log("3. Commit if validation passes");
}

// CLI interface
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.includes("--all")) {
    // Generate all gates
    generateAllGates().catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });
  } else {
    // Generate single gate
    const typeIndex = args.indexOf("--type");
    const targetIndex = args.indexOf("--target");

    if (typeIndex === -1 || targetIndex === -1) {
      console.error("Usage:");
      console.error(
        "  bun run tools/framework/generators/routing-gate-generator.ts --type <framework|agent|skill> --target <file>"
      );
      console.error("  bun run tools/framework/generators/routing-gate-generator.ts --all");
      console.error("\nExamples:");
      console.error(
        "  bun run tools/framework/generators/routing-gate-generator.ts --type framework --target CLAUDE.md"
      );
      console.error(
        "  bun run tools/framework/generators/routing-gate-generator.ts --type agent --target agents/security.md"
      );
      console.error(
        "  bun run tools/framework/generators/routing-gate-generator.ts --type skill --target skills/pentest/SKILL.md"
      );
      process.exit(1);
    }

    const type = args[typeIndex + 1] as "framework" | "agent" | "skill";
    const target = args[targetIndex + 1];

    if (!["framework", "agent", "skill"].includes(type)) {
      console.error("Invalid type. Must be: framework, agent, or skill");
      process.exit(1);
    }

    generateRoutingGate(type, target)
      .then((result) => {
        if (!result.success) {
          process.exit(1);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
      });
  }
}
