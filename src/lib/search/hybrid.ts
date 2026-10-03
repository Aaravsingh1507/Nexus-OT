import { DocumentChunk, IndustrialDocument, ChatCitation } from '@/types';

// Industrial stop words (keep critical domain terms like 'not', 'gap', 'safe', 'no', 'active')
const STOPWORDS = new Set([
  'the', 'is', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with', 
  'was', 'were', 'are', 'it', 'at', 'by', 'be', 'as', 'that', 'this', 'has', 
  'have', 'had', 'our', 'we', 'from', 'its'
]);

/**
 * Custom industrial tokenizer that protects equipment tags, drawing numbers,
 * and regulation references from being split (e.g. CB-204, GL-12, V-45, OISD-STD-118, INC-0225).
 */
export function industrialTokenize(text: string): string[] {
  // Normalize whitespace
  const clean = text.replace(/[\r\n\t]+/g, ' ');
  
  // Match alphanumeric tags with hyphens or underscores (e.g. CB-204, OISD-STD-118) OR standard words
  const tagOrWordRegex = /([a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)+|[a-zA-Z0-9]+)/g;
  const matches = clean.match(tagOrWordRegex) || [];

  return matches
    .map(token => token.toLowerCase())
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

/**
 * Computes BM25 Score across chunks for a given query.
 */
export function computeBM25(
  queryTokens: string[],
  chunks: DocumentChunk[],
  k1 = 1.5,
  b = 0.75
): Map<string, number> {
  const scores = new Map<string, number>();
  const N = chunks.length;
  if (N === 0 || queryTokens.length === 0) return scores;

  // Average chunk length
  const totalTokens = chunks.reduce((acc, c) => acc + industrialTokenize(c.content).length, 0);
  const avgdl = totalTokens / N;

  // Calculate Document Frequency (DF) for each query token
  const df = new Map<string, number>();
  queryTokens.forEach(qt => {
    let count = 0;
    chunks.forEach(c => {
      const cTokens = industrialTokenize(c.content);
      if (cTokens.includes(qt) || (c.tag && c.tag.toLowerCase() === qt)) {
        count++;
      }
    });
    df.set(qt, count);
  });

  // Score each chunk
  chunks.forEach(chunk => {
    const cTokens = industrialTokenize(chunk.content);
    const docLen = cTokens.length;
    let score = 0;

    queryTokens.forEach(qt => {
      const docFreq = df.get(qt) || 0;
      if (docFreq === 0) return;

      // IDF calculation
      const idf = Math.log((N - docFreq + 0.5) / (docFreq + 0.5) + 1.0);

      // Term frequency in this chunk
      let tf = cTokens.filter(t => t === qt).length;

      // Exact Equipment Tag or Regulation match bonus
      if (chunk.tag && chunk.tag.toLowerCase().replace(/[-_\s]/g, '') === qt.replace(/[-_\s]/g, '')) {
        tf += 4;
      }
      if (chunk.documentTitle.toLowerCase().includes(qt)) {
        tf += 2;
      }

      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + b * (docLen / avgdl));
      score += idf * (numerator / denominator);
    });

    if (score > 0) {
      scores.set(chunk.id, score);
    }
  });

  return scores;
}

/**
 * Computes semantic n-gram / concept overlap similarity (dense proxy)
 */
export function computeSemanticSimilarity(
  query: string,
  chunks: DocumentChunk[]
): Map<string, number> {
  const scores = new Map<string, number>();
  const qLower = query.toLowerCase();

  chunks.forEach(chunk => {
    const cLower = chunk.content.toLowerCase();
    let sim = 0;

    // Check key industrial concepts and semantic proximity
    const concepts = [
      { terms: ['gas alarm', 'leak', 'lel', 'fugitive emission', 'flammable'], boost: 1.5 },
      { terms: ['vibration', 'rms', 'bearing', 'unbalance', 'wear'], boost: 1.5 },
      { terms: ['compliance', 'oisd', 'gap', 'factories act', 'standard', 'audit'], boost: 2.0 },
      { terms: ['permit', 'hot work', 'confined space', 'sop-118', 'simops'], boost: 1.8 },
      { terms: ['gasket', 'flange', 'interval', 'replacement', 'oem'], boost: 1.6 }
    ];

    concepts.forEach(concept => {
      const qMatches = concept.terms.some(t => qLower.includes(t));
      const cMatches = concept.terms.some(t => cLower.includes(t));
      if (qMatches && cMatches) {
        sim += concept.boost;
      }
    });

    // Tag occurrence
    if (chunk.tag && qLower.includes(chunk.tag.toLowerCase())) {
      sim += 3.0;
    }

    if (sim > 0) {
      scores.set(chunk.id, sim);
    }
  });

  return scores;
}

