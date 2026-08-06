import { NextRequest, NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import { SemanticSearchService } from "@/services/search/semanticSearch";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = await getDbUserId(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { query, documentId } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const searchResults = await SemanticSearchService.search(
      query,
      userId,
      documentId
    );

    return NextResponse.json(searchResults, { status: 200 });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to perform search" },
      { status: 500 }
    );
  }
}
