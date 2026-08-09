import { Document } from "@/models/Document";
import { AppSettingsService } from "@/services/settings/appSettings";
import { extractText } from "@/lib/parser/parser";
import { chunkText } from "@/lib/rag/chunker";
import { generateEmbedding } from "@/lib/embeddings/embeddings";
import { qdrantClient, COLLECTION_NAME, ensureCollection } from "@/lib/qdrant/client";
import { getFileStorage } from "@/lib/storage";

export class IndexDocumentService {
  /**
   * Orchestrates the complete pipeline to extract, chunk, embed, and store a document in Qdrant.
   * 
   * @param documentId The MongoDB _id of the Document
   * @param userId The ID of the requesting User (for authorization)
   * @returns Processing metrics upon success
   */
  static async process(documentId: string, userId: string) {
    const startTime = Date.now();

    // 1. Fetch Document
    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) {
      throw new Error("Document not found or unauthorized");
    }
    
    if (!document.storagePath) {
      throw new Error("Document storage path missing");
    }

    try {
      // 2. Extract Text
      let buffer: Buffer;
      try {
        const storage = getFileStorage(document.storageProvider);
        buffer = await storage.get(document.storagePath);
      } catch (err: any) {
        throw new Error(`Failed to read file from storage: ${err.message}`);
      }

      const parsedData = await extractText(buffer, document.mimeType, document.fileType || "");
      if (!parsedData.text || parsedData.text.trim().length === 0) {
        throw new Error("Extracted document text is empty");
      }

      // 3. Load AppSettings
      const settings = await AppSettingsService.getSettings();
      const { chunkSize, chunkOverlap } = settings.rag;
      const { embeddingProvider, embeddingModel } = settings.ai;

      if (!chunkSize || !embeddingProvider || !embeddingModel) {
        throw new Error("Invalid RAG/AI configuration");
      }

      // 4. Chunk Text
      const chunks = await chunkText(parsedData.text, chunkSize, chunkOverlap);
      if (chunks.length === 0) {
        throw new Error("No chunks generated from document");
      }

      // 5. Generate Embeddings & Map to Qdrant Points
      const points = [];
      let vectorDimension = 0;
      
      const qdrantStartTime = Date.now();

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const vector = await generateEmbedding(chunk.text, embeddingProvider, embeddingModel);
        
        if (i === 0) {
          vectorDimension = vector.length;
        } else if (vector.length !== vectorDimension) {
          throw new Error(`Inconsistent vector dimension. Expected ${vectorDimension}, got ${vector.length}`);
        }

        points.push({
          id: chunk.id,
          vector,
          payload: {
            userId: userId.toString(),
            documentId: document._id.toString(),
            originalFileName: document.originalFileName,
            chunkIndex: chunk.chunkIndex,
            text: chunk.text,
            characterCount: chunk.characterCount,
            wordCount: chunk.wordCount,
            createdAt: new Date().toISOString(),
          },
        });
      }

      // 6. Ensure Collection and Insert into Qdrant
      await ensureCollection();
      
      const upsertResult = await qdrantClient.upsert(COLLECTION_NAME, {
        wait: true, // Wait for confirmation
        points,
      });

      if (upsertResult.status !== 'completed') {
        throw new Error(`Qdrant insertion returned non-completed status: ${upsertResult.status}`);
      }

      const qdrantInsertionTimeMs = Date.now() - qdrantStartTime;

      // 7. Update MongoDB
      document.processingStatus = "completed";
      document.indexedAt = new Date();
      document.chunkCount = chunks.length;
      document.vectorCount = points.length;
      document.embeddingModel = embeddingModel;
      document.indexVersion = 1;

      await document.save();

      const totalProcessingTimeMs = Date.now() - startTime;

      console.log(`[IndexService] Document ${documentId} processed successfully in ${totalProcessingTimeMs}ms`);
      console.log(`[IndexService] Chunks: ${chunks.length}, Vectors: ${points.length}, Model: ${embeddingModel}, Qdrant Time: ${qdrantInsertionTimeMs}ms`);

      return {
        documentId: document._id,
        totalChunks: chunks.length,
        storedVectors: points.length,
        collection: COLLECTION_NAME,
        processingStatus: document.processingStatus,
        indexedAt: document.indexedAt,
        chunkCount: document.chunkCount,
        vectorCount: document.vectorCount,
        embeddingModel: document.embeddingModel,
        indexVersion: document.indexVersion,
      };

    } catch (error: any) {
      // If anything fails, mark the document as failed
      if (document) {
        document.processingStatus = "failed";
        await document.save();
      }
      throw error;
    }
  }
}
