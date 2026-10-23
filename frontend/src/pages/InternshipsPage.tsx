import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import { Briefcase, Search, Sparkles, CheckCircle, AlertTriangle, MapPin, Building, Filter } from 'lucide-react';

interface MatchItem {
  job_id: string;
  job_title: string;
  company: string;
  location: string;
  work_mode: string;
  domain: string;
  compatibility_score: number;
  required_skills: string[];
  preferred_skills: string[];
  job_description: string;
  reasoning: {
    verdict: string;
    score_breakdown: {
      skill_score: string;
      semantic_score: string;
      edu_exp_score: string;
      preference_score: string;
    };
    matched_required_skills: string[];
    missing_required_skills: string[];
    matched_preferred_skills: string[];
    summary_explanation: string;
  };
}

export const InternshipsPage: React.FC = () => {
  const { profile } = useProfile();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');

  const fetchProfileMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/matching/match-custom-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
      } else {
        fetchFallbackMatches();
      }
    } catch {
      fetchFallbackMatches();
    } finally {
      setLoading(false);
    }
  };

  const fetchFallbackMatches = () => {
    // Local fallback matching simulation if backend server is offline
    setMatches([
      {
        job_id: 'JOB_001',
        job_title: 'Full Stack Developer Intern',
        company: 'Infosys Springboard',
        location: 'Bengaluru, Karnataka, India',
        work_mode: 'Hybrid',
        domain: 'Software Engineering',
        compatibility_score: 88.5,
        required_skills: ['React.js', 'Python', 'FastAPI', 'TypeScript', 'PostgreSQL'],
        preferred_skills: ['Docker', 'AWS'],
        job_description: 'Build microservices and responsive dashboards using React and FastAPI.',
        reasoning: {
          verdict: 'Excellent Match',
          score_breakdown: { skill_score: '30.0/40', semantic_score: '28.5/30', edu_exp_score: '20.0/20', preference_score: '10.0/10' },
          matched_required_skills: ['React.js', 'Python', 'FastAPI', 'TypeScript', 'PostgreSQL'],
          missing_required_skills: [],
          matched_preferred_skills: ['Docker'],
          summary_explanation: `${profile.fullName} matches all core required skills. Strong alignment with Software Engineering.`
        }
      },
      {
        job_id: 'JOB_002',
        job_title: 'AI / ML Engineer Intern',
        company: 'TCS Research',
        location: 'Remote, India',
        work_mode: 'Remote',
        domain: 'Data Science & AI/ML',
        compatibility_score: 84.0,
        required_skills: ['Python', 'PyTorch', 'Machine Learning', 'Pandas'],
        preferred_skills: ['NLP', 'Docker'],
        job_description: 'Develop and evaluate Machine Learning models for NLP tasks.',
        reasoning: {
          verdict: 'Excellent Match',
          score_breakdown: { skill_score: '28.0/40', semantic_score: '26.0/30', edu_exp_score: '20.0/20', preference_score: '10.0/10' },
          matched_required_skills: ['Python', 'Machine Learning'],
          missing_required_skills: ['PyTorch'],
          matched_preferred_skills: ['NLP'],
          summary_explanation: `Strong background in Python and ML. Adding PyTorch will maximize match score.`
        }
      }
    ]);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProfileMatches();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/matching/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          top_k: 10,
          domain_filter: selectedDomain !== 'All' ? selectedDomain : null
        })
      });
      if (res.ok) {
        const data = await res.json();
        // Transform search result to match card format
        const searchMatches = data.results.map((r: any) => ({
          job_id: r.job_id,
          job_title: r.job_title,
          company: r.company,
          location: r.location,
          work_mode: r.work_mode,
          domain: r.domain,
          compatibility_score: r.relevance_score,
          required_skills: r.required_skills,
          preferred_skills: [],
          job_description: r.job_description_snippet,
          reasoning: {
            verdict: r.relevance_score >= 80 ? 'Excellent Match' : r.relevance_score >= 60 ? 'Strong Match' : 'Moderate Match',
            score_breakdown: { skill_score: 'N/A', semantic_score: `${r.relevance_score}%`, edu_exp_score: 'N/A', preference_score: 'N/A' },
            matched_required_skills: r.required_skills,
            missing_required_skills: [],
            matched_preferred_skills: [],
            summary_explanation: `Retrieved via semantic search query: "${searchQuery}".`
          }
        }));
        setMatches(searchMatches);
      }
    } catch {
      // Keep existing matches
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileMatches();
  }, []);

  const filteredMatches = matches.filter((m) => {
    const domainPass = selectedDomain === 'All' || m.domain.toLowerCase().includes(selectedDomain.toLowerCase());
    const modePass = selectedWorkMode === 'All' || m.work_mode.toLowerCase() === selectedWorkMode.toLowerCase();
    return domainPass && modePass;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" /> RAG-Powered Job Matching Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Internship Knowledge Base & Matches
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/80 max-w-2xl">
              Matching your candidate profile ({profile.fullName} — {profile.skills.length} skills, {profile.education[0]?.field || 'CS'}) against 175+ curated internship opportunities.
            </p>
          </div>

          <button
            onClick={fetchProfileMatches}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Refresh AI Matches
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by role, skill, or keyword (e.g., 'remote data analyst', 'react developer')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
          >
            Semantic Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Domain:
          </div>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="All">All Domains</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Data Science">Data Science & AI/ML</option>
            <option value="Data Analytics">Data Analytics & BI</option>
            <option value="Marketing">Marketing & Growth</option>
            <option value="UI/UX">UI/UX & Design</option>
            <option value="Finance">Finance & Accounting</option>
          </select>

          <div className="flex items-center gap-2 text-slate-500 font-semibold ml-auto sm:ml-4">
            Work Mode:
          </div>
          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="All">All Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>
      </div>

      {/* Match Results List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-600 font-medium">Computing RAG semantic vector similarity & skill compatibility...</p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching internships found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or domain filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredMatches.map((match, idx) => (
            <div
              key={match.job_id + idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      #{idx + 1} Match
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {match.domain}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {match.work_mode}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{match.job_title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Building className="w-3.5 h-3.5 text-slate-400" /> {match.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {match.location}
                    </span>
                  </div>
                </div>

                {/* Compatibility Score Widget */}
                <div className="sm:text-right space-y-1 shrink-0 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-100">
                  <div className="text-xs text-slate-500 font-semibold">Compatibility Score</div>
                  <div className="text-2xl font-black text-indigo-600 flex items-center sm:justify-end gap-1.5">
                    {match.compatibility_score}%
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                    {match.reasoning.verdict}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {match.job_description}
              </p>

              {/* Required Skills & Matches */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Required Skills Alignment:</div>
                <div className="flex flex-wrap gap-2">
                  {match.required_skills.map((skill) => {
                    const isMatched = match.reasoning.matched_required_skills.includes(skill);
                    return (
                      <span
                        key={skill}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          isMatched
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {isMatched ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Natural Language Reasoning Box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Transparent Match Reasoning:
                </div>
                <p className="text-slate-600 leading-relaxed">{match.reasoning.summary_explanation}</p>

                {match.reasoning.score_breakdown && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-semibold text-slate-500 border-t border-slate-200/60">
                    <div>Skills: <span className="text-slate-900 font-bold">{match.reasoning.score_breakdown.skill_score}</span></div>
                    <div>Semantic: <span className="text-slate-900 font-bold">{match.reasoning.score_breakdown.semantic_score}</span></div>
                    <div>Edu & Exp: <span className="text-slate-900 font-bold">{match.reasoning.score_breakdown.edu_exp_score}</span></div>
                    <div>Preferences: <span className="text-slate-900 font-bold">{match.reasoning.score_breakdown.preference_score}</span></div>
                  </div>
                )}
              </div>

              {/* M4.1 Direct Track Application Action */}
              <div className="flex items-center justify-end gap-3 pt-1 border-t border-slate-100">
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('http://localhost:8000/api/v1/applications/user_student_1', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          company_name: match.company,
                          job_title: match.job_title,
                          job_id: match.job_id,
                          domain: match.domain,
                          location: match.location,
                          work_mode: match.work_mode,
                          status: 'Planning to apply',
                          job_description: match.job_description
                        })
                      });
                      if (res.ok) {
                        alert(`Added ${match.job_title} at ${match.company} to your Application Tracker!`);
                      }
                    } catch {
                      alert('Failed to track application');
                    }
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5" /> Track Application
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
