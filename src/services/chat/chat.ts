import { SemanticSearchService, SemanticSearchResult } from "@/services/search/semanticSearch";
import { buildRagPrompt } from "@/lib/rag/promptBuilder";
import { LLMService } from "@/lib/llm/huggingface";
import { AppSettingsService } from "@/services/settings/appSettings";

export interface ChatResponse {
  answer: string;
  sources: SemanticSearchResult[];
  searchTime: number;
  totalChunks: number;
}

export class ChatService {
  /**
   * Orchestrates the complete RAG pipeline for a user question.
   * 
   * @param question The user's question
   * @param userId The ID of the requesting user
   * @param documentId Optional document ID to restrict search
   * @returns ChatResponse object containing the answer and sources
   */
  static async handleQuery(
    question: string,
    userId: string,
    documentId?: string
  ): Promise<ChatResponse> {
    
    // 1. Semantic Search (Retrieval)
    const tSearchStart = Date.now();
    const searchResponse = await SemanticSearchService.search(question, userId, documentId);
    const searchTime = Date.now() - tSearchStart;
    
    const chunks = searchResponse.results;

    // 2. Handle "no context found"
    if (!chunks || chunks.length === 0) {
      return {
        answer: "I couldn't find any relevant information in the uploaded documents.",
        sources: [],
        searchTime,
        totalChunks: 0,
      };
    }

    // 3. Prompt Building
    const chunkTexts = chunks.map(c => c.text);
    const prompt = buildRagPrompt(question, chunkTexts);

    // 4. Load LLM Settings
    const settings = await AppSettingsService.getSettings();
    const { llmModel } = settings.ai;

    if (!llmModel) {
      throw new Error("LLM configuration is missing from settings.");
    }

    // 5. Generate Answer
    const answer = await LLMService.generateAnswer(prompt, llmModel);

    // 6. Return standard response
    return {
      answer,
      sources: chunks,
      searchTime,
      totalChunks: chunks.length,
    };
  }

  /**
   * Orchestrates the RAG pipeline for a streaming query.
   * 
   * @param question The user's question
   * @param userId The ID of the requesting user
   * @param documentId Optional document ID to restrict search
   * @returns ReadableStream of plain text chunks
   */
  static async handleStreamingQuery(
    question: string,
    userId: string,
    documentId?: string
  ): Promise<ReadableStream> {
    
    // 1. Semantic Search (Retrieval)
    const searchResponse = await SemanticSearchService.search(question, userId, documentId);
    const chunks = searchResponse.results;

    // 2. Handle "no context found"
    if (!chunks || chunks.length === 0) {
      return new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode("I couldn't find any relevant information in the uploaded documents."));
          controller.close();
        }
      });
    }

    // 3. Prompt Building
    const chunkTexts = chunks.map(c => c.text);
    const prompt = buildRagPrompt(question, chunkTexts);

    // 4. Load LLM Settings
    const settings = await AppSettingsService.getSettings();
    const { llmModel } = settings.ai;

    if (!llmModel) {
      throw new Error("LLM configuration is missing from settings.");
    }

    // 5. Generate Answer Stream
    return LLMService.generateAnswerStream(prompt, llmModel);
  }
}
