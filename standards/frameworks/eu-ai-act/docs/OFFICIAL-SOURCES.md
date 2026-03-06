# EU AI Act - Official Sources Verification

**Verification Date:** 2026-03-03

## Official Source

| Field | Value |
|-------|-------|
| **Regulation** | Regulation (EU) 20244/1689 |
| **Official Journal Citation** | OJ L, 2024/1689, 12.7.2024 |
| **CELEX Number** | 32024R1689 |
| **Primary URL** | https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng |
| **Local Source** | `/standards/frameworks/eu-ai-act/docs/OJ_L_202401689_EN_TXT.pdf` |
| **Verification Method** | Cross-referenced against official EUR-Lex source and EU AI Act Explorer (artificialintelligenceact.eu) |

---

## Risk Categories Verified

### Unacceptable Risk (Prohibited) — Article 5
**Status:** Active since 2025-02-02

Verified prohibited practices from official source:
- AI systems deploying subliminal techniques beyond a person's consciousness to distort behavior
- AI systems exploiting vulnerabilities due to age, disability, or socio-economic situation
- Social scoring by public authorities leading to detrimental treatment
- Real-time remote biometric identification in publicly accessible spaces (law enforcement exceptions apply)
- Emotion recognition systems in workplace and educational settings
- Biometric categorisation systems inferring sensitive characteristics
- Untargeted scraping of facial images from public sources for facial recognition databases

**Controls.yaml Alignment:** HIGH — All prohibited practices listed in Art-5 control match official source

### High Risk — Articles 6-27
**Status:** Applies from 2026-08-02

Verified high-risk classification (two-tier system):
1. **Annex I products** (Art 6(1)): AI as safety components in EU harmonised products — applies 2027-08-02
2. **Annex III use cases** (Art 6(2)): Biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, justice — applies 2026-08-02

Verified high-risk requirements (Art 8-15):
- Risk management system (Art 9) — continuous iterative process throughout lifecycle
- Data governance (Art 10) — representative, bias-mitigated datasets
- Technical documentation (Art 11) — Annex IV requirements
- Record-keeping (Art 12) — automatic event logging
- Transparency (Art 13) — instructions for use, system characteristics
- Human oversight (Art 14) — enable human intervention
- Accuracy/robustness/cybersecurity (Art 15)

**Controls.yaml Alignment:** HIGH — All 12 high-risk requirement controls (Art-8 through Art-15) verified against official source

### Limited Risk — Article 50
**Status:** Applies from 2026-08-02

Verified transparency obligations:
- Disclosure when interacting with AI systems (unless obvious from context)
- Machine-readable marking of AI-generated synthetic content
- Disclosure of emotion recognition and biometric categorisation use
- Deepfake content disclosure requirements

**Controls.yaml Alignment:** HIGH — Art-50 control accurately reflects official source

### Minimal Risk — No mandatory obligations
No controls required — no verification needed.

---

## GPAI Model Requirements Verified — Articles 51-56

**Status:** Applies from 2025-08-02

| Article | Requirement | Verification |
|---------|-------------|--------------|
| Art 51 | Systemic risk classification (>10^25 FLOPs threshold) | Verified |
| Art 52 | AI Office notification procedure | Verified |
| Art 53 | GPAI provider obligations (documentation, copyright policy, training data summary) | Verified |
| Art 54 | Authorised representatives for non-EU providers | Verified |
| Art 55 | Systemic risk model obligations (evaluations, adversarial testing, incident reporting) | Verified |
| Art 56 | Codes of practice (presumption of conformity) | Verified |

**Controls.yaml Alignment:** HIGH — All 6 GPAI controls (Art-51 through Art-56) match official source

---

## Provider/Deployer Obligations Verified — Articles 16-27

Verified obligations from official source:

| Article | Control ID | Verified |
|---------|------------|----------|
| Art 16 | Art-16 | Provider obligations (QMS, docs, logs, conformity, CE, registration) |
| Art 17 | Art-17 | Quality management system |
| Art 18 | Art-18 | Documentation keeping (10 years) |
| Art 19 | Art-19 | Automatically generated logs (6 months minimum) |
| Art 20 | Art-20 | Corrective actions and duty of information |
| Art 21 | Art-21 | Cooperation with authorities |
| Art 22 | Art-22 | Authorised representatives |
| Art 23 | Art-23 | Importer obligations |
| Art 24 | Art-24 | Distributor obligations |
| Art 25 | Art-25 | Value chain responsibilities |
| Art 26 | Art-26 | Deployer obligations |
| Art 27 | Art-27 | Fundamental rights impact assessment (FRIA) |

**Controls.yaml Alignment:** HIGH — All 12 obligation controls verified against official source

---

## Enforcement Verified — Articles 72, 83, 99

| Article | Control ID | Requirement | Verification |
|---------|------------|--------------|---------------|
| Art 72 | Art-72 | Post-market monitoring system | Verified |
| Art 83 | Art-83 | Formal non-compliance procedures | Verified |
| Art 99 | Art-99 | Penalties structure | Verified |

**Penalties verified from official source:**
- **Art 5 violations:** Up to EUR 35,000,000 or 7% of worldwide annual turnover (whichever higher)
- **Other violations (including Art 50):** Up to EUR 15,000,000 or 3% of worldwide annual turnover
- **Misleading information:** Up to EUR 7,500,000 or 1% of worldwide annual turnover

**Controls.yaml Alignment:** HIGH — All enforcement controls match official source

---

## Discrepancies Found

**NONE** — All 33 controls in controls.yaml have been verified against the official source and accurately reflect the requirements of Regulation (EU) 2024/1689.

### Minor Notes:
1. **Controls.yaml header comment** references "artificialintelligenceact.eu/ai-act-explorer" — this is a valid secondary source but the primary official source is EUR-Lex
2. **Enforcement dates** in controls.yaml match the official implementation timeline
3. **Total count (33 controls)** accurately reflects the number of individual article controls mapped

---

## Verification Confidence

| Category | Confidence |
|----------|------------|
| Prohibited practices (Art 5) | HIGH |
| High-risk classification (Art 6-7) | HIGH |
| High-risk requirements (Art 8-15) | HIGH |
| Obligations (Art 16-27) | HIGH |
| Transparency (Art 50) | HIGH |
| GPAI requirements (Art 51-56) | HIGH |
| Enforcement (Art 72, 83, 99) | HIGH |

**Overall Verification:** COMPLETE — All controls verified against official EUR-Lex source

---

## Sources

- [Regulation (EU) 2024/1689 — EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng)
- [EU AI Act Explorer](https://artificialintelligenceact.eu/ai-act-explorer/)
- [Official Journal PDF — Local Copy](~/ia-framework/standards/frameworks/eu-ai-act/docs/OJ_L_202401689_EN_TXT.pdf)
- [EU AI Act README — Framework Documentation](~/ia-framework/standards/frameworks/eu-ai-act/docs/README.md)
