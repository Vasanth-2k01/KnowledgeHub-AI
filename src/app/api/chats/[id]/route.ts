import { auth, getDbUserId } from "@/lib/auth";
import { ChatRepository } from "@/services/chat/repository";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = await getDbUserId(session);

    if (!userId) {
      return apiError("Unauthorized", "User not found", 401);
    }

    const { id } = await params;
    const chat = await ChatRepository.getChatById(id);

    if (!chat) {
      return apiError("Not Found", "Chat not found", 404);
    }

    if (chat.userId.toString() !== userId) {
      return apiError("Forbidden", "You do not have access to this chat", 403);
    }

    return apiSuccess(chat);
  } catch (error: any) {
    console.error("[GET /api/chats/[id]]", error);
    return apiError(error, "An error occurred while fetching the chat", 500);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = await getDbUserId(session);

    if (!userId) {
      return apiError("Unauthorized", "User not found", 401);
    }

    const { id } = await params;
    const { title } = await req.json();

    if (!title || typeof title !== "string") {
      return apiError("Bad Request", "Invalid title provided", 400);
    }

    const chat = await ChatRepository.getChatById(id);
    if (!chat || chat.userId.toString() !== userId) {
      return apiError("Forbidden", "You do not have access to this chat", 403);
    }

    await ChatRepository.updateChatTitle(id, title);
    return apiSuccess({ success: true });
  } catch (error: any) {
    console.error("[PATCH /api/chats/[id]]", error);
    return apiError(error, "Failed to update chat", 500);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = await getDbUserId(session);

    if (!userId) {
      return apiError("Unauthorized", "User not found", 401);
    }

    const { id } = await params;

    const chat = await ChatRepository.getChatById(id);
    if (!chat || chat.userId.toString() !== userId) {
      return apiError("Forbidden", "You do not have access to this chat", 403);
    }

    await ChatRepository.deleteChat(id);
    return apiSuccess({ success: true });
  } catch (error: any) {
    console.error("[DELETE /api/chats/[id]]", error);
    return apiError(error, "Failed to delete chat", 500);
  }
}
