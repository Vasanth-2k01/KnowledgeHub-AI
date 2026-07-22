import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/workspace/sidebar"
import { Navbar } from "@/components/workspace/navbar"

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <Sidebar session={session} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar session={session} />
        <main className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-zinc-950 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
