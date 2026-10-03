import { NextRequest, NextResponse } from 'next/server';
import { IndustrialDocument, GraphNode, GraphEdge, DocumentType } from '@/types';
import { industrialTokenize } from '@/lib/search/hybrid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, type, tag, facility, content, summary } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const docId = `doc-custom-${Date.now()}`;
    const docType: DocumentType = type || 'maintenance_log';
    const docTag = (tag || 'GEN-01').toUpperCase().trim();

    // 1. Type-aware chunking
    const rawChunks = content
      .split(/\n\s*\n/)
      .map((c: string) => c.trim())
      .filter((c: string) => c.length > 20);

    const chunks = rawChunks.length > 0 ? rawChunks : [content.trim()];

    const newDoc: IndustrialDocument = {
      id: docId,
      title,
      type: docType,
      tag: docTag,
      facility: facility || 'Unit-3 Coke Oven Battery',
      dateAdded: new Date().toISOString().split('T')[0],
      version: '1.0',
      summary: summary || `${title} (${docType.replace('_', ' ')}) uploaded for facility operations.`,
      chunks
    };

    // 2. Automated entity extraction & knowledge graph link proposal
    const tokens = industrialTokenize(content);
    const suggestedNodes: GraphNode[] = [];
    const suggestedEdges: GraphEdge[] = [];

    // If tag exists, create an equipment/asset node if not already standard
    if (docTag && docTag !== 'GEN-01') {
      const nodeId = `node-${docTag.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      suggestedNodes.push({
        id: nodeId,
        label: docTag,
        sub: docType.toUpperCase().replace('_', ' '),
        type: docType === 'regulatory_standard' ? 'regulation' : docType === 'safety_sop' ? 'procedure' : 'equipment',
        desc: `Asset/Standard referenced in document: ${title}`,
        sources: [docId]
      });

      suggestedEdges.push({
        id: `edge-${Date.now()}`,
        from: 'facility-unit3',
        to: nodeId,
        relationship: 'contains',
        label: 'associated with'
      });
    }

    return NextResponse.json({
      success: true,
      document: newDoc,
      suggestedNodes,
      suggestedEdges
    });
  } catch (err: any) {
    console.error('Document Upload Error:', err);
    return NextResponse.json({ error: 'Failed to process document', details: err.message }, { status: 500 });
  }
}
