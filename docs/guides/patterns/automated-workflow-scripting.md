# Automated Workflow Scripting Pattern

**Classification:** Public (reusable pattern documentation)
**Framework:** Intelligence Adjacent (IA)
**Last Updated:** 2026-02-04

---

## Overview

The **automated workflow scripting pattern** provides best practices for creating TypeScript/JavaScript scripts that orchestrate multi-phase workflows, manage state, and handle error recovery.

---

## Script Architecture

### Directory Structure

```
skills/example/
├── scripts/
│   ├── workflow-orchestrator.ts    # Main entry: phase detection & routing
│   ├── phase-runner.ts             # Execute specific phase
│   ├── gate-validator.ts           # Validate phase gates
│   ├── state-manager.ts            # metadata.json management
│   └── utils/
│       ├── file-handler.ts         # Read/write files
│       ├── logger.ts               # Progress reporting
│       └── errors.ts               # Error handling
├── phases/
│   ├── 00-workflow.md              # Phase detection doc
│   ├── 01-phase.md                 # Phase implementation
│   ├── 02-phase.md
│   └── ...
└── output/
    └── workflows/
        └── YYYY-MM-DD-id/
            ├── metadata.json
            └── phase-outputs/
```

---

## Core Scripts

### 1. State Manager Script

**File: `scripts/state-manager.ts`**

Manages `metadata.json` lifecycle:

```typescript
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Phase {
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'skipped';
  started_at: string | null;
  completed_at: string | null;
  gate_passed: boolean | null;
  gate_reason: string;
  outputs: string[];
}

interface WorkflowMetadata {
  workflow_id: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'blocked';
  current_phase: number;
  phases: Record<string, Phase>;
}

class StateManager {
  private metadataPath: string;

  constructor(workflowId: string) {
    this.metadataPath = `output/${workflowId}/metadata.json`;
  }

  load(): WorkflowMetadata {
    try {
      const content = readFileSync(this.metadataPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to load metadata: ${error}`);
    }
  }

  save(metadata: WorkflowMetadata): void {
    metadata.updated_at = new Date().toISOString();
    try {
      writeFileSync(
        this.metadataPath,
        JSON.stringify(metadata, null, 2)
      );
    } catch (error) {
      throw new Error(`Failed to save metadata: ${error}`);
    }
  }

  updatePhase(
    phaseNumber: number,
    updates: Partial<Phase>
  ): void {
    const metadata = this.load();
    const phaseKey = `${phaseNumber}_${Object.keys(metadata.phases)[phaseNumber - 1]?.split('_')[1]}`;

    if (metadata.phases[phaseKey]) {
      metadata.phases[phaseKey] = {
        ...metadata.phases[phaseKey],
        ...updates
      };
      this.save(metadata);
    }
  }

  getCurrentPhase(): number {
    const metadata = this.load();
    return metadata.current_phase;
  }

  advancePhase(): void {
    const metadata = this.load();
    metadata.current_phase++;
    this.save(metadata);
  }
}

export { StateManager, WorkflowMetadata, Phase };
```

### 2. Gate Validator Script

**File: `scripts/gate-validator.ts`**

Validates phase gates:

```typescript
import { readFileSync } from 'fs';

interface GateValidation {
  passed: boolean;
  reason: string;
  failureMessage?: string;
  recoverySteps?: string[];
}

class GateValidator {
  // Gate 1: RESEARCH - 10+ sources
  static validateResearchGate(sourcesFile: string): GateValidation {
    try {
      const content = readFileSync(sourcesFile, 'utf-8');
      const sources = content
        .split('\n')
        .filter(line => line.trim().length > 0);

      if (sources.length < 10) {
        return {
          passed: false,
          reason: `Only ${sources.length} sources found`,
          failureMessage: 'Minimum 10 credible sources required',
          recoverySteps: [
            '1. Return to RESEARCH phase',
            '2. Gather additional credible sources',
            '3. Update sources.txt with new sources',
            '4. Re-run gate validation'
          ]
        };
      }

      return {
        passed: true,
        reason: `${sources.length} sources collected and documented`
      };
    } catch (error) {
      return {
        passed: false,
        reason: `Failed to read sources: ${error}`,
        failureMessage: 'Could not validate sources file'
      };
    }
  }

