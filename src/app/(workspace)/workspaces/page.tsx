import { Briefcase, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WorkspacesPage() {
  return (
    <div className="flex h-full flex-col p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-500 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Workspaces
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage your team environments and isolated knowledge bases.
        </p>
      </div>
      
      <div className="relative overflow-hidden rounded-[24px] border border-zinc-200 bg-white/50 dark:border-zinc-800/80 dark:bg-zinc-900/30 p-12 shadow-sm flex flex-col items-center justify-center min-h-[450px] text-center backdrop-blur-xl">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]"></div>
        
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-900/10 shadow-inner mb-6 border border-emerald-200/50 dark:border-emerald-800/50">
          <Briefcase className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">
          Workspaces Module Coming Soon
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 text-[15px] leading-relaxed">
          We're building powerful team collaboration features. Soon you'll be able to create isolated workspaces, invite team members, and manage role-based access.
        </p>
        
        <Link href="/documents">
          <Button className="h-11 rounded-full px-6 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-sm transition-all active:scale-95 group">
            Return to Documents 
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
