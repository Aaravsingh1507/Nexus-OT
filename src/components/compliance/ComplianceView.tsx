'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  ArrowRight,
  Filter
} from 'lucide-react';

export function ComplianceView() {
  const { complianceRules, updateComplianceStatus, openDrawer } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<'all' | 'gap' | 'compliant'>('all');

  const gapsCount = complianceRules.filter((r) => r.currentStatus === 'gap').length;
  const compliantCount = complianceRules.filter((r) => r.currentStatus === 'compliant').length;

  const filteredRules = complianceRules.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.currentStatus === filterStatus;
  });

  const handleExportAuditPackage = () => {
    const auditPayload = {
      facility: 'Unit-3 Coke Oven Battery',
      generatedAt: new Date().toISOString(),
      summary: {
        totalRulesAudited: complianceRules.length,
        openGaps: gapsCount,
        compliant: compliantCount
      },
      auditRecords: complianceRules.map((rule) => ({
        regulation: rule.regulation,
        clause: rule.clauseNumber,
        requirement: rule.requirement,
        status: rule.currentStatus.toUpperCase(),
        evidence: rule.evidenceSummary,
        suggestedAction: rule.suggestedAction
      }))
    };

    const blob = new Blob([JSON.stringify(auditPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEXUS-OT-Compliance-Report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-wide">
            Safety &amp; Compliance Gap Radar
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Continuous cross-check of plant maintenance against OISD standards, The Factories Act 1948, and OEM limits.
          </p>
        </div>

        <button
          onClick={handleExportAuditPackage}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Compliance Report</span>
        </button>
      </div>

      {/* Minimal Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-2xl font-bold font-mono text-white">{gapsCount}</span>
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-zinc-200" />
            <span>Open Safety Gaps</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-2xl font-bold font-mono text-white">{compliantCount}</span>
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Compliant Items</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1 col-span-2 sm:col-span-1">
          <span className="text-2xl font-bold font-mono text-white">60 Days</span>
          <div className="text-xs text-zinc-400">
            <span>Earliest Deadline (CB-204)</span>
          </div>
        </div>
      </div>

      {/* Filter Selector */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-zinc-500 font-mono text-[11px] mr-1">VIEW:</span>
        {[
          { key: 'all', label: 'All Requirements' },
          { key: 'gap', label: 'Action Required (Gaps)' },
          { key: 'compliant', label: 'Compliant' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key as any)}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              filterStatus === tab.key
                ? 'bg-white text-black font-semibold'
                : 'glass-button text-zinc-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Simple, Readable Checklist Cards */}
      <div className="space-y-3 pb-8">
        {filteredRules.map((rule) => {
          const isGap = rule.currentStatus === 'gap';

          return (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl transition-all ${
                isGap
                  ? 'glass-panel border-white/20 bg-white/[0.04]'
                  : 'glass-card border-white/[0.06]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {rule.regulation} · {rule.clauseNumber}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      Target: {rule.applicableTo.join(', ')}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">
                    {rule.requirement}
                  </h3>
                </div>

                <div className="shrink-0">
                  <span
                    className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full uppercase inline-flex items-center gap-1.5 ${
                      isGap
                        ? 'bg-white text-black font-bold'
                        : 'bg-white/10 text-zinc-300 border border-white/15'
                    }`}
                  >
                    {isGap ? <ShieldAlert className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {isGap ? 'Action Required' : 'Compliant'}
                  </span>
                </div>
              </div>

              {/* Evidence */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-zinc-300 space-y-1 my-3">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Verified Physical Evidence:</span>
                <p className="leading-relaxed">{rule.evidenceSummary}</p>
                {rule.suggestedAction && (
                  <div className="text-zinc-200 text-xs pt-1 flex items-start gap-1 font-mono">
                    <ArrowRight className="w-3 h-3 text-white shrink-0 mt-0.5" />
                    <span><b>Required Fix:</b> {rule.suggestedAction}</span>
                  </div>
                )}
              </div>

              {/* Document links */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-mono text-zinc-500">Sources:</span>
                  {rule.evidenceDocIds.map((docId) => (
                    <button
                      key={docId}
                      onClick={() => openDrawer(docId)}
                      className="text-xs font-mono text-zinc-300 hover:text-white underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{docId}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-zinc-500" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => updateComplianceStatus(rule.id, isGap ? 'compliant' : 'gap')}
                  className="text-[11px] font-mono text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  Mark as {isGap ? 'Resolved' : 'Gap'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
