import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface IDocument extends MongooseDocument {
  userId: mongoose.Types.ObjectId;
  originalFileName: string;
  storedFileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  processingStatus: "uploaded" | "processing" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    originalFileName: { type: String, required: true },
    storedFileName: { type: String, required: true },
    fileType: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    storagePath: { type: String, required: true },
    processingStatus: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from recompiling the model in development if it already exists
export const Document =
  mongoose.models.Document || mongoose.model<IDocument>("Document", documentSchema);
