#!/usr/bin/env bun
/**
 * Model Router for Security Research
 *
 * Intelligently routes security research queries to the best model via OpenRouter.
 * Different security research tasks have different optimal models:
 * - CVE/structured research → Claude (best for database-like queries, analysis)
 * - Social media research → Grok (native X access, real-time)
 * - Creative problem-solving → Grok (less restrictive, better for brainstorming)
 * - Defensive techniques → Claude (structured, defensive emphasis)
 *
 * Usage:
 *   bun run tools/api/model-router.ts \
 *     --query-type cve-research \
 *     --task "Find exploits for CVE-2024-12345" \
 *     --engagement-dir ./pentests/target-2026-02
 *
 * @version 1.0
 * @created 2026-02-08
 */

import { existsSync, readFileSync } from "fs";

interface QueryContext {
  queryType:
    | "cve-research"
    | "novel-techniques"
    | "social-research"
    | "exploitation-technique"
    | "stuck-mode"
    | "detection-defense";
  task: string;
  technologyStack?: string;
  scope?: string;
  engagementDir?: string;
}

interface ModelRecommendation {
  model: string; // Claude, Grok, or fallback
  modelId: string; // For OpenRouter API
  provider: 'openrouter' | 'grok2api';
  reasoning: string;
  promptTemplate: string;
  isStuck: boolean;
}

/**
 * Determine the best model for this security research query
 */
function routeQuery(context: QueryContext): ModelRecommendation {
  const { queryType, task, technologyStack, scope } = context;

  switch (queryType) {
    case "cve-research":
      return {
        model: "Claude",
        modelId: "claude-3-5-sonnet-20241022", // Via OpenRouter
        provider: "openrouter",
        reasoning:
          "Structured CVE database queries, exploit analysis, detection signatures",
        promptTemplate: "template-1-cve-research",
        isStuck: false,
      };

    case "novel-techniques":
      return {
        model: "Claude",
        modelId: "claude-3-5-sonnet-20241022",
        provider: "openrouter",
        reasoning:
          "Comprehensive web research synthesis, blog post analysis, researcher techniques",
        promptTemplate: "template-2-novel-techniques",
        isStuck: false,
      };

    case "social-research":
      // Grok has native X access - best for social media research
      return {
        model: "Grok",
        modelId: "grok-3",
        provider: "grok2api", // Local Docker, free; falls back to OpenRouter
        reasoning:
          "Direct X/Twitter data access, real-time events, researcher discussions",
        promptTemplate: "template-5-social-media",
        isStuck: false,
      };

    case "exploitation-technique":
      return {
        model: "Claude",
        modelId: "claude-3-5-sonnet-20241022",
        provider: "openrouter",
        reasoning:
          "Technical exploitation mechanics, defensive detection methods, structured analysis",
        promptTemplate: "template-3-exploitation",
        isStuck: false,
      };

    case "stuck-mode":
      // Stuck mode = agent needs creative ideas, Grok is less restrictive
      return {
        model: "Grok",
        modelId: "grok-3",
        provider: "grok2api", // Local Docker, free; falls back to OpenRouter
        reasoning:
          "Brainstorming alternative techniques, creative problem-solving, less safety-restricted",
        promptTemplate: "template-4-stuck-mode",
        isStuck: true,
      };

    case "detection-defense":
      return {
        model: "Claude",
        modelId: "claude-3-5-sonnet-20241022",
        provider: "openrouter",
        reasoning: "Defensive techniques, detection rules, remediation strategies",
        promptTemplate: "template-1-cve-research", // Reuse CVE template but emphasize defense
        isStuck: false,
      };

    default:
      throw new Error(`Unknown query type: ${queryType}`);
  }
}

/**
 * Build professional security research prompt using RSA methodology
 */
