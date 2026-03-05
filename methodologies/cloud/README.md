
## Available Frameworks

### AWS Security Testing
**File:** `aws-framework.md` (400 lines)
**Load When:** AWS resources in scope
**Indicators:** Account IDs, ARNs, EC2, S3, RDS, Lambda, us-east-1, etc.
**Foundation:** CIS AWS Foundations Benchmark + AWS Well-Architected + prowler
**Primary Tool:** prowler

### GCP Security Testing
**File:** `gcp-framework.md` (380 lines)
**Load When:** GCP resources in scope
**Indicators:** Project IDs, Compute Engine, GCS, GKE, Cloud SQL, us-central1, etc.
**Foundation:** CIS GCP Foundations Benchmark + GCP Security Best Practices + scoutsuite
**Primary Tool:** scoutsuite

### Azure Security Testing
**File:** `azure-framework.md` (420 lines)
**Load When:** Azure resources in scope
**Indicators:** Subscription GUIDs, VMs, Storage Accounts, SQL Database, AKS, eastus, etc.
**Foundation:** CIS Azure Foundations Benchmark + Microsoft Cloud Security Benchmark + scoutsuite
**Primary Tool:** scoutsuite

### Multi-Cloud Framework
**File:** `multi-cloud-framework.md` (200 lines)
**Load When:** Multiple cloud platforms in scope OR need decision tree
**Purpose:** Scope detection logic and cross-cloud attack vectors
**Always read first:** YES (contains decision tree logic)

---

## Usage Pattern

### For Security Agent

**Step 1: Load Decision Tree**
```
Read: skills/pentest/methodologies/cloud/multi-cloud-framework.md
```

**Step 2: Detect Scope**
```
Read: SCOPE.md (or engagement scope documentation)

Identify cloud platforms:
- AWS? Look for: Account IDs (12 digits), ARNs, AWS services, AWS regions
- GCP? Look for: Project IDs, GCP services, GCP regions
- Azure? Look for: Subscription GUIDs, Azure services, Azure regions
```

**Step 3: Load Relevant Frameworks**
```
IF AWS in scope:
    Read: skills/pentest/methodologies/cloud/aws-framework.md

IF GCP in scope:
    Read: skills/pentest/methodologies/cloud/gcp-framework.md

IF Azure in scope:
    Read: skills/pentest/methodologies/cloud/azure-framework.md
```

**Step 4: Execute Testing**
```
Follow EXPLORE-PLAN-CODE-COMMIT phases from loaded framework(s)
```

---

## Decision Tree Examples

### Example 1: AWS-Only Scope

**SCOPE.md contains:**
```
AWS Account: 123456789012
Regions: us-east-1, us-west-2
Services: EC2, S3, RDS, Lambda
```

**Action:**
```
✅ Read: multi-cloud-framework.md (decision tree)
✅ Read: aws-framework.md (AWS-specific)
❌ Skip: gcp-framework.md
❌ Skip: azure-framework.md
```

**Result:** 600 lines loaded instead of 1,400 lines (57% reduction)

---

### Example 2: GCP-Only Scope

**SCOPE.md contains:**
```
GCP Project: acme-production
Services: Compute Engine, Cloud Storage, GKE, Cloud SQL
Regions: us-central1, europe-west1
```

**Action:**
```
✅ Read: multi-cloud-framework.md (decision tree)
✅ Read: gcp-framework.md (GCP-specific)
❌ Skip: aws-framework.md
❌ Skip: azure-framework.md
```

**Result:** 580 lines loaded instead of 1,400 lines (59% reduction)

---

### Example 3: Multi-Cloud Scope

