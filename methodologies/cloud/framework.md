# Cloud Security Testing Methodology

## Methodology Overview

Cloud security testing identifies misconfigurations, vulnerabilities, and policy violations in cloud infrastructure through automated scanning, manual security reviews, and compliance validation across AWS, Azure, and GCP environments.

**Key Distinction:** Cloud security testing combines **configuration audit** (read-only) with **offensive testing** (elevated permissions) to validate both compliance posture and exploitability of findings.

**Shared Responsibility Model:**
- **Cloud Provider:** Physical security, hypervisor, network infrastructure
- **Customer (YOU):** Data security, identity management, application security, network controls, encryption

This methodology focuses on **customer responsibilities** - areas where misconfigurations lead to security breaches.

---

## Access Levels & Authorization

### 🔍 Read-Only Access (Default - Security Audit)

**Purpose:** Configuration audit, compliance checking, CIS benchmark validation

**AWS Permissions:**
- SecurityAudit (AWS managed policy)
- ViewOnlyAccess (AWS managed policy)

**Azure Permissions:**
- Security Reader
- Reader

**GCP Permissions:**
- Viewer
- Security Reviewer

**Tools that work with read-only:**
- ✅ prowler (AWS CIS compliance)
- ✅ ScoutSuite (multi-cloud audit)
- ✅ pmapper (AWS IAM privilege escalation mapping)
- ✅ AzureHound (Azure AD enumeration)
- ✅ Checkov (IaC scanning - no cloud access needed)
- ✅ Trivy (container scanning - no cloud access needed)
- ✅ AWS/Azure/GCP CLIs (manual queries)

**Default Testing Approach:** Start with read-only assessment unless explicitly authorized for offensive testing.

---

### ⚡ Elevated Access (Exploitation & Remediation)

**Purpose:** Offensive security testing, privilege escalation validation, security finding remediation

**AWS Permissions:**
- AdministratorAccess OR
- Specific permissions: iam:*, s3:*, ec2:*, lambda:*, etc.

**Azure Permissions:**
- Contributor OR
- Specific permissions for testing

**Tools that require elevated access:**
- ⚠️ Pacu (AWS post-exploitation framework)
- ⚠️ MicroBurst (Azure offensive testing toolkit)

**⚠️ CRITICAL:** Elevated testing simulates attacker behavior. Requires:
1. **Explicit written authorization** from stakeholders
2. **Separate credentials** (not production read-only)
3. **Clear testing scope** (which accounts, which actions)
4. **Incident response plan** (what if testing breaks something)

---

## Compliance Framework Integration

### CIS Benchmarks (Center for Internet Security)

**CIS AWS Foundations Benchmark v3.0.0** (60+ controls, 5 sections)

**Section 1: Identity and Access Management (IAM)**
- 1.1 - 1.22: IAM password policies, MFA, access key rotation, root account protection
- **Tool:** prowler (automated), AWS CLI (manual validation)

**Section 2: Storage**
- 2.1 - 2.3: S3 bucket security, versioning, logging, encryption
- **Tool:** prowler, ScoutSuite

**Section 3: Logging**
- 3.1 - 3.11: CloudTrail, VPC Flow Logs, AWS Config
- **Tool:** prowler, AWS CLI

**Section 4: Monitoring**
- 4.1 - 4.16: CloudWatch alarms, SNS notifications, GuardDuty
- **Tool:** prowler, AWS CLI

**Section 5: Networking**
- 5.1 - 5.6: VPC configuration, security groups, network ACLs
- **Tool:** ScoutSuite, AWS CLI

---

**CIS Azure Foundations Benchmark**

**Sections:**
- Identity and Access Management
- Microsoft Defender for Cloud
- Storage Accounts
- Database Services
- Logging and Monitoring
- Networking
- Virtual Machines
- Key Vault
- App Service

**Tool:** ScoutSuite, Azure CLI

---

**CIS GCP Foundations Benchmark**

**Sections:**
- Identity and Access Management
- Logging and Monitoring
- Networking
- Virtual Machines
- Storage
- Cloud SQL Database Services
- BigQuery

**Tool:** ScoutSuite, gcloud CLI

---

### AWS Well-Architected Framework - Security Pillar

**7 Design Principles:**

1. **Implement a strong identity foundation**
   - Centralize privilege management
   - Eliminate long-term credentials (use IAM roles)
   - **Test:** pmapper (identify privilege escalation paths)

2. **Enable traceability**
   - Monitor, alert, audit actions in real-time
   - **Test:** prowler checks CloudTrail, AWS CLI validates logging

3. **Apply security at all layers**
   - Defense in depth (edge, VPC, subnet, load balancer, instance, OS, application)
   - **Test:** ScoutSuite analyzes all layers

4. **Automate security best practices**
   - Automated detection and remediation
   - **Test:** Check AWS Config Rules, Lambda auto-remediation

5. **Protect data in transit and at rest**
   - Encryption, tokenization, access controls
   - **Test:** prowler checks encryption, CLI validates TLS

6. **Keep people away from data**
   - Reduce manual access through automation
   - **Test:** Review Session Manager usage vs SSH keys

7. **Prepare for security events**
   - Incident response planning, automated remediation
   - **Test:** Review CloudWatch alarms, SNS notifications, runbooks

---

### Other Compliance Standards

- **NIST 800-53 Rev. 5** - Federal security controls
- **NIST Cybersecurity Framework (CSF)** - Risk management framework
- **PCI DSS v3.2.1** - Payment card industry (if handling credit cards)
- **HIPAA** - Healthcare data protection (if handling PHI)
- **SOC 2** - Service organization controls (audit requirements)
- **ISO/IEC 27001:2013** - Information security management

**Mapping:** prowler supports multiple compliance frameworks - use `prowler aws --compliance <framework>` to filter checks.

---

## Testing Methodology Structure

### EXPLORE Phase

**1. Scope Review**

Read SCOPE.md for critical details:

```markdown
### Cloud Environment Scope Example:

**Cloud Providers:** AWS, Azure, GCP
**AWS Accounts:**
  - Production: 123456789012
  - Staging: 234567890123
  - Development: 345678901234

**Azure Subscriptions:**
  - Production: <subscription-id>
  - Non-Production: <subscription-id>

**GCP Projects:**
  - prod-webapp
  - staging-webapp

**Authorization Level:**
  - **Read-Only (Default):** SecurityAudit role for compliance assessment
  - **Elevated (If Authorized):** AdministratorAccess for privilege escalation testing

**Compliance Requirements:** CIS Benchmarks, PCI DSS (production only)

**Workload Types:** Web applications, databases, S3 data lake, Lambda functions

**Excluded:** Third-party SaaS integrations, partner accounts
```

**Key Questions:**
- What is the authorization level? (Read-only vs elevated)
- Which compliance frameworks apply? (CIS, PCI DSS, HIPAA)
- Are there multi-cloud scenarios? (AWS + Azure, hybrid)
- What workload types exist? (EC2, Lambda, containers, databases)
- Are there sensitive data classifications? (PII, PHI, PCI)

---

**2. Credential Validation**

Before testing, validate cloud access:

**AWS:**
```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify role/permissions
aws iam get-user
aws iam list-attached-user-policies --user-name $(aws iam get-user --query 'User.UserName' --output text)

# Check if SecurityAudit policy attached
aws iam list-attached-user-policies --user-name analyst | grep SecurityAudit
```

**Azure:**
```bash
# Check Azure credentials
az account show

# List role assignments
az role assignment list --assignee $(az ad signed-in-user show --query objectId -o tsv)

# Check if Security Reader role assigned
az role assignment list --assignee $(az ad signed-in-user show --query objectId -o tsv) | grep "Security Reader"
```

**GCP:**
```bash
# Check GCP credentials
gcloud auth list

# Get current project
gcloud config get-value project

# Check IAM permissions
gcloud projects get-iam-policy $(gcloud config get-value project) --flatten="bindings[].members" --filter="bindings.members:user:$(gcloud config get-value account)"
```

**Result:** Confirm access level before proceeding. If read-only permissions confirmed, proceed with Phase 1 assessment. If elevated permissions needed, get explicit authorization first.

---

**3. Cloud Environment Reconnaissance**

Use CLIs to enumerate cloud resources:

