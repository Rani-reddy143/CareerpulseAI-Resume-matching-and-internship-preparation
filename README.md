# AI Career Companion — Milestone 2: Internship Knowledge Base & RAG Matching Agent

This milestone extends the existing candidate resume intelligence system (Milestone 1) with a RAG-powered internship dataset, section-based vector search engine, and transparent multi-factor job-resume matching agent.

---

## 📁 Milestone 2 Folder & Module Layout

All modules are integrated inside the existing workspace structure:

```
backend/
├── app/
│   ├── data/
│   │   └── internships/
│   │       ├── postings.json           # 178 cleaned synthetic internship postings
│   │       ├── postings.csv            # Cleaned CSV dataset export
│   │       └── vector_index.json       # RAG vocabulary & vector metadata
│   ├── services/
│   │   ├── internship_dataset.py       # Dataset generation & cleaning pipeline
│   │   ├── rag_engine.py               # Section chunker, subword embedding generator & k-NN retriever
│   │   └── matching_agent.py           # Multi-factor score calculator & reasoning engine
│   ├── routers/
│   │   └── matching.py                 # FastAPI REST router for search & job-resume matching
│   ├── models/
│   │   └── candidate.py                # Candidate profile schemas (Milestone 1)
│   └── main.py                         # FastAPI server with matching router registered
├── test_rag_search.py                  # Phase 2 semantic search sanity check test
├── test_matching_agent.py              # Phase 3 matching agent test
└── test_evaluation_matrix.py          # Phase 4 5-profile evaluation matrix test
```

---

## 🚀 How to Run & Verify Milestone 2

Ensure your virtual environment is active (`backend/venv`):

```bash
cd backend
.\venv\Scripts\python.exe -m pip install scikit-learn numpy
```

### 1. Regenerate Internship Dataset & Vector Index (Phase 1 & Phase 2)
To generate the 178 clean synthetic internship postings across 10 domains and rebuild the RAG section chunk index:

```bash
cd backend
.\venv\Scripts\python.exe -m app.services.internship_dataset
.\venv\Scripts\python.exe -m app.services.rag_engine
```

### 2. Run Semantic Search Query Sanity Check (Phase 2)
To test natural language semantic search queries against section chunks:

```bash
cd backend
.\venv\Scripts\python.exe test_rag_search.py
```

### 3. Run Job-Resume Matching Agent End-to-End (Phase 3)
To evaluate the RAG matching agent on a student profile and view transparent compatibility scores and reasoning:

```bash
cd backend
.\venv\Scripts\python.exe test_matching_agent.py
```

### 4. Run 5-Profile Benchmark Evaluation Matrix (Phase 4)
To run the automated evaluation matrix across 5 distinct student domains (Frontend Dev, Data Analyst, Marketing, Finance, Generalist):

```bash
cd backend
.\venv\Scripts\python.exe test_evaluation_matrix.py
```

### 5. Start Backend API & Interactive UI
Start the FastAPI backend server:

```bash
cd backend
.\venv\Scripts\uvicorn app.main:app --reload --port 8000
```

FastAPI interactive OpenAPI docs will be available at: `http://localhost:8000/docs`.

Start the React Frontend:

```bash
cd frontend
npm run dev
```

Navigate to **Internship Matches** in the dashboard navigation sidebar to explore live RAG matches and semantic search!
