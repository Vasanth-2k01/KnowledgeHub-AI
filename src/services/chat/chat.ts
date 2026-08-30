import { SemanticSearchService, SemanticSearchResult, CitationSource } from "@/services/search/semanticSearch";
import { buildRagPrompt } from "@/lib/rag/promptBuilder";
import { LLMService } from "@/lib/llm/huggingface";
import { AppSettingsService } from "@/services/settings/appSettings";
import { ChatRepository } from "@/services/chat/repository";

export interface ChatResponse {
  answer: string;
  sources: CitationSource[];
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
    documentIds?: string[]
  ): Promise<ChatResponse> {
    
    // 1. Semantic Search (Retrieval)
    const tSearchStart = Date.now();
    const searchResponse = await SemanticSearchService.search(question, userId, documentIds);
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
    const sources: CitationSource[] = chunks.map((chunk, index) => ({
      id: `SOURCE_${index + 1}`,
      documentId: chunk.documentId,
      fileName: chunk.originalFileName,
      chunkIndex: chunk.chunkIndex,
      content: chunk.text,
      score: chunk.similarityScore
    }));
    
    const prompt = buildRagPrompt(question, sources);
    console.log("prompt : ",prompt);
    
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
      sources,
      searchTime,
      totalChunks: sources.length,
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
    documentIds?: string[],
    chatId?: string
  ): Promise<{ stream: ReadableStream; sources: CitationSource[] }> {
    
    // 1. Semantic Search (Retrieval)
    const searchResponse = await SemanticSearchService.search(question, userId, documentIds);
    const chunks = searchResponse.results;

    // 2. Handle "no context found"
    if (!chunks || chunks.length === 0) {
      const fallbackMsg = "I couldn't find any relevant information in the uploaded documents.";
      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(new TextEncoder().encode(fallbackMsg));
          controller.close();

          // Save assistant message and generate title
          if (chatId) {
            try {
              await ChatRepository.saveMessage(chatId, "assistant", fallbackMsg);
              
              const chat = await ChatRepository.getChatById(chatId);
              if (chat && chat.title === "New Chat") {
                const settings = await AppSettingsService.getSettings();
                if (settings.ai.llmModel) {
                  const newTitle = await LLMService.generateChatTitle(question, settings.ai.llmModel);
                  await ChatRepository.updateChatTitle(chatId, newTitle);
                }
              }
            } catch (e) {
              console.error("[ChatService] Failed to save fallback message or generate title", e);
            }
          }
        }
      });
      return { stream, sources: [] };
    }

    // 3. Prompt Building
    let conversationHistory: { role: string; content: string }[] = [];
    
    // 3a. Retrieve Settings
    const settings = await AppSettingsService.getSettings();
    const { llmModel } = settings.ai;
    if (!llmModel) {
      throw new Error("LLM configuration is missing from settings.");
    }

    // 3b. Conversation Memory
    if (chatId) {
      const chat = await ChatRepository.getChatById(chatId);
      if (!chat) throw new Error("Chat not found");
      if (chat.userId.toString() !== userId) throw new Error("Unauthorized access to chat");

      const limit = settings.rag.conversationMemoryLimit || 10;
      try {
        const recentMessages = await ChatRepository.getRecentMessages(chatId, limit + 1);
        
        // Remove the newly saved user message if it's identical to the current query
        if (recentMessages.length > 0 && recentMessages[0].role === "user" && recentMessages[0].content === question) {
          recentMessages.shift();
        }
        
        // Keep up to `limit` messages and reverse to chronological order
        conversationHistory = recentMessages.slice(0, limit).reverse().map(m => ({
          role: m.role,
          content: m.content
        }));
      } catch (e) {
        console.error("[ChatService] Failed to retrieve conversation history", e);
        // Fallback to empty history on error, do not corrupt RAG pipeline
      }
    }

    const sources: CitationSource[] = chunks.map((chunk, index) => ({
      id: `SOURCE_${index + 1}`,
      documentId: chunk.documentId,
      fileName: chunk.originalFileName,
      chunkIndex: chunk.chunkIndex,
      content: chunk.text,
      score: chunk.similarityScore
    }));
    
    console.log(`[RAG] Retrieved ${sources.length} sources.`);
    sources.forEach(s => {
      console.log(`[RAG] ${s.id} -> ${s.fileName} / Chunk #${s.chunkIndex}`);
    });

    const prompt = buildRagPrompt(question, sources, conversationHistory);

    // 5. Generate Answer Stream
    const rawStream = LLMService.generateAnswerStream(prompt, llmModel);

    // 6. Intercept Stream to save assistant message
    let assistantMessage = "";
    const decoder = new TextDecoder("utf-8");

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        assistantMessage += decoder.decode(chunk, { stream: true });
        controller.enqueue(chunk);
      },
      async flush() {
        // Flush remaining text
        assistantMessage += decoder.decode();
        
        // Save the assistant message if it has content
        if (chatId && assistantMessage.trim()) {
          try {
            // Filter sources based on final assistantMessage to only save the used ones
            const usedSources = sources.filter(s => {
              const indexMatch = s.id.match(/^SOURCE_(\d+)$/);
              if (!indexMatch) return false;
              const regex = new RegExp(`\\[SOURCE_${indexMatch[1]}\\]`);
              return regex.test(assistantMessage);
            });

            await ChatRepository.saveMessage(chatId, "assistant", assistantMessage, usedSources);
            
            // Check if chat needs a title
            const chat = await ChatRepository.getChatById(chatId);
            if (chat && chat.title === "New Chat") {
              const newTitle = await LLMService.generateChatTitle(question, llmModel);
              await ChatRepository.updateChatTitle(chatId, newTitle);
            }
          } catch (e) {
            console.error("[ChatService] Failed to save assistant message or generate title", e);
          }
        }
      }
    });

    return { stream: rawStream.pipeThrough(transformStream), sources };
  }
}
