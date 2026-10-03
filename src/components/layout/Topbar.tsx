'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ApiKeyModal } from './ApiKeyModal';
import { 
  Bot, 
  Share2, 
  ShieldAlert, 
  FileText, 
  Key,
  Check
} from 'lucide-react';

export type ActiveTab = 'copilot' | 'graph' | 'compliance' | 'documents';

interface TopbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export function Topbar({ activeTab, setActiveTab }: TopbarProps) {
  const { complianceRules, groqApiKey } = useAppStore();
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  const openGapsCount = complianceRules.filter((r) => r.currentStatus === 'gap').length;
  const isKeyActive = Boolean(groqApiKey && groqApiKey.trim().length > 5);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'copilot', label: 'AI Copilot', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'graph', label: 'Knowledge Map', icon: <Share2 className="w-3.5 h-3.5" /> },
    { id: 'compliance', label: 'Compliance Gaps', icon: <ShieldAlert className="w-3.5 h-3.5" />, badge: openGapsCount },
    { id: 'documents', label: 'Plant Documents', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3.5 bg-black/40 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between gap-4">
        {/* Minimalist Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center font-mono font-bold text-white text-xs shadow-inner">
            N
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white tracking-wider text-sm uppercase">NEXUS·OT</span>
              <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">v2.0</span>
            </div>
            <p className="text-[11px] text-zinc-500 hidden md:block">Industrial Plant Operations Intelligence</p>
          </div>
        </div>

        {/* Clean Center Navigation Pills */}
        <nav className="flex items-center p-1 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? 'bg-black text-white' : 'bg-white/15 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Groq AI Status & Key Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-zinc-200 transition-all cursor-pointer"
            title="Configure Groq API Key"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="hidden sm:inline">Groq AI Active</span>
            <Key className="w-3 h-3 text-zinc-400 ml-1" />
          </button>
        </div>
      </header>

      <ApiKeyModal isOpen={isKeyModalOpen} onClose={() => setIsKeyModalOpen(false)} />
    </>
  );
}
