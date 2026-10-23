from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.models.candidate import CandidateProfile
from app.services.rag_engine import rag_engine
from app.services.matching_agent import matching_agent

router = APIRouter(prefix="/api/v1/matching", tags=["Internship Matching Agent"])

class SearchQueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5
    domain_filter: Optional[str] = None

@router.get("/postings")
def get_all_postings(domain: Optional[str] = None, work_mode: Optional[str] = None):
    """Retrieve all available internship postings with optional filtering."""
    postings = rag_engine.postings
    if domain:
        postings = [p for p in postings if domain.lower() in p.get("domain", "").lower()]
    if work_mode:
        postings = [p for p in postings if work_mode.lower() in p.get("work_mode", "").lower()]
    return {
        "count": len(postings),
        "postings": postings
    }

@router.post("/search")
def search_internships(req: SearchQueryRequest):
    """Phase 2 Semantic Search Endpoint: Retrieve top-k relevant job postings for a query."""
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty.")
    
    results = rag_engine.search(query=req.query, top_k=req.top_k, domain_filter=req.domain_filter)
    return {
        "query": req.query,
        "total_results": len(results),
        "results": results
    }

@router.post("/match-profile/{user_id}")
def match_profile_by_id(user_id: str, top_k: Optional[int] = 10):
    """Phase 3 Matching Endpoint: Match candidate profile stored in system against vector knowledge base."""
    from app.main import db_profiles
    
    profile = db_profiles.get(user_id)
    if not profile:
        profile = db_profiles.get("user_student_1")  # Fallback to default demo student
        
    if not profile:
        raise HTTPException(status_code=404, detail=f"Candidate profile for ID {user_id} not found.")

    matches = matching_agent.match_candidate(profile=profile, top_k=top_k)
    return {
        "user_id": user_id,
        "candidate_name": profile.fullName,
        "total_matches": len(matches),
        "matches": matches
    }

@router.post("/match-custom-profile")
def match_custom_profile(profile: CandidateProfile, top_k: Optional[int] = 10):
    """Phase 3 Matching Endpoint: Match custom provided candidate profile payload."""
    matches = matching_agent.match_candidate(profile=profile, top_k=top_k)
    return {
        "candidate_name": profile.fullName,
        "total_matches": len(matches),
        "matches": matches
    }
