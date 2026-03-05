---
type: reference
title: Integrations Catalog
classification: public
version: 1.0
last_updated: 2026-02-03
audience: intermediate
category: reference
related_docs:
  - docs/catalogs/skills.md
---

# Integrations Catalog

Comprehensive reference for external services and APIs integrated with the Intelligence Adjacent Framework. Each integration is documented with setup instructions, authentication requirements, and which skills use it.

**Last Updated:** 2026-02-03
**Total Integrations:** 13
**Source of Truth:** Skill `env_keys` arrays and API directories

---

## Integration Reference Matrix

| Service | Category | Auth Method | Status | Skills Using | Tier |
|---------|----------|------------|--------|--------------|------|
| Ghost CMS | Publishing | API Key | ✅ Implemented | ghost | 1 |
| OpenRouter | AI Models | API Key | ✅ Implemented | write, ghost, advisory, security | 2 |
| Context7 | AI Services | API Key | ✅ Implemented | advisory | 2 |
| Grok Imagine | Image Generation | API Key | ✅ Implemented | ghost | 2 |
| X/Twitter | Social Media | OAuth/API Key | 🔸 Paused | ghost | 2 |
| Stripe | Payment Processing | API Key | ⏸️ No active skill | - | 2 |
| Cal.com | Scheduling | OAuth/API Key | ⏸️ No active skill | - | 2 |
| SimpleFIN | Financial Data | OAuth | ✅ Implemented | notmint | 2 |
| Twingate | Network Access | OAuth | ✅ Implemented | notmint | 2 |
| HackerOne | Bug Bounties | Public Data | ✅ Implemented | bug-bounty | 1 |
| Intigriti | Bug Bounties | Public Data | ✅ Implemented | bug-bounty | 1 |
| Bugcrowd | Bug Bounties | Public Data | ✅ Implemented | bug-bounty | 1 |
| NVD | Vulnerability Data | Public API | ✅ Implemented | security | 1 |

---

## Integrations by Category

### Content Publishing

#### Ghost CMS
**Status:** ✅ Implemented
**Auth Method:** API Key
**Used By:** `ghost` skill
**Environment Variables:**
```
GHOST_ADMIN_API_KEY
GHOST_ADMIN_API_URL
```

**Purpose:** Blog publishing platform for IA Framework content
**Setup Guide:** `skills/ghost/docs/adding-credentials.md`
**Features:**
- Publish blog posts with metadata
- Create/update posts programmatically
- Schedule posts for publication
- Manage tags and categories
- Export analytics

**Integration Points:**
- Phase 5 of ghost workflow publishes to Ghost
- Newsletter automation syncs to Ghost subscribers
- Blog research and monitoring pulls from Ghost analytics

---

#### X / Twitter
**Status:** 🔸 Paused (ghost active)
**Auth Method:** API Keys + OAuth
**Used By:** `ghost` skill
**Environment Variables:**
```
TWITTER_API_KEY
TWITTER_API_SECRET
TWITTER_ACCESS_TOKEN
TWITTER_ACCESS_TOKEN_SECRET
TWITTER_BEARER_TOKEN
```

**Purpose:** Social media engagement and audience growth (via ghost skill)
**Features:**
- Ghost publishes blog posts to X
- Analytics track referral traffic from X

**Integration Points:**
- Ghost handles X posting

---

### AI Model Services

#### OpenRouter
**Status:** ✅ Implemented
**Auth Method:** API Key
**Used By:** `write`, `ghost`, `advisory`, `security` skills
**Environment Variables:**
```
OPENROUTER_API_KEY
OPENROUTER_BASE_URL (optional)
```

**Purpose:** Unified API access to multiple AI models
**Cost Optimization:** Route requests to cost-optimal models
**Supported Models:**
- Grok 4.1 Fast ($0.70/1M tokens)
- Claude Opus 4.5 ($7.20/1M tokens)
- Other open-source models

**Integration Points:**
- Skill tier selector routes requests to OpenRouter
- Cost optimization across all content creation
- Fallback routing if primary model unavailable

---

#### Context7
**Status:** ✅ Implemented
**Auth Method:** API Key
**Used By:** `advisory` skill
**Environment Variables:**
```
CONTEXT7_API_KEY
```

