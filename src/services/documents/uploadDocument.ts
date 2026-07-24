import dbConnect from "@/config/db";
import { Document } from "@/models/Document";
import { saveFileLocally } from "@/lib/storage/storage";
import mongoose from "mongoose";

export async function uploadDocumentService(
  userId: string,
  file: File
) {
  // Ensure DB connection
  await dbConnect();

  // 1. Convert File to Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 2. Determine File Type string based on extension or mime
  const originalFileName = file.name;
  let fileType = "Unknown";
  if (originalFileName.toLowerCase().endsWith(".pdf")) fileType = "PDF";
  else if (originalFileName.toLowerCase().endsWith(".docx")) fileType = "DOCX";
  else if (originalFileName.toLowerCase().endsWith(".txt")) fileType = "TXT";
  else if (originalFileName.toLowerCase().endsWith(".md")) fileType = "Markdown";

  // 3. Save file to storage
  const { storedFileName, storagePath } = await saveFileLocally(
    userId,
    originalFileName,
    buffer
  );

  // 4. Create MongoDB record
  const newDocument = await Document.create({
    userId: new mongoose.Types.ObjectId(userId),
    originalFileName,
    storedFileName,
    fileType,
    mimeType: file.type || "application/octet-stream",
    fileSize: file.size,
    storagePath,
    processingStatus: "uploaded",
  });

  return {
    documentId: newDocument._id.toString(),
    filename: newDocument.originalFileName,
    size: newDocument.fileSize,
    processingStatus: newDocument.processingStatus,
    fileType: newDocument.fileType,
    createdAt: newDocument.createdAt,
  };
}
