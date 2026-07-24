import { NextRequest, NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import connectDB from "@/config/db";
import { Document } from "@/models/Document";
import { extractText } from "@/lib/parser/parser";
import { AppSettingsService } from "@/services/settings/appSettings";
import { chunkText } from "@/lib/rag/chunker";
import fs from "fs/promises";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Database Connection
    await connectDB();

    // 2. Authentication
    const session = await auth();
    const userId = await getDbUserId(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve params (Next.js 15+ breaking change: params is a Promise)
    const params = await context.params;
    const documentId = params.id;

    // 3. Find document
    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    if (!document.storagePath) {
      return NextResponse.json({ error: "Document storage path missing" }, { status: 400 });
    }

    // 4. Read file
    let buffer;
    try {
      buffer = await fs.readFile(document.storagePath);
    } catch (err: any) {
      console.error("Failed to read file from disk:", err);
      return NextResponse.json({ error: "Missing file or unable to read" }, { status: 500 });
    }

    // 5. Extract Text
    let parsedData;
    try {
      parsedData = await extractText(buffer, document.mimeType, document.fileType || '');
    } catch (error: any) {
      console.error("Failed parsing:", error);
      return NextResponse.json({ error: "Failed to parse document text" }, { status: 500 });
    }

    if (!parsedData.text || parsedData.text.trim().length === 0) {
      return NextResponse.json({ error: "Empty document" }, { status: 400 });
    }

    // 6. Load System Settings
    let settings;
    try {
      settings = await AppSettingsService.getSettings();
    } catch (error: any) {
      console.error("Failed to load settings:", error);
      return NextResponse.json({ error: "Missing system settings" }, { status: 500 });
    }

    const { chunkSize, chunkOverlap } = settings.rag;

    if (!chunkSize || chunkSize <= 0) {
      return NextResponse.json({ error: "Invalid chunk configuration" }, { status: 500 });
    }

    // 7. Chunk Text
    const chunks = await chunkText(parsedData.text, chunkSize, chunkOverlap);

    // 8. Return chunks
    return NextResponse.json({
      documentId: document._id,
      totalChunks: chunks.length,
      chunkSize,
      chunkOverlap,
      chunks,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Chunking error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to chunk document." },
      { status: 500 }
    );
  }
}
