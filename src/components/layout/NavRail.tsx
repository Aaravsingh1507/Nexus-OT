'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { 
  Bot, 
  Share2, 
  ShieldCheck, 
  FileText, 
  AlertTriangle 
} from 'lucide-react';

export type ActiveTab = 'copilot' | 'graph' | 'compliance' | 'documents' | 'incidents';

interface NavRailProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export function NavRail({ activeTab, setActiveTab }: NavRailProps) {
  const { complianceRules, documents, incidents } = useAppStore();

  const openGapsCount = complianceRules.filter((r) => r.currentStatus === 'gap').length;

  const navItems: { id: ActiveTab; label: string; index: string; icon: React.ReactNode; badge?: number | string; badgeColor?: string }[] = [
    {
      id: 'copilot',
      label: 'Knowledge Copilot',
      index: '01',
      icon: <Bot className="w-4 h-4" />
    },
    {
      id: 'graph',
      label: 'Knowledge Graph',
      index: '02',
      icon: <Share2 className="w-4 h-4" />
    },
    {
      id: 'compliance',
      label: 'Compliance Matrix',
      index: '03',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: openGapsCount,
      badgeColor: openGapsCount > 0 ? 'bg-[#D98E3F]/20 text-[#D98E3F] border border-[#D98E3F]/40' : 'bg-[#4E9A68]/20 text-[#4E9A68]'
    },
    {
      id: 'documents',
      label: 'Document Corpus',
      index: '04',
      icon: <FileText className="w-4 h-4" />,
      badge: documents.length
    },
    {
      id: 'incidents',
      label: 'Safety & Incidents',
      index: '05',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: incidents.length
    }
  ];

  return (
    <nav className="w-full sm:w-56 bg-[#161A1E] border-b sm:border-b-0 sm:border-r border-[#262E36] shrink-0 select-none flex sm:flex-col overflow-x-auto sm:overflow-visible">
      <div className="flex sm:flex-col w-full py-2 sm:py-4 px-2 sm:px-0 gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded-lg sm:rounded-none text-xs font-mono tracking-wider transition-all text-left whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#4A93BE]/12 text-[#4A93BE] sm:border-l-3 sm:border-[#4A93BE] font-semibold'
                  : 'text-[#8A96A3] hover:text-white hover:bg-[#1E242A]'
              }`}
            >
              <span className="text-[11px] text-[#5C6772] font-normal hidden sm:inline">{item.index}</span>
              <span className={isActive ? 'text-[#4A93BE]' : 'text-[#7D8B98]'}>{item.icon}</span>
              <span className="truncate">{item.label}</span>

              {item.badge !== undefined && (
                <span
                  className={`ml-auto text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    item.badgeColor || 'bg-[#222A32] text-[#8695A5]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
