from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models.application import (
    ApplicationRecord, ApplicationCreate, ApplicationUpdate, DashboardMetrics
)
from app.services.application_tracker import application_tracker_service

router = APIRouter(prefix="/api/v1/applications", tags=["Milestone 4 Application Tracking Module"])

@router.get("/{user_id}", response_model=List[ApplicationRecord])
def list_applications(
    user_id: str,
    q: Optional[str] = Query(None, description="Search query for company or job title"),
    status: Optional[str] = Query(None, description="Filter by stage status"),
    sort_by: str = Query("deadline", description="Sort by: deadline, company, application_date, status")
):
    """M4.1 Endpoint: List tracked internship applications for a student with search and filtering."""
    return application_tracker_service.get_applications(
        user_id=user_id, search_query=q, status_filter=status, sort_by=sort_by
    )

@router.get("/{user_id}/dashboard", response_model=DashboardMetrics)
def get_dashboard_metrics(user_id: str):
    """M4.1 Endpoint: Fetch overview metrics, stage breakdown, and reminders for student dashboard."""
    return application_tracker_service.get_dashboard_metrics(user_id)

@router.post("/{user_id}", response_model=ApplicationRecord)
def create_application(user_id: str, app_data: ApplicationCreate):
    """M4.1 Endpoint: Add a new internship to candidate's application tracker."""
    return application_tracker_service.create_application(user_id, app_data)

@router.get("/{user_id}/{app_id}", response_model=ApplicationRecord)
def get_application(user_id: str, app_id: str):
    """M4.1 Endpoint: Fetch details of an individual application by ID."""
    app = application_tracker_service.get_application_by_id(user_id, app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application record not found.")
    return app

@router.put("/{user_id}/{app_id}", response_model=ApplicationRecord)
def update_application(user_id: str, app_id: str, update_data: ApplicationUpdate):
    """M4.1 Endpoint: Update application stage, interview details, notes, follow-up actions, or deadlines."""
    updated = application_tracker_service.update_application(user_id, app_id, update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Application record not found for update.")
    return updated

@router.delete("/{user_id}/{app_id}")
def delete_application(user_id: str, app_id: str):
    """M4.1 Endpoint: Remove an application record from tracker."""
    success = application_tracker_service.delete_application(user_id, app_id)
    if not success:
        raise HTTPException(status_code=404, detail="Application record not found for deletion.")
    return {"message": "Application removed successfully", "id": app_id}

@router.post("/{user_id}/{app_id}/attach-materials")
def attach_application_materials(
    user_id: str, 
    app_id: str, 
    resume_summary: Optional[str] = None, 
    cover_letter: Optional[str] = None
):
    """M4.1 Endpoint: Store generated cover letter or tailored resume text with tracked application."""
    updated = application_tracker_service.attach_customization(user_id, app_id, resume_summary, cover_letter)
    if not updated:
        raise HTTPException(status_code=404, detail="Application record not found.")
    return {"message": "Customized application materials attached successfully", "application": updated}