**Purpose:** Extended context and research API for advisory work
**Features:**
- Document analysis
- Research synthesis
- Content enhancement

**Integration Points:**
- Advisory skill uses for security research
- Architecture review uses for threat modeling data

---

#### Grok Imagine
**Status:** ✅ Implemented
**Auth Method:** API Key
**Used By:** `ghost` skill
**Environment Variables:**
```
GROK_API_KEY
GROK_IMAGINE_MODEL (optional)
```

**Purpose:** AI image generation for blog post hero images
**Features:**
- Generate images from text descriptions
- Style-consistent imagery
- Blog-optimized image dimensions

**Integration Points:**
- Phase 4 of ghost workflow generates hero images
- Visuals are embedded in blog post metadata
- Images stored in output directory

---

### Financial Services

#### Stripe
**Status:** ✅ Implemented
**Auth Method:** API Key
**Used By:** none
**Environment Variables:**
```
STRIPE_API_KEY
STRIPE_PUBLIC_KEY (frontend only)
```

**Purpose:** Payment processing
**Features:**
- Invoice creation and sending
- Payment collection
- Subscription management
- Reporting and reconciliation

**Integration Points:**
- Consulting skill generates invoices
- Client payments tracked in Stripe
- Revenue reporting and analytics

---

#### Cal.com
**Status:** ✅ Implemented
**Auth Method:** OAuth + API Key
**Used By:** none
**Environment Variables:**
```
CAL_COM_API_KEY
CAL_COM_CALENDAR_ID
```

**Purpose:** Meeting scheduling
**Features:**
- Create availability calendars
- Client booking management
- Automated reminders
- Calendar sync

**Integration Points:**
- Consulting skill integrates with Cal.com for scheduling
- Client books meetings via Cal.com links
- Meeting data feeds into engagement tracking

---

### Personal Finance

#### SimpleFIN
**Status:** ✅ Implemented
**Auth Method:** OAuth
**Used By:** `notmint` tool
**Environment Variables:**
```
SIMPLEFIN_CLIENT_ID
SIMPLEFIN_CLIENT_SECRET
SIMPLEFIN_ACCESS_TOKEN
```

**Purpose:** Financial data aggregation and sync
**Features:**
- Multi-account aggregation
- Transaction categorization
- Balance tracking
- Account linking

**Integration Points:**
- notmint tool syncs accounts via SimpleFIN
- Dashboard displays aggregated data
- Budget tracking based on SimpleFIN transactions

---

#### Twingate
**Status:** ✅ Implemented
**Auth Method:** OAuth
**Used By:** `notmint` tool
**Environment Variables:**
```
TWINGATE_API_KEY
TWINGATE_NETWORK_ID
```

**Purpose:** Secure network access for personal finance dashboard
**Features:**
- Zero-trust access control
- Device enrollment
- Network security enforcement

**Integration Points:**
- notmint dashboard accessed via Twingate
- Enforces device and user authentication
- Network-level security for sensitive financial data

---

### Security & Bug Bounties

#### HackerOne
**Status:** ✅ Implemented
**Auth Method:** Public Data (arkadiyt/bounty-targets-data)
**Used By:** `bug-bounty` skill
**Environment Variables:**
```
None required (uses public GitHub data)
```

**Purpose:** Bug bounty program discovery and engagement
**Features:**
- Program discovery from public data source
- Automated scope extraction
- SCOPE.md generation from program data
- Engagement initialization

**Integration Points:**
- bug-bounty skill queries public data
- Auto-generates SCOPE.md for targeting
- Delegates to security agent for testing
- Refreshed hourly by external data source

---

#### Intigriti
**Status:** ✅ Implemented
**Auth Method:** Public Data (arkadiyt/bounty-targets-data)
**Used By:** `bug-bounty` skill
**Environment Variables:**
```
None required (uses public GitHub data)
```

**Purpose:** Bug bounty program discovery and engagement
**Features:**
- Program discovery from public data source
- Automated scope extraction
- SCOPE.md generation from program data
- Engagement initialization

**Integration Points:**
- bug-bounty skill queries public data
- Auto-generates SCOPE.md for targeting
- Delegates to security agent for testing
- European-focused programs available

---

