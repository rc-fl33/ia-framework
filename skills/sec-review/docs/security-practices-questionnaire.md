# Domain B: Security Practices Questionnaire

**Project:** _______________________________________________
**Completed By:** _______________________________________________
**Date:** _______________________________________________

This questionnaire assesses your organization's security practices across five areas. Your
responses will be scored against OWASP SAMM and NIST SSDF baselines to identify gaps and
prioritize improvements. Please answer as accurately as possible — partial information is
better than no information.

---

## Section 1: SDLC Security Integration

**Context:** How security is embedded in your software development lifecycle.

### 1.1 Security Design Reviews

- [ ] Formal threat modeling is performed for new features or architectural changes
- [ ] Security requirements are defined before development begins
- [ ] Security is a gate in the design approval process
- [ ] Ad-hoc security discussions occur but are not formalized

**Frequency of security design reviews:**
_______________________________________________

**Last threat model performed:**
_______________________________________________

**Notes / additional context:**
_______________________________________________

---

### 1.2 Security Requirements in Development

- [ ] Security user stories or security requirements exist in the backlog
- [ ] Acceptance criteria include security conditions
- [ ] Developers are trained on secure coding before contributing
- [ ] Security is reviewed during code review (informal)
- [ ] Security is a mandatory gate in pull request approval

**Tools or processes used to track security requirements:**
_______________________________________________

---

### 1.3 Developer Security Training

- [ ] Regular security training provided to all developers
- [ ] Role-specific training (e.g., mobile security for mobile devs)
- [ ] Security awareness training only (not developer-specific)
- [ ] No formal security training program

**Training frequency:**
_______________________________________________

---

## Section 2: Secure Coding Standards

**Context:** Whether your team follows documented secure coding guidelines.

### 2.1 Coding Standards Existence

- [ ] Documented secure coding standard exists and is actively maintained
- [ ] Language/framework-specific security guidance documents exist
- [ ] Informal coding conventions exist but are not security-focused
- [ ] No documented coding standards

**Link to or description of standards:**
_______________________________________________

---

### 2.2 Input Validation Practices

- [ ] All external inputs are validated before processing
- [ ] Parameterized queries / prepared statements are mandatory
- [ ] Output encoding is enforced for all user-facing output
- [ ] Input validation is left to individual developer judgment

**Primary validation approach used:**
_______________________________________________

---

### 2.3 Framework and Library Security

- [ ] Approved framework list exists with security-vetted versions
- [ ] Security configuration guides for frameworks are documented
- [ ] Developers choose frameworks and libraries without formal guidance
- [ ] Framework security is not formally addressed

---

## Section 3: Vulnerability Management

**Context:** How discovered vulnerabilities are tracked, triaged, and resolved.

### 3.1 Vulnerability Triage Process

- [ ] Formal triage process with defined severity classification exists
- [ ] SLA defined by severity (e.g., Critical: 24h, High: 7d, Medium: 30d)
- [ ] Vulnerability tracking system in use (Jira, GitHub Issues, etc.)
- [ ] Vulnerabilities are tracked informally (spreadsheets, email)
- [ ] No formal tracking process

**Tracking tool used:**
_______________________________________________

**SLA by severity (describe or leave blank):**
- Critical: _______________
- High: _______________
- Medium: _______________
- Low: _______________

---

### 3.2 Vulnerability Reporting

- [ ] Responsible disclosure / bug bounty program exists
- [ ] Security contact published (e.g., security.txt)
- [ ] Internal security reporting channel exists
- [ ] No formal reporting mechanism

**External disclosure URL (if applicable):**
_______________________________________________

---

## Section 4: Dependency Management

**Context:** How third-party libraries and dependencies are managed for security.

### 4.1 Software Composition Analysis (SCA)

- [ ] Automated SCA tool in use (Snyk, Dependabot, OWASP Dependency-Check, etc.)
- [ ] SCA integrated into CI/CD pipeline with blocking on critical CVEs
- [ ] SCA runs periodically but not on every build
- [ ] Manual review of dependencies only
- [ ] No SCA process

**SCA tool used:**
_______________________________________________

**SCA enforcement level (block / warn / report only):**
_______________________________________________

---

### 4.2 Dependency Update Cadence

- [ ] Automated PRs for dependency updates (e.g., Dependabot, Renovate)
- [ ] Regular scheduled review and update of dependencies (monthly or more frequent)
- [ ] Dependencies updated when a vulnerability is discovered
- [ ] Dependencies rarely updated after initial inclusion

**Update cadence description:**
_______________________________________________

---

### 4.3 License Compliance

- [ ] Automated license scanning in place
- [ ] Approved license list maintained
- [ ] License review performed manually
- [ ] License compliance not formally managed

---

## Section 5: Security Testing

**Context:** What automated and manual security testing is performed.

### 5.1 Static Application Security Testing (SAST)

- [ ] SAST tool integrated into CI/CD pipeline
- [ ] SAST runs on every pull request
- [ ] SAST runs periodically (weekly/monthly)
- [ ] SAST performed manually or on-demand only
- [ ] No SAST process

**SAST tool used:**
_______________________________________________

**SAST blocking policy (block PR on findings / warn / informational):**
_______________________________________________

---

### 5.2 Dynamic Application Security Testing (DAST)

- [ ] DAST integrated into CI/CD or deployment pipeline
- [ ] DAST runs against staging environment before production release
- [ ] DAST performed periodically (quarterly or more)
- [ ] DAST performed only for compliance-driven assessments
- [ ] No DAST process

**DAST tool used:**
_______________________________________________

---

### 5.3 Penetration Testing

- [ ] Annual external penetration test by third party
- [ ] Internal red team or penetration testing program
- [ ] Penetration testing performed on major releases only
- [ ] No formal penetration testing

**Last penetration test date:**
_______________________________________________

**Scope of last test:**
_______________________________________________

---

### 5.4 Bug Bounty Program

- [ ] Public bug bounty program (HackerOne, Bugcrowd, Intigriti, etc.)
- [ ] Private bug bounty program (invite-only)
- [ ] No bug bounty program

**Platform and scope URL (if applicable):**
_______________________________________________

---

## Additional Notes

Please provide any additional context that would help us understand your security practices:

_______________________________________________

_______________________________________________

_______________________________________________

---

**Return this completed questionnaire to:** `private/input/sec-review/{project}/`
**This questionnaire is required before Domain B analysis can begin in Phase 2.**
