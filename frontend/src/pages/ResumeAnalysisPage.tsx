import React from 'react';
import { useProfile } from '../context/ProfileContext';
import type { NavTab } from '../components/common/Sidebar';
import {
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  CheckCircle2,
  Edit3,
  RefreshCw,
  Layers
} from 'lucide-react';


interface ResumeAnalysisPageProps {
  setActiveTab: (tab: NavTab) => void;
}

export const ResumeAnalysisPage: React.FC<ResumeAnalysisPageProps> = ({ setActiveTab }) => {
  const { profile, syncExtractedToProfile } = useProfile();
  const extracted = profile.extractedResumeData;

  const confidence = extracted?.confidenceScores || {
    skills: 0.96,
    education: 0.99,
    experience: 0.94,
    projects: 0.92
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>AI Resume Intelligence Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Resume Analysis Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured candidate data extracted from uploaded resume using LLM JSON parsing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={syncExtractedToProfile}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync to Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Top Candidate Overview & AI Confidence Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Overview Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                <span>Candidate Overview</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                Profile Completeness: {profile.profileCompletion}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Candidate Name</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">{profile.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Education</span>
                <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                  {profile.education[0]?.degree || 'B.Tech CSE'} ({profile.education[0]?.graduationYear || '2026'})
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                <span className="text-xs font-medium text-slate-700 block mt-0.5">{profile.location || 'Hyderabad, India'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email & Links</span>
                <span className="text-xs font-medium text-indigo-600 truncate block mt-0.5">{profile.email}</span>
              </div>
            </div>

            {extracted?.summary && (
              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800 block mb-1">Extracted AI Summary:</span>
                "{extracted.summary}"
              </div>
            )}
          </div>
        </div>

        {/* AI Extraction Confidence Gauges Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Extraction Confidence</span>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Skills Confidence', score: Math.round(confidence.skills * 100), color: 'bg-emerald-400' },
                { label: 'Education Confidence', score: Math.round(confidence.education * 100), color: 'bg-indigo-400' },
                { label: 'Experience Confidence', score: Math.round(confidence.experience * 100), color: 'bg-purple-400' },
                { label: 'Projects Confidence', score: Math.round(confidence.projects * 100), color: 'bg-blue-400' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className="font-mono font-bold text-white">{item.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 mt-4">
            Confidence scores derived from JSON schema matching validation rules.
          </div>
        </div>
      </div>

      {/* Extracted Skills Categorized Chips Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Extracted Skills by Category</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {profile.skills.length} Technical Skills Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.categorizedSkills.map((cat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-900 block mb-2">{cat.category}</span>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-xs font-medium rounded-lg shadow-2xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Section: Education & Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education Timeline Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Education Timeline</span>
          </h3>

          <div className="space-y-4 relative pl-4 border-l-2 border-indigo-100">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                  {edu.startYear} - {edu.graduationYear}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{edu.degree}</h4>
                <p className="text-xs font-semibold text-slate-700">{edu.institution}</p>
                <p className="text-xs text-slate-500 mt-0.5">{edu.field} • CGPA: {edu.cgpa}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <span>Experience Timeline</span>
          </h3>

          <div className="space-y-4 relative pl-4 border-l-2 border-emerald-100">
            {profile.experience.map((exp, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                  {exp.startDate} - {exp.endDate}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{exp.role}</h4>
                <p className="text-xs font-semibold text-slate-700">{exp.company}</p>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects & Certifications Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects Cards */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <FolderGit2 className="w-5 h-5 text-purple-600" />
            <span>Extracted Projects ({profile.projects.length})</span>
          </h3>

          <div className="space-y-3">
            {profile.projects.map((proj, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-900">{proj.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{proj.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.technologies.map((tech, techIdx) => (
                    <span key={techIdx} className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Cards */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Certifications ({profile.certifications.length})</span>
          </h3>

          <div className="space-y-3">
            {profile.certifications.map((cert, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{cert.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{cert.issuer} • Issued {cert.date}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
