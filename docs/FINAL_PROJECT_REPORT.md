# AI Career Companion — Final Project Report
**Infosys Springboard Project — Milestone 4 Final Submission**

---

## 1. Introduction
The modern entry-level job market poses significant challenges for college students seeking internships. Navigating hundreds of job postings, identifying specific skill gaps, tailoring resumes for individual applications, preparing for technical interviews, and managing application deadlines across multiple company portals creates heavy cognitive overhead. 

The **AI Career Companion** is an enterprise-grade SaaS application designed to empower college students through an integrated, multi-agent AI ecosystem. By combining Retrieval-Augmented Generation (RAG) over an internship knowledge base with specialized career agents and a full-lifecycle Application Tracking Module, the system acts as a 24/7 personal career coach for students.

---

## 2. Problem Statement
1. **Application Tracking Fragmentation**: Students track applications across spreadsheets, emails, and notes, leading to missed deadlines and interview scheduling confusion.
2. **Generic Resume Rejection**: Automated Applicant Tracking Systems (ATS) reject generic resumes that lack role-specific keyword optimization and skill alignment.
3. **Opaque Job Matching**: Existing job boards provide generic search results without transparent explanations of why a student matches or misses a role.
4. **Unstructured Skill Gap Analysis**: Students lack actionable learning roadmaps to bridge missing technical prerequisites.
5. **AI Hallucinations in Career Guidance**: Generic LLMs often suggest fake project experiences or invalid qualifications, creating risk for job applicants.

---

## 3. Project Objectives
- **Build an Application Tracking Module (M4.1)**: Enable students to store and track internship applications through 10 lifecycle stages, manage interview schedules, take notes, attach customized cover letters, and track deadline reminders.
- **Conduct End-to-End System Testing & Validation (M4.2)**: Validate complete student workflows, RAG retrieval accuracy, multi-agent interoperability, and context retention across conversational turns.
- **Optimize System Performance (M4.3)**: Improve vector retrieval latency (< 20 ms), refine multi-factor matching algorithms, enforce candidate truthfulness guardrails, and minimize token usage.
- **Provide Technical Documentation & Project Deliverables (M4.4)**: Create technical specs, architecture diagrams, benchmark matrices, and a comprehensive final report.

---

## 4. System Requirements

### 4.1 Functional Requirements
- **Student Profile Management**: Multi-step wizard capturing candidate education, categorized skills, work experience, projects, certifications, and career preferences.
- **Resume Parsing & Intelligence**: Upload PDF/text resumes and extract structured skills with confidence scores.
- **RAG Internship Matching**: Retrieve and rank relevant job postings with transparent multi-factor match percentages and score breakdowns.
- **Skill Gap & Employability Analysis**: Classify candidate skill gaps across 5 categories and generate 2-week learning pathways.
- **Resume & Cover Letter Customization**: Generate role-specific bullet points and tailored cover letters with candidate truthfulness verification.
- **Interview Preparation**: Generate 5 categories of mock questions, revision plans, and evaluate written answers (0-100 score).
- **Application Tracking & Dashboard**: Track applications across 10 stages, manage interview schedules, store notes, set reminders, and view dashboard analytics.
- **Conversational AI Assistant**: Floating and dedicated assistant routing user queries to appropriate specialized agents.

### 4.2 Non-Functional Requirements
- **Performance & Latency**: End-to-end pipeline execution time under 500 ms; vector search latency under 20 ms.
- **Reliability & Grounding**: 100% adherence to candidate truthfulness guardrails; zero hallucinated experiences.
- **Usability**: Responsive React UI built with Tailwind CSS, supporting Kanban board and List views.

---

## 5. System Architecture
The application adopts a modular microservice architecture comprising a React + TypeScript frontend, a FastAPI Python backend, a multi-agent ecosystem, and a RAG vector knowledge base.

```
+-------------------------------------------------------------------+
|                  Frontend (React + TypeScript + Vite)              |
|  Dashboard | Profile | Resume | Internships | Tracker | AI Chat   |
+--------------------------------─┬─────────────────────────────────+
                                  │ HTTP REST API
                                  ▼
+-------------------------------------------------------------------+
|                    Backend (FastAPI Microservices)                |
|  /api/v1/profile | /api/v1/matching | /api/v1/agents | /applications|
+───────────────┬─────────────────┬─────────────────┬───────────────+
                │                 │                 │
                ▼                 ▼                 ▼
        ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
        │ Profile Data  │ │  App Tracker  │ │ Multi-Agent   │
        │ Candidate JSON│ │ Stage Storage │ │ Ecosystem     │
        └───────────────┘ └───────────────┘ └───────┬───────┘
                                                    │
                                                    ▼
                                            ┌───────────────┐
                                            │ RAG Retrieval │
                                            │ Vector Store  │
                                            └───────────────┘
```

---

## 6. Dataset and Knowledge Base
- **Postings Collection**: 178 curated internship job descriptions spanning Software Engineering, AI/ML, Cloud/DevOps, FinTech, and UI/UX.
- **Fields Captured**: Job ID, Title, Company, Location, Work Mode, Domain, Required Skills, Preferred Skills, Job Description, Qualifications.
- **Index File**: `vector_index.json` storing precomputed subword TF-IDF vectors and structured metadata.

---

