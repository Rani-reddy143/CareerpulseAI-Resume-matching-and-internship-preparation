import React, { useState } from 'react';
import {
  Cpu,
  Bot,
  Search,
  Code,
  FileCode,
  Workflow
} from 'lucide-react';


export const ArchitecturePage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'diagram' | 'agents' | 'rag' | 'schema' | 'docs'>('diagram');

  const candidateSchemaJson = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CandidateProfile",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "userId": { "type": "string" },
    "fullName": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "phone": { "type": "string" },
    "location": { "type": "string" },
    "linkedin": { "type": "string" },
    "github": { "type": "string" },
    "portfolio": { "type": "string" },
    "education": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "degree": { "type": "string" },
          "institution": { "type": "string" },
          "field": { "type": "string" },
          "cgpa": { "type": "string" },
          "startYear": { "type": "string" },
          "graduationYear": { "type": "string" }
        }
      }
    },
    "skills": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "category": { "type": "string" }
        }
      }
    },
    "experience": { "type": "array" },
    "projects": { "type": "array" },
    "certifications": { "type": "array" },
    "careerPreferences": { "type": "object" },
    "resumeMetadata": { "type": "object" },
    "extractedResumeData": { "type": "object" },
    "profileCompletion": { "type": "integer", "minimum": 0, "maximum": 100 }
  },
  "required": ["id", "userId", "fullName", "email"]
}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Developer Documentation & Engineering Specifications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            System & Multi-Agent Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Enterprise SaaS design specifications for AI Candidate Understanding (M1), Multi-Agent Orchestration, RAG Pipeline Retrieval, and Pydantic Profile Schemas.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs flex flex-wrap gap-2">
        {[
          { id: 'diagram', label: 'System Diagram', icon: Workflow },
          { id: 'agents', label: 'Multi-Agent Flow', icon: Bot },
          { id: 'rag', label: 'RAG Pipeline', icon: Search },
          { id: 'schema', label: 'Candidate Schema', icon: Code },
          { id: 'docs', label: 'Technical Docs', icon: FileCode }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: System Architecture Diagram */}
      {activeSubTab === 'diagram' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Full Stack End-to-End Flow</h3>
            <p className="text-xs text-slate-500">Visual mapping of request boundaries from client to LLM Services.</p>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 w-full md:w-44">
                <span className="text-indigo-400 font-bold block mb-1">Frontend Layer</span>
                <span className="text-slate-300 text-[11px]">Vite + React + TS</span>
                <span className="text-[10px] text-slate-500 block mt-1">Tailwind CSS</span>
              </div>
              <span className="text-indigo-400 font-bold">➔</span>
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 w-full md:w-44">
                <span className="text-emerald-400 font-bold block mb-1">Backend API</span>
                <span className="text-slate-300 text-[11px]">Python FastAPI</span>
                <span className="text-[10px] text-slate-500 block mt-1">Pydantic Router</span>
              </div>
              <span className="text-indigo-400 font-bold">➔</span>
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 w-full md:w-44">
                <span className="text-purple-400 font-bold block mb-1">Resume Service</span>
                <span className="text-slate-300 text-[11px]">PDF/DOCX Extraction</span>
                <span className="text-[10px] text-slate-500 block mt-1">LLM JSON Parser</span>
              </div>
              <span className="text-indigo-400 font-bold">➔</span>
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 w-full md:w-44">
                <span className="text-amber-400 font-bold block mb-1">Vector DB & Storage</span>
                <span className="text-slate-300 text-[11px]">FAISS / Postgres</span>
                <span className="text-[10px] text-slate-500 block mt-1">Embedding Index</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              <span className="text-emerald-400 font-bold">Data Flow: </span>
              User uploads resume (PDF/DOCX) ➔ FastAPI Service parses raw text ➔ Prompt sent to LLM ➔ Structured CandidateProfile JSON returned ➔ Profile completion calculated ➔ Extracted skills mapped to Candidate DB.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Multi-Agent Architecture */}
      {activeSubTab === 'agents' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Multi-Agent Orchestrator Framework</h3>
            <p className="text-xs text-slate-500">Central Career Assistant routing to 5 specialized subagents.</p>
          </div>

          {/* Central Orchestrator Visual Box */}
          <div className="p-6 bg-slate-900 text-white rounded-3xl text-center space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto text-white shadow-lg">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold">Career Assistant (Central Orchestrator)</h4>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">
              Evaluates incoming user context & intent, dispatches tasks to subagents, and synthesizes unified recommendations.
            </p>

            {/* Agent Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-4 text-left">
              {[
                { name: 'Resume Agent', desc: 'Parses resume & builds structured Candidate Profile', status: 'M1 Active' },
                { name: 'Job Match Agent', desc: 'Calculates weighted match score vs Internship JDs', status: 'M2 Ready' },
                { name: 'Skill Gap Agent', desc: 'Identifies missing skills & learning resources', status: 'M2 Ready' },
                { name: 'Cover Letter Agent', desc: 'Generates company tailored cover letters', status: 'M3 Ready' },
                { name: 'Interview Agent', desc: 'Conducts interactive AI mock interview drills', status: 'M4 Ready' }
              ].map((agent, idx) => (
                <div key={idx} className="p-3 bg-slate-800 rounded-2xl border border-slate-700 text-xs">
                  <span className="text-[10px] font-semibold text-emerald-400 block mb-1">{agent.status}</span>
                  <h5 className="font-bold text-white mb-1">{agent.name}</h5>
                  <p className="text-[11px] text-slate-400 leading-tight">{agent.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RAG Architecture */}
      {activeSubTab === 'rag' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Retrieval-Augmented Generation (RAG) Pipeline</h3>
            <p className="text-xs text-slate-500">Retrieves real-time internship descriptions, interview questions, and learning resources.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">1. Knowledge Ingestion</span>
              <h4 className="text-xs font-bold text-slate-900">Internship JDs & Tech Docs</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Raw internship descriptions, skill requirements, and interview question banks chunked and indexed.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">2. Vector Search</span>
              <h4 className="text-xs font-bold text-slate-900">FAISS / Chroma Vector DB</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates dense embeddings for candidate skills and retrieves top-k relevant job context snippets.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">3. Augmented Prompt</span>
              <h4 className="text-xs font-bold text-slate-900">Context-Aware LLM Response</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Combines Candidate Profile + Vector Context into LLM prompt to generate grounded, hallucination-free advice.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: JSON Schema Explorer */}
      {activeSubTab === 'schema' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">CandidateProfile JSON Schema Specification</h3>
              <p className="text-xs text-slate-500">Formal Pydantic data contract powering backend profile persistence.</p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              schema_v1.json
            </span>
          </div>

          <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 max-h-[460px]">
            <pre>{candidateSchemaJson}</pre>
          </div>
        </div>
      )}

      {/* TAB 5: Technical Documentation & Requirements Report */}
      {activeSubTab === 'docs' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Milestone 1 Developer Documentation</h3>
            <p className="text-xs text-slate-500">Comprehensive technical summary covering system design decisions and trade-offs.</p>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-1">M1.1 Internship Application Workflow</h4>
              <p>
                The platform streamlines candidate onboarding by combining a multi-step profile wizard with instant LLM resume intelligence. Extracted skills are normalized into categorized tags (Programming, AI/ML, Web Dev, Cloud, Soft Skills) and stored inside a normalized database structure.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-1">M1.2 Scalable Multi-Agent Framework</h4>
              <p>
                To avoid monolithic AI prompts, responsibilities are delegated to dedicated specialized agents. The central Career Assistant orchestrates query routing, ensuring future additions (Cover Letter Agent, Interview Mock Drills) plug in without breaking frontend contracts.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-1">M1.3 Security & API Best Practices</h4>
              <p>
                All API keys are isolated within server-side environment variables. Uploaded PDF/DOCX files undergo strict size validation (≤ 5MB) and type checking before parsing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
