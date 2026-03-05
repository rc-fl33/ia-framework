# Universal Engagement Mode Patterns

**Purpose:** Skill-agnostic templates for three engagement modes across all IA skills

**Version:** 2.0

---

## Three Engagement Modes

### Director Mode (Production)
**Full workflow with professional deliverables** - Baseline mode for production work

### Mentor Mode (Learning)
**Interactive learning with teaching checkpoints** - Transforms productivity into education

### Demo Mode (Testing)
**Rapid tool/skill validation without full workflow** - 90-95% time savings for testing

---

## What is Mentor Mode?

**Mentor mode transforms productivity tools into learning platforms** by offering interactive teaching checkpoints after each phase of work.

**The pattern:**
```
Agent completes phase → Offers checkpoint → User chooses:
  A) I'll try next phase myself (agent reviews approach)
  B) Show me how to do next phase (agent demonstrates)
  C) Continue standard mode (no teaching)
```

**Key innovation:** Respects learner autonomy while building skills progressively.

**Universal application:** Works for ANY multi-phase workflow (security testing, blog writing, code review, risk assessment, etc.)

---

## What is Demo Mode?

**Demo mode enables rapid tool and infrastructure validation** by bypassing time-consuming data collection and research phases.

**The pattern:**
```
User requests tool test → Agent identifies objective → Minimal setup → Execute test → Validate → Quick report
```

**Key innovation:** 90-95% time reduction for testing scenarios while maintaining quality validation.

**Universal application:** Works for ANY skill where extensive research/setup can be bypassed for focused testing.

**Use cases:** Tool connectivity testing, infrastructure validation, quick POCs, troubleshooting, experimentation

---

## Pattern Philosophy

### Design Principles

**1. Learner Autonomy**
- User chooses engagement level (try/watch/skip)
- Can switch modes mid-session
- No forced teaching

**2. Progressive Scaffolding**
- Start with "watch" (observation)
- Move to "try" (guided practice)
- Graduate to "skip" (independent)
- System adapts based on demonstrated skill

**3. Just-in-Time Learning**
- Teaching moments when context is fresh
- Immediate application of concepts
- Real-world examples from current work

**4. Diagnostic Support**
- Help when stuck, not before
- Root cause analysis, not just fixes
- Generalizable debugging skills

**5. Measurable Progress**
- Track checkpoint choices
- Log help invocations
- Calculate graduation readiness
- Adaptive checkpoint frequency

---

## Skills Supporting Mentor Mode

### ✅ Currently Implemented (Production)

**Security Testing** (`skills/pentest/`)
- **Phases:** Reconnaissance → Enumeration → Scanning → Exploitation → Documentation
- **Status:** Production ready (reference implementation)
- **Learning value:** HIGH (complex technical skills, practical learning by doing)
- **Target audience:** Junior pentesters, security professionals entering the field

---

### 🎯 Mentor Mode Philosophy

**Selective Application:** Mentor mode is NOT universally applied to all skills. It's specifically designed for **technical skills where hands-on practice accelerates industry entry.**

**Criteria for Mentor Mode:**
- ✅ Multi-phase workflow with clear checkpoints
- ✅ Skills that improve through guided practice
- ✅ High value for learners entering the profession
- ✅ Complex enough to benefit from progressive scaffolding
- ✅ Safe environment for making/learning from mistakes

**Why NOT all skills:**
- Most workflows are streamlined for production efficiency
- Mentor mode adds 20-30% overhead (cost/time)
- Not all skills require progressive teaching
- Some skills are better learned through documentation/reference

---

## Success Criteria

**Mentor mode is working when:**
✅ Users progress from B (watch) → A (try) → C (skip) over sessions
✅ Help invocations decrease over time
✅ Users graduate to director mode when ready

**For detailed metrics tracking, see:** Session documentation and skill STATUS.md files

---

## Related Documentation

**Universal Patterns (this directory):**
- `mentor-checkpoint.md` - Checkpoint template
- `mentor-help.md` - Help pattern template
- `mentor-progression.md` - Progression tracking
- `demo-mode.md` - Demo mode pattern
- `README.md` - This file

**Reference Implementation:**
- `skills/pentest/SKILL.md` - Complete configuration
- `agents/security.md` - Agent implementation

---

**This is Intelligence Adjacent in action:**
**Building systems that augment human intelligence through interactive learning at scale.**

**Version:** 2.0
**Status:** Production Ready
**Framework:** Intelligence Adjacent (IA)
