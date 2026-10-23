from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class Education(BaseModel):
    id: Optional[str] = None
    degree: str
    institution: str
    field: str
    cgpa: Optional[str] = None
    startYear: str
    graduationYear: str

class Experience(BaseModel):
    id: Optional[str] = None
    company: str
    role: str
    startDate: str
    endDate: str
    description: str
    technologies: List[str] = Field(default_factory=list)

class Project(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    technologies: List[str] = Field(default_factory=list)
    url: Optional[str] = None
    githubUrl: Optional[str] = None

class Certification(BaseModel):
    id: Optional[str] = None
    name: str
    issuer: str
    date: str
    credentialUrl: Optional[str] = None

class SkillCategory(BaseModel):
    category: str  # e.g., "Programming", "AI/ML", "Web Dev", "Databases", "Cloud", "Tools", "Soft Skills"
    items: List[str] = Field(default_factory=list)

class Skill(BaseModel):
    name: str
    category: str
    level: Optional[str] = "Intermediate"

class CareerPreferences(BaseModel):
    preferredRoles: List[str] = Field(default_factory=list)
    preferredDomains: List[str] = Field(default_factory=list)
    preferredLocations: List[str] = Field(default_factory=list)
    workMode: str = "Hybrid"  # Remote, Hybrid, On-site
    preferredCompanies: List[str] = Field(default_factory=list)
    graduationYear: Optional[str] = "2026"

class ResumeMetadata(BaseModel):
    fileName: Optional[str] = None
    fileType: Optional[str] = None
    fileSize: Optional[int] = None
    uploadDate: Optional[str] = None
    parsingStatus: str = "Pending"  # Pending, Uploaded, Parsing, Analyzing, Completed, Failed
    analysisStatus: str = "Pending"

class ConfidenceScores(BaseModel):
    skills: float = 0.95
    education: float = 0.98
    experience: float = 0.91
    projects: float = 0.94

class ExtractedResumeData(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    summary: Optional[str] = None
    skills: List[SkillCategory] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    experience: List[Experience] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)
    confidenceScores: ConfidenceScores = Field(default_factory=ConfidenceScores)

class CandidateProfile(BaseModel):
    id: str
    userId: str
    fullName: str
    email: str
    phone: Optional[str] = ""
    location: Optional[str] = ""
    linkedin: Optional[str] = ""
    github: Optional[str] = ""
    portfolio: Optional[str] = ""
    education: List[Education] = Field(default_factory=list)
    skills: List[Skill] = Field(default_factory=list)
    categorizedSkills: List[SkillCategory] = Field(default_factory=list)
    experience: List[Experience] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)
    careerPreferences: CareerPreferences = Field(default_factory=CareerPreferences)
    resumeMetadata: Optional[ResumeMetadata] = Field(default_factory=ResumeMetadata)
    extractedResumeData: Optional[ExtractedResumeData] = None
    profileCompletion: int = 0
    createdAt: str = Field(default_factory=lambda: datetime.now().isoformat())
    updatedAt: str = Field(default_factory=lambda: datetime.now().isoformat())
