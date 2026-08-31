import mongoose, { Document, Schema, Types } from "mongoose";

export interface IChat extends Document {
  userId: Types.ObjectId;
  title: string;
  isShared: boolean;
  shareToken?: string;
  sharedAt?: Date;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, default: "New Chat", maxlength: 60 },
    isShared: { type: Boolean, default: false },
    shareToken: { type: String },
    sharedAt: { type: Date },
    lastMessageAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Add indexes for efficient querying
ChatSchema.index({ userId: 1, lastMessageAt: -1 });
ChatSchema.index({ shareToken: 1 }, { unique: true, sparse: true });

export const ChatModel = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
