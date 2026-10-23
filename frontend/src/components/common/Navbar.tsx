import React from 'react';
import { Sparkles, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onNavigateAuth: (mode: 'login' | 'signup') => void;
  onNavigateDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateAuth, onNavigateDashboard }) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onNavigateDashboard}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
            <Sparkles className="w-5 h-5" />
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

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
          <a href="#ai-agents" className="hover:text-indigo-600 transition-colors">AI Agents</a>
          <a href="#benefits" className="hover:text-indigo-600 transition-colors">Student Benefits</a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={onNavigateDashboard}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <User className="w-4 h-4" />
              <span>Go to Dashboard ({user?.name.split(' ')[0]})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigateAuth('login')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigateAuth('signup')}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <span>Build Career Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
