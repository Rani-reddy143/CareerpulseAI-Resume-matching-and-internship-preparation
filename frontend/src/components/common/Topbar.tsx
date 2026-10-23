import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import {
  Search,
  Bell,
  Menu,
  LogOut,
  User as UserIcon,
  CheckCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import type { NavTab } from './Sidebar';


interface TopbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  setIsOpenMobile: (open: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  setActiveTab,
  setIsOpenMobile
}) => {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: '1',
      title: 'Resume Extraction Completed',
      desc: 'Extracted 10 skills with 96% AI confidence score.',
      time: '10m ago',
      unread: true
    },
    {
      id: '2',
      title: 'Profile Completeness Update',
      desc: `Your profile is ${profile.profileCompletion}% complete. Add career interests to reach 100%.`,
      time: '1h ago',
      unread: true
    },
    {
      id: '3',
      title: 'System Milestone 1 Ready',
      desc: 'Candidate Understanding & Resume Intelligence engine online.',
      time: '2h ago',
      unread: false
    }
  ];

  const pageTitles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Student Dashboard', subtitle: 'Overview of your career profile & AI recommendations' },
    profile: { title: 'Candidate Profile Wizard', subtitle: 'Step-by-step career profile creation & management' },
    resume: { title: 'Resume Upload & Visual AI Parser', subtitle: 'Upload your resume for automated skill extraction' },
    'resume-analysis': { title: 'Resume Analysis Dashboard', subtitle: 'Detailed LLM extracted skills, education & confidence metrics' },
    internships: { title: 'Internship Match Center', subtitle: 'AI-curated internship opportunities matching your skills' },

    applications: { title: 'Application Tracking Module', subtitle: 'Manage applied roles, interview schedules & deadline reminders' },
    'skill-gap': { title: 'Skill Gap Intelligence', subtitle: 'Target job skill gap breakdown & learning pathways' },
    'cover-letter': { title: 'AI Cover Letter Generator', subtitle: 'Personalized cover letters tailored to target companies' },
    'interview-prep': { title: 'AI Interview Practice Agent', subtitle: 'Interactive technical & behavioral mock interview drills' },
    assistant: { title: 'AI Career Companion', subtitle: 'Interactive multi-agent student career coach' },
    architecture: { title: 'System & Agent Architecture', subtitle: 'Developer documentation, RAG flow & JSON schemas' },
    settings: { title: 'Account Settings', subtitle: 'Manage notifications, API keys & account preferences' }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpenMobile(true)}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
            {pageTitles[activeTab]?.title || 'Dashboard'}
          </h1>
          <p className="hidden md:block text-xs text-slate-500 font-normal">
            {pageTitles[activeTab]?.subtitle || 'AI Career Companion'}
          </p>
        </div>
      </div>

      {/* Middle: Quick Search Bar */}
      <div className="hidden sm:flex items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills, jobs, features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/80 border border-transparent focus:border-indigo-500 focus:bg-white text-xs text-slate-900 placeholder-slate-400 rounded-xl pl-9 pr-4 py-2 transition-all outline-none"
          />
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile Avatar */}
      <div className="flex items-center gap-3">
        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications
                </span>
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                  2 Unread
                </span>
              </div>
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs transition-colors ${
                      n.unread ? 'bg-indigo-50/50 border border-indigo-100/60' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-semibold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/80 transition-colors border border-slate-200/60"
          >
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={user?.name || 'Student'}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
            />
            <div className="hidden md:block text-left pr-1">
              <span className="text-xs font-semibold text-slate-900 block leading-tight">
                {user?.name || 'Rani Reddy'}
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight">
                {profile.profileCompletion}% Complete
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'Rani Reddy'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  My Candidate Profile
                </button>
                <button
                  onClick={() => {
                    setActiveTab('resume');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Resume Intelligence
                </button>
                <button
                  onClick={() => {
                    setActiveTab('architecture');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Architecture & Docs
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
