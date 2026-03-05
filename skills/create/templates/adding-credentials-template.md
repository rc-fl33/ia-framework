# Adding Credentials to {Skill Name}

**Process for adding API credentials or external integrations to this skill.**

---

## Current Status

- **env_required:** {true/false}
- **Current integrations:** {None / List of services}
- **setup.ts type:** {Minimal / Full}

---

## When to Add Credentials

Add credentials to this skill when:
- Integrating with external APIs (e.g., {example services relevant to this skill})
- Adding authentication to services
- Connecting to databases or cloud infrastructure
- Using third-party SDKs that require API keys

---

## Process Overview

### Step 1: Update SKILL.md Frontmatter

Edit `skills/{skill-folder}/SKILL.md`:

```yaml
---
name: {Skill Name}
# ... other fields ...
env_required: true  # Change from false or add this line
---
```

### Step 2: Create ../../private/docs/env-setup.md

Create `skills/{skill-folder}/../../private/docs/env-setup.md` using the template:

```bash
cp skills/create/templates/env-section-template.md skills/{skill-folder}/../../private/docs/env-setup.md
```

Fill in:
- Required credentials table
- Setup instructions for each service
- Verification steps
- Troubleshooting guide

### Step 3: Convert setup.ts to Full Version


**3a. Add required imports (if not present):**
```typescript
import { parseEnvFile, keyExists, getKeyValue, applyMergedEnvFile, backupEnvFile } from '../../../tools/env-sync/index.ts';
```

**3b. Populate REQUIRED_KEYS:**
```typescript
// Change from empty array to actual keys
const REQUIRED_KEYS: string[] = [
  '{SERVICE}_API_KEY',
  '{SERVICE}_API_URL',
  // Add all required ENV variable names
];
```

**3c. Add OPTIONAL_KEYS (if applicable):**
```typescript
const OPTIONAL_KEYS: string[] = [
  '{OPTIONAL_SERVICE}_TOKEN',
  // Add optional ENV variable names
];
```

**3d. Add ENV_SECTION template:**
```typescript
const ENV_SECTION = `
# =============================================================================
# {SKILL_NAME.toUpperCase()} SKILL
# =============================================================================
{SERVICE}_API_KEY=[insert key]
{SERVICE}_API_URL=https://api.example.com
`;
```

**3e. Implement testConnections():**
```typescript
export async function testConnections(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};

  // Test {Service Name}
  try {
    const apiKey = process.env.{SERVICE}_API_KEY;
    const apiUrl = process.env.{SERVICE}_API_URL;
    if (apiKey && apiUrl) {
      const response = await fetch(`${apiUrl}/health`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      results['{Service Name}'] = response.ok;
    } else {
      results['{Service Name}'] = false;
    }
  } catch {
    results['{Service Name}'] = false;
  }

  return results;
}
```

**3f. Add interactive configuration to runSetup():**
```typescript
function runSetup(): void {
  console.log('\n' + '='.repeat(50));
  console.log('{SKILL NAME} SETUP WIZARD');
  console.log('='.repeat(50));

  // Step 1: Check existing credentials
  console.log('\n🔍 STEP 1: Check Existing Configuration');
  const validation = await validateSetup();

  if (validation.success) {
    console.log('✅ All credentials configured');
  } else {
    console.log(`❌ Missing: ${validation.missing.join(', ')}`);
    console.log('\n📝 Add the following to your .env file:');
    console.log(ENV_SECTION);
  }

  // Step 2: Test connections
  console.log('\n🌐 STEP 2: Test Connectivity');
  const connections = await testConnections();
  for (const [service, status] of Object.entries(connections)) {
    console.log(`${status ? '✅' : '❌'} ${service}`);
  }

  console.log('\n' + '='.repeat(50));
}
```

### Step 4: Update .env.structure.yaml

Add to `.env.structure.yaml`:

```yaml
- id: {skill-id}
  name: "{Skill Name}"
  description: "{Skill description}"
  commands:
    - /{command-name}
  order: XX
  keys:
    - name: {SERVICE}_API_KEY
      type: api_key
      required: true
      description: "{Description of what this key does}"
      documentation: "https://service.com/docs/api"
      how_to_get: |
        1. Go to {service URL}
        2. Navigate to API settings
        3. Generate new key
        4. Copy the key value
```

### Step 5: Validate Setup

```bash
# Check credentials are properly configured

# Test service connectivity

# Run full setup wizard
```

---

## Skill-Specific Considerations

{Add any skill-specific notes here, such as:}
- {Likely integrations for this skill domain}
- {Special security considerations}
- {Rate limiting or quota concerns}
- {Backup/fallback services}

---

## Reference Documentation

- **General process:** `skills/create/docs/env-management-patterns.md`
- **ENV setup template:** `skills/create/templates/env-section-template.md`
- **Setup.ts template:** `skills/create/templates/setup-template.ts`
- **Credential security:** `docs/standards/credential-handling-enforcement.md`

---

**Last Updated:** {YYYY-MM-DD}
