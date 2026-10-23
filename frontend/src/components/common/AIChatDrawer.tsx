import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import type { ChatMessage } from '../../types';
import { AI_SUGGESTED_PROMPTS } from '../../data/mockData';


export const AIChatDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hi ${user?.name || 'Rani'}! 👋 I'm your **AI Career Companion**. How can I help you with internships, skills, or interview prep today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: AI_SUGGESTED_PROMPTS
    }
  ]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: data.suggested_actions || ['Recommend Internships', 'Analyze Skill Gap', 'Prepare for Interview']
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        return;
      }
    } catch {
      // Fallback
    }

    let fallbackReply = `I'm analyzing your candidate profile (${profile.profileCompletion}% complete).\n\nBased on your top skills (Python, React.js, FastAPI, Machine Learning), I recommend checking the **Skill Gap** and **Interview Prep** tabs in your dashboard!`;
    const qLower = query.toLowerCase();
    if (qLower.includes('internship') || qLower.includes('suitable') || qLower.includes('recommend')) {
      fallbackReply = `Based on your profile skills in **Python, React.js, FastAPI, and Machine Learning**, here are your top recommended internships:\n1. **Full Stack Developer Intern** — Infosys Springboard (88.5% Match)\n2. **Frontend Developer Intern** — TCS Research (84.2% Match)\n3. **AI/ML Development Intern** — TechPulse Innovations (82.0% Match)\n\nWould you like me to analyze your skill gaps for any of these roles?`;
    } else if (qLower.includes('skill') || qLower.includes('gap') || qLower.includes('missing')) {
      fallbackReply = `Analyzing your target role (**Full Stack Developer Intern**):\n- **Current Strengths**: Python, React, FastAPI, PostgreSQL, Git.\n- **Top Recommended Addition**: **Docker Containerization** (High Demand in 85% of backend postings).\n\nCompleting a Docker project will raise your Internship Match Score from **85% to 96%**!`;
    } else if (qLower.includes('interview') || qLower.includes('prep') || qLower.includes('mock')) {
      fallbackReply = `Awesome! I have prepared a mock interview package based on your project **AI Resume & Skill Gap Analyzer**:\n- **Question 1**: *How do you build RESTful microservices using FastAPI and PostgreSQL under load?*\n- **Question 2**: *How do you structure JSON schemas for structured extraction?*\n\nVisit the **Interview Prep** tab to take the live AI Mock Interview!`;
    } else if (qLower.includes('cover') || qLower.includes('resume') || qLower.includes('tailor')) {
      fallbackReply = `I've generated a role-specific cover letter and resume section prioritization for **Infosys Springboard**! You can view and edit the text in the **Cover Letter** tab.`;
    }

    const botMsg: ChatMessage = {
      id: 'bot_' + Date.now(),
      sender: 'assistant',
      text: fallbackReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: ['Recommend Internships', 'Analyze Skill Gap', 'Prepare for Interview']
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group pulse-glow"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-wide">Ask AI Career Assistant</span>
          <Sparkles className="w-4 h-4 text-purple-200 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] h-[560px] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">AI Career Assistant</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-slate-300 font-medium">Orchestrator Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {!isUser && (
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 text-white mb-1 shadow-xs">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs'
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
                      <span
                        className={`text-[9px] block mt-1 text-right ${
                          isUser ? 'text-indigo-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                    {isUser && (
                      <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-white mb-1 shadow-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Suggested Quick Prompt Chips */}
                  {msg.suggestedActions && (
                    <div className="mt-3 flex flex-wrap gap-1.5 pl-8">
                      {msg.suggestedActions.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="flex items-center gap-1 text-[10px] font-medium bg-white hover:bg-indigo-50 text-indigo-700 hover:text-indigo-900 border border-indigo-200/80 px-2.5 py-1 rounded-full shadow-2xs transition-all"
                        >
                          <span>{prompt}</span>
                          <ChevronRight className="w-3 h-3 text-indigo-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-8">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>AI Career Companion is typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Controls */}
          <div className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about your career..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 text-xs text-slate-900 placeholder-slate-400 bg-slate-100 rounded-xl px-3.5 py-2.5 border border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
