export interface Education {
  id?: string;
  degree: string;
  institution: string;
  field: string;
  cgpa?: string;
  startYear: string;
  graduationYear: string;
}

export interface Experience {
  id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Skill {
  name: string;
  category: string;
  level?: string;
}

export interface CareerPreferences {
  preferredRoles: string[];
  preferredDomains: string[];
  preferredLocations: string[];
  workMode: 'Remote' | 'Hybrid' | 'On-site' | string;
  preferredCompanies: string[];
  graduationYear?: string;
}

export interface ResumeMetadata {
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  uploadDate?: string;
  parsingStatus: 'Pending' | 'Uploaded' | 'Parsing' | 'Analyzing' | 'Completed' | 'Failed';
  analysisStatus: 'Pending' | 'Completed' | 'Failed';
}

export interface ConfidenceScores {
  skills: number;
  education: number;
  experience: number;
  projects: number;
}

export interface ExtractedResumeData {
  fullName?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills: SkillCategory[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  confidenceScores: ConfidenceScores;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  education: Education[];
  skills: Skill[];
  categorizedSkills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  careerPreferences: CareerPreferences;
  resumeMetadata?: ResumeMetadata;
  extractedResumeData?: ExtractedResumeData;
  profileCompletion: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'recruiter' | 'admin';
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export type ApplicationStage =
  | 'Saved'
  | 'Planning to apply'
  | 'Applied'
  | 'Application under review'
  | 'Shortlisted'
  | 'Interview scheduled'
  | 'Interview completed'
  | 'Offer received'
  | 'Rejected'
  | 'Withdrawn';

export interface InterviewDetails {
  date: string;
  time?: string;
  round_type: string;
  status: 'Scheduled' | 'Completed' | 'Passed' | 'Rescheduled' | 'Cancelled' | string;
  interviewer?: string;
  location_or_link?: string;
  notes?: string;
  feedback?: string;
}

export interface FollowUpReminder {
  id: string;
  title: string;
  due_date: string;
  is_completed: boolean;
  reminder_type: 'deadline' | 'interview' | 'followup' | 'task' | string;
}

export interface ApplicationRecord {
  id: string;
  user_id: string;
  job_id?: string;
  company_name: string;
  job_title: string;
  domain?: string;
  location?: string;
  work_mode?: string;
  job_description?: string;
  application_date: string;
  deadline?: string;
  status: ApplicationStage;
  interview_details?: InterviewDetails;
  notes: string[];
  tailored_resume_summary?: string;
  cover_letter_snippet?: string;
  follow_ups: FollowUpReminder[];
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  total_applications: number;
  active_applications: number;
  upcoming_deadlines_count: number;
  interviews_scheduled_count: number;
  offers_received_count: number;
  rejected_applications_count: number;
  stage_breakdown: Record<string, number>;
  upcoming_deadlines: Array<{
    app_id: string;
    company_name: string;
    job_title: string;
    deadline: string;
    status: string;
  }>;
  scheduled_interviews: Array<{
    app_id: string;
    company_name: string;
    job_title: string;
    interview_date: string;
    interview_time?: string;
    round_type: string;
    link?: string;
  }>;
  pending_follow_ups: Array<{
    app_id: string;
    company_name: string;
    reminder_id: string;
    title: string;
    due_date: string;
    type: string;
  }>;
}

