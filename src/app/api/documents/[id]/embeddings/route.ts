import { NextRequest, NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import connectDB from "@/config/db";
import { Document } from "@/models/Document";
import { extractText } from "@/lib/parser/parser";
import { AppSettingsService } from "@/services/settings/appSettings";
import { chunkText } from "@/lib/rag/chunker";
import { generateEmbedding } from "@/lib/embeddings/embeddings";
import { getFileStorage } from "@/lib/storage";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  try {
    await connectDB();

    const session = await auth();
    const userId = await getDbUserId(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const documentId = params.id;

    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    if (!document.storagePath) {
      return NextResponse.json({ error: "Document storage path missing" }, { status: 400 });
    }

    let buffer;
    try {
      const storage = getFileStorage(document.storageProvider);
      buffer = await storage.get(document.storagePath);
    } catch (err: any) {
      return NextResponse.json({ error: "Missing file or unable to read" }, { status: 500 });
    }

    let parsedData;
    try {
      parsedData = await extractText(buffer, document.mimeType, document.fileType || '');
    } catch (error: any) {
      return NextResponse.json({ error: "Failed to parse document text" }, { status: 500 });
    }

    if (!parsedData.text || parsedData.text.trim().length === 0) {
      return NextResponse.json({ error: "Empty document" }, { status: 400 });
    }

    let settings;
    try {
      settings = await AppSettingsService.getSettings();
    } catch (error: any) {
      return NextResponse.json({ error: "Missing system settings" }, { status: 500 });
    }

    const { chunkSize, chunkOverlap } = settings.rag;
    const { embeddingProvider, embeddingModel } = settings.ai;

    if (!chunkSize || !embeddingProvider || !embeddingModel) {
      return NextResponse.json({ error: "Invalid RAG/AI configuration" }, { status: 500 });
    }

    const chunks = await chunkText(parsedData.text, chunkSize, chunkOverlap);
    
    if (chunks.length === 0) {
        return NextResponse.json({ error: "No chunks generated from document" }, { status: 400 });
    }

    const processedChunks = [];
    let vectorDimension = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        const vector = await generateEmbedding(chunk.text, embeddingProvider, embeddingModel);
        
        if (i === 0) {
            vectorDimension = vector.length;
        } else if (vector.length !== vectorDimension) {
            throw new Error(`Inconsistent vector dimension. Expected ${vectorDimension}, got ${vector.length}`);
        }

        processedChunks.push({
          chunkIndex: chunk.chunkIndex,
          text: chunk.text,
          vectorLength: vector.length
        });
      } catch (error: any) {
        console.error(`Failed to generate embedding for chunk ${i}:`, error);
        return NextResponse.json({ error: `Embedding generation failed: ${error.message}` }, { status: 500 });
      }
    }

    const processingTimeMs = Date.now() - startTime;

    console.log(`[Embeddings] Generated ${processedChunks.length} vectors for document ${documentId}`);
    console.log(`[Embeddings] Model: ${embeddingModel}, Dimension: ${vectorDimension}`);
    console.log(`[Embeddings] Processing Time: ${processingTimeMs}ms`);

    return NextResponse.json({
      documentId: document._id,
      embeddingModel,
      totalChunks: processedChunks.length,
      vectorDimension,
      chunks: processedChunks,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Embedding API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate embeddings." },
      { status: 500 }
    );
  }
}
