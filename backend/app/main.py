from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import uuid
from datetime import datetime

from app.models.candidate import (
    CandidateProfile, Education, Experience, Project, Certification, 
    Skill, SkillCategory, CareerPreferences, ResumeMetadata, ExtractedResumeData, ConfidenceScores
)
from app.routers.matching import router as matching_router
from app.routers.agents import router as agents_router
from app.routers.applications import router as applications_router

app = FastAPI(
    title="AI Career Companion API",
    description="Backend API for AI Career Companion Internship Matching, Application Tracking & Multi-Agent Pipeline",
    version="4.0.0"
)

# Register Milestone 2, Milestone 3 & Milestone 4 Routers
app.include_router(matching_router)
app.include_router(agents_router)
app.include_router(applications_router)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

# In-memory storage for development
db_profiles: Dict[str, CandidateProfile] = {}


# Sample Initial Student Profile
sample_profile = CandidateProfile(
    id="prof_demo123",
    userId="user_student_1",
    fullName="Rani Reddy",
    email="rani.reddy@university.edu",
    phone="+91 98765 43210",
    location="Hyderabad, Telangana, India",
    linkedin="https://linkedin.com/in/ranireddy",
    github="https://github.com/ranireddy143",
    portfolio="https://ranireddy.dev",
    education=[
        Education(
            id="edu_1",
            degree="Bachelor of Technology (B.Tech)",
            institution="Indian Institute of Technology",
            field="Computer Science & Engineering",
            cgpa="8.9 / 10",
            startYear="2022",
            graduationYear="2026"
        )
    ],
    skills=[
        Skill(name="Python", category="Programming"),
        Skill(name="Java", category="Programming"),
        Skill(name="React.js", category="Web Dev"),
        Skill(name="TypeScript", category="Web Dev"),
        Skill(name="FastAPI", category="Web Dev"),
        Skill(name="PostgreSQL", category="Databases"),
        Skill(name="Machine Learning", category="AI/ML"),
        Skill(name="PyTorch", category="AI/ML"),
        Skill(name="Git", category="Tools"),
        Skill(name="Docker", category="Cloud")
    ],
    categorizedSkills=[
        SkillCategory(category="Programming", items=["Python", "Java", "C++", "SQL"]),
        SkillCategory(category="Web Dev", items=["React.js", "TypeScript", "Tailwind CSS", "FastAPI", "Node.js"]),
        SkillCategory(category="AI/ML", items=["Machine Learning", "PyTorch", "Pandas", "Scikit-Learn", "NLP"]),
        SkillCategory(category="Databases & Cloud", items=["PostgreSQL", "MongoDB", "AWS S3", "Docker"]),
        SkillCategory(category="Tools & Soft Skills", items=["Git", "Jira", "Problem Solving", "Team Leadership", "Agile"])
    ],
    experience=[
        Experience(
            id="exp_1",
            company="TechPulse Innovations",
            role="Software Development Intern",
            startDate="May 2025",
            endDate="Jul 2025",
            description="Built microservices using FastAPI and React dashboard. Optimized database queries improving response latency by 35%.",
            technologies=["FastAPI", "React", "PostgreSQL", "Docker"]
        )
    ],
    projects=[
        Project(
            id="proj_1",
            name="AI Resume & Skill Gap Analyzer",
            description="End-to-end fullstack platform extracting candidate skills using NLP models and matching against internship requirements.",
            technologies=["React", "TypeScript", "Python", "FastAPI", "Tailwind CSS"],
            url="https://ai-career-companion.demo",
            githubUrl="https://github.com/ranireddy143/app1"
        ),
        Project(
            id="proj_2",
            name="Smart Campus Placement Portal",
            description="Automated student portal managing drive scheduling, recruiter feedback, and automated resume score assessment.",
            technologies=["React.js", "Node.js", "MongoDB"],
            githubUrl="https://github.com/ranireddy143/campus-portal"
        )
    ],
    certifications=[
        Certification(
            id="cert_1",
            name="AWS Certified Cloud Practitioner",
            issuer="Amazon Web Services",
            date="Dec 2024",
            credentialUrl="https://aws.amazon.com/verification"
        ),
        Certification(
            id="cert_2",
            name="Machine Learning Specialization",
            issuer="DeepLearning.AI / Coursera",
            date="Aug 2024",
            credentialUrl="https://coursera.org/verify/ml"
        )
    ],
    careerPreferences=CareerPreferences(
        preferredRoles=["Software Development Intern", "AI/ML Engineer Intern", "Data Analyst Intern"],
        preferredDomains=["Software Engineering", "Artificial Intelligence", "FinTech", "EdTech"],
        preferredLocations=["Bengaluru", "Hyderabad", "Remote"],
        workMode="Hybrid",
        preferredCompanies=["Google", "Microsoft", "Infosys", "TCS Research", "Adobe"],
        graduationYear="2026"
    ),
    resumeMetadata=ResumeMetadata(
        fileName="Rani_Reddy_Resume_2026.pdf",
        fileType="application/pdf",
        fileSize=2450000,
        uploadDate=datetime.now().strftime("%Y-%m-%d"),
        parsingStatus="Completed",
        analysisStatus="Completed"
    ),
    extractedResumeData=ExtractedResumeData(
        fullName="Rani Reddy",
        email="rani.reddy@university.edu",
        phone="+91 98765 43210",
        summary="Computer Science student with strong foundation in full-stack web development, Python microservices, and Machine Learning applications.",
        skills=[
            SkillCategory(category="Programming", items=["Python", "Java", "C++", "SQL"]),
            SkillCategory(category="Web Dev", items=["React.js", "TypeScript", "Tailwind CSS", "FastAPI"]),
            SkillCategory(category="AI/ML", items=["Machine Learning", "PyTorch", "Pandas", "Scikit-Learn"]),
            SkillCategory(category="Cloud & Tools", items=["Docker", "Git", "PostgreSQL", "AWS S3"])
        ],
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
        experience=[
            Experience(
                company="TechPulse Innovations",
                role="Software Development Intern",
                startDate="May 2025",
                endDate="Jul 2025",
                description="Developed FastAPI REST endpoints and interactive React components.",
                technologies=["FastAPI", "React", "PostgreSQL"]
            )
        ],
        projects=[
            Project(
                name="AI Resume & Skill Gap Analyzer",
                description="Extracted candidate skills using LLM structured parsing.",
                technologies=["React", "Python", "FastAPI"]
            )
        ],
        certifications=[
            Certification(
                name="AWS Certified Cloud Practitioner",
                issuer="Amazon Web Services",
                date="Dec 2024"
            )
        ],
        confidenceScores=ConfidenceScores(skills=0.96, education=0.99, experience=0.94, projects=0.92)
    ),
    profileCompletion=85
)

