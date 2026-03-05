# Environment Setup - Write Skill

**How to configure credentials for the write skill**

---

## Overview

The write skill requires API credentials for AI image generation capability. This guide covers how to obtain and configure the required API key.

---

## Required Credentials

### OpenRouter API Key

**Service:** OpenRouter AI
**Purpose:** AI image generation (optional workflow step)
**Environment Variable:** `OPENROUTER_API_KEY`

---

## Setup Instructions

### Step 1: Obtain OpenRouter API Key

1. **Visit OpenRouter:**
   Go to https://openrouter.ai

2. **Create account or sign in:**
   Sign up for a new account or log into existing account

3. **Navigate to API Keys:**
   Find the API keys section in your account dashboard

4. **Generate new API key:**
   Click "Create API Key" or similar button
   Copy the generated key (it won't be shown again)

5. **Note the key safely:**
   Store in password manager or secure location

---

### Step 2: Add to .env File

1. **Open .env file:**
   ```bash
   cd ~/ia-framework-private
   nano .env  # or use your preferred editor
   ```

2. **Add the API key:**
   ```bash
   # OpenRouter AI - Image generation for write skill
   OPENROUTER_API_KEY=[insert key]
   ```

3. **Save and close:**
   Save the file (Ctrl+O, Enter, Ctrl+X in nano)

---

### Step 3: Verify Setup

1. **Source the .env file:**
   ```bash
   source .env
   ```

2. **Check the key is loaded:**
   ```bash
   echo $OPENROUTER_API_KEY
   ```

   **Expected output:** Your API key should be displayed

3. **If empty:**
   - Check that .env file has the correct variable name
   - Ensure no typos in variable name
   - Try sourcing .env again

---

## Usage in Write Skill

The `OPENROUTER_API_KEY` is used during **Phase 4: VISUALS** (optional).

**Workflow:**
1. During VISUALS phase, you'll be asked if images are needed
2. If yes, the skill will use the OpenRouter API to generate images
3. If no, the VISUALS phase is skipped entirely

**Note:** Image generation is an optional step - you can always skip it if images aren't needed for your content.

---

## Security Best Practices

### Protect Your Credentials

- **Never commit .env to git** - Already in .gitignore
- **Never share API keys** - Keep them private
- **Use separate keys** - Don't share keys across projects
- **Rotate periodically** - Change keys regularly for security
- **Revoke if compromised** - Immediately revoke exposed keys

### Framework Enforcement

The framework enforces credential security through:

- Pre-commit hooks block hardcoded credentials
- .env file is gitignored by default
- Scripts load credentials from .env only
- No credentials in code or configuration files

---

## Troubleshooting

### API Key Not Found

**Symptom:** Error message "OPENROUTER_API_KEY not set"

**Solutions:**
1. Verify .env file contains the key
2. Source the .env file: `source .env`
3. Check for typos in variable name
4. Ensure no spaces around the = sign

### API Key Invalid

**Symptom:** Error message "Invalid API key" or 401 Unauthorized

**Solutions:**
1. Verify you copied the complete key
2. Check for extra spaces or characters
3. Regenerate the key in OpenRouter dashboard
4. Update .env with new key

### Image Generation Fails

**Symptom:** Images don't generate even with valid key

**Solutions:**
1. Check OpenRouter account has credits/balance
2. Verify API key has proper permissions
3. Check OpenRouter service status
4. Try with different image model in prompt

---

## Cost Considerations

### OpenRouter Pricing

- **Image generation:** Varies by model used
- **Typical cost:** $0.01-0.10 per image (depends on model)
- **Billing:** Pay-as-you-go, credits required

**Tips to manage costs:**
- Skip VISUALS phase when images aren't needed
- Use less expensive image models
- Generate fewer images per content piece
- Monitor usage in OpenRouter dashboard

---

## Alternative: Skip Image Generation

If you don't want to use image generation:

**Option 1:** Skip VISUALS phase during workflow
When asked "Do you want to generate images?", select "No"

**Option 2:** Don't configure API key
The skill will work without OPENROUTER_API_KEY for all phases except VISUALS

**Option 3:** Add images manually
Generate images elsewhere and add to content manually

---

## Related Documentation

- **Credential handling:** See framework `docs/standards/credential-handling-enforcement.md`
- **Image style template:** `skills/write/templates/image-style-template.md`
- **VISUALS phase:** `skills/write/phases/04-visuals.md`

---

**Version:** 1.0
**Last Updated:** 2026-01-20
