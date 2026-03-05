# Environment Setup: [Skill Name]

**This skill requires API credentials or external integrations.**

---

## Required Credentials

| Credential | Service | Required | Documentation |
|-----------|---------|----------|----------------|
| `{KEY_NAME_1}` | {Service 1} | Yes | [Official Docs]({link}) |
| `{KEY_NAME_2}` | {Service 2} | No | [Official Docs]({link}) |

---

## Setup Instructions

### Step 1: Obtain Credentials

#### {Service 1}
1. Go to {login-url}
2. Navigate to Settings → API Keys
3. Create a new API key with permissions: {permissions}
4. Copy the key (you won't see it again)

**Where to get it:** {service-link}

#### {Service 2}
1. Go to {login-url}
2. Click on Account Settings
3. Select "API Access"
4. Generate new token
5. Copy the token value

**Where to get it:** {service-link}

---

## Configuration in `.env.structure.yaml`

Add this section to your `.env.structure.yaml` file (maintaining alphabetical order by `id`):

```yaml
- id: {skill-id}
  name: "{Skill Name}"
  description: "Brief description of what this skill does"
  commands:
    - /{command-name}
  order: XX  # Adjust based on position in file
  keys:
    - name: {API_KEY_NAME_1}
      type: api_key
      required: true
      description: "Description of what this credential authenticates"
      documentation: "https://service1.com/docs/api"
      how_to_get: |
        1. Login to your Service 1 account
        2. Go to Settings → API Keys
        3. Click "Create New Key"
        4. Copy the generated key value

    - name: {API_KEY_NAME_2}
      type: api_token
      required: false
      description: "Description of optional credential"
      documentation: "https://service2.com/docs/tokens"
      how_to_get: |
        1. Navigate to https://service2.com/settings
        2. Select "API Access"
        3. Click "Generate Token"
        4. Copy the token
```

---

## Loading Credentials into `.env`

Once you've added the section to `.env.structure.yaml`, add the actual credentials to your `.env` file:

```bash
# {Skill Name}
{API_KEY_NAME_1}=your-actual-key-here
{API_KEY_NAME_2}=your-actual-token-here
```

---

## Verification Steps

### 1. Check Environment Variable is Loaded

```bash
# Test that credential is available
source .env
echo $API_KEY_NAME_1
# Should output: your-key-value

# If empty, credential not loaded properly
```

### 2. Test Skill with Credentials

```bash
# Invoke skill to verify credentials work
/{command-name}

# If successful: "Authenticated with Service 1 ✓"
# If failed: Check credential value and permissions
```

### 3. Review Permissions

Ensure the credentials have the following permissions:
- {Permission 1}
- {Permission 2}
- {Permission 3}

**Insufficient permissions will cause:** [specific error messages]

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid credentials" | Wrong API key | Verify key value in `.env` matches Service 1 settings |
| "Permission denied" | Credentials lack required scopes | Regenerate key with additional permissions |
| "Credentials not found" | Variable not loaded | Run `source .env` and verify with `echo $KEY_NAME` |
| "{Service} connection timeout" | Network/firewall issue | Check firewall rules allow connection to service |

---

## Security Best Practices

⚠️ **CRITICAL - Follow these rules:**

1. **Never commit credentials** - `.env` is gitignored
2. **Rotate regularly** - Regenerate keys periodically
3. **Limit scope** - Give credentials minimum required permissions
4. **Use service-specific keys** - Don't reuse production keys for testing
5. **Monitor usage** - Check service logs for suspicious activity


---

## Getting Help

If credentials don't work:

1. Verify credential value is correct (no extra spaces/quotes)
2. Check service documentation for current API endpoints
3. Verify permissions in service dashboard
4. Check that `source .env` is run before invoking skill
5. Review skill logs for specific error messages

---

**Last Updated:** YYYY-MM-DD
**Service Documentation Links:**
- [Service 1 API Docs]({link})
- [Service 2 API Docs]({link})
