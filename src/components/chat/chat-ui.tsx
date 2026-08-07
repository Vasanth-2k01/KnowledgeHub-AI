"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Paperclip, FilePlus2, Library, User, Bot, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import TextareaAutosize from "react-textarea-autosize"
import { useChatContext } from "@/context/ChatContext"

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Explain this document",
  "Summarize my PDF",
  "Generate interview questions",
  "Compare two documents",
]

interface ChatUIProps {
  initialChatId?: string;
  initialMessages?: Message[];
}

export function ChatUI({ initialChatId, initialMessages }: ChatUIProps) {
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Message[]>(initialMessages || [])
  const [isLoading, setIsLoading] = useState(false)
  const [chatId, setChatId] = useState<string | undefined>(initialChatId)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const { addChatOptimistically, updateChatOptimistically } = useChatContext()

  useEffect(() => {
    setMessages(initialMessages || []);
    setChatId(initialChatId);
  }, [initialChatId, initialMessages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMsg = prompt.trim();
    setPrompt("");
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    let activeChatId = chatId;
    let isNewChat = false;

    try {
      // 1. Create chat if it doesn't exist
      if (!activeChatId) {
        isNewChat = true;
        const createRes = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstMessage: userMsg }),
        });

        if (!createRes.ok) throw new Error("Failed to create chat");
        
        const createData = await createRes.json();
        
        // Unwrap structured response
        if (!createData.success) throw new Error(createData.message || createData.error || "Failed to create chat");
        
        activeChatId = createData.data.chatId;
        setChatId(activeChatId);

        // Optimistically add to sidebar
        if (activeChatId) {
          addChatOptimistically({
            _id: activeChatId,
            title: "New Chat",
            lastMessageAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          
          // Update URL without triggering a full re-render
          window.history.replaceState(null, "", `/chat/${activeChatId}`);
        }
      }

      // 2. Stream AI response
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: userMsg, 
          chatId: activeChatId,
          saveUserMessage: !isNewChat 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream available");

      const decoder = new TextDecoder("utf-8");
      
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      let currentAssistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        currentAssistantMessage += chunk;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = currentAssistantMessage;
          return newMessages;
        });
      }
      
      // 3. Background update title if this is a new chat
      if (activeChatId) {
        // We do a lightweight fetch to get the updated chat info
        // The backend might take a second to generate the title, so we can poll or just fetch once
        setTimeout(async () => {
          try {
            const chatRes = await fetch(`/api/chats/${activeChatId}`);
            if (chatRes.ok) {
              const apiResponse = await chatRes.json();
              if (apiResponse.success && apiResponse.data) {
                const updatedChat = apiResponse.data;
                if (updatedChat.title !== "New Chat") {
                  updateChatOptimistically(activeChatId as string, {
                    title: updatedChat.title,
                    lastMessageAt: updatedChat.lastMessageAt,
                  });
                }
              }
            }
          } catch (e) {
            console.error("Failed to sync updated title", e);
          }
        }, 3000); // Wait 3s to give LLM time to generate title
      }

    } catch (error: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `Something went wrong while generating the answer: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden relative animate-in fade-in zoom-in-95 duration-500">
      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="flex w-full max-w-3xl flex-col mx-auto min-h-full p-4 sm:p-8 pb-32 sm:pb-40 pt-10 sm:pt-20">
        {/* Welcome Section */}
        {messages.length === 0 && (
          <div className="text-center space-y-3 max-w-xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              KnowledgeHub AI
            </h2>
            <p className="text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Ask questions, upload documents, and discover knowledge with AI-powered semantic search.
            </p>
          </div>
        )}

        {/* Chat History */}
        {messages.length > 0 && (
          <div className="w-full max-w-3xl space-y-6 mb-10">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Bot className="h-5 w-5" />
                  </div>
                )}
                
                <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] text-[15px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-sm' 
                    : 'bg-white border border-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 rounded-tl-sm shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {msg.role === 'user' && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-4 justify-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="px-5 py-3.5 rounded-2xl bg-white border border-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 rounded-tl-sm shadow-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                  <span className="text-zinc-500 text-sm">Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 sm:px-8 sm:pb-8 pt-4 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 dark:to-transparent">
        <form onSubmit={handleSubmit} className="w-full relative group max-w-3xl mx-auto">
          <div className="relative flex flex-col w-full rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all focus-within:border-zinc-300 focus-within:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:border-zinc-700">
            
            <div className="flex flex-wrap items-center gap-2 px-5 pt-4 pb-0 w-full">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mr-1 flex items-center">
                <Library className="h-3 w-3 mr-1" />
                Sources
              </span>
              <Button type="button" variant="outline" size="sm" className="h-7 rounded-full border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-none text-[11px] px-3 transition-colors text-zinc-600 dark:text-zinc-400">
                <FilePlus2 className="mr-1.5 h-3 w-3" />
                Attach Files
              </Button>
              <Button type="button" variant="outline" size="sm" className="h-7 rounded-full border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-none text-[11px] px-3 transition-colors text-zinc-600 dark:text-zinc-400">
                <Library className="mr-1.5 h-3 w-3" />
                Library
              </Button>
            </div>

            <TextareaAutosize
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Message KnowledgeHub AI..."
              className="max-h-[300px] w-full resize-none overflow-hidden bg-transparent px-5 py-4 pr-16 text-[15px] leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
              maxRows={10}
              disabled={isLoading}
            />
            
            <div className="flex items-center justify-between px-4 pb-4">
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 rounded-full hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach file</span>
              </Button>
              <div className="absolute right-4 bottom-4">
                <Button 
                  type="submit"
                  size="icon" 
                  className="h-9 w-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white transition-all disabled:opacity-30 disabled:bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:disabled:bg-zinc-100"
                  disabled={!prompt.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </div>
        </form>

        {messages.length === 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto px-4 mt-2">
            {SUGGESTED_PROMPTS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setPrompt(suggestion)
                }}
                className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-[13px] font-medium text-zinc-600 transition-all hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:hover:border-zinc-700 shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
      </div>
    </div>
  )
}
