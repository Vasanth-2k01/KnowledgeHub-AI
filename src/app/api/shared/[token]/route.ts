import { NextResponse } from "next/server";
import { ChatRepository } from "@/services/chat/repository";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    
    if (!token) {
      return NextResponse.json({ error: "Share token is required" }, { status: 400 });
    }

    const chat = await ChatRepository.getChatByToken(token);

    if (!chat) {
      return NextResponse.json({ error: "Chat not found or is no longer shared" }, { status: 404 });
    }

    // Fetch the messages
    const rawMessages = await ChatRepository.getMessages(chat._id.toString());
    
    // We strictly filter what is returned to the public
    // We exclude userId, citations, and internal IDs for security and because citations are disabled
    const safeMessages = rawMessages.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    return NextResponse.json({ 
      title: chat.title,
      messages: safeMessages,
      sharedAt: chat.sharedAt
    });
  } catch (error: any) {
    console.error("[SHARED_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch shared chat" },
      { status: 500 }
    );
  }
}
