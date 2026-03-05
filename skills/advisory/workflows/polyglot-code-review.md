# Polyglot Code Review Workflow

**Code review workflow for projects with multiple programming languages.**

---

## Overview

Many modern projects use multiple languages:
- Frontend (JavaScript/TypeScript) + Backend (Python/Go/Java)
- Microservices (multiple languages)
- Data pipelines (Python + SQL + Shell scripts)
- Full-stack (React + Node.js + Python services)

This workflow handles code reviews across multiple languages, generating guides for each language and coordinating findings.

---

## When to Use

**Trigger Conditions:**
- Language detection finds 2+ primary languages
- User explicitly states: "Review this polyglot codebase"
- Detection result shows `polyglot: true`

**Example Projects:**
```
project/
├── frontend/          (JavaScript/TypeScript - React)
├── backend/           (Python - FastAPI)
└── data-pipeline/     (Go)
```

---

## Workflow Phases

### Phase 1: INTAKE (Enhanced for Polyglot)

**Goal:** Detect all languages and ensure guides exist for each

**Steps:**

1. **Run Language Detection:**
   ```bash
   bun run skills/advisory/scripts/detect-language.ts /path/to/code --json
   ```

2. **Analyze Detection Result:**
   ```json
   {
     "primary": {
       "language": "javascript",
       "confidence": "high",
       "frameworks": ["React", "Express"]
     },
     "secondary": [
       {
         "language": "python",
         "confidence": "high",
         "frameworks": ["FastAPI"]
       },
       {
         "language": "go",
         "confidence": "medium",
         "frameworks": ["Gin"]
       }
     ],
     "polyglot": true
   }
   ```

3. **Check Guide Availability for ALL Languages:**
   ```
   For primary language:
     Check: docs/languages/javascript/manifest.yaml exists?
       ├─ YES → Load guide
       └─ NO  → Generate guide

   For each secondary language:
     Check: docs/languages/{language}/manifest.yaml exists?
       ├─ YES → Load guide
       └─ NO  → Generate guide
   ```

4. **Inform User:**
   ```
   Detected polyglot project:
     - Primary: JavaScript (React, Express)
     - Secondary: Python (FastAPI), Go (Gin)

   Ensuring all language guides available...
     ✓ JavaScript guide loaded
     🔄 Python guide - generating...
     🔄 Go guide - generating...

   All language guides ready. Proceeding with multi-language review.
   ```

5. **Define Language Boundaries:**
   - Map directories/files to languages
   - Identify inter-language boundaries (API calls, data exchange)
   - Note language-specific focus areas

**Gate:** All languages detected, all guides available, boundaries mapped

**Decision Tree:**
```
Run Language Detection
        │
        ▼
   Polyglot? (2+ languages)
    ├─ NO  → Standard Code Review
    │
    └─ YES → Polyglot Review
              │
              ├─ For each language:
              │    ├─ Guide exists?
              │    │   ├─ YES → Load
              │    │   └─ NO  → Generate
              │    │
              │    └─ Map to directories
              │
              └─ Continue to Phase 2
```

---

### Phase 2: ANALYZE (Multi-Language)

**Goal:** Analyze each language using appropriate guides, plus cross-language issues

**Steps:**

1. **Language-Specific Analysis:**
   ```
   For each language:
     - Load language guide (patterns, checklist, examples)
     - Apply patterns to language-specific files
     - Execute language-specific security checks
     - Record findings with language tag
   ```

2. **Cross-Language Analysis:**
   ```
   Inter-Language Issues to Check:
     - API Security:
       ✓ Authentication propagation across services
       ✓ Authorization consistency
       ✓ Input validation at boundaries
       ✓ Data serialization security

     - Data Flow:
       ✓ SQL injection in cross-language queries
       ✓ XSS in frontend rendering backend data
       ✓ Type coercion vulnerabilities

     - Configuration:
       ✓ Shared secrets management
       ✓ Environment variable consistency
       ✓ CORS configuration
       ✓ TLS/SSL across services
   ```

