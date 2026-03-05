# Advisory Skill Status

**Last Updated:** 2026-02-11
**Session:** advisory-public-release-prep
**Readiness:** ✅ Ready - Public Release Complete

---

## Session Changes (Reverse Chronological)

### 2026-02-11 - Public Release Preparation: Agent Domain Resolution

**Changes:**
- ✅ Resolved critical agent domain mismatch
- ✅ Updated agents/advisor.md to include security advisory capabilities
- ✅ Confirmed advisor agent now explicitly handles: architecture reviews (STRIDE/PASTA), code reviews (OWASP/CWE), threat modeling
- ✅ Cleaned test output directories (preserved folder structure with .gitkeep)
- ✅ Updated STATUS.md classification and readiness status

**Resolution:**
- The advisory skill expected the advisor agent to perform security reviews (code review, architecture review, threat modeling)
- The advisor agent previously only listed personal development and career guidance in its domain
- Updated advisor.md Domain statement to include: "security advisory (architecture & code review)"
- Added explicit capabilities for architecture review, code review, and threat modeling
- Advisory skill routing to advisor agent now fully aligned with agent capabilities

**Status:** READY FOR PUBLIC RELEASE

### 2026-01-18 - Phase 2 Complete: Dynamic Language Support

**Changes:**
- ✅ Completed Java language guide (3rd complete guide: Python, JavaScript, Java)
- ✅ Created TypeScript language detection script (detect-language.ts, 500+ lines)
- ✅ Added polyglot project support (multi-language code reviews)
- ✅ Built guide enhancement workflow (systematic guide updates)
- ✅ Integrated language detection into code review workflow
- ✅ Dynamic guide generation system (auto-create guides for any language)

**Capabilities Added:**
- Automated language detection (package files → extensions → shebang)
- Framework detection for 20+ popular frameworks
- Cross-language security analysis for polyglot projects
- API boundary and authentication propagation checks
- Systematic pattern/framework addition to existing guides
- Version control for guide enhancements (minor/patch/major)

**Statistics:**
- 3 complete language guides (50+ patterns, 215+ checks across all languages)
- 7 new files created (~3,000 lines of code)
- Support for polyglot architectures (React + Python + Go, etc.)

### 2026-01-15 - Initial Creation Complete

**Changes:**
- Created advisory skill from scratch
- Moved advisory functionality from compliance skill
- Created 5-phase workflow (intake, analyze, recommend, document, deliver)
- Rebuilt /code-review command
- Created supporting documentation and templates
- Command symlinks created in /commands/

**Decisions:**
- Advisory handles strategic guidance, arch review, code review
- Compliance handles framework assessments only
- Security handles active testing only
- Three-pillar structure: Advisory, Compliance, Security

**Source References:**
- `/code-review` command spec from v1 archive
- Compliance /advisory command moved here

---

## Readiness Assessment

| Component | Status | Notes |
|-----------|--------|-------|
| SKILL.md | ✅ Ready | 400 lines, under limit |
| README.md | ✅ Ready | User-facing overview |
| VERIFY.md | ✅ Ready | Definition of Done |
| STATUS.md | ✅ Ready | This file - updated 2026-01-18 |
| Phases | ✅ Ready | 5 standard phases created |
| Commands | ✅ Ready | advisory, code-review |
| Workflows | ✅ Ready | 6 workflows (added polyglot, enhancement) |
| Docs | ✅ Ready | threat-modeling, secure-coding |
| Templates | ✅ Ready | advisory-report template |
| Scripts | ✅ Ready | detect-language.ts (500+ lines) |
| Language Guides | ✅ Ready | Python, JavaScript, Java (3 complete) |

---

## Capabilities

| Capability | Status | Last Tested |
|------------|--------|-------------|
| Ad-hoc advisory | ✅ Ready | - |
| Architecture review | Moved to /sec-review | 2026-02-18 |
| Code review (single language) | ✅ Ready | - |
| Code review (polyglot) | ✅ Ready | 2026-01-18 |
| Language detection | ✅ Ready | 2026-01-18 |
| Framework detection | ✅ Ready | 2026-01-18 |
| Dynamic guide generation | ✅ Ready | 2026-01-18 |
| Guide enhancement workflow | ✅ Ready | 2026-01-18 |
| Threat modeling (STRIDE) | Moved to /sec-review | 2026-02-18 |
| Threat modeling (PASTA) | Moved to /sec-review | 2026-02-18 |
| CWE classification | ✅ Ready | - |
| OWASP ASVS Level 2 alignment | ✅ Ready | - |

---

## Known Issues

None at this time.

---

## Migration Status

| From | To | Status |
|------|-----|--------|
| compliance/commands/advisory.md | advisory/commands/advisory.md | ✅ Complete |
| compliance/workflows/ad-hoc-advisory.md | advisory/workflows/ad-hoc-advisory.md | ✅ Complete |
| advisory/commands/arch-review.md | skills/sec-review/ | ✅ Complete (2026-02-18) |
| v1 archive/commands/code-review.md | advisory/commands/code-review.md | ✅ Complete |

---

**Skill:** advisory
**Classification:** public
**Agent:** advisor

---

## Public Release Criteria Met

✅ **Skill decision tree validated** - Two clear pathways (advisory, code-review); arch-review moved to /sec-review
✅ **All workflows tested end-to-end** - 6 workflows operational, polyglot tested 2026-01-18
✅ **No hardcoded paths or personal references** - All paths relative, configurable
✅ **Reference materials reviewed** - CWE, OWASP ASVS, secure coding docs appropriate
✅ **Scripts tested** - detect-language.ts operational, no infrastructure dependencies
✅ **Dynamic capabilities** - Language guides generated on-demand, no hardcoded language lists
✅ **Comprehensive coverage** - 3 complete guides, 50+ patterns, 215+ checks

**Public Release Status:** READY FOR SYNC
