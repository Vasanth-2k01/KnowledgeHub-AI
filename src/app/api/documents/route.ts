import { NextRequest, NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import connectDB from "@/config/db";
import { Document } from "@/models/Document";

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication
    const session = await auth();
    const userId = await getDbUserId(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized or User not found" }, { status: 401 });
    }

    // 2. Connect to database
    await connectDB();

    // 3. Fetch documents for the user, sorted by newest
    const documents = await Document.find({ userId })
      .sort({ createdAt: -1 })
      .select(
        "_id originalFileName storedFileName fileType mimeType fileSize storagePath processingStatus createdAt updatedAt"
      )
      .lean();

    // 4. Return success
    return NextResponse.json({ documents }, { status: 200 });
  } catch (error: any) {
    console.error("Get Documents API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch documents." },
      { status: 500 }
    );
  }
}