/**
 * Reciprocal Rank Fusion (RRF) combining Sparse (BM25) and Dense (Semantic)
 */
export function hybridRetrieve(
  query: string,
  documents: IndustrialDocument[],
  topK = 5,
  rrfK = 60
): { chunk: DocumentChunk; score: number; citations: ChatCitation }[] {
  // 1. Flatten all documents into chunks
  const allChunks: DocumentChunk[] = [];
  documents.forEach(doc => {
    doc.chunks.forEach((text, idx) => {
      allChunks.push({
        id: `${doc.id}-chunk-${idx}`,
        documentId: doc.id,
        documentTitle: doc.title,
        documentType: doc.type,
        tag: doc.tag,
        content: text,
        chunkIndex: idx
      });
    });
  });

  const queryTokens = industrialTokenize(query);
  const bm25Scores = computeBM25(queryTokens, allChunks);
  const semanticScores = computeSemanticSimilarity(query, allChunks);

  // 2. Rank BM25 results
  const bm25Ranked = Array.from(bm25Scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id], idx) => ({ id, rank: idx + 1 }));

  // 3. Rank Semantic results
  const semanticRanked = Array.from(semanticScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id], idx) => ({ id, rank: idx + 1 }));

  // 4. Calculate RRF scores
  const rrfMap = new Map<string, number>();

  bm25Ranked.forEach(({ id, rank }) => {
    const current = rrfMap.get(id) || 0;
    rrfMap.set(id, current + 1 / (rrfK + rank));
  });

  semanticRanked.forEach(({ id, rank }) => {
    const current = rrfMap.get(id) || 0;
    rrfMap.set(id, current + 1 / (rrfK + rank));
  });

  // Fallback: If no tokens matched, return top 3 chunks matching any words
  if (rrfMap.size === 0) {
    allChunks.slice(0, 3).forEach((chunk, i) => {
      rrfMap.set(chunk.id, 0.01 / (i + 1));
    });
  }

  // 5. Cross-Encoder rerank heuristic (prioritizing incident, regulation, and direct tag correlation)
  const sortedCandidates = Array.from(rrfMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK * 2)
    .map(([chunkId, rrfScore]) => {
      const chunk = allChunks.find(c => c.id === chunkId)!;
      let rerankBoost = 1.0;

      // Incident reports and regulatory gap findings get prioritized when questions ask 'why', 'gap', or 'compliant'
      const isWhyOrCompliance = /(why|cause|gap|compliant|regulation|audit|standard|interval|alarm)/i.test(query);
      if (isWhyOrCompliance) {
        if (chunk.documentType === 'incident_report') rerankBoost += 0.4;
        if (chunk.documentType === 'regulatory_standard') rerankBoost += 0.35;
        if (chunk.documentType === 'inspection_report') rerankBoost += 0.3;
      }

      const finalScore = rrfScore * rerankBoost;
      const isFlagged = chunk.documentType === 'incident_report' || chunk.content.toLowerCase().includes('gap') || chunk.content.toLowerCase().includes('alarm');

      return {
        chunk,
        score: finalScore,
        citations: {
          chunkId: chunk.id,
          docId: chunk.documentId,
          docTitle: chunk.documentTitle,
          docType: chunk.documentType,
          excerpt: chunk.content,
          tag: chunk.tag,
          score: finalScore,
          isFlagged
        }
      };
    });

  return sortedCandidates.sort((a, b) => b.score - a.score).slice(0, topK);
}