  // Gate 2: DRAFT - Brand voice applied
  static validateDraftGate(draftFile: string): GateValidation {
    try {
      const content = readFileSync(draftFile, 'utf-8');
      const wordCount = content.split(/\s+/).length;

      // Check minimum word count
      if (wordCount < 500) {
        return {
          passed: false,
          reason: `Only ${wordCount} words (need 500+)`,
          failureMessage: 'Draft must be at least 500 words',
          recoverySteps: [
            '1. Expand sections with more detail',
            '2. Add examples or explanations',
            '3. Verify brand voice template applied',
            '4. Re-run gate validation'
          ]
        };
      }

      // Check for brand voice markers
      const brandVoiceMarkers = [
        'I believe', 'I designed', 'I think',  // First person
        'You can', 'You need', 'Your goal'     // Second person
      ];

      const hasVoice = brandVoiceMarkers.some(marker =>
        content.toLowerCase().includes(marker.toLowerCase())
      );

      if (!hasVoice) {
        return {
          passed: false,
          reason: 'Brand voice template may not be applied',
          failureMessage: 'Draft does not match brand voice guidelines',
          recoverySteps: [
            '1. Review templates/brand-voice-template.md',
            '2. Apply brand voice to draft',
            '3. Use first/second person perspective',
            '4. Re-run gate validation'
          ]
        };
      }

      return {
        passed: true,
        reason: `${wordCount} words, brand voice applied`
      };
    } catch (error) {
      return {
        passed: false,
        reason: `Failed to validate draft: ${error}`
      };
    }
  }

  // Gate 3: QA - 5.0/5.0 rating
  static validateQAGate(qaFile: string): GateValidation {
    try {
      const content = readFileSync(qaFile, 'utf-8');
      const qa = JSON.parse(content);

      const rating = qa.overall_rating;

      if (rating < 5.0) {
        return {
          passed: false,
          reason: `QA rating is ${rating}/5.0 (need 5.0)`,
          failureMessage: 'Must achieve 5.0/5.0 quality rating',
          recoverySteps: [
            '1. Review feedback in QA report',
            '2. Address each failing criterion',
            '3. Update draft accordingly',
            '4. Re-run QA validation',
            '5. Repeat until 5.0/5.0 achieved'
          ]
        };
      }

      return {
        passed: true,
        reason: 'QA rating 5.0/5.0 achieved'
      };
    } catch (error) {
      return {
        passed: false,
        reason: `Failed to validate QA: ${error}`
      };
    }
  }
}

export { GateValidator, GateValidation };
```

### 3. Workflow Orchestrator Script

**File: `scripts/workflow-orchestrator.ts`**

Determines current phase and routes to appropriate handler:

```typescript
import { StateManager } from './state-manager';
import { GateValidator } from './gate-validator';

class WorkflowOrchestrator {
  private stateManager: StateManager;

  constructor(workflowId: string) {
    this.stateManager = new StateManager(workflowId);
  }

  run(): void {
    const metadata = this.stateManager.load();

    console.log(`\n🔄 Workflow Orchestrator`);
    console.log(`   ID: ${metadata.workflow_id}`);
    console.log(`   Current Phase: ${metadata.current_phase}`);
    console.log(`   Status: ${metadata.status}\n`);

    // Determine what to do based on current state
    this.routePhase(metadata.current_phase);
  }

  private routePhase(phaseNumber: number): void {
    const metadata = this.stateManager.load();
    const phaseKey = this.getPhaseKey(phaseNumber);
    const phase = metadata.phases[phaseKey];

    if (!phase) {
      console.error(`Phase ${phaseNumber} not found`);
      return;
    }

    switch (phase.status) {
      case 'pending':
        // Start new phase
        this.startPhase(phaseNumber);
        break;

      case 'in_progress':
        // Resume in-progress phase
        this.resumePhase(phaseNumber);
        break;

      case 'completed':
        // Check gate
        if (phase.gate_passed) {
          // Advance to next phase
          this.advancePhase(phaseNumber);
        } else {
          // Gate failed - retry
          console.log(`⚠️  Gate failed: ${phase.gate_reason}`);
          console.log(`📋 Retry Phase ${phaseNumber}`);
          this.retryPhase(phaseNumber);
        }
        break;

      case 'blocked':
        console.error(`🛑 Phase blocked: ${phase.gate_reason}`);
        break;
    }
  }

  private startPhase(phaseNumber: number): void {
    console.log(`🚀 Starting Phase ${phaseNumber}...`);
    const phaseKey = this.getPhaseKey(phaseNumber);

    this.stateManager.updatePhase(phaseNumber, {
      status: 'in_progress',
      started_at: new Date().toISOString()
    });

    // Execute phase (would import specific phase handler)
    // const handler = require(`./phases/phase-${phaseNumber}.ts`);
    // handler.execute();
  }

  private resumePhase(phaseNumber: number): void {
    console.log(`⏸️  Resuming Phase ${phaseNumber}...`);
    // Resume logic
  }

  private advancePhase(phaseNumber: number): void {
    console.log(`✅ Phase ${phaseNumber} complete - advancing...`);
    this.stateManager.advancePhase();
    this.run(); // Recurse to next phase
  }

  private retryPhase(phaseNumber: number): void {
    console.log(`🔄 Retrying Phase ${phaseNumber}...`);
    // Reset phase status and try again
  }

  private getPhaseKey(phaseNumber: number): string {
    const phases = ['research', 'draft', 'qa', 'visuals', 'output'];
    return `${phaseNumber}_${phases[phaseNumber - 1]}`;
  }
}

