import mongoose, { Document, Schema, Types } from "mongoose";
import { CitationSource } from "@/services/search/semanticSearch";

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  citations?: CitationSource[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    citations: { type: [Schema.Types.Mixed], default: undefined },
  },
  {
    timestamps: true,
  }
);

// Add indexes for efficient querying
MessageSchema.index({ chatId: 1, createdAt: 1 });

export const MessageModel = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
