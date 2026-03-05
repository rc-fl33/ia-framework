# MITRE ATLAS Official Sources Verification

## Verification Summary

| Attribute | Value |
|-----------|-------|
| **Verification Date** | 2026-03-03 |
| **Official Source URL** | https://atlas.mitre.org/ |
| **Data Repository** | https://github.com/mitre-atlas/atlas-data |
| **Local Version** | 5.1.0 |
| **Official Version** | 5.4.0 |
| **Version Gap** | 3 minor versions (5.2.0, 5.3.0, 5.4.0) |

---

## Official Source Details

### Primary Data Source

- **URL**: https://raw.githubusercontent.com/mitre-atlas/atlas-data/main/dist/ATLAS.yaml
- **Repository**: https://github.com/mitre-atlas/atlas-data
- **Format**: YAML (complete ATLAS matrix)
- **Last Updated**: 2026-02-06 (v5.4.0)

### Version History

| Version | Release Date | Key Changes |
|---------|--------------|-------------|
| v5.4.0 | Feb 6, 2026 | AML.T0104-0108, AML.T0011.002-003 |
| v5.3.0 | Jan 30, 2026 | AML.T0103 |
| v5.2.0 | Jan 30, 2026 | AML.T0096-0102 |
| v5.1.0 | Nov 7, 2025 | New tactic: Lateral Movement (AML.TA0015) |

---

## Techniques Verified

### Local File Technique Count

- **Parent Techniques**: 84 (as declared in controls.yaml)
- **Sub-techniques noted inline**: 56

### Official Source Technique Count (v5.4.0)

- **Parent Techniques**: ~99
- **Sub-techniques**: ~70+
- **Total Tactics**: 16

---

## Discrepancies Found

### 1. Version Mismatch (SIGNIFICANT)

The local framework uses **MITRE ATLAS v5.1.0** while the official source is at **v5.4.0**. This represents a 3-month gap with 15+ new techniques added.

### 2. Missing Techniques (v5.2.0 - v5.4.0)

The following techniques from official v5.4.0 are **NOT** in the local controls.yaml:

| Technique ID | Name |
|-------------|------|
| AML.T0096 | *(not extracted)* |
| AML.T0097 | *(not extracted)* |
| AML.T0098 | *(not extracted)* |
| AML.T0099 | *(not extracted)* |
| AML.T0100 | *(not extracted)* |
| AML.T0101 | *(not extracted)* |
| AML.T0102 | *(not extracted)* |
| AML.T0103 | *(not extracted)* |
| AML.T0104 | *(not extracted)* |
| AML.T0105 | *(not extracted)* |
| AML.T0106 | *(not extracted)* |
| AML.T0107 | *(not extracted)* |
| AML.T0108 | *(not extracted)* |
| AML.T0011.002 | *(sub-technique)* |
| AML.T0011.003 | *(sub-technique)* |

### 3. Custom Technique Variants (Non-Standard)

The local controls.yaml includes custom variants that do not appear in official MITRE ATLAS:

| Local ID | Notes |
|----------|-------|
| AML.T0020_persistence | Custom variant |
| AML.T0093_persistence | Custom variant |
| AML.T0015_defense | Custom variant |
| AML.T0053_priv | Custom variant |
| AML.T0054_priv | Custom variant |

These appear to be framework-specific categorizations rather than official ATLAS techniques.

### 4. Tactics Verification

All 16 official tactics are represented in the local manifest.yaml:

| Tactic ID | Name | Status |
|-----------|------|--------|
| AML.TA0000 | AI Model Access | Verified |
| AML.TA0001 | AI Attack Staging | Verified |
| AML.TA0002 | Reconnaissance | Verified |
| AML.TA0003 | Resource Development | Verified |
| AML.TA0004 | Initial Access | Verified |
| AML.TA0005 | Execution | Verified |
| AML.TA0006 | Persistence | Verified |
| AML.TA0007 | Defense Evasion | Verified |
| AML.TA0008 | Discovery | Verified |
| AML.TA0009 | Collection | Verified |
| AML.TA0010 | Exfiltration | Verified |
| AML.TA0011 | Impact | Verified |
| AML.TA0012 | Privilege Escalation | Verified |
| AML.TA0013 | Credential Access | Verified |
| AML.TA0014 | Command and Control | Verified |
| AML.TA0015 | Lateral Movement | Verified |

---

## Confidence Assessment

| Finding | Confidence |
|---------|------------|
| Version mismatch identified | HIGH |
| Missing techniques from v5.2.0-v5.4.0 | HIGH |
| Custom variants identified | HIGH |
| Tactics completeness | HIGH |

---

## Recommendations

1. **Update framework version** to v5.4.0 to align with official source
2. **Add missing techniques** (15+ techniques from v5.2.0-v5.4.0)
3. **Review custom variants** for consistency with official ATLAS taxonomy
4. **Schedule quarterly verification** given rapid ATLAS evolution

---

## Sources

- [MITRE ATLAS Official Site](https://atlas.mitre.org/)
- [MITRE ATLAS Data Repository](https://github.com/mitre-atlas/atlas-data)
- [ATLAS YAML (Raw)](https://raw.githubusercontent.com/mitre-atlas/atlas-data/main/dist/ATLAS.yaml)
- [ATLAS Releases/Changelog](https://github.com/mitre-atlas/atlas-data/releases)
