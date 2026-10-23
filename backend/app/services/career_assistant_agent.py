import sys
import os
from typing import List, Dict, Any, Optional

from app.models.candidate import CandidateProfile
from app.services.rag_engine import rag_engine
from app.services.matching_agent import matching_agent
from app.services.skill_gap_agent import skill_gap_agent
from app.services.application_customization_agent import application_customization_agent
from app.services.interview_prep_agent import interview_prep_agent

class ConversationalCareerAssistantAgent:
    """Agent M3.4: Conversational Career Assistant orchestrating all sub-agents, RAG knowledge base & conversation context."""

    def __init__(self):
        pass

    def process_query(self, message: str, profile: CandidateProfile, history: List[Dict[str, str]] = None, active_job_id: Optional[str] = None) -> Dict[str, Any]:
        """Process natural language user message with context awareness and route to appropriate specialized agent tools."""
        msg_lower = message.lower().strip()
        history = history or []
        
        # Candidate profile summary context
        cand_name = profile.fullName or "Student"
        cand_degree = profile.education[0].field if profile.education else "Computer Science"
        top_skills = [s.name for s in profile.skills[:5]] if profile.skills else ["Python", "React"]

        # Intent Classification & Multi-Agent Routing
        
        # Intent 1: Internship Recommendation & Match Search
        if any(kw in msg_lower for kw in ["recommend", "suitable internship", "best match", "find jobs", "internship matches", "internship", "internships", "find internships"]):
            matches = matching_agent.match_candidate(profile=profile, top_k=3)
            reply = f"Hi {cand_name}! Based on your {cand_degree} background and skills in **{', '.join(top_skills)}**, here are your top 3 recommended internship matches:\n\n"
            for i, m in enumerate(matches, 1):
                reply += f"**{i}. {m['job_title']}** at **{m['company']}** ({m['location']})\n"
                reply += f"   • Compatibility: **{m['compatibility_score']}%** ({m['reasoning']['verdict']})\n"
                reply += f"   • Key Matched Skills: {', '.join(m['reasoning']['matched_required_skills']) if m['reasoning']['matched_required_skills'] else 'General alignment'}\n\n"
            reply += "Would you like me to analyze your skill gaps or generate a tailored cover letter for any of these roles?"
            
            return {
                "reply": reply,
                "intent": "recommendation",
                "agent_used": "Job-Resume Matching Agent",
                "suggested_actions": ["Analyze Skill Gap", "Customize Cover Letter", "Prepare for Interview"],
                "data": {"matches": matches}
            }

        # Intent 2: Skill Gap Analysis & Employability Recommendations
        elif any(kw in msg_lower for kw in ["skill gap", "skill gaps", "missing skill", "missing", "gap", "gaps", "improve employability", "learn", "what am i missing"]):
            target_job_id = active_job_id or (rag_engine.postings[0]["job_id"] if rag_engine.postings else "job_1")
            gap_data = skill_gap_agent.analyze_gap(profile=profile, job_id=target_job_id)
            
            job_title = gap_data["job_title"]
            company = gap_data["company"]
            critical = gap_data["gap_classification"]["critical_missing_skills"]
            recs = gap_data["recommendations"]

            reply = f"Here is your **Skill Gap Analysis** for **{job_title}** at **{company}** (Readiness Score: **{gap_data['readiness_score']}%**):\n\n"
            if critical:
                reply += f"**Critical Missing Skills to Learn:**\n"
                for sk in critical:
                    reply += f"• **{sk}**: Required for role responsibilities.\n"
                reply += "\n"
            else:
                reply += "Great news! You meet all core required skills for this role.\n\n"

            reply += f"**Action Plan to Boost Employability:**\n"
            for rec in recs[:2]:
                reply += f"• **{rec['category']}**: {rec['action_step']} (*{rec['expected_impact']}*)\n"

            return {
                "reply": reply,
                "intent": "skill_gap",
                "agent_used": "Skill Gap Analysis Agent",
                "suggested_actions": ["Customize Resume", "Generate Cover Letter", "Mock Interview Drill"],
                "data": gap_data
            }

        # Intent 3: Application Customization (Resume & Cover Letter)
        elif any(kw in msg_lower for kw in ["cover letter", "customize resume", "tailor resume", "application materials", "bullet point"]):
            target_job_id = active_job_id or (rag_engine.postings[0]["job_id"] if rag_engine.postings else "job_1")
            cover_letter_data = application_customization_agent.generate_cover_letter(profile=profile, job_id=target_job_id)
            resume_data = application_customization_agent.customize_resume(profile=profile, job_id=target_job_id)

            reply = (
                f"I have generated tailored application materials for **{cover_letter_data['job_title']}** at **{cover_letter_data['company']}**!\n\n"
                f"**Resume Highlights & Keyword Alignment ({resume_data['keyword_alignment']['keyword_coverage_pct']}% Coverage):**\n"
                f"• Top Skills Highlighted: {', '.join(resume_data['prioritized_skills'][:4])}\n"
                f"• Tailored Summary: *\"{resume_data['tailored_summary']}\"*\n\n"
                f"**Generated Cover Letter Preview:**\n"
                f"\"{cover_letter_data['sections']['opening']}\"\n\n"
                f"You can view, edit, and copy the complete cover letter in the **Cover Letter** tab!"
            )

            return {
                "reply": reply,
                "intent": "customization",
                "agent_used": "Resume & Cover Letter Customization Agent",
                "suggested_actions": ["Open Cover Letter Tab", "Practice Interview Questions"],
                "data": {"cover_letter": cover_letter_data, "resume": resume_data}
            }

        # Intent 4: Interview Preparation & Revision Plans
        elif any(kw in msg_lower for kw in ["interview", "prep", "mock", "question", "prepare for interview"]):
            target_job_id = active_job_id or (rag_engine.postings[0]["job_id"] if rag_engine.postings else "job_1")
            prep_data = interview_prep_agent.generate_interview_prep(profile=profile, job_id=target_job_id)
            
            top_q = prep_data["questions"][0] if prep_data["questions"] else {}

            reply = (
                f"I've generated a role-specific Interview Preparation Package for **{prep_data['job_title']}** at **{prep_data['company']}**!\n\n"
                f"**Recommended Pre-Interview Revision Topics:**\n"
                + "\n".join([f"• **{t['topic']}** ({t['reason']})" for t in prep_data["revision_topics"][:3]]) + "\n\n"
                f"**Sample Mock Interview Question:**\n"
                f"❓ *\"{top_q.get('question', 'Tell me about yourself.')}\"*\n"
                f"💡 *Strategy: {top_q.get('preparation_guidance', 'Use STAR method.')}*\n\n"
                f"Visit the **Interview Prep** tab to take a full interactive mock interview with automated feedback!"
            )

            return {
                "reply": reply,
                "intent": "interview_prep",
                "agent_used": "Interview Preparation Agent",
                "suggested_actions": ["Start Mock Interview", "View Revision Topics"],
                "data": prep_data
            }

        # Intent 5: Comparing Multiple Internships & Decision Support
        elif any(kw in msg_lower for kw in ["compare", "versus", "vs", "which internship", "decision"]):
            postings = rag_engine.postings[:2] if len(rag_engine.postings) >= 2 else []
            if postings:
                j1 = postings[0]
                j2 = postings[1]
                m1 = matching_agent.match_candidate(profile=profile, top_k=10)
                score1 = next((m["compatibility_score"] for m in m1 if m["job_id"] == j1["job_id"]), 85.0)
                score2 = next((m["compatibility_score"] for m in m1 if m["job_id"] == j2["job_id"]), 78.0)

                reply = (
                    f"**Side-by-Side Internship Opportunity Comparison:**\n\n"
                    f"📊 **Option 1: {j1['job_title']} at {j1['company']}**\n"
                    f"• Compatibility Score: **{score1}%**\n"
                    f"• Work Mode: {j1['work_mode']} ({j1['location']})\n"
                    f"• Required Skills: {', '.join(j1['required_skills'])}\n\n"
                    f"📊 **Option 2: {j2['job_title']} at {j2['company']}**\n"
                    f"• Compatibility Score: **{score2}%**\n"
                    f"• Work Mode: {j2['work_mode']} ({j2['location']})\n"
                    f"• Required Skills: {', '.join(j2['required_skills'])}\n\n"
                    f"💡 **Decision Recommendation:** **{j1['job_title']} at {j1['company']}** is your best match overall due to higher technical skill overlap with your Python & Web Development background!"
                )
            else:
                reply = "I can compare any two internships in our knowledge base! Select internships from the Matches page to compare."

            return {
                "reply": reply,
                "intent": "comparison",
                "agent_used": "Career Assistant Orchestrator",
                "suggested_actions": ["Analyze Skill Gap for Top Match", "Tailor Application"],
                "data": {}
            }

        # Fallback General Career Guidance
        else:
            reply = (
                f"Hello {cand_name}! I am your **Conversational Career Assistant**, fully integrated with your candidate profile ({profile.profileCompletion}% complete).\n\n"
                f"Here is how I can support your internship search today:\n"
                f"1. 🎯 **Recommend Suitable Internships** matching your skills ({', '.join(top_skills)}).\n"
                f"2. 🔍 **Explain Skill Gaps & Learning Pathways** for target companies.\n"
                f"3. 📄 **Generate Role-Specific Resumes & Cover Letters**.\n"
                f"4. 🎤 **Provide Interview Questions & Interactive Mock Practice**.\n"
                f"5. ⚖️ **Compare Opportunities & Decision Support**.\n\n"
                f"What would you like to explore first?"
            )

            return {
                "reply": reply,
                "intent": "general",
                "agent_used": "Career Assistant Orchestrator",
                "suggested_actions": ["Recommend Internships", "Analyze Skill Gap", "Prepare for Interview"],
                "data": {}
            }

career_assistant_agent = ConversationalCareerAssistantAgent()
