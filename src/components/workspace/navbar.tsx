"use client"

import { Session } from "next-auth"
import { MobileSidebar } from "./mobile-sidebar"

export function Navbar({ session }: { session: Session | null }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center bg-white/80 dark:bg-zinc-950/80 px-4 backdrop-blur-xl md:hidden">
      <MobileSidebar session={session} />
    </header>
  )
}
