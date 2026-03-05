# MITRE ATLAS

**Framework:** MITRE ATLAS (Adversarial Threat Landscape for AI Systems)
**Version:** 5.1.0 (November 2025)
**Publisher:** MITRE Corporation
**Source:** https://atlas.mitre.org/
**Source Data:** https://github.com/mitre-atlas/atlas-data (commit 467ffbd2)

## Overview

MITRE ATLAS is a knowledge base of adversary tactics and techniques against artificial
intelligence systems. It is modeled after the MITRE ATT&CK framework and is designed to
be complementary to it. Where ATT&CK covers traditional IT attack patterns, ATLAS covers
attacks that specifically target AI/ML components including machine learning models,
training pipelines, inference APIs, and generative AI systems.

ATLAS is used for:
- Threat modeling AI/ML systems
- Red team exercise planning against AI-enabled systems
- Gap analysis of AI system defenses
- AI incident classification and reporting
- Mapping organizational AI security controls to known adversary techniques

## Tactics (16 total)

| ID | Name | Description |
|----|------|-------------|
| AML.TA0000 | AI Model Access | Gaining access to a target AI model |
| AML.TA0001 | AI Attack Staging | Tailoring the attack using access to the target system |
| AML.TA0002 | Reconnaissance | Gathering information about the AI system |
| AML.TA0003 | Resource Development | Establishing resources to support operations |
| AML.TA0004 | Initial Access | Gaining access to the AI system |
| AML.TA0005 | Execution | Running malicious code embedded in AI artifacts |
| AML.TA0006 | Persistence | Maintaining foothold via AI artifacts or software |
| AML.TA0007 | Defense Evasion | Avoiding detection by AI-enabled security software |
| AML.TA0008 | Discovery | Understanding the AI environment |
| AML.TA0009 | Collection | Gathering AI artifacts and related information |
| AML.TA0010 | Exfiltration | Stealing AI artifacts or information about the AI system |
| AML.TA0011 | Impact | Manipulating, interrupting, or destroying AI systems and data |
| AML.TA0012 | Privilege Escalation | Gaining higher-level permissions |
| AML.TA0013 | Credential Access | Stealing account names and passwords |
| AML.TA0014 | Command and Control | Communicating with compromised AI systems |
| AML.TA0015 | Lateral Movement | Moving through the AI environment |

## Technique Summary

The v5.1.0 data contains 84 parent techniques and 56 sub-techniques across 16 tactics.
Key technique categories include:

**Classical Adversarial ML Attacks**
- Crafting adversarial data (AML.T0043) to evade or degrade models
- Training proxy models (AML.T0005) for offline attack staging
- Model extraction via inference API (AML.T0024.002)
- Training data poisoning (AML.T0020)

**Generative AI / LLM Attacks** (newer, from v4.7+)
- LLM Prompt Injection including Direct, Indirect, and Triggered (AML.T0051)
- LLM Jailbreak (AML.T0054)
- Prompt Infiltration via Public-Facing Application (AML.T0093)
- RAG Poisoning (AML.T0070)
- AI Agent Context Poisoning (AML.T0080)

**AI Agent Attacks** (newer, from v5.0+)
- AI Agent Tool Invocation abuse (AML.T0053)
- Exfiltration via AI Agent Tool Invocation (AML.T0086)
- Credentials from AI Agent Configuration (AML.T0083)
- RAG Credential Harvesting (AML.T0082)
- Modify AI Agent Configuration (AML.T0081)

## Mitigations (32 total)

Key mitigations from the source data (AML.M0000 through AML.M0031):

- AML.M0000: Limit Public Release of Information
- AML.M0003: Model Hardening
- AML.M0004: Restrict Number of AI Model Queries
- AML.M0007: Sanitize Training Data
- AML.M0008: Validate AI Model
- AML.M0015: Adversarial Input Detection
- AML.M0019: Control Access to AI Models and Data in Production
- AML.M0020: Generative AI Guardrails
- AML.M0021: Generative AI Guidelines
- AML.M0022: Generative AI Model Alignment
- AML.M0023: AI Bill of Materials
- AML.M0024: AI Telemetry Logging
- AML.M0025: Maintain AI Dataset Provenance
- AML.M0026: Privileged AI Agent Permissions Configuration
- AML.M0029: Human In-the-Loop for AI Agent Actions
- AML.M0031: Memory Hardening

## Use in AI Security Assessments

ATLAS is used as the native control mapping for AI security threat assessments within
this framework. Assessment questions map directly to ATLAS technique IDs, allowing
organizations to evaluate their defenses against specific known attack patterns.

Priority tactics for assessment purposes:
1. AI Attack Staging (AML.TA0001) — covers the most commonly observed preparation steps
2. Initial Access (AML.TA0004) — supply chain, prompt injection, credential abuse
3. Persistence (AML.TA0006) — RAG poisoning, agent context poisoning, training data poisoning
4. Exfiltration (AML.TA0010) — model extraction, data leakage, LLM response rendering
5. Impact (AML.TA0011) — model integrity erosion, denial of service, external harms

## Case Studies

The source data includes 42 documented real-world and exercise case studies including:
- AML.CS0002: VirusTotal Poisoning
- AML.CS0019: PoisonGPT
- AML.CS0020: Indirect Prompt Injection Threats: Bing Chat Data Pirate
- AML.CS0022: ChatGPT Package Hallucination
- AML.CS0023: ShadowRay
- AML.CS0024: Morris II Worm: RAG-Based Attack
- AML.CS0029: Google Bard Conversation Exfiltration
- AML.CS0030: LLM Jacking
- AML.CS0037: Data Exfiltration via Agent Tools in Copilot Studio

## Related Resources

- ATLAS Navigator: https://mitre-atlas.github.io/atlas-navigator/
- ATLAS Navigator Data (STIX/ATT&CK layers): https://github.com/mitre-atlas/atlas-navigator-data
- MITRE ATT&CK (complementary): https://attack.mitre.org/
