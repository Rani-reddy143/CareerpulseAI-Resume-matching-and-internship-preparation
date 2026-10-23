import os
import json
import numpy as np
from typing import List, Dict, Any, Tuple

# Path configuration
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "internships")
POSTINGS_PATH = os.path.join(DATA_DIR, "postings.json")
INDEX_PATH = os.path.join(DATA_DIR, "vector_index.json")

class RAGEngine:
    def __init__(self, postings_path: str = POSTINGS_PATH):
        self.postings_path = postings_path
        self.postings: List[Dict[str, Any]] = []
        self.chunks: List[Dict[str, Any]] = []
        self.vectorizer = None
        self.tfidf_matrix = None
        self.is_built = False
        self._load_postings()

    def _load_postings(self):
        if os.path.exists(self.postings_path):
            with open(self.postings_path, "r", encoding="utf-8") as f:
                self.postings = json.load(f)
        else:
            self.postings = []

    def chunk_postings(self) -> List[Dict[str, Any]]:
        """Chunk each job posting into 3 meaningful sections:
        1. Overview / Description
        2. Responsibilities
        3. Skills & Qualifications
        """
        chunks = []
        for job in self.postings:
            job_id = job.get("job_id", "")
            title = job.get("job_title", "")
            company = job.get("company", "")
            domain = job.get("domain", "")
            location = job.get("location", "")
            work_mode = job.get("work_mode", "")
            
            # Chunk 1: Overview & Description
            chunk_desc = {
                "chunk_id": f"{job_id}_desc",
                "job_id": job_id,
                "section": "description",
                "title": title,
                "company": company,
                "domain": domain,
                "location": location,
                "work_mode": work_mode,
                "content": f"Title: {title} at {company} ({location}, {work_mode}). Domain: {domain}. Description: {job.get('job_description', '')}"
            }
            
            # Chunk 2: Responsibilities
            resp_str = " ".join(job.get("responsibilities", [])) if isinstance(job.get("responsibilities"), list) else str(job.get("responsibilities", ""))
            chunk_resp = {
                "chunk_id": f"{job_id}_resp",
                "job_id": job_id,
                "section": "responsibilities",
                "title": title,
                "company": company,
                "domain": domain,
                "location": location,
                "work_mode": work_mode,
                "content": f"Title: {title} at {company}. Domain: {domain}. Responsibilities: {resp_str}"
            }
            
            # Chunk 3: Skills & Qualifications
            req_skills = ", ".join(job.get("required_skills", []))
            pref_skills = ", ".join(job.get("preferred_skills", []))
            qual = " ".join(job.get("qualifications", [])) if isinstance(job.get("qualifications"), list) else str(job.get("qualifications", ""))
            exp = job.get("experience_required", "")
            edu = job.get("education_required", "")
            
            chunk_skills = {
                "chunk_id": f"{job_id}_skills",
                "job_id": job_id,
                "section": "skills_qualifications",
                "title": title,
                "company": company,
                "domain": domain,
                "location": location,
                "work_mode": work_mode,
                "content": f"Title: {title}. Required Skills: {req_skills}. Preferred Skills: {pref_skills}. Qualifications: {qual}. Education: {edu}. Experience: {exp}."
            }
            
            chunks.extend([chunk_desc, chunk_resp, chunk_skills])
            
        self.chunks = chunks
        return chunks

    def build_index(self):
        """Build vector embeddings for all section chunks using TF-IDF / Subword Vectorizer."""
        from sklearn.feature_extraction.text import TfidfVectorizer
        
        if not self.chunks:
            self.chunk_postings()
            
        texts = [c["content"] for c in self.chunks]
        
        # Subword n-gram TF-IDF vectorizer to capture technical keywords & phrasing
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            stop_words="english",
            max_features=10000
        )
        self.tfidf_matrix = self.vectorizer.fit_transform(texts)
        self.is_built = True

        # Save index metadata for persistence
        meta = {
            "num_jobs": len(self.postings),
            "num_chunks": len(self.chunks),
            "vocabulary_size": len(self.vectorizer.vocabulary_)
        }
        with open(INDEX_PATH, "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2)
            
        return meta

    def search(self, query: str, top_k: int = 5, domain_filter: str = None) -> List[Dict[str, Any]]:
        """Semantic search: given query, return top_k job postings with relevance scores."""
        from sklearn.metrics.pairwise import cosine_similarity
        
        if not self.is_built or self.vectorizer is None or self.tfidf_matrix is None:
            self.build_index()

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        # Aggregate similarity scores per job_id (using max score across chunks + boost for matching title/domain)
        job_scores: Dict[str, Dict[str, Any]] = {}
        
        for idx, chunk in enumerate(self.chunks):
            job_id = chunk["job_id"]
            sim_score = float(similarities[idx])
            
            # Domain filter if specified
            if domain_filter and domain_filter.lower() not in chunk["domain"].lower():
                continue

            if job_id not in job_scores:
                # Find matching full job posting
                job_obj = next((j for j in self.postings if j["job_id"] == job_id), None)
                job_scores[job_id] = {
                    "job": job_obj,
                    "max_similarity": sim_score,
                    "matching_chunks": [
                        {"section": chunk["section"], "score": round(sim_score, 4)}
                    ]
                }
            else:
                if sim_score > job_scores[job_id]["max_similarity"]:
                    job_scores[job_id]["max_similarity"] = sim_score
                job_scores[job_id]["matching_chunks"].append(
                    {"section": chunk["section"], "score": round(sim_score, 4)}
                )

        # Sort jobs by max_similarity descending
        sorted_results = sorted(job_scores.values(), key=lambda x: x["max_similarity"], reverse=True)

        # Format output
        top_results = []
        for res in sorted_results[:top_k]:
            job = res["job"]
            sim = res["max_similarity"]
            # Convert 0-1 similarity to normalized 0-100 relevance percentage score
            relevance_score = min(100.0, round(sim * 100, 2))
            
            top_results.append({
                "job_id": job["job_id"],
                "job_title": job["job_title"],
                "company": job["company"],
                "location": job["location"],
                "work_mode": job["work_mode"],
                "domain": job["domain"],
                "similarity_score": sim,
                "relevance_score": relevance_score,
                "required_skills": job["required_skills"],
                "matching_chunks": res["matching_chunks"],
                "job_description_snippet": job["job_description"][:160] + "..."
            })

        return top_results

# Singleton instance
rag_engine = RAGEngine()

if __name__ == "__main__":
    print("[INFO] Building RAG index...")
    meta = rag_engine.build_index()
    print(f"[SUCCESS] RAG Index Built: {meta}")
    
    print("\n--- Testing Sample Search Query ---")
    query = "remote data analyst internship for a beginner"
    results = rag_engine.search(query, top_k=3)
    for r in results:
        print(f"Rank Match: {r['job_title']} at {r['company']} ({r['location']}) - Score: {r['relevance_score']}%")
