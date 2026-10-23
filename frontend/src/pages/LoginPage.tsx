import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, UserCheck, X } from 'lucide-react';

interface LoginPageProps {
  onNavigateSignUp: () => void;
  onNavigateDashboard: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateSignUp,
  onNavigateDashboard
}) => {
  const { login, fillDemoUser } = useAuth();
  const [email, setEmail] = useState('rani.reddy@university.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await login(email, password);
    onNavigateDashboard();
  };

  const handleDemoLogin = () => {
    fillDemoUser();
    onNavigateDashboard();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access your AI Candidate Profile & Internship Companion
          </p>
        </div>

        {/* Demo Account Quick Fill Banner */}
        <div className="mb-6 p-3.5 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <div className="text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight">Instant Demo Account</span>
              <span className="text-[10px] text-slate-600 block">Rani Reddy (IIT CSE Senior)</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl shadow-xs transition-all"
          >
            Quick Login
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Student Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                placeholder="student@university.edu"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 transition-all outline-none"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have a profile yet?{' '}
          <button
            onClick={onNavigateSignUp}
            className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Create Career Profile
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSent(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your student email to receive a password reset link.
            </p>

            {forgotSent ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium text-center">
                ✓ Password reset link sent! Check your inbox.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSent(true);
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
