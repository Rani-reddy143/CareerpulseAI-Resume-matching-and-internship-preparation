"""
Milestone 4 End-to-End System Testing & Validation Suite
Tests the complete student workflow across all agents, RAG pipeline, and application tracker:
Student Profile -> Resume Parsing -> Internship Retrieval -> Job Matching -> 
Skill Gap Analysis -> Resume Customization -> Cover Letter -> Interview Prep -> Application Tracking
"""

import unittest
from datetime import datetime

from app.models.candidate import CandidateProfile, Education, Skill, SkillCategory, Experience, Project, CareerPreferences
from app.services.rag_engine import rag_engine
from app.services.matching_agent import matching_agent
from app.services.skill_gap_agent import skill_gap_agent
from app.services.application_customization_agent import application_customization_agent
from app.services.interview_prep_agent import interview_prep_agent
from app.services.career_assistant_agent import career_assistant_agent
from app.services.application_tracker import application_tracker_service
from app.models.application import ApplicationCreate, ApplicationUpdate

class TestMilestone4E2EWorkflow(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.user_id = "user_test_m4_e2e"
        cls.test_profile = CandidateProfile(
            id="prof_m4_e2e",
            userId=cls.user_id,
            fullName="Rani Reddy",
            email="rani.reddy@university.edu",
            phone="+91 98765 43210",
            location="Hyderabad, Telangana, India",
            education=[
                Education(
                    degree="B.Tech Computer Science & Engineering",
                    institution="Indian Institute of Technology",
                    field="Computer Science",
                    cgpa="8.9 / 10",
                    startYear="2022",
                    graduationYear="2026"
                )
            ],
            skills=[
                Skill(name="Python", category="Programming"),
                Skill(name="React.js", category="Web Dev"),
                Skill(name="FastAPI", category="Web Dev"),
                Skill(name="TypeScript", category="Web Dev"),
                Skill(name="Machine Learning", category="AI/ML"),
                Skill(name="PostgreSQL", category="Databases")
            ],
            categorizedSkills=[
                SkillCategory(category="Programming", items=["Python", "Java", "SQL"]),
                SkillCategory(category="Web Dev", items=["React.js", "FastAPI", "TypeScript"]),
                SkillCategory(category="AI/ML", items=["Machine Learning", "PyTorch", "Scikit-Learn"])
            ],
            experience=[
                Experience(
                    company="TechPulse Innovations",
                    role="Software Development Intern",
                    startDate="May 2025",
                    endDate="Jul 2025",
                    description="Developed Python FastAPI REST APIs and React dashboards.",
                    technologies=["FastAPI", "React", "PostgreSQL"]
                )
            ],
            projects=[
                Project(
                    name="AI Career Companion",
                    description="RAG-based internship matching and skill gap analyzer.",
                    technologies=["Python", "FastAPI", "React", "TypeScript"]
                )
            ],
            certifications=[],
            careerPreferences=CareerPreferences(
                preferredRoles=["Software Development Intern", "AI/ML Engineer Intern"],
                preferredDomains=["Software Engineering", "Artificial Intelligence"],
                preferredLocations=["Bengaluru", "Hyderabad", "Remote"],
                workMode="Hybrid",
                preferredCompanies=["TechPulse Innovations", "Infosys", "Google"],
                graduationYear="2026"
            ),
            profileCompletion=90
        )

    def test_step_1_rag_retrieval(self):
        """Step 1: Retrieve relevant job postings from knowledge base."""
        postings = rag_engine.search("Python FastAPI React microservices", top_k=5)
        self.assertGreater(len(postings), 0, "RAG index should return top internship matches")
        first_match = postings[0]
        self.assertIn("job_id", first_match)
        self.assertIn("job_title", first_match)
        print(f"\n[E2E Step 1] RAG retrieved {len(postings)} jobs. Top result: {first_match['job_title']} at {first_match['company']}")

    def test_step_2_job_matching(self):
        """Step 2: Match candidate profile against internship postings with transparent scores."""
        matches = matching_agent.match_candidate(self.test_profile, top_k=5)
        self.assertGreater(len(matches), 0)
        top_match = matches[0]
        self.assertGreaterEqual(top_match["compatibility_score"], 50.0)
        self.assertIn("verdict", top_match["reasoning"])
        print(f"[E2E Step 2] Job Match score: {top_match['compatibility_score']}% ({top_match['reasoning']['verdict']})")
        
        # Save top job_id for downstream steps
        TestMilestone4E2EWorkflow.target_job_id = top_match["job_id"]

    def test_step_3_skill_gap_analysis(self):
        """Step 3: Analyze skill gaps and readiness for target job."""
        job_id = getattr(self, "target_job_id", "job_001")
        gap_res = skill_gap_agent.analyze_gap(self.test_profile, job_id=job_id)
        self.assertIn("readiness_score", gap_res)
        self.assertTrue("gap_classification" in gap_res or "gap_categorization" in gap_res)
        self.assertTrue("recommendations" in gap_res or "learning_recommendations" in gap_res)
        recs = gap_res.get("recommendations", gap_res.get("learning_recommendations", []))
        print(f"[E2E Step 3] Skill Gap Analysis: Readiness {gap_res['readiness_score']}% with {len(recs)} learning recommendations")

    def test_step_4_resume_and_cover_letter_customization(self):
        """Step 4: Generate customized resume bullet points and cover letter."""
        job_id = getattr(self, "target_job_id", "job_001")
        resume_res = application_customization_agent.customize_resume(self.test_profile, job_id=job_id)
        cover_res = application_customization_agent.generate_cover_letter(self.test_profile, job_id=job_id)
        
        self.assertTrue(resume_res["truthfulness_check"]["is_truthful"], "Customized bullet points must strictly adhere to candidate profile truthfulness")
        self.assertGreater(len(cover_res["cover_letter"]), 100)
        print(f"[E2E Step 4] Custom Cover Letter generated ({len(cover_res['cover_letter'])} chars). Truthfulness verified.")

        TestMilestone4E2EWorkflow.custom_resume_summary = resume_res["tailored_summary"]
        TestMilestone4E2EWorkflow.cover_letter_text = cover_res["cover_letter"][:200]

    def test_step_5_interview_prep_and_mock(self):
        """Step 5: Generate interview preparation plan and evaluate mock answer."""
        job_id = getattr(self, "target_job_id", "job_001")
        prep_res = interview_prep_agent.generate_interview_prep(self.test_profile, job_id=job_id)
        self.assertGreater(len(prep_res["questions"]), 0)
        
        # Test mock answer evaluation
        q = prep_res["questions"][0]
        eval_res = interview_prep_agent.evaluate_mock_answer(
            question_id=q["id"],
            question_text=q["question"],
            user_answer="I built FastAPI REST endpoints with PostgreSQL async driver and React frontend components.",
            job_title="Software Development Intern"
        )
        self.assertIn("score", eval_res)
        self.assertGreater(eval_res["score"], 50)
        print(f"[E2E Step 5] Interview Prep generated {len(prep_res['questions'])} questions. Mock Answer Score: {eval_res['score']}/100")

    def test_step_6_application_tracking(self):
        """Step 6: Track internship in Application Tracker, schedule interview, and fetch dashboard metrics."""
        job_id = getattr(self, "target_job_id", "job_001")
        job = next((j for j in rag_engine.postings if j["job_id"] == job_id), rag_engine.postings[0])

        # Create application
        create_req = ApplicationCreate(
            company_name=job["company"],
            job_title=job["job_title"],
            job_id=job_id,
            domain=job["domain"],
            location=job["location"],
            work_mode=job["work_mode"],
            status="Planning to apply",
            job_description=job["job_description"]
        )
        app = application_tracker_service.create_application(self.user_id, create_req)
        self.assertIsNotNone(app.id)

        # Attach customized cover letter
        attached = application_tracker_service.attach_customization(
            self.user_id, app.id, 
            getattr(self, "custom_resume_summary", "Summary"),
            getattr(self, "cover_letter_text", "Dear Hiring Team...")
        )
        self.assertIsNotNone(attached.cover_letter_snippet)

        # Update status to Interview Scheduled
        today_str = datetime.now().strftime("%Y-%m-%d")
        updated = application_tracker_service.update_application(
            self.user_id, app.id, 
            ApplicationUpdate(
                status="Interview scheduled",
                interview_details={
                    "date": today_str,
                    "time": "02:00 PM",
                    "round_type": "Technical Round",
                    "status": "Scheduled"
                }
            )
        )
        self.assertEqual(updated.status, "Interview scheduled")

        # Fetch Metrics
        metrics = application_tracker_service.get_dashboard_metrics(self.user_id)
        self.assertGreaterEqual(metrics.total_applications, 1)
        self.assertGreaterEqual(metrics.interviews_scheduled_count, 1)
        print(f"[E2E Step 6] Application Tracking verified! Active Apps: {metrics.active_applications}, Scheduled Interviews: {metrics.interviews_scheduled_count}")

if __name__ == "__main__":
    unittest.main()