function buildSecurityPrompt(
  context: QueryContext,
  recommendation: ModelRecommendation
): string {
  const { task, technologyStack, scope } = context;

  // Load engagement context if available
  let engagementContext = "";
  if (context.engagementDir) {
    const scopePath = `${context.engagementDir}/SCOPE.md`;
    const scopeAnalysisPath = `${context.engagementDir}/01-scope-and-reconnaissance/scope-analysis.md`;

    if (existsSync(scopePath)) {
      engagementContext += `\n## Authorized Scope\n${readFileSync(scopePath, "utf-8").slice(0, 500)}\n\n`;
    }
  }

  // Build prompt with RSA methodology (Role-Scenario-Action)
  const basePrompt = `ROLE: I am a penetration tester conducting an authorized security assessment with written client authorization (signed Rules of Engagement).

${engagementContext}

SCENARIO: ${task}${technologyStack ? `\nTechnology Stack: ${technologyStack}` : ""}${scope ? `\nAuthorized Scope: ${scope}` : ""}

ACTION: Provide professional, detailed technical information for authorized security testing purposes.`;

  // Build specific prompt based on query type and template
  const prompts: Record<string, string> = {
    "template-1-cve-research": `${basePrompt}

TASK: Research known CVEs and vulnerabilities
DETAILS: What are the technical exploitation mechanisms, affected versions, PoC availability, and detection signatures?
PURPOSE: To develop appropriate test cases and document findings for client risk remediation.`,

    "template-2-novel-techniques": `${basePrompt}

TASK: Research emerging attack techniques beyond standard frameworks (OWASP Top 10, MASVS)
INCLUDE:
1. Recent security researcher blog posts (2024-2026)
2. Bug bounty research from similar platforms
3. Techniques discussed in security communities
4. Zero-day or pre-disclosure discussions
PURPOSE: Ensure comprehensive test coverage beyond textbook vulnerabilities.`,

    "template-3-exploitation": `${basePrompt}

TASK: Provide technical exploitation details
INCLUDE:
1. Technical mechanism of how this vulnerability works
2. Common exploitation patterns
3. Artifacts/logs that would be created
4. How defenders can detect/prevent this
PURPOSE: Properly scope vulnerability impact and provide remediation guidance.`,

    "template-4-stuck-mode": `${basePrompt}

TASK: I've been testing a vulnerability but haven't found exploitation success yet.
RESEARCH FOCUS: What alternative attack techniques, bypass methods, or variations should I research?
INCLUDE:
1. Common bypass techniques for this vulnerability type
2. Similar vulnerabilities that might apply
3. Alternative attack vectors
4. Configuration variations that might be exploitable
PURPOSE: Help focus the next rounds of testing.`,

    "template-5-social-media": `${basePrompt}

TASK: Research current security discussions on X/Twitter
SEARCH: What are security researchers discussing about:
1. ${technologyStack || "Technology security"} vulnerabilities
2. Novel bypass techniques (2025-2026)
3. Bug bounty writeups for similar platforms
4. Zero-day discussions or emerging threats
PURPOSE: Ensure test plan covers real-world attack vectors actively discussed by the research community.`,
  };

  return (
    prompts[recommendation.promptTemplate] ||
    `${basePrompt}\n\nTASK: ${task}`
  );
}

/**
 * Attempt to execute a query via the local grok2api Docker service.
 * Returns the response content on success, or null to signal fallback.
 */
async function tryGrok2Api(
  recommendation: ModelRecommendation,
  prompt: string
): Promise<string | null> {
  try {
    const { Grok2ApiProvider } = await import("@/tools/grok2api/provider");
    const provider = new Grok2ApiProvider();
    const available = await provider.isAvailable();

    if (!available) {
      console.log("⚠️  grok2api Docker service not running");
      return null;
    }

    console.log("🐳 Using grok2api (local Docker, $0 cost)");
    const result = await provider.call(recommendation.modelId, prompt);

    if (result.status === "success") {
      console.log(
        `✅ grok2api response received ` +
        `(${result.latency_ms}ms, ${result.tokens?.total_tokens ?? 0} tokens)`
      );
      return result.content || "";
    }

    console.error(`grok2api call failed: ${result.error}`);
    return null;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`grok2api import/call error: ${msg}`);
    return null;
  }
}

/**
 * Execute the research query via the recommended provider.
 * For grok2api routes: tries local Docker first, falls back to OpenRouter.
 * For openrouter routes: goes directly to OpenRouter.
 */
