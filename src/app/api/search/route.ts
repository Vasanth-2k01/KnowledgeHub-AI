import { NextRequest, NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import { SemanticSearchService } from "@/services/search/semanticSearch";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = await getDbUserId(session);
    
    if (!userId) {
      return apiError("Unauthorized", "User not found", 401);
    }

    const body = await req.json();
    const { query, documentId } = body;

    if (!query || typeof query !== "string") {
      return apiError("Bad Request", "Search query is required", 400);
    }

    const searchResults = await SemanticSearchService.search(
      query,
      userId,
      documentId ? (Array.isArray(documentId) ? documentId : [documentId]) : undefined
    );

    return apiSuccess(searchResults);
  } catch (error: any) {
    console.error("Search API Error:", error);
    return apiError(error, error.message || "Failed to perform search", 500);
  }
}
