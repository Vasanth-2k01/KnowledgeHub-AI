import { NextRequest, NextResponse } from "next/server";
import { auth, getDbUserId } from "@/lib/auth";
import { uploadDocumentService } from "@/services/documents/uploadDocument";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt", ".md"];

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication
    const session = await auth();
    const userId = await getDbUserId(session);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized or User not found" }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // 3. Validation: File exists
    if (!file) {
      return NextResponse.json({ error: "No file selected." }, { status: 400 });
    }

    // 4. Validation: File size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 20MB." },
        { status: 400 }
      );
    }

    // 5. Validation: File type
    const originalFileName = file.name.toLowerCase();
    const isAllowed = ALLOWED_EXTENSIONS.some((ext) =>
      originalFileName.endsWith(ext)
    );
    if (!isAllowed) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only PDF, DOCX, TXT, and Markdown are allowed.",
        },
        { status: 400 }
      );
    }

    // 6. Call Service
    const result = await uploadDocumentService(userId, file);

    // 7. Return success
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Upload Document API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload document." },
      { status: 500 }
    );
  }
}
