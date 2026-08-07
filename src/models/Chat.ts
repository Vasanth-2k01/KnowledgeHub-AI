import mongoose, { Document, Schema, Types } from "mongoose";

export interface IChat extends Document {
  userId: Types.ObjectId;
  title: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, default: "New Chat", maxlength: 60 },
    lastMessageAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Add indexes for efficient querying
ChatSchema.index({ userId: 1, lastMessageAt: -1 });

export const ChatModel = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