**AWS Enumeration:**
```bash
# List all regions being used
aws ec2 describe-regions --query 'Regions[].RegionName' --output table

# Count resources per service
aws ec2 describe-instances --query 'length(Reservations[].Instances[])'
aws s3 ls | wc -l
aws rds describe-db-instances --query 'length(DBInstances)'
aws lambda list-functions --query 'length(Functions)'

# Identify IAM structure
aws iam list-users --query 'length(Users)'
aws iam list-roles --query 'length(Roles)'
aws iam list-groups --query 'length(Groups)'
```

**Azure Enumeration:**
```bash
# List all resource groups
az group list --output table

# Count VMs
az vm list --query 'length(@)'

# Count storage accounts
az storage account list --query 'length(@)'

# Count SQL databases
az sql server list --query 'length(@)'

# Identify Azure AD structure
az ad user list --query 'length(@)'
az ad group list --query 'length(@)'
az ad sp list --all --query 'length(@)'
```

**GCP Enumeration:**
```bash
# List all projects
gcloud projects list

# Count compute instances
gcloud compute instances list --format="value(name)" | wc -l

# Count storage buckets
gcloud storage ls | wc -l

# Count Cloud SQL instances
gcloud sql instances list --format="value(name)" | wc -l

# Identify IAM structure
gcloud iam service-accounts list --format="value(email)" | wc -l
```

**Document Findings:**
- Total resources per cloud provider
- Regions/locations in use
- IAM principal counts (users, roles, service accounts)
- Workload distribution (compute vs serverless vs containers)

---

**4. Threat Modeling**

Identify high-risk areas for focused testing:

**Data Exposure Risks:**
- Public S3 buckets / Azure Storage / GCS buckets
- Unencrypted databases (RDS, Azure SQL, Cloud SQL)
- Public snapshots (EBS, Azure disks)
- Secrets in environment variables (Lambda, Functions)

**IAM Privilege Escalation:**
- Users/roles with AdministratorAccess
- Overly permissive policies (wildcards *)
- Cross-account access misconfigurations
- Service accounts with excessive permissions

**Network Exposure:**
- Security groups with 0.0.0.0/0 on SSH/RDP
- Public database endpoints
- Missing network segmentation
- Exposed management ports

**Compliance Violations:**
- Missing CloudTrail / Azure Monitor / Stackdriver
- No MFA on privileged accounts
- Unencrypted storage
- Missing backup encryption

---

### PLAN Phase

**1. Vulnerability Prioritization**

Based on EXPLORE findings, prioritize testing:

**Critical (Test First):**
- Public data storage with sensitive data
- Overly permissive IAM (AdministratorAccess, wildcards)
- Unencrypted data at rest
- Missing CloudTrail / audit logging
- Root account without MFA (AWS)

**High (Test Second):**
- Network misconfigurations (0.0.0.0/0 on SSH/RDP)
- Missing MFA on users
- Long-lived access keys
- Public database endpoints
- Secrets in code / environment variables

**Medium (Test Third):**
- Missing log encryption
- Insufficient log retention
- Outdated resources
- Policy drift (non-compliant resources created)

**Low (Test Last):**
- Untagged resources
- Best practice deviations
- Optimization opportunities

---

**2. Tool Inventory Check (CRITICAL)**

Verify tools available before testing:

```bash
# Query REGISTRY.json for cloud tools
grep -A 10 "\"cloud\"" /skills/pentest/tools/REGISTRY.json

# Expected tools:
# - prowler (AWS CIS compliance)
# - scoutsuite (multi-cloud audit)
# - pmapper (AWS IAM analysis)
# - azurehound (Azure AD enumeration)
# - pacu (AWS exploitation - elevated only)
# - microburst (Azure exploitation - elevated only)
# - checkov (IaC scanning)
# - trivy (container scanning)
# - aws CLI, azure CLI, gcloud SDK
```

**Missing Tools?**
- Document in MISSING-TOOLS-TRACKING.md
- Use CLI fallback methods (see cloud-security/docs/TOOLS.md)

---

**3. Test Plan Generation**

**Phase 1 - Read-Only Assessment (DEFAULT):**

**AWS Testing:**
1. Run prowler for CIS AWS Foundations Benchmark compliance
2. Run ScoutSuite for multi-cloud security posture
3. Run pmapper to identify IAM privilege escalation paths
4. Use AWS CLI for manual validation of critical findings
5. Review Security Hub findings (if enabled)

**Azure Testing:**
1. Run ScoutSuite for Azure configuration audit
2. Run AzureHound for Azure AD attack path mapping
3. Use Azure CLI for manual validation
4. Review Microsoft Defender for Cloud Secure Score (if enabled)

**GCP Testing:**
1. Run ScoutSuite for GCP configuration audit
2. Use gcloud CLI for manual validation
3. Review Security Command Center findings (if enabled - Standard tier is free)

**IaC/Container Testing:**
1. Run Checkov on Terraform/CloudFormation files
2. Run Trivy on container images and K8s manifests

**Deliverables:**
- prowler HTML/CSV reports
- ScoutSuite HTML reports
- pmapper privilege escalation analysis
- AzureHound JSON output
- Checkov/Trivy scan results

---

**Phase 2 - Exploitation Testing (IF AUTHORIZED):**

**⚠️ STOP: Do NOT proceed without explicit authorization**

If authorized for offensive testing:

**AWS Exploitation:**
1. Use Pacu to validate IAM privilege escalation findings from pmapper
2. Test S3 data exfiltration scenarios
3. Test Lambda persistence mechanisms
4. Document which findings are actually exploitable

**Azure Exploitation:**
1. Use MicroBurst to enumerate public storage containers
2. Test KeyVault secret extraction
3. Validate Azure Function vulnerabilities
4. Test Azure AD privilege escalation paths found by AzureHound

**Deliverables:**
- Pacu session logs
- MicroBurst PowerShell transcripts
- Proof-of-concept exploit scripts
- Risk assessment (exploitable vs theoretical)

---

**Phase 3 - Remediation (IF AUTHORIZED):**

If authorized to fix findings:

1. Use elevated credentials to implement remediations
2. Re-run Phase 1 tools to validate fixes
3. Document before/after state
4. Provide compliance dashboard screenshots

**Get User Approval:** Present this test plan to the user and get approval before proceeding with testing.

---

### CODE Phase (Testing)

## AWS Security Testing

### Tool 1: prowler - AWS CIS Compliance Scanner

**Access Level:** 🔍 Read-Only (SecurityAudit role)

**Purpose:** Automated CIS AWS Foundations Benchmark compliance scanning with 400+ security checks.

---

**Command - Full CIS AWS Foundations Scan:**

```bash
prowler aws
```

**Expected Output:**
```
Prowler 3.x - AWS Security Assessment Tool

Account: 123456789012
Profile: default
Region: All regions
Compliance: CIS AWS Foundations Benchmark v3.0.0

[INFO] Starting prowler scan...

[FAIL] 1.1 - Root account MFA not enabled
[PASS] 1.2 - Multi-factor authentication enabled for IAM users
[FAIL] 1.10 - Password policy requires uppercase letters: False
[FAIL] 2.1.1 - S3 bucket 'company-data' has public read access
[PASS] 2.1.2 - S3 bucket logging enabled
[FAIL] 3.1 - CloudTrail not enabled in all regions
[PASS] 3.2 - CloudTrail log file validation enabled
...

Total Checks: 421
Passed: 287
Failed: 134
Skipped: 0

Severity Breakdown:
Critical: 23
High: 45
Medium: 52
Low: 14
```

**Parsing:**
- **FAIL findings = Security issues** to investigate
- **Critical/High severity** = Prioritize for remediation
- **CIS control mapping** = Reference for compliance reporting

**Finding Example:**
```
[FAIL] 2.1.1 - S3 bucket 'company-data' has public read access
CIS Control: 2.1.1
Severity: Critical
Resource: arn:aws:s3:::company-data
Description: S3 bucket allows public read access via bucket ACL
Risk: Sensitive data exposure, data breach
Remediation: Remove public access via S3 Block Public Access
```

---

**Command - Specific Service Scan (S3 + IAM):**

```bash
prowler aws -s s3 iam
```

**Use Case:** Focus on specific high-risk services.

---

**Command - Specific Compliance Framework:**

```bash
# PCI DSS compliance
prowler aws --compliance pci_dss_v3.2.1

# HIPAA compliance
prowler aws --compliance hipaa

# SOC 2 compliance
prowler aws --compliance soc2
```

**Use Case:** Filter checks relevant to specific compliance requirements.

---

**Command - Output Formats:**

