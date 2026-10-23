import sys
import os
from typing import List, Dict, Any, Optional

from app.models.candidate import CandidateProfile
from app.services.rag_engine import rag_engine

class SkillGapAnalysisAgent:
    """Agent M3.1: Analyzes gaps between a student's profile and target internship requirements."""
    
    def __init__(self):
        pass

    def _extract_all_candidate_skills(self, profile: CandidateProfile) -> set:
        """Extract all candidate skill names (normalized lowercase)."""
        skills = set()
        
        for s in profile.skills:
            skills.add(s.name.strip().lower())
            
        for cat in profile.categorizedSkills:
            for item in cat.items:
                skills.add(item.strip().lower())
                
        if profile.extractedResumeData:
            for cat in profile.extractedResumeData.skills:
                for item in cat.items:
                    skills.add(item.strip().lower())
                    
        for proj in profile.projects:
            for tech in proj.technologies:
                skills.add(tech.strip().lower())
                
        for exp in profile.experience:
            for tech in exp.technologies:
                skills.add(tech.strip().lower())
                
        return skills

    def _extract_soft_skills(self, profile: CandidateProfile) -> set:
        """Extract soft skills explicitly listed or detected."""
        soft_keywords = {
            "communication", "teamwork", "leadership", "problem solving", 
            "agile", "collaboration", "time management", "adaptability", 
            "critical thinking", "creativity", "presentation", "jira"
        }
        all_skills = self._extract_all_candidate_skills(profile)
        return {s for s in all_skills if any(sk in s for sk in soft_keywords)}

    def analyze_gap(self, profile: CandidateProfile, job_id: str) -> Dict[str, Any]:
        """Perform full 5-category skill gap analysis between student profile and target internship."""
        # Retrieve target job posting
        job = next((j for j in rag_engine.postings if j["job_id"] == job_id), None)
        if not job:
            # Fallback to first job if not found
            job = rag_engine.postings[0] if rag_engine.postings else {}

        candidate_skills = self._extract_all_candidate_skills(profile)
        
        req_skills = job.get("required_skills", [])
        pref_skills = job.get("preferred_skills", [])
        qualifications = job.get("qualifications", [])
        responsibilities = job.get("responsibilities", [])
        exp_required = job.get("experience_required", "")
        edu_required = job.get("education_required", "")

        # Category 1: Critical / Missing Skills (Required skills not present in profile)
        critical_missing = []
        partially_demonstrated = []
        matched_required = []

        for req in req_skills:
            req_lower = req.strip().lower()
            if req_lower in candidate_skills:
                matched_required.append(req)
            elif any(req_lower in cs or cs in req_lower for cs in candidate_skills):
                # Partial match (e.g., student knows 'Python' when role asks 'Python Microservices')
                partially_demonstrated.append({
                    "skill": req,
                    "evidence": "Mentioned in core skills or projects, but lacks dedicated project depth/experience.",
                    "status": "Partial"
                })
            else:
                critical_missing.append(req)

        # Category 3: Preferred Skills Gaps
        matched_preferred = []
        preferred_gaps = []

        for pref in pref_skills:
            pref_lower = pref.strip().lower()
            if pref_lower in candidate_skills or any(pref_lower in cs for cs in candidate_skills):
                matched_preferred.append(pref)
            else:
                preferred_gaps.append(pref)

        # Category 4: Experience Gaps
        has_internship = len(profile.experience) > 0
        has_projects = len(profile.projects) > 0
        experience_gaps = []
        
        if not has_internship:
            experience_gaps.append({
                "gap_title": "Prior Internship Experience",
                "detail": f"Role asks for '{exp_required}'. Candidate currently relies primarily on academic projects.",
                "impact": "Medium"
            })
            
        if len(profile.projects) < 2:
            experience_gaps.append({
                "gap_title": "Hands-on Project Portfolio",
                "detail": "Recommended to have at least 2 production-grade projects relevant to domain.",
                "impact": "Medium"
            })

        # Category 5: Qualification & Education Gaps
        edu_gaps = []
        student_field = profile.education[0].field if profile.education else ""
        job_domain = job.get("domain", "")
        
        # Check alignment
        aligned = False
        if ("computer" in student_field.lower() or "tech" in student_field.lower()) and ("software" in job_domain.lower() or "data" in job_domain.lower() or "devops" in job_domain.lower()):
            aligned = True
        elif ("finance" in student_field.lower() or "business" in student_field.lower()) and ("finance" in job_domain.lower() or "business" in job_domain.lower()):
            aligned = True
        elif ("design" in student_field.lower()) and ("design" in job_domain.lower()):
            aligned = True
        elif ("marketing" in student_field.lower()) and ("marketing" in job_domain.lower()):
            aligned = True

        if not aligned and student_field:
            edu_gaps.append({
                "requirement": edu_required,
                "candidate_status": f"{profile.education[0].degree} in {student_field}",
                "note": "Cross-domain application. Emphasize relevant technical certifications and projects to bridge the gap."
            })

        # Calculate Overall Readiness Score (0 - 100%)
        total_req = max(1, len(req_skills))
        req_ratio = len(matched_required) / total_req
        partial_bonus = (len(partially_demonstrated) * 0.5) / total_req
        pref_ratio = (len(matched_preferred) / max(1, len(pref_skills))) if pref_skills else 0.5
        exp_score = 0.9 if has_internship else 0.7

        readiness_score = round(min(100.0, (req_ratio * 50.0 + partial_bonus * 20.0 + pref_ratio * 15.0 + exp_score * 15.0)), 1)

        # Generate Personalized Gap Closing Recommendations
        recommendations = []
        
        for sk in critical_missing[:3]:
            recommendations.append({
                "category": "Critical Skill Upgrade",
                "target_skill": sk,
                "action_step": f"Complete a hands-on project module utilizing {sk} within 2 weeks.",
                "recommended_resource": f"Explore documentation & tutorial projects for {sk}.",
                "expected_impact": "+15% match score boost"
            })

        for p_item in partially_demonstrated[:2]:
            sk = p_item["skill"]
            recommendations.append({
                "category": "Skill Enhancement",
                "target_skill": sk,
                "action_step": f"Add explicit code metrics or quantifiable project bullet points showcasing {sk}.",
                "recommended_resource": "Update project description with production deployment details.",
                "expected_impact": "+8% match score boost"
            })

        if experience_gaps:
            recommendations.append({
                "category": "Experience Building",
                "target_skill": "Practical Portfolio",
                "action_step": "Build a domain-specific open source contribution or full-stack capstone project.",
                "recommended_resource": "GitHub open source student starter projects.",
                "expected_impact": "High resume callback rate"
            })

        # Skill Importance Explanations (Why each requirement matters)
        skill_explanations = {}
        for req in req_skills:
            skill_explanations[req] = (
                f"**{req}** is essential for this {job.get('job_title', 'role')} role at {job.get('company', 'the company')} "
                f"because daily duties involve {responsibilities[0] if responsibilities else 'building scalable production components'}. "
                f"Demonstrating proficiency in {req} reassures recruiters of minimal onboarding time."
            )

        for pref in pref_skills:
            skill_explanations[pref] = (
                f"**{pref}** is a preferred asset for {job.get('job_title', 'this position')}. "
                f"Having {pref} differentiates candidates during final round technical interviews."
            )

        return {
            "job_id": job.get("job_id"),
            "job_title": job.get("job_title"),
            "company": job.get("company"),
            "domain": job.get("domain"),
            "readiness_score": readiness_score,
            "verdict": "High Readiness" if readiness_score >= 80 else ("Moderate Readiness" if readiness_score >= 60 else "Skill Development Needed"),
            "matched_required_skills": matched_required,
            "gap_classification": {
                "critical_missing_skills": critical_missing,
                "partially_demonstrated_skills": partially_demonstrated,
                "preferred_skills_gaps": preferred_gaps,
                "experience_gaps": experience_gaps,
                "qualification_gaps": edu_gaps
            },
            "recommendations": recommendations,
            "skill_importance_explanations": skill_explanations
        }

skill_gap_agent = SkillGapAnalysisAgent()
