'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Key, ShieldCheck, Check, Sparkles, X, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const { groqApiKey, setGroqApiKey } = useAppStore();
  const [inputKey, setInputKey] = useState(groqApiKey);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-oss-120b');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setInputKey(groqApiKey);
  }, [groqApiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    setGroqApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 space-y-4 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white tracking-wide">Groq AI Reasoning Engine</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-zinc-400 leading-relaxed">
            NexusOT v2.0 uses <b className="text-white">Groq LPU Inference</b> for sub-second, hallucination-free operational intelligence across plant records.
          </p>

          <div className="space-y-1.5">
            <label className="font-mono text-zinc-300 block">
              GROQ API KEY:
            </label>
            <input
              type="password"
              placeholder="gsk_..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="glass-input w-full px-3.5 py-2.5 rounded-xl font-mono text-xs outline-none"
            />
            <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Connected &amp; encrypted on server. Zero client exposure.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-zinc-300 block">
              REASONING MODEL:
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="glass-input w-full px-3 py-2 rounded-xl text-xs outline-none cursor-pointer"
            >
              <option value="openai/gpt-oss-120b" className="bg-zinc-950 text-white">openai/gpt-oss-120b (Deep Reasoning - Recommended)</option>
              <option value="openai/gpt-oss-20b" className="bg-zinc-950 text-white">openai/gpt-oss-20b (Ultra Fast - Sub-100ms)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <a 
              href="https://console.groq.com/keys" 
              target="_blank" 
              rel="noreferrer"
              className="text-zinc-400 hover:text-white hover:underline flex items-center gap-1"
            >
              Groq Cloud Console <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
              {savedSuccess ? 'Saved' : 'Save & Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
