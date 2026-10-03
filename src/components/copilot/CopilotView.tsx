'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Bot, 
  RotateCcw, 
  ChevronDown, 
  ChevronRight, 
  ExternalLink,
  Sparkles,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

const STARTER_PROMPTS = [
  {
    title: "Gas Alarm Root Cause",
    subtitle: "Why did the Feb 2025 gas alarm trigger near GL-12, and is CB-204 compliant now?",
    query: "Why did the gas alarm trigger near GL-12 in February 2025, and is CB-204 currently compliant?"
  },
  {
    title: "CB-204 Blower Gasket Status",
    subtitle: "What is the replacement interval and current wear condition on the CB-204 gasket?",
    query: "What is the gasket replacement interval for the CB-204 blower and when was it last serviced?"
  },
  {
    title: "Hot Work Permit Safety",
    subtitle: "Does our permit process check for simultaneous maintenance windows before approval?",
    query: "Does our hot work permit process check for active maintenance windows before approval per OISD?"
  },
  {
    title: "Statutory Law Checks",
    subtitle: "What inspection requirements apply to gas line GL-12 under The Factories Act Section 31?",
    query: "What statutory testing and inspection requirements apply to gas line GL-12 under The Factories Act 1948?"
  }
];

export function CopilotView() {
  const { 
    messages, 
    addMessage, 
    clearChat, 
    isChatLoading, 
    setIsChatLoading, 
    openDrawer,
    documents,
    groqApiKey 
  } = useAppStore();

  const [input, setInput] = useState('');
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatLoading]);

  const toggleThinking = (msgId: string) => {
    setExpandedThinking(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isChatLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addMessage(userMessage);
    if (!queryText) setInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          customApiKey: groqApiKey,
          documents
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error');
      }

      const botMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant' as const,
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || [],
        thinkingSteps: data.thinkingSteps || [],
        modelUsed: data.modelUsed
      };

      addMessage(botMessage);
    } catch (err: any) {
      console.error(err);
      addMessage({
        id: `assistant-err-${Date.now()}`,
        role: 'assistant' as const,
        content: `**Operational Alert:** Reasoning connection encountered an issue: ${err.message}. Retaining retrieval pipeline fallback.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  const isInitialState = messages.length <= 1;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-4 sm:px-6 relative">
      {/* Top action row */}
      <div className="flex items-center justify-between py-3 border-b border-white/[0.06] text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-white" />
          <span className="font-medium text-white">Plant Intelligence Copilot</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-500">Cross-referencing logs, drawings &amp; safety codes</span>
        </div>
        {!isInitialState && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {/* Starter Hero for Simple Onboarding */}
        {isInitialState && (
          <div className="py-6 space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                How can I assist your plant operations today?
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                NEXUS-OT unifies maintenance logs, safety SOPs, P&amp;ID drawings, and compliance regulations. Select a common inquiry below or ask anything.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt.query)}
                  className="glass-card p-4 rounded-xl text-left hover:border-white/20 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white group-hover:text-zinc-200">{prompt.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{prompt.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Log */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const hasThinking = msg.thinkingSteps && msg.thinkingSteps.length > 0;
          const isExpanded = Boolean(expandedThinking[msg.id]);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <span className="text-[11px] font-mono text-zinc-500 px-1">
                {isUser ? 'YOU' : 'NEXUS COPILOT'} · {msg.timestamp}
              </span>

              <div
                className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed max-w-[95%] sm:max-w-[85%] ${
                  isUser
                    ? 'bg-white/[0.08] text-white border border-white/[0.14] shadow-sm'
                    : 'glass-panel text-zinc-200 shadow-lg'
                }`}
              >
                {/* Thinking process accordion */}
                {!isUser && hasThinking && (
                  <div className="mb-3 pb-2.5 border-b border-white/[0.08]">
                    <button
                      onClick={() => toggleThinking(msg.id)}
                      className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer select-none"
                    >
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      <span>Verification Trace ({msg.thinkingSteps?.length} steps)</span>
                      {msg.modelUsed && <span className="text-zinc-600">· {msg.modelUsed}</span>}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 pl-3 border-l border-white/20 space-y-1 text-xs font-mono text-zinc-400">
                        {msg.thinkingSteps?.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-white/60">›</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Markdown body */}
                <div className="prose prose-invert prose-sm max-w-none space-y-2">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0 text-zinc-200">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1 text-zinc-300">{children}</ul>,
                      li: ({ children }) => <li className="text-zinc-300">{children}</li>,
                      strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Citation Chips */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/[0.08]">
                    <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
                      Verified Plant Sources:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cite, i) => (
                        <button
                          key={i}
                          onClick={() => openDrawer(cite.docId)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3 text-zinc-400" />
                          <span>[{i + 1}] {cite.docTitle}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isChatLoading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl glass-panel max-w-xs text-xs text-zinc-400 font-mono">
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
            </div>
            <span>Reasoning over plant documents...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Glass Input */}
      <div className="sticky bottom-4 z-20 w-full pt-2 pb-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="glass-panel p-1.5 rounded-2xl flex items-center gap-2 shadow-2xl border border-white/15"
        >
          <input
            type="text"
            placeholder="Ask about equipment health, historical gas alarms, SOPs, or safety compliance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isChatLoading}
            className="flex-1 px-4 py-2.5 bg-transparent text-white text-sm outline-none placeholder-zinc-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isChatLoading}
            className="w-10 h-10 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            title="Submit Query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
