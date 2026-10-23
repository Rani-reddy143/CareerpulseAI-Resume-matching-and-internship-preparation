# AI Career Companion — Developer Documentation & Technical Specifications

## Milestone 1: Foundation & Candidate Understanding

### 1. Product & Architecture Overview
**AI Career Companion** is an enterprise-grade SaaS application designed for college students to manage their candidate profiles, analyze resumes automatically via LLM parsing engines, understand skill gaps, match with top internships, and practice technical interviews.

The architecture is built cleanly around **Milestone 1: Candidate Understanding**, while preparing modular boundaries for future specialized AI agents (Resume, Job Matching, Skill Gap, Cover Letter, Interview Prep, and Career Assistant Orchestrator).

---

## 2. Component & System Architecture

```
[ Frontend: React + TypeScript + Tailwind CSS ]
                       │
                       ▼ (REST / JSON API)
[ Backend: Python FastAPI Microservices ]
       ├── Authentication & Session Management
       ├── Candidate Profile Management Service
       ├── Resume Parsing & LLM Extraction Pipeline
       ├── Multi-Agent Orchestrator (Career Assistant)
       └── RAG Vector Store & Indexing Layer (FAISS / Chroma)
```

---

## 3. Candidate Profile Schema Specification

Defined in Pydantic (`backend/app/models/candidate.py`) and TypeScript (`frontend/src/types/index.ts`):

- **CandidateProfile**: `id`, `userId`, `fullName`, `email`, `phone`, `location`, `linkedin`, `github`, `portfolio`, `education[]`, `skills[]`, `experience[]`, `projects[]`, `certifications[]`, `careerPreferences`, `resumeMetadata`, `extractedResumeData`, `profileCompletion`.
- **Education**: `degree`, `institution`, `field`, `cgpa`, `startYear`, `graduationYear`.
- **Experience**: `company`, `role`, `startDate`, `endDate`, `description`, `technologies[]`.
- **Project**: `name`, `description`, `technologies[]`, `url`, `githubUrl`.
- **Certification**: `name`, `issuer`, `date`, `credentialUrl`.
- **SkillCategory**: `category`, `items[]`.
- **ResumeMetadata**: `fileName`, `fileType`, `fileSize`, `uploadDate`, `parsingStatus`, `analysisStatus`.
- **ConfidenceScores**: `skills` (0-1), `education` (0-1), `experience` (0-1), `projects` (0-1).

---

## 4. Multi-Agent Ecosystem Design

1. **Resume Extraction Agent** (Milestone 1 - Active):
   - Extracts skills, education, work experience, projects, and certifications into structured JSON.
2. **Job-Resume Matching Agent** (Milestone 2 - Ready):
   - Calculates weighted match percentage between Candidate Profile and internship descriptions.
3. **Skill Gap Agent** (Milestone 2 - Ready):
   - Compares candidate skills against target role requirements to highlight missing skills & learning pathways.
4. **Cover Letter Agent** (Milestone 3 - Ready):
   - Synthesizes personalized cover letters using candidate background and company specifics.
5. **Interview Agent** (Milestone 4 - Ready):
   - Generates mock technical & behavioral drills and evaluates student responses.
6. **Career Assistant Orchestrator** (Milestone 1 - Active):
   - Floating chat assistant routing queries to appropriate domain subagents.

---

## 5. RAG (Retrieval-Augmented Generation) Architecture

```
User Query / Context ➔ Career Assistant Orchestrator ➔ Embedding Vector Search (FAISS) ➔ Retrieve Internship & Q&A Snippets ➔ Grounded LLM Prompt ➔ Contextual Career Advice
```

---

## 6. How to Run Locally

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
