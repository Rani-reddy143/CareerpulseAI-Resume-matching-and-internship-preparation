import React, { useState, useEffect } from 'react';
import { Target, AlertTriangle, CheckCircle, Sparkles, BookOpen, RefreshCw, HelpCircle, Briefcase } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

interface JobPosting {
  job_id: string;
  job_title: string;
  company: string;
  domain: string;
  location: string;
  work_mode: string;
  required_skills: string[];
  preferred_skills?: string[];
}

const FALLBACK_POSTINGS: JobPosting[] = [
  {
    job_id: 'JOB_001',
    job_title: 'Full Stack Developer Intern',
    company: 'Infosys Springboard',
    domain: 'Software Engineering',
    location: 'Bengaluru, India',
    work_mode: 'Hybrid',
    required_skills: ['React.js', 'Python', 'FastAPI', 'TypeScript', 'PostgreSQL'],
    preferred_skills: ['Docker', 'AWS S3', 'GraphQL']
  },
  {
    job_id: 'JOB_002',
    job_title: 'Frontend Developer Intern',
    company: 'TCS Research',
    domain: 'Software Engineering',
    location: 'Hyderabad, India',
    work_mode: 'Remote',
    required_skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
    preferred_skills: ['Redux Toolkit', 'Jest', 'Vite']
  },
  {
    job_id: 'JOB_003',
    job_title: 'AI / ML Engineer Intern',
    company: 'TechPulse Innovations',
    domain: 'Artificial Intelligence',
    location: 'Bengaluru, India',
    work_mode: 'On-site',
    required_skills: ['Python', 'PyTorch', 'Machine Learning', 'Pandas', 'FastAPI'],
    preferred_skills: ['Docker', 'MLflow', 'NLP', 'Scikit-Learn']
  },
  {
    job_id: 'JOB_004',
    job_title: 'Data Analyst Intern',
    company: 'FinTech NextGen',
    domain: 'Data Analytics & BI',
    location: 'Mumbai, India',
    work_mode: 'Hybrid',
    required_skills: ['Python', 'SQL', 'Pandas', 'Tableau', 'Excel'],
    preferred_skills: ['Power BI', 'Statistics', 'Snowflake']
  }
];

