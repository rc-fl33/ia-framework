# Domain C: Patch Management Questionnaire

**Project:** _______________________________________________
**Completed By:** _______________________________________________
**Date:** _______________________________________________

This questionnaire assesses your organization's patch management maturity across five
categories. Your responses will be scored on a 1-5 maturity scale. Please answer as
accurately as possible — specific examples and tool names significantly improve scoring
accuracy.

**Maturity Scale:**
- 1: Ad-hoc or no formal process
- 2: Documented but inconsistently applied
- 3: Defined and consistently applied
- 4: Measured and managed with metrics
- 5: Optimizing with continuous improvement

---

## Section 1: Patch Management Process

**Context:** Whether a formal patch management policy and process exists.

### 1.1 Patch Policy

- [ ] Formal written patch management policy exists
- [ ] Policy defines patching timelines by severity (Critical/High/Medium/Low)
- [ ] Policy reviewed and updated annually
- [ ] Informal expectations but no written policy
- [ ] No policy

**Policy last reviewed:**
_______________________________________________

**Patch SLA by severity (describe):**
- Critical: _______________
- High: _______________
- Medium: _______________
- Low: _______________

---

### 1.2 Patch Testing

- [ ] All patches tested in dev/staging before production deployment
- [ ] Critical patches deployed to production after brief validation only
- [ ] Patches deployed directly to production without testing
- [ ] Testing process depends on the team

**Testing environment description:**
_______________________________________________

---

### 1.3 Rollback Procedures

- [ ] Documented rollback plan for each patch category
- [ ] Tested rollback procedures at least annually
- [ ] Rollback capability exists but is not formally documented
- [ ] No defined rollback procedure

**Rollback time objective (RTO) for failed patches:**
_______________________________________________

---

### 1.4 Change Management Integration

- [ ] Patching integrated with formal change management process (CAB, ITSM)
- [ ] Change tickets created for patches but no formal CAB review
- [ ] Emergency changes bypass change management
- [ ] No change management process for patches

**ITSM tool used (if applicable):**
_______________________________________________

---

## Section 2: OS and Platform Patching

**Context:** How operating system and infrastructure patches are applied.

### 2.1 Server Patching

- [ ] Automated patch management tool in use (WSUS, SCCM, AWS SSM Patch Manager, etc.)
- [ ] Monthly patching cadence with compliance reporting
- [ ] Quarterly patching cadence
- [ ] Ad-hoc patching only when vulnerabilities are reported
- [ ] Manual patching with no defined cadence

**Tool used for server patching:**
_______________________________________________

**Patching cadence for servers:**
_______________________________________________

**Approximate patch compliance rate (% of servers at current patch level):**
_______________________________________________

---

### 2.2 Desktop/Endpoint Patching

- [ ] Automated endpoint management (Intune, JAMF, Tanium, etc.)
- [ ] Monthly patch cycle with enforcement
- [ ] Quarterly patch cycle
- [ ] User-managed endpoints (self-service updates)
- [ ] No desktop patching program

**Tool used for endpoint patching:**
_______________________________________________

---

### 2.3 Container and Image Patching

- [ ] Base images rebuilt and redeployed on a defined cadence (weekly/monthly)
- [ ] Image scanning integrated into CI/CD (Trivy, Snyk Container, etc.)
- [ ] Container images patched reactively when CVEs are discovered
- [ ] No formal container patching process

**Container scanning tool used:**
_______________________________________________

**Image rebuild cadence:**
_______________________________________________

---

### 2.4 Cloud Service Patching

- [ ] Cloud-managed services (RDS, EKS, etc.) patched via provider maintenance windows
- [ ] Maintenance windows defined and approved by team
- [ ] Cloud services patched automatically with no oversight
- [ ] Cloud service patching is not formally managed

**Maintenance window schedule (if defined):**
_______________________________________________

---

## Section 3: Application Patching

**Context:** How third-party applications and custom software are updated.

### 3.1 Third-Party Application Updates

- [ ] Inventory of all third-party applications maintained
- [ ] Automated alerting for new versions / CVEs for tracked applications
- [ ] Manual tracking and quarterly review of application versions
- [ ] Applications updated reactively only

**Inventory tool or method:**
_______________________________________________

---

### 3.2 Custom Application Deployment

- [ ] CI/CD pipeline with automated deployment and rollback
- [ ] Scripted deployment process with manual approval
- [ ] Manual deployment process
- [ ] Deployment process varies by application

**CI/CD tool used:**
_______________________________________________

**Average deployment frequency for production applications:**
_______________________________________________

---

### 3.3 Database Patching

- [ ] Database patches applied on the same cadence as OS patches
- [ ] Database patches applied quarterly with DBA review
- [ ] Database patches applied reactively
- [ ] Database patching not formally managed

**Database platform(s) in scope:**
_______________________________________________

---

## Section 4: Emergency and Critical Patch Procedures

**Context:** How the organization responds to zero-days and critical vulnerabilities.

### 4.1 Out-of-Cycle Patch Process

- [ ] Documented emergency patch process exists
- [ ] Emergency patch authority defined (who can approve out-of-cycle changes)
- [ ] Emergency patches handled case-by-case
- [ ] No defined emergency patch process

**Emergency patch approval authority:**
_______________________________________________

---

### 4.2 Time to Deploy Critical Patches

- [ ] Critical patches deployed within 24 hours
- [ ] Critical patches deployed within 72 hours
- [ ] Critical patches deployed within 7 days
- [ ] No defined SLA for critical patches

**Most recent critical patch (CVE/description and time-to-deploy):**
_______________________________________________

---

### 4.3 Communication Plan

- [ ] Stakeholder communication plan for critical patches exists
- [ ] IT and security notified automatically for critical CVEs (vulnerability feed)
- [ ] Notifications handled manually when issues are discovered
- [ ] No formal communication plan

**Vulnerability intelligence sources used:**
_______________________________________________

---

## Section 5: Maturity Self-Assessment

**Context:** Your own assessment of patch management maturity by category.

Please rate each category on a 1-5 scale using the maturity definitions at the top of
this questionnaire.

| Category | Self-Assessed Score (1-5) | Notes |
|----------|--------------------------|-------|
| Process (policy, SLA, governance) | | |
| OS/Platform (servers, endpoints, containers) | | |
| Application (third-party apps, custom, databases) | | |
| Emergency (out-of-cycle, critical response) | | |
| Governance (metrics, reporting, executive oversight) | | |

**Overall self-assessment summary:**
_______________________________________________

---

## Additional Notes

Please provide any context that would help us understand your patch management program,
including recent improvements, known challenges, or upcoming changes:

_______________________________________________

_______________________________________________

_______________________________________________

---

**Return this completed questionnaire to:** `private/input/sec-review/{project}/`
**This questionnaire is required before Domain C analysis can begin in Phase 2.**
