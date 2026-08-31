import { NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import { ChatRepository } from "@/services/chat/repository";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = await getDbUserId(session);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: chatId } = await params;
    
    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }

    const token = await ChatRepository.enableShare(chatId, userId);

    if (!token) {
      return NextResponse.json({ error: "Chat not found or unauthorized" }, { status: 404 });
    }

    // Generate the full URL for the client to use
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "";
    const shareUrl = `${origin}/shared/${token}`;

    return NextResponse.json({ token, shareUrl });
  } catch (error: any) {
    console.error("[SHARE_CHAT_POST]", error);
    return NextResponse.json(
      { error: "Failed to enable sharing" },
      { status: 500 }
    );
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: chatId } = await params;
    
    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
    }

    const success = await ChatRepository.disableShare(chatId, userId);

    if (!success) {
      return NextResponse.json({ error: "Chat not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[SHARE_CHAT_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to disable sharing" },
      { status: 500 }
    );
  }
}
