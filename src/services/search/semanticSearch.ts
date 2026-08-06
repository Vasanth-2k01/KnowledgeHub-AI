import { AppSettingsService } from "@/services/settings/appSettings";
import { generateEmbedding } from "@/lib/embeddings/embeddings";
import { qdrantClient, COLLECTION_NAME } from "@/lib/qdrant/client";

export interface SemanticSearchResult {
  documentId: string;
  originalFileName: string;
  chunkIndex: number;
  text: string;
  similarityScore: number;
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
    const { topK, similarityThreshold } = settings.rag;
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

    // 5. Map results
    const results: SemanticSearchResult[] = qdrantResponse.map((point) => {
      const payload = point.payload || {};
      return {
        documentId: payload.documentId as string,
        originalFileName: payload.originalFileName as string,
        chunkIndex: payload.chunkIndex as number,
        text: payload.text as string,
        similarityScore: point.score,
      };
    });

    const tEnd = Date.now();

    // 6. Logging
    console.log(`[SemanticSearch] Query: "${query}"`);
    console.log(`[SemanticSearch] Scope: ${documentId ? `Document ${documentId}` : "All Documents"}`);
    console.log(`[SemanticSearch] Total Results: ${results.length} (Threshold: ${similarityThreshold})`);
    console.log(`[SemanticSearch] Embedding Time: ${tEmbeddingEnd - tEmbeddingStart}ms`);
    console.log(`[SemanticSearch] Qdrant Search Time: ${tQdrantEnd - tQdrantStart}ms`);
    console.log(`[SemanticSearch] Total Pipeline Time: ${tEnd - tStart}ms`);

    return {
      query,
      searchedDocuments: documentId ? "1" : "All",
      totalResults: results.length,
      topK,
      results,
    };
  }
}
