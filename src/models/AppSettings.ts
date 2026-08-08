import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

export interface IAppSettings extends MongooseDocument {
  rag: {
    chunkSize: number;
    chunkOverlap: number;
    topK: number;
    similarityThreshold: number;
    conversationMemoryLimit: number;
  };
  ai: {
    embeddingProvider: string;
    embeddingModel: string;
    llmProvider: string;
    llmModel: string;
  };
  upload: {
    maxFileSizeMB: number;
    allowedFileTypes: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const appSettingsSchema = new Schema<IAppSettings>(
  {
    rag: {
      chunkSize: { type: Number, default: 500 },
      chunkOverlap: { type: Number, default: 100 },
      topK: { type: Number, default: 5 },
      similarityThreshold: { type: Number, default: 0.75 },
      conversationMemoryLimit: { type: Number, default: 10 },
    },
    ai: {
      embeddingProvider: { type: String, default: "huggingface" },
      embeddingModel: { type: String, default: "BAAI/bge-small-en-v1.5" },
      llmProvider: { type: String, default: "huggingface" },
      llmModel: { type: String, default: "Qwen/Qwen3-8B" },
    },
    upload: {
      maxFileSizeMB: { type: Number, default: 20 },
      allowedFileTypes: { type: [String], default: ["pdf", "docx", "txt", "md"] },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from recompiling the model in development if it already exists
export const AppSettings =
  mongoose.models.AppSettings || mongoose.model<IAppSettings>("AppSettings", appSettingsSchema);
