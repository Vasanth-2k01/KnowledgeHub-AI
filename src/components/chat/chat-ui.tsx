"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Paperclip, FilePlus2, Library, User, Bot, Loader2, X, Check, File, FileText, FileArchive, FileCode, FileType2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import TextareaAutosize from "react-textarea-autosize"
import { useChatContext } from "@/context/ChatContext"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useDocuments, DocumentData } from "@/hooks/useDocuments"
import { toast } from "sonner"
import { MarkdownRenderer } from "./MarkdownRenderer"
import { CitationSidebar } from "./CitationSidebar"
import { CitationSource } from "@/services/search/semanticSearch"

interface AttachedDocument {
  id: string;
  originalFileName: string;
  fileType: string;
  status: 'uploading' | 'processing' | 'ready' | 'failed';
}

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: CitationSource[];
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
  
  const [isCitationSidebarOpen, setIsCitationSidebarOpen] = useState(false)
  const [activeCitations, setActiveCitations] = useState<CitationSource[]>([])
  const [activeCitationId, setActiveCitationId] = useState<string | null>(null)
  
  const handleCitationClick = (citationId: string, citations: CitationSource[]) => {
    setActiveCitations(citations);
    setActiveCitationId(citationId);
    setIsCitationSidebarOpen(true);
  }
  
  const [attachedDocuments, setAttachedDocuments] = useState<AttachedDocument[]>([])
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const { documents, isLoading: isLoadingDocs, fetchDocuments } = useDocuments()
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: isLoading ? "auto" : "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const { addChatOptimistically, updateChatOptimistically, newChatTrigger } = useChatContext()

  // Reset state when newChatTrigger fires (user clicked "New Chat")
  useEffect(() => {
    if (newChatTrigger > 0) {
      setMessages([]);
      setChatId(undefined);
      setIsCitationSidebarOpen(false);
    }
  }, [newChatTrigger]);

  useEffect(() => {
    setMessages(initialMessages || []);
    setChatId(initialChatId);
  }, [initialChatId, initialMessages]);

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const MAX_SIZE = 20 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      toast.error("File too large. Maximum size is 20MB.")
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    const allowedExtensions = ['.pdf', '.docx', '.txt', '.md']
    const isAllowed = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    if (!isAllowed) {
      toast.error("Invalid file type. Only PDF, DOCX, TXT, and Markdown are allowed.")
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    const tempId = "temp_" + Date.now().toString()
    
    setAttachedDocuments(prev => [
      ...prev,
      { id: tempId, originalFileName: file.name, fileType: file.name.split('.').pop() || '', status: 'uploading' }
    ])

    const formData = new FormData()
    formData.append("file", file)

    let createdDocumentId = "";

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || "Upload failed")
      }

      createdDocumentId = data.data.documentId
      
      setAttachedDocuments(prev => prev.map(doc => 
        doc.id === tempId ? { ...doc, id: createdDocumentId, status: 'processing' } : doc
      ))

      const indexRes = await fetch(`/api/documents/${createdDocumentId}/index`, {
        method: "POST",
      });

      const indexData = await indexRes.json();

      if (!indexRes.ok) {
        throw new Error(indexData.error || "Indexing failed");
      }

      setAttachedDocuments(prev => prev.map(doc => 
        doc.id === createdDocumentId ? { ...doc, status: 'ready' } : doc
      ))

      fetchDocuments() // Refresh library in background

    } catch (error: any) {
      console.error("Attachment error:", error)
      toast.error(error.message || "Failed to attach document")
      setAttachedDocuments(prev => prev.map(doc => 
        (doc.id === tempId || doc.id === createdDocumentId) ? { ...doc, status: 'failed' } : doc
      ))
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (id: string) => {
    setAttachedDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const getFileIcon = (type: string, className = "h-5 w-5", isSelected = false) => {
    let colorClass = 'text-zinc-500'
    let label = 'FILE'
    let labelBg = 'bg-zinc-500 text-white'
    
    if (type) {
      const t = type.toUpperCase()
      if (t.includes('PDF')) {
        colorClass = 'text-red-500'
        label = 'PDF'
        labelBg = 'bg-red-500 text-white'
      } else if (t.includes('DOCX') || t.includes('WORD')) {
        colorClass = 'text-blue-600'
        label = 'DOCX'
        labelBg = 'bg-blue-600 text-white'
      } else if (t.includes('TXT')) {
        colorClass = 'text-zinc-600'
        label = 'TXT'
        labelBg = 'bg-zinc-600 text-white'
      } else if (t.includes('MARKDOWN') || t.includes('MD')) {
        colorClass = 'text-emerald-600'
        label = 'MD'
        labelBg = 'bg-emerald-600 text-white'
      }
    }

    const isSmall = className.includes('h-3') || className.includes('w-3')
    
    if (isSmall) {
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <File className={`h-full w-full ${colorClass}`} />
        </div>
      )
    }

    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <File className={`h-full w-full ${colorClass}`} strokeWidth={1.5} />
        <div className={`absolute bottom-0 translate-y-1/4 rounded-[2px] px-[4px] py-[1px] text-[8px] font-bold tracking-wider leading-none shadow-sm ${labelBg}`}>
          {label}
        </div>
      </div>
    )
  }

  const toggleLibraryDocument = (doc: DocumentData) => {
    setAttachedDocuments(prev => {
      const exists = prev.find(d => d.id === doc._id)
      if (exists) {
        return prev.filter(d => d.id !== doc._id)
      } else {
        return [...prev, { id: doc._id, originalFileName: doc.originalFileName, fileType: doc.fileType, status: doc.processingStatus === 'completed' ? 'ready' : 'failed' }]
      }
    })
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const isUploading = attachedDocuments.some(doc => doc.status === 'uploading' || doc.status === 'processing');
    if (!prompt.trim() || isLoading || isUploading) return;

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
      const readyDocIds = attachedDocuments.filter(d => d.status === 'ready').map(d => d.id);
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: userMsg, 
          chatId: activeChatId,
          documentIds: readyDocIds.length > 0 ? readyDocIds : undefined,
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
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // Keep the incomplete event in the buffer

        for (const event of events) {
          const lines = event.split('\n');
          if (lines[0] === 'event: sources' && lines[1]?.startsWith('data: ')) {
            const data = lines[1].substring(6);
            try {
              const sources = JSON.parse(data);
              // Sort sources numerically by SOURCE_X index
              sources.sort((a: CitationSource, b: CitationSource) => {
                const aMatch = a.id.match(/^SOURCE_(\d+)$/);
                const bMatch = b.id.match(/^SOURCE_(\d+)$/);
                if (aMatch && bMatch) return parseInt(aMatch[1]) - parseInt(bMatch[1]);
                return 0;
              });
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].citations = sources;
                return newMessages;
              });
            } catch (e) {
              console.error("Failed to parse sources", e);
            }
          } else if (lines[0] === 'event: token' && lines[1]?.startsWith('data: ')) {
            const data = lines[1].substring(6);
            try {
              currentAssistantMessage += JSON.parse(data);
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = currentAssistantMessage;
                return newMessages;
              });
            } catch (e) {
              console.error("Failed to parse token data", e);
            }
          }
        }
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
        <div className="flex w-full max-w-4xl flex-col mx-auto min-h-full p-4 sm:p-8 pb-24 sm:pb-28 pt-10 sm:pt-20">
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
          <div className="w-full max-w-4xl space-y-6 mb-6">
            {messages.map((msg, index) => {
              if (msg.role === 'assistant' && msg.content === "") return null;
              
              return (
              <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Bot className="h-5 w-5" />
                  </div>
                )}
                
                <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'max-w-[85%]' : 'w-full sm:max-w-[850px]'}`}>
                  <div className={`px-5 py-3.5 rounded-2xl text-[15px] ${
                    msg.role === 'user' 
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-sm leading-relaxed' 
                      : 'bg-white border border-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 rounded-tl-sm shadow-sm leading-[1.6]'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <MarkdownRenderer 
                        content={msg.content} 
                        citations={msg.citations}
                        onCitationClick={(id) => handleCitationClick(id, msg.citations || [])}
                      />
                    )}
                  </div>
                  
                  {/* Temporarily disabled citation functionality
                  {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                    <div className="flex mt-1">
                      <button 
                        onClick={() => handleCitationClick(msg.citations![0].id, msg.citations!)}
                        className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                      >
                        <span className="text-[13px] leading-none mb-[1px]">ⓘ</span>
                        <span>Answer based on {msg.citations.length} source{msg.citations.length === 1 ? '' : 's'}</span>
                      </button>
                    </div>
                  )}
                  */}
                </div>

                {msg.role === 'user' && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            )})}
            
            {isLoading && (messages[messages.length - 1]?.role === 'user' || (messages[messages.length - 1]?.role === 'assistant' && messages[messages.length - 1]?.content === "")) && (
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
        <form onSubmit={handleSubmit} className="w-full relative group max-w-4xl mx-auto">
          <div className="relative flex flex-col w-full rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all focus-within:border-zinc-300 focus-within:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:border-zinc-700">
            
            {attachedDocuments.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 px-4 pt-3 pb-1 w-full border-b border-zinc-100 dark:border-zinc-800/50">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mr-1 flex items-center">
                  <Library className="h-3 w-3 mr-1" />
                  Sources
                </span>
                
                {attachedDocuments.map(doc => (
                  <div key={doc.id} className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-md px-2 py-1 text-xs border border-zinc-200 dark:border-zinc-700">
                    {getFileIcon(doc.fileType, "h-3 w-3 mr-1", false)}
                    <span className="truncate max-w-[120px] text-zinc-700 dark:text-zinc-300 mr-2" title={doc.originalFileName}>
                      {doc.originalFileName}
                    </span>
                    {doc.status === 'uploading' && <Loader2 className="h-3 w-3 animate-spin text-blue-500 mr-1" />}
                    {doc.status === 'processing' && <Loader2 className="h-3 w-3 animate-spin text-purple-500 mr-1" />}
                    {doc.status === 'failed' && <span className="text-[10px] text-red-500 mr-1">Failed</span>}
                    <button type="button" onClick={() => removeAttachment(doc.id)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Input Row */}
            <div className="flex items-end gap-2 px-3 py-2 w-full">
              {/* Left Action Buttons */}
              <div className="flex items-center gap-1 pb-1">
                <Button type="button" onClick={handleUploadClick} variant="ghost" size="icon" title="Attach file" className="h-8 w-8 text-zinc-500 rounded-full hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors shrink-0">
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.docx,.txt,.md"
                />
                
                <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
                  <DialogTrigger render={
                    <Button type="button" variant="ghost" size="icon" title="Open library" className="h-8 w-8 text-zinc-500 rounded-full hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors shrink-0" />
                  }>
                    <Library className="h-4 w-4" />
                    <span className="sr-only">Library</span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Select Library Items</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto py-4 space-y-2">
                      {isLoadingDocs ? (
                        <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
                      ) : documents.length === 0 ? (
                        <p className="text-sm text-center text-zinc-500">No documents found in library.</p>
                      ) : (
                        documents.filter(d => d.processingStatus === 'completed').map(doc => {
                          const isSelected = attachedDocuments.some(d => d.id === doc._id)
                          return (
                            <div 
                              key={doc._id} 
                              onClick={() => toggleLibraryDocument(doc)}
                              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {getFileIcon(doc.fileType, "h-5 w-5 flex-shrink-0", isSelected)}
                                <div className="flex flex-col overflow-hidden">
                                  <span className="text-sm font-medium truncate">{doc.originalFileName}</span>
                                  <span className="text-[11px] text-zinc-500">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />}
                            </div>
                          )
                        })
                      )}
                    </div>
                    <div className="flex justify-end pt-2 border-t dark:border-zinc-800">
                      <Button onClick={() => setIsLibraryOpen(false)}>Done</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Text Area */}
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
                className="max-h-[300px] flex-1 resize-none overflow-hidden bg-transparent py-2.5 text-[15px] leading-relaxed text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-400 self-center"
                maxRows={10}
                disabled={isLoading}
              />
              
              {/* Send Button */}
              <div className="pb-1 shrink-0">
                <Button 
                  type="submit"
                  size="icon" 
                  title="Send message"
                  className="h-8 w-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white transition-all disabled:opacity-30 disabled:bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:disabled:bg-zinc-100"
                  disabled={!prompt.trim() || isLoading || attachedDocuments.some(doc => doc.status === 'uploading' || doc.status === 'processing')}
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
      
      {/* Temporarily disabled citation sidebar
      <CitationSidebar 
        isOpen={isCitationSidebarOpen}
        onClose={() => setIsCitationSidebarOpen(false)}
        citations={activeCitations}
        activeCitationId={activeCitationId}
      />
      */}
    </div>
  )
}
