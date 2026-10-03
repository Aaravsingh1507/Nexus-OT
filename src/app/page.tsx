'use client';

import React, { useState } from 'react';
import { Topbar, ActiveTab } from '@/components/layout/Topbar';
import { SourceDrawer } from '@/components/layout/SourceDrawer';
import { CopilotView } from '@/components/copilot/CopilotView';
import { KnowledgeGraphView } from '@/components/graph/KnowledgeGraphView';
import { ComplianceView } from '@/components/compliance/ComplianceView';
import { DocumentsView } from '@/components/documents/DocumentsView';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('copilot');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as ActiveTab;
      if (tabParam && ['copilot', 'graph', 'compliance', 'documents'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-white">
      {/* Sleek Minimal Topbar with Tab Navigation */}
      <Topbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Operational Container */}
      <main className="flex-1 min-h-0 relative flex flex-col overflow-hidden">
        {activeTab === 'copilot' && <CopilotView />}
        {activeTab === 'graph' && <KnowledgeGraphView />}
        {activeTab === 'compliance' && <ComplianceView />}
        {activeTab === 'documents' && <DocumentsView />}
      </main>

      {/* Universal Frosted Glass Citation Drawer */}
      <SourceDrawer />
    </div>
  );
}
