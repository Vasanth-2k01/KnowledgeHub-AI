import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Add indexes for efficient querying
MessageSchema.index({ chatId: 1, createdAt: 1 });

export const MessageModel = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