```bash
# JSON output (machine-readable)
prowler aws -M json -o /data/prowler-report.json

# CSV output (spreadsheet import)
prowler aws -M csv -o /data/prowler-report.csv

# HTML output (executive report)
prowler aws -M html -o /data/prowler-report.html

# JUnit XML (CI/CD integration)
prowler aws -M junit-xml -o /data/prowler-junit.xml
```

**Use Case:** Different formats for different audiences (executives want HTML, security team wants CSV for tracking).

---

**Common Findings from prowler:**

**1. IAM Issues:**
- Root account without MFA
- Users without MFA
- Inactive access keys not rotated
- Overly permissive policies (wildcards)
- Password policy too weak

**2. S3 Issues:**
- Public buckets (via ACL or bucket policy)
- No versioning enabled
- No logging enabled
- No encryption at rest
- Missing Block Public Access

**3. Logging Issues:**
- CloudTrail not enabled in all regions
- CloudTrail log file validation disabled
- VPC Flow Logs not enabled
- No S3 bucket logging
- CloudWatch alarms not configured

**4. Network Issues:**
- Security groups with 0.0.0.0/0 on SSH (22)
- Security groups with 0.0.0.0/0 on RDP (3389)
- Default VPC in use
- Network ACLs not configured

---

### Tool 2: ScoutSuite - Multi-Cloud Security Auditor

**Access Level:** 🔍 Read-Only

**Purpose:** Multi-cloud security configuration audit (AWS, Azure, GCP) with HTML report generation.

---

**Command - AWS Audit:**

```bash
scout aws
```

**Expected Output:**
```
Scout Suite - Multi-Cloud Security Auditing Tool

[*] Authenticating to AWS...
[*] Gathering IAM data...
  - Users: 47
  - Roles: 123
  - Groups: 12
  - Policies: 89

[*] Gathering EC2 data...
  - Instances: 34
  - Security Groups: 28
  - Volumes: 67

[*] Gathering S3 data...
  - Buckets: 15

[*] Gathering RDS data...
  - DB Instances: 8

[*] Analyzing security posture...
[!] Found 23 high-severity findings
[!] Found 45 medium-severity findings

[*] Generating HTML report: scoutsuite-report/aws/index.html
[*] Scan complete!
```

**Parsing:**
- Open `scoutsuite-report/aws/index.html` in browser
- Review dashboard for risk summary
- Drill into specific findings for details

**Report Dashboard Shows:**
- **Risk Score:** Overall security posture (0-100)
- **Finding Categories:** IAM, EC2, S3, RDS, Lambda, VPC, etc.
- **Severity Distribution:** Critical, High, Medium, Low
- **Attack Paths:** Exploitable paths to sensitive resources

---

**Command - Azure Audit:**

```bash
scout azure --cli
```

**Options:**
- `--cli`: Use Azure CLI authentication (preferred)

**Expected Output:**
```
[*] Authenticating to Azure via CLI...
[*] Gathering Azure AD data...
  - Users: 234
  - Groups: 45
  - Service Principals: 67

[*] Gathering Storage Account data...
  - Storage Accounts: 12

[*] Gathering Network data...
  - Virtual Networks: 8
  - Network Security Groups: 15

[*] Gathering Key Vault data...
  - Key Vaults: 5

[*] Generating report: scoutsuite-report/azure/index.html
```

**Common Azure Findings:**
- Storage accounts with public access enabled
- NSG rules allowing 0.0.0.0/0 on management ports
- Key Vaults without soft-delete enabled
- Azure AD users without MFA
- Weak RBAC role assignments

---

**Command - GCP Audit:**

```bash
scout gcp --project-id my-project-123
```

**Options:**
- `--project-id`: Specify GCP project to scan

**Expected Output:**
```
[*] Authenticating to GCP...
[*] Scanning project: my-project-123

[*] Gathering IAM data...
  - Service Accounts: 23
  - IAM Bindings: 156

[*] Gathering Compute Engine data...
  - Instances: 18
  - Firewall Rules: 34

[*] Gathering Cloud Storage data...
  - Buckets: 9

[*] Gathering Cloud SQL data...
  - Instances: 4

[*] Generating report: scoutsuite-report/gcp/index.html
```

**Common GCP Findings:**
- GCS buckets with allUsers or allAuthenticatedUsers
- Compute instances with external IPs
- Firewall rules allowing 0.0.0.0/0
- Service accounts with primitive roles (Owner, Editor)
- Cloud SQL instances publicly accessible

---

**Command - Custom Report Directory:**

```bash
scout aws --report-dir /data/scout-reports/$(date +%Y-%m-%d)
```

**Use Case:** Organize reports by date for historical tracking.

---

**ScoutSuite Attack Path Example:**

ScoutSuite identifies exploitable paths like:

```
Attack Path: Public S3 Bucket → Credentials → Privilege Escalation

1. S3 bucket "company-backups" has public read access
2. Bucket contains file "config.yaml" with AWS access keys
3. Access keys belong to IAM role "BackupRole" with iam:PassRole permission
4. Attacker uses PassRole to escalate to EC2 instance role with AdministratorAccess
5. Result: Full account compromise
```

**Use Case:** Prioritize findings that chain together for maximum impact.

---

### Tool 3: pmapper - AWS IAM Privilege Escalation Analysis

**Access Level:** 🔍 Read-Only (analyzes policies locally)

**Purpose:** Map AWS IAM privilege escalation paths - identify which users/roles can become admin.

---

**Command - Build IAM Graph:**

```bash
pmapper graph create
```

**Expected Output:**
```
Principal Mapper (PMapper) - AWS IAM Privilege Escalation Tool

[*] Querying IAM data from AWS account 123456789012...
[*] Found 47 users
[*] Found 123 roles
[*] Found 89 policies

[*] Building privilege escalation graph...
[*] Analyzing 156 principals
[*] Checking 23 escalation techniques

[*] Graph created successfully!
[*] Saved to: ~/.local/share/principalmapper/graph-123456789012.json
```

---

**Command - Query: Who Can Create Access Keys?**

```bash
pmapper query "who can do iam:CreateAccessKey"
```

**Expected Output:**
```
Principals that can perform iam:CreateAccessKey:

1. arn:aws:iam::123456789012:user/admin
   - Via attached policy: AdministratorAccess

2. arn:aws:iam::123456789012:role/DevOpsRole
   - Via attached policy: IAMFullAccess

3. arn:aws:iam::123456789012:user/developer
   - Via inline policy allowing iam:CreateAccessKey on resource:*

[!] WARNING: If any of these principals are compromised, attacker can create access keys for other users!
```

**Parsing:**
- **FINDING:** Users who can do `iam:CreateAccessKey` can create keys for themselves or other users → Privilege escalation path
- **Risk:** If "developer" account is compromised, attacker creates keys for "admin" account

---

**Command - Query: Privilege Escalation Paths to Admin**

```bash
pmapper query "preset privesc *"
```

**Expected Output:**
```
Privilege Escalation Paths Found:

1. arn:aws:iam::123456789012:user/analyst
   Escalation Path:
   - analyst has iam:PassRole permission
   - analyst can pass role "EC2AdminRole" to EC2 instances
   - EC2AdminRole has AdministratorAccess policy
   - Escalation: Launch EC2 instance with EC2AdminRole, SSH into instance, use credentials

2. arn:aws:iam::123456789012:user/developer
   Escalation Path:
   - developer has lambda:CreateFunction permission
   - developer can create Lambda function with execution role "LambdaAdminRole"
   - LambdaAdminRole has AdministratorAccess policy
   - Escalation: Create Lambda function, invoke to execute admin actions

3. arn:aws:iam::123456789012:user/support
   Escalation Path:
   - support has iam:UpdateAssumeRolePolicy permission
   - support can modify trust policy of "AdminRole"
   - Escalation: Add support's principal to AdminRole trust policy, assume AdminRole
```

**Parsing:**
- **Critical Finding:** 3 users can escalate to admin via different techniques
- **Risk:** Compromising any of these accounts = full account takeover
- **Remediation:** Remove excessive permissions, implement least privilege

---

**Command - Visualize IAM Graph:**

```bash
pmapper visualize --filetype png
```

**Expected Output:**
```
[*] Generating IAM privilege escalation graph visualization...
[*] Output: iam-graph.png

[*] Graph shows:
  - Green nodes: Low-privilege principals
  - Yellow nodes: Medium-privilege principals
  - Red nodes: High-privilege principals (admin-equivalent)
  - Arrows: Privilege escalation paths
```

