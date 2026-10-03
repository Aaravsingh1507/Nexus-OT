export type DocumentType = 
  | 'maintenance_log'
  | 'pid_drawing'
  | 'safety_sop'
  | 'regulatory_standard'
  | 'incident_report'
  | 'oem_manual'
  | 'inspection_report'
  | 'management_of_change';

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  documentType: DocumentType;
  tag: string;
  content: string;
  chunkIndex: number;
  metadata?: {
    section?: string;
    equipmentTags?: string[];
    regulationRefs?: string[];
    date?: string;
  };
}

export interface IndustrialDocument {
  id: string;
  title: string;
  type: DocumentType;
  tag: string;
  facility: string;
  dateAdded: string;
  version: string;
  summary: string;
  chunks: string[];
  fullText?: string;
  metadata?: Record<string, any>;
}

export type NodeType = 'equipment' | 'incident' | 'procedure' | 'regulation' | 'zone' | 'schedule' | 'personnel';

export interface GraphNode {
  id: string;
  label: string;
  sub: string;
  type: NodeType;
  desc: string;
  sources: string[];
  properties?: Record<string, any>;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  relationship: string;
  label?: string;
  gap?: boolean;
  sourceDocId?: string;
  evidence?: string;
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type ComplianceStatus = 'compliant' | 'gap' | 'under_review' | 'not_assessed';

export interface ComplianceRule {
  id: string;
  regulation: string; // e.g. "OISD-STD-118", "Factories Act Section 31"
  clauseNumber: string;
  category: string;
  requirement: string;
  applicableTo: string[];
  severity: 'critical' | 'high' | 'medium';
  currentStatus: ComplianceStatus;
  evidenceSummary: string;
  evidenceDocIds: string[];
  lastAssessedDate: string;
  suggestedAction?: string;
}

export interface ChatCitation {
  chunkId: string;
  docId: string;
  docTitle: string;
  docType: DocumentType;
  excerpt: string;
  tag: string;
  score?: number;
  isFlagged?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: ChatCitation[];
  thinkingSteps?: string[];
  isStreaming?: boolean;
  modelUsed?: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  locationZone: string;
  equipmentIds: string[];
  occurredAt: string;
  description: string;
  rootCause: string;
  correctiveActions: string[];
  linkedRegulationIds: string[];
}