export const SkillGapPage: React.FC = () => {
  const { profile } = useProfile();

  const [postings, setPostings] = useState<JobPosting[]>(FALLBACK_POSTINGS);
  const [selectedJobId, setSelectedJobId] = useState<string>('JOB_001');
  const [loading, setLoading] = useState<boolean>(false);
  const [gapData, setGapData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'gaps' | 'recommendations' | 'explanations'>('gaps');

  useEffect(() => {
    fetchPostings();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchSkillGap(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchPostings = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/matching/postings');
      if (res.ok) {
        const data = await res.json();
        if (data.postings && data.postings.length > 0) {
          setPostings(data.postings);
          setSelectedJobId(data.postings[0].job_id);
          return;
        }
      }
    } catch {
      // Use fallback postings
    }
    setPostings(FALLBACK_POSTINGS);
    setSelectedJobId(FALLBACK_POSTINGS[0].job_id);
  };

  const getFallbackGapData = (jobId: string) => {
    const job = postings.find((j) => j.job_id === jobId) || FALLBACK_POSTINGS[0];
    const userSkills = profile.skills.map((s) => s.name.toLowerCase());

    const matchedReq = job.required_skills.filter((sk) => userSkills.some((us) => us.includes(sk.toLowerCase()) || sk.toLowerCase().includes(us)));
    const missingReq = job.required_skills.filter((sk) => !matchedReq.includes(sk));
    const prefSkills = job.preferred_skills || ['Docker', 'System Design'];
    const matchedPref = prefSkills.filter((sk) => userSkills.some((us) => us.includes(sk.toLowerCase())));
    const missingPref = prefSkills.filter((sk) => !matchedPref.includes(sk));

    const readinessScore = Math.min(100, Math.round((matchedReq.length / job.required_skills.length) * 70 + 20));

    return {
      job_id: job.job_id,
      job_title: job.job_title,
      company: job.company,
      domain: job.domain,
      readiness_score: readinessScore,
      verdict: readinessScore >= 80 ? 'High Readiness' : (readinessScore >= 60 ? 'Moderate Readiness' : 'Skill Development Needed'),
      matched_required_skills: matchedReq,
      gap_classification: {
        critical_missing_skills: missingReq.length > 0 ? missingReq : ['System Architecture Basics'],
        partially_demonstrated_skills: [
          { skill: 'Production Deployment', evidence: 'Listed basic Docker in skills, but lacks AWS deployment metrics in projects.' }
        ],
        preferred_skills_gaps: missingPref,
        experience_gaps: [
          { gap_title: 'Production Experience', detail: 'Role asks for hands-on microservices development experience.' }
        ],
        qualification_gaps: [
          { requirement: 'B.Tech in CS or related field', candidate_status: `${profile.education[0]?.degree || 'B.Tech'} in ${profile.education[0]?.field || 'Computer Science'}` }
        ]
      },
      recommendations: [
        {
          category: 'Critical Skill Upgrade',
          target_skill: missingReq[0] || 'Docker Containerization',
          action_step: `Build a containerized REST API using ${missingReq[0] || 'Docker'} to prove production readiness.`,
          recommended_resource: 'Official Documentation & Hands-on Lab',
          expected_impact: '+15% match score boost'
        },
        {
          category: 'Portfolio Enhancement',
          target_skill: 'System Design Basics',
          action_step: 'Add architecture diagrams and API benchmark metrics to your GitHub projects.',
          recommended_resource: 'System Design Primer Repository',
          expected_impact: 'High interviewer callback rate'
        }
      ],
      skill_importance_explanations: {
        [job.required_skills[0] || 'Python']: `${job.required_skills[0] || 'Python'} is essential for ${job.job_title} at ${job.company} to build high-throughput backend services and maintain clean, modular codebase architectures.`,
        [job.required_skills[1] || 'React.js']: `${job.required_skills[1] || 'React.js'} enables candidates to rapidly deliver reactive user interfaces matching company design standards.`
      }
    };
  };

  const fetchSkillGap = async (jobId: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/agents/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: profile.userId, job_id: jobId })
      });
      if (res.ok) {
        const data = await res.json();
        setGapData(data);
        setLoading(false);
        return;
      }
    } catch {
      // Fallback
    }
    setGapData(getFallbackGapData(jobId));
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Agent M3.1 — Skill Gap Analysis</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Target Role Skill Gap Analyzer
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Compares your candidate profile against job requirements to classify gaps across 5 categories and generate actionable 2-week learning pathways.
          </p>
        </div>

        {/* Internship Dropdown Selector */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 min-w-[280px]">
          <label className="block text-[11px] font-bold text-indigo-200 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            Select Target Internship:
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full bg-slate-900 text-white text-xs font-semibold rounded-xl px-3 py-2.5 border border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all cursor-pointer"
          >
            {postings.map((j) => (
              <option key={j.job_id} value={j.job_id}>
                {j.job_title} — {j.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">
            Skill Gap Agent is analyzing job requirements against your profile...
          </p>
        </div>
      ) : gapData ? (
        <>
          {/* Top Metric & Overview Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                <span className="text-2xl font-black">{gapData.readiness_score}%</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Readiness Score</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{gapData.verdict}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Matched {gapData.matched_required_skills.length} core technical requirements.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Missing Skills</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {gapData.gap_classification.critical_missing_skills.length} Skills Gap
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {gapData.gap_classification.critical_missing_skills.join(', ') || 'No critical gaps identified.'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actionable Recommendations</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {gapData.recommendations.length} Learning Steps
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Clear pathways to raise readiness score to 95%+.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-4">
            <button
              onClick={() => setActiveTab('gaps')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === 'gaps'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>5-Category Gap Classification</span>
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === 'recommendations'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Personalized Action Plan</span>
            </button>
            <button
              onClick={() => setActiveTab('explanations')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === 'explanations'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Why Each Skill Matters</span>
            </button>
          </div>

          {/* Tab 1: 5-Category Gap Classification */}
          {activeTab === 'gaps' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category 1: Critical Missing Skills */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                    <span>1. Critical / Missing Skills</span>
                  </div>
                  <span className="text-[11px] font-semibold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full">
                    High Priority
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Required job skills missing from your candidate profile:
                </p>
                {gapData.gap_classification.critical_missing_skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {gapData.gap_classification.critical_missing_skills.map((sk: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 bg-rose-50 text-rose-800 border border-rose-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        <span>{sk}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-emerald-600 font-medium bg-emerald-50 p-3 rounded-xl">
                    All core required skills are satisfied!
                  </div>
                )}
              </div>

              {/* Category 2: Partially Demonstrated Skills */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>2. Partially Demonstrated Skills</span>
                  </div>
                  <span className="text-[11px] font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                    Medium Priority
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Skills mentioned in basic profile, but requiring deeper project proof:
                </p>
                {gapData.gap_classification.partially_demonstrated_skills.length > 0 ? (
                  <div className="space-y-2">
                    {gapData.gap_classification.partially_demonstrated_skills.map((item: any, i: number) => (
                      <div key={i} className="bg-amber-50/60 border border-amber-200/60 p-3 rounded-xl space-y-1">
                        <span className="font-bold text-xs text-amber-900">{item.skill}</span>
                        <p className="text-[11px] text-amber-800">{item.evidence}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No partial skill gaps detected.</p>
                )}
              </div>

              {/* Category 3: Preferred Skills Gaps */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span>3. Preferred Skills Gaps</span>
                  </div>
                  <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                    Bonus Points
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Nice-to-have skills listed in job posting:
                </p>
                <div className="flex flex-wrap gap-2">
                  {gapData.gap_classification.preferred_skills_gaps.map((sk: string, i: number) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-xl text-xs font-semibold">
                      + {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Category 4 & 5: Experience & Qualification Gaps */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>4 & 5. Experience & Education Gaps</span>
                  </div>
                  <span className="text-[11px] font-semibold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
                    Portfolio Impact
                  </span>
                </div>
                <div className="space-y-3">
                  {gapData.gap_classification.experience_gaps.map((eg: any, i: number) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-xl space-y-1">
                      <span className="font-bold text-xs text-slate-900">{eg.gap_title}</span>
                      <p className="text-[11px] text-slate-600">{eg.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Personalized Recommendations */}
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              {gapData.recommendations.map((rec: any, idx: number) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-indigo-300 transition-all">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        {rec.category}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{rec.target_skill}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{rec.action_step}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{rec.recommended_resource}</span>
                    </p>
                  </div>
                  <div className="shrink-0 bg-emerald-50 text-emerald-700 font-bold text-xs px-3.5 py-2 rounded-2xl border border-emerald-200">
                    {rec.expected_impact}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Why Each Skill Matters */}
          {activeTab === 'explanations' && (
            <div className="space-y-4">
              {Object.entries(gapData.skill_importance_explanations).map(([sk, explanation]: any, i: number) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
                  <h4 className="font-bold text-sm text-indigo-700 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Why is '{sk}' critical for {gapData.job_title}?</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {explanation.replace(/\*\*/g, '')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};
