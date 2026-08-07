import { NextRequest, NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import connectDB from "@/config/db";
import { apiSuccess, apiError } from "@/lib/api-response";
import { Document } from "@/models/Document";

export async function GET(req: NextRequest) {
  try {
    // 1. Database Connection
    await connectDB();

    // 2. Authentication
    const session = await auth();
    const userId = await getDbUserId(session);
    
    if (!userId) {
      return apiError("Unauthorized", "Unauthorized or User not found", 401);
    }

    // 3. Fetch documents for the user, sorted by newest
    const documents = await Document.find({ userId })
      .sort({ createdAt: -1 })
      .select(
        "_id originalFileName storedFileName fileType mimeType fileSize storagePath processingStatus chunkCount vectorCount indexedAt embeddingModel indexVersion createdAt updatedAt"
      )
      .lean();

    // 4. Return success
    return apiSuccess({ documents });
  } catch (error: any) {
    console.error("[GET /api/documents]", error);
    return apiError(error, "Failed to fetch documents", 500);
  }
}
