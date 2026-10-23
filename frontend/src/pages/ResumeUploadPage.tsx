import React, { useState, useRef } from 'react';
import type { ParsingStage } from '../context/ProfileContext';
import type { NavTab } from '../components/common/Sidebar';
import { useProfile } from '../context/ProfileContext';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  ChevronRight,
  Sparkles
} from 'lucide-react';


interface ResumeUploadPageProps {
  setActiveTab: (tab: NavTab) => void;
}

export const ResumeUploadPage: React.FC<ResumeUploadPageProps> = ({ setActiveTab }) => {
  const {
    profile,
    parsingStage,
    isParsing,
    parsingProgress,
    uploadAndParseResume,
    resetResume
  } = useProfile();

  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isResumeUploaded = profile.resumeMetadata?.parsingStatus === 'Completed';

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    const isDocx = file.name.endsWith('.pdf') || file.name.endsWith('.docx') || file.name.endsWith('.doc');

    if (!validTypes.includes(file.type) && !isDocx) {
      setErrorMessage('Invalid file format. Please upload a PDF or DOCX file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds 5 MB limit. Please select a smaller resume file.');
      return;
    }

    uploadAndParseResume(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  // Parsing visual stages pipeline
  const pipelineSteps: { stage: ParsingStage; label: string; desc: string }[] = [
    { stage: 'uploading', label: 'Resume Uploaded', desc: 'File safely uploaded to parser' },
    { stage: 'parsing_doc', label: 'Document Parsing', desc: 'Binary format structure validation' },
    { stage: 'text_extraction', label: 'Text Extraction', desc: 'Extracting raw resume text' },
    { stage: 'llm_analysis', label: 'LLM Analysis', desc: 'Generative AI token processing' },
    { stage: 'skill_extraction', label: 'Skill Extraction', desc: 'Categorizing technical skills' },
    { stage: 'experience_extraction', label: 'Experience Extraction', desc: 'Structuring employment timelines' },
    { stage: 'profile_structuring', label: 'Profile Structuring', desc: 'Building Pydantic Candidate Schema' },
    { stage: 'completed', label: 'Analysis Complete', desc: 'Extracted results ready for review' }
  ];

  const getStepStatus = (stepStage: ParsingStage) => {
    const stageOrder: ParsingStage[] = [
      'idle',
      'uploading',
      'parsing_doc',
      'text_extraction',
      'llm_analysis',
      'skill_extraction',
      'experience_extraction',
      'profile_structuring',
      'completed'
    ];
    const currentIndex = stageOrder.indexOf(parsingStage);
    const stepIndex = stageOrder.indexOf(stepStage);

    if (currentIndex > stepIndex || isResumeUploaded) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Resume Upload & Visual AI Parser
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated LLM skill extraction & structured profile synthesis.
          </p>
        </div>

        {isResumeUploaded && (
          <button
            onClick={() => setActiveTab('resume-analysis')}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <span>View Resume Analysis</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Upload Drop Zone Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        {/* Upload Zone (Visible if not parsing and not already uploaded or replacing) */}
        {!isParsing && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/60 shadow-lg scale-[1.005]'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Upload your resume
            </h3>
            <p className="text-xs font-medium text-slate-500 mb-4">
              Drag & drop your file here, or click to browse
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
              <span>PDF or DOCX</span>
              <span>•</span>
              <span>Maximum 5 MB</span>
            </div>
          </div>
        )}

        {/* Error Message Alert */}
        {errorMessage && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Live Visual AI Processing Flow */}
        {isParsing && (
          <div className="space-y-6 p-6 bg-slate-900 text-white rounded-3xl shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                <div>
                  <h4 className="text-sm font-bold text-white">AI is analyzing your resume...</h4>
                  <p className="text-xs text-slate-400">Extracting skills, education, experience and projects.</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                {parsingProgress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${parsingProgress}%` }}
              />
            </div>

            {/* Pipeline Visual Diagram Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {pipelineSteps.map((step, idx) => {
                const status = getStepStatus(step.stage);
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border text-xs transition-all ${
                      status === 'completed'
                        ? 'bg-slate-800/90 border-emerald-500/50 text-emerald-300'
                        : status === 'current'
                        ? 'bg-indigo-900/60 border-indigo-400 text-white pulse-glow'
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] opacity-70">Step 0{idx + 1}</span>
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : status === 'current' ? (
                        <RefreshCw className="w-3.5 h-3.5 text-indigo-300 animate-spin" />
                      ) : null}
                    </div>
                    <span className="font-bold block text-[11px] leading-tight">{step.label}</span>
                    <span className="text-[10px] block opacity-75 mt-0.5">{step.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Uploaded Resume Status Card */}
        {isResumeUploaded && !isParsing && (
          <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {profile.resumeMetadata?.fileName || 'Rani_Reddy_Resume_2026.pdf'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Uploaded: {profile.resumeMetadata?.uploadDate || 'Today'} •{' '}
                    {profile.resumeMetadata?.fileSize
                      ? `${(profile.resumeMetadata.fileSize / 1024 / 1024).toFixed(2)} MB`
                      : '2.45 MB'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Replace Resume
                </button>
                <button
                  onClick={resetResume}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Flow Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-800">Uploaded</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-800">Parsed</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-800">LLM Analyzed</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-emerald-900">Analysis Complete</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('resume-analysis')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>View Complete Resume Analysis</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