3. **Framework Integration Analysis:**
   ```
   If frontend + backend detected:
     - Check frontend framework security (React, Vue, Angular)
     - Check backend framework security (Django, Express, Spring)
     - Validate API contract security
     - Check authentication flow end-to-end
   ```

4. **Record Findings by Language:**
   ```markdown
   ## JavaScript Findings (15 total)
   - Finding 1: XSS in React component (CRITICAL)
   - Finding 2: Prototype pollution (HIGH)
   ...

   ## Python Findings (8 total)
   - Finding 1: SQL injection in FastAPI endpoint (CRITICAL)
   - Finding 2: Insecure deserialization (HIGH)
   ...

   ## Cross-Language Findings (3 total)
   - Finding 1: Missing auth propagation JS → Python (CRITICAL)
   - Finding 2: Type coercion vulnerability at API boundary (MEDIUM)
   ...
   ```

**Gate:** All languages analyzed, cross-language issues checked, findings categorized

---

### Phase 3: RECOMMEND (Unified)

**Goal:** Prioritize findings across all languages

**Steps:**

1. **Merge Findings from All Languages:**
   ```
   Total Findings: 26
     - JavaScript: 15 findings
     - Python: 8 findings
     - Go: 0 findings
     - Cross-language: 3 findings
   ```

2. **Prioritize by Severity (Cross-Language):**
   ```
   P0 (Critical, Fix Immediately):
     1. [JS] XSS in user profile component
     2. [PY] SQL injection in user search
     3. [CROSS] Missing auth propagation

   P1 (High, Fix Soon):
     4. [JS] Prototype pollution in merge utility
     5. [PY] Insecure deserialization
     ...
   ```

3. **Generate Language-Specific Remediation:**
   - Use each language's `examples.md` for code examples
   - Provide language-appropriate secure patterns
   - Reference framework-specific documentation

4. **Generate Cross-Language Remediation:**
   ```markdown
   ### Finding: Missing Authentication Propagation

   **Severity:** CRITICAL
   **Languages:** JavaScript (frontend) + Python (backend)
   **CWE:** CWE-287 (Improper Authentication)

   **WHAT:**
   Frontend sends API requests without authentication tokens.
   Backend does not validate authentication.

   **WHERE:**
   - Frontend: src/api/client.js:45
   - Backend: app/api/users.py:78

   **WHY:**
   Unauthenticated users can access protected endpoints.

   **HOW:**

   Frontend (JavaScript):
   ```javascript
   // ❌ Vulnerable - No auth header
   fetch('/api/users')

   // ✅ Secure - Add auth header
   fetch('/api/users', {
     headers: {
       'Authorization': `Bearer ${authToken}`
     }
   })
   ```

   Backend (Python):
   ```python
   # ❌ Vulnerable - No auth check
   @app.get("/api/users")
   async def get_users():
       return users

   # ✅ Secure - Validate auth
   from fastapi import Depends, HTTPException
   from fastapi.security import HTTPBearer

   security = HTTPBearer()

   @app.get("/api/users")
   async def get_users(token: str = Depends(security)):
       if not validate_token(token.credentials):
           raise HTTPException(401, "Unauthorized")
       return users
   ```
   ```

**Gate:** All findings prioritized, language-specific and cross-language remediation provided

---

### Phase 4: DOCUMENT (Multi-Language Report)

**Goal:** Create comprehensive report covering all languages

**Report Structure:**
```
output/advisory/code-reviews/{project}-{YYYY-MM-DD}/
├── EXECUTIVE-SUMMARY.md           # High-level overview (all languages)
├── POLYGLOT-ARCHITECTURE.md       # Architecture diagram, language boundaries
├── FINDINGS-JAVASCRIPT.md         # JavaScript-specific findings
├── FINDINGS-PYTHON.md             # Python-specific findings
├── FINDINGS-CROSS-LANGUAGE.md     # Cross-language security issues
├── REMEDIATION-GUIDE.md           # Unified remediation priority
├── FULL-REPORT.md                 # Consolidated report
└── metadata.json                  # Engagement metadata
```