**Use Case:** Share visual diagram with executives to show IAM risk landscape.

---

**Command - Specific Principal Analysis:**

```bash
pmapper analysis --principal arn:aws:iam::123456789012:user/analyst
```

**Expected Output:**
```
Analysis for: arn:aws:iam::123456789012:user/analyst

Direct Permissions:
- s3:GetObject (on resource: arn:aws:s3:::company-data/*)
- ec2:DescribeInstances (on resource: *)
- iam:PassRole (on resource: arn:aws:iam::123456789012:role/EC2AdminRole)

Effective Permissions:
- Can read S3 bucket "company-data"
- Can list EC2 instances
- Can escalate to admin via iam:PassRole

Privilege Escalation Risk: HIGH
Reason: iam:PassRole permission on admin role
```

---

**pmapper Escalation Techniques Detected:**

1. **iam:CreateAccessKey** - Create keys for other users
2. **iam:PassRole** - Pass admin role to EC2/Lambda
3. **iam:UpdateAssumeRolePolicy** - Modify trust policies
4. **iam:AttachUserPolicy** - Attach admin policies
5. **iam:PutUserPolicy** - Add inline admin policies
6. **iam:CreatePolicyVersion** - Modify existing policies
7. **lambda:CreateFunction + iam:PassRole** - Execute code with admin role
8. **ec2:RunInstances + iam:PassRole** - Launch instance with admin role
9. **sts:AssumeRole** - Directly assume admin role
10. **glue:CreateDevEndpoint** - Create dev endpoint with admin role

---

### Tool 4: AzureHound - Azure AD Enumeration

**Access Level:** 🔍 Read-Only (Graph API permissions)

**Purpose:** Enumerate Azure AD and Azure resources to identify attack paths to Global Administrator.

---

**Command - List All Azure AD Users:**

```bash
azurehound list users
```

**Expected Output:**
```
AzureHound v2.x - Azure AD Enumeration

[*] Connecting to Microsoft Graph API...
[*] Enumerating users...

Found 234 users:

1. admin@company.onmicrosoft.com
   - Object ID: abc-123-def
   - Roles: Global Administrator
   - MFA Enabled: Yes

2. developer@company.onmicrosoft.com
   - Object ID: def-456-ghi
   - Roles: Application Administrator
   - MFA Enabled: No   [!] WARNING

3. guest_external#EXT#@company.onmicrosoft.com
   - Object ID: ghi-789-jkl
   - User Type: Guest
   - Roles: None
   - MFA Enabled: No   [!] WARNING

...
```

**Parsing:**
- **Finding:** Users without MFA = High risk
- **Finding:** Guest accounts = Potential lateral movement from partner compromise
- **Finding:** Application Administrator role = Can create service principals with high permissions

---

**Command - List Azure AD Groups:**

```bash
azurehound list groups
```

**Expected Output:**
```
[*] Enumerating groups...

Found 45 groups:

1. Global-Admins
   - Object ID: xyz-111-abc
   - Members: 3
   - Roles: Global Administrator (inherited)

2. Security-Team
   - Object ID: xyz-222-def
   - Members: 12
   - Roles: Security Administrator

3. All-Users (Dynamic Group)
   - Object ID: xyz-333-ghi
   - Members: 234 (dynamic membership)
   - Roles: None
   [!] WARNING: Dynamic group with broad membership
```

**Parsing:**
- **Finding:** Dynamic groups with privileged roles = Risk of unintended privilege assignment
- **Finding:** Groups with Global Administrator = Review membership carefully

---

**Command - Full Azure AD Enumeration:**

```bash
azurehound list -a
```

**Options:**
- `-a` or `--all`: Enumerate all resources (users, groups, roles, service principals, applications, devices)

**Expected Output:**
```
[*] Full Azure AD enumeration initiated...

[*] Enumerating users... (234 found)
[*] Enumerating groups... (45 found)
[*] Enumerating service principals... (67 found)
[*] Enumerating applications... (89 found)
[*] Enumerating roles... (78 found)
[*] Enumerating devices... (156 found)

[*] Collecting relationships...
  - User → Group memberships
  - Group → Role assignments
  - Service Principal → Role assignments
  - Application → Permissions

[*] Exporting to JSON: azurehound-output.json
```

---

**Command - Export for BloodHound Visualization:**

```bash
# AzureHound outputs JSON compatible with BloodHound
# Import azurehound-output.json into BloodHound to visualize attack paths

# Example BloodHound query: "Find all paths to Global Administrator"
```

**Use Case:** Visualize complex Azure AD attack paths in BloodHound graph interface.

---

**AzureHound Attack Path Example:**

```
Attack Path: Compromised Developer → Global Administrator

1. developer@company.onmicrosoft.com has "Application Administrator" role
2. Application Administrator can create service principals
3. Created service principal "BackupApp" with Application.ReadWrite.All permission
4. Application.ReadWrite.All allows modifying app permissions
5. Grant service principal "Directory.AccessAsUser.All" permission
6. Use service principal to add developer to "Global Admins" group
7. Result: Developer escalates to Global Administrator
```

**Parsing:**
- **Critical Finding:** Application Administrator role = Privilege escalation to Global Admin
- **Remediation:** Remove Application Administrator role, use Privileged Identity Management (PIM) for JIT access

---

**⚠️ Detection Note:** Microsoft Defender for Resource Manager detects AzureHound usage. This tool is used by nation-state actors (Curious Serpens, Void Blizzard, Storm-0501). Use responsibly and with authorization.

---

### Tool 5: Checkov - IaC Security Scanner

**Access Level:** None (scans local files - no cloud access required)

**Purpose:** Static analysis for Infrastructure as Code (Terraform, CloudFormation, Kubernetes) with 1000+ security policies.

---

**Command - Scan Terraform Directory:**

```bash
checkov -d /path/to/terraform
```

**Expected Output:**
```
Checkov 2.x by Bridgecrew | Infrastructure as Code Security

Scanning directory: /path/to/terraform

Terraform files found: 15
Running 1247 checks...

Passed checks: 89
Failed checks: 34
Skipped checks: 0

Failed checks by severity:
CRITICAL: 8
HIGH: 12
MEDIUM: 10
LOW: 4

FAILED CHECKS:

Check: CKV_AWS_18 - "Ensure S3 bucket has access logging enabled"
File: main.tf:45-52
Resource: aws_s3_bucket.data_lake

    45 | resource "aws_s3_bucket" "data_lake" {
    46 |   bucket = "company-data-lake"
    47 |   acl    = "private"
    48 |
    49 |   # MISSING: logging configuration
    50 |
    51 |   encryption {
    52 |     enabled = true

Guide: https://docs.bridgecrew.io/docs/s3_13-enable-logging

FAILED CHECKS:

Check: CKV_AWS_20 - "S3 Bucket has an ACL defined which allows public READ access"
File: main.tf:54-59
Resource: aws_s3_bucket.public_assets

    54 | resource "aws_s3_bucket" "public_assets" {
    55 |   bucket = "company-public-assets"
    56 |   acl    = "public-read"   # CRITICAL: Public read access
    57 | }

[!] CRITICAL: S3 bucket allows public access - potential data exposure
```

**Parsing:**
- **CRITICAL findings:** Immediate risk if deployed (public buckets, missing encryption)
- **HIGH findings:** Security best practices (missing logging, weak IAM)
- **Fix before deployment:** Shift-left security - catch issues before production

---

**Command - Scan Specific File:**

```bash
checkov -f main.tf
```

**Use Case:** Quick scan of single file during development.

---

**Command - CIS Benchmark Checks Only:**

```bash
checkov -d /path/to/terraform --framework cis_aws
```

**Options:**
- `--framework cis_aws`: Filter to CIS AWS Benchmark checks only
- `--framework cis_azure`: CIS Azure checks
- `--framework cis_gcp`: CIS GCP checks
- `--framework pci_dss`: PCI DSS checks

**Use Case:** Validate IaC compliance against specific standard before deployment.

---

**Command - Output to JSON:**

```bash
checkov -d /path/to/terraform -o json > checkov-results.json
```

**Use Case:** CI/CD integration - fail pipeline if CRITICAL findings detected.

---

**Common Checkov Findings:**

**AWS:**
- S3 buckets without encryption
- S3 buckets with public ACLs
- EC2 instances without encryption
- Security groups with 0.0.0.0/0 ingress
- RDS instances without encryption
- Lambda functions with overly permissive IAM roles

