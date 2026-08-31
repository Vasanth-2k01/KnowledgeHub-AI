import connectDB from "@/config/db";
import { ChatModel, IChat } from "@/models/Chat";
import { MessageModel, IMessage } from "@/models/Message";
import { Types } from "mongoose";
import crypto from "crypto";

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
    content: string,
    citations?: any[]
  ): Promise<IMessage> {
    await connectDB();

    const message = await MessageModel.create({
      chatId: new Types.ObjectId(chatId),
      role,
      content,
      ...(citations && { citations }),
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
   * Retrieves the most recent messages for a specific chat.
   * Sorted descending (newest first) from the DB for efficient retrieval, 
   * but can be reversed by the caller if chronological order is needed.
   */
  static async getRecentMessages(chatId: string, limit: number): Promise<IMessage[]> {
    await connectDB();

    return MessageModel.find({ chatId: new Types.ObjectId(chatId) })
      .sort({ createdAt: -1 })
      .limit(limit)
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

  /**
   * Enables sharing for a chat and returns the token.
   */
  static async enableShare(chatId: string, userId: string): Promise<string | null> {
    await connectDB();
    const chat = await ChatModel.findOne({ _id: new Types.ObjectId(chatId), userId: new Types.ObjectId(userId) });
    if (!chat) return null;

    let token = chat.shareToken;
    if (!token) {
      token = crypto.randomUUID();
    }

    await ChatModel.findByIdAndUpdate(chatId, {
      isShared: true,
      shareToken: token,
      sharedAt: chat.sharedAt || new Date(),
    });

    return token;
  }

  /**
   * Disables sharing for a chat.
   */
  static async disableShare(chatId: string, userId: string): Promise<boolean> {
    await connectDB();
    const result = await ChatModel.findOneAndUpdate(
      { _id: new Types.ObjectId(chatId), userId: new Types.ObjectId(userId) },
      { isShared: false }
    );
    return !!result;
  }
  
  /**
   * Deletes a share link completely.
   */
  static async deleteShare(chatId: string, userId: string): Promise<boolean> {
    await connectDB();
    const result = await ChatModel.findOneAndUpdate(
      { _id: new Types.ObjectId(chatId), userId: new Types.ObjectId(userId) },
      { $set: { isShared: false }, $unset: { shareToken: 1, sharedAt: 1 } }
    );
    return !!result;
  }

  /**
   * Gets all chats that have a share token for the management page.
   */
  static async getSharedChats(userId: string): Promise<IChat[]> {
    await connectDB();
    return ChatModel.find({ 
      userId: new Types.ObjectId(userId),
      shareToken: { $exists: true, $ne: null }
    })
    .sort({ sharedAt: -1 })
    .lean();
  }

  /**
   * Gets a chat by its public share token.
   */
  static async getChatByToken(token: string): Promise<IChat | null> {
    await connectDB();
    return ChatModel.findOne({ 
      shareToken: token, 
      isShared: true 
    }).lean();
  }
}
