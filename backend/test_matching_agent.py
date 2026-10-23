import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from app.main import db_profiles, sample_profile
from app.services.matching_agent import matching_agent

def test_matching_agent():
    print("=========================================================")
    print("   PHASE 3 JOB-RESUME MATCHING AGENT EVALUATION TEST     ")
    print("=========================================================\n")

    # Retrieve candidate profile
    profile = sample_profile
    print(f"Candidate Profile: {profile.fullName}")
    print(f"Education        : {profile.education[0].degree} in {profile.education[0].field}")
    print(f"Top Skills       : {', '.join([s.name for s in profile.skills[:7]])}")
    print(f"Preferred Roles  : {', '.join(profile.careerPreferences.preferredRoles)}")
    print(f"Work Mode Pref   : {profile.careerPreferences.workMode}\n")

    print("Running RAG + Multi-Factor Matching Agent...\n")
    matches = matching_agent.match_candidate(profile=profile, top_k=5)

    print(f"---------------------------------------------------------")
    print(f"TOP {len(matches)} RANKED INTERNSHIP MATCHES FOR {profile.fullName.upper()}")
    print(f"---------------------------------------------------------\n")

    for rank, m in enumerate(matches, 1):
        print(f"Rank #{rank} | Match Score: {m['compatibility_score']}% [{m['reasoning']['verdict']}]")
        print(f"Job Title   : {m['job_title']} at {m['company']}")
        print(f"Domain      : {m['domain']} ({m['location']} - {m['work_mode']})")
        print(f"Required    : {', '.join(m['required_skills'])}")
        print(f"Score Matrix: {m['reasoning']['score_breakdown']}")
        print(f"Matched Req : {m['reasoning']['matched_required_skills']}")
        print(f"Missing Req : {m['reasoning']['missing_required_skills']}")
        print(f"Explanation : {m['reasoning']['summary_explanation']}")
        print("---------------------------------------------------------\n")

if __name__ == "__main__":
    test_matching_agent()
