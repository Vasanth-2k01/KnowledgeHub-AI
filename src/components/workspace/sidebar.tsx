"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
  Trash,
  Check,
  X
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserDropdown } from "./user-dropdown"
import { Session } from "next-auth"
import { useChatContext } from "@/context/ChatContext"
import { toast } from "sonner"

const bottomRoutes = [
  {
    label: "Library",
    icon: FileText,
    href: "/documents",
  },
  {
    label: "Shared",
    icon: Share2,
    href: "/shared",
  }
]


export function Sidebar({ session }: { session: Session | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [chatsExpanded, setChatsExpanded] = useState(true)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [chatToDelete, setChatToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { chats, isLoading, triggerNewChat, updateChatOptimistically, deleteChatOptimistically } = useChatContext()

  const startEditing = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId)
    setEditTitle(currentTitle)
  }

  const cancelEditing = () => {
    setEditingChatId(null)
    setEditTitle("")
  }

  const saveEditing = async (chatId: string) => {
    const currentChat = chats.find((c) => c._id === chatId)
    if (!currentChat) return

    const newTitle = editTitle.trim()
    if (!newTitle || newTitle === currentChat.title) {
      cancelEditing()
      return
    }
    
    updateChatOptimistically(chatId, { title: newTitle })
    setEditingChatId(null)
    
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      })
      if (!res.ok) throw new Error()
      toast.success("Chat renamed")
    } catch {
      toast.error("Failed to rename chat")
      updateChatOptimistically(chatId, { title: currentChat.title })
    }
  }

  const confirmDelete = async () => {
    if (!chatToDelete) return
    setIsDeleting(true)
    const chatId = chatToDelete

    deleteChatOptimistically(chatId)
    
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : pathname;
    if (currentPath === `/chat/${chatId}`) {
      router.push("/chat")
    }
    
    try {
      const res = await fetch(`/api/chats/${chatId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Chat deleted")
    } catch {
      toast.error("Failed to delete chat")
    } finally {
      setIsDeleting(false)
      setChatToDelete(null)
    }
  }

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
          onClick={() => {
            triggerNewChat();
            router.push('/chat');
          }}
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
                {isLoading && chats.length === 0 ? (
                  <div className="px-2 py-2 text-xs text-zinc-500">Loading chats...</div>
                ) : chats.length === 0 ? (
                  <div className="px-2 py-2 text-xs text-zinc-500">No chats yet.</div>
                ) : (
                  chats.map((chat) => (
                    <div key={chat._id} className="group relative flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-200/50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-colors">
                      {editingChatId === chat._id ? (
                        <div className="flex items-center w-full gap-1 pr-1">
                          <input 
                            autoFocus
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") saveEditing(chat._id)
                              if (e.key === "Escape") cancelEditing()
                            }}
                            className="flex-1 min-w-0 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md px-2 py-1 text-[13px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                          />
                          <button onClick={() => saveEditing(chat._id)} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors" title="Save">
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={cancelEditing} className="p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors" title="Cancel">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div 
                            className="flex-1 truncate pr-6 block" 
                            onDoubleClick={() => startEditing(chat._id, chat.title)}
                          >
                            <Link
                              href={`/chat/${chat._id}`}
                              className="truncate block"
                              title={chat.title}
                            >
                              {chat.title}
                            </Link>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="absolute right-1 h-6 w-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity focus:opacity-100" />}>
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl">
                              <DropdownMenuItem className="cursor-pointer" onClick={() => startEditing(chat._id, chat.title)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-500 dark:focus:text-red-500" onClick={() => setChatToDelete(chat._id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      )}
                    </div>
                  ))
                )}
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

      {/* Delete Dialog */}
      <Dialog open={!!chatToDelete} onOpenChange={(open) => !open && !isDeleting && setChatToDelete(null)}>
        <DialogContent className="sm:max-w-[400px] w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-zinc-600 dark:text-zinc-400 text-sm">
            Are you sure you want to delete this chat? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChatToDelete(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
