import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Briefcase,
  Target,
  FileCode2,
  BrainCircuit,
  Bot,
  Cpu,
  Settings,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'profile'
  | 'resume'
  | 'resume-analysis'
  | 'internships'
  | 'applications'
  | 'skill-gap'
  | 'cover-letter'
  | 'interview-prep'
  | 'assistant'
  | 'architecture'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'profile', label: 'My Profile', icon: UserCheck, badge: 'Wizard' },
    { id: 'resume', label: 'Resume Upload', icon: FileText, badge: 'AI Parse' },
    { id: 'resume-analysis', label: 'Resume Intelligence', icon: CheckCircle2, badge: 'Extracted' },
    { id: 'internships', label: 'Internship Matches', icon: Briefcase, badge: 'RAG' },
    { id: 'applications', label: 'Application Tracker', icon: CheckCircle2, badge: 'M4' },
    { id: 'skill-gap', label: 'Skill Gap', icon: Target, badge: 'M3' },
    { id: 'cover-letter', label: 'Cover Letter', icon: FileCode2, badge: 'M3' },
    { id: 'interview-prep', label: 'Interview Prep', icon: BrainCircuit, badge: 'M3' },
    { id: 'assistant', label: 'AI Career Assistant', icon: Bot, badge: 'Live' }
  ];

  const secondaryNavItems = [
    { id: 'architecture', label: 'System Architecture', icon: Cpu, badge: 'Docs' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  const handleSelect = (tab: NavTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleSelect('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base leading-none block">
                AI Career
              </span>
              <span className="text-[11px] font-semibold text-indigo-600 tracking-wide block uppercase mt-0.5">
                Companion
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Core Platform
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id as NavTab)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-indigo-200/60 text-indigo-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System & Engineering
            </div>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id as NavTab)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Milestone Banner */}
        <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-md">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-indigo-200">Milestone 4 Complete</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Application Tracking, E2E Testing, RAG Optimization & Final Project Documentation
          </p>
        </div>
      </aside>
    </>
  );
};
