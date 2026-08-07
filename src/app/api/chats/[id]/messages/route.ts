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
      return apiError("Forbidden", "You do not have access to this chat's messages", 403);
    }

    const messages = await ChatRepository.getMessages(id);

    return apiSuccess(messages);
  } catch (error: any) {
    console.error("[GET /api/chats/[id]/messages]", error);
    return apiError(error, "An error occurred while fetching messages", 500);
  }
}
