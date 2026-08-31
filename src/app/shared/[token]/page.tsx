"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Bot, User, Command, Loader2, ArrowRight, Link2Off, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer"
import { ThemeToggle } from "@/components/theme-toggle"

interface SharedMessage {
  role: "user" | "assistant"
  content: string
}

export default function SharedChatPage() {
  const params = useParams()
  const router = useRouter()
  const [messages, setMessages] = useState<SharedMessage[]>([])
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const token = params.token as string

  useEffect(() => {
    async function fetchSharedChat() {
      try {
        const res = await fetch(`/api/shared/${token}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setMessages(data.messages)
        setTitle(data.title)
      } catch (err) {
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchSharedChat()
    }
  }, [token])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100/50 dark:bg-zinc-950 animate-in fade-in duration-500">
      {/* Unified Header */}
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-4 sm:px-6 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
            <Command className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-lg hidden sm:inline-block">
            KnowledgeHub AI
          </span>
        </Link>
        
        <div className="flex items-center gap-1 sm:gap-3">
          {!error && !isLoading && (
            <Button variant="ghost" size="sm" onClick={handleCopyLink} className="h-9 px-3 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 rounded-full">
              <Link2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline-block font-medium">Copy Link</span>
            </Button>
          )}
          <ThemeToggle />
          <Link href="/login" className="inline-flex items-center justify-center h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold px-4 sm:px-5 transition-colors shadow-sm ml-2 sm:ml-0">
            Sign In <ArrowRight className="ml-1.5 h-3.5 w-3.5 hidden sm:inline-block" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col py-6 sm:py-10 px-4">
        {isLoading ? (
          <div className="mx-auto w-full max-w-4xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[32px] shadow-sm p-6 sm:p-12">
            <div className="mb-12 text-center space-y-4">
              <div className="h-7 w-32 bg-zinc-100 dark:bg-zinc-800 rounded-full mx-auto animate-pulse" />
              <div className="h-10 w-64 bg-zinc-100 dark:bg-zinc-800 rounded-xl mx-auto animate-pulse" />
            </div>
            
            <div className="space-y-8 sm:space-y-10">
              {/* User Message Skeleton */}
              <div className="flex gap-3 sm:gap-4 justify-end">
                <div className="flex flex-col gap-2 w-full max-w-[80%] items-end">
                  <div className="h-3 w-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse mb-1" />
                  <div className="h-14 w-3/4 sm:w-1/2 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-[20px] rounded-tr-sm" />
                </div>
                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              </div>
              
              {/* AI Message Skeleton */}
              <div className="flex gap-3 sm:gap-4 justify-start">
                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                <div className="flex flex-col gap-2 w-full max-w-[80%] items-start">
                  <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse mb-1" />
                  <div className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50 rounded-[20px] rounded-tl-sm p-4 sm:p-5">
                    <div className="space-y-3">
                      <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                      <div className="h-3 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                      <div className="h-3 w-4/6 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* User Message Skeleton 2 */}
              <div className="flex gap-3 sm:gap-4 justify-end">
                <div className="flex flex-col gap-2 w-full max-w-[80%] items-end">
                  <div className="h-3 w-12 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse mb-1" />
                  <div className="h-12 w-2/3 sm:w-1/3 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-[20px] rounded-tr-sm" />
                </div>
                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full flex flex-col items-center text-center p-8 sm:p-12 border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 mb-6 border border-red-100 dark:border-red-900/30">
                <Link2Off className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">Link Unavailable</h2>
              <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                This conversation is no longer shared, the link is invalid, or it has been permanently deleted by the owner.
              </p>
              <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 mb-8" />
              <p className="text-sm text-zinc-500 font-medium mb-4">Want to explore KnowledgeHub AI?</p>
              <Link href="/" className="w-full inline-flex items-center justify-center h-11 px-6 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-[15px] font-medium transition-colors shadow-sm">
                Start your own chat
              </Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-4xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[32px] shadow-sm p-6 sm:p-12">
            
            <div className="mb-12 text-center space-y-4">
              <div className="inline-flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-100/50 dark:border-blue-800/30 tracking-wide uppercase">
                Shared Conversation
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 px-4 leading-tight">
                {title}
              </h1>
            </div>

            <div className="space-y-8 sm:space-y-10">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-600 flex items-center justify-center text-white mt-1 sm:mt-0 shadow-sm">
                      <Command className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  )}
                  
                  <div className={`flex flex-col max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1.5 px-1">
                      <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                        {msg.role === 'user' ? 'Original User' : 'KnowledgeHub AI'}
                      </span>
                    </div>
                    
                    <div className={`relative px-4 sm:px-5 py-3 sm:py-4 rounded-[20px] text-[14px] sm:text-[15px] shadow-sm transition-all ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-zinc-50 border border-zinc-100 text-zinc-800 dark:bg-zinc-950/50 dark:border-zinc-800/80 dark:text-zinc-200 rounded-tl-sm leading-[1.6]'
                  }`}>
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 mt-1 sm:mt-0 shadow-sm border border-zinc-200 dark:border-zinc-700">
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-20 text-center border-t border-zinc-100 dark:border-zinc-800/80 pt-12 pb-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-5 border border-blue-100 dark:border-blue-800/30">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">Want to chat with your own documents?</h3>
              <p className="text-[15px] text-zinc-500 mb-8 max-w-sm mx-auto">Join KnowledgeHub AI to build your personal knowledge base and get instant answers.</p>
              <Link href="/register" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
          </div>
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="py-6 text-center text-[13px] font-medium text-zinc-400 dark:text-zinc-500 relative z-10">
        &copy; {new Date().getFullYear()} KnowledgeHub AI. All rights reserved.
      </footer>
    </div>
  )
}