**SCOPE.md contains:**
```
AWS Account: 123456789012
GCP Project: my-project-prod
Azure Subscription: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Action:**
```
✅ Read: multi-cloud-framework.md (decision tree + cross-cloud considerations)
✅ Read: aws-framework.md (AWS-specific)
✅ Read: gcp-framework.md (GCP-specific)
✅ Read: azure-framework.md (Azure-specific)
```

**Result:** 1,400 lines loaded (all frameworks needed)

---

### Example 4: No Cloud in Scope

**SCOPE.md contains:**
```
Web Application: https://example.com
API Endpoints: /api/v1/*
Mobile App: iOS and Android
```

**Action:**
```
❌ Skip: ALL cloud frameworks (not relevant)
✅ Read: web-app or mobile methodologies instead
```

**Result:** 0 cloud context loaded (100% reduction)

---

## Framework Comparison

| Platform | Controls | Primary Tool | Privilege Escalation Techniques | Services Covered |
|----------|----------|--------------|--------------------------------|------------------|
| AWS | 60+ CIS | prowler | 21 vectors | IAM, S3, EC2, RDS, Lambda, VPC, CloudTrail, KMS |
| GCP | 70+ CIS | scoutsuite | 15 vectors | IAM, GCS, Compute Engine, Cloud SQL, GKE, VPC |
| Azure | 90+ CIS | scoutsuite | 18 vectors | Azure AD, Storage, VMs, SQL Database, AKS, VNet |

---

## Universal Testing Phases

**All cloud platforms use the same EXPLORE-PLAN-CODE-COMMIT workflow:**

### EXPLORE Phase
1. Read SCOPE.md for cloud platforms
2. Enumerate accounts/projects/subscriptions
3. Map IAM permissions
4. Identify public resources
5. Threat modeling

### PLAN Phase
1. Prioritize vulnerabilities
2. Check `/servers` for tools
3. Generate test plan
4. Get user approval

### CODE Phase
1. Automated scanning (prowler/scoutsuite)
2. Manual enumeration (CLI)
3. Privilege escalation testing
4. Network testing
5. Evidence collection

### COMMIT Phase
1. Document findings (CIS control mapping)
2. Remediation recommendations
3. Compliance framework alignment
4. Executive summary

---

## Common Vulnerabilities Across All Clouds

**Consistent across AWS/GCP/Azure:**

1. **IAM:** Overly permissive roles, missing MFA, unused credentials
2. **Storage:** Public buckets/blobs, unencrypted data, weak policies
3. **Networking:** 0.0.0.0/0 firewall rules, public instances, missing flow logs
4. **Logging:** Disabled audit logs, short retention, missing SIEM
5. **Encryption:** Default keys only, weak rotation, missing TLS

---

## Tool Deployment Requirements

**Cloud security tools in `/servers`:**

### AWS
- prowler (CIS scanning) - **CRITICAL**
- aws-cli (manual enumeration) - **CRITICAL**
- pacu (exploitation framework) - Optional

### GCP
- scoutsuite (CIS scanning) - **CRITICAL**
- gcloud CLI (manual enumeration) - **CRITICAL**
- gcpwn (exploitation) - Optional

### Azure
- scoutsuite (CIS scanning) - **CRITICAL**
- az CLI (manual enumeration) - **CRITICAL**
- MicroBurst (exploitation) - Optional
- AzureHound (privilege escalation) - Optional

**See:** `plans/tool-deployment-plan.md` for deployment procedures

---

## Compliance Framework Coverage

**CIS Benchmarks:**
- AWS: CIS AWS Foundations Benchmark v3.0.0
- GCP: CIS GCP Foundations Benchmark v2.0.0
- Azure: CIS Azure Foundations Benchmark v2.1.0

**Additional Standards:**
- NIST SP 800-53 (AWS, Azure)
- NIST SP 800-171 (AWS, Azure)
- ISO 27001 (All)
- PCI-DSS (All)
- HIPAA (All)
- SOC 2 (All)

---

## Reference Resources

### Local Resources (Dynamic Discovery)

**Compliance Frameworks:** Use WebFetch for latest cloud compliance frameworks
- PCI-DSS: https://www.pcisecuritystandards.org/
- NIST SP 800: https://csrc.nist.gov/publications/
- HIPAA: https://www.hhs.gov/hipaa/

**CIS Benchmarks:** Use WebFetch for CIS cloud benchmarks or see `private/docs/book-catalog.md`

### Web Resources (Cloud-Specific)

**AWS:**
- CIS Benchmark: https://www.cisecurity.org/benchmark/amazon_web_services
- AWS Well-Architected: https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/
- Security Hub: https://docs.aws.amazon.com/securityhub/latest/userguide/standards-reference.html

**Azure:**
- CIS Benchmark: https://www.cisecurity.org/benchmark/azure
- Microsoft Cloud Security Benchmark: https://learn.microsoft.com/en-us/security/benchmark/azure/

**GCP:**
- CIS Benchmark: https://www.cisecurity.org/benchmark/google_cloud_computing_platform
- GCP Security Best Practices: https://cloud.google.com/security/best-practices

**General:**
- Cloud Security Alliance (CSA): https://cloudsecurityalliance.org/

---

## Summary: Efficient Context Loading

**Traditional Approach (BAD):**
```
Load all 3 cloud frameworks = 1,200 lines
Use 400 lines (AWS testing)
Waste 800 lines (60-70% unused context)
```

**Scope-Based Approach (GOOD):**
```
Load multi-cloud-framework.md = 200 lines (decision tree)
Detect scope = AWS only
Load aws-framework.md = 400 lines
Total: 600 lines (50% reduction)
```

**Result:** 2-3x more efficient context usage, faster agent operation, clearer focus

---

**Created:** 2025-12-03
**Framework:** Intelligence Adjacent (IA) - Cloud Security Testing
**Version:** 1.0
**Pattern:** Scope-based context loading for maximum efficiency
