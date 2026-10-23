# AI Career Companion — Technical System Architecture (Milestone 4)

## 1. Executive Summary & Overview
The **AI Career Companion** is an end-to-end AI-powered career assistant and internship matching platform designed for college students and entry-level job seekers. It integrates candidate profile management, intelligent LLM resume parsing, Retrieval-Augmented Generation (RAG) over an internship knowledge base, multi-agent specialized career reasoning, and a full-lifecycle Application Tracking Module.

---

## 2. High-Level Architectural Layout

```
                  ┌────────────────────────────────────────────────────────┐
                  │              Frontend (React + TypeScript + Tailwind)  │
                  │  - Student Profile Wizard   - Resume Intelligence      │
                  │  - Internship RAG Search    - Skill Gap Dashboard      │
                  │  - Customization Studio     - Interview Prep & Mock    │
                  │  - Application Tracker      - Live Career Assistant    │
                  └──────────────────────────┬─────────────────────────────┘
                                             │ REST / JSON (HTTP API)
                                             ▼
                  ┌────────────────────────────────────────────────────────┐
                  │               FastAPI Backend Microservice             │
                  └─────┬────────────────────┬────────────────────┬────────┘
                        │                    │                    │
  ┌─────────────────────┴──────┐ ┌───────────┴──────────┐ ┌───────┴─────────────────────┐
  │ Candidate Profile Service  │ │ Application Tracker  │ │   Multi-Agent Ecosystem     │
  │ - JSON In-Memory Store     │ │ - Lifecycle Stages   │ │ - Matching Agent (M2)       │
  │ - Extracted Resume Data    │ │ - Interview Schedule │ │ - Skill Gap Agent (M3)      │
  │ - Confidence Scoring       │ │ - Reminders & Notes  │ │ - Customization Agent (M3)  │
  └────────────────────────────┘ └──────────────────────┘ │ - Interview Prep Agent (M3) │
                                                          │ - Assistant Orchestrator    │
                                                          └───────────┬─────────────────┘
                                                                      │
                                                          ┌───────────┴─────────────────┐
                                                          │     RAG Retrieval Engine    │
                                                          │ - 178 Synthetic JDs         │
                                                          │ - Hybrid TF-IDF + BM25      │
                                                          │ - Subword Vector Store      │
                                                          └─────────────────────────────┘
```

---

## 3. Core Component Breakdown

### 3.1 Frontend Web Interface (`frontend/src`)
- **Technology Stack**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite.
- **Key Modules**:
  - `StudentProfilePage.tsx`: Multi-step candidate wizard for education, skills, projects, certifications, and career preferences.
  - `ResumeUploadPage.tsx` & `ResumeAnalysisPage.tsx`: Interactive drag-and-drop resume uploader with confidence breakdown visualization.
  - `InternshipsPage.tsx`: RAG-boosted internship discovery showing transparent multi-factor compatibility scores and match explanations.
  - `ApplicationTrackerPage.tsx`: Kanban & List view application tracking dashboard managing application stages, interview schedules, notes, and deadlines.
  - `SkillGapPage.tsx`: Readiness score and 5-category gap categorization.
  - `ApplicationCustomizationPage.tsx`: Tailored resume bullets and role-specific cover letters with truthfulness guardrails.
  - `InterviewPrepPage.tsx`: 5-category interview drill generator and written response evaluator.
  - `CareerAssistantPage.tsx`: Floating and dedicated natural language career assistant with context preservation.

### 3.2 Backend Microservices (`backend/app`)
- **Framework**: Python 3.12 with FastAPI & Uvicorn.
- **Data Models**: Pydantic schemas (`candidate.py`, `application.py`) defining strong typing across all API payloads.
- **Routers**:
  - `/api/v1/profile`: Candidate CRUD operations.
  - `/api/v1/matching`: Multi-factor job matching endpoints.
  - `/api/v1/agents`: Endpoints for Skill Gap, Customization, Interview Prep, and Career Assistant.
  - `/api/v1/applications`: Lifecycle tracker CRUD, stage updates, interview schedules, and dashboard overview metrics.

### 3.3 Application Tracking System (M4.1)
- **Lifecycle Stages**: Saved ➔ Planning to apply ➔ Applied ➔ Under review ➔ Shortlisted ➔ Interview scheduled ➔ Interview completed ➔ Offer received ➔ Rejected ➔ Withdrawn.
- **Schedule Management**: Virtual link storage, interview date/time tracking, interviewer notes, and candidate feedback.
- **Reminders & Alerts**: Automated tracking of upcoming deadlines, pending follow-ups, and scheduled interviews.

---

## 4. Multi-Agent Ecosystem Architecture

1. **Job-Resume Matching Agent**: Calculates transparent composite match scores (Skill Alignment 40%, Semantic Similarity 30%, Education & Experience 20%, Preferences 10%).
2. **Skill Gap Analysis Agent**: Compares candidate profile against required vs preferred skills; classifies gaps into 5 distinct categories (Critical Skills, Secondary Skills, Preferred Assets, Experience, Qualification).
3. **Resume & Cover Letter Customization Agent**: Generates role-specific resume bullet points and cover letters while enforcing strict candidate truthfulness guardrails.
4. **Interview Preparation Agent**: Generates 5 categories of mock questions (Core Technical, Behavioral, System Design, Problem-Solving, Role-Specific) and scores user answers (0-100).
5. **Conversational Career Assistant Orchestrator**: Central natural-language router handling multi-turn queries, preserving active job context, and dispatching tasks to domain agents.
