"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Command, 
  MessageSquare, 
  FileText, 
  Share2, 
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserDropdown } from "./user-dropdown"
import { Session } from "next-auth"

const bottomRoutes = [
  {
    label: "Documents",
    icon: FileText,
    href: "/documents",
  },
]

// Mock History
const mockChats = [
  { id: "1", title: "React Authentication" },
  { id: "2", title: "RAG Overview" },
  { id: "3", title: "MongoDB Notes" },
  { id: "4", title: "Next.js App Router" },
]

export function Sidebar({ session }: { session: Session | null }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [chatsExpanded, setChatsExpanded] = useState(true)

  return (
    <div
      className={cn(
        "relative hidden h-screen flex-col bg-zinc-50 dark:bg-zinc-950 transition-all duration-300 md:flex flex-shrink-0",
        collapsed ? "w-16" : "w-64 lg:w-72"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center px-4 justify-between">
        <Link href="/chat" className={cn("flex items-center gap-2 overflow-hidden", collapsed ? "hidden" : "flex")}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
            <Command className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-lg whitespace-nowrap">
            KnowledgeHub AI
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 rounded-xl hidden md:flex"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 py-2">
        <Button 
          variant={collapsed ? "ghost" : "default"} 
          className={cn(
            "w-full justify-start rounded-xl shadow-sm transition-all h-10", 
            collapsed ? "px-0 justify-center shadow-none hover:bg-zinc-200/50 dark:hover:bg-zinc-800" : "bg-blue-600 hover:bg-blue-700 text-white"
          )}
          onClick={() => window.location.href = '/chat'}
        >
          <Plus className={cn("h-4 w-4 shrink-0", !collapsed && "mr-2")} />
          {!collapsed && <span>New Chat</span>}
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-hide">
        {!collapsed && (
          <div className="space-y-1">
            <button 
              onClick={() => setChatsExpanded(!chatsExpanded)}
              className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            >
              <span>Chats</span>
              {chatsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {chatsExpanded && (
              <div className="space-y-0.5 animate-in slide-in-from-top-1 fade-in duration-200">
                {mockChats.map((chat) => (
                  <div key={chat.id} className="group relative flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-200/50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
                    <Link
                      href={`/chat/${chat.id}`}
                      className="flex-1 truncate pr-6 block"
                    >
                      {chat.title}
                    </Link>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="absolute right-1 h-6 w-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-500 dark:focus:text-red-500">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {collapsed && (
          <div className="flex flex-col items-center gap-2 pt-2">
            <MessageSquare className="h-5 w-5 text-zinc-400" />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1">
        {bottomRoutes.map((route) => {
          const isActive = pathname.startsWith(route.href)
          
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-200/50 text-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-50"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? route.label : undefined}
            >
              <route.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{route.label}</span>}
            </Link>
          )
        })}
      </div>

      {/* User Footer */}
      {session && (
        <div className="p-3 pt-0">
          <div className={cn(collapsed ? "flex justify-center" : "")}>
             <UserDropdown user={session.user} />
          </div>
        </div>
      )}
    </div>
  )
}
