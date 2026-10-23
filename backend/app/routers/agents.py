from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.models.candidate import CandidateProfile
from app.services.skill_gap_agent import skill_gap_agent
from app.services.application_customization_agent import application_customization_agent
from app.services.interview_prep_agent import interview_prep_agent
from app.services.career_assistant_agent import career_assistant_agent

router = APIRouter(prefix="/api/v1/agents", tags=["Milestone 3 Specialized Agents"])

class SkillGapRequest(BaseModel):
    user_id: Optional[str] = "user_student_1"
    job_id: str
    custom_profile: Optional[CandidateProfile] = None

class ResumeCustomizeRequest(BaseModel):
    user_id: Optional[str] = "user_student_1"
    job_id: str
    custom_profile: Optional[CandidateProfile] = None

class CoverLetterRequest(BaseModel):
    user_id: Optional[str] = "user_student_1"
    job_id: str
    custom_profile: Optional[CandidateProfile] = None

class InterviewPrepRequest(BaseModel):
    user_id: Optional[str] = "user_student_1"
    job_id: str
    custom_profile: Optional[CandidateProfile] = None

class MockEvaluationRequest(BaseModel):
    question_id: str
    question_text: str
    user_answer: str
    job_title: Optional[str] = "Software Intern"

class AssistantChatRequest(BaseModel):
    user_id: Optional[str] = "user_student_1"
    message: str
    active_job_id: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = None
    custom_profile: Optional[CandidateProfile] = None

class CompareInternshipsRequest(BaseModel):
    user_id: Optional[str] = "user_student_1"
    job_ids: List[str]
    custom_profile: Optional[CandidateProfile] = None


def _resolve_profile(user_id: str, custom_profile: Optional[CandidateProfile] = None) -> CandidateProfile:
    from app.main import db_profiles
    if custom_profile:
        return custom_profile
    if user_id in db_profiles:
        return db_profiles[user_id]
    return db_profiles.get("user_student_1")


@router.post("/skill-gap")
def get_skill_gap_analysis(req: SkillGapRequest):
    """M3.1 Endpoint: Analyze skill and qualification gaps for candidate against selected internship."""
    profile = _resolve_profile(req.user_id, req.custom_profile)
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found.")
    
    analysis = skill_gap_agent.analyze_gap(profile=profile, job_id=req.job_id)
    return analysis


@router.post("/resume-customize")
def customize_resume(req: ResumeCustomizeRequest):
    """M3.2 Endpoint: Generate tailored resume recommendations & keyword mapping for selected internship."""
    profile = _resolve_profile(req.user_id, req.custom_profile)
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found.")
    
    customization = application_customization_agent.customize_resume(profile=profile, job_id=req.job_id)
    return customization


@router.post("/cover-letter")
def generate_cover_letter(req: CoverLetterRequest):
    """M3.2 Endpoint: Generate role-specific cover letter connecting candidate profile to internship."""
    profile = _resolve_profile(req.user_id, req.custom_profile)
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found.")
    
    cover_letter = application_customization_agent.generate_cover_letter(profile=profile, job_id=req.job_id)
    return cover_letter


@router.post("/interview-prep")
def get_interview_prep(req: InterviewPrepRequest):
    """M3.3 Endpoint: Generate role-specific interview questions (5 categories) and revision plan."""
    profile = _resolve_profile(req.user_id, req.custom_profile)
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found.")
    
    prep = interview_prep_agent.generate_interview_prep(profile=profile, job_id=req.job_id)
    return prep


@router.post("/mock-interview/evaluate")
def evaluate_mock_answer(req: MockEvaluationRequest):
    """M3.3 Endpoint: Evaluate student's written response to mock interview question."""
    if not req.user_answer.strip():
        raise HTTPException(status_code=400, detail="User answer cannot be empty.")
    
    result = interview_prep_agent.evaluate_mock_answer(
        question_id=req.question_id,
        question_text=req.question_text,
        user_answer=req.user_answer,
        job_title=req.job_title
    )
    return result


@router.post("/career-assistant")
def chat_with_career_assistant(req: AssistantChatRequest):
    """M3.4 Endpoint: Conversational Career Assistant with context awareness and agent routing."""
    profile = _resolve_profile(req.user_id, req.custom_profile)
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found.")
    
    response = career_assistant_agent.process_query(
        message=req.message,
        profile=profile,
        history=req.history,
        active_job_id=req.active_job_id
    )
    return response


@router.post("/compare-internships")
def compare_internships(req: CompareInternshipsRequest):
    """M3.4 Endpoint: Compare 2-3 internship opportunities side-by-side."""
    from app.services.matching_agent import matching_agent
    from app.services.rag_engine import rag_engine

    profile = _resolve_profile(req.user_id, req.custom_profile)
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found.")
    
    compared = []
    matches = matching_agent.match_candidate(profile=profile, top_k=20)
    match_dict = {m["job_id"]: m for m in matches}

    for jid in req.job_ids:
        job = next((j for j in rag_engine.postings if j["job_id"] == jid), None)
        if job:
            m_info = match_dict.get(jid, {})
            score = m_info.get("compatibility_score", 70.0)
            verdict = m_info.get("reasoning", {}).get("verdict", "Moderate Match")
            compared.append({
                "job_id": job["job_id"],
                "job_title": job["job_title"],
                "company": job["company"],
                "domain": job["domain"],
                "location": job["location"],
                "work_mode": job["work_mode"],
                "compatibility_score": score,
                "verdict": verdict,
                "required_skills": job["required_skills"],
                "preferred_skills": job["preferred_skills"]
            })

    return {
        "candidate_name": profile.fullName,
        "count": len(compared),
        "comparisons": compared
    }
