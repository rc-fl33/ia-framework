# OWASP Top 10 for LLM Applications - Official Sources Verification

## Official Source Information

| Attribute | Value |
|-----------|-------|
| **Official URL** | https://owasp.org/www-project-top-10-for-large-language-model-applications/ |
| **Verification Date** | 2026-03-03 |
| **Version Referenced** | Version 1.1 (2025) |
| **Alternative Resource** | https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/ |

---

## Official OWASP Top 10 for LLM Applications (2025)

| # | ID | Vulnerability Name |
|---|----|-------------------|
| 1 | LLM01 | Prompt Injection |
| 2 | LLM02 | Insecure Output Handling |
| 3 | LLM03 | Training Data Poisoning |
| 4 | LLM04 | Model Denial of Service |
| 5 | LLM05 | Supply Chain Vulnerabilities |
| 6 | LLM06 | Sensitive Information Disclosure |
| 7 | LLM07 | Insecure Plugin Design |
| 8 | LLM08 | Excessive Agency |
| 9 | LLM09 | Overreliance |
| 10 | LLM10 | Model Theft |

---

## Verification Results

### Status: MAJOR DISCREPANCIES FOUND

The local controls.yaml (`/home/groves/ia-framework-private/standards/frameworks/owasp-llm/controls.yaml`) does NOT match the official OWASP Top 10 for LLM Applications 2025.

### Detailed Comparison

| Local ID | Local Title | Official ID | Official Title | Match? |
|----------|-------------|-------------|----------------|--------|
| LLM01 | Prompt Injection | LLM01 | Prompt Injection | YES |
| LLM02 | Sensitive Information Disclosure | LLM02 | Insecure Output Handling | **NO** |
| LLM03 | Supply Chain Vulnerabilities | LLM03 | Training Data Poisoning | **NO** |
| LLM04 | Data and Model Poisoning | LLM04 | Model Denial of Service | **NO** |
| LLM05 | Improper Output Handling | LLM05 | Supply Chain Vulnerabilities | **NO** |
| LLM06 | Excessive Agency | LLM06 | Sensitive Information Disclosure | **NO** |
| LLM07 | System Prompt Leakage | LLM07 | Insecure Plugin Design | **NO** |
| LLM08 | Vector and Embedding Weaknesses | LLM08 | Excessive Agency | **NO** |
| LLM09 | Misinformation | LLM09 | Overreliance | **NO** |
| LLM10 | Unbounded Consumption | LLM10 | Model Theft | **NO** |

---

## Discrepancy Analysis

### Matching Controls (1/10)
- **LLM01: Prompt Injection** - The only control that aligns with the official source.

### Non-Matching Controls (9/10)

All other controls have significant discrepancies:

1. **LLM02**: Local uses "Sensitive Information Disclosure" vs Official "Insecure Output Handling"
2. **LLM03**: Local uses "Supply Chain Vulnerabilities" vs Official "Training Data Poisoning"
3. **LLM04**: Local uses "Data and Model Poisoning" vs Official "Model Denial of Service"
4. **LLM05**: Local uses "Improper Output Handling" vs Official "Supply Chain Vulnerabilities"
5. **LLM06**: Local uses "Excessive Agency" vs Official "Sensitive Information Disclosure"
6. **LLM07**: Local uses "System Prompt Leakage" vs Official "Insecure Plugin Design"
7. **LLM08**: Local uses "Vector and Embedding Weaknesses" vs Official "Excessive Agency"
8. **LLM09**: Local uses "Misinformation" vs Official "Overreliance"
9. **LLM10**: Local uses "Unbounded Consumption" vs Official "Model Theft"

---

## Recommendations

**The controls.yaml file requires a complete overhaul to align with the official OWASP Top 10 for LLM Applications 2025.**

The local file appears to be based on a significantly different version or classification scheme. Only 1 of 10 controls (10%) matches the official source.

### Suggested Actions
1. Replace all 10 controls in controls.yaml to match official OWASP LLM Top 10 2025
2. Update the framework version metadata to reflect alignment
3. Verify MITRE ATLAS mappings align with official categories

---

## Official Vulnerability Descriptions (for reference)

### LLM01: Prompt Injection
Manipulating LLMs via crafted inputs can lead to unauthorized access, data breaches, and compromised decision-making.

### LLM02: Insecure Output Handling
Neglecting to validate LLM outputs may lead to downstream security exploits, including code execution that compromises systems and exposes data.

### LLM03: Training Data Poisoning
Tampered training data can impair LLM models leading to responses that may compromise security, accuracy, or ethical behavior.

### LLM04: Model Denial of Service
Overloading LLMs with resource-heavy operations can cause service disruptions and increased costs.

### LLM05: Supply Chain Vulnerabilities
Depending upon compromised components, services, or datasets undermine system integrity, causing data breaches and system failures.

### LLM06: Sensitive Information Disclosure
Failure to protect against disclosure of sensitive information in LLM outputs can result in legal consequences or a loss of competitive advantage.

### LLM07: Insecure Plugin Design
LLM plugins processing untrusted inputs and having insufficient access control risk severe exploits like remote code execution.

### LLM08: Excessive Agency
Granting LLMs unchecked autonomy to take action can lead to unintended consequences, jeopardizing reliability, privacy, and trust.

### LLM09: Overreliance
Failing to critically assess LLM outputs can lead to compromised decision making, security vulnerabilities, and legal liabilities.

### LLM10: Model Theft
Unauthorized access to proprietary large language models risks theft, competitive advantage, and dissemination of sensitive information.

---

*Document generated: 2026-03-03*
*Verification performed against: https://owasp.org/www-project-top-10-for-large-language-model-applications/*
