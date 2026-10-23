import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Brain,
  Briefcase,
  Target,
  FileCode2,
  Bot,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface LandingPageProps {
  onNavigateAuth: (mode: 'login' | 'signup') => void;
  onNavigateDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateAuth,
  onNavigateDashboard
}) => {
  const steps = [
    {
      step: '01',
      title: 'Build Profile & Upload Resume',
      desc: 'Upload your resume in PDF/DOCX or fill out our clean 6-step candidate wizard.'
    },
    {
      step: '02',
      title: 'AI Resume Extraction',
      desc: 'Our LLM parsing engine automatically extracts skills, experience, projects, and confidence scores.'
    },
    {
      step: '03',
      title: 'Discover Matches & Skill Gaps',
      desc: 'Get matched with top internships and view targeted skill additions to boost eligibility.'
    },
    {
      step: '04',
      title: 'AI Interview Practice',
      desc: 'Practice interactive mock technical interviews tailored specifically to your resume.'
    }
  ];

  const aiAgents = [
    {
      name: 'Resume Agent',
      icon: FileCode2,
      status: 'Active (Milestone 1)',
      desc: 'Parses resumes into structured JSON schemas, categorizes skills, and calculates AI extraction confidence.'
    },
    {
      name: 'Job-Resume Matching Agent',
      icon: Briefcase,
      status: 'Milestone 2',
      desc: 'Compares your profile with live internship requirements to generate a weighted match percentage.'
    },
    {
      name: 'Skill Gap Agent',
      icon: Target,
      status: 'Milestone 2',
      desc: 'Identifies missing skills for target roles and recommends prioritized learning pathways.'
    },
    {
      name: 'Cover Letter Agent',
      icon: Layers,
      status: 'Milestone 3',
      desc: 'Generates company-tailored cover letters using candidate experience & target job descriptions.'
    },
    {
      name: 'Interview Agent',
      icon: Brain,
      status: 'Milestone 4',
      desc: 'Conducts interactive AI mock interview drills and evaluates technical answer depth.'
    },
    {
      name: 'Career Assistant Orchestrator',
      icon: Bot,
      status: 'Active (Milestone 1)',
      desc: 'Central intelligent agent routing user queries to specialized subagents.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar onNavigateAuth={onNavigateAuth} onNavigateDashboard={onNavigateDashboard} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-8 shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>Production AI Career Platform for College Students</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] max-w-4xl mx-auto mb-6">
          Your AI <span className="gradient-text">Career Companion</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Build your profile, discover the right internships, identify skill gaps, and prepare smarter for interviews with AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          <button
            onClick={onNavigateDashboard}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/25 transition-all duration-200 hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Launch Milestone 3 App</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigateAuth('signup')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-700 font-semibold rounded-2xl transition-all"
          >
            <span>Create Account</span>
          </button>
        </div>

        {/* Dashboard Preview Mockup Card */}
        <div className="mt-16 relative max-w-5xl mx-auto rounded-3xl p-3 bg-white/70 border border-slate-200/80 shadow-2xl backdrop-blur-md">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 p-4 text-left font-mono text-xs text-indigo-300">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-slate-500 text-[11px] ml-2">ai-career-companion-system-v1.0.0</span>
            </div>
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-1">Candidate Profile Status</span>
                <span className="text-emerald-400 font-bold text-sm block">Rani Reddy (85% Complete)</span>
                <span className="text-slate-500 text-[11px]">B.Tech Computer Science & Engineering</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-1">LLM Resume Extraction</span>
                <span className="text-indigo-400 font-bold text-sm block">10 Skills • 96% AI Confidence</span>
                <span className="text-slate-500 text-[11px]">Python, React, FastAPI, Machine Learning</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block mb-1">Internship Eligibility</span>
                <span className="text-purple-400 font-bold text-sm block">3 High-Match Opportunities</span>
                <span className="text-slate-500 text-[11px]">Software Engineering & AI/ML Labs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How AI Career Companion Works
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              A 4-step automated pipeline built to give college candidates a distinct competitive edge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative hover:shadow-lg transition-all group"
              >
                <span className="text-3xl font-black text-indigo-600/30 group-hover:text-indigo-600 transition-colors">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Showcase */}
      <section id="ai-agents" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Multi-Agent Architecture</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Specialized AI Agents Working for You
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Modular agent framework designed for high-accuracy candidate understanding, matching, and preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiAgents.map((agent, idx) => {
              const Icon = agent.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {agent.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{agent.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{agent.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features & Student Benefits */}
      <section id="features" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                Designed to Feel Like a Production SaaS Product
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                No generic templates or basic CRUD pages. Everything is engineered with modern UI principles, clean typography, soft rounded cards, and real-time state feedback.
              </p>

              <div className="space-y-4">
                {[
                  '6-Step Candidate Profile Wizard with live completion tracking',
                  'Visual AI Resume Upload & Multi-Stage Parsing Animation',
                  'Confidence metrics gauge for skills, education & experience',
                  'Floating AI Assistant drawer for instant career coaching',
                  'Extensible multi-agent & RAG vector search documentation'
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-700">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button
                  onClick={() => onNavigateAuth('signup')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
                >
                  <span>Build Profile Now</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>Enterprise Architecture</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Structured Candidate Data Model</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Pydantic database schemas enforcing strong data integrity across candidate profiles, education timelines, skill categories, and resume metadata.
              </p>
              <div className="bg-slate-800 p-4 rounded-2xl font-mono text-[11px] text-emerald-400 overflow-x-auto border border-slate-700">
                <pre>{`CandidateProfile {
  id: "prof_rani123",
  skills: [
    { name: "Python", category: "Programming" },
    { name: "React", category: "Web Dev" }
  ],
  extractedConfidence: {
    skills: 0.96,
    education: 0.99
  }
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            Ready to Take the Next Step Toward Your Dream Internship?
          </h2>
          <p className="text-sm text-indigo-200 max-w-xl mx-auto mb-8">
            Build your profile, analyze your resume, and discover your career potential today.
          </p>
          <button
            onClick={() => onNavigateAuth('signup')}
            className="px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-2xl shadow-lg transition-all hover:scale-105"
          >
            Create Free Account
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};
