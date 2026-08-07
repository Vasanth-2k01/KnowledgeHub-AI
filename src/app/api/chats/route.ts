import { NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import { ChatRepository } from "@/services/chat/repository";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = await getDbUserId(session);

    if (!userId) {
      return apiError("Unauthorized", "User not found", 401);
    }

    const chats = await ChatRepository.getChats(userId);

    return apiSuccess(chats);
  } catch (error: any) {
    console.error("[GET /api/chats]", error);
    return apiError(error, "An error occurred while fetching chats", 500);
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = await getDbUserId(session);

    if (!userId) {
      return apiError("Unauthorized", "User not found", 401);
    }

    const body = await req.json();
    const { firstMessage } = body;

    if (!firstMessage || typeof firstMessage !== "string") {
      return apiError("Invalid request", "firstMessage is required", 400);
    }

    // 1. Create the Chat with default title "New Chat"
    const chat = await ChatRepository.createChat(userId, "New Chat");
    
    // 2. Save the user's first message
    await ChatRepository.saveMessage(chat._id.toString(), "user", firstMessage);

    return apiSuccess({ chatId: chat._id.toString() }, "Chat created successfully", 201);
  } catch (error: any) {
    console.error("[POST /api/chats]", error);
    return apiError(error, "An error occurred while creating the chat", 500);
  }
}