#### Bugcrowd
**Status:** ✅ Implemented
**Auth Method:** Public Data (arkadiyt/bounty-targets-data)
**Used By:** `bug-bounty` skill
**Environment Variables:**
```
None required (uses public GitHub data)
```

**Purpose:** Bug bounty program discovery and engagement
**Features:**
- Program discovery from public data source
- Automated scope extraction
- SCOPE.md generation from program data
- Engagement initialization

**Integration Points:**
- bug-bounty skill queries public data
- Auto-generates SCOPE.md for targeting
- Delegates to security agent for testing
- Refreshed hourly by external data source

---

### Vulnerability Data

#### NVD (National Vulnerability Database)
**Status:** ✅ Implemented
**Auth Method:** Public API (no auth required)
**Used By:** `security` skill
**Environment Variables:** None (public API)

**Purpose:** Official US government vulnerability database
**Features:**
- CVE data and analysis
- CVSS scoring
- CWE mapping
- Vulnerability timeline

**Integration Points:**
- Security skill queries NVD for vulnerability details
- Dependency audit uses NVD for CVE correlation
- Risk assessment references NVD data

---

## Integration Setup Guides

### Quick Start for Each Skill

#### Ghost Skill Setup
```bash
1. Create Ghost API key at: ghost-instance.com/ghost/admin/
2. Store in .env:
   GHOST_ADMIN_API_KEY=[insert ghost admin api key]
   GHOST_ADMIN_API_URL=[insert ghost url]
3. Test: Read skills/ghost/docs/adding-credentials.md
```

#### Security Skill Setup
```bash
1. OpenRouter: https://openrouter.ai/ → Create key
2. NVD: Public API, no auth needed
3. Store in .env:
   OPENROUTER_API_KEY=[insert openrouter api key]
4. Test: Run /pentest with demo mode
```

#### Bug Bounty Setup
```bash
1. No API keys needed (uses public data source)
2. Network access to GitHub required
3. Test: Run /bug-bounty to start an engagement
```

---

## Integration Troubleshooting

### Common Issues

**Issue: API Key Not Found**
```
Error: OPENROUTER_API_KEY not in environment
Solution:
1. Check .env file exists
2. Verify variable name matches exactly
3. Restart CLI tool after adding to .env
```

**Issue: Authentication Failed**
```
Error: Invalid API credentials
Solution:
1. Verify key hasn't been rotated
2. Check key has correct permissions
3. Test API directly with curl/postman
4. Regenerate key if needed
```

**Issue: Rate Limiting**
```
Error: API rate limit exceeded
Solution:
1. Check API quota/tier
2. Implement exponential backoff
3. Upgrade API plan if needed
4. Check for parallel requests
```

**Issue: Network Access Blocked**
```
Error: Connection timeout
Solution:
1. Verify network connectivity
2. Check firewall/VPN rules
3. For Twingate: Verify enrollment
4. Try from different network
```

---

## Integration Architecture

### Credential Security
- All credentials stored in `.env` only
- Pre-commit hooks block credential commits
- Runtime validation before API use
- Credential rotation recommended quarterly

### Error Handling
- Graceful degradation if API unavailable
- Fallback to alternate models/services
- Detailed error logging for debugging
- User-friendly error messages

### Cost Optimization
- OpenRouter routes to cost-optimal models
- Track API usage per skill
- Budget alerts for high-cost integrations
- Quarterly cost analysis

### Monitoring
- API health checks
- Usage tracking per integration
- Error rate monitoring
- Performance metrics

---

## Adding New Integrations

### Integration Checklist
- [ ] Add to skill's `env_keys` array in SKILL.md
- [ ] Create `docs/adding-credentials.md` in skill
- [ ] Document in this catalog
- [ ] Add credential validation in pre-startup hook
- [ ] Add environment variable to `.env.example`
- [ ] Document in API README.md
- [ ] Test with all dependent skills
- [ ] Add error handling for API failures

---

## Related Documentation

- **Skills:** `docs/catalogs/skills.md` - Skills using integrations
- **API Entry:** Use skill scripts for API interactions
- **Credential Setup:** Each skill's `docs/adding-credentials.md`
- **Environment Setup:** `.env.example` - Required variables

---

**Version:** 1.0
**Last Updated:** 2026-02-03
**Framework:** Intelligence Adjacent (IA)
