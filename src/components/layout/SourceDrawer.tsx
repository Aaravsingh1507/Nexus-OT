'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { X, FileText, MapPin, Calendar, Layers } from 'lucide-react';

export function SourceDrawer() {
  const { drawerDocId, closeDrawer, documents } = useAppStore();

  if (!drawerDocId) return null;

  const doc = documents.find((d) => d.id === drawerDocId);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] md:w-[460px] glass-panel bg-black/90 border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-200 ease-in-out backdrop-blur-2xl">
      {/* Drawer Header */}
      <div className="flex items-start justify-between p-5 border-b border-white/[0.08]">
        <div className="space-y-1 pr-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/15 font-semibold">
              {doc?.type.replace('_', ' ')}
            </span>
            <span className="text-xs font-mono text-zinc-300 font-bold">
              TAG: {doc?.tag}
            </span>
          </div>
          <h2 className="text-base font-semibold text-white tracking-wide leading-snug">
            {doc?.title || 'Source Document'}
          </h2>
        </div>
        <button
          onClick={closeDrawer}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Metadata Bar */}
      <div className="px-5 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-zinc-300" />
          <span>{doc?.facility}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span>{doc?.dateAdded}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-zinc-300" />
          <span>{doc?.chunks.length} Chunks</span>
        </div>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {doc?.summary && (
          <div className="p-3.5 rounded-xl glass-card text-xs text-zinc-300 leading-relaxed border border-white/[0.08]">
            <b className="text-white block mb-1 font-mono uppercase tracking-wider text-[11px]">Executive Summary:</b>
            {doc.summary}
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-white" />
            Verified Technical Excerpts
          </h3>

          {doc?.chunks.map((chunk, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl glass-card text-xs text-zinc-200 leading-relaxed border border-white/[0.06] hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5">
                <span>EXCERPT #{idx + 1}</span>
                <span className="text-white font-bold">{doc.tag}</span>
              </div>
              <p>{chunk}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
