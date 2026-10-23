import sys
import os
from typing import List, Dict, Any, Optional

from app.models.candidate import CandidateProfile
from app.services.rag_engine import rag_engine

class JobMatchingAgent:
    def __init__(self):
        pass

    def _extract_candidate_skill_names(self, profile: CandidateProfile) -> set:
        """Extract all candidate skill names (normalized lowercase)."""
        skills = set()
        
        # Explicit skills list
        for s in profile.skills:
            skills.add(s.name.strip().lower())
            
        # Categorized skills
        for cat in profile.categorizedSkills:
            for item in cat.items:
                skills.add(item.strip().lower())
                
        # Extracted resume skills if available
        if profile.extractedResumeData:
            for cat in profile.extractedResumeData.skills:
                for item in cat.items:
                    skills.add(item.strip().lower())
                    
        # Technologies from projects & experience
        for proj in profile.projects:
            for tech in proj.technologies:
                skills.add(tech.strip().lower())
                
        for exp in profile.experience:
            for tech in exp.technologies:
                skills.add(tech.strip().lower())
                
        return skills

    def _build_candidate_semantic_text(self, profile: CandidateProfile) -> str:
        """Combine profile fields into a comprehensive natural language text for semantic RAG search."""
        parts = []
        parts.append(f"Student Name: {profile.fullName}")
        
        # Education
        if profile.education:
            edu_str = ", ".join([f"{e.degree} in {e.field} at {e.institution}" for e in profile.education])
            parts.append(f"Education: {edu_str}")

        # Skills
        all_skills = sorted(list(self._extract_candidate_skill_names(profile)))
        parts.append(f"Technical Skills: {', '.join(all_skills)}")

        # Experience
        if profile.experience:
            exp_str = " ".join([f"Role: {e.role} at {e.company}. Description: {e.description}. Tech: {', '.join(e.technologies)}" for e in profile.experience])
            parts.append(f"Work Experience: {exp_str}")

        # Projects
        if profile.projects:
            proj_str = " ".join([f"Project: {p.name}. Description: {p.description}. Tech: {', '.join(p.technologies)}" for p in profile.projects])
            parts.append(f"Projects: {proj_str}")

        # Preferences
        if profile.careerPreferences:
            pref = profile.careerPreferences
            parts.append(f"Preferred Roles: {', '.join(pref.preferredRoles)}. Domains: {', '.join(pref.preferredDomains)}")

        return " ".join(parts)

    def match_candidate(self, profile: CandidateProfile, top_k: int = 10) -> List[Dict[str, Any]]:
        """Run transparent RAG + multi-factor scoring matching agent for candidate profile."""
        candidate_skills = self._extract_candidate_skill_names(profile)
        candidate_text = self._build_candidate_semantic_text(profile)

        # Step 1: Semantic Retrieval via Phase 2 RAG Pipeline
        rag_results = rag_engine.search(query=candidate_text, top_k=50)

        matches = []
        
        for item in rag_results:
            job_id = item["job_id"]
            job = next((j for j in rag_engine.postings if j["job_id"] == job_id), None)
            if not job:
                continue

            # Factor 1: Skill Overlap Score (40 Points Max)
            req_skills = [s.strip() for s in job.get("required_skills", [])]
            pref_skills = [s.strip() for s in job.get("preferred_skills", [])]
            
            matched_req = [s for s in req_skills if s.lower() in candidate_skills or any(s.lower() in cs for cs in candidate_skills)]
            missing_req = [s for s in req_skills if s not in matched_req]
            
            matched_pref = [s for s in pref_skills if s.lower() in candidate_skills or any(s.lower() in cs for cs in candidate_skills)]

            req_ratio = len(matched_req) / max(1, len(req_skills))
            pref_ratio = len(matched_pref) / max(1, len(pref_skills)) if pref_skills else 0.5
            
            skill_score = round((req_ratio * 30.0) + (pref_ratio * 10.0), 2)

            # Factor 2: Semantic Similarity Score (30 Points Max)
            sim_score = item["similarity_score"]  # 0 to 1 float
            semantic_score = round(min(30.0, sim_score * 30.0 * 1.8), 2)  # Normalized scaling

            # Factor 3: Education & Experience Alignment (20 Points Max)
            edu_score = 10.0
            if profile.education:
                cand_field = profile.education[0].field.lower()
                job_domain = job["domain"].lower()
                if ("computer" in cand_field or "tech" in cand_field or "software" in cand_field) and ("software" in job_domain or "data" in job_domain or "devops" in job_domain):
                    edu_score = 10.0
                elif ("finance" in cand_field or "business" in cand_field or "econ" in cand_field) and ("finance" in job_domain or "business" in job_domain):
                    edu_score = 10.0
                elif ("design" in cand_field) and ("design" in job_domain or "ui" in job_domain):
                    edu_score = 10.0
                elif ("marketing" in cand_field or "media" in cand_field) and ("marketing" in job_domain):
                    edu_score = 10.0
                else:
                    edu_score = 6.0  # Partial background transferability
                    
            exp_score = 10.0 if (profile.experience or profile.projects) else 5.0
            edu_exp_score = edu_score + exp_score

            # Factor 4: Career Preferences Alignment (10 Points Max)
            pref_score = 0.0
            if profile.careerPreferences:
                pref_roles = [r.lower() for r in profile.careerPreferences.preferredRoles]
                pref_domains = [d.lower() for d in profile.careerPreferences.preferredDomains]
                
                if any(job["job_title"].lower() in pr or pr in job["job_title"].lower() for pr in pref_roles):
                    pref_score += 5.0
                if any(job["domain"].lower() in pd or pd in job["domain"].lower() for pd in pref_domains):
                    pref_score += 5.0
            else:
                pref_score = 5.0

            # Total Compatibility Score (0 to 100%)
            total_score = min(100.0, round(skill_score + semantic_score + edu_exp_score + pref_score, 1))

            # Verdict & Explanation Generation
            if total_score >= 80.0:
                verdict = "Excellent Match"
            elif total_score >= 65.0:
                verdict = "Strong Match"
            elif total_score >= 50.0:
                verdict = "Moderate Match"
            else:
                verdict = "Weak Match"

            reasoning = {
                "verdict": verdict,
                "score_breakdown": {
                    "skill_score": f"{skill_score}/40",
                    "semantic_score": f"{semantic_score}/30",
                    "edu_exp_score": f"{edu_exp_score}/20",
                    "preference_score": f"{pref_score}/10"
                },
                "matched_required_skills": matched_req,
                "missing_required_skills": missing_req,
                "matched_preferred_skills": matched_pref,
                "summary_explanation": (
                    f"{profile.fullName} matches {len(matched_req)}/{len(req_skills)} required skills ({', '.join(matched_req) if matched_req else 'None'}). "
                    f"Degree in {profile.education[0].field if profile.education else 'general studies'} aligns with {job['domain']}. "
                    f"{'Missing key skills: ' + ', '.join(missing_req) + '.' if missing_req else 'All required core skills satisfied.'}"
                )
            }

            matches.append({
                "job_id": job["job_id"],
                "job_title": job["job_title"],
                "company": job["company"],
                "location": job["location"],
                "work_mode": job["work_mode"],
                "domain": job["domain"],
                "compatibility_score": total_score,
                "reasoning": reasoning,
                "required_skills": req_skills,
                "preferred_skills": pref_skills,
                "job_description": job["job_description"]
            })

        # Rank highest-to-lowest compatibility score
        ranked_matches = sorted(matches, key=lambda x: x["compatibility_score"], reverse=True)
        return ranked_matches[:top_k]

# Singleton instance
matching_agent = JobMatchingAgent()
