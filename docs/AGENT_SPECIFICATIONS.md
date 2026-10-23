# AI Career Companion — Multi-Agent System Specifications (Milestone 4)

## 1. Agent Ecosystem Matrix

| Agent Name | Primary Responsibility | Input Payload | Output Payload | Grounding & Guardrails |
| :--- | :--- | :--- | :--- | :--- |
| **Resume Extraction Agent** | Extracts structured candidate profile from raw resume text/PDF | Resume File / Text | `CandidateProfile` JSON with Confidence Scores | Strict regex & subword NLP entity extraction |
| **Job-Resume Matching Agent** | Computes multi-factor match score between candidate profile and JDs | `CandidateProfile`, Job Query / Index | Ranked matches with score breakdown & verdict | Formula-driven transparent weightings (40% skills, 30% semantic, 20% edu/exp, 10% pref) |
| **Skill Gap Analysis Agent** | Identifies missing requirements across 5 gap categories and creates action plan | `CandidateProfile`, `job_id` | Readiness Score, 5 Gap Categories, Action Plan | Compare explicit profile skills vs required skills; zero fake assumptions |
| **Customization Agent** | Generates role-specific resume bullets and tailored cover letters | `CandidateProfile`, `job_id` | Tailored Resume Bullets, Cover Letter text, Truthfulness Check | Enforces truthfulness check: strictly prohibits inventing experience or unearned skills |
| **Interview Prep Agent** | Generates 5 categories of interview questions and evaluates mock responses | `CandidateProfile`, `job_id`, User Answer | 5 Question Categories, Revision Topics, Answer Score (0-100) & Feedback | Evaluates answers against key technical concepts without generic fluff |
| **Career Assistant Orchestrator** | Central conversational agent routing queries and preserving multi-turn context | User Message, History, Profile, Active `job_id` | Agent Routing, Markdown Reply, Suggested Actions | Context retention across turns; routes intent accurately |

---

## 2. Detailed Agent Specifications

### 2.1 Job-Resume Matching Agent
- **Inputs**: `CandidateProfile`, optional search query, top_k integer.
- **Matching Algorithm**:
  - **Skill Match Score (40%)**: Ratio of matched candidate skills to job required skills.
  - **Semantic Vector Score (30%)**: Subword TF-IDF cosine similarity between profile summary/projects and job description.
  - **Education & Experience Score (20%)**: Field of study alignment and experience duration match.
  - **Preferences & Location Score (10%)**: Matching preferred roles, locations, and work modes.
- **Output**: Ranked array of job postings with compatibility scores (0-100%), verdicts ("Excellent Match", "Strong Match", "Moderate Match"), score breakdowns, and transparent natural language summaries.

### 2.2 Skill Gap Analysis Agent
- **Inputs**: `CandidateProfile`, `job_id`.
- **Gap Classification Taxonomy**:
  1. **Critical Missing Skills**: Core required skills completely missing from candidate profile.
  2. **Partially Demonstrated Skills**: Skills present at introductory level needing depth.
  3. **Preferred Skills Gaps**: Secondary assets that boost candidacy.
  4. **Experience Gaps**: Missing project portfolio items or internship duration.
  5. **Qualification Gaps**: Degree, CGPA, or certification prerequisites.
- **Output**: Overall readiness score, classified gap lists, 2-week learning pathways, and skill importance explanations explaining WHY each skill matters for daily job duties.

### 2.3 Resume & Cover Letter Customization Agent
- **Inputs**: `CandidateProfile`, `job_id`.
- **Output**:
  - **Tailored Resume Summary**: Role-focused professional summary.
  - **Prioritized Skills**: Matching skills moved to top of resume.
  - **Action Bullet Enhancements**: Action-verb bullet points linking candidate's actual projects to job requirements.
  - **Cover Letter**: Professional 5-paragraph letter (Salutation, Opening, Experience Alignment, Company Research Alignment, Closing).
  - **Truthfulness Guardrail Result**: Boolean `is_truthful` flag verifying zero hallucinated facts.

### 2.4 Interview Preparation Agent
- **Inputs**: `CandidateProfile`, `job_id`, optional mock written answer.
- **Question Categories**: Core Technical Concepts, Behavioral (STAR method), System Design / Architecture, Problem-Solving / Coding, Role-Specific Scenarios.
- **Mock Answer Evaluator**: Evaluates user answer on technical depth, completeness, and clarity, returning a numerical score (0-100) and actionable improvement suggestions.

### 2.5 Conversational Career Assistant
- **Inputs**: `message` string, `CandidateProfile`, conversation `history`, `active_job_id`.
- **Routing Rules**: Classifies natural language queries into 5 intent categories (`recommendation`, `skill_gap`, `customization`, `interview_prep`, `comparison`) and delegates processing to the appropriate agent.
