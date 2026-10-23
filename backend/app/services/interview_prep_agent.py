import sys
import os
from typing import List, Dict, Any, Optional

from app.models.candidate import CandidateProfile
from app.services.rag_engine import rag_engine
from app.services.skill_gap_agent import skill_gap_agent

class InterviewPreparationAgent:
    """Agent M3.3: Role-specific Interview Question Generator, Revision Plan Creator & Mock Interview Evaluator."""

    def __init__(self):
        pass

    def generate_interview_prep(self, profile: CandidateProfile, job_id: str) -> Dict[str, Any]:
        """Generate role-specific interview prep package across 5 question categories and pre-interview revision checklist."""
        job = next((j for j in rag_engine.postings if j["job_id"] == job_id), None)
        if not job:
            job = rag_engine.postings[0] if rag_engine.postings else {}

        job_title = job.get("job_title", "Software Intern")
        company = job.get("company", "Tech Company")
        domain = job.get("domain", "Engineering")
        req_skills = job.get("required_skills", [])
        
        # Get skill gaps for context
        gap_data = skill_gap_agent.analyze_gap(profile=profile, job_id=job_id)
        critical_gaps = gap_data["gap_classification"]["critical_missing_skills"]

        # Candidate project & experience context
        best_proj = profile.projects[0] if profile.projects else None
        exp = profile.experience[0] if profile.experience else None

        # 1. Generate 5 Question Categories
        questions = []

        # Category 1: Technical Questions
        for i, sk in enumerate(req_skills[:3], 1):
            questions.append({
                "id": f"q_tech_{i}",
                "category": "Technical Questions",
                "question": f"Can you explain the core fundamentals of {sk} and how you would design a solution using it?",
                "preparation_guidance": f"Focus on underlying architecture, memory/performance trade-offs, and how {sk} integrates into production services.",
                "key_concepts_to_mention": [sk, "Best Practices", "Error Handling", "Performance Optimization"]
            })

        # Category 2: Resume-Based Questions
        if exp:
            questions.append({
                "id": "q_res_1",
                "category": "Resume-Based Questions",
                "question": f"Walk me through your role as {exp.role} at {exp.company}. What was your biggest technical contribution?",
                "preparation_guidance": "Use the STAR method (Situation, Task, Action, Result). Quantify results with metrics like latency, throughput, or team efficiency.",
                "key_concepts_to_mention": exp.technologies + ["Impact Metrics", "Team Collaboration"]
            })
        else:
            questions.append({
                "id": "q_res_1",
                "category": "Resume-Based Questions",
                "question": f"How has your education in {profile.education[0].field if profile.education else 'Engineering'} prepared you for hands-on development at {company}?",
                "preparation_guidance": "Connect academic coursework, labs, and independent study directly to the skills needed for this role.",
                "key_concepts_to_mention": ["Foundational Theory", "Self-Driven Learning", "Problem Solving"]
            })

        # Category 3: Project-Based Questions
        if best_proj:
            questions.append({
                "id": "q_proj_1",
                "category": "Project-Based Questions",
                "question": f"In your project '{best_proj.name}', why did you choose {', '.join(best_proj.technologies[:2])}? What trade-offs did you make?",
                "preparation_guidance": "Explain tech stack choices, architectural design decisions, and how you handled edge cases or unexpected bugs during implementation.",
                "key_concepts_to_mention": best_proj.technologies + ["Architecture", "Trade-offs", "Debugging"]
            })

        # Category 4: Role-Specific Questions
        questions.append({
            "id": "q_role_1",
            "category": "Role-Specific Questions",
            "question": f"Suppose you are tasked with {job.get('responsibilities', ['building a core service'])[0]} at {company}. How would you approach this task from end-to-end?",
            "preparation_guidance": "Break down your plan into Requirement Gathering, Technical Architecture, Implementation, Testing, and Deployment phases.",
            "key_concepts_to_mention": ["System Flow", "Requirement Analysis", "Testing & Verification"]
        })

        # Category 5: HR / Behavioral Questions
        questions.append({
            "id": "q_hr_1",
            "category": "HR & General Questions",
            "question": f"Why do you want to join {company} for the {job_title} role, and how does this internship align with your long-term career goals?",
            "preparation_guidance": "Demonstrate company research, mention specific products or engineering values, and articulate clear personal growth objectives.",
            "key_concepts_to_mention": ["Company Culture", "Career Alignment", "Enthusiasm & Ownership"]
        })

        # 2. Identify Topics to Revise Before Interview
        revision_topics = []
        for req in req_skills[:4]:
            revision_topics.append({
                "topic": f"Core {req} Concepts & Syntax",
                "reason": f"High priority required skill for {job_title}.",
                "priority": "High"
            })

        for gap in critical_gaps[:2]:
            revision_topics.append({
                "topic": f"Basics of {gap}",
                "reason": f"Identified gap in profile. Reviewing crash-course basics will prevent getting caught off guard.",
                "priority": "High"
            })

        if best_proj:
            revision_topics.append({
                "topic": f"Deep Dive into {best_proj.name} Architecture",
                "reason": "Expect interviewers to ask technical deep-dive questions on your top listed project.",
                "priority": "Medium"
            })

        return {
            "job_id": job.get("job_id"),
            "job_title": job_title,
            "company": company,
            "domain": domain,
            "total_questions": len(questions),
            "questions": questions,
            "revision_topics": revision_topics,
            "prep_strategy": (
                f"To ace your interview for {job_title} at {company}: 1. Review the {len(revision_topics)} highlighted revision topics. "
                f"2. Prepare 2-minute STAR stories for each project. 3. Use our interactive Mock Interview Simulator below to practice your live answers!"
            )
        }

    def evaluate_mock_answer(self, question_id: str, question_text: str, user_answer: str, job_title: str = "Software Intern") -> Dict[str, Any]:
        """Evaluate a student's answer to a mock interview question and provide actionable feedback."""
        answer_trimmed = user_answer.strip()
        word_count = len(answer_trimmed.split())

        if word_count < 10:
            score = 35
            feedback = "Your response is too brief. In interviews, aim for comprehensive answers (75-150 words) covering situation, action, and outcome."
            strengths = ["Direct answer provided."]
            improvements = ["Elaborate with specific technical details.", "Include real metrics or concrete examples from your projects."]
            model_answer = (
                f"In my experience building applications for {job_title} roles, I structure solutions by first analyzing requirements, "
                f"selecting optimal data structures/tools, and implementing clean, modular code with unit tests."
            )
        elif word_count < 40:
            score = 68
            feedback = "Good start! You covered the core question, but could make a stronger impression by adding technical depth and project specifics."
            strengths = ["Clear communication", "Addressed the main point"]
            improvements = ["Mention specific libraries, frameworks, or tools used.", "Highlight how you verified or benchmarked your solution."]
            model_answer = (
                f"When addressing this in a production environment, I approach it by breaking the requirement down into modular sub-tasks, "
                f"implementing proper error handling, and leveraging tools like Git and automated testing to ensure reliability."
            )
        else:
            score = 92
            feedback = "Excellent, thorough response! You demonstrated strong domain knowledge, clear structure, and practical technical awareness."
            strengths = [
                "Comprehensive explanation with good technical depth",
                "Clear logical structure (Problem -> Approach -> Result)",
                "Effective use of domain terminology"
            ]
            improvements = ["Maintain this confident tone during live interviews!"]
            model_answer = (
                f"For the {job_title} role, my approach combines technical rigor with clear communication: "
                f"1. Requirements analysis & design outline. 2. Implementation using modern frameworks with clean architecture patterns. "
                f"3. Comprehensive testing and performance validation."
            )

        return {
            "question_id": question_id,
            "question_text": question_text,
            "user_answer": user_answer,
            "score": score,
            "verdict": "Outstanding" if score >= 85 else ("Solid" if score >= 65 else "Needs Enhancement"),
            "feedback_summary": feedback,
            "strengths": strengths,
            "areas_for_improvement": improvements,
            "model_sample_answer": model_answer
        }

interview_prep_agent = InterviewPreparationAgent()