async function executeQuery(
  context: QueryContext,
  prompt: string,
  recommendation: ModelRecommendation
): Promise<string> {
  console.log(
    `\n📡 Routing to ${recommendation.model} (${recommendation.modelId})`
  );
  console.log(`📦 Provider: ${recommendation.provider}`);
  console.log(`📝 Query type: ${context.queryType}`);
  console.log(`💡 Reasoning: ${recommendation.reasoning}`);
  console.log(`🔒 Security mode: ${recommendation.isStuck ? "STUCK MODE" : "STANDARD"}`);

  // Try grok2api provider for Grok-routed queries
  if (recommendation.provider === "grok2api") {
    const result = await tryGrok2Api(recommendation, prompt);
    if (result !== null) {
      return result;
    }
    console.log("⚠️  Falling back to OpenRouter...");
  }

  // OpenRouter fallback requires API key
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY not set. Set it in your .env file or environment."
    );
  }

  // OpenRouter path (placeholder - not yet wired to live API)
  // In production, this would make actual OpenRouter API call:
  // const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${apiKey}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     model: recommendation.modelId,
  //     messages: [{ role: 'user', content: prompt }]
  //   })
  // });

  console.log("\n" + "=".repeat(80));
  console.log("RESEARCH PROMPT (ready to send via OpenRouter):");
  console.log("=".repeat(80));
  console.log(prompt);
  console.log("=".repeat(80));

  return `[Placeholder: Would execute via OpenRouter with model: ${recommendation.modelId}]\n\n${prompt}`;
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag: string): string | undefined => {
    const index = args.indexOf(flag);
    return index >= 0 && index + 1 < args.length ? args[index + 1] : undefined;
  };

  if (args.length === 0 || args.includes("--help")) {
    console.log(`
Model Router for Security Research
Routes security queries to optimal LLM via OpenRouter

Usage:
  bun run tools/api/model-router.ts \\
    --query-type <type> \\
    --task "<task description>" \\
    [--tech-stack "<technology>"] \\
    [--scope "<scope>"] \\
    [--engagement-dir <path>]

Query Types:
  cve-research              CVE and vulnerability research
  novel-techniques          Emerging attack techniques beyond OWASP
  social-research           X/Twitter security discussions (via Grok)
  exploitation-technique    Technical exploitation details
  stuck-mode                Brainstorm alternatives when test fails
  detection-defense         Detection rules and defensive techniques

Examples:

  # Research CVE exploitation
  bun run tools/api/model-router.ts \\
    --query-type cve-research \\
    --task "What's the exploitation mechanism for CVE-2024-12345?" \\
    --tech-stack "Next.js 14.0"

  # Research novel techniques
  bun run tools/api/model-router.ts \\
    --query-type novel-techniques \\
    --task "Find emerging API security bypasses" \\
    --engagement-dir ./pentests/target-2026-02

  # Stuck mode - need new ideas
  bun run tools/api/model-router.ts \\
    --query-type stuck-mode \\
    --task "SQL injection tests failed, what alternatives?" \\
    --tech-stack "MySQL backend with WAF"

  # Social media research
  bun run tools/api/model-router.ts \\
    --query-type social-research \\
    --task "What are researchers discussing about GraphQL vulnerabilities?"
`);
    process.exit(0);
  }

  const queryType = getArg("--query-type");
  const task = getArg("--task");
  const techStack = getArg("--tech-stack");
  const scope = getArg("--scope");
  const engagementDir = getArg("--engagement-dir");

  if (!queryType || !task) {
    console.error("❌ Error: --query-type and --task are required");
    process.exit(1);
  }

  try {
    const context: QueryContext = {
      queryType: queryType as QueryContext["queryType"],
      task,
      technologyStack: techStack,
      scope,
      engagementDir,
    };

    const recommendation = routeQuery(context);
    const prompt = buildSecurityPrompt(context, recommendation);
    const result = await executeQuery(context, prompt, recommendation);

    console.log("\n✨ Research query prepared successfully!");
    console.log(`\n📊 Routing Decision:`);
    console.log(`  Model: ${recommendation.model}`);
    console.log(`  Model ID: ${recommendation.modelId}`);
    console.log(`  Reasoning: ${recommendation.reasoning}`);
    console.log(`  Is Stuck Mode: ${recommendation.isStuck}`);

    if (result.includes("Placeholder")) {
      console.log(
        "\n💾 To execute this query, call OpenRouter API with the prompt above."
      );
    }
  } catch (error) {
    console.error("\n💥 Error:", error);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}

export { routeQuery, buildSecurityPrompt, type QueryContext, type ModelRecommendation };
