import { create } from 'zustand';
import { 
  IndustrialDocument, 
  GraphNode, 
  GraphEdge, 
  ComplianceRule, 
  IncidentReport, 
  ChatMessage 
} from '@/types';
import { 
  INITIAL_DOCUMENTS, 
  INITIAL_GRAPH_NODES, 
  INITIAL_GRAPH_EDGES, 
  INITIAL_COMPLIANCE_RULES, 
  INITIAL_INCIDENTS 
} from '@/lib/data/initial-corpus';

interface AppStore {
  // Corpus
  documents: IndustrialDocument[];
  addDocument: (doc: IndustrialDocument) => void;
  deleteDocument: (id: string) => void;

  // Graph
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  addNode: (node: GraphNode) => void;
  addEdge: (edge: GraphEdge) => void;

  // Compliance
  complianceRules: ComplianceRule[];
  updateComplianceStatus: (ruleId: string, status: ComplianceRule['currentStatus'], evidence?: string) => void;

  // Incidents
  incidents: IncidentReport[];
  addIncident: (incident: IncidentReport) => void;

  // Chat
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  isChatLoading: boolean;
  setIsChatLoading: (loading: boolean) => void;

  // Drawer
  drawerDocId: string | null;
  openDrawer: (docId: string) => void;
  closeDrawer: () => void;

  // Groq API Key
  groqApiKey: string;
  setGroqApiKey: (key: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  documents: INITIAL_DOCUMENTS,
  addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
  deleteDocument: (id) => set((state) => ({ documents: state.documents.filter((d) => d.id !== id) })),

  nodes: INITIAL_GRAPH_NODES,
  edges: INITIAL_GRAPH_EDGES,
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),

  complianceRules: INITIAL_COMPLIANCE_RULES,
  updateComplianceStatus: (ruleId, status, evidence) => set((state) => ({
    complianceRules: state.complianceRules.map((rule) => 
      rule.id === ruleId 
        ? { 
            ...rule, 
            currentStatus: status, 
            evidenceSummary: evidence || rule.evidenceSummary,
            lastAssessedDate: new Date().toISOString().split('T')[0]
          } 
        : rule
    )
  })),

  incidents: INITIAL_INCIDENTS,
  addIncident: (incident) => set((state) => ({ incidents: [incident, ...state.incidents] })),

  messages: [
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'Welcome to **NEXUS-OT v2.0**. I am your unified industrial operations & process safety copilot.\n\nAsk me anything regarding equipment health, historical failure modes, safety SOPs, or regulatory compliance across your facility. Every response is strictly grounded in verified engineering drawings, maintenance records, and statutory standards.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'NEXUS-OT Knowledge Engine'
    }
  ],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearChat: () => set({
    messages: [
      {
        id: 'welcome-msg-reset',
        role: 'assistant',
        content: 'Conversation history reset. How can I assist with plant operations or compliance review?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  }),
  isChatLoading: false,
  setIsChatLoading: (loading) => set({ isChatLoading: loading }),

  drawerDocId: null,
  openDrawer: (docId) => set({ drawerDocId: docId }),
  closeDrawer: () => set({ drawerDocId: null }),

  groqApiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
  setGroqApiKey: (key) => set({ groqApiKey: key })
}));
