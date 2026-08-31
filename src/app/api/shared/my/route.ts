import { NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import { ChatRepository } from "@/services/chat/repository";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = await getDbUserId(session);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sharedChats = await ChatRepository.getSharedChats(userId);

    // Filter to only needed fields
    const safeChats = sharedChats.map(chat => ({
      _id: chat._id,
      title: chat.title,
      isShared: chat.isShared,
      shareToken: chat.shareToken,
      sharedAt: chat.sharedAt,
    }));

    return NextResponse.json(safeChats);
  } catch (error: any) {
    console.error("[SHARED_CHATS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch shared chats" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    const userId = await getDbUserId(session);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("id");
    
    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }

    const success = await ChatRepository.deleteShare(chatId, userId);

    if (!success) {
      return NextResponse.json({ error: "Chat not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[SHARED_CHATS_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete share link" },
      { status: 500 }
    );
  }
}
