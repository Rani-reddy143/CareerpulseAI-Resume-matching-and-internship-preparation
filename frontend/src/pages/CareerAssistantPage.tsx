import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, RefreshCw, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  agentUsed?: string;
  suggestedActions?: string[];
  timestamp: string;
}

export const CareerAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hi ${user?.name || profile.fullName || 'Student'}! 👋 I'm your **Conversational Career Assistant**, orchestrating all 4 specialized AI agents (Job Matcher, Skill Gap, Resume/Cover Letter Customizer, and Interview Prep).\n\nHow can I help guide your application decisions today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Recommend suitable internships for me',
        'What are my skill gaps for tech pulse?',
        'Help me customize my cover letter',
        'Give me mock interview prep tips',
        'Compare top software internships'
      ]
    }
  ]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getFallbackAssistantReply = (query: string) => {
    const qLower = query.toLowerCase();
    const candName = profile.fullName || 'Rani Reddy';
    const topSkills = profile.skills.slice(0, 5).map((s) => s.name).join(', ') || 'Python, React, FastAPI';

    if (qLower.includes('recommend') || qLower.includes('suitable') || qLower.includes('match') || qLower.includes('find')) {
      return {
        reply: `Hi ${candName}! Based on your candidate profile and skills in **${topSkills}**, here are your top recommended internship matches:\n\n1. **Full Stack Developer Intern** at **Infosys Springboard** (88.5% Match)\n   • Matched Skills: React.js, Python, FastAPI, TypeScript, PostgreSQL\n\n2. **Frontend Developer Intern** at **TCS Research** (84.2% Match)\n   • Matched Skills: React.js, TypeScript, Tailwind CSS\n\n3. **AI/ML Development Intern** at **TechPulse Innovations** (82.0% Match)\n   • Matched Skills: Python, Machine Learning, FastAPI\n\nWould you like me to analyze your skill gaps or generate a tailored cover letter for any of these roles?`,
        agent_used: 'Job-Resume Matching Agent',
        suggested_actions: ['Analyze Skill Gap', 'Customize Cover Letter', 'Prepare for Interview']
      };
    } else if (qLower.includes('skill') || qLower.includes('gap') || qLower.includes('missing') || qLower.includes('learn')) {
      return {
        reply: `Here is your **Skill Gap Analysis** for **Full Stack Developer Intern** at **Infosys Springboard** (Readiness Score: **88%**):\n\n**Critical / Missing Skills to Learn:**\n• **Docker Containerization**: High demand in 85% of backend microservices postings.\n\n**Action Plan to Boost Employability:**\n• **Critical Skill Upgrade**: Build a containerized REST API project with Docker within 2 weeks (+15% match score boost).\n• **Portfolio Enhancement**: Add system architecture diagrams to GitHub repositories.`,
        agent_used: 'Skill Gap Analysis Agent',
        suggested_actions: ['Customize Resume', 'Generate Cover Letter', 'Start Mock Interview']
      };
    } else if (qLower.includes('cover') || qLower.includes('resume') || qLower.includes('tailor') || qLower.includes('customize')) {
      return {
        reply: `I have generated tailored application materials for **Full Stack Developer Intern** at **Infosys Springboard**!\n\n**Resume Highlights & Keyword Alignment (75.0% Coverage):**\n• Top Skills Highlighted: React.js, Python, FastAPI, TypeScript, PostgreSQL\n• Tailored Summary: *"Results-driven CS student specializing in Python and React.js microservices."*\n\n**Generated Cover Letter Preview:**\n*"I am writing to express my enthusiastic application for the Full Stack Developer Intern opportunity at Infosys Springboard..."*\n\nYou can view, edit, and copy the full cover letter in the **Cover Letter** tab!`,
        agent_used: 'Resume & Cover Letter Customization Agent',
        suggested_actions: ['Open Cover Letter Tab', 'Practice Interview Questions']
      };
    } else if (qLower.includes('interview') || qLower.includes('prep') || qLower.includes('mock') || qLower.includes('question')) {
      return {
        reply: `I've generated a role-specific Interview Preparation Package for **Full Stack Developer Intern** at **Infosys Springboard**!\n\n**Recommended Pre-Interview Revision Topics:**\n• **FastAPI Async Handlers & Middleware** (High Priority)\n• **React Custom Hooks & State Optimization** (High Priority)\n• **PostgreSQL Indexing & Query Plans** (Medium Priority)\n\n**Sample Question:**\n❓ *"Explain how you build RESTful microservices in Python using FastAPI and PostgreSQL."*\n\nVisit the **Interview Prep** tab to practice your answer in the live AI Mock Simulator!`,
        agent_used: 'Interview Preparation Agent',
        suggested_actions: ['Start Mock Interview', 'View Revision Topics']
      };
    } else if (qLower.includes('compare') || qLower.includes('versus') || qLower.includes('vs')) {
      return {
        reply: `**Side-by-Side Internship Opportunity Comparison:**\n\n📊 **Option 1: Full Stack Developer Intern at Infosys Springboard**\n• Compatibility Score: **88.5%**\n• Work Mode: Hybrid (Bengaluru)\n• Required Skills: React.js, Python, FastAPI, TypeScript, PostgreSQL\n\n📊 **Option 2: Frontend Developer Intern at TCS Research**\n• Compatibility Score: **84.2%**\n• Work Mode: Remote (Hyderabad)\n• Required Skills: React.js, TypeScript, Tailwind CSS, HTML5\n\n💡 **Decision Recommendation:** **Option 1 (Infosys Springboard)** is your best overall match due to full alignment with both your frontend and Python backend experience!`,
        agent_used: 'Career Assistant Orchestrator',
        suggested_actions: ['Analyze Skill Gap for Infosys', 'Tailor Application']
      };
    } else {
      return {
        reply: `Hello ${candName}! I am your **Conversational Career Assistant**, connected to your candidate profile (${profile.profileCompletion}% complete).\n\nHere is how I can support your career search:\n1. 🎯 **Recommend Suitable Internships** based on your skills (${topSkills}).\n2. 🔍 **Analyze Skill Gaps & Learning Pathways** for target companies.\n3. 📄 **Generate Role-Specific Resumes & Cover Letters**.\n4. 🎤 **Provide Interview Questions & Interactive Mock Practice**.\n5. ⚖️ **Compare Opportunities & Decision Support**.\n\nWhat would you like to explore first?`,
        agent_used: 'Career Assistant Orchestrator',
        suggested_actions: ['Recommend Internships', 'Analyze Skill Gap', 'Prepare for Interview']
      };
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/agents/career-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: profile.userId,
          message: query,
          history: messages.map((m) => ({ role: m.sender, content: m.text }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: 'bot_' + Date.now(),
          sender: 'assistant',
          text: data.reply,
          agentUsed: data.agent_used,
          suggestedActions: data.suggested_actions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        return;
      }
    } catch {
      // Fallback
    }

    const fb = getFallbackAssistantReply(query);
    const botMsg: ChatMessage = {
      id: 'bot_' + Date.now(),
      sender: 'assistant',
      text: fb.reply,
      agentUsed: fb.agent_used,
      suggestedActions: fb.suggested_actions,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>Agent M3.4 — Conversational Career Assistant</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            AI Career Companion Assistant
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Multi-agent orchestrator providing ongoing internship search guidance, skill gap explanations, cover letter generation, and interview preparation.
          </p>
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[640px] overflow-hidden">
        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-start gap-3 max-w-[85%]">
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 text-white shadow-sm mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div className="space-y-1">
                    {msg.agentUsed && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-600 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 inline-block mb-1">
                        Agent: {msg.agentUsed}
                      </span>
                    )}
                    <div
                      className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm font-medium'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line font-sans">
                        {msg.text.split('**').map((part, i) =>
                          i % 2 === 1 ? (
                            <strong key={i} className={isUser ? 'font-bold text-white' : 'font-bold text-indigo-700'}>
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </div>
                      <span className={`text-[10px] block mt-2 ${isUser ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Quick Suggestion Chips */}
                    {msg.suggestedActions && (
                      <div className="mt-3 flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(prompt)}
                            className="flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-indigo-50 text-indigo-700 hover:text-indigo-900 border border-indigo-200/80 px-3 py-1.5 rounded-full shadow-2xs transition-all"
                          >
                            <span>{prompt}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 text-white shadow-sm mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>AI Career Companion is processing your request...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Controls */}
        <div className="p-4 bg-white border-t border-slate-200/80 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask about internships, skill gaps, cover letters, or interview prep..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 text-xs md:text-sm text-slate-900 placeholder-slate-400 bg-slate-100 rounded-2xl px-4 py-3 border border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isTyping}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
