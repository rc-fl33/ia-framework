# Harden Status

**Status:** Active
**Phase:** Initial release — standalone GRC hardening skill, fully decoupled from compliance

## History

- 2026-02-24: Initial release
  - Standalone 6-phase pipeline in `skills/harden/phases/` (not shared with compliance)
  - Routed to engineer agent for all phases
  - Two modes: validate (non-destructive audit) and remediate (active fix guidance + scripts)
  - Six supported frameworks: CIS Controls v8.1, NIST CSF 2.0, FedRAMP, ISO 27001, HIPAA, General
  - Own output directory: `private/output/harden/{target}-{YYYY-MM}/`
  - Mode-aware output: CHANGE-LOG.md produced in remediate mode only
  - Rollback-first design: Phase 01 confirms rollback prerequisites before remediate mode proceeds
