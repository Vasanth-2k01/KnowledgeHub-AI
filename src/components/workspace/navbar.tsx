"use client"

import { Session } from "next-auth"
import { MobileSidebar } from "./mobile-sidebar"

export function Navbar({ session }: { session: Session | null }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between bg-white/80 dark:bg-zinc-950/80 px-4 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 md:hidden">
      <div className="flex items-center gap-3">
        <MobileSidebar session={session} />
        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">KnowledgeHub AI</span>
      </div>
    </header>
  )
}
