import { NextRequest, NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import connectDB from "@/config/db";
import { Document } from "@/models/Document";
import { qdrantClient, COLLECTION_NAME } from "@/lib/qdrant/client";
import { getFileStorage } from "@/lib/storage";



export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await auth();
    const userId = await getDbUserId(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    
    const document = await Document.findOne({ _id: id, userId });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // 1. Delete from Qdrant
    try {
      await qdrantClient.delete(COLLECTION_NAME, {
        wait: true,
        filter: {
          must: [
            {
              key: "documentId",
              match: { value: document._id.toString() }
            }
          ]
        }
      });
    } catch (qdrantError: any) {
      console.error(`Failed to delete Qdrant vectors for ${id}:`, qdrantError);
      return NextResponse.json({ error: `Failed to delete from vector DB: ${qdrantError.message}` }, { status: 500 });
    }

    // 2. Delete from Storage
    if (document.storagePath) {
      try {
        const storage = getFileStorage(document.storageProvider);
        await storage.delete(document.storagePath);
      } catch (storageError: any) {
        console.error(`Failed to delete storage file for ${id}:`, storageError);
        return NextResponse.json({ error: `Failed to delete file from storage: ${storageError.message}` }, { status: 500 });
      }
    }

    // 3. Delete from MongoDB
    await Document.deleteOne({ _id: document._id });

    return NextResponse.json({ success: true, message: "Document deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete Document error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete document" },
      { status: 500 }
    );
  }
}
