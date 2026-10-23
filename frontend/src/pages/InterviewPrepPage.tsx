import React, { useState, useEffect } from 'react';
import { BrainCircuit, BookOpen, Send, Sparkles, CheckCircle2, MessageSquare, Award, AlertCircle, RefreshCw, Briefcase } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useToast } from '../context/ToastContext';

interface JobPosting {
  job_id: string;
  job_title: string;
  company: string;
}

const FALLBACK_POSTINGS: JobPosting[] = [
  { job_id: 'JOB_001', job_title: 'Full Stack Developer Intern', company: 'Infosys Springboard' },
  { job_id: 'JOB_002', job_title: 'Frontend Developer Intern', company: 'TCS Research' },
  { job_id: 'JOB_003', job_title: 'AI / ML Engineer Intern', company: 'TechPulse Innovations' },
  { job_id: 'JOB_004', job_title: 'Data Analyst Intern', company: 'FinTech NextGen' }
];

export const InterviewPrepPage: React.FC = () => {
  const { profile } = useProfile();
  const { addToast } = useToast();

  const [postings, setPostings] = useState<JobPosting[]>(FALLBACK_POSTINGS);
  const [selectedJobId, setSelectedJobId] = useState<string>('JOB_001');
  const [loading, setLoading] = useState<boolean>(false);
  const [prepData, setPrepData] = useState<any>(null);

  // Mock Simulator State
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  useEffect(() => {
    fetchPostings();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchPrepPackage(selectedJobId);
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
      // Fallback
    }
    setPostings(FALLBACK_POSTINGS);
    setSelectedJobId(FALLBACK_POSTINGS[0].job_id);
  };

  const getFallbackPrepPackage = (jobId: string) => {
    const job = postings.find((j) => j.job_id === jobId) || FALLBACK_POSTINGS[0];
    return {
      job_id: job.job_id,
      job_title: job.job_title,
      company: job.company,
      domain: 'Software Development',
      total_questions: 5,
      questions: [
        {
          id: 'q_tech_1',
          category: 'Technical Questions',
          question: `Explain how you build RESTful microservices in Python using FastAPI and PostgreSQL.`,
          preparation_guidance: 'Structure your response using: Routing setup, Dependency Injection, Async ORM sessions, and error handling.',
          key_concepts_to_mention: ['FastAPI Router', 'Asyncpg / SQLAlchemy', 'Pydantic Schemas', 'JWT Auth']
        },
        {
          id: 'q_res_1',
          category: 'Resume-Based Questions',
          question: `Walk me through your experience at ${profile.experience[0]?.company || 'TechPulse Innovations'}. What was your biggest achievement?`,
          preparation_guidance: 'Use the STAR method (Situation, Task, Action, Result). Quantify latency improvements or code optimizations.',
          key_concepts_to_mention: ['API Latency Optimization', 'React Components', 'Agile Sprints']
        },
        {
          id: 'q_proj_1',
          category: 'Project-Based Questions',
          question: `In your project '${profile.projects[0]?.name || 'AI Resume Analyzer'}', how did you handle skill extraction schemas?`,
          preparation_guidance: 'Explain JSON schema validation, regex matching, and fallback handling for ambiguous resume formats.',
          key_concepts_to_mention: ['Schema Validation', 'Tokenization', 'Structured Output']
        },
        {
          id: 'q_role_1',
          category: 'Role-Specific Questions',
          question: `How would you approach designing a scalable candidate job matching algorithm for ${job.company}?`,
          preparation_guidance: 'Cover TF-IDF / vector embeddings, cosine similarity ranking, multi-factor weighting, and result pagination.',
          key_concepts_to_mention: ['Vector Embedding', 'Cosine Similarity', 'Multi-factor Scoring']
        },
        {
          id: 'q_hr_1',
          category: 'HR & General Questions',
          question: `Why are you interested in joining ${job.company} as a ${job.job_title}?`,
          preparation_guidance: 'Connect your personal technical growth goals with the company tech stack and product mission.',
          key_concepts_to_mention: ['Growth Mindset', 'Company Mission', 'Engineering Alignment']
        }
      ],
      revision_topics: [
        { topic: 'FastAPI Async Handlers & Middleware', reason: 'Core backend framework required for job role.', priority: 'High' },
        { topic: 'React Custom Hooks & State Management', reason: 'Frontend component state & optimization.', priority: 'High' },
        { topic: 'PostgreSQL Indexing & Query Plans', reason: 'Database efficiency in production.', priority: 'Medium' },
        { topic: 'System Design: REST API Architecture', reason: 'End-to-end design discussion.', priority: 'High' }
      ]
    };
  };

  const fetchPrepPackage = async (jobId: string) => {
    setLoading(true);
    setEvalResult(null);
    setUserAnswer('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/agents/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: profile.userId, job_id: jobId })
      });
      if (res.ok) {
        const data = await res.json();
        setPrepData(data);
        if (data.questions && data.questions.length > 0) {
          setSelectedQuestion(data.questions[0]);
        }
        setLoading(false);
        return;
      }
    } catch {
      // Fallback
    }

    const fb = getFallbackPrepPackage(jobId);
    setPrepData(fb);
    setSelectedQuestion(fb.questions[0]);
    setLoading(false);
  };

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) {
      addToast('warning', 'Please enter your answer before submitting.');
      return;
    }
    setEvaluating(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/agents/mock-interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: selectedQuestion.id,
          question_text: selectedQuestion.question,
          user_answer: userAnswer,
          job_title: prepData?.job_title || 'Software Intern'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setEvalResult(data);
        addToast('success', 'Mock answer evaluation complete!');
        setEvaluating(false);
        return;
      }
    } catch {
      // Fallback local evaluator simulation
    }

    const wordCount = userAnswer.trim().split(/\s+/).length;
    const fallbackEval = {
      question_id: selectedQuestion.id,
      question_text: selectedQuestion.question,
      user_answer: userAnswer,
      score: wordCount > 40 ? 92 : (wordCount > 15 ? 75 : 45),
      verdict: wordCount > 40 ? 'Outstanding' : (wordCount > 15 ? 'Solid' : 'Needs Enhancement'),
      feedback_summary: wordCount > 40
        ? 'Excellent, structured answer demonstrating practical domain experience and technical clarity!'
        : 'Good answer, but try adding specific technical keywords (e.g. FastAPI, Async/Await, PostgreSQL indexes).',
      strengths: ['Clear structure', 'Directly answered the question', 'Relevant tech stack mentioned'],
      areas_for_improvement: ['Quantify project impact with specific percentage gains or latency numbers.'],
      model_sample_answer: `For ${prepData?.job_title || 'this role'}, I approach implementation by: 1. Modular route architecture, 2. Async database connection pooling, and 3. Automated unit testing to ensure robust deployments.`
    };

    setEvalResult(fallbackEval);
    addToast('success', 'Mock answer evaluation complete!');
    setEvaluating(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4" />
            <span>Agent M3.3 — Interview Preparation Agent & Mock Simulator</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Role-Specific Interview Prep & Practice
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Generates 5 question categories (Technical, Resume, Project, Role, HR), revision checklists, and interactive mock interview evaluation with real-time feedback.
          </p>
        </div>

        {/* Job Dropdown Selector */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 min-w-[280px]">
          <label className="block text-[11px] font-bold text-indigo-200 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            Select Internship Posting:
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
            Interview Prep Agent is generating role-specific questions and revision checklist...
          </p>
        </div>
      ) : prepData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Revision Checklist & Question Bank */}
          <div className="lg:col-span-1 space-y-6">
            {/* Revision Checklist */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Pre-Interview Revision Checklist</span>
              </h3>
              <div className="space-y-2">
                {prepData.revision_topics.map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl space-y-1 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{item.topic}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions Bank List */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Question Bank ({prepData.questions.length})</span>
              </h3>
              <div className="space-y-2">
                {prepData.questions.map((q: any) => {
                  const isSelected = selectedQuestion?.id === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setSelectedQuestion(q);
                        setEvalResult(null);
                        setUserAnswer('');
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all border text-xs ${
                        isSelected
                          ? 'bg-indigo-50/90 border-indigo-300 text-indigo-900 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-indigo-600">{q.category}</span>
                      </div>
                      <p className="line-clamp-2">{q.question}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Mock Simulator */}
          <div className="lg:col-span-2 space-y-6">
            {selectedQuestion && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Interactive Mock Practice — {selectedQuestion.category}</span>
                  </div>
                  <h2 className="text-base md:text-lg font-extrabold text-slate-900">
                    "{selectedQuestion.question}"
                  </h2>
                  <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-medium">
                    💡 <strong>Strategy:</strong> {selectedQuestion.preparation_guidance}
                  </div>
                </div>

                {/* User Input Area */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Type your answer to practice:
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Type how you would answer this question in a live technical interview..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full text-xs sm:text-sm font-sans text-slate-900 bg-slate-50 rounded-2xl p-4 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleEvaluateAnswer}
                      disabled={evaluating || !userAnswer.trim()}
                      className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      {evaluating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Evaluating...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Answer for AI Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI Feedback & Evaluation Result Card */}
                {evalResult && (
                  <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-3">
                        <Award className="w-6 h-6 text-amber-400" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-indigo-300 block">AI Mock Score</span>
                          <span className="text-xl font-black text-white">{evalResult.score} / 100 ({evalResult.verdict})</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {evalResult.feedback_summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                        </span>
                        <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
                          {evalResult.strengths.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                        <span className="font-bold text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Key Improvements
                        </span>
                        <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
                          {evalResult.areas_for_improvement.map((imp: string, i: number) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Model Answer */}
                    <div className="bg-indigo-950 p-4 rounded-xl border border-indigo-800 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-indigo-300 block">Ideal Model Answer</span>
                      <p className="text-xs text-slate-200 italic leading-relaxed">
                        "{evalResult.model_sample_answer}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
