# OWASP Top 10 for LLM Applications 2025

The OWASP Top 10 for LLM Applications identifies the ten most critical security risks for applications built on large language models. Published November 18, 2024 as version 2025 (v2.0), this framework is produced by a community of developers, data scientists, and security professionals.

**Official source:** https://genai.owasp.org / https://owasp.org/www-project-top-10-for-large-language-model-applications/
**License:** CC BY-SA 4.0

## The Ten Vulnerabilities

| ID | Vulnerability | Risk Weight |
|----|--------------|-------------|
| LLM01:2025 | Prompt Injection | HIGH |
| LLM02:2025 | Sensitive Information Disclosure | HIGH |
| LLM03:2025 | Supply Chain Vulnerabilities | MEDIUM |
| LLM04:2025 | Data and Model Poisoning | HIGH |
| LLM05:2025 | Improper Output Handling | MEDIUM |
| LLM06:2025 | Excessive Agency | HIGH |
| LLM07:2025 | System Prompt Leakage | MEDIUM |
| LLM08:2025 | Vector and Embedding Weaknesses | MEDIUM |
| LLM09:2025 | Misinformation | MEDIUM |
| LLM10:2025 | Unbounded Consumption | MEDIUM |

## Vulnerability Summaries

**LLM01 Prompt Injection** — User prompts alter LLM behavior in unintended ways. Includes direct injection (malicious user input) and indirect injection (malicious content in external sources like websites or files). No fool-proof prevention exists due to generative AI's stochastic nature; mitigation focuses on input filtering, privilege control, and adversarial testing.

**LLM02 Sensitive Information Disclosure** — LLMs expose PII, proprietary algorithms, security credentials, or confidential business data through outputs. Risk includes training data inversion attacks (CVE-2019-20634). Prevention requires data sanitization, access controls, differential privacy, and federated learning.

**LLM03 Supply Chain Vulnerabilities** — Third-party models, LoRA adapters, training datasets, and model repositories introduce integrity risks. Attacks include vulnerable pre-trained models, LoRA adapter compromise, collaborative model merge exploitation, and on-device firmware vulnerabilities. Mitigation requires SBOM/AI-BOM, provenance verification, and supplier vetting.

**LLM04 Data and Model Poisoning** — Training, fine-tuning, or embedding data manipulation introduces backdoors, biases, or vulnerabilities. Poisoned models can function as sleeper agents activated by triggers. Prevention requires data lineage tracking, version control, sandboxing, and adversarial robustness testing.

**LLM05 Improper Output Handling** — Insufficient validation of LLM outputs before passing to downstream systems enables XSS, CSRF, SSRF, SQL injection, path traversal, and remote code execution. Prevention requires zero-trust treatment of LLM output, context-aware encoding, and parameterized queries.

**LLM06 Excessive Agency** — LLM agents granted excessive functionality, permissions, or autonomy perform damaging actions in response to hallucinations or prompt injection. Root causes are excessive functionality, excessive permissions, and excessive autonomy. Prevention requires minimizing extensions, enforcing least privilege, and requiring human approval for high-impact actions.

**LLM07 System Prompt Leakage** — System prompts containing sensitive information (credentials, business rules, permission structures) are discoverable by attackers. The real risk is not prompt disclosure itself, but storing sensitive data where it should not be and delegating security controls to the LLM. Prevention requires externalizing sensitive data and enforcing security controls outside the LLM.

**LLM08 Vector and Embedding Weaknesses** — RAG systems face risks from unauthorized access to embedding stores, cross-tenant information leakage in shared vector databases, embedding inversion attacks, and knowledge base data poisoning. Prevention requires permission-aware vector stores, data validation pipelines, and retrieval activity logging.

**LLM09 Misinformation** — LLMs produce false or misleading information through hallucination or training bias, with overreliance compounding harm. Real-world impacts include legal liability (Air Canada chatbot lawsuit, ChatGPT fabricated legal cases). Prevention requires RAG grounding, human oversight, output validation, and user disclosure of limitations.

**LLM10 Unbounded Consumption** — Excessive uncontrolled LLM inference enables denial of service, Denial of Wallet (DoW) against cloud deployments, and model extraction via crafted API queries. Prevention requires rate limiting, input size restrictions, resource monitoring, and logit exposure restrictions.

## Use for LLM Application Security Review

This framework is used when assessing the security posture of applications that integrate large language models, including:

- Customer-facing chatbots and conversational AI
- LLM-powered coding assistants and development tools
- Agentic AI systems with tool access and external integrations
- RAG-based knowledge retrieval applications
- Document processing pipelines using LLMs
- Multi-modal AI applications processing images, audio, and text

## Related Frameworks Referenced in Source

The OWASP source document explicitly maps to MITRE ATLAS techniques for each vulnerability. See `../controls.yaml` for the specific technique mappings per vulnerability.

The source also references NIST AI Risk Management Framework for LLM04 data integrity strategies.
