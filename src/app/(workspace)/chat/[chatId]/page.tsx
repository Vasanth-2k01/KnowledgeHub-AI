import { redirect } from "next/navigation";
import { auth, getDbUserId } from "@/lib/auth";
import { ChatRepository } from "@/services/chat/repository";
import { ChatUI } from "@/components/chat/chat-ui";

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const session = await auth();
  const userId = await getDbUserId(session);
  const resolvedParams = await params;
  const chatId = resolvedParams.chatId;

  if (!userId) {
    redirect("/login");
  }

  try {
    const chat = await ChatRepository.getChatById(chatId);
    
    if (!chat || chat.userId.toString() !== userId) {
      redirect("/chat");
    }

    const rawMessages = await ChatRepository.getMessages(chatId);
    
    const messages = rawMessages.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
      citations: msg.citations || undefined,
    }));

    return (
      <ChatUI 
        initialChatId={chatId} 
        initialMessages={messages} 
      />
    );
  } catch (error) {
    console.error("Failed to load chat details", error);
    redirect("/chat");
  }
}
