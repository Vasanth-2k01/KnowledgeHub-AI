export interface RerankedChunk {
  chunk: string;
  rerankerScore: number;
}

/**
 * Service to rerank retrieved chunks against a query using HuggingFace Inference API.
 */
export class RerankerService {
  /**
   * Re-ranks a list of text chunks based on their relevance to a user query.
   * 
   * @param query The user's search query
   * @param chunks Array of text chunks retrieved from the vector database
   * @param model The reranking model to use (e.g., "BAAI/bge-reranker-base")
   * @returns Array of chunks with their reranker scores, sorted descending
   */
  static async rerank(query: string, chunks: string[], model: string): Promise<RerankedChunk[]> {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error("Missing HUGGINGFACE_API_KEY environment variable.");
    }

    if (!chunks || chunks.length === 0) {
      return [];
    }

    // Format required by HF cross-encoders: pairs of [query, text]
    const inputs = chunks.map(chunk => [query, chunk]);

    const url = `https://api-inference.huggingface.co/${model}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: inputs
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HuggingFace Reranker API Error (${response.status}): ${errorText}`);
    }

    const scores = await response.json();

    // The API might return an array of scores (one per input pair)
    if (!Array.isArray(scores)) {
      throw new Error("Unexpected response format from HuggingFace reranker API.");
    }

    // Map scores back to original chunks
    const reranked: RerankedChunk[] = chunks.map((chunk, index) => ({
      chunk,
      // Some HF models return the score directly, others might return an array of objects
      rerankerScore: typeof scores[index] === 'number' ? scores[index] : (scores[index]?.[0]?.score ?? 0)
    }));

    // Sort descending by score
    reranked.sort((a, b) => b.rerankerScore - a.rerankerScore);

    return reranked;
  }
}
