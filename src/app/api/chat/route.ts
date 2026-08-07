import { NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import { ChatService } from "@/services/chat/chat";
import { ChatRepository } from "@/services/chat/repository";
import { apiError } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = await getDbUserId(session);

    if (!userId) {
      return apiError("Unauthorized", "User not found", 401);
    }

    const body = await req.json();
    const { query, documentId, chatId, saveUserMessage = true } = body;

    if (!query || typeof query !== "string") {
      return apiError("Invalid request", "Query is required", 400);
    }

    // Save the user's message if this is part of an existing chat.
    // (If it's a new chat, the POST /api/chats route handles the first user message)
    if (chatId && saveUserMessage) {
      await ChatRepository.saveMessage(chatId, "user", query);
    }

    // Call the ChatService orchestrator
    const stream = await ChatService.handleStreamingQuery(query, userId, documentId, chatId);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("[Chat API Error]", error);
    return apiError(error, "An error occurred while processing your query", 500);
  }
}
