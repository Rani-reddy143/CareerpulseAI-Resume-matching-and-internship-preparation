import sys
import os
import json

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from app.services.rag_engine import rag_engine

SAMPLE_QUERIES = [
    "remote data analyst internship for a beginner",
    "machine learning pytorch nlp research intern",
    "ui ux designer figma wireframing user research",
    "financial analyst intern financial modeling excel valuation"
]

def run_test_queries():
    print("=========================================================")
    print("   PHASE 2 RAG PIPELINE & SEMANTIC SEARCH SANITY CHECK   ")
    print("=========================================================\n")

    # Ensure index is built
    meta = rag_engine.build_index()
    print(f"[INDEX INFO] Total Postings: {meta['num_jobs']} | Section Chunks: {meta['num_chunks']} | Vocab Size: {meta['vocabulary_size']}\n")

    for i, query in enumerate(SAMPLE_QUERIES, 1):
        print(f"---------------------------------------------------------")
        print(f"QUERY #{i}: \"{query}\"")
        print(f"---------------------------------------------------------")
        
        results = rag_engine.search(query, top_k=3)
        if not results:
            print("  No matching jobs found.\n")
            continue
            
        for rank, res in enumerate(results, 1):
            print(f"  Rank #{rank} [{res['relevance_score']}% Match]")
            print(f"  Title      : {res['job_title']}")
            print(f"  Company    : {res['company']}")
            print(f"  Location   : {res['location']} ({res['work_mode']})")
            print(f"  Domain     : {res['domain']}")
            print(f"  Req Skills : {', '.join(res['required_skills'])}")
            print(f"  Matching Chunks: {[c['section'] for c in res['matching_chunks']]}")
            print(f"  Snippet    : {res['job_description_snippet']}")
            print()
            
if __name__ == "__main__":
    run_test_queries()
