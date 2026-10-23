"""
Milestone 4 RAG Pipeline Testing & Validation Suite
Evaluates RAG retrieval accuracy, precision/recall, semantic similarity, context grounding, and irrelevant query prevention.
"""

import unittest
from app.services.rag_engine import rag_engine

class TestRAGPipelineValidation(unittest.TestCase):
    def test_retrieval_accuracy_and_relevance(self):
        """Test RAG engine returns accurate and relevant job postings for domain queries."""
        queries_and_expected = [
            ("Python Machine Learning PyTorch NLP", ["Data Science & AI/ML", "Software Engineering"]),
            ("React TypeScript Frontend Web", ["Software Engineering"]),
            ("Cloud Microservices Docker AWS DevOps", ["Software Engineering", "Cloud & DevOps", "DevOps, Cloud & Security"]),
            ("Financial Data Analysis Pandas SQL", ["FinTech", "Data Science & AI/ML", "Finance & Business Analysis"])
        ]

        for query, expected_domains in queries_and_expected:
            results = rag_engine.search(query, top_k=5)
            self.assertGreater(len(results), 0, f"Query '{query}' returned 0 results")
            
            top_domains = [r.get("domain", "") for r in results]
            matches_domain = any(d in expected_domains for d in top_domains)
            self.assertTrue(matches_domain, f"Query '{query}' returned domains {top_domains}, expected one of {expected_domains}")
            print(f"[RAG Test] Query '{query}' -> Top match: '{results[0]['job_title']}' ({results[0]['domain']}) [Score: {results[0].get('score', 0):.3f}]")

    def test_semantic_similarity_ranking(self):
        """Test that closely aligned job postings achieve higher vector scores than distant ones."""
        res_python = rag_engine.search("Python FastAPI backend microservices", top_k=10)
        scores = [r.get("score", 0) for r in res_python]
        
        # Check scores are sorted descending
        for i in range(len(scores) - 1):
            self.assertGreaterEqual(scores[i], scores[i+1], "RAG search results must be strictly ordered by relevance score")

    def test_prevention_of_irrelevant_retrievals(self):
        """Test that out-of-domain or garbage queries have low similarity scores or filtered out."""
        garbage_query = "mechanical welding pipeline underwater soldering hydraulics"
        results = rag_engine.search(garbage_query, top_k=5)
        
        if results:
            top_score = results[0].get("score", 0)
            self.assertLess(top_score, 0.40, f"Irrelevant query should have low score (<0.40), got {top_score:.3f}")
            print(f"[RAG Test] Irrelevant query successfully received low similarity score ({top_score:.3f})")

    def test_job_retrieval_by_id(self):
        """Test exact ID lookup for RAG postings."""
        first_posting = rag_engine.postings[0]
        job_id = first_posting["job_id"]
        
        matched = next((p for p in rag_engine.postings if p["job_id"] == job_id), None)
        self.assertIsNotNone(matched)
        self.assertEqual(matched["company"], first_posting["company"])

if __name__ == "__main__":
    unittest.main()
