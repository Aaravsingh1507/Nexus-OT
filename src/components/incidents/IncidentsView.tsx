'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { IncidentReport } from '@/types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Tag, 
  Calendar, 
  MapPin, 
  ArrowRight,
  X
} from 'lucide-react';

export function IncidentsView() {
  const { incidents, addIncident, addNode, addEdge } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<IncidentReport['severity']>('high');
  const [locationZone, setLocationZone] = useState('Zone GL-12 / Unit-3 Coke Oven Battery');
  const [equipmentTag, setEquipmentTag] = useState('');
  const [description, setDescription] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [correctiveActionsText, setCorrectiveActionsText] = useState('');

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newId = `inc-${Date.now()}`;
    const actions = correctiveActionsText
      .split('\n')
      .map((a) => a.trim())
      .filter((a) => a.length > 5);

    const newInc: IncidentReport = {
      id: newId,
      title,
      severity,
      status: 'open',
      locationZone,
      equipmentIds: equipmentTag ? [equipmentTag.toLowerCase()] : [],
      occurredAt: new Date().toISOString(),
      description,
      rootCause: rootCause || 'Under investigation by Shift Safety Officer.',
      correctiveActions: actions.length > 0 ? actions : ['Review associated SOP and inspect equipment.'],
      linkedRegulationIds: ['comp-1']
    };

    addIncident(newInc);

    // Add incident to knowledge graph
    addNode({
      id: newId,
      label: title.slice(0, 24) + '...',
      sub: `INCIDENT (${severity.toUpperCase()})`,
      type: 'incident',
      desc: description,
      sources: []
    });

    if (equipmentTag) {
      addEdge({
        id: `e-inc-${Date.now()}`,
        from: equipmentTag.toLowerCase().replace(/[^a-z0-9]/g, ''),
        to: newId,
        relationship: 'involved_in',
        label: `${severity} incident`
      });
    }

    // Reset & close
    setTitle('');
    setDescription('');
    setRootCause('');
    setCorrectiveActionsText('');
    setEquipmentTag('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#111417] overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252E37]">
        <div>
          <h2 className="text-base font-semibold text-white tracking-wide flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#D98E3F]" />
            Process Safety Near-Miss &amp; Incident Investigation Log
          </h2>
          <p className="text-xs text-[#8B97A4] mt-0.5">
            Track root causes, corrective action execution, and SIMOPS conflict history across plant zones.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D98E3F] hover:bg-[#C27C30] text-[#0C1013] font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Report Safety Event</span>
        </button>
      </div>

      {/* Incidents Feed */}
      <div className="space-y-4">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="p-5 rounded-xl bg-[#171B20] border border-[#2B3540] space-y-3.5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    inc.severity === 'critical'
                      ? 'bg-[#C85340]/20 text-[#C85340] border border-[#C85340]/40'
                      : inc.severity === 'high'
                      ? 'bg-[#D98E3F]/20 text-[#D98E3F] border border-[#D98E3F]/40'
                      : 'bg-[#4A93BE]/20 text-[#4A93BE] border border-[#4A93BE]/40'
                  }`}
                >
                  {inc.severity} SEVERITY
                </span>
                <span className="text-xs font-mono text-[#8C98A4]">
                  {new Date(inc.occurredAt).toLocaleString()}
                </span>
                <span className="text-xs font-mono text-[#5C8A6B] flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {inc.locationZone}
                </span>
              </div>

              <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-[#1F262E] text-[#9AA3AC] border border-[#2F3944] w-fit">
                Status: {inc.status}
              </span>
            </div>

            <h3 className="text-base font-semibold text-white">
              {inc.title}
            </h3>

            <p className="text-xs text-[#CDC9C0] leading-relaxed">
              {inc.description}
            </p>

            {/* Root Cause Analysis */}
            <div className="p-3.5 rounded-lg bg-[#111417] border border-[#27313B] space-y-1 text-xs">
              <div className="font-mono text-[11px] text-[#D98E3F] font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                IDENTIFIED ROOT CAUSE:
              </div>
              <p className="text-[#C6C2B9] leading-relaxed pl-5">
                {inc.rootCause}
              </p>
            </div>

            {/* Corrective Actions */}
            {inc.correctiveActions && inc.correctiveActions.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="font-mono text-[11px] text-[#788796] uppercase tracking-wider">
                  Mandated Corrective Actions:
                </div>
                <ul className="space-y-1 text-xs font-mono text-[#B3BFCC]">
                  {inc.correctiveActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-[#4E9A68] shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-[#181D22] border border-[#303B46] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#29323D] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#D98E3F]" />
                <h3 className="text-base font-semibold text-white">Log Operational Safety Event</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#7D8C9B] hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[#BCC6D0] block">EVENT TITLE *</label>
                <input
                  type="text"
                  placeholder="e.g. Gas Detector Warning during Pipe Flange Bolting"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#111417] border border-[#2B3540] text-white text-xs outline-none focus:border-[#D98E3F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#BCC6D0] block">SEVERITY LEVEL</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#111417] border border-[#2B3540] text-white text-xs outline-none"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#BCC6D0] block">EQUIPMENT TAG</label>
                  <input
                    type="text"
                    placeholder="e.g. CB-204, GL-12"
                    value={equipmentTag}
                    onChange={(e) => setEquipmentTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#111417] border border-[#2B3540] text-white text-xs outline-none focus:border-[#D98E3F]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#BCC6D0] block">LOCATION / FACILITY ZONE</label>
                <input
                  type="text"
                  value={locationZone}
                  onChange={(e) => setLocationZone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#111417] border border-[#2B3540] text-white text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#BCC6D0] block">INCIDENT DESCRIPTION *</label>
                <textarea
                  rows={3}
                  placeholder="Describe exact conditions, detector readings, gas concentrations (% LEL), and initial response..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#111417] border border-[#2B3540] text-white text-xs outline-none focus:border-[#D98E3F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#BCC6D0] block">ROOT CAUSE HYPOTHESIS</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Work permit issued without verifying simultaneous maintenance window..."
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#111417] border border-[#2B3540] text-white text-xs outline-none focus:border-[#D98E3F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#BCC6D0] block">CORRECTIVE ACTIONS (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="Action 1: Review gas testing interval&#10;Action 2: Replace flange gasket"
                  value={correctiveActionsText}
                  onChange={(e) => setCorrectiveActionsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#111417] border border-[#2B3540] text-white text-xs outline-none focus:border-[#D98E3F]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#37424F] text-[#9AA3AC] hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#D98E3F] hover:bg-[#C27C30] text-[#0C1013] font-semibold text-xs cursor-pointer"
                >
                  Log Event &amp; Link Graph
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
