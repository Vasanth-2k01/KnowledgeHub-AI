import { NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import { ChatService } from "@/services/chat/chat";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = await getDbUserId(session);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { query, documentId } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Call the ChatService orchestrator
    const stream = await ChatService.handleStreamingQuery(query, userId, documentId);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("[Chat API Error]", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while processing your query" },
      { status: 500 }
    );
  }
}
