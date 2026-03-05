# Supply Chain Security Assessment Questionnaire (Domain E)

**Project:** ______________________________
**Completed by:** ______________________________
**Date:** ______________________________

---

## Instructions

Complete this questionnaire before the Phase 2 supply chain security analysis. This assessment
evaluates your software supply chain practices against NIST SSDF, SLSA, and CIS Control 16.

---

## Section 1: Software Bill of Materials (SBOM)

1. Does your organization produce a Software Bill of Materials (SBOM)?
   - [ ] Yes — Format: [ ] SPDX [ ] CycloneDX [ ] Other: ______
   - [ ] No
   - [ ] In progress

2. If yes, how is the SBOM generated? (tool name and version):

3. Is the SBOM consumed by any security tooling (vulnerability scanning, compliance)?

4. Is the SBOM shared with customers or embedded in release artifacts?

---

## Section 2: Third-Party Dependencies

5. Is Software Composition Analysis (SCA) tooling in use?
   - [ ] Yes — Tool(s): ______
   - [ ] No

6. How are open source dependencies managed?
   - Are dependency versions pinned (lockfiles used)?
   - Is there a policy for acceptable OSS licenses?

7. What is the SLA for patching known vulnerabilities in dependencies?
   - Critical: ______
   - High: ______
   - Medium: ______

8. Is there an approved dependency allowlist/blocklist?
   How are new dependencies vetted before use?

9. How are transitive dependencies monitored?

---

## Section 3: Build System Security

10. Where does your CI/CD pipeline run?
    - [ ] GitHub Actions
    - [ ] GitLab CI
    - [ ] Jenkins
    - [ ] CircleCI
    - [ ] Other: ______

11. Are build environments isolated and ephemeral (fresh per build)?

12. How are secrets managed in the build pipeline?
    - [ ] Native secrets management (GitHub Secrets, etc.)
    - [ ] Vault / external secrets manager
    - [ ] Hardcoded in scripts (flagged as gap)
    - [ ] Environment variables from CI platform

13. Is the build process reproducible? Can a given commit always produce the same artifact?

14. Are build scripts version-controlled and reviewed via pull request?

---

## Section 4: Artifact Integrity and Code Signing

15. Are release artifacts signed?
    - [ ] Yes — Signing mechanism: ______
    - [ ] No

16. Are container images signed?
    - [ ] Yes — Tool: [ ] cosign [ ] Notary [ ] Other: ______
    - [ ] No

17. Is provenance information (build attestations) attached to artifacts?
    What SLSA level does your build process currently meet?
    - [ ] SLSA Level 1
    - [ ] SLSA Level 2
    - [ ] SLSA Level 3
    - [ ] SLSA Level 4
    - [ ] Not assessed

18. Are artifact checksums verified before deployment?

---

## Section 5: Vendor and Third-Party Risk

19. Is there a formal process for assessing third-party software vendors?
    Describe the process:

20. Do vendor contracts include security requirements (SSDF compliance, breach notification)?

21. Is there an inventory of third-party software components and vendors?
    How is it maintained?

22. How are security incidents at third-party vendors handled?
    Is there a defined escalation path?

---

## Section 6: Container and Image Security

23. Are container base images sourced from trusted, minimal base images?
    Which base images are used (e.g., distroless, Alpine, official vendor images)?

24. Are container images scanned for vulnerabilities before deployment?
    - [ ] Yes — Tool: ______  Frequency: ______
    - [ ] No

25. Is there an image allowlist? Are arbitrary external images blocked?

26. Are container images updated regularly when base image patches are available?

---

## Section 7: Supply Chain Incident Response

27. Has your organization experienced a supply chain security incident?
    If yes, briefly describe how it was detected and remediated:

28. Is there a defined process for responding to supply chain security events
    (e.g., a dependency found to contain malware, a build tool compromised)?

29. Do you monitor security advisories for your build tools and CI/CD platform?

---

## Supporting Materials (attach if available)

- [ ] SBOM file (SPDX or CycloneDX)
- [ ] SCA scan report
- [ ] CI/CD pipeline configuration
- [ ] SLSA provenance attestations
- [ ] Vendor security assessment questionnaires
- [ ] Container image scan report
- [ ] Dependency policy document

---

**Return this completed questionnaire to:** `private/input/sec-review/{project}/`
**This questionnaire is required before Domain E analysis can begin in Phase 2.**