**EXECUTIVE-SUMMARY.md:**
```markdown
# Code Review: {Project Name}

## Polyglot Architecture

**Languages Detected:**
- JavaScript (React, Express) - 156 files, 12,450 LOC
- Python (FastAPI) - 45 files, 3,200 LOC
- Go (Gin) - 12 files, 890 LOC

**Architecture:**
- Frontend: React SPA (JavaScript)
- Backend API: FastAPI (Python)
- Data Pipeline: Gin services (Go)

## Summary Statistics

| Category | JavaScript | Python | Go | Cross-Language | Total |
|----------|-----------|--------|----|--------------  |-------|
| Critical | 2 | 1 | 0 | 1 | 4 |
| High | 5 | 3 | 0 | 1 | 9 |
| Medium | 6 | 3 | 0 | 1 | 10 |
| Low | 2 | 1 | 0 | 0 | 3 |
| **Total** | **15** | **8** | **0** | **3** | **26** |

## Key Findings

1. **[CRITICAL] XSS in User Profile** (JavaScript)
2. **[CRITICAL] SQL Injection in Search** (Python)
3. **[CRITICAL] Missing Auth Propagation** (Cross-Language)
4. **[HIGH] Prototype Pollution** (JavaScript)
5. **[HIGH] Insecure Deserialization** (Python)
```

**POLYGLOT-ARCHITECTURE.md:**
```markdown
# Polyglot Architecture Analysis

## Language Boundaries

```
┌─────────────────────────────────────────┐
│  Frontend (JavaScript/React)            │
│  - User interface                       │
│  - Client-side validation               │
│  - API client                           │
└──────────────┬──────────────────────────┘
               │ REST API (JSON)
               │ WebSocket (real-time)
               ▼
┌─────────────────────────────────────────┐
│  Backend API (Python/FastAPI)           │
│  - Business logic                       │
│  - Authentication                       │
│  - Database access                      │
└──────────────┬──────────────────────────┘
               │ gRPC
               ▼
┌─────────────────────────────────────────┐
│  Data Pipeline (Go/Gin)                 │
│  - Data processing                      │
│  - ETL jobs                             │
│  - Analytics                            │
└─────────────────────────────────────────┘
```

## Inter-Language Communication

| From | To | Protocol | Security Concerns |
|------|----|---------|--------------------|
| JavaScript | Python | REST/JSON | Auth headers, CORS, XSS |
| Python | Go | gRPC | mTLS, auth tokens |
| Go | Python | REST/JSON | API keys, rate limiting |

## Security Boundaries

**Trust Boundaries:**
1. **Frontend ↔ Backend:** Untrusted → Trusted
   - All input must be validated
   - Authentication required
   - Authorization enforced

2. **Backend ↔ Data Pipeline:** Trusted ↔ Trusted
   - Service-to-service auth
   - Internal API contracts
```

**Gate:** All deliverables complete, polyglot architecture documented

---

### Phase 5: DELIVER (Unified Presentation)

**Goal:** Present findings with multi-language context

**Steps:**

1. **Present Statistics by Language:**
   ```
   Code Review Complete: Polyglot Project

   Languages Reviewed:
     ✓ JavaScript (15 findings) - React, Express
     ✓ Python (8 findings) - FastAPI
     ✓ Go (0 findings) - Gin
     ✓ Cross-Language (3 findings)

   Total: 26 findings
     - Critical: 4
     - High: 9
     - Medium: 10
     - Low: 3
   ```

2. **Highlight Cross-Language Issues:**
   ```
   ⚠️  CRITICAL Cross-Language Issues:

   1. Missing authentication propagation (JS → PY)
      Impact: Unauthenticated access to backend API
      Priority: P0

   2. Type coercion at API boundary (PY → GO)
      Impact: Potential data corruption
      Priority: P1
   ```

