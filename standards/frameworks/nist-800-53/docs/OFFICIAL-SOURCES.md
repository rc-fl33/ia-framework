# NIST SP 800-53 Rev 5 - Official Source Verification

## Official Source

- **Publication URL**: https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final
- **PDF URL**: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf
- **OSCAL Catalog**: https://github.com/usnistgov/oscal-content (v1.4.0)

## Verification Date

**Verified:** 2026-03-03

---

## Control Families Verification

### Status: VERIFIED - All 20 families match official source

| ID | Family Title | Local File | Official Source | Status |
|----|--------------|------------|-----------------|--------|
| AC | Access Control | Yes | Yes | MATCH |
| AT | Awareness and Training | Yes | Yes | MATCH |
| AU | Audit and Accountability | Yes | Yes | MATCH |
| CA | Assessment, Authorization, and Monitoring | Yes | Yes | MATCH |
| CM | Configuration Management | Yes | Yes | MATCH |
| CP | Contingency Planning | Yes | Yes | MATCH |
| IA | Identification and Authentication | Yes | Yes | MATCH |
| IR | Incident Response | Yes | Yes | MATCH |
| MA | Maintenance | Yes | Yes | MATCH |
| MP | Media Protection | Yes | Yes | MATCH |
| PE | Physical and Environmental Protection | Yes | Yes | MATCH |
| PL | Planning | Yes | Yes | MATCH |
| PM | Program Management | Yes | Yes | MATCH |
| PS | Personnel Security | Yes | Yes | MATCH |
| PT | PII Processing and Transparency | Yes | Yes | MATCH |
| RA | Risk Assessment | Yes | Yes | MATCH |
| SA | System and Services Acquisition | Yes | Yes | MATCH |
| SC | System and Communications Protection | Yes | Yes | MATCH |
| SI | System and Information Integrity | Yes | Yes | MATCH |
| SR | Supply Chain Risk Management | Yes | Yes | MATCH |

**Result:** All 20 control families present and correctly named.

---

## Control Count Verification

| Metric | Local File | Official Source | Status |
|--------|------------|-----------------|--------|
| Control Families | 20 | 20 | MATCH |
| Total Controls + Enhancements | ~1,189 | ~1,189 | MATCH |

**Notes:**
- Local file notes "1,189 items" in header comment
- Official NIST 800-53 Rev 5 contains approximately 1,189 controls and control enhancements
- Count includes base controls plus enhancements (e.g., AC-2, AC-2(1), AC-2(2), etc.)

---

## Version Information

| Aspect | Local File | Official Current |
|--------|------------|------------------|
| Base Revision | Rev 5 | Rev 5.2.0 (August 2025) |
| Original Publication | September 2020 | September 2020 |
| Last Update Noted | January 2022 | Rev 5.2.0 (August 27, 2025) |

### Update Available
NIST has released **Revision 5.2.0** (August 27, 2025) which includes:
- New control: **SA-15(13)** - Software Bill of Materials (SBOM) Generation
- New control: **SA-24** - Component Attribute Repository
- New enhancement: **SI-02(07)** - Centralized Management of Anti-Malicious Tools

---

## Discrepancies Found

**None at the control family level.**

### Minor Notes:
1. The local `controls.yaml` captures the 20 control families at the family level only (not individual controls)
2. The file notes it tracks "FAMILY level (20 families)" - this is appropriate for framework mapping purposes
3. The version is noted as "Rev 5 (September 2020, updated January 2022)" - the original Rev 5 release

---

## Verification Confidence

**HIGH** - Control families verified against official NIST CSRC publication page and OSCAL catalog.

---

## References

- [NIST SP 800-53 Rev 5 Final Publication](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)
- [NIST SP 800-53 Rev 5 PDF](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf)
- [OSCAL Content Repository](https://github.com/usnistgov/oscal-content)