export { WorkflowOrchestrator };
```

### 4. Logger Script

**File: `scripts/utils/logger.ts`**

Consistent progress reporting:

```typescript
class Logger {
  static checkpoint(message: string, metadata: any): void {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                    CHECKPOINT REACHED                     ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
${this.formatMessage(message)}
${this.formatMetadata(metadata)}
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
  }

  static error(title: string, message: string, steps: string[]): void {
    console.error(`
❌ ${title}

${message}

Recovery steps:
${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
    `);
  }

  static success(message: string): void {
    console.log(`✅ ${message}`);
  }

  static info(message: string): void {
    console.log(`ℹ️  ${message}`);
  }

  static warning(message: string): void {
    console.log(`⚠️  ${message}`);
  }

  private static formatMessage(message: string): string {
    return `║ ${message.padEnd(55)} ║`;
  }

  private static formatMetadata(metadata: any): string {
    return Object.entries(metadata)
      .map(([key, value]) => `║ ${key}: ${value} ${' '.repeat(30 - key.length - String(value).length)} ║`)
      .join('\n');
  }
}

export { Logger };
```

---

## Environment Variable Pattern

**Load credentials from `.env` only:**

```typescript
// ✅ CORRECT - Load from .env
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  throw new Error('OPENROUTER_API_KEY not configured');
}

// ❌ WRONG - Never hardcode
const apiKey = 'sk-12345...'; // DANGER!
```

### .env Configuration

```bash
# .env (never commit to git)
OPENROUTER_API_KEY=[insert key]
GHOST_ADMIN_KEY=your_ghost_key_here
GHOST_API_URL=https://yourblog.ghost.io
```

### .env.example (commit to git)

```bash
# .env.example
OPENROUTER_API_KEY=[insert key]
GHOST_ADMIN_KEY=your_ghost_key_here
GHOST_API_URL=https://yourblog.ghost.io
```

---

## Error Handling Pattern

```typescript
class WorkflowError extends Error {
  constructor(
    public phase: number,
    public gate: string,
    message: string,
    public recoverySteps: string[] = []
  ) {
    super(message);
    this.name = 'WorkflowError';
  }
}

// Usage
throw new WorkflowError(
  1,
  'RESEARCH',
  'Fewer than 10 sources found',
  [
    '1. Return to RESEARCH phase',
    '2. Gather more sources',
    '3. Re-run validation'
  ]
);
```

---

## File Organization Pattern

```typescript
// ✅ GOOD - Well-organized structure
scripts/
├── workflow-orchestrator.ts
├── phase-runner.ts
├── gate-validator.ts
├── state-manager.ts
└── utils/
    ├── logger.ts
    ├── file-handler.ts
    └── errors.ts

// ❌ BAD - Monolithic structure
scripts/
└── everything.ts (5000 lines)
```

---

## Output File Management

```typescript
class FileHandler {
  static createOutputDirectory(workflowId: string): void {
    const dir = `output/${workflowId}`;
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  static saveFile(
    workflowId: string,
    filename: string,
    content: string
  ): string {
    const dir = `output/${workflowId}`;
    const path = join(dir, filename);
    writeFileSync(path, content, 'utf-8');
    return path;
  }

  static loadFile(workflowId: string, filename: string): string {
    const path = join(`output/${workflowId}`, filename);
    return readFileSync(path, 'utf-8');
  }

  static listOutputFiles(workflowId: string): string[] {
    const dir = `output/${workflowId}`;
    return readdirSync(dir).filter(f =>
      !f.startsWith('.')
    );
  }
}
```

---

## Testing Pattern

```typescript
import { test, expect } from 'bun:test';
import { GateValidator } from './gate-validator';

test('RESEARCH gate should fail with < 10 sources', () => {
  const result = GateValidator.validateResearchGate('test-sources.txt');
  expect(result.passed).toBe(false);
  expect(result.reason).toContain('sources');
});

test('RESEARCH gate should pass with 10+ sources', () => {
  const result = GateValidator.validateResearchGate('valid-sources.txt');
  expect(result.passed).toBe(true);
});

test('State manager should save and load metadata', () => {
  const manager = new StateManager('test-workflow');
  const metadata = { /* ... */ };
  manager.save(metadata);

  const loaded = manager.load();
  expect(loaded.workflow_id).toBe(metadata.workflow_id);
});
```

---

## Best Practices

1. **Single Responsibility** - Each script does one thing well
2. **Clear Logging** - Users see progress and next steps
3. **Error Context** - Errors include location and recovery
4. **State Tracking** - metadata.json is source of truth
5. **Idempotent** - Can re-run same phase safely
6. **Type Safe** - Use TypeScript for better error detection
7. **Environment Variables** - Credentials never in code
8. **Testable** - Scripts are designed for unit testing

---

## Real-World Examples

See implementation examples in:
- `skills/write/scripts/` - Write skill automation scripts
- `skills/ghost/scripts/` - Ghost blog automation scripts

Both demonstrate these patterns in production use.

---

**Framework:** Intelligence Adjacent (IA)
**Status:** Public pattern documentation
**Reusable:** Yes - adapt for your own workflow automation