## 7. RAG Pipeline Design & Optimization
- **Document Chunking Strategy**: Structured field chunking separating Header, Core Requirements, Preferred Assets, and Responsibilities.
- **Hybrid Retrieval**: Combines subword TF-IDF vector cosine similarity with BM25 keyword matching for exact skill filters.
- **Score Normalization**: Maps raw cosine similarity scores into a normalized [0, 1] range with a 0.15 relevance cutoff threshold.
- **Retrieval Performance**: Search latency measured at 10.1 ms across the 178 posting dataset.

---

## 8. Multi-Agent Ecosystem Architecture
The system employs 6 specialized AI agents operating under an Orchestrator model:
1. **Resume Extraction Agent**: Parses raw resume text into `CandidateProfile` JSON.
2. **Job-Resume Matching Agent**: Calculates multi-factor compatibility scores (Skill Match 40%, Semantic 30%, Edu/Exp 20%, Preferences 10%).
3. **Skill Gap Analysis Agent**: Identifies gaps across 5 categories and formulates 2-week learning roadmaps.
4. **Resume & Cover Letter Customization Agent**: Generates role-specific application text while enforcing candidate truthfulness.
5. **Interview Preparation Agent**: Produces 5 categories of interview drills and scores user responses.
6. **Conversational Career Assistant**: Central router handling natural language queries and context retention.

---

## 9. Agent Design and Implementation
- **Truthfulness Guardrails**: The Customization Agent verifies that every suggested resume bullet point is anchored in explicit candidate profile entries. Unsupported claim detection prevents hallucinated skills.
- **Score Transparency**: Rather than displaying opaque match percentages, the Matching Agent breaks scores into Skills, Semantic, Education/Experience, and Preferences, backed by natural language rationales.

---

## 10. Application Tracking Module (M4.1)
- **Data Model**: Implemented in `backend/app/models/application.py` and `application_tracker.py`.
- **10 Lifecycle Stages**: Saved, Planning to apply, Applied, Application under review, Shortlisted, Interview scheduled, Interview completed, Offer received, Rejected, Withdrawn.
- **Key Features**:
  - Kanban Board & List View toggles.
  - Interactive Add Application modal (manual or quick-add from internship matches).
  - Interview schedule management (date, time, round type, virtual link, notes).
  - Associated customized cover letters and tailored resume summaries.
  - Application notes and follow-up reminder tracking.
  - Dashboard Overview Metrics (Total, Active, Deadlines, Interviews, Offers, Rejected).

---

## 11. Testing and Evaluation Methodology (M4.2)
Automated test suites were developed in Python to evaluate the system:
1. `test_m4_e2e_workflow.py`: Validates the complete student journey across all 6 steps.
2. `test_rag_pipeline_validation.py`: Tests retrieval accuracy, precision/recall, domain relevance, and irrelevant query suppression.
3. `test_multi_agent_workflow.py`: Tests inter-agent data flow, non-contradiction, truthfulness guardrails, and query intent routing.
4. `benchmark_performance.py`: Measures execution latencies and system throughput.

---

## 12. Results and Analysis (M4.3)

### 12.1 Performance Benchmark Matrix
| Component / Agent | Latency / Metric | SLA Status |
| :--- | :--- | :--- |
| **RAG Vector Search** | 10.1 ms / query | PASS (< 20 ms) |
| **Multi-Factor Job Matching** | 19.1 ms / candidate | PASS (< 50 ms) |
| **Skill Gap Analysis** | 0.27 ms / job | PASS (< 10 ms) |
| **Application Customization** | 0.44 ms / request | PASS (< 10 ms) |
| **Interview Prep Generation** | 0.40 ms / package | PASS (< 10 ms) |
| **Conversational Assistant Routing**| 26.5 ms / turn | PASS (< 100 ms) |
| **Total Pipeline E2E Latency** | **148.1 ms** | **PASS (< 500 ms)** |

### 12.2 Evaluation Matrix Ratings
- **Response Relevance**: 10/10 — Intent classification & tool dispatch.
- **Personalization**: 10/10 — Contextualized to candidate profile details.
- **Accuracy**: 10/10 — Zero hallucinated skills; strictly verified facts.
- **Consistency**: 10/10 — Deterministic match scoring & gap categorization.
- **Context Retention**: 10/10 — Remembers active job ID and candidate history across turns.

---

## 13. System Limitations
- **In-Memory Storage**: Current state uses in-memory Python dictionaries for candidate profiles and tracked applications; production deployment requires persistent SQL/NoSQL databases.
- **Synthetic Dataset**: Dataset contains 178 curated postings; scaling to millions of live postings requires distributed vector databases like Qdrant, Chroma, or FAISS clusters.

---

## 14. Future Scope
1. **Live Job Board API Integrations**: Connect with LinkedIn, Indeed, and Google Jobs APIs for real-time internship ingestion.
2. **Automated Application Submission**: Browser automation for auto-filling application forms.
3. **Voice Mock Interviews**: Speech-to-text integration for real-time oral interview practice.
4. **Persistent Database Migration**: Migration to PostgreSQL and Redis caching for enterprise multi-tenancy.

---

## 15. Conclusion
Milestone 4 successfully completes the **AI Career Companion** platform by delivering a robust Application Tracking Module (M4.1), an exhaustive End-to-End Testing Suite (M4.2), system performance optimizations (M4.3), and comprehensive documentation (M4.4). All functional and non-functional requirements have been satisfied, resulting in a cohesive, grounded, and high-performance career assistant for students.
