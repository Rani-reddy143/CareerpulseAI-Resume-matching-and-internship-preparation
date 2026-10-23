from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Stages of internship application lifecycle
APPLICATION_STAGES = [
    "Saved",
    "Planning to apply",
    "Applied",
    "Application under review",
    "Shortlisted",
    "Interview scheduled",
    "Interview completed",
    "Offer received",
    "Rejected",
    "Withdrawn"
]

class InterviewDetails(BaseModel):
    date: str = Field(..., description="Date of interview (YYYY-MM-DD or readable string)")
    time: Optional[str] = "10:00 AM"
    round_type: str = Field("Technical Round", description="e.g., Screening, Technical, System Design, HR")
    status: str = Field("Scheduled", description="Scheduled, Completed, Passed, Rescheduled, Cancelled")
    interviewer: Optional[str] = None
    location_or_link: Optional[str] = "Virtual / Google Meet"
    notes: Optional[str] = None
    feedback: Optional[str] = None

class FollowUpReminder(BaseModel):
    id: str
    title: str
    due_date: str
    is_completed: bool = False
    reminder_type: str = Field("deadline", description="deadline, interview, followup, task")

class ApplicationCreate(BaseModel):
    company_name: str
    job_title: str
    job_id: Optional[str] = None
    domain: Optional[str] = "Software Development"
    location: Optional[str] = "Remote"
    work_mode: Optional[str] = "Hybrid"
    job_description: Optional[str] = None
    application_date: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d"))
    deadline: Optional[str] = None
    status: str = Field("Planning to apply", description="One of APPLICATION_STAGES")
    interview_details: Optional[InterviewDetails] = None
    notes: List[str] = Field(default_factory=list)
    tailored_resume_summary: Optional[str] = None
    cover_letter_snippet: Optional[str] = None
    follow_ups: List[FollowUpReminder] = Field(default_factory=list)

class ApplicationUpdate(BaseModel):
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    domain: Optional[str] = None
    location: Optional[str] = None
    work_mode: Optional[str] = None
    job_description: Optional[str] = None
    application_date: Optional[str] = None
    deadline: Optional[str] = None
    status: Optional[str] = None
    interview_details: Optional[InterviewDetails] = None
    notes: Optional[List[str]] = None
    tailored_resume_summary: Optional[str] = None
    cover_letter_snippet: Optional[str] = None
    follow_ups: Optional[List[FollowUpReminder]] = None

class ApplicationRecord(BaseModel):
    id: str
    user_id: str
    job_id: Optional[str] = None
    company_name: str
    job_title: str
    domain: Optional[str] = "Software Development"
    location: Optional[str] = "Bengaluru, India"
    work_mode: Optional[str] = "Hybrid"
    job_description: Optional[str] = None
    application_date: str
    deadline: Optional[str] = None
    status: str
    interview_details: Optional[InterviewDetails] = None
    notes: List[str] = Field(default_factory=list)
    tailored_resume_summary: Optional[str] = None
    cover_letter_snippet: Optional[str] = None
    follow_ups: List[FollowUpReminder] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class DashboardMetrics(BaseModel):
    total_applications: int
    active_applications: int
    upcoming_deadlines_count: int
    interviews_scheduled_count: int
    offers_received_count: int
    rejected_applications_count: int
    stage_breakdown: Dict[str, int]
    upcoming_deadlines: List[Dict[str, Any]]
    scheduled_interviews: List[Dict[str, Any]]
    pending_follow_ups: List[Dict[str, Any]]
