import { NextRequest, NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import connectDB from "@/config/db";
import { IndexDocumentService } from "@/services/qdrant/indexDocument";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await auth();
    const userId = await getDbUserId(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const documentId = params.id;

    // The entire extraction, chunking, embedding, Qdrant insertion, 
    // and MongoDB updating pipeline is encapsulated here.
    const result = await IndexDocumentService.process(documentId, userId);

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error("Index API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to index document." },
      { status: 500 }
    );
  }
}
