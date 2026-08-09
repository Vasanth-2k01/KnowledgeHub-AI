import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface IDocument extends MongooseDocument {
  userId: mongoose.Types.ObjectId;
  originalFileName: string;
  storedFileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  storageProvider: string;
  processingStatus: "uploaded" | "processing" | "completed" | "failed";
  indexedAt?: Date;
  chunkCount?: number;
  vectorCount?: number;
  embeddingModel?: string;
  indexVersion?: number;
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
    storageProvider: { type: String, required: true, default: "local" },
    processingStatus: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
      required: true,
    },
    indexedAt: { type: Date },
    chunkCount: { type: Number },
    vectorCount: { type: Number },
    embeddingModel: { type: String },
    indexVersion: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from recompiling the model in development if it already exists
// Delete it from cache to ensure schema updates apply during Hot Module Reload
if (mongoose.models.Document) {
  delete mongoose.models.Document;
}

export const Document = mongoose.model<IDocument>("Document", documentSchema);