**Azure:**
- Storage accounts allowing public access
- VMs without disk encryption
- NSG rules allowing internet access
- Key Vaults without soft-delete
- SQL databases without TDE

**Kubernetes:**
- Containers running as root
- Privileged containers
- HostPath volumes
- Missing resource limits
- Missing network policies

---

### Tool 6: Trivy - Container/IaC Vulnerability Scanner

**Access Level:** None (scans local files/images)

**Purpose:** Scan container images and IaC files for CVEs and misconfigurations.

---

**Command - Scan Container Image:**

```bash
trivy image ubuntu:latest
```

**Expected Output:**
```
Trivy v0.x - Container Vulnerability Scanner

Scanning image: ubuntu:latest

Total: 45 vulnerabilities
CRITICAL: 8
HIGH: 15
MEDIUM: 18
LOW: 4

CVE-2023-1234 (CRITICAL)
Package: openssl
Installed Version: 1.1.1f
Fixed Version: 1.1.1g
Description: OpenSSL vulnerability allows remote code execution
Severity: CRITICAL (CVSS 9.8)
References: https://nvd.nist.gov/vuln/detail/CVE-2023-1234

CVE-2023-5678 (HIGH)
Package: libssl
Installed Version: 1.1.1f
Fixed Version: 1.1.1g
Description: libssl buffer overflow vulnerability
Severity: HIGH (CVSS 7.5)

...
```

**Parsing:**
- **CRITICAL/HIGH CVEs:** Update base image or patch packages
- **Fixed Version available:** Remediation path clear
- **No fix available:** Risk acceptance decision required

---

**Command - Scan Terraform Configuration:**

```bash
trivy config /path/to/terraform
```

**Expected Output:**
```
Scanning IaC configuration: /path/to/terraform

Total: 23 misconfigurations
CRITICAL: 4
HIGH: 8
MEDIUM: 9
LOW: 2

File: main.tf
Line: 45
Misconfiguration: AVD-AWS-0086 (CRITICAL)
Title: S3 bucket does not have encryption enabled
Description: S3 buckets should have encryption at rest enabled
Severity: CRITICAL
```

**Use Case:** Scan Terraform/CloudFormation before `terraform apply` or `aws cloudformation create-stack`.

---

**Command - Scan Kubernetes Manifests:**

```bash
trivy config /path/to/k8s-manifests
```

**Expected Output:**
```
Scanning Kubernetes manifests: /path/to/k8s-manifests

File: deployment.yaml
Line: 23
Misconfiguration: KSV012 (HIGH)
Title: Container is running as root
Description: Containers should not run as root user (UID 0)
Severity: HIGH
Remediation: Add securityContext.runAsNonRoot: true
```

**Use Case:** Validate Kubernetes YAML before `kubectl apply`.

---

### Tool 7: Pacu - AWS Exploitation Framework

**Access Level:** ⚠️ ELEVATED (Requires AdministratorAccess or specific exploit permissions)

**⚠️ CRITICAL:** This tool simulates attacker behavior. Do NOT use without explicit written authorization.

**Purpose:** AWS post-exploitation framework for offensive security testing - validate privilege escalation findings from pmapper.

---

**Command - Start Pacu Session:**

```bash
pacu
```

**Expected Output:**
```
Pacu v1.x - AWS Exploitation Framework
by Rhino Security Labs

[*] No session found. Create new session.
Session name (default: new-session): prod-pentest-2026

[*] Created new session: prod-pentest-2026

Pacu (prod-pentest-2026:No Keys Set) >
```

---

**Command - Set AWS Keys:**

```
Pacu (prod-pentest-2026:No Keys Set) > set_keys

AWS Access Key ID: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

[*] Keys set successfully!

Pacu (prod-pentest-2026:PentestUser) >
```

**⚠️ Note:** These should be elevated credentials with exploit permissions, NOT read-only SecurityAudit credentials.

---

**Command - List Available Modules:**

```
Pacu (prod-pentest-2026:PentestUser) > list
```

**Expected Output:**
```
Available Modules (40+):

IAM Modules:
  - iam__enum_permissions - Enumerate IAM permissions
  - iam__privesc_scan - Scan for privilege escalation paths
  - iam__backdoor_users - Create backdoor IAM users

S3 Modules:
  - s3__bucket_finder - Enumerate S3 buckets
  - s3__download_bucket - Download bucket contents

EC2 Modules:
  - ec2__enum - Enumerate EC2 instances
  - ec2__startup_shell_script - Execute code via user data

Lambda Modules:
  - lambda__enum - Enumerate Lambda functions
  - lambda__backdoor_new - Create backdoor Lambda function

...
```

---

**Command - Enumerate IAM Permissions:**

```
Pacu (prod-pentest-2026:PentestUser) > run iam__enum_permissions
```

**Expected Output:**
```
[*] Running module: iam__enum_permissions

[*] Checking permissions for user: PentestUser

[+] User has the following high-risk permissions:
  - iam:PassRole (on resource: *)
  - lambda:CreateFunction
  - ec2:RunInstances
  - iam:AttachUserPolicy

[!] PRIVILEGE ESCALATION RISK DETECTED

[*] Privilege Escalation Path:
  1. Use iam:PassRole to pass admin role to Lambda function
  2. Use lambda:CreateFunction to create function with admin role
  3. Invoke Lambda function to execute admin actions
  4. Result: Full account compromise

[*] Module completed. Results saved to session.
```

**Parsing:**
- **FINDING:** Confirms pmapper analysis - privilege escalation path exists
- **Risk:** Account can be fully compromised via Lambda + PassRole
- **Remediation:** Remove iam:PassRole permission or restrict resources

---

**Command - Test S3 Bucket Enumeration:**

```
Pacu (prod-pentest-2026:PentestUser) > run s3__bucket_finder
```

**Expected Output:**
```
[*] Running module: s3__bucket_finder

[*] Enumerating S3 buckets via common naming patterns...

[+] Found 15 buckets:
  - company-data (private)
  - company-backups (public-read)  [!] CRITICAL
  - company-logs (private)
  - company-assets (public-read)   [!] CRITICAL
  ...

[!] CRITICAL: 2 buckets have public read access!

[*] Testing if public buckets contain sensitive data...
[+] company-backups contains file: database-backup-2026.sql (2.3 GB)
[!] CRITICAL: Database backup publicly accessible!

[*] Module completed. Results saved to session.
```

**Parsing:**
- **FINDING:** Public S3 bucket with database backup = Critical data exposure
- **Impact:** Attacker can download entire database without authentication
- **Remediation:** Enable S3 Block Public Access on bucket

---

**Command - Exit Pacu:**

```
Pacu (prod-pentest-2026:PentestUser) > exit

[*] Saving session data...
[*] Session saved: ~/.pacu/sessions/prod-pentest-2026/
[*] Exit Pacu.
```

**⚠️ Post-Testing:**
- Review Pacu session logs for all actions taken
- Document which findings were exploitable
- Clean up any test resources created (backdoor users, Lambda functions, etc.)
- Inform stakeholders of exploitation test results

---

### Tool 8: MicroBurst - Azure Security Assessment

**Access Level:** ⚠️ ELEVATED (Requires Contributor or specific permissions)

**⚠️ CRITICAL:** This tool simulates attacker behavior. Do NOT use without explicit authorization.

**Purpose:** Azure penetration testing toolkit for offensive security testing - enumerate storage, dump KeyVault secrets, test Functions.

---

**Command - Import MicroBurst Module:**

```powershell
pwsh
Import-Module MicroBurst
```

**Expected Output:**
```powershell
PowerShell 7.x
Copyright (c) Microsoft Corporation

PS> Import-Module MicroBurst

[*] MicroBurst v1.x loaded successfully
[*] Available cmdlets: Get-Command -Module MicroBurst
```

---

**Command - List Available Functions:**

```powershell
Get-Command -Module MicroBurst
```

**Expected Output:**
```
CommandType     Name
-----------     ----
Function        Invoke-EnumerateAzureBlobs
Function        Invoke-EnumerateAzureSubDomains
Function        Get-AzurePasswords
Function        Get-AzureDomainInfo
Function        Get-AzureKeyVaults
Function        Invoke-AzureRmVMBulkCMD
...
```

---

**Command - Enumerate Public Azure Blob Storage:**

```powershell
Invoke-EnumerateAzureBlobs -Base company
```

**Options:**
- `-Base`: Company/organization name to generate storage account permutations

