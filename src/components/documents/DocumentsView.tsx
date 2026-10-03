'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { DocumentType } from '@/types';
import { 
  FileText, 
  Search, 
  Plus, 
  Trash2, 
  ExternalLink, 
  UploadCloud,
  X 
} from 'lucide-react';

export function DocumentsView() {
  const { documents, addDocument, deleteDocument, openDrawer, addNode, addEdge } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<DocumentType>('maintenance_log');
  const [tag, setTag] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type,
          tag,
          content,
          summary
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      addDocument(data.document);

      if (data.suggestedNodes) {
        data.suggestedNodes.forEach((node: any) => addNode(node));
      }
      if (data.suggestedEdges) {
        data.suggestedEdges.forEach((edge: any) => addEdge(edge));
      }

      setTitle('');
      setTag('');
      setContent('');
      setSummary('');
      setIsUploadModalOpen(false);
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-wide">
            Indexed Plant Technical Documentation
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Verified maintenance records, P&amp;ID drawing notes, safety SOPs, and OEM equipment manuals.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by title, equipment tag (e.g. CB-204), or procedure..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input w-full pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none placeholder-zinc-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="glass-input px-3 py-2 rounded-xl text-xs text-zinc-300 outline-none cursor-pointer"
        >
          <option value="all" className="bg-zinc-950 text-white">All Types</option>
          <option value="maintenance_log" className="bg-zinc-950 text-white">Maintenance Logs</option>
          <option value="pid_drawing" className="bg-zinc-950 text-white">P&amp;ID Drawing Notes</option>
          <option value="safety_sop" className="bg-zinc-950 text-white">Safety SOPs</option>
          <option value="regulatory_standard" className="bg-zinc-950 text-white">Regulations</option>
          <option value="incident_report" className="bg-zinc-950 text-white">Incident Reports</option>
          <option value="oem_manual" className="bg-zinc-950 text-white">OEM Manuals</option>
          <option value="inspection_report" className="bg-zinc-950 text-white">Inspection Reports</option>
        </select>
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-8">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="glass-card p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-white/20 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/10 font-medium">
                  {doc.type.replace('_', ' ')}
                </span>
                <span className="text-xs font-mono text-white font-bold">
                  TAG: {doc.tag}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white leading-snug">
                {doc.title}
              </h3>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {doc.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>{doc.chunks.length} Chunks</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openDrawer(doc.id)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </button>
                {doc.id.startsWith('doc-custom-') && (
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-1 rounded text-zinc-500 hover:text-white cursor-pointer"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-6 space-y-4 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-white" />
                <h3 className="text-sm font-semibold text-white">Index New Plant Document</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono">DOCUMENT TITLE *</label>
                <input
                  type="text"
                  placeholder="e.g. Pump P-101 Mechanical Seal Overhaul Log"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono">DOCUMENT TYPE</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as DocumentType)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs outline-none"
                  >
                    <option value="maintenance_log" className="bg-zinc-950">Maintenance Log</option>
                    <option value="pid_drawing" className="bg-zinc-950">P&amp;ID Drawing Note</option>
                    <option value="safety_sop" className="bg-zinc-950">Safety SOP</option>
                    <option value="regulatory_standard" className="bg-zinc-950">Regulatory Standard</option>
                    <option value="incident_report" className="bg-zinc-950">Incident Report</option>
                    <option value="oem_manual" className="bg-zinc-950">OEM Manual</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 block font-mono">TAG (ASSET OR RULE)</label>
                  <input
                    type="text"
                    placeholder="e.g. CB-204, V-45"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono">SUMMARY</label>
                <input
                  type="text"
                  placeholder="Brief synopsis of procedure or equipment event..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 block font-mono">DOCUMENT TEXT (Separated by blank lines)</label>
                <textarea
                  rows={5}
                  placeholder="Paste work orders, procedures, or inspection findings. Blank lines will be indexed as separate chunks..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="glass-input w-full px-3 py-2 rounded-xl text-xs outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-button text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Indexing...' : 'Index Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
