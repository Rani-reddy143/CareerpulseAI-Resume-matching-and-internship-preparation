import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { CircularProgress } from '../components/common/CircularProgress';
import type { NavTab } from '../components/common/Sidebar';

import {
  Sparkles,
  Upload,
  UserCheck,
  Briefcase,
  Target,
  BrainCircuit,
  Bot,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  X,
  Zap,
  Award
} from 'lucide-react';

interface DashboardPageProps {
  setActiveTab: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [modalTitle, setModalTitle] = useState<string | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Missing items logic
  const missingItems = [];
  if (!profile.certifications || profile.certifications.length === 0) {
    missingItems.push('Add certifications');
  }
  if (!profile.careerPreferences.preferredRoles || profile.careerPreferences.preferredRoles.length === 0) {
    missingItems.push('Add preferred job roles');
  }
  if (!profile.careerPreferences.preferredDomains || profile.careerPreferences.preferredDomains.length === 0) {
    missingItems.push('Add career interests');
  }
  if (missingItems.length === 0) {
    missingItems.push('Upload updated resume for annual refresh');
  }

  const isResumeUploaded = profile.resumeMetadata?.parsingStatus === 'Completed';

  const quickActions = [
    {
      id: 'upload',
      title: 'Upload Resume',
      desc: 'Drag & drop your resume for AI skill extraction',
      icon: Upload,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
      tab: 'resume' as NavTab,
      isFunctional: true,
      milestone: 'M1'
    },
    {
      id: 'profile',
      title: 'Complete Profile',
      desc: 'Fill 6-step candidate education & skills wizard',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      tab: 'profile' as NavTab,
      isFunctional: true,
      milestone: 'M1'
    },
    {
      id: 'internships',
      title: 'Find Internships',
      desc: 'AI RAG-recommended roles based on skill profile',
      icon: Briefcase,
      color: 'bg-purple-50 text-purple-600 border-purple-200/80',
      tab: 'internships' as NavTab,
      isFunctional: true,
      milestone: 'M2'
    },
    {
      id: 'skill-gap',
      title: 'Analyze Skill Gap',
      desc: 'Identify missing requirements & 5-category gaps',
      icon: Target,
      color: 'bg-amber-50 text-amber-600 border-amber-200/80',
      tab: 'skill-gap' as NavTab,
      isFunctional: true,
      milestone: 'M3'
    },
    {
      id: 'interview',
      title: 'Practice Interview',
      desc: 'Interactive technical AI mock interview drills',
      icon: BrainCircuit,
      color: 'bg-rose-50 text-rose-600 border-rose-200/80',
      tab: 'interview-prep' as NavTab,
      isFunctional: true,
      milestone: 'M3'
    },
    {
      id: 'assistant',
      title: 'Ask AI Career Assistant',
      desc: 'Get immediate career coaching & recommendations',
      icon: Bot,
      color: 'bg-blue-50 text-blue-600 border-blue-200/80',
      tab: 'assistant' as NavTab,
      isFunctional: true,
      milestone: 'M3 Live'
    },
    {
      id: 'applications',
      title: 'Track Applications',
      desc: 'Manage stages, interview schedules & deadlines',
      icon: Briefcase,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200/80',
      tab: 'applications' as NavTab,
      isFunctional: true,
      milestone: 'M4'
    }
  ];

  const handleActionClick = (action: typeof quickActions[0]) => {
    setActiveTab(action.tab);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Hero Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Milestone 3 Active: Application Customization & Interview Prep</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getGreeting()}, {user?.name.split(' ')[0] || 'Student'} 👋
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Let's take the next step toward your career. Your AI Career Companion is ready to analyze your skills and prepare you for top internships.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('resume')}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Resume</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 border border-white/10"
            >
              <UserCheck className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 2 Cards Row: Profile Completion & Resume Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Profile Completion Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <span>Candidate Profile Completion</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              {profile.profileCompletion}% Complete
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* SVG Circular Progress Meter */}
            <div className="shrink-0">
              <CircularProgress
                percentage={profile.profileCompletion}
                size={110}
                strokeWidth={10}
                progressColor="stroke-indigo-600"
                circleColor="text-slate-100"
                label="Score"
              />
            </div>

            {/* Missing Items & CTA */}
            <div className="flex-1 space-y-3 w-full">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Recommended Actions:
              </span>
              <div className="space-y-2">
                {missingItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  <span>Complete Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Resume Status Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>Resume Intelligence Status</span>
              </h3>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  isResumeUploaded ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}
              >
                {isResumeUploaded ? 'Analysis Complete' : 'Action Required'}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <span className="text-slate-600 font-medium">Resume uploaded</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <span className="text-slate-600 font-medium">Resume analyzed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <span className="text-slate-600 font-medium">Skills extracted (10 items)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <span className="text-slate-600 font-medium">Experience & Projects extracted</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => setActiveTab('resume')}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              <span>View Resume Analysis</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Quick Actions
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Select a module to continue
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                onClick={() => handleActionClick(act)}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${act.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {act.milestone && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {act.milestone}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {act.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                  <span>Open Module</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Extracted Profile Highlights Quick Summary */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            <span>Candidate Profile Skills Overview</span>
          </h3>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Manage Skills →
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <span>{skill.name}</span>
              <span className="text-[10px] font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                {skill.category}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Coming Soon Modal */}
      {modalTitle && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalTitle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{modalTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              This module is scheduled for future agent integration. Milestone 1 focuses on Candidate Understanding & Resume Intelligence.
            </p>
            <button
              onClick={() => setModalTitle(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
