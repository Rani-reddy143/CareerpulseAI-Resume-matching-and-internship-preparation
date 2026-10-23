import React from 'react';
import { Sparkles, Globe, Code2, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-tight text-base">
                AI Career Companion
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering college students with automated AI resume intelligence, skill gap detection, and personalized interview preparation.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors">Candidate Profile Wizard</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Resume AI Intelligence</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Internship Matching</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Skill Gap Analyzer</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Mock Interview Drills</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">AI Agents</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-300">Resume Extraction Agent</span></li>
              <li><span className="text-slate-300">Job-Resume Matching Agent</span></li>
              <li><span className="text-slate-300">Skill Gap Agent</span></li>
              <li><span className="text-slate-300">Cover Letter Agent</span></li>
              <li><span className="text-slate-300">Interview Agent</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Built on a scalable multi-agent architecture with RAG vector search readiness and Pydantic profile schemas.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://github.com/ranireddy143/app1" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 AI Career Companion. Production-Ready SaaS Architecture (Milestone 1).</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">B.Tech Career Intelligence Engine v1.0</p>
        </div>
      </div>
    </footer>
  );
};
