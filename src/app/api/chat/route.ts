import { NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import { ChatService } from "@/services/chat/chat";
import { ChatRepository } from "@/services/chat/repository";
import { apiError } from "@/lib/api-response";

export const maxDuration = 60; // Max allowed for Hobby plan to prevent stream from dropping


export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = await getDbUserId(session);

    if (!userId) {
      return apiError("Unauthorized", "User not found", 401);
    }

    const body = await req.json();
    const { query, documentIds, chatId, saveUserMessage = true } = body;

    if (!query || typeof query !== "string") {
      return apiError("Invalid request", "Query is required", 400);
    }

    // Save the user's message if this is part of an existing chat.
    // (If it's a new chat, the POST /api/chats route handles the first user message)
    if (chatId && saveUserMessage) {
      await ChatRepository.saveMessage(chatId, "user", query);
    }

    // Call the ChatService orchestrator
    const { stream, sources } = await ChatService.handleStreamingQuery(query, userId, documentIds, chatId);

    const encoder = new TextEncoder();
    let fullText = "";

    const sseStream = new TransformStream({
      start(controller) {
        // We no longer send sources at the start.
      },
      transform(chunk, controller) {
        const text = new TextDecoder("utf-8").decode(chunk, { stream: true });
        fullText += text;
        controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify(text)}\n\n`));
      },
      flush(controller) {
        // Flush remaining text
        fullText += new TextDecoder("utf-8").decode();
        
        if (sources && sources.length > 0) {
          // Filter sources based on fullText
          const usedSources = sources.filter(s => {
            const indexMatch = s.id.match(/^SOURCE_(\d+)$/);
            if (!indexMatch) return false;
            const regex = new RegExp(`\\[SOURCE_${indexMatch[1]}\\]`);
            return regex.test(fullText);
          });
          
          if (usedSources.length > 0) {
            controller.enqueue(encoder.encode(`event: sources\ndata: ${JSON.stringify(usedSources)}\n\n`));
          }
        }
      }
    });

    return new Response(stream.pipeThrough(sseStream), {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("[Chat API Error]", error);
    return apiError(error, "An error occurred while processing your query", 500);
  }
}
