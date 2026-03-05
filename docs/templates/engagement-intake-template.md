# Engagement Intake Template

**Shared template for formal assessment workflows (risk assessment, machinery compliance, etc.)**

---

## Purpose

Standardized intake form for collecting minimum required information to start an assessment engagement. Used by:
- `machinery-compliance` skill (full assessment mode)
- `security-advisory` skill (risk assessment mode)
- Any other formal engagement workflow

---

## Required Fields (8 Total)

### Company Information
| Field | Required | Description |
|-------|----------|-------------|
| **Company Name** | Yes | Legal or common name of organization |
| **Company Website** | Yes | Primary website URL (for OSINT research) |

### Interviewee Information
| Field | Required | Description |
|-------|----------|-------------|
| **Interviewee Name** | Yes | Person being interviewed |
| **Interviewee Title** | Yes | Job title/role |
| **Interviewee Email** | Yes | Contact email |

### Assessor Information
| Field | Required | Description |
|-------|----------|-------------|
| **Assessor Name** | Yes | Person conducting assessment |
| **Assessor Email** | Yes | Assessor's email |
| **Assessor Company** | Yes | Assessor's organization |

---

## Collection Method

**Use AskUserQuestion with single form-style prompt:**

```
Please provide the following information to begin the assessment:

COMPANY INFORMATION:
- Company Name: _______________
- Company Website: _______________

INTERVIEWEE (person you'll be interviewing):
- Name: _______________
- Title: _______________
- Email: _______________

ASSESSOR (you, conducting this assessment):
- Your Name: _______________
- Your Email: _______________
- Your Company: _______________
```

---

## After Intake Actions

1. **Create engagement folder:**
   ```
   output/engagements/{type}/{company-slug}-{YYYY-MM}/
   ```

2. **Initialize metadata.json:**
   ```json
   {
     "engagement_id": "{uuid}",
     "engagement_type": "{type}",
     "created_at": "{ISO-timestamp}",
     "company": {
       "name": "{from intake}",
       "website": "{from intake}"
     },
     "interviewees": [
       {
         "id": "INT-001",
         "name": "{from intake}",
         "title": "{from intake}",
         "email": "{from intake}",
         "interview_status": "pending"
       }
     ],
     "assessor": {
       "name": "{from intake}",
       "email": "{from intake}",
       "company": "{from intake}"
     },
     "phase": "interview"
   }
   ```

3. **Start OSINT in background:**
   - Uses company name + website
   - Runs parallel to interview

4. **Initialize interview-responses.md:**
   - Header with engagement info
   - Ready for progressive append

---

## Multi-Interviewee Support

**After completing interview with one person:**

```
Interview complete with {name} ({title}).

Options:
1. Add another interviewee
2. Proceed to analysis
```

**If adding another:**
- Collect only: Name, Title, Email
- Assign new ID: INT-002, INT-003, etc.
- Append new header to interview-responses.md
- Repeat interview questions

---

## Progressive Save Format

**After EACH interview response, append to interview-responses.md:**

```markdown
---
## Q{N}: {Question Title}
**Interviewee:** {name} ({title}) [ID: {interviewee_id}]
**Timestamp:** {YYYY-MM-DD HH:MM:SS}
**Source:** {Confirmed|Modified|Unknown|Skip}

**Response:**
{User's response}

**Notes:** {Any follow-up items}
---
```

---

## Usage in Skills

### machinery-compliance
```python
# After mode selection
intake = collect_intake()  # 8 fields
create_engagement_folder("machinery-safety", intake)
start_osint_background(intake.company)
begin_interview(intake.interviewee)
```

### security-advisory (risk assessment)
```python
# After mode selection
intake = collect_intake()  # 8 fields
create_engagement_folder("risk-assessments", intake)
start_osint_background(intake.company)
begin_22_question_interview(intake.interviewee)
```

---

**Version:** 1.0
**Last Updated:** 2025-12-28
**Framework:** Intelligence Adjacent (IA)
