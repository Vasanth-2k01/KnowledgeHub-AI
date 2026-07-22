"use client"

import { useState, useEffect } from "react"
import { Menu, Plus, MessageSquare, FileText, Share2, Briefcase, Settings, Command, ChevronDown, ChevronRight, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { UserDropdown } from "./user-dropdown"
import { Session } from "next-auth"

const bottomRoutes = [
  {
    label: "Documents",
    icon: FileText,
    href: "/documents",
  },
]

const mockChats = [
  { id: "1", title: "React Authentication" },
  { id: "2", title: "RAG Overview" },
  { id: "3", title: "MongoDB Notes" },
  { id: "4", title: "Next.js App Router" },
]

export function MobileSidebar({ session }: { session: Session | null }) {
  const [open, setOpen] = useState(false)
  const [chatsExpanded, setChatsExpanded] = useState(true)
  const pathname = usePathname()

  // Close the sheet when the route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 flex flex-col bg-zinc-50 dark:bg-zinc-950 border-r-zinc-200 dark:border-r-zinc-800">
        
        {/* Header */}
        <SheetHeader className="h-16 px-4 flex flex-row items-center justify-start m-0">
          <SheetTitle className="flex items-center gap-2 m-0 p-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
              <Command className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg text-zinc-900 dark:text-zinc-50">
              KnowledgeHub AI
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* New Chat */}
        <div className="px-3 py-2">
          <Button 
            className="w-full justify-start rounded-xl shadow-sm bg-blue-600 hover:bg-blue-700 text-white transition-all h-10"
            onClick={() => { setOpen(false); window.location.href = '/chat' }}
          >
            <Plus className="h-4 w-4 shrink-0 mr-2" />
            <span>New Chat</span>
          </Button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
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
                      onClick={() => setOpen(false)}
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
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:text-red-500 dark:focus:text-red-400 dark:focus:bg-red-950/50 group/delete">
                          <Trash className="mr-2 h-4 w-4 text-red-600 dark:text-red-500 group-focus/delete:text-red-700 dark:group-focus/delete:text-red-400" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-3 space-y-1 border-t border-zinc-200 dark:border-zinc-800">
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
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50"
                )}
              >
                <route.icon className="h-5 w-5 shrink-0" />
                <span>{route.label}</span>
              </Link>
            )
          })}
        </div>

        {/* User Footer */}
        {session && (
          <div className="p-3 pt-0">
             <UserDropdown user={session.user} />
          </div>
        )}

      </SheetContent>
    </Sheet>
  )
}
