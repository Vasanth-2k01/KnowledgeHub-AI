import { Settings, SlidersHorizontal, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-500 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Settings
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Configure application preferences and system integrations.
        </p>
      </div>
      
      <div className="relative overflow-hidden rounded-[24px] border border-zinc-200 bg-white/50 dark:border-zinc-800/80 dark:bg-zinc-900/30 p-12 shadow-sm flex flex-col items-center justify-center min-h-[450px] text-center backdrop-blur-xl">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-zinc-500/5 blur-[100px]"></div>
        
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-800 dark:to-zinc-900 shadow-inner mb-6 border border-zinc-200 dark:border-zinc-700">
          <Settings className="h-10 w-10 text-zinc-600 dark:text-zinc-400 animate-[spin_10s_linear_infinite]" />
          <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">
          Settings Module Coming Soon
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 text-[15px] leading-relaxed">
          We're finalizing the advanced configuration options. Soon you'll be able to connect external integrations, manage billing, and adjust model parameters.
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
