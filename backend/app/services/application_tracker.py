import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from app.models.application import (
    ApplicationRecord, ApplicationCreate, ApplicationUpdate, 
    DashboardMetrics, InterviewDetails, FollowUpReminder, APPLICATION_STAGES
)

class ApplicationTrackerService:
    def __init__(self):
        # In-memory storage mapping user_id -> List of ApplicationRecords
        self._db: Dict[str, Dict[str, ApplicationRecord]] = {}
        self._seed_default_data()

    def _seed_default_data(self):
        user_id = "user_student_1"
        today = datetime.now()
        
        sample_apps = [
            ApplicationRecord(
                id="app_demo_101",
                user_id=user_id,
                job_id="job_001",
                company_name="TechPulse Innovations",
                job_title="Software Development Intern",
                domain="Software Engineering",
                location="Bengaluru, India",
                work_mode="Hybrid",
                job_description="Developing Python FastAPI microservices and React dashboards for AI workflows.",
                application_date=(today - timedelta(days=12)).strftime("%Y-%m-%d"),
                deadline=(today + timedelta(days=4)).strftime("%Y-%m-%d"),
                status="Interview scheduled",
                interview_details=InterviewDetails(
                    date=(today + timedelta(days=2)).strftime("%Y-%m-%d"),
                    time="11:30 AM",
                    round_type="Technical & System Design Drill",
                    status="Scheduled",
                    interviewer="Senior Engineering Lead",
                    location_or_link="https://meet.google.com/tech-pulse-interview",
                    notes="Review FastAPI async endpoints, PyTorch basic tensors, and SQL index optimization.",
                    feedback=None
                ),
                notes=[
                    "Submitted tailored resume highlighting FastAPI microservices project.",
                    "Recruiter reached out via email requesting 45-min technical interview."
                ],
                tailored_resume_summary="Customized resume featuring AI Resume Analyzer project and 96% skill match score.",
                cover_letter_snippet="Dear Hiring Team at TechPulse Innovations, I am thrilled to submit my application...",
                follow_ups=[
                    FollowUpReminder(
                        id="rem_101",
                        title="Complete System Design revision notes for TechPulse interview",
                        due_date=(today + timedelta(days=1)).strftime("%Y-%m-%d"),
                        is_completed=False,
                        reminder_type="interview"
                    )
                ]
            ),
            ApplicationRecord(
                id="app_demo_102",
                user_id=user_id,
                job_id="job_005",
                company_name="Infosys Springboard",
                job_title="AI/ML Engineer Intern",
                domain="Artificial Intelligence",
                location="Hyderabad, India",
                work_mode="On-site",
                job_description="Work with NLP pipelines, vector databases, RAG architecture, and PyTorch fine-tuning.",
                application_date=(today - timedelta(days=18)).strftime("%Y-%m-%d"),
                deadline=(today + timedelta(days=8)).strftime("%Y-%m-%d"),
                status="Application under review",
                interview_details=None,
                notes=[
                    "Uploaded candidate profile with 8.9 CGPA and AWS Cloud Practitioner certification.",
                    "Application status changed to Under Review by Talent Acquisition team."
                ],
                tailored_resume_summary="Tailored resume emphasizing PyTorch, Scikit-learn, and NLP coursework.",
                cover_letter_snippet="I am writing to express my strong interest in the AI/ML Engineer Internship at Infosys...",
                follow_ups=[
                    FollowUpReminder(
                        id="rem_102",
                        title="Send follow-up email to Infosys University Recruiter",
                        due_date=(today + timedelta(days=5)).strftime("%Y-%m-%d"),
                        is_completed=False,
                        reminder_type="followup"
                    )
                ]
            ),
            ApplicationRecord(
                id="app_demo_103",
                user_id=user_id,
                job_id="job_012",
                company_name="Google Research India",
                job_title="Software Engineering Intern - Cloud & Systems",
                domain="Software Engineering",
                location="Bengaluru, India",
                work_mode="Hybrid",
                job_description="Build high-performance distributed systems, containerized microservices, and web infrastructure.",
                application_date=(today - timedelta(days=5)).strftime("%Y-%m-%d"),
                deadline=(today + timedelta(days=12)).strftime("%Y-%m-%d"),
                status="Planning to apply",
                interview_details=None,
                notes=[
                    "Target deadline is approaching next week. Refining algorithm problem solving on LeetCode."
                ],
                tailored_resume_summary=None,
                cover_letter_snippet=None,
                follow_ups=[
                    FollowUpReminder(
                        id="rem_103",
                        title="Submit official transcript and submit Google application",
                        due_date=(today + timedelta(days=3)).strftime("%Y-%m-%d"),
                        is_completed=False,
                        reminder_type="deadline"
                    )
                ]
            ),
            ApplicationRecord(
                id="app_demo_104",
                user_id=user_id,
                job_id="job_020",
                company_name="FinEdge Analytics",
                job_title="Data Analyst & Python Developer Intern",
                domain="FinTech",
                location="Remote",
                work_mode="Remote",
                job_description="Analyze financial datasets using Pandas, NumPy, and build automated ETL pipelines.",
                application_date=(today - timedelta(days=25)).strftime("%Y-%m-%d"),
                deadline=(today - timedelta(days=5)).strftime("%Y-%m-%d"),
                status="Offer received",
                interview_details=InterviewDetails(
                    date=(today - timedelta(days=7)).strftime("%Y-%m-%d"),
                    time="02:00 PM",
                    round_type="Final Hiring Manager Round",
                    status="Passed",
                    interviewer="VP of Engineering",
                    location_or_link="Zoom",
                    notes="Great discussion about Python pandas performance and SQL window functions.",
                    feedback="Strong candidate with solid problem solving skills. Recommended for offer."
                ),
                notes=[
                    "Received formal offer letter offering stipend of ₹35,000/month with remote flexibility!"
                ],
                tailored_resume_summary="Customized resume focusing on Data Science, SQL, and Pandas.",
                cover_letter_snippet="I am excited to apply for the Data Analyst Intern position at FinEdge Analytics...",
                follow_ups=[]
            )
        ]

        self._db[user_id] = {app.id: app for app in sample_apps}

    def get_applications(
        self, 
        user_id: str, 
        search_query: Optional[str] = None, 
        status_filter: Optional[str] = None,
        sort_by: str = "deadline"
    ) -> List[ApplicationRecord]:
        user_apps = list(self._db.get(user_id, {}).values())
        
        # Filter by search query (company or job title)
        if search_query:
            q = search_query.lower()
            user_apps = [
                app for app in user_apps 
                if q in app.company_name.lower() or q in app.job_title.lower() or (app.domain and q in app.domain.lower())
            ]
            
        # Filter by status
        if status_filter and status_filter.lower() != "all":
            user_apps = [app for app in user_apps if app.status.lower() == status_filter.lower()]
            
        # Sorting
        if sort_by == "deadline":
            user_apps.sort(key=lambda x: x.deadline or "9999-99-99")
        elif sort_by == "company":
            user_apps.sort(key=lambda x: x.company_name.lower())
        elif sort_by == "application_date":
            user_apps.sort(key=lambda x: x.application_date, reverse=True)
        elif sort_by == "status":
            user_apps.sort(key=lambda x: x.status)

        return user_apps

    def get_application_by_id(self, user_id: str, app_id: str) -> Optional[ApplicationRecord]:
        return self._db.get(user_id, {}).get(app_id)

    def create_application(self, user_id: str, app_data: ApplicationCreate) -> ApplicationRecord:
        if user_id not in self._db:
            self._db[user_id] = {}
            
        app_id = f"app_{uuid.uuid4().hex[:8]}"
        now_str = datetime.now().isoformat()
        
        record = ApplicationRecord(
            id=app_id,
            user_id=user_id,
            job_id=app_data.job_id,
            company_name=app_data.company_name,
            job_title=app_data.job_title,
            domain=app_data.domain or "Software Development",
            location=app_data.location or "Remote",
            work_mode=app_data.work_mode or "Hybrid",
            job_description=app_data.job_description,
            application_date=app_data.application_date,
            deadline=app_data.deadline,
            status=app_data.status if app_data.status in APPLICATION_STAGES else "Planning to apply",
            interview_details=app_data.interview_details,
            notes=app_data.notes,
            tailored_resume_summary=app_data.tailored_resume_summary,
            cover_letter_snippet=app_data.cover_letter_snippet,
            follow_ups=app_data.follow_ups,
            created_at=now_str,
            updated_at=now_str
        )
        
        self._db[user_id][app_id] = record
        return record

    def update_application(self, user_id: str, app_id: str, update_data: ApplicationUpdate) -> Optional[ApplicationRecord]:
        user_apps = self._db.get(user_id, {})
        if app_id not in user_apps:
            return None
            
        app = user_apps[app_id]
        data_dict = update_data.model_dump(exclude_unset=True)
        
        for key, val in data_dict.items():
            if val is not None:
                if key == "interview_details" and isinstance(val, dict):
                    val = InterviewDetails(**val)
                setattr(app, key, val)
                
        app.updated_at = datetime.now().isoformat()
        user_apps[app_id] = app
        return app

    def delete_application(self, user_id: str, app_id: str) -> bool:
        if user_id in self._db and app_id in self._db[user_id]:
            del self._db[user_id][app_id]
            return True
        return False

    def attach_customization(
        self, user_id: str, app_id: str, resume_summary: Optional[str], cover_letter: Optional[str]
    ) -> Optional[ApplicationRecord]:
        app = self.get_application_by_id(user_id, app_id)
        if not app:
            return None
        if resume_summary:
            app.tailored_resume_summary = resume_summary
        if cover_letter:
            app.cover_letter_snippet = cover_letter
        app.updated_at = datetime.now().isoformat()
        return app

    def get_dashboard_metrics(self, user_id: str) -> DashboardMetrics:
        user_apps = list(self._db.get(user_id, {}).values())
        today_str = datetime.now().strftime("%Y-%m-%d")

        stage_breakdown = {stage: 0 for stage in APPLICATION_STAGES}
        total = len(user_apps)
        active = 0
        upcoming_deadlines_count = 0
        interviews_scheduled_count = 0
        offers_received_count = 0
        rejected_applications_count = 0

        upcoming_deadlines = []
        scheduled_interviews = []
        pending_follow_ups = []

        active_statuses = {
            "Saved", "Planning to apply", "Applied", 
            "Application under review", "Shortlisted", "Interview scheduled"
        }

        for app in user_apps:
            stage_breakdown[app.status] = stage_breakdown.get(app.status, 0) + 1
            
            if app.status in active_statuses:
                active += 1

            if app.status == "Offer received":
                offers_received_count += 1
            elif app.status == "Rejected":
                rejected_applications_count += 1

            # Deadline tracking
            if app.deadline and app.deadline >= today_str and app.status not in ["Offer received", "Rejected", "Withdrawn"]:
                upcoming_deadlines_count += 1
                upcoming_deadlines.append({
                    "app_id": app.id,
                    "company_name": app.company_name,
                    "job_title": app.job_title,
                    "deadline": app.deadline,
                    "status": app.status
                })

            # Interview tracking
            if app.interview_details and app.interview_details.status == "Scheduled":
                interviews_scheduled_count += 1
                scheduled_interviews.append({
                    "app_id": app.id,
                    "company_name": app.company_name,
                    "job_title": app.job_title,
                    "interview_date": app.interview_details.date,
                    "interview_time": app.interview_details.time,
                    "round_type": app.interview_details.round_type,
                    "link": app.interview_details.location_or_link
                })

            # Pending follow-ups
            for f in app.follow_ups:
                if not f.is_completed:
                    pending_follow_ups.append({
                        "app_id": app.id,
                        "company_name": app.company_name,
                        "reminder_id": f.id,
                        "title": f.title,
                        "due_date": f.due_date,
                        "type": f.reminder_type
                    })

        upcoming_deadlines.sort(key=lambda x: x["deadline"])
        scheduled_interviews.sort(key=lambda x: x["interview_date"])
        pending_follow_ups.sort(key=lambda x: x["due_date"])

        return DashboardMetrics(
            total_applications=total,
            active_applications=active,
            upcoming_deadlines_count=upcoming_deadlines_count,
            interviews_scheduled_count=interviews_scheduled_count,
            offers_received_count=offers_received_count,
            rejected_applications_count=rejected_applications_count,
            stage_breakdown=stage_breakdown,
            upcoming_deadlines=upcoming_deadlines,
            scheduled_interviews=scheduled_interviews,
            pending_follow_ups=pending_follow_ups
        )

# Global Singleton Instance
application_tracker_service = ApplicationTrackerService()
