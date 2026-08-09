import { AppSettingsService } from "@/services/settings/appSettings";
import { generateEmbedding } from "@/lib/embeddings/embeddings";
import { qdrantClient, COLLECTION_NAME } from "@/lib/qdrant/client";
import { RerankerService } from "@/lib/rag/reranker";

export interface SemanticSearchResult {
  documentId: string;
  originalFileName: string;
  chunkIndex: number;
  text: string;
  vectorScore: number;
  rerankerScore?: number;
}

export class SemanticSearchService {
  /**
   * Performs a semantic search against the indexed vectors in Qdrant.
   * 
   * @param query The user's search query string
   * @param userId The ID of the requesting user
   * @param documentId Optional. If provided, limits the search to this specific document
   * @returns Array of the most relevant text chunks
   */
  static async search(
    query: string,
    userId: string,
    documentId?: string
  ): Promise<{
    query: string;
    searchedDocuments: string;
    totalResults: number;
    topK: number;
    results: SemanticSearchResult[];
  }> {
    if (!query || query.trim().length === 0) {
      throw new Error("Search query cannot be empty");
    }

    const tStart = Date.now();

    // 1. Load System Settings
    const settings = await AppSettingsService.getSettings();
    const { topK, similarityThreshold, rerankerEnabled, rerankerTopN, rerankerModel } = settings.rag;
    const { embeddingProvider, embeddingModel } = settings.ai;

    if (!embeddingProvider || !embeddingModel) {
      throw new Error("Embedding configuration is missing from settings");
    }

    // 2. Generate embedding for the query
    const tEmbeddingStart = Date.now();
    const queryVector = await generateEmbedding(query, embeddingProvider, embeddingModel);
    const tEmbeddingEnd = Date.now();

    // 3. Construct Qdrant filter
    // Always filter by userId to ensure data isolation
    const mustFilters: any[] = [
      {
        key: "userId",
        match: { value: userId.toString() },
      }
    ];

    // If a specific document is requested, add it to the filter
    if (documentId) {
      mustFilters.push({
        key: "documentId",
        match: { value: documentId },
      });
    }

    const filter = {
      must: mustFilters,
    };

    // 4. Search Qdrant
    const tQdrantStart = Date.now();
    const qdrantResponse = await qdrantClient.search(COLLECTION_NAME, {
      vector: queryVector,
      limit: topK,
      filter: filter,
      with_payload: true,
      with_vector: false,
      score_threshold: similarityThreshold,
    });
    const tQdrantEnd = Date.now();

    // 5. Map vector results
    let results: SemanticSearchResult[] = qdrantResponse.map((point) => {
      const payload = point.payload || {};
      return {
        documentId: payload.documentId as string,
        originalFileName: payload.originalFileName as string,
        chunkIndex: payload.chunkIndex as number,
        text: payload.text as string,
        vectorScore: point.score,
      };
    });

    let tRerankStart = 0;
    let tRerankEnd = 0;

    // 6. Reranking Stage
    if (rerankerEnabled && rerankerModel && results.length > 0) {
      tRerankStart = Date.now();
      try {
        const chunkTexts = results.map(r => r.text);
        const rerankedChunks = await RerankerService.rerank(query, chunkTexts, rerankerModel);
        console.log('rerankedChunks',rerankedChunks);
        
        // Map scores back and sort
        results = results.map((result) => {
          const matchedReranked = rerankedChunks.find(rc => rc.chunk === result.text);
          return {
            ...result,
            rerankerScore: matchedReranked ? matchedReranked.rerankerScore : 0
          };
        });

        results.sort((a, b) => (b.rerankerScore || 0) - (a.rerankerScore || 0));
        
        // Slice to Top N
        if (rerankerTopN && rerankerTopN > 0) {
          results = results.slice(0, rerankerTopN);
        }

      } catch (error: any) {
        console.error("[SemanticSearch] Reranker failed, falling back to vector search:", error);
        // Fallback: just slice the vector results if needed
        if (rerankerTopN && rerankerTopN > 0) {
          results = results.slice(0, rerankerTopN);
        }
      }
      tRerankEnd = Date.now();
    } else {
       // If no reranker, just slice to rerankerTopN anyway if it's set and less than topK
       if (rerankerTopN && rerankerTopN > 0 && rerankerTopN < topK) {
         results = results.slice(0, rerankerTopN);
       }
    }

    const tEnd = Date.now();

    // 7. Logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n[SemanticSearch] Query: "${query}"`);
      console.log(`[SemanticSearch] Scope: ${documentId ? `Document ${documentId}` : "All Documents"}`);
      console.log(`[SemanticSearch] Vector Results: ${qdrantResponse.length} (Threshold: ${similarityThreshold})`);
      qdrantResponse.forEach(r => console.log(`  - Vector Score: ${r.score}`));
      
      if (rerankerEnabled) {
        console.log(`[SemanticSearch] Reranked Results: ${results.length} (Top N: ${rerankerTopN})`);
        results.forEach(r => console.log(`  - Reranker Score: ${r.rerankerScore}`));
      }
      
      console.log(`[SemanticSearch] Embedding Time: ${tEmbeddingEnd - tEmbeddingStart}ms`);
      console.log(`[SemanticSearch] Qdrant Search Time: ${tQdrantEnd - tQdrantStart}ms`);
      if (rerankerEnabled) console.log(`[SemanticSearch] Reranker Time: ${tRerankEnd - tRerankStart}ms`);
      console.log(`[SemanticSearch] Total Pipeline Time: ${tEnd - tStart}ms\n`);
    }

    return {
      query,
      searchedDocuments: documentId ? "1" : "All",
      totalResults: results.length,
      topK,
      results,
    };
  }
}
