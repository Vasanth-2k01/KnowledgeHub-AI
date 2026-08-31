"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ExternalLink, Copy, Link2Off, Link2, Trash2, Loader2, Search, Share2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface SharedChat {
  _id: string
  title: string
  isShared: boolean
  shareToken: string
  sharedAt: string
}

export default function SharedChatsPage() {
  const [chats, setChats] = useState<SharedChat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "disabled">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [chatToDelete, setChatToDelete] = useState<SharedChat | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchSharedChats()
  }, [])

  const fetchSharedChats = async () => {
    try {
      const res = await fetch("/api/shared/my")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setChats(data)
    } catch (err) {
      toast.error("Failed to load shared chats")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async (token: string) => {
    const origin = window.location.origin
    await navigator.clipboard.writeText(`${origin}/shared/${token}`)
    toast.success("Link copied to clipboard!")
  }

  const handleToggleShare = async (chatId: string, currentStatus: boolean) => {
    try {
      setChats(prev => prev.map(c => c._id === chatId ? { ...c, isShared: !currentStatus } : c))
      
      const res = await fetch(`/api/chats/${chatId}/share`, {
        method: currentStatus ? "DELETE" : "POST"
      })
      
      if (!res.ok) throw new Error("Failed to update share status")
      
      toast.success(currentStatus ? "Link disabled" : "Link re-enabled")
      fetchSharedChats() // Refresh to get correct token if re-enabled
    } catch (error) {
      toast.error("Failed to update status")
      setChats(prev => prev.map(c => c._id === chatId ? { ...c, isShared: currentStatus } : c))
    }
  }

  const confirmDeleteShare = async () => {
    if (!chatToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/shared/my?id=${chatToDelete._id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      
      setChats(prev => prev.filter(c => c._id !== chatToDelete._id))
      toast.success("Share link deleted")
      setChatToDelete(null)
    } catch (error) {
      toast.error("Failed to delete link")
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredChats = chats.filter(chat => {
    if (filter === "active" && !chat.isShared) return false
    if (filter === "disabled" && chat.isShared) return false
    if (searchQuery && !chat.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const activeCount = chats.filter(c => c.isShared).length
  const disabledCount = chats.filter(c => !c.isShared).length

  return (
    <div className="flex flex-1 overflow-y-auto flex-col p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-500 max-w-7xl mx-auto w-full">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Shared Links
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage public access to your conversations.
          </p>
        </div>
      </div>

      {/* Main Content Scroll Area */}
      <div className="flex flex-col">
        
        {/* Toolbar Area */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search shared chats..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 shadow-sm transition-all"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === "all" 
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' 
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-transparent'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === "active" 
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' 
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-transparent'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setFilter("disabled")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === "disabled" 
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' 
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-transparent'
                }`}
              >
                Disabled ({disabledCount})
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 h-[180px]">
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="h-5 w-3/4 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
                    <div className="h-5 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse shrink-0"></div>
                  </div>
                  <div className="mt-auto pt-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-12 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
                      <div className="h-3 w-20 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-10 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
                      <div className="h-3 w-24 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-b-2xl h-11">
                  <div className="h-full border-r border-zinc-100 dark:border-zinc-800/80 bg-zinc-100 dark:bg-zinc-800/50 animate-pulse rounded-bl-2xl"></div>
                  <div className="h-full border-r border-zinc-100 dark:border-zinc-800/80 bg-zinc-100 dark:bg-zinc-800/50 animate-pulse"></div>
                  <div className="h-full bg-zinc-100 dark:bg-zinc-800/50 animate-pulse rounded-br-2xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800">
            <div className="h-20 w-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
              <Share2 className="h-10 w-10 text-zinc-400" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">No links found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm">
              You haven't shared any conversations yet. Click the Share button in a chat to generate a public link.
            </p>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
             <p className="text-zinc-500 dark:text-zinc-400">No shared chats match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChats.map(chat => (
              <div 
                key={chat._id} 
                className={`group flex flex-col rounded-[20px] border transition-all ${
                  chat.isShared 
                    ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700" 
                    : "bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200/50 dark:border-zinc-800/50 border-dashed"
                }`}
              >
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 shrink-0">
                      <Share2 className="h-5 w-5" />
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100" />}>
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        {chat.isShared ? (
                          <>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleCopyLink(chat.shareToken)}>
                              <Copy className="h-4 w-4 mr-2 text-zinc-500" /> Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(`/shared/${chat.shareToken}`, '_blank')}>
                              <ExternalLink className="h-4 w-4 mr-2 text-zinc-500" /> View Public Page
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-amber-600 dark:text-amber-500" onClick={() => handleToggleShare(chat._id, true)}>
                              <Link2Off className="h-4 w-4 mr-2" /> Disable Link
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem className="cursor-pointer text-emerald-600 dark:text-emerald-500" onClick={() => handleToggleShare(chat._id, false)}>
                            <Link2 className="h-4 w-4 mr-2" /> Re-enable Link
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-900/30 dark:focus:text-red-400" onClick={() => setChatToDelete(chat)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="mt-4 flex-1 flex flex-col">
                    <h3 className={`font-semibold text-[15px] leading-tight line-clamp-2 ${chat.isShared ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-500 dark:text-zinc-400"}`} title={chat.title}>
                      {chat.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex flex-col gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center justify-between">
                        <span>Shared:</span>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {new Date(chat.sharedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      {chat.isShared && (
                        <div className="flex items-center justify-between">
                          <span>URL:</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400 truncate max-w-[120px]" title={`/shared/${chat.shareToken}`}>
                            .../shared/{chat.shareToken.substring(0, 8)}...
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
                        <span className="text-[11px] font-medium text-zinc-500">Status</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border tracking-wider uppercase ${
                          chat.isShared ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700"
                        }`}>
                          {chat.isShared ? "Active" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!chatToDelete} onOpenChange={(open) => !open && !isDeleting && setChatToDelete(null)}>
        <DialogContent className="sm:max-w-[400px] w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Shared Link</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-zinc-500 space-y-3">
            <p>
              Are you sure you want to permanently delete the share link for <strong className="text-zinc-900 dark:text-zinc-50">{chatToDelete?.title}</strong>?
            </p>
            <p>
              The chat will remain in your history, but the public link will be permanently disabled and cannot be recovered.
            </p>
            <p className="text-red-600 dark:text-red-400 font-medium">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChatToDelete(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteShare} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
