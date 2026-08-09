import { NextRequest, NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import connectDB from "@/config/db";
import { Document } from "@/models/Document";
import { extractText } from "@/lib/parser/parser";
import { getFileStorage } from "@/lib/storage";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Database Connection (MUST be before any DB queries like auth/getDbUserId)
    await connectDB();

    // 2. Authentication
    const session = await auth();
    const userId = await getDbUserId(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Next.js 15+ breaking change: params is a Promise
    const params = await context.params;
    const documentId = params.id;
    const document = await Document.findOne({ _id: documentId, userId });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!document.storagePath) {
      return NextResponse.json({ error: "Document storage path missing" }, { status: 400 });
    }

    // 3. Read file
    let buffer;
    try {
      const storage = getFileStorage(document.storageProvider);
      buffer = await storage.get(document.storagePath);
    } catch (err: any) {
      console.error("Failed to read file from storage:", err);
      return NextResponse.json({ error: "Missing file or unable to read" }, { status: 500 });
    }

    // 4. Extract Text
    const parsedData = await extractText(buffer, document.mimeType, document.fileType || '');

    // 5. Return extraction data
    return NextResponse.json({
      documentId: document._id,
      text: parsedData.text,
      wordCount: parsedData.wordCount,
      characterCount: parsedData.characterCount,
      pageCount: parsedData.pageCount
    }, { status: 200 });

  } catch (error: any) {
    console.error("Document extraction error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to extract text from document." },
      { status: 500 }
    );
  }
}
