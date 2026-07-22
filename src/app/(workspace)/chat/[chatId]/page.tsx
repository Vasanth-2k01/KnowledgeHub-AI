"use client"

import { useState } from "react"
import { Send, Paperclip, Square, Library, FilePlus2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import TextareaAutosize from "react-textarea-autosize"

export default function ActiveChatPage() {
  const [prompt, setPrompt] = useState("")

  // Mock messages for UI
  const messages = [
    { role: "user", content: "Can you explain how React works?" },
    { role: "assistant", content: "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called \"components\"." },
    { role: "user", content: "What are hooks?" },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="mx-auto max-w-3xl space-y-8">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-3xl px-5 py-4 ${
                msg.role === 'user' 
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50' 
                  : 'bg-transparent text-zinc-900 dark:text-zinc-50 text-base leading-relaxed'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {/* Simulating typing state */}
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-3xl px-5 py-4 bg-transparent text-zinc-900 dark:text-zinc-50 flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce"></span>
              <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce delay-75"></span>
              <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce delay-150"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area (Fixed at bottom) */}
      <div className="p-4 sm:p-8 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 pt-0">
        <div className="mx-auto max-w-3xl space-y-3">
          
          <div className="flex justify-center mb-1">
             <Button variant="outline" size="sm" className="h-8 rounded-full text-xs bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800">
               <Square className="mr-2 h-3 w-3 fill-current" />
               Stop generating
             </Button>
          </div>

          {/* Unified Chat Composer */}
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
      </div>
    </div>
  )
}
