import { UserCircle, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  return (
    <div className="flex h-full flex-col p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-500 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Profile
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Manage your account preferences and personal details.
        </p>
      </div>
      
      <div className="relative overflow-hidden rounded-[24px] border border-zinc-200 bg-white/50 dark:border-zinc-800/80 dark:bg-zinc-900/30 p-12 shadow-sm flex flex-col items-center justify-center min-h-[450px] text-center backdrop-blur-xl">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]"></div>
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px]"></div>
        
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/10 shadow-inner mb-6 border border-blue-200/50 dark:border-blue-800/50">
          <UserCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">
          Profile Module Coming Soon
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 text-[15px] leading-relaxed">
          We're currently building a comprehensive profile management system. Soon you'll be able to customize your avatar, manage API keys, and configure notification preferences.
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