3. **Provide Remediation Roadmap:**
   ```
   Remediation Roadmap:

   Week 1: Critical Fixes (P0)
     - Fix XSS in JavaScript components (2 files)
     - Fix SQL injection in Python backend (1 file)
     - Implement auth propagation (JS + PY, 3 files)

   Week 2: High-Priority Fixes (P1)
     - Fix prototype pollution in JavaScript (1 file)
     - Fix deserialization in Python (2 files)
     - Add type validation at API boundaries (PY + GO)

   Week 3-4: Medium/Low Priority
     - Remaining JavaScript issues (8 findings)
     - Remaining Python issues (4 findings)
   ```

4. **Suggest Follow-up Actions:**
   ```
   Recommended Next Steps:

   1. Implement automated security testing:
      - JavaScript: ESLint + React security plugins
      - Python: Bandit + Safety
      - Go: gosec + staticcheck

   2. Add cross-language integration tests:
      - End-to-end auth flow tests
      - API contract validation
      - Type safety at boundaries

   3. Establish secure coding standards:
      - Document per language (use generated guides)
      - Document cross-language patterns
      - Code review checklist
   ```

**Gate:** User understands findings across all languages, has clear remediation path

---

## Cross-Language Security Patterns

### Pattern 1: Authentication Propagation

**Scenario:** Frontend (JS) → Backend (Python) → Service (Go)

**Secure Pattern:**
```javascript
// Frontend: Add token to all requests
const api = axios.create({
  headers: { 'Authorization': `Bearer ${token}` }
});
```

```python
# Backend: Validate and propagate
from fastapi import Header, HTTPException

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401)
    token = authorization.replace("Bearer ", "")
    user = validate_jwt(token)
    return user

# Pass to downstream service
await service_client.call(headers={"Authorization": f"Bearer {token}"})
```

```go
// Service: Validate again
func authMiddleware(c *gin.Context) {
    token := c.GetHeader("Authorization")
    if !validateToken(token) {
        c.AbortWithStatus(401)
        return
    }
    c.Next()
}
```

### Pattern 2: Data Validation at Boundaries

**Scenario:** Python receives JSON from JavaScript, sends to Go

**Secure Pattern:**
```javascript
// Frontend: Type-safe data
interface User {
  id: number;
  email: string;
}

const userData: User = { id: 123, email: "user@example.com" };
```

```python
# Backend: Validate with Pydantic
from pydantic import BaseModel, validator

class User(BaseModel):
    id: int
    email: str

    @validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email')
        return v

@app.post("/users")
async def create_user(user: User):  # Auto-validates
    # Send to Go service
    response = await go_service.create(user.dict())
```

```go
// Service: Validate again (defense in depth)
type User struct {
    ID    int    `json:"id" binding:"required,gt=0"`
    Email string `json:"email" binding:"required,email"`
}

func CreateUser(c *gin.Context) {
    var user User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    // Validated data
}
```

---

## Quality Checklist

**Polyglot-Specific Checks:**
- [ ] All languages detected and analyzed
- [ ] Language guides generated/loaded for each language
- [ ] Cross-language boundaries identified
- [ ] Inter-service communication analyzed
- [ ] Authentication propagation verified
- [ ] Data validation at boundaries verified
- [ ] Type safety at API contracts verified
- [ ] Findings organized by language
- [ ] Cross-language findings documented
- [ ] Polyglot architecture diagram created
- [ ] Language-specific remediation provided
- [ ] Cross-language remediation provided

---

## Related Files

- `scripts/detect-language.ts` - Language detection script
- `workflows/code-review.md` - Standard code review (single language)
- `workflows/generate-language-guide.md` - Auto-generate language guides
- `docs/language-guide-template.md` - Language guide template

---

**Version:** 1.0
**Status:** Ready for use
**Last Updated:** 2026-01-18
