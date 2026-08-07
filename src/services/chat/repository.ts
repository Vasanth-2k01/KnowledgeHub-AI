import connectDB from "@/config/db";
import { ChatModel, IChat } from "@/models/Chat";
import { MessageModel, IMessage } from "@/models/Message";
import { Types } from "mongoose";

export class ChatRepository {
  /**
   * Creates a new chat for the user.
   */
  static async createChat(userId: string, title: string = "New Chat"): Promise<IChat> {
    await connectDB();
    
    const chat = await ChatModel.create({
      userId: new Types.ObjectId(userId),
      title,
    });
    
    return chat;
  }

  /**
   * Saves a message to the chat and updates the chat's lastMessageAt timestamp.
   */
  static async saveMessage(
    chatId: string,
    role: "user" | "assistant",
    content: string
  ): Promise<IMessage> {
    await connectDB();

    const message = await MessageModel.create({
      chatId: new Types.ObjectId(chatId),
      role,
      content,
    });

    await ChatModel.findByIdAndUpdate(chatId, {
      lastMessageAt: new Date(),
    });

    return message;
  }

  /**
   * Retrieves all chats for a specific user, sorted by lastMessageAt descending.
   */
  static async getChats(userId: string): Promise<IChat[]> {
    await connectDB();
    
    return ChatModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ lastMessageAt: -1 })
      .lean();
  }

  /**
   * Retrieves a specific chat by ID.
   */
  static async getChatById(chatId: string): Promise<IChat | null> {
    await connectDB();
    return ChatModel.findById(chatId).lean();
  }

  /**
   * Retrieves all messages for a specific chat.
   */
  static async getMessages(chatId: string): Promise<IMessage[]> {
    await connectDB();
    
    return MessageModel.find({ chatId: new Types.ObjectId(chatId) })
      .sort({ createdAt: 1 })
      .lean();
  }

  /**
   * Updates the title of an existing chat.
   */
  static async updateChatTitle(chatId: string, title: string): Promise<void> {
    await connectDB();
    await ChatModel.findByIdAndUpdate(chatId, { title });
  }

  /**
   * Deletes a chat and all its associated messages.
   */
  static async deleteChat(chatId: string): Promise<void> {
    await connectDB();
    await ChatModel.findByIdAndDelete(chatId);
    await MessageModel.deleteMany({ chatId: new Types.ObjectId(chatId) });
  }
}
