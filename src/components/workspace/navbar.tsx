"use client"

import { Session } from "next-auth"
import { MobileSidebar } from "./mobile-sidebar"
import { useParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function Navbar({ session }: { session: Session | null }) {
  const params = useParams()
  const chatId = params?.chatId as string | undefined
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    if (!chatId) return;
    
    setIsSharing(true);
    try {
      const response = await fetch(`/api/chats/${chatId}/share`, {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create share link");
      }
      
      await navigator.clipboard.writeText(data.shareUrl);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to share chat");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between bg-white/80 dark:bg-zinc-950/80 px-4 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 md:hidden">
      <div className="flex items-center gap-3">
        <MobileSidebar session={session} />
        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">KnowledgeHub AI</span>
      </div>
      
      {chatId && (
        <Button 
          size="sm" 
          onClick={handleShare}
          disabled={isSharing}
          className="h-8 w-8 rounded-full p-0 flex items-center justify-center shadow-sm bg-blue-600 hover:bg-blue-700 text-white shrink-0"
        >
          {isSharing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Share2 className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">Share</span>
        </Button>
      )}
    </header>
  )
}
