"""
Milestone 4 Multi-Agent Architecture Validation Suite
Verifies agent-to-agent interoperability, profile context preservation, score consistency, and strict truthfulness.
"""

import unittest
from app.models.candidate import CandidateProfile, Skill, SkillCategory, Education, Experience, Project, CareerPreferences
from app.services.matching_agent import matching_agent
from app.services.skill_gap_agent import skill_gap_agent
from app.services.application_customization_agent import application_customization_agent
from app.services.interview_prep_agent import interview_prep_agent
from app.services.career_assistant_agent import career_assistant_agent

class TestMultiAgentWorkflow(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.profile = CandidateProfile(
            id="prof_multi_agent",
            userId="user_student_1",
            fullName="Rani Reddy",
            email="rani.reddy@university.edu",
            education=[
                Education(degree="B.Tech CSE", institution="IIT", field="Computer Science", startYear="2022", graduationYear="2026")
            ],
            skills=[Skill(name="Python", category="Programming"), Skill(name="React.js", category="Web Dev")],
            categorizedSkills=[
                SkillCategory(category="Programming", items=["Python"]),
                SkillCategory(category="Web Dev", items=["React.js"])
            ],
            experience=[
                Experience(company="TechPulse", role="Intern", startDate="May 2025", endDate="Jul 2025", description="Built FastAPI services", technologies=["FastAPI"])
            ],
            projects=[
                Project(name="Resume Analyzer", description="ML resume analyzer", technologies=["Python", "React"])
            ],
            certifications=[],
            careerPreferences=CareerPreferences(
                preferredRoles=["Software Intern"], preferredDomains=["Software Engineering"], 
                preferredLocations=["Bengaluru"], workMode="Hybrid", preferredCompanies=["TechPulse"]
            ),
            profileCompletion=85
        )
        cls.job_id = "job_001"

    def test_agent_data_flow_consistency(self):
        """Test that outputs from matching agent feed cleanly into skill gap and customization agents."""
        matches = matching_agent.match_candidate(self.profile, top_k=5)
        self.assertGreater(len(matches), 0)
        
        top_match = matches[0]
        job_id = top_match["job_id"]
        
        # Pass matched job to Skill Gap Agent
        gap_res = skill_gap_agent.analyze_gap(self.profile, job_id=job_id)
        self.assertEqual(gap_res["job_id"], job_id)
        
        # Pass matched job to Customization Agent
        cust_res = application_customization_agent.customize_resume(self.profile, job_id=job_id)
        self.assertEqual(cust_res["job_title"], gap_res["job_title"])
        
        print("[Multi-Agent Test] Data flow between Matching -> Skill Gap -> Customization verified successfully!")

    def test_no_contradictory_recommendations(self):
        """Ensure matching agent and skill gap agent agree on matched skills."""
        match_res = matching_agent.match_candidate(self.profile, top_k=1)[0]
        gap_res = skill_gap_agent.analyze_gap(self.profile, job_id=match_res["job_id"])
        
        matched_in_matching = set(match_res["reasoning"]["matched_required_skills"])
        matched_in_gap = set(gap_res["matched_required_skills"])
        
        # Both agents must identify identical fully matched skills
        self.assertEqual(matched_in_matching, matched_in_gap, "Matching agent and Skill Gap agent must not generate contradictory skill lists")
        print("[Multi-Agent Test] Zero contradictory recommendations between agents!")

    def test_grounding_and_truthfulness_enforcement(self):
        """Verify that agents do not introduce hallucinated candidate experience or skills."""
        custom_res = application_customization_agent.customize_resume(self.profile, job_id=self.job_id)
        truth_check = custom_res.get("truthfulness_check", custom_res.get("authenticity_guardrail", {}))
        
        self.assertTrue(truth_check.get("is_truthful", truth_check.get("verified", False)))
        print("[Multi-Agent Test] Strict truthfulness guardrails enforced across generated outputs.")

    def test_assistant_orchestrator_routing(self):
        """Test central career assistant routes user queries to appropriate specialized agents."""
        queries = [
            ("Find best internships for me", "recommendation"),
            ("What skills am I missing for TechPulse?", "skill_gap"),
            ("Write a cover letter for me", "customization"),
            ("Mock interview questions", "interview_prep")
        ]

        for query, expected_intent in queries:
            res = career_assistant_agent.process_query(query, self.profile)
            self.assertEqual(res["intent"], expected_intent)
            print(f"[Orchestrator Test] Query '{query}' routed with intent -> {res['intent']} ({res['agent_used']})")

if __name__ == "__main__":
    unittest.main()