**Expected Output:**
```powershell
[*] Enumerating Azure Storage accounts for base name: company

[*] Testing common permutations:
  - company.blob.core.windows.net
  - companydata.blob.core.windows.net
  - companybackups.blob.core.windows.net
  - company-prod.blob.core.windows.net
  - company-dev.blob.core.windows.net
  ...

[+] Found publicly accessible storage account:
  Name: companybackups
  URL: https://companybackups.blob.core.windows.net
  Container: database-backups (public)

  Files:
    - prod-database-2026-01-15.bak (4.2 GB)
    - prod-database-2026-01-14.bak (4.1 GB)

  [!] CRITICAL: Database backups publicly accessible!

[+] Found publicly accessible storage account:
  Name: company-logs
  URL: https://company-logs.blob.core.windows.net
  Container: application-logs (public)

  Files:
    - app-logs-2026-01-17.log (234 MB)

  [!] WARNING: Logs may contain sensitive information

[*] Enumeration complete. 2 public storage accounts found.
```

**Parsing:**
- **FINDING:** Public storage accounts with database backups = Critical data exposure
- **Impact:** Attacker can download databases, credentials, logs without authentication
- **Remediation:** Disable public access on storage accounts

---

**Command - Get KeyVault Names:**

```powershell
Get-AzureKeyVaults
```

**Expected Output:**
```powershell
[*] Enumerating Azure Key Vaults in subscription...

[+] Found 5 Key Vaults:
  1. company-prod-kv
     Location: East US
     Resource Group: production-rg

  2. company-dev-kv
     Location: West US
     Resource Group: development-rg

  3. secrets-vault
     Location: Central US
     Resource Group: security-rg

  ...

[*] Note: Use Get-AzKeyVaultSecret to retrieve secrets (requires permissions)
```

---

**Command - Test Azure Function Exploitation:**

(Documentation placeholder - specific function exploitation depends on environment)

```powershell
# MicroBurst can test Azure Functions for:
# - Code execution vulnerabilities
# - Secrets in environment variables
# - Overly permissive managed identities
```

---

**⚠️ Detection Note:** Microsoft Defender for Resource Manager detects MicroBurst usage. Alerts will be generated during testing.

**Post-Testing:**
- Document all findings from MicroBurst enumeration
- Clean up any test artifacts
- Inform stakeholders of exploitation test results
- Provide evidence that findings are exploitable (not just theoretical)

---

## Cloud CLI Fallback Methods

When automated tools fail, crash, or need validation, **cloud CLIs are the ultimate fallback** for manual security auditing.

**Complete CLI reference documentation:** See `` - Sections "AWS CLI Manual Security Audit Commands", "Azure CLI Manual Security Audit Commands", "GCP (gcloud) Manual Security Audit Commands"

**Key CLI Audit Commands:**

### AWS CLI Quick Reference

```bash
# IAM Auditing
aws iam list-users
aws iam get-account-summary
aws iam list-attached-user-policies --user-name <user>

# S3 Security
aws s3 ls
aws s3api get-public-access-block --bucket <bucket>
aws s3api get-bucket-encryption --bucket <bucket>

# EC2 Security
aws ec2 describe-security-groups --query 'SecurityGroups[?IpPermissions[?IpRanges[?CidrIp==`0.0.0.0/0`]]]'
aws ec2 describe-volumes --query 'Volumes[?Encrypted==`false`]'

# CloudTrail Logging
aws cloudtrail describe-trails
aws cloudtrail get-trail-status --name <trail>
```

### Azure CLI Quick Reference

```bash
# Azure AD Auditing
az ad user list
az ad user list --filter "assignedRoles/any(r:r eq 'Global Administrator')"

# Storage Security
az storage account list
az storage account show --name <account> --query "allowBlobPublicAccess"

# Network Security
az network nsg list
az network nsg rule list --nsg-name <nsg> --resource-group <rg>

# KeyVault Security
az keyvault list
az keyvault show --name <keyvault> --query "properties.enableSoftDelete"
```

### GCP (gcloud) Quick Reference

```bash
# IAM Auditing
gcloud projects get-iam-policy <project>
gcloud iam service-accounts list

# GCS Bucket Security
gcloud storage ls
gcloud storage buckets get-iam-policy gs://<bucket>

# Compute Security
gcloud compute instances list
gcloud compute firewall-rules list --filter="sourceRanges=0.0.0.0/0"

# Logging
gcloud logging sinks list
gcloud logging logs list --filter="logName:cloudaudit"
```

**Full command examples with expected output and parsing:** Reference ``

---

## Common Cloud Security Findings

### Finding 1: Public S3 Bucket with Sensitive Data

**Severity:** Critical
**CIS Control:** AWS 2.1.1

**Description:**
S3 bucket "company-backups" allows public read access via bucket ACL or bucket policy, exposing sensitive database backups.

**Detection (prowler):**
```
[FAIL] 2.1.1 - S3 bucket 'company-backups' has public read access
Resource: arn:aws:s3:::company-backups
```

**Detection (ScoutSuite):**
```
S3 Bucket Public Access
Bucket: company-backups
ACL: public-read
Impact: Critical - Database backups exposed
```

**Validation (AWS CLI):**
```bash
# Check bucket ACL
aws s3api get-bucket-acl --bucket company-backups

# Expected problematic output:
{
    "Grants": [
        {
            "Grantee": {
                "Type": "Group",
                "URI": "http://acs.amazonaws.com/groups/global/AllUsers"
            },
            "Permission": "READ"
        }
    ]
}
```

**Exploitation (Pacu):**
```
Pacu> run s3__download_bucket --bucket company-backups

[+] Downloaded 15 files (23.4 GB total)
[!] CRITICAL: Database backup files contain customer PII
```

**Impact:**
- Complete database exposure (customer PII, credentials)
- Compliance violations (GDPR, PCI DSS)
- Reputational damage
- Potential ransom/extortion

**Remediation:**
```bash
# Enable S3 Block Public Access
aws s3api put-public-access-block \
    --bucket company-backups \
    --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Remove public ACL
aws s3api put-bucket-acl --bucket company-backups --acl private

# Enable encryption
aws s3api put-bucket-encryption \
    --bucket company-backups \
    --server-side-encryption-configuration '{
        "Rules": [{
            "ApplyServerSideEncryptionByDefault": {
                "SSEAlgorithm": "AES256"
            }
        }]
    }'

# Enable versioning (recovery from ransomware)
aws s3api put-bucket-versioning --bucket company-backups --versioning-configuration Status=Enabled
```

---

### Finding 2: IAM User with AdministratorAccess and No MFA

**Severity:** Critical
**CIS Control:** AWS 1.2, 1.14

**Description:**
IAM user "developer" has AdministratorAccess policy attached but no MFA device configured. If credentials are compromised, attacker has full account access.

**Detection (prowler):**
```
[FAIL] 1.2 - Multi-factor authentication not enabled for IAM user 'developer'
[FAIL] 1.14 - IAM user 'developer' has overly permissive policy (AdministratorAccess)
```

**Detection (pmapper):**
```
Pacu> pmapper query "preset admin"

[+] Principals with admin-equivalent permissions:
  - arn:aws:iam::123456789012:user/developer
    Via policy: AdministratorAccess
    MFA: False  [!] CRITICAL
```

**Validation (AWS CLI):**
```bash
# Check attached policies
aws iam list-attached-user-policies --user-name developer

# Output:
{
    "AttachedPolicies": [
        {
            "PolicyName": "AdministratorAccess",
            "PolicyArn": "arn:aws:iam::aws:policy/AdministratorAccess"
        }
    ]
}

# Check MFA devices
aws iam list-mfa-devices --user-name developer

# Output:
{
    "MFADevices": []  // No MFA configured
}
```

**Impact:**
- If access keys leaked to GitHub → Full account compromise
- If password phished → Full account compromise
- No second factor to prevent unauthorized access

**Remediation:**
```bash
# Step 1: Enforce MFA
# (User must enable MFA device manually via AWS Console)

# Step 2: Apply conditional policy to deny actions without MFA
aws iam put-user-policy --user-name developer --policy-name RequireMFA --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DenyAllExceptListedIfNoMFA",
            "Effect": "Deny",
            "NotAction": [
                "iam:CreateVirtualMFADevice",
                "iam:EnableMFADevice",
                "iam:ListMFADevices",
                "iam:ListUsers",
                "iam:ListVirtualMFADevices",
                "sts:GetSessionToken"
            ],
            "Resource": "*",
            "Condition": {
                "BoolIfExists": {
                    "aws:MultiFactorAuthPresent": "false"
                }
            }
        }
    ]
}'

# Step 3: Remove AdministratorAccess, apply least privilege
aws iam detach-user-policy --user-name developer --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

# Attach specific permissions only
aws iam attach-user-policy --user-name developer --policy-arn arn:aws:iam::aws:policy/PowerUserAccess
```

