# AI Career Companion — Internship Knowledge Base & RAG Pipeline Specification

## 1. Dataset Overview
- **Total Postings**: 178 synthetic and curated Indian internship job postings.
- **Data Format**: `backend/app/data/internships/postings.json` and `postings.csv`.
- **Domain Categories**:
  1. Software Engineering & Full-Stack Development (45 JDs)
  2. Data Science, Machine Learning & AI (40 JDs)
  3. DevOps, Cloud Infrastructure & Cybersecurity (30 JDs)
  4. FinTech & Business Data Analytics (35 JDs)
  5. UI/UX Design & Product Management (28 JDs)

---

## 2. Preprocessing & Structured Field Chunking Strategy
Instead of splitting unstructured text blindly by fixed character counts, each internship job description is chunked according to domain-specific semantic fields:
- **Header Chunk**: Job Title, Company Name, Domain, Location, Work Mode (Remote/Hybrid/On-site).
- **Core Requirements Chunk**: Required Skills list, Experience level, Minimum CGPA/Qualification.
- **Preferred Asset Chunk**: Preferred Skills list, Bonus certifications.
- **Responsibilities Chunk**: Daily duties and project scope.

---

## 3. Embedding & Hybrid Search Architecture

```
User Query / Profile Data
           │
           ▼
 Subword N-Gram Tokenizer & TF-IDF Vectorizer
           │
           ├───────────────────────────────┐
           ▼                               ▼
 Vector Cosine Similarity Search     BM25 Keyword Frequency Matcher
 (Subword Vector Space)              (Exact Required Skill Filter)
           │                               │
           └───────────────┬───────────────┘
                           ▼
               Score Normalization Engine
                           │
                           ▼
          Top-K Relevant Internship Postings
```

- **Vector Index Storage**: `backend/app/data/internships/vector_index.json`.
- **Search Parameters**:
  - `top_k`: Default 5, configurable up to 20.
  - `min_score_threshold`: 0.15 cut-off score to prevent low-relevance retrievals.
  - `retrieval_latency`: < 15 ms per query across 178 documents.
