import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Calendar,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  Video,
  FileText,
  MessageSquare,
  Building2,
  MapPin,
  Kanban,
  ListFilter,
  ChevronRight,
  ExternalLink,
  Trash2,
  FileCheck
} from 'lucide-react';
import type { ApplicationRecord, ApplicationStage, DashboardMetrics } from '../types';
import { useToast } from '../context/ToastContext';

const API_BASE = 'http://localhost:8000/api/v1';

const STAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Saved': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  'Planning to apply': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Applied': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Application under review': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Shortlisted': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Interview scheduled': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  'Interview completed': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  'Offer received': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
  'Rejected': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Withdrawn': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
};

const ALL_STAGES: ApplicationStage[] = [
  'Saved',
  'Planning to apply',
  'Applied',
  'Application under review',
  'Shortlisted',
  'Interview scheduled',
  'Interview completed',
  'Offer received',
  'Rejected',
  'Withdrawn'
];

export const ApplicationTrackerPage: React.FC = () => {
  const { addToast } = useToast();
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    addToast(type, message);
  };
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('deadline');

  // Active Selected Application for Details Modal
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  // New Application Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDomain, setNewDomain] = useState('Software Engineering');
  const [newLocation, setNewLocation] = useState('Bengaluru, India');
  const [newWorkMode, setNewWorkMode] = useState('Hybrid');
  const [newDeadline, setNewDeadline] = useState('');
  const [newStatus, setNewStatus] = useState<ApplicationStage>('Planning to apply');
  const [newDescription, setNewDescription] = useState('');

  // Interview Edit State within Modal
  const [editingInterview, setEditingInterview] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('10:00 AM');
  const [interviewRound, setInterviewRound] = useState('Technical Round');
  const [interviewLink, setInterviewLink] = useState('');

  // Note Input State
  const [newNoteText, setNewNoteText] = useState('');

  const userId = 'user_student_1';

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('q', searchQuery);
      if (selectedStatus !== 'all') queryParams.append('status', selectedStatus);
      queryParams.append('sort_by', sortBy);

      const [appsRes, metricsRes] = await Promise.all([
        fetch(`${API_BASE}/applications/${userId}?${queryParams.toString()}`),
        fetch(`${API_BASE}/applications/${userId}/dashboard`)
      ]);

      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData);
      }
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }
    } catch (err) {
      console.error('Error fetching application tracker data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, selectedStatus, sortBy]);

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) {
      showToast('Please specify Company Name and Role Title', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/applications/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: newCompany,
          job_title: newRole,
          domain: newDomain,
          location: newLocation,
          work_mode: newWorkMode,
          deadline: newDeadline || null,
          status: newStatus,
          job_description: newDescription || null,
          notes: newDescription ? [`Initial JD: ${newDescription.slice(0, 150)}...`] : []
        })
      });

      if (res.ok) {
        const created = await res.json();
        showToast(`Application for ${created.company_name} added to tracker!`, 'success');
        setShowAddModal(false);
        setNewCompany('');
        setNewRole('');
        setNewDeadline('');
        setNewDescription('');
        fetchData();
      }
    } catch (err) {
      showToast('Failed to add application', 'error');
    }
  };

  const handleUpdateStage = async (appId: string, newStage: ApplicationStage) => {
    try {
      const res = await fetch(`${API_BASE}/applications/${userId}/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStage })
      });

      if (res.ok) {
        const updated = await res.json();
        showToast(`Status updated to "${newStage}"`, 'info');
        setApplications((prev) => prev.map((a) => (a.id === appId ? updated : a)));
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp(updated);
        }
        fetchData();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveInterviewDetails = async () => {
    if (!selectedApp || !interviewDate) {
      showToast('Please select an interview date', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/applications/${userId}/${selectedApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Interview scheduled',
          interview_details: {
            date: interviewDate,
            time: interviewTime,
            round_type: interviewRound,
            status: 'Scheduled',
            location_or_link: interviewLink || 'Virtual Meeting'
          }
        })
      });

      if (res.ok) {
        const updated = await res.json();
        showToast('Interview schedule saved successfully!', 'success');
        setSelectedApp(updated);
        setEditingInterview(false);
        fetchData();
      }
    } catch (err) {
      showToast('Failed to save interview schedule', 'error');
    }
  };

  const handleAddNote = async () => {
    if (!selectedApp || !newNoteText.trim()) return;

    const updatedNotes = [...selectedApp.notes, newNoteText.trim()];
    try {
      const res = await fetch(`${API_BASE}/applications/${userId}/${selectedApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes })
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedApp(updated);
        setNewNoteText('');
        showToast('Note added to application', 'success');
      }
    } catch (err) {
      showToast('Failed to add note', 'error');
    }
  };

  const handleDeleteApp = async (appId: string, company: string) => {
    if (!window.confirm(`Are you sure you want to remove ${company} from your application tracker?`)) return;

    try {
      const res = await fetch(`${API_BASE}/applications/${userId}/${appId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast(`Removed ${company} application record`, 'info');
        if (selectedApp?.id === appId) setSelectedApp(null);
        fetchData();
      }
    } catch (err) {
      showToast('Failed to delete application', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
              Milestone 4 Core Module
            </span>
            <span className="text-xs text-slate-500">• Lifecycle & Reminders</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-indigo-600" /> Application Tracking & Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Monitor internship applications, update stage statuses, track interview schedules, view customized resumes/cover letters, and manage deadline alerts in one place.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Dashboard Overview Cards (M4.1 Requirement) */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Tracked</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{metrics.total_applications}</div>
            <span className="text-[11px] text-slate-500">Across all stages</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-xs">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Active Pipeline</span>
            <div className="text-2xl font-black text-indigo-700 mt-1">{metrics.active_applications}</div>
            <span className="text-[11px] text-indigo-500 font-medium">In progress</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-xs">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Upcoming Deadlines</span>
            <div className="text-2xl font-black text-amber-700 mt-1">{metrics.upcoming_deadlines_count}</div>
            <span className="text-[11px] text-amber-600 font-medium">Action needed</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-cyan-100 shadow-xs">
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider block">Interviews</span>
            <div className="text-2xl font-black text-cyan-700 mt-1">{metrics.interviews_scheduled_count}</div>
            <span className="text-[11px] text-cyan-600 font-medium">Scheduled</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Offers Received</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">{metrics.offers_received_count}</div>
            <span className="text-[11px] text-emerald-600 font-medium">🎉 Congratulations</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block">Rejected / Archived</span>
            <div className="text-2xl font-black text-rose-600 mt-1">{metrics.rejected_applications_count}</div>
            <span className="text-[11px] text-slate-500">Completed</span>
          </div>
        </div>
      )}

      {/* Deadlines & Reminders Widget */}
      {metrics && (metrics.upcoming_deadlines.length > 0 || metrics.scheduled_interviews.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-5 rounded-3xl text-white shadow-lg">
          {/* Scheduled Interviews Alert */}
          {metrics.scheduled_interviews.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Video className="w-4 h-4" /> Upcoming Interview Schedules
              </div>
              {metrics.scheduled_interviews.map((int, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between border border-white/10">
                  <div>
                    <h4 className="font-bold text-sm">{int.job_title}</h4>
                    <span className="text-xs text-slate-300">{int.company_name} • {int.round_type}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg text-xs font-semibold block">
                      {int.interview_date} ({int.interview_time || '10:00 AM'})
                    </span>
                    {int.link && (
                      <a href={int.link} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-300 underline mt-1 inline-flex items-center gap-1">
                        Join Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pending Deadlines Alert */}
          {metrics.upcoming_deadlines.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" /> Urgent Application Deadlines
              </div>
              {metrics.upcoming_deadlines.slice(0, 2).map((dead, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between border border-white/10">
                  <div>
                    <h4 className="font-bold text-sm">{dead.job_title}</h4>
                    <span className="text-xs text-slate-300">{dead.company_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-semibold block">
                      Deadline: {dead.deadline}
                    </span>
                    <span className="text-[11px] text-slate-400 capitalize">{dead.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Control Bar: Search, Status Filter, View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, role title, domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Stages ({applications.length})</option>
            {ALL_STAGES.map((stg) => (
              <option key={stg} value={stg}>{stg}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="deadline">Sort by Deadline</option>
            <option value="company">Sort by Company</option>
            <option value="application_date">Sort by Date Applied</option>
            <option value="status">Sort by Stage</option>
          </select>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                viewMode === 'kanban' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" /> List
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold">Loading application tracker records...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Applications Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery || selectedStatus !== 'all'
              ? 'No application matching your current search filters. Try resetting filters or search term.'
              : 'You haven\'t tracked any internship applications yet. Click "Add Application" to get started!'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedStatus('all'); setShowAddModal(true); }}
            className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Track First Internship
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {[
            { title: 'Saved & Planning', stages: ['Saved', 'Planning to apply'] },
            { title: 'Applied & Under Review', stages: ['Applied', 'Application under review'] },
            { title: 'Interviewing', stages: ['Shortlisted', 'Interview scheduled', 'Interview completed'] },
            { title: 'Decision & Offers', stages: ['Offer received', 'Rejected', 'Withdrawn'] }
          ].map((col, colIdx) => {
            const colApps = applications.filter((a) => col.stages.includes(a.status));
            return (
              <div key={colIdx} className="bg-slate-100/70 p-4 rounded-3xl border border-slate-200 space-y-3 flex flex-col min-h-[420px]">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">{col.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white text-slate-600 shadow-xs border border-slate-200">
                    {colApps.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3">
                  {colApps.map((app) => {
                    const stageStyle = STAGE_COLORS[app.status] || STAGE_COLORS['Saved'];
                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                              {app.job_title}
                            </h4>
                            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" /> {app.company_name}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border}`}>
                            {app.status}
                          </span>
                        </div>

                        {/* Badges / Extras */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" /> {app.location}
                          </span>
                          {app.deadline && (
                            <span className="flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                              <Clock className="w-3 h-3" /> {app.deadline}
                            </span>
                          )}
                        </div>

                        {app.interview_details && (
                          <div className="bg-cyan-50 border border-cyan-200 p-2 rounded-xl text-[11px] text-cyan-800 flex items-center justify-between">
                            <span className="font-bold flex items-center gap-1">
                              <Video className="w-3 h-3" /> {app.interview_details.date}
                            </span>
                            <span className="text-[10px] bg-cyan-200/60 px-1.5 py-0.5 rounded font-medium">
                              {app.interview_details.round_type}
                            </span>
                          </div>
                        )}

                        {app.tailored_resume_summary && (
                          <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 font-medium flex items-center gap-1">
                            <FileCheck className="w-3 h-3" /> Customized Materials Attached
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Company & Role</th>
                <th className="py-3.5 px-4">Stage Status</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4">Interview Schedule</th>
                <th className="py-3.5 px-4">Custom Materials</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {applications.map((app) => {
                const stageStyle = STAGE_COLORS[app.status] || STAGE_COLORS['Saved'];
                return (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{app.job_title}</div>
                      <div className="text-slate-500 text-xs flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {app.company_name} • <MapPin className="w-3 h-3" /> {app.location}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {app.deadline ? (
                        <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 w-max">
                          <Calendar className="w-3 h-3" /> {app.deadline}
                        </span>
                      ) : (
                        <span className="text-slate-400">No deadline set</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {app.interview_details ? (
                        <div className="text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200 w-max">
                          <span className="font-bold">{app.interview_details.date}</span> ({app.interview_details.round_type})
                        </div>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {app.tailored_resume_summary || app.cover_letter_snippet ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md text-[11px] font-bold border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Ready
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Not generated</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1"
                      >
                        Manage <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAIL MODAL / DRAWER (M4.1 Requirement) */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700">
                  {selectedApp.domain || 'Software Development'}
                </span>
                <span className="text-xs text-slate-500">• Applied {selectedApp.application_date}</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">{selectedApp.job_title}</h2>
              <p className="text-sm font-semibold text-slate-600 flex items-center gap-2 mt-0.5">
                <Building2 className="w-4 h-4 text-slate-400" /> {selectedApp.company_name} • <MapPin className="w-4 h-4 text-slate-400" /> {selectedApp.location} ({selectedApp.work_mode})
              </p>
            </div>

            {/* Stage Selector */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block">
                Update Application Stage Status:
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_STAGES.map((stg) => {
                  const isCurrent = selectedApp.status === stg;
                  return (
                    <button
                      key={stg}
                      onClick={() => handleUpdateStage(selectedApp.id, stg)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {stg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interview Schedule Management Section */}
            <div className="border border-slate-200 p-4 rounded-2xl space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-600" /> Interview Schedule & Outcome
                </h4>
                <button
                  onClick={() => setEditingInterview(!editingInterview)}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  {editingInterview ? 'Cancel Edit' : selectedApp.interview_details ? 'Edit Schedule' : '+ Schedule Interview'}
                </button>
              </div>

              {editingInterview ? (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Interview Date</label>
                      <input
                        type="date"
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Time</label>
                      <input
                        type="text"
                        value={interviewTime}
                        onChange={(e) => setInterviewTime(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                        placeholder="11:30 AM"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Round Type</label>
                      <select
                        value={interviewRound}
                        onChange={(e) => setInterviewRound(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Technical Round">Technical Round</option>
                        <option value="System Design Drill">System Design Drill</option>
                        <option value="Coding Assessment">Coding Assessment</option>
                        <option value="HR & Managerial">HR & Managerial</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Meeting Link / Place</label>
                      <input
                        type="text"
                        value={interviewLink}
                        onChange={(e) => setInterviewLink(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                        placeholder="https://meet.google.com/..."
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveInterviewDetails}
                    className="w-full py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Save Interview Schedule
                  </button>
                </div>
              ) : selectedApp.interview_details ? (
                <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-200 text-xs text-cyan-900 space-y-1">
                  <div className="font-bold text-sm flex items-center justify-between">
                    <span>{selectedApp.interview_details.round_type}</span>
                    <span className="px-2 py-0.5 bg-cyan-200 text-cyan-800 rounded font-bold text-[10px]">
                      {selectedApp.interview_details.status}
                    </span>
                  </div>
                  <div>Date: {selectedApp.interview_details.date} at {selectedApp.interview_details.time}</div>
                  {selectedApp.interview_details.location_or_link && (
                    <div className="text-slate-600 text-[11px]">
                      Link: {selectedApp.interview_details.location_or_link}
                    </div>
                  )}
                  {selectedApp.interview_details.notes && (
                    <div className="text-slate-700 text-[11px] italic mt-1 bg-white/60 p-2 rounded">
                      "{selectedApp.interview_details.notes}"
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No interview scheduled yet.</p>
              )}
            </div>

            {/* Generated Cover Letter & Resume View (M4.1 Requirement) */}
            <div className="border border-slate-200 p-4 rounded-2xl space-y-3 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" /> Tailored Application Materials
              </h4>

              {selectedApp.cover_letter_snippet ? (
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Cover Letter Snippet
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{selectedApp.cover_letter_snippet}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  No cover letter generated yet. Use the <span className="font-bold text-indigo-600">Cover Letter Agent</span> tab to create tailored application text!
                </p>
              )}
            </div>

            {/* Application Notes */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-600" /> Application Notes & Follow-ups
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {selectedApp.notes.map((note, idx) => (
                  <div key={idx} className="bg-slate-100 p-2.5 rounded-xl text-xs text-slate-700 font-medium">
                    • {note}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add a new note..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  className="flex-1 p-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleAddNote}
                  className="px-3 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 transition-colors"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <button
                onClick={() => handleDeleteApp(selectedApp.id, selectedApp.company_name)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Application
              </button>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW APPLICATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>

            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" /> Add Internship Application
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track a new internship opportunity in your student dashboard.
              </p>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Infosys, TechPulse"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Internship / Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer Intern, AI/ML Intern"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Data Science">Data Science</option>
                    <option value="FinTech">FinTech</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Application Stage</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStage)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    {ALL_STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, India"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Work Mode</label>
                  <select
                    value={newWorkMode}
                    onChange={(e) => setNewWorkMode(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Job Description Notes (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Paste brief responsibilities or key requirements..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Save to Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTrackerPage;
