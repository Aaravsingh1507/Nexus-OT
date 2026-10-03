'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import cytoscape, { Core } from 'cytoscape';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RefreshCw, 
  Search, 
  AlertTriangle, 
  FileText, 
  Link2,
  ExternalLink,
  X
} from 'lucide-react';

export function KnowledgeGraphView() {
  const { nodes, edges, selectedNodeId, setSelectedNodeId, openDrawer, documents } = useAppStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const connectedEdges = edges.filter(
    (e) => e.from === selectedNodeId || e.to === selectedNodeId
  );
  const connectedNodes = connectedEdges.map((e) => {
    const targetId = e.from === selectedNodeId ? e.to : e.from;
    const nodeObj = nodes.find((n) => n.id === targetId);
    return {
      node: nodeObj,
      edge: e,
      isGap: e.gap
    };
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = [
      ...nodes.map((n) => ({
        data: {
          id: n.id,
          label: n.label,
          sub: n.sub,
          type: n.type,
        },
        position: n.x && n.y ? { x: n.x, y: n.y } : undefined
      })),
      ...edges.map((e) => ({
        data: {
          id: e.id,
          source: e.from,
          target: e.to,
          label: e.label || e.relationship,
          gap: e.gap || false
        }
      }))
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#18181b',
            'border-width': 1.5,
            'border-color': 'rgba(255, 255, 255, 0.4)',
            'label': 'data(label)',
            'color': '#FFFFFF',
            'font-family': 'sans-serif',
            'font-size': '11px',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'width': 32,
            'height': 32
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 3,
            'border-color': '#FFFFFF',
            'background-color': '#27272a',
            'font-weight': 'bold',
            'font-size': '12px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1.2,
            'line-color': 'rgba(255, 255, 255, 0.15)',
            'target-arrow-color': 'rgba(255, 255, 255, 0.25)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-family': 'sans-serif',
            'font-size': '9px',
            'color': '#71717a',
            'text-rotation': 'autorotate',
            'text-margin-y': -6
          }
        },
        {
          selector: 'edge[?gap]',
          style: {
            'line-color': '#e4e4e7',
            'target-arrow-color': '#ffffff',
            'line-style': 'dashed',
            'width': 2,
            'color': '#ffffff',
            'font-weight': 'bold'
          }
        }
      ],
      layout: {
        name: 'preset',
        fit: true,
        padding: 60
      },
      minZoom: 0.4,
      maxZoom: 2.5
    });

    cy.on('tap', 'node', (evt) => {
      setSelectedNodeId(evt.target.id());
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNodeId(null);
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [nodes, edges, setSelectedNodeId]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const cy = cyRef.current;
    if (!cy) return;

    if (!term.trim()) {
      cy.elements().removeClass('highlighted dimmed');
      return;
    }

    const lower = term.toLowerCase();
    const matchedNodes = cy.nodes().filter((n) => {
      const label = n.data('label') || '';
      return label.toLowerCase().includes(lower);
    });

    if (matchedNodes.length > 0) {
      cy.elements().addClass('dimmed');
      matchedNodes.removeClass('dimmed').addClass('highlighted');
      matchedNodes.neighborhood().removeClass('dimmed');
      cy.center(matchedNodes);
    }
  };

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 50);
  const handleResetLayout = () => {
    cyRef.current?.layout({ name: 'cose', animate: true, padding: 60 }).run();
  };

  return (
    <div className="flex-1 h-full w-full relative bg-black overflow-hidden flex flex-col">
      {/* Top Floating Glass Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="glass-panel p-1 rounded-xl flex items-center gap-2 max-w-sm w-full pointer-events-auto shadow-xl">
          <Search className="w-3.5 h-3.5 text-zinc-400 ml-2" />
          <input
            type="text"
            placeholder="Search plant asset or rule (e.g. CB-204, GL-12)..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-transparent px-2 py-1.5 text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>

        <div className="glass-panel p-1 rounded-xl flex items-center gap-1 pointer-events-auto shadow-xl">
          <button onClick={handleZoomIn} className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer" title="Zoom in">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleZoomOut} className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer" title="Zoom out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleFit} className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer" title="Fit to view">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleResetLayout} className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer" title="Reset layout">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 w-full h-full bg-black" />

      {/* Floating Bottom Minimal Legend */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel px-3 py-1.5 rounded-full flex items-center gap-4 text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full border border-white/60 bg-zinc-800" />
          <span>Asset / Procedure</span>
        </div>
        <div className="flex items-center gap-1.5 text-white">
          <span className="w-3 h-0.5 border-t border-dashed border-white" />
          <span>Compliance Gap</span>
        </div>
      </div>

      {/* Glassmorphic Node Inspector Modal / Drawer */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bottom-4 z-20 w-full sm:w-80 glass-panel rounded-2xl p-5 overflow-y-auto space-y-4 shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10 font-bold">
                  {selectedNode.sub}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedNode.label}</h3>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
              {selectedNode.desc}
            </p>

            {/* Linked Entities */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
                Connected Assets &amp; Rules ({connectedNodes.length})
              </span>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {connectedNodes.map(({ node, edge, isGap }, idx) => (
                  <button
                    key={idx}
                    onClick={() => node && setSelectedNodeId(node.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer border ${
                      isGap 
                        ? 'bg-white/10 border-white/30 text-white font-semibold' 
                        : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] text-zinc-300'
                    }`}
                  >
                    <span>{node?.label}</span>
                    <span className="text-[10px] text-zinc-500">{edge.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sources */}
          {selectedNode.sources.length > 0 && (
            <div className="pt-3 border-t border-white/[0.08]">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">
                Source Document:
              </span>
              {selectedNode.sources.map((docId) => {
                const doc = documents.find((d) => d.id === docId);
                return (
                  <button
                    key={docId}
                    onClick={() => openDrawer(docId)}
                    className="w-full text-left p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-zinc-200 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate pr-2">{doc?.title || docId}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
