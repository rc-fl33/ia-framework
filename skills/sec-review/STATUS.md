# Security-Review Status

**Status:** Active
**Phase:** Initial release — renamed from arch-review and fully decoupled from advisory

## History

- 2026-02-27: Removed Domain D (API Security) as standalone domain; merged API security
  coverage into Domain B (assessed conditionally when APIs present in architecture).
  Updated diagram count to 6 (network-topology added). Domains: A, B, C, E.
- 2026-02-18: Renamed from arch-review, fully decoupled from advisory skill
  - New standalone phases in skills/sec-review/phases/ (not shared with advisory)
  - Routed to security agent (previously advisor agent)
  - Added Domain B: Security Practices assessment
  - Added Domain C: Patch Management maturity assessment
  - Added Mermaid diagram generation (5 diagrams)
  - Added standalone questionnaire templates for Domains B and C
  - Added evidence collection checklist
