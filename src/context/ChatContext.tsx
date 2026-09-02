"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ChatItem = {
  _id: string;
  title: string;
  lastMessageAt: string;
  updatedAt: string;
};

interface ChatContextProps {
  chats: ChatItem[];
  isLoading: boolean;
  refreshChats: () => Promise<void>;
  addChatOptimistically: (chat: ChatItem) => void;
  updateChatOptimistically: (chatId: string, updates: Partial<ChatItem>) => void;
  deleteChatOptimistically: (chatId: string) => void;
  newChatTrigger: number;
  triggerNewChat: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newChatTrigger, setNewChatTrigger] = useState(0);

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/chats");
      if (res.ok) {
        const apiResponse = await res.json();
        // Extract data if success, else fallback to empty
        if (apiResponse.success && apiResponse.data) {
          setChats(apiResponse.data);
        } else {
          setChats([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const addChatOptimistically = (chat: ChatItem) => {
    setChats((prev) => [chat, ...prev]);
  };

  const updateChatOptimistically = (chatId: string, updates: Partial<ChatItem>) => {
    setChats((prev) =>
      prev.map((c) => (c._id === chatId ? { ...c, ...updates } : c))
    );
  };

  const deleteChatOptimistically = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c._id !== chatId));
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        isLoading,
        refreshChats: fetchChats,
        addChatOptimistically,
        updateChatOptimistically,
        deleteChatOptimistically,
        newChatTrigger,
        triggerNewChat: () => setNewChatTrigger(prev => prev + 1),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