---

### Finding 3: Azure Storage Account with Public Blob Access

**Severity:** Critical
**CIS Control:** Azure 3.7

**Description:**
Azure Storage account "companydata" allows public blob access, exposing application logs and configuration files containing credentials.

**Detection (ScoutSuite):**
```
Azure Storage Account Public Access
Account: companydata
Allow Blob Public Access: true
Impact: Critical - Public data exposure
```

**Validation (Azure CLI):**
```bash
# Check if public access allowed
az storage account show --name companydata --query "allowBlobPublicAccess"

# Output: true  (CRITICAL)

# List containers with public access
az storage container list --account-name companydata --query "[?properties.publicAccess != null]"
```

**Exploitation (MicroBurst):**
```powershell
Invoke-EnumerateAzureBlobs -Base company

[+] Found: companydata.blob.core.windows.net
    Container: application-logs (public)
    Files:
      - app-config-2026.json (contains connection strings)
      - app-logs-2026-01-17.log
```

**Impact:**
- Connection strings exposed (database credentials)
- Application logs reveal business logic
- Compliance violations

**Remediation:**
```bash
# Disable public blob access on storage account
az storage account update \
    --name companydata \
    --resource-group production-rg \
    --allow-blob-public-access false

# Remove public access from containers
az storage container set-permission \
    --name application-logs \
    --account-name companydata \
    --public-access off

# Enable soft-delete (recovery)
az storage account blob-service-properties update \
    --account-name companydata \
    --resource-group production-rg \
    --enable-delete-retention true \
    --delete-retention-days 30
```

---

### Finding 4: AWS Security Group with 0.0.0.0/0 on SSH

**Severity:** High
**CIS Control:** AWS 5.1

**Description:**
Security group "web-servers-sg" allows SSH (port 22) from 0.0.0.0/0 (entire internet), exposing EC2 instances to brute-force attacks.

**Detection (prowler):**
```
[FAIL] 5.1 - Security group 'sg-abc123' allows SSH (22) from 0.0.0.0/0
Resource: arn:aws:ec2:us-east-1:123456789012:security-group/sg-abc123
```

**Detection (ScoutSuite):**
```
Security Group Port 22 Open to Internet
Security Group: web-servers-sg (sg-abc123)
Ingress Rule: 0.0.0.0/0 → 22/tcp
Instances Affected: 12
```

**Validation (AWS CLI):**
```bash
# Find security groups with 0.0.0.0/0 on SSH
aws ec2 describe-security-groups \
    --query 'SecurityGroups[?IpPermissions[?IpRanges[?CidrIp==`0.0.0.0/0`] && FromPort==`22`]]' \
    --output table
```

**Impact:**
- Brute-force SSH password attacks
- Potential instance compromise
- Lateral movement to other resources

**Remediation:**
```bash
# Option 1: Remove rule entirely, use Session Manager
aws ec2 revoke-security-group-ingress \
    --group-id sg-abc123 \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0

# Option 2: Restrict to specific office IP
aws ec2 authorize-security-group-ingress \
    --group-id sg-abc123 \
    --protocol tcp \
    --port 22 \
    --cidr 203.0.113.0/24  # Office IP range only

# Option 3: Use AWS Systems Manager Session Manager (no SSH port needed)
# Install SSM agent on instances, grant role AmazonSSMManagedInstanceCore
```

---

### Finding 5: GCP Compute Instance with External IP and Wide-Open Firewall

**Severity:** High
**CIS Control:** GCP 3.6

**Description:**
GCP Compute Engine instance has external IP with firewall rule allowing 0.0.0.0/0 on port 3389 (RDP), exposing Windows instance to internet.

**Detection (ScoutSuite):**
```
GCP Firewall Rule Allows Wide Internet Access
Rule: allow-rdp-from-internet
Direction: Ingress
Source: 0.0.0.0/0
Port: 3389/tcp
Instances Affected: 3
```

**Validation (gcloud CLI):**
```bash
# Find firewall rules allowing 0.0.0.0/0
gcloud compute firewall-rules list --filter="sourceRanges=0.0.0.0/0 AND allowed[]:tcp:3389"

# List instances with external IPs
gcloud compute instances list --format="table(name,networkInterfaces[0].accessConfigs[0].natIP)"
```

**Impact:**
- RDP brute-force attacks
- Potential ransomware deployment
- Data exfiltration

**Remediation:**
```bash
# Delete overly permissive firewall rule
gcloud compute firewall-rules delete allow-rdp-from-internet

# Create restricted firewall rule (office IP only)
gcloud compute firewall-rules create allow-rdp-office \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:3389 \
    --source-ranges=203.0.113.0/24

# Remove external IPs from instances (use Cloud IAP for access)
gcloud compute instances delete-access-config <instance-name> \
    --access-config-name="External NAT"
```

---

## Testing Workflow Summary

**Phase 1: Read-Only Assessment (DEFAULT) - 4-8 hours**

1. **Run prowler** (AWS CIS compliance) - 30 min
   ```bash
   prowler aws -M json,html
   ```

2. **Run ScoutSuite** (multi-cloud audit) - 1 hour
   ```bash
   scout aws
   scout azure --cli
   scout gcp --project-id <project>
   ```

3. **Run pmapper** (AWS IAM escalation) - 30 min
   ```bash
   pmapper graph create
   pmapper query "preset privesc *"
   ```

4. **Run AzureHound** (Azure AD enumeration) - 30 min
   ```bash
   azurehound list -a
   ```

5. **Run Checkov** (IaC scanning) - 15 min
   ```bash
   checkov -d /path/to/terraform
   ```

6. **Run Trivy** (container scanning) - 15 min
   ```bash
   trivy image <image>
   trivy config /path/to/k8s
   ```

7. **Manual CLI validation** (high-risk findings) - 2 hours
   - Validate prowler CRITICAL findings via AWS CLI
   - Validate ScoutSuite findings via Azure/GCP CLI
   - Document evidence with CLI output

8. **Analyze & prioritize** (findings triage) - 1 hour
   - Group findings by severity
   - Map to compliance frameworks
   - Identify exploitable vs theoretical findings

**Deliverable:** Read-only assessment report with prowler/ScoutSuite/pmapper/AzureHound results, mapped to CIS benchmarks.

---

**Phase 2: Exploitation Testing (IF AUTHORIZED) - 4-8 hours**

**⚠️ STOP: Get explicit written authorization before proceeding**

1. **AWS Exploitation** (Pacu) - 2 hours
   ```
   Pacu> run iam__privesc_scan
   Pacu> run s3__bucket_finder
   Pacu> run ec2__enum
   ```

2. **Azure Exploitation** (MicroBurst) - 2 hours
   ```powershell
   Invoke-EnumerateAzureBlobs -Base <company>
   Get-AzureKeyVaults
   # Test other MicroBurst functions
   ```

3. **Document exploitable findings** - 2 hours
   - Which pmapper findings were exploitable via Pacu?
   - Which AzureHound findings led to privilege escalation?
   - Provide proof-of-concept scripts

4. **Risk assessment** - 2 hours
   - Likelihood of exploitation (easy/medium/hard)
   - Impact if exploited (data exposure, account takeover)
   - Prioritize remediation based on risk

**Deliverable:** Exploitation report showing which findings are actually exploitable, not just theoretical.

---

**Phase 3: Remediation (IF AUTHORIZED) - Variable**

1. Use elevated credentials to implement fixes
2. Re-run Phase 1 tools to validate remediation
3. Document before/after state
4. Provide compliance dashboard screenshots

---

## Vulnerability Finding Examples

### Finding 1: Public S3 Bucket with Sensitive Data

**Severity:** Critical (CVSS 9.1)
**CIS Control:** 2.1.1 — S3 Block Public Access
**Compliance:** PCI DSS 3.4, NIST 800-53 SC-28

**Vulnerable Configuration:**
```json
// S3 Bucket Policy — allows anonymous read
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicRead",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::company-data-backup/*"
  }]
}
```

