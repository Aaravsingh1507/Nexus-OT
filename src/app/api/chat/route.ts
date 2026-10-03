import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_DOCUMENTS } from '@/lib/data/initial-corpus';
import { hybridRetrieve } from '@/lib/search/hybrid';
import { generateIndustrialAnswer } from '@/lib/ai/groq';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, customApiKey, model, documents } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Inquiry query string is required' }, { status: 400 });
    }

    // Use passed active documents or fall back to verified initial corpus
    const activeDocs = Array.isArray(documents) && documents.length > 0
      ? documents
      : INITIAL_DOCUMENTS;

    // 1. Run multi-stage hybrid retrieval (BM25 + Semantic + RRF + Reranker)
    const retrievalResults = hybridRetrieve(query, activeDocs, 5);
    const topChunks = retrievalResults.map(r => r.chunk);
    const citations = retrievalResults.map(r => r.citations);

    // 2. Call Groq AI reasoning engine (server-side, never exposing API keys to client)
    const { answer, modelUsed, thinkingSteps } = await generateIndustrialAnswer({
      query,
      chunks: topChunks,
      apiKey: customApiKey,
      model: model || process.env.GROQ_MODEL || 'openai/gpt-oss-120b'
    });

    return NextResponse.json({
      answer,
      citations,
      thinkingSteps,
      modelUsed,
      retrievedCount: topChunks.length
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal operational intelligence engine error', details: error.message },
      { status: 500 }
    );
  }
}