db_profiles[sample_profile.userId] = sample_profile

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "AI Career Companion API",
        "version": "1.0.0",
        "milestone": "Milestone 1: Foundation & Candidate Understanding"
    }

@app.get("/api/v1/profile/{user_id}", response_model=CandidateProfile)
def get_profile(user_id: str):
    if user_id in db_profiles:
        return db_profiles[user_id]
    return db_profiles["user_student_1"]

@app.put("/api/v1/profile/{user_id}", response_model=CandidateProfile)
def update_profile(user_id: str, profile_data: CandidateProfile):
    profile_data.updatedAt = datetime.now().isoformat()
    # Recalculate profile completion percentage
    completion = 20  # Base
    if profile_data.fullName and profile_data.email and profile_data.phone:
        completion += 15
    if profile_data.education:
        completion += 15
    if profile_data.skills:
        completion += 15
    if profile_data.experience or profile_data.projects:
        completion += 15
    if profile_data.certifications:
        completion += 10
    if profile_data.resumeMetadata and profile_data.resumeMetadata.parsingStatus == "Completed":
        completion += 10
    profile_data.profileCompletion = min(100, completion)
    
    db_profiles[user_id] = profile_data
    return profile_data

class ChatMessageRequest(BaseModel):
    message: str
    userId: Optional[str] = "user_student_1"
    agentTarget: Optional[str] = "career_assistant"

@app.post("/api/v1/chat")
def chat_with_assistant(req: ChatMessageRequest):
    msg_lower = req.message.lower()
    
    if "internship" in msg_lower:
        reply = (
            "Based on your profile with skills in Python, React, and Machine Learning, you are a strong candidate "
            "for **Software Development Intern** and **AI/ML Intern** roles! I recommend looking at opportunities "
            "at TechPulse, Infosys Springboard, and FinTech startups. Would you like me to analyze your skill gaps for AI roles?"
        )
    elif "skill" in msg_lower or "gap" in msg_lower:
        reply = (
            "Your profile is rich in Python and React! To boost your eligibility for Senior AI/ML Internship roles, "
            "adding hands-on experience in **Docker containerization**, **System Design basics**, and **Deep Learning framework (PyTorch/TensorFlow)** "
            "will elevate your score from 85% to 98%."
        )
    elif "interview" in msg_lower or "prep" in msg_lower:
        reply = (
            "I can generate realistic technical & behavioral mock questions tailored to your experience at TechPulse Innovations. "
            "When you're ready, visit the **Interview Prep** tab or let me launch a quick 5-question technical drill right here!"
        )
    elif "resume" in msg_lower:
        reply = (
            "Your resume analysis is complete with 96% AI confidence! Your top skills (Python, Fast API, React, AWS) "
            "were successfully mapped to your candidate profile. You can view full extraction details on the **Resume Analysis** page."
        )
    else:
        reply = (
            f"Hi! I'm your **AI Career Companion**. I noticed your profile completeness is currently 85%. "
            f"How can I assist you with internship discovery, resume optimization, or interview prep today?"
        )

    return {
        "reply": reply,
        "agent": "Career Assistant Orchestrator",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/v1/architecture")
def get_architecture_spec():
    return {
        "system": "AI Career Companion Architecture",
        "agents": [
            {"name": "Resume Agent", "status": "Active (Milestone 1)", "description": "Extracts skills, education, experience, and projects into structured CandidateProfile JSON."},
            {"name": "Job-Resume Matching Agent", "status": "Active (Milestone 2)", "description": "Calculates multi-factor transparent match scores between candidate profile and vector knowledge base."},
            {"name": "Skill Gap Analysis Agent", "status": "Active (Milestone 3)", "description": "Classifies candidate skill/qualification gaps across 5 categories and generates gap-closing learning paths."},
            {"name": "Resume & Cover Letter Customization Agent", "status": "Active (Milestone 3)", "description": "Generates role-specific tailored application materials while enforcing candidate truthfulness guardrails."},
            {"name": "Interview Preparation Agent", "status": "Active (Milestone 3)", "description": "Generates 5 categories of interview questions, pre-interview revision plans, and evaluates mock interview responses."},
            {"name": "Conversational Career Assistant", "status": "Active (Milestone 3)", "description": "Central orchestrator routing natural-language student queries across all specialized agents and RAG index."}
        ],
        "ragPipeline": {
            "source": ["178 Synthetic Internship JDs", "Candidate Profiles", "Interview Question Bank"],
            "embeddings": "Subword TF-IDF & Sublinear Vectorizer Index",
            "vectorDatabase": "Vector Knowledge Base (vector_index.json)",
            "orchestrator": "Multi-Factor Scoring & Semantic RAG Retriever Engine"
        }
    }