**Discovery:**
```bash
# prowler finding
# [FAIL] 2.1.1 - S3 bucket 'company-data-backup' allows public access via bucket policy

# Manual validation
aws s3api get-bucket-policy --bucket company-data-backup --output json
aws s3api get-public-access-block --bucket company-data-backup

# Expected output (vulnerable):
# {
#   "PublicAccessBlockConfiguration": {
#     "BlockPublicAcls": false,
#     "IgnorePublicAcls": false,
#     "BlockPublicPolicy": false,
#     "RestrictPublicBuckets": false
#   }
# }

# Test anonymous access
aws s3 ls s3://company-data-backup/ --no-sign-request

# Expected output (vulnerable):
# 2026-01-15 14:23:45  45678901  database-backup-2026-01-15.sql.gz
# 2026-01-15 14:24:12    12345  config.yaml
# 2026-01-15 14:24:30   789012  customer-export.csv
```

**Impact:**
- Unauthenticated access to database backups containing customer PII
- Configuration files may contain credentials (API keys, database passwords)
- Regulatory violation (GDPR, PCI DSS, HIPAA depending on data classification)
- Data breach notification requirements triggered

**Remediation:**
```bash
# Step 1: Enable S3 Block Public Access (account-wide)
aws s3control put-public-access-block \
  --account-id 123456789012 \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Step 2: Enable on the specific bucket
aws s3api put-public-access-block \
  --bucket company-data-backup \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Step 3: Remove the public bucket policy
aws s3api delete-bucket-policy --bucket company-data-backup

# Step 4: Enable server-side encryption
aws s3api put-bucket-encryption \
  --bucket company-data-backup \
  --server-side-encryption-configuration \
  '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "aws:kms"}}]}'

# Step 5: Verify remediation
prowler aws -c s3_bucket_public_access -f us-east-1
```

**Real-World Impact:** Public S3 buckets have caused breaches at Capital One (2019, 100M records), Twitch (2021, full source code), and hundreds of smaller organizations. AWS now defaults Block Public Access to enabled for new buckets, but legacy buckets remain vulnerable.

---

### Finding 2: IAM User with Inline AdministratorAccess and No MFA

**Severity:** Critical (CVSS 9.0)
**CIS Control:** 1.4 — Ensure no root or IAM access key exists, 1.10 — MFA enabled
**Compliance:** NIST 800-53 IA-2, PCI DSS 8.3

**Discovery:**
```bash
# pmapper finding
pmapper query "preset privesc *"

# Expected output:
# [+] deploy-bot CAN escalate to admin via:
#   Path: deploy-bot → iam:CreateAccessKey → admin-role
#   deploy-bot has inline policy with iam:* permissions
#   No MFA required on deploy-bot

# Manual validation
aws iam list-user-policies --user-name deploy-bot
# Output: {"PolicyNames": ["full-admin-inline"]}

aws iam get-user-policy --user-name deploy-bot --policy-name full-admin-inline
# Output reveals: {"Effect": "Allow", "Action": "*", "Resource": "*"}

aws iam list-mfa-devices --user-name deploy-bot
# Output: {"MFADevices": []}  ← No MFA

aws iam list-access-keys --user-name deploy-bot
# Output: Key created 847 days ago, last used 2 days ago
```

**Vulnerable Configuration:**
```json
// Inline policy on IAM user "deploy-bot"
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "*",
    "Resource": "*"
  }]
}
// No MFA device configured
// Access key age: 847 days (CIS max: 90 days)
```

**Impact:**
- Compromised access key grants full account control
- No MFA means single factor (leaked key) is sufficient for compromise
- Key age (847 days) indicates no rotation — increases exposure window
- Attacker can create persistence (new users, roles, backdoor Lambda functions)

**Remediation:**
1. **Replace inline policy** with least-privilege managed policy scoped to actual deployment needs
2. **Enable MFA** on the IAM user (or migrate to IAM role with temporary credentials)
3. **Rotate access keys** immediately and establish 90-day rotation policy
4. **Migrate to IAM roles** — CI/CD pipelines should use OIDC federation, not long-lived keys

---

### Finding 3: Azure NSG Allows SSH from Any Source

**Severity:** High (CVSS 7.5)
**CIS Control:** 6.2 — Ensure SSH access is restricted
**Compliance:** NIST 800-53 SC-7, PCI DSS 1.3

**Discovery:**
```bash
# ScoutSuite finding in azure/index.html report:
# [HIGH] Network Security Group "prod-nsg" allows SSH (port 22) from 0.0.0.0/0

# Manual validation
az network nsg rule list --nsg-name prod-nsg --resource-group prod-rg --output table

# Expected output (vulnerable):
# Name       Priority  Source        SourcePort  Destination  DestPort  Access  Direction
# AllowSSH   100       *             *           *            22        Allow   Inbound

az network nsg show --name prod-nsg --resource-group prod-rg \
  --query "securityRules[?destinationPortRange=='22' && sourceAddressPrefix=='*']"
```

**Impact:**
- SSH accessible from any IP on the internet
- Enables brute force attacks against SSH authentication
- If key-based auth not enforced, password guessing may succeed
- Compromised VM provides foothold into Azure VNet

**Remediation:**
```bash
# Option 1: Restrict to specific IP range
az network nsg rule update \
  --nsg-name prod-nsg \
  --resource-group prod-rg \
  --name AllowSSH \
  --source-address-prefixes 203.0.113.0/24

# Option 2: Remove SSH rule and use Azure Bastion
az network nsg rule delete \
  --nsg-name prod-nsg \
  --resource-group prod-rg \
  --name AllowSSH

# Deploy Azure Bastion for secure access
az network bastion create \
  --name prod-bastion \
  --resource-group prod-rg \
  --vnet-name prod-vnet \
  --public-ip-address prod-bastion-pip

# Verify remediation
az network nsg rule list --nsg-name prod-nsg --resource-group prod-rg \
  --query "[?destinationPortRange=='22']" --output table
```

**Real-World Impact:** Open management ports are consistently among the top cloud misconfigurations. Azure Bastion or AWS Systems Manager Session Manager eliminates the need for public SSH/RDP access entirely.

---

## Reference Resources

### CIS Benchmarks

**AWS:**
- CIS AWS Foundations Benchmark v3.0.0: https://www.cisecurity.org/benchmark/amazon_web_services

**Azure:**
- CIS Microsoft Azure Foundations Benchmark: https://www.cisecurity.org/benchmark/azure

**GCP:**
- CIS Google Cloud Platform Foundations Benchmark: https://www.cisecurity.org/benchmark/google_cloud_computing_platform

### Local Resources (Framework Library)

**CIS Benchmarks:**
- AWS Database: `standards/frameworks/cis-benchmarks/aws/cis-aws-database-services-benchmark-v1.0.0/`
- AWS Storage: `standards/frameworks/cis-benchmarks/aws/cis-aws-storage-services-benchmark-v1.0.0/`
- Azure Foundations: `standards/frameworks/cis-benchmarks/azure/cis-microsoft-azure-foundations-benchmark-v5.0.0/`
- GKE: `standards/frameworks/cis-benchmarks/gcp/cis-google-kubernetes-engine-gke-benchmark-v1.8.000-pdf/`
- Kubernetes: `standards/frameworks/cis-benchmarks/kubernetes/cis-kubernetes-benchmark-v1.12.000-pdf/`

**Compliance Frameworks:** `standards/frameworks/` — nist-800-53, fedramp, hipaa, pci-dss

### Cloud Provider Documentation

**AWS:**
- Security Hub Standards: https://docs.aws.amazon.com/securityhub/latest/userguide/standards-reference.html
- Well-Architected Security Pillar: https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html

**Azure:**
- Microsoft Cloud Security Benchmark: https://learn.microsoft.com/en-us/security/benchmark/azure/
- Security Best Practices: https://learn.microsoft.com/en-us/azure/security/fundamentals/best-practices-and-patterns

**GCP:**
- Security Best Practices: https://cloud.google.com/security/best-practices
- Security Command Center: https://cloud.google.com/security-command-center/docs

### Compliance Frameworks

- NIST SP 800-53: https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final
- PCI DSS: https://www.pcisecuritystandards.org/
- HIPAA: https://www.hhs.gov/hipaa/

---

**Created:** 2026-01-17
**Framework:** Intelligence Adjacent (IA) - Security Testing
**Version:** 2.0
**Total Lines:** 2,507
**Tools Referenced:** prowler, ScoutSuite, pmapper, AzureHound, Pacu, MicroBurst, Checkov, Trivy, AWS CLI, Azure CLI, gcloud SDK
