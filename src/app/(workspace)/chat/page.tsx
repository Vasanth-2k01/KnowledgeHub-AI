"use client"

import { useState } from "react"
import { Send, Paperclip, FilePlus2, Library } from "lucide-react"
import { Button } from "@/components/ui/button"
import TextareaAutosize from "react-textarea-autosize"

const SUGGESTED_PROMPTS = [
  "Explain this document",
  "Summarize my PDF",
  "Generate interview questions",
  "Compare two documents",
]

export default function ChatPage() {
  const [prompt, setPrompt] = useState("")

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-500 overflow-y-auto">
      <div className="flex w-full max-w-3xl flex-col items-center justify-center space-y-10 my-auto">
        
        {/* Welcome Section */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            KnowledgeHub AI
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            Ask questions, upload documents, and discover knowledge with AI-powered semantic search.
          </p>
        </div>

        {/* Unified Input Area */}
        <div className="w-full relative group max-w-3xl mx-auto">
          <div className="relative flex flex-col w-full rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all focus-within:border-zinc-300 focus-within:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:border-zinc-700">
            
            {/* Knowledge Sources Placeholder */}
            <div className="flex flex-wrap items-center gap-2 px-5 pt-4 pb-0 w-full">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mr-1 flex items-center">
                <Library className="h-3 w-3 mr-1" />
                Sources
              </span>
              <Button variant="outline" size="sm" className="h-7 rounded-full border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-none text-[11px] px-3 transition-colors text-zinc-600 dark:text-zinc-400">
                <FilePlus2 className="mr-1.5 h-3 w-3" />
                Attach Files
              </Button>
              <Button variant="outline" size="sm" className="h-7 rounded-full border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-none text-[11px] px-3 transition-colors text-zinc-600 dark:text-zinc-400">
                <Library className="mr-1.5 h-3 w-3" />
                Library
              </Button>
            </div>

            <TextareaAutosize
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Message KnowledgeHub AI..."
              className="max-h-[300px] w-full resize-none overflow-hidden bg-transparent px-5 py-4 pr-16 text-[15px] leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
              maxRows={10}
            />
            
            <div className="flex items-center justify-between px-4 pb-4">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400 rounded-full hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach file</span>
              </Button>
              <div className="absolute right-4 bottom-4">
                <Button 
                  size="icon" 
                  className="h-9 w-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white transition-all disabled:opacity-30 disabled:bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:disabled:bg-zinc-100"
                  disabled={!prompt.trim()}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto px-4 mt-2">
          {SUGGESTED_PROMPTS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-[13px] font-medium text-zinc-600 transition-all hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:hover:border-zinc-700 shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
        
      </div>
    </div>
  )
}
